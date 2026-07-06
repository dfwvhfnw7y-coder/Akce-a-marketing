/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  Plus, Trash2, Flag, ArrowLeft, AlertTriangle, ShieldCheck, EyeOff, UserPlus, X,
  TrendingUp, Layers, Lock, Type, AlignLeft, CalendarDays, AtSign, Phone, Hash, List,
  Check, Settings, Download, PieChart as PieIcon, ListOrdered, Clock, GripVertical,
  Send, Bell, UserCheck, HelpCircle, Users, Wallet, BarChart3, FolderOpen, Mail, Printer,
  ClipboardList, MessageSquare, Zap, Mail as MailIcon, Image, Link, AlignLeft as AlignLeftIcon, Bold, Italic, Underline as UnderlineIcon, Minus,
  UserCog, CalendarCheck, Video, ExternalLink, Edit2, Filter
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const APP_VERSION = "0.14";
const APP_BUILD = "2026-07-06 21:46";

/* ── Changelog / historie verzí ──
   Novou verzi přidávej NAHORU. items = pole řetězců. */
const CHANGELOG = [
  {
    version: "0.14",
    date: "6. 7. 2026",
    title: "Testovací jízdy — potvrzené jízdy jsou nedotknutelné",
    items: [
      "🛡️ Potvrzená jízda = smlouva. Zákazník, který potvrdil účast (stav „Potvrzen“), má svůj čas z pozvánky závazně — appka ho nikdy sama neposune. V mřížce má ✓.",
      "⛽ Blok se před potvrzenou jízdou zkrátí. Když dáš nabíjení na 30 min, ale za 20 min už jede potvrzený zákazník, blok se zkrátí a appka ti řekne, že se vůz nemusí stihnout. Musíš to vyřešit ručně (jiné auto / delší pauza jinde).",
      "⏰ Zpoždění vozu („jezdí od…“) potvrzené jízdy nepřepíše — ale hlasitě varuje. Když auto přijede pozdě a mělo v tu dobu jet potvrzeného zákazníka, appka to červeně označí („vůz nedojede!“) a vypíše, koho se to týká. Rozhodnutí je na tobě.",
      "🔢 Nové počítadlo kapacity: kolik jízd, kolik volných slotů, kolik sežraly bloky a zpoždění. Vidíš hned, jestli se ti ještě všichni vejdou — ideálně před odesláním pozvánek.",
      "🗑️ Uvolnění potvrzené jízdy si teď vyžádá potvrzení, ať ji omylem nesmažeš.",
    ],
  },
  {
    version: "0.13",
    date: "6. 7. 2026",
    title: "Testovací jízdy — opravy a doladění",
    items: [
      "🩹 Oprava: zákazníka teď jde přetáhnout na jiné auto ve stejném čase (appka omylem hlásila konflikt sama se sebou).",
      "⏱️ Bloky se zakládají klikem — vybereš typ a délku. Tažení přes sloty jsme zrušili (nefungovalo spolehlivě).",
      "☕ Pauza má nastavitelnou délku 10/20/30/60 min. Tankování 10/20/30, nabíjení 30/60/90 (nabíjení chvíli trvá 🙂).",
      "📋 Zákazník z ulice: přibylo pole na e-mail a volba „vytvořit lead“. Bez e-mailu se označí, že dotazník je potřeba předat osobně.",
      "❗ Čas na přípravu vozu nově i 30 min.",
      "🪟 Okno buňky se otevírá jako plovoucí (už ho neusekává posuvník tabulky) — u spodních řádků se rozbalí nahoru, všechna tlačítka jsou vidět.",
    ],
  },
  {
    version: "0.12",
    date: "3. 7. 2026",
    title: "Testovací jízdy — chytřejší mřížka",
    items: [
      "🚫 Zákazník nemůže testovat dvě auta ve stejný čas — appka to hlídá a nedovolí dvojí rezervaci ve stejném slotu.",
      "⛽ Bloky s typem: Tankování, Nabíjení, Oběd, Pauza (s ikonou).",
      "🖱️ Blok vybereš klikem na typ a zvolíš délku (natažení přes víc slotů řeší appka sama).",
      "⏰ „Jezdí od…\" u vozu — když auto dorazí pozdě (VIP zaspí, služební vůz), sloty před příjezdem se zašefrují a nejdou rezervovat.",
      "❗ Čas na přípravu vozu (0/5/10/15/30 min) mezi jízdami jako rezerva, kdyby se kolona zpozdila. Nastavuje se i při zakládání akce.",
      "🚗 Vozidla lze přidat rovnou při zakládání akce (v průvodci), další se dají doplnit v sekci Rezervace jízd.",
      "🧍 Zákazník „z ulice\" — i u pozvané akce lze přidat hosta, který přijde neohlášeně; označí se štítkem.",
      "⏱️ Délka jízdy nově i 45 a 90 min.",
      "🩹 Oprava zobrazení jména v přilepeném sloupci (už se neořezává první písmeno).",
    ],
  },
  {
    version: "0.11",
    date: "3. 7. 2026",
    title: "Napojení na skenovačku zkušebních jízd (náhled)",
    items: [
      "🔗 Nová sekce „Skenovačka zkušebních jízd\" v záložce Rezervace jízd — příprava dat pro mobilní appku, kterou hosteska používá na místě.",
      "🚗 Tlačítko „Připravit auta pro skenovačku\" — pošle vozový park akce (zatím jen náhled).",
      "👤 U pozvané akce tlačítko „Předvyplnit hosty\" — hosteska je pak nemusí ťukat ručně.",
      "🏷️ Přepínač „Pozvaní hosté / Veřejná akce\" u testovacích jízd — u veřejné se zákazníci naberou až na místě.",
      "🔒 Odkaz pro hostesku, který skenovačku nastaví přímo na danou akci — nespletena se starší akcí.",
      "⏳ Zatím jde o náhled; reálný zápis do sdílené databáze (Firebase) zapneme při propojení appek.",
    ],
  },
  {
    version: "0.10",
    date: "3. 7. 2026",
    title: "Testovací jízdy — rezervační mřížka",
    items: [
      "🚗 Nový modul „Rezervace jízd\" pro akce typu Testovací jízda — mřížka auta (řádky) × časové sloty (sloupce).",
      "🅿️ Vozový park akce — přidáš modely, které ten den jezdí (SPZ, poznámka), max 10 vozů.",
      "🕐 Časová osa slotů podle začátku, konce a délky jízdy (30 nebo 60 min).",
      "👤 Rezervace zákazníka klikem do buňky. Jeden zákazník může mít víc vozů — u jména se ukáže počet.",
      "🔧 Blokace slotu (pauza, tankování, servis) — auto v tu chvíli nejezdí.",
      "↔️ Přetahování rezervací mezi volnými buňkami, hlídání obsazenosti (dvě rezervace na jeden slot nejdou).",
      "👀 Prodejce a hosteska vidí plán jízd (kdo kdy jede) v režimu pouze pro čtení — upravovat ho může jen vedení.",
      "📤 Export mřížky do CSV.",
      "📨 Rezervace přes odkaz v pozvánce (zákazník si vybere vůz a čas sám) přijde s napojením na server.",
    ],
  },
  {
    version: "0.9",
    date: "3. 7. 2026",
    title: "Role, oprávnění a pozvánka",
    items: [
      "🔒 Prodejce a hosteska nově vidí jen záložky Účastníci a Leady. Materiály, rozpočet, report, pozvánka, tým, dotazník a startovní listina zůstávají jen vedení.",
      "📐 Oprava přetékajícího textu obsazenosti („X volných\") v seznamu akcí u prodejce.",
      "📝 Přidání zájmu o vůz u konkrétního hosta nově správně předvyplní jeho jméno a telefon.",
      "🏌️ Stabilnější přetahování hráčů mezi flighty ve startovní listině — přesun je spolehlivý napoprvé a pořadí se už nepřerovnává náhodně.",
      "✖ Nový blok „Odmítnout účast\" v pozvánce (proměnná {{odmitnout_odkaz}}) — zákazník dá vědět, že nedorazí, ať s ním nemusíme počítat.",
      "⛳ U golfu si zákazník na potvrzovací stránce sám vyplní HCP a zvolí zapůjčené vybavení — prodejce to za něj už nedělá (proměnná {{golf_odkaz}}).",
      "🔔 „Připomenout schvalovatelům\" — připomínka se posílá všem schvalovatelům dané akce, ne jen jednomu.",
    ],
  },
  {
    version: "0.8",
    date: "3. 7. 2026",
    title: "Potvrzení účasti, divize a přiřazování",
    items: [
      "✅ Nový blok „Potvrdit účast\" v pozvánce — zákazník jím potvrdí, že přijde (proměnná {{potvrdit_odkaz}}).",
      "🏢 Divize u zákazníka — automaticky se převezme z oddělení prodejce, který ho přidal. Zobrazuje se štítky u zákazníka i v panelu schvalování.",
      "👥 Prodejce může být ve více divizích (např. OA i TRAPO) — nastavíš v kartě uživatele.",
      "🎯 Přiřazení zákazníka prodejci — schvalovatel/vedení přiřadí zákazníka konkrétnímu prodejci (v seznamu účastníků i v panelu schvalování).",
      "🔒 Prodejce vidí všechny zákazníky, ale edituje jen ty, které založil nebo mu byli přiřazeni.",
      "🧹 Odstraněno napojení na Bizmachine.",
    ],
  },
  {
    version: "0.7",
    date: "3. 7. 2026",
    title: "Úprava akce, oddělení a pozvánka A4",
    items: [
      "✏️ Úprava akce nově jako plný průvodce kroky 1–5 — projdeš stejné kroky jako při zakládání, jen předvyplněné. Můžeš dodatečně upravit cokoli.",
      "🛡️ Ochrana dat: u akcí s přihlášenými zákazníky varování v krocích Pole a Vybavení; mazání pole s daty vyžaduje potvrzení. Zákazníci, rozpočet, tým i pozvánka zůstávají zachováni.",
      "🏢 Oddělení akce (OA, LKW, TRAPO, Servis, Marketing) — u akce lze určit, koho se týká. Prázdné = všechna.",
      "📢 „Stav prodejcům\" — výběr příjemců podle oddělení i konkrétních prodejců, s přehledem volných míst.",
      "📄 Pozvánka ve formátu A4 — náhled na stránce 210×297 mm a tlačítko Tisk / PDF (A4).",
      "🐛 Oprava: schvalovatelé se konečně zobrazují ve shrnutí akce (krok 5).",
    ],
  },
  {
    version: "0.6",
    date: "10. 6. 2026",
    title: "Schvalování, exporty a rozpočet",
    items: [
      "Kompaktní seznam účastníků s rozbalením po kliknutí.",
      "Vícenásobné přidávání členů týmu s ochranou proti duplicitám.",
      "Exporty účastníků a rozpočtu do Excelu / CSV.",
      "PDF export rozpočtu s koláčovým grafem.",
      "Filtrování podle oddělení v panelu schvalování.",
    ],
  },
];

