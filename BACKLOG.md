# BACKLOG — AKCE S. & W. Automobily

Jeden zdroj pravdy pro stav vývoje. Aktuální verze aplikace: **v0.29**.
Poslední aktualizace: 2026-07-11.

Legenda: ✅ hotovo a ověřeno · 🔵 rozpracováno · ⬜ v plánu · 💡 nápad k promyšlení

---

## 🎯 Další krok (tady pokračujeme)

1. **Úklid F2 seed kódu** — odstranit jednorázový `window.f2SeedCampaigns` a komentář „po nahrání SMAZAT". `window.f3Parity` doporučeno ponechat jako regresní nástroj.
2. **F4 — WRITE path** — začít plánovat zápisovou cestu do Firestore. `DATA_BACKEND` zůstává `"local"`, dokud nebude parita zápisu ověřená (stejný postup jako u F3: shadow → parita → teprve pak přepnout).

---

## ✅ Hotovo (v0.29)

### Migrace na Firebase (shadow, READ)
- ✅ **F0** — `DATA_BACKEND` flag, `compose()` (jediný zdroj skládání objektu akce), `SCHEMA_VERSION`, `firebaseStore.js` s vyplněným configem.
- ✅ **F1** — kolekce `users` ve Firestore, hook `useUsers()`, všichni konzumenti přepnuti (fallback = seed). Realtime ověřen.
- ✅ **F2** — 3 demo akce nahrány do `events/{id}` + podkolekce `participants`/`leads`/`reservations`.
- ✅ **F3** — shadow READ parita. Deterministická fixture (stabilní ID akcí i podkolekcí), `window.f3Parity()` vrací `ok:true` i po čistém reloadu.

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
- ⬜ **F4 — WRITE path** (viz Další krok).
- ⬜ **Úklid F2 seedu** (viz Další krok).
- ⬜ **Firestore security rules** — projít a zabezpečit před širším sdílením (teď je config v klientovi; ověřit, že nikdo nemůže zapisovat mimo appku).
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
- `DATA_BACKEND = "local"` — appka běží na lokálních demo datech.
- WRITE path do Firestore **vypnutý**.
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
