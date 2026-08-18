import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { buildSnapshot } from "../h2h-snapshot.mjs";

process.env.OSC_H2H_FIXTURE_DIR = path.resolve("scripts/tests/fixtures/h2h");

const gamesDoc = {
  saisons:[{spiele:[{
    id:"test-dynamo-darmstadt",
    wettbewerb:"2-bundesliga",
    saison:"2026/2027",
    datum:"2026-08-20",
    anstoss:"13:00",
    terminBestaetigt:true,
    heimTeamId:"dynamo-dresden",
    auswaertsTeamId:"darmstadt-98"
  },{
    id:"test-piratenkodex",
    wettbewerb:"piratenkodex",
    saison:"2026/2027",
    datum:"2026-08-20",
    anstoss:"15:30",
    terminBestaetigt:true,
    heimTeamId:"dynamo-dresden",
    auswaertsTeamId:"darmstadt-98"
  }]}]
};
const teamsDoc = {teams:[
  {id:"dynamo-dresden",name:"SG Dynamo Dresden",kurzname:"Dynamo Dresden",apiAliase:["SG Dynamo Dresden"]},
  {id:"darmstadt-98",name:"SV Darmstadt 98",kurzname:"Darmstadt 98",apiAliase:["SV Darmstadt 98"]}
]};

const snap = await buildSnapshot({
  gamesDoc, teamsDoc, previousDoc:null,
  current:new Date("2026-08-18T12:00:00")
});

const ready = snap.entries["test-dynamo-darmstadt"];
assert.equal(ready.status,"ready");
assert.equal(ready.modules.h2h.summary.homeWins,1);
assert.equal(ready.modules.h2h.summary.draws,1);
assert.equal(ready.modules.h2h.summary.awayWins,0);
assert.equal(ready.modules.h2h.lastMeetings.length,2);
assert.equal(ready.modules.table.home.position,2);
assert.equal(ready.modules.table.away.position,1);

const unavailable = snap.entries["test-piratenkodex"];
assert.equal(unavailable.status,"unavailable");
assert.equal(unavailable.reason,"competition-not-supported");

console.log("H2H_SNAPSHOT_TEST_OK");
