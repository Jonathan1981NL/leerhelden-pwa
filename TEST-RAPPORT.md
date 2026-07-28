# Testrapport — Nexus Learning Worlds v4.3.1 FROZEN

## Resultaat

De bevroren flatbaseline is gecontroleerd na de gerichte aanpassingen aan het accountoverzicht en ouderdashboard.

### Volledige regressie

- 6 ingebedde JavaScriptmodules: syntactisch geldig.
- 500 marktplaatsitems en 500 unieke grafische uitvoeringen behouden.
- 22 spellen behouden.
- 20 talen en 20 schoolsystemen behouden.
- 14 leergebieden in de standaard testmatrix.
- 340 inhoudelijke kwaliteitsvragen gecontroleerd.
- 525 rekenvragen gecontroleerd zonder herhaling binnen twintig vragen.
- 414 niveau-vakcombinaties gecontroleerd.
- Wereldisolatie, avatarankers, profielreset, opslag en herlaadtests geslaagd.

### Specifieke v4.3.1-controles

- Precies één levende wereldpreview in het accountoverzicht.
- De onderste dubbele wereldweergave is vervangen door een profiel- en leerroutekaart.
- Ouderomgeving gebruikt donkere tabellen en grafiekpanelen.
- De y-as toont labels uit het geselecteerde schoolsysteem, zoals Groep 5, 2 mavo of 4 vwo.
- Niveau-, score-, activiteit-, tijd- en vakbalansgrafieken aanwezig.
- Granulaire vakanalysetabel aanwezig.
- Klikbare vakdrilldowns, spelcontrole, ontgrendelingen en accountbeheer behouden.
- Beide ZIP-bestanden slagen voor integriteitscontrole.

## Browsercontrole

Een automatische headless-Chromiumcontrole kon in de uitvoeromgeving niet betrouwbaar worden gestart door lokale DBus/GPU-beperkingen. De syntaxis-, DOM-harness-, opslag-, inhouds- en regressietests zijn wel geslaagd. Een korte fysieke controle op desktop, iPad en telefoon blijft onderdeel van release-QA.
