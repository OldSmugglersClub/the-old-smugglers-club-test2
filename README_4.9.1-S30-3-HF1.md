# Website 4.9.1-S30-3-HF1

Dieser Hotfix betrifft ausschließlich die Darstellung noch nicht abgeschlossener OSC-Spieltagsauswertungen.

## Fachregel

Sobald ein neuer Kicktipp-Tippspieltag begonnen hat, dürfen `Spieltags-Logbuch` und `Spieltag in 30 Sekunden` die Auswertung des vorherigen Spieltags nicht länger als aktuellen Inhalt darstellen. Stattdessen erscheint ein neutraler Piratenstatus, bis der neue Wertungsblock vollständig ausgewertet wurde.

Die Erkennung besitzt zwei Ebenen:

1. Ein vorhandener Admin-Zwischenstand aus `website-view.json` hat Vorrang und kann den exakten Fortschritt liefern.
2. Auch ohne Zwischenstand erkennt die Website gestartete, noch nicht im Logbuch vorhandene Tippspieltage anhand von `tippspieltage.json` + `spieldaten.json`.

Damit bleibt der Ablauf auch bei verspäteter Sammelerfassung mehrerer Events funktionsfähig. Es besteht keine Pflicht, täglich oder nach jedem Teilspiel einen Zwischenstand zu erzeugen.

## Nicht geändert

- Grid, Kachelgrößen und Navigation
- Ergebnis- und Tabellenautomatiken
- OpenLigaDB-Anbindung
- Schedule-/Countdown-Logik
- Highscore-Berechnung
- Admin-Wertungslogik
- verworfene `LIVE`-Anzeige
