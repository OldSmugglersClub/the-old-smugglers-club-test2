# The Old Smugglers Club – Website 4.7.2-HF3-HF6

Ausgangsbasis ist die getestete Vollversion **4.7.2-HF3-HF5**.

## Inhalt dieses Hotfixes

Dieser Hotfix ergänzt die bestehenden Wettbewerbsseiten um externe, reine Sportdaten für die Saison 2026/27. Die Daten dienen ausschließlich der Darstellung der realen Wettbewerbssituation und sind von der OSC-/Kicktipp-Wertung getrennt.

### DFB-Pokal
- Datenquelle: OpenLigaDB `dfb/2026`.
- Darstellung erst ab Achtelfinale.
- Es werden nur bereits feststehende K.-o.-Runden angezeigt.
- Solange keine verwertbaren K.-o.-Runden vorliegen, wird kein Vorsaisonbaum eingeblendet.

### Champions League
- Datenquelle: OpenLigaDB `ucl/2026`.
- Ligaphasen-Tabelle wird aus den Spieltagen 1–8 aufgebaut.
- K.-o.-Baum unterstützt Playoffs bis Finale.
- Hin- und Rückspiele werden zu einem Gesamtergebnis pro Paarung zusammengeführt.
- Horizontales Scrollen des fünfstufigen Baums ist bewusst erlaubt, um Lesbarkeit und bestehende Kachelgrößen zu erhalten.

### Europa League
- Primärquelle: OpenLigaDB `uel/2026`.
- Darstellung ab Achtelfinale.
- Lokaler Fallback: `europa-league-ko-2026.json`.
- Der Fallback startet leer.
- Fehlt eine Runde in OpenLigaDB, kann diese Runde lokal ergänzt werden.
- Bei einem verifizierten Datenkonflikt erhält der lokale Fallback Vorrang.

## Rückfallebene

Die externe Sportdatendarstellung ersetzt keine Admin-Fachlogik. Manuelle Ergebniseingabe im Admin und alle OSC-/Kicktipp-Wertungen bleiben unverändert bestehen.

## Abnahme

Der Entwicklungsblock wurde mit realen Vorsaisondaten prototypisch geprüft und anschließend auf 2026/27 umgestellt. Regressionstests für DFB-Pokal, Champions League und Europa League wurden bestanden.
