# The Old Smugglers Club – Version 30

## Sichtbare Neuerungen

- neuer Datenstatus auf der Startseite
- dynamischer Spieltagsbereich
- dynamische Bundesliga-Tabelle
- dynamische Topspieler-Karten
- dynamische Hall-of-Fame-Rekorde
- gemeinsame Gestaltung über `club-style.css`
- gemeinsame Datenlogik über `club-app.js`

## Datendateien

Alle Dateien liegen im selben Hauptverzeichnis wie `index.html`:

- `clubdaten.json`
- `spieltag.json`
- `bundesliga-tabelle.json`
- `topspieler.json`
- `systemstatus.json`

## Upload

Beim Wechsel auf Version 30 alle Dateien und Ordner aus diesem Paket hochladen.
Die bereits auf GitHub liegenden Bilddateien `banner.png`, `Hintergrund.jpeg`,
`logo.jpeg` und `favicon.jpeg` bleiben bestehen.

Nach dem Upload GitHub Pages kurz abwarten und die Seite mit `Strg+F5` laden.

## GitHub Actions

`.github/workflows/daten-pruefen.yml` prüft bei Änderungen, ob alle JSON-Dateien
syntaktisch korrekt sind. Die eigentliche Fußball-API wird im nächsten Schritt
an `scripts/update_data.py` angebunden.
