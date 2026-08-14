# Website 4.7.1-TEST5-HF1

## Zweck
Reiner Release-/Einspiel-Hotfix für 4.7.1-TEST5.

## Ursache
Die TEST5-Website-Dateien wurden beim vorigen Einspielen als Unterordner `DATEIEN_FUER_GITHUB` in das Repository übernommen. GitHub Pages verwendet jedoch die Dateien im Repository-Stamm. Daher blieb die sichtbare Website trotz Versionsanzeige TEST5 auf älteren HTML/CSS/JS-Dateien.

## Änderung
- Alle bereits freigegebenen TEST5-Website-Dateien liegen in diesem Updatepaket direkt auf ZIP-Ebene und sind direkt in den Repository-Stamm zu kopieren.
- `DATEIEN_FUER_GITHUB` ist im lokalen Repository vollständig zu löschen.
- `VERSION.txt` = `4.7.1-TEST5-HF1`.

## Unverändert
- Keine Fachlogik.
- Keine Navigation oder Linkziele.
- Keine Grid- oder Kachelgrößen.
- Keine JSON-Strukturänderung.
- Kein Admin-Eingriff.
