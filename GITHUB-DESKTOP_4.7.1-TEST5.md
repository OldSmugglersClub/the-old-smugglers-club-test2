# GitHub Desktop – Website 4.7.1-TEST5

## Summary
Website 4.7.1-TEST5: kumulative Besucherfehlerkorrekturen

## Description
- TEST3 vollständig enthalten; separates TEST3-Deployment nicht erforderlich
- TEST4 vollständig übernommen; TEST4 bleibt unveröffentlicht
- Mobile Header-Überdeckung beseitigt
- Worttrennung bei Weihnachtsregatta sowie Highscore-Namen auf Desktop und Mobil verhindert
- Interne „aktuell hinterlegt“-Hinweise aus Saisonübersicht entfernt
- DFB-Pokal als „Ab Achtelfinale“ vereinheitlicht
- Kicktipp gelb, interne Rücknavigation braun
- Hall-of-Fame-Hinweis mit Piratensymbol
- Keine Änderungen an Fachlogik oder Navigation

## Schritt für Schritt
1. Den festhängenden TEST3-Workflow in GitHub Actions kontrolliert abbrechen, bevor TEST5 eingespielt wird.
2. Keine weitere Wiederholung des TEST3-Workflows starten.
3. Das TEST5-Update-ZIP entpacken.
4. Ordner `DATEIEN_FUER_GITHUB` öffnen.
5. Alle enthaltenen Dateien in den Stammordner des lokalen GitHub-Repositories kopieren.
6. Vorhandene Dateien ersetzen bestätigen.
7. GitHub Desktop öffnen und das korrekte Repository sowie Branch `main` prüfen.
8. Kontrollieren, dass `index.html` als geänderte Datei erkannt wird. Sie enthält die kumulativen TEST3-Korrekturen.
9. Kontrollieren, dass nur die in der Dateiliste genannten Dateien geändert oder neu sind.
10. Obige Summary und Description verwenden.
11. `Commit to main` anklicken.
12. `Push origin` anklicken.
13. GitHub Actions öffnen und den neuen Pages-Lauf beobachten.
14. Nach grünem Deployment zusätzlich bis zu 10 Minuten auf die vollständige Bereitstellung warten.
15. Desktop mit Strg+F5 prüfen.
16. Mobilbrowser vollständig schließen, neu öffnen und prüfen.
17. `VERSION.txt` muss `4.7.1-TEST5` anzeigen.
