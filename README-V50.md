# Version 2.50 – Release Candidate

Version 2.50 ist der abschließende Release Candidate der Website „The Old Smugglers Club“.

## Inhalt

- vollständiger aktueller Stand der Website
- zentrales Datenregister und gemeinsames Datenmodell
- Highscore, Hall of Fame und Wettbewerbsseiten
- automatisierte Konsistenz- und Release-Prüfung
- Release-Manifest mit SHA-256-Prüfsummen
- Abschlusscheckliste und Release-Protokoll

## Unverändert

Das freigegebene Grundlayout, Raster, sämtliche Kachelgrößen, Abstände, Navigation und bereits bestätigte Inhalte wurden nicht verändert.

## Prüfung erneut ausführen

```bash
python3 scripts/release_audit.py
python3 scripts/build_release_manifest.py
```

Ein erfolgreicher Audit erzeugt in `RELEASE-AUDIT.json` den Status `OK`.
