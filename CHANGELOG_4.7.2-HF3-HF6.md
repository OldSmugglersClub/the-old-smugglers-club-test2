# CHANGELOG – Website 4.7.2-HF3-HF6

## Externe Wettbewerbsdaten 2026/27
- OpenLigaDB als externe Sportdatenquelle für DFB-Pokal, Champions League und Europa League eingebunden.
- DFB-Pokal: K.-o.-Turnierbaum zeigt ausschließlich bereits feststehende Runden der Saison 2026/27; solange keine verwertbaren K.-o.-Runden vorhanden sind, bleibt der Baum leer.
- Champions League: Ligaphasen-Tabelle wird ausschließlich aus den Spieltagen 1–8 von OpenLigaDB aufgebaut; spätere K.-o.-Spiele verändern den Ligaphasen-Endstand nicht.
- Champions League: K.-o.-Turnierbaum unterstützt Playoffs, Achtelfinale, Viertelfinale, Halbfinale und Finale. Hin- und Rückspiele werden paarungsbezogen zu Gesamtergebnissen aggregiert.
- Europa League: OpenLigaDB wird rundenweise bevorzugt. Für fehlende oder widersprüchliche K.-o.-Runden steht ein lokaler Fallback bereit.
- Europa-League-Fallback für 2026/27 startet leer und enthält keine Vorsaisonergebnisse.
- Bei einem Datenkonflikt zwischen OpenLigaDB und einem verifizierten lokalen Europa-League-Fallback erhält der lokale Fallback Vorrang.
- Manuelle OSC-/Kicktipp-Wertungen bleiben vollständig von den externen Sportdaten getrennt.

## Darstellung
- gemeinsame Turnierbaum-Komponente für K.-o.-Wettbewerbe erweitert.
- DFB-Pokal nutzt vier Stufen: Achtelfinale → Viertelfinale → Halbfinale → Finale.
- Champions League nutzt fünf Stufen: Playoffs → Achtelfinale → Viertelfinale → Halbfinale → Finale; horizontales Scrollen bleibt zur Wahrung der Lesbarkeit bewusst erhalten.
- Teamnamen, Schmugglersiegel, Ergebnisse, Termine und datenbasierte Verbindungslinien bleiben erhalten.
- Keine Änderung an Navigation, Grundlayout oder bestehendem Seitenraster.

## Tests
- OpenLigaDB-Browserzugriff über GitHub Pages bestätigt.
- DFB-Pokal-Vorsaison 2025/26 erfolgreich als vollständiger 8→4→2→1-Prototyp geprüft.
- Champions-League-Ligaphase 2025/26 erfolgreich mit 144 Spielen, 36 Teams und exakt 8 Spielen je Team geprüft.
- Champions-League-K.-o.-Aggregation 2025/26 erfolgreich mit 8 Playoffs, 8 Achtelfinals, 4 Viertelfinals, 2 Halbfinals und 1 Finale geprüft.
- Europa-League-Fallback 2025/26 isoliert mit 15 Paarungen geprüft und Datenkonflikt-Erkennung erfolgreich getestet.
- Regressionstest DFB-Pokal, Champions League und Europa League nach Umstellung auf Saison 2026/27 bestanden.
