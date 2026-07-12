# BACKLOG — AKCE S. & W. Automobily

Jeden zdroj pravdy pro stav vývoje. Aktuální verze aplikace: **v0.29**.
Poslední aktualizace: 2026-07-12.

Legenda: ✅ hotovo a ověřeno · 🔵 rozpracováno · ⬜ v plánu · 💡 nápad k promyšlení

---

## 🎯 Další krok (tady pokračujeme)

**Migrace na Firebase je kompletní (F0–F4).** Aplikace běží na `DATA_BACKEND="firebase"`, čtení i zápis proti Firestore ověřeny živým scénářem. Rollback páka (`"local"`) zůstává funkční.

Před dalším rozvojem: **checkpoint projektu** (git tag / záloha stavu). Poté k rozhodnutí (nic z toho zatím neimplementovat bez schválení):

1. ⬜ **Firestore security rules** — teď zapisuje klient naostro, takže rules jsou první bezpečnostní priorita před širším sdílením. Ověřit, že mimo appku nikdo nemůže zapisovat/číst.
2. ⬜ **F10 — identita na Firebase Auth** — `assignedTo`/role z dnešních seed id na reálné Firebase UID + Auth; vypnout `USERS_SEED` (zůstane jako dev fallback). Podmínka skutečného víceuživatelského provozu.
3. ⬜ **Zvážit úklid F4 diagnostiky** — `f4DryRun`/`f4Shadow` jsou hotové nástroje; rozhodnout, zda ponechat jako regresní (jako `f3Parity`), nebo po stabilizaci odstranit.

---

## ✅ Hotovo (v0.29)

### Migrace na Firebase — WRITE path (F4)
- ✅ **F4a — dry-run diff** — rizikové jádro diffu ve sdílené `computeDiffOps()` (ostrý `diffById` i `fb.dryRunWrite()`). Harness `window.f4DryRun()` — 7/7 OK, bez zápisu.
- ✅ **F4b — shadow WRITE** — `writeCampaign` parametrizován na root; `fb.shadowWrite/readShadowCampaigns/shadowClear` do izolované `events_shadow`. Harness `window.f4Shadow()` — round-trip parita OK, shadow uklizen, provozní `events` netknutý.
- ✅ **F4c — přepnutí** — Firebase větev zapojena do `useCampaignStore` (Commit 1, gated), `DATA_BACKEND="firebase"` (Commit 2). Dvě blokace zápisu opraveny na hranici Firestore: `ignoreUndefinedProperties:true` (undefined) + `modelCounts`/`topInterests` na pole objektů (nested arrays). Ověřeno kompletním scénářem: nová akce, persistence, rezervace, uzavření + snapshot, report ze snapshotu, `f3Parity ok:true` (4/4), žádná FirebaseError.

### Migrace na Firebase — READ path (shadow)
- ✅ **F0** — `DATA_BACKEND` flag, `compose()` (jediný zdroj skládání objektu akce), `SCHEMA_VERSION`, `firebaseStore.js` s vyplněným configem.
- ✅ **F1** — kolekce `users` ve Firestore, hook `useUsers()`, všichni konzumenti přepnuti (fallback = seed). Realtime ověřen.
- ✅ **F2** — 3 demo akce nahrány do `events/{id}` + podkolekce `participants`/`leads`/`reservations`.
- ✅ **F3** — shadow READ parita. Deterministická fixture (stabilní ID akcí i podkolekcí), `window.f3Parity()` vrací `ok:true` i po čistém reloadu.
- ✅ **Úklid F2/F3 lešení** — odstraněn jednorázový `window.f2SeedCampaigns` (F2 seed helper), průběžný F3 shadow subscribe i logy do konzole a komentáře „po nahrání SMAZAT". Ponecháno: `window.f3Parity` (regresní nástroj), `f3Compare`/`f3norm`/`f3normCampaign`, `window.__f3`, samostatný `window.fb` (diagnostika F4), deterministický seed a celý `firebaseStore.js`. `DATA_BACKEND` beze změny (`"local"`), WRITE path nezapnutý.

### Oprávnění a workflow
- ✅ **Auto-přiřazení leadu** prodejci, který zákazníka pozval (dle pozvavšího účastníka, jinak přidávající prodejce; host z ulice / hosteska = prázdné, editovatelné).
- ✅ **CRM profil účastníka** — prodejce vidí kategorii, důvod pozvání i historii vozidel u všech; edituje jen u účastníků, které založil nebo má přiřazené (`canEditPart`).
- ✅ **Omezení stavů pro prodejce** — prodejce smí nastavit jen Zrušil / Nemoc / Dovolená / Nedostavil se; nemůže schválit, nastavit Potvrzen ani obejít schvalovací workflow (`SALES_SETTABLE_STATES` + pojistka v `setState`).

