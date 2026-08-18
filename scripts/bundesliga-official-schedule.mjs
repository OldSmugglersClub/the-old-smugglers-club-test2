import fs from "node:fs";

const CONFIG = {
  bundesliga: { slug: "bundesliga", label: "Bundesliga" },
  "2-bundesliga": { slug: "2bundesliga", label: "2. Bundesliga" }
};

function pageUrl(slug, matchday) {
  // Offizielle Spieltagseite. "rahmenspielplan" liefert sowohl bereits
  // zeitgenau terminierte als auch noch offene Spieltage.
  return `https://www.bundesliga.com/de/${slug}/spieltag/rahmenspielplan/${matchday}`;
}

function normalizeHtml(html) {
  return String(html || "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function classifyOfficialMatchdayPage(html, matchday) {
  const text = normalizeHtml(html);
  if (!text || text.length < 250) {
    throw new Error(`Offizielle Spieltagseite ${matchday} ist leer/unplausibel.`);
  }

  const seasonOk = /2026\s*[-/]\s*2027|2026\/27/i.test(text);
  const matchdayOk = new RegExp(`(?:Spieltag|Matchday)\\s*${matchday}(?:\\D|$)`, "i").test(text);
  if (!seasonOk || !matchdayOk) {
    throw new Error(`Offizielle Spieltagseite ${matchday} konnte nicht sicher validiert werden.`);
  }

  // Dieses Signal wird auf der offiziellen Bundesliga-Seite bei noch nicht
  // zeitgenau angesetzten Spieltagen ausgegeben.
  if (/Dieser Spieltag ist noch nicht fix terminiert\.?/i.test(text)) return false;

  // Fail-safe: "nicht offen" allein genügt nicht. Ein bestätigter Spieltag
  // muss konkrete Uhrzeiten enthalten oder bereits ausgetragen sein.
  const timeCount = (text.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g) || []).length;
  const completedCount = (text.match(/\bwhistle\b/gi) || []).length;
  if (timeCount === 0 && completedCount === 0) {
    throw new Error(`Offizielle Spieltagseite ${matchday}: weder konkrete Uhrzeit noch abgeschlossene Spiele erkannt. Keine Änderung.`);
  }

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
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "de-DE,de;q=0.9",
        "User-Agent": "Mozilla/5.0 (compatible; TheOldSmugglersClub/1.0; +https://the-old-smugglers-club.de)"
      },
      redirect: "follow"
    });
  } catch (error) {
    throw new Error(`Offizielle Bundesliga-Terminquelle nicht erreichbar: ${error.message}. Keine Änderung.`);
  }

  if (!response.ok) {
    throw new Error(`Offizielle Bundesliga-Terminquelle HTTP ${response.status}. Keine Änderung.`);
  }
  return await response.text();
}

export async function loadOfficialConfirmedMatchdays(competition, options = {}) {
  const cfg = CONFIG[competition];
  if (!cfg) throw new Error(`Unbekannter Wettbewerb für offizielle Terminprüfung: ${competition}`);

  const fixtureDir = options.fixtureDir || process.env.OSC_OFFICIAL_FIXTURE_DIR || "";
  const confirmed = new Set();

  // DFL terminiert fortlaufende Blöcke. Bis zum ersten offiziell als offen
  // gekennzeichneten Spieltag prüfen; spätere Rahmentermine werden nicht freigegeben.
  for (let st = 1; st <= 34; st++) {
    const html = await loadPage(cfg.slug, st, fixtureDir);
    const isConfirmed = classifyOfficialMatchdayPage(html, st);
    if (!isConfirmed) break;
    confirmed.add(st);
  }

  if (!confirmed.size) {
    throw new Error(`${cfg.label}: kein offiziell fix terminierter Spieltag erkannt. Keine Änderung.`);
  }
  return confirmed;
}