/* ── tokeny ── */
const T = {
  fontMain:    "'CorporateS', 'DM Sans', sans-serif",
  fontDisplay: "'CorporateA', Georgia, serif",
  bg: "#0f1a14", panel: "#16241c", panel2: "#1c2e24", line: "#2a3f33",
  cream: "#f3efe3", creamDim: "#b9c2b3", green: "#1f5d3f", greenLite: "#2e7d54",
  brass: "#c9a24b", text: "#e8ece4", textDim: "#9aa896", danger: "#c46a5a",
  warn: "#d9a441", info: "#5a93c4", purple: "#9b72cf",
};
const uid  = () => Math.random().toString(36).slice(2, 9);
const czk  = (n) => n == null ? "—" : Number(n).toLocaleString("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });
const num  = (v) => parseFloat(String(v).replace(",", ".")) || 0;
const VAT  = [0, 10, 15, 21];
const vatKc   = (net, r) => Math.round(num(net) * r / 100);
const withVat = (net, r) => Math.round(num(net) * (1 + r / 100));

/* ── konstanty ── */
const FIELD_TYPES = [
  { id: "text",     label: "Text",        icon: Type },
  { id: "textarea", label: "Dlouhý text", icon: AlignLeft },
  { id: "date",     label: "Datum",       icon: CalendarDays },
  { id: "email",    label: "Email",       icon: AtSign },
  { id: "phone",    label: "Telefon",     icon: Phone },
  { id: "number",   label: "Číslo",       icon: Hash },
  { id: "select",   label: "Výběr",       icon: List },
];

/* ── Správa uživatelů ── */
const DEPARTMENTS = [
  "Prodej osobních a užit. vozů", "Prodej nákladních vozidel",
  "Servis", "Marketing", "Administrativa", "Management", "Jiné",
];

const ROLES_META = [
  { id: "admin",    label: "Admin",          desc: "Plný přístup, zakládání akcí, správa uživatelů" },
  { id: "approver", label: "Schvalovatel",   desc: "Schvalování zákazníků, odesílání pozvánek" },
  { id: "lite",     label: "LITE (prodejce)",desc: "Přidávání zákazníků, sledování obsazenosti" },
  { id: "hosteska", label: "Hosteska",       desc: "Zadávání zájmu o vůz na akci" },
];

const USERS_SEED = [
  { id: "u0", name: "Stanislav Admin",  email: "admin@sw-automobily.cz",      phone: "+420 602 100 000", role: "admin",    position: "Správce systému",            dept: "Management",              active: true,  approverId: null     },
  { id: "u1", name: "Miroslav Šperl",  email: "m.sperl@sw-automobily.cz",   phone: "+420 602 100 001", role: "approver", position: "Vedoucí prodeje osobních a užitkových vozů", active: true,  approverId: "mira"   },
  { id: "u2", name: "Tereza Machová",  email: "t.machova@sw-automobily.cz", phone: "+420 602 100 002", role: "approver", position: "Marketing manager",  active: true,  approverId: "tereza" },
  { id: "u3", name: "Matej Bugár",     email: "m.bugar@sw-automobily.cz",   phone: "+420 602 100 003", role: "approver", position: "Vedoucí prodeje nákladních vozidel", active: true,  approverId: "matej"  },
  { id: "u4", name: "Pavel Balog",     email: "p.balog@sw-automobily.cz",   phone: "+420 602 100 004", role: "approver", position: "Vedoucí prodeje osobních a užitkových vozů", active: true,  approverId: "pavel"  },
  { id: "u5", name: "Martin Dvořák",   email: "m.dvorak@sw-automobily.cz",  phone: "+420 602 100 005", role: "lite",     position: "Obchodní zástupce",  dept: "OA (osobní vozy)",        depts: ["OA", "TRAPO"], active: true,  approverId: null     },
  { id: "u6", name: "Jana Procházková",email: "j.prochazkova@sw-automobily.cz",phone:"+420 602 100 006",role:"lite",     position: "Obchodní zástupce",  dept: "Servis",                  depts: ["Servis"], active: true,  approverId: null     },
  { id: "u8", name: "Petr Kučera",     email: "p.kucera@sw-automobily.cz",  phone: "+420 602 100 008", role: "lite",     position: "Obchodní zástupce LKW", dept: "LKW (nákladní)",        depts: ["LKW"], active: true,  approverId: null     },
  { id: "u9", name: "Ondřej Novotný",  email: "o.novotny@sw-automobily.cz", phone: "+420 602 100 009", role: "lite",     position: "Obchodní zástupce TRAPO", dept: "TRAPO",                depts: ["TRAPO"], active: true,  approverId: null     },
  { id: "u7", name: "Lucie Hosteska",  email: "l.hosteska@sw-automobily.cz",phone: "+420 602 100 007", role: "hosteska", position: "Hosteska / asistentka",active: true, approverId: null    },
];
const initUsers = () => USERS_SEED;


const CRM_CATEGORIES = [
  "Velkoodběratel", "Obchodní partner", "Dodavatel", "Společník",
  "Majitel S&W", "Majitel jiné značky", "Privátní zákazník", "Potenciální zákazník", "Jiné",
];

const CURRENT_YEAR = new Date().getFullYear();

/* ── Skloňování příjmení v češtině ──
   Vrací { vokatM, vokatF } pro oslovení v e-mailech
   Vážený pane {vokatM} / Vážená paní {vokatF}
*/
function sklonujPrijmeni(prijmeni = "") {
  const p = prijmeni.trim();
  if (!p) return { vokatM: prijmeni, vokatF: prijmeni };

  const lower = p.toLowerCase();

  // Ženská příjmení (zakončení -ová, -á, -í)
  if (lower.endsWith("ová"))  return { vokatF: p,                          vokatM: p.slice(0,-3) + "ovi" };
  if (lower.endsWith("á"))    return { vokatF: p,                          vokatM: p };
  if (lower.endsWith("í"))    return { vokatF: p,                          vokatM: p };

  // Mužská příjmení
  // -ek, -ec → -ku, -ci
  if (lower.endsWith("ek"))   return { vokatM: p.slice(0,-2) + "ku",       vokatF: p + "ová" };
  if (lower.endsWith("ec"))   return { vokatM: p.slice(0,-2) + "ci",       vokatF: p + "ová" };
  // -el, -er, -en → -li, -ri, -ni (vzor muž)
  if (lower.endsWith("el"))   return { vokatM: p.slice(0,-2) + "li",       vokatF: p + "ová" };
  if (lower.endsWith("er"))   return { vokatM: p.slice(0,-2) + "ri",       vokatF: p + "ová" };
  if (lower.endsWith("en"))   return { vokatM: p.slice(0,-1) + "i",        vokatF: p + "ová" };
  // -ák, -ík, -ůk → -áku, -íku, -ůku
  if (lower.endsWith("ák"))   return { vokatM: p + "u",                    vokatF: p + "ová" };
  if (lower.endsWith("ík"))   return { vokatM: p + "u",                    vokatF: p + "ová" };
  // -č, -š, -ř, -ž → -i
  if (/[čšřž]$/i.test(p))     return { vokatM: p + "i",                    vokatF: p + "ová" };
  // -k, -h, -ch → -ku
  if (/[kh]$/i.test(p) || lower.endsWith("ch"))
                               return { vokatM: p + "u",                    vokatF: p + "ová" };
  // -c → -ci
  if (lower.endsWith("c"))    return { vokatM: p.slice(0,-1) + "ci",       vokatF: p + "ová" };
  // -l → -le (Procházkal → Procházkale)
  if (lower.endsWith("l"))    return { vokatM: p + "e",                    vokatF: p + "ová" };
  // -n, -m, -p, -b, -v, -f → -e (Novotný → Novotný = neměnné vzor Průcha)
  if (/[nmpbvft]$/i.test(p))  return { vokatM: p + "e",                    vokatF: p + "ová" };
  // Výchozí — přidáme -e
  return { vokatM: p + "e", vokatF: p };
}

function oslovenieM(jmeno = "", prijmeni = "") {
  const { vokatM } = sklonujPrijmeni(prijmeni);
  return `Vážený pane ${vokatM}`;
}
function oslovenieF(jmeno = "", prijmeni = "") {
  return `Vážená paní ${prijmeni}`;
}
function osloveni(jmeno = "", prijmeni = "", pohlavi = "m") {
  return pohlavi === "f" ? oslovenieF(jmeno, prijmeni) : oslovenieM(jmeno, prijmeni);
}

const STATES = {
  ceka:       { label: "Čeká na schválení", color: T.purple },
  schvaleno:  { label: "Schváleno — čeká na odeslání", color: T.greenLite },
  prihlasen:  { label: "Pozvánka odeslána", color: T.info },
  potvrzen:   { label: "Potvrzen",          color: T.greenLite },
  zrusil:     { label: "Zrušil",            color: T.danger },
  nemoc:      { label: "Nemoc",             color: T.warn },
  dovolena:   { label: "Dovolená",          color: T.warn },
  nedostavil: { label: "Nedostavil se",     color: "#8a5a8a" },
};
const STATE_ORDER  = Object.keys(STATES);
const OCCUPIES     = ["ceka", "prihlasen", "potvrzen"];
const STARTLIST_OK = ["potvrzen", "prihlasen"];

const APPROVERS = [
  { id: "mira",   name: "Miroslav Šperl",  role: "Vedoucí prodeje" },
  { id: "tereza", name: "Tereza Machová",  role: "Marketing" },
  { id: "matej",  name: "Matej Bugár",     role: "Schvalovatel" },
  { id: "pavel",  name: "Pavel Balog",     role: "Schvalovatel" },
];

// Oddělení, kterých se akce může týkat / komu rozeslat stav
const EVENT_DEPTS = [
  { id: "OA",        label: "OA (osobní vozy)" },
  { id: "LKW",       label: "LKW (nákladní)" },
  { id: "TRAPO",     label: "TRAPO" },
  { id: "Servis",    label: "Servis" },
  { id: "Marketing", label: "Marketing" },
];
const eventDeptLabel = (id) => EVENT_DEPTS.find((d) => d.id === id)?.label || id;
// divize zákazníka = divize toho, kdo ho přidal (nebo komu je přiřazen)
const partDivisions = (p) => {
  const ids = (p.addedBy?.depts && p.addedBy.depts.length) ? p.addedBy.depts : [];
  return ids;
};

const ACTIVITY_TYPES = [
  { id: "golf",      label: "⛳ Golf",            hasStartList: true,  hasReservation: false },
  { id: "degustace", label: "🍷 Degustace",       hasStartList: false, hasReservation: false },
  { id: "testjizda", label: "🚗 Testovací jízda", hasStartList: false, hasReservation: true  },
  { id: "jine",      label: "📋 Jiné",            hasStartList: false, hasReservation: false },
];

/* ── testovací jízdy: helpery pro časové sloty ── */
const DRIVE_INTERVALS = [30, 45, 60, 90];
const PREP_TIMES = [0, 5, 10, 15, 30]; // čas na přípravu vozu mezi jízdami (min)
// typy blokace vozu
// mins = nabízené délky bloku (klik = kolik po sobě jdoucích slotů se zablokuje)
const CAR_BLOCKS = [
  { id: "tankovani", label: "Tankování", icon: "⛽", mins: [10, 20, 30] },      // tankování je rychlé
  { id: "nabijeni",  label: "Nabíjení",  icon: "🔌", mins: [30, 60, 90] },      // nabíjení trvá dýl :-)
  { id: "obed",      label: "Oběd",      icon: "🍽️", mins: [30, 60] },
  { id: "pauza",     label: "Pauza",     icon: "☕", mins: [10, 20, 30, 60] },
];
const blockLabel = (note) => CAR_BLOCKS.find((b) => b.id === note)?.label || note || "Blok";
const blockIcon  = (note) => CAR_BLOCKS.find((b) => b.id === note)?.icon || "🔧";

// vygeneruje pole časových slotů. Každý slot = jízda (interval) + čas na přípravu (prep).
// prep se zobrazí jako úzký pruh za jízdou, ale do slotu patří (auto je blokované).
const driveSlots = (start, end, interval, prep = 0) => {
  if (!start || !end || !interval) return [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const s = sh * 60 + sm, e = eh * 60 + em;
  if (e <= s) return [];
  const step = interval + prep;
  const out = [];
  for (let t = s; t + interval <= e; t += step) {
    out.push({ idx: out.length, from: t, to: t + interval, prepTo: t + interval + prep });
  }
  return out;
};
const minToHM = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
const mkCar = (model = "", spz = "", note = "") => ({ id: uid(), model, spz, note, availFrom: null });

const EQ_PRESETS = [
  { id: "own_car",    label: "Vlastní auto",     icon: "🚗", rentable: false },
  { id: "test_car",   label: "Testovací auto",   icon: "🔑", rentable: true  },
  { id: "own_bike",   label: "Vlastní kolo",     icon: "🚲", rentable: false },
  { id: "rent_bike",  label: "Půjčit kolo",      icon: "🛞", rentable: true  },
  { id: "own_equip",  label: "Vlastní vybavení", icon: "🎒", rentable: false },
  { id: "rent_equip", label: "Půjčit vybavení",  icon: "📦", rentable: true  },
];

const mkEqItem = () => ({ id: uid(), presetId: null, label: "", rentPrice: null, custom: true });

/* ── budget helpers ── */
const budgetTotals = (items = []) => {
  const exp  = items.filter((i) => !i.isReal);
  const real = items.filter((i) => i.isReal);
  const sumNet   = (a) => a.reduce((s, i) => s + num(i.amountNet), 0);
  const sumGross = (a) => a.reduce((s, i) => s + withVat(i.amountNet, i.vatRate), 0);
  return { expNet: sumNet(exp), expGross: sumGross(exp), realNet: sumNet(real), realGross: sumGross(real) };
};

/* ── base fields ── */
const baseFields = () => [
  { id: uid(), type: "text",  label: "Jméno a příjmení", required: true,  options: "" },
  { id: uid(), type: "email", label: "Email",             required: true,  options: "" },
  { id: uid(), type: "phone", label: "Telefon",           required: false, options: "" },
];

/* ── seed ── */
const seed = () => {
  const f1 = baseFields();
  const hcpId = uid();
  const mk = (n, e, p, st, note = "", hcp = "", grp = null, eq = {}, crm = {}, addedBy = null) => {
    // dohledej prodejce podle jména v addedBy a doplň userId + divize
    let enrichedAddedBy = addedBy;
    let assignedTo = null;
    if (addedBy?.name) {
      const u = USERS_SEED.find(x => x.name === addedBy.name);
      if (u) {
        enrichedAddedBy = { ...addedBy, userId: u.id, depts: u.depts || [] };
        assignedTo = u.id;
      }
    }
    return {
      id: uid(), state: st, note, flight: null, hcp, group: grp, eqChoice: eq, crm, addedBy: enrichedAddedBy, assignedTo,
      data: { [f1[0].id]: n, [f1[1].id]: e, [f1[2].id]: p },
    };
  };
  const golf = {
    id: uid(), name: "Golfový den", date: "2026-06-20", place: "Karlštejn",
    capacity: 12, owner: "me", activityType: "golf", approver: "mira",
    fields: [...f1, { id: hcpId, type: "number", label: "HCP (handicap)", required: false, options: "" }],
    fieldMeta: { nameId: f1[0].id, emailId: f1[1].id, phoneId: f1[2].id, hcpId },
    startTime: "08:00", interval: 15,
    groups: [{ id: "g1", name: "Dopolední flight" }, { id: "g2", name: "Odpolední flight" }],
    equipment: [
      { id: "e1", presetId: "own_car",  label: "Vlastní auto",  rentPrice: null, custom: false },
      { id: "e2", presetId: "test_car", label: "Testovací auto", rentPrice: 0,   custom: false },
    ],
    parts: [
      mk("Jan Novák",     "jan.novak@email.cz", "+420 601 234 567", "potvrzen", "VIP",  "12,4", "g1", { e1: true }, { category: "Velkoodběratel", reason: "Za poslední rok odebral GLE 450 a GLS 400. Dlouhodobý partner od 2018.", purchases: [{ year: 2024, model: "GLE 450" }, { year: 2024, model: "GLS 400" }, { year: 2022, model: "S 500" }] }, { name: "Martin Dvořák", dept: "Prodej OA", role: "lite" }),
      mk("Eva Dvořáková", "eva.d@firma.cz",      "+420 777 888 999", "potvrzen", "",    "18,2", "g1", { e2: true }, { category: "Obchodní partner", reason: "Jednatelka, firma odebírá fleet 8 vozů ročně. Zájem o elektrifikaci.", purchases: [{ year: 2023, model: "EQS 450" }, { year: 2023, model: "EQB 300" }] }, { name: "Jana Procházková", dept: "Servis", role: "lite" }),
      mk("Petr Svoboda",  "p.svoboda@mail.com",  "+420 602 111 222", "potvrzen", "",    "24,0", "g1", { e1: true }),
      mk("Karel Veselý",  "karel@golf.cz",       "+420 605 333 111", "prihlasen","",    "",     "g2", {}, { category: "Velkoodběratel", reason: "Ředitel výrobní firmy, pravidelný zákazník od 2019. Osobní vůz každé 2 roky, zájem o fleet pro firmu.", purchases: [{ year: 2024, model: "C 300" }, { year: 2023, model: "GLC 220d" }, { year: 2023, model: "A 200" }] }, { name: "Martin Dvořák", dept: "Prodej OA", role: "lite" }),
      mk("Lucie Malá",    "lucie.mala@firma.cz", "+420 720 444 222", "prihlasen","",    "",     "g2", {}, { category: "Společník", reason: "Společnice v advokátní kanceláři. První pozvání — navázání vztahu.", purchases: [] }, { name: "Jana Procházková", dept: "Servis", role: "lite" }),
      mk("Tomáš Horák",   "t.horak@email.cz",    "+420 608 555 333", "potvrzen", "",    "8,7",  "g2", { e2: true }, { category: "Dodavatel", reason: "Ředitel logistické firmy. Dodavatel náhradních dílů. Roční obrat spolupráce 2,4M.", purchases: [{ year: 2024, model: "Sprinter 319" }, { year: 2024, model: "Vito 116" }] }, { name: "Martin Dvořák", dept: "Prodej OA", role: "lite" }),
      mk("Ivana Králová", "ivana.k@email.cz",    "+420 606 777 888", "ceka",     "Přidal: Novotný"),
      mk("Martin Beneš",  "m.benes@firma.cz",    "+420 603 222 444", "zrusil",   "Nemoc"),
    ],
    leads: [
      { id: "l1", name: "Jan Novák",     phone: "+420 601 234 567", model: "GLE 450 4MATIC",  interest: "velky",      note: "Chce test drive, volat do týdne.", addedBy: "hosteska", assignedTo: "u5", at: "2026-06-20", isGuest: false },
      { id: "l2", name: "Eva Dvořáková", phone: "+420 777 888 999", model: "EQS 580 4MATIC",  interest: "zjistit",    note: "Zájem o elektrifikaci celého fletu.", addedBy: "hosteska", at: "2026-06-20", isGuest: false },
      { id: "l3", name: "Tomáš Horák",   phone: "+420 608 555 333", model: "Sprinter 319 CDI", interest: "informace",  note: "Potřebuje 2 dodávky Q1 2027.", addedBy: "prodejce", at: "2026-06-20", isGuest: false },
      { id: "l4", name: "Roman Blaha",   phone: "+420 777 111 222", model: "G 500",            interest: "velky",      note: "Kamarád Jana Nováka, přišel s ním. Vlastní BMW X7.", addedBy: "hosteska", assignedTo: null, at: "2026-06-20", isGuest: true },
    ],
    invite: {
      bgColor: "#1a3d24", headerImg: "", headerImgFile: null,
      fontFamily: "Georgia, serif", fontSize: 15,
      blocks: [
        { id: "b1", type: "header",    content: "Golfový den S&W automobily",         align: "center", bold: true,  size: 22, color: "#f2ede0" },
        { id: "b2", type: "image",     url: "", alt: "Hlavní foto" },
        { id: "b3", type: "text", content: "Vážený/á {{jmeno}},\n\nsrdečně Vás zveme na náš každoroční Golfový den. Přijďte si zahrát a strávit příjemný den v přátelské atmosféře.", align: "left", bold: false, size: 14, color: "#e4e8de" },
        { id: "b4", type: "infobox",   items: [{ icon: "📅", label: "Datum", value: "{{datum}}" }, { icon: "📍", label: "Místo", value: "{{misto}}" }, { icon: "⛳", label: "Váš start", value: "{{flight_cas}}" }] },
        { id: "b5", type: "divider" },
        { id: "b6", type: "text",      content: "Dress code: golfový oděv, kolíkové boty povinné.", align: "left", bold: false, size: 13, color: "#c8c4b4" },
        { id: "b7", type: "button",    label: "Přidat do kalendáře", url: "{{kalendar_odkaz}}", color: "#c8a044" },
        { id: "b7c", type: "confirm",  label: "✅ Potvrdit účast (+ HCP a vybavení)", url: "{{potvrdit_odkaz}}", color: "#2e7d54" },
        { id: "b7d", type: "decline",  label: "✖ Nemohu se zúčastnit", url: "{{odmitnout_odkaz}}", color: "#b4483a" },
        { id: "b8", type: "link",      label: "📸 Fotky z loňského golfového dne", url: "", italic: true },
      ],
    },
    needs: {
      items: [
        { id: "n1", cat: "Technika", label: "Notebook + prezentace",     qty: 1, unit: "ks", checked: true,  note: "" },
        { id: "n2", cat: "Technika", label: "Datový projektor",          qty: 1, unit: "ks", checked: false, note: "Záloha: TV" },
        { id: "n3", cat: "Materiály", label: "Informační listy pro hosty", qty: 12, unit: "ks", checked: false, note: "Tisknout den před" },
        { id: "n4", cat: "Materiály", label: "Startovní listina — tisk",   qty: 3, unit: "ks", checked: false, note: "" },
        { id: "n5", cat: "Catering",  label: "Potvrzení objednávky cateringu", qty: 1, unit: "ks", checked: true, note: "" },
        { id: "n6", cat: "Golf",     label: "Golfové vozíky — rezervace", qty: 4, unit: "ks", checked: true,  note: "500 Kč/ks" },
      ],
    },
    team: {
      members: [
        { id: "tm1", type: "internal", userId: "u1", name: "Miroslav Šperl",   email: "m.sperl@sw-automobily.cz",   role: "Organizátor", days: ["2026-06-20"], timeFrom: "07:30", timeTo: "18:00", status: "confirmed", note: "" },
        { id: "tm2", type: "internal", userId: "u5", name: "Martin Dvořák",    email: "m.dvorak@sw-automobily.cz",  role: "Prodejce",    days: ["2026-06-20"], timeFrom: "08:00", timeTo: "16:00", status: "confirmed", note: "" },
        { id: "tm3", type: "internal", userId: "u7", name: "Lucie Hosteska",   email: "l.hosteska@sw-automobily.cz",role: "Hosteska",    days: ["2026-06-20"], timeFrom: "07:00", timeTo: "14:00", status: "pending",   note: "" },
        { id: "tm4", type: "external", userId: null, name: "Tomáš Kadlec",     email: "kadlec@golfkarlstejn.cz",    role: "Správce hřiště", days: ["2026-06-20"], timeFrom: "07:00", timeTo: "17:00", status: "confirmed", note: "Kontakt na místě" },
      ],
      teamsUrl: "",
      multiDay: false,
    },
    inviteMode: "batch",
    inviteTemplate: "Vážený/á {{jmeno}},\n\nsrdečně Vás zveme na {{nazev_akce}}, která se koná {{datum}} v {{misto}}.\n\n{{program}}\n\nDress code: {{dress_code}}\n\nTěšíme se na Vás!\nTým S&W automobily",
    reminders: { r0: true, r14: true, r7: true, r1: true, rCustom: [], rAfter1: true },
    golfStartType: "interval",
    participation: { enabled: false, basePrice: 0, items: [] },
    survey: {
      fields: [
        { id: "sq1", type: "select", label: "Celková spokojenost s akcí", required: true, options: "⭐⭐⭐⭐⭐ Výborné, ⭐⭐⭐⭐ Dobré, ⭐⭐⭐ Průměrné, ⭐⭐ Slabé" },
        { id: "sq2", type: "select", label: "Jak hodnotíte organizaci?", required: true, options: "Výborná, Dobrá, Průměrná, Slabá" },
        { id: "sq3", type: "select", label: "Jak hodnotíte catering?", required: false, options: "Výborný, Dobrý, Průměrný, Slabý" },
        { id: "sq4", type: "textarea", label: "Co se vám nejvíce líbilo?", required: false, options: "" },
        { id: "sq5", type: "textarea", label: "Co bychom mohli zlepšit?", required: false, options: "" },
        { id: "sq6", type: "select", label: "Zúčastnili byste se znovu?", required: true, options: "Určitě ano, Pravděpodobně ano, Spíše ne, Určitě ne" },
      ],
      responses: [
        { id: "r1", partId: null, name: "Jan Novák",     at: "2026-06-21", data: { sq1: "⭐⭐⭐⭐⭐ Výborné", sq2: "Výborná", sq3: "Výborný",  sq4: "Krásné hřiště, skvělá organizace.", sq5: "",                          sq6: "Určitě ano" } },
        { id: "r2", partId: null, name: "Eva Dvořáková", at: "2026-06-21", data: { sq1: "⭐⭐⭐⭐ Dobré",   sq2: "Dobrá",    sq3: "Průměrný", sq4: "Příjemná atmosféra.",             sq5: "Catering mohl být lepší.",  sq6: "Pravděpodobně ano" } },
        { id: "r3", partId: null, name: "Tomáš Horák",   at: "2026-06-22", data: { sq1: "⭐⭐⭐⭐⭐ Výborné", sq2: "Výborná", sq3: "Výborný",  sq4: "Vše bylo na vysoké úrovni.",     sq5: "",                          sq6: "Určitě ano" } },
      ],
      sent: true, sentAt: "2026-06-21",
    },
    budget: {
      eventBudget: 100000,
      items: [
        { id: uid(), name: "Pronájem hřiště", supplier: "Golf Karlštejn s.r.o.", note: "",           amountNet: 45000, vatRate: 21, isReal: false },
        { id: uid(), name: "Catering",         supplier: "Gusto Catering",        note: "oběd+drink", amountNet: 28000, vatRate: 15, isReal: false },
        { id: uid(), name: "Tisk materiálů",   supplier: "Tiskárna Alfa",         note: "",           amountNet: 3200,  vatRate: 21, isReal: true  },
        { id: uid(), name: "Ceny pro vítěze",  supplier: "Sport depot",           note: "",           amountNet: 8000,  vatRate: 21, isReal: false },
      ],
    },
  };
  const f2 = baseFields();
  const wine = {
    id: uid(), name: "Degustace vín", date: "2026-07-04", place: "Mikulov",
    capacity: 12, owner: "me", activityType: "degustace", approver: "tereza",
    fields: f2, fieldMeta: { nameId: f2[0].id, emailId: f2[1].id, phoneId: f2[2].id },
    startTime: "", interval: 15, groups: [], equipment: [],
    parts: [
      { id: uid(), state: "ceka",     note: "Přidal: Dvořák", flight: null, hcp: "", group: null, eqChoice: {}, data: { [f2[0].id]: "Jan Novák",    [f2[1].id]: "jan.novak@email.cz", [f2[2].id]: "+420 601 234 567" } },
      { id: uid(), state: "prihlasen",note: "",               flight: null, hcp: "", group: null, eqChoice: {}, data: { [f2[0].id]: "Karel Veselý", [f2[1].id]: "karel@golf.cz",      [f2[2].id]: "+420 605 333 111" } },
    ],
    leads: [],
    needs: { items: [] },
    team: { members: [], teamsUrl: "", multiDay: false },
    invite: { bgColor: "#2a1a3a", headerImg: "", fontFamily: "Georgia, serif", fontSize: 15, blocks: [{ id: "w1", type: "header", content: "Degustace vín S&W", align: "center", bold: true, size: 20, color: "#f2ede0" }, { id: "w2", type: "text", content: "Vážený/á {{jmeno}},\n\nzveme Vás na exkluzivní degustaci.", align: "left", bold: false, size: 14, color: "#e4e8de" }, { id: "w3", type: "infobox", items: [{ icon: "📅", label: "Datum", value: "{{datum}}" }, { icon: "📍", label: "Místo", value: "{{misto}}" }] }, { id: "w4", type: "button", label: "Přidat do kalendáře", url: "{{kalendar_odkaz}}", color: "#9068c8" }, { id: "w4c", type: "confirm", label: "✅ Potvrdit účast", url: "{{potvrdit_odkaz}}", color: "#2e7d54" }, { id: "w4d", type: "decline", label: "✖ Nemohu se zúčastnit", url: "{{odmitnout_odkaz}}", color: "#b4483a" }] },
    inviteMode: "batch",
    inviteTemplate: "",
    reminders: { r0: true, r7: true, r1: true, rCustom: [], rAfter1: true },
    golfStartType: "interval",
    participation: { enabled: false, basePrice: 0, items: [] },
    survey: { fields: [], responses: [], sent: false, sentAt: null },
    budget: { eventBudget: 0, items: [] },
  };
  const f3 = baseFields();
  const tdCars = [
    mkCar("EQS 580 4MATIC", "1AB 2345", "elektro, plné nabití"),
    mkCar("GLE 450 4MATIC", "2CD 6789", ""),
    mkCar("AMG GT 63 S",    "3EF 1011", "sportovní, jen zkušení řidiči"),
    mkCar("Sprinter 319 CDI","4GH 1213", "užitkový"),
  ];
  const tdParts = [
    { id: uid(), state: "potvrzen", note: "", flight: null, hcp: "", group: null, eqChoice: {}, data: { [f3[0].id]: "Jan Novák",     [f3[1].id]: "jan.novak@email.cz", [f3[2].id]: "+420 601 234 567" } },
    { id: uid(), state: "potvrzen", note: "", flight: null, hcp: "", group: null, eqChoice: {}, data: { [f3[0].id]: "Eva Dvořáková", [f3[1].id]: "eva.d@firma.cz",      [f3[2].id]: "+420 777 888 999" } },
    { id: uid(), state: "prihlasen",note: "", flight: null, hcp: "", group: null, eqChoice: {}, data: { [f3[0].id]: "Petr Svoboda",  [f3[1].id]: "p.svoboda@mail.com",  [f3[2].id]: "+420 602 111 222" } },
    { id: uid(), state: "ceka",     note: "Přidal: Novotný", flight: null, hcp: "", group: null, eqChoice: {}, data: { [f3[0].id]: "Ivana Králová", [f3[1].id]: "ivana.k@email.cz",   [f3[2].id]: "+420 606 777 888" } },
  ];
  const testdrive = {
    id: uid(), name: "Den testovacích jízd", date: "2026-07-18", place: "S&W Praha-Chodov",
    capacity: 20, owner: "me", activityType: "testjizda", approvers: ["pavel"], approver: "pavel",
    fields: f3, fieldMeta: { nameId: f3[0].id, emailId: f3[1].id, phoneId: f3[2].id },
    startTime: "", interval: 15, groups: [], equipment: [],
    // testovací jízdy:
    testCars: tdCars,
    guestMode: "invited",
    driveStart: "09:00", driveEnd: "16:00", driveInterval: 30, drivePrep: 5,
    reservations: [
      { id: uid(), carId: tdCars[0].id, slotIndex: 0, partId: tdParts[0].id },
      { id: uid(), carId: tdCars[0].id, slotIndex: 2, partId: tdParts[1].id },
      { id: uid(), carId: tdCars[1].id, slotIndex: 1, partId: tdParts[0].id },
      { id: uid(), carId: tdCars[2].id, slotIndex: 3, partId: null, blocked: true, note: "Tankování" },
    ],
    parts: tdParts,
    leads: [],
    needs: { items: [] },
    team: { members: [], teamsUrl: "", multiDay: false },
    invite: { bgColor: "#12233a", headerImg: "", fontFamily: "Georgia, serif", fontSize: 15, blocks: [
      { id: uid(), type: "header", content: "Den testovacích jízd S&W", align: "center", bold: true, size: 20, color: "#f2ede0" },
      { id: uid(), type: "text", content: "Vážený/á {{jmeno}},\n\nzveme Vás vyzkoušet si naše vozy naživo. Vyberte si model a čas, který Vám vyhovuje.", align: "left", bold: false, size: 14, color: "#e4e8de" },
      { id: uid(), type: "infobox", items: [{ icon: "📅", label: "Datum", value: "{{datum}}" }, { icon: "📍", label: "Místo", value: "{{misto}}" }] },
      { id: uid(), type: "confirm", label: "🚗 Rezervovat testovací jízdu", url: "{{golf_odkaz}}", color: "#2e7d54" },
      { id: uid(), type: "decline", label: "✖ Nemohu se zúčastnit", url: "{{odmitnout_odkaz}}", color: "#b4483a" },
    ] },
    inviteMode: "batch",
    inviteTemplate: "",
    reminders: { r0: true, r7: true, r1: true, rCustom: [], rAfter1: true },
    golfStartType: "interval",
    participation: { enabled: false, basePrice: 0, items: [] },
    survey: { fields: [], responses: [], sent: false, sentAt: null },
    budget: { eventBudget: 0, items: [] },
  };
  return [golf, wine, testdrive];
};

/* ════════════════════════════════════════
   ATOMS
════════════════════════════════════════ */
function Btn({ children, onClick, kind = "ghost", icon: Icon, small, disabled }) {
  const map = {
    primary: { background: T.brass,       color: T.bg,    border: `1px solid ${T.brass}` },
    green:   { background: T.green,       color: T.cream, border: `1px solid ${T.greenLite}` },
    ghost:   { background: "transparent", color: T.cream, border: `1px solid ${T.line}` },
    danger:  { background: "transparent", color: T.danger,border: `1px solid ${T.line}` },
    purple:  { background: "transparent", color: T.purple,border: `1px solid ${T.purple}55` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...map[kind], display: "inline-flex", alignItems: "center", gap: 7,
      padding: small ? "5px 10px" : "9px 15px", borderRadius: 9,
      fontSize: small ? 12 : 14, fontWeight: 500,
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1, fontFamily: "inherit",
    }}>
      {Icon && <Icon size={small ? 13 : 16} />}{children}
    </button>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 11px", background: T.bg,
  border: `1px solid ${T.line}`, borderRadius: 8, color: T.text, fontSize: 14,
  fontFamily: "inherit", outline: "none", colorScheme: "dark",
};
const lbl = { fontSize: 12, color: T.textDim, marginBottom: 4, display: "block", letterSpacing: 0.3 };

function StateBadge({ state }) {
  const s = STATES[state];
  return (
    <span style={{ fontSize: 11, color: s.color, border: `1px solid ${s.color}55`, background: `${s.color}18`, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function CapBar({ used, cap }) {
  const pct = Math.min(100, Math.round((used / cap) * 100));
  const col = used >= cap ? T.danger : pct > 75 ? T.warn : T.greenLite;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: T.textDim }}>Obsazenost</span>
        <span style={{ color: col, fontWeight: 600 }}>{used}/{cap}{used >= cap ? " · plno" : ""}</span>
      </div>
      <div style={{ height: 7, background: T.bg, borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: col }} />
      </div>
    </div>
  );
}

function Banner({ children, color, icon: Icon }) {
  return (
    <div style={{ background: `${color}18`, border: `1px solid ${color}55`, color, padding: "9px 12px", borderRadius: 9, fontSize: 12.5, marginBottom: 13, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
      <Icon size={15} style={{ flexShrink: 0, marginTop: 1 }} /><span>{children}</span>
    </div>
  );
}

function Modal({ title, children, onClose, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, width: "100%", maxWidth: wide ? 680 : 480, padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: T.cream }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FRow({ label, children }) {
  return <div style={{ marginBottom: 12, flex: 1 }}><label style={lbl}>{label}</label>{children}</div>;
}

function MetricBox({ n, l, c, sub }) {
  return (
    <div style={{ flex: 1, background: T.panel, borderRadius: 10, padding: "13px 16px", border: `1px solid ${T.line}` }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: c || T.cream, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>{l}</div>
      {sub && <div style={{ fontSize: 10.5, color: T.line, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SumCard({ label, val, color }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: "10px 14px" }}>
      <div style={{ fontSize: 17, fontWeight: 600, color }}>{val}</div>
      <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function DTab({ active, onClick, icon: Icon, children, badge }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", border: "none", cursor: "pointer", background: active ? T.panel2 : "transparent", color: active ? T.cream : T.textDim, borderBottom: active ? `2px solid ${T.brass}` : "2px solid transparent", fontSize: 13, fontWeight: active ? 500 : 400, fontFamily: "inherit", borderRadius: "8px 8px 0 0" }}>
      <Icon size={14} />{children}
      {badge > 0 && <span style={{ background: T.purple, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>{badge}</span>}
    </button>
  );
}

function Donut({ title, data, center }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ background: T.bg, borderRadius: 10, padding: 12, border: `1px solid ${T.line}` }}>
      <div style={{ fontSize: 12, color: T.textDim, marginBottom: 6 }}>{title}</div>
      <div style={{ height: 190, position: "relative" }}>
        {total === 0
          ? <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: T.line, fontSize: 13 }}>Žádná data</div>
          : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={2} stroke="none">
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: T.panel2, border: `1px solid ${T.line}`, borderRadius: 8, color: T.cream, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, color: T.textDim }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        {center && total > 0 && (
          <div style={{ position: "absolute", top: "35%", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.cream }}>{center}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange, invalid }) {
  const base = { ...inputStyle, ...(invalid ? { border: `1px solid ${T.danger}` } : {}) };
  if (field.type === "textarea") return <textarea rows={2} value={value || ""} onChange={onChange} style={{ ...base, resize: "vertical" }} />;
  if (field.type === "select") {
    const opts = field.options.split(",").map((s) => s.trim()).filter(Boolean);
    return (
      <select value={value || ""} onChange={onChange} style={base}>
        <option value="">— vyberte —</option>
        {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
      </select>
    );
  }
  const tm = { email: "email", phone: "tel", date: "date", number: "number" };
  return <input type={tm[field.type] || "text"} value={value || ""} onChange={onChange} style={base} />;
}

/* ════════════════════════════════════════
   MAIN APP
════════════════════════════════════════ */
/* Firemní fonty — načtou se ze složky /fonts/ po nasazení na server */
const CORP_FONT_CSS = `
  @font-face { font-family: 'CorporateS'; src: url('/fonts/CORPORATESTOT-MEDIUM.OTF') format('opentype'); font-weight: 400; font-style: normal; }
  @font-face { font-family: 'CorporateS'; src: url('/fonts/CORPORATESTOT-BOLD.OTF') format('opentype'); font-weight: 700; font-style: normal; }
  @font-face { font-family: 'CorporateS'; src: url('/fonts/CORPORATESREGULAR.OTF') format('opentype'); font-weight: 400; }
  @font-face { font-family: 'CorporateS'; src: url('/fonts/CORPORATESBOLD.OTF') format('opentype'); font-weight: 700; }
  @font-face { font-family: 'CorporateS'; src: url('/fonts/CORPORATESREGULARITALIC.OTF') format('opentype'); font-weight: 400; font-style: italic; }
  @font-face { font-family: 'CorporateS'; src: url('/fonts/CORPORATESBOLDITALIC.OTF') format('opentype'); font-weight: 700; font-style: italic; }
  @font-face { font-family: 'CorporateA'; src: url('/fonts/CORPORATEATOT-MEDIUM.OTF') format('opentype'); font-weight: 400; }
  @font-face { font-family: 'CorporateA'; src: url('/fonts/CORPORATEACON-REG.OTF') format('opentype'); font-weight: 300; }
  * { font-family: 'CorporateS', 'DM Sans', sans-serif !important; }
  h1, h2, h3, .display { font-family: 'CorporateA', Georgia, serif !important; }
`;

export default function App() {
  React.useEffect(() => {
    if (!document.getElementById('corp-fonts')) {
      const style = document.createElement('style');
      style.id = 'corp-fonts';
      style.textContent = CORP_FONT_CSS;
      document.head.appendChild(style);
    }
  }, []);
  const [campaigns, setCampaigns] = useState(seed);
  const [annualBudget, setAnnualBudget] = useState({ total: 500000, periodFrom: "2026-03", periodTo: "2027-03", note: "" });
  const [users, setUsers] = useState(initUsers);
  const [showUsers, setShowUsers] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [role, setRole]   = useState("admin");
  const [open, setOpen]   = useState(null);
  const [notifLog, setNotifLog] = useState([]);

  const used = (c) => c.parts.filter((p) => OCCUPIES.includes(p.state)).length;

  const crossMap = useMemo(() => {
    const m = {};
    campaigns.forEach((c) => c.parts.forEach((p) => {
      if (!OCCUPIES.includes(p.state)) return;
      const email = (p.data[c.fieldMeta.emailId] || "").toLowerCase();
      if (!email) return;
      (m[email] = m[email] || []).push(c.name);
    }));
    return m;
  }, [campaigns]);

  const update  = (id, fn) => setCampaigns((cs) => cs.map((c) => c.id === id ? fn(c) : c));
  const current = campaigns.find((c) => c.id === open);
  const liteBlocked = role === "lite" && current && current.owner !== "me";
  const hosteskaView = role === "hosteska";
  const totalWaiting = campaigns.reduce((s, c) => s + c.parts.filter((p) => p.state === "ceka").length, 0);
  const totalExpected = campaigns.reduce((s, c) => s + budgetTotals(c.budget?.items).expGross, 0);
  const totalReal     = campaigns.reduce((s, c) => s + budgetTotals(c.budget?.items).realGross, 0);

  const remind = (cid) => {
    const c = campaigns.find((x) => x.id === cid);
    const apIds = (c?.approvers && c.approvers.length) ? c.approvers : [c?.approver].filter(Boolean);
    const aps = apIds.map((id) => APPROVERS.find((a) => a.id === id)).filter(Boolean);
    const names = aps.map((a) => a.name).join(", ") || "schvalovatelé";
    const wc = c?.parts.filter((p) => p.state === "ceka").length || 0;
    const msg = `${new Date().toLocaleTimeString("cs-CZ")} — Připomínka odeslána (${aps.length}× schvalovatel): ${names} — ${wc}× čeká v „${c?.name}"`;
    setNotifLog((n) => [msg, ...n]);
    alert(`[Mock email]\nKomu: ${names}\nPředmět: Čeká na schválení – ${c?.name}\n\n${wc} zákazník${wc > 1 ? "ů čeká" : " čeká"} na vaše schválení.`);
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, paddingBottom: 60, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      {/* header */}
      <header style={{ padding: "18px 28px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(180deg, ${T.panel} 0%, ${T.bg} 100%)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.green, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.brass}` }}><Layers size={18} color={T.brass} /></div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Akce S&W</div>
            <div style={{ fontSize: 12, color: T.textDim }}>Dashboard · rozpočet · vybavení · report · schválení <span onClick={() => setShowChangelog(true)} title="Zobrazit novinky ve verzi" style={{ color: T.brass, opacity: .75, fontSize: 11, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 2 }}>· v{APP_VERSION} · {APP_BUILD} 🎉</span></div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {totalWaiting > 0 && (role === "admin" || role === "approver") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${T.purple}22`, border: `1px solid ${T.purple}55`, borderRadius: 8, padding: "6px 12px", fontSize: 12.5, color: T.purple }}>
              <Bell size={14} />{totalWaiting} čeká na schválení
            </div>
          )}
          {role === "admin" && <Btn kind="ghost" icon={Users} small onClick={() => setShowUsers(true)}>👤 Uživatelé</Btn>}
          <RoleSwitch role={role} setRole={setRole} />
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 20px" }}>
        {!current ? (
          <Dashboard
            campaigns={campaigns} role={role} used={used} onOpen={setOpen}
            onEdit={(id) => setEditCampaign(campaigns.find(x => x.id === id))}
            annualBudget={annualBudget} setAnnualBudget={setAnnualBudget}
            totalExpected={totalExpected} totalReal={totalReal}
            notifLog={notifLog} onRemind={remind}
            onCreate={(c) => { setCampaigns((cs) => [...cs, c]); setOpen(c.id); }}
          />
        ) : hosteskaView ? (
          <HosteskaDetail c={current} onBack={() => setOpen(null)} onUpdate={(fn) => update(current.id, fn)} />
        ) : (
          <Detail
            c={current} role={role} used={used(current)} crossMap={crossMap}
            blocked={liteBlocked} onBack={() => setOpen(null)}
            onUpdate={(fn) => update(current.id, fn)} onRemind={() => remind(current.id)}
          />
        )}
      </main>
      {showUsers && <UsersModal users={users} onClose={() => setShowUsers(false)} onUpdate={setUsers} />}
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {editCampaign && <CreateWizard editCampaign={editCampaign} onClose={() => setEditCampaign(null)} onCreate={(updated) => { update(updated.id, () => updated); setEditCampaign(null); }} />}
    </div>
  );
}

function RoleSwitch({ role, setRole }) {
  return (
    <div style={{ display: "flex", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: 3 }}>
      {[
        { k: "admin",    t: "Admin",          i: ShieldCheck },
        { k: "approver", t: "Schvalovatel",   i: UserCheck   },
        { k: "lite",     t: "LITE (prodejce)", i: Lock        },
        { k: "hosteska", t: "Hosteska",        i: Zap         },
      ].map((o) => (
        <button key={o.k} onClick={() => setRole(o.k)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, background: role === o.k ? T.brass : "transparent", color: role === o.k ? T.bg : T.textDim, fontWeight: 500 }}>
          <o.i size={13} />{o.t}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════ */
function Dashboard({ campaigns, role, used, onOpen, onEdit, annualBudget, setAnnualBudget, totalExpected, totalReal, notifLog, onRemind, onCreate }) {
  const [creating,   setCreating]   = useState(false);
  const [showAnnual, setShowAnnual] = useState(false);
  const [statsScope, setStatsScope] = useState("all");

  const scopedCamps   = statsScope === "all" ? campaigns : campaigns.filter((cp) => cp.id === statsScope);
  const stateChartData = STATE_ORDER.map((s) => ({
    name: STATES[s].label,
    value: scopedCamps.reduce((n, cp) => n + cp.parts.filter((p) => p.state === s).length, 0),
    color: STATES[s].color,
  })).filter((d) => d.value > 0);
  const occTotal = scopedCamps.reduce((a, cp) => { a.u += used(cp); a.c += cp.capacity; return a; }, { u: 0, c: 0 });
  const occChartData = [
    { name: "Obsazeno", value: occTotal.u,                            color: T.greenLite },
    { name: "Volno",    value: Math.max(0, occTotal.c - occTotal.u),  color: T.line },
  ];
  const budgetChartData = campaigns.map((cp) => {
    const bt = budgetTotals(cp.budget?.items);
    return { name: cp.name.split(" ")[0], expected: bt.expGross, real: bt.realGross };
  });
  // grafy přesunuty do Reportu

  /* LITE pohled */
  if (role === "hosteska") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Zap size={17} color={T.brass} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Akce — zadání zájmu o vůz</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {campaigns.map((c) => (
            <div key={c.id} onClick={() => onOpen(c.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.panel, borderRadius: 11, cursor: "pointer", border: `1px solid ${T.line}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{fmt(c.date)} · {c.place}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.brass }}>{(c.leads||[]).length} leadů</div>
                <div style={{ fontSize: 11, color: T.textDim }}>{c.parts.filter(p => p.state === "potvrzen").length} potvrzených hostů</div>
              </div>
              <div style={{ color: T.brass, fontSize: 18 }}>›</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (role === "lite") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Flag size={17} color={T.brass} /><h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Stav akcí</h2></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {campaigns.map((c) => {
            const free = c.capacity - used(c);
            return (
              <div key={c.id} onClick={() => onOpen(c.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: T.panel, borderRadius: 10, cursor: "pointer", border: `1px solid ${T.line}` }}>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div><div style={{ fontSize: 12, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmt(c.date)} · {c.place}</div></div>
                <div style={{ textAlign: "right", width: 78, flexShrink: 0 }}><div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", color: free === 0 ? T.danger : free < 3 ? T.warn : T.greenLite }}>{free === 0 ? "Plno" : `${free} volných`}</div><div style={{ fontSize: 11, color: T.textDim }}>{used(c)}/{c.capacity}</div></div>
                <div style={{ width: 70, flexShrink: 0 }}><CapBar used={used(c)} cap={c.capacity} /></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* hlavička */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Flag size={17} color={T.brass} /><h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Přehled akcí</h2></div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn kind="ghost" icon={Wallet} onClick={() => setShowAnnual(true)}>Roční rozpočet</Btn>
          {role === "admin" && <Btn kind="primary" icon={Plus} onClick={() => setCreating(true)}>Nová akce</Btn>}
        </div>
      </div>

      {/* metriky */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <MetricBox n={campaigns.length} l="akcí" />
        <MetricBox n={campaigns.reduce((s, c) => s + used(c), 0)} l="obsazených míst" c={T.greenLite} />
        <MetricBox n={campaigns.reduce((s, c) => s + c.capacity, 0)} l="míst celkem" c={T.brass} />
        <MetricBox n={campaigns.reduce((s, c) => s + c.parts.filter((p) => p.state === "ceka").length, 0)} l="čeká na schválení" c={T.purple} />
        <MetricBox n={czk(totalExpected)} l="plánované náklady (s DPH)" c={T.info} sub={`reálné: ${czk(totalReal)}`} />
      </div>

      {/* statistiky */}
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}><PieIcon size={15} color={T.brass} /><span style={{ fontSize: 14, fontWeight: 600 }}>Statistiky</span></div>
          <select value={statsScope} onChange={(e) => setStatsScope(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "5px 9px", fontSize: 12 }}>
            <option value="all">Souhrn všech akcí</option>
            {campaigns.map((camp) => <option key={camp.id} value={camp.id}>{camp.name}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Donut title="Stavy účasti" data={stateChartData} />
          <Donut title="Obsazenost míst" data={occChartData} center={`${occTotal.c ? Math.round((occTotal.u / occTotal.c) * 100) : 0}%`} />
          <div style={{ background: T.bg, borderRadius: 10, padding: 12, border: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>Náklady na akci (s DPH)</div>
            <ResponsiveContainer width="100%" height={178}>
              <BarChart data={budgetChartData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
                <XAxis dataKey="name" tick={{ fill: T.textDim, fontSize: 11 }} />
                <YAxis tick={{ fill: T.textDim, fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => czk(v)} contentStyle={{ background: T.panel2, border: `1px solid ${T.line}`, borderRadius: 8, color: T.cream, fontSize: 11 }} />
                <Bar dataKey="expected" name="Plánované" fill={T.info}      radius={[4, 4, 0, 0]} />
                <Bar dataKey="real"     name="Reálné"    fill={T.greenLite} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* upozornění schvalovatele */}
      {campaigns.some((c) => c.parts.some((p) => p.state === "ceka")) && (
        <div style={{ background: `${T.purple}14`, border: `1px solid ${T.purple}44`, borderRadius: 11, padding: "12px 16px", marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.purple, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Bell size={15} /> Upozornit schvalovatele
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {campaigns.filter((c) => c.parts.some((p) => p.state === "ceka")).map((c) => {
              const wc = c.parts.filter((p) => p.state === "ceka").length;
              const apIds = (c.approvers && c.approvers.length) ? c.approvers : [c.approver].filter(Boolean);
              const apNames = apIds.map((id) => APPROVERS.find((a) => a.id === id)?.name).filter(Boolean).join(", ");
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: "8px 12px" }}>
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: T.purple }}>{wc}× čeká</span>
                  <span style={{ fontSize: 11, color: T.textDim }}>→ {apNames || "—"}</span>
                  <Btn kind="purple" icon={Mail} small onClick={() => onRemind(c.id)}>Upozornit schvalovatele</Btn>
                </div>
              );
            })}
          </div>
          {notifLog.length > 0 && <div style={{ marginTop: 8, fontSize: 11, color: T.textDim }}>{notifLog[0]}</div>}
        </div>
      )}

      {/* dlaždice */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 12 }}>
        {campaigns.map((c) => {
          const t = budgetTotals(c.budget?.items);
          const wc = c.parts.filter((p) => p.state === "ceka").length;
          return (
            <div key={c.id} onClick={() => onOpen(c.id)} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: 15, cursor: "pointer" }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 6 }}>{fmt(c.date)} · {c.place}</div>
              <div style={{ fontSize: 11, color: T.brass, marginBottom: 10 }}>
                {ACTIVITY_TYPES.find((x) => x.id === c.activityType)?.label} · {((c.approvers && c.approvers.length) ? c.approvers : [c.approver].filter(Boolean)).map((id) => APPROVERS.find((a) => a.id === id)?.name).filter(Boolean).join(", ")}
              </div>
              <CapBar used={used(c)} cap={c.capacity} />
              {(c.equipment || []).length > 0 && (
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 6 }}>
                  {c.equipment.map((e) => `${EQ_PRESETS.find((p) => p.id === e.presetId)?.icon || "📦"} ${e.label}`).join("  ")}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11 }}>
                <span style={{ color: T.info }}>plán: {czk(t.expGross)}</span>
                <span style={{ color: T.greenLite }}>reál: {czk(t.realGross)}</span>
                {(c.budget?.eventBudget > 0) && (
                  <span style={{ color: c.budget.eventBudget < t.expGross ? T.danger : T.brass, fontSize: 11 }}>
                    rozpočet: {czk(c.budget.eventBudget)}
                  </span>
                )}
              </div>
              {wc > 0 && <div style={{ marginTop: 6, fontSize: 11, color: T.purple, display: "flex", alignItems: "center", gap: 4 }}><HelpCircle size={11} />{wc} čeká na schválení</div>}
              {role === "admin" && (
                <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                  <Btn kind="ghost" icon={Edit2} small onClick={() => onEdit(c.id)}>Upravit</Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {creating   && <CreateWizard onClose={() => setCreating(false)}   onCreate={(c) => { onCreate(c); setCreating(false); }} />}
      {showAnnual && <AnnualModal  onClose={() => setShowAnnual(false)} budget={annualBudget} onChange={setAnnualBudget} campaigns={campaigns} totalExpected={totalExpected} totalReal={totalReal} />}
    </div>
  );
}

/* ════════════════════════════════════════
   ROČNÍ ROZPOČET MODAL
════════════════════════════════════════ */

/* ════════════════════════════════════════
   EDITACE EXISTUJÍCÍ AKCE
════════════════════════════════════════ */
function EditCampaignModal({ c, onClose, onSave }) {
  const [info, setInfo] = useState({
    name:         c.name         || "",
    date:         c.date ? c.date.slice(0,10) : "",
    place:        c.place        || "",
    capacity:     c.capacity     || 12,
    activityType: c.activityType || "golf",
    customType:   c.customType   || "",
    notes:        c.notes        || "",
    golfStartType: c.golfStartType || "interval",
  });
  const [approvers, setApprovers] = useState(c.approvers || [c.approver].filter(Boolean) || ["mira"]);
  const [departments, setDepartments] = useState(c.departments || []);
  const [reminders, setReminders] = useState(c.reminders || { r0: true, r14: true, r7: true, r1: true, rCustom: [], rAfter1: true });
  const [inviteMode, setInviteMode] = useState(c.inviteMode || "batch");

  const isGolf = info.activityType === "golf";

  const toggleApprover = (id) => setApprovers(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleDept = (id) => setDepartments(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleReminder = (key) => setReminders(r => ({ ...r, [key]: !r[key] }));
  const addCustomDay = () => setReminders(r => ({ ...r, rCustom: [...r.rCustom, { id: uid(), days: 3, dir: "before", text: "" }] }));
  const updCustomDay = (id, patch) => setReminders(r => ({ ...r, rCustom: r.rCustom.map(d => d.id === id ? { ...d, ...patch } : d) }));
  const delCustomDay = (id) => setReminders(r => ({ ...r, rCustom: r.rCustom.filter(d => d.id !== id) }));

  const save = () => {
    if (!info.name || !info.date) return;
    onSave({ ...c, ...info, approvers, approver: approvers[0] || "mira", departments, reminders, inviteMode });
  };

  return (
    <Modal title={`Upravit akci — ${c.name}`} onClose={onClose} wide>
      {/* základní údaje */}
      <div style={{ borderBottom: `1px solid ${T.line}`, paddingBottom: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 10, textTransform: "uppercase" }}>Základní údaje</div>
        <FRow label="Název akce *"><input style={inputStyle} value={info.name} onChange={e => setInfo({...info, name: e.target.value})} /></FRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FRow label="Datum *"><input type="date" style={{...inputStyle, colorScheme: "dark"}} value={info.date} onChange={e => setInfo({...info, date: e.target.value})} /></FRow>
          <FRow label="Max. míst"><input type="number" min={1} style={inputStyle} value={info.capacity} onChange={e => setInfo({...info, capacity: +e.target.value})} /></FRow>
        </div>
        <FRow label="Místo"><input style={inputStyle} value={info.place} onChange={e => setInfo({...info, place: e.target.value})} /></FRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FRow label="Typ akce">
            <select style={inputStyle} value={info.activityType} onChange={e => setInfo({...info, activityType: e.target.value})}>
              {ACTIVITY_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              <option value="custom">✏️ Vlastní…</option>
            </select>
            {info.activityType === "custom" && (
              <input style={{...inputStyle, marginTop: 6}} value={info.customType} onChange={e => setInfo({...info, customType: e.target.value})} placeholder="Název typu…" />
            )}
          </FRow>
          {isGolf && (
            <FRow label="Typ startu">
              <select style={inputStyle} value={info.golfStartType} onChange={e => setInfo({...info, golfStartType: e.target.value})}>
                <option value="interval">🕐 Intervalový</option>
                <option value="canon">💥 Canon start</option>
              </select>
            </FRow>
          )}
        </div>
        <FRow label="Interní poznámka">
          <textarea rows={2} style={{...inputStyle, resize: "vertical"}} value={info.notes} onChange={e => setInfo({...info, notes: e.target.value})} placeholder="Vidí jen tým, ne zákazník" />
        </FRow>
      </div>

      {/* schvalovatelé */}
      <div style={{ borderBottom: `1px solid ${T.line}`, paddingBottom: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 10, textTransform: "uppercase" }}>Schvalovatelé (lze vybrat více)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {APPROVERS.map(a => (
            <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", background: approvers.includes(a.id) ? `${T.brass}15` : T.bg, border: `1px solid ${approvers.includes(a.id) ? T.brass : T.line}`, borderRadius: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={approvers.includes(a.id)} onChange={() => toggleApprover(a.id)} />
              <span style={{ fontSize: 13.5, fontWeight: approvers.includes(a.id) ? 600 : 400, color: approvers.includes(a.id) ? T.cream : T.textDim }}>{a.name}</span>
              <span style={{ fontSize: 11.5, color: T.textDim }}>— {a.role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* oddělení akce */}
      <div style={{ borderBottom: `1px solid ${T.line}`, paddingBottom: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 6, textTransform: "uppercase" }}>Oddělení akce</div>
        <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 10 }}>Kterých oddělení se akce týká. Prázdné = všechna.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {EVENT_DEPTS.map(d => {
            const on = departments.includes(d.id);
            return (
              <label key={d.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", background: on ? `${T.brass}18` : T.bg, border: `1px solid ${on ? T.brass : T.line}`, borderRadius: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={on} onChange={() => toggleDept(d.id)} />
                <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? T.cream : T.textDim }}>{d.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* odeslání pozvánek */}
      <div style={{ borderBottom: `1px solid ${T.line}`, paddingBottom: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 10, textTransform: "uppercase" }}>Způsob odesílání pozvánek</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{k:"batch",l:"📦 Hromadně tlačítkem"},{k:"auto",l:"⚡ Ihned po schválení"}].map(o => (
            <button key={o.k} onClick={() => setInviteMode(o.k)} style={{ flex: 1, padding: "9px 12px", border: `2px solid ${inviteMode === o.k ? T.brass : T.line}`, borderRadius: 9, background: inviteMode === o.k ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: inviteMode === o.k ? T.brass : T.textDim, fontWeight: inviteMode === o.k ? 600 : 400 }}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* připomínky — editovatelné dny */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 10, textTransform: "uppercase" }}>Připomínky zákazníkovi</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {[
            { key: "r0",     label: "✉️ Potvrzení účasti",     golf: false, fixedDays: null },
            { key: "r14",    label: "⛳ HCP výzva",              golf: true,  fixedDays: 14 },
            { key: "r7",     label: "📍 Připomínka s navigací", golf: false, fixedDays: null },
            { key: "r1",     label: "⏰ Finální připomínka",    golf: false, fixedDays: null },
            { key: "rAfter1",label: "📋 Dotazník spokojenosti", golf: false, fixedDays: null },
          ].map(r => {
            if (r.golf && !isGolf) return null;
            return (
              <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", background: reminders[r.key] ? `${T.greenLite}10` : T.bg, border: `1px solid ${reminders[r.key] ? T.greenLite : T.line}`, borderRadius: 8 }}>
                <input type="checkbox" checked={!!reminders[r.key]} onChange={() => toggleReminder(r.key)} style={{ cursor: "pointer" }} />
                <span style={{ flex: 1, fontSize: 13, color: reminders[r.key] ? T.cream : T.textDim }}>{r.label}</span>
                {r.key === "r0"     && <span style={{ fontSize: 11.5, color: T.textDim }}>ihned po schválení</span>}
                {r.key === "r14"    && <EditableDays value={reminders.r14days ?? 14} onChange={v => setReminders(r2 => ({...r2, r14days: v}))} />}
                {r.key === "r7"     && <EditableDays value={reminders.r7days  ??  7} onChange={v => setReminders(r2 => ({...r2, r7days:  v}))} />}
                {r.key === "r1"     && <EditableDays value={reminders.r1days  ??  1} onChange={v => setReminders(r2 => ({...r2, r1days:  v}))} />}
                {r.key === "rAfter1"&& <span style={{ fontSize: 11.5, color: T.textDim }}>den po akci</span>}
              </div>
            );
          })}
        </div>
        {reminders.rCustom.map(d => (
          <div key={d.id} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
              <input type="number" min={1} max={365} value={d.days} onChange={e => updCustomDay(d.id, {days: +e.target.value})} style={{ ...inputStyle, width: 65 }} />
              <select value={d.dir} onChange={e => updCustomDay(d.id, {dir: e.target.value})} style={{ ...inputStyle, width: "auto" }}>
                <option value="before">dní před akcí</option>
                <option value="after">dní po akci</option>
              </select>
              <button onClick={() => delCustomDay(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
            </div>
            <input value={d.text || ""} onChange={e => updCustomDay(d.id, {text: e.target.value})} placeholder="Text připomínky (povinné)…" style={{ ...inputStyle, padding: "5px 9px", fontSize: 12.5 }} />
            {!d.text && <div style={{ fontSize: 11, color: T.danger, marginTop: 3 }}>Text je povinný</div>}
          </div>
        ))}
        <Btn kind="ghost" icon={Plus} small onClick={addCustomDay}>+ Vlastní připomínka</Btn>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
        <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
        <Btn kind="green" icon={Check} disabled={!info.name || !info.date} onClick={save}>Uložit změny</Btn>
      </div>
    </Modal>
  );
}

function EditableDays({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <input type="number" min={1} max={365} value={value} onChange={e => onChange(+e.target.value)}
        style={{ ...inputStyle, width: 55, padding: "3px 6px", fontSize: 12, textAlign: "center" }} />
      <span style={{ fontSize: 11.5, color: T.textDim }}>dní před</span>
    </div>
  );
}


function AnnualModal({ onClose, budget, onChange, campaigns, totalExpected, totalReal }) {
  const remaining = num(budget.total) - totalExpected;
  return (
    <Modal title="Roční / periodický rozpočet" onClose={onClose} wide>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <FRow label="Celkový rozpočet (Kč)"><input type="number" style={inputStyle} value={budget.total} onChange={(e) => onChange({ ...budget, total: +e.target.value })} /></FRow>
        <FRow label="Období od (MM/RRRR)"><input type="month" style={inputStyle} value={budget.periodFrom} onChange={(e) => onChange({ ...budget, periodFrom: e.target.value })} /></FRow>
        <FRow label="Období do (MM/RRRR)"><input type="month" style={inputStyle} value={budget.periodTo} onChange={(e) => onChange({ ...budget, periodTo: e.target.value })} /></FRow>
      </div>
      <FRow label="Poznámka"><textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={budget.note} onChange={(e) => onChange({ ...budget, note: e.target.value })} /></FRow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <SumCard label="Celkový rozpočet"  val={czk(budget.total)}  color={T.brass} />
        <SumCard label="Plánované náklady" val={czk(totalExpected)} color={T.info} />
        <SumCard label="Zbývá"             val={czk(remaining)}     color={remaining < 0 ? T.danger : T.greenLite} />
      </div>
      {campaigns.map((c) => {
        const t = budgetTotals(c.budget?.items);
        return (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: T.bg, borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>{c.name}</span>
            <span style={{ color: T.info }}>plán: {czk(t.expGross)}</span>
            <span style={{ color: T.greenLite }}>reál: {czk(t.realGross)}</span>
          </div>
        );
      })}
    </Modal>
  );
}

function ChangelogModal({ onClose }) {
  return (
    <Modal title="✨ Novinky ve verzi" onClose={onClose} wide>
      <div style={{ fontSize: 12.5, color: T.textDim, marginBottom: 18, lineHeight: 1.6 }}>
        Aktuální verze <b style={{ color: T.brass }}>v{APP_VERSION}</b> · build {APP_BUILD}. Přehled změn a vylepšení aplikace.
      </div>
      <div style={{ position: "relative", paddingLeft: 22 }}>
        {/* svislá časová osa */}
        <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: T.line }} />
        {CHANGELOG.map((rel, idx) => (
          <div key={rel.version} style={{ position: "relative", marginBottom: idx === CHANGELOG.length - 1 ? 0 : 26 }}>
            {/* tečka na ose */}
            <div style={{ position: "absolute", left: -22, top: 3, width: 14, height: 14, borderRadius: "50%", background: idx === 0 ? T.brass : T.panel2, border: `2px solid ${idx === 0 ? T.brass : T.line}`, boxShadow: idx === 0 ? `0 0 0 4px ${T.brass}22` : "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: T.cream }}>v{rel.version}</span>
              {idx === 0 && <span style={{ fontSize: 10.5, fontWeight: 700, color: T.bg, background: T.brass, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.3 }}>NEJNOVĚJŠÍ</span>}
              <span style={{ fontSize: 11.5, color: T.textDim }}>{rel.date}</span>
            </div>
            {rel.title && <div style={{ fontSize: 13, fontWeight: 600, color: T.brass, marginBottom: 10 }}>{rel.title}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {rel.items.map((it, i) => (
                <div key={i} style={{ fontSize: 12.5, color: T.creamDim, lineHeight: 1.6, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 12px" }}>{it}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <Btn kind="primary" icon={Check} onClick={onClose}>Rozumím</Btn>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════
   WIZARD NOVÉ KAMPANĚ (3 kroky)
════════════════════════════════════════ */

function CreateWizard({ onClose, onCreate, editCampaign }) {
  const isEdit = !!editCampaign;
  const ec = editCampaign || {};
  const partCount = (ec.parts || []).length;
  const hasParts = partCount > 0;

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 5;

  const [fieldTarget, setFieldTarget] = useState('customer');
  const [info, setInfo] = useState({
    name: ec.name || "", date: ec.date ? ec.date.slice(0,10) : "", place: ec.place || "", capacity: ec.capacity || 12,
    activityType: ec.activityType || "golf", customType: ec.customType || "", approvers: ec.approvers || (ec.approver ? [ec.approver] : ["mira"]), departments: ec.departments || [], notes: ec.notes || "",
    guestMode: ec.guestMode || "invited",
    driveInterval: ec.driveInterval || 30, drivePrep: ec.drivePrep ?? 5,
  });
  const [fields,      setFields]      = useState(ec.fields || baseFields());
  const [equipment,   setEquipment]   = useState(ec.equipment || []);
  const [testCars,    setTestCars]    = useState(ec.testCars || []);
  const [reminders,   setReminders]   = useState(ec.reminders || { r0: true, r14: true, r7: true, r1: true, rCustom: [], rAfter1: true });
  const [inviteMode,  setInviteMode]  = useState(ec.inviteMode || "batch");
  const [inviteTpl,   setInviteTpl]   = useState(ec.inviteTemplate || "Vážený/á {{jmeno}},\n\nsrdečně Vás zveme na {{nazev_akce}}, která se koná {{datum}} v {{misto}}.\n\n{{program}}\n\nDress code: {{dress_code}}\n\nTěšíme se na Vás!\nTým S&W automobily");
  const [golfStart,   setGolfStart]   = useState(ec.golfStartType || "interval"); // "interval" | "canon"
  const [participation, setParticipation] = useState(ec.participation || { enabled: false, basePrice: 0, items: [] });

  const isGolf = info.activityType === "golf";

  const addF = (type) => setFields((f) => [...f, { id: uid(), type, label: "", required: false, options: "", target: fieldTarget }]);
  const updF = (id, p) => setFields((f) => f.map((x) => x.id === id ? { ...x, ...p } : x));
  const delF = (id) => {
    if (isEdit && hasParts) {
      const used = (ec.parts || []).some(p => p.data && p.data[id] != null && p.data[id] !== "");
      if (used && !window.confirm("Toto pole už má vyplněná data u přihlášených zákazníků. Smazáním se tato data ztratí (osiří). Opravdu smazat?")) return;
    }
    setFields((f) => f.filter((x) => x.id !== id));
  };

  const togglePreset = (presetId) => {
    setEquipment((eq) =>
      eq.some((e) => e.presetId === presetId)
        ? eq.filter((e) => e.presetId !== presetId)
        : [...eq, { id: uid(), presetId, label: EQ_PRESETS.find((p) => p.id === presetId)?.label || "", rentPrice: null, ourCost: null, custom: false }]
    );
  };
  const addCustomEq = () => setEquipment((eq) => [...eq, { id: uid(), presetId: null, label: "", rentPrice: null, ourCost: null, custom: true }]);
  const updEq = (id, patch) => setEquipment((eq) => eq.map((e) => e.id === id ? { ...e, ...patch } : e));
  const delEq = (id) => {
    if (isEdit && hasParts) {
      const used = (ec.parts || []).some(p => p.eqChoice && p.eqChoice[id]);
      if (used && !window.confirm("Tuto volbu vybavení si už zvolil někdo z přihlášených. Smazáním se jeho volba ztratí. Opravdu smazat?")) return;
    }
    setEquipment((eq) => eq.filter((e) => e.id !== id));
  };

  const addPartItem = () => setParticipation((p) => ({ ...p, items: [...p.items, { id: uid(), label: "", price: 0 }] }));
  const updPartItem = (id, patch) => setParticipation((p) => ({ ...p, items: p.items.map((i) => i.id === id ? { ...i, ...patch } : i) }));
  const delPartItem = (id) => setParticipation((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  const toggleReminder = (key) => setReminders((r) => ({ ...r, [key]: !r[key] }));
  const addCustomDay = () => setReminders((r) => ({ ...r, rCustom: [...r.rCustom, { id: uid(), days: 3, dir: "before", text: "" }] }));
  const updCustomDay = (id, patch) => setReminders((r) => ({ ...r, rCustom: r.rCustom.map((d) => d.id === id ? { ...d, ...patch } : d) }));
  const delCustomDay = (id) => setReminders((r) => ({ ...r, rCustom: r.rCustom.filter((d) => d.id !== id) }));

  const ok1 = info.name && info.date && info.capacity > 0;
  const ok2 = fields.length > 0 && fields.every((f) => f.label.trim());

  const TPL_VARS = ["{{jmeno}}", "{{prijmeni}}", "{{nazev_akce}}", "{{datum}}", "{{misto}}", "{{program}}", "{{dress_code}}", "{{flight_cas}}", "{{organizator_tel}}"];

  const create = () => {
    const nameId  = fields.find((f) => f.type === "text")?.id  || fields[0].id;
    const emailId = fields.find((f) => f.type === "email")?.id;
    const phoneId = fields.find((f) => f.type === "phone")?.id;
    const hcpId   = fields.find((f) => f.label.toLowerCase().includes("hcp") || f.label.toLowerCase().includes("handicap"))?.id;

    if (isEdit) {
      // zachovej všechna existující data akce, aktualizuj jen editované části
      onCreate({
        ...ec,
        ...info,
        approver: (info.approvers || [])[0] || "mira",
        fields, equipment,
        testCars: info.activityType === "testjizda" ? testCars.filter((car) => car.model?.trim()) : (ec.testCars || []),
        fieldMeta: { ...(ec.fieldMeta || {}), nameId, emailId, phoneId, hcpId },
        inviteMode, inviteTemplate: inviteTpl,
        reminders, golfStartType: golfStart,
        participation,
      });
      return;
    }

    onCreate({
      id: uid(), ...info, approver: (info.approvers||[])[0] || "mira", owner: "me", fields, parts: [], groups: [], equipment,
      fieldMeta: { nameId, emailId, phoneId, hcpId },
      startTime: "08:00", interval: 15,
      // testovací jízdy — auta a časy z průvodce
      testCars: info.activityType === "testjizda" ? testCars.filter((car) => car.model?.trim()) : [],
      driveStart: "09:00", driveEnd: "16:00", driveInterval: info.driveInterval || 30, drivePrep: info.drivePrep ?? 5, reservations: [], guestMode: info.guestMode || "invited",
      inviteMode, inviteTemplate: inviteTpl,
      reminders, golfStartType: golfStart,
      participation,
      leads: [],
      needs: { items: [] },
      team: { members: [], teamsUrl: "", multiDay: false },
      invite: { bgColor: "#1a3d24", headerImg: "", fontFamily: "Georgia, serif", fontSize: 15, blocks: [{ id: uid(), type: "text", content: "Vážený/á {{jmeno}},\n\nsrdečně Vás zveme na {{nazev_akce}}.", align: "left", bold: false, size: 14, color: "#e4e8de" }, { id: uid(), type: "infobox", items: [{ icon: "📅", label: "Datum", value: "{{datum}}" }, { icon: "📍", label: "Místo", value: "{{misto}}" }] }, { id: uid(), type: "button", label: "Přidat do kalendáře", url: "{{kalendar_odkaz}}", color: "#c8a044" }, { id: uid(), type: "confirm", label: "✅ Potvrdit účast", url: "{{potvrdit_odkaz}}", color: "#2e7d54" }, { id: uid(), type: "decline", label: "✖ Nemohu se zúčastnit", url: "{{odmitnout_odkaz}}", color: "#b4483a" }] },
      survey: { fields: [], responses: [], sent: false, sentAt: null },
      budget: { eventBudget: 0, items: [] },
    });
  };

  const stepLabel = ["Základní údaje", "Pole formuláře", "Vybavení & participace", "Pozvánka & připomínky", "Shrnutí"];

  return (
    <Modal title={isEdit ? `Upravit akci · krok ${step}/${TOTAL_STEPS}` : `Nová akce · krok ${step}/${TOTAL_STEPS}`} onClose={onClose} wide>
      {/* wizard steps indicator */}
      <div style={{ display: "flex", marginBottom: 20, borderBottom: `1px solid ${T.line}`, paddingBottom: 12 }}>
        {stepLabel.map((l, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: step === i+1 ? T.brass : step > i+1 ? T.greenLite : T.textDim, fontWeight: step === i+1 ? 700 : 400 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: step === i+1 ? T.brass : step > i+1 ? T.greenLite : T.line, color: step >= i+1 ? T.bg : T.textDim, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{step > i+1 ? "✓" : i+1}</div>
            <div style={{ fontSize: 10.5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── KROK 1 — základní údaje ── */}
      {step === 1 && (
        <>
          <FRow label="Název akce"><input style={inputStyle} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} placeholder="Golfový den" /></FRow>
          <div style={{ display: "flex", gap: 12 }}>
            <FRow label="Datum"><input type="date" style={{...inputStyle, colorScheme: "dark"}} value={info.date} onChange={(e) => setInfo({ ...info, date: e.target.value })} /></FRow>
            <FRow label="Max. míst"><input type="number" min={1} max={999} style={{ ...inputStyle, maxWidth: 100 }} value={info.capacity} onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) setInfo({ ...info, capacity: v }); }} /></FRow>
          </div>
          <FRow label="Místo"><input style={inputStyle} value={info.place} onChange={(e) => setInfo({ ...info, place: e.target.value })} placeholder="Golf Resort Karlštejn" /></FRow>
          <div style={{ display: "flex", gap: 12 }}>
            <FRow label="Typ akce">
              <select style={inputStyle} value={info.activityType} onChange={(e) => setInfo({ ...info, activityType: e.target.value, customType: "" })}>
                {ACTIVITY_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                <option value="custom">✏️ Vlastní…</option>
              </select>
              {info.activityType === "custom" && (
                <input style={{ ...inputStyle, marginTop: 6 }} value={info.customType || ""} onChange={(e) => setInfo({ ...info, customType: e.target.value })} placeholder="Název typu akce…" />
              )}
            </FRow>
            <FRow label="Schvalovatelé (lze vybrat více)">
              <div style={{ display: "flex", flexDirection: "column", gap: 5, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 10px" }}>
                {APPROVERS.map((a) => (
                  <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: info.approvers?.includes(a.id) ? T.cream : T.textDim }}>
                    <input type="checkbox" checked={info.approvers?.includes(a.id) || false} onChange={(e) => {
                      const cur = info.approvers || [];
                      setInfo({ ...info, approvers: e.target.checked ? [...cur, a.id] : cur.filter((x) => x !== a.id) });
                    }} />
                    <span style={{ fontWeight: info.approvers?.includes(a.id) ? 600 : 400 }}>{a.name}</span>
                    <span style={{ fontSize: 11, color: T.textDim }}>— {a.role}</span>
                  </label>
                ))}
              </div>
            </FRow>
          </div>
          <FRow label="Oddělení akce (koho se týká)">
            <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 7 }}>Vyberte, kterých oddělení se akce týká. Prázdné = všechna oddělení.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {EVENT_DEPTS.map((d) => {
                const on = info.departments?.includes(d.id);
                return (
                  <label key={d.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", background: on ? `${T.brass}18` : T.bg, border: `1px solid ${on ? T.brass : T.line}`, borderRadius: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={on || false} onChange={(e) => {
                      const cur = info.departments || [];
                      setInfo({ ...info, departments: e.target.checked ? [...cur, d.id] : cur.filter((x) => x !== d.id) });
                    }} />
                    <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? T.cream : T.textDim }}>{d.label}</span>
                  </label>
                );
              })}
            </div>
          </FRow>
          {info.activityType === "testjizda" && (
            <FRow label="Kdo přijde na zkušební jízdy 🚗">
              <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 7 }}>Určuje, jestli půjde předvyplnit hosty do skenovačky. Auta se posílají vždy.</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { k: "invited", t: "Pozvaní hosté", d: "Víš dopředu, kdo přijde (pozvánky). Hosty lze předvyplnit do skenovačky." },
                  { k: "public",  t: "Veřejná akce",  d: "Přijde kdokoli. Zákazníci se naberou až na místě přes sken." },
                ].map((o) => {
                  const on = (info.guestMode || "invited") === o.k;
                  return (
                    <div key={o.k} onClick={() => setInfo({ ...info, guestMode: o.k })} style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: `2px solid ${on ? T.brass : T.line}`, background: on ? `${T.brass}12` : T.bg, cursor: "pointer" }}>
                      <div style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? T.brass : T.cream, marginBottom: 3 }}>{o.t}</div>
                      <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.4 }}>{o.d}</div>
                    </div>
                  );
                })}
              </div>
            </FRow>
          )}
          {info.activityType === "testjizda" && (
            <FRow label="Vozidla na testovací jízdy 🚗">
              <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 7 }}>Přidej auta, která ten den pojedou (můžeš i později v sekci Rezervace jízd). Max 10.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {testCars.map((car, i) => (
                  <div key={car.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>🚗</span>
                    <input value={car.model} onChange={(e) => setTestCars(testCars.map((x, j) => j === i ? { ...x, model: e.target.value } : x))} placeholder="Model vozu" style={{ ...inputStyle, flex: 2, padding: "5px 8px", fontSize: 13 }} />
                    <input value={car.spz} onChange={(e) => setTestCars(testCars.map((x, j) => j === i ? { ...x, spz: e.target.value } : x))} placeholder="SPZ" style={{ ...inputStyle, width: 100, padding: "5px 8px", fontSize: 13 }} />
                    <button onClick={() => setTestCars(testCars.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, padding: 4 }}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              {testCars.length < 10 && <div style={{ marginTop: 7 }}><Btn kind="ghost" icon={Plus} small onClick={() => setTestCars([...testCars, mkCar("")])}>Přidat vůz</Btn></div>}
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <div style={{ width: 140 }}><label style={lbl}>Délka jízdy</label>
                  <select style={inputStyle} value={info.driveInterval || 30} onChange={(e) => setInfo({ ...info, driveInterval: +e.target.value })}>
                    {DRIVE_INTERVALS.map((m) => <option key={m} value={m}>{m} min</option>)}
                  </select>
                </div>
                <div style={{ width: 160 }}><label style={lbl}>❗ Čas na přípravu vozu</label>
                  <select style={inputStyle} value={info.drivePrep ?? 5} onChange={(e) => setInfo({ ...info, drivePrep: +e.target.value })}>
                    {PREP_TIMES.map((m) => <option key={m} value={m}>{m === 0 ? "bez rezervy" : `+${m} min`}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 6, lineHeight: 1.4 }}>❗ Čas na přípravu = rezerva za každou jízdou, kdyby se kolona zpozdila nebo někdo přijel pozdě.</div>
            </FRow>
          )}
          {isGolf && (
            <div style={{ marginTop: 8 }}>
              <label style={lbl}>Typ startu ⛳</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ k: "interval", l: "🕐 Intervalový start", d: "Hráči startují po flightech v pravidelném intervalu (5–30 min)" },
                  { k: "canon",    l: "💥 Canon start",       d: "Všichni hráči startují najednou ve stejný čas" }].map((o) => (
                  <button key={o.k} onClick={() => setGolfStart(o.k)} style={{ flex: 1, padding: "10px 12px", border: `2px solid ${golfStart === o.k ? T.brass : T.line}`, borderRadius: 9, background: golfStart === o.k ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: golfStart === o.k ? 700 : 400, color: golfStart === o.k ? T.brass : T.cream, marginBottom: 3 }}>{o.l}</div>
                    <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5 }}>{o.d}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <FRow label="Interní poznámka k akci (vidí jen tým)">
            <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={info.notes || ""} onChange={(e) => setInfo({ ...info, notes: e.target.value })} placeholder="Půjčíme 6 golfových vozíků po 500 Kč/ks, zákazníkovi účtujeme 600 Kč…" />
          </FRow>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
            <Btn kind="primary" disabled={!ok1} onClick={() => setStep(2)}>Dál →</Btn>
          </div>
        </>
      )}

      {/* ── KROK 2 — pole formuláře ── */}
      {step === 2 && (
        <>
          {isEdit && hasParts && (
            <div style={{ background: `${T.brass}14`, border: `1px solid ${T.brass}55`, borderRadius: 9, padding: "9px 13px", marginBottom: 12, fontSize: 12, color: T.cream, lineHeight: 1.6 }}>
              ⚠️ Akce už má <b>{partCount}</b> {partCount === 1 ? "přihlášeného zákazníka" : partCount < 5 ? "přihlášené zákazníky" : "přihlášených zákazníků"}. Přidávat a přejmenovávat pole je bezpečné. Mazání pole s vyplněnými daty si vyžádá potvrzení — data se ztratí.
            </div>
          )}
          <div style={{ fontSize: 12.5, color: T.textDim, marginBottom: 10 }}>Přidejte pole pro obě skupiny — zákazník vyplní svá online, prodejce vyplní interní při přidávání zákazníka.</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[{ k: "customer", l: "👤 Pole zákazníka", d: "Vyplní zákazník při potvrzení účasti online" }, { k: "internal", l: "🔒 Interní pole", d: "Vyplní prodejce při přidávání zákazníka" }].map((o) => (
              <button key={o.k} onClick={() => setFieldTarget(o.k)} style={{ flex: 1, padding: "8px 10px", border: `2px solid ${fieldTarget === o.k ? T.brass : T.line}`, borderRadius: 8, background: fieldTarget === o.k ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <div style={{ fontSize: 12.5, fontWeight: fieldTarget === o.k ? 700 : 400, color: fieldTarget === o.k ? T.brass : T.cream }}>{o.l}</div>
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{o.d}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {FIELD_TYPES.map((ft) => (
              <button key={ft.id} onClick={() => addF(ft.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 9px", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 7, color: T.cream, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <ft.icon size={12} color={T.brass} />{ft.label}<Plus size={11} color={T.textDim} />
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 280, overflowY: "auto", marginBottom: 14 }}>
            {fields.map((f) => {
              const meta = FIELD_TYPES.find((t) => t.id === f.type);
              return (
                <div key={f.id} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: 9 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, color: T.brass, border: `1px solid ${T.line}`, padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap" }}>
                      <meta.icon size={10} />{meta.label}
                    </span>
                    <span style={{ fontSize: 10, color: f.target === "internal" ? T.brass : T.info, background: f.target === "internal" ? `${T.brass}18` : `${T.info}18`, border: `1px solid ${f.target === "internal" ? T.brass : T.info}44`, padding: "1px 6px", borderRadius: 6, whiteSpace: "nowrap" }}>{f.target === "internal" ? "🔒 int." : "👤 zák."}</span>
                    <input value={f.label} placeholder="Název pole…" onChange={(e) => updF(f.id, { label: e.target.value })} style={{ ...inputStyle, padding: "5px 8px", fontSize: 12.5 }} />
                    <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: f.required ? T.brass : T.textDim, cursor: "pointer", whiteSpace: "nowrap" }}>
                      <input type="checkbox" checked={f.required} onChange={(e) => updF(f.id, { required: e.target.checked })} />povinné
                    </label>
                    <button onClick={() => delF(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
                  </div>
                  {f.type === "select" && (
                    <input value={f.options} placeholder="Možnosti oddělené čárkou" onChange={(e) => updF(f.id, { options: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 11.5, marginTop: 6 }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn kind="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>Zpět</Btn>
            <Btn kind="primary" disabled={!ok2} onClick={() => setStep(3)}>Dál →</Btn>
          </div>
        </>
      )}

      {/* ── KROK 3 — vybavení & participace ── */}
      {step === 3 && (
        <>
          {isEdit && hasParts && (
            <div style={{ background: `${T.brass}14`, border: `1px solid ${T.brass}55`, borderRadius: 9, padding: "9px 13px", marginBottom: 12, fontSize: 12, color: T.cream, lineHeight: 1.6 }}>
              ⚠️ Akce má přihlášené zákazníky. Přidat nové volby vybavení je bezpečné. Mazání volby, kterou si už někdo zvolil, si vyžádá potvrzení.
            </div>
          )}
          {/* vybavení zákazníka */}
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 8 }}>Volby vybavení pro zákazníka</div>
          <div style={{ fontSize: 12, color: T.textDim, marginBottom: 10 }}>Zákazník si zvolí při potvrzení účasti. Každá volba může mít cenu pro zákazníka a naši pořizovací cenu (marže se počítá automaticky).</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {EQ_PRESETS.map((p) => {
              const active = equipment.some((e) => e.presetId === p.id);
              return (
                <button key={p.id} onClick={() => togglePreset(p.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: active ? `${T.brass}22` : T.bg, border: `1px solid ${active ? T.brass : T.line}`, borderRadius: 8, color: active ? T.brass : T.textDim, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                  <span>{p.icon}</span>{p.label}{active && <Check size={13} />}
                </button>
              );
            })}
          </div>
          {equipment.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, padding: "6px 10px", fontSize: 10.5, color: T.textDim, letterSpacing: 0.3 }}>
                <span>VOLBA</span><span>NAŠE CENA (Kč)</span><span>CENA PRO ZÁKAZNÍKA (Kč)</span><span></span>
              </div>
              {equipment.map((eq) => {
                const preset = EQ_PRESETS.find((p) => p.id === eq.presetId);
                const margin = (eq.rentPrice || 0) - (eq.ourCost || 0);
                return (
                  <div key={eq.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, alignItems: "center", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 10px", marginBottom: 7 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 18 }}>{preset?.icon || "📦"}</span>
                      {eq.custom
                        ? <input value={eq.label} placeholder="Název…" onChange={(e) => updEq(eq.id, { label: e.target.value })} style={{ ...inputStyle, padding: "5px 8px", fontSize: 13 }} />
                        : <span style={{ fontSize: 13, fontWeight: 500 }}>{eq.label}</span>
                      }
                    </div>
                    <input type="number" value={eq.ourCost === null ? "" : eq.ourCost} onChange={(e) => updEq(eq.id, { ourCost: e.target.value === "" ? null : +e.target.value })} placeholder="0" style={{ ...inputStyle, padding: "5px 8px", fontSize: 12 }} />
                    <div>
                      <input type="number" value={eq.rentPrice === null ? "" : eq.rentPrice} onChange={(e) => updEq(eq.id, { rentPrice: e.target.value === "" ? null : +e.target.value })} placeholder="0" style={{ ...inputStyle, padding: "5px 8px", fontSize: 12 }} />
                      {eq.ourCost > 0 && eq.rentPrice > 0 && (
                        <div style={{ fontSize: 10, color: margin >= 0 ? T.greenLite : T.danger, marginTop: 2 }}>marže: {margin >= 0 ? "+" : ""}{czk(margin)}</div>
                      )}
                    </div>
                    <button onClick={() => delEq(eq.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={14} /></button>
                  </div>
                );
              })}
            </div>
          )}
          <Btn kind="ghost" icon={Plus} small onClick={addCustomEq}>Přidat vlastní volbu</Btn>

          {/* participace zákazníka */}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.brass }}>💰 Participace zákazníka</div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: participation.enabled ? T.brass : T.textDim }}>
                <input type="checkbox" checked={participation.enabled} onChange={(e) => setParticipation({ ...participation, enabled: e.target.checked })} />
                Zákazník přispívá na náklady
              </label>
            </div>
            {participation.enabled && (
              <>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <FRow label="Základní příspěvek na zákazníka (Kč)">
                    <input type="number" value={participation.basePrice} onChange={(e) => setParticipation({ ...participation, basePrice: +e.target.value })} placeholder="0" style={inputStyle} />
                  </FRow>
                </div>
                <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>Volitelné placené položky (zákazník si vybere při registraci):</div>
                {participation.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
                    <input value={item.label} onChange={(e) => updPartItem(item.id, { label: e.target.value })} placeholder="Golfový vozík" style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" value={item.price} onChange={(e) => updPartItem(item.id, { price: +e.target.value })} placeholder="Kč" style={{ ...inputStyle, width: 100 }} />
                    <span style={{ fontSize: 11.5, color: T.textDim, whiteSpace: "nowrap" }}>Kč / zákazník</span>
                    <button onClick={() => delPartItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
                  </div>
                ))}
                <Btn kind="ghost" icon={Plus} small onClick={addPartItem}>Přidat položku</Btn>
              </>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Btn kind="ghost" icon={ArrowLeft} onClick={() => setStep(2)}>Zpět</Btn>
            <Btn kind="primary" onClick={() => setStep(4)}>Dál →</Btn>
          </div>
        </>
      )}

      {/* ── KROK 4 — pozvánka & připomínky ── */}
      {step === 4 && (
        <>
          {/* mode odeslání pozvánek */}
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 8 }}>Způsob odesílání pozvánek</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[{ k: "batch", l: "📦 Hromadně", d: "Pozvánky se hromadí, schvalovatel je odešle najednou tlačítkem" },
              { k: "auto",  l: "⚡ Ihned",    d: "Pozvánka odejde automaticky ihned po schválení každého zákazníka" }].map((o) => (
              <button key={o.k} onClick={() => setInviteMode(o.k)} style={{ flex: 1, padding: "10px 12px", border: `2px solid ${inviteMode === o.k ? T.brass : T.line}`, borderRadius: 9, background: inviteMode === o.k ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: inviteMode === o.k ? 700 : 400, color: inviteMode === o.k ? T.brass : T.cream, marginBottom: 3 }}>{o.l}</div>
                <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5 }}>{o.d}</div>
              </button>
            ))}
          </div>

          {/* šablona pozvánky */}
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 6 }}>Šablona e-mailu pozvánky</div>
          <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8, lineHeight: 1.6 }}>
            Použijte proměnné — systém je nahradí skutečnými daty zákazníka a akce:
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
              {TPL_VARS.map((v) => (
                <code key={v} onClick={() => setInviteTpl((t) => t + v)} style={{ fontSize: 11, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", color: T.brass }}>{v}</code>
              ))}
            </div>
          </div>
          <textarea
            rows={7}
            value={inviteTpl}
            onChange={(e) => setInviteTpl(e.target.value)}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.7, marginBottom: 16 }}
          />

          {/* připomínky */}
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 8 }}>Automatické připomínky zákazníkovi</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10 }}>
            {[
              { key: "r0",      label: "✉️ Potvrzení účasti",        suffix: "ihned po schválení",  daysKey: null },
              { key: "r14",     label: "⛳ HCP výzva",                daysKey: "r14days", defaultDays: 14, golf: true },
              { key: "r7",      label: "📍 Připomínka s navigací",   daysKey: "r7days",  defaultDays: 7  },
              { key: "r1",      label: "⏰ Finální připomínka",       daysKey: "r1days",  defaultDays: 1  },
              { key: "rAfter1", label: "📋 Dotazník spokojenosti",   suffix: "den po akci",          daysKey: null },
            ].map((r) => (
              (!r.golf || isGolf) && (
                <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", background: reminders[r.key] ? `${T.greenLite}10` : T.bg, border: `1px solid ${reminders[r.key] ? T.greenLite : T.line}`, borderRadius: 8 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={!!reminders[r.key]} onChange={() => toggleReminder(r.key)} />
                    <span style={{ color: reminders[r.key] ? T.cream : T.textDim }}>{r.label}</span>
                  </label>
                  {r.daysKey ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      <input type="number" min={1} max={365} value={reminders[r.daysKey] ?? r.defaultDays}
                        onChange={(e) => setReminders(prev => ({...prev, [r.daysKey]: +e.target.value}))}
                        style={{ ...inputStyle, width: 55, padding: "3px 6px", fontSize: 12, textAlign: "center" }} />
                      <span style={{ fontSize: 11.5, color: T.textDim, whiteSpace: "nowrap" }}>dní před</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11.5, color: T.textDim, flexShrink: 0 }}>{r.suffix}</span>
                  )}
                </div>
              )
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.textDim, marginBottom: 6 }}>Vlastní připomínka (počet dní před/po akci):</div>
          {reminders.rCustom.map((d) => (
            <div key={d.id} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" min={1} max={365} value={d.days} onChange={(e) => updCustomDay(d.id, { days: +e.target.value })} style={{ ...inputStyle, width: 70 }} />
                <select value={d.dir} onChange={(e) => updCustomDay(d.id, { dir: e.target.value })} style={{ ...inputStyle, width: "auto" }}>
                  <option value="before">dní před akcí</option>
                  <option value="after">dní po akci</option>
                </select>
                <button onClick={() => delCustomDay(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
              </div>
              <input
                value={d.text || ""}
                onChange={(e) => updCustomDay(d.id, { text: e.target.value })}
                placeholder="Text připomínky pro zákazníka (povinné)…"
                style={{ ...inputStyle, padding: "5px 9px", fontSize: 12.5 }}
              />
              {!d.text && <div style={{ fontSize: 11, color: T.danger }}>Text připomínky je povinný</div>}
            </div>
          ))}
          <Btn kind="ghost" icon={Plus} small onClick={addCustomDay}>Přidat vlastní připomínku</Btn>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Btn kind="ghost" icon={ArrowLeft} onClick={() => setStep(3)}>Zpět</Btn>
            <Btn kind="primary" onClick={() => setStep(5)}>Dál →</Btn>
          </div>
        </>
      )}

      {/* ── KROK 5 — shrnutí ── */}
      {step === 5 && (
        <>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 14 }}>Shrnutí akce</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              ["Název", info.name],
              ["Datum", fmt(info.date)],
              ["Místo", info.place],
              ["Kapacita", `${info.capacity} míst`],
              ["Typ akce", ACTIVITY_TYPES.find((t) => t.id === info.activityType)?.label || info.customType],
              ["Schvalovatelé", (info.approvers || []).map((id) => APPROVERS.find((a) => a.id === id)?.name).filter(Boolean).join(", ")],
              ["Oddělení akce", (info.departments || []).length ? info.departments.map(eventDeptLabel).join(", ") : "Všechna"],
              ["Odeslání pozvánek", inviteMode === "batch" ? "Hromadně tlačítkem" : "Ihned po schválení"],
              ["Start (Golf)", isGolf ? (golfStart === "interval" ? "Intervalový" : "Canon start") : "—"],
              ["Participace", participation.enabled ? `${czk(participation.basePrice)} + ${participation.items.length} položek` : "Ne"],
              ["Připomínky", Object.entries(reminders).filter(([k, v]) => k !== "rCustom" && v).length + reminders.rCustom.length + " aktivních"],
            ].map(([l, v]) => (
              <div key={l} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 7, padding: "7px 11px" }}>
                <div style={{ fontSize: 10.5, color: T.textDim, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 13, color: T.cream, fontWeight: 500 }}>{v || "—"}</div>
              </div>
            ))}
          </div>
          {info.notes && (
            <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "9px 12px", marginBottom: 14, fontSize: 12.5, color: T.creamDim, lineHeight: 1.7 }}>
              📝 {info.notes}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <Btn kind="ghost" icon={ArrowLeft} onClick={() => setStep(4)}>Zpět</Btn>
            <Btn kind="green" icon={Check} onClick={create}>{isEdit ? "Uložit změny" : "Vytvořit akci"}</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}


function Detail({ c, role, used, crossMap, blocked, onBack, onUpdate, onRemind }) {
  const [tab,      setTab]      = useState("list");
  const [adding,   setAdding]   = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState("vse"); // "vse" | dept name
  const [hcpModal, setHcpModal] = useState(null);
  const [dupErr,   setDupErr]   = useState("");

  const full       = used >= c.capacity;
  const isGolf     = c.activityType === "golf";
  const { nameId, emailId, phoneId, hcpId } = c.fieldMeta;
  const waitCount  = c.parts.filter((p) => p.state === "ceka").length;
  const canApprove = role === "admin" || role === "approver";
  const canEdit    = role === "admin" || role === "approver";
  const isMgmt     = role === "admin" || role === "approver";
  const apIds      = (c.approvers && c.approvers.length) ? c.approvers : [c.approver].filter(Boolean);
  const apNames    = apIds.map((id) => APPROVERS.find((a) => a.id === id)?.name).filter(Boolean).join(", ");

  // prodejce/hosteska smí "list", "leads" a u testovacích jízd i "drive" (jen ke čtení)
  const canSeeDrive = ACTIVITY_TYPES.find((t) => t.id === c.activityType)?.hasReservation;
  React.useEffect(() => {
    if (isMgmt) return;
    const ok = tab === "list" || tab === "leads" || (tab === "drive" && canSeeDrive);
    if (!ok) setTab("list");
  }, [isMgmt, tab, canSeeDrive]);

  const addPart = (data, eqChoice = {}, customerInfo = {}) => {
    const email = (data[emailId] || "").trim().toLowerCase();
    if (email && c.parts.some((p) => (p.data[emailId] || "").toLowerCase() === email)) {
      setDupErr(`${data[emailId]} už je v akci.`); return false;
    }
    setDupErr("");
    const adderUser = USERS_SEED.find(u => u.role === role) || null;
    const adderDepts = adderUser?.depts && adderUser.depts.length ? adderUser.depts : [];
    onUpdate((camp) => ({ ...camp, parts: [...camp.parts, { id: uid(), state: "ceka", note: `Přidal: ${role}`, addedBy: { userId: adderUser?.id || null, name: adderUser?.name || role, dept: adderUser?.dept || "", depts: adderDepts, role: adderUser?.role || role }, assignedTo: adderUser?.id || null, flight: null, hcp: "", group: null, eqChoice, crm: {}, customerInfo, data }] }));
    return true;
  };

  const approve  = (pid) => {
    const newState = c.inviteMode === "batch" ? "schvaleno" : "prihlasen";
    onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, state: newState } : p) }));
    if (newState === "prihlasen") {
      const p = c.parts.find((x) => x.id === pid);
      if (p) alert(`[Mock EmailJS]\nKomu: ${p.data[c.fieldMeta?.emailId]}\nPředmět: Pozvánka na ${c.name}`);
    }
  };
  const sendBatchInvites = () => {
    const pending = c.parts.filter((p) => p.state === "schvaleno");
    if (!pending.length) return;
    onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.state === "schvaleno" ? { ...p, state: "prihlasen" } : p) }));
    alert(`[Mock EmailJS]\nHromadně odesláno ${pending.length} pozvánek na akci ${c.name}.`);
  };
  const resendInvite = (pid) => {
    const p = c.parts.find((x) => x.id === pid);
    if (p) alert(`[Mock EmailJS]\nKomu: ${p.data[c.fieldMeta?.emailId]}\nPředmět: Pozvánka na ${c.name} (opakované zaslání)`);
  };
  const reject   = (pid) => onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, state: "zrusil", note: (p.note ? p.note + " · " : "") + "Zamítnuto schvalovatelem" } : p) }));
  const setState = (pid, s) => {
    if (s === "potvrzen" && isGolf) {
      const p = c.parts.find((x) => x.id === pid);
      if (!p?.hcp) { setHcpModal(pid); return; }
    }
    onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, state: s } : p) }));
  };
  const setHcp   = (pid, hcp) => { onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, hcp, state: "potvrzen" } : p) })); setHcpModal(null); };
  const setNote  = (pid, note) => onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, note } : p) }));
  const setCrm   = (pid, crm)  => onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, crm } : p) }));
  const setGroup = (pid, gid)  => onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, group: gid } : p) }));
  const remove   = (pid) => onUpdate((camp) => ({ ...camp, parts: camp.parts.filter((p) => p.id !== pid) }));
  const assign   = (pid, uid2) => onUpdate((camp) => ({ ...camp, parts: camp.parts.map((p) => p.id === pid ? { ...p, assignedTo: uid2 || null } : p) }));
  const currentUser = USERS_SEED.find(u => u.role === role) || null;
  const currentUserId = currentUser?.id || null;

  if (blocked) {
    return (
      <div>
        <Btn kind="ghost" icon={ArrowLeft} onClick={onBack}>Zpět</Btn>
        <div style={{ textAlign: "center", padding: "60px 20px", color: T.textDim }}>
          <Lock size={30} color={T.brass} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 16, color: T.cream, marginBottom: 4 }}>{c.name}</div>
          <div style={{ maxWidth: 240, margin: "12px auto 0" }}><CapBar used={used} cap={c.capacity} /></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* hlavička */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Btn kind="ghost" icon={ArrowLeft} onClick={onBack} small>Zpět</Btn>
            {(role === "admin") && <Btn kind="ghost" icon={Edit2} small onClick={() => setEditingCampaign(true)}>Upravit akci</Btn>}
            <a href={"https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(c.name) + "&dates=" + (c.date||"").replace(/-/g,"") + "T080000Z/" + (c.date||"").replace(/-/g,"") + "T180000Z&location=" + encodeURIComponent(c.place||"")} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", background: `${T.brass}15`, border: `1px solid ${T.brass}55`, borderRadius: 8, color: T.brass, fontSize: 12, textDecoration: "none", fontWeight: 500 }}>📅 Přidat do kalendáře</a>
          </div>
          <h2 style={{ margin: "0 0 2px", fontSize: 19, fontWeight: 600 }}>{c.name}</h2>
          <div style={{ fontSize: 12.5, color: T.textDim }}>
            {fmt(c.date)} · {c.place} · {ACTIVITY_TYPES.find((t) => t.id === c.activityType)?.label}
            {" · "}<span style={{ color: T.brass }}>schvaluje: {apNames || "—"}</span>
          </div>
        </div>
        <div style={{ width: 200 }}><CapBar used={used} cap={c.capacity} /></div>
      </div>

      {/* panel schválení */}
      {canApprove && waitCount > 0 && (() => {
        const waitParts = c.parts.filter((p) => p.state === "ceka");
        const depts = [...new Set(waitParts.map(p => p.addedBy?.dept || "Nezadáno"))];
        const filtered = approvalFilter === "vse" ? waitParts : waitParts.filter(p => {
          const dept = p.addedBy?.dept || "Nezadáno";
          return Array.isArray(approvalFilter) ? approvalFilter.includes(dept) : approvalFilter === dept;
        });
        return (
        <div style={{ background: `${T.purple}14`, border: `1px solid ${T.purple}44`, borderRadius: 10, padding: "11px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.purple, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><HelpCircle size={14} />{waitCount} zákazník{waitCount > 1 ? "ů čeká" : " čeká"} na schválení</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
              <Filter size={12} color={T.textDim} />
              <button onClick={() => setApprovalFilter("vse")} style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${approvalFilter === "vse" ? T.brass : T.line}`, background: approvalFilter === "vse" ? `${T.brass}18` : T.bg, color: approvalFilter === "vse" ? T.brass : T.textDim, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>Vše</button>
              {depts.map(d => {
                const active = Array.isArray(approvalFilter) ? approvalFilter.includes(d) : approvalFilter === d;
                return (
                  <button key={d} onClick={() => {
                    if (approvalFilter === "vse") { setApprovalFilter([d]); return; }
                    const cur = Array.isArray(approvalFilter) ? approvalFilter : [approvalFilter];
                    const next = cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d];
                    setApprovalFilter(next.length === 0 ? "vse" : next);
                  }} style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${active ? T.brass : T.line}`, background: active ? `${T.brass}18` : T.bg, color: active ? T.brass : T.textDim, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>
                    {d}
                  </button>
                );
              })}
            </div>
            <Btn kind="purple" icon={Mail} small onClick={onRemind} title={apNames ? `Schvalovatelé: ${apNames}` : ""}>Připomenout schvalovatelům</Btn>
          </div>
          {filtered.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 9, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 11px", marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{p.data[nameId] || "—"}</div>
                <div style={{ fontSize: 11.5, color: T.textDim }}>{p.data[emailId]}</div>
                {p.note && <div style={{ fontSize: 11, color: T.textDim }}>{p.note}{(() => { const adder = USERS_SEED.find(u => (p.note||"").includes(u.name)); return adder?.dept ? <span style={{ color: T.brass }}> | {adder.dept}</span> : ""; })()}</div>}
                {p.customerInfo?.ico && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: T.textDim }}>IČO: <b style={{ color: T.cream, fontFamily: "monospace" }}>{p.customerInfo.ico}</b></span>
                    {(() => { const adder = USERS_SEED.find(u => (p.note||"").includes(u.name)); return adder?.dept ? <span style={{ fontSize: 11, color: T.brass, marginLeft: 6 }}>Zadal: {adder.name} | {adder.dept}</span> : null; })()}
                  </div>
                )}
                {p.customerInfo?.type === "fo" && (
                  <span style={{ fontSize: 10.5, color: T.info, marginTop: 3, display: "inline-block" }}>👤 Fyzická osoba</span>
                )}
                {(p.addedBy?.depts || []).length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {p.addedBy.depts.map(id => <span key={id} style={{ fontSize: 10, fontWeight: 600, color: T.brass, background: `${T.brass}18`, border: `1px solid ${T.brass}44`, borderRadius: 5, padding: "1px 6px" }}>{id}</span>)}
                  </div>
                )}
              </div>
              <select value={p.assignedTo || ""} onChange={(e) => assign(p.id, e.target.value)} style={{ ...inputStyle, padding: "6px 8px", fontSize: 11.5, width: 160 }} title="Přiřadit prodejci">
                <option value="">— přiřadit prodejci —</option>
                {USERS_SEED.filter(u => u.role === "lite" && u.active).map(s => <option key={s.id} value={s.id}>{s.name}{s.depts?.length ? ` (${s.depts.join("/")})` : ""}</option>)}
              </select>
              <Btn kind="green" icon={Send} small onClick={() => approve(p.id)}>Schválit a pozvat</Btn>
              <Btn kind="danger" small onClick={() => reject(p.id)}>Zamítnout</Btn>
            </div>
          ))}
        </div>
        );})()}

      {/* záložky */}
      <div style={{ display: "flex", gap: 3, borderBottom: `1px solid ${T.line}`, marginBottom: 16, flexWrap: "wrap" }}>
        <DTab active={tab === "list"}   onClick={() => setTab("list")}   icon={ListOrdered} badge={waitCount}>Účastníci</DTab>
        {isMgmt && <DTab active={tab === "groups"} onClick={() => setTab("groups")} icon={FolderOpen}>Skupiny</DTab>}
        {isMgmt && <DTab active={tab === "needs"}  onClick={() => setTab("needs")}  icon={Layers}>Materiály</DTab>}
        {isMgmt && <DTab active={tab === "team"}   onClick={() => setTab("team")}   icon={UserCog}>Tým akce</DTab>}
        {isMgmt && <DTab active={tab === "budget"} onClick={() => setTab("budget")} icon={Wallet}>Rozpočet</DTab>}
        {isMgmt && <DTab active={tab === "invite"} onClick={() => setTab("invite")} icon={MailIcon}>Pozvánka</DTab>}
        {isMgmt && <DTab active={tab === "survey"} onClick={() => setTab("survey")} icon={ClipboardList}>Dotazník</DTab>}
        <DTab active={tab === "leads"} onClick={() => setTab("leads")} icon={TrendingUp} badge={(c.leads||[]).length}>Leady</DTab>
        {isMgmt && <DTab active={tab === "report"} onClick={() => setTab("report")} icon={BarChart3}>Report</DTab>}
        {isMgmt && ACTIVITY_TYPES.find((t) => t.id === c.activityType)?.hasStartList && (
          <DTab active={tab === "start"} onClick={() => setTab("start")} icon={Flag}>Startovní listina</DTab>
        )}
        {ACTIVITY_TYPES.find((t) => t.id === c.activityType)?.hasReservation && (
          <DTab active={tab === "drive"} onClick={() => setTab("drive")} icon={CalendarCheck}>Rezervace jízd</DTab>
        )}
      </div>

      {tab === "list"   && <ParticipantList c={c} role={role} crossMap={crossMap} full={full} isGolf={isGolf} canEdit={canEdit} nameId={nameId} emailId={emailId} phoneId={phoneId} dupErr={dupErr} setState={setState} setNote={setNote} setGroup={setGroup} setCrm={setCrm} remove={remove} canApprove={canApprove} onAddOpen={() => setAdding(true)} onSendBatch={sendBatchInvites} onResend={resendInvite} inviteMode={c.inviteMode} assign={assign} currentUserId={currentUserId} />}
      {isMgmt && tab === "groups" && <GroupsTab c={c} canEdit={canEdit} nameId={nameId} onUpdate={onUpdate} setGroup={setGroup} />}
      {isMgmt && tab === "needs"  && <NeedsTab c={c} canEdit={canEdit} onUpdate={onUpdate} />}
      {isMgmt && tab === "team"   && <TeamTab c={c} canEdit={canEdit} onUpdate={onUpdate} />}
      {isMgmt && tab === "budget" && <BudgetTab c={c} canEdit={canEdit} onUpdate={onUpdate} />}
      {isMgmt && tab === "invite" && <InviteTab c={c} canEdit={canEdit} onUpdate={onUpdate} />}
      {isMgmt && tab === "survey" && <SurveyTab c={c} canEdit={canEdit} onUpdate={onUpdate} />}
      {tab === "leads"  && <LeadsTab c={c} role={role} onUpdate={onUpdate} />}
      {isMgmt && tab === "report" && <ReportTab c={c} />}
      {isMgmt && tab === "start"  && <StartList c={c} role={role} onUpdate={onUpdate} />}
      {tab === "drive" && ACTIVITY_TYPES.find((t) => t.id === c.activityType)?.hasReservation && <TestDriveGrid c={c} role={role} onUpdate={onUpdate} />}

      {editingCampaign && <CreateWizard editCampaign={c} onClose={() => setEditingCampaign(false)} onCreate={(updated) => { onUpdate(() => updated); setEditingCampaign(false); }} />}
      {adding   && <AddModal fields={c.fields} fieldMeta={c.fieldMeta} full={full} crossMap={crossMap} campEquipment={c.equipment || []} onClose={() => setAdding(false)} onAdd={(data, eq, info) => { if (addPart(data, eq, info)) setAdding(false); }} />}
      {hcpModal && <HcpModal onClose={() => setHcpModal(null)} onSave={(hcp) => setHcp(hcpModal, hcp)} />}
    </div>
  );
}

