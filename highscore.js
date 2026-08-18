const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number(v||0);const fmt=(v,d=0)=>num(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});const fmtMatchdayWins=v=>{const n=num(v);return Number.isInteger(n)?fmt(n):n.toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:2});};
const catalog=[['overall','Gesamtwertung'],['bundesliga','Bundesliga'],['champions-league','Champions League'],['europa-league','Europa League'],['dfb-pokal','DFB-Pokal'],['relegation','Relegation'],['piratenkodex','Piratenkodex'],['smugglerauftraege','Smuggleraufträge'],['weihnachtsregatta','Weihnachtsregatta']];
let source={};let scope='overall';let view='individual';let query='';let page=1;const pageSize=25;
const $=id=>document.getElementById(id);
function firstNonEmptyArray(...values){for(const value of values){if(Array.isArray(value)&&value.length)return value;}for(const value of values){if(Array.isArray(value))return value;}return [];}function normalizeLegacy(d){d=d||{};const overall=d.overall||{};d.overall={individual:firstNonEmptyArray(overall.individual,d.individual?.overall),team:firstNonEmptyArray(overall.team,d.gesamt?.team,d.teams?.overall,d.teamOverall),bonus:firstNonEmptyArray(overall.bonus,d.individual?.bonus)};d.competitions=d.competitions||d.wettbewerbe||{};return d;}
function current(){if(scope==='overall')return source.overall||{};return source.competitions?.[scope]||{id:scope,label:catalog.find(x=>x[0]===scope)?.[1]||scope,matchday:[],overall:[],team:[]};}
function views(){return scope==='overall'?[['individual','Gesamt-Einzelwertung'],['team','Gesamt-Teamwertung'],['bonus','Gesamt-Bonuswertung']]:[['matchday','Spieltagswertung'],['individual','Gesamtwertung'],['team','Spieltags-Teamwertung']];}
function rows(){const c=current();if(scope==='overall'){if(view==='team')return firstNonEmptyArray(c.team,source.teams?.overall,source.gesamt?.team,source.teamOverall);if(view==='bonus')return c.bonus||[];return c.individual||[];}if(view==='matchday')return c.matchday||[];if(view==='team')return c.team||[];return c.overall||[];}
function rowRank(r,i){return r.rank??r.platz??i+1;}function rowName(r){return r.name||r.teilnehmer||r.team||'–';}function rowPoints(r){if(view==='team')return r.averagePoints??r.durchschnitt??r.totalPoints??0;if(view==='bonus')return r.bonusPoints??r.points??0;if(view==='matchday')return r.points??r.punkte??0;return r.totalPoints??r.punkte??0;}
function allZero(list){return !list.length||list.every(r=>rowPoints(r)===0);}function sortedRows(list){const copy=[...(Array.isArray(list)?list:[])];if(allZero(copy))return copy.sort((a,b)=>rowName(a).localeCompare(rowName(b),'de',{sensitivity:'base'}));return copy;}
function renderTabs(){
 $('competition-tabs').innerHTML=catalog.map(([id,label])=>`<button class="hs-main-tab ${scope===id?'is-active':''}" data-scope="${id}" aria-pressed="${scope===id}">${esc(label)}</button>`).join('');
 const allowed=views();if(!allowed.some(x=>x[0]===view))view=allowed[0][0];
 $('view-tabs').innerHTML=allowed.map(([id,label])=>`<button class="hs-chip ${view===id?'is-active':''}" data-view="${id}" aria-pressed="${view===id}">${esc(label)}</button>`).join('');
 document.querySelectorAll('[data-scope]').forEach(b=>b.onclick=()=>{scope=b.dataset.scope;view=scope==='overall'?'individual':'matchday';query='';page=1;$('player-search').value='';render();});
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;query='';page=1;$('player-search').value='';render();});
}
function renderSummary(list){
 const c=current(),scopeLabel=scope==='overall'?'Saison gesamt':c.label||catalog.find(x=>x[0]===scope)?.[1]||scope;
 const viewLabel=views().find(x=>x[0]===view)?.[1]||view;
 $('summary-scope').textContent=scopeLabel;$('summary-view').textContent=viewLabel;
 const zero=allZero(list),leader=zero?null:list[0];
 const sharedLeaders=!zero&&view!=='team'&&view!=='bonus'?list.filter(r=>Number(rowRank(r,0))===1):[];
 const shared=sharedLeaders.length>1;
 $('summary-leader-label').textContent=view==='team'?'Führendes Team':view==='bonus'?'Bonusführer':shared?'Gemeinsam Führende':'Führender';
 $('summary-leader').textContent=shared?`${sharedLeaders.length} Spieler`:leader?rowName(leader):'Noch offen';
 $('summary-leader-points').textContent=shared?`je ${fmt(rowPoints(sharedLeaders[0]))} Punkte`:leader?`${fmt(rowPoints(leader),view==='team'?1:0)} Punkte`:'Noch ohne Wertung';
 const teams=(scope==='overall'?source.overall?.team:c.team)||[];
 const old=teams.find(x=>/old/i.test(rowName(x))),neu=teams.find(x=>/new/i.test(rowName(x)));
 const a=num(old?.averagePoints??old?.durchschnitt??old?.totalPoints),b=num(neu?.averagePoints??neu?.durchschnitt??neu?.totalPoints);
 $('summary-team-label').textContent=scope==='overall'?'Saison-Teamduell':'Teamduell';
 $('summary-team').textContent=a===b?'Gleichstand':a>b?'Old Smugglers':'New Smugglers';
 $('summary-team-points').textContent=`${fmt(a,2)} : ${fmt(b,2)} Punkte`;
 const count=view==='team'?list.length:(source.meta?.participantCount||source.overall?.individual?.length||list.length);
 $('summary-count-label').textContent=view==='team'?'Teams':'Teilnehmer';
 $('summary-participants').textContent=String(count);
 $('summary-count-subtitle').textContent=view==='team'?'im direkten Vergleich':'aktive Smuggler';
}
function podiumCard(r,pos,zero){
 const isTeam=view==='team';
 const score=isTeam?fmt(rowPoints(r),1):fmt(rowPoints(r));
 const scoreLabel=isTeam?'Ø Punkte':'Punkte';
 const detailLine=zero?'Noch ohne Wertung':isTeam?`${fmt(r.pointsSum??r.punktesumme??r.totalPoints??0,1)} gesamt · ${num(r.memberCount??r.mitglieder)} Mitglieder`:view==='bonus'?'Bonuswertung':'Aktueller Rang';
 return `<article class="hs-podium-card place-${pos}" aria-label="Platz ${pos}: ${esc(rowName(r))}, ${score} ${scoreLabel}">
   <div class="hs-rank-seal" aria-hidden="true"><span>${zero?'–':pos}</span></div>
   <div class="hs-podium-nameplate"><strong>${esc(rowName(r))}</strong></div>
   <div class="hs-podium-score"><b>${score}</b><span>${scoreLabel}</span></div>
   <small>${detailLine}</small>
   <div class="hs-pedestal-face" aria-hidden="true"><span>${zero?'–':pos}</span></div>
 </article>`;
}
function leaderCard(r){
 const score=fmt(rowPoints(r));
 return `<article class="hs-leader-card" aria-label="Gemeinsam Rang 1: ${esc(rowName(r))}, ${score} Punkte">
   <div class="hs-leader-seal" aria-hidden="true"><span>1</span></div>
   <strong>${esc(rowName(r))}</strong>
   <span>${score} Punkte</span>
 </article>`;
}
function renderPodium(list){
 const podium=$('podium');
 const zero=allZero(list);
 if(zero){
   podium.className='hs-podium hs-podium--empty';
   podium.innerHTML='<div class="hs-podium-empty-state"><strong>Das Führungsdeck ist noch unbesetzt.</strong><span>Nach der ersten bestätigten Wertung erscheint hier die aktuelle Spitze.</span></div>';
   $('ranking-notice').textContent='Noch keine Wertung. Die vollständige Rangliste bleibt zur Kontrolle alphabetisch sichtbar.';
   return;
 }
 const sharedLeaders=view!=='team'&&view!=='bonus'?list.filter(r=>Number(rowRank(r,0))===1):[];
 if(sharedLeaders.length>1){
   podium.className='hs-podium hs-podium--shared';
   podium.innerHTML=`<div class="hs-deck-banner"><span>Das Führungsdeck</span><strong>${sharedLeaders.length} Freibeuter teilen sich Rang 1</strong><small>je ${fmt(rowPoints(sharedLeaders[0]))} Punkte</small></div><div class="hs-leader-grid">${sharedLeaders.map(leaderCard).join('')}</div>`;
   $('ranking-notice').textContent='Alle gemeinsam Führenden werden gleichwertig dargestellt. Die Rangfolge im Führungsdeck verändert die offizielle Wertung nicht.';
   return;
 }
 const top=list.slice(0,3);
 podium.className='hs-podium hs-podium--classic';
 podium.innerHTML=top.length?`<div class="hs-deck-banner"><span>Das Führungsdeck</span><small>Die aktuelle Spitze der Highscore</small></div>${top.map((r,i)=>podiumCard(r,i+1,false)).join('')}<div class="hs-podium-deck" aria-hidden="true"><span></span></div>`:'<p class="hs-empty">Noch keine Daten vorhanden.</p>';
 $('ranking-notice').textContent='Die offizielle Rangfolge aus dem Datenpaket wird unverändert angezeigt.';
}
function paginationHtml(total){const pages=Math.max(1,Math.ceil(total/pageSize));page=Math.min(Math.max(1,page),pages);if(total<=pageSize)return '';const nums=Array.from({length:pages},(_,i)=>i+1).map(n=>`<button class="hs-page-btn ${n===page?'is-active':''}" type="button" data-page="${n}" aria-label="Seite ${n}" aria-current="${n===page?'page':'false'}">${n}</button>`).join('');return `<nav class="hs-pagination" aria-label="Ranglistenseiten"><button class="hs-page-btn" type="button" data-page="${page-1}" ${page===1?'disabled':''}>Zurück</button><span>Einträge ${(page-1)*pageSize+1}–${Math.min(page*pageSize,total)} von ${total}</span><div class="hs-page-numbers">${nums}</div><button class="hs-page-btn" type="button" data-page="${page+1}" ${page===pages?'disabled':''}>Weiter</button></nav>`;}
function bindPagination(){document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.page)||1;renderTable(rows());$('table-panel').scrollIntoView({behavior:'smooth',block:'start'});});}
function renderTable(list){const team=view==='team';const bonus=view==='bonus';const tableWrap=$('ranking-body').closest('.hs-table-wrap');if(tableWrap){tableWrap.classList.toggle('is-team-table',team);tableWrap.classList.toggle('is-individual-table',view==='individual');tableWrap.classList.toggle('is-matchday-table',view==='matchday');tableWrap.classList.toggle('is-bonus-table',bonus);}$('search-box').hidden=false;const searchLabel=$('search-box').querySelector('span');if(searchLabel)searchLabel.textContent=team?'Team suchen':'Spieler suchen';let base=sortedRows(list);let filtered=base.filter(r=>rowName(r).toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de')));const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,pages);const shown=team?filtered:filtered.slice((page-1)*pageSize,page*pageSize);$('toolbar-count').textContent=`${filtered.length} ${team?'Teams':'Spieler'}`;$('ranking-head').innerHTML=team?'<tr><th>Rang</th><th>Team</th><th>Mitglieder</th><th>Punktesumme</th><th>Durchschnitt</th></tr>':bonus?'<tr><th>Rang</th><th>Spieler</th><th>Bonuspunkte</th></tr>':view==='matchday'?'<tr><th>Rang</th><th>Spieler</th><th>Punkte</th><th>Exakt</th><th>Differenz</th><th>Tendenz</th></tr>':'<tr><th>Rang</th><th>Spieler</th><th>Bonuspunkte</th><th>Spieltagsiege</th><th>Gesamtpunkte</th></tr>';
 $('ranking-body').innerHTML=shown.map((r,i)=>{const absoluteIndex=team?i:(page-1)*pageSize+i;return team?`<tr><td>${esc(rowRank(r,absoluteIndex))}</td><td>${esc(rowName(r))}</td><td>${num(r.memberCount??r.mitglieder)}</td><td>${fmt(r.pointsSum??r.punktesumme??0,1)}</td><td>${fmt(rowPoints(r),1)}</td></tr>`:bonus?`<tr><td>${esc(rowRank(r,absoluteIndex))}</td><td>${esc(rowName(r))}</td><td>${fmt(rowPoints(r))}</td></tr>`:view==='matchday'?`<tr><td>${esc(rowRank(r,absoluteIndex))}</td><td>${esc(rowName(r))}</td><td>${fmt(rowPoints(r))}</td><td>${fmt(r.exactHits??r.exakt)}</td><td>${fmt(r.differenceHits??r.differenz)}</td><td>${fmt(r.tendencyHits??r.tendenz)}</td></tr>`:`<tr><td>${esc(rowRank(r,absoluteIndex))}</td><td>${esc(rowName(r))}</td><td>${fmt(r.bonusPoints)}</td><td>${fmtMatchdayWins(r.matchdayWins)}</td><td>${fmt(rowPoints(r))}</td></tr>`}).join('')||'<tr><td colspan="6">Keine passenden Einträge.</td></tr>';const nav=team?'':paginationHtml(filtered.length);$('pagination-top').innerHTML=nav;$('pagination-bottom').innerHTML=nav;const labels=team?['Rang','Team','Mitglieder','Punktesumme','Durchschnitt']:bonus?['Rang','Spieler','Bonuspunkte']:view==='matchday'?['Rang','Spieler','Punkte','Exakt','Differenz','Tendenz']:['Rang','Spieler','Bonus','S','Punkte'];$('ranking-body').querySelectorAll('tr').forEach(tr=>tr.querySelectorAll('td').forEach((td,index)=>{if(labels[index])td.dataset.label=labels[index];}));bindPagination();}
function render(){renderTabs();const list=sortedRows(rows());const c=current(),scopeLabel=scope==='overall'?'Saison gesamt':c.label||catalog.find(x=>x[0]===scope)?.[1]||scope,viewLabel=views().find(x=>x[0]===view)?.[1]||view;const displayTitle=scope==='overall'?viewLabel:`${scopeLabel} · ${viewLabel}`;$('ranking-title').textContent=displayTitle;$('table-title').textContent=displayTitle;$('ranking-caption').textContent=scope!=='overall'&&(view==='matchday'||view==='team')?(c.matchdayLabel||'Aktueller Spieltag'):'Aktueller bestätigter Datenstand';$('toolbar-scope').textContent=scopeLabel;$('toolbar-view').textContent=viewLabel;renderSummary(list);renderPodium(list);renderTable(list);const diag=source.adapterDiagnostics||{};const missingTeams=scope==='overall'&&view==='team'&&list.length===0;const warning=diag.warning||(missingTeams?'Für diese Auswahl sind derzeit keine vollständigen Teamdaten verfügbar.':'');$('hs-system-status').className=warning?'hs-system-status is-error':'hs-system-status is-ready';$('hs-system-status').innerHTML=`<strong>${warning?'Daten nicht vollständig':'Daten geladen'}</strong><span>${warning?esc(warning):'Aktuelle Ranglisten verfügbar.'}</span>`;}
$('player-search').addEventListener('input',e=>{query=e.target.value;page=1;renderTable(rows());});
window.OSCHighscoreDataAdapter.loadHighscore().then(d=>{source=normalizeLegacy(d);render();}).catch(e=>{$('hs-system-status').className='hs-system-status is-error';$('hs-system-status').innerHTML=`<strong>Highscore nicht verfügbar</strong><span>${esc(e.message)}</span>`;});
