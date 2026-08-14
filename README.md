# The Old Smugglers Club – Version 4.4.6

Öffentliche GitHub-Pages-Website der Tipprunde **The Old Smugglers Club**.

## Veröffentlichung

Der vollständige Inhalt dieses Verzeichnisses gehört direkt in das Hauptverzeichnis des GitHub-Repositories. Die Datei `index.html` darf nicht in einem zusätzlichen Unterordner liegen.

## Aktueller Stand

- öffentliche Website mit freigegebenem Desktop- und Mobildesign
- Bundesliga, DFB-Pokal, Champions League, Europa League und Sonderwettbewerbe
- Smuggleraufträge für reale Spiele der SG Dynamo Dresden
- Highscore, Hall of Fame, Piratenkodex, Bonuswettbewerb und Saisonübersicht
- zentrale Datenbausteine über JSON und `datenregister.json`
- vollständige technische Bestandsaufnahme in `ARCHITEKTUR.md`

## Version 4.4.6

Version 4.4.6 integriert erstmals zwei farbige, eigenständige **Schmugglersiegel** in die hervorgehobene Paarung der Kachel „Aktueller Spieltag“. Die SVG-Dateien verwenden keine offiziellen Vereinswappen und bleiben über einen Kürzel-Fallback vollständig rückbaubar.

## Aktualisierung über die GitHub-Webseite

Für Version 4.4.5 gilt die Datei `GITHUB-UPDATE-4.4.6.md`.

## Wichtige Dateien

- `index.html` – Startseite
- `datenregister.json` – Register gemeinsam genutzter Datenquellen
- `spieldaten.json` – zentrale Spielliste
- `wettbewerbe.json` – Wettbewerbsdefinitionen
- `ARCHITEKTUR.md` – technische Bestandsaufnahme und Zielarchitektur
- `ADMIN-SYSTEMANALYSE.md` – geprüfter Aufbau des lokalen Adminbereichs v4.0.5
- `ROADMAP.md` – verbindlicher Entwicklungsplan bis Version 5.0 LTS
- `PromptManual/PROJECT_MANUAL.md` – verbindliche Projektanweisungen
- `assets/smugglers-design-system/dokumentation/SMUGGLERS_DESIGN_SYSTEM.md` – verbindliche SDS-Spezifikation
- `VERSION.txt` – aktuelle Versionsnummer
- `CHANGELOG.md` – Versionshistorie
- `RELEASE_NOTES_v4.4.6.md` – Änderungen dieses Releases
- `GITHUB-UPDATE-4.4.6.md` – konkrete Upload-Liste

## Projektregeln

- freigegebenes Grundlayout, Raster, Kachelgrößen und Navigation beibehalten
- nur innerhalb bestehender Komponenten arbeiten
- keine Bildgenerierung für HTML-, CSS-, JavaScript- oder Dateianpassungen
- keine Emojis, Cliparts, Comicgrafiken oder generischen Symbole
- Änderungen erst nach Analyse, Auswirkungsbewertung, Vorschlag und Freigabe umsetzen


## Rechtliche Seiten

Die öffentlichen Seiten verlinken im Footer auf `impressum.html` und `datenschutz.html`. Die Rechtstexte beschreiben den in Version 4.4.3 geprüften technischen Stand und müssen bei neuen externen Diensten oder Formularen erneut geprüft werden.

### Version 4.4.8

Die zwei Pilot-Schmugglersiegel wurden auf bessere Wiedererkennbarkeit überarbeitet. Im Zentrum stehen nun die klar lesbaren Kürzel `FCN` und `SGD`; Vereinsfarben sind kräftiger, nautische Details dezenter. Das bestehende Website-Layout wurde nicht verändert.


## Schmugglersiegel ab Version 4.4.8

Die vollständige Bibliothek umfasst alle 52 aktiven Teams aus `teams.json`. Die zentrale Komponente `team-badge.js` lädt das Register und stellt Siegel mit neutralem Kürzel-Fallback dar. Es werden keine offiziellen Vereinswappen verwendet.


## UEFA-Kandidatenpool (Version 4.4.9)