/* ════════════════════════════════════════
   ÚČASTNÍCI
════════════════════════════════════════ */
function ParticipantList({ c, role, crossMap, full, isGolf, canEdit, nameId, emailId, phoneId, dupErr, setState, setNote, setGroup, setCrm, remove, canApprove, onAddOpen, onSendBatch, onResend, inviteMode, assign, currentUserId }) {
  const [expandedCrm, setExpandedCrm] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const sellers = USERS_SEED.filter(u => u.role === "lite" && u.active);
  const canAssign = role === "admin" || role === "approver";
  // prodejce edituje jen zákazníky, které založil, nebo které mu přiřadili
  const canEditPart = (p) => {
    if (role !== "lite") return canEdit;
    return p.addedBy?.userId === currentUserId || p.assignedTo === currentUserId;
  };

  const toggleCrm = (pid) => setExpandedCrm(prev => prev === pid ? null : pid);

  return (
    <>
      <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
        <Btn kind={full ? "ghost" : "green"} icon={UserPlus} onClick={onAddOpen}>Přidat zákazníka</Btn>
        {canEdit && <Btn kind="ghost" icon={Download} onClick={() => exportCsv(c)}>Export CSV</Btn>}
        {canEdit && <Btn kind="ghost" icon={Download} onClick={() => exportExcel(c)}>Export Excel</Btn>}
        {canApprove && <Btn kind="ghost" icon={Bell} onClick={() => setStatusModal(true)}><Users size={14} /> Stav prodejcům</Btn>}
        {canApprove && inviteMode === "batch" && (() => {
          const cnt = c.parts.filter((p) => p.state === "schvaleno").length;
          return cnt > 0 ? (
            <Btn kind="primary" icon={Send} onClick={onSendBatch}>
              Odeslat pozvánky ({cnt} schválených)
            </Btn>
          ) : null;
        })()}
        {full && <span style={{ display: "flex", alignItems: "center", gap: 5, color: T.warn, fontSize: 13 }}><AlertTriangle size={14} /> Kapacita naplněna</span>}
      </div>
      {dupErr && <Banner color={T.danger} icon={AlertTriangle}>{dupErr}</Banner>}
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, overflow: "hidden" }}>
        {/* hlavička kompaktní */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, padding: "8px 14px", fontSize: 10.5, color: T.textDim, background: T.panel2, borderBottom: `1px solid ${T.line}`, letterSpacing: 0.3 }}>
          <span>JMÉNO / KATEGORIE</span><span>STAV</span><span></span>
        </div>
        {c.parts.map((p) => {
          const others = (crossMap[(p.data[emailId] || "").toLowerCase()] || []).filter((n) => n !== c.name);
          const crm = p.crm || {};
          const isExpanded = expandedCrm === p.id;
          const hasCrm = crm.category || crm.reason || (crm.purchases?.length > 0);
          return (
            <React.Fragment key={p.id}>
              {/* KOMPAKTNÍ ŘÁDEK */}
              <div
                onClick={() => toggleCrm(p.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: isExpanded ? "none" : `1px solid ${T.line}`, background: p.state === "ceka" ? `${T.purple}0a` : "transparent", cursor: "pointer" }}
              >
                {/* šipka */}
                <span style={{ color: isExpanded ? T.brass : T.textDim, fontSize: 11, flexShrink: 0, transition: "transform .2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                {/* jméno + badges */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5, color: T.cream }}>{p.data[nameId] || "—"}</span>
                  {others.length > 0 && <span style={{ fontSize: 10, color: T.brass, background: `${T.brass}18`, border: `1px solid ${T.brass}44`, padding: "1px 5px", borderRadius: 9 }}>+{others.length}</span>}
                  {crm.category && <span style={{ fontSize: 11, color: T.info, background: `${T.info}12`, border: `1px solid ${T.info}33`, padding: "2px 7px", borderRadius: 8, whiteSpace: "nowrap" }}>{crm.category}</span>}
                  {isGolf && p.hcp && <span style={{ fontSize: 11, color: T.brass }}>HCP {p.hcp}</span>}
                  {p.addedBy?.name && <span style={{ fontSize: 11, color: T.textDim }}>↳ {p.addedBy.name}{p.addedBy.dept ? ` | ${p.addedBy.dept}` : ""}</span>}
                  {partDivisions(p).map(id => (
                    <span key={id} style={{ fontSize: 10, fontWeight: 600, color: T.brass, background: `${T.brass}18`, border: `1px solid ${T.brass}44`, borderRadius: 5, padding: "1px 6px" }}>{id}</span>
                  ))}
                  {p.assignedTo && (() => { const asg = USERS_SEED.find(u => u.id === p.assignedTo); return asg ? <span style={{ fontSize: 10.5, color: T.info, background: `${T.info}15`, border: `1px solid ${T.info}44`, borderRadius: 5, padding: "1px 6px" }}>👤 {asg.name}</span> : null; })()}
                </div>
                {/* stav + akce — pevná šířka aby bylo vždy zarovnané */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  {canAssign && (
                    <select value={p.assignedTo || ""} onChange={(e) => assign(p.id, e.target.value)} style={{ ...inputStyle, padding: "5px 8px", fontSize: 11.5, width: 150 }} title="Přiřadit prodejci">
                      <option value="">— přiřadit prodejci —</option>
                      {sellers.map(s => <option key={s.id} value={s.id}>{s.name}{s.depts?.length ? ` (${s.depts.join("/")})` : ""}</option>)}
                    </select>
                  )}
                  <select value={p.state} onChange={(e) => setState(p.id, e.target.value)} style={{ ...inputStyle, padding: "5px 8px", fontSize: 12, width: 148 }} disabled={!canEditPart(p)}>
                    {STATE_ORDER.filter((s) => !(role === "lite" && s === "ceka")).map((s) => <option key={s} value={s}>{STATES[s].label}</option>)}
                  </select>
                  {/* vždy rezervované místo pro ✉ tlačítko */}
                  <div style={{ width: 32, display: "flex", justifyContent: "center" }}>
                    {canApprove && (p.state === "prihlasen" || p.state === "schvaleno") && (
                      <button onClick={() => p.state === "schvaleno" ? alert("Čeká na hromadné odeslání.") : onResend(p.id)} style={{ background: "none", border: `1px solid ${p.state === "schvaleno" ? T.greenLite : T.info}44`, borderRadius: 6, cursor: "pointer", padding: "4px 7px", color: p.state === "schvaleno" ? T.greenLite : T.info, fontSize: 12 }}>
                        {p.state === "schvaleno" ? "⏳" : "✉"}
                      </button>
                    )}
                  </div>
                  {/* vždy rezervované místo pro 🗑 tlačítko */}
                  <div style={{ width: 24, display: "flex", justifyContent: "center" }}>
                    {canEditPart(p) && <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, padding: "2px" }}><Trash2 size={14} /></button>}
                  </div>
                </div>
              </div>
              {/* CRM rozbalovací panel */}
              {isExpanded && (
                <div style={{ padding: "0 14px 14px 14px", borderBottom: `1px solid ${T.line}`, background: `${T.info}06` }}>
                  {/* rychlé detaily */}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "10px 0 12px 0", borderBottom: `1px solid ${T.line}`, marginBottom: 12 }}>
                    <div><div style={{ fontSize: 10, color: T.textDim, marginBottom: 2 }}>E-MAIL</div><div style={{ fontSize: 12.5, color: T.cream }}>{p.data[emailId] || "—"}</div></div>
                    <div><div style={{ fontSize: 10, color: T.textDim, marginBottom: 2 }}>TELEFON</div><div style={{ fontSize: 12.5, color: T.cream }}>{p.data[phoneId] || "—"}</div></div>
                    {isGolf && <div><div style={{ fontSize: 10, color: T.textDim, marginBottom: 2 }}>HCP</div><div style={{ fontSize: 12.5, color: p.hcp ? T.brass : T.textDim, fontWeight: 600 }}>{p.hcp || "—"}</div></div>}
                    <div><div style={{ fontSize: 10, color: T.textDim, marginBottom: 2 }}>SKUPINA</div>
                      {canEdit
                        ? <select value={p.group || ""} onChange={e => setGroup(p.id, e.target.value || null)} style={{ ...inputStyle, padding: "3px 7px", fontSize: 12 }}><option value="">—</option>{c.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
                        : <div style={{ fontSize: 12.5, color: T.cream }}>{c.groups.find(g => g.id === p.group)?.name || "—"}</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontSize: 10, color: T.textDim, marginBottom: 2 }}>POZNÁMKA</div>
                      <input value={p.note} placeholder="poznámka…" onChange={e => setNote(p.id, e.target.value)} style={{ ...inputStyle, padding: "3px 8px", fontSize: 12, width: "100%" }} readOnly={role === "lite"} />
                    </div>
                  </div>
                  <div style={{ background: T.bg, border: `1px solid ${T.info}33`, borderRadius: 10, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 14 }}>👤</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.cream }}>Profil zákazníka</span>
                      <span style={{ fontSize: 11, color: T.textDim, marginLeft: "auto" }}>vidí prodejce i schvalovatel</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {/* kategorie */}
                      <div>
                        <label style={lbl}>Kategorie zákazníka</label>
                        {canEdit
                          ? <select value={crm.category || ""} onChange={(e) => setCrm(p.id, { ...crm, category: e.target.value })} style={inputStyle}>
                              <option value="">— vyberte —</option>
                              {CRM_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                          : <div style={{ fontSize: 13, color: T.info }}>{crm.category || "—"}</div>
                        }
                      </div>
                      {/* vozy / nákupy */}
                      <div>
                        <label style={lbl}>Poslední nákupy / vozidla</label>
                        <div style={{ display: "flex", flex: "wrap", gap: 5, flexWrap: "wrap" }}>
                          {(crm.purchases || []).map((pu, i) => (
                            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: T.cream, background: T.panel, border: `1px solid ${T.line}`, padding: "3px 8px", borderRadius: 7 }}>
                              🚗 {pu.year} {pu.model}
                              {canEdit && <button onClick={() => setCrm(p.id, { ...crm, purchases: crm.purchases.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, padding: 0, fontSize: 12, lineHeight: 1 }}>×</button>}
                            </span>
                          ))}
                          {canEdit && <AddPurchaseInline crm={crm} onAdd={(pu) => setCrm(p.id, { ...crm, purchases: [...(crm.purchases || []), pu] })} />}
                        </div>
                      </div>
                      {/* důvod pozvání */}
                      <div>
                        <label style={lbl}>Důvod pozvání / popis vztahu</label>
                        {canEdit
                          ? <textarea value={crm.reason || ""} onChange={(e) => setCrm(p.id, { ...crm, reason: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical", fontSize: 12 }} placeholder="Např. Velkoodběratel, loni koupil GLE a GLS…" />
                          : <div style={{ fontSize: 12.5, color: T.creamDim, lineHeight: 1.7 }}>{crm.reason || "—"}</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        {c.parts.length === 0 && <div style={{ padding: 20, textAlign: "center", color: T.textDim, fontSize: 13 }}>Zatím žádní zákazníci.</div>}
      </div>
      <div style={{ fontSize: 11, color: T.textDim, marginTop: 8, lineHeight: 1.7 }}>
        Tlačítkem <b style={{ color: T.info }}>👤 profil</b> otevřete CRM kartu zákazníka — kategorii, historii nákupů a důvod pozvání.
        Flow: <StateBadge state="ceka" /> → schválení → <StateBadge state="prihlasen" /> → zákazník potvrdí → <StateBadge state="potvrzen" />{isGolf ? " + HCP" : ""}
      </div>
      {statusModal && <StatusToSellersModal c={c} onClose={() => setStatusModal(false)} />}
    </>
  );
}

function StatusToSellersModal({ c, onClose }) {
  // Přednastav oddělení podle akce; když akce nemá určená, nabídni všechna
  const eventDepts = (c.departments && c.departments.length) ? c.departments : EVENT_DEPTS.map(d => d.id);
  const [selDepts, setSelDepts] = useState(eventDepts);
  const [selSellers, setSelSellers] = useState([]);
  const [sent, setSent] = useState(false);

  // prodejci (lite) filtrovaní podle vybraných oddělení; dept u usera je textový (label nebo id)
  const matchesDept = (u) => {
    const ud = (u.dept || "").toLowerCase();
    return selDepts.some(id => ud === id.toLowerCase() || ud === eventDeptLabel(id).toLowerCase());
  };
  const sellers = USERS_SEED.filter(u => u.role === "lite" && u.active);
  const filteredSellers = sellers.filter(u => selDepts.length === 0 ? true : matchesDept(u));

  const toggleDept = (id) => setSelDepts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSeller = (id) => setSelSellers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const used = c.parts.filter(p => ["prihlasen", "potvrzen", "schvaleno"].includes(p.state)).length;
  const free = Math.max(0, (c.capacity || 0) - used);

  const recipients = selSellers.length
    ? sellers.filter(u => selSellers.includes(u.id))
    : filteredSellers;

  const send = () => setSent(true);

  return (
    <Modal title="Rozeslat stav obsazenosti prodejcům" onClose={onClose}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 15, color: T.cream, fontWeight: 600, marginBottom: 6 }}>Stav rozeslán {recipients.length} prodejcům</div>
          <div style={{ fontSize: 12.5, color: T.textDim, marginBottom: 16, lineHeight: 1.7 }}>
            Oddělení: {selDepts.map(eventDeptLabel).join(", ") || "všechna"}<br />
            Volných míst: <b style={{ color: T.greenLite }}>{free}</b> z {c.capacity}
          </div>
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 16 }}>[Mock] Skutečný e-mail se odešle po napojení EmailJS.</div>
          <Btn kind="green" icon={Check} onClick={onClose}>Zavřít</Btn>
        </div>
      ) : (
        <>
          <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 12px", marginBottom: 16, fontSize: 12.5, color: T.creamDim }}>
            Obsazeno <b style={{ color: T.cream }}>{used}</b> · volných <b style={{ color: T.greenLite }}>{free}</b> · kapacita <b style={{ color: T.cream }}>{c.capacity}</b>
          </div>

          <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 8, textTransform: "uppercase" }}>Komu poslat (oddělení)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {EVENT_DEPTS.map(d => {
              const on = selDepts.includes(d.id);
              return (
                <label key={d.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", background: on ? `${T.brass}18` : T.bg, border: `1px solid ${on ? T.brass : T.line}`, borderRadius: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={on} onChange={() => toggleDept(d.id)} />
                  <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? T.cream : T.textDim }}>{d.label}</span>
                </label>
              );
            })}
          </div>

          <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 8, textTransform: "uppercase" }}>
            Prodejci ({filteredSellers.length}) — volitelně upřesnit
          </div>
          <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 8 }}>Nic nevyberete = pošle se všem prodejcům z vybraných oddělení.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18, maxHeight: 220, overflowY: "auto" }}>
            {filteredSellers.length === 0 && <div style={{ fontSize: 12.5, color: T.textDim, padding: "8px 0" }}>Žádní prodejci v těchto odděleních.</div>}
            {filteredSellers.map(u => {
              const on = selSellers.includes(u.id);
              return (
                <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", background: on ? `${T.brass}12` : T.bg, border: `1px solid ${on ? T.brass : T.line}`, borderRadius: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={on} onChange={() => toggleSeller(u.id)} />
                  <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? T.cream : T.textDim }}>{u.name}</span>
                  {u.dept && <span style={{ fontSize: 11, color: T.brass, marginLeft: "auto" }}>{u.dept}</span>}
                </label>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
            <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
            <Btn kind="green" icon={Send} disabled={selDepts.length === 0} onClick={send}>
              Rozeslat stav ({recipients.length})
            </Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

function AddPurchaseInline({ crm, onAdd }) {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ fontSize: 11.5, color: T.brass, background: "none", border: `1px dashed ${T.brass}55`, borderRadius: 7, padding: "3px 9px", cursor: "pointer", fontFamily: "inherit" }}>+ přidat</button>
  );
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
      <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="GLE 450" style={{ ...inputStyle, width: 90, padding: "4px 7px", fontSize: 11.5 }} />
      <input value={year} onChange={(e) => setYear(e.target.value)} type="number" min={2015} max={2030} style={{ ...inputStyle, width: 65, padding: "4px 7px", fontSize: 11.5 }} />
      <button onClick={() => { if (model.trim()) { onAdd({ model: model.trim(), year: +year }); setModel(""); setOpen(false); } }} style={{ background: T.green, border: "none", borderRadius: 6, padding: "4px 9px", color: T.cream, cursor: "pointer", fontSize: 11.5 }}>+</button>
      <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim, fontSize: 13 }}>×</button>
    </div>
  );
}


