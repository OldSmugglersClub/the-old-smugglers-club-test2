# Website 4.9.1-S30-3-HF3

Kleiner, freigegebener Textlogik-Hotfix auf Basis von Website 4.9.1-S30-3-HF2.

## Zweck
Das Spieltags-Logbuch verwendete bei genau einem Tipper grammatikalisch falsche Pluralformulierungen wie `1 Tipper teilen sich ...` oder `1 Tipper erreichten ...`.

HF3 unterscheidet die Textausgabe jetzt sauber nach Anzahl:
- genau 1 Kapitän: Name + Singularform
- mehrere Kapitäne: bisherige Pluralform
- genau 1 Volltreffer-Spitzenreiter: Name + Singularform
- mehrere Volltreffer-Spitzenreiter: bisherige Pluralform

Die Logbuchdaten und die zugrunde liegenden Berechnungen werden nicht verändert.

## Unverändert
Grid, Kachelgrößen, Navigation, Highscore-Berechnung, Logbuchdaten, OpenLigaDB sowie Automatiken für Bundesliga, DFB-Pokal, Champions League und Europa League.
