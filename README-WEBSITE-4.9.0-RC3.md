# Website 4.9.0-RC3 – H2H Mapping-Fix

RC3 korrigiert ausschließlich die Zuordnung zwischen Startseiten-Spiel und bereits vorhandenem H2H-Snapshot.

## Test
1. Update ins Testrepository einspielen und pushen.
2. Kein neuer Snapshot-Lauf ist für diesen Fix erforderlich, sofern `h2h-spieldaten.json` bereits `ready`/`bereit` für Bayern–Stuttgart enthält.
3. Startseite hart neu laden.
4. Bayern München – VfB Stuttgart anklicken.
5. Das Modal muss die vorhandenen H2H-Module anzeigen statt „H2H-Daten werden vorbereitet.“