function GroupsTab({ c, canEdit, nameId, onUpdate, setGroup }) {
  const [newName, setNewName] = useState("");
  const addGroup    = () => { if (!newName.trim()) return; onUpdate((camp) => ({ ...camp, groups: [...camp.groups, { id: uid(), name: newName.trim() }] })); setNewName(""); };
  const removeGroup = (gid) => onUpdate((camp) => ({ ...camp, groups: camp.groups.filter((g) => g.id !== gid), parts: camp.parts.map((p) => p.group === gid ? { ...p, group: null } : p) }));
  const rename      = (gid, name) => onUpdate((camp) => ({ ...camp, groups: camp.groups.map((g) => g.id === gid ? { ...g, name } : g) }));
  const ungrouped   = c.parts.filter((p) => !p.group);

  return (
    <div>
      {canEdit && (
        <div style={{ display: "flex", gap: 9, marginBottom: 18, alignItems: "flex-end" }}>
          <FRow label="Název nové skupiny"><input style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Dopoledne jízdy…" /></FRow>
          <Btn kind="green" icon={Plus} onClick={addGroup}>Přidat skupinu</Btn>
        </div>
      )}
      {c.groups.map((g) => {
        const members = c.parts.filter((p) => p.group === g.id);
        return (
          <div key={g.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: T.panel2, borderBottom: `1px solid ${T.line}` }}>
              {canEdit
                ? <input value={g.name} onChange={(e) => rename(g.id, e.target.value)} style={{ ...inputStyle, width: "auto", padding: "4px 8px", fontSize: 13.5, fontWeight: 600 }} />
                : <span style={{ fontSize: 13.5, fontWeight: 600 }}>{g.name}</span>
              }
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: T.textDim }}>{members.length} účastníků</span>
                {canEdit && <button onClick={() => removeGroup(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={14} /></button>}
              </div>
            </div>
            {members.length === 0
              ? <div style={{ padding: "12px 14px", fontSize: 12.5, color: T.line }}>Přiřaďte účastníky v záložce Účastníci.</div>
              : members.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: `1px solid ${T.line}`, fontSize: 13 }}>
                  <span style={{ flex: 1, fontWeight: 500 }}>{p.data[nameId] || "—"}</span>
                  <StateBadge state={p.state} />
                  {canEdit && <button onClick={() => setGroup(p.id, null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim }}><X size={13} /></button>}
                </div>
              ))
            }
          </div>
        );
      })}
      {c.groups.length === 0 && <div style={{ padding: 20, textAlign: "center", color: T.textDim, fontSize: 13 }}>Zatím žádné skupiny.</div>}
    </div>
  );
}


/* ════════════════════════════════════════
   BUILDER POZVÁNKY
════════════════════════════════════════ */
const FONTS = [
  { id: "Georgia, serif",      label: "Georgia (serif)" },
  { id: "'DM Sans', sans-serif", label: "DM Sans (moderní)" },
  { id: "Arial, sans-serif",   label: "Arial (neutrální)" },
  { id: "'Times New Roman', serif", label: "Times New Roman" },
  { id: "Verdana, sans-serif", label: "Verdana" },
];

const BLOCK_TYPES = [
  { id: "header",   icon: "H",  label: "Nadpis" },
  { id: "text",     icon: "¶",  label: "Odstavec" },
  { id: "image",    icon: "🖼", label: "Obrázek" },
  { id: "infobox",  icon: "ℹ", label: "Info box" },
  { id: "confirm",  icon: "✅", label: "Potvrdit účast" },
  { id: "decline",  icon: "✖", label: "Odmítnout účast" },
  { id: "button",   icon: "⬤",  label: "Tlačítko" },
  { id: "link",     icon: "🔗", label: "Odkaz / video" },
  { id: "divider",  icon: "—",  label: "Oddělovač" },
];

const TPL_VARS = [
  "{{jmeno}}", "{{prijmeni}}", "{{nazev_akce}}", "{{datum}}",
  "{{misto}}", "{{flight_cas}}", "{{dress_code}}", "{{organizator_tel}}", "{{kalendar_odkaz}}", "{{potvrdit_odkaz}}", "{{odmitnout_odkaz}}", "{{golf_odkaz}}",
];

const COLORS_PALETTE = [
  "#f2ede0", "#e4e8de", "#c8c4b4", "#c8a044", "#256b46",
  "#1a3d24", "#4e8fbd", "#9068c8", "#c4614e", "#ffffff",
];

