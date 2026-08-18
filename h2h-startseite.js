(() => {
  "use strict";

  let snapshotPromise;

  const safe = value => String(value ?? "");
  const esc = value => safe(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));

  const formatDate = iso => {
    if (!iso) return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("de-DE", {
      day:"2-digit", month:"2-digit", year:"2-digit"
    }).format(d);
  };

  function loadSnapshot() {
    if (!snapshotPromise) {
      snapshotPromise = fetch("./h2h-spieldaten.json", { cache:"no-store" })
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .catch(() => ({ schemaVersion:1, entries:{} }));
    }
    return snapshotPromise;
  }

  // Sofort nach Seitenaufbau lokal vorladen. Kein OpenLigaDB-Request im Browser.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { loadSnapshot(); }, { once:true });
  } else {
    loadSnapshot();
  }

  const formHtml = values => {
    const rows = Array.isArray(values) ? values : [];
    if (!rows.length) return '<span class="sm-h2h__muted">Noch keine Formdaten</span>';
    return `<span class="sm-h2h__form">${rows.map(v =>
      `<b class="sm-h2h__form-pill sm-h2h__form-pill--${v === "S" ? "win" : v === "N" ? "loss" : "draw"}">${esc(v)}</b>`
    ).join("")}</span>`;
  };

  function h2hModule(entry, game) {
    const h2h = entry?.modules?.h2h;
    if (!h2h?.available) return "";
    const s = h2h.summary || {};
    const meetings = Array.isArray(h2h.lastMeetings) ? h2h.lastMeetings : [];
    const home = esc(game.heim || "Heim");
    const away = esc(game.auswaerts || "Gast");
    return `
      <section class="sm-h2h__section">
        <h4>Direkter Vergleich</h4>
        <div class="sm-h2h__triple">
          <div><strong>${Number(s.homeWins || 0)}</strong><span>${home}</span></div>
          <div><strong>${Number(s.draws || 0)}</strong><span>Remis</span></div>
          <div><strong>${Number(s.awayWins || 0)}</strong><span>${away}</span></div>
        </div>
        ${meetings.length ? `<div class="sm-h2h__meetings">${meetings.map(m => `
          <div class="sm-h2h__meeting">
            <time>${formatDate(m.date)}</time>
            <span>${esc(m.home)} <b>${m.result ? `${m.result.home}:${m.result.away}` : "–"}</b> ${esc(m.away)}</span>
          </div>`).join("")}</div>` :
          '<p class="sm-h2h__muted">Noch keine direkten Duelle vorhanden.</p>'}
      </section>`;
  }

  function formModule(entry, game) {
    const form = entry?.modules?.form;
    if (!form?.available) return "";

    const detail = side => {
      const r = side?.record;
      if (!r || !Number(r.played || 0)) return "";
      return `<small>${Number(r.won || 0)} S · ${Number(r.draw || 0)} U · ${Number(r.lost || 0)} N · ${Number(r.goalsFor || 0)}:${Number(r.goalsAgainst || 0)} Tore</small>`;
    };

    return `
      <section class="sm-h2h__section">
        <h4>Aktuelle Form</h4>
        <div class="sm-h2h__duo">
          <div><span>${esc(game.heim || "Heim")}</span>${formHtml(form.home?.values)}${detail(form.home)}</div>
          <div><span>${esc(game.auswaerts || "Gast")}</span>${formHtml(form.away?.values)}${detail(form.away)}</div>
        </div>
      </section>`;
  }

  function tableModule(entry, game) {
    const table = entry?.modules?.table;
    if (!table?.available) return "";

    const played = data => Number(
      data?.played ?? data?.matches ?? data?.games ?? data?.matchesPlayed ?? 0
    );

    // Vor dem ersten Ligaspiel ist eine Platzierung bei 0 Punkten ohne Aussagewert.
    if (played(table.home) < 1 || played(table.away) < 1) return "";

    const row = (label, data) => data?.available
      ? `<div><span>${esc(label)}</span><strong>#${Number(data.position || 0)}</strong><small>${Number(data.points || 0)} Pkt. · ${played(data)} Sp.</small></div>`
      : "";
    return `
      <section class="sm-h2h__section">
        <h4>Tabellenlage</h4>
        <div class="sm-h2h__duo sm-h2h__duo--table">
          ${row(game.heim || "Heim", table.home)}
          ${row(game.auswaerts || "Gast", table.away)}
        </div>
      </section>`;
  }

  function recordText(r) {
    if (!r?.available) return "Noch keine Daten";
    return `${r.played} Sp. · ${r.won} S · ${r.draw} U · ${r.lost} N · ${r.goalsFor}:${r.goalsAgainst}`;
  }

  function homeAwayModule(entry, game) {
    const m = entry?.modules?.homeAway;
    if (!m?.available) return "";
    return `
      <section class="sm-h2h__section">
        <h4>Heim / Auswärts</h4>
        <div class="sm-h2h__duo">
          <div><span>${esc(game.heim || "Heim")} zuhause</span><strong>${esc(recordText(m.home))}</strong></div>
          <div><span>${esc(game.auswaerts || "Gast")} auswärts</span><strong>${esc(recordText(m.away))}</strong></div>
        </div>
      </section>`;
  }

  function contentFor(entry, game) {
    if (!entry) {
      const supported = ["bundesliga", "2-bundesliga"].includes(game.wettbewerb);
      return supported
        ? `<p class="sm-h2h__state">H2H-Daten werden vorbereitet.</p>`
        : `<p class="sm-h2h__state">Für dieses Spiel sind keine H2H-Daten verfügbar.</p>`;
    }
    if (entry.status === "retry") return `<p class="sm-h2h__state">H2H-Daten werden vorbereitet.</p>`;
    if (entry.status !== "ready") return `<p class="sm-h2h__state">Für dieses Spiel sind keine H2H-Daten verfügbar.</p>`;

    const modules = [
      h2hModule(entry, game),
      formModule(entry, game),
      tableModule(entry, game),
      homeAwayModule(entry, game)
    ].filter(Boolean).join("");

    return modules || `<p class="sm-h2h__state">Für dieses Spiel sind keine H2H-Daten verfügbar.</p>`;
  }

  let modal, modalBody, modalTitle, modalClose, lastFocus;

  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "sm-h2h-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="sm-h2h-modal__backdrop" data-h2h-close></div>
      <section class="sm-h2h-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="sm-h2h-title">
        <button class="sm-h2h-modal__close" type="button" aria-label="Match-Check schließen" data-h2h-close>×</button>
        <header class="sm-h2h-modal__head">
          <span>Match-Check</span>
          <strong id="sm-h2h-title"></strong>
        </header>
        <div class="sm-h2h-modal__body"></div>
      </section>`;
    document.body.appendChild(modal);
    modalBody = modal.querySelector(".sm-h2h-modal__body");
    modalTitle = modal.querySelector("#sm-h2h-title");
    modalClose = modal.querySelector(".sm-h2h-modal__close");

    const close = () => {
      modal.hidden = true;
      document.documentElement.classList.remove("sm-h2h-modal-open");
      lastFocus?.focus?.();
    };
    modal.querySelectorAll("[data-h2h-close]").forEach(el => el.addEventListener("click", close));
    document.addEventListener("keydown", e => {
      if (!modal.hidden && e.key === "Escape") close();
    });
  }

  async function openModal(game, trigger) {
    ensureModal();
    lastFocus = trigger || document.activeElement;
    modalTitle.textContent = `${game.heim || "Heim"} – ${game.auswaerts || "Gast"}`;
    modalBody.innerHTML = `<p class="sm-h2h__state">H2H-Daten werden geladen …</p>`;
    modal.hidden = false;
    document.documentElement.classList.add("sm-h2h-modal-open");
    modalClose.focus();

    const snapshot = await loadSnapshot();
    modalBody.innerHTML = contentFor(findSnapshotEntry(snapshot, game), game);
  }

  function normText(value) {
    return safe(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "");
  }

  function normCompetition(value) {
    const v = normText(value);
    if (v === "bl" || v.includes("bundesliga") && !v.includes("2")) return "bundesliga";
    if (v === "bl2" || v.includes("2bundesliga") || v.includes("zweitebundesliga")) return "2bundesliga";
    return v;
  }

  function kickoffMs(value) {
    if (!value) return NaN;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? NaN : d.getTime();
  }

  function findSnapshotEntry(snapshot, game) {
    const entries = snapshot?.entries || {};

    // 1. Exakte interne ID bleibt der bevorzugte und billigste Weg.
    if (game?.id && entries[game.id]) return entries[game.id];

    const values = Object.values(entries);
    if (!values.length) return null;

    // 2. Falls der Snapshot seine gameId im Objekt trägt.
    if (game?.id) {
      const byEmbeddedId = values.find(entry => entry?.gameId === game.id);
      if (byEmbeddedId) return byEmbeddedId;
    }

    // 3. Robuster Fallback: Teams + Wettbewerb + Anstoßzeit.
    const home = normText(game?.heim);
    const away = normText(game?.auswaerts);
    const competition = normCompetition(game?.wettbewerb);
    const gameKickoff = kickoffMs(game?.beginn || game?.anpfiff || game?.datum);

    const candidates = values.filter(entry => {
      const eHome = normText(entry?.openLiga?.["Heimteamname"] || entry?.heim || entry?.home);
      const eAway = normText(entry?.openLiga?.["Auswärtsteamname"] || entry?.auswaerts || entry?.away);
      if (!home || !away || eHome !== home || eAway !== away) return false;

      const eCompetition = normCompetition(entry?.Wettbewerb || entry?.wettbewerb);
      if (competition && eCompetition && competition !== eCompetition) return false;

      return true;
    });

    if (!candidates.length) return null;
    if (candidates.length === 1) return candidates[0];

    // Bei mehreren gleichnamigen Paarungen entscheidet die Anstoßzeit.
    if (Number.isFinite(gameKickoff)) {
      const exactTime = candidates.find(entry => {
        const eKickoff = kickoffMs(entry?.Beginn || entry?.beginn);
        return Number.isFinite(eKickoff) && Math.abs(eKickoff - gameKickoff) <= 5 * 60 * 1000;
      });
      if (exactTime) return exactTime;
    }

    // Keine unsichere Zuordnung: lieber keine Daten als Daten eines falschen Spiels.
    return null;
  }

  function attach(row, game) {
    if (!row || !game?.id) return;
    row.classList.add("sm-event-row--details");
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", row.getAttribute("tabindex") || "0");
    row.setAttribute("aria-haspopup", "dialog");

    const open = event => {
      if (event?.target?.closest?.("a")) return;
      event?.preventDefault?.();
      openModal(game, row);
    };

    row.addEventListener("click", open);
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") open(event);
    });
  }

  window.OSCH2HPanel = Object.freeze({ attach, loadSnapshot, openModal });
})();