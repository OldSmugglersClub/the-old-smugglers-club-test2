import fs from "node:fs";
import assert from "node:assert";
import path from "node:path";

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),"../..");
const s=fs.readFileSync(path.join(root,"scripts/dynamo-terminimport-core.mjs"),"utf8");

assert(s.includes("const hasLocalWindow="));
assert(s.includes("hasLocalWindow && !dateInWindow"));
assert(s.includes('reason:"OpenLigaDB-Datum außerhalb des lokalen Spieltagfensters"'));
assert(s.includes("const now=new Date();"));
assert(s.includes("matched.size !== 34"));
assert(s.includes('reason: "lokal bereits beendet/mit Ergebnis"'));
console.log("HF15_DYNAMO_TERMINAUTOMATIK_OK");
