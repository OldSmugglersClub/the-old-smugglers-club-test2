(() => {
"use strict";
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const arr=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??"").trim().toLowerCase();
let data=null;

function shown(entry){return (entry?.highlights||[]).filter(h=>h?.anzeigen===true)}
function highlight(entry,type){return shown(entry).find(h=>h.typ===type)}

function summaryHighlights(entry,max=3){
 return shown(entry)
  .filter(h=>Number.isFinite(Number(h?.prioritaet)))
  .sort((a,b)=>Number(b.prioritaet)-Number(a.prioritaet))
  .slice(0,max);
}
function summaryText(h){
 const d=h?.daten||{};
 if(h.typ==="kapitaene") return `${Number(d.anzahl||0)} Tipper teilen sich die beste Beute mit ${Number(d.punkte||0)} Punkten.`;
 if(h.typ==="gegen-den-strom") return `Die größte Tippgruppe lag mit ${outcomeLabel(d.meistGetippt?.ausgang)} daneben. Richtig war ${outcomeLabel(d.richtigerAusgang)}; ${Number(d.exakt||0)} trafen ${d.ergebnis||"das Ergebnis"} exakt.`;
 if(h.typ==="volltreffer") return `${Number(d.anzahl||0)} Tipper erreichten die höchste Präzision mit ${Number(d.maxExakt||0)} exakten Treffern.`;
 if(h.typ==="crewduell") return d.sieger?`${d.sieger} liegt im Crewduell nach Durchschnittspunkten vorn.`:"Im Crewduell herrscht Gleichstand.";
 if(h.typ==="kursbewegung") return `Größter Sprung: +${Number(d.maxGewinn||0)} Plätze; größter Verlust: ${Number(d.maxVerlust||0)} Plätze.`;
 if(h.typ==="zahlen-aus-der-kombuese") return `${Number(d.abgegeben||0)} Abgaben, ${Number(d.exakt||0)} exakte Treffer und ${Number(d.differenz||0)} Differenztreffer.`;
 return "";
}
function summaryTitle(type){
 return ({
  "kapitaene":"Kapitäne",
  "gegen-den-strom":"Gegen den Strom",
  "volltreffer":"Volltreffer",
  "crewduell":"Crewduell",
  "kursbewegung":"Kursbewegung",
  "zahlen-aus-der-kombuese":"Zahlen aus der Kombüse"
 })[type]||"Logbuch";
}
function renderThirtySeconds(entry,pending){
 const host=$("#logbook-30s"); if(!host) return;
 if(pending?.active){
  host.innerHTML=`<div class="logbook-30s-pending"><span class="logbook-kicker">${esc(pending.kicker)}</span><strong>${esc(pending.title)}</strong><p>${esc(pending.text)}</p>${pending.detail?`<small>${esc(pending.detail)}</small>`:""}</div>`;
  return;
 }
 if(!entry){
  host.innerHTML='<div class="logbook-30s-empty">Noch kein abgeschlossener Spieltag für die Kurzfassung vorhanden.</div>';
  return;
 }
 const picks=summaryHighlights(entry,3).filter(h=>summaryText(h));
 if(!picks.length){
  host.innerHTML='<div class="logbook-30s-empty">Für diesen Spieltag liegen noch keine freigegebenen Kurzmeldungen vor.</div>';
  return;
 }
 host.innerHTML=`<div class="logbook-30s-head"><span class="logbook-kicker">${esc(entry.bezeichnung||entry.runde||"Letzter Spieltag")}</span><strong>Die drei wichtigsten Logbuch-Signale</strong></div><div class="logbook-30s-list">${picks.map(h=>`<article class="logbook-30s-item"><span>${esc(summaryTitle(h.typ))}</span><p>${esc(summaryText(h))}</p></article>`).join("")}</div>`;
}

function shortNames(rows,max=8){
 const names=(rows||[]).map(x=>x.teilnehmer).filter(Boolean);
 return names.slice(0,max).map(n=>`<span class="lb-name">${esc(n)}</span>`).join("")+
   (names.length>max?`<span class="lb-name">+${names.length-max} weitere</span>`:"");
}
function outcomeLabel(v){return v==="1"?"Heimsieg":v==="2"?"Auswärtssieg":"Remis"}

function renderHighlight(h){
 const d=h.daten||{};
 if(h.typ==="kapitaene") return `<article class="lb-highlight lb-highlight--wide lb-highlight--captains"><h3>Kapitäne des Spieltags</h3><p><strong>${Number(d.anzahl||0)} Tipper</strong> teilen sich mit ${Number(d.punkte||0)} Punkten die beste Spieltagsleistung.</p><div class="lb-names">${shortNames(d.tipper)}</div></article>`;
 if(h.typ==="gegen-den-strom") return `<article class="lb-highlight lb-highlight--hero"><h3>Gegen den Strom</h3><p>Die größte Tippgruppe setzte auf <strong>${esc(outcomeLabel(d.meistGetippt?.ausgang))}</strong> (${Number(d.meistGetippt?.anzahl||0)} Tipps) und lag falsch. Richtig war <strong>${esc(outcomeLabel(d.richtigerAusgang))}</strong>; ${Number(d.exakt||0)} Tipper trafen ${esc(d.ergebnis||"")} exakt.</p><div class="lb-scoreline"><div><strong>${Number(d.tippverteilung?.["1"]||0)}</strong><span>Heimsieg</span></div><div><strong>${Number(d.tippverteilung?.X||0)}</strong><span>Remis</span></div><div><strong>${Number(d.tippverteilung?.["2"]||0)}</strong><span>Auswärtssieg</span></div></div></article>`;
 if(h.typ==="volltreffer") return `<article class="lb-highlight lb-highlight--volltreffer"><h3>Volltreffer</h3><p>Die stärksten Präzisionstreffer: <strong>${Number(d.maxExakt||0)} exakt</strong> im Spieltag.</p><div class="lb-names">${shortNames(d.tipper)}</div></article>`;
 if(h.typ==="crewduell"){
   const teams=d.teams||[]; const a=teams[0],b=teams[1];
   return `<article class="lb-highlight lb-highlight--crew"><h3>Crewduell</h3><p><strong>${esc(d.sieger||"Gleichstand")}</strong> führt nach Durchschnittspunkten.</p>${a&&b?`<div class="lb-crewline"><div><span>${esc(a.team)}</span><strong>${Number(a.durchschnitt||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div><div class="lb-crew-vs">gegen</div><div><span>${esc(b.team)}</span><strong>${Number(b.durchschnitt||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div></div>`:""}</article>`;
 }
 if(h.typ==="kursbewegung") return `<article class="lb-highlight"><h3>Kursbewegung</h3><p>Größter Sprung: <strong>+${Number(d.maxGewinn||0)} Plätze</strong>. Größter Verlust: <strong>${Number(d.maxVerlust||0)} Plätze</strong>.</p><div class="lb-names">${shortNames(d.gewinner,5)}</div></article>`;
 if(h.typ==="zahlen-aus-der-kombuese") return `<article class="lb-highlight lb-highlight--wide lb-highlight--galley"><h3>Zahlen aus der Kombüse</h3><div class="lb-galley-grid"><div><strong>${Number(d.abgegeben||0)}</strong><span>Abgaben</span></div><div><strong>${Number(d.nichtAbgegeben||0)}</strong><span>Nichtabgaben</span></div><div><strong>${Number(d.exakt||0)}</strong><span>Exakt</span></div><div><strong>${Number(d.differenz||0)}</strong><span>Differenz</span></div><div><strong>${Number(d.tendenz||0)}</strong><span>Tendenz</span></div></div></article>`;
 return "";
}

function renderEntry(entry,pending){
 const host=$("#lb-current"); if(!host) return;
 if(pending?.active){
  host.innerHTML=`<section class="lb-entry lb-entry--pending"><header class="lb-entry-head"><span>${esc(pending.kicker)}</span><h2>${esc(pending.title)}</h2></header><div class="lb-pending-copy"><p>${esc(pending.text)}</p>${pending.detail?`<strong>${esc(pending.detail)}</strong>`:""}<small>Frühere abgeschlossene Logbücher bleiben unten im Archiv erreichbar.</small></div></section>`;
  document.title="Auswertung läuft | The Old Smugglers Club";
  return;
 }
 if(!entry){host.innerHTML='<div class="lb-status">Noch kein abgeschlossenes Logbuch vorhanden.</div>';return}
 host.innerHTML=`<section class="lb-entry"><header class="lb-entry-head"><span>${esc(entry.wettbewerb||"Spieltag")}</span><h2>${esc(entry.bezeichnung||entry.runde||"Logbuch")}</h2></header><div class="lb-highlight-grid">${shown(entry).map(renderHighlight).join("")}</div></section>`;
 document.title=`${entry.bezeichnung||"Logbuch"} | The Old Smugglers Club`;
}
function archive(){
 const host=$("#lb-archive-list"); if(!host) return;
 const logs=[...(data?.logbuecher||[])].reverse();
 host.innerHTML=logs.map((e,i)=>`<button type="button" data-log-id="${esc(e.id)}" aria-current="${i===0?"true":"false"}">${esc(e.runde||e.bezeichnung)}</button>`).join("");
 host.addEventListener("click",ev=>{
   const b=ev.target.closest("button[data-log-id]"); if(!b)return;
   const entry=(data.logbuecher||[]).find(x=>x.id===b.dataset.logId); renderEntry(entry,null);
   host.querySelectorAll("button").forEach(x=>x.setAttribute("aria-current",String(x===b)));
 });
}

async function fetchJson(path){
 try{const r=await fetch(path,{cache:"no-store"});if(!r.ok)return null;return await r.json()}catch(_){return null}
}
function flattenGames(doc){return arr(doc?.saisons).flatMap(s=>arr(s.spiele)).concat(arr(doc?.spiele))}
function activeMatchdays(doc){
 const seasons=arr(doc?.saisons);const active=seasons.find(s=>s?.aktiv===true)||seasons.find(s=>s?.id===doc?.aktiveSaison)||seasons[0];
 return arr(active?.tippspieltage).filter(md=>md?.aktiv!==false);
}
function gameStart(game){
 if(!game?.terminBestaetigt||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(game.datum||""))||!/^[0-9]{2}:[0-9]{2}$/.test(String(game.anstoss||"")))return null;
 if(new Set(["verlegt","abgesagt","ausgefallen","termin-offen","offen"]).has(norm(game.status)))return null;
 const [y,m,d]=game.datum.split("-").map(Number),[hh,mm]=game.anstoss.split(":").map(Number);const dt=new Date(y,m-1,d,hh,mm,0,0);
 return Number.isNaN(dt.getTime())?null:dt;
}
function resolveGames(md,games){
 const byId=new Map(games.map(g=>[g.id,g]));
 if(arr(md?.spielIds).length)return md.spielIds.map(id=>byId.get(id)).filter(Boolean);
 const sel=md?.spielAuswahl||{};
 return games.filter(g=>{
  if(sel.wettbewerb&&g.wettbewerb!==sel.wettbewerb)return false;
  if(sel.spieltagNummer!=null&&Number(g.spieltagNummer)!==Number(sel.spieltagNummer))return false;
  if(sel.runde&&norm(g.runde)!==norm(sel.runde))return false;
  if(sel.teamId&&g.heimTeamId!==sel.teamId&&g.auswaertsTeamId!==sel.teamId)return false;
  return Boolean(sel.wettbewerb||sel.spieltagNummer!=null||sel.runde||sel.teamId);
 });
}
function logCoversGames(logs,games){
 const ids=games.map(g=>g?.id).filter(Boolean);if(!ids.length)return false;
 return logs.some(log=>{const set=new Set(arr(log?.spielIds));return ids.every(id=>set.has(id))});
}
function labelType(v){
 const n=norm(v);
 if(n==="bundesliga")return "Bundesliga";
 if(n==="champions-league")return "Champions League";
 if(n==="europa-league")return "Europa League";
 if(n==="dfb-pokal")return "DFB-Pokal";
 if(n==="smugglerauftrag"||n==="smugglerauftraege")return "Smugglerauftrag";
 if(n==="piratenkodex")return "Piratenkodex";
 if(n==="relegation")return "Relegation";
 return String(v||"Tippspieltag");
}
function descriptor(md,games){
 const starts=games.map(gameStart).filter(Boolean).sort((a,b)=>a-b);
 return {md,games,start:starts[0]||null,label:md?.name||`${labelType(md?.typ)} ${md?.nummer||""}`.trim()};
}
function pendingFromSchedule(logs,matchdayDoc,gameDoc,now){
 const games=flattenGames(gameDoc);if(!games.length)return [];
 return activeMatchdays(matchdayDoc).map(md=>descriptor(md,resolveGames(md,games))).filter(x=>x.start&&x.start<=now&&!logCoversGames(logs,x.games)).sort((a,b)=>a.start-b.start);
}
function explicitRunning(view){
 const b=view?.anzeige?.laufenderWertungsblock;
 if(!b||b.aktiv!==true)return null;
 const label=[labelType(b.wertung),b.runde].filter(Boolean).join(" · ");
 const ended=Number(b.beendet),total=Number(b.gesamt);
 return {label:label||"Aktueller Tippspieltag",detail:Number.isFinite(ended)&&Number.isFinite(total)&&total>0?`${ended} von ${total} Spielen abgeschlossen`:""};
}
function buildPending(view,matchdayDoc,gameDoc,logs){
 const explicit=explicitRunning(view);
 const now=new Date();
 const scheduled=pendingFromSchedule(logs,matchdayDoc,gameDoc,now);
 const names=[];
 if(explicit?.label)names.push(explicit.label);
 scheduled.forEach(x=>{if(!names.some(n=>norm(n)===norm(x.label)))names.push(x.label)});
 if(!names.length)return {active:false};
 const title="Die Beute wird noch gezählt";
 const text=names.length>1
  ?"Mehrere Tippspieltage haben bereits begonnen. Die alten Spieltagswerte bleiben verborgen, bis die betroffenen Wertungsblöcke vollständig ausgewertet sind."
  :"Der aktuelle Tippspieltag hat bereits begonnen. Die alten Spieltagswerte bleiben verborgen, bis der Wertungsblock vollständig ausgewertet ist.";
 const detail=explicit?.detail||(names.length?names.join(" · "):"");
 return {active:true,kicker:"Neuer Wertungsblock läuft",title,text,detail};
}

async function init(){
 try{
   const [logDoc,view,matchdays,games]=await Promise.all([
     fetchJson("./spieltag-logbuch.json"),fetchJson("./website-view.json"),fetchJson("./tippspieltage.json"),fetchJson("./spieldaten.json")
   ]);
   if(!logDoc)throw Error("spieltag-logbuch.json nicht erreichbar");
   data=logDoc; const latest=(data.logbuecher||[]).at(-1)||null;
   const pending=buildPending(view,matchdays,games,arr(data.logbuecher));
   renderThirtySeconds(latest,pending); renderEntry(latest,pending); archive();
   const st=$("#lb-status"); if(st) st.remove();
 }catch(e){
   const st=$("#lb-status"); if(st) st.textContent="Das Spieltags-Logbuch konnte nicht geladen werden.";
 }
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
})();
