import fs from "node:fs";
import assert from "node:assert";

const dynCore=fs.readFileSync("/mnt/data/TOSMC_AUTOMATION_HF14_BUILD/FULL/scripts/dynamo-terminimport-core.mjs","utf8");
const dynWf=fs.readFileSync("/mnt/data/TOSMC_AUTOMATION_HF14_BUILD/FULL/.github/workflows/dynamo-terminimport-auto.yml","utf8");
const buliWf=fs.readFileSync("/mnt/data/TOSMC_AUTOMATION_HF14_BUILD/FULL/.github/workflows/bundesliga-terminimport-auto.yml","utf8");
const snap=fs.readFileSync("/mnt/data/TOSMC_AUTOMATION_HF14_BUILD/FULL/scripts/schedule-terminstand.mjs","utf8");

assert(dynCore.includes("const now = new Date();"), "Dynamo core needs defined now for reschedule protection");
assert(dynWf.includes("node scripts/schedule-terminstand.mjs"), "Dynamo workflow must refresh persistent snapshot");
assert(buliWf.includes("node scripts/schedule-terminstand.mjs"), "Bundesliga workflow must refresh persistent snapshot");
assert(dynWf.includes("schedule-terminstand.json"), "Dynamo workflow must stage persistent snapshot");
assert(buliWf.includes("schedule-terminstand.json"), "Bundesliga workflow must stage persistent snapshot");
assert(snap.includes("schedule-terminstand.json"), "Snapshot generator must target schedule-terminstand.json");

console.log("HF14_AUTOMATION_STATIC_OK");
