# Website 4.7.1-TEST10

## Zweck
Gezielte Behebung des letzten bestaetigten mobilen Besucherfehlers im dynamischen Wettbewerbs-Navigator.

## Aenderungen
- `wettbewerb.js`: Nur der dynamisch erzeugte Link `weihnachtsregatta` erhaelt die Klasse `competition-link--weihnachtsregatta`.
- `wettbewerb.css`: Nur diese Kachel wird mobil gegen Worttrennung abgesichert und moderat verkleinert.
- Alle acht Wettbewerbsseiten laden die beiden gemeinsamen Assets mit `?v=4.7.1-TEST10`.
- Die in TEST7/8/9 irrtuemlich an der Startseiten-Komponente vorgenommenen Sonderaenderungen wurden auf den bestaetigten TEST6-Stand zurueckgenommen.

## Unveraendert
Grid, Kachelgroessen, Navigation, Linkziele, Datenmodell, JSON-Strukturen, Fachlogik und Admin.
