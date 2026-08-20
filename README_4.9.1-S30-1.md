# Website 4.9.1-S30-1 – Spieltag in 30 Sekunden

Diese Testversion basiert ausschließlich auf dem bestätigten Live-Stand Website 4.9.0.

## Zweck
„Spieltag in 30 Sekunden“ verdichtet den neuesten abgeschlossenen Logbuch-Spieltag auf maximal drei priorisierte, bereits freigegebene Highlights.

## Datenquelle
Ausschließlich `spieltag-logbuch.json`.

Regeln:
1. Nur der neueste abgeschlossene Logbuch-Eintrag.
2. Nur Highlights mit `anzeigen: true`.
3. Sortierung nach `prioritaet` absteigend.
4. Maximal drei Kurzmeldungen.
5. Keine eigene Wertungs-, Rang- oder Überraschungslogik auf der Website.
6. Nicht unterstützte zukünftige Typen werden ignoriert.

## Einspielung im Testrepository
Die unter ERSETZEN aufgeführten Dateien ersetzen. Die Dokumentationsdateien unter NEU zusätzlich ablegen.

Diese Version ist ein Teststand und noch kein bestätigter Live-Release.
