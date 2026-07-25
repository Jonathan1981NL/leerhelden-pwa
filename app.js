
"use strict";

const STORAGE_KEY = "leerhelden-v1";
const todayKey = () => new Date().toISOString().slice(0, 10);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const shuffle = arr => [...arr].sort(() => Math.random() - .5);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const formatDate = iso => new Intl.DateTimeFormat("nl-NL", {day:"2-digit", month:"short", year:"numeric"}).format(new Date(iso));
const formatTime = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;

const PROFILE_META = {
  dani: {
    name: "Dani", age: 8, grade: "midden groep 5", icon: "⚽",
    subtitle: "Sterke spits, uitvinder en missieheld",
    theme: "Stadion van de Toekomst",
    subjects: ["reading","spelling","math"],
    subjectLabels: {reading:"Lezen", spelling:"Spelling", math:"Rekenen"},
    subjectIcons: {reading:"📖", spelling:"✍️", math:"🧮"},
    worldPieces: ["🌳","🪵","🛖","🪜","🏟️","🥅","🏆","🚀","🛸","🦖","🏰","🏎️"],
    tags: ["Voetbal", "Kracht", "Avontuur", "Uitvinden"]
  },
  zana: {
    name: "Zana", age: 11, grade: "groep 8 + brugklas challenge", icon: "🏑",
    subtitle: "Toekomstige CEO, wereldstudent en hockeystrateeg",
    theme: "Future Campus",
    subjects: ["reading","spelling","math","english","world"],
    subjectLabels: {reading:"Begrijpend lezen", spelling:"Taal", math:"Rekenen", english:"Engels", world:"Wereld"},
    subjectIcons: {reading:"📚", spelling:"🖋️", math:"📊", english:"🇬🇧", world:"🌍"},
    worldPieces: ["🏑","🎓","🏫","📚","💎","🏢","✈️","🇬🇧","🇺🇸","🏊‍♀️","👑","🌆"],
    tags: ["Hockey", "Leiderschap", "Engels", "Uitdaging"]
  }
};

const DANI_READINGS = [
  {
    level: 2, title:"De verdwenen wedstrijdbal",
    story:`Dani stond als eerste op het voetbalveld. De zon kwam net boven de huizen uit en het gras was nog nat. Vandaag speelde zijn team de halve finale. Dani had de hele week geoefend op aannemen, kijken en pas daarna schieten. Papa Jonathan noemde dat zijn drietrapsraket.

Coach Sam wilde beginnen, maar de wedstrijdbal was verdwenen. Alleen een rij modderige afdrukken liep naar het materiaalhok. Dani rende erheen, stopte plotseling en keek goed. “Niet zomaar naar binnen stormen,” zei hij tegen zichzelf. “Eerst kijken, dan denken, dan doen.”

In het hok zat Lena op een omgekeerde emmer. Naast haar lag de bal. Ze had hem meegenomen omdat ze dacht dat het een grote hockeybal was. Zana lachte en legde uit dat hockeyballen veel kleiner zijn. Lena gaf de bal terug en kreeg van Dani een high five.

Tijdens de wedstrijd stond het vlak voor tijd 2-2. Dani kreeg de bal, maar drie verdedigers kwamen op hem af. Iedereen verwachtte een hard schot. Dani zag echter dat zijn maatje vrijstond. Hij gaf een slimme pass. Doelpunt! Dani had niet zelf gescoord, maar voelde zich toch de held van de wedstrijd. Hij had gekeken, gedacht en precies op tijd gehandeld.`,
    questions:[
      {q:"Waarom ging Dani niet meteen het materiaalhok in?", options:["Hij was bang voor het donker.","Hij wilde eerst goed kijken en nadenken.","Hij moest op de coach wachten.","Hij zocht zijn schoenen."], a:1, explain:"Dani gebruikt zijn drietrapsraket: eerst kijken, dan denken, dan doen."},
      {q:"Wat is de belangrijkste boodschap van het verhaal?", options:["Alleen doelpuntenmakers zijn helden.","Een hockeybal is groter dan een voetbal.","Slim samenwerken kan belangrijker zijn dan zelf scoren.","Je moet altijd als eerste op het veld zijn."], a:2, explain:"Dani kiest voor de beste oplossing voor het team."},
      {q:"Waardoor weet je dat Dani zich goed kon beheersen?", options:["Hij stopte voordat hij het hok in rende.","Hij gaf Lena een high five.","Hij oefende de hele week.","Hij stond als eerste op het veld."], a:0, explain:"Stoppen en eerst kijken laat zien dat hij zijn impuls beheerst."}
    ]
  },
  {
    level: 3, title:"De Afleidings-Alien",
    story:`In de rust van een belangrijke wedstrijd zat Dani op de bank. Zijn team stond met 1-0 achter. Coach Sam tekende een plan op het bord: de linksbuiten moest breed blijven, Dani moest eerst naar de bal toe komen en daarna diep sprinten.

Dani keek aandachtig. Tenminste, dat probeerde hij. Op de rand van het bord landde in zijn fantasie een piepkleine groene alien. Het beest droeg een koptelefoon en fluisterde: “Kijk eens naar die vogel. Denk eens aan een Lamborghini. Hoeveel snoepjes passen er eigenlijk in een voetbalschoen?”

Dani moest bijna lachen. Hij kende deze alien. Het was de Afleidings-Alien, die precies verscheen wanneer iets belangrijk was. Dani drukte zijn duim tegen zijn wijsvinger. Dat was zijn geheime focusknop. Daarna herhaalde hij in zijn hoofd drie woorden: komen, kijken, sprinten.

Na rust kwam de pass van Zaid. Dani liep eerst naar de bal. De verdediger volgde hem. Meteen draaide Dani om en sprintte de ruimte in. Hij kreeg de bal terug en schoot laag in de hoek: 1-1.

In de laatste minuut verscheen de alien opnieuw. Op de tribune zwaaide Lena met een veel te grote sjaal en Zana riep iets over hockey. Dani glimlachte, drukte zijn focusknop in en keek weer naar het spel. Hij onderschepte een pass en gaf de voorzet voor de winnende treffer.

Thuis schreef hij op een kaartje: “Afleiding is niet de baas. Ik merk haar op en kies opnieuw.” Het kaartje legde hij naast zijn bed.`,
    questions:[
      {q:"Wat stelt de Afleidings-Alien in het verhaal voor?", options:["Een echte tegenstander","Dani's gedachten die hem afleiden","De scheidsrechter","Een mascotte van de club"], a:1, explain:"De alien is een grappig beeld voor afleidende gedachten."},
      {q:"Welke drie woorden helpen Dani het plan te onthouden?", options:["rennen, springen, juichen","komen, kijken, sprinten","passen, koppen, vallen","stoppen, eten, slapen"], a:1, explain:"Hij maakt het plan klein en onthoudbaar."},
      {q:"Welke zin vat Dani's oplossing het best samen?", options:["Afleiding mag nooit bestaan.","Je moet aan iets anders denken.","Je merkt afleiding op en brengt je aandacht terug.","Alleen een coach kan je laten focussen."], a:2, explain:"Focus is niet nooit afgeleid zijn; het is steeds terugkeren."}
    ]
  },
  {
    level: 3, title:"De haai onder het zwembad",
    story:`Na de wedstrijd gingen Dani, Zana en Lena zwemmen. Dani wilde van de hoge duikplank, maar onder water zag hij een donkere schaduw. In één seconde dacht hij aan alle haaienfilms die hij ooit had gezien.

“Er zit iets onder mij,” fluisterde hij tegen Zana.

Zana zette haar zwembril op en keek. De schaduw bewoog langzaam heen en weer. “Misschien is het een haai,” zei ze ernstig. Daarna begon ze te lachen. “Of de schoonmaakrobot.”

Dani wilde zeker weten wat het was. Hij vroeg de badmeester om uitleg. De badmeester vertelde dat een machine over de bodem reed en vuil opzoog. Door het golvende water leek de machine veel groter.

Dani sprong alsnog. Onder water keek hij naar de robot. Van dichtbij zag hij wieltjes, een slang en een lampje. Geen tanden. Geen vin. Geen haai.

Later bedacht Dani een uitvinding: een zwembadrobot in de vorm van een vriendelijke dolfijn. Op de bovenkant moest een scherm komen dat liet zien hoeveel vuil hij had opgezogen. “Daar word ik miljonair mee,” zei Dani.

“Alleen wanneer je eerst een goed ontwerp maakt,” zei moeder Lana.

Dani pakte papier. Hij tekende niet alleen de buitenkant, maar schreef ook wat de robot moest kunnen. Angst was veranderd in nieuwsgierigheid, en nieuwsgierigheid in een plan.`,
    questions:[
      {q:"Waarom leek de schoonmaakrobot op een groot dier?", options:["Hij had echte vinnen.","Het water liet de schaduw groter en golvend lijken.","Zana duwde hem vooruit.","Het zwembad was donker gemaakt."], a:1, explain:"De beweging van het water vervormde de schaduw."},
      {q:"Hoe verandert Dani in het verhaal?", options:["Van boos naar moe","Van bang naar nieuwsgierig en ondernemend","Van vrolijk naar verdrietig","Van sterk naar zwak"], a:1, explain:"Hij onderzoekt zijn angst en maakt er een uitvinding van."},
      {q:"Waarom schrijft Dani op wat de robot moet kunnen?", options:["Een ontwerp gaat ook over functies, niet alleen uiterlijk.","Hij wil meer papier gebruiken.","Lana wil dat hij een verhaal schrijft.","De badmeester vraagt erom."], a:0, explain:"Een goede uitvinding moet een probleem oplossen."}
    ]
  },
  {
    level: 4, title:"De finale in het onweer",
    story:`De finale van het jeugdtoernooi begon onder een staalgrijze lucht. Dani voelde zich sterk. Hij had die ochtend tien keer netjes opgedrukt en in de warming-up vloog ieder schot richting kruising. Toch liep de eerste helft anders dan verwacht. De tegenstander verdedigde compact en lokte Dani telkens naar de zijkant.

Bij rust stond het 0-0. In de verte klonk een doffe dreun. De scheidsrechter keek omhoog en overlegde met de coaches. Nog voordat iemand een besluit nam, lichtte de hemel op. De wedstrijd werd stilgelegd en iedereen moest naar de kleedkamers.

Sommige spelers mopperden. Dani wilde dat eerst ook doen. Hij was net lekker bezig. Toen zag hij dat een jongere speler gespannen naar het raam keek. Dani ging naast hem zitten en vertelde over de Afleidings-Alien. “Je hoofd kan van alles roepen,” zei hij. “Maar wij kiezen wat we nu doen.”

Coach Sam gebruikte de pauze om het tactische probleem uit te leggen. Niet Dani moest steeds achter de verdediging rennen; een middenvelder moest juist in de ruimte vóór de verdediging komen. Dani kon dan wegtrekken en ruimte maken.

Na twintig minuten trok het onweer voorbij. De wedstrijd werd hervat. Dani maakte twee felle loopacties zonder de bal. Daardoor kwam Zaid vrij in het midden. Bij de derde keer kreeg Zaid de bal en schoot de 1-0 binnen.

Dani scoorde niet, maar coach Sam gaf hem na afloop een bijzondere beker: de Ruimtemaker. “De beste spelers zien niet alleen waar de bal is,” zei de coach. “Ze begrijpen ook wat hun beweging met anderen doet.”`,
    questions:[
      {q:"Waarom werd de wedstrijd stilgelegd?", options:["Het veld was te klein.","De spelers waren moe.","Onweer maakte doorspelen onveilig.","De tegenstander wilde overleggen."], a:2, explain:"Bij bliksem en onweer is stoppen een veiligheidsmaatregel."},
      {q:"Wat veranderde er tactisch na de pauze?", options:["Dani ging keepen.","Dani maakte ruimte zodat een middenvelder vrij kwam.","Iedereen bleef achterin.","Zaid ging steeds naar de zijkant."], a:1, explain:"Dani's loopacties trokken verdedigers weg."},
      {q:"Waarom past de beker 'Ruimtemaker' goed bij Dani?", options:["Hij ruimde de kleedkamer op.","Hij maakte door zijn beweging ruimte voor een teamgenoot.","Hij bouwde een grotere tribune.","Hij stond ver van de bal."], a:1, explain:"De naam heeft een letterlijke én tactische betekenis."}
    ]
  },
  {
    level: 5, title:"Dani en de uitvinding voor Oranje",
    story:`Jaren later trainde Dani met Oranje voor de finale van het wereldkampioenschap. De temperatuur was hoog en het stadion voelde als een oven. Tijdens de laatste training merkte Dani dat spelers steeds later reageerden. Niet omdat ze niet fit waren, maar omdat vermoeidheid hun keuzes vertraagde.

Dani dacht terug aan zijn oude focusknop. Eén speler kon daarmee zijn aandacht terughalen, maar hoe hielp je een heel team? Samen met Zana, die inmiddels internationale ervaring had met sportdata, ontwierp hij een polsband. De band gaf geen lange instructies. Hij trilde slechts één keer wanneer een speler te lang naar de bal bleef kijken en twee keer wanneer er achter hem ruimte ontstond.

De voetbalbond twijfelde. Technologie mocht de wedstrijd niet oneerlijk maken. Dani legde uit dat de band geen oplossing voorspelde en geen opdrachten van buitenaf ontving. Hij hielp spelers alleen om waar te nemen wat zij zelf konden zien. Na controle werd het systeem toegestaan.

In de finale stond Nederland met 1-0 achter. Dani voelde één trilling. Hij keek los van de bal en zag de rechtsback opkomen. Twee minuten later voelde hij twee trillingen, draaide open en stuurde zijn ploeggenoot de vrije ruimte in: 1-1.

Vlak voor tijd kreeg Nederland een strafschop. Dani legde de bal neer. Op dat moment schakelde hij de band uit. Sommige beslissingen wilde hij helemaal zelf nemen. Hij ademde rustig in, koos zijn hoek en schoot. Wereldkampioen.

Na afloop vroeg een verslaggever hoeveel de uitvinding waard was. Dani keek naar de beker. “Misschien miljoenen,” zei hij. “Maar vandaag was hij vooral één slimme herinnering op het juiste moment.”`,
    questions:[
      {q:"Welk probleem probeert Dani met de polsband op te lossen?", options:["Spelers hebben te weinig kracht.","Vermoeidheid vertraagt waarneming en keuzes.","De temperatuur kan niet worden gemeten.","De scheidsrechter ziet buitenspel niet."], a:1, explain:"De band ondersteunt aandacht en oriëntatie wanneer spelers vermoeid raken."},
      {q:"Waarom wordt de technologie toch toegestaan?", options:["Hij voorspelt ieder doelpunt.","Hij ontvangt geheime instructies.","Hij ondersteunt waarneming zonder de oplossing voor te zeggen.","Alle teams krijgen automatisch een doelpunt."], a:2, explain:"De speler blijft zelf waarnemen en beslissen."},
      {q:"Waarom schakelt Dani de band uit voor de strafschop?", options:["De batterij is leeg.","Hij wil verantwoordelijkheid voor die keuze zelf dragen.","De verslaggever vraagt dat.","De band mag alleen bij verdedigen."], a:1, explain:"Dit benadrukt zelfstandigheid en vertrouwen."}
    ]
  }
];

const ZANA_READINGS = [
  {
    level:3, title:"De selectie die niemand verwachtte",
    story:`Zana's hockeyteam kreeg vlak voor een belangrijk toernooi een nieuwe trainer. Tijdens de eerste training verdeelde hij geen hesjes op basis van vaste posities. In plaats daarvan liet hij iedereen drie verschillende rollen spelen. Sommige speelsters vonden dat onrustig. Zana was gewend om op het middenveld het spel te verdelen en zag niet direct waarom zij ook als verdediger moest spelen.

Na de training legde de trainer uit dat een team sterker wordt wanneer spelers begrijpen welke informatie hun teamgenoten nodig hebben. Een middenvelder die ooit als verdediger heeft gespeeld, herkent eerder wanneer een pass riskant is. Een aanvaller die een wedstrijd op het middenveld heeft ervaren, begrijpt beter wanneer zij druk moet zetten.

Tijdens het toernooi raakte de vaste verdediger licht geblesseerd. Zana nam haar plek over. Ze merkte dat ze niet alleen beter verdedigde, maar ook haar teamgenoten gerichter coachte. Haar ervaring op verschillende posities bleek geen omweg, maar voorbereiding.`,
    questions:[
      {q:"Wat is het hoofddoel van de trainer?", options:["Iedereen onzeker maken","Spelers verschillende perspectieven leren begrijpen","De vaste opstelling geheimhouden","Minder trainen op techniek"], a:1, explain:"De wisselende rollen vergroten tactisch begrip."},
      {q:"Welke relatie bestaat tussen alinea 2 en 3?", options:["Alinea 3 geeft een praktijkvoorbeeld van de uitleg in alinea 2.","Alinea 3 spreekt alinea 2 volledig tegen.","Beide alinea's gaan over een ander team.","Alinea 2 beschrijft alleen het eindresultaat."], a:0, explain:"De blessure maakt zichtbaar waarom rolbegrip nuttig is."},
      {q:"Wat betekent 'geen omweg, maar voorbereiding'?", options:["De training duurde te lang.","Een onverwachte ervaring bleek later nuttig.","Zana liep via een andere route.","De trainer veranderde het toernooi."], a:1, explain:"Wat eerst niet nodig leek, had later duidelijke waarde."}
    ]
  },
  {
    level:4, title:"De campus van 2040",
    story:`Een internationale universiteit kondigde aan in 2040 volledig klimaatneutraal te willen zijn. Nieuwe gebouwen zouden energie opwekken met zonnepanelen, regenwater opslaan en flexibel worden ingericht. Critici reageerden dat nieuwbouw juist veel grondstoffen kost en dat bestaande gebouwen beter gerenoveerd kunnen worden.

Het universiteitsbestuur liet vervolgens drie scenario's onderzoeken. In scenario A werd alles nieuw gebouwd. Scenario B bestond volledig uit renovatie. Scenario C combineerde renovatie met één nieuw, energiepositief gebouw. Uit het onderzoek bleek dat scenario B op korte termijn de laagste uitstoot veroorzaakte, maar dat scenario C na achttien jaar het gunstigst werd. Het nieuwe gebouw leverde dan meer energie dan het gebruikte en compenseerde een deel van de uitstoot van oudere gebouwen.

De discussie was daarmee niet afgelopen. De berekening hing af van aannames over levensduur, studentenaantallen en toekomstige energiebronnen. De universiteit koos voorlopig voor scenario C, maar beloofde de aannames elke drie jaar opnieuw te toetsen.`,
    questions:[
      {q:"Waarom is scenario C niet automatisch de beste keuze?", options:["Het gebruikt geen zonnepanelen.","De uitkomst hangt af van aannames en een lange periode.","Renovatie is wettelijk verboden.","Studenten mogen niet in nieuwe gebouwen."], a:1, explain:"De conclusie is afhankelijk van onzekere toekomstige factoren."},
      {q:"Welke tekststructuur overheerst?", options:["Probleem – opties – afweging – voorlopig besluit","Chronologische biografie","Instructie met stappenplan","Beschrijving van één persoon"], a:0, explain:"De tekst presenteert een vraagstuk, scenario's en een afgewogen keuze."},
      {q:"Welke bron zou de claim over achttien jaar het best controleren?", options:["Een reclamefolder van een aannemer","Het volledige onderzoeksrapport met methode en aannames","Een foto van de campus","Een interview met één student"], a:1, explain:"Daarin zijn de berekening en uitgangspunten controleerbaar."}
    ]
  },
  {
    level:5, title:"Wie bepaalt wat succesvol leiderschap is?",
    story:`In veel artikelen wordt een succesvolle leider voorgesteld als iemand die snel beslist, overtuigend spreekt en duidelijke doelen stelt. Dat beeld is aantrekkelijk, omdat zulke eigenschappen zichtbaar zijn. Minder zichtbaar is het vermogen om twijfel toe te laten, expertise van anderen te gebruiken en een besluit te herzien wanneer nieuwe informatie dat vraagt.

Onderzoekers die alleen naar winstgroei kijken, kunnen een andere leider als succesvol aanwijzen dan onderzoekers die ook personeelsverloop, innovatie en maatschappelijke gevolgen meten. Zelfs binnen één bedrijf kan een besluit op korte termijn winstgevend zijn en op lange termijn schadelijk blijken.

Daarom is de vraag “Wie is de beste leider?” zonder aanvullende criteria nauwelijks te beantwoorden. Een zorgvuldiger vraag is: “Welke vorm van leiderschap werkt, voor welke organisatie, onder welke omstandigheden en gedurende welke periode?” Dat antwoord is minder geschikt voor een opvallende krantenkop, maar waarschijnlijk bruikbaarder voor iemand die later zelf een organisatie wil leiden.`,
    questions:[
      {q:"Welke kritiek geeft de auteur op het gebruikelijke beeld van leiders?", options:["Leiders mogen nooit snel beslissen.","Zichtbare eigenschappen krijgen te veel aandacht ten opzichte van minder zichtbare kwaliteiten.","Winst is altijd onbelangrijk.","Alle leiders zijn hetzelfde."], a:1, explain:"De auteur pleit voor een breder beoordelingskader."},
      {q:"Waarom kan dezelfde leider verschillend worden beoordeeld?", options:["Onderzoekers gebruiken mogelijk andere criteria en termijnen.","Leiders veranderen elke dag van naam.","Winstgroei is niet meetbaar.","Personeelsverloop zegt altijd alles."], a:0, explain:"De gekozen maatstaven bepalen mede de conclusie."},
      {q:"Wat is de functie van de laatste vraag in de tekst?", options:["De lezer vermaken met een raadsel","De hoofdvraag nauwkeuriger en onderzoekbaar formuleren","Bewijzen dat leiderschap eenvoudig is","Een definitief antwoord geven"], a:1, explain:"De vraag specificeert context, organisatie en tijdshorizon."}
    ]
  }
];

