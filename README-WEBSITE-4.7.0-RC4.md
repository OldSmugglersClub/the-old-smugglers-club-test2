# Website 4.7.0-RC4-TEST

## Zweck
RC4 integriert die bestehende Spieltagskachel in die zentrale Datenarchitektur der Website 4.7.0.

## Datenfluss
`website-view.json` → `schedule-data-adapter.js` → bestehende Spieltagskachel

Fehlt der `schedule`-Block, verwendet der Adapter unverändert die 4.6.1-Dateien als Rückfallquelle.

## Testfall
- Freitag: Smugglerauftrag und Bundesliga-Auftakt
- Samstag: mehrere parallele Bundesligaspiele, davon drei live
- Sonntag: weitere Spiele
- Schmugglersiegel werden über die vorhandenen Team-IDs aufgelöst
- Highscore bleibt im bestätigten Nullstand