`uefa-kandidaten-2026-27.json` dokumentiert alle am 31.07.2026 auf den offiziellen UEFA-Teamseiten geführten Mannschaften der Champions League und Europa League. `teams.json` und die Schmugglersiegel-Bibliothek wurden vorsorglich erweitert. Nicht qualifizierte oder ausgeschiedene Teams bleiben unsichtbar, solange keine Wettbewerbsdatei auf ihre Team-ID verweist.


## Schmugglersiegel-Integration (Version 4.4.11)

Die zentrale Komponente `team-badge.js` wird nun auch auf den Wettbewerbsseiten Bundesliga und Dynamo Dresden verwendet. Siegel erscheinen ergänzend in Tabellen und Spielpaarungen. Fehlt ein Asset, bleibt der Vereinsname sichtbar und ein neutrales Kürzel dient als Fallback.


## Version 4.4.11 – robuste Schmugglersiegel

Die zentrale Komponente erzeugt Schmugglersiegel nun direkt als Inline-SVG aus dem Register. Dadurch werden auf allen eingebundenen Seiten echte farbige Siegel statt reiner Fallback-Kürzel dargestellt, auch wenn einzelne externe SVG-Dateien fehlen oder falsch abgelegt wurden.


Aktuelle Version: 4.6.1

## Version 4.4.12
Die zentrale Schmugglersiegel-Komponente ist nun auf allen öffentlichen Wettbewerbsseiten eingebunden.

## Version 4.4.13
Der freigegebene visuelle Ist-Zustand ist nun vollständig in `DESIGN_GUIDE.md` dokumentiert.

## Version 4.4.14
Bugfix für die mobile Überschrift der Datenschutzerklärung sowie für die zu weit auseinandergezogene Desktop-Footer-Darstellung.

## Version 4.4.15
Das lokale Adminsystem v4.0.5 ist vollständig in `ADMIN_HANDBUCH.md` dokumentiert.

## Version 4.5.0
Die bestehende JSON-Landschaft ist vollständig in `DATENARCHITEKTUR.md` und `MIGRATIONSMATRIX.md` eingeordnet. Diese Version führt noch keine technische Migration aus.

## Version 4.5.1
Der geplante zentrale Spieltagsabschluss mit Kicktipp-Import, verbindlicher Behandlung fehlender Tipps und automatischer Berechnungskette ist vollständig dokumentiert.

## Version 4.5.2
Verbindliche Wertungsregeln und Definition der regulären Spielzeit projektweit dokumentiert.

## Version 4.6.0
Der reale Spielbetriebs-Workflow und das geplante Admin-Cockpit sind verbindlich dokumentiert.

## Version 4.6.1
Die realen Kicktipp-Exportformate und der verbindliche Importvertrag sind dokumentiert. Originalexporte mit personenbezogenen Daten sind nicht Bestandteil des Projektpakets.


## Aktuelle Test-Erweiterung: Stalk-O-Meter (4.7.2-TEST1)
Siehe `STALK-O-METER-HANDBUCH.md` und `README_4.7.2-TEST1.md`.


## Aktuelle Website-Version: 4.7.2 FINAL
Enthält das Stalk-O-Meter mit GoatCounter-Pageview-Erfassung, öffentlicher Rangliste und
Gesamtanzeige. Architektur und Betriebsdetails siehe `STALK-O-METER-HANDBUCH.md`.

## Website 4.7.2-HF3-HF6 – externe Wettbewerbsdaten 2026/27

Die Wettbewerbsseiten für DFB-Pokal, Champions League und Europa League können nun externe Sportdaten von OpenLigaDB darstellen. Die Champions-League-Ligaphase wird ausschließlich aus den Spieltagen 1–8 aufgebaut. K.-o.-Paarungen werden in Turnierbäumen dargestellt; Hin- und Rückspiele der UEFA-Wettbewerbe werden zu Paarungen aggregiert. Für die Europa League existiert mit `europa-league-ko-2026.json` ein leer startender lokaler Fallback für fehlende oder verifiziert widersprüchliche Runden. Externe Sportdaten beeinflussen keine OSC-/Kicktipp-Wertung.
