# Version 2.43 – Zentrale Wettbewerbs- und Saisonmetadaten

- `wettbewerbe.json` ist nun die gemeinsame Quelle für Navigation, Seitenfilter und Saisonmetadaten.
- Die Saisonübersicht liest Namen, Zielwerte, Zeiträume, Status, Links und Filter direkt aus dem Wettbewerbsregister.
- `saison-2026-2027.json` enthält nur noch globale Überschrift und Saisoninformationen.
- Die Startseiten-Spieltaganzeige lädt Spieltag, Spiele, Teams und Tippspieltage über `datenregister.json`.
- Doppelte Wettbewerbsdefinitionen wurden entfernt; Layout und freigegebene Inhalte bleiben unverändert.
