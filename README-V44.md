# Version 2.44 – Gemeinsames Datenmodell

Diese Version führt `datenmodell.js` als gemeinsame Ableitungsschicht ein. Wettbewerbe, Spiele, Teams und Tippspieltage werden einmal geladen, normalisiert und als konsistente Laufzeitdaten bereitgestellt.

## Änderungen
- Gemeinsamer Cache für zentrale Datenquellen.
- Einheitliche Wettbewerbszuordnung und Statussummen.
- Saisonübersicht und Wettbewerbsseiten nutzen dieselbe normalisierte Datenbasis.
- Rückfalllogik bleibt erhalten, falls einzelne JSON-Dateien fehlen.
- Keine Änderungen am freigegebenen Grundlayout.
