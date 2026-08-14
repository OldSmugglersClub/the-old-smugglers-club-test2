# GitHub Desktop – 4.7.2-HF2

## Summary
Website 4.7.2-HF2: Urheber- und Nutzungsrechte ergänzt

## Description
Eigener Rechtsbereich für Inhalte, Programmierung und konkrete Architektur-/Dokumentationsausarbeitungen ergänzt. Schutzgrenzen und Rechte Dritter ausdrücklich berücksichtigt. Keine Änderung an Website-Fachlogik oder Tracking.

## Ablauf
1. Updatepaket einspielen.
2. GitHub Desktop öffnen.
3. Changes gegen die Dateiliste prüfen.
4. Keine Fachlogik-Dateien dürfen inhaltlich außerhalb des Footer-Links verändert sein.
5. Commit to main.
6. Push origin.
7. GitHub Pages/Actions abwarten.
8. Hart neu laden und Version `4.7.2-HF2` bestätigen.
9. Footer und neue Nutzungsrechte-Seite Desktop/Mobil testen.

## Zusätzliche Kontrolle vor Commit
- `datenschutz.html`: nur Hinweisblock entfernt.
- `nutzungsrechte.html`: nur Hinweisblock entfernt.
- `legal.css`: ausschließlich Überschriften-Worttrennung korrigiert.
- Keine Änderung an Tracking, Navigation oder Fachlogik.


## Commit nach bestandener Abnahme
Empfohlene Summary:
`4.7.2-HF2: Rechtsseiten mobil korrigiert und Kontaktadresse berichtigt`

Vor dem Commit:
- Änderungen in `legal.css` auf die mobile H1-Korrektur prüfen.
- Geänderte HTML-Dateien auf `kontakt@the-old-smugglers-club.de` prüfen.
- Erst nach bestandenem Website-Test committen und pushen.


## Finale Kontrolle vor Commit
- `index.html`: Footer-Kontaktlink muss `kontakt@the-old-smugglers-club.de` enthalten.
- Nach bestandener Website-Prüfung kann HF2 zum Commit freigegeben werden.