// nahradí proměnné ukázkovými hodnotami akce pro tisk
function fillInviteVars(str, c) {
  const dstr = c.date ? new Date(c.date).toLocaleDateString("cs-CZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";
  const org = c.team?.members?.find(m => m.role === "Organizátor");
  return String(str || "")
    .replace(/\{\{jmeno\}\}/g, "vážený hoste").replace(/\{\{prijmeni\}\}/g, "")
    .replace(/\{\{nazev_akce\}\}/g, c.name || "").replace(/\{\{datum\}\}/g, dstr)
    .replace(/\{\{misto\}\}/g, c.place || "").replace(/\{\{flight_cas\}\}/g, c.startTime || "")
    .replace(/\{\{dress_code\}\}/g, "Smart casual").replace(/\{\{organizator_tel\}\}/g, org?.phone || "")
    .replace(/\{\{kalendar_odkaz\}\}/g, "#").replace(/\{\{potvrdit_odkaz\}\}/g, "#")
    .replace(/\{\{odmitnout_odkaz\}\}/g, "#").replace(/\{\{golf_odkaz\}\}/g, "#");
}
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function printInviteA4(c, invite) {
  const inv = invite || {};
  const blocksHtml = (inv.blocks || []).map((b) => {
    if (b.type === "divider") return `<hr style="border:none;border-top:1px solid rgba(255,255,255,.18);margin:18px 0" />`;
    if (b.type === "header")  return `<div style="font-size:${(b.size||20)*1.3}px;font-weight:${b.bold?700:400};color:${b.color};text-align:${b.align};margin-bottom:18px;font-style:${b.italic?"italic":"normal"}">${esc(fillInviteVars(b.content, c))}</div>`;
    if (b.type === "text")    return `<div style="font-size:${(b.size||14)*1.15}px;font-weight:${b.bold?600:400};color:${b.color};text-align:${b.align};margin-bottom:18px;line-height:1.8;white-space:pre-wrap;font-style:${b.italic?"italic":"normal"}">${esc(fillInviteVars(b.content, c))}</div>`;
    if (b.type === "image")   return b.url ? `<img src="${b.url}" style="width:100%;border-radius:9px;margin-bottom:18px;display:block" />` : "";
    if (b.type === "infobox") return `<div style="background:rgba(255,255,255,.10);border-radius:12px;padding:16px 20px;margin-bottom:18px">${(b.items||[]).map(it => `<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:16px"><span style="font-size:20px;min-width:28px">${it.icon||""}</span><span style="color:rgba(255,255,255,.55);min-width:70px">${esc(it.label)}:</span><span style="color:#f2ede0;font-weight:600">${esc(fillInviteVars(it.value, c))}</span></div>`).join("")}</div>`;
    if (b.type === "button")  return `<div style="text-align:center;margin-bottom:18px"><span style="display:inline-block;background:${b.color};color:#1a1a1a;padding:12px 30px;border-radius:9px;font-weight:700;font-size:16px">${esc(b.label)}</span></div>`;
    if (b.type === "confirm") return `<div style="text-align:center;margin-bottom:18px"><span style="display:inline-block;background:${b.color || "#2e7d54"};color:#ffffff;padding:14px 38px;border-radius:9px;font-weight:700;font-size:17px">${esc(b.label || "✅ Potvrdit účast")}</span></div>`;
    if (b.type === "decline") return `<div style="text-align:center;margin-bottom:18px"><span style="display:inline-block;background:${b.color || "#b4483a"};color:#ffffff;padding:14px 38px;border-radius:9px;font-weight:700;font-size:17px">${esc(b.label || "✖ Nemohu se zúčastnit")}</span></div>`;
    if (b.type === "link")    return `<div style="text-align:center;margin-bottom:16px"><span style="color:#c8a044;text-decoration:underline;font-style:${b.italic?"italic":"normal"}">${esc(b.label)}</span></div>`;
    return "";
  }).join("");

  const header = inv.headerImg ? `<img src="${inv.headerImg}" style="width:100%;max-height:240px;object-fit:cover;display:block" />` : "";
  const html = `<!DOCTYPE html><html lang="cs"><head><meta charset="utf-8"><title>Pozvánka — ${esc(c.name)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html,body { margin:0; padding:0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family:${inv.fontFamily || "Georgia, serif"}; }
  .page { width:210mm; min-height:297mm; background:${inv.bgColor || "#1a3d24"}; margin:0 auto; overflow:hidden; }
  .content { padding:20mm 22mm; }
  @media screen { body { background:#333; padding:20px; } .page { box-shadow:0 4px 30px rgba(0,0,0,.5); } }
</style></head><body>
<div class="page">${header}<div class="content">${blocksHtml}</div></div>
<script>window.onload=()=>setTimeout(()=>window.print(),400)</script>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) { alert("Povolte prosím vyskakovací okna pro tisk."); return; }
  w.document.write(html);
  w.document.close();
}

function InviteTab({ c, canEdit, onUpdate }) {
  const [view, setView] = useState("builder"); // builder | preview
  const [a4Mode, setA4Mode] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const isGolf = c.activityType === "golf";
  const invite = c.invite || { bgColor: "#1a3d24", headerImg: "", fontFamily: "Georgia, serif", fontSize: 15, blocks: [] };

  const updInvite = (patch) => onUpdate((camp) => ({ ...camp, invite: { ...camp.invite, ...patch } }));
  const addBlock  = (type) => {
    const defaults = {
      header:  { content: "Nadpis akce", align: "center", bold: true,  size: 20, color: "#f2ede0" },
      text:    { content: "Text pozvánky…",  align: "left",   bold: false, size: 14, color: "#e4e8de" },
      image:   { url: "", alt: "", file: null },
      infobox: { items: [{ icon: "📅", label: "Datum", value: "{{datum}}" }, { icon: "📍", label: "Místo", value: "{{misto}}" }] },
      button:  { label: "Přidat do kalendáře", url: "{{kalendar_odkaz}}", color: "#c8a044" },
      confirm: { label: "✅ Potvrdit účast", url: "{{potvrdit_odkaz}}", color: "#2e7d54" },
      decline: { label: "✖ Nemohu se zúčastnit", url: "{{odmitnout_odkaz}}", color: "#b4483a" },
      link:    { label: "Odkaz", url: "", italic: false },
      divider: {},
    };
    const nb = { id: uid(), type, ...defaults[type] };
    updInvite({ blocks: [...invite.blocks, nb] });
    setEditBlock(nb.id);
  };
  const updBlock = (id, patch) => updInvite({ blocks: invite.blocks.map((b) => b.id === id ? { ...b, ...patch } : b) });
  const delBlock = (id) => { updInvite({ blocks: invite.blocks.filter((b) => b.id !== id) }); if (editBlock === id) setEditBlock(null); };
  const moveBlock = (id, dir) => {
    const idx = invite.blocks.findIndex((b) => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === invite.blocks.length - 1) return;
    const arr = [...invite.blocks];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    updInvite({ blocks: arr });
  };

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updBlock(id, { url: e.target.result, alt: file.name });
    reader.readAsDataURL(file);
  };
  const handleHeaderImgUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updInvite({ headerImg: e.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* horní lišta */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ k: "builder", l: "🔧 Builder" }, { k: "preview", l: "👁 Náhled" }].map((o) => (
            <button key={o.k} onClick={() => setView(o.k)} style={{ padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, background: view === o.k ? T.brass : T.bg, color: view === o.k ? T.bg : T.textDim, fontWeight: view === o.k ? 600 : 400, border: `1px solid ${view === o.k ? T.brass : T.line}` }}>
              {o.l}
            </button>
          ))}
        </div>
        {view === "preview" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: a4Mode ? T.cream : T.textDim, cursor: "pointer", padding: "6px 12px", background: a4Mode ? `${T.brass}18` : T.bg, border: `1px solid ${a4Mode ? T.brass : T.line}`, borderRadius: 8 }}>
              <input type="checkbox" checked={a4Mode} onChange={() => setA4Mode(v => !v)} />
              📄 Formát A4
            </label>
            <Btn kind="ghost" icon={Printer} small onClick={() => printInviteA4(c, invite)}>Tisk / PDF (A4)</Btn>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: T.textDim }}>Klikněte na proměnnou pro vložení do textu</div>
        )}
      </div>

      {view === "builder" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>
          {/* levý panel — bloky */}
          <div>
            {/* globální nastavení */}
            <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 10, fontWeight: 600, letterSpacing: 0.3 }}>NASTAVENÍ E-MAILU</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={lbl}>Barva pozadí</label>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                    {["#1a3d24","#0b1610","#1a1a2e","#2a1a3a","#1a2a3a","#ffffff"].map((col) => (
                      <div key={col} onClick={() => canEdit && updInvite({ bgColor: col })} style={{ width: 22, height: 22, borderRadius: 5, background: col, border: `2px solid ${invite.bgColor === col ? T.brass : T.line}`, cursor: canEdit ? "pointer" : "default" }} />
                    ))}
                    {canEdit && <input type="color" value={invite.bgColor} onChange={(e) => updInvite({ bgColor: e.target.value })} style={{ width: 22, height: 22, border: "none", padding: 0, cursor: "pointer", background: "none" }} />}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Písmo</label>
                  {canEdit
                    ? <select value={invite.fontFamily} onChange={(e) => updInvite({ fontFamily: e.target.value })} style={{ ...inputStyle, fontSize: 11.5, padding: "4px 6px" }}>
                        {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                    : <div style={{ fontSize: 12, color: T.cream }}>{FONTS.find((f) => f.id === invite.fontFamily)?.label}</div>
                  }
                </div>
                <div>
                  <label style={lbl}>Základní velikost</label>
                  {canEdit
                    ? <input type="number" min={11} max={20} value={invite.fontSize} onChange={(e) => updInvite({ fontSize: +e.target.value })} style={{ ...inputStyle, padding: "4px 7px" }} />
                    : <div style={{ fontSize: 12, color: T.cream }}>{invite.fontSize} px</div>
                  }
                </div>
              </div>
              <div>
                <label style={lbl}>Hlavičkový obrázek (banner nahoře)</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {invite.headerImg
                    ? <img src={invite.headerImg} alt="banner" style={{ height: 48, borderRadius: 6, objectFit: "cover", maxWidth: 200 }} />
                    : <div style={{ height: 48, width: 200, background: T.panel, border: `1px dashed ${T.line}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T.textDim }}>Bez obrázku</div>
                  }
                  {canEdit && (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, cursor: "pointer", fontSize: 12.5, color: T.cream }}>
                      🖼 Nahrát
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleHeaderImgUpload(e.target.files[0])} />
                    </label>
                  )}
                  {invite.headerImg && canEdit && (
                    <button onClick={() => updInvite({ headerImg: "" })} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, fontSize: 12 }}>✕ Odebrat</button>
                  )}
                </div>
              </div>
            </div>

            {/* seznam bloků */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
              {invite.blocks.map((block, idx) => {
                const isEditing = editBlock === block.id;
                return (
                  <div key={block.id} style={{ background: T.bg, border: `2px solid ${isEditing ? T.brass : T.line}`, borderRadius: 10, overflow: "hidden" }}>
                    {/* block header */}
                    <div onClick={() => setEditBlock(isEditing ? null : block.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", background: isEditing ? `${T.brass}10` : "transparent" }}>
                      <span style={{ fontSize: 14, minWidth: 20, textAlign: "center" }}>{BLOCK_TYPES.find((t) => t.id === block.type)?.icon}</span>
                      <span style={{ flex: 1, fontSize: 12.5, color: isEditing ? T.brass : T.cream, fontWeight: isEditing ? 600 : 400 }}>
                        {BLOCK_TYPES.find((t) => t.id === block.type)?.label}
                        {block.content && <span style={{ color: T.textDim, fontWeight: 400 }}> — {block.content.slice(0, 40)}{block.content.length > 40 ? "…" : ""}</span>}
                        {block.label && <span style={{ color: T.textDim, fontWeight: 400 }}> — {block.label}</span>}
                      </span>
                      {canEdit && (
                        <div style={{ display: "flex", gap: 3 }} onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => moveBlock(block.id, "up")} disabled={idx === 0} style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: T.textDim, fontSize: 14, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                          <button onClick={() => moveBlock(block.id, "down")} disabled={idx === invite.blocks.length - 1} style={{ background: "none", border: "none", cursor: idx === invite.blocks.length - 1 ? "default" : "pointer", color: T.textDim, fontSize: 14, opacity: idx === invite.blocks.length - 1 ? 0.3 : 1 }}>↓</button>
                          <button onClick={() => delBlock(block.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, fontSize: 13 }}><Trash2 size={13} /></button>
                        </div>
                      )}
                    </div>

                    {/* block editor */}
                    {isEditing && canEdit && (
                      <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.line}`, background: `${T.brass}06` }}>
                        {(block.type === "header" || block.type === "text") && (
                          <>
                            <textarea value={block.content} onChange={(e) => updBlock(block.id, { content: e.target.value })} rows={block.type === "text" ? 4 : 2} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12.5, marginBottom: 9, lineHeight: 1.7 }} placeholder={block.type === "header" ? "Název akce…" : "Text pozvánky… Použijte {{jmeno}}, {{datum}} atd."} />
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <label style={{ ...lbl, marginBottom: 0, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12 }}>
                                <input type="checkbox" checked={block.bold} onChange={(e) => updBlock(block.id, { bold: e.target.checked })} /> Tučné
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12, color: T.textDim }}>
                                <input type="checkbox" checked={block.italic} onChange={(e) => updBlock(block.id, { italic: e.target.checked })} /> Kurzíva
                              </label>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ fontSize: 11.5, color: T.textDim }}>Vel.:</span>
                                <input type="number" value={block.size} onChange={(e) => updBlock(block.id, { size: +e.target.value })} min={10} max={40} style={{ ...inputStyle, width: 55, padding: "3px 6px", fontSize: 12 }} />
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ fontSize: 11.5, color: T.textDim }}>Barva:</span>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                  {COLORS_PALETTE.map((col) => (
                                    <div key={col} onClick={() => updBlock(block.id, { color: col })} style={{ width: 18, height: 18, borderRadius: 4, background: col, border: `2px solid ${block.color === col ? T.brass : "transparent"}`, cursor: "pointer" }} />
                                  ))}
                                  <input type="color" value={block.color || "#f2ede0"} onChange={(e) => updBlock(block.id, { color: e.target.value })} style={{ width: 18, height: 18, border: "none", padding: 0, cursor: "pointer", background: "none" }} />
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                {["left", "center", "right"].map((a) => (
                                  <button key={a} onClick={() => updBlock(block.id, { align: a })} style={{ padding: "3px 8px", background: block.align === a ? T.brass : T.bg, border: `1px solid ${T.line}`, borderRadius: 5, cursor: "pointer", fontSize: 11, color: block.align === a ? T.bg : T.textDim }}>
                                    {a === "left" ? "⬅" : a === "center" ? "↔" : "➡"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        {block.type === "image" && (
                          <>
                            <label style={lbl}>Nahrát obrázek</label>
                            <label style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, cursor: "pointer", fontSize: 13, color: T.cream, marginBottom: 8 }}>
                              🖼 Vybrat soubor
                              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(block.id, e.target.files[0])} />
                            </label>
                            {block.url && <img src={block.url} alt={block.alt} style={{ display: "block", maxWidth: "100%", maxHeight: 120, borderRadius: 7, marginBottom: 6 }} />}
                            <input value={block.alt || ""} onChange={(e) => updBlock(block.id, { alt: e.target.value })} placeholder="Popis obrázku (alt text)" style={{ ...inputStyle, padding: "5px 8px", fontSize: 12 }} />
                          </>
                        )}
                        {block.type === "infobox" && (
                          <>
                            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>Řádky info boxu (ikona, štítek, hodnota nebo proměnná):</div>
                            {block.items.map((item, ii) => (
                              <div key={ii} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                                <input value={item.icon} onChange={(e) => { const it = [...block.items]; it[ii] = { ...it[ii], icon: e.target.value }; updBlock(block.id, { items: it }); }} style={{ ...inputStyle, width: 42, textAlign: "center", padding: "4px" }} />
                                <input value={item.label} onChange={(e) => { const it = [...block.items]; it[ii] = { ...it[ii], label: e.target.value }; updBlock(block.id, { items: it }); }} placeholder="Datum" style={{ ...inputStyle, flex: 1, padding: "4px 7px", fontSize: 12 }} />
                                <input value={item.value} onChange={(e) => { const it = [...block.items]; it[ii] = { ...it[ii], value: e.target.value }; updBlock(block.id, { items: it }); }} placeholder={"{{datum}}"} style={{ ...inputStyle, flex: 1, padding: "4px 7px", fontSize: 12, fontFamily: "monospace" }} />
                                <button onClick={() => updBlock(block.id, { items: block.items.filter((_, j) => j !== ii) })} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={12} /></button>
                              </div>
                            ))}
                            <button onClick={() => updBlock(block.id, { items: [...block.items, { icon: "📌", label: "", value: "" }] })} style={{ background: "none", border: `1px dashed ${T.brass}55`, borderRadius: 7, padding: "4px 10px", cursor: "pointer", color: T.brass, fontSize: 12, fontFamily: "inherit" }}>+ Přidat řádek</button>
                          </>
                        )}
                        {(block.type === "button" || block.type === "confirm" || block.type === "decline") && (
                          <>
                            {block.type === "confirm" && <div style={{ fontSize: 11.5, color: T.greenLite, marginBottom: 8, lineHeight: 1.5 }}>✅ Tlačítko pro potvrzení účasti. Zákazník jím potvrdí, že přijde. Odkaz {"{{potvrdit_odkaz}}"} se doplní automaticky po napojení potvrzovacích linků.{isGolf && " U golfu na stejné stránce zákazník rovnou vyplní svůj HCP a zvolí zapůjčené vybavení — prodejce už to za něj nedělá."}</div>}
                            {block.type === "decline" && <div style={{ fontSize: 11.5, color: T.danger, marginBottom: 8, lineHeight: 1.5 }}>✖ Tlačítko pro odmítnutí účasti. Zákazník jím dá vědět, že nedorazí — v aplikaci se rovnou označí, ať s ním nemusíte počítat. Odkaz {"{{odmitnout_odkaz}}"} se doplní automaticky.</div>}
                            <FRow label="Text tlačítka"><input value={block.label} onChange={(e) => updBlock(block.id, { label: e.target.value })} style={{ ...inputStyle, padding: "5px 8px" }} /></FRow>
                            <FRow label={block.type === "confirm" ? "URL nebo proměnná ({{potvrdit_odkaz}})" : block.type === "decline" ? "URL nebo proměnná ({{odmitnout_odkaz}})" : "URL nebo proměnná ({{kalendar_odkaz}})"} ><input value={block.url} onChange={(e) => updBlock(block.id, { url: e.target.value })} placeholder={block.type === "confirm" ? "https:// nebo {{potvrdit_odkaz}}" : block.type === "decline" ? "https:// nebo {{odmitnout_odkaz}}" : "https:// nebo {{kalendar_odkaz}}"} style={{ ...inputStyle, padding: "5px 8px", fontFamily: "monospace", fontSize: 12 }} /></FRow>
                            <div>
                              <label style={lbl}>Barva tlačítka</label>
                              <div style={{ display: "flex", gap: 4 }}>
                                {COLORS_PALETTE.map((col) => (
                                  <div key={col} onClick={() => updBlock(block.id, { color: col })} style={{ width: 20, height: 20, borderRadius: 5, background: col, border: `2px solid ${block.color === col ? T.cream : "transparent"}`, cursor: "pointer" }} />
                                ))}
                                <input type="color" value={block.color || "#c8a044"} onChange={(e) => updBlock(block.id, { color: e.target.value })} style={{ width: 20, height: 20, border: "none", padding: 0, cursor: "pointer" }} />
                              </div>
                            </div>
                          </>
                        )}
                        {block.type === "link" && (
                          <>
                            <FRow label="Text odkazu"><input value={block.label} onChange={(e) => updBlock(block.id, { label: e.target.value })} placeholder="📸 Fotky z loňské akce" style={{ ...inputStyle, padding: "5px 8px" }} /></FRow>
                            <FRow label="URL (YouTube, Instagram, Facebook…)"><input value={block.url} onChange={(e) => updBlock(block.id, { url: e.target.value })} placeholder="https://youtube.com/watch?v=…" style={{ ...inputStyle, padding: "5px 8px" }} /></FRow>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, cursor: "pointer", marginTop: 6, color: T.textDim }}>
                              <input type="checkbox" checked={block.italic || false} onChange={(e) => updBlock(block.id, { italic: e.target.checked })} /> Kurzíva
                            </label>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* přidat blok */}
            {canEdit && (
              <div style={{ background: T.bg, border: `1px dashed ${T.line}`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>Přidat blok:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {BLOCK_TYPES.map((bt) => (
                    <button key={bt.id} onClick={() => addBlock(bt.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 7, cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: T.cream }}>
                      <span style={{ fontSize: 13 }}>{bt.icon}</span>{bt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* pravý panel — proměnné */}
          <div>
            <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, padding: 12, position: "sticky", top: 16 }}>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 10, fontWeight: 600, letterSpacing: 0.3 }}>PROMĚNNÉ — klikněte pro kopírování</div>
              {TPL_VARS.map((v) => (
                <div key={v} onClick={() => navigator.clipboard?.writeText(v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 9px", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 7, marginBottom: 5, cursor: "pointer", fontSize: 12.5 }}>
                  <code style={{ color: T.brass, fontFamily: "monospace", flex: 1 }}>{v}</code>
                  <span style={{ fontSize: 10, color: T.textDim }}>📋</span>
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 11.5, color: T.textDim, lineHeight: 1.7 }}>
                Proměnné jsou nahrazeny skutečnými daty zákazníka a akce při odeslání e-mailu.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NÁHLED */}
      {view === "preview" && (
        <div style={{ maxWidth: a4Mode ? 620 : 560, margin: "0 auto" }}>
          {a4Mode && <div style={{ textAlign: "center", fontSize: 11.5, color: T.textDim, marginBottom: 8 }}>Náhled na stránce A4 (210 × 297 mm) — přesně tak vyjede z tisku / PDF.</div>}
          <div style={{ background: invite.bgColor, borderRadius: a4Mode ? 4 : 14, overflow: "hidden", fontFamily: invite.fontFamily, fontSize: invite.fontSize, boxShadow: "0 8px 32px rgba(0,0,0,.4)", ...(a4Mode ? { width: "100%", aspectRatio: "210 / 297" } : {}) }}>
            {invite.headerImg && <img src={invite.headerImg} alt="banner" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} />}
            <div style={{ padding: a4Mode ? "40px 46px" : "22px 26px" }}>
              {invite.blocks.map((block) => {
                if (block.type === "divider") return <hr key={block.id} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,.15)", margin: "14px 0" }} />;
                if (block.type === "header") return (
                  <div key={block.id} style={{ fontSize: block.size, fontWeight: block.bold ? 700 : 400, color: block.color, textAlign: block.align, marginBottom: 14, fontStyle: block.italic ? "italic" : "normal" }}>{block.content}</div>
                );
                if (block.type === "text") return (
                  <div key={block.id} style={{ fontSize: block.size, fontWeight: block.bold ? 600 : 400, color: block.color, textAlign: block.align, marginBottom: 14, lineHeight: 1.75, whiteSpace: "pre-wrap", fontStyle: block.italic ? "italic" : "normal" }}>{block.content}</div>
                );
                if (block.type === "image") return block.url ? (
                  <img key={block.id} src={block.url} alt={block.alt} style={{ width: "100%", borderRadius: 9, marginBottom: 14, display: "block" }} />
                ) : (
                  <div key={block.id} style={{ height: 80, background: "rgba(255,255,255,.07)", borderRadius: 9, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.3)", fontSize: 13 }}>🖼 Obrázek</div>
                );
                if (block.type === "infobox") return (
                  <div key={block.id} style={{ background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                    {block.items?.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < block.items.length - 1 ? 8 : 0, fontSize: invite.fontSize }}>
                        <span style={{ fontSize: 18, minWidth: 26 }}>{item.icon}</span>
                        <span style={{ color: "rgba(255,255,255,.5)", minWidth: 60 }}>{item.label}:</span>
                        <span style={{ color: "#f2ede0", fontWeight: 600 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                );
                if (block.type === "button") return (
                  <div key={block.id} style={{ textAlign: "center", marginBottom: 14 }}>
                    <span style={{ display: "inline-block", background: block.color, color: "#1a1a1a", padding: "10px 24px", borderRadius: 9, fontWeight: 700, fontSize: invite.fontSize, cursor: "pointer" }}>{block.label}</span>
                  </div>
                );
                if (block.type === "confirm") return (
                  <div key={block.id} style={{ textAlign: "center", marginBottom: 14 }}>
                    <span style={{ display: "inline-block", background: block.color || "#2e7d54", color: "#ffffff", padding: "12px 32px", borderRadius: 9, fontWeight: 700, fontSize: invite.fontSize + 1, cursor: "pointer" }}>{block.label || "✅ Potvrdit účast"}</span>
                    {isGolf && <div style={{ fontSize: invite.fontSize - 3, color: "rgba(255,255,255,.5)", marginTop: 6 }}>Na potvrzovací stránce vyplníte svůj HCP a vybavení</div>}
                  </div>
                );
                if (block.type === "decline") return (
                  <div key={block.id} style={{ textAlign: "center", marginBottom: 14 }}>
                    <span style={{ display: "inline-block", background: block.color || "#b4483a", color: "#ffffff", padding: "12px 32px", borderRadius: 9, fontWeight: 700, fontSize: invite.fontSize + 1, cursor: "pointer" }}>{block.label || "✖ Nemohu se zúčastnit"}</span>
                  </div>
                );
                if (block.type === "link") return (
                  <div key={block.id} style={{ textAlign: "center", marginBottom: 12 }}>
                    <span style={{ color: "#c8a044", fontSize: invite.fontSize - 1, fontStyle: block.italic ? "italic" : "normal", textDecoration: "underline", cursor: "pointer" }}>{block.label}</span>
                  </div>
                );
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   ROZPOČET
════════════════════════════════════════ */

/* ════════════════════════════════════════
   TÝM AKCE
════════════════════════════════════════ */
const TEAM_ROLES = [
  "Organizátor", "Vedoucí prodeje", "Prodejce", "Hosteska",
  "Technika / IT", "Catering", "Fotograf", "Správce hřiště",
  "Instruktor", "Řidič / transfer", "Jiné",
];

const TEAM_STATUSES = {
  pending:   { label: "Čeká na potvrzení", color: "#c9a24b", bg: "rgba(200,160,68,.12)" },
  confirmed: { label: "Potvrzeno",          color: "#256b46", bg: "rgba(37,107,70,.15)"  },
  declined:  { label: "Odmítnuto",          color: "#c4614e", bg: "rgba(196,97,78,.12)"  },
};


/* ════════════════════════════════════════
   MATERIÁLY A POTŘEBY
════════════════════════════════════════ */
const NEEDS_CATS = ["Technika", "Materiály", "Catering", "Golf", "Propagace", "Bezpečnost", "Jiné"];

function NeedsTab({ c, canEdit, onUpdate }) {
  const [newLabel, setNewLabel] = useState("");
  const [newCat,   setNewCat]   = useState("Materiály");
  const [newQty,   setNewQty]   = useState(1);
  const [newUnit,  setNewUnit]  = useState("ks");
  const needs = c.needs || { items: [] };

  const addItem = () => {
    if (!newLabel.trim()) return;
    onUpdate((camp) => ({ ...camp, needs: { ...camp.needs, items: [...(camp.needs?.items || []), { id: uid(), cat: newCat, label: newLabel.trim(), qty: newQty, unit: newUnit, checked: false, note: "" }] } }));
    setNewLabel(""); setNewQty(1);
  };
  const updItem = (id, patch) => onUpdate((camp) => ({ ...camp, needs: { ...camp.needs, items: camp.needs.items.map((i) => i.id === id ? { ...i, ...patch } : i) } }));
  const delItem = (id) => onUpdate((camp) => ({ ...camp, needs: { ...camp.needs, items: camp.needs.items.filter((i) => i.id !== id) } }));
  const toggleCheck = (id) => updItem(id, { checked: !needs.items.find((i) => i.id === id)?.checked });

  const done  = needs.items.filter((i) => i.checked).length;
  const total = needs.items.length;

  return (
    <div>
      {/* progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, height: 8, background: T.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${T.line}` }}>
          <div style={{ width: total > 0 ? `${Math.round(done/total*100)}%` : "0%", height: "100%", background: done === total && total > 0 ? T.greenLite : T.brass }} />
        </div>
        <span style={{ fontSize: 13, color: done === total && total > 0 ? T.greenLite : T.brass, fontWeight: 600 }}>{done}/{total} připraveno</span>
      </div>

      {/* skupiny podle kategorií */}
      {NEEDS_CATS.map((cat) => {
        const items = needs.items.filter((i) => i.cat === cat);
        if (!items.length) return null;
        return (
          <div key={cat} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: T.brass, fontWeight: 600, letterSpacing: 0.4, marginBottom: 8, textTransform: "uppercase" }}>{cat}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, background: item.checked ? `${T.greenLite}0a` : T.panel, border: `1px solid ${item.checked ? T.greenLite+"44" : T.line}`, borderRadius: 9, padding: "9px 12px" }}>
                  <input type="checkbox" checked={item.checked} onChange={() => toggleCheck(item.id)} style={{ width: 16, height: 16, cursor: "pointer", accentColor: T.greenLite }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, color: item.checked ? T.textDim : T.cream, textDecoration: item.checked ? "line-through" : "none" }}>{item.label}</span>
                    {item.note && <span style={{ fontSize: 11.5, color: T.textDim, marginLeft: 8 }}>— {item.note}</span>}
                  </div>
                  <span style={{ fontSize: 12, color: T.textDim }}>{item.qty} {item.unit}</span>
                  {canEdit && (
                    <>
                      <input value={item.note || ""} onChange={(e) => updItem(item.id, { note: e.target.value })} placeholder="poznámka…" style={{ ...inputStyle, width: 150, padding: "3px 8px", fontSize: 11.5 }} />
                      <button onClick={() => delItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {needs.items.length === 0 && (
        <div style={{ padding: 32, textAlign: "center", color: T.textDim, fontSize: 13 }}>Zatím žádné položky — přidejte co je třeba na akci nachystat.</div>
      )}

      {/* přidat položku */}
      {canEdit && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginTop: 16, padding: 14, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10 }}>
          <FRow label="Kategorie">
            <select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ ...inputStyle, padding: "6px 8px" }}>
              {NEEDS_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FRow>
          <FRow label="Název *" style={{ flex: 2 }}>
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} placeholder="Informační listy, datový projektor…" style={{ ...inputStyle, padding: "6px 9px" }} />
          </FRow>
          <FRow label="Množství">
            <input type="number" min={1} value={newQty} onChange={(e) => setNewQty(+e.target.value)} style={{ ...inputStyle, width: 70, padding: "6px 8px" }} />
          </FRow>
          <FRow label="Jednotka">
            <input value={newUnit} onChange={(e) => setNewUnit(e.target.value)} style={{ ...inputStyle, width: 60, padding: "6px 8px" }} />
          </FRow>
          <Btn kind="green" icon={Plus} onClick={addItem}>Přidat</Btn>
        </div>
      )}
    </div>
  );
}


