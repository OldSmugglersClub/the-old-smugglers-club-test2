# CHANGELOG 4.7.2-TEST2

## Korrektur
- GoatCounter-Einbindung auf den zwölf gezählten Inhaltsseiten von dynamischem `analytics.js` auf den dokumentierten direkten GoatCounter-Script-Tag umgestellt.
- `analytics.js` entfernt.

## Ursache / Befund
- TEST1: Navigation Desktop, Navigation Mobil und Stalk-O-Meter-Darstellung bestanden.
- GC-2 nicht bestanden: GoatCounter-Zähler blieb bei 0.
- `https://gc.zgo.at/count.js` war im selben Testbrowser direkt erreichbar.
- Deshalb wird die zusätzliche dynamische Einbindung als vermeidbare Fehlerquelle entfernt.

## Unverändert
- Navigation und deren bereits bestandene Darstellung.
- Stalk-O-Meter-Seite und Design.
- Zähllogik und zwölf Zielseiten.
- Datenschutztext.
- Grid, Kachelgrößen, Fachlogik und Admin Tool.
