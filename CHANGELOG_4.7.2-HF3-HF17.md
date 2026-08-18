# CHANGELOG 4.7.2-HF3-HF17

## Zweck
Öffentliche Website von internen Technik-, Lade- und Datenquellenhinweisen bereinigt, ohne Grid, Kachelgrößen, Navigation oder Grundlayout zu verändern.

## Entfernt / bereinigt
- Bundesliga-Tabelle: interne Hinweise auf `spieldaten.json` entfernt.
- Bundesliga-Saisonstatistik: Vor-Saison-Platzhalter vollständig ausgeblendet; die Sektion erscheint erst mit echten Endergebnissen.
- Highscore: Lade-/Erfolgsstatus wie „Daten geladen / Aktuelle Ranglisten verfügbar“ ausgeblendet. Echte Fehlerhinweise bleiben sichtbar.
- Hall of Fame: Lade-/Erfolgsstatus des Ehrenlogbuchs ausgeblendet. Echte Fehlerhinweise bleiben sichtbar.
- Startseiten-Counter: internen Hinweis auf den „zentralen Spielbetrieb“ entfernt; der nutzerrelevante Counter-Hinweis bleibt bestehen.
- Champions League / Europa League / DFB-Pokal: technische Quellen- und Fallback-Hinweise aus der öffentlichen Darstellung entfernt.
- Wettbewerbsübersicht: internen Hinweis auf zentrale Datenpflege entfernt.
- Technische Fehlertexte mit „OpenLigaDB“ wurden durch neutrale nutzerverständliche Verfügbarkeitsmeldungen ersetzt.

## Unverändert
- Grid und Kachelgrößen
- Navigation
- CSS-Layoutregeln
- Datenlogik und Datenquellen
- Bundesliga-/Dynamo-Termin- und Ergebnisautomatiken
- Turnierbaum- und Tabellenberechnung
