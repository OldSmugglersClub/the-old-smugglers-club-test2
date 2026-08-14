# Version 2.42 – Zentrales Datenregister

Diese Version führt `datenregister.json` als gemeinsame Quelle für die Dateipfade der Website ein.

## Zentral registrierte Quellen

- Wettbewerbsregister
- Spiel- und Teamdaten
- Tippspieltage
- Highscore
- Hall of Fame
- Clubdaten
- Saisonübersicht
- Spieltagskonfiguration
- Bundesliga-Tabelle

`datenregister.js` lädt das Register einmalig und stellt allen Modulen dieselben Pfade bereit. Bei einem Ladefehler bleiben sichere Rückfallpfade aktiv. Das sichtbare Grundlayout wurde nicht verändert.
