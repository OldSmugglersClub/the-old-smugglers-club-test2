# TOSMC Website 4.7.0-a4-TEST

## Zweck

Abschluss der technischen Integration der Highscore-Kachel auf der Startseite.

## Geändert

- `highscore-teaser.js`: Umstellung auf die durch `highscore-data-adapter.js` normalisierte Admin-6.2-Datenstruktur.
- `VERSION.txt`: Versionsstand 4.7.0-a4-TEST.
- `CHANGELOG.md`: Dokumentation des Entwicklungsstands.

## Erwartete Anzeige im Nullstand

- Einzelwertung: `Saisonstart` / `Alle starten bei 0 Punkten`
- Letzter Spieltag: `Smuggleraufträge 1. Spieltag` / `Noch ohne Wertung`
- Teamduell: `Gleichstand` / `0,0 : 0,0 Punkte`

## Erwartete Anzeige nach Wertungen

- Führender und Gesamtpunkte werden aus der saisonweiten Einzelwertung übernommen.
- Spieltagsname und Spieltagsführender werden aus dem aktuellen Wettbewerbsblock übernommen.
- Teamführer wird anhand des höheren arithmetischen Mittels bestimmt.
- Teamwerte werden stets in der Reihenfolge `Old Smugglers : New Smugglers` angezeigt.

## Unverändert

Grid, Kachelgrößen, Navigation, HTML-Struktur, Grundlayout, Design und Hall of Fame.
