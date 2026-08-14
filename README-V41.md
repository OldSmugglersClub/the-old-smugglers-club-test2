# Version 2.41 – Zentrale Wettbewerbsregistrierung

Diese Version beginnt die vereinbarte Vereinheitlichung der Datenstruktur.

## Neue zentrale Datei

`wettbewerbe.json` enthält für alle Wettbewerbsseiten:

- Anzeigename
- HTML-Zielseite
- Filtertyp
- Filterschlüssel für `spieldaten.json`
- Titel der jeweiligen Spielübersicht

Dadurch werden Navigation und Zuordnung nicht mehr auf mehreren Seiten separat gepflegt. Die individuellen Wettbewerbs-JSON-Dateien bleiben für Beschreibungstexte, Statushinweise und Schaltflächen bestehen.
