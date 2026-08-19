(() => {
"use strict";
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let data=null;

function shown(entry){return (entry?.highlights||[]).filter(h=>h?.anzeigen===true)}
function highlight(entry,type){return shown(entry).find(h=>h.typ===type)}
function shortNames(rows,max=8){
 const names=(rows||[]).map(x=>x.teilnehmer).filter(Boolean);
 return names.slice(0,max).map(n=>`<span class="lb-name">${esc(n)}</span>`).join("")+
   (names.length>max?`<span class="lb-name">+${names.length-max} weitere</span>`:"");
}
function outcomeLabel(v){return v==="1"?"Heimsieg":v==="2"?"Auswärtssieg":"Remis"}

function mainStory(entry){
 const against=highlight(entry,"gegen-den-strom");
 const caps=highlight(entry,"kapitaene");
 if(against){
   const d=against.daten||{};
   return `<span class="logbook-kicker">Gegen den Strom</span><h3>${esc(entry.bezeichnung||"Spieltags-Logbuch")}</h3>
   <p>Die meistgetippte Richtung (${esc(outcomeLabel(d.meistGetippt?.ausgang))}, ${Number(d.meistGetippt?.anzahl||0)} Tipps) lag daneben. 
   Der richtige Ausgang war ${esc(outcomeLabel(d.richtigerAusgang))}; ${Number(d.exakt||0)} Tipper trafen sogar das Ergebnis ${esc(d.ergebnis||"")} exakt.</p>`;
 }
 if(caps){
   const d=caps.daten||{};
   return `<span class="logbook-kicker">Kapitäne des Spieltags</span><h3>${esc(entry.bezeichnung||"Spieltags-Logbuch")}</h3>
   <p>${Number(d.anzahl||0)} Tipper erreichten gemeinsam die höchste Spieltagsbeute von <strong>${Number(d.punkte||0)} Punkten</strong>. Kein künstlicher Tie-Break.</p>`;
 }
 return `<span class="logbook-kicker">Spieltags-Logbuch</span><h3>${esc(entry.bezeichnung||"Noch ohne Eintrag")}</h3><p>Für diesen Spieltag liegen noch keine veröffentlichungsfähigen Geschichten vor.</p>`;
}

function renderTeaser(entry){
 const box=$("#logbook-teaser-copy"); if(!box) return;
 if(!entry){box.innerHTML='<span class="logbook-kicker">Noch kein Eintrag</span><h3>Das Logbuch wartet auf den ersten abgeschlossenen Spieltag.</h3>';return}
 box.innerHTML=mainStory(entry);
 const side=$("#logbook-teaser-stats");
 if(side){
   const caps=highlight(entry,"kapitaene")?.daten;
   const comb=highlight(entry,"zahlen-aus-der-kombuese")?.daten;
   const crew=highlight(entry,"crewduell")?.daten;
   side.innerHTML=[
    ["Beste Spieltagsbeute",caps?`${Number(caps.punkte||0)} Punkte`:"–"],
    ["Exakte Treffer",comb?String(Number(comb.exakt||0)):"–"],
    ["Crewduell",crew?.sieger?esc(crew.sieger.replace(" Team","")):"–"]
   ].map(([a,b])=>`<div class="logbook-mini-stat"><span>${a}</span><strong>${b}</strong></div>`).join("");
 }
}

function renderHighlight(h){
 const d=h.daten||{};
 if(h.typ==="kapitaene") return `<article class="lb-highlight"><h3>Kapitäne des Spieltags</h3><p><strong>${Number(d.anzahl||0)} Tipper</strong> teilen sich mit ${Number(d.punkte||0)} Punkten die beste Spieltagsleistung.</p><div class="lb-names">${shortNames(d.tipper)}</div></article>`;
 if(h.typ==="gegen-den-strom") return `<article class="lb-highlight lb-highlight--hero"><h3>Gegen den Strom</h3><p>Die größte Tippgruppe setzte auf <strong>${esc(outcomeLabel(d.meistGetippt?.ausgang))}</strong> (${Number(d.meistGetippt?.anzahl||0)} Tipps) und lag falsch. Richtig war <strong>${esc(outcomeLabel(d.richtigerAusgang))}</strong>; ${Number(d.exakt||0)} Tipper trafen ${esc(d.ergebnis||"")} exakt.</p><div class="lb-scoreline"><div><strong>${Number(d.tippverteilung?.["1"]||0)}</strong><span>Heimsieg</span></div><div><strong>${Number(d.tippverteilung?.X||0)}</strong><span>Remis</span></div><div><strong>${Number(d.tippverteilung?.["2"]||0)}</strong><span>Auswärtssieg</span></div></div></article>`;
 if(h.typ==="volltreffer") return `<article class="lb-highlight"><h3>Volltreffer</h3><p>Die stärksten Präzisionstreffer: <strong>${Number(d.maxExakt||0)} exakt</strong> im Spieltag.</p><div class="lb-names">${shortNames(d.tipper)}</div></article>`;
 if(h.typ==="crewduell"){
   const teams=d.teams||[]; const a=teams[0],b=teams[1];
   return `<article class="lb-highlight"><h3>Crewduell</h3><p><strong>${esc(d.sieger||"Gleichstand")}</strong> führt nach Durchschnittspunkten.</p>${a&&b?`<div class="lb-scoreline"><div><strong>${Number(a.durchschnitt||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><span>${esc(a.team)}</span></div><div><strong>:</strong><span>Ø Punkte</span></div><div><strong>${Number(b.durchschnitt||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><span>${esc(b.team)}</span></div></div>`:""}</article>`;
 }
 if(h.typ==="kursbewegung") return `<article class="lb-highlight"><h3>Kursbewegung</h3><p>Größter Sprung: <strong>+${Number(d.maxGewinn||0)} Plätze</strong>. Größter Verlust: <strong>${Number(d.maxVerlust||0)} Plätze</strong>.</p><div class="lb-names">${shortNames(d.gewinner,5)}</div></article>`;
 if(h.typ==="zahlen-aus-der-kombuese") return `<article class="lb-highlight"><h3>Zahlen aus der Kombüse</h3><p>${Number(d.abgegeben||0)} Abgaben · ${Number(d.nichtAbgegeben||0)} Nichtabgaben · ${Number(d.exakt||0)} exakt · ${Number(d.differenz||0)} Differenz · ${Number(d.tendenz||0)} Tendenz.</p></article>`;
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
   renderTeaser(latest); renderEntry(latest); archive();
   const st=$("#lb-status"); if(st) st.remove();
 }catch(e){
   const st=$("#lb-status"); if(st) st.textContent="Das Spieltags-Logbuch konnte nicht geladen werden.";
 }
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
})();