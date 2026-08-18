# CHANGELOG – Website 4.9.0-RC1

Basis: produktive Website 4.8.0.

## Neu: H2H Statistiken auf der Startseite
- Ausschließlich die Spieltagskachel auf der Startseite erhält einen aufklappbaren „Match-Check“.
- Die Website fragt OpenLigaDB niemals direkt ab.
- GitHub Actions erzeugt `h2h-spieldaten.json` als lokalen Offline-Snapshot.
- Unterstützt zunächst Bundesliga und 2. Bundesliga.
- Angezeigt wird nur, was OpenLigaDB problemlos liefert:
  - direkter Vergleich + letzte direkte Duelle,
  - aktuelle Form, sofern vorhanden,
  - Tabellenlage, sofern vorhanden,
  - Heim-/Auswärtsbilanz, sofern berechenbar.
- Nicht unterstützte Spiele zeigen: „Für dieses Spiel sind keine H2H-Daten verfügbar.“
- Temporär fehlende Daten zeigen: „H2H-Daten werden noch geladen.“

## Snapshot-Logik
- Workflow läuft alle 6 Stunden, fragt aber fertige Spiele nicht ständig neu ab.
- Neues Spiel innerhalb der nächsten 7 Tage: Erstabruf.
- Technischer Fehler: `retry`, keine Wertung als „keine Daten“.
- Erfolgloses Team-Mapping: maximal drei erfolgreiche Leer-/Nichttreffer-Versuche; danach `unavailable`.
- Fertige Datensätze: keine Wiederholungsabfrage bis zur optionalen letzten Aktualisierung innerhalb von 24 Stunden vor Anpfiff.
- H2H selbst bleibt bei dieser letzten Aktualisierung unverändert; nur aktuelle Form/Tabelle/Heim-Auswärts können aktualisiert werden.
- Datensätze werden 7 Tage nach dem Spiel automatisch entfernt.

## Unverändert
- Counterlogik.
- Termin- und Ergebnisautomatiken.
- Tippverteilung.
- Wettbewerbskacheln.
- Highscore.
- globales Grid und Navigation.
