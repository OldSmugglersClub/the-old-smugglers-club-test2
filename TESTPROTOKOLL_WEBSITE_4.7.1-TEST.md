# Testprotokoll – Website 4.7.1-TEST

## Automatisch geprüft
- Alle acht Wettbewerbs-JSON-Dateien sind syntaktisch gültig.
- `aktuellerStandTitel` und `aktuellerStand` sind in allen acht Wettbewerbsdateien leer; der bestehende Renderer blendet die Projektinformationsbox deshalb vollständig aus.
- JavaScript-Syntax geprüft: `wettbewerb.js`, `highscore.js`, `highscore-data-adapter.js`.
- HTML-Parserprüfung bestanden: `highscore.html`, `hall-of-fame.html`, `weihnachtsregatta.html`, `champions-league.html`.
- Keine Änderung an Punkte-, Highscore-, Hall-of-Fame- oder Wettbewerbslogik.
- Keine Änderung an Grid, Navigation oder Grundlayout.

## CSS-Prüfpunkte
- Wettbewerbsüberschriften: keine Wortzerlegung, keine Silbentrennung, kleinere mobile Skalierung.
- Highscore: kontrollierte mobile Schriftgrößen; keine Wortzerlegung in Kennzahlenkarten.
- Hall of Fame: kontrolliertes Stapeln der Zeilen auf sehr schmalen Displays.

## Lokale Abnahme durch Nutzer erforderlich
- iPhone: Weihnachtsregatta-Überschrift vollständig und sauber umgebrochen.
- iPhone: Highscore, Saison gesamt und Gleichstand ohne Trennung innerhalb des Wortes.
- iPhone: Hall-of-Fame-Titel und Namen ohne unkontrollierte Worttrennung.
- Alle Wettbewerbsseiten: kein Kasten „Aktueller Stand“ mehr sichtbar.
