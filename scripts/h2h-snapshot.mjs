import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE = "https://api.openligadb.de";
const SOURCE = {
  name: "OpenLigaDB",
  license: "ODbL",
  url: "https://www.openligadb.de/"
};

const COMPETITIONS = {
  "bundesliga": { shortcut: "bl1" },
  "2-bundesliga": { shortcut: "bl2" }
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const FUTURE_WINDOW = 7 * DAY;
const FALLBACK_NEXT_WINDOW = 14 * DAY;
const RETENTION = 7 * DAY;
const FINAL_REFRESH = 24 * HOUR;
const MAX_EMPTY_MAPPING_ATTEMPTS = 3;

const now = () => {
  const raw = process.env.OSC_H2H_NOW;
  return raw ? new Date(raw) : new Date();
};

const normalize = value => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const safeArray = value => Array.isArray(value) ? value : [];

const seasonStart = game => {
  const raw = String(game?.saison || "");
  const match = raw.match(/^(\d{4})/);
  return match ? match[1] : String(new Date().getFullYear());
};

const kickoffOf = game => {
  if (!game?.datum || !game?.anstoss) return null;
  const dt = new Date(`${game.datum}T${game.anstoss}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

function flattenGames(doc) {
  return safeArray(doc?.saisons).flatMap(s => safeArray(s?.spiele)).concat(safeArray(doc?.spiele));
}

function teamIndex(doc) {
  return new Map(safeArray(doc?.teams).map(team => [team.id, team]));
}

function candidateNames(team) {
  return [team?.name, team?.kurzname, ...(safeArray(team?.apiAliase))]
    .filter(Boolean)
    .map(normalize)
    .filter(Boolean);
}

function resolveOpenLigaTeam(localTeam, availableTeams) {
  if (!localTeam) return null;
  const wanted = new Set(candidateNames(localTeam));
  const scored = safeArray(availableTeams).map(team => {
    const values = [
      team?.teamName,
      team?.shortName,
      team?.teamNameShort,
      team?.teamGroupName
    ].filter(Boolean).map(normalize);
    let score = 0;
    for (const value of values) {
      if (wanted.has(value)) score = Math.max(score, 100);
      for (const expected of wanted) {
        if (value && expected && (value.includes(expected) || expected.includes(value))) {
          score = Math.max(score, Math.min(value.length, expected.length) >= 6 ? 70 : 40);
        }
      }
    }
    return { team, score };
  }).sort((a,b) => b.score - a.score);

  if (!scored.length || scored[0].score < 70) return null;
  if (scored[1] && scored[1].score === scored[0].score) return null;
  return scored[0].team;
}

function finishedResult(match) {
  const results = safeArray(match?.matchResults);
  const end = results.find(r => Number(r?.resultTypeID) === 2)
    || results.find(r => /end|final/i.test(String(r?.resultName || "")))
    || [...results].sort((a,b) => Number(b?.resultOrderID || 0) - Number(a?.resultOrderID || 0))[0];
  if (!end) return null;
  const h = Number(end.pointsTeam1);
  const a = Number(end.pointsTeam2);
  return Number.isFinite(h) && Number.isFinite(a) ? { home: h, away: a } : null;
}

function matchDate(match) {
  const raw = match?.matchDateTimeUTC || match?.matchDateTime;
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

function teamId(team) {
  return Number(team?.teamId ?? team?.teamInfoId ?? team?.id);
}

function compactMatch(match) {
  const result = finishedResult(match);
  const date = matchDate(match);
  return {
    matchId: Number(match?.matchID ?? match?.matchId ?? 0) || null,
    date: date ? date.toISOString() : null,
    home: match?.team1?.teamName || match?.team1?.shortName || "",
    away: match?.team2?.teamName || match?.team2?.shortName || "",
    homeTeamId: teamId(match?.team1),
    awayTeamId: teamId(match?.team2),
    result
  };
}

function resultForTeam(match, id) {
  const result = finishedResult(match);
  if (!result) return null;
  const homeId = teamId(match?.team1);
  const awayId = teamId(match?.team2);
  if (homeId !== id && awayId !== id) return null;
  const own = homeId === id ? result.home : result.away;
  const opp = homeId === id ? result.away : result.home;
  return own > opp ? "S" : own < opp ? "N" : "U";
}

function buildH2H(matches, homeId, awayId, beforeDate) {
  const usable = safeArray(matches)
    .map(match => ({ match, date: matchDate(match), result: finishedResult(match) }))
    .filter(x => x.date && x.result && x.date < beforeDate)
    .sort((a,b) => b.date - a.date);

  let homeWins = 0, awayWins = 0, draws = 0;
  usable.forEach(({ match, result }) => {
    const mHome = teamId(match?.team1);
    if (result.home === result.away) draws++;
    else {
      const winnerId = result.home > result.away ? mHome : teamId(match?.team2);
      if (winnerId === homeId) homeWins++;
      if (winnerId === awayId) awayWins++;
    }
  });

  return {
    available: true,
    total: usable.length,
    summary: { homeWins, draws, awayWins },
    lastMeetings: usable.slice(0, 5).map(x => compactMatch(x.match))
  };
}

function buildForm(seasonMatches, id, beforeDate) {
  const recent = safeArray(seasonMatches)
    .filter(match => [teamId(match?.team1), teamId(match?.team2)].includes(id))
    .map(match => ({ match, date: matchDate(match), form: resultForTeam(match, id) }))
    .filter(x => x.date && x.form && x.date < beforeDate)
    .sort((a,b) => b.date - a.date)
    .slice(0,5);
  return {
    available: recent.length > 0,
    values: recent.map(x => x.form),
    matches: recent.map(x => compactMatch(x.match))
  };
}

function buildHomeAway(seasonMatches, id, mode, beforeDate) {
  const rows = safeArray(seasonMatches)
    .filter(match => {
      const d = matchDate(match);
      if (!d || d >= beforeDate || !finishedResult(match)) return false;
      return mode === "home" ? teamId(match?.team1) === id : teamId(match?.team2) === id;
    });

  let won=0, draw=0, lost=0, gf=0, ga=0;
  rows.forEach(match => {
    const r = finishedResult(match);
    const own = mode === "home" ? r.home : r.away;
    const opp = mode === "home" ? r.away : r.home;
    gf += own; ga += opp;
    if (own > opp) won++; else if (own < opp) lost++; else draw++;
  });
  return {
    available: rows.length > 0,
    played: rows.length, won, draw, lost, goalsFor: gf, goalsAgainst: ga
  };
}

function buildTableEntry(table, id) {
  const row = safeArray(table).find(r => Number(r?.teamInfoId ?? r?.teamId ?? r?.id) === id);
  if (!row) return { available:false };
  const position = safeArray(table).indexOf(row) + 1;
  return {
    available: true,
    position,
    points: Number(row?.points ?? 0),
    won: Number(row?.won ?? 0),
    draw: Number(row?.draw ?? 0),
    lost: Number(row?.lost ?? 0),
    goals: Number(row?.goals ?? 0),
    opponentGoals: Number(row?.opponentGoals ?? 0),
    goalDiff: Number(row?.goalDiff ?? (Number(row?.goals ?? 0)-Number(row?.opponentGoals ?? 0)))
  };
}

function fixtureName(url) {
  const p = new URL(url).pathname.replace(/^\/+/,"").replace(/\//g,"__");
  return `${p}.json`;
}

async function fetchJson(url) {
  const fixtureDir = process.env.OSC_H2H_FIXTURE_DIR;
  if (fixtureDir) {
    const fp = path.join(fixtureDir, fixtureName(url));
    if (!fs.existsSync(fp)) throw new Error(`Fixture fehlt: ${fp}`);
    return JSON.parse(fs.readFileSync(fp, "utf8"));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "TheOldSmugglersClub-H2H/1.0" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function leagueContext(shortcut, season) {
  const [teams, matches, table] = await Promise.all([
    fetchJson(`${API_BASE}/getavailableteams/${encodeURIComponent(shortcut)}/${encodeURIComponent(season)}`),
    fetchJson(`${API_BASE}/getmatchdata/${encodeURIComponent(shortcut)}/${encodeURIComponent(season)}`),
    fetchJson(`${API_BASE}/getbltable/${encodeURIComponent(shortcut)}/${encodeURIComponent(season)}`)
  ]);
  return { teams, matches, table };
}

function emptySnapshot(previous = {}) {
  return {
    schemaVersion: 1,
    source: SOURCE,
    generatedAt: new Date().toISOString(),
    windowDays: 7,
    retentionDays: 7,
    entries: previous?.entries && typeof previous.entries === "object" ? previous.entries : {}
  };
}

function eligibleGames(gameDoc, current) {
  const min = new Date(current.getTime() - 3 * HOUR);
  const max = new Date(current.getTime() + FUTURE_WINDOW);
  const fallbackMax = new Date(current.getTime() + FALLBACK_NEXT_WINDOW);
  const all = flattenGames(gameDoc)
    .map(game => ({ game, kickoff: kickoffOf(game) }))
    .filter(x => x.kickoff && x.game?.terminBestaetigt === true && x.kickoff >= min)
    .sort((a,b) => a.kickoff - b.kickoff);

  const regular = all.filter(x => x.kickoff <= max).map(x => x.game);
  if (regular.length) return regular;

  // Falls innerhalb von 7 Tagen noch kein Spiel liegt, den aktuell nächsten
  // sichtbaren Termin bis maximal 14 Tage vorladen. Damit ist der Match-Check
  // bereits test-/nutzbar, ohne die Browser-Seite live an OpenLigaDB zu koppeln.
  const fallback = all.find(x => x.kickoff <= fallbackMax);
  return fallback ? [fallback.game] : [];
}

function cleanup(entries, current) {
  for (const [id, entry] of Object.entries(entries)) {
    const kickoff = entry?.kickoff ? new Date(entry.kickoff) : null;
    if (kickoff && !Number.isNaN(kickoff.getTime()) && current - kickoff > RETENTION) {
      delete entries[id];
    }
  }
}

function unavailableEntry(game, kickoff, reason, current) {
  return {
    gameId: game.id,
    competition: game.wettbewerb,
    kickoff: kickoff.toISOString(),
    status: "unavailable",
    reason,
    updatedAt: current.toISOString(),
    source: SOURCE,
    modules: {}
  };
}

async function processGame(game, localTeams, previous, current, cache) {
  const kickoff = kickoffOf(game);
  const comp = COMPETITIONS[game.wettbewerb];
  if (!comp) return unavailableEntry(game, kickoff, "competition-not-supported", current);

  const season = seasonStart(game);
  const cacheKey = `${comp.shortcut}:${season}`;

  let context;
  try {
    if (!cache.has(cacheKey)) cache.set(cacheKey, await leagueContext(comp.shortcut, season));
    context = cache.get(cacheKey);
  } catch (error) {
    return {
      ...(previous || { gameId: game.id, competition: game.wettbewerb, kickoff: kickoff.toISOString(), modules: {} }),
      status: "retry",
      reason: "technical-error",
      lastError: String(error?.message || error),
      updatedAt: current.toISOString(),
      source: SOURCE
    };
  }

  const localHome = localTeams.get(game.heimTeamId);
  const localAway = localTeams.get(game.auswaertsTeamId);
  const home = resolveOpenLigaTeam(localHome, context.teams);
  const away = resolveOpenLigaTeam(localAway, context.teams);

  if (!home || !away) {
    const attempts = Number(previous?.mappingEmptyAttempts || 0) + 1;
    if (attempts >= MAX_EMPTY_MAPPING_ATTEMPTS || current >= kickoff) {
      return {
        ...unavailableEntry(game, kickoff, "team-mapping-not-found", current),
        mappingEmptyAttempts: attempts
      };
    }
    return {
      gameId: game.id,
      competition: game.wettbewerb,
      kickoff: kickoff.toISOString(),
      status: "retry",
      reason: "team-mapping-not-found",
      mappingEmptyAttempts: attempts,
      updatedAt: current.toISOString(),
      source: SOURCE,
      modules: previous?.modules || {}
    };
  }

  const homeId = teamId(home), awayId = teamId(away);
  let h2h = previous?.modules?.h2h;
  if (!h2h?.available) {
    try {
      const matches = await fetchJson(`${API_BASE}/getmatchdata/${homeId}/${awayId}`);
      h2h = buildH2H(matches, homeId, awayId, kickoff);
    } catch (error) {
      h2h = { available:false, error:String(error?.message || error) };
    }
  }

  const formHome = buildForm(context.matches, homeId, kickoff);
  const formAway = buildForm(context.matches, awayId, kickoff);
  const tableHome = buildTableEntry(context.table, homeId);
  const tableAway = buildTableEntry(context.table, awayId);
  const homeRecord = buildHomeAway(context.matches, homeId, "home", kickoff);
  const awayRecord = buildHomeAway(context.matches, awayId, "away", kickoff);

  const modules = {
    h2h,
    form: {
      available: formHome.available || formAway.available,
      home: formHome,
      away: formAway
    },
    table: {
      available: tableHome.available || tableAway.available,
      home: tableHome,
      away: tableAway
    },
    homeAway: {
      available: homeRecord.available || awayRecord.available,
      home: homeRecord,
      away: awayRecord
    }
  };

  const any = Object.values(modules).some(m => m?.available);
  return {
    gameId: game.id,
    competition: game.wettbewerb,
    kickoff: kickoff.toISOString(),
    status: any ? "ready" : "unavailable",
    reason: any ? "" : "no-statistics",
    updatedAt: current.toISOString(),
    source: SOURCE,
    openLiga: {
      leagueShortcut: comp.shortcut,
      season,
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeTeamName: home?.teamName || "",
      awayTeamName: away?.teamName || ""
    },
    freshness: {
      initialLoadedAt: previous?.freshness?.initialLoadedAt || current.toISOString(),
      finalRefreshDone: Boolean(previous?.freshness?.finalRefreshDone)
    },
    modules
  };
}

function shouldProcess(game, previous, current) {
  if (!previous) return true;
  const kickoff = kickoffOf(game);
  if (!kickoff) return false;
  if (previous.status === "retry") return true;
  if (previous.status === "unavailable") return false;
  if (previous.status === "ready") {
    const until = kickoff - current;
    return until > 0 && until <= FINAL_REFRESH && !previous?.freshness?.finalRefreshDone;
  }
  return true;
}

export async function buildSnapshot({ gamesDoc, teamsDoc, previousDoc = null, current = now() }) {
  const snapshot = emptySnapshot(previousDoc || {});
  snapshot.generatedAt = current.toISOString();
  cleanup(snapshot.entries, current);

  const localTeams = teamIndex(teamsDoc);
  const contextCache = new Map();
  const games = eligibleGames(gamesDoc, current);

  for (const game of games) {
    const previous = snapshot.entries[game.id] || null;
    if (!shouldProcess(game, previous, current)) continue;
    const entry = await processGame(game, localTeams, previous, current, contextCache);
    if (entry.status === "ready" && previous?.status === "ready") {
      entry.freshness.finalRefreshDone = true;
      entry.freshness.initialLoadedAt = previous.freshness?.initialLoadedAt || entry.updatedAt;
      entry.freshness.finalRefreshedAt = current.toISOString();
      // H2H ist statisch für die Vorschau; ein bereits geladener H2H-Snapshot bleibt erhalten.
      if (previous.modules?.h2h?.available) entry.modules.h2h = previous.modules.h2h;
    }
    snapshot.entries[game.id] = entry;
  }

  return snapshot;
}

export async function main() {
  const gamesPath = process.env.OSC_H2H_GAMES || "spieldaten.json";
  const teamsPath = process.env.OSC_H2H_TEAMS || "teams.json";
  const outPath = process.env.OSC_H2H_OUT || "h2h-spieldaten.json";
  const previous = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : null;
  const gamesDoc = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const teamsDoc = JSON.parse(fs.readFileSync(teamsPath, "utf8"));
  const snapshot = await buildSnapshot({ gamesDoc, teamsDoc, previousDoc: previous, current: now() });
  const rendered = JSON.stringify(snapshot, null, 2) + "\n";
  const old = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
  if (old !== rendered) fs.writeFileSync(outPath, rendered, "utf8");

  const counts = Object.values(snapshot.entries).reduce((acc,e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  console.log(`H2H Snapshot: ready=${counts.ready||0}, retry=${counts.retry||0}, unavailable=${counts.unavailable||0}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
