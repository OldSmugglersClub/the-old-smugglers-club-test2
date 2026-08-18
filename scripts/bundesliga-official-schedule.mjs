import fs from "node:fs";

const CONFIG = {
  bundesliga: { slug: "bundesliga", label: "Bundesliga" },
  "2-bundesliga": { slug: "2bundesliga", label: "2. Bundesliga" }
};

function pageUrl(slug, matchday) {
  return `https://www.bundesliga.com/de/${slug}/spieltag/2026-2027/${matchday}`;
}

function normalizeHtml(html) {
  return String(html || "").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ");
}

export function classifyOfficialMatchdayPage(html, matchday) {
  const text = normalizeHtml(html);
  if (!text || text.length < 500) throw new Error(`Offizielle Spieltagseite ${matchday} ist leer/unplausibel.`);
  const seasonOk = text.includes("2026-2027") || text.includes("2026/27") || text.includes("2026/2027");
  const matchdayOk = new RegExp(`(?:Spieltag|Matchday)\\s*${matchday}(?:\\D|$)`, "i").test(text);
  if (!seasonOk || !matchdayOk) throw new Error(`Offizielle Spieltagseite ${matchday} konnte nicht sicher validiert werden.`);
  if (/Dieser Spieltag ist noch nicht fix terminiert\.?/i.test(text)) return false;
  return true;
}

async function loadPage(slug, matchday, fixtureDir) {
  if (fixtureDir) {
    const path = `${fixtureDir}/${slug}-${matchday}.html`;
    if (!fs.existsSync(path)) throw new Error(`Offizielles Testfixture fehlt: ${path}`);
    return fs.readFileSync(path, "utf8");
  }
  let response;
  try {
    response = await fetch(pageUrl(slug, matchday), {
      headers: { Accept: "text/html", "User-Agent": "TheOldSmugglersClub/1.0 schedule-verifier" },
      redirect: "follow"
    });
  } catch (error) {
    throw new Error(`Offizielle Bundesliga-Terminquelle nicht erreichbar: ${error.message}. Keine Änderung.`);
  }
  if (!response.ok) throw new Error(`Offizielle Bundesliga-Terminquelle HTTP ${response.status}. Keine Änderung.`);
  return await response.text();
}

export async function loadOfficialConfirmedMatchdays(competition, options = {}) {
  const cfg = CONFIG[competition];
  if (!cfg) throw new Error(`Unbekannter Wettbewerb für offizielle Terminprüfung: ${competition}`);
  const fixtureDir = options.fixtureDir || process.env.OSC_OFFICIAL_FIXTURE_DIR || "";
  const confirmed = new Set();

  // Die Bundesliga terminiert fortlaufende Spieltagsblöcke. Wir prüfen daher vom Saisonstart
  // bis zum ersten ausdrücklich noch nicht fix terminierten Spieltag. Das reduziert Live-Requests.
  for (let st = 1; st <= 34; st++) {
    const html = await loadPage(cfg.slug, st, fixtureDir);
    const isConfirmed = classifyOfficialMatchdayPage(html, st);
    if (!isConfirmed) break;
    confirmed.add(st);
  }
  if (!confirmed.size) throw new Error(`${cfg.label}: kein offiziell fix terminierter Spieltag erkannt. Keine Änderung.`);
  return confirmed;
}
