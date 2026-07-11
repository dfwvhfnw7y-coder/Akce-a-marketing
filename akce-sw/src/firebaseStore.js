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
  getFirestore, collection, doc, getDoc, getDocs, onSnapshot,
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
  const db = getFirestore(app);

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
  function subscribeUsers(cb) {
    return onSnapshot(collection(db, "users"), (snap) =>
      cb(snap.docs.map((x) => ({ uid: x.id, ...x.data() })))
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

  // rozloží c na event doc + podkolekce a zapíše jen změněné dokumenty
  async function writeCampaign(after, { before = null, create = false } = {}) {
    const batch = writeBatch(db);
    const { parts = [], leads = [], reservations = [], finalReport = null, ...eventFields } = after;

    batch.set(
      doc(db, "events", after.id),
      { ...stripId(eventFields), schemaVersion: after.schemaVersion ?? SCHEMA_VERSION, updatedAt: serverTimestamp() },
      { merge: true }
    );

    diffById(batch, ["events", after.id, "participants"], before?.parts, parts);
    diffById(batch, ["events", after.id, "leads"], before?.leads, leads);
    diffById(batch, ["events", after.id, "reservations"], before?.reservations, reservations);

    // snapshot: zapiš JEN JEDNOU (při uzavření), nikdy nepřepisuj
    if (finalReport && !before?.finalReport) {
      batch.set(doc(db, "events", after.id, "snapshots", "final"), finalReport);
    }
    await batch.commit();

    void create; // create/first-write nemá zvláštní větev — merge:true + diff to pokryjí
  }

  // create / update / delete podle stabilního id
  function diffById(batch, path, beforeArr = [], afterArr = []) {
    const beforeMap = new Map((beforeArr || []).map((x) => [x.id, x]));
    const afterMap = new Map((afterArr || []).map((x) => [x.id, x]));
    for (const [id, item] of afterMap) {
      const prev = beforeMap.get(id);
      if (!prev || JSON.stringify(prev) !== JSON.stringify(item)) {
        batch.set(doc(db, ...path, id), stripId(item), { merge: false });
      }
    }
    for (const id of beforeMap.keys()) {
      if (!afterMap.has(id)) batch.delete(doc(db, ...path, id));
    }
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

  return { subscribeCampaigns, updateCampaign, addCampaign, subscribeUsers, seedImport, parityCheck };
}

const stripId = ({ id, uid, ...rest }) => rest;
