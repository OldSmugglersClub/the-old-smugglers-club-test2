# CHANGELOG – Website 4.9.0-RC2

Basis: 4.9.0-RC1. RC1-Inline-Darstellung verworfen.

## Darstellung
- Match-Check öffnet als eigenständiges Piraten-Modal über der Website.
- Startseiten-Spieltagskachel verändert ihre Höhe/Matrix nicht mehr.
- Desktop: großes zentriertes Detailfenster.
- Mobile: nahezu bildschirmfüllend mit eigenem Scrollbereich.
- Schließen per X, Hintergrundklick oder Escape.

## Ladeverhalten
- `h2h-spieldaten.json` wird direkt beim Laden der Startseite lokal vorgeladen.
- Der Browser fragt OpenLigaDB weiterhin niemals direkt ab.
- Regel bleibt: Spiele innerhalb der nächsten 7 Tage werden vorgeladen.
- Zusätzlich wird, falls im 7-Tage-Fenster noch kein Spiel liegt, das aktuell nächste bestätigte Spiel bis maximal 14 Tage einmalig vorgeladen.
  Dadurch kann der aktuell sichtbare nächste Spieltermin bereits H2H-Daten erhalten.
- Fertige Daten werden nicht fortlaufend neu abgefragt; nur der vereinbarte optionale letzte Refresh vor Anpfiff bleibt.

## Unverändert
- Termin-, Counter-, Ergebnis- und Tippverteilungslogik.
- Highscore.
- globales Grid.
