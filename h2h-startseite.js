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

  async function loadSnapshot() {
    if (!snapshotPromise) {
      snapshotPromise = fetch("./h2h-spieldaten.json", { cache:"no-store" })
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .catch(() => ({ schemaVersion:1, entries:{} }));
    }
    return snapshotPromise;
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
    const home = esc(game.heim || game.heimName || "Heim");
    const away = esc(game.auswaerts || game.auswaertsName || "Gast");
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
          '<p class="sm-h2h__muted">Noch keine direkten Duelle in OpenLigaDB vorhanden.</p>'}
      </section>`;
  }

  function formModule(entry, game) {
    const form = entry?.modules?.form;
    if (!form?.available) return "";
    return `
      <section class="sm-h2h__section">
        <h4>Aktuelle Form</h4>
        <div class="sm-h2h__duo">
          <div><span>${esc(game.heim || "Heim")}</span>${formHtml(form.home?.values)}</div>
          <div><span>${esc(game.auswaerts || "Gast")}</span>${formHtml(form.away?.values)}</div>
        </div>
      </section>`;
  }

  function tableModule(entry, game) {
    const table = entry?.modules?.table;
    if (!table?.available) return "";
    const row = (label, data) => data?.available
      ? `<div><span>${esc(label)}</span><strong>#${Number(data.position || 0)}</strong><small>${Number(data.points || 0)} Pkt.</small></div>`
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
        ? `<p class="sm-h2h__state">H2H-Daten werden noch geladen.</p>`
        : `<p class="sm-h2h__state">Für dieses Spiel sind keine H2H-Daten verfügbar.</p>`;
    }
    if (entry.status === "retry") return `<p class="sm-h2h__state">H2H-Daten werden noch geladen.</p>`;
    if (entry.status !== "ready") return `<p class="sm-h2h__state">Für dieses Spiel sind keine H2H-Daten verfügbar.</p>`;

    const modules = [
      h2hModule(entry, game),
      formModule(entry, game),
      tableModule(entry, game),
      homeAwayModule(entry, game)
    ].filter(Boolean).join("");

    return modules || `<p class="sm-h2h__state">Für dieses Spiel sind keine H2H-Daten verfügbar.</p>`;
  }

  async function attach(row, game, options = {}) {
    if (!row || !game?.id) return;
    row.classList.add("sm-event-row--details");
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", row.getAttribute("tabindex") || "0");
    row.setAttribute("aria-expanded", "false");

    const panel = document.createElement("section");
    panel.className = "sm-h2h";
    panel.hidden = true;
    panel.setAttribute("aria-label", `Match-Check ${game.heim || ""} gegen ${game.auswaerts || ""}`);

    const head = document.createElement("header");
    head.className = "sm-h2h__head";
    head.innerHTML = `<span>Match-Check</span><strong>${esc(game.heim || "Heim")} – ${esc(game.auswaerts || "Gast")}</strong>`;
    panel.appendChild(head);

    const body = document.createElement("div");
    body.className = "sm-h2h__body";
    body.innerHTML = `<p class="sm-h2h__state">H2H-Daten werden geladen …</p>`;
    panel.appendChild(body);

    if (game.ereignisLink) {
      const foot = document.createElement("footer");
      foot.className = "sm-h2h__foot";
      foot.innerHTML = `<a href="${esc(game.ereignisLink)}">Wettbewerb öffnen</a>`;
      panel.appendChild(foot);
    }

    row.insertAdjacentElement("afterend", panel);

    const toggle = async event => {
      if (event?.target?.closest?.("a")) return;
      event?.preventDefault?.();
      const open = panel.hidden;
      panel.hidden = !open;
      row.setAttribute("aria-expanded", String(open));
      if (open && !panel.dataset.loaded) {
        const snapshot = await loadSnapshot();
        body.innerHTML = contentFor(snapshot?.entries?.[game.id], game);
        panel.dataset.loaded = "true";
      }
    };

    row.addEventListener("click", toggle);
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") toggle(event);
    });
  }

  window.OSCH2HPanel = Object.freeze({ attach, loadSnapshot });
})();