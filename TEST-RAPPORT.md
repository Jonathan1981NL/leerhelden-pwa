# Testrapport Nexus Learning Worlds v4.3

De release is getest met een geïsoleerde browser-DOM, Node.js-syntaxiscontrole, opslag/herlaadtests, ZIP-integriteitscontrole en een lokale HTTP-server.

## Geslaagde controles

- Alle ingebedde JavaScript-blokken zijn syntactisch geldig.
- 500 unieke interne objectnamen, 500 unieke Nederlandse objectnamen, 500 unieke SVG-uitvoeren en 500 unieke animatiehandtekeningen.
- 25 volledig Nederlandse marktplaatscategorieën.
- Wereldplaatsingen blijven per profiel én per wereld gescheiden.
- Profielachtergronden roteren alleen tussen de eigen werelden en tonen de werkelijk geplaatste objecten.
- Avataritems gebruiken vaste ankerpunten voor hoofd, ogen, gezicht, nek, romp, rug, hand, pols en voeten.
- Dani start in groep 5, Zana in groep 8 en Lena in groep 1; de interne Nederlandse leerlijn is hiermee gekoppeld.
- Vakniveaus kunnen afzonderlijk worden ingesteld en volgen een eigen geschiedenis.
- 340 inhoudelijke kwaliteitsvragen gecontroleerd op context, antwoord, opties, hint en uitleg.
- 525 opeenvolgende rekensomvragen gecontroleerd zonder herhaling binnen de voorgaande twintig.
- 414 niveau-/vakcombinaties over alle 37 interne niveaus genereren geldige opdrachten.
- 22 spellen aanwezig; klassieke bordspellen behouden, schaak, dammen en Mijnenveger inbegrepen.
- Mijnenveger, Nim, Schuifpuzzel en Woordzoeker functioneel getest.
- Spelblokkade na tien afgeronde rondes blijft per spel en profiel actief.
- Nederlandse namen en instructies van de klassieke spellen gecontroleerd.
- Interactieve oudergrafiek, vakfilters, vakgeschiedenis en detailweergave genereren geldige uitvoer.
- Lokale opslag, harde herlaadtest en behoud van zelfgemaakte profielen geslaagd.
- ZIP-mapstructuur en lokale HTTP-publicatie geslaagd.

## Productiegrens

De flat-file is een uitgebreide lokale/GitHub Pages-release. Voor betaalde publieke accounts, synchronisatie tussen apparaten, echte autorisatie, abonnementen en app-storepublicatie blijft een beveiligde backend en fysieke device-QA noodzakelijk.
