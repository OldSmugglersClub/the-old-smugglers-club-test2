# Version 2.48 – Gesamtprüfung und Release-Audit

Version 2.48 ergänzt eine reproduzierbare technische Gesamtprüfung vor dem Release Candidate.

## Enthalten

- `scripts/release_audit.py` prüft lokale HTML-/JavaScript-Referenzen, JSON-Dateien und Pflichtdateien.
- `RELEASE-AUDIT.json` dokumentiert das Prüfergebnis maschinenlesbar.
- Versionsstand, Änderungsprotokoll und Paketstruktur sind auf Version 2.48 gesetzt.
- Das freigegebene Grundlayout, Raster, Kachelgrößen und die vorhandenen Inhalte bleiben unverändert.

## Prüfung erneut ausführen

```bash
python3 scripts/release_audit.py
```
