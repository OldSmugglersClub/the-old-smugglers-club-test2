# CHANGELOG 4.7.2 FINAL

## Neu
- Neuer Hauptmenüpunkt `Stalk-O-Meter`.
- Neue öffentliche Unterseite `stalk-o-meter.html`.
- GoatCounter-Pageview-Erfassung auf zwölf definierten Inhaltsseiten.
- Öffentliche Einzelwerte und automatisch sortierte Rangliste.
- Fachliche Gesamtzahl als Summe der zwölf definierten Inhaltsseiten.
- Vollständige Architektur- und Handover-Dokumentation.

## Korrekturen aus den Tests
- TEST2: direkte, dokumentierte GoatCounter-Script-Einbindung statt dynamischem `analytics.js`.
- TEST3: Startseitenpfad im Stalk-O-Meter von `/` auf `/index.html` korrigiert.

## Nachgewiesen
- GoatCounter lädt und erkennt Seitenpfade korrekt.
- Trackingrequest wurde mit HTTP 200 bestätigt.
- Dashboard erfasst reale Aufrufe und Mehrfachaufrufe.
- Unterschiedliche Zielseiten werden getrennt erfasst.
- Desktop- und Mobilnavigation funktionieren.
- Stalk-O-Meter-Design entspricht dem bestehenden Unterseitenstil.

## Bekanntes Betriebsverhalten
Öffentliche GoatCounter-Counterwerte können gegenüber dem internen Dashboard zeitverzögert sein.
Dies betrifft ausschließlich die Aktualität der sichtbaren Statistik, nicht die Erfassung der Pageviews.

## Unverändert
- Grid und Kachelgrößen.
- Grundlayout.
- Highscore-/Ranglistenlogik.
- Hall-of-Fame-/Ehrenlogik.
- Wettbewerbs- und Saisonlogik.
- Admin Tool.
