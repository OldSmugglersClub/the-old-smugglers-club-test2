# GitHub-Repository sauber durch Version 4.0.7 ersetzen

Diese Anleitung ist für GitHub Desktop unter Windows gedacht. Es müssen keine Dateien einzeln auf GitHub gelöscht werden.

## Vorbereitung

1. Installiere GitHub Desktop, falls noch nicht vorhanden.
2. Starte GitHub Desktop und melde dich mit deinem GitHub-Konto an.
3. Entpacke dieses Paket in einen neuen Ordner, zum Beispiel:
   `Dokumente\Old-Smugglers-Club-4.0.7`

## Repository auf den PC holen

1. Öffne GitHub Desktop.
2. Wähle **File → Clone repository**.
3. Wähle das Repository der Website aus.
4. Merke dir den unter **Local path** angezeigten Ordner.
5. Klicke auf **Clone**.

## Alte Dateien in einem Schritt entfernen

1. Öffne im Windows-Explorer den geklonten Repository-Ordner.
2. Markiere mit `Strg + A` alle Dateien und Ordner.
3. Lösche sie.
4. Kopiere anschließend den gesamten Inhalt dieses entpackten Version-4.0.7-Pakets in den leeren Repository-Ordner.

Wichtig: Kopiere die Dateien selbst in den Repository-Ordner, nicht den übergeordneten Paketordner. `index.html` muss direkt im Hauptordner des Repositorys liegen.

## Änderungen veröffentlichen

1. Wechsle zurück zu GitHub Desktop.
2. Links werden nun viele gelöschte und neue Dateien angezeigt. Das ist korrekt.
3. Trage unten links als Zusammenfassung ein:
   `Version 4.0.7 – Repository bereinigt`
4. Klicke auf **Commit to main**.
5. Klicke anschließend oben auf **Push origin**.

GitHub löscht dadurch automatisch alle alten Dateien, die nicht mehr im neuen Paket enthalten sind. Eine Einzellöschung über die GitHub-Webseite ist nicht nötig.

## Website prüfen

1. Warte nach dem Push etwa ein bis drei Minuten.
2. Öffne die Website neu.
3. Nutze bei Bedarf `Strg + F5`, damit der Browser keine alte Version aus dem Cache anzeigt.
4. Prüfe Startseite, Wettbewerbe und Highscore.

## Adminbereich

Der lokale Adminbereich gehört nicht in dieses Repository. Verwende dafür weiterhin das separate lokale Admin-Paket. Lade dessen Dateien niemals in das öffentliche GitHub-Repository hoch.
