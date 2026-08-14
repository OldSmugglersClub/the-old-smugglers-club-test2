# The Old Smugglers Club – Phase 6A Bundesliga-Autoimport

## Basis
Produktive Website-Baseline: **4.7.2-HF3-HF6**.

Dieses Paket übernimmt ausschließlich den in den Testphasen 5A bis 5F-HF1 geprüften
automatischen Bundesliga-Ergebnisimport. Website-Layout, Navigation, Kacheln, HTML/CSS
und Admin bleiben unverändert.

## Datenweg
GitHub Actions
→ lokale Zeitfensterprüfung aus `spieldaten.json`
→ OpenLigaDB `bl1/2026` nur bei Bedarf
→ vollständige 306/306-Paarungsvalidierung
→ gemeinsamer Import-Core
→ `spieldaten.json`
→ Commit nur bei tatsächlicher sportlicher Änderung.

## Zeitfenster
Der Workflow wird über GitHub Actions alle 30 Minuten angestoßen (`Minute 07 und 37`).
Ein Workflow-Start bedeutet nicht automatisch einen API-Abruf.

OpenLigaDB wird nur abgefragt, wenn mindestens ein Bundesliga-Spiel:
- `datum` und `anstoss` besitzt,
- `terminBestaetigt === true` ist,
- lokal noch kein Endergebnis besitzt,
- mindestens 120 Minuten und höchstens 24 Stunden nach Anstoß liegt.

## Schutzregeln
- kein relevantes Spiel → kein API-Abruf;
- API nicht erreichbar / HTTP-Fehler → keine Änderung;
- OpenLigaDB-Spielplan nicht vollständig → keine Änderung;
- Mapping nicht 306/306 → keine Änderung;
- vorhandenes identisches Ergebnis → No-op;
- vorhandenes abweichendes Ergebnis → harter Ergebniskonflikt, kein Schreiben;
- Datei wird erst nach vollständiger Validierung geschrieben;
- `datenVersion` steigt pro erfolgreichem Importlauf exakt um 1;
- `aktualisiert` wird nur bei tatsächlicher Änderung gesetzt;
- Workflow committet ausschließlich `spieldaten.json`.

## Testabdeckung
Bestanden: Phase 5A, 5B, 5C, 5D, 5E und 5F-HF1.

## Nicht enthalten
Keine Dry-Run-, Integrations-, Phase-5-, Fixture-, Terminstruktur- oder
Zeitfenster-Testdateien.
