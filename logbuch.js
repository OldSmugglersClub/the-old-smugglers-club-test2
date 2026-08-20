(() => {
"use strict";
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
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
function renderThirtySeconds(entry){
 const host=$("#logbook-30s"); if(!host) return;
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

function renderEntry(entry){
 const host=$("#lb-current"); if(!host) return;
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
   const entry=(data.logbuecher||[]).find(x=>x.id===b.dataset.logId); renderEntry(entry);
   host.querySelectorAll("button").forEach(x=>x.setAttribute("aria-current",String(x===b)));
 });
}
async function init(){
 try{
   const r=await fetch("./spieltag-logbuch.json",{cache:"no-store"}); if(!r.ok) throw Error(`HTTP ${r.status}`);
   data=await r.json(); const latest=(data.logbuecher||[]).at(-1)||null;
   renderThirtySeconds(latest); renderEntry(latest); archive();
   const st=$("#lb-status"); if(st) st.remove();
 }catch(e){
   const st=$("#lb-status"); if(st) st.textContent="Das Spieltags-Logbuch konnte nicht geladen werden.";
 }
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
})();