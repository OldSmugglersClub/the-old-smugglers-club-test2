(function(){
  "use strict";

  const hasExactKickoff = game =>
    Boolean(game && game.terminBestaetigt === true &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(game.datum || "")) &&
      /^\d{2}:\d{2}$/.test(String(game.anstoss || "")));

  const makeLocalDate = (date, time) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date||"")) || !/^\d{2}:\d{2}$/.test(String(time||""))) return null;
    const [y,m,d]=date.split("-").map(Number), [hh,mm]=time.split(":").map(Number);
    const value=new Date(y,m-1,d,hh,mm,0,0);
    return Number.isNaN(value.getTime()) ? null : value;
  };

  function build({matchdays=[], resolveGames, resolveTeamName, liveMinutesDefault=120}){
    const exact=[], announced=[];
    matchdays.filter(md=>md && md.aktiv!==false).forEach(md=>{
      const games=resolveGames(md);
      games.forEach((raw,index)=>{
        const game={...raw,
          heim:resolveTeamName(raw.heimTeamId,raw.heim),
          auswaerts:resolveTeamName(raw.auswaertsTeamId,raw.auswaerts),
          matchdayName:md.name || `Tippspieltag ${md.nummer}`,
          matchdayNumber:md.nummer,
          matchdayType:md.typ || "",
          _index:index
        };
        if(hasExactKickoff(game)){
          const start=makeLocalDate(game.datum,game.anstoss);
          const liveMinutes=Math.max(1,Number(game.liveDauerMinuten)||liveMinutesDefault);
          exact.push({...game,_exact:true,_start:start,_end:new Date(start.getTime()+liveMinutes*60000)});
        }else{
          const from=String(game.datumVon||game.datum||"");
          const until=String(game.datumBis||game.datumVon||game.datum||"");
          announced.push({...game,_exact:false,_dateFrom:from,_dateUntil:until});
        }
      });
    });
    exact.sort((a,b)=>a._start-b._start || a._index-b._index);
    announced.sort((a,b)=>String(a._dateFrom).localeCompare(String(b._dateFrom)) || a._index-b._index);
    return {exact,announced};
  }

  function activeAndNext(exact,now){
    const live=exact.filter(e=>e._start<=now && e._end>now);
    const next=exact.find(e=>e._start>now) || null;
    return {live,next,focus:live[0]||next};
  }

  function windowEvents(exact,now,days=7){
    const end=new Date(now.getTime()+Math.max(1,days)*86400000);
    return exact.filter(e=>e._end>now && e._start<=end);
  }

  window.OSCScheduleTimeline=Object.freeze({hasExactKickoff,build,activeAndNext,windowEvents});
})();