import fs from "node:fs";

export const SNAPSHOT_PATH = process.env.OSC_TERMINSTAND_PATH || "schedule-terminstand.json";
const FIELDS=["datum","datumVon","datumBis","anstoss","status","terminBestaetigt","quelleStand"];

export function extractConfirmedSchedule(data){
  const games=(data?.saisons||[]).flatMap(s=>Array.isArray(s.spiele)?s.spiele:[]);
  const entries={};
  for(const g of games){
    if(!g?.id || g.terminBestaetigt!==true || !g.datum || !g.anstoss) continue;
    entries[g.id]=Object.fromEntries(FIELDS.filter(k=>g[k]!==undefined).map(k=>[k,g[k]]));
  }
  return {schemaVersion:1,updatedAt:new Date().toISOString(),entries};
}

export function writeScheduleSnapshot(data,path=SNAPSHOT_PATH){
  const current=fs.existsSync(path)?JSON.parse(fs.readFileSync(path,"utf8")):{schemaVersion:1,updatedAt:null,entries:{}};
  const fresh=extractConfirmedSchedule(data);

  // ID-stabile Persistenz:
  // - bestätigte aktuelle Werte derselben Spiel-ID ersetzen ältere Snapshot-Werte (Verlegung/Nachholtermin);
  // - fehlt ein Spiel im aktuellen Export oder fällt auf unbestätigt zurück, bleibt der letzte bestätigte Wert erhalten.
  const mergedEntries={...(current.entries||{}),...fresh.entries};

  // Stable comparison: updatedAt itself must never create a false-positive repository change.
  const currentEntriesJson=JSON.stringify(current.entries||{});
  const mergedEntriesJson=JSON.stringify(mergedEntries);
  const changed=currentEntriesJson!==mergedEntriesJson;

  if(changed || !fs.existsSync(path)){
    const next={
      schemaVersion:1,
      updatedAt:new Date().toISOString(),
      entries:mergedEntries
    };
    fs.writeFileSync(path,JSON.stringify(next,null,2)+"\n","utf8");
  }

  return {
    entries:Object.keys(mergedEntries).length,
    changed
  };
}