function TeamTab({ c, canEdit, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const team = c.team || { members: [], teamsUrl: "", multiDay: false };

  const addMember = (m) => onUpdate((camp) => {
    const existing = (camp.team?.members || []).some(x => x.userId && x.userId === m.userId);
    if (existing) { alert(`${m.name} je již v týmu akce.`); return camp; }
    return { ...camp, team: { ...camp.team, members: [...(camp.team?.members || []), { id: uid(), status: "pending", ...m }] } };
  });
  const updMember = (id, patch) => onUpdate((camp) => ({
    ...camp, team: { ...camp.team, members: camp.team.members.map((m) => m.id === id ? { ...m, ...patch } : m) }
  }));
  const delMember = (id) => onUpdate((camp) => ({
    ...camp, team: { ...camp.team, members: camp.team.members.filter((m) => m.id !== id) }
  }));
  const updTeam = (patch) => onUpdate((camp) => ({ ...camp, team: { ...camp.team, ...patch } }));

  const sendCalInvite = (m) => {
    const dateStr = (m.days[0] || c.date || "").replace(/-/g, "");
    const fromStr = (m.timeFrom || "08:00").replace(":", "") + "00";
    const toStr   = (m.timeTo   || "18:00").replace(":", "") + "00";
    const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE`
      + `&text=${encodeURIComponent("[S&W] " + c.name + " — " + m.role)}`
      + `&dates=${dateStr}T${fromStr}Z/${dateStr}T${toStr}Z`
      + `&location=${encodeURIComponent(c.place || "")}`
      + `&details=${encodeURIComponent("Vaše role: " + m.role + "\n\nAkce: " + c.name)}`;
    window.open(gcal, "_blank");
    alert(`[Mock EmailJS]\nKomu: ${m.email}\nPředmět: Pozvánka na akci ${c.name}\n\nOdeslána pozvánka do kalendáře s žádostí o potvrzení účasti.`);
  };

  const confirmed = team.members.filter((m) => m.status === "confirmed").length;
  const pending   = team.members.filter((m) => m.status === "pending").length;

  // Seskupení členů podle dne pro vícedenní akce
  const allDays = [...new Set(team.members.flatMap((m) => m.days || [c.date]))].sort();

  return (
    <div>
      {/* horní souhrn */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ background: "rgba(37,107,70,.15)", border: "1px solid rgba(37,107,70,.35)", borderRadius: 9, padding: "9px 16px", textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.greenLite }}>{confirmed}</div>
          <div style={{ fontSize: 11, color: T.textDim }}>potvrzeno</div>
        </div>
        <div style={{ background: "rgba(200,160,68,.12)", border: "1px solid rgba(200,160,68,.35)", borderRadius: 9, padding: "9px 16px", textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.brass }}>{pending}</div>
          <div style={{ fontSize: 11, color: T.textDim }}>čeká</div>
        </div>
        <div style={{ flex: 1 }} />
        {/* Teams tlačítko */}
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Video size={16} color="#5468ff" />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.cream, marginBottom: 2 }}>Microsoft Teams meeting</div>
            <div style={{ fontSize: 11, color: T.textDim }}>Pro koordinaci celého týmu před/po akci</div>
          </div>
          {team.teamsUrl ? (
            <a href={team.teamsUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "#5468ff", color: "#fff", borderRadius: 8, fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>
              <ExternalLink size={13} /> Připojit se
            </a>
          ) : (
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {canEdit && <input value={team.teamsUrl || ""} onChange={(e) => updTeam({ teamsUrl: e.target.value })} placeholder="Vložte odkaz na Teams meeting…" style={{ ...inputStyle, width: 260, fontSize: 12 }} />}
              <a href={`https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(c.name)}&content=${encodeURIComponent("Akce: " + c.name + "\nMísto: " + (c.place||"") + "\nDatum: " + (c.date||""))}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "rgba(84,104,255,.15)", border: "1px solid rgba(84,104,255,.4)", color: "#7b8fff", borderRadius: 8, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>
                <Video size={13} /> Vytvořit meeting
              </a>
            </div>
          )}
        </div>
        {canEdit && <Btn kind="green" icon={Plus} onClick={() => setAdding(true)}>Přidat člena týmu</Btn>}
      </div>

      {/* seznam členů — groupováno po dnech pokud vícedenní */}
      {(team.multiDay && allDays.length > 1 ? allDays : [null]).map((day) => {
        const members = day
          ? team.members.filter((m) => (m.days || []).includes(day))
          : team.members;
        return (
          <div key={day || "all"} style={{ marginBottom: day ? 24 : 0 }}>
            {day && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CalendarCheck size={14} color={T.brass} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: T.brass }}>{fmt(day)}</span>
                <span style={{ fontSize: 12, color: T.textDim }}>({members.length} členů)</span>
              </div>
            )}
            <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.2fr auto", gap: 8, padding: "8px 14px", fontSize: 10.5, color: T.textDim, background: T.panel2, borderBottom: `1px solid ${T.line}`, letterSpacing: 0.3, textTransform: "uppercase" }}>
                <span>Jméno / E-mail</span><span>Role na akci</span><span>Od</span><span>Do</span><span>Stav</span><span></span>
              </div>
              {members.map((m) => {
                const st = TEAM_STATUSES[m.status] || TEAM_STATUSES.pending;
                return (
                  <div key={m.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.2fr auto", gap: 8, padding: "11px 14px", alignItems: "center", fontSize: 12.5, borderBottom: `1px solid ${T.line}` }}>
                    {/* jméno */}
                    <div>
                      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        {m.name}
                        {m.type === "external" && <span style={{ fontSize: 10, color: T.warn, background: `${T.warn}18`, border: `1px solid ${T.warn}44`, padding: "1px 6px", borderRadius: 7 }}>extern</span>}
                      </div>
                      <div style={{ fontSize: 11, color: T.textDim }}>{m.email}</div>
                      {m.note && <div style={{ fontSize: 11, color: T.textDim, fontStyle: "italic" }}>{m.note}</div>}
                    </div>
                    {/* role */}
                    {canEdit
                      ? <select value={m.role} onChange={(e) => updMember(m.id, { role: e.target.value })} style={{ ...inputStyle, padding: "4px 6px", fontSize: 12 }}>
                          {TEAM_ROLES.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      : <span style={{ color: T.creamDim }}>{m.role}</span>
                    }
                    {/* od */}
                    {canEdit
                      ? <input type="time" value={m.timeFrom || "08:00"} onChange={(e) => updMember(m.id, { timeFrom: e.target.value })} style={{ ...inputStyle, padding: "4px 6px", fontSize: 12 }} />
                      : <span style={{ color: T.creamDim }}>{m.timeFrom || "—"}</span>
                    }
                    {/* do */}
                    {canEdit
                      ? <input type="time" value={m.timeTo || "18:00"} onChange={(e) => updMember(m.id, { timeTo: e.target.value })} style={{ ...inputStyle, padding: "4px 6px", fontSize: 12 }} />
                      : <span style={{ color: T.creamDim }}>{m.timeTo || "—"}</span>
                    }
                    {/* stav */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, color: st.color, background: st.bg, border: `1px solid ${st.color}44`, padding: "3px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>{st.label}</span>
                    </div>
                    {/* akce */}
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <button onClick={() => sendCalInvite(m)} title="Odeslat pozvánku do kalendáře" style={{ background: "none", border: `1px solid ${T.line}`, borderRadius: 7, cursor: "pointer", padding: "4px 8px", color: T.info, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                        <CalendarCheck size={13} /> pozvat
                      </button>
                      {canEdit && (
                        <>
                          <select value={m.status} onChange={(e) => updMember(m.id, { status: e.target.value })} style={{ ...inputStyle, width: "auto", padding: "3px 6px", fontSize: 11, flex: "none" }}>
                            {Object.entries(TEAM_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                          <button onClick={() => delMember(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {members.length === 0 && (
                <div style={{ padding: "16px 14px", color: T.textDim, fontSize: 13, textAlign: "center" }}>Žádní přiřazení členové{day ? " pro tento den" : ""}.</div>
              )}
            </div>
          </div>
        );
      })}

      {/* vícedenní přepínač */}
      {canEdit && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: team.multiDay ? T.brass : T.textDim }}>
            <input type="checkbox" checked={team.multiDay || false} onChange={(e) => updTeam({ multiDay: e.target.checked })} />
            Vícedenní akce — zobrazit přiřazení po dnech
          </label>
        </div>
      )}

      {/* modal přidání */}
      {adding && <AddTeamMemberModal c={c} onClose={() => setAdding(false)} onAdd={(m) => { addMember(m); setAdding(false); }} />}
    </div>
  );
}

function AddTeamMemberModal({ c, onClose, onAdd }) {
  const [type,     setType]     = useState("internal");
  const [userId,   setUserId]   = useState(USERS_SEED[0]?.id || "");
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [extName,  setExtName]  = useState("");
  const [extEmail, setExtEmail] = useState("");
  const [role,     setRole]     = useState("Prodejce");
  const [days,     setDays]     = useState([c.date || ""]);
  const [timeFrom, setTimeFrom] = useState("08:00");
  const [timeTo,   setTimeTo]   = useState("18:00");
  const [note,     setNote]     = useState("");

  const selectedUser = USERS_SEED.find((u) => u.id === userId);
  const name  = type === "internal" ? selectedUser?.name  || "" : extName;
  const email = type === "internal" ? selectedUser?.email || "" : extEmail;

  const ok = name.trim() && email.trim() && days.length > 0;

  const toggleDay = (d) => setDays((prev) =>
    prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
  );

  // Generujeme dny pro akci (1–5 dní od datumu)
  const eventDays = [];
  if (c.date) {
    const base = new Date(c.date);
    for (let i = 0; i < 5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      eventDays.push(d.toISOString().slice(0, 10));
    }
  }

  return (
    <Modal title="Přidat člena týmu" onClose={onClose}>
      {/* typ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[{ k: "internal", l: "👤 Interní (ze systému)" }, { k: "external", l: "🌐 Externí" }].map((o) => (
          <button key={o.k} onClick={() => setType(o.k)} style={{ flex: 1, padding: "9px 10px", border: `2px solid ${type === o.k ? T.brass : T.line}`, borderRadius: 9, background: type === o.k ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: type === o.k ? T.brass : T.textDim, fontWeight: type === o.k ? 600 : 400, textAlign: "center" }}>
            {o.l}
          </button>
        ))}
      </div>

      {type === "internal" ? (
        <FRow label="Člen týmu">
          <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, cursor: "pointer", marginBottom: 8, color: multiSelect ? T.brass : T.textDim }}>
            <input type="checkbox" checked={multiSelect} onChange={e => { setMultiSelect(e.target.checked); setSelectedUsers([]); }} />
            Vybrat více členů najednou
          </label>
          {multiSelect ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 200, overflowY: "auto", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: 10 }}>
              {USERS_SEED.filter(u => u.active !== false).map(u => (
                <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, padding: "4px 6px", borderRadius: 6, background: selectedUsers.includes(u.id) ? `${T.brass}15` : "transparent" }}>
                  <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={e => setSelectedUsers(prev => e.target.checked ? [...prev, u.id] : prev.filter(x => x !== u.id))} />
                  <span style={{ color: selectedUsers.includes(u.id) ? T.cream : T.textDim }}>{u.name}</span>
                  <span style={{ fontSize: 11, color: T.textDim, marginLeft: "auto" }}>{u.position}</span>
                </label>
              ))}
            </div>
          ) : (
            <select value={userId} onChange={(e) => setUserId(e.target.value)} style={inputStyle}>
              {USERS_SEED.filter((u) => u.active !== false).map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.position}</option>
              ))}
            </select>
          )}
        </FRow>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <FRow label="Jméno *"><input style={inputStyle} value={extName} onChange={(e) => setExtName(e.target.value)} placeholder="Jan Novák" /></FRow>
          <FRow label="E-mail *"><input style={inputStyle} value={extEmail} onChange={(e) => setExtEmail(e.target.value)} placeholder="jan@firma.cz" /></FRow>
        </div>
      )}

      <FRow label="Role na akci">
        <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
          {TEAM_ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </FRow>

      <div style={{ display: "flex", gap: 10 }}>
        <FRow label="Příchod"><input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} style={inputStyle} /></FRow>
        <FRow label="Odchod"><input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} style={inputStyle} /></FRow>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Den(y) přítomnosti</label>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {eventDays.map((d) => (
            <button key={d} onClick={() => toggleDay(d)} style={{ padding: "6px 12px", border: `2px solid ${days.includes(d) ? T.brass : T.line}`, borderRadius: 8, background: days.includes(d) ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, color: days.includes(d) ? T.brass : T.textDim, fontWeight: days.includes(d) ? 600 : 400 }}>
              {fmt(d)}
            </button>
          ))}
        </div>
        {eventDays.length === 0 && <div style={{ fontSize: 12, color: T.textDim }}>Nejdřív nastavte datum akce v základních údajích.</div>}
      </div>

      <FRow label="Poznámka (nepovinné)">
        <input style={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kontakt na místě, speciální požadavky…" />
      </FRow>

      <div style={{ background: `${T.info}12`, border: `1px solid ${T.info}33`, borderRadius: 8, padding: "9px 12px", marginBottom: 14, fontSize: 12.5, color: T.creamDim, lineHeight: 1.7 }}>
        <CalendarCheck size={13} style={{ marginRight: 5 }} color={T.info} />
        Po přidání můžete členu odeslat <b style={{ color: T.cream }}>pozvánku do kalendáře</b> — dostane e-mail s odkazem do Google Kalendáře a žádostí o potvrzení účasti.
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
        <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
        <Btn kind="green" icon={Check} disabled={!ok && !(multiSelect && selectedUsers.length > 0)} onClick={() => {
          if (multiSelect && selectedUsers.length > 0) {
            selectedUsers.forEach(uid2 => {
              const u = USERS_SEED.find(x => x.id === uid2);
              if (u) onAdd({ type: "internal", userId: uid2, name: u.name, email: u.email || "", role, days, timeFrom, timeTo, note });
            });
          } else {
            onAdd({ type, userId: type === "internal" ? userId : null, name, email, role, days, timeFrom, timeTo, note });
          }
        }}>Přidat do týmu</Btn>
      </div>
    </Modal>
  );
}


function BudgetTab({ c, canEdit, onUpdate }) {
  const items       = c.budget?.items || [];
  const eventBudget = c.budget?.eventBudget ?? 0;
  const setEventBudget = (val) => onUpdate((camp) => ({ ...camp, budget: { ...camp.budget, eventBudget: val } }));

  const addItem = () => onUpdate((camp) => ({
    ...camp,
    budget: { ...camp.budget, items: [...(camp.budget?.items || []), { id: uid(), name: "", supplier: "", note: "", vatRate: 21, planNet: "", realNet: "" }] },
  }));
  const updItem = (id, p) => onUpdate((camp) => ({ ...camp, budget: { ...camp.budget, items: camp.budget.items.map((i) => i.id === id ? { ...i, ...p } : i) } }));
  const delItem = (id) => onUpdate((camp) => ({ ...camp, budget: { ...camp.budget, items: camp.budget.items.filter((i) => i.id !== id) } }));

  const totalPlanGross = items.reduce((s, i) => s + withVat(i.planNet || i.amountNet || 0, i.vatRate), 0);
  const totalRealGross = items.reduce((s, i) => s + withVat(i.realNet || 0, i.vatRate), 0);
  const totalPlanNet   = items.reduce((s, i) => s + num(i.planNet || i.amountNet || 0), 0);
  const totalRealNet   = items.reduce((s, i) => s + num(i.realNet || 0), 0);
  const diff = totalPlanGross - totalRealGross;

  const remaining = eventBudget > 0 ? eventBudget - totalPlanGross : null;
  const overBudget = remaining != null && remaining < 0;

  return (
    <div>
      {/* rozpočet akce */}
      <div style={{ background: T.panel, border: `1px solid ${overBudget ? T.danger : T.line}`, borderRadius: 11, padding: "13px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 240px" }}>
          <label style={lbl}>Celkový rozpočet akce (Kč)</label>
          {canEdit
            ? <input type="number" value={eventBudget || ""} onChange={(e) => setEventBudget(+e.target.value || 0)} style={inputStyle} placeholder="např. 100 000" />
            : <div style={{ fontSize: 18, fontWeight: 700, color: T.brass }}>{czk(eventBudget)}</div>
          }
        </div>
        {eventBudget > 0 && (
          <>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 2 }}>Plánováno celkem</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: T.info }}>{czk(totalPlanGross)}</div>
            </div>
            <div style={{ fontSize: 22, color: T.line }}>→</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 2 }}>Zbývá z rozpočtu</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: overBudget ? T.danger : T.greenLite }}>
                {overBudget ? "" : "+"}{czk(remaining)}
              </div>
            </div>
            {overBudget && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.danger, fontSize: 12.5 }}>
                <AlertTriangle size={15} /> Překročení rozpočtu o {czk(Math.abs(remaining))}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ height: 8, background: T.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${T.line}` }}>
                <div style={{ width: `${Math.min(100, Math.round((totalPlanGross / eventBudget) * 100))}%`, height: "100%", background: overBudget ? T.danger : totalPlanGross / eventBudget > 0.85 ? T.warn : T.greenLite }} />
              </div>
              <div style={{ fontSize: 10.5, color: T.textDim, marginTop: 4 }}>
                {Math.round((totalPlanGross / eventBudget) * 100)}% rozpočtu čerpáno
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 14 }}>
        <SumCard label="Plán bez DPH"       val={czk(totalPlanNet)}   color={T.info} />
        <SumCard label="Plán s DPH"         val={czk(totalPlanGross)} color={T.info} />
        <SumCard label="Reálné bez DPH"     val={czk(totalRealNet)}   color={T.greenLite} />
        <SumCard label="Reálné s DPH"       val={czk(totalRealGross)} color={totalRealGross > totalPlanGross ? T.danger : T.greenLite} />
        <SumCard label="Rozdíl plán − reál" val={(diff >= 0 ? "+" : "") + czk(diff)} color={diff >= 0 ? T.greenLite : T.danger} />
      </div>
      <div style={{ fontSize: 12, color: T.textDim, marginBottom: 12, padding: "9px 12px", background: T.bg, borderRadius: 8, border: `1px solid ${T.line}`, lineHeight: 1.7 }}>
        Přidejte položku a vyplňte <b style={{ color: T.info }}>Plán</b> (očekávaný náklad) a <b style={{ color: T.greenLite }}>Reál</b> (skutečně zaplaceno). Reál lze doplnit kdykoli — rozdíl se počítá automaticky pro každou položku i celkem.
      </div>
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, overflowX: "auto", marginBottom: 12 }}>
        <div style={{ minWidth: 820 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 0.7fr 1.1fr 1.1fr 1fr auto", gap: 8, padding: "8px 12px", fontSize: 10.5, color: T.textDim, background: T.panel2, borderBottom: `1px solid ${T.line}`, letterSpacing: 0.3 }}>
            <span>NÁZEV / DODAVATEL</span><span>POZNÁMKA</span><span>DPH</span>
            <span style={{ color: T.info }}>PLÁN (bez DPH)</span>
            <span style={{ color: T.greenLite }}>REÁL (bez DPH)</span>
            <span>ROZDÍL (s DPH)</span>
            <span></span>
          </div>
          {items.map((item) => {
            const planG  = withVat(item.planNet || item.amountNet || 0, item.vatRate);
            const realG  = withVat(item.realNet || 0, item.vatRate);
            const hasReal = item.realNet !== "" && item.realNet != null;
            const itemDiff = hasReal ? planG - realG : null;
            return (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 0.7fr 1.1fr 1.1fr 1fr auto", gap: 8, padding: "9px 12px", alignItems: "start", fontSize: 12, borderBottom: `1px solid ${T.line}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {canEdit ? <input value={item.name || ""} onChange={(e) => updItem(item.id, { name: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 12 }} placeholder="Catering…" />
                           : <span style={{ fontWeight: 500 }}>{item.name || "—"}</span>}
                  {canEdit ? <input value={item.supplier || ""} onChange={(e) => updItem(item.id, { supplier: e.target.value })} style={{ ...inputStyle, padding: "3px 7px", fontSize: 11 }} placeholder="Dodavatel" />
                           : <span style={{ fontSize: 11, color: T.textDim }}>{item.supplier || "—"}</span>}
                </div>
                {canEdit ? <input value={item.note || ""} onChange={(e) => updItem(item.id, { note: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 12 }} placeholder="Poznámka" />
                         : <span style={{ color: T.textDim, fontSize: 11 }}>{item.note || "—"}</span>}
                {canEdit ? <select value={item.vatRate} onChange={(e) => updItem(item.id, { vatRate: +e.target.value })} style={{ ...inputStyle, padding: "4px 5px", fontSize: 12 }}>{VAT.map((r) => <option key={r} value={r}>{r}%</option>)}</select>
                         : <span>{item.vatRate}%</span>}
                <div>
                  {canEdit ? <input type="number" value={item.planNet ?? item.amountNet ?? ""} onChange={(e) => updItem(item.id, { planNet: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 12, border: `1px solid ${T.info}55` }} placeholder="0" />
                           : <span style={{ color: T.info }}>{czk(item.planNet || item.amountNet || 0)}</span>}
                  <div style={{ fontSize: 10, color: T.info, marginTop: 2 }}>s DPH: {czk(planG)}</div>
                </div>
                <div>
                  {canEdit ? <input type="number" value={item.realNet ?? ""} onChange={(e) => updItem(item.id, { realNet: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 12, border: `1px solid ${T.greenLite}55` }} placeholder="0" />
                           : <span style={{ color: T.greenLite }}>{hasReal ? czk(item.realNet) : <span style={{ color: T.line }}>—</span>}</span>}
                  {hasReal && <div style={{ fontSize: 10, color: T.greenLite, marginTop: 2 }}>s DPH: {czk(realG)}</div>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, paddingTop: 4 }}>
                  {itemDiff != null ? <span style={{ color: itemDiff >= 0 ? T.greenLite : T.danger }}>{itemDiff >= 0 ? "+" : ""}{czk(itemDiff)}</span> : <span style={{ color: T.line }}>—</span>}
                </div>
                {canEdit && <button onClick={() => delItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>}
              </div>
            );
          })}
          {items.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 0.7fr 1.1fr 1.1fr 1fr auto", gap: 8, padding: "9px 12px", background: T.panel2, borderTop: `2px solid ${T.line}`, fontWeight: 600, fontSize: 12 }}>
              <span style={{ color: T.cream }}>CELKEM</span><span></span><span></span>
              <div><span style={{ color: T.info }}>{czk(totalPlanNet)}</span><div style={{ fontSize: 10, color: T.info }}>s DPH: {czk(totalPlanGross)}</div></div>
              <div><span style={{ color: T.greenLite }}>{czk(totalRealNet)}</span><div style={{ fontSize: 10, color: T.greenLite }}>s DPH: {czk(totalRealGross)}</div></div>
              <span style={{ fontSize: 14, color: diff >= 0 ? T.greenLite : T.danger }}>{diff >= 0 ? "+" : ""}{czk(diff)}</span>
              <span></span>
            </div>
          )}
          {items.length === 0 && <div style={{ padding: 18, textAlign: "center", color: T.textDim, fontSize: 13 }}>Zatím žádné položky — přidejte první tlačítkem níže.</div>}
        </div>
      </div>
      {canEdit && <Btn kind="green" icon={Plus} small onClick={addItem}>Přidat položku</Btn>}
    </div>
  );
}

/* ════════════════════════════════════════
   DOTAZNÍK SPOKOJENOSTI
════════════════════════════════════════ */

/* ════════════════════════════════════════
   LEADY — zájem o vůz na akci
════════════════════════════════════════ */

