import fs from "node:fs";
import {
  readJson,
  writeJson,
  validateAndPlan,
  applyPlan
} from "./dynamo-terminimport-core.mjs";

const SPIELDATEN_PATH = process.env.OSC_SPIELDATEN_PATH || "spieldaten.json";
const TEAMS_PATH = process.env.OSC_TEAMS_PATH || "teams.json";
const API_FIXTURE_PATH = process.env.OSC_API_FIXTURE_PATH || "";
const API_URL = "https://api.openligadb.de/getmatchdata/bl2/2026";

function berlinDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(now);
  const v = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${v.year}-${v.month}-${v.day}`;
}

async function loadApiMatches() {
  if (API_FIXTURE_PATH) {
    if (!fs.existsSync(API_FIXTURE_PATH)) throw new Error(`API-Testfixture fehlt: ${API_FIXTURE_PATH}`);
    console.log(`TESTMODUS: OpenLigaDB-Daten aus ${API_FIXTURE_PATH}.`);
    return readJson(API_FIXTURE_PATH);
  }
  let response;
  try {
    response = await fetch(API_URL, { headers: { Accept: "application/json" } });
  } catch (error) {
    throw new Error(`OpenLigaDB nicht erreichbar: ${error.message}. Keine Änderung.`);
  }
  if (!response.ok) throw new Error(`OpenLigaDB HTTP ${response.status}. Keine Änderung.`);
  return await response.json();
}

if (!fs.existsSync(SPIELDATEN_PATH)) throw new Error(`${SPIELDATEN_PATH} fehlt.`);
if (!fs.existsSync(TEAMS_PATH)) throw new Error(`${TEAMS_PATH} fehlt.`);

const data = readJson(SPIELDATEN_PATH);
const teams = readJson(TEAMS_PATH);
const apiMatches = await loadApiMatches();
const plan = validateAndPlan(data, teams, apiMatches);

console.log(JSON.stringify({
  lokaleDynamoSpiele: plan.localCount,
  openLigaDbDynamoSpiele: plan.apiDynamoCount,
  eindeutigZugeordnet: plan.matched,
  neueExakteTermine: plan.planned,
  uebersprungen: plan.skipped.length
}, null, 2));

if (!plan.planned.length) {
  console.log("KEINE TERMINÄNDERUNG: Keine neuen, sicher konkretisierbaren Dynamo-Termine.");
  process.exit(0);
}

const changed = applyPlan(data, plan, berlinDate());
if (!changed) {
  console.log("KEINE TERMINÄNDERUNG.");
  process.exit(0);
}

writeJson(SPIELDATEN_PATH, data);
console.log(`TERMINIMPORT ERFOLGREICH: ${changed} Dynamo-Termin(e) konkretisiert; datenVersion exakt +1.`);
