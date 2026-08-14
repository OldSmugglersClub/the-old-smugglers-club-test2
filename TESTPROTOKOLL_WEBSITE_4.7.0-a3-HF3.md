# Testprotokoll – Website 4.7.0-a3-HF3-TEST

## Ursache
Die Website lud mangels `website-view.json` die alte Rückfallquelle `highscore.json`. Deren saisonweite Teamliste war leer.

## Erwarteter Test
- Datenquelle zeigt `website-view.json · Admin 6.2`.
- Gesamt-Teamwertung zeigt exakt 2 Teams.
- New Smugglers Team: 76 Mitglieder.
- Old Smugglers Team: 24 Mitglieder.
- Punktesumme und Durchschnitt jeweils 0,0.
- Trefferanzeige: 2 Teams.
- Footer: Version 4.7.0-a3-HF3-TEST.
- Kein Podium und kein Sieger bei Nullstand.
