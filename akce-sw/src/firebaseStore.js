/* ══════════════════════════════════════════════════════════════════════
   firebaseStore.js — Firebase store vrstva (F1–F4)
   Firebase žije POUZE zde. Komponenty se nepřepisují.
   Přidat do projektu AŽ po `npm install firebase` a vyplnění firebaseConfig.

   Rozhraní je shodné s lokálním useCampaignStore:
     subscribeCampaigns(cb) → () => void   (F3 READ)
     updateCampaign(id, fn)                (F4 WRITE — zapnout až po ověřené paritě)
     addCampaign(c)
     subscribeUsers(cb)                    (F1)
     seedImport(campaigns, users)          (F2, jednorázově)

   DŮLEŽITÉ: `compose` se sem PŘEDÁVÁ z aplikace — je to jediný zdroj pravdy
   pro skládání objektu c. Tento modul žádné vlastní compose nemá.
   ══════════════════════════════════════════════════════════════════════ */

import { initializeApp } from "firebase/app";
import {
  getFirestore, initializeFirestore, collection, doc, getDoc, getDocs, onSnapshot,
  setDoc, deleteDoc, writeBatch, serverTimestamp,
} from "firebase/firestore";

// TODO: vlož svůj Firebase config (F0)
const firebaseConfig = {
  apiKey: "AIzaSyBy0vc9-UPI1z2QdpA83v9H8Gd819X4WQw",
  authDomain: "akce-sw-test.firebaseapp.com",
  projectId: "akce-sw-test",
  storageBucket: "akce-sw-test.firebasestorage.app",
  messagingSenderId: "853935763597",
  appId: "1:853935763597:web:7e058f8171de52da80f2c4",
};

