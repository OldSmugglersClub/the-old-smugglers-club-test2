import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source=fs.readFileSync(new URL("../../schedule-timeline.js",import.meta.url),"utf8");
const context={window:{},Date,Set,Map,Object,String,Number,Boolean,Array};
vm.createContext(context); vm.runInContext(source,context);
const T=context.window.OSCScheduleTimeline;
const mk=(id,date,time,status="terminiert",confirmed=true)=>({id,datum:date,datumVon:date,datumBis:date,anstoss:time,status,terminBestaetigt:confirmed,heim:id+" H",auswaerts:id+" A"});
const games=[
 mk("bl","2026-08-28","20:30"),
 mk("sma","2026-08-29","13:00"),
 mk("cl","2026-09-15","21:00"),
 mk("el","2027-03-11","18:45"),
 mk("dfb","2026-12-01","20:45"),
 mk("pk","2026-10-25","15:00"),
 mk("wr","2026-12-26","16:00"),
 mk("rel","2027-05-27","20:30"),
 {...mk("postponed","2026-09-01","20:30","verlegt",false),datumVon:"2026-09-01",datumBis:"2026-09-30"}
];
const types=["bundesliga","smugglerauftrag","champions-league","europa-league","dfb-pokal","piratenkodex","weihnachtsregatta","relegation","bundesliga"];
const matchdays=games.map((g,i)=>({nummer:i+1,name:types[i],typ:types[i],aktiv:true,spielIds:[g.id]}));
const map=new Map(games.map(g=>[g.id,g]));
const result=T.build({matchdays,resolveGames:m=>m.spielIds.map(id=>map.get(id)),resolveTeamName:(_,x)=>x,liveMinutesDefault:120});
assert.equal(result.exact.length,8);
assert.equal(result.announced.length,1);
assert.equal(result.exact[0].id,"bl");
assert.equal(result.exact[1].id,"sma");
assert.equal(result.announced[0].id,"postponed");
assert.equal(T.hasExactKickoff({...mk("x","2026-09-01","20:30"),status:"verlegt"}),false);

// Same ID after reschedule is exactly one event at the new date.
map.set("sma",mk("sma","2026-09-02","19:00"));
const moved=T.build({matchdays,resolveGames:m=>m.spielIds.map(id=>map.get(id)),resolveTeamName:(_,x)=>x,liveMinutesDefault:120});
assert.equal(moved.exact.filter(x=>x.id==="sma").length,1);
assert.equal(moved.exact.find(x=>x.id==="sma").datum,"2026-09-02");
console.log("TIMELINE_TEST_OK");
