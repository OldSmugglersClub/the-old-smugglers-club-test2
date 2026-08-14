# Version 2.49 – Finalisierung und Release-Vorbereitung

Version 2.49 ist die letzte technische Vorbereitungsstufe vor dem Release Candidate.

## Enthalten

- Versionsstand und Release-Prüfung auf 2.49 aktualisiert.
- Maschinenlesbares Release-Manifest mit Dateigrößen und SHA-256-Prüfsummen ergänzt.
- Reproduzierbare Prüfung aller Pflichtdateien, lokalen Referenzen und JSON-Dateien.
- Vollständiges GitHub-Paket einschließlich `VERSION.txt`, `CHANGELOG.md`, Audit und Dokumentation.
- Grundlayout, Raster, Kachelgrößen, Navigation und freigegebene Inhalte bleiben unverändert.

## Prüfungen erneut ausführen

```bash
python3 scripts/build_release_manifest.py
python3 scripts/release_audit.py
```
