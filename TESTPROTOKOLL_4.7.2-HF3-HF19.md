# TESTPROTOKOLL – Website 4.7.2-HF3-HF19

## Interne statische Prüfung
- JavaScript-Syntax: bestanden (`node --check highscore.js`).
- Änderungen auf Highscore-Komponente begrenzt.
- Keine Änderung an `grid-template` außerhalb der Highscore-Datei.
- Kein Eingriff in Rangsortierung, Punkteberechnung oder Datenadapter.
- Gleichstandslogik: ab 2 gemeinsam Führenden wird ausschließlich das Gleichstands-Führungsdeck gerendert.
- Eindeutiger Spitzenreiter: klassische Top-3-Darstellung bleibt datengetrieben.
- Cache-Busting für `highscore.css` und `highscore.js` auf HF19 gesetzt.

## Noch erforderlich
- Visuelle Abnahme im Testrepository Desktop und Mobile.
