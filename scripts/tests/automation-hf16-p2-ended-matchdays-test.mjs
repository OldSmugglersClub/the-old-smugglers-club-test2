import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { loadOfficialConfirmedMatchdays } from "../bundesliga-official-schedule.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "osc-hf16p2-"));
const filler = "<div>Tickets Alle Clubs Bundesliga Saison Spielplan</div>".repeat(8);
fs.writeFileSync(path.join(dir, "2bundesliga-3.html"),
  `<html><body><h1>3. Spieltag Saison 2026-2027</h1><div>2026-2027</div><div>Spieltag 3</div><div>13:00</div>${filler}</body></html>`);
fs.writeFileSync(path.join(dir, "2bundesliga-4.html"),
  `<html><body><h1>4. Spieltag Saison 2026-2027</h1><div>2026-2027</div><div>Spieltag 4</div><div>20:30</div>${filler}</body></html>`);
fs.writeFileSync(path.join(dir, "2bundesliga-5.html"),
  `<html><body><h1>5. Spieltag Saison 2026-2027</h1><div>2026-2027</div><div>Spieltag 5</div><div>13:00</div>${filler}</body></html>`);
fs.writeFileSync(path.join(dir, "2bundesliga-6.html"),
  `<html><body><h1>6. Spieltag Saison 2026-2027</h1><div>2026-2027</div><div>Spieltag 6</div><div>20:30</div>${filler}</body></html>`);
fs.writeFileSync(path.join(dir, "2bundesliga-7.html"),
  `<html><body><h1>7. Spieltag Saison 2026-2027</h1><div>2026-2027</div><div>Spieltag 7</div><div>Dieser Spieltag ist noch nicht fix terminiert.</div>${filler}</body></html>`);

const confirmed = await loadOfficialConfirmedMatchdays("2-bundesliga", { fixtureDir: dir, startMatchday: 3 });
assert.deepEqual([...confirmed], [3,4,5,6]);
console.log("HF16-P2 ended-matchday bypass: OK");
