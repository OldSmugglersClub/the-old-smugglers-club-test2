# The Old Smugglers Club – Website 4.7.2-TEST2

Basis: 4.7.2-TEST1.

TEST2 enthält ausschließlich den Tracking-Fix: Der originale GoatCounter-Script-Tag wird direkt auf den zwölf gezählten Inhaltsseiten eingebunden. `analytics.js` entfällt.

## Testforderung
Nach Deployment:
1. Version `4.7.2-TEST2` bestätigen.
2. Eine gezählte Zielseite einmal öffnen und GoatCounter-Dashboard prüfen (GC-2).
3. Dieselbe Seite einmal neu laden; Zähler muss steigen (GC-3).
4. Eine zweite Zielseite öffnen; GoatCounter muss beide Pfade getrennt führen (GC-4).
5. Stalk-O-Meter anschließend auf Einzelwerte, Sortierung und Gesamtwert prüfen.

Die bereits bestandenen Navigations-/Darstellungspunkte werden nur kurz regressionsgeprüft.
