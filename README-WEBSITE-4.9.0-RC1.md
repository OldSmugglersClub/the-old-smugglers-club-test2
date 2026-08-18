# Website 4.9.0-RC1 – H2H Statistiken

Nur im Testrepository verwenden.

## Testreihenfolge
1. Update einspielen und pushen.
2. GitHub Actions → `H2H Snapshot – Startseite` manuell starten.
3. Workflow muss grün durchlaufen.
4. Solange aktuell kein Spiel innerhalb der nächsten 7 Tage liegt, darf `h2h-spieldaten.json` leer bleiben.
5. Unit-Test lokal/GitHub-fähig: `node scripts/tests/h2h-snapshot-test.mjs`.
6. Sobald ein Bundesliga-/2.-Bundesliga-Spiel in das 7-Tage-Fenster kommt, Snapshot und Startseiten-Panel real prüfen.

Die Website liest ausschließlich den lokalen Snapshot. Ein Ausfall von OpenLigaDB am Spieltag beeinträchtigt die Startseite nicht.
