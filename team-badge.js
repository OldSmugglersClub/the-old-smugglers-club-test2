(() => {
  "use strict";

  const DEFAULT_REGISTER = "./assets/smugglers-design-system/schmugglersiegel/schmugglersiegel-register.json";
  const SVG_NS = "http://www.w3.org/2000/svg";
  let registerPromise = null;
  let register = { teams: {} };
  let sealCounter = 0;

  const fallbackInitials = (teamId, teamName) => {
    const ignored = new Set(["fc", "sc", "sv", "vfl", "vfb", "tsg", "1.", "04", "05", "09"]);
    const parts = String(teamName || teamId || "Team")
      .split(/[\s-]+/)
      .filter(Boolean)
      .filter(part => !ignored.has(part.toLowerCase()));
    return (parts.map(part => part[0]).join("").slice(0, 4) || "TEAM").toUpperCase();
  };

  const load = (url = DEFAULT_REGISTER) => {
    if (!registerPromise) {
      registerPromise = fetch(url, { cache: "no-store" })
        .then(response => {
          if (!response.ok) throw new Error(`Schmugglersiegel-Register konnte nicht geladen werden (${response.status})`);
          return response.json();
        })
        .then(data => {
          register = data && typeof data === "object" ? data : { teams: {} };
          return register;
        })
        .catch(error => {
          console.warn(error);
          register = { teams: {} };
          return register;
        });
    }
    return registerPromise;
  };

  const resolve = (teamId, teamName) => {
    const entry = register.teams?.[teamId] || null;
    return {
      teamId,
      name: entry?.name || teamName || "Team offen",
      initials: entry?.kuerzel || fallbackInitials(teamId, teamName),
      primary: entry?.primaerfarbe || "#5b3215",
      secondary: entry?.sekundaerfarbe || "#d6b15b"
    };
  };

  const svgElement = (name, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  };

  const createSeal = badge => {
    const uid = `osc-seal-${++sealCounter}`;
    const svg = svgElement("svg", {
      viewBox: "0 0 128 128",
      role: "img",
      "aria-label": `Schmugglersiegel ${badge.name}`,
      focusable: "false"
    });

    const defs = svgElement("defs");
    const metal = svgElement("radialGradient", { id: `${uid}-metal`, cx: "34%", cy: "26%", r: "82%" });
    [
      ["0", "#f7dda0"], [".28", "#c78a36"], [".68", "#7b4818"], ["1", "#291606"]
    ].forEach(([offset, color]) => metal.appendChild(svgElement("stop", { offset, "stop-color": color })));
    const enamel = svgElement("linearGradient", { id: `${uid}-enamel`, x1: "0", y1: "0", x2: "0", y2: "1" });
    enamel.append(
      svgElement("stop", { offset: "0", "stop-color": badge.primary }),
      svgElement("stop", { offset: ".55", "stop-color": badge.primary }),
      svgElement("stop", { offset: "1", "stop-color": "#241108" })
    );
    const shine = svgElement("radialGradient", { id: `${uid}-shine`, cx: "34%", cy: "22%", r: "75%" });
    shine.append(
      svgElement("stop", { offset: "0", "stop-color": "#ffffff", "stop-opacity": ".22" }),
      svgElement("stop", { offset: ".5", "stop-color": "#ffffff", "stop-opacity": "0" })
    );
    defs.append(metal, enamel, shine);
    svg.appendChild(defs);

    svg.append(
      svgElement("circle", { cx: 64, cy: 64, r: 60, fill: "#160b06" }),
      svgElement("circle", { cx: 64, cy: 64, r: 57, fill: `url(#${uid}-metal)`, stroke: "#f0cc7d", "stroke-width": 1 }),
      svgElement("circle", { cx: 64, cy: 64, r: 50, fill: "#211006", stroke: "#55300e", "stroke-width": 2 }),
      svgElement("circle", { cx: 64, cy: 64, r: 45, fill: `url(#${uid}-enamel)`, stroke: "#e8c879", "stroke-width": 2 }),
      svgElement("path", { d: "M24 43h80M24 85h80", stroke: badge.secondary, "stroke-width": 8, opacity: ".94" }),
      svgElement("circle", { cx: 64, cy: 64, r: 38, fill: badge.primary, "fill-opacity": ".96", stroke: "#2a140a", "stroke-width": 2.4 }),
      svgElement("path", { d: "M55 31h18M64 23v16M59 28l5-5 5 5", fill: "none", stroke: badge.secondary, "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".62" })
    );

    const text = svgElement("text", {
      x: 64, y: 75, "text-anchor": "middle", fill: badge.secondary,
      stroke: "#2a140a", "stroke-width": 1.45, "paint-order": "stroke",
      "font-family": "Georgia, Times New Roman, serif",
      "font-size": badge.initials.length >= 4 ? 22 : badge.initials.length === 3 ? 29 : 34,
      "font-weight": 700,
      "letter-spacing": badge.initials.length >= 4 ? "-1.5" : "-1"
    });
    text.textContent = badge.initials;
    svg.appendChild(text);

    svg.append(
      svgElement("path", { d: "M59 94c0 3 2 5 5 5s5-2 5-5M64 84v15M58 89h12", fill: "none", stroke: badge.secondary, "stroke-width": 2, "stroke-linecap": "round", opacity: ".62" }),
      svgElement("circle", { cx: 64, cy: 64, r: 45, fill: `url(#${uid}-shine)` })
    );

    const rivets = svgElement("g", { fill: "#40250d", stroke: "#f0c978", "stroke-width": 1 });
    [[64,8],[104,24],[120,64],[104,104],[64,120],[24,104],[8,64],[24,24]].forEach(([cx,cy]) => {
      rivets.appendChild(svgElement("circle", { cx, cy, r: 3 }));
    });
    svg.appendChild(rivets);
    return svg;
  };

  const render = (element, teamId, teamName, options = {}) => {
    if (!element) return;
    const badge = resolve(teamId, teamName);
    element.replaceChildren(createSeal(badge));
    element.setAttribute("aria-label", options.ariaLabel || `Schmugglersiegel ${badge.name}`);
  };

  window.OSCTeamBadge = Object.freeze({ load, resolve, render, fallbackInitials });
})();
