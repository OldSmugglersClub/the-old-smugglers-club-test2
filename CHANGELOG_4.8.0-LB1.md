# Website 4.8.0-LB1 – Spieltags-Logbuch

Basis: produktive Website 4.8.0.

## Neu
- Hauptnavigation um `Logbuch` ergänzt.
- Eigene Startseiten-Kachel `Spieltags-Logbuch`.
- Eigene Seite `logbuch.html`.
- Dauerhafte Datenbasis `spieltag-logbuch.json`.
- Historische Einträge können auf der Logbuchseite ausgewählt werden.
- Startseiten-Kachel zeigt nur die wichtigsten Punkte des letzten Eintrags.
- Piratendesign aus bestehenden Komponenten/Assets; keine Änderung an Gridmaßen oder bestehenden Kachelgrößen.

## Daten
- Ausschließlich OSC-Tipp- und Wertungsdaten.
- Kein künstlicher Tie-Break bei gleichauf liegenden Spieltagsbesten.
- Teamduell wird über Durchschnittspunkte pro Teammitglied bewertet.
- Redaktionell fragwürdige Rangbewegungen können per `anzeigen=false` unterdrückt werden.

## Nicht geändert
- Counter.
- Spieltagskachel/Terminlogik.
- Highscore.
- Hall of Fame.
- Wettbewerbslogik.
