(function(){
  'use strict';

  const byId=id=>document.getElementById(id);
  const number=value=>Number(value||0);
  const format=(value,digits=0)=>number(value).toLocaleString('de-DE',{
    minimumFractionDigits:digits,
    maximumFractionDigits:digits
  });
  const nameOf=row=>row?.name||row?.team||'–';
  const totalOf=row=>number(row?.totalPoints??row?.points??row?.punkte);
  const averageOf=row=>number(row?.averagePoints??row?.durchschnitt??row?.totalPoints);
  const set=(id,value)=>{const node=byId(id);if(node)node.textContent=value;};

  function overallIndividuals(data){
    return data?.overall?.individual||data?.individual?.overall||[];
  }

  function overallTeams(data){
    return data?.overall?.team||data?.teams?.overall||[];
  }

  function competitions(data){
    return data?.competitions||data?.wettbewerbe||{};
  }

  function currentMatchday(data){
    const entries=Object.values(competitions(data)).filter(item=>item&&typeof item==='object');
    const withLeader=entries.filter(item=>item.matchdayLeader||item.spieltagLeader);
    const withLabel=entries.filter(item=>item.matchdayLabel||item.spieltagLabel);
    const withRows=entries.filter(item=>Array.isArray(item.matchday)&&item.matchday.length);
    const item=withLeader.at(-1)||withLabel.at(-1)||withRows.at(-1)||null;
    const label=data?.meta?.matchday||data?.meta?.lastMatchday||item?.matchdayLabel||item?.spieltagLabel||'Aktueller Spieltag';
    const rows=item?.matchday||[];
    const declared=item?.matchdayLeader||item?.spieltagLeader||null;
    const leader=declared||rows.find(row=>totalOf(row)>0)||null;
    const leaders=rows.filter(row=>Number(row?.rank??row?.platz)===1);
    return {label,leader,leaders};
  }

  function renderIndividuals(data){
    const rows=overallIndividuals(data);
    const leader=rows.find(row=>totalOf(row)>0)||null;
    set('hs-leader-name',leader?nameOf(leader):'Saisonstart');
    set('hs-leader-points',leader?`${format(totalOf(leader))} Punkte`:'Alle starten bei 0 Punkten');
  }

  function compactMatchdayLabel(label){
    return String(label||'Aktueller Spieltag')
      .replace(/(\d+)\.\s*Spieltag/gi,'$1.\u00a0Spieltag');
  }

  function renderMatchday(data){
    const matchday=currentMatchday(data);
    set('hs-matchday-name',compactMatchdayLabel(matchday.label));
    if(matchday.leaders.length>1){
      const points=totalOf(matchday.leaders[0]);
      set('hs-matchday-winner',`${matchday.leaders.length} Spieltagsbeste · je ${format(points)} Punkte`);
      return;
    }
    set('hs-matchday-winner',matchday.leader?`${nameOf(matchday.leader)} · ${format(totalOf(matchday.leader))} Punkte`:'Noch ohne Wertung');
  }

  function renderTeams(data){
    const teams=overallTeams(data);
    const oldTeam=teams.find(team=>/old\s*smugglers/i.test(nameOf(team)));
    const newTeam=teams.find(team=>/new\s*smugglers/i.test(nameOf(team)));
    const oldAverage=averageOf(oldTeam);
    const newAverage=averageOf(newTeam);
    const label=oldAverage===newAverage?'Gleichstand':oldAverage>newAverage?'Old Smugglers':'New Smugglers';
    set('hs-team-leader',label);
    set('hs-team-points',`${format(oldAverage,2)} : ${format(newAverage,2)} Punkte`);
  }

  async function init(){
    try{
      const data=await window.OSCHighscoreDataAdapter.loadHighscore();
      renderIndividuals(data);
      renderMatchday(data);
      renderTeams(data);
    }catch(error){
      console.warn('Highscore konnte nicht geladen werden.',error);
    }
  }

  init();
})();