/* ════════════════════════════════════════
   SPRÁVA UŽIVATELŮ
════════════════════════════════════════ */
function UsersModal({ users, onClose, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);

  const addUser = (u) => onUpdate([...users, { ...u, id: uid(), active: true }]);
  const toggleActive = (id) => onUpdate(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  const updateUser = (id, patch) => onUpdate(users.map(u => u.id === id ? { ...u, ...patch } : u));

  return (
    <Modal title="Správa uživatelů" onClose={onClose} wide>
      <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.7 }}>
          Admin zakládá účty — uživatel dostane e-mail s odkazem pro nastavení hesla (Firebase Auth).
        </div>
        <Btn kind="primary" icon={Plus} small onClick={() => setAdding(true)}>Přidat uživatele</Btn>
      </div>

      <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 1.3fr 0.7fr auto", gap: 8, padding: "8px 12px", fontSize: 10.5, color: T.textDim, background: T.panel2, borderBottom: `1px solid ${T.line}`, letterSpacing: 0.3 }}>
          <span>JMÉNO</span><span>E-MAIL / TELEFON</span><span>ROLE</span><span>POZICE</span><span>STAV</span><span></span>
        </div>
        {users.map(u => {
          const roleMeta = ROLES_META.find(r => r.id === u.role);
          const isEditing = editId === u.id;
          return (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 1.3fr 0.7fr auto", gap: 8, padding: "10px 12px", alignItems: "center", fontSize: 12.5, borderBottom: `1px solid ${T.line}`, opacity: u.active ? 1 : 0.45 }}>
              <span style={{ fontWeight: 500, color: T.cream }}>{u.name}</span>
              <div>
                <div style={{ fontSize: 12, color: T.creamDim }}>{u.email}</div>
                <div style={{ fontSize: 11, color: T.textDim }}>{u.phone}</div>
              </div>
              {isEditing ? (
                <select value={u.role} onChange={(e) => updateUser(u.id, { role: e.target.value })} style={{ ...inputStyle, padding: "4px 6px", fontSize: 11.5 }}>
                  {ROLES_META.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              ) : (
                <span style={{ fontSize: 11.5, color: roleMeta?.id === "admin" ? T.brass : roleMeta?.id === "approver" ? T.purple : T.info }}>{roleMeta?.label}</span>
              )}
              {isEditing ? (
                <input value={u.position} onChange={(e) => updateUser(u.id, { position: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 11.5 }} />
              ) : (
                <span style={{ fontSize: 11.5, color: T.textDim }}>{u.position}{u.dept ? <span style={{ color: T.brass, marginLeft: 4, fontSize: 10.5 }}>| {u.dept}</span> : ""}</span>
              )}
              <button onClick={() => toggleActive(u.id)} style={{ background: "none", border: `1px solid ${u.active ? T.greenLite : T.line}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 10.5, color: u.active ? T.greenLite : T.textDim }}>
                {u.active ? "aktivní" : "neaktivní"}
              </button>
              <div style={{ display: "flex", gap: 5 }}>
                {isEditing
                  ? <button onClick={() => setEditId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.greenLite, fontSize: 13 }}>✓</button>
                  : <button onClick={() => setEditId(u.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim, fontSize: 12 }}>✏️</button>
                }
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.8, padding: "10px 14px", background: T.bg, borderRadius: 9, border: `1px solid ${T.line}` }}>
        <b style={{ color: T.cream }}>Přihlašování:</b> Firebase Auth — e-mail + heslo. Nový uživatel dostane odkaz pro nastavení hesla. Reset hesla přes „Zapomenuté heslo" na přihlašovací stránce. Každý uživatel má v profilu jméno, e-mail, telefon, roli a pozici ve firmě.
      </div>

      {adding && <AddUserModal users={users} onClose={() => setAdding(false)} onAdd={(u) => { addUser(u); setAdding(false); }} />}
    </Modal>
  );
}

function AddUserModal({ users, onClose, onAdd }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", role: "lite", position: "" });
  const ok = f.name && f.email && f.position;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14, width: "100%", maxWidth: 440, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.cream }}>Nový uživatel</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim }}><X size={18} /></button>
        </div>
        <FRow label="Celé jméno *"><input style={inputStyle} value={f.name} onChange={e => setF({...f, name: e.target.value})} placeholder="Jan Novák" /></FRow>
        <FRow label="E-mail * (pro přihlášení)"><input type="email" style={inputStyle} value={f.email} onChange={e => setF({...f, email: e.target.value})} placeholder="j.novak@sw-automobily.cz" /></FRow>
        <FRow label="Telefon"><input style={inputStyle} value={f.phone} onChange={e => setF({...f, phone: e.target.value})} placeholder="+420 602 …" /></FRow>
        <div style={{ display: "flex", gap: 10 }}>
          <FRow label="Role *">
            <select style={inputStyle} value={f.role} onChange={e => setF({...f, role: e.target.value})}>
              {ROLES_META.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </FRow>
          <FRow label="Pozice ve firmě *"><input style={inputStyle} value={f.position} onChange={e => setF({...f, position: e.target.value})} placeholder="Obchodní zástupce" /></FRow>
        </div>
        <FRow label="Hlavní oddělení">
          <input
            style={inputStyle}
            value={f.dept || ""}
            onChange={e => setF({...f, dept: e.target.value})}
            placeholder="Prodej OA, Servis, LKW, Marketing…"
            list="dept-list"
          />
          <datalist id="dept-list">
            {[...new Set(users.filter(u => u.dept).map(u => u.dept))].map(d => <option key={d} value={d} />)}
          </datalist>
        </FRow>
        <FRow label="Divize (zákazník od tohoto prodejce se zařadí do těchto divizí)">
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 6 }}>Prodejce může patřit do více divizí (např. OA i TRAPO).</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EVENT_DEPTS.map(d => {
              const on = (f.depts || []).includes(d.id);
              return (
                <label key={d.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: on ? `${T.brass}18` : T.bg, border: `1px solid ${on ? T.brass : T.line}`, borderRadius: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={on} onChange={e => { const cur = f.depts || []; setF({...f, depts: e.target.checked ? [...cur, d.id] : cur.filter(x => x !== d.id)}); }} />
                  <span style={{ fontSize: 12.5, fontWeight: on ? 600 : 400, color: on ? T.cream : T.textDim }}>{d.label}</span>
                </label>
              );
            })}
          </div>
        </FRow>
        <div style={{ background: `${T.info}15`, border: `1px solid ${T.info}44`, borderRadius: 8, padding: "9px 12px", fontSize: 12, color: T.creamDim, marginBottom: 14, lineHeight: 1.7 }}>
          📧 Po uložení se uživateli odešle e-mail s odkazem pro nastavení hesla. Přihlásí se pomocí e-mailu a hesla.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
          <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
          <Btn kind="green" icon={Check} disabled={!ok} onClick={() => onAdd(f)}>Přidat a odeslat pozvánku</Btn>
        </div>
      </div>
    </div>
  );
}



/* ════════════════════════════════════════
   LEADY — zájem o vůz na akci
════════════════════════════════════════ */
const INTEREST_LEVELS = [
  { id: "velky",     label: "Velký zájem",   color: "#2e7d54", bg: "rgba(37,107,70,.15)",  icon: "🔥" },
  { id: "zjistit",   label: "Zjistit více",  color: "#c9a24b", bg: "rgba(200,160,68,.12)", icon: "💡" },
  { id: "informace", label: "Jen informace", color: "#5a93c4", bg: "rgba(78,143,189,.12)", icon: "ℹ️" },
];

const POPULAR_MODELS = [
  "GLE 450 4MATIC","GLS 400d","G 500","GLC 300 4MATIC","C 300","S 500 L",
  "EQS 450+","EQS 580 4MATIC","EQE 350","EQB 300 4MATIC","EQA 250+",
  "Sprinter 319 CDI","Vito 116 CDI","V 300d","AMG GT 63 S",
];

function LeadsTab({ c, role, onUpdate }) {
  const [open, setOpen] = useState(false);
  const leads = c.leads || [];
  const canEdit = ["admin","approver","hosteska","lite"].includes(role);
  const canAssign = role === "admin" || role === "approver" || role === "hosteska" || role === "lite";
  const sellers = USERS_SEED.filter(u => u.role === "lite");

  const addLead = (lead) => onUpdate((camp) => ({
    ...camp,
    leads: [...(camp.leads || []), { id: uid(), at: new Date().toISOString().slice(0,10), addedBy: role, ...lead }],
  }));
  const removeLead = (id) => onUpdate((camp) => ({
    ...camp, leads: (camp.leads || []).filter(l => l.id !== id),
  }));
  const assignLead = (id, uid2) => onUpdate((camp) => ({
    ...camp, leads: (camp.leads || []).map(l => l.id === id ? { ...l, assignedTo: uid2 || null } : l),
  }));

  const byLevel = (lvl) => leads.filter(l => l.interest === lvl);

  return (
    <div>
      {/* souhrn karet */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {INTEREST_LEVELS.map(lvl => (
            <div key={lvl.id} style={{ background: lvl.bg, border: `1px solid ${lvl.color}55`, borderRadius: 9, padding: "9px 16px", textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 20 }}>{lvl.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: lvl.color }}>{byLevel(lvl.id).length}</div>
              <div style={{ fontSize: 11, color: T.textDim }}>{lvl.label}</div>
            </div>
          ))}
        </div>
        {canEdit && <Btn kind="green" icon={Plus} onClick={() => setOpen(true)}>+ Zájem o vůz</Btn>}
      </div>

      {/* seznam po úrovních */}
      {INTEREST_LEVELS.map(lvl => {
        const group = byLevel(lvl.id);
        if (!group.length) return null;
        return (
          <div key={lvl.id} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 17 }}>{lvl.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: lvl.color }}>{lvl.label}</span>
              <span style={{ fontSize: 12, color: T.textDim }}>({group.length})</span>
            </div>
            {group.map(lead => {
              const assignedUser = USERS_SEED.find(u => u.id === lead.assignedTo);
              return (
                <div key={lead.id} style={{ background: T.panel, border: `1px solid ${lvl.color}44`, borderRadius: 10, padding: "13px 15px", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 13 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: lvl.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{lvl.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{lead.name}</span>
                      {lead.isGuest && <span style={{ fontSize: 10.5, color: T.warn, background: `${T.warn}18`, border: `1px solid ${T.warn}44`, padding: "1px 7px", borderRadius: 9 }}>host z venku</span>}
                      {lead.phone && <span style={{ fontSize: 12, color: T.textDim }}>{lead.phone}</span>}
                    </div>
                    <div style={{ fontSize: 13.5, color: T.brass, fontWeight: 600, marginBottom: 5 }}>🚗 {lead.model}</div>
                    {lead.note && (
                      <div style={{ fontSize: 12.5, color: T.creamDim, background: T.bg, borderRadius: 7, padding: "6px 11px", marginBottom: 7, lineHeight: 1.6 }}>💬 {lead.note}</div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: T.textDim }}>{lead.at} · zadal: {lead.addedBy}</span>
                      {canAssign ? (
                        <select
                          value={lead.assignedTo || ""}
                          onChange={e => assignLead(lead.id, e.target.value)}
                          style={{ ...inputStyle, width: "auto", padding: "3px 8px", fontSize: 11.5, flex: "none" }}
                        >
                          <option value="">— přiřadit prodejci —</option>
                          {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      ) : assignedUser ? (
                        <span style={{ fontSize: 11.5, color: T.info }}>→ {assignedUser.name}</span>
                      ) : null}
                    </div>
                  </div>
                  {canEdit && (
                    <button onClick={() => removeLead(lead.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, flexShrink: 0 }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {!leads.length && (
        <div style={{ padding: 40, textAlign: "center", color: T.textDim }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚗</div>
          <div style={{ fontSize: 15, color: T.cream, marginBottom: 6 }}>Zatím žádné leady</div>
          <div style={{ fontSize: 13 }}>Hosteska nebo prodejce zadá zájem o vůz přímo na akci.</div>
        </div>
      )}

      {open && <AddLeadModal c={c} onClose={() => setOpen(false)} onAdd={(lead) => { addLead(lead); setOpen(false); }} />}
    </div>
  );
}

function AddLeadModal({ c, onClose, onAdd, prefillName = "", prefillPhone = "", prefillPartId = null }) {
  const participants = (c.parts || []).filter(p => ["potvrzen","prihlasen"].includes(p.state));
  // pokud přišel konkrétní zákazník (prefillPartId), předvyber ho; jinak když je prefillName, dohledej podle jména
  const initialPart = prefillPartId && participants.some(p => p.id === prefillPartId)
    ? prefillPartId
    : (prefillName ? (participants.find(p => (p.data[c.fieldMeta.nameId] || "") === prefillName)?.id || "new") : "new");

  const [name,     setName]     = useState(prefillName || "");
  const [phone,    setPhone]    = useState(prefillPhone || "");
  const [model,    setModel]    = useState("");
  const [custom,   setCustom]   = useState(false);
  const [interest, setInterest] = useState("velky");
  const [note,     setNote]     = useState("");
  const [selPart,  setSelPart]  = useState(initialPart);

  const pickPart = (pid) => {
    setSelPart(pid);
    if (pid === "new") { setName(""); setPhone(""); return; }
    const p = c.parts.find(x => x.id === pid);
    if (p) { setName(p.data[c.fieldMeta.nameId] || ""); setPhone(p.data[c.fieldMeta.phoneId] || ""); }
  };

  const ok = name.trim() && model.trim();

  return (
    <Modal title="Zájem o vůz" onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Zákazník</label>
        <select value={selPart} onChange={e => pickPart(e.target.value)} style={inputStyle}>
          <option value="new">➕ Nový host (není v akci)</option>
          {participants.map(p => <option key={p.id} value={p.id}>{p.data[c.fieldMeta.nameId] || "—"}</option>)}
        </select>
      </div>
      {selPart === "new" ? (
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <FRow label="Jméno *"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Jméno zákazníka" /></FRow>
          <FRow label="Telefon"><input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+420 …" /></FRow>
        </div>
      ) : (
        <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "9px 12px", marginBottom: 14, fontSize: 13, color: T.creamDim }}>
          👤 {name}{phone ? ` · ${phone}` : ""}
        </div>
      )}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Model vozu *</label>
        {!custom ? (
          <div style={{ display: "flex", gap: 8 }}>
            <select value={model} onChange={e => setModel(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              <option value="">— vyberte model —</option>
              {POPULAR_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={() => setCustom(true)} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px", color: T.textDim, cursor: "pointer", fontSize: 12, fontFamily: "inherit", whiteSpace: "nowrap" }}>vlastní</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} value={model} onChange={e => setModel(e.target.value)} placeholder="Např. AMG GT 63 S" autoFocus />
            <button onClick={() => setCustom(false)} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px", color: T.textDim, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>seznam</button>
          </div>
        )}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Úroveň zájmu *</label>
        <div style={{ display: "flex", gap: 8 }}>
          {INTEREST_LEVELS.map(lvl => (
            <button key={lvl.id} onClick={() => setInterest(lvl.id)} style={{ flex: 1, padding: "10px 8px", border: `2px solid ${interest === lvl.id ? lvl.color : T.line}`, borderRadius: 9, background: interest === lvl.id ? lvl.bg : T.bg, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 3 }}>{lvl.icon}</div>
              <div style={{ fontSize: 12, fontWeight: interest === lvl.id ? 600 : 400, color: interest === lvl.id ? lvl.color : T.textDim }}>{lvl.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Poznámka (nepovinné)</label>
        <input style={inputStyle} value={note} onChange={e => setNote(e.target.value)} placeholder="Chce test drive, volat příští týden…" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
        <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
        <Btn kind="green" icon={Check} disabled={!ok} onClick={() => onAdd({ name: name.trim(), phone: phone.trim(), model: model.trim(), interest, note: note.trim(), isGuest: selPart === "new" })}>Uložit zájem</Btn>
      </div>
    </Modal>
  );
}


function HosteskaDetail({ c, onBack, onUpdate }) {
  const [addingLead, setAddingLead] = useState(false);
  const [selPart, setSelPart] = useState(null);
  const { nameId, phoneId } = c.fieldMeta;
  const leads = c.leads || [];
  const participants = c.parts.filter(p => ["potvrzen","prihlasen"].includes(p.state));

  const addLead = (lead) => onUpdate((camp) => ({ ...camp, leads: [...(camp.leads || []), { id: uid(), at: new Date().toISOString().slice(0,10), addedBy: "hosteska", ...lead }] }));

  return (
    <div>
      <Btn kind="ghost" icon={ArrowLeft} onClick={onBack} small>Zpět</Btn>
      <h2 style={{ margin: "12px 0 2px", fontSize: 19, fontWeight: 600 }}>{c.name}</h2>
      <div style={{ fontSize: 13, color: T.textDim, marginBottom: 20 }}>{fmt(c.date)} · {c.place} · {participants.length} hostů</div>

      {/* rychlé přidání leadu */}
      <div style={{ background: T.panel, border: `1px solid ${T.brass}44`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} color={T.brass} /> Zadat zájem o vůz
        </div>
        <Btn kind="green" icon={Plus} onClick={() => { setSelPart(null); setAddingLead(true); }}>Nový zájem o vůz</Btn>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 10 }}>nebo klikněte na hosta níže a přidejte zájem přímo k němu</div>
      </div>

      {/* seznam hostů */}
      <div style={{ fontSize: 13, fontWeight: 600, color: T.cream, marginBottom: 10 }}>Hosté na akci</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {participants.map(p => {
          const pLeads = leads.filter(l => l.name === p.data[nameId]);
          return (
            <div key={p.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: "11px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{p.data[nameId] || "—"}</div>
                  <div style={{ fontSize: 12, color: T.textDim }}>{p.data[phoneId] || "—"}</div>
                </div>
                {pLeads.length > 0 && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {pLeads.map(l => {
                      const lvl = INTEREST_LEVELS.find(x => x.id === l.interest);
                      return <span key={l.id} style={{ fontSize: 11, color: lvl.color, background: lvl.bg, border: `1px solid ${lvl.color}44`, padding: "2px 8px", borderRadius: 8 }}>{lvl.icon} {l.model}</span>;
                    })}
                  </div>
                )}
                <Btn kind="ghost" icon={Plus} small onClick={() => { setSelPart(p.id); setAddingLead(true); }}>Zájem</Btn>
              </div>
            </div>
          );
        })}
        {participants.length === 0 && <div style={{ color: T.textDim, fontSize: 13, padding: 16, textAlign: "center" }}>Žádní potvrzení hosté.</div>}
      </div>

      {/* dnešní leady */}
      {leads.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.cream, marginBottom: 10 }}>Zadané zájmy ({leads.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {leads.map(l => {
              const lvl = INTEREST_LEVELS.find(x => x.id === l.interest);
              return (
                <div key={l.id} style={{ background: T.panel, border: `1px solid ${lvl.color}44`, borderRadius: 9, padding: "10px 13px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{lvl.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.cream }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: T.brass }}>🚗 {l.model}</div>
                    {l.note && <div style={{ fontSize: 11.5, color: T.textDim }}>💬 {l.note}</div>}
                  </div>
                  {l.isGuest && <span style={{ fontSize: 10, color: T.warn, border: `1px solid ${T.warn}44`, padding: "1px 6px", borderRadius: 7 }}>host z venku</span>}
                  <div style={{ marginTop: 5 }}>
                    <select value={l.assignedTo || ""} onChange={e => onUpdate((camp) => ({ ...camp, leads: (camp.leads||[]).map(x => x.id===l.id ? {...x, assignedTo: e.target.value||null} : x) }))} style={{ ...inputStyle, width: "100%", padding: "3px 7px", fontSize: 11.5 }}>
                      <option value="">— přiřadit prodejci —</option>
                      {USERS_SEED.filter(u => u.role === "lite").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {addingLead && (
        <AddLeadModal
          c={c}
          prefillPartId={selPart || null}
          prefillName={selPart ? (c.parts.find(p => p.id === selPart)?.data[nameId] || "") : ""}
          prefillPhone={selPart ? (c.parts.find(p => p.id === selPart)?.data[phoneId] || "") : ""}
          onClose={() => setAddingLead(false)}
          onAdd={(lead) => { addLead(lead); setAddingLead(false); }}
        />
      )}
    </div>
  );
}


function SurveyTab({ c, canEdit, onUpdate }) {
  const [view, setView] = useState("builder");
  const survey = c.survey || { fields: [], responses: [], sent: false, sentAt: null };

  const addField = (type) => onUpdate((camp) => ({
    ...camp, survey: { ...camp.survey, fields: [...(camp.survey?.fields || []), { id: uid(), type, label: "", required: false, options: "" }] }
  }));
  const updField = (id, p) => onUpdate((camp) => ({ ...camp, survey: { ...camp.survey, fields: camp.survey.fields.map((f) => f.id === id ? { ...f, ...p } : f) } }));
  const delField = (id) => onUpdate((camp) => ({ ...camp, survey: { ...camp.survey, fields: camp.survey.fields.filter((f) => f.id !== id) } }));

  const sendSurvey = () => {
    onUpdate((camp) => ({ ...camp, survey: { ...camp.survey, sent: true, sentAt: new Date().toISOString().slice(0,10) } }));
    const cnt = c.parts.filter(p => p.state === "potvrzen").length;
    alert(`[Mock EmailJS]\nKomu: ${cnt} potvrzených účastníků\nPředmět: Jak se vám líbil ${c.name}?\n\nE-mail obsahuje odkaz na dotazník a QR kód.`);
  };

  const confirmed = c.parts.filter(p => p.state === "potvrzen").length;
  const respCount = survey.responses?.length || 0;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://akcee.github.io/survey/" + c.id)}`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { k: "builder", l: "📝 Builder otázek" },
            { k: "preview", l: "👁 Náhled formuláře" },
            { k: "qr",      l: "📱 QR / Odkaz" },
            { k: "results", l: `📊 Výsledky (${respCount})` },
          ].map(o => (
            <button key={o.k} onClick={() => setView(o.k)} style={{ padding: "7px 13px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, background: view === o.k ? T.brass : T.bg, color: view === o.k ? T.bg : T.textDim, fontWeight: view === o.k ? 600 : 400, border: `1px solid ${view === o.k ? T.brass : T.line}` }}>
              {o.l}
            </button>
          ))}
        </div>
        <div>
          {survey.sent
            ? <span style={{ fontSize: 12.5, color: T.greenLite, display: "flex", alignItems: "center", gap: 5 }}><Check size={14} /> Odesláno {survey.sentAt} · {respCount}/{confirmed} odpovědí</span>
            : canEdit && <Btn kind="green" icon={Send} onClick={sendSurvey} disabled={survey.fields.length === 0}>Rozeslat dotazník ({confirmed} osob)</Btn>
          }
        </div>
      </div>

      {view === "builder" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 12.5, color: T.textDim, marginBottom: 12 }}>Přidejte otázky — stejný builder jako pole formuláře. Doporučujeme hodnocení (Výběr) + otevřené otázky (Dlouhý text).</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {FIELD_TYPES.map((ft) => (
                <button key={ft.id} onClick={() => canEdit && addField(ft.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 9px", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 7, color: canEdit ? T.cream : T.textDim, fontSize: 12, cursor: canEdit ? "pointer" : "default", fontFamily: "inherit" }}>
                  <ft.icon size={12} color={T.brass} />{ft.label}<Plus size={11} color={T.textDim} />
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {survey.fields.map((f, i) => {
                const meta = FIELD_TYPES.find(t => t.id === f.type);
                return (
                  <div key={f.id} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 11, color: T.textDim, minWidth: 18 }}>{i+1}.</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, color: T.brass, border: `1px solid ${T.line}`, padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap" }}>
                        <meta.icon size={10} />{meta.label}
                      </span>
                      {canEdit
                        ? <input value={f.label} placeholder="Text otázky…" onChange={(e) => updField(f.id, { label: e.target.value })} style={{ ...inputStyle, padding: "5px 8px", fontSize: 12.5 }} />
                        : <span style={{ flex: 1, fontSize: 12.5 }}>{f.label}</span>
                      }
                      {canEdit && (
                        <>
                          <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: f.required ? T.brass : T.textDim, cursor: "pointer", whiteSpace: "nowrap" }}>
                            <input type="checkbox" checked={f.required} onChange={(e) => updField(f.id, { required: e.target.checked })} />povinné
                          </label>
                          <button onClick={() => delField(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger }}><Trash2 size={13} /></button>
                        </>
                      )}
                    </div>
                    {f.type === "select" && canEdit && (
                      <input value={f.options} placeholder="Možnosti oddělené čárkou (⭐⭐⭐⭐⭐ Výborné, ⭐⭐⭐⭐ Dobré…)" onChange={(e) => updField(f.id, { options: e.target.value })} style={{ ...inputStyle, padding: "4px 7px", fontSize: 11.5, marginTop: 7 }} />
                    )}
                  </div>
                );
              })}
              {survey.fields.length === 0 && <div style={{ padding: 20, textAlign: "center", color: T.textDim, fontSize: 13, border: `1px dashed ${T.line}`, borderRadius: 9 }}>Zatím žádné otázky.</div>}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 10 }}>Náhled</div>
            <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 12, padding: 18, position: "sticky", top: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.cream, marginBottom: 4 }}>Hodnocení — {c.name}</div>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 16 }}>Děkujeme za účast, povězte nám jak se vám líbilo.</div>
              {survey.fields.map((f) => (
                <div key={f.id} style={{ marginBottom: 13 }}>
                  <label style={lbl}>{f.label || "Bez názvu"}{f.required && <span style={{ color: T.brass }}> *</span>}</label>
                  <FieldInput field={f} value="" onChange={() => {}} />
                </div>
              ))}
              {survey.fields.length > 0 && <Btn kind="green" icon={Send} small>Odeslat hodnocení</Btn>}
            </div>
          </div>
        </div>
      )}

      {view === "preview" && (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: T.green, padding: "16px 22px", display: "flex", alignItems: "center", gap: 9 }}>
              <ClipboardList size={18} color={T.brass} />
              <span style={{ fontSize: 16, fontWeight: 600, color: T.cream }}>Hodnocení — {c.name}</span>
            </div>
            <div style={{ padding: "22px" }}>
              <div style={{ fontSize: 13, color: T.textDim, marginBottom: 20, lineHeight: 1.7 }}>Vážený zákazníku, děkujeme za účast. Rádi bychom znali váš názor — dotazník zabere jen 2 minuty.</div>
              {survey.fields.map((f, i) => (
                <div key={f.id} style={{ marginBottom: 16 }}>
                  <label style={{ ...lbl, fontSize: 13 }}>{i+1}. {f.label || "Bez názvu"}{f.required && <span style={{ color: T.brass }}> *</span>}</label>
                  <FieldInput field={f} value="" onChange={() => {}} />
                </div>
              ))}
              {survey.fields.length === 0 && <div style={{ color: T.textDim, fontSize: 13 }}>Nastavte otázky v záložce Builder.</div>}
              {survey.fields.length > 0 && <div style={{ marginTop: 20 }}><Btn kind="green" icon={Send}>Odeslat hodnocení</Btn></div>}
            </div>
          </div>
        </div>
      )}

      {view === "qr" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 13, padding: 22, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 4 }}>📱 QR kód</div>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 16 }}>Vytiskněte a umístěte na místě akce</div>
            <img src={qrUrl} alt="QR kód" style={{ borderRadius: 10, border: `4px solid #fff`, background: "#fff", padding: 4 }} />
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 10 }}>Naskenováním se otevře dotazník</div>
          </div>
          <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 13, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 4 }}>✉️ Odkaz pro e-mail</div>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 16 }}>Vloží se do e-mailu odeslaného po akci</div>
            <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 13px", fontFamily: "monospace", fontSize: 11.5, color: T.brass, wordBreak: "break-all", marginBottom: 16 }}>
              {"https://akcee.github.io/survey/" + c.id}
            </div>
            <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.9 }}>
              <div>📅 Rozesílá se <b style={{ color: T.cream }}>den po akci</b></div>
              <div>👥 Dostane jej <b style={{ color: T.cream }}>{confirmed} potvrzených</b> účastníků</div>
              <div>⏱ Odpovědi sbíráme <b style={{ color: T.cream }}>7 dní</b></div>
            </div>
            {canEdit && !survey.sent && survey.fields.length > 0 && (
              <div style={{ marginTop: 16 }}><Btn kind="green" icon={Send} onClick={sendSurvey}>Rozeslat nyní</Btn></div>
            )}
          </div>
        </div>
      )}

      {view === "results" && (
        <div>
          {respCount === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: T.textDim }}>
              <MessageSquare size={32} color={T.brass} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 15, color: T.cream, marginBottom: 6 }}>Zatím žádné odpovědi</div>
              <div style={{ fontSize: 13 }}>Odpovědi se zobrazí po odeslání dotazníku zákazníkům.</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 9, padding: "12px 16px", flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T.brass }}>{respCount}</div>
                  <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>odpovědí z {confirmed} pozvaných</div>
                </div>
                <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 9, padding: "12px 16px", flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T.greenLite }}>{confirmed > 0 ? Math.round(respCount/confirmed*100) : 0} %</div>
                  <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>míra odpovědí</div>
                </div>
              </div>
              {survey.fields.map((f) => {
                const answers = (survey.responses || []).map(r => r.data[f.id]).filter(Boolean);
                if (f.type === "select") {
                  const dist = {};
                  answers.forEach(a => { dist[a] = (dist[a]||0)+1; });
                  return (
                    <div key={f.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 16, marginBottom: 12 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 12 }}>{f.label}</div>
                      {Object.entries(dist).sort((a,b) => b[1]-a[1]).map(([ans, cnt]) => (
                        <div key={ans} style={{ marginBottom: 9 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                            <span>{ans}</span>
                            <span style={{ color: T.brass, fontWeight: 600 }}>{cnt}× ({Math.round(cnt/answers.length*100)} %)</span>
                          </div>
                          <div style={{ height: 8, background: T.bg, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${Math.round(cnt/answers.length*100)}%`, height: "100%", background: T.brass }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  const textAnswers = answers.filter(a => a.trim());
                  if (textAnswers.length === 0) return null;
                  return (
                    <div key={f.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 16, marginBottom: 12 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.cream, marginBottom: 12 }}>{f.label}</div>
                      {textAnswers.map((a, i) => (
                        <div key={i} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "9px 13px", marginBottom: 7, fontSize: 13, color: T.creamDim, lineHeight: 1.6 }}>
                          💬 {a}
                        </div>
                      ))}
                    </div>
                  );
                }
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}


function TeamReportRow({ m }) {
  const [editFrom, setEditFrom] = useState(m.timeFrom || "08:00");
  const [editTo,   setEditTo]   = useState(m.timeTo   || "18:00");
  const st = TEAM_STATUSES[m.status] || TEAM_STATUSES.pending;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.2fr", gap: 8, padding: "9px 12px", alignItems: "center", fontSize: 12.5, borderBottom: `1px solid ${T.line}` }}>
      <div>
        <div style={{ fontWeight: 600 }}>{m.name}{m.type === "external" && <span style={{ fontSize: 10, color: T.warn, marginLeft: 5 }}>extern</span>}</div>
        <div style={{ fontSize: 11, color: T.textDim }}>{m.email}</div>
      </div>
      <span style={{ color: T.creamDim }}>{m.role}</span>
      <input type="time" value={editFrom} onChange={(e) => setEditFrom(e.target.value)} style={{ ...inputStyle, padding: "3px 6px", fontSize: 12 }} />
      <input type="time" value={editTo}   onChange={(e) => setEditTo(e.target.value)}   style={{ ...inputStyle, padding: "3px 6px", fontSize: 12 }} />
      <span style={{ fontSize: 11.5, color: st.color, background: st.bg, border: `1px solid ${st.color}44`, padding: "2px 8px", borderRadius: 8 }}>{st.label}</span>
    </div>
  );
}

function ReportTab({ c }) {
  const t          = budgetTotals(c.budget?.items);
  const confirmed  = c.parts.filter((p) => p.state === "potvrzen").length;
  const costPerPax = confirmed > 0 ? Math.round(t.realGross / confirmed) : null;
  const stateData  = STATE_ORDER
    .map((s) => ({ name: STATES[s].label, value: c.parts.filter((p) => p.state === s).length, color: STATES[s].color }))
    .filter((d) => d.value > 0);

  const eqStats = (c.equipment || []).map((eq) => ({
    ...eq,
    count: c.parts.filter((p) => (p.eqChoice || {})[eq.id]).length,
    icon: EQ_PRESETS.find((p) => p.id === eq.presetId)?.icon || "📦",
  }));

  return (
    <div>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Btn kind="ghost" icon={Download} onClick={() => exportBudgetExcel(c)}>Export Excel</Btn>
      <Btn kind="ghost" icon={Printer} onClick={() => exportBudgetPdf(c)}>PDF s grafem 🥧</Btn>
      <Btn kind="ghost" icon={Printer} onClick={() => window.print()}>Tisk / PDF</Btn>
        <Btn kind="ghost" icon={Download} onClick={() => {
          const w = window.open("", "_blank");
          const isGolf = c.activityType === "golf";
          w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Informační list — ${c.name}</title>
<style>
  body { font-family: 'CorporateS', Arial, sans-serif; margin: 0; background: #fff; color: #1a2a1a; }
  .header { background: #1a5235; color: #f3efe3; padding: 24px 32px; display: flex; align-items: center; gap: 16px; }
  .header h1 { margin: 0; font-size: 22px; font-family: 'CorporateA', Georgia, serif; }
  .header .sub { font-size: 13px; opacity: 0.75; margin-top: 4px; }
  .body { padding: 28px 32px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0; }
  .info-box { background: #f5f2ea; border-radius: 8px; padding: 14px 16px; border-left: 4px solid #c8a044; }
  .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6a7a6a; margin-bottom: 4px; }
  .info-value { font-size: 15px; font-weight: 600; color: #1a2a1a; }
  table { width: 100%; border-collapse: collapse; margin-top: 18px; }
  th { background: #1a5235; color: #f3efe3; padding: 8px 12px; text-align: left; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; }
  td { padding: 8px 12px; border-bottom: 1px solid #e8e4da; font-size: 13px; }
  tr:nth-child(even) td { background: #faf8f3; }
  .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #d9d3c2; font-size: 11px; color: #8a9a8a; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style></head><body>
<div class="header">
  <div style="font-size:32px">⛳</div>
  <div><h1>${c.name}</h1><div class="sub">${c.place} · ${c.date ? new Date(c.date).toLocaleDateString("cs-CZ",{weekday:"long",year:"numeric",month:"long",day:"numeric"}) : ""}</div></div>
</div>
<div class="body">
  <div class="info-grid">
    <div class="info-box"><div class="info-label">Datum a čas</div><div class="info-value">${c.date ? new Date(c.date).toLocaleDateString("cs-CZ") : "—"}</div></div>
    <div class="info-box"><div class="info-label">Místo konání</div><div class="info-value">${c.place || "—"}</div></div>
    <div class="info-box"><div class="info-label">Typ akce</div><div class="info-value">${c.activityType === "golf" ? "⛳ Golf" : c.activityType === "degustace" ? "🍷 Degustace" : c.activityType === "testjizda" ? "🚗 Testovací jízdy" : "Akce"}</div></div>
    <div class="info-box"><div class="info-label">Organizátor</div><div class="info-value">${c.team?.members?.find(m => m.role === "Organizátor")?.name || "—"}</div></div>
  </div>
  ${isGolf ? `<h3 style="color:#1a5235;margin-top:24px">⛳ Startovní listina</h3>
  <table><tr><th>Flight</th><th>Čas startu</th><th>Hráč</th><th>HCP</th></tr>
  ${(() => { const flights = {}; c.parts.filter(p => ["potvrzen","prihlasen"].includes(p.state)).forEach(p => { const f = p.flight ?? "—"; if (!flights[f]) flights[f] = []; flights[f].push(p); }); let rows = ""; let fi = 1; Object.entries(flights).sort().forEach(([fn, ps]) => { const t = c.startTime || "08:00"; const [h,m] = t.split(":").map(Number); const mins = (fi-1)*(c.interval||15); const ft = String(h + Math.floor((m+mins)/60)).padStart(2,"0") + ":" + String((m+mins)%60).padStart(2,"0"); rows += ps.map(p => `<tr><td>Flight ${fi}</td><td>${ft}</td><td>${p.data[c.fieldMeta?.nameId]||"—"}</td><td>${p.hcp||"—"}</td></tr>`).join(""); fi++; }); return rows; })()}
  </table>` : `<h3 style="color:#1a5235;margin-top:24px">Seznam účastníků</h3>
  <table><tr><th>Jméno</th><th>Stav</th><th>Vybavení</th></tr>
  ${c.parts.filter(p=>["potvrzen","prihlasen"].includes(p.state)).map(p => `<tr><td>${p.data[c.fieldMeta?.nameId]||"—"}</td><td>${p.state==="potvrzen"?"Potvrzen":"Pozván"}</td><td>${Object.entries(p.eqChoice||{}).filter(([,v])=>v).map(([k])=>k).join(", ")||"—"}</td></tr>`).join("")}
  </table>`}
  <div class="footer">S&W automobily · Vytištěno ${new Date().toLocaleDateString("cs-CZ")}</div>
</div></body></html>`);
          w.document.close();
          setTimeout(() => w.print(), 500);
        }}>📋 Informační list</Btn>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, color: T.cream, marginBottom: 2 }}>Report — {c.name}</div>
      <div style={{ fontSize: 13, color: T.textDim, marginBottom: 20 }}>{fmt(c.date)} · {c.place} · {ACTIVITY_TYPES.find((x) => x.id === c.activityType)?.label}</div>

      {/* souhrn */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
        <SumCard label="Celkem zákazníků"  val={String(c.parts.length)} color={T.cream} />
        <SumCard label="Potvrzeno"          val={String(confirmed)}      color={T.greenLite} />
        <SumCard label="Plánované náklady" val={czk(t.expGross)}        color={T.info} />
        <SumCard label="Reálné náklady"    val={czk(t.realGross)}       color={t.realGross > t.expGross ? T.danger : T.greenLite} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        <SumCard label="Plán bez DPH"   val={czk(t.expNet)}  color={T.textDim} />
        <SumCard label="Reálné bez DPH" val={czk(t.realNet)} color={T.textDim} />
        <SumCard label="Náklad / potvrzený účastník" val={costPerPax != null ? czk(costPerPax) : "—"} color={T.brass} />
      </div>

      {/* grafy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 14 }}>
          <div style={{ fontSize: 13, color: T.textDim, marginBottom: 8 }}>Stavy účastníků</div>
          <Donut title="" data={stateData} />
        </div>
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 14 }}>
          <div style={{ fontSize: 13, color: T.textDim, marginBottom: 8 }}>Plán vs. reál (s DPH)</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: "Plánované", val: t.expGross }, { name: "Reálné", val: t.realGross }]} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
                <XAxis dataKey="name" tick={{ fill: T.textDim, fontSize: 12 }} />
                <YAxis tick={{ fill: T.textDim, fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => czk(v)} contentStyle={{ background: T.panel2, border: `1px solid ${T.line}`, borderRadius: 8, color: T.cream, fontSize: 11 }} />
                <Bar dataKey="val" name="Kč" radius={[5, 5, 0, 0]}>
                  <Cell fill={T.info} />
                  <Cell fill={t.realGross > t.expGross ? T.danger : T.greenLite} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* položky nákladů */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 10 }}>Položky nákladů</div>
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: T.panel2 }}>
                {["Název", "Dodavatel", "Poznámka", "Bez DPH", "DPH %", "S DPH", "Typ"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: T.textDim, fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(c.budget?.items || []).map((item) => (
                <tr key={item.id} style={{ borderTop: `1px solid ${T.line}`, background: item.isReal ? `${T.greenLite}0c` : "transparent" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 500 }}>{item.name || "—"}</td>
                  <td style={{ padding: "8px 12px", color: T.creamDim }}>{item.supplier || "—"}</td>
                  <td style={{ padding: "8px 12px", color: T.textDim, fontSize: 11 }}>{item.note || "—"}</td>
                  <td style={{ padding: "8px 12px" }}>{czk(item.amountNet)}</td>
                  <td style={{ padding: "8px 12px" }}>{item.vatRate}%</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{czk(withVat(item.amountNet, item.vatRate))}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ fontSize: 11, color: item.isReal ? T.greenLite : T.info, border: `1px solid ${item.isReal ? T.greenLite : T.info}44`, borderRadius: 6, padding: "1px 7px" }}>
                      {item.isReal ? "reálné" : "plán"}
                    </span>
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${T.line}`, background: T.panel2 }}>
                <td colSpan={3} style={{ padding: "8px 12px", fontWeight: 600, color: T.cream }}>CELKEM</td>
                <td style={{ padding: "8px 12px", color: T.info }}>{czk(t.expNet + t.realNet)}</td>
                <td></td>
                <td style={{ padding: "8px 12px", fontWeight: 700 }}>{czk(t.expGross + t.realGross)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* vybavení */}
      {eqStats.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {/* Tým akce v reportu */}
          {c.team?.members?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 10 }}>👥 Tým akce — přítomnost</div>
              <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.2fr", gap: 8, padding: "7px 12px", fontSize: 10.5, color: T.textDim, background: T.panel2, borderBottom: `1px solid ${T.line}`, textTransform: "uppercase", letterSpacing: 0.3 }}>
                  <span>Jméno</span><span>Role</span><span>Od</span><span>Do</span><span>Stav</span>
                </div>
                {c.team.members.map((m) => <TeamReportRow key={m.id} m={m} />)}
              </div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 6 }}>Časy lze upravit před exportem — změny se projeví pouze v tisku.</div>
            </div>
          )}
          <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 10 }}>Vybavení — přehled voleb zákazníků</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {eqStats.map((eq) => (
              <div key={eq.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 9, padding: "10px 16px", minWidth: 120 }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{eq.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{eq.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: T.brass, marginTop: 4 }}>{eq.count}</div>
                <div style={{ fontSize: 11, color: T.textDim }}>zákazníků</div>
                {eq.rentPrice != null && <div style={{ fontSize: 11.5, color: T.info, marginTop: 4 }}>půjčovné: {czk(eq.rentPrice)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* seznam */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, marginBottom: 10 }}>Seznam zákazníků</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: T.panel2 }}>
              {["Jméno", "Email", "Stav", "Poznámka"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: T.textDim, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.parts.map((p) => (
              <tr key={p.id} style={{ borderTop: `1px solid ${T.line}` }}>
                <td style={{ padding: "7px 12px", fontWeight: 500 }}>{p.data[c.fieldMeta.nameId] || "—"}</td>
                <td style={{ padding: "7px 12px", color: T.creamDim, fontSize: 12 }}>{p.data[c.fieldMeta.emailId] || "—"}</td>
                <td style={{ padding: "7px 12px" }}><StateBadge state={p.state} /></td>
                <td style={{ padding: "7px 12px", color: T.textDim, fontSize: 11 }}>{p.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   STARTOVNÍ LISTINA
════════════════════════════════════════ */
function StartList({ c, role, onUpdate }) {
  const { nameId } = c.fieldMeta;
  const [dragId, setDragId] = useState(null);
  const canEdit = role !== "lite";

  const players = c.parts.filter((p) => STARTLIST_OK.includes(p.state));
  const fc = Math.max(1, Math.ceil(players.length / 4));
  const buckets = Array.from({ length: fc }, () => []);
  players.filter((p) => p.flight != null).forEach((p) => buckets[Math.min(p.flight, fc - 1)].push(p));
  players.filter((p) => p.flight == null).forEach((p) => { const fi = buckets.findIndex((b) => b.length < 4); (fi === -1 ? buckets[buckets.length - 1] : buckets[fi]).push(p); });

  const ft = (i) => {
    if (!c.startTime) return "—";
    const [h, m] = c.startTime.split(":").map(Number);
    const tot = h * 60 + m + i * c.interval;
    return `${String(Math.floor(tot / 60) % 24).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
  };
  // Přesun hráče: zároveň "ukotvíme" flight u VŠECH hráčů podle jejich aktuálně zobrazené pozice,
  // aby se dynamicky rozmístění (flight == null) hráči nepřerovnávali mezi rendery a přetahování bylo stabilní.
  const moveTo = (pid, fi) => {
    if (!canEdit) return;
    const posMap = {};
    buckets.forEach((b, bi) => b.forEach((p) => { posMap[p.id] = bi; }));
    posMap[pid] = fi; // cílový flight má přednost
    onUpdate((camp) => ({
      ...camp,
      parts: camp.parts.map((p) => posMap[p.id] != null ? { ...p, flight: posMap[p.id] } : p),
    }));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 14, flexWrap: "wrap" }}>
        <div style={{ width: 130 }}><label style={lbl}>První start</label><input type="time" value={c.startTime} onChange={(e) => onUpdate((camp) => ({ ...camp, startTime: e.target.value }))} style={inputStyle} disabled={!canEdit} /></div>
        <div style={{ width: 165 }}><label style={lbl}>Interval</label>
          <select value={c.interval} onChange={(e) => onUpdate((camp) => ({ ...camp, interval: +e.target.value }))} style={inputStyle} disabled={!canEdit}>
            {[5, 10, 15, 20, 25, 30].map((m) => <option key={m} value={m}>po {m} min</option>)}
          </select>
        </div>
        <div style={{ fontSize: 12, color: T.textDim, display: "flex", alignItems: "center", gap: 6 }}><Clock size={13} color={T.brass} />{players.length} hráčů · {fc} flightů{!canEdit ? " · pouze prohlížení" : ""}</div>
        {canEdit && <Btn kind="ghost" icon={Download} small onClick={() => exportStartList(c, buckets, ft)}>Export</Btn>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {buckets.map((bucket, fi) => (
          <div key={fi}
            onDragOver={(e) => { if (canEdit) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } }}
            onDrop={(e) => {
              e.preventDefault();
              if (!canEdit) return;
              const pid = e.dataTransfer.getData("text/plain") || dragId;
              if (pid) moveTo(pid, fi);
              setDragId(null);
            }}
            style={{ background: dragId ? T.panel2 : T.panel, border: `1px solid ${bucket.length >= 4 ? T.warn + "66" : (dragId ? T.brass + "55" : T.line)}`, borderRadius: 11, padding: 12, minHeight: 130, transition: "border-color .12s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9, paddingBottom: 8, borderBottom: `1px solid ${T.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: T.green, color: T.cream, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.brass}` }}>{fi + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Flight {fi + 1}</span>
              </div>
              <span style={{ fontSize: 12, color: T.brass, fontWeight: 600 }}>{ft(fi)}</span>
            </div>
            {bucket.map((p) => (
              <div key={p.id}
                draggable={canEdit}
                onDragStart={(e) => { if (canEdit) { setDragId(p.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", p.id); } }}
                onDragEnd={() => setDragId(null)}
                style={{ display: "flex", alignItems: "center", gap: 7, background: T.bg, border: `1px solid ${dragId === p.id ? T.brass : T.line}`, borderRadius: 7, padding: "6px 9px", cursor: canEdit ? "grab" : "default", fontSize: 12.5, marginBottom: 6 }}>
                {canEdit && <GripVertical size={12} color={T.textDim} />}
                <span style={{ flex: 1 }}>{p.data[nameId] || "—"}</span>
                {p.hcp && <span style={{ fontSize: 10, color: T.brass }}>HCP {p.hcp}</span>}
              </div>
            ))}
            {bucket.length === 0 && <div style={{ fontSize: 11, color: T.line, textAlign: "center", padding: "12px 0", border: `1px dashed ${T.line}`, borderRadius: 7 }}>Přetáhněte sem</div>}
            {bucket.length > 4 && <div style={{ fontSize: 11, color: T.warn, display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}><AlertTriangle size={11} />Více než 4 hráči</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TESTOVACÍ JÍZDY — rezervační mřížka
   Auta (řádky) × časové sloty (sloupce).
   Buňka: prázdná / zákazník / 🔧 blok (pauza, servis).
   Zákazník smí mít víc rezervací (víc aut).
════════════════════════════════════════ */
function TestDriveGrid({ c, role, onUpdate }) {
  const { nameId } = c.fieldMeta;
  const canEdit = role === "admin" || role === "approver";
  const [dragRes, setDragRes] = useState(null);   // id přetahované rezervace
  const [cellMenu, setCellMenu] = useState(null);  // { carId, slotIndex }
  const [blockPick, setBlockPick] = useState(null); // výběr délky bloku: { type } (v otevřeném menu)
  const [addStreet, setAddStreet] = useState(null); // { carId, slotIndex } → přidat zákazníka z ulice

  const cars = c.testCars || [];
  const reservations = c.reservations || [];
  const prep = c.drivePrep || 0;
  const slots = driveSlots(c.driveStart, c.driveEnd, c.driveInterval || 30, prep);
  // potvrzení/přihlášení zákazníci = kandidáti na rezervaci
  const customers = c.parts.filter((p) => STARTLIST_OK.includes(p.state));

  const resAt = (carId, slotIndex) => reservations.find((r) => r.carId === carId && r.slotIndex === slotIndex);
  const custName = (partId) => customers.find((p) => p.id === partId)?.data[nameId] || c.parts.find((p) => p.id === partId)?.data[nameId] || "—";
  const custResCount = (partId) => reservations.filter((r) => r.partId === partId && !r.blocked).length;

  // je zákazník už zarezervovaný v tomto časovém slotu (na JINÉ rezervaci)?
  // exceptResId = id rezervace, kterou přesouváme (tu ignorujeme, nekoliduje sama se sebou)
  const custBusyAt = (partId, slotIndex, exceptResId) =>
    reservations.some((r) => r.partId === partId && r.slotIndex === slotIndex && r.id !== exceptResId && !r.blocked);

  // je auto dostupné v daném slotu? (pozdní příjezd → availFrom)
  const carAvailable = (car, slot) => {
    if (car.availFrom == null) return true;
    const [h, m] = car.availFrom.split(":").map(Number);
    return slot.from >= h * 60 + m;
  };

  // CHRÁNĚNÁ jízda = rezervace zákazníka, který je ve stavu "potvrzen".
  // To je smlouva z pozvánky — nesmí ji přepsat blok ani zpoždění.
  const confirmedIds = new Set(c.parts.filter((p) => p.state === "potvrzen").map((p) => p.id));
  const isProtectedRes = (r) => !!r && !r.blocked && !!r.partId && confirmedIds.has(r.partId);
  const protectedAt = (carId, slotIndex) => {
    const r = reservations.find((x) => x.carId === carId && x.slotIndex === slotIndex);
    return isProtectedRes(r) ? r : null;
  };

  const patchRes = (fn) => onUpdate((camp) => ({ ...camp, reservations: fn(camp.reservations || []) }));

  const bookCustomer = (carId, slotIndex, partId) => {
    const existing = resAt(carId, slotIndex);
    if (partId && custBusyAt(partId, slotIndex, existing?.id)) {
      alert("Tento zákazník už v tomto čase jede jiný vůz. Jeden zákazník nemůže testovat dvě auta najednou.");
      return;
    }
    patchRes((rs) => [...rs.filter((r) => !(r.carId === carId && r.slotIndex === slotIndex)), { id: uid(), carId, slotIndex, partId, blocked: false }]);
    setCellMenu(null);
  };
  // zablokuje jeden nebo víc po sobě jdoucích slotů podle zvolené délky (min).
  // Kolik slotů = zaokrouhleno nahoru z minut / délka slotu, min. 1.
  // PRAVIDLO: potvrzenou jízdu blok nepřepíše — zkrátí se před ní.
  const slotSpan = c.driveInterval || 30; // "užitná" délka jednoho slotu (bez prep)
  const blockCell = (carId, slotIndex, type = "pauza", mins = null) => {
    const wanted = mins ? Math.max(1, Math.ceil(mins / slotSpan)) : 1;
    const maxIdx = slots.length ? slots[slots.length - 1].idx : slotIndex;

    // kolik slotů reálně zablokujeme? Zastavíme se na první potvrzené jízdě.
    let usable = 0;
    let hitConfirmed = null; // jméno zákazníka, kvůli kterému jsme zkrátili
    for (let k = 0; k < wanted; k++) {
      const idx = slotIndex + k;
      if (idx > maxIdx) break;
      const prot = protectedAt(carId, idx);
      if (prot) { hitConfirmed = custName(prot.partId); break; }
      usable++;
    }

    if (usable === 0) {
      const btLabel = blockLabel(type);
      alert(`Nelze blokovat: v tomto slotu jede potvrzený zákazník${hitConfirmed ? ` (${hitConfirmed})` : ""}. Nejdřív ho přesuň, nebo vyber jiný čas.`);
      return;
    }

    patchRes((rs) => {
      let out = [...rs];
      for (let k = 0; k < usable; k++) {
        const idx = slotIndex + k;
        out = out.filter((r) => !(r.carId === carId && r.slotIndex === idx));
        out.push({ id: uid(), carId, slotIndex: idx, partId: null, blocked: true, note: type });
      }
      return out;
    });

    // zkrácení? Dej vědět, ať se s tím dá počítat.
    if (usable < wanted && hitConfirmed) {
      const realMin = usable * slotSpan;
      alert(`${blockLabel(type)} zkráceno na ${realMin} min — v ${minToHM(slots.find((s) => s.idx === slotIndex + usable)?.from || 0)} už jede potvrzený zákazník (${hitConfirmed}). Vůz se nemusí stihnout, vyřeš to ručně (delší pauza jinde / jiné auto).`);
    }
    setCellMenu(null);
    setBlockPick(null);
  };
  const clearCell = (carId, slotIndex) => {
    patchRes((rs) => rs.filter((r) => !(r.carId === carId && r.slotIndex === slotIndex)));
    setCellMenu(null);
  };
  // přesun rezervace do jiné buňky (drag&drop) — cíl musí být volný, auto dostupné, zákazník v čase volný
  const moveRes = (resId, carId, slotIndex) => {
    if (!canEdit) return;
    const r = reservations.find((x) => x.id === resId);
    if (!r) return;
    if (resAt(carId, slotIndex)) return;
    const car = cars.find((x) => x.id === carId);
    const slot = slots.find((s) => s.idx === slotIndex);
    if (car && slot && !carAvailable(car, slot)) { alert("Vůz v tomto čase ještě není k dispozici."); return; }
    if (!r.blocked && r.partId && custBusyAt(r.partId, slotIndex, r.id)) { alert("Zákazník už v tomto čase jede jiný vůz."); return; }
    patchRes((rs) => rs.map((x) => x.id === resId ? { ...x, carId, slotIndex } : x));
  };

  // správa vozového parku
  const addCar    = () => onUpdate((camp) => ({ ...camp, testCars: [...(camp.testCars || []), mkCar("Nový model")] }));
  const updCar    = (id, patch) => onUpdate((camp) => ({ ...camp, testCars: (camp.testCars || []).map((car) => car.id === id ? { ...car, ...patch } : car) }));
  const removeCar = (id) => onUpdate((camp) => ({ ...camp, testCars: (camp.testCars || []).filter((car) => car.id !== id), reservations: (camp.reservations || []).filter((r) => r.carId !== id) }));

  const setDrive = (patch) => onUpdate((camp) => ({ ...camp, ...patch }));

  // přidání zákazníka "z ulice" — vytvoří účastníka a rovnou rezervuje.
  // makeLead=true → založí i lead (aby se na něj nezapomnělo, když nemá e-mail na dotazník).
  const addStreetCustomer = (carId, slotIndex, name, phone, email, makeLead, model) => {
    if (!name.trim()) return;
    const pid = uid();
    const hasEmail = !!email.trim();
    onUpdate((camp) => {
      const newPart = { id: pid, state: "potvrzen", note: "Z ulice", flight: null, hcp: "", group: null, eqChoice: {}, fromStreet: true,
        // bez e-mailu se dotazník nedá poslat mailem → označíme k ručnímu předání
        needsSurvey: !hasEmail,
        data: { [nameId]: name, [camp.fieldMeta.emailId]: email, [camp.fieldMeta.phoneId]: phone } };
      const next = {
        ...camp,
        parts: [...camp.parts, newPart],
        reservations: [...(camp.reservations || []).filter((r) => !(r.carId === carId && r.slotIndex === slotIndex)), { id: uid(), carId, slotIndex, partId: pid, blocked: false }],
      };
      if (makeLead) {
        next.leads = [...(camp.leads || []), {
          id: uid(), name, phone, model: model || (cars.find((x) => x.id === carId)?.model) || "",
          interest: "informace", note: hasEmail ? "Zákazník z ulice." : "Zákazník z ulice — bez e-mailu, dotazník předat osobně / získat kontakt.",
          addedBy: role, assignedTo: null, at: new Date().toISOString().slice(0, 10), isGuest: true, fromStreet: true,
        }];
      }
      return next;
    });
    setAddStreet(null);
    setCellMenu(null);
  };

  const totalBooked = reservations.filter((r) => !r.blocked).length;
  const totalCells  = cars.length * slots.length;
  const totalBlocked = reservations.filter((r) => r.blocked).length;
  // kolik slotů sežralo zpoždění ("jezdí od") napříč všemi vozy
  const unavailCells = cars.reduce((acc, car) => acc + slots.filter((s) => !carAvailable(car, s)).length, 0);
  // volné = celkem − obsazené jízdou − blok − nedostupné (bez dvojího počítání: blok/rezervace v nedostupném slotu je vzácný, ale odečteme reálně obsazené)
  const usedCells = reservations.length; // rezervace i bloky zabírají buňku
  const freeCells = Math.max(0, totalCells - usedCells - unavailCells + reservations.filter((r) => { const car = cars.find((x) => x.id === r.carId); const slot = slots.find((s) => s.idx === r.slotIndex); return car && slot && !carAvailable(car, slot); }).length);

  return (
    <div>
      {/* nastavení času */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 14, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 14, flexWrap: "wrap" }}>
        <div style={{ width: 110 }}><label style={lbl}>Začátek</label><input type="time" value={c.driveStart || ""} onChange={(e) => setDrive({ driveStart: e.target.value })} style={inputStyle} disabled={!canEdit} /></div>
        <div style={{ width: 110 }}><label style={lbl}>Konec</label><input type="time" value={c.driveEnd || ""} onChange={(e) => setDrive({ driveEnd: e.target.value })} style={inputStyle} disabled={!canEdit} /></div>
        <div style={{ width: 130 }}><label style={lbl}>Délka jízdy</label>
          <select value={c.driveInterval || 30} onChange={(e) => setDrive({ driveInterval: +e.target.value })} style={inputStyle} disabled={!canEdit}>
            {DRIVE_INTERVALS.map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
        </div>
        <div style={{ width: 150 }}><label style={lbl}>❗ Čas na přípravu</label>
          <select value={prep} onChange={(e) => setDrive({ drivePrep: +e.target.value })} style={inputStyle} disabled={!canEdit}>
            {PREP_TIMES.map((m) => <option key={m} value={m}>{m === 0 ? "bez rezervy" : `+${m} min`}</option>)}
          </select>
        </div>
        <div style={{ fontSize: 12, color: T.textDim, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Clock size={13} color={T.brass} />{cars.length} vozů · {totalBooked}/{totalCells} jízd
          <span style={{ color: freeCells > 0 ? T.greenLite : T.danger, fontWeight: 600 }}>· volno: {freeCells}</span>
          {totalBlocked > 0 && <span style={{ color: T.warn }}>· bloky: {totalBlocked}</span>}
          {unavailCells > 0 && <span style={{ color: T.warn }}>· zpoždění: {unavailCells}</span>}
          {!canEdit ? " · pouze prohlížení" : ""}
        </div>
        {canEdit && <Btn kind="ghost" icon={Download} small onClick={() => exportTestDrive(c, cars, slots, resAt, custName)}>Export</Btn>}
      </div>

      {/* vozový park */}
      <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Video size={15} color={T.brass} /><span style={{ fontSize: 14, fontWeight: 600 }}>Vozový park ({cars.length})</span></div>
          {canEdit && cars.length < 10 && <Btn kind="ghost" icon={Plus} small onClick={addCar}>Přidat vůz</Btn>}
        </div>
        {cars.length === 0 && <div style={{ fontSize: 12.5, color: T.textDim, padding: "6px 2px" }}>Zatím žádné vozy. Přidejte modely, které ten den pojedou (max 10).</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {cars.map((car) => (
            <div key={car.id} style={{ display: "flex", gap: 8, alignItems: "center", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: "7px 10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: 15 }}>🚗</span>
              <input value={car.model} onChange={(e) => updCar(car.id, { model: e.target.value })} placeholder="Model vozu" disabled={!canEdit} style={{ ...inputStyle, flex: 2, minWidth: 130, padding: "5px 8px", fontSize: 13 }} />
              <input value={car.spz} onChange={(e) => updCar(car.id, { spz: e.target.value })} placeholder="SPZ" disabled={!canEdit} style={{ ...inputStyle, width: 100, padding: "5px 8px", fontSize: 13 }} />
              <input value={car.note} onChange={(e) => updCar(car.id, { note: e.target.value })} placeholder="poznámka…" disabled={!canEdit} style={{ ...inputStyle, flex: 2, minWidth: 120, padding: "5px 8px", fontSize: 12.5 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }} title="Vozidlo je k dispozici až od tohoto času (např. VIP/služební vůz dorazí později)">
                <span style={{ fontSize: 11, color: car.availFrom ? T.warn : T.textDim, whiteSpace: "nowrap" }}>jezdí od</span>
                <input type="time" value={car.availFrom || ""} onChange={(e) => {
                  const v = e.target.value || null;
                  updCar(car.id, { availFrom: v });
                  // varování: nezablokuje to potvrzené jízdy? (nepřesouváme je — jen upozorníme)
                  if (v) {
                    const [h, m] = v.split(":").map(Number);
                    const cut = h * 60 + m;
                    const clashes = reservations
                      .filter((r) => r.carId === car.id && isProtectedRes(r))
                      .map((r) => ({ r, slot: slots.find((s) => s.idx === r.slotIndex) }))
                      .filter((x) => x.slot && x.slot.from < cut);
                    if (clashes.length) {
                      const list = clashes.map((x) => `${minToHM(x.slot.from)} — ${custName(x.r.partId)}`).join("\n");
                      alert(`⚠️ Vůz přijede až v ${v}, ale před tím má potvrzené jízdy:\n\n${list}\n\nTyhle jízdy appka nepřesune — vyřeš je ručně (jiné auto / jiný čas). Zákazníci mají čas v pozvánce.`);
                    }
                  }
                }} disabled={!canEdit} style={{ ...inputStyle, width: 92, padding: "5px 6px", fontSize: 12, borderColor: car.availFrom ? T.warn + "66" : T.line }} />
              </div>
              {canEdit && <button onClick={() => removeCar(car.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, padding: 4 }}><Trash2 size={14} /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* rezervační mřížka */}
      {cars.length > 0 && slots.length > 0 ? (
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 14, overflowX: "auto" }}>
          <div style={{ fontSize: 12.5, color: T.textDim, marginBottom: 4 }}>
            {canEdit ? "Klik = rezervace / blokace. Rezervaci zákazníka přetáhneš mezi volnými buňkami. Blok (oběd, pauza, tankování…) vybereš klikem a zvolíš délku." : "Přehled rezervací."}
          </div>
          {prep > 0 && <div style={{ fontSize: 11, color: T.textDim, marginBottom: 10 }}>❗ Za každou jízdou je {prep} min rezerva na přípravu vozu (úzký pruh).</div>}
          <table style={{ borderCollapse: "separate", borderSpacing: 3, fontSize: 12.5 }}>
            <thead>
              <tr>
                <th style={{ position: "sticky", left: 0, background: T.panel, textAlign: "left", padding: "6px 10px", minWidth: 160, zIndex: 3 }}></th>
                {slots.map((s) => (
                  <th key={s.idx} style={{ padding: "6px 8px", color: T.brass, fontWeight: 600, whiteSpace: "nowrap", fontSize: 11.5, textAlign: "center", minWidth: 82 }}>
                    {minToHM(s.from)}
                    <div style={{ fontSize: 10, color: T.textDim, fontWeight: 400 }}>–{minToHM(s.to)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td style={{ position: "sticky", left: 0, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 7, padding: "6px 10px", fontWeight: 600, zIndex: 2, minWidth: 160 }}>
                    <div style={{ fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{car.model || "—"}</div>
                    <div style={{ fontSize: 10.5, color: T.textDim, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {car.spz && <span>{car.spz}</span>}
                      {car.availFrom && <span style={{ color: T.warn }}>⏰ od {car.availFrom}</span>}
                    </div>
                  </td>
                  {slots.map((s) => {
                    const r = resAt(car.id, s.idx);
                    const filled = !!r;
                    const isBlock = r?.blocked;
                    const unavail = !carAvailable(car, s);
                    const protectedRes = isProtectedRes(r);
                    const conflict = protectedRes && unavail; // potvrzená jízda, ale auto v tu dobu nedojede
                    const menuOpen = canEdit && cellMenu && cellMenu.carId === car.id && cellMenu.slotIndex === s.idx;
                    return (
                      <td key={s.idx}
                        onDragOver={(e) => { if (canEdit && dragRes && !filled && !unavail) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } }}
                        onDrop={(e) => { e.preventDefault(); if (canEdit && dragRes && !filled && !unavail) { moveRes(dragRes, car.id, s.idx); setDragRes(null); } }}
                        style={{ padding: 0, verticalAlign: "top", position: "relative" }}>
                        <div
                          draggable={canEdit && filled && !isBlock}
                          onDragStart={(e) => { if (canEdit && filled && !isBlock) { setDragRes(r.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", r.id); } }}
                          onDragEnd={() => setDragRes(null)}
                          onClick={(e) => { if (canEdit) { setBlockPick(null); if (menuOpen) { setCellMenu(null); } else { const rect = e.currentTarget.getBoundingClientRect(); setCellMenu({ carId: car.id, slotIndex: s.idx, x: rect.left, y: rect.bottom }); } } }}
                          style={{
                            minWidth: 82, minHeight: 44, borderRadius: 7, padding: "6px 7px", cursor: canEdit ? "pointer" : "default",
                            position: "relative", overflow: "hidden",
                            background: conflict ? `${T.danger}22` : unavail ? "repeating-linear-gradient(45deg,#2a2a2a,#2a2a2a 5px,#222 5px,#222 10px)" : isBlock ? `${T.warn}22` : filled ? `${T.greenLite}1e` : T.bg,
                            border: `1px solid ${conflict ? T.danger : unavail ? "#3a3a3a" : isBlock ? T.warn + "66" : filled ? T.greenLite + "66" : T.line}`,
                            display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, opacity: unavail && !filled ? 0.5 : 1,
                          }}>
                          {/* pruh přípravy vozu */}
                          {prep > 0 && !isBlock && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 6, background: `repeating-linear-gradient(0deg, ${T.brass}44, ${T.brass}44 3px, transparent 3px, transparent 6px)` }} title={`${prep} min příprava`} />}
                          {isBlock ? (
                            <span style={{ fontSize: 11.5, color: T.warn, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{blockIcon(r.note)} {blockLabel(r.note)}</span>
                          ) : filled ? (
                            <>
                              <span style={{ fontSize: 11.5, fontWeight: 600, color: conflict ? T.danger : T.cream, lineHeight: 1.2, wordBreak: "break-word" }}>{conflict && "⚠️ "}{protectedRes && "✓ "}{custName(r.partId)}</span>
                              {conflict && <span style={{ fontSize: 9, color: T.danger, fontWeight: 600 }}>vůz nedojede!</span>}
                              {custResCount(r.partId) > 1 && <span style={{ fontSize: 9.5, color: T.brass }}>{custResCount(r.partId)}× vůz</span>}
                              {c.parts.find((p) => p.id === r.partId)?.fromStreet && <span style={{ fontSize: 9, color: T.info }}>z ulice</span>}
                            </>
                          ) : unavail ? (
                            <span style={{ fontSize: 10, color: T.textDim, textAlign: "center" }}>—</span>
                          ) : (
                            <span style={{ fontSize: 15, color: T.line, textAlign: "center" }}>{canEdit ? "+" : ""}</span>
                          )}
                        </div>

                        {/* mini-menu buňky */}
                        {menuOpen && (() => {
                          // fixed pozice u kliknuté buňky → neusekává se scroll kontejnerem.
                          const vh = typeof window !== "undefined" ? window.innerHeight : 800;
                          const openUp = cellMenu.y > vh * 0.55; // blízko spodku → otevři nahoru
                          const pos = openUp
                            ? { bottom: Math.max(8, vh - cellMenu.y + 44), left: cellMenu.x }
                            : { top: cellMenu.y + 4, left: cellMenu.x };
                          return (
                          <div style={{ position: "fixed", ...pos, zIndex: 60 }}>
                            <div style={{ background: T.panel2, border: `1px solid ${T.brass}55`, borderRadius: 9, padding: 9, minWidth: 210, maxWidth: 240, maxHeight: "70vh", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,.5)" }}>
                              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 7 }}>{car.model} · {minToHM(s.from)}{unavail ? " · vůz nedostupný" : ""}</div>
                              {protectedRes && <div style={{ fontSize: 10.5, color: T.greenLite, marginBottom: 7, padding: "5px 7px", background: `${T.greenLite}14`, border: `1px solid ${T.greenLite}44`, borderRadius: 6, lineHeight: 1.4 }}>✓ Potvrzená jízda z pozvánky — {custName(r.partId)} má tento čas závazně. Blok ani zpoždění ji nepřepíšou.</div>}
                              {!r?.blocked && !unavail && !addStreet && (
                                <select
                                  value={r?.partId || ""}
                                  onChange={(e) => e.target.value ? bookCustomer(car.id, s.idx, e.target.value) : clearCell(car.id, s.idx)}
                                  style={{ ...inputStyle, padding: "5px 8px", fontSize: 12, marginBottom: 7 }}>
                                  <option value="">— vyber zákazníka —</option>
                                  {customers.map((p) => {
                                    const busy = custBusyAt(p.id, s.idx, r?.id);
                                    return <option key={p.id} value={p.id} disabled={busy}>{p.data[nameId] || "—"}{busy ? " (už jede jinde)" : ""}</option>;
                                  })}
                                </select>
                              )}
                              {/* přidat z ulice */}
                              {addStreet && addStreet.carId === car.id && addStreet.slotIndex === s.idx ? (
                                <div style={{ marginBottom: 7, padding: 8, background: T.bg, borderRadius: 7, border: `1px solid ${T.info}44` }}>
                                  <div style={{ fontSize: 10.5, color: T.info, marginBottom: 5 }}>Zákazník z ulice</div>
                                  <input id={`str-name-${car.id}-${s.idx}`} placeholder="Jméno" style={{ ...inputStyle, padding: "4px 7px", fontSize: 12, marginBottom: 4 }} />
                                  <input id={`str-phone-${car.id}-${s.idx}`} placeholder="Telefon" style={{ ...inputStyle, padding: "4px 7px", fontSize: 12, marginBottom: 4 }} />
                                  <input id={`str-email-${car.id}-${s.idx}`} placeholder="E-mail (pro dotazník, nepovinné)" style={{ ...inputStyle, padding: "4px 7px", fontSize: 12, marginBottom: 4 }} />
                                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.textDim, marginBottom: 6, cursor: "pointer" }}>
                                    <input type="checkbox" id={`str-lead-${car.id}-${s.idx}`} defaultChecked style={{ accentColor: T.brass }} />
                                    Vytvořit lead (ať se nezapomene na dotazník)
                                  </label>
                                  <div style={{ display: "flex", gap: 5 }}>
                                    <button onClick={() => { const n = document.getElementById(`str-name-${car.id}-${s.idx}`).value; const p = document.getElementById(`str-phone-${car.id}-${s.idx}`).value; const em = document.getElementById(`str-email-${car.id}-${s.idx}`).value; const ml = document.getElementById(`str-lead-${car.id}-${s.idx}`).checked; addStreetCustomer(car.id, s.idx, n, p, em, ml, car.model); }} style={{ flex: 1, fontSize: 11, padding: "5px", borderRadius: 6, border: "none", background: T.greenLite, color: "#0a1f14", fontWeight: 600, cursor: "pointer" }}>Přidat a rezervovat</button>
                                    <button onClick={() => setAddStreet(null)} style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: `1px solid ${T.line}`, background: T.bg, color: T.textDim, cursor: "pointer" }}>Zpět</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {!unavail && <button onClick={() => setAddStreet({ carId: car.id, slotIndex: s.idx })} style={{ width: "100%", fontSize: 11.5, padding: "6px", borderRadius: 6, border: `1px solid ${T.info}55`, background: `${T.info}14`, color: T.info, cursor: "pointer", marginBottom: 7, fontFamily: "inherit" }}>+ Zákazník z ulice</button>}
                                  {/* typy bloku — klik na typ → výběr délky → zablokuje potřebný počet slotů */}
                                  <div style={{ fontSize: 10.5, color: T.textDim, marginBottom: 4 }}>Blokovat vůz:</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 7 }}>
                                    {CAR_BLOCKS.map((bt) => (
                                      <button key={bt.id}
                                        onClick={() => setBlockPick(blockPick?.type === bt.id ? null : { type: bt.id })}
                                        style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: `1px solid ${blockPick?.type === bt.id ? T.warn : T.warn + "44"}`, background: blockPick?.type === bt.id ? `${T.warn}33` : `${T.warn}14`, color: T.warn, cursor: "pointer", fontFamily: "inherit" }}>{bt.icon} {bt.label}</button>
                                    ))}
                                  </div>
                                  {blockPick && (() => {
                                    const bt = CAR_BLOCKS.find((b) => b.id === blockPick.type);
                                    return (
                                      <div style={{ marginBottom: 7, padding: 7, background: T.bg, borderRadius: 7, border: `1px solid ${T.warn}44` }}>
                                        <div style={{ fontSize: 10.5, color: T.textDim, marginBottom: 5 }}>{bt.icon} {bt.label} — délka:</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                          {bt.mins.map((m) => (
                                            <button key={m}
                                              onClick={() => { blockCell(car.id, s.idx, bt.id, m); setBlockPick(null); }}
                                              style={{ fontSize: 11, padding: "5px 9px", borderRadius: 6, border: `1px solid ${T.warn}55`, background: `${T.warn}18`, color: T.warn, cursor: "pointer", fontFamily: "inherit" }}>{m} min</button>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                  <div style={{ display: "flex", gap: 5 }}>
                                    {filled && <button onClick={() => { if (protectedRes && !window.confirm(`${custName(r.partId)} má potvrzenou jízdu z pozvánky. Opravdu ji uvolnit? Zákazník má tento čas v pozvánce.`)) return; clearCell(car.id, s.idx); }} style={{ flex: 1, fontSize: 11, padding: "5px 6px", borderRadius: 6, border: `1px solid ${T.danger}55`, background: `${T.danger}18`, color: T.danger, cursor: "pointer", fontFamily: "inherit" }}>Uvolnit</button>}
                                    <button onClick={() => { setCellMenu(null); setBlockPick(null); }} style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, border: `1px solid ${T.line}`, background: T.bg, color: T.textDim, cursor: "pointer", fontFamily: "inherit" }}>Zavřít</button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          );
                        })()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* přehled kdo kolik má */}
          {customers.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>Rezervace zákazníků</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {customers.map((p) => {
                  const cnt = custResCount(p.id);
                  return (
                    <div key={p.id} style={{ fontSize: 12, padding: "5px 11px", borderRadius: 8, border: `1px solid ${cnt ? T.greenLite + "55" : T.line}`, background: cnt ? `${T.greenLite}14` : T.bg, color: cnt ? T.cream : T.textDim }}>
                      {p.data[nameId] || "—"} {cnt > 0 && <span style={{ color: T.brass, fontWeight: 600 }}>· {cnt}× vůz</span>}
                      {p.fromStreet && <span style={{ color: T.info, fontSize: 10, marginLeft: 3 }}>z ulice</span>}
                      {p.needsSurvey && <span style={{ color: T.warn, fontSize: 10, marginLeft: 3 }} title="Bez e-mailu — dotazník předat osobně">📋 dotazník osobně</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 11, padding: 30, textAlign: "center", color: T.textDim, fontSize: 13 }}>
          {cars.length === 0 ? "Přidejte alespoň jeden vůz." : "Nastavte začátek, konec a délku jízdy, aby se vygenerovaly časové sloty."}
        </div>
      )}

      {/* ── Skenovačka zkušebních jízd (MOCK — napojení na Firebase přijde později) ── */}
      {canEdit && <ScannerSync c={c} cars={cars} customers={customers} nameId={nameId} />}
    </div>
  );
}

/* Sekce pro přípravu dat do mobilní skenovací appky. Zatím jen mock:
   ukáže, co by se zapsalo, a vygeneruje odkaz/QR, který skenovačku nastaví
   na tuto akci (aby hosteska nevybrala starou). */
function ScannerSync({ c, cars, customers, nameId }) {
  const [done, setDone] = useState(null); // "cars" | "guests" | null
  const invited = (c.guestMode || "invited") === "invited";
  // odkaz, který skenovačku "zamkne" na tuto akci (identita = id + název)
  const SCANNER_BASE = "https://dfwvhfnw7y-coder.github.io/Zku-ebn-j-zdy/index.html";
  const eventLink = `${SCANNER_BASE}?event=${encodeURIComponent(c.name)}&eid=${encodeURIComponent(c.id)}`;

  const carLines = cars.filter((car) => car.model?.trim());
  const guestLines = customers.map((p) => ({
    name: p.data[nameId] || "",
    email: p.data[c.fieldMeta.emailId] || "",
    phone: p.data[c.fieldMeta.phoneId] || "",
  })).filter((g) => g.name);

  const copyLink = () => {
    try { navigator.clipboard?.writeText(eventLink); alert("Odkaz zkopírován do schránky."); }
    catch { alert(eventLink); }
  };

  return (
    <div style={{ marginTop: 16, background: T.panel, border: `1px solid ${T.info}44`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <CalendarCheck size={16} color={T.info} />
        <span style={{ fontSize: 14, fontWeight: 700 }}>Skenovačka zkušebních jízd</span>
        <span style={{ fontSize: 10.5, color: T.warn, background: `${T.warn}18`, border: `1px solid ${T.warn}44`, padding: "1px 8px", borderRadius: 9, marginLeft: 4 }}>NÁHLED · zápis přijde s Firebase</span>
      </div>
      <div style={{ fontSize: 12, color: T.textDim, marginBottom: 14, lineHeight: 1.5 }}>
        Připraví data pro mobilní appku, kterou hosteska používá na místě (sken QR aut a hostů). Auta se posílají vždy, hosty jen u pozvané akce.
      </div>

      {/* identita akce — aby se nespletla se starou */}
      <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: "11px 13px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4 }}>Skenovačka se nastaví na tuto akci</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.cream, marginBottom: 2 }}>🚗 {c.name}</div>
        <div style={{ fontSize: 11, color: T.textDim, marginBottom: 9 }}>ID akce: {c.id} · {invited ? "Pozvaní hosté" : "Veřejná akce"}</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <Btn kind="ghost" icon={Link} small onClick={copyLink}>Kopírovat odkaz pro hostesku</Btn>
        </div>
        <div style={{ fontSize: 10.5, color: T.textDim, marginTop: 8, wordBreak: "break-all", fontFamily: "monospace", background: T.panel, borderRadius: 6, padding: "6px 9px" }}>{eventLink}</div>
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 6, lineHeight: 1.5 }}>
          Hosteska otevře tento odkaz → skenovačka se rovnou přepne na akci „{c.name}". Jako záloha si ji může vybrat i ručně ze seznamu aktivních akcí.
        </div>
      </div>

      {/* auta */}
      <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: "11px 13px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>🚗 Auta ({carLines.length})</span>
          <Btn kind="primary" icon={Send} small disabled={!carLines.length} onClick={() => { setDone("cars"); }}>Připravit auta pro skenovačku</Btn>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {carLines.map((car) => <span key={car.id} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 7, background: T.panel, border: `1px solid ${T.line}` }}>{car.model}{car.spz ? ` · ${car.spz}` : ""}</span>)}
          {!carLines.length && <span style={{ fontSize: 12, color: T.textDim }}>Zatím žádná auta ve vozovém parku.</span>}
        </div>
      </div>

      {/* hosté — jen u pozvané akce */}
      {invited ? (
        <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 9, padding: "11px 13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>👤 Pozvaní hosté ({guestLines.length})</span>
            <Btn kind="primary" icon={Send} small disabled={!guestLines.length} onClick={() => { setDone("guests"); }}>Předvyplnit hosty</Btn>
          </div>
          <div style={{ fontSize: 11.5, color: T.textDim, marginBottom: 8 }}>Hosteska je pak nemusí zadávat ručně — má je nachystané pro rychlý sken.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {guestLines.map((g, i) => <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 7, background: T.panel, border: `1px solid ${T.line}` }}>{g.name}</span>)}
            {!guestLines.length && <span style={{ fontSize: 12, color: T.textDim }}>Žádní potvrzení hosté k odeslání.</span>}
          </div>
        </div>
      ) : (
        <div style={{ background: `${T.info}0e`, border: `1px solid ${T.info}33`, borderRadius: 9, padding: "11px 13px", fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>
          ℹ️ Veřejná akce — zákazníky předem nevypisujeme. Naberou se až na místě přes skenovačku (sken QR nebo ruční zápis).
        </div>
      )}

      {/* mock potvrzení */}
      {done && (
        <div style={{ marginTop: 12, background: `${T.greenLite}12`, border: `1px solid ${T.greenLite}44`, borderRadius: 9, padding: "11px 13px" }}>
          <div style={{ fontSize: 12.5, color: T.greenLite, fontWeight: 600, marginBottom: 4 }}>
            ✓ Náhled: {done === "cars" ? `${carLines.length} aut` : `${guestLines.length} hostů`} připraveno k odeslání do skenovačky
          </div>
          <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5 }}>
            Toto je zatím jen ukázka — reálný zápis do databáze skenovačky (Firebase „testovaci-jizdy") zapneme, až propojíme appky. Data by se zapsala pod akci „{c.name}".
          </div>
        </div>
      )}
    </div>
  );
}

function exportTestDrive(c, cars, slots, resAt, custName) {
  const rows = [["Vůz", "SPZ", ...slots.map((s) => `${minToHM(s.from)}–${minToHM(s.to)}`)]];
  cars.forEach((car) => {
    const row = [car.model, car.spz];
    slots.forEach((s) => {
      const r = resAt(car.id, s.idx);
      row.push(r ? (r.blocked ? `BLOK: ${r.note || ""}` : custName(r.partId)) : "");
    });
    rows.push(row);
  });
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `testovaci-jizdy-${c.name.replace(/\s+/g, "-")}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════
   MODALY
════════════════════════════════════════ */
function AddModal({ fields, fieldMeta, full, crossMap, campEquipment, onClose, onAdd }) {
  const [vals,   setVals]   = useState({});
  const [errs,   setErrs]   = useState({});
  const [eqVals, setEqVals] = useState({});
  const [icoType, setIcoType] = useState("po"); // "po" | "fo"
  const [ico,    setIco]    = useState("");
  const [icoErr, setIcoErr] = useState("");

  const email  = (vals[fieldMeta.emailId] || "").trim().toLowerCase();
  const others = email ? (crossMap[email] || []) : [];

  const icoValid = ico.trim().length === 8 && /^\d{8}$/.test(ico.trim());

  const submit = () => {
    const e = {};
    fields.forEach((f) => {
      const v = (vals[f.id] || "").trim();
      if (f.required && !v) e[f.id] = "Povinné";
      else if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e[f.id] = "Neplatný email";
    });
    if (icoType === "po" && ico.trim() && !icoValid) {
      setIcoErr("IČO musí mít 8 číslic");
      return;
    }
    setErrs(e); setIcoErr("");
    if (Object.keys(e).length === 0) onAdd(vals, eqVals, { type: icoType, ico: ico.trim() });
  };

  return (
    <Modal title="Přidat zákazníka" onClose={onClose}>
      <Banner color={T.purple} icon={HelpCircle}>Zákazník bude přidán se stavem „Čeká na schválení".</Banner>
      {full    && <Banner color={T.warn}  icon={AlertTriangle}>Kapacita naplněna — náhradník.</Banner>}
      {others.length > 0 && <Banner color={T.brass} icon={TrendingUp}>Přihlášen i na: <b>{others.join(", ")}</b>.</Banner>}

      {/* FO / PO přepínač + IČO */}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Typ zákazníka</label>
        <div style={{ display: "flex", gap: 8, marginBottom: icoType === "po" ? 10 : 0 }}>
          {[{ k: "po", l: "🏢 Právnická osoba (firma, s.r.o., a.s.…)" },
            { k: "fo", l: "👤 Fyzická osoba" }].map(o => (
            <button key={o.k} onClick={() => setIcoType(o.k)} style={{ flex: 1, padding: "9px 10px", border: `2px solid ${icoType === o.k ? T.brass : T.line}`, borderRadius: 9, background: icoType === o.k ? `${T.brass}18` : T.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: icoType === o.k ? T.brass : T.textDim, fontWeight: icoType === o.k ? 600 : 400, textAlign: "center" }}>
              {o.l}
            </button>
          ))}
        </div>
        {icoType === "po" && (
          <div>
            <label style={lbl}>IČO <span style={{ color: T.textDim, fontWeight: 400 }}>(nepovinné)</span></label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={ico}
                onChange={e => setIco(e.target.value.replace(/\D/g,"").slice(0,8))}
                placeholder="12345678"
                maxLength={8}
                style={{ ...inputStyle, flex: 1, fontFamily: "monospace", letterSpacing: 2 }}
              />
            </div>
            {icoErr && <div style={{ color: T.danger, fontSize: 11, marginTop: 3 }}>{icoErr}</div>}
            {ico.length > 0 && ico.length < 8 && <div style={{ color: T.textDim, fontSize: 11, marginTop: 3 }}>Zadejte všech 8 číslic</div>}
          </div>
        )}
        {icoType === "fo" && (
          <div style={{ background: `${T.info}12`, border: `1px solid ${T.info}33`, borderRadius: 8, padding: "9px 12px", marginTop: 8, fontSize: 12.5, color: T.creamDim, lineHeight: 1.7 }}>
            👤 Fyzická osoba se schvaluje podle <b style={{ color: T.cream }}>odběratelské historie nebo potenciálu</b>. Vyplňte CRM profil zákazníka po přidání.
          </div>
        )}
      </div>

      <div style={{ maxHeight: 280, overflowY: "auto" }}>
        {fields.map((f) => (
          <div key={f.id} style={{ marginBottom: 11 }}>
            <label style={lbl}>{f.label}{f.required && <span style={{ color: T.brass }}> *</span>}</label>
            <FieldInput field={f} value={vals[f.id]} invalid={!!errs[f.id]} onChange={(e) => setVals((v) => ({ ...v, [f.id]: e.target.value }))} />
            {errs[f.id] && <div style={{ color: T.danger, fontSize: 11, marginTop: 2 }}>{errs[f.id]}</div>}
          </div>
        ))}
      </div>

      {campEquipment.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 12, color: T.textDim, marginBottom: 8, letterSpacing: 0.3 }}>VYBAVENÍ — zákazník si vybírá</div>
          {campEquipment.map((eq) => (
            <label key={eq.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer" }}>
              <input type="checkbox" checked={!!eqVals[eq.id]} onChange={(e) => setEqVals((v) => ({ ...v, [eq.id]: e.target.checked }))} />
              <span style={{ fontSize: 13 }}>{EQ_PRESETS.find((p) => p.id === eq.presetId)?.icon || "📦"} {eq.label}</span>
              {eq.rentPrice != null && <span style={{ fontSize: 11.5, color: T.info }}>({czk(eq.rentPrice)})</span>}
            </label>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 12 }}>
        <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
        <Btn kind="green" icon={Check} onClick={submit}>Přidat ke schválení</Btn>
      </div>
    </Modal>
  );
}

function HcpModal({ onClose, onSave }) {
  const [val, setVal] = useState("");
  const valid = val.trim() !== "" && /^\d{1,2}([,.]?\d?)?$/.test(val.trim());
  return (
    <Modal title="Zadat HCP (handicap)" onClose={onClose}>
      <Banner color={T.brass} icon={Flag}>U Golfu je HCP povinný pro potvrzení. Formát: 18,4 nebo 8.7</Banner>
      <FRow label="HCP index"><input style={inputStyle} value={val} onChange={(e) => setVal(e.target.value)} placeholder="18,4" autoFocus /></FRow>
      {val && !valid && <div style={{ color: T.danger, fontSize: 12, marginBottom: 8 }}>Neplatný formát</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Btn kind="ghost" onClick={onClose}>Zrušit</Btn>
        <Btn kind="green" icon={Check} disabled={!valid} onClick={() => onSave(val)}>Potvrdit</Btn>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function exportExcel(c) {
  // Jednoduchý HTML tabulka export jako .xls (otevře se v Excelu)
  const nameId  = c.fieldMeta?.nameId;
  const emailId = c.fieldMeta?.emailId;
  const phoneId = c.fieldMeta?.phoneId;
  const header = [...c.fields.map(f => f.label), "HCP", "Stav", "Skupina", "Přidal", "Oddělení"].join("	");
  const rows = c.parts.map(p => {
    const vals = c.fields.map(f => p.data[f.id] || "");
    const group = c.groups.find(g => g.id === p.group)?.name || "";
    const state = STATES[p.state]?.label || p.state;
    return [...vals, p.hcp || "", state, group, p.addedBy?.name || "", p.addedBy?.dept || ""].join("	");
  });
  const tsv = [header, ...rows].join("\n");
  const blob = new Blob(["﻿" + tsv], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${c.name}-ucastnici.xls`; a.click();
  URL.revokeObjectURL(url);
}

function exportBudgetPdf(c) {
  const items = (c.budget?.items || []).filter(i => i.expNet || i.realNet);
  const totalExp  = items.reduce((s, i) => s + Math.round((i.expNet||0) * (1 + (i.vat||0)/100)), 0);
  const totalReal = items.reduce((s, i) => s + Math.round((i.realNet||0) * (1 + (i.vat||0)/100)), 0);
  const colors = ["#c8a044","#2e7d54","#4e8fbd","#9068c8","#c4614e","#d4a03a","#256b46","#7a5c2e","#5a8a9f","#8a6ab0"];
  
  // Koláčový graf — SVG
  const totalForPie = items.reduce((s,i) => s + Math.round((i.expNet||0)*(1+(i.vat||0)/100)), 0) || 1;
  let piePath = ""; let startAngle = 0;
  const pieSlices = items.map((item, idx) => {
    const val = Math.round((item.expNet||0)*(1+(item.vat||0)/100));
    const pct = val / totalForPie;
    const angle = pct * 2 * Math.PI;
    const x1 = 100 + 90 * Math.cos(startAngle);
    const y1 = 100 + 90 * Math.sin(startAngle);
    const x2 = 100 + 90 * Math.cos(startAngle + angle);
    const y2 = 100 + 90 * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M100,100 L${x1.toFixed(1)},${y1.toFixed(1)} A90,90 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
    startAngle += angle;
    return { path, color: colors[idx % colors.length], label: item.label, val, pct: Math.round(pct*100) };
  });

  const rows = items.map((i, idx) => {
    const expG = Math.round((i.expNet||0)*(1+(i.vat||0)/100));
    const realG = Math.round((i.realNet||0)*(1+(i.vat||0)/100));
    const diff = realG - expG;
    return `<tr>
      <td style="padding:7px 10px;border-bottom:1px solid #2a3f33">${i.label}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #2a3f33;color:#888">${i.supplier||"—"}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #2a3f33;text-align:right;color:#4e8fbd">${expG.toLocaleString("cs-CZ")} Kč</td>
      <td style="padding:7px 10px;border-bottom:1px solid #2a3f33;text-align:right;color:#2e7d54">${i.realNet ? realG.toLocaleString("cs-CZ")+" Kč" : "—"}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #2a3f33;text-align:right;color:${diff > 0 ? "#c4614e" : "#2e7d54"};font-weight:600">${i.realNet ? (diff > 0 ? "+" : "")+diff.toLocaleString("cs-CZ")+" Kč" : "—"}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #2a3f33"><div style="width:10px;height:10px;background:${colors[idx%colors.length]};border-radius:2px;display:inline-block"></div></td>
    </tr>`;
  }).join("");

  const legend = pieSlices.map(s => `<div style="display:flex;align-items:center;gap:6px;font-size:11px;margin-bottom:4px"><div style="width:12px;height:12px;background:${s.color};border-radius:2px;flex-shrink:0"></div><span>${s.label}</span><span style="color:#888;margin-left:auto">${s.pct}%</span></div>`).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Rozpočet — ${c.name}</title>
  <style>body{font-family:Arial,sans-serif;background:#0f1a14;color:#e4e8de;margin:0;padding:24px}
  h1{color:#c8a044;margin-bottom:4px}h2{color:#c8a044;font-size:14px;margin:18px 0 9px;border-bottom:1px solid #2a3f33;padding-bottom:6px}
  table{width:100%;border-collapse:collapse;background:#16241c;border-radius:8px;overflow:hidden}
  th{background:#1c2e24;padding:8px 10px;text-align:left;font-size:11px;color:#7a9480;letter-spacing:.5px;text-transform:uppercase}
  .sum{display:flex;gap:16px;margin-bottom:18px}.sum-card{background:#16241c;border:1px solid #2a3f33;border-radius:8px;padding:11px 15px;flex:1}
  .sum-n{font-size:18px;font-weight:700}.sum-l{font-size:10px;color:#7a9480;margin-top:2px}
  @media print{body{background:#fff;color:#000}.sum-card{border-color:#ccc}table{border:1px solid #ccc}th{background:#f5f5f5;color:#555}}
  </style></head><body>
  <h1>Rozpočet — ${c.name}</h1>
  <div style="font-size:12px;color:#7a9480;margin-bottom:18px">${c.date ? new Date(c.date).toLocaleDateString("cs-CZ",{day:"numeric",month:"long",year:"numeric"}) : ""} · ${c.place||""}</div>
  <div class="sum">
    <div class="sum-card"><div class="sum-n" style="color:#4e8fbd">${totalExp.toLocaleString("cs-CZ")} Kč</div><div class="sum-l">Plánované náklady (s DPH)</div></div>
    <div class="sum-card"><div class="sum-n" style="color:#2e7d54">${totalReal.toLocaleString("cs-CZ")} Kč</div><div class="sum-l">Reálné náklady (s DPH)</div></div>
    <div class="sum-card"><div class="sum-n" style="color:${totalReal<=totalExp?"#2e7d54":"#c4614e"}">${totalReal>0?(totalReal-totalExp>0?"+":"")+(totalReal-totalExp).toLocaleString("cs-CZ")+" Kč":"—"}</div><div class="sum-l">Rozdíl plán − reál</div></div>
  </div>
  <div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:24px">
    <div style="flex:1">
      <h2>Koláčový graf — plánované náklady</h2>
      <div style="display:flex;gap:18px;align-items:center">
        <svg width="200" height="200" viewBox="0 0 200 200">${pieSlices.map(s=>`<path d="${s.path}" fill="${s.color}" stroke="#0f1a14" stroke-width="2"/>`).join("")}<circle cx="100" cy="100" r="45" fill="#0f1a14"/><text x="100" y="96" text-anchor="middle" fill="#e4e8de" font-size="12" font-family="Arial">Celkem</text><text x="100" y="112" text-anchor="middle" fill="#c8a044" font-size="11" font-family="Arial" font-weight="bold">${totalExp.toLocaleString("cs-CZ")} Kč</text></svg>
        <div style="flex:1">${legend}</div>
      </div>
    </div>
  </div>
  <h2>Položky rozpočtu</h2>
  <table><thead><tr><th>Název</th><th>Dodavatel</th><th>Plán s DPH</th><th>Reál s DPH</th><th>Rozdíl</th><th></th></tr></thead><tbody>${rows}</tbody>
  <tfoot><tr style="background:#1c2e24"><td colspan="2" style="padding:9px 10px;font-weight:700">CELKEM</td><td style="padding:9px 10px;text-align:right;color:#4e8fbd;font-weight:700">${totalExp.toLocaleString("cs-CZ")} Kč</td><td style="padding:9px 10px;text-align:right;color:#2e7d54;font-weight:700">${totalReal>0?totalReal.toLocaleString("cs-CZ")+" Kč":"—"}</td><td style="padding:9px 10px;text-align:right;font-weight:700;color:${totalReal<=totalExp?"#2e7d54":"#c4614e"}">${totalReal>0?(totalReal-totalExp>0?"+":"")+(totalReal-totalExp).toLocaleString("cs-CZ")+" Kč":"—"}</td><td></td></tr></tfoot>
  </table>
  <div style="margin-top:18px;font-size:11px;color:#7a9480;text-align:right">Vygenerováno: ${new Date().toLocaleString("cs-CZ")} · Akce S&W automobily</div>
  <script>window.onload=()=>window.print()</script></body></html>`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
}

function exportBudgetExcel(c) {
  const items = c.budget?.items || [];
  const header = ["Název", "Dodavatel", "Poznámka", "DPH %", "Plán bez DPH", "Plán s DPH", "Reál bez DPH", "Reál s DPH"].join("	");
  const rows = items.map(i => {
    const vatM = 1 + (i.vat || 0) / 100;
    const expG = Math.round((i.expNet || 0) * vatM);
    const realG = Math.round((i.realNet || 0) * vatM);
    return [i.label, i.supplier || "", i.note || "", `${i.vat || 0}%`, i.expNet || 0, expG, i.realNet || 0, realG].join("	");
  });
  const tsv = [header, ...rows].join("\n");
  const blob = new Blob(["﻿" + tsv], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${c.name}-rozpocet.xls`; a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(c) {
  const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const header = [...c.fields.map((f) => f.label), "HCP", "Skupina", "Stav", "Poznámka"].map(esc).join(";");
  const rows   = c.parts.map((p) => [
    ...c.fields.map((f) => p.data[f.id]),
    p.hcp || "",
    c.groups.find((g) => g.id === p.group)?.name || "",
    STATES[p.state].label,
    p.note,
  ].map(esc).join(";"));
  dl(`${c.name}.csv`, "\uFEFF" + [header, ...rows].join("\n"));
}
function exportStartList(c, buckets, ft) {
  const { nameId } = c.fieldMeta;
  const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const rows = [["Flight", "Čas", "Hráč", "HCP", "Stav"].map(esc).join(";")];
  buckets.forEach((b, i) => b.forEach((p) => rows.push([`Flight ${i + 1}`, ft(i), p.data[nameId], p.hcp || "—", STATES[p.state].label].map(esc).join(";"))));
  dl(`listina-${c.name}.csv`, "\uFEFF" + rows.join("\n"));
}
function dl(name, content) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8;" })), download: name });
  a.click();
}
function fmt(d) {
  try { return new Date(d).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
}
