# TESTPROTOKOLL – Website 4.9.1-S30-1

## Automatisch geprüft
- `VERSION.txt` = `Website 4.9.1-S30-1`.
- JavaScript-Syntaxprüfung `node --check logbuch.js`: bestanden.
- Startseiten-Markup enthält genau einen Container `#logbook-30s`.
- Kurzfassung wird im bestehenden Logbuch-Bereich eingebettet.
- Auswahlregel `anzeigen: true`: bestanden.
- Priorisierung absteigend nach `prioritaet`: bestanden.
- Begrenzung auf maximal drei Highlights: bestanden.
- Spieltag 1: `kapitaene` → `crewduell` → `zahlen-aus-der-kombuese`.
- Spieltag 2: `kapitaene` → `gegen-den-strom` → `volltreffer`.
- `kursbewegung` von Spieltag 2 bleibt wegen `anzeigen: false` ausgeschlossen.
- Mobile CSS schaltet die drei Kurzmeldungen unter 760 px auf eine Spalte.
- Navigation, globales Grid und bestehende Kachelgrößen wurden nicht geändert.

## Noch manuell im Testrepository zu prüfen
- Desktopdarstellung der neuen Kurzfassung.
- Mobile Darstellung ohne Überlauf bei realer GitHub-Pages-Auslieferung.
- Vollständiger bestehender Logbuch-Teaser unterhalb der Kurzfassung weiterhin korrekt.
- Link `Logbuch öffnen` und übrige Startseitenfunktionen unverändert.

## Status
Technische Vorprüfung bestanden. Visuelle Abnahme im Testrepository steht aus.
