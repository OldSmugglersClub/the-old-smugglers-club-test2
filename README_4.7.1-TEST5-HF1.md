# Einspielen von Website 4.7.1-TEST5-HF1

Dieses Paket ist bewusst flach aufgebaut: Die Dateien liegen direkt auf ZIP-Ebene. Es gibt keinen Ordner `DATEIEN_FUER_GITHUB`.

## Schritt für Schritt
1. ZIP in einen neuen leeren Ordner entpacken.
2. Lokales GitHub-Repository `the-old-smugglers-club` im Explorer öffnen.
3. Falls dort der Ordner `DATEIEN_FUER_GITHUB` existiert: diesen Ordner vollständig löschen.
4. Alle Dateien aus dem entpackten HF1-Update markieren.
5. Diese Dateien direkt in den Stamm des lokalen Repositories kopieren.
6. Vorhandene Dateien ersetzen bestätigen.
7. GitHub Desktop öffnen.
8. Prüfen: Bei Website-Dateien darf links nur z. B. `index.html`, `hall-of-fame.html`, `highscore.css` stehen. FALSCH wäre `DATEIEN_FUER_GITHUB/index.html`.
9. Prüfen: `DATEIEN_FUER_GITHUB` muss als gelöschter Ordner/gelöschte Dateien erscheinen.
10. Erst nach Screenshot-Review committen.
11. Push origin.
12. GitHub Actions/Pages abwarten.
13. Live prüfen: VERSION.txt, Highscore-Wortumbrüche, Hall-of-Fame-Hinweis, Saisonübersicht, Buttonfarben und mobile Header-Korrektur.
