# CHANGELOG – Website 4.9.1-S30-3

## Laufender Wertungsblock: keine veraltete Spieltagsauswertung

- `Spieltags-Logbuch` und `Spieltag in 30 Sekunden` zeigen nach Beginn eines neuen Tippspieltags keine abgeschlossene Auswertung des vorherigen Wertungsblocks mehr als aktuellen Inhalt.
- Bei einem vom Admin erzeugten Teilstand wird `website-view.json -> anzeige.laufenderWertungsblock` ausgewertet; vorhandene Fortschrittsangaben wie `1 von 9 Spielen abgeschlossen` werden angezeigt.
- Zusätzlich erkennt die Website gestartete, aber noch nicht im Logbuch abgeschlossene Tippspieltage selbst aus `tippspieltage.json` und `spieldaten.json`.
- Dadurch funktioniert der Schutz auch dann, wenn der Admin erst nach einem kompletten Wochenende arbeitet und niemals ein Teilabschluss erzeugt wurde.
- Bei mehreren inzwischen begonnenen, noch nicht ausgewerteten Events wird ein gemeinsamer Wartestatus angezeigt; alte Spieltagswerte bleiben verborgen.
- Frühere abgeschlossene Logbücher bleiben ausschließlich im eindeutig bezeichneten Archiv erreichbar.
- Bestehende Ergebnis-, Tabellen-, Schedule- und OpenLigaDB-Automatiken werden nicht verändert.
- Die verworfene frühere `LIVE`-Anzeige wird nicht wieder eingeführt.
