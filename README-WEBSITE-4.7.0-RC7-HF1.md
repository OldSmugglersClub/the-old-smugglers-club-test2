# Website 4.7.0-RC7-HF1-TEST

## Zweck
Robuste Korrektur der Versionsanzeige im Footer der Saisonübersicht.

## Änderung
Die Seite `saison-2026-2027.html` enthält keine fest eingetragene Versionsnummer mehr. `saisonuebersicht.js` lädt die aktive Version über `datenregister.js` aus `VERSION.txt`.

## Test
1. Saisonübersicht mit Strg + F5 neu laden.
2. Im Footer muss `Version 4.7.0-RC7-HF1-TEST` erscheinen.
3. Links, Saisonkennzahlen und Wettbewerbsstatus müssen unverändert bleiben.

## Rückfallverhalten
Kann `VERSION.txt` nicht geladen werden, zeigt der Footer `Version nicht verfügbar`. Eine alte Versionsnummer wird nicht mehr angezeigt.
