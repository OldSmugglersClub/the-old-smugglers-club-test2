import { execFileSync } from "node:child_process";

const BEFORE = process.env.AUDIT_BEFORE || "bf28781";
const AFTER  = process.env.AUDIT_AFTER  || "5487590";

const ALLOWED = new Set([
  "datum",
  "datumVon",
  "datumBis",
  "datumAnzeige",
  "anstoss",
  "terminBestaetigt",
  "status",
  "quelleStand"
]);

function load(ref) {
  const txt = execFileSync("git", ["show", `${ref}:spieldaten.json`], { encoding: "utf8" });
  return JSON.parse(txt);
}

function bundesliga(data) {
  return (Array.isArray(data?.saisons) ? data.saisons : [])
    .flatMap(s => Array.isArray(s?.spiele) ? s.spiele : [])
    .filter(m => m?.wettbewerb === "bundesliga" && m?.saison === "2026/2027");
}

function stable(v) {
  return JSON.stringify(v);
}

const before = bundesliga(load(BEFORE));
const after  = bundesliga(load(AFTER));

const b = new Map(before.map(x => [x.id, x]));
const a = new Map(after.map(x => [x.id, x]));

const added = [...a.keys()].filter(id => !b.has(id));
const removed = [...b.keys()].filter(id => !a.has(id));
const changedGames = [];
const allowedChanges = {};
const forbidden = [];

for (const id of [...b.keys()].filter(id => a.has(id))) {
  const x = b.get(id), y = a.get(id);
  const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
  const changes = [];
  for (const key of [...keys].sort()) {
    if (stable(x[key]) === stable(y[key])) continue;
    const rec = { id, feld: key, vorher: x[key] ?? null, nachher: y[key] ?? null };
    changes.push(rec);
    if (ALLOWED.has(key)) {
      allowedChanges[key] = (allowedChanges[key] || 0) + 1;
    } else {
      forbidden.push(rec);
    }
  }
  if (changes.length) changedGames.push({ id, changes });
}

const report = {
  audit: `${BEFORE} -> ${AFTER}`,
  bundesligaVorher: before.length,
  bundesligaNachher: after.length,
  hinzugefuegteSpiele: added,
  entfernteSpiele: removed,
  geaenderteSpiele: changedGames.length,
  erlaubteFeldaenderungen: allowedChanges,
  unerlaubteFeldaenderungen: forbidden.length,
  unerlaubteDetails: forbidden
};

console.log(JSON.stringify(report, null, 2));

if (before.length !== 306 || after.length !== 306) {
  console.error("AUDIT FEHLER: Bundesliga-Bestand ist nicht 306/306.");
  process.exit(1);
}
if (added.length || removed.length) {
  console.error("AUDIT FEHLER: Spiele wurden hinzugefügt oder entfernt.");
  process.exit(1);
}
if (forbidden.length) {
  console.error("AUDIT FEHLER: Unerlaubte Feldänderungen gefunden.");
  process.exit(1);
}
console.log("AUDIT BESTANDEN: 306/306 Spiele; keine Spiele hinzugefügt/entfernt; 0 unerlaubte Feldänderungen.");
