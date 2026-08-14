(function(){
  "use strict";

  const fetchJson = async (url) => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${url} konnte nicht geladen werden (${response.status})`);
    return response.json();
  };

  const validSchedule = schedule => schedule && typeof schedule === "object"
    && Array.isArray(schedule.games)
    && Array.isArray(schedule.matchdays)
    && Array.isArray(schedule.teams);

  async function loadSchedule(){
    try {
      const websiteView = await fetchJson("./website-view.json");
      if (validSchedule(websiteView.schedule)) {
        const schedule = websiteView.schedule;
        const activeSeason = schedule.activeSeason || websiteView.saison || "2026-27";
        return {
          source: "website-view.json",
          diagnostics: { source: "website-view.json", fallback: false },
          config: {
            locale: schedule.locale || "de-DE",
            testJetzt: schedule.testNow || "",
            liveDauerMinuten: schedule.liveDurationMinutes || 120,
            hinweisAnzeigen: Boolean(schedule.notice),
            hinweis: schedule.notice || "",
            uebersichtLink: schedule.overviewLink || "./saison-2026-2027.html",
            uebersichtButtonText: schedule.overviewButtonText || "Spieltagslogbuch",
            kicktippLink: schedule.kicktippLink || "",
            kicktippButtonText: schedule.kicktippButtonText || ""
          },
          games: { aktiveSaison: activeSeason, saisons: [{ id: activeSeason, spiele: schedule.games }] },
          teams: { teams: schedule.teams },
          matchdays: {
            aktiveSaison: activeSeason,
            saisons: [{ id: activeSeason, aktiv: true, tippspieltage: schedule.matchdays }]
          }
        };
      }
    } catch (error) {
      console.warn("Zentrale Spielbetriebsdaten nicht verfügbar, Rückfall auf 4.6.1-Dateien.", error);
    }

    const registry = window.OSCDataRegistry;
    const [configUrl, gamesUrl, teamsUrl, matchdaysUrl] = registry
      ? await Promise.all([
          registry.url("spieltag"), registry.url("spiele"),
          registry.url("teams"), registry.url("tippspieltage")
        ])
      : ["./spieltag.json", "./spieldaten.json", "./teams.json", "./tippspieltage.json"];

    const [config, games, teams, matchdays] = await Promise.all([
      fetchJson(configUrl), fetchJson(gamesUrl), fetchJson(teamsUrl), fetchJson(matchdaysUrl)
    ]);
    return {
      source: "legacy",
      diagnostics: { source: "legacy", fallback: true },
      config, games, teams, matchdays
    };
  }

  window.OSCScheduleDataAdapter = Object.freeze({ loadSchedule });
})();
