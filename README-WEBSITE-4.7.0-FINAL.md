# The Old Smugglers Club – Website 4.7.0 FINAL

## Freigegebener Produktionsstand

Diese Version basiert auf dem erfolgreich getesteten Stand `4.7.0-RC8.5-HF4-TEST`.

## Vor GitHub-Einspielung

1. Vollständiges Backup des aktuellen Repositorys erstellen.
2. Inhalt dieses Pakets in das Repository kopieren und vorhandene Dateien ersetzen.
3. GitHub Desktop öffnen und den Diff prüfen.
4. Commit: `Website 4.7.0 FINAL`
5. Push origin durchführen.
6. GitHub Pages abwarten und anschließend mit Strg+F5 prüfen.

## Produktionsbereinigung

- `VERSION.txt`: `4.7.0`
- simuliertes `schedule.testNow` entfernt
- Daten- und Adapterversionen auf `4.7.0` gesetzt

## Nachprüfung

- Startseite lädt ohne Testhinweis.
- Countdown verwendet die reale Systemzeit.
- Nächstes Event ist der Smugglerauftrag „Auftakt“ am 09.08.2026.
- Hall of Fame und Ehrenlogbuch zeigen die freigegebenen Titelstände.
- Wettbewerbsseiten und Footer zeigen Version 4.7.0.
