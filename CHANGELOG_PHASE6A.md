# CHANGELOG – Phase 6A

## Bundesliga-Autoimport
- getesteten gemeinsamen Import-Core für Bundesliga 2026/27 aufgenommen;
- automatischen Importer auf den gemeinsamen Core vereinheitlicht;
- GitHub-Actions-Workflow im 30-Minuten-Takt aufgenommen;
- OpenLigaDB-Abruf auf sportlich relevantes Zeitfenster begrenzt;
- 306/306-Zuordnungsprüfung als harte Voraussetzung;
- Alias `SV 07 Elversberg → elversberg` berücksichtigt;
- Konfliktschutz für bereits vorhandene Ergebnisse;
- atomare Übernahme mehrerer bestätigter Ergebnisse;
- `datenVersion` pro erfolgreichem Lauf exakt +1;
- automatischer Commit nur bei tatsächlicher Änderung von `spieldaten.json`.

## Unverändert
- Website-Grid;
- Kachelgrößen;
- Navigation;
- Bundesliga-Darstellung;
- Admin;
- bestehende OSC-Fachlogik.
