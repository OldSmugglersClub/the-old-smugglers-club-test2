# Website 4.7.2-HF3-HF3

Gezielter Realdaten-Hotfix auf Basis 4.7.2-HF3-HF2.

## Änderungen
- Teamduell zeigt die vom Admin berechneten Durchschnittswerte mit zwei Nachkommastellen an (z. B. 1,25 : 1,46).
- Hall-of-Fame-Runtime übernimmt bestätigte `besondereLeistungen` aus dem vorhandenen Datenbestand auch dann in die sichtbare Ehrenmitglieder-Kachel, wenn kein zusätzliches `hallOfFame.freigegeben`-Hüllflag vorhanden ist.
- Bereits bestätigte Sonderchampions werden nicht gelöscht oder neu berechnet; nur die Anzeige wird aus dem vorhandenen bestätigten Datenbestand abgeleitet.
- Der Gleichstandsfix aus HF2 bleibt unverändert.
- Keine Änderungen an Grid, Navigation, HTML-Grundlayout, CSS, Admin oder Datenmodell.
