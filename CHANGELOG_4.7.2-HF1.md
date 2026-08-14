# CHANGELOG 4.7.2-HF1

## Datenschutz-Hotfix
- Datenschutzerklärung vollständig auf den aktuell geprüften technischen Website-Stand gebracht.
- GitHub Pages als Hostingdienst konkretisiert.
- IONOS für Domain- und E-Mail-Kommunikation einschließlich Kontakt/Kummerkasten aufgenommen.
- GoatCounter/Stalk-O-Meter vollständig beschrieben.
- Kicktipp als externer Link eingeordnet.
- API-Sports/API-Football als administrative Datenquelle eingeordnet; kein direkter Browseraufruf im geprüften öffentlichen Website-Code.
- Teilnehmer-, Tipp-, Ranglisten- und Archivdaten konkretisiert.
- Betroffenenrechte, Beschwerderecht, Speicherdauer, Empfänger und Datenminimierung erweitert.

## Technischer Audit
Im öffentlichen Projektcode wurden direkte externe Verbindungen zu GoatCounter sowie externe Links zu Kicktipp festgestellt.
Der Kummerkasten ist ein `mailto:`-Link und kein Webformular.
API-Sports/API-Football wird im geprüften öffentlichen Website-Code nicht direkt aufgerufen.

## Unverändert
- Grid, Kachelgrößen und Grundlayout.
- Navigation.
- Stalk-O-Meter-Logik und Tracking.
- Wettbewerbs-, Highscore-, Hall-of-Fame- und Saisonlogik.
- Admin Tool.
