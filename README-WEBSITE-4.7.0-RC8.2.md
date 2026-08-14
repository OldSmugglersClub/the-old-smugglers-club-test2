# Website 4.7.0-RC8.2-TEST

## Ziel
RC8.2 prüft und stabilisiert die Startseitenkachel „Unsere Wettbewerbe“ einschließlich ihrer Wettbewerbsseiten und dynamischen Unterbereiche.

## Änderungen
- Dynamische Footer-Version auf allen acht Wettbewerbsseiten über `datenregister.json` → `VERSION.txt`.
- Veraltete statische Version `4.4.14` entfernt.
- Smuggleraufträge: veränderliche Gegner-, Termin-, Ergebnis- und Statusangaben aus der redaktionellen JSON entfernt.
- Zentrale Spielplananzeige in `wettbewerb.js` bleibt alleinige Quelle für konkrete Begegnungen.
- Verbindliche Punkteregel unverändert: 2 Punkte Tendenz, 3 Punkte Remis ohne exaktes Ergebnis, 3 Punkte richtige Tordifferenz, 5 Punkte exaktes Ergebnis.

## Unverändert
Grid, Kachelgrößen, Navigation, Grundlayout, Berechnungslogik und Datenmodell.

## Test
Alle neun Startseiten-Unterkacheln öffnen. Auf den acht Wettbewerbsseiten Footer, Rücknavigation, Kicktipp-Link, dynamische Bereiche und Leerzustände prüfen.
