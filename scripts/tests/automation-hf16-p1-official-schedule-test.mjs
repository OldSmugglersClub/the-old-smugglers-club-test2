import assert from "node:assert/strict";
import { classifyOfficialMatchdayPage } from "../bundesliga-official-schedule.mjs";

const confirmed = `
<html><body>
<h1>4. Spieltag Saison 2026-2027</h1>
<div>2026-2027</div><div>Spieltag 4</div>
<div>Freitag 18. September</div><div>20:30</div>
<div>Samstag 19. September</div><div>15:30</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div>
</body></html>`;

const open = `
<html><body>
<h1>5. Spieltag Saison 2026-2027</h1>
<div>2026-2027</div><div>Spieltag 5</div>
<div>Freitag - Sonntag 9. Okt. - 11. Okt.</div>
<div>Dieser Spieltag ist noch nicht fix terminiert.</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div>
</body></html>`;

const completed = `
<html><body>
<h1>1. Spieltag Saison 2026-2027</h1>
<div>2026-2027</div><div>Spieltag 1</div>
<div>Image: whistle</div><div>FCN 3 SGD 0</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div><div>Tickets Alle Clubs Bundesliga Saison Spielplan</div>
</body></html>`;

assert.equal(classifyOfficialMatchdayPage(confirmed, 4), true);
assert.equal(classifyOfficialMatchdayPage(open, 5), false);
assert.equal(classifyOfficialMatchdayPage(completed, 1), true);
assert.throws(
  () => classifyOfficialMatchdayPage("<html><body><h1>5. Spieltag Saison 2026-2027</h1><p>Spieltag 5</p></body></html>", 5),
  /leer\/unplausibel|weder konkrete Uhrzeit/
);
console.log("HF16-P1 official schedule classifier: OK");