const SPELLING_BANK = {
  dani: [
    {level:1,prompt:"Welk woord is goed gespeld?", answer:"trein", choices:["trijn","trein","tryn"], explain:"Bij dit woord hoor je /ei/ en schrijf je ei: trein."},
    {level:1,prompt:"Welk woord is goed gespeld?", answer:"goud", choices:["gaut","goud","gout"], explain:"Goud schrijf je met ou."},
    {level:2,prompt:"Welk woord is goed gespeld?", answer:"konijnen", choices:["konijnen","konijne","konnijnen"], explain:"Konijnen heeft ij en eindigt op -en."},
    {level:2,prompt:"Kies de juiste spelling.", answer:"voetbalwedstrijd", choices:["voetbal wedstrijd","voetbalwedstrijd","voetballwedstrijd"], explain:"Samenstellingen schrijf je aan elkaar."},
    {level:2,prompt:"Welke zin heeft de juiste leestekens?", answer:"Dani schiet. Wat een doelpunt!", choices:["dani schiet wat een doelpunt","Dani schiet. Wat een doelpunt!","Dani schiet, wat een doelpunt."], explain:"Een zin begint met een hoofdletter en eindigt met een passend leesteken."},
    {level:3,prompt:"Welk woord is goed gespeld?", answer:"gevaarlijk", choices:["gevaarelijk","gevaarlijk","gevaarlek"], explain:"Gevaarlijk schrijf je zonder extra e."},
    {level:3,prompt:"Kies het juiste meervoud.", answer:"auto's", choices:["autos","auto's","auto,s"], explain:"Na een klinker gebruik je hier een apostrof: auto's."},
    {level:3,prompt:"Welk woord past? De keeper ___ de bal.", answer:"vangt", choices:["vangt","vankt","vangd"], explain:"De stam is vang; bij hij/zij komt er een t bij."},
    {level:4,prompt:"Welk woord is correct?", answer:"onmiddellijk", choices:["onmiddelijk","onmiddellijk","onmidelijk"], explain:"Onmiddellijk heeft dubbel d en dubbel l."},
    {level:4,prompt:"Welke zin is correct?", answer:"De snelle spits verwachtte een lastige wedstrijd.", choices:["De snelle spits verwachte een lastige wedstrijd.","De snelle spits verwachtte een lastige wedstrijd.","De snelle spits verwagtte een lastige wedstrijd."], explain:"Verwachtte is verleden tijd: stam verwacht + te."},
    {level:5,prompt:"Kies de beste interpunctie.", answer:"Dani zei: “Ik blijf rustig, kijk op en speel de bal.”", choices:["Dani zei “Ik blijf rustig kijk op en speel de bal”.","Dani zei: “Ik blijf rustig, kijk op en speel de bal.”","Dani, zei: “Ik blijf rustig kijk op, en speel de bal.”"], explain:"Na 'zei' past een dubbele punt; de opsomming krijgt komma's."}
  ],
  zana: [
    {level:2,prompt:"Welke zin is correct?", answer:"Zana wordt later directeur.", choices:["Zana word later directeur.","Zana wordt later directeur.","Zana wort later directeur."], explain:"Bij zij/hij: stam + t, dus wordt."},
    {level:3,prompt:"Welke vorm past? Gisteren ___ zij de presentatie.", answer:"leidde", choices:["leide","leidde","lijdde"], explain:"Leiden krijgt in de verleden tijd -de: leidde."},
    {level:3,prompt:"Kies de juiste zin.", answer:"Hoewel het regende, ging de wedstrijd door.", choices:["Hoewel het regende ging, de wedstrijd door.","Hoewel het regende, ging de wedstrijd door.","Hoewel, het regende ging de wedstrijd door."], explain:"Na de bijzin aan het begin staat een komma."},
    {level:4,prompt:"Welke vorm past? De resultaten zijn zorgvuldig ___.", answer:"geanalyseerd", choices:["geanalyseert","geanalyseerd","geanaliseerd"], explain:"Het voltooid deelwoord is geanalyseerd."},
    {level:4,prompt:"Welke zin gebruikt de verwijswoorden correct?", answer:"Het bedrijf veranderde zijn strategie omdat die niet meer werkte.", choices:["Het bedrijf veranderde haar strategie omdat hij niet meer werkte.","Het bedrijf veranderde zijn strategie omdat die niet meer werkte.","Het bedrijf veranderde hun strategie omdat deze niet meer werkte."], explain:"Bedrijf is onzijdig; strategie is een de-woord."},
    {level:5,prompt:"Kies de stilistisch beste zin.", answer:"De directie herzag het besluit nadat nieuwe cijfers waren gepubliceerd.", choices:["De directie deed het besluit opnieuw anders omdat er cijfers kwamen.","De directie herzag het besluit nadat nieuwe cijfers waren gepubliceerd.","Nadat cijfers, de directie veranderde hun besluit."], explain:"Deze zin is grammaticaal correct, precies en bondig."},
    {level:5,prompt:"Welke zin is correct gespeld?", answer:"De ideeën van de commissie zijn financieel onderbouwd.", choices:["De ideëen van de commissie zijn financieel onderbouwt.","De ideeën van de commissie zijn financieel onderbouwd.","De ideeën van de kommissie zijn financiëel onderbouwd."], explain:"Ideeën krijgt een trema; onderbouwd is een voltooid deelwoord."}
  ]
};