export function createFirebaseStore({ compose, SCHEMA_VERSION }) {
  const app = initializeApp(firebaseConfig);
  // ignoreUndefinedProperties: undefined pole se při zápisu vynechají (Firestore je jinak odmítá).
  // Local mode se nedotkne; F3 normalizace už undefined == chybějící bere.
  const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

  // poslední složený stav — potřebuje ho applyWrite (before) a parity check
  const cache = new Map();

  const readDocs = async (path) => {
    const snap = await getDocs(collection(db, ...path));
    return snap.docs.map((x) => ({ id: x.id, ...x.data() }));
  };

  // ── F3: READ — skládá campaigns z events + podkolekcí přes compose() ──
  function subscribeCampaigns(cb) {
    // realtime na kolekci events; podkolekce se dočtou při každé změně (pro parity dostačuje).
    // Jemnější realtime na podkolekcích je pozdější optimalizace, ne podmínka F3.
    return onSnapshot(collection(db, "events"), async (snap) => {
      const campaigns = await Promise.all(
        snap.docs.map(async (d) => {
          const event = { id: d.id, ...d.data() };
          const [participants, leads, reservations, finalDoc] = await Promise.all([
            readDocs(["events", d.id, "participants"]),
            readDocs(["events", d.id, "leads"]),
            readDocs(["events", d.id, "reservations"]),
            getDoc(doc(db, "events", d.id, "snapshots", "final")),
          ]);
          const snapshot = finalDoc.exists() ? finalDoc.data() : null;
          const c = compose(event, { participants, leads, reservations, snapshot });
          cache.set(d.id, c);
          return c;
        })
      );
      cb(campaigns);
    });
  }

  // ── F1: USERS ──
  // Varianta A: Firestore users se vrací ve stejném tvaru jako seed — doc-ID → `id`
  // (doménový identifikátor uživatele: assignedTo / userId / approverId).
  // Shodné s subscribeCampaigns (`id: x.id`). Storage klíč (doc-ID) zůstává oddělený.
  // Pozn.: samotné sjednocení identity NEřeší perzistenci toggle active — write path
  // pro users zatím neexistuje (řeší se až v F10 po security rules).
  function subscribeUsers(cb) {
    return onSnapshot(collection(db, "users"), (snap) =>
      cb(snap.docs.map((x) => ({ id: x.id, ...x.data() })))
    );
  }

  // ── F2: jednorázový import seedu (idempotentní — pevná id) ──
  async function seedImport(campaigns = [], users = []) {
    const batch = writeBatch(db);
    for (const u of users) {
      batch.set(doc(db, "users", u.uid || u.id), {
        ...stripId(u), schemaVersion: SCHEMA_VERSION,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
    // akce zvlášť (kvůli podkolekcím)
    for (const c of campaigns) await writeCampaign(c, { create: true });
  }

  // ── F4: WRITE — diff fn(before) → after → zápis do podkolekcí ──
  // Zapnout AŽ po ověřené paritě READ path (viz parityCheck).
  async function updateCampaign(id, fn) {
    const before = cache.get(id);
    if (!before) throw new Error(`updateCampaign: chybí before pro ${id} (nejdřív subscribe).`);
    const after = fn(before);              // čistá transformace — kontrakt onUpdate beze změny
    await writeCampaign(after, { before });
    cache.set(id, after);
  }

  async function addCampaign(c) {
    const withMeta = { schemaVersion: SCHEMA_VERSION, ...c };
    await writeCampaign(withMeta, { create: true });
    cache.set(withMeta.id, withMeta);
  }

  // rozloží c na event doc + podkolekce a zapíše jen změněné dokumenty.
  // root = cílová top-level kolekce ("events" ostrý provoz, "events_shadow" pro F4b).
  async function writeCampaign(after, { before = null, create = false, root = "events" } = {}) {
    const batch = writeBatch(db);
    const { parts = [], leads = [], reservations = [], finalReport = null, ...eventFields } = after;

    batch.set(
      doc(db, root, after.id),
      { ...stripId(eventFields), schemaVersion: after.schemaVersion ?? SCHEMA_VERSION, updatedAt: serverTimestamp() },
      { merge: true }
    );

    diffById(batch, [root, after.id, "participants"], before?.parts, parts);
    diffById(batch, [root, after.id, "leads"], before?.leads, leads);
    diffById(batch, [root, after.id, "reservations"], before?.reservations, reservations);

    // snapshot: zapiš JEN JEDNOU (při uzavření), nikdy nepřepisuj
    if (finalReport && !before?.finalReport) {
      batch.set(doc(db, root, after.id, "snapshots", "final"), finalReport);
    }
    await batch.commit();

    void create; // create/first-write nemá zvláštní větev — merge:true + diff to pokryjí
  }

  // create / update / delete podle stabilního id.
  // Rizikovou diff logiku počítá sdílená computeDiffOps() (viz níže) —
  // stejný zdroj používá i F4a dry-run, aby se ostrý zápis a dry-run nemohly rozejít.
  function diffById(batch, path, beforeArr = [], afterArr = []) {
    for (const op of computeDiffOps(path, beforeArr, afterArr)) {
      if (op.op === "delete") batch.delete(doc(db, ...op.path));
      else batch.set(doc(db, ...op.path), op.data, { merge: false });
    }
  }

  // ── F4a: DRY-RUN — spočítá plánované operace batch BEZ commitu. ──
  //    Žádný zápis do Firestore. Slouží k ověření diff enginu před ostrým F4.
  //    Vrací { ops:[{op,coll,id,merge}], summary:{set,delete,byColl} }.
  function dryRunWrite(after, before = null) {
    const ops = [];
    const { parts = [], leads = [], reservations = [], finalReport = null, ...eventFields } = after;

    // event doc — vždy merge:true set (skalární/objektová pole akce)
    ops.push({ op: "set", coll: "events", id: after.id, merge: true, fields: Object.keys(stripId(eventFields)).length });

    ops.push(...computeDiffOps(["events", after.id, "participants"], before?.parts, parts).map(tag("participants")));
    ops.push(...computeDiffOps(["events", after.id, "leads"], before?.leads, leads).map(tag("leads")));
    ops.push(...computeDiffOps(["events", after.id, "reservations"], before?.reservations, reservations).map(tag("reservations")));

    if (finalReport && !before?.finalReport) {
      ops.push({ op: "set", coll: "snapshots", id: "final", merge: false, once: true });
    }

    const summary = { set: 0, delete: 0, byColl: {} };
    for (const o of ops) {
      summary[o.op] = (summary[o.op] || 0) + 1;
      const b = (summary.byColl[o.coll] = summary.byColl[o.coll] || { set: 0, delete: 0 });
      b[o.op]++;
    }
    return { ops, summary };
  }
  const tag = (coll) => (op) => ({ op: op.op, coll, id: op.id, merge: op.merge });

  // ── F4b: SHADOW WRITE — reálný zápis, ale do izolované kolekce events_shadow. ──
  //    Používá stejný writeCampaign engine jako ostrý provoz (jen jiný root),
  //    takže parita round-tripu je smysluplná. Provozní kolekce "events" se NEDOTKNE.
  const SHADOW_ROOT = "events_shadow";

  async function shadowWrite(after, before = null) {
    await writeCampaign(after, { before, root: SHADOW_ROOT });
  }

  // přečte a složí kampaně z events_shadow (obdoba subscribeCampaigns, jen root)
  async function readShadowCampaigns() {
    const out = [];
    const snap = await getDocs(collection(db, SHADOW_ROOT));
    for (const d of snap.docs) {
      const event = { id: d.id, ...d.data() };
      const [participants, leads, reservations, finalDoc] = await Promise.all([
        readDocs([SHADOW_ROOT, d.id, "participants"]),
        readDocs([SHADOW_ROOT, d.id, "leads"]),
        readDocs([SHADOW_ROOT, d.id, "reservations"]),
        getDoc(doc(db, SHADOW_ROOT, d.id, "snapshots", "final")),
      ]);
      out.push(compose(event, { participants, leads, reservations, snapshot: finalDoc.exists() ? finalDoc.data() : null }));
    }
    return out;
  }

  // smaže celou shadow kolekci (úklid po testu). Provozní data neřeší.
  async function shadowClear() {
    const snap = await getDocs(collection(db, SHADOW_ROOT));
    for (const d of snap.docs) {
      for (const sub of ["participants", "leads", "reservations"]) {
        const s = await getDocs(collection(db, SHADOW_ROOT, d.id, sub));
        for (const x of s.docs) await deleteDoc(x.ref);
      }
      const fin = await getDoc(doc(db, SHADOW_ROOT, d.id, "snapshots", "final"));
      if (fin.exists()) await deleteDoc(fin.ref);
      await deleteDoc(d.ref);
    }
    return { cleared: snap.size };
  }

  // ── F3 parity: porovná Firestore-složený c s dodaným lokálním c ──
  async function parityCheck(localCampaigns) {
    const remote = [];
    const snap = await getDocs(collection(db, "events"));
    for (const d of snap.docs) {
      const event = { id: d.id, ...d.data() };
      const [participants, leads, reservations, finalDoc] = await Promise.all([
        readDocs(["events", d.id, "participants"]),
        readDocs(["events", d.id, "leads"]),
        readDocs(["events", d.id, "reservations"]),
        getDoc(doc(db, "events", d.id, "snapshots", "final")),
      ]);
      remote.push(compose(event, { participants, leads, reservations, snapshot: finalDoc.exists() ? finalDoc.data() : null }));
    }
    const norm = (arr) => JSON.stringify([...arr].sort((a, b) => a.id.localeCompare(b.id)));
    const ok = norm(localCampaigns) === norm(remote);
    return { ok, localCount: localCampaigns.length, remoteCount: remote.length };
  }

  return { subscribeCampaigns, updateCampaign, addCampaign, subscribeUsers, seedImport, parityCheck, dryRunWrite, shadowWrite, readShadowCampaigns, shadowClear };
}

const stripId = ({ id, uid, ...rest }) => rest;

// ── Sdílené jádro diffu (create/update/delete podle stabilního id). ──
//    Čistá funkce bez Firestore — používá ji ostrý diffById i F4a dry-run.
//    Vrací [{ op:"set"|"delete", path:[...], id, data? }].
function computeDiffOps(path, beforeArr = [], afterArr = []) {
  const beforeMap = new Map((beforeArr || []).map((x) => [x.id, x]));
  const afterMap = new Map((afterArr || []).map((x) => [x.id, x]));
  const ops = [];
  for (const [id, item] of afterMap) {
    const prev = beforeMap.get(id);
    if (!prev || JSON.stringify(prev) !== JSON.stringify(item)) {
      ops.push({ op: "set", path: [...path, id], id, data: stripId(item) });
    }
  }
  for (const id of beforeMap.keys()) {
    if (!afterMap.has(id)) ops.push({ op: "delete", path: [...path, id], id });
  }
  return ops;
}
