# CHANGELOG – Website 4.7.2-HF3-HF7

## Highscore – Kicktipp-Rangfolge
- Bei laufender Wertung wird die Reihenfolge des vom Admin gelieferten Datenpakets unverändert angezeigt.
- Die frühere zusätzliche alphabetische Sortierung innerhalb gemeinsamer Ränge wurde entfernt.
- Beim vollständigen Nullstand bleibt die alphabetische Kontrollanzeige bestehen.

## Spieltagssiege „S“
- Dezimalwerte werden variabel dargestellt.
- Beispiele:
  - `0` -> `0`
  - `1` -> `1`
  - `0.01` -> `0,01`
  - `1.25` -> `1,25`
- Ganze Werte erhalten keine künstlichen Nachkommastellen.

## Verifizierter E2E-Test
- gemeinsame Spitzengruppe weiterhin Rang 1
- offizielle Kicktipp-/Admin-Reihenfolge sichtbar: Manuel -> kleinersachse -> xIMMOx -> HandGottes -> ...
- `S = 0,01` sichtbar
- Gesamtpunkte und Bonuspunkte unverändert
- Tabellen-/Pagination-Grundlayout unverändert

## Technischer Umfang dieser Releaseänderung
- Fachcode: `highscore.js`
- keine Änderung an Grid, Kachelgrößen, Navigation oder Grundlayout