const ENGLISH_BANK = [
  {level:2,prompt:"Choose the correct sentence.", answer:"She plays hockey every Saturday.", choices:["She play hockey every Saturday.","She plays hockey every Saturday.","She playing hockey every Saturday."], explain:"With she/he/it in the present simple, the verb usually gets -s."},
  {level:3,prompt:"Which word best completes the sentence? Zana wants to ___ at an international university.", answer:"study", choices:["study","studies","studied"], explain:"After 'to' we use the base form: to study."},
  {level:4,prompt:"Choose the best connector. The plan was ambitious; ___, the team completed it on time.", answer:"however", choices:["because","however","unless"], explain:"However introduces a contrast."},
  {level:5,prompt:"Which sentence is most formal?", answer:"I would appreciate further information about the programme.", choices:["Tell me more about it.","I would appreciate further information about the programme.","What's the deal with this course?"], explain:"This wording is precise and appropriate for a formal email."}
];

const WORLD_BANK = [
  {level:2,prompt:"Welke gebeurtenis vond het eerst plaats?", answer:"De uitvinding van de boekdrukkunst in Europa", choices:["De eerste maanlanding","De uitvinding van de boekdrukkunst in Europa","De oprichting van de Europese Unie"], explain:"De Europese boekdrukkunst ontstond in de vijftiende eeuw."},
  {level:3,prompt:"Waarom liggen veel grote steden aan een rivier?", answer:"Rivieren boden vervoer, water en handel.", choices:["Rivieren maken elk klimaat warmer.","Rivieren boden vervoer, water en handel.","Alle rivieren liggen aan zee."], explain:"Waterwegen waren belangrijk voor handel, drinkwater en bereikbaarheid."},
  {level:4,prompt:"Wat is een belangrijk verschil tussen weer en klimaat?", answer:"Weer gaat over korte tijd; klimaat over patronen van vele jaren.", choices:["Weer is wereldwijd en klimaat lokaal.","Weer gaat over korte tijd; klimaat over patronen van vele jaren.","Er is geen verschil."], explain:"Klimaat beschrijft langjarige gemiddelden en patronen."},
  {level:5,prompt:"Welke maatregel pakt vooral de oorzaak van klimaatverandering aan?", answer:"Minder fossiele brandstoffen verbranden", choices:["Hogere dijken bouwen","Meer airconditioning installeren","Minder fossiele brandstoffen verbranden"], explain:"Dit vermindert de uitstoot van broeikasgassen; dijken zijn vooral aanpassing."}
];

function defaultProfile(id) {
  const skills = {};
  PROFILE_META[id].subjects.forEach(s => skills[s] = {rating: id === "dani" ? 2.6 : 3.2, attempts:0, correct:0, streak:0, recent:[]});
  return {
    xp:0, coins:0, completed:0, buildStage:0, streakDays:0, lastActive:null,
    skills, sessions:[], achievements:[], daily:{date:"", completed:[], plan:[]},
    settings:{sound:true, focusMinutes:id==="dani"?8:12}
  };
}

function initialState() {
  return {
    version:1, currentProfile:null, view:"home", activeTask:null,
    parent:{email:"J_van_geelen@hotmail.com", pin:"2580", webhook:"", autoReport:false},
    profiles:{dani:defaultProfile("dani"), zana:defaultProfile("zana")}
  };
}