### UI / provoz
- ✅ **„O aplikaci"** — samostatné okno (odkaz `· O aplikaci` vedle verze); changelog zůstal čistý.
- ✅ **Oprava spouštění** — kořenový `package.json` má `start`/`build`, které delegují do `akce-sw`, takže `npm start` funguje z jakékoli složky.

---

## ⬜ V plánu (backlog)

### Technika / migrace
- ⬜ **Firestore security rules** — projít a zabezpečit před širším sdílením (teď je config v klientovi a klient zapisuje naostro; ověřit, že nikdo nemůže zapisovat/číst mimo appku). **Viz Další krok — priorita.**
- ⬜ **F10 — identita na Firebase Auth** — `assignedTo`/role na Firebase UID + Auth; vypnout `USERS_SEED`. Viz Další krok.
- ⬜ **`__BUILD__` placeholder** — u verze svítí `build __BUILD__`; v dev režimu se nevyplní. Buď doplnit datum/verzi, nebo v dev skrýt. Kosmetika.

### Oprávnění — k promyšlení při pilotu
- 💡 **Viditelnost polí** — VYŘEŠENO (v0.29): prodejce vidí i edituje CRM u svých; skrytí zamítnuto (rozbilo by schvalování). Ponecháno zde jako záznam rozhodnutí.
- 💡 **Workflow stavů (detail)** — ověřit při pilotu kompletní matici prodejce vs. schvalovatel vs. systém vs. zákazník (viz `BACKLOG-opravneni-stavu.md`). Zatím neměnit.

### Demo / testování
- ⬜ **Test s kolegy** — Tereza + Pavel „Datan" Minářík (IT). Jedna verze (`DATA_BACKEND="local"`, zápis vypnutý) je bezpečné pískoviště — nic nezapisuje do Firestore. Nepřepínat na `"firebase"`, dokud není F4 hotové.
- ⬜ **Testování na iPadu** — ověřit UI a ovládání na tabletu (akce se odehrávají na místě, hosteska/prodejce často na iPadu). Zkontrolovat plovoucí okna, mřížku jízd, přidávání zákazníka.

### Compliance
- ⬜ **GDPR evidence** — evidence souhlasů a zpracování osobních údajů účastníků (jméno, e-mail, telefon). Kde se souhlas získává, jak dlouho se drží, jak se maže.

### Funkce
- ⬜ **Revize workflow pozvánek** — projít celý tok (čeká → schváleno → odesláno → potvrzeno), sjednotit a odstranit nejasnosti. Souvisí s workflow stavů níže.
- ⬜ **Rozesílání kampaní** — reálné odesílání pozvánek/kampaní (dnes mock EmailJS). Napojení, šablony, hromadné i jednotlivé.
- 💡 **Vícedenní akce** — některé akce mohou probíhat více dnů (např. kola, golf nebo VIP program s ubytováním). Účastník je přihlášen na **celou akci** — *nejde* o výběr dne návštěvy zákazníkem. Není priorita ani součást F4, jen k budoucímu prověření. Prověřit: (a) zda bude stačit datum **OD–DO**, (b) zda současný model už více dnů částečně podporuje.

---

## 💡 Nápady od Stanislava (z jednoho dne)
Rychlý zápis, průběžně roztřídit výše:

- ⬜ GDPR → viz *Compliance*
- ⬜ iPad testování → viz *Demo / testování*
- ⬜ Workflow pozvánek → viz *Funkce*
- ✅ Automatické přiřazení prodejce → **hotovo v0.29**
- ✅ CRM historie vozidel → **hotovo** (prodejce vidí/edituje u svých; viz Oprávnění)
- ⬜ Rozesílání kampaní → viz *Funkce*

---

## 🔒 Invarianty (platí, dokud neřekneme jinak)
- `DATA_BACKEND = "firebase"` — appka běží na Firestore datech (F4 dokončeno). Rollback páka = flip zpět na `"local"`.
- WRITE path do Firestore **aktivní a ověřený** (F4). Do nasazení security rules + F10 běží jednouživatelsky.
- Komponenty, `compose()` a F3 logiku neměnit bez důvodu.
- Aplikace žije v podsložce **`akce-sw/`** (Create React App).

---

## 🛠️ Provozní tahák
- **Spuštění (kdykoli, z jakékoli složky):**
  `cd /workspaces/Akce-a-marketing/akce-sw && npm start` → počkat na `Compiled successfully` → terminál nechat běžet.
- **Zlaté pravidlo:** terminál s `npm start` = motor, nesahat na něj. Na příkazy použít druhý terminál.
- **Změna kódu:** upravit soubor v editoru → uložit (Ctrl+S) → appka se sama obnoví. Žádný restart.
- **Otevření v prohlížeči:** přes záložku PORTS → zeměkoule u portu 3000 (ne starý uložený odkaz — po restartu se mění).
- **Nasazení kolegům:** `git push` → Vercel (projekt s Root Directory = `akce-sw`).
