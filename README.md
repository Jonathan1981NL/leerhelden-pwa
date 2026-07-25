# LevelUp Leren 3.0

Een uitgebreide, statische educatieve game-app voor Dani, Zana en Lena. De app werkt op computer, iPad en telefoon en kan rechtstreeks op GitHub Pages worden gepubliceerd.

## Meteen starten

Dubbelklik op `START-LEVELUP.bat` of open `START-HIER.html`.

Er is geen Python, localhost of installatie nodig voor normaal lokaal gebruik. De GitHub-versie gebruikt `index.html` en kan als PWA worden geïnstalleerd.

## Standaardcodes

- Dani: `2581`
- Zana: `2582`
- Lena: `2583`
- Papa-dashboard: `2580`

Wijzig de codes direct in het papa-dashboard. Na drie foute pogingen wordt een profiel tijdelijk vergrendeld en verschijnt de poging in het beveiligingsoverzicht.

## Wat is nieuw in versie 3.0?

### Drie volledig aparte leerprofielen

- **Dani:** midden groep 5, rekenen eind groep 5. Dagminimum: 2× lezen, 2× spelling, 1× rekenen.
- **Zana:** groep 8 plus en brugklas HAVO/VWO. Extra nadruk op diepgaand begrijpend lezen, Engels, wetenschap, kritisch denken, wereldoriëntatie en ondernemerschap.
- **Lena:** groep 2. Luisterverhalen, letters, klanken, tellen, vormen, patronen en eenvoudige spellen.

### Verhalen voor minimaal 1.000 dagen

De app bevat een deterministische verhalenmachine. Voor ieder profiel zijn meer dan 1.000 verschillende dagverhalen getest:

- Dani: voetbalavonturen, uitvindingen, aliens, haaien, karate, sportauto's, familie en focus.
- Zana: langere teksten over hockeydata, universiteiten, leiderschap, wetenschap, privacy, media, klimaat, democratie, financiën en ethische dilemma's.
- Lena: korte luisterverhalen met dieren, hockey, kleuren, tellen en herkenbare problemen.

Dani krijgt zes inhoudelijke tekstvragen, Zana acht diepgaande vragen en Lena drie luistervragen. De vragen gaan over de tekst zelf: feiten, verbanden, hoofdgedachte, woordenschat, argumentatie, bronnen en conclusies.

### Volwaardige oefensessies

- Rekenen: altijd **20 gevarieerde vragen** voor Dani en Zana, met totale timer, tijd per vraag en tempo-analyse.
- Spelling/taal: **12 duidelijke contextvragen** per sessie. Het ontbrekende woord is altijd uit de zin en antwoordopties af te leiden.
- Onbeperkt oefenen: het dagminimum is een minimum, geen dagslot.
- Adaptief niveau per vaardigheid.

### Spellen en focus

- Boter-kaas-en-eieren tegen Robo.
- Vier op een rij tegen Robo.
- Sudoku 4×4, 6×6 of 9×9 afhankelijk van leeftijd.
- Memory.
- Bewegende Focus Arcade met gekke gezichten, stoptekens, reactietijd en remkracht.
- Logica-, bron- en argumentatiepuzzels.

### Skins, LevelShop en eigen wereld

- Zelf een avatar maken met huidskleur, haar, kleding, accessoires, pets en emotes.
- LevelCoins verdienen met leren en beperkt met bonusspellen.
- Een marktplaats zonder echt geld, advertenties of lootboxes.
- Huizen, kastelen, stadions, sportauto's, raketten, winkels, universiteiten en andere objecten kopen.
- Objecten vrij op een persoonlijke wereldkaart plaatsen.

### Papa-dashboard

- Dagminimum per kind direct zichtbaar.
- Score, totale tijd en seconden per vraag.
- Automatische signalering bij veel fouten, herhaald lage scores, lange foutreeksen en heel snel willekeurig klikken.
- Volledige vraag-voor-vraagweergave: vraag, gekozen antwoord, juiste antwoord en reactietijd.
- Mislukte profielcodes zichtbaar.
- CSV-export, volledige JSON-back-up en voorgeschreven e-mailrapport.
- Optionele webhook voor automatische meldingen via bijvoorbeeld Make, Zapier of een eigen endpoint.

## Opslag en synchronisatie

De app slaat gegevens standaard lokaal in de browser op. Daardoor zijn er geen accounts, advertenties of externe trackers nodig.

Gegevens worden niet automatisch tussen meerdere apparaten gesynchroniseerd. Gebruik de JSON-back-up om gegevens te bewaren of over te zetten. Voor realtime synchronisatie en automatische e-mail is later een beveiligde backend nodig, bijvoorbeeld Supabase of Firebase.

## GitHub Pages

De gewenste repositorynaam is:

`levelup-leren`

De map bevat al een officiële GitHub Pages-workflow in `.github/workflows/pages.yml`.

1. Maak een lege repository `levelup-leren`.
2. Upload alle bestanden uit deze map.
3. Open **Settings → Pages** en kies **GitHub Actions**.
4. Na de workflow verschijnt de website op de GitHub Pages-link.

Met GitHub CLI kan `PUBLICEREN-OP-GITHUB.bat` dit grotendeels automatisch uitvoeren. GitHub kan daarbij om inloggen of toestemming vragen.

## Onderwijskundige status

De niveaus zijn oefenindicaties en geen officiële Cito-, IEP- of schoolresultaten. Het adaptieve systeem gebruikt recente nauwkeurigheid en patronen, maar verlaagt het niveau niet op basis van een sessie die als willekeurig doorklikken is gemarkeerd.