let state = loadState();
let focusStarted = null;
let focusInterval = null;
let inactivityTimer = null;
let recognition = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.profiles) return initialState();
    const base = initialState();
    for (const id of ["dani","zana"]) {
      saved.profiles[id] = {...base.profiles[id], ...saved.profiles[id]};
      saved.profiles[id].skills = {...base.profiles[id].skills, ...(saved.profiles[id].skills || {})};
    }
    return {...base, ...saved, parent:{...base.parent, ...(saved.parent || {})}};
  } catch { return initialState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function profile() { return state.profiles[state.currentProfile]; }
function meta() { return PROFILE_META[state.currentProfile]; }
function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}
function speak(text) {
  if (!profile()?.settings.sound || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "nl-NL"; u.rate = .95; speechSynthesis.speak(u);
}
function xpLevel(xp) { return Math.floor(xp / 250) + 1; }
function xpIntoLevel(xp) { return xp % 250; }
function ratingLabel(r) {
  if (state.currentProfile === "dani") {
    if (r < 2) return "begin gr. 5";
    if (r < 3) return "midden gr. 5";
    if (r < 4) return "eind gr. 5";
    return "plusniveau";
  }
  if (r < 2.5) return "basis gr. 8";
  if (r < 3.5) return "midden gr. 8";
  if (r < 4.4) return "eind gr. 8";
  return "brugklas H/V";
}
function ensureDaily() {
  const p = profile();
  const date = todayKey();
  if (p.daily.date !== date) {
    p.daily = {date, completed:[], plan: state.currentProfile === "dani"
      ? ["reading","spelling","math","reading","spelling"]
      : ["reading","math","spelling","reading","english","world"]};
    saveState();
  }
}
function categoryName(s) { return meta().subjectLabels[s] || s; }

function render() {
  clearInterval(focusInterval);
  if (!state.currentProfile) return renderProfiles();
  ensureDaily();
  if (state.view === "task" && state.activeTask) return renderTask();
  if (state.view === "parent") return renderParent();
  if (state.view === "world") return renderWorldPage();
  if (state.view === "progress") return renderProgress();
  renderHome();
}

function renderProfiles() {
  document.getElementById("app").innerHTML = `
    <main class="profile-screen">
      <section class="profile-wrap">
        <div class="brand" style="justify-content:center"><span class="brand-mark">⚡</span> LeerHelden</div>
        <h1>Wie gaat er op missie?</h1>
        <p>Kies je profiel. Jouw opdrachten, niveau en bouwwereld worden apart onthouden.</p>
        <div class="profile-grid">
          ${profileCard("dani")}
          ${profileCard("zana")}
        </div>
        <button class="ghost-btn" style="margin-top:22px" onclick="openParentFromProfiles()">🔐 Ouderomgeving</button>
      </section>
    </main>`;
}
function profileCard(id) {
  const m = PROFILE_META[id], p = state.profiles[id];
  return `<button class="profile-card ${id}" onclick="selectProfile('${id}')">
    <div class="profile-banner">${m.icon}</div>
    <div class="profile-body">
      <span class="eyebrow">${esc(m.grade)}</span>
      <h2>${m.name}</h2>
      <p>${m.subtitle}. Level ${xpLevel(p.xp)} · ${p.completed} missies voltooid.</p>
      <div class="tag-row">${m.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    </div>
  </button>`;
}
window.selectProfile = id => { state.currentProfile=id; state.view="home"; saveState(); render(); };
window.switchProfile = () => { state.currentProfile=null; state.view="home"; saveState(); render(); };
window.navigate = view => { state.view=view; state.activeTask=null; saveState(); render(); scrollTo(0,0); };

function shell(content, active="home") {
  return `<div class="app-shell">
    <header class="topbar">
      <div class="brand"><span class="brand-mark">⚡</span><span>LeerHelden</span></div>
      <div class="top-actions">
        <button class="icon-btn" title="Wissel profiel" onclick="switchProfile()">${meta().icon}</button>
        <button class="icon-btn" title="Ouderomgeving" onclick="openParent()">🔐</button>
      </div>
    </header>
    <main class="content">${content}</main>
    <nav class="bottom-nav" aria-label="Hoofdnavigatie">
      ${navButton("home","🏠","Missies",active)}
      ${navButton("world","🏗️","Bouwen",active)}
      ${navButton("progress","📈","Groei",active)}
      ${navButton("parent","🔐","Ouder",active,true)}
    </nav>
  </div>`;
}
function navButton(view, icon, label, active, parent=false) {
  return `<button class="nav-btn ${active===view?"active":""}" onclick="${parent?"openParent()":`navigate('${view}')`}"><span>${icon}</span>${label}</button>`;
}

function renderHome() {
  const p=profile(), m=meta(), done=p.daily.completed.length, total=p.daily.plan.length;
  const next = p.daily.plan.findIndex((_,i)=>!p.daily.completed.includes(i));
  const content=`
    <section class="hero">
      <div class="card hero-copy">
        <span class="eyebrow">Missiecentrum · ${new Intl.DateTimeFormat("nl-NL",{weekday:"long"}).format(new Date())}</span>
        <h1>${greeting()}, ${m.name}!</h1>
        <p class="lead">${homeMessage(done,total)} ${state.currentProfile==="dani" ? "Kleine focus, grote actie." : "Slim denken, sterk onderbouwen, ambitieus groeien."}</p>
        <div class="hero-stats">
          <div class="stat-chip"><span>🔥</span><div><strong>${p.streakDays}</strong><small>actieve dagen</small></div></div>
          <div class="stat-chip"><span>🪙</span><div><strong>${p.coins}</strong><small>bouwmunten</small></div></div>
        </div>
      </div>
      <div class="card" style="text-align:center">
        <div class="level-ring" style="--progress:${Math.round(xpIntoLevel(p.xp)/250*100)}%">
          <div class="level-ring-inner"><strong>${xpLevel(p.xp)}</strong><span>heldenlevel</span></div>
        </div>
        <div class="progress"><span style="--w:${Math.round(xpIntoLevel(p.xp)/250*100)}%"></span></div>
        <p style="color:var(--muted);margin:10px 0 0">${xpIntoLevel(p.xp)} / 250 XP tot het volgende level</p>
      </div>
    </section>

    <div class="grid-2">
      <section class="card">
        <div class="section-title" style="margin-top:0"><div><span class="eyebrow">Dagmissie</span><h2>${done}/${total} voltooid</h2></div><strong>${Math.round(done/total*100)}%</strong></div>
        <div class="progress" style="margin-bottom:16px"><span style="--w:${done/total*100}%"></span></div>
        <div class="quest-list">
          ${p.daily.plan.map((s,i)=>questItem(s,i,p.daily.completed.includes(i),i===next)).join("")}
        </div>
      </section>
      <section class="card world-card">
        <span class="eyebrow">Jouw bouwwereld</span>
        <h2>${m.theme}</h2>
        ${worldScene()}
      </section>
    </div>

    <div class="section-title"><div><span class="eyebrow">Slimme trainer</span><h2>Jouw actuele niveau</h2></div><p>Past zich per vaardigheid aan</p></div>
    <section class="card">
      <div class="skill-list">${m.subjects.map(skillRow).join("")}</div>
    </section>

    <div class="section-title"><div><span class="eyebrow">Focuskracht</span><h2>${state.currentProfile==="dani"?"Versla de Afleidings-Alien":"Werk in krachtige sprints"}</h2></div></div>
    <section class="card">
      <p class="lead">${state.currentProfile==="dani"
        ? "Een echte focusheld is niet nooit afgeleid. Hij merkt afleiding op en kiest opnieuw: kijk naar de opdracht, noem de volgende stap en ga verder."
        : "Kies één concrete opdracht, werk zonder meldingen en controleer aan het einde niet alleen je antwoord maar ook je redenering."}</p>
      <div class="tag-row">
        <span class="tag">1 opdracht tegelijk</span><span class="tag">${p.settings.focusMinutes} minuten</span><span class="tag">na afloop korte pauze</span>
      </div>
    </section>`;
  document.getElementById("app").innerHTML=shell(content,"home");
}
function greeting() {
  const h=new Date().getHours(); return h<12?"Goedemorgen":h<18?"Goedemiddag":"Goedenavond";
}
function homeMessage(done,total) {
  if(done===0) return "Je nieuwe dagmissie staat klaar.";
  if(done<total) return `Sterk begonnen: nog ${total-done} missie${total-done===1?"":"s"}.`;
  return "Dagmissie compleet. Je hebt vandaag echt gebouwd aan je brein.";
}
function questItem(subject,index,done,isNext) {
  const level=Math.round(profile().skills[subject].rating);
  return `<div class="quest ${done?"done":""}">
    <div class="quest-icon">${done?"✅":meta().subjectIcons[subject]}</div>
    <div><strong>${categoryName(subject)}</strong><small>${done?"Voltooid":`${ratingLabel(profile().skills[subject].rating)} · niveau ${level}`}</small></div>
    ${done?`<span>+⭐</span>`:`<button class="${isNext?"primary-btn":"ghost-btn"} small-btn" onclick="startDailyTask(${index})">${isNext?"Start":"Kies"}</button>`}
  </div>`;
}
function skillRow(subject) {
  const s=profile().skills[subject], pct=(s.rating-1)/4*100;
  return `<div class="skill-row"><span>${meta().subjectIcons[subject]} ${categoryName(subject)}</span><div class="progress"><span style="--w:${pct}%"></span></div><span class="skill-level">${s.rating.toFixed(1)}</span></div>`;
}

window.startDailyTask = index => {
  const subject=profile().daily.plan[index];
  const task=createTask(subject);
  state.activeTask={...task,dailyIndex:index,startedAt:Date.now(),questionIndex:0,score:0,answered:false,readConfirmed:false,attempts:0};
  state.view="task"; saveState(); render(); resetInactivity();
};

function createTask(subject) {
  const level=clamp(Math.round(profile().skills[subject].rating),1,5);
  if(subject==="reading") {
    const bank=state.currentProfile==="dani"?DANI_READINGS:ZANA_READINGS;
    const candidates=bank.filter(x=>Math.abs(x.level-level)<=1);
    const item=candidates[Math.floor(Math.random()*candidates.length)] || bank[0];
    return {type:"reading",subject,level:item.level,title:item.title,story:item.story,questions:item.questions};
  }
  if(subject==="spelling") {
    const bank=SPELLING_BANK[state.currentProfile];
    const candidates=bank.filter(x=>Math.abs(x.level-level)<=1);
    const item=candidates[Math.floor(Math.random()*candidates.length)] || bank[0];
    return {type:"choice",subject,level:item.level,title:categoryName(subject),prompt:item.prompt,answer:item.answer,choices:shuffle(item.choices),explain:item.explain};
  }
  if(subject==="math") return createMath(level);
  if(subject==="english") {
    const candidates=ENGLISH_BANK.filter(x=>Math.abs(x.level-level)<=1);
    const item=candidates[Math.floor(Math.random()*candidates.length)] || ENGLISH_BANK[0];
    return {type:"choice",subject,level:item.level,title:"English Challenge",prompt:item.prompt,answer:item.answer,choices:shuffle(item.choices),explain:item.explain};
  }
  const candidates=WORLD_BANK.filter(x=>Math.abs(x.level-level)<=1);
  const item=candidates[Math.floor(Math.random()*candidates.length)] || WORLD_BANK[0];
  return {type:"choice",subject,level:item.level,title:"Wereld Challenge",prompt:item.prompt,answer:item.answer,choices:shuffle(item.choices),explain:item.explain};
}

function createMath(level) {
  const isDani=state.currentProfile==="dani";
  let a,b,answer,prompt,explain;
  if(isDani) {
    if(level<=1) {
      a=20+Math.floor(Math.random()*60); b=5+Math.floor(Math.random()*20);
      answer=a+b; prompt=`${a} + ${b} = ?`; explain=`Splits ${b} in tientallen en eenheden en tel in stappen op.`;
    } else if(level===2) {
      const table=[3,4,6,7,8,9][Math.floor(Math.random()*6)]; b=2+Math.floor(Math.random()*9);
      answer=table*b; prompt=`${table} × ${b} = ?`; explain=`Denk aan de tafel van ${table}.`;
    } else if(level===3) {
      a=250+Math.floor(Math.random()*650); b=80+Math.floor(Math.random()*300);
      answer=a-b; prompt=`${a} − ${b} = ?`; explain="Trek eerst de honderdtallen en daarna de rest af, of gebruik kolomsgewijs rekenen.";
    } else if(level===4) {
      const price=[12.50,18.75,24.90][Math.floor(Math.random()*3)];
      const paid=[20,25,30][Math.floor(Math.random()*3)];
      answer=(paid-price).toFixed(2).replace(".",",");
      prompt=`Een voetbal kost € ${price.toFixed(2).replace(".",",")}. Je betaalt € ${paid.toFixed(2).replace(".",",")}. Hoeveel krijg je terug?`;
      explain="Trek de prijs af van het betaalde bedrag. Noteer euro's en centen.";
    } else {
      const total=[24,32,40][Math.floor(Math.random()*3)], den=[4,8][Math.floor(Math.random()*2)];
      answer=total/den; prompt=`Een team verdeelt ${total} bidons eerlijk over ${den} kratten. Hoeveel bidons zitten in elk krat?`;
      explain=`Dit is ${total} ÷ ${den}. Controleer met vermenigvuldigen.`;
    }
  } else {
    if(level<=2) {
      const pct=[10,20,25,50][Math.floor(Math.random()*4)]; a=[80,120,160,240][Math.floor(Math.random()*4)];
      answer=a*pct/100; prompt=`Hoeveel is ${pct}% van ${a}?`; explain="Zet het percentage om naar een handige breuk of bereken eerst 10%.";
    } else if(level===3) {
      a=[36,48,60][Math.floor(Math.random()*3)]; const num=[1,2,3][Math.floor(Math.random()*3)]; const den=[4,6,8][Math.floor(Math.random()*3)];
      answer=a*num/den; prompt=`Bereken ${num}/${den} van ${a}.`; explain=`Deel eerst door ${den} en vermenigvuldig daarna met ${num}.`;
    } else if(level===4) {
      const old=[60,80,120][Math.floor(Math.random()*3)], pct=[15,20,25][Math.floor(Math.random()*3)];
      answer=(old*(1-pct/100)).toFixed(2).replace(",00","").replace(".",",");
      prompt=`Een jas van € ${old.toFixed(2).replace(".",",")} krijgt ${pct}% korting. Wat is de nieuwe prijs?`;
      explain="Bereken eerst de korting en trek die af van de oorspronkelijke prijs.";
    } else {
      a=3+Math.floor(Math.random()*7); b=8+Math.floor(Math.random()*13); answer=b-a;
      prompt=`Los op: x + ${a} = ${b}. Welke waarde heeft x?`; explain=`Doe aan beide kanten de omgekeerde bewerking: ${b} − ${a}.`;
    }
  }
  return {type:"input",subject:"math",level,title:"Rekenmissie",prompt,answer:String(answer),explain};
}

function renderTask() {
  const t=state.activeTask;
  const elapsed=Math.floor((Date.now()-t.startedAt)/1000);
  const total = t.type==="reading" ? t.questions.length+1 : 1;
  const progress = t.type==="reading" ? (t.readConfirmed?1+t.questionIndex:0)/total*100 : (t.answered?100:20);
  const content=`
    <div class="task-shell">
      <div class="task-top">
        <button class="icon-btn" onclick="leaveTask()" aria-label="Sluiten">✕</button>
        <div class="progress"><span style="--w:${progress}%"></span></div>
        <strong id="taskTimer">${formatTime(elapsed)}</strong>
      </div>
      <section class="card task-card">
        <div class="focus-banner"><span style="font-size:28px">${state.currentProfile==="dani"?"👾":"🎯"}</span><div><strong>${state.currentProfile==="dani"?"Afleidings-Alien alarm":"Focus sprint actief"}</strong><small id="focusText">Eén opdracht. Rustig lezen. Dan pas antwoorden.</small></div></div>
        <div class="task-meta"><span class="pill">${meta().subjectIcons[t.subject]} ${categoryName(t.subject)}</span><span class="pill">Niveau ${t.level}</span><span class="pill">${ratingLabel(profile().skills[t.subject].rating)}</span></div>
        ${t.type==="reading"?readingTaskHtml(t):standardTaskHtml(t)}
      </section>
    </div>`;
  document.getElementById("app").innerHTML=content;
  focusInterval=setInterval(updateTimer,1000);
}
function updateTimer() {
  const el=document.getElementById("taskTimer");
  if(el && state.activeTask) el.textContent=formatTime(Math.floor((Date.now()-state.activeTask.startedAt)/1000));
}
function readingTaskHtml(t) {
  if(!t.readConfirmed) return `
    <span class="eyebrow">Hardop leesmissie</span><h1 style="font-size:clamp(30px,5vw,48px)">${esc(t.title)}</h1>
    <div class="story">${t.story.split("\n\n").map(p=>`<p>${esc(p)}</p>`).join("")}</div>
    <div class="read-tools">
      <button class="ghost-btn" onclick="readStoryAloud()">🔊 Voorbeeld voorlezen</button>
      <button class="ghost-btn" onclick="startSpeechCheck()">🎙️ Probeer meelezen</button>
      <button class="primary-btn" onclick="confirmRead()">✅ Ik heb het hardop gelezen</button>
    </div>
    <p class="hint" id="speechStatus">Lees rustig, let op punten en maak je stem levendig. Spraakcontrole werkt alleen in ondersteunde browsers; de vragen controleren het begrip.</p>`;
  const q=t.questions[t.questionIndex];
  const selected=t.selected;
  return `
    <span class="eyebrow">Vraag ${t.questionIndex+1} van ${t.questions.length}</span>
    <h2>${esc(q.q)}</h2>
    <div class="answer-grid">${q.options.map((o,i)=>`<button class="answer-btn ${selected===i?"selected":""} ${t.answered&&i===q.a?"correct":""} ${t.answered&&selected===i&&i!==q.a?"wrong":""}" onclick="selectReadingAnswer(${i})" ${t.answered?"disabled":""}>${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}</div>
    ${t.answered?`<div class="feedback ${selected===q.a?"good":"try"}"><strong>${selected===q.a?"Goed gezien!":"Bijna — kijk naar het bewijs in de tekst."}</strong><br>${esc(q.explain)}</div>`:""}
    <div class="task-actions"><span class="hint">Zoek bij twijfel de zin of aanwijzing terug.</span>${t.answered?`<button class="primary-btn" onclick="nextReadingQuestion()">${t.questionIndex===t.questions.length-1?"Missie afronden":"Volgende vraag"}</button>`:""}</div>`;
}
function standardTaskHtml(t) {
  return `
    <span class="eyebrow">${esc(t.title)}</span>
    <h1 style="font-size:clamp(30px,5vw,48px)">${esc(t.prompt)}</h1>
    ${t.type==="choice"
      ? `<div class="answer-grid">${t.choices.map(o=>`<button class="answer-btn ${t.selected===o?"selected":""} ${t.answered&&o===t.answer?"correct":""} ${t.answered&&t.selected===o&&o!==t.answer?"wrong":""}" onclick="selectChoice(decodeURIComponent('${encodeURIComponent(o)}'))" ${t.answered?"disabled":""}>${esc(o)}</button>`).join("")}</div>`
      : `<input id="answerInput" class="answer-input" inputmode="${t.subject==="math"?"decimal":"text"}" autocomplete="off" placeholder="Typ je antwoord" value="${esc(t.selected||"")}" oninput="state.activeTask.selected=this.value">`
    }
    ${t.answered?`<div class="feedback ${t.correct?"good":"try"}"><strong>${t.correct?"Sterk!":"Goede poging — leer van de uitleg."}</strong><br>${esc(t.explain)}${!t.correct?` Het juiste antwoord is <strong>${esc(t.answer)}</strong>.`:""}</div>`:""}
    <div class="task-actions"><span class="hint">${t.answered?"Controleer waarom het antwoord klopt.":"Werk rustig en controleer vóór je bevestigt."}</span>
      ${t.answered?`<button class="primary-btn" onclick="finishTask()">Missie afronden</button>`:`<button class="primary-btn" onclick="checkStandardAnswer()">Controleer</button>`}
    </div>`;
}
window.confirmRead=()=>{state.activeTask.readConfirmed=true;state.activeTask.questionIndex=0;saveState();render();};
window.readStoryAloud=()=>speak(state.activeTask.story);
window.selectReadingAnswer=i=>{
  const t=state.activeTask;if(t.answered)return;
  t.selected=i;t.answered=true;t.attempts++;if(i===t.questions[t.questionIndex].a)t.score++;
  saveState();render();
};
window.nextReadingQuestion=()=>{
  const t=state.activeTask;
  if(t.questionIndex<t.questions.length-1){t.questionIndex++;t.answered=false;t.selected=null;saveState();render();}
  else finishTask();
};
window.selectChoice=o=>{if(state.activeTask.answered)return;state.activeTask.selected=o;saveState();render();};
window.checkStandardAnswer=()=>{
  const t=state.activeTask;
  if(t.type==="input") {
    const input=document.getElementById("answerInput");
    t.selected=(input?.value||t.selected||"").trim();
  }
  if(!String(t.selected||"").trim()){showToast("Vul eerst een antwoord in.");return;}
  const normalize=x=>String(x).trim().toLowerCase().replace(/\s/g,"").replace(".",",");
  t.correct=normalize(t.selected)===normalize(t.answer);t.answered=true;t.attempts++;
  saveState();render();
};
window.leaveTask=()=>{
  if(confirm("Missie pauzeren? Je voortgang in deze opdracht wordt niet opgeslagen.")){state.activeTask=null;state.view="home";saveState();render();}
};

function startSpeechCheck() {
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const status=document.getElementById("speechStatus");
  if(!SR){status.textContent="Deze browser ondersteunt geen spraakherkenning. Lees hardop en gebruik daarna de begripvragen.";return;}
  recognition=new SR();recognition.lang="nl-NL";recognition.interimResults=true;recognition.continuous=true;
  let words=new Set();
  recognition.onresult=e=>{
    for(let i=e.resultIndex;i<e.results.length;i++) e.results[i][0].transcript.toLowerCase().split(/\W+/).filter(Boolean).forEach(w=>words.add(w));
    const storyWords=new Set(state.activeTask.story.toLowerCase().split(/\W+/).filter(w=>w.length>3));
    const coverage=[...words].filter(w=>storyWords.has(w)).length/Math.max(1,storyWords.size);
    status.textContent=`Meelezen actief · ongeveer ${Math.min(100,Math.round(coverage*220))}% herkend. Dit is alleen een hulpmiddel, geen cijfer.`;
  };
  recognition.onerror=()=>status.textContent="Spraakcontrole stopte. Lees gewoon verder; de begripvragen blijven leidend.";
  recognition.start();status.textContent="Microfoon actief. Begin rustig hardop te lezen.";
}
window.startSpeechCheck=startSpeechCheck;

async function finishTask() {
  const t=state.activeTask,p=profile(),skill=p.skills[t.subject];
  const elapsed=Math.max(1,Math.round((Date.now()-t.startedAt)/1000));
  let score;
  if(t.type==="reading") score=t.score/t.questions.length;
  else score=t.correct?1:0;
  const oldRating=skill.rating;
  updateSkill(skill,score,elapsed,t.level);
  const xp=Math.round(35+score*35+t.level*5);
  const coins=Math.round(2+score*3);
  p.xp+=xp;p.coins+=coins;p.completed++;
  p.buildStage=Math.min(meta().worldPieces.length,p.buildStage+1);
  updateDayStreak(p);
  if(!p.daily.completed.includes(t.dailyIndex)) p.daily.completed.push(t.dailyIndex);
  const session={
    date:new Date().toISOString(),subject:t.subject,title:t.title||t.prompt,level:t.level,
    score:Math.round(score*100),seconds:elapsed,ratingBefore:+oldRating.toFixed(2),ratingAfter:+skill.rating.toFixed(2)
  };
  p.sessions.unshift(session);p.sessions=p.sessions.slice(0,250);
  checkAchievements(p);
  state.activeTask=null;state.view="home";saveState();
  if(state.parent.autoReport && state.parent.webhook) sendWebhookReport(session);
  showReward({xp,coins,score,subject:t.subject,newPiece:p.buildStage});
}
function updateSkill(skill,score,seconds,taskLevel) {
  skill.attempts++;if(score>=.67)skill.correct++;
  skill.recent.push(score);skill.recent=skill.recent.slice(-6);
  if(score>=.85){skill.streak++;skill.rating+=skill.streak>=2?.18:.1;}
  else if(score>=.55){skill.streak=0;skill.rating+=.02;}
  else {skill.streak=0;skill.rating-=.16;}
  const recentAvg=skill.recent.reduce((a,b)=>a+b,0)/skill.recent.length;
  if(skill.recent.length>=4 && recentAvg>.9) skill.rating+=.12;
  if(skill.recent.length>=3 && recentAvg<.45) skill.rating-=.12;
  skill.rating=clamp(skill.rating,1,5);
}
function updateDayStreak(p) {
  const today=todayKey();
  if(!p.lastActive){p.streakDays=1;}
  else if(p.lastActive!==today){
    const diff=Math.round((new Date(today)-new Date(p.lastActive))/86400000);
    p.streakDays=diff===1?p.streakDays+1:1;
  }
  p.lastActive=today;
}
function checkAchievements(p) {
  const add=(id)=>{if(!p.achievements.includes(id))p.achievements.push(id);};
  if(p.completed>=1)add("first");
  if(p.completed>=10)add("ten");
  if(p.completed>=25)add("builder");
  if(p.streakDays>=3)add("focus3");
  if(Object.values(p.skills).some(s=>s.rating>=4.5))add("master");
}
function showReward(r) {
  const overlay=document.createElement("div");overlay.className="celebration";
  const perfect=r.score>=.99;
  overlay.innerHTML=`<div class="card reward-modal">
    <div class="reward-icon">${perfect?"🏆":"⭐"}</div>
    <span class="eyebrow">Missie voltooid</span>
    <h1>${perfect?"Perfect gespeeld!":"Sterke vooruitgang!"}</h1>
    <p class="lead">+${r.xp} XP · +${r.coins} bouwmunten<br>Je hebt een nieuw onderdeel toegevoegd aan ${meta().theme}.</p>
    <button class="primary-btn" id="rewardContinue">Bekijk je bouwwerk</button>
  </div>`;
  document.body.appendChild(overlay);confetti();
  speak(perfect?"Missie voltooid. Perfect gespeeld!":"Missie voltooid. Sterke vooruitgang!");
  document.getElementById("rewardContinue").onclick=()=>{overlay.remove();render();};
}
function confetti() {
  for(let i=0;i<38;i++){
    const c=document.createElement("i");c.className="confetti";
    c.style.left=Math.random()*100+"vw";c.style.background=`hsl(${Math.random()*360} 90% 65%)`;
    c.style.animationDelay=Math.random()*.5+"s";c.style.animationDuration=1.3+Math.random()*1.2+"s";
    document.body.appendChild(c);setTimeout(()=>c.remove(),2800);
  }
}

function worldScene() {
  const pieces=meta().worldPieces, stage=profile().buildStage;
  return `<div class="world-scene ${state.currentProfile==="zana"?"future":""}">
    <div class="build-grid">${pieces.map((p,i)=>`<span class="build-piece ${i<stage?"unlocked":""}" title="Onderdeel ${i+1}">${p}</span>`).join("")}</div>
    <div class="world-caption"><span>${stage}/${pieces.length} onderdelen</span><span>${stage===pieces.length?"WERELD COMPLEET 🏆":`Nog ${pieces.length-stage} te bouwen`}</span></div>
  </div>`;
}

function renderWorldPage() {
  const p=profile(), pieces=meta().worldPieces;
  const content=`
    <div class="section-title" style="margin-top:0"><div><span class="eyebrow">Bouwmodus</span><h1>${meta().theme}</h1></div><p>Iedere afgeronde missie plaatst één onderdeel</p></div>
    <section class="card world-card">${worldScene()}</section>
    <div class="grid-3" style="margin-top:18px">
      ${pieces.map((piece,i)=>`<div class="card" style="text-align:center;opacity:${i<p.buildStage?1:.48}"><div style="font-size:52px">${i<p.buildStage?piece:"🔒"}</div><strong>Onderdeel ${i+1}</strong><p style="color:var(--muted)">${i<p.buildStage?"Vrijgespeeld":"Voltooi nog een missie"}</p></div>`).join("")}
    </div>`;
  document.getElementById("app").innerHTML=shell(content,"world");
}

function renderProgress() {
  const p=profile(), total=p.sessions.length, avg=total?Math.round(p.sessions.reduce((a,b)=>a+b.score,0)/total):0;
  const achievements=[
    ["first","🚀","Eerste missie"],["ten","🔟","Tien missies"],["builder","🏗️","Meesterbouwer"],
    ["focus3","🔥","Drie dagen sterk"],["master","🧠","Niveaumeester"]
  ];
  const content=`
    <div class="section-title" style="margin-top:0"><div><span class="eyebrow">Groei-overzicht</span><h1>${meta().name}'s ontwikkeling</h1></div></div>
    <div class="report-grid">
      <div class="report-stat"><strong>${p.completed}</strong><small>missies</small></div>
      <div class="report-stat"><strong>${avg}%</strong><small>gemiddeld goed</small></div>
      <div class="report-stat"><strong>${p.streakDays}</strong><small>actieve dagen</small></div>
      <div class="report-stat"><strong>${xpLevel(p.xp)}</strong><small>heldenlevel</small></div>
    </div>
    <div class="grid-2" style="margin-top:18px">
      <section class="card"><span class="eyebrow">Vaardigheden</span><h2>Adaptief niveau</h2><div class="skill-list">${meta().subjects.map(skillRow).join("")}</div></section>
      <section class="card"><span class="eyebrow">Bekers</span><h2>Prestaties</h2><div class="grid-3">${achievements.map(([id,ic,n])=>`<div style="text-align:center;opacity:${p.achievements.includes(id)?1:.25}"><div style="font-size:43px">${ic}</div><small>${n}</small></div>`).join("")}</div></section>
    </div>
    <section class="card" style="margin-top:18px"><span class="eyebrow">Laatste missies</span><h2>Resultaten</h2>${sessionsTable(p.sessions.slice(0,12))}</section>`;
  document.getElementById("app").innerHTML=shell(content,"progress");
}

function sessionsTable(sessions) {
  if(!sessions.length)return `<div class="empty">Nog geen resultaten. De eerste missie vult dit overzicht.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Datum</th><th>Onderdeel</th><th>Opdracht</th><th>Score</th><th>Niveau</th><th>Tijd</th></tr></thead><tbody>
    ${sessions.map(s=>`<tr><td>${formatDate(s.date)}</td><td>${esc(categoryNameFor(s.subject))}</td><td>${esc(s.title)}</td><td><strong>${s.score}%</strong></td><td>${s.ratingBefore} → ${s.ratingAfter}</td><td>${formatTime(s.seconds)}</td></tr>`).join("")}
  </tbody></table></div>`;
}
function categoryNameFor(subject){
  for(const id of ["dani","zana"]) if(PROFILE_META[id].subjectLabels[subject]) return PROFILE_META[id].subjectLabels[subject];
  return subject;
}

window.openParent=()=> {
  const pin=prompt("Voer de oudercode in:");
  if(pin===state.parent.pin){state.view="parent";render();} else if(pin!==null) showToast("De code klopt niet.");
};
window.openParentFromProfiles=()=> {
  const pin=prompt("Voer de oudercode in:");
  if(pin===state.parent.pin){state.currentProfile="dani";state.view="parent";render();} else if(pin!==null) showToast("De code klopt niet.");
};

function renderParent() {
  const all=[...state.profiles.dani.sessions.map(x=>({...x,child:"Dani"})),...state.profiles.zana.sessions.map(x=>({...x,child:"Zana"}))].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const content=`
    <div class="section-title" style="margin-top:0"><div><span class="eyebrow">Ouderomgeving</span><h1>Leer- en voortgangsrapport</h1></div></div>
    <div class="tabs">
      <button class="ghost-btn tab active">Overzicht</button>
      <button class="ghost-btn tab" onclick="exportCSV()">⬇ CSV</button>
      <button class="ghost-btn tab" onclick="exportJSON()">⬇ Back-up</button>
      <button class="ghost-btn tab" onclick="emailReport()">✉ E-mailrapport</button>
    </div>
    <div class="grid-2">
      ${parentChildCard("dani")}
      ${parentChildCard("zana")}
    </div>
    <section class="card" style="margin-top:18px">
      <span class="eyebrow">Alle activiteit</span><h2>Recente resultaten</h2>
      ${parentSessionsTable(all.slice(0,30))}
    </section>
    <section class="card" style="margin-top:18px">
      <span class="eyebrow">Rapportage & privacy</span><h2>Instellingen</h2>
      <div class="settings-grid">
        <label>Rapportadres<input class="settings-input" id="parentEmail" type="email" value="${esc(state.parent.email)}"><small>Voor de e-mailknop en rapportinstellingen.</small></label>
        <label>Oudercode<input class="settings-input" id="parentPin" inputmode="numeric" value="${esc(state.parent.pin)}"><small>Lokale toegangscode; geen echte serverbeveiliging.</small></label>
        <label style="grid-column:1/-1">Optionele webhook-URL<input class="settings-input" id="webhook" type="url" placeholder="https://..." value="${esc(state.parent.webhook)}"><small>Voor automatisch e-mailen via bijvoorbeeld Make, Zapier of Formspree. Zonder externe dienst blijven gegevens veilig lokaal opgeslagen.</small></label>
        <div class="toggle-line" style="grid-column:1/-1"><div><strong>Automatisch rapport na iedere missie</strong><small style="display:block;color:var(--muted)">Werkt alleen wanneer een webhook is ingevuld.</small></div><input id="autoReport" type="checkbox" ${state.parent.autoReport?"checked":""}></div>
      </div>
      <div class="task-actions"><span class="hint">Gegevens staan standaard alleen op dit apparaat in localStorage.</span><button class="primary-btn" onclick="saveParentSettings()">Instellingen opslaan</button></div>
    </section>
    <section class="card" style="margin-top:18px">
      <span class="eyebrow">Onderhoud</span><h2>Gegevensbeheer</h2>
      <div class="tag-row"><button class="ghost-btn" onclick="restoreBackup()">Back-up terugzetten</button><button class="ghost-btn" onclick="resetToday()">Dagmissie opnieuw maken</button><button class="ghost-btn" style="color:var(--danger)" onclick="resetAll()">Alle gegevens wissen</button></div>
    </section>`;
  document.getElementById("app").innerHTML=shell(content,"parent");
}
function parentChildCard(id) {
  const p=state.profiles[id],m=PROFILE_META[id],avg=p.sessions.length?Math.round(p.sessions.reduce((a,b)=>a+b.score,0)/p.sessions.length):0;
  return `<section class="card"><span class="eyebrow">${m.grade}</span><h2>${m.icon} ${m.name}</h2>
    <div class="report-grid" style="grid-template-columns:1fr 1fr">
      <div class="report-stat"><strong>${p.completed}</strong><small>missies</small></div>
      <div class="report-stat"><strong>${avg}%</strong><small>gemiddeld</small></div>
    </div>
    <div class="skill-list" style="margin-top:16px">${m.subjects.map(s=>{
      const sk=p.skills[s];return `<div class="skill-row"><span>${m.subjectLabels[s]}</span><div class="progress"><span style="--w:${(sk.rating-1)/4*100}%"></span></div><span class="skill-level">${sk.rating.toFixed(1)}</span></div>`;
    }).join("")}</div>
  </section>`;
}
function parentSessionsTable(sessions){
  if(!sessions.length)return `<div class="empty">Nog geen resultaten.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Datum</th><th>Kind</th><th>Onderdeel</th><th>Score</th><th>Niveaubeweging</th><th>Tijd</th></tr></thead><tbody>
  ${sessions.map(s=>`<tr><td>${formatDate(s.date)}</td><td>${s.child}</td><td>${categoryNameFor(s.subject)}</td><td>${s.score}%</td><td>${s.ratingBefore} → ${s.ratingAfter}</td><td>${formatTime(s.seconds)}</td></tr>`).join("")}
  </tbody></table></div>`;
}
window.saveParentSettings=()=>{
  state.parent.email=document.getElementById("parentEmail").value.trim()||state.parent.email;
  state.parent.pin=document.getElementById("parentPin").value.trim()||state.parent.pin;
  state.parent.webhook=document.getElementById("webhook").value.trim();
  state.parent.autoReport=document.getElementById("autoReport").checked;
  saveState();showToast("Instellingen opgeslagen.");
};
function reportText() {
  const lines=["LEERHELDEN VOORTGANGSRAPPORT",`Gegenereerd: ${new Date().toLocaleString("nl-NL")}`,""];
  for(const id of ["dani","zana"]){
    const p=state.profiles[id],m=PROFILE_META[id];
    lines.push(`${m.name} — ${m.grade}`,`Missies: ${p.completed} | XP: ${p.xp} | Actieve dagen: ${p.streakDays}`);
    m.subjects.forEach(s=>lines.push(`- ${m.subjectLabels[s]}: niveau ${p.skills[s].rating.toFixed(1)} (${ratingLabelFor(id,p.skills[s].rating)})`));
    const recent=p.sessions.slice(0,5);
    recent.forEach(x=>lines.push(`  ${formatDate(x.date)} | ${m.subjectLabels[x.subject]} | ${x.score}% | ${formatTime(x.seconds)}`));
    lines.push("");
  }
  return lines.join("\n");
}
function ratingLabelFor(id,r){const old=state.currentProfile;state.currentProfile=id;const x=ratingLabel(r);state.currentProfile=old;return x;}
window.emailReport=()=>{
  const subject=encodeURIComponent(`LeerHelden rapport ${new Date().toLocaleDateString("nl-NL")}`);
  const body=encodeURIComponent(reportText());
  location.href=`mailto:${encodeURIComponent(state.parent.email)}?subject=${subject}&body=${body}`;
};
window.exportJSON=()=>{
  downloadFile(`leerhelden-backup-${todayKey()}.json`,JSON.stringify(state,null,2),"application/json");
};
window.exportCSV=()=>{
  const rows=[["datum","kind","onderdeel","opdracht","score_pct","tijd_seconden","niveau_voor","niveau_na"]];
  for(const id of ["dani","zana"]) state.profiles[id].sessions.forEach(s=>rows.push([s.date,PROFILE_META[id].name,categoryNameFor(s.subject),s.title,s.score,s.seconds,s.ratingBefore,s.ratingAfter]));
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
  downloadFile(`leerhelden-resultaten-${todayKey()}.csv`,csv,"text/csv;charset=utf-8");
};
function downloadFile(name,content,type){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
window.restoreBackup=()=>{
  const input=document.createElement("input");input.type="file";input.accept=".json,application/json";
  input.onchange=()=>{const f=input.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{
    try{const restored=JSON.parse(reader.result);if(!restored.profiles)throw new Error();state=restored;saveState();showToast("Back-up teruggezet.");render();}
    catch{alert("Dit bestand is geen geldige LeerHelden-back-up.");}
  };reader.readAsText(f);};input.click();
};
window.resetToday=()=>{if(confirm("De dagmissie van het gekozen profiel opnieuw maken?")){profile().daily.date="";saveState();render();}};
window.resetAll=()=>{if(confirm("Alle voortgang van Dani en Zana definitief wissen op dit apparaat?")){localStorage.removeItem(STORAGE_KEY);state=initialState();render();}};
async function sendWebhookReport(session){
  try{
    await fetch(state.parent.webhook,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      to:state.parent.email,subject:`LeerHelden: ${meta().name} voltooide een missie`,child:meta().name,session,report:reportText()
    })});
  }catch(e){console.warn("Automatisch rapport mislukt",e);}
}

function resetInactivity(){
  clearTimeout(inactivityTimer);
  inactivityTimer=setTimeout(()=>{
    const el=document.getElementById("focusText");
    if(el) {
      el.textContent=state.currentProfile==="dani"
        ?"👾 De Afleidings-Alien is gesignaleerd! Noem nu hardop je eerstvolgende stap."
        :"Korte reset: wat is precies de vraag, en welk bewijs of welke berekening heb je nodig?";
      speak(state.currentProfile==="dani"?"Afleidings alien alarm. Kies je volgende stap.":"Focus reset. Kies je volgende stap.");
    }
  },45000);
}
["click","keydown","touchstart"].forEach(ev=>document.addEventListener(ev,()=>{if(state.view==="task")resetInactivity();},{passive:true}));

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();window.deferredInstallPrompt=e;});

render();
