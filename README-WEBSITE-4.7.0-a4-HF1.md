# TOSMC Website 4.7.0-a4-HF1-TEST

Gezielter Hotfix für die Highscore-Kachel auf der Startseite.

## Änderung

- „Letzter Spieltag“ wurde zu „Aktueller Spieltag“.
- Die Beschriftung des Smugglerauftrags wird kompakt und umbruchstabil dargestellt.

## Nicht geändert

- Grid und Kachelgrößen
- Navigation und Grundlayout
- Datenadapter und Wertungslogik
- Highscore-Ranglistenlogbuch
- Hall of Fame

## Test

Auf der Startseite muss die mittlere Highscore-Karte anzeigen:

- `AKTUELLER SPIELTAG`
- `Smuggleraufträge · 1. Spieltag`
- `Noch ohne Wertung`

Die Zeichenfolge `1. Spieltag` darf nicht zwischen Zahl und Wort getrennt werden.
