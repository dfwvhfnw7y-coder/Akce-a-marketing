# Návrh F4c — přepnutí DATA_BACKEND na "firebase"

Stav: **návrh k rozhodnutí. Nic se zatím nepřepíná.** WRITE path do produkčních dat je stále neaktivní.

## Východisko (co je dnes)

`useCampaignStore()` (CampaignApp6.jsx ~1057) **vždy** vrací lokální seed. Firebase větev pro kampaně
zatím není zapojená — `DATA_BACKEND` u kampaní nic nepřepíná. Zápisová vrstva (`fb.updateCampaign`,
`writeCampaign`, `diffById`) je hotová a ověřená přes F4a (dry-run 7/7) a F4b (shadow round-trip parita OK),
ale volá se jen z diagnostiky, ne z provozu.

Všechny mutace v aplikaci jdou jen dvěma kanály:
- úpravy: komponenta → `onUpdate(fn)` → `store.updateCampaign(id, fn)`,
- založení akce: `onCreate(c)` → `store.addCampaign(c)`.

Proto F4c stačí zapojit do těchto dvou funkcí + realtime čtení. Žádná komponenta se nemění.

## Rozdělení na dva commity (klíč k auditovatelnosti a vratnosti)

**Commit 1 — zapojení Firebase větve (flag ZŮSTÁVÁ "local").**
Přidá gated větev do `useCampaignStore`. Protože `DATA_BACKEND` je pořád `"local"`,
chování aplikace se **nezmění vůbec** — kód je jen připravený. Bezpečně nasaditelné a review-ovatelné
bez jakéhokoli dopadu na provoz.

**Commit 2 — aktivace (jednořádkový flip).**
Změna `DATA_BACKEND = "local"` → `"firebase"`. Toto je ostrá aktivace. Samostatný commit,
takže rollback = `git revert` toho jednoho commitu, nebo ruční přepis jednoho řádku zpět.

## Přesný seznam změn

Mění se **jediný soubor: `akce-sw/src/CampaignApp6.jsx`.** `firebaseStore.js` se nemění (je hotový).

### Commit 1 — `useCampaignStore` (cca +8 řádků, gated)

```js
function useCampaignStore() {
  const [campaigns, setCampaigns] = useState(seed);

  // FIREBASE backend: realtime subscribe → compose → stav. Local → beze změny.
  useEffect(() => {
    if (DATA_BACKEND !== "firebase") return;
    return fb.subscribeCampaigns((remote) => setCampaigns(remote));
  }, []);

  const loadCampaigns      = () => campaigns;
  const subscribeCampaigns = (cb) => { cb(campaigns); return () => {}; };

  const updateCampaign = (id, fn) => {
    if (DATA_BACKEND === "firebase") { fb.updateCampaign(id, fn).catch(console.error); return; }
    setCampaigns((cs) => cs.map((c) => c.id === id ? fn(c) : c));
  };
  const addCampaign = (c) => {
    if (DATA_BACKEND === "firebase") { fb.addCampaign({ schemaVersion: SCHEMA_VERSION, ...c }).catch(console.error); return; }
    setCampaigns((cs) => [...cs, { schemaVersion: SCHEMA_VERSION, ...c }]);
  };

  return { campaigns, loadCampaigns, subscribeCampaigns, updateCampaign, addCampaign, compose };
}
```

Lokální větev je bajt po bajtu dnešní kód. Firebase větev je čistě přírůstková a zabraná flagem.

### Commit 2 — flag (1 řádek)

```js
const DATA_BACKEND = "firebase";   // ~řádek 1024
```

## Co se NEmění

`firebaseStore.js` · `compose()` · kontrakt `onUpdate(fn)` · tvar `c` · žádná komponenta ·
`USERS_BACKEND` (už "firebase", nezávislý) · diagnostika `f3Parity` / `f4DryRun` / `f4Shadow` (ponechány) ·
`window.fb` · deterministický seed (zůstává jako lokální fallback).

## Rollback plán (vícevrstvý)

1. **Jednořádkový flip zpět** — `DATA_BACKEND = "local"` → redeploy. Protože je Firebase větev gated
   a přírůstková, návrat obnoví přesně dnešní chování (seed, in-memory). Hlavní páka.
2. **`git revert` commitu 2** — vrátí flag automaticky, commit 1 (zapojení) může zůstat (je neaktivní).
3. **`git revert` obou commitů** — úplný návrat do stavu před F4c.
4. **Data ve Firestore** zůstávají; přepnutím zpět na local se jen ignorují. Seed je nedotčený.

Doporučení: **před commitem 2 udělat Firestore export** (`gcloud firestore export`) jako zálohu
produkční kolekce `events`, aby byl návrat dat rychlý i kdyby došlo k nechtěnému zápisu.

## Známé změny chování po přepnutí (k vědomí)

- **Latence zápisu:** po `updateCampaign` se UI aktualizuje až po návratu `onSnapshot` (jednotky ms–desetiny s),
  ne synchronně jako u local. Pro jednouživatelský pilot v pořádku. Pokud bude vadit, lze doplnit optimistický
  lokální update — mimo rozsah F4c.
- **Security rules:** jakmile zapisuje klient, jsou relevantní Firestore security rules (backlog).
  Pro testovací projekt a jednouživatelský pilot OK; před širším sdílením rules dořešit.
- **Souběh (multi-user):** transakce na slotu rezervací (F8) je až pozdější krok. Pilot běží jednouživatelsky.

## Ověřovací scénář po přepnutí (commit 2)

1. **Načtení:** appka po startu ukáže 3 akce **z Firestore** (ne seed). Dashboard = 3 akce.
2. **Zápis úpravy:** změň stav účastníka / přidej lead → **reload stránky** → změna přetrvala (dokazuje WRITE path).
3. **Firestore konzole:** ověř, že se dokument v `events/{id}` (resp. podkolekci) opravdu změnil.
4. **Založení akce:** vytvoř akci → objeví se po snapshotu → reload → přetrvala.
5. **Rezervace:** zarezervuj/přesuň jízdu → reload → přetrvalo.
6. **Uzavření akce:** uzavři akci → snapshot zapsán 1× → reload → report se čte ze snapshotu, vypadá stejně.
7. **Parita:** `await window.f3Parity()` → `ok:true` (obě strany teď firebase).
8. **Rollback test:** flip zpět na `"local"` → appka se vrátí na seed, žádné chyby v konzoli.

Kritérium aktivace: commit 1 nasazený a bez efektu na provoz; záloha Firestore hotová; teprve pak commit 2.

---

**Čeká se na rozhodnutí před ostrou aktivací. Přepnutí (commit 2) neprovádět bez potvrzení.**
