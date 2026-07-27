# LevelUp Leren 4.0

LevelUp Leren is een lokale, responsive leer- en spelapp voor Dani, Zana en Lena. De app combineert dagelijkse minimumopdrachten, onbeperkt verder oefenen, adaptieve niveaus, uitlegmodules, verhalen, spellen, skins, een LevelShop, meerdere bouwwerelden en een uitgebreid ouderdashboard.

## Direct starten

### Eenvoudigst
Dubbelklik op `START-LEVELUP.bat` of open `START-HIER.html`. Deze standalone-versie heeft alle CSS en JavaScript in één bestand en vereist geen Python of lokale server.

### GitHub Pages
Pak de flat ZIP rechtstreeks uit in:

`C:\Users\Admin\Documents\GitHub\levelup-leren`

Daar moet `index.html` direct in staan. Upload/commit vervolgens de gewijzigde bestanden naar de bestaande repository `levelup-leren`. GitHub Pages blijft publiceren vanuit `main` en `/(root)`.

## Standaardcodes

- Dani: `1231`
- Zana: `1405`
- Lena: `3441`
- Papa-dashboard: `2580`

Alle codes zijn exact vier cijfers. Kinderen kunnen hun eigen profielcode wijzigen; papa kan alle codes in het dashboard beheren. Dit zijn lokale profielsloten, geen server-side beveiliging.

## Belangrijkste verbeteringen in 4.0

### Slimmere antwoordcontrole
Tijd, lengte, geld, getallen en breuken worden inhoudelijk geïnterpreteerd. Voorbeelden die als gelijk worden herkend:

- `16:00`, `16.00`, `1600`, `16 uur`
- `3 m 50 cm`, `3m50cm`, `350 cm`, `3,5 m`
- `€ 12,50`, `12,50`, `12.50`
- `1/2`, `0,5`, `50%`

Bij tijd, maten en breuken verschijnt een volledig toetsenbord plus handige invoerknoppen.

### Lena – groep 2

- automatische voorleesfunctie voor verhalen, vragen en antwoordopties;
- grote toeterknoppen en extra grote pictogrammen;
- veel bredere mix van letters, aantallen, patronen, vormen, luistervragen en fantasieverhalen;
- uitlegmodules voor alfabet en getalbegrip;
- kinderwerelden rond unicorns, elfjes, dieren, snoep en oceaan.

### Dani – groep 5 als uitgangspunt

- 20 gevarieerde rekensommen per sessie met timer;
- delen en breuken verschijnen pas na een aparte visuele uitlegmodule;
- slimmere uitleg met voetbal, teams, pizza's en controle met keersommen;
- langere voetbal-, mysterie-, alien-, uitvindings- en familieavonturen;
- optionele hardop-leescoach.

### Zana – groep 8/brugklas als uitgangspunt

- langere verhalen en dossiers van circa 800–860 woorden;
- thema's rond vriendschappen, social media, hockey, school, reizen, mode, leiderschap, ondernemerschap, ethiek en mysteries;
- 11 inhoudelijke vragen per verhaal over bewijs, bronnen, motieven, argumentatie, impliciete informatie en conclusies;
- niveau kan adaptief doorgroeien tot middelbare-schoollabels, waaronder 3 VWO en hoger;
- uitlegmodules voor algebra en bronnen beoordelen.

### Verhalenbibliotheek

De generator biedt per kind ruim meer dan 1.000 reproduceerbare verhaalvarianten:

- Dani: 24.000 mogelijke combinaties;
- Zana: 1.600 mogelijke combinaties;
- Lena: 1.800 mogelijke combinaties.

De eerste 1.000 gegenereerde verhaal-ID's per kind zijn automatisch op uniekheid getest.

### Spellen en samen spelen

- boter-kaas-en-eieren tegen Robo of lokaal met twee spelers;
- vier op een rij tegen Robo of lokaal met twee spelers;
- Sudoku op leeftijdsniveau;
- Memory;
- bewegende Focus Arcade;
- kleurgeheugen;
- reactieduel voor twee spelers;
- doolhofmissies;
- woordjacht;
- Patroon Pop.

Spelcoins zijn begrensd per dag zodat oefenen de belangrijkste inkomstenbron blijft.

### LevelShop en werelden

De winkel bevat 84 objecten en cosmetische onderdelen. Kinderen kunnen outfits, haar, accessoires, pets, emotes, voertuigen, gebouwen en wereldobjecten kopen zonder echt geld. Elk kind heeft meerdere geanimeerde zones die afzonderlijk kunnen worden ingericht.

### Papa-dashboard 4.0

- dagminimum per kind direct zichtbaar;
- score, tijd, niveau en recente trend;
- waarschuwingen bij zeer snelle fouten, lange foutreeksen, lage scores en mogelijk willekeurig klikken;
- foutclusters per onderwerp;
- status van uitlegmodules;
- ieder gegeven antwoord, de slimme interpretatie en het juiste antwoord;
- hardop-leesanalyse met groen herkende, rood anders herkende en oranje gemiste woorden;
- CSV-export, back-up en optionele webhookwaarschuwingen.

## Hardop-leescoach

De meeleesfunctie gebruikt de ingebouwde spraakherkenning van de browser. Chrome op een computer of Android ondersteunt dit doorgaans het best. Browserherkenning kan fouten maken en is geen officiële leesdiagnose. De app slaat geen audio op; alleen het herkende transcript en de woordvergelijking worden lokaal opgeslagen.

## Opslag en privacy

Voortgang wordt opgeslagen in `localStorage` op het gebruikte apparaat. Bestaande LevelUp Leren 3.0-gegevens worden automatisch gemigreerd. Voor synchronisatie tussen meerdere apparaten is later een backend of accountlaag nodig. Publiceer nooit echte wachtwoorden of gevoelige gegevens in de broncode van een openbare GitHub-repository.

## Curriculumrichting

De actieve inhoud concentreert zich bewust op:

- Lena: groep 2;
- Dani: groep 5;
- Zana: groep 8 en brugklas 1.

De adaptieve architectuur en niveaulabels zijn voorbereid op verdere uitbreiding richting kader, mavo, havo en vwo, inclusief latere vakken zoals biologie, natuurkunde en scheikunde. Die volledige bovenbouwinhoud is nog niet als complete leermethode gevuld.
