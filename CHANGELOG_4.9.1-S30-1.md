# CHANGELOG – Website 4.9.1-S30-1

## Neu
- Startseiten-Erweiterung „Spieltag in 30 Sekunden“ innerhalb der bestehenden Spieltags-Logbuch-Komponente.
- Es werden maximal drei bereits vom Admin freigegebene Logbuch-Highlights des neuesten abgeschlossenen Spieltags angezeigt.
- Auswahl ausschließlich aus `spieltag-logbuch.json` mit `anzeigen: true`, sortiert nach vorhandener `prioritaet` absteigend.
- Unterstützte Kurztexte: Kapitäne, Gegen den Strom, Volltreffer, Crewduell, Kursbewegung und Zahlen aus der Kombüse.
- Unbekannte Highlight-Typen werden nicht als Kurzmeldung ausgegeben.

## Unverändert
- Keine neue Fachlogik für Wertung, Rang oder Überraschungen.
- Admin 6.4.0 bleibt unverändert.
- Keine Änderung an Navigation, globalem Grid, Kachelgrößen oder Grundlayout.
- Vollständiges Spieltags-Logbuch bleibt unverändert verfügbar.

## Technischer Stand
- Entwicklungs-/Testversion: `Website 4.9.1-S30-1`
- Basis: bestätigtes Live-Repository `Website 4.9.0`.
