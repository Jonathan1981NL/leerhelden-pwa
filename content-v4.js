"use strict";
(function(){
const C=window.LEVELUP_CONTENT;
const {hash,rng,pick,shuffle,PROFILE_META,ACTIVITY_META,shopItems}=C;
const unique=(arr)=>[...new Set(arr)];
const q=(r,prompt,answer,wrong,explain,kind="begrip",extra={})=>({
  q:prompt,prompt,answer:String(answer),options:shuffle(r,unique([String(answer),...wrong.map(String)]).slice(0,4)),explain,kind,...extra
});

// ---------- Uitgebreide profielen en leerlijnen ----------
PROFILE_META.dani.worldZones=[
  {id:"stadium",name:"Voetbalwereld",icon:"🏟️",sky:"day"},{id:"home",name:"Droomhuis",icon:"🏡",sky:"sunset"},
  {id:"garage",name:"Supercar Garage",icon:"🏎️",sky:"neon"},{id:"space",name:"Ruimtestation",icon:"🚀",sky:"space"},
  {id:"adventure",name:"Avonturenpark",icon:"🦖",sky:"jungle"},{id:"dojo",name:"Kracht & Dojo",icon:"🥋",sky:"night"}
];
PROFILE_META.zana.worldZones=[
  {id:"campus",name:"Future Campus",icon:"🎓",sky:"day"},{id:"city",name:"CEO City",icon:"🌆",sky:"neon"},
  {id:"fashion",name:"Fashion District",icon:"🛍️",sky:"sunset"},{id:"hockey",name:"Hockey Arena",icon:"🏑",sky:"day"},
  {id:"travel",name:"World Traveller",icon:"✈️",sky:"space"},{id:"beach",name:"Beach & Pool",icon:"🏖️",sky:"sunset"}
];
PROFILE_META.lena.worldZones=[
  {id:"unicorn",name:"Unicornland",icon:"🦄",sky:"rainbow"},{id:"fairy",name:"Feeënbos",icon:"🧚",sky:"night"},
  {id:"animals",name:"Dierenstad",icon:"🐶",sky:"day"},{id:"candy",name:"Snoepkasteel",icon:"🍭",sky:"sunset"},
  {id:"hockey",name:"Mini Hockey",icon:"🏑",sky:"day"},{id:"ocean",name:"Zeemeerminbaai",icon:"🧜‍♀️",sky:"ocean"}
];
PROFILE_META.dani.free=unique([...PROFILE_META.dani.free,"learn-division","learn-fractions","learn-time","wordhunt"]);
PROFILE_META.zana.free=unique([...PROFILE_META.zana.free,"learn-algebra","learn-sources","wordhunt","strategy"]);
PROFILE_META.lena.free=unique([...PROFILE_META.lena.free,"learn-alphabet","learn-numbers","patternpop"]);
Object.assign(ACTIVITY_META,{
  "learn-division":{icon:"🍕",title:"Delen leren",desc:"Verdelen met voetbalteams, pizza en blokken"},
  "learn-fractions":{icon:"⚽",title:"Breuken leren",desc:"Delen van een veld en een pizza begrijpen"},
  "learn-time":{icon:"⏰",title:"Klokkijken",desc:"Tijdlijnen, trainingen en digitale tijden"},
  "learn-algebra":{icon:"🧩",title:"Algebra Lab",desc:"Onbekenden stap voor stap oplossen"},
  "learn-sources":{icon:"🔎",title:"Bronnencheck",desc:"Feit, mening, bias en bewijs onderscheiden"},
  "learn-alphabet":{icon:"🔤",title:"Alfabetavontuur",desc:"Letters zien, horen en samenvoegen"},
  "learn-numbers":{icon:"🌟",title:"Getallenwereld",desc:"Tellen, hoeveelheden en kleine sommen"},
  wordhunt:{icon:"🔎",title:"Woordjacht",desc:"Zoek woorden en kraak lettercodes"},
  strategy:{icon:"♟️",title:"Strategie Lab",desc:"Plannen, patronen en vooruitdenken"},
  patternpop:{icon:"🎈",title:"Patroon Pop",desc:"Tik kleuren en vormen in de goede volgorde"}
});

// ---------- Verhalenuniversum: ruim meer dan 1.000 combinaties per kind ----------
const daniMatches=[
  ["een zinderende bekerfinale","een verdediging die Dani dubbel dekte","de back aan de andere kant telkens ruimte liet"],
  ["een avondwedstrijd onder enorme lichtmasten","de keeper ieder schot leek te raden","de keeper vóór ieder schot naar één hoek leunde"],
  ["een internationaal jeugdtoernooi in Barcelona","het team door de hitte slordig werd","korte passes en rustig ademhalen de controle terugbrachten"],
  ["een straatvoetbaltoernooi tussen hoge gebouwen","de bal vaak tegen de boarding terugkaatste","Dani de kaats juist als extra medespeler kon gebruiken"],
  ["een wedstrijd in een kasteelstadion","een smalle gracht vlak naast de zijlijn lag","spelen door het midden veiliger en slimmer was"],
  ["de beslissende wedstrijd om promotie","iedereen zelf wilde scoren","de vrije speler steeds aan de tweede paal opdook"],
  ["een sneeuwfinale in de bergen","de bal veel verder doorschoof","kleine passen en zachte balcontacten meer grip gaven"],
  ["een nachtwedstrijd tijdens een stroomstoring","alleen noodverlichting bleef branden","de witte lijnen in het zwakke licht nog goed zichtbaar waren"],
  ["een trainingswedstrijd tegen oudere spelers","de tegenstander fysiek sterker was","snel handelen belangrijker bleek dan duwen en trekken"],
  ["een Oranje-talentendag","Dani te graag indruk wilde maken","een eenvoudige pass vaak de beste keuze was"],
  ["een finale op een drijvend voetbalveld","golven het veld zacht lieten bewegen","het ritme van het water voorspelbaar werd"],
  ["een toernooi op Mars","de lage zwaartekracht iedere sprong verlengde","lage passes minder last van de zwaartekracht hadden"],
  ["een wedstrijd tegen een team van voetbalrobots","de robots patronen razendsnel herkenden","onverwachte positiewissels hun berekening verstoorden"],
  ["een wedstrijd in een tropisch avonturenpark","een mechanische dinosaurus na ieder fluitsignaal brulde","het gebrul als vast startsignaal gebruikt kon worden"],
  ["een strandvoetbalduel","het zand iedere sprint zwaar maakte","eerder positie kiezen energie bespaarde"],
  ["een zaalvoetbalfinale","de ruimte klein en het tempo hoog was","de muurpass sneller was dan een dribbel"],
  ["een wedstrijd op het dak van een supercarfabriek","harde wind de hoge bal meenam","lage diagonale passes betrouwbaar bleven"],
  ["een benefietwedstrijd met beroemde oud-spelers","Dani onder de indruk raakte","de oud-spelers vooral vóór ontvangst al keken"],
  ["een geheime oefenwedstrijd voor Oranje","de coach niets tijdens het spel mocht zeggen","het team vooraf drie simpele signalen had afgesproken"],
  ["een finale tegen zijn sterkste rivaal","de tegenstander Dani probeerde te irriteren","rust bewaren de tegenstander juist onzeker maakte"]
];
const daniAdventures=[
  ["een verdwenen kampioensbeker","moddersporen naar het materiaalhok","de aanwijzingen in tijdsvolgorde leggen"],
  ["een onbekende drone boven de training","de drone steeds dezelfde looplijn volgde","afstand houden en een volwassene waarschuwen"],
  ["een haaienschaduw bij het trainingskamp","de schaduw groter leek door de golven","veilig observeren en feiten controleren"],
  ["een alien die alleen afleidende vragen stelde","Dani's gedachten alle kanten op schoten","zijn focusknop gebruiken: stop, adem, volgende stap"],
  ["een defecte Lamborghini op de testbaan","één veiligheidssensor een blinde hoek had","drie sensoren in een waaier plaatsen"],
  ["een geheime tunnel onder het stadion","oude pijlen naar verschillende uitgangen wezen","een kaart tekenen en iedere keuze markeren"],
  ["een karatekamp met een mysterieuze meester","kracht zonder beheersing niets oploste","rust, balans en timing trainen"],
  ["een gestrande ruimtemodule","zuurstof en batterij beperkt waren","eerst de belangrijkste systemen herstellen"],
  ["een uitvinderswedstrijd voor kinderen","zijn eerste prototype te ingewikkeld was","de oplossing kleiner en duidelijker maken"],
  ["een storm die Lena's hockeystick meenam","de windrichting veranderde tussen de huizen","zoeken vanaf de laatste zekere plek"],
  ["een mechanische T-rex die los leek te lopen","het dier op sensoren reageerde","niet wild rennen maar rustig buiten bereik blijven"],
  ["een raadselkamer in een oud clubhuis","ieder raadsel een deel van een code gaf","taken verdelen tussen Dani, Zana en Lena"],
  ["een onderwaterrobot met een kapotte camera","de robot nog wel afstand kon meten","werken met de informatie die nog betrouwbaar was"],
  ["een nepbericht over een afgelaste finale","het bericht geen officiële afzender had","de clubsite en coach controleren"],
  ["een verloren hond vlak voor de wedstrijd","de halsband een telefoonnummer bevatte","eerst veiligheid regelen en daarna pas verder gaan"]
];
const daniCompanions=["Zana","Lena","papa Jonathan","moeder Lana","coach Sam","zijn keeper","zijn beste teamgenoot","een jonge Oranje-speler"];
const daniTwists=[
  "de eerste oplossing werkte juist averechts","een onverwachte tegenstander hulp aanbood","de tijd plotseling nog maar tien minuten bedroeg",
  "iedereen door elkaar begon te roepen","Dani merkte dat hij zelf te snel een conclusie had getrokken","Lena precies het detail zag dat de anderen misten",
  "Zana een hockeytactiek gebruikte om het probleem anders te bekijken","de Afleidings-Alien in Dani's hoofd ineens weer verscheen",
  "een regenbui alle zichtbare sporen uitwiste","het belangrijkste voorwerp op een heel andere plek bleek te zijn"
];
const focusTools=["stop – adem – kies","kijk – denk – doe","bal – ruimte – team","één vraag – één stap – één antwoord","rust – richting – actie"];
function daniStoryV4(seed,level=3){
  const r=rng(hash("dani-v4-"+seed)),match=pick(r,daniMatches),adv=pick(r,daniAdventures),comp=pick(r,daniCompanions),twist=pick(r,daniTwists),focus=pick(r,focusTools);
  const code=hash(seed+"dani").toString(36).toUpperCase();
  const title=`Dani en ${match[0]}`;
  const paragraphs=[
    `Missie ${code} begon op de ochtend van ${match[0]}. Dani was vroeg wakker. Hij deed een korte serie nette push-ups, at rustig zijn ontbijt en controleerde daarna zelf zijn tas. Zijn voetbalschoenen, bidon en scheenbeschermers zaten erin. “Sterk zijn is mooi,” zei moeder Lana, “maar voorbereid zijn is minstens zo sterk.” Dani glimlachte. Vandaag wilde hij niet alleen hard spelen. Hij wilde slim spelen.`,
    `In de warming-up merkte Dani al het grootste probleem: ${match[1]}. Eerst probeerde hij dat op te lossen door harder te rennen. Dat kostte veel energie en leverde weinig op. Toen herinnerde hij zich de woorden van de coach: wie alleen naar de bal kijkt, ziet de oplossing vaak te laat. Dani keek daarom vóór iedere pass over zijn schouder en ontdekte dat ${match[2]}.`,
    `De wedstrijd begon fel. Dani kreeg twee kansen, maar bij de eerste schoot hij te snel en bij de tweede wilde hij langs drie spelers tegelijk. De Afleidings-Alien sprong in gedachten op zijn schouder en riep: “Scoor nu! Kijk naar de tribune! Denk aan een Ferrari! Hoeveel haaien passen in een zwembad?” Dani voelde hoe zijn aandacht versprong. Hij drukte met zijn duim tegen zijn wijsvinger en zei in zichzelf: “${focus}.”`,
    `Vanaf dat moment veranderde zijn spel. Hij liet de bal soms bewust naar een teamgenoot gaan, liep daarna zonder bal weg uit de drukte en verscheen op een plek waar niemand hem verwachtte. ${comp} zag het gebeuren en gaf hem een teken. Niet iedere goede actie stond op het scorebord, maar iedere slimme loopactie maakte het team gevaarlijker.`,
    `Tijdens de rust ontstond bovendien een tweede probleem: ${adv[0]}. De belangrijkste aanwijzing was dat ${adv[1]}. Sommige kinderen wilden meteen overal tegelijk zoeken. Dani wilde eerst ook wegrennen, maar hij stopte. Samen met ${comp} besloot hij ${adv[2]}. Daardoor verloren ze geen tijd aan wilde ideeën die nergens op gebaseerd waren.`,
    `Halverwege het onderzoek gebeurde iets onverwachts: ${twist}. Dani voelde irritatie opkomen. Hij had zin om te zeggen dat het niet eerlijk was. In plaats daarvan beschreef hij hardop wat hij zeker wist, wat hij alleen vermoedde en wat nog gecontroleerd moest worden. Dat verschil bleek belangrijk. Een vermoeden kan een goede richting geven, maar het is nog geen bewijs.`,
    `Ze losten het probleem op tijd op en keerden terug naar het veld. In de laatste minuten stond de stand gelijk. Dani zag opnieuw dezelfde ruimte die hij in de warming-up had ontdekt. Hij maakte eerst een korte beweging naar de bal, trok twee verdedigers mee en draaide toen diep. De pass kwam precies goed. Dani kon zelf schieten, maar zag een teamgenoot nog vrijer staan. Hij legde de bal breed: doelpunt.`,
    `Na afloop kreeg Dani niet alleen complimenten voor de assist. De coach prees vooral zijn keuzes. “Je was vandaag sterk omdat je bleef kijken wanneer het spannend werd,” zei hij. Thuis tekende Dani een nieuw idee voor een polsband die spelers met één zachte trilling herinnert om om zich heen te kijken. Misschien zou hij er ooit miljonair mee worden. Maar eerst schreef hij bovenaan zijn ontwerp: goede uitvindingen beginnen met een echt probleem, niet met een dure auto.`
  ];
  const story=paragraphs.join("\n\n");
  const questions=[
    q(r,"Waarom hielp harder rennen Dani aanvankelijk niet?","Het kostte energie zonder het tactische probleem op te lossen.",["Hij had zijn schoenen niet aan.","De wedstrijd was al afgelopen.","De coach verbood hem te rennen."],"Het probleem ging over ruimte en keuzes, niet over een gebrek aan snelheid."),
    q(r,"Welke informatie ontdekte Dani door vóór ontvangst om zich heen te kijken?",match[2],[match[1],adv[0],twist],"De tekst noemt dit als de tactische aanwijzing die zijn aanpak veranderde."),
    q(r,"Wat stelt de Afleidings-Alien vooral voor?","Gedachten en prikkels die Dani van zijn taak wegtrekken.",["Een echte mascotte van de tegenstander.","Een robot van de scheidsrechter.","Een nieuwe speler van Oranje."],"De alien verschijnt in Dani's gedachten wanneer zijn aandacht verspringt."),
    q(r,"Waarom beschreef Dani wat hij zeker wist en wat hij alleen vermoedde?","Om bewijs te scheiden van een mogelijke verklaring.",["Om het verhaal langer te maken.","Omdat hij alle antwoorden al kende.","Om geen hulp te hoeven vragen."],"Een vermoeden kan richting geven, maar is nog geen bewezen feit."),
    q(r,"Welke eigenschap laat Dani zien wanneer hij de bal breed legt?","Teamgericht beslissen.",["Alleen willen opvallen.","Bang zijn om te schieten.","Niet weten waar het doel staat."],"Hij kiest de kans met de grootste kans op succes voor het team."),
    q(r,"Welke zin vat het verhaal het best samen?","Sterke prestaties ontstaan door aandacht, bewijs en slimme samenwerking.",["Wie het hardst rent, wint altijd.","Een uitvinding is alleen goed wanneer zij duur is.","Afleiding verdwijnt vanzelf wanneer je haar negeert."],"Voetbal, onderzoek en uitvinden draaien allemaal om gericht waarnemen en kiezen."),
    q(r,"Waarom is de laatste zin over een 'echt probleem' belangrijk?","Dani leert dat een uitvinding eerst nuttig moet zijn.",["Hij besluit nooit een sportauto te kopen.","Hij wil zijn tekening weggooien.","Hij vindt techniek niet meer interessant."],"De waarde van een ontwerp begint bij het probleem dat het oplost."),
    q(r,"Welke aanpak kan Dani de volgende keer gebruiken wanneer hij afdwaalt?",focus,["sneller klikken zonder lezen","de opdracht overslaan","wachten tot iemand het antwoord zegt"],"De korte focuscode maakt de volgende stap concreet.","focus")
  ];
  return{title,genre:"Voetbalavontuur · spanning · slim handelen",story,questions,estimatedWords:story.split(/\s+/).length,storyId:`D-${code}`,level};
}

const zanaCases=[
  {title:"de verdwenen uitnodiging",setting:"een exclusief schoolgala",spark:"een digitale uitnodiging was aangepast en screenshots rondgingen",stakes:"vriendschappen, reputaties en de veiligheid van leerlingen",evidence:"de tijdstempels niet overeenkwamen met het verhaal dat online werd verteld",bias:"iedereen vooral berichten deelde die bij zijn eigen vriendengroep pasten",decision:"de bronbestanden veiligstellen en eerst afzonderlijk met betrokkenen spreken",theme:"sociale druk en digitale sporen"},
  {title:"de selectie achter gesloten deuren",setting:"een nationaal hockeytoernooi",spark:"een verrassende speelster buiten de selectie viel",stakes:"sportieve kansen, teamvertrouwen en eerlijke beoordeling",evidence:"de gebruikte statistiek acties zonder bal nauwelijks meetelde",bias:"de trainer vooral recente wedstrijden herinnerde",decision:"data, video, observaties en een transparante herkansing combineren",theme:"meetbaarheid en rechtvaardigheid"},
  {title:"het geheim van de populaire huidcrème",setting:"een jonge beauty-start-up",spark:"een influencer beweerde dat een nieuw product wonderen deed",stakes:"gezondheid, vertrouwen en de toekomst van het bedrijf",evidence:"de advertentie kleine letters en geselecteerde voor-en-nafoto's gebruikte",bias:"de oprichters verkoopgroei belangrijker vonden dan onzekerheid over claims",decision:"claims intrekken, ingrediënten laten testen en openlijk uitleg geven",theme:"marketing, wetenschap en verantwoordelijkheid"},
  {title:"de nachtelijke boodschap uit Londen",setting:"een internationale scholenuitwisseling",spark:"Zana een anoniem bericht kreeg over mogelijke fraude bij een beursselectie",stakes:"studiekansen, privacy en de reputatie van onschuldige kandidaten",evidence:"het bericht één controleerbaar detail bevatte maar verder vooral aannames",bias:"Zana de boodschap graag wilde geloven omdat zij al twijfels had",decision:"een vertrouwelijke verificatieroute gebruiken zonder namen online te zetten",theme:"broncontrole en zorgvuldigheid"},
  {title:"de juwelenpop-up met een verborgen rekening",setting:"een tijdelijke sieradenwinkel",spark:"de verkoop fantastisch leek terwijl er toch geld verdween",stakes:"de toekomst van het team, leveranciers en klanten",evidence:"retouren, betaaltermijnen en voorraad niet in de snelle winstgrafiek stonden",bias:"de bedenker alleen omzet liet zien en kosten later wilde bespreken",decision:"een kasstroomoverzicht maken en de lancering gefaseerd voortzetten",theme:"ondernemerschap en financiële realiteit"},
  {title:"het zwembadfeest dat uit de hand dreigde te lopen",setting:"een vakantiehotel aan de Adriatische kust",spark:"een privéfilmpje zonder toestemming werd gedeeld",stakes:"vertrouwen, privacy en groepsdruk",evidence:"meerdere doorgestuurde versies verschillende bijschriften hadden",bias:"populariteit werd aangezien voor toestemming",decision:"verspreiding stoppen, de maker steunen en volwassenen gericht inschakelen",theme:"grenzen, loyaliteit en online gedrag"},
  {title:"de verkiezing voor schoolvoorzitter",setting:"een ambitieuze scholencampus",spark:"een kandidaat plotseling werd beschuldigd van plagiaat",stakes:"democratisch vertrouwen, reputatie en een eerlijke verkiezing",evidence:"delen van de speech overeenkwamen maar de bron eerder samen met een team was geschreven",bias:"tegenstanders alleen de meest verdachte zinnen deelden",decision:"auteurschap reconstrueren en duidelijke campagneregels invoeren",theme:"leiderschap en procedurele eerlijkheid"},
  {title:"de geheime deal in CEO City",setting:"een simulatie van een internationale onderneming",spark:"een overname fantastisch leek maar een bijlage ontbrak",stakes:"banen, schulden en langetermijngroei",evidence:"de winstverwachting steunde op besparingen die nog niet waren uitgewerkt",bias:"de verkoper het optimistische scenario als basisscenario presenteerde",decision:"de deal uitstellen en drie onafhankelijke scenario's laten toetsen",theme:"macht, risico en onderhandeling"},
  {title:"de crush, het gerucht en de verkeerde conclusie",setting:"een drukke brugklasoriëntatie",spark:"een privégesprek werd verkeerd samengevat en doorverteld",stakes:"vriendschap, gevoelens en iemands reputatie",evidence:"niemand het volledige gesprek had gehoord",bias:"mensen lege plekken invulden met wat zij spannend vonden",decision:"rechtstreeks en rustig met de betrokken persoon spreken",theme:"relaties, respect en interpretatie"},
  {title:"de verdwenen ontwerpmap",setting:"een fashion challenge in Parijs",spark:"Zana's teamontwerp vlak voor de presentatie online verscheen",stakes:"creatief eigendom, samenwerking en de finaleplaats",evidence:"het bestand vanaf een gedeeld account was geopend",bias:"de groep de nieuwkomer direct verdacht",decision:"toegangslogs controleren en beschuldigingen uitstellen",theme:"creativiteit, bewijs en groepsdynamiek"},
  {title:"de campus onder water",setting:"een toekomstige universiteit in Oxford",spark:"een extreem zware regenbui het terrein bedreigde",stakes:"veiligheid, kosten en klimaatbestendigheid",evidence:"een oud model zeldzame buien onderschatte",bias:"iedere afdeling vooral haar eigen budget beschermde",decision:"noodmaatregelen nemen en daarna het volledige watersysteem herontwerpen",theme:"wetenschap, bestuur en klimaat"},
  {title:"de mysterieuze blessuregolf",setting:"een nationale hockeyacademie",spark:"meerdere speelsters tegelijk klachten kregen",stakes:"gezondheid, selectie en prestatiedruk",evidence:"trainingsbelasting was verhoogd terwijl slaap en herstel daalden",bias:"korte prestaties zwaarder telden dan duurzame ontwikkeling",decision:"belasting verlagen en individuele hersteldata meenemen",theme:"topsport en welzijn"},
  {title:"het virale filmpje uit New York",setting:"een jongerenredactie",spark:"een spectaculair filmpje miljoenen keren werd bekeken",stakes:"waarheid, snelheid en mogelijke schade aan betrokkenen",evidence:"locatie, datum en maker niet onafhankelijk bevestigd waren",bias:"redacteuren bang waren om als laatste te publiceren",decision:"publicatie uitstellen tot twee bronnen het materiaal bevestigden",theme:"journalistiek en verificatie"},
  {title:"de beurs met een onzichtbare prijs",setting:"een Amerikaanse universiteitsbeurs",spark:"de meest prestigieuze opleiding financieel aantrekkelijker leek dan zij was",stakes:"studiedroom, schuld en welzijn",evidence:"woonlasten, verzekeringen en wisselkoersrisico niet in de brochure stonden",bias:"ranglijsten vooral reputatie maten",decision:"totale kosten en dagelijkse studentervaring vergelijken",theme:"ambitie en realistische planning"},
  {title:"de AI die te overtuigend schreef",setting:"een debatwedstrijd",spark:"een team een foutloos klinkend dossier presenteerde",stakes:"eerlijkheid, leren en betrouwbaarheid",evidence:"twee bronverwijzingen niet bestonden",bias:"mooie formuleringen als bewijs werden gezien",decision:"alle claims terugbrengen naar controleerbare bronnen",theme:"technologie en kritisch denken"},
  {title:"de vakantieclub met twee gezichten",setting:"een luxe resort",spark:"personeel online een heel ander verhaal vertelde dan de brochure",stakes:"arbeidsomstandigheden, toerisme en reputatie",evidence:"getuigenissen overeenkwamen maar anoniem waren",bias:"zowel bedrijf als critici extreme voorbeelden selecteerden",decision:"meerdere onafhankelijke interviews en documenten combineren",theme:"ethiek en bronkwaliteit"},
  {title:"de sponsor die het team wilde sturen",setting:"een groot hockeyevenement",spark:"een sponsor invloed vroeg op de selectie",stakes:"sportieve integriteit, geld en teamvertrouwen",evidence:"de afspraak vaag in een bijlage stond",bias:"bestuurders financiële nood als reden gebruikten om risico's kleiner te maken",decision:"de voorwaarde weigeren en alternatieve financiering zoeken",theme:"integriteit en macht"},
  {title:"de verdwenen medische gegevens",setting:"een health-tech wedstrijd",spark:"testgegevens van deelnemers niet volledig vindbaar waren",stakes:"privacy, onderzoekskwaliteit en vertrouwen",evidence:"back-ups bestonden maar toegangsrechten onduidelijk waren",bias:"de ontwikkelaar vooral wilde bewijzen dat het product werkte",decision:"de test pauzeren en eerst databeheer herstellen",theme:"privacy en onderzoek"},
  {title:"de vriendengroep met een geheime regel",setting:"een zomerkamp",spark:"nieuwe deelnemers systematisch buiten plannen vielen",stakes:"erbij horen, traditie en verantwoordelijkheid",evidence:"niemand de regel officieel had afgesproken",bias:"oude deelnemers dachten dat 'het altijd zo ging' voldoende reden was",decision:"de ongeschreven regel bespreekbaar maken en activiteiten anders organiseren",theme:"sociale normen en leiderschap"},
  {title:"de raketlancering met een haastige deadline",setting:"een internationaal science-team",spark:"een cruciale test werd overgeslagen",stakes:"veiligheid, reputatie en miljoenen aan investeringen",evidence:"het defect zeldzaam maar mogelijk ernstig was",bias:"de geplande lanceringsdatum als onveranderlijk werd behandeld",decision:"de lancering uitstellen en transparant communiceren",theme:"risico, wetenschap en moed"}
];
const zanaRoles=["teamcaptain","junior-directeur","onderzoeker","kritische verslaggever","onderhandelaar","projectleider","vertrouwenspersoon","data-analist"];
const zanaComplications=[
  "een vriendin haar in vertrouwen iets vertelde dat niet zomaar gedeeld mocht worden","de deadline onverwacht naar voren werd gehaald",
  "een nieuwe dataset de voorlopige conclusie onderuit haalde","een populaire leerling de discussie persoonlijk maakte",
  "de belangrijkste getuige zijn eerdere verklaring nuanceerde","een journalist al publiceerde voordat het onderzoek klaar was",
  "Zana ontdekte dat haar eigen voorkeur haar beoordeling beïnvloedde","een volwassene snel wilde beslissen om gezichtsverlies te voorkomen",
  "de groep in twee kampen uiteenviel","een anoniem account nieuwe maar onvolledige informatie plaatste"
];
function zanaStoryV4(seed,level=5){
  const r=rng(hash("zana-v4-"+seed)),c=pick(r,zanaCases),role=pick(r,zanaRoles),comp=pick(r,zanaComplications),code=hash(seed+"zana").toString(36).toUpperCase();
  const title=`Zana en ${c.title}`;
  const advanced=level>=7;
  const paras=[
    `Het dossier met code ${code} begon in ${c.setting}. Zana was daar als ${role}. Op het eerste gezicht leek de situatie vooral spannend: ${c.spark}. Binnen een uur had bijna iedereen een mening. Sommige mensen spraken alsof hun versie van het verhaal al vaststond. Zana voelde dezelfde neiging. Ze wilde snel begrijpen wie gelijk had, maar wist dat een snelle conclusie vaak vooral prettig voelt omdat onzekerheid ongemakkelijk is.`,
    `De gevolgen waren groter dan een gewone schoolruzie of zakelijke fout. Op het spel stonden ${c.stakes}. Zana schreef daarom drie aparte vragen op: wat is er feitelijk gebeurd, welke uitleg past het best bij de feiten en welke actie is nu verantwoord? Die vragen lijken op elkaar, maar zijn niet hetzelfde. Een feit kan vaststaan terwijl de oorzaak nog onzeker is. En zelfs wanneer de oorzaak waarschijnlijk is, moet een maatregel proportioneel blijven.`,
    `De eerste belangrijke aanwijzing was dat ${c.evidence}. Dit bewijs was relevant, maar niet beslissend. Zana controleerde wie het had verzameld, wanneer dat was gebeurd en of het materiaal volledig was. Ze vroeg ook welke gegevens ontbraken. Afwezige informatie bewijst niets, maar kan wel laten zien waarom een stellige conclusie te vroeg komt.`,
    `Daarna onderzocht ze de belangen. Niet iedereen loog; toch presenteerde bijna iedereen het verhaal vanuit een eigen positie. De duidelijkste vertekening was dat ${c.bias}. Zana noemde dit geen bewijs van kwade bedoelingen. Bias kan bewust zijn, maar ontstaat ook doordat mensen vooral zien wat aansluit bij hun verwachtingen, loyaliteit of angst.`,
    `Toen ${comp}, werd de druk groter. Een deel van de groep wilde namen openbaar maken. Een ander deel wilde alles stilhouden. Zana wees erop dat beide reacties schade konden veroorzaken. Openbaarmaking kon onschuldige mensen raken; volledige stilte kon een echt probleem laten voortbestaan. Ze stelde een tussenroute voor: informatie veiligstellen, toegang beperken en concrete claims onafhankelijk laten controleren.`,
    `Zana formuleerde vervolgens het sterkste argument tégen haar eigen aanpak. Misschien, zo zei ze, maakte haar zorgvuldigheid de groep te traag. Wanneer veiligheid direct in gevaar is, moet je soms handelen voordat ieder detail bekend is. Ze voegde daarom een drempel toe: bij acuut risico eerst beschermen, bij reputatieschade eerst verifiëren. Zo werd twijfel geen excuus om niets te doen, maar informatie voor de keuze van de maatregel.`,
    `Het gesprek verschoof van “wie wint?” naar “welke procedure is eerlijk?”. Zana stelde voor om rollen te scheiden. De persoon die bewijs verzamelde, mocht niet alleen beslissen over de uitkomst. Betrokkenen kregen gelegenheid om feitelijke fouten te corrigeren, maar konden het onderzoek niet blokkeren. Ook moest na afloop worden uitgelegd welke informatie doorslaggevend was en welke onzekerheden bleven bestaan.`,
    `Op basis daarvan koos de groep voor deze aanpak: ${c.decision}. Niet iedereen was tevreden. Toch was het besluit sterker dan de eerste emotionele reacties, omdat het controleerbaar, omkeerbaar waar mogelijk en gericht op het echte risico was. Zana merkte dat leiderschap soms juist betekent dat je een minder spectaculaire oplossing verdedigt tegen mensen die onmiddellijke zekerheid beloven.`,
    `Later die avond ontving Zana een bericht van iemand die eerst boos op haar was geweest. Die persoon gaf toe dat de situatie ingewikkelder bleek dan online werd voorgesteld. Zana antwoordde niet triomfantelijk. Ze schreef dat van mening veranderen geen zwakte is wanneer nieuwe informatie daar reden toe geeft. Zelf noteerde zij ook wat ze eerder verkeerd had ingeschat.`,
    `In haar eindverslag koppelde ze de gebeurtenis aan ${c.theme}. Ze maakte onderscheid tussen bewijssterkte, waarschijnlijkheid en morele verantwoordelijkheid. ${advanced?"Daarnaast beschreef ze hoe selectiebias, tijdsdruk en ongelijke machtsposities de uitkomst konden beïnvloeden. Ze voegde een gevoeligheidsanalyse toe: zou het besluit veranderen wanneer één belangrijke aanname onjuist bleek?":"Ze beschreef welke bron het meest betrouwbaar was, welke mening het gesprek beïnvloedde en welke stap later opnieuw gecontroleerd moest worden."}`,
    `Zana besteedde ook aandacht aan de menselijke kant. In dossiers lijken mensen soms alleen namen, functies of statistieken, terwijl een besluit hun dagelijkse leven kan veranderen. Ze vroeg daarom niet alleen wat juridisch of financieel mogelijk was, maar ook wie het minst gemakkelijk voor zichzelf kon opkomen. Dat betekende niet dat gevoel bewijs verving. Het betekende dat de verdeling van risico en stem onderdeel werd van de analyse.`,
    `Voor de presentatie bouwde ze een beslismatrix met vier scenario’s: niets doen, direct hard ingrijpen, beperkt ingrijpen met extra onderzoek, en een gefaseerde oplossing met vaste evaluatiemomenten. Bij ieder scenario noteerde ze de verwachte winst, mogelijke schade, omkeerbaarheid en informatie die nog ontbrak. Toen één jurylid vroeg welk scenario “gewoon het beste” was, antwoordde Zana dat de keuze afhing van de waarde die men het zwaarst liet wegen. Transparantie betekende juist zichtbaar maken waar die normatieve keuze zat.`,
    `De volgende ochtend ging Zana trainen. Op het hockeyveld werkte hetzelfde principe verrassend goed. Een speelster ziet nooit het hele veld tegelijk, maar kan wel vóór ontvangst scannen, informatie delen en haar beslissing aanpassen. Zana besefte dat haar droom om later een groot bedrijf te leiden niet alleen draait om zelfvertrouwen. Het vraagt ook intellectuele eerlijkheid: sterk genoeg zijn om te beslissen, en veilig genoeg om te erkennen wanneer het besluit moet veranderen.`
  ];
  const story=paras.join("\n\n");
  const questions=[
    q(r,"Waarom splitst Zana de situatie op in feiten, verklaring en actie?","Omdat die drie vragen verschillende soorten bewijs en afweging vragen.",["Omdat zij drie presentaties wil geven.","Omdat een feit altijd automatisch de oorzaak bewijst.","Omdat actie nooit van feiten afhankelijk is."],"De tekst benadrukt dat vaststellen, verklaren en handelen niet hetzelfde zijn."),
    q(r,"Welke beperking heeft de eerste aanwijzing?","Zij is relevant, maar zonder context en volledigheidscontrole niet beslissend.",["Zij heeft helemaal geen verband met de zaak.","Zij is alleen bruikbaar wanneer zij online populair is.","Zij bewijst direct wie schuld heeft."],"Zana controleert herkomst, tijdstip, volledigheid en ontbrekende informatie."),
    q(r,"Hoe gebruikt de tekst het begrip bias?","Als mogelijke vertekening die ook zonder bewuste leugen kan ontstaan.",["Als synoniem voor bewezen fraude.","Als reden om alle informatie te negeren.","Als een meeteenheid voor winst."],"Bias kan voortkomen uit verwachtingen, loyaliteit of belangen."),
    q(r,"Waarom formuleert Zana een argument tegen haar eigen aanpak?","Om te testen waar zorgvuldigheid kan omslaan in schadelijke vertraging.",["Om haar eigen plan expres te laten mislukken.","Omdat zij geen voorkeur heeft.","Om de anderen niet te hoeven horen."],"Een sterk tegenargument maakt zichtbaar welke grens of waarborg nodig is."),
    q(r,"Welke waarde staat centraal in de scheiding van rollen?","Procedurele onafhankelijkheid.",["Populariteit.","Geheimhouding zonder controle.","Snelheid boven alles."],"Wie bewijs verzamelt, hoort niet als enige de uitkomst te bepalen."),
    q(r,"Wat maakt de uiteindelijke aanpak sterker dan de eerste reacties?","Zij is controleerbaar, proportioneel en waar mogelijk omkeerbaar.",["Zij maakt iedereen direct blij.","Zij belooft volledige zekerheid.","Zij gebruikt de meeste moeilijke woorden."],"De kwaliteit zit in bewijs, procedure en passende maatregelen."),
    q(r,"Welke functie heeft de hockeyvergelijking in de laatste alinea?","Zij verbindt besluitvorming met scannen, communiceren en bijsturen.",["Zij introduceert een nieuw losstaand hoofdonderwerp.","Zij bewijst dat hockey belangrijker is dan onderzoek.","Zij laat zien dat beslissingen altijd snel moeten zijn."],"De vergelijking brengt de abstracte les terug naar een herkenbare vaardigheid."),
    q(r,"Welke conclusie past het best bij de houding van Zana?","Goed leiderschap combineert besluitvaardigheid met bereidheid om te herzien.",["Een leider mag nooit twijfelen.","Een leider moet vooral de populairste mening kiezen.","Een leider laat moeilijke beslissingen altijd aan anderen over."],"De tekst presenteert herziening op basis van nieuwe informatie als kracht."),
    q(r,"Welke aanvullende bron zou de zaak het meest versterken?","Een onafhankelijke bron die de kerngegevens en tijdlijn kan verifiëren.",["Een anoniem account dat dezelfde mening herhaalt.","Een reclamevideo van een belanghebbende.","Een peiling onder mensen die het dossier niet hebben gelezen."],"Onafhankelijke verificatie vermindert afhankelijkheid van één perspectief."),
    q(r,"Wat betekent 'proportioneel' in deze context?","Dat de maatregel past bij de ernst en zekerheid van het risico.",["Dat iedereen precies dezelfde mening moet hebben.","Dat de langste tekst automatisch het beste is.","Dat iedere fout dezelfde maximale straf krijgt."],"Een passende reactie houdt rekening met ernst, bewijs en mogelijke schade."),
    q(r,"Wat is de hoofdgedachte van het verhaal?","Spannende situaties vragen om bewijs, eerlijke procedures en moed om bij te sturen.",["Online populariteit is de beste bron van waarheid.","Een snelle beslissing is altijd beter dan een zorgvuldige.","Persoonlijke relaties mogen nooit een rol spelen in keuzes."],"Dit verbindt de sociale, sportieve en bestuurlijke lagen van de tekst.")
  ];
  return{title,genre:"Young-adult mystery · school · ambitie · ethiek",story,questions,estimatedWords:story.split(/\s+/).length,storyId:`Z-${code}`,level};
}

const lenaWorlds=[
  ["Unicornland","een glinsterende regenboogbrug","🦄","een verdwaalde ster","de kleuren op volgorde leggen"],
  ["het Feeënbos","een boom met zilveren blaadjes","🧚","een fee haar belletje kwijt was","luisteren waar het zachte geluid vandaan kwam"],
  ["Dierenstad","een plein vol pratende dieren","🐶","een puppy zijn rode bal zocht","de pootafdrukken volgen"],
  ["Snoepkasteel","een kasteel van koek en fruit","🍭","de deur alleen met een klankcode openging","woorden zoeken die hetzelfde begonnen"],
  ["Zeemeerminbaai","een blauwe zee met lichtgevende vissen","🧜‍♀️","een schelp niet meer zong","rustig luisteren naar hoge en lage klanken"],
  ["Mini Hockeyland","een veld met kleine gekleurde goals","🏑","alle sticks door elkaar lagen","sorteren op kleur en lengte"],
  ["Wolkenwereld","een dorp boven de wolken","☁️","een regenboog drie kleuren miste","de juiste kleuren terugvinden"],
  ["Dino-eiland","een vriendelijk eiland met babydino's","🦕","een ei uit het nest was gerold","tellen hoeveel stappen terug nodig waren"],
  ["Maanpaleis","een paleis met sterrenlampjes","🌙","de sterren in een patroon knipperden","het patroon afmaken"],
  ["Knuffelstad","een dorp waar knuffels konden praten","🧸","de kleinste beer niet durfde mee te doen","hem stap voor stap helpen"],
  ["Bloemenland","een tuin met zingende bloemen","🌸","een bloem haar naam vergat","de eerste letter herkennen"],
  ["Treinenland","een station met regenboogtreinen","🚂","drie wagonnetjes verkeerd stonden","de goede volgorde maken"],
  ["IJsprinsessenland","een glanzend bevroren meer","❄️","de ijskristallen verschillende vormen hadden","de vorm zonder hoeken zoeken"],
  ["Hondenhotel","een hotel met vrolijke puppy's","🐕","iedere hond een eigen mand nodig had","evenveel manden als honden tellen"],
  ["Sterrenkermis","een kermis in de nacht","🎠","de lampjes steeds om en om aangingen","voorspellen welk lampje volgde"]
];
function lenaStoryV4(seed,level=1){
  const r=rng(hash("lena-v4-"+seed)),w=pick(r,lenaWorlds),helper=pick(r,["Dani","Zana","mama Lana","papa Jonathan","een kleine draak","een lachende unicorn"]),code=hash(seed+"lena").toString(36).toUpperCase().padStart(7,"0");
  const title=`Lena in ${w[0]}`;
  const story=`Lena stapte door een deur met code ${code}. Daar zag ze ${w[1]}. Naast haar liep ${w[2]}. “Kom,” zei ${helper}. “We hebben een vriendelijke missie.”\n\n${w[3]}. Lena keek goed. Ze wilde meteen rennen, maar eerst luisterde ze naar de uitleg. Daarna besloot ze ${w[4]}.\n\nOnderweg telde Lena langzaam mee. Eén, twee, drie. Ze wees ieder ding aan dat ze telde. Toen ze een foutje maakte, begon ze gewoon opnieuw. Dat was niet erg. Opnieuw proberen maakte haar juist slimmer.\n\nSamen vonden ze de oplossing. Iedereen klapte en ${w[2]} maakte een heel gek gezicht. Lena moest lachen. Ze kreeg een fonkelende ster en zei: “Ik keek, ik luisterde en ik probeerde het nog een keer!”`;
  const questions=[
    q(r,"Waar was Lena?",w[0],["in de supermarkt","op een snelweg","in een donker kantoor"],`Lena stapte binnen in ${w[0]}.`,"luisteren",{audio:true,icon:"🌈"}),
    q(r,"Wie ging met Lena mee?",helper,["niemand","een boze piraat","een onbekende robot"],`${helper} hielp Lena tijdens de missie.`,"luisteren",{audio:true,icon:w[2]}),
    q(r,"Wat deed Lena toen ze een foutje maakte?","Ze begon rustig opnieuw.",["Ze stopte voor altijd.","Ze gooide alles weg.","Ze werd boos op iedereen."],"Opnieuw proberen is precies wat leren sterker maakt.","sociaal",{audio:true,icon:"🔁"}),
    q(r,"Welke drie dingen hielpen Lena?","Kijken, luisteren en opnieuw proberen.",["Rennen, roepen en raden.","Slapen, wachten en vergeten.","Alleen heel snel klikken."],"De laatste zin noemt de drie helpende stappen.","begrip",{audio:true,icon:"⭐"})
  ];
  return{title,genre:"Magisch luisterverhaal",story,questions,estimatedWords:story.split(/\s+/).length,storyId:`L-${code}`,level};
}

C.daniStory=daniStoryV4;C.zanaStory=zanaStoryV4;C.lenaStory=lenaStoryV4;

// ---------- Heldere spelling en taal ----------
const daniSpellingV4=[
  ["Dani speelt morgen een belangrijke ___. Welk woord maakt de zin goed?","wedstrijd",["wedstrijt","wedstrijd","wedstreid","wedstrijt"],"Wedstrijd eindigt op d en bevat ij."],
  ["De keeper ___ de bal stevig vast.","vangt",["vangt","vangd","vankt","vang"],"Bij hij/de keeper komt bij de stam vang een t: vangt."],
  ["Welke zin is helemaal goed geschreven?","Dani kijkt op, geeft een pass en sprint door.",["dani kijkt op geeft een pas en sprint door","Dani kijkt op, geeft een pass en sprint door.","Dani kijkt op geeft een pass, en sprint door","Dani kijkt op, geeft een pas en sprint door"],"Een zin begint met een hoofdletter, krijgt passende komma's en eindigt met een punt."],
  ["De trainer legt de oefening ___. Kies het juiste woord.","duidelijk",["duideluk","duidelijk","duidelijkk","duidelijck"],"Duidelijk schrijf je met ij en één k."],
  ["Welke spelling past? De spelers waren meteen ___.","enthousiast",["entousiast","enthousiast","enthousiastt","antousiast"],"Enthousiast begint met enth- en eindigt op -iast."],
  ["Dani heeft twee snelle ___. Kies het juiste meervoud.","auto's",["autos","auto's","auto,s","autoos"],"Na de lange klinker o gebruik je een apostrof: auto's."],
  ["Welke samenstelling is juist?","voetbalstadion",["voetbal stadion","voetbalstadion","voetballstadion","voetbal-stadion"],"Samenstellingen schrijf je meestal aan elkaar."],
  ["Gisteren ___ Dani drie strafschoppen.","scoorde",["scoorde","scoorden","skoorde","scoorte"],"De verleden tijd van scoren is scoorde."],
  ["De uitvinding werkte ___. Welk woord past en is goed gespeld?","onmiddellijk",["onmiddelijk","onmiddellijk","onmidelijk","onmiddelijkk"],"Onmiddellijk heeft dubbel d en dubbel l."],
  ["Welke zin heeft een vraagteken nodig?","Waar ligt mijn voetbal?",["Waar ligt mijn voetbal?","Mijn voetbal ligt hier.","Wat een hard schot!","Dani pakt de bal."],"Een directe vraag eindigt met een vraagteken."],
  ["De scheidsrechter ___ voor een vrije trap.","fluit",["fluit","fluyt","fluitd","fluitte"],"In de tegenwoordige tijd is het: de scheidsrechter fluit."],
  ["Kies het woord dat logisch én goed gespeld is: De donkere wolken maakten het veld ___.","gevaarlijk",["gevaarlijk","gevaarelijk","gevaarlek","gevaarleik"],"Gevaarlijk schrijf je met -lijk."],
  ["Welke zin gebruikt 'word' of 'wordt' goed?","Dani wordt steeds sterker.",["Dani word steeds sterker.","Dani wordt steeds sterker.","Wordt jij ook sterker?","Dani wort steeds sterker."],"Bij Dani/hij komt er een t achter de stam: wordt."],
  ["Na de wedstrijd ___ het team de kleedkamer op.","ruimde",["ruimde","ruimden","ruimtte","ruimdeh"],"Het onderwerp is enkelvoud: het team ruimde op."],
  ["Welke vorm is juist? Dani heeft de bal goed ___.","aangenomen",["aangeneemt","aangenomen","aan genomen","aangenoomen"],"Het voltooid deelwoord van aannemen is aangenomen."]
];
const zanaSpellingV4=[
  ["De commissie heeft het voorstel zorgvuldig ___.","geanalyseerd",["geanalyseert","geanalyseerd","geanaliseerd","geanalyzeerd"],"Het voltooid deelwoord is geanalyseerd en eindigt op d."],
  ["Welke zin is grammaticaal en stilistisch het sterkst?","Hoewel de cijfers overtuigend lijken, blijft de steekproef te klein voor een algemene conclusie.",["Hoewel de cijfers overtuigend lijken blijft, de steekproef klein.","Hoewel de cijfers overtuigend lijken, blijft de steekproef te klein voor een algemene conclusie.","De cijfers zijn overtuigend maar de steekproef dus niet algemeen.","Hoewel cijfers, is de steekproef te klein en overtuigend."],"Deze zin gebruikt een correcte bijzin en benoemt de beperking precies."],
  ["De directie ___ het besluit nadat nieuwe informatie verscheen.","herzag",["herziede","herzag","herziende","herzagt"],"De verleden tijd van herzien is herzag."],
  ["De uitkomsten zijn onafhankelijk ___.","geverifieerd",["geverifiëerd","geverifieerd","geverifiseerd","geverifieert"],"Geverifieerd schrijf je zonder trema en eindigt op d."],
  ["Welke zin gebruikt de verwijswoorden correct?","Het bedrijf wijzigde zijn strategie omdat die niet langer werkte.",["Het bedrijf wijzigde haar strategie omdat hij niet werkte.","Het bedrijf wijzigde zijn strategie omdat die niet langer werkte.","Het bedrijf wijzigde hun strategie omdat deze niet werkte.","Het bedrijf wijzigde zijn strategie omdat het niet werkte."],"Bedrijf is een het-woord; strategie is een de-woord."],
  ["Het plan is kostbaar; ___ kan het op lange termijn veel besparen.","desondanks",["desondanks","daardoor","omdat","eveneens"],"Desondanks geeft een tegenstelling aan."],
  ["Welke schrijfwijze is correct?","De ideeën zijn financieel onderbouwd.",["De ideëen zijn financieel onderbouwt.","De ideeën zijn financieel onderbouwd.","De ideeën zijn financiëel onderbouwd.","De ideeën zijn financieel onderbouwt."],"Ideeën krijgt een trema; onderbouwd eindigt op d."],
  ["De onderzoeker vroeg zich af ___ de grafiek werkelijk aantoonde.","wat",["wat","dat","als","ofdat"],"Na 'zich afvragen' past hier het vraagwoord wat."],
  ["Welke zin bevat geen onnodige herhaling?","De resultaten bevestigen de eerdere conclusie.",["De resultaten bevestigen opnieuw weer de eerdere conclusie.","De resultaten bevestigen de eerdere conclusie.","De resultaten bevestigen de conclusie nogmaals opnieuw.","De resultaten zijn een bevestiging die bevestigt."],"Deze formulering is bondig en precies."],
  ["De voorzitter verwacht dat iedereen de stukken vooraf ___.","leest",["leest","leesd","leestt","gelezen"],"Bij iedereen als onderwerp in de bijzin hoort leest."],
  ["De maatregelen worden ieder kwartaal ___.","geëvalueerd",["geevalueerd","geëvalueerd","geëvaluteerd","geëvalueert"],"Het trema geeft aan dat ge-e afzonderlijk wordt uitgesproken."],
  ["Welke interpunctie is correct?","Zana noteerde drie criteria: betrouwbaarheid, haalbaarheid en eerlijkheid.",["Zana noteerde drie criteria, betrouwbaarheid haalbaarheid en eerlijkheid.","Zana noteerde drie criteria: betrouwbaarheid, haalbaarheid en eerlijkheid.","Zana noteerde: drie criteria betrouwbaarheid, haalbaarheid, en eerlijkheid", "Zana noteerde drie criteria; betrouwbaarheid haalbaarheid en eerlijkheid."],"Na een aankondiging van een opsomming past een dubbele punt."],
  ["De bron lijkt betrouwbaar, ___ de methode transparant is beschreven.","omdat",["omdat","ondanks","echter","tenzij"],"Omdat geeft hier de reden voor het oordeel."],
  ["Welke zin vermijdt een vage formulering?","Drie van de twintig deelnemers stopten vóór het einde van het onderzoek.",["Sommige mensen stopten een beetje vroeg.","Drie van de twintig deelnemers stopten vóór het einde van het onderzoek.","Een paar mensen deden niet helemaal mee.","Er waren mensen die ongeveer stopten."],"Concrete aantallen en timing maken de zin controleerbaar."],
  ["De journalist citeerde de bron correct en gaf de context volledig ___.","weer",["weer","wer","weder","weêr"],"De vaste uitdrukking is 'weergeven': hij gaf de context weer."],
  ["Welke zin is correct?","Noch de trainer, noch de speelsters waren op de hoogte.",["Noch de trainer, noch de speelsters was op de hoogte.","Noch de trainer, noch de speelsters waren op de hoogte.","Nog de trainer, nog de speelsters waren op de hoogte.","Noch de trainer noch, de speelsters waren op de hoogte."],"Bij het meervoudige laatste deel hoort waren; de vaste combinatie is noch...noch."],
  ["De conclusie is aannemelijk, maar nog niet definitief ___.","bewezen",["beweest","bewezen","bewijsd","bewezend"],"Het voltooid deelwoord van bewijzen is bewezen."],
  ["De onderneming publiceert jaarlijks haar financiële ___.","prognoses",["prognozes","prognoses","prognosen's","prochnozes"],"Prognoses schrijf je met g en s."],
  ["Welke formulering maakt duidelijk wie handelt?","De onderzoeksgroep controleerde de ruwe gegevens opnieuw.",["De ruwe gegevens werden opnieuw gecontroleerd.","Er werd opnieuw naar gegevens gekeken.","De onderzoeksgroep controleerde de ruwe gegevens opnieuw.","De gegevens hadden een controle."],"De actieve zin noemt de handelende partij expliciet."],
  ["Zana pleitte voor een besluit dat later kon worden ___.","herzien",["herzient","herzien","herzienen","herziend"],"Na kon worden staat het voltooid deelwoord: herzien."]
];
function lenaSpellingGenerated(r,i){
 const letters=[['b','bal','⚽'],['m','maan','🌙'],['s','slang','🐍'],['k','kat','🐱'],['v','vis','🐟'],['h','hond','🐶'],['l','leeuw','🦁'],['p','pop','🪆'],['r','roos','🌹'],['t','trein','🚂']];
 const [letter,word,icon]=pick(r,letters),mode=i%6;
 if(mode===0)return{prompt:`Welke letter hoor je vooraan in ${word}?`,answer:letter,options:shuffle(r,[letter,...shuffle(r,letters.map(x=>x[0]).filter(x=>x!==letter)).slice(0,3)]),explain:`${word} begint met de klank ${letter}.`,icon,audio:true};
 if(mode===1)return{prompt:`Welk plaatje hoort bij het woord ${word}?`,answer:icon,options:shuffle(r,[icon,...shuffle(r,letters.map(x=>x[2]).filter(x=>x!==icon)).slice(0,3)]),explain:`Dit plaatje laat ${word} zien.`,icon:"👀",audio:true};
 if(mode===2){const rhyme={kat:'mat',maan:'haan',vis:'mis',roos:'doos',bal:'hal',hond:'mond'};const base=pick(r,Object.keys(rhyme));return{prompt:`Welk woord rijmt op ${base}?`,answer:rhyme[base],options:shuffle(r,[rhyme[base],'boom','fiets','kip']),explain:`${base} en ${rhyme[base]} klinken aan het einde hetzelfde.`,icon:"🎵",audio:true};}
 if(mode===3)return{prompt:`Tik op de hoofdletter van ${letter}.`,answer:letter.toUpperCase(),options:shuffle(r,[letter.toUpperCase(),letter,...shuffle(r,letters.map(x=>x[0].toUpperCase()).filter(x=>x!==letter.toUpperCase())).slice(0,2)]),explain:`De hoofdletter van ${letter} is ${letter.toUpperCase()}.`,icon:"🔤",audio:true};
 if(mode===4){const words=['voetbal','regenboog','olifant','kat'];const answer='olifant';return{prompt:'Welk woord heeft de meeste klapstukjes?',answer,options:shuffle(r,words),explain:'O-li-fant heeft drie klapstukjes.',icon:'👏',audio:true};}
 return{prompt:`Welke twee klanken maken samen ${word}?`,answer:word,options:shuffle(r,[word,word.replace(letter,'p'),word+'s','boom']),explain:`Luister langzaam: ${word.split('').join(' - ')}.`,icon,audio:true};
}
function makeSpellingV4(profile,seed,count=15,level=3){
 const r=rng(hash(profile+seed+"spelling-v4"));
 if(profile==="lena")return Array.from({length:Math.max(12,count)},(_,i)=>({id:i,...lenaSpellingGenerated(r,i),kind:"letters"}));
 const bank=profile==="dani"?daniSpellingV4:zanaSpellingV4;
 let arr=shuffle(r,bank);while(arr.length<count)arr=arr.concat(shuffle(r,bank));
 return arr.slice(0,count).map((x,i)=>({id:i,prompt:x[0],answer:x[1],options:shuffle(r,x[2]),explain:x[3],kind:profile==="zana"?"taal":"spelling",speakText:`${x[0]} Antwoorden: ${x[2].join(', ')}`}));
}
C.makeSpelling=makeSpellingV4;

// ---------- Slimmere en gevarieerdere rekensets ----------
function mathQ(prompt,answer,explain,extra={}){return{prompt,answer:String(answer).replace('.',','),explain,kind:"rekenen",...extra};}
function makeMathV4(profile,seed,count=20,level=3,curriculum={}){
 const r=rng(hash(`${profile}-${seed}-math-v4`)),items=[];
 const add=(x)=>items.push({...x,id:items.length});
 if(profile==="lena"){
  const animals=['🐶','🦄','🐱','🐸','⭐','🌸','🏑'];
  for(let i=0;i<count;i++){
   const mode=i%10;
   if(mode===0){const n=2+Math.floor(r()*9),ic=pick(r,animals);add(mathQ(`Hoeveel zie je? ${ic.repeat(n)}`,n,'Wijs ieder plaatje aan en tel rustig één voor één.',{options:shuffle(r,[n,Math.max(1,n-1),n+1,n+2]),icon:'👆',audio:true}));}
   else if(mode===1){const a=Math.floor(r()*6),b=Math.floor(r()*(6-a));add(mathQ(`${a} + ${b} = ?`,a+b,'Maak beide groepjes met je vingers en tel ze daarna samen.',{options:shuffle(r,[a+b,Math.max(0,a+b-1),a+b+1,a+b+2]),icon:'➕',audio:true}));}
   else if(mode===2){const a=4+Math.floor(r()*7),b=1+Math.floor(r()*Math.min(4,a));add(mathQ(`${a} − ${b} = ?`,a-b,'Begin met het eerste aantal en haal er één voor één af.',{options:shuffle(r,[a-b,Math.max(0,a-b-1),a-b+1,a]),icon:'➖',audio:true}));}
   else if(mode===3){const a=1+Math.floor(r()*10),b=1+Math.floor(r()*10);add(mathQ(`Welke hoeveelheid is groter: ${a} of ${b}?`,Math.max(a,b),'Het grootste getal hoort bij de grootste hoeveelheid.',{options:shuffle(r,[a,b]),icon:'🐘',audio:true}));}
   else if(mode===4){const start=1+Math.floor(r()*5);add(mathQ(`Wat komt hierna? ${start}, ${start+1}, ${start+2}, ...`,start+3,'Tel één stap verder.',{options:shuffle(r,[start+3,start+2,start+4,start+5]),icon:'🚂',audio:true}));}
   else if(mode===5){const forms=[['cirkel','⚪',0],['driehoek','🔺',3],['vierkant','🟦',4]],f=pick(r,forms);add(mathQ(`Welke vorm is dit? ${f[1]}`,f[0],`${f[0]} is de naam van deze vorm.`,{options:shuffle(r,['cirkel','driehoek','vierkant']),icon:f[1],audio:true}));}
   else if(mode===6){const a=pick(r,animals),b=pick(r,animals.filter(x=>x!==a));add(mathQ(`Wat komt daarna? ${a} ${b} ${a} ${b} ...`,a,'Het patroon wisselt steeds tussen twee plaatjes.',{options:shuffle(r,[a,b,'🌈']),icon:'🧩',audio:true}));}
   else if(mode===7){const n=2+Math.floor(r()*8);add(mathQ(`Welk getal staat vlak vóór ${n}?`,n-1,'Tel één stap terug.',{options:shuffle(r,[n-1,n,n+1,Math.max(0,n-2)]),icon:'⬅️',audio:true}));}
   else if(mode===8){const n=1+Math.floor(r()*9);add(mathQ(`Welk getal staat vlak ná ${n}?`,n+1,'Tel één stap verder.',{options:shuffle(r,[n+1,n,n+2,Math.max(0,n-1)]),icon:'➡️',audio:true}));}
   else{const red=1+Math.floor(r()*5),blue=1+Math.floor(r()*5);add(mathQ(`Er zijn ${'🔴'.repeat(red)} en ${'🔵'.repeat(blue)}. Hoeveel zijn er samen?`,red+blue,'Tel eerst rood en daarna blauw door.',{options:shuffle(r,[red+blue,red,blue,red+blue+1]),icon:'🎈',audio:true}));}
  }
  return items;
 }
 if(profile==="dani"){
  const division=!!curriculum.division, fractions=!!curriculum.fractions;
  const baseModes=['add','subtract','multiply','money','time','measure','area','sequence','word','tablemix','estimate','clock','perimeter','difference','logic'];
  if(division)baseModes.push('divide','divideStory');
  if(fractions)baseModes.push('fraction','fractionPicture');
  for(let i=0;i<count;i++){
   const mode=baseModes[i%baseModes.length];
   if(mode==='add'){const a=120+Math.floor(r()*780),b=25+Math.floor(r()*375);add(mathQ(`${a} + ${b} = ?`,a+b,'Tel eerst de honderdtallen, daarna tientallen en eenheden.',{answerType:'number'}));}
   else if(mode==='subtract'){const a=450+Math.floor(r()*500),b=35+Math.floor(r()*350);add(mathQ(`${a} − ${b} = ?`,a-b,'Trek in handige stappen af en controleer met optellen.',{answerType:'number'}));}
   else if(mode==='multiply'){const a=pick(r,[3,4,6,7,8,9]),b=2+Math.floor(r()*10);add(mathQ(`${a} × ${b} = ?`,a*b,`Gebruik de tafel van ${a}.`,{answerType:'number'}));}
   else if(mode==='money'){const paid=pick(r,[20,25,30,50]),price=pick(r,[7.5,12.75,18.4,23.9]);const ans=+(paid-price).toFixed(2);add(mathQ(`Een voetbalartikel kost € ${String(price.toFixed(2)).replace('.',',')}. Je betaalt € ${paid}. Hoeveel krijg je terug?`,ans,'Trek de prijs af van het betaalde bedrag.',{answerType:'money',accepted:[String(ans).replace('.',','),`€ ${String(ans).replace('.',',')}`],inputHint:'Bijvoorbeeld 7,25'}));}
   else if(mode==='time'){const h=pick(r,[14,15,16,17]),min=pick(r,[0,10,20,25,35,40]),dur=pick(r,[20,30,45,60,75]);const total=h*60+min+dur,hh=Math.floor(total/60)%24,mm=total%60,ans=`${hh}:${String(mm).padStart(2,'0')}`;add(mathQ(`De training start om ${h}:${String(min).padStart(2,'0')} en duurt ${dur} minuten. Hoe laat is hij klaar?`,ans,'Tel de minuten op. Bij 60 minuten begint een nieuw uur.',{answerType:'time',accepted:[ans,ans.replace(':','.'),ans.replace(':',''),`${hh} uur ${mm||''}`.trim()],inputHint:'Bijvoorbeeld 16:00'}));}
   else if(mode==='measure'){const cm=pick(r,[125,230,345,350,480]);const met=Math.floor(cm/100),rest=cm%100,ans=`${met} m ${rest} cm`;add(mathQ(`${cm} cm is hoeveel meter en centimeter?`,ans,'100 centimeter is 1 meter.',{answerType:'length',baseValueCm:cm,accepted:[ans,`${met}m${rest}cm`,`${cm} cm`,String(cm/100).replace('.',',')+' m'],inputHint:'Bijvoorbeeld 3 m 50 cm'}));}
   else if(mode==='area'){const l=pick(r,[6,8,12,15]),w=pick(r,[4,5,7,9]);add(mathQ(`Een rechthoek is ${l} cm lang en ${w} cm breed. Wat is de oppervlakte?`,l*w,'Oppervlakte = lengte × breedte.',{answerType:'area',accepted:[String(l*w),`${l*w} cm2`,`${l*w} cm²`],inputHint:'Je mag alleen het getal typen'}));}
   else if(mode==='perimeter'){const l=pick(r,[5,7,9,12]),w=pick(r,[3,4,6,8]),ans=2*l+2*w;add(mathQ(`Een voetbalveldje is ${l} m lang en ${w} m breed. Hoeveel meter is de rand rondom?`,ans,'Omtrek = lang + breed + lang + breed.',{answerType:'lengthM',accepted:[String(ans),`${ans} m`]}));}
   else if(mode==='sequence'){const start=2+Math.floor(r()*9),step=pick(r,[2,3,4,5,10]);add(mathQ(`Welk getal volgt? ${start}, ${start+step}, ${start+2*step}, ${start+3*step}, ...`,start+4*step,`Er komt steeds ${step} bij.`,{answerType:'number'}));}
   else if(mode==='word'){const rows=pick(r,[4,5,7]),seats=pick(r,[6,8,9]);add(mathQ(`Er zijn ${rows} rijen met ${seats} stoelen. Hoeveel stoelen zijn er samen?`,rows*seats,'Vermenigvuldig rijen met stoelen per rij.',{answerType:'number'}));}
   else if(mode==='tablemix'){const a=pick(r,[4,6,7,8,9]),ans=a*10;add(mathQ(`Dani maakt ${a} rondes van 10 push-ups. Hoeveel push-ups zijn dat?`,ans,'Vermenigvuldig het aantal rondes met 10.',{answerType:'number'}));}
   else if(mode==='estimate'){const a=pick(r,[187,243,398,612]),b=pick(r,[48,73,109]);const exact=a+b,estimate=Math.round(exact/10)*10;add(mathQ(`Schat ${a} + ${b} af op het dichtstbijzijnde tiental.`,estimate,'Bereken of rond eerst af en kies het dichtstbijzijnde tiental.',{answerType:'number',accepted:[String(estimate)]}));}
   else if(mode==='clock'){const h=pick(r,[3,4,7,8]),min=pick(r,[0,15,30,45]),ans=`${h}:${String(min).padStart(2,'0')}`;add(mathQ(`Schrijf de digitale tijd: ${h} uur en ${min} minuten.`,ans,'Zet uren vóór de dubbele punt en minuten erachter.',{answerType:'time',accepted:[ans,ans.replace(':','.'),ans.replace(':','')],inputHint:'Bijvoorbeeld 07:30'}));}
   else if(mode==='difference'){const a=pick(r,[640,725,850]),b=pick(r,[235,418,560]);add(mathQ(`Team Oranje heeft ${a} punten en team Blauw ${b}. Hoe groot is het verschil?`,a-b,'Verschil betekent: grootste min kleinste.',{answerType:'number'}));}
   else if(mode==='divide'){const d=pick(r,[2,3,4,5,10]),ans=2+Math.floor(r()*10),total=d*ans;add(mathQ(`${total} ÷ ${d} = ?`,ans,`Verdeel ${total} eerlijk over ${d} gelijke groepjes.`,{answerType:'number',lessonKey:'division'}));}
   else if(mode==='divideStory'){const teams=pick(r,[2,4,5]),per=pick(r,[3,4,6,8]),total=teams*per;add(mathQ(`${total} spelers worden eerlijk verdeeld over ${teams} teams. Hoeveel spelers per team?`,per,'Eerlijk verdelen is delen.',{answerType:'number',lessonKey:'division'}));}
   else if(mode==='fraction'){const den=pick(r,[2,4,5,8]),total=den*pick(r,[4,6,8]),ans=total/den;add(mathQ(`Wat is 1/${den} van ${total}?`,ans,`Verdeel ${total} in ${den} gelijke delen. Eén deel is het antwoord.`,{answerType:'number',lessonKey:'fractions'}));}
   else if(mode==='fractionPicture'){const den=pick(r,[2,4]),ans=1;add(mathQ(`Een voetbalveld is in ${den} gelijke stukken verdeeld. Hoeveel stuk is 1/${den}?`,ans,'De teller 1 betekent één van de gelijke stukken.',{options:shuffle(r,['1 stuk',`${den} stukken`,'geen stuk']),answer:'1 stuk',lessonKey:'fractions'}));}
   else{const a=pick(r,[12,15,18]),b=pick(r,[3,5,6]);add(mathQ(`${a} + ? = ${a+b}`,b,'Zoek het verschil tussen de uitkomst en het bekende getal.',{answerType:'number'}));}
  }
  return items;
 }
 // Zana: schaalbaar van groep 8 tot bovenbouw, met huidige focus op groep 8/brugklas.
 const modes=level<6?['percent','fraction','decimal','ratio','money','average','scale','algebra1','geometry','speed','probability','data']:
   level<9?['algebra2','linear','percentGrowth','pythagoras','probability2','formula','ratio','statistics','interest','units','geometry2','functions']:
   ['quadratic','systems','exponent','statistics2','probability2','functions','chemRatio','physicsSpeed','financeGrowth','geometry2','algebra2','formula'];
 for(let i=0;i<count;i++){
  const mode=modes[i%modes.length];
  if(mode==='percent'){const base=pick(r,[80,120,160,240,360]),pct=pick(r,[10,15,20,25,30,40]);add(mathQ(`Hoeveel is ${pct}% van ${base}?`,base*pct/100,'Bereken 10% of gebruik percentage × totaal ÷ 100.',{answerType:'number'}));}
  else if(mode==='fraction'){const den=pick(r,[4,5,8,10]),num=1+Math.floor(r()*(den-1)),total=den*pick(r,[6,8,12]);add(mathQ(`Bereken ${num}/${den} van ${total}.`,num*total/den,'Deel door de noemer en vermenigvuldig met de teller.',{answerType:'number'}));}
  else if(mode==='decimal'){const a=pick(r,[1.25,2.4,3.75,6.8]),b=pick(r,[0.6,1.35,2.25,4.4]),ans=+(a+b).toFixed(2);add(mathQ(`${String(a).replace('.',',')} + ${String(b).replace('.',',')} = ?`,ans,'Zet de komma’s onder elkaar.',{answerType:'number'}));}
  else if(mode==='ratio'){const [x,y]=pick(r,[[2,3],[3,5],[4,7]]),f=pick(r,[4,6,8]);add(mathQ(`De verhouding blauw : roze is ${x}:${y}. Er zijn ${x*f} blauwe. Hoeveel roze?`,y*f,'Bepaal de vermenigvuldigingsfactor.',{answerType:'number'}));}
  else if(mode==='money'){const old=pick(r,[60,80,120,150]),pct=pick(r,[15,20,25,30]),ans=+(old*(1-pct/100)).toFixed(2);add(mathQ(`Een jas van € ${old} krijgt ${pct}% korting. Wat is de nieuwe prijs?`,ans,'Bereken de korting en trek die af.',{answerType:'money'}));}
  else if(mode==='average'){const vals=shuffle(r,[6,8,10,12,14]).slice(0,4),ans=vals.reduce((a,b)=>a+b,0)/4;add(mathQ(`Wat is het gemiddelde van ${vals.join(', ')}?`,ans,'Tel alle waarden op en deel door vier.',{answerType:'number'}));}
  else if(mode==='scale'){const scale=pick(r,[100,200,500]),cm=pick(r,[3,4,6,8]),ans=cm*scale/100;add(mathQ(`Schaal 1:${scale}. Op de kaart is de afstand ${cm} cm. Hoeveel meter echt?`,ans,'Vermenigvuldig met de schaal en zet cm om naar m.',{answerType:'lengthM',accepted:[String(ans),`${ans} m`]}));}
  else if(mode==='algebra1'){const a=3+Math.floor(r()*9),b=a+7+Math.floor(r()*15);add(mathQ(`Los op: x + ${a} = ${b}.`,b-a,'Trek aan beide kanten hetzelfde getal af.',{answerType:'number',lessonKey:'algebra'}));}
  else if(mode==='geometry'){const l=pick(r,[8,12,15]),w=pick(r,[4,6,9]);add(mathQ(`Een rechthoek is ${l} cm bij ${w} cm. Bereken de oppervlakte.`,l*w,'Oppervlakte = lengte × breedte.',{answerType:'area'}));}
  else if(mode==='speed'){const t=pick(r,[2,3,4]),speed=pick(r,[30,45,60]);add(mathQ(`Een trein rijdt ${speed*t} km in ${t} uur. Gemiddelde snelheid?`,speed,'Snelheid = afstand ÷ tijd.',{answerType:'speed',accepted:[String(speed),`${speed} km/u`]}));}
  else if(mode==='probability'){const red=pick(r,[2,3,4]),total=red+pick(r,[3,4,5]);add(mathQ(`In een zak zitten ${red} rode van in totaal ${total} ballen. Kans op rood als breuk?`,`${red}/${total}`,'Gunstige uitkomsten gedeeld door alle uitkomsten.',{answerType:'fraction',accepted:[`${red}/${total}`,String(red/total).replace('.',',')]}));}
  else if(mode==='data'){const start=pick(r,[120,150,200]),end=start+pick(r,[30,50,80]);add(mathQ(`Een waarde stijgt van ${start} naar ${end}. Hoe groot is de absolute stijging?`,end-start,'Eindwaarde min beginwaarde.',{answerType:'number'}));}
  else if(mode==='algebra2'){const a=pick(r,[2,3,4]),x=pick(r,[4,5,7]),b=pick(r,[3,6,9]),total=a*x+b;add(mathQ(`Los op: ${a}x + ${b} = ${total}.`,x,`Trek eerst ${b} af en deel daarna door ${a}.`,{answerType:'number',lessonKey:'algebra'}));}
  else if(mode==='linear'){const a=pick(r,[2,3,4]),b=pick(r,[1,5,7]),x=pick(r,[2,3,5]);add(mathQ(`Voor y = ${a}x + ${b}, bereken y als x = ${x}.`,a*x+b,'Vul x in en voer vermenigvuldigen vóór optellen uit.',{answerType:'number'}));}
  else if(mode==='percentGrowth'){const start=pick(r,[200,400,750]),pct=pick(r,[5,8,12]),ans=+(start*(1+pct/100)).toFixed(2);add(mathQ(`€ ${start} groeit één jaar met ${pct}%. Nieuwe waarde?`,ans,'Vermenigvuldig met 1 + het groeipercentage.',{answerType:'money'}));}
  else if(mode==='pythagoras'){const tri=pick(r,[[3,4,5],[5,12,13],[6,8,10]]);add(mathQ(`Een rechthoekige driehoek heeft rechthoekszijden ${tri[0]} en ${tri[1]}. Schuine zijde?`,tri[2],'Gebruik a² + b² = c².',{answerType:'number'}));}
  else if(mode==='probability2'){const p1=pick(r,[0.2,0.25,0.4]),p2=pick(r,[0.5,0.6,0.75]),ans=+(p1*p2).toFixed(3);add(mathQ(`Twee onafhankelijke kansen zijn ${String(p1).replace('.',',')} en ${String(p2).replace('.',',')}. Kans op beide?`,ans,'Bij onafhankelijke gebeurtenissen vermenigvuldig je de kansen.',{answerType:'number'}));}
  else if(mode==='formula'){const u=pick(r,[12,15,18]),iAmp=pick(r,[2,3,4]);add(mathQ(`Gebruik P = U × I. U = ${u} V en I = ${iAmp} A. Bereken P.`,u*iAmp,'Vul de waarden in de formule in.',{answerType:'number'}));}
  else if(mode==='statistics'){const vals=[4,7,7,8,9,10];add(mathQ(`Wat is de mediaan van ${vals.join(', ')}?`,7.5,'Bij zes waarden is de mediaan het gemiddelde van de twee middelste.',{answerType:'number'}));}
  else if(mode==='interest'){const start=pick(r,[500,1000]),pct=pick(r,[4,5]),ans=+(start*(1+pct/100)**2).toFixed(2);add(mathQ(`€ ${start} groeit twee jaar met ${pct}% samengestelde rente. Waarde na twee jaar?`,ans,'Vermenigvuldig tweemaal met de groeifactor.',{answerType:'money'}));}
  else if(mode==='units'){const km=pick(r,[1.2,2.5,3.75]);add(mathQ(`${String(km).replace('.',',')} km is hoeveel meter?`,km*1000,'Eén kilometer is 1.000 meter.',{answerType:'lengthM',accepted:[String(km*1000),`${km*1000} m`]}));}
  else if(mode==='geometry2'){const r0=pick(r,[3,5,10]),ans=+(Math.PI*r0*r0).toFixed(1);add(mathQ(`Een cirkel heeft straal ${r0} cm. Oppervlakte met π ≈ 3,14?`,+(3.14*r0*r0).toFixed(1),'Gebruik π × r².',{answerType:'number',tolerance:.15}));}
  else if(mode==='functions'){const x=pick(r,[-2,-1,2,3]),ans=x*x-2*x+1;add(mathQ(`Voor f(x)=x²−2x+1, bereken f(${x}).`,ans,'Vul x overal in en werk machten eerst uit.',{answerType:'number'}));}
  else if(mode==='quadratic'){const root=pick(r,[2,3,4,5]);add(mathQ(`Los op voor de positieve oplossing: x² = ${root*root}.`,root,'Neem de positieve wortel.',{answerType:'number'}));}
  else if(mode==='systems'){const x=pick(r,[2,3,4]),y=pick(r,[1,5,6]);add(mathQ(`x + y = ${x+y} en x − y = ${x-y}. Bereken x.`,x,'Tel de vergelijkingen op en deel door twee.',{answerType:'number'}));}
  else if(mode==='exponent'){const base=pick(r,[2,3,5]),pow=pick(r,[3,4]);add(mathQ(`${base}^${pow} = ?`,base**pow,'Een macht is herhaald vermenigvuldigen.',{answerType:'number'}));}
  else if(mode==='statistics2'){const vals=[2,4,6,8,10],mean=6;add(mathQ(`Wat is de gemiddelde afwijking van ${vals.join(', ')} ten opzichte van ${mean}?`,2.4,'Bereken absolute afstanden tot het gemiddelde en neem daarvan het gemiddelde.',{answerType:'number',tolerance:.05}));}
  else if(mode==='chemRatio'){add(mathQ('Een reactie gebruikt 2 mol H₂ per 1 mol O₂. Hoeveel mol H₂ voor 3 mol O₂?',6,'Gebruik de verhouding 2:1.',{answerType:'number'}));}
  else if(mode==='physicsSpeed'){const v=pick(r,[12,15,20]),t=pick(r,[4,5,6]);add(mathQ(`Een voorwerp beweegt ${t} s met ${v} m/s. Afstand?`,v*t,'Afstand = snelheid × tijd.',{answerType:'number'}));}
  else if(mode==='financeGrowth'){const start=pick(r,[1000,2500]),pct=pick(r,[3,6]),yrs=3,ans=+(start*(1+pct/100)**yrs).toFixed(2);add(mathQ(`€ ${start} groeit ${yrs} jaar met ${pct}% per jaar. Eindwaarde?`,ans,'Gebruik samengestelde groei: begin × groeifactor^jaren.',{answerType:'money'}));}
 }
 return items;
}
C.makeMath=makeMathV4;

// ---------- Shop-uitbreiding ----------
const extraShop=[
 {id:'hair-curly',cat:'hair',name:'Krullen',art:'🌀',price:180,value:'#5a3825'},{id:'hair-red',cat:'hair',name:'Rood haar',art:'🧡',price:170,value:'#a44228'},{id:'top-hockey',cat:'top',name:'Hockeytenue',art:'🏑',price:220,value:'#9b64e8'},{id:'top-unicorn',cat:'top',name:'Unicorn hoodie',art:'🦄',price:260,value:'#ef8fd1'},{id:'top-football',cat:'top',name:'Oranje voetbalshirt',art:'⚽',price:240,value:'#f47b25'},{id:'top-glitter',cat:'top',name:'Glitter outfit',art:'✨',price:300,value:'#dc78dc'},
 {id:'acc-wings',cat:'accessory',name:'Feeënvleugels',art:'🪽',price:360,value:'🪽'},{id:'acc-tiara',cat:'accessory',name:'Tiara',art:'👸',price:320,value:'👑'},{id:'acc-karate',cat:'accessory',name:'Karateband',art:'🥋',price:230,value:'🥋'},{id:'acc-watch',cat:'accessory',name:'Slim horloge',art:'⌚',price:280,value:'⌚'},
 {id:'pet-unicorn',cat:'pet',name:'Mini-unicorn',art:'🦄',price:520,value:'🦄'},{id:'pet-dino',cat:'pet',name:'Babydino',art:'🦕',price:520,value:'🦕'},{id:'pet-cat',cat:'pet',name:'Kat',art:'🐱',price:240,value:'🐱'},{id:'pet-fairy',cat:'pet',name:'Mini-fee',art:'🧚',price:560,value:'🧚'},
 {id:'world-goal',cat:'world',name:'Voetbalgoal',art:'🥅',price:180,value:'🥅',zones:['stadium']},{id:'world-stands',cat:'world',name:'Tribune',art:'🎟️',price:450,value:'🎟️',zones:['stadium','hockey']},{id:'world-scoreboard',cat:'world',name:'Scorebord',art:'📺',price:350,value:'📺',zones:['stadium','hockey']},{id:'world-gym',cat:'world',name:'Sportschool',art:'🏋️',price:480,value:'🏋️',zones:['home','dojo','city']},{id:'world-dojo',cat:'world',name:'Karate Dojo',art:'🥋',price:600,value:'🥋',zones:['dojo']},
 {id:'world-ferrari',cat:'world',name:'Rode supercar',art:'🏎️',price:900,value:'🏎️',zones:['garage','city']},{id:'world-workshop',cat:'world',name:'Uitvinderswerkplaats',art:'🛠️',price:620,value:'🛠️',zones:['garage','space']},{id:'world-alien',cat:'world',name:'Alienbasis',art:'🛸',price:750,value:'🛸',zones:['space']},{id:'world-moon',cat:'world',name:'Maanbasis',art:'🌕',price:700,value:'🌕',zones:['space']},
 {id:'world-fashion',cat:'world',name:'Fashion Studio',art:'👗',price:600,value:'👗',zones:['fashion','city']},{id:'world-jewelry',cat:'world',name:'Sieradenatelier',art:'💎',price:580,value:'💎',zones:['fashion','city']},{id:'world-cafe',cat:'world',name:'Campus Café',art:'☕',price:380,value:'☕',zones:['campus','city']},{id:'world-library',cat:'world',name:'Bibliotheek',art:'📚',price:480,value:'📚',zones:['campus']},{id:'world-airport',cat:'world',name:'Airport',art:'🛫',price:760,value:'🛫',zones:['travel']},{id:'world-london',cat:'world',name:'London',art:'🇬🇧',price:700,value:'🇬🇧',zones:['travel','campus']},{id:'world-nyc',cat:'world',name:'New York',art:'🗽',price:800,value:'🗽',zones:['travel','city']},
 {id:'world-unicorn',cat:'world',name:'Unicornstal',art:'🦄',price:420,value:'🦄',zones:['unicorn']},{id:'world-rainbow',cat:'world',name:'Regenboogbrug',art:'🌈',price:350,value:'🌈',zones:['unicorn','fairy']},{id:'world-fairyhome',cat:'world',name:'Feeënhuis',art:'🧚',price:480,value:'🧚',zones:['fairy']},{id:'world-candycastle',cat:'world',name:'Snoepkasteel',art:'🍭',price:650,value:'🍭',zones:['candy']},{id:'world-mermaid',cat:'world',name:'Zeemeerminpaleis',art:'🧜‍♀️',price:700,value:'🧜‍♀️',zones:['ocean']},{id:'world-puppypark',cat:'world',name:'Puppypark',art:'🐕',price:380,value:'🐕',zones:['animals']},
 {id:'world-fountain',cat:'world',name:'Fontein',art:'⛲',price:300,value:'⛲',zones:['home','campus','city','unicorn']},{id:'world-tree',cat:'world',name:'Grote boom',art:'🌳',price:150,value:'🌳'},{id:'world-cloud',cat:'world',name:'Wolkenmachine',art:'☁️',price:250,value:'☁️'},{id:'world-lights',cat:'world',name:'Feestlichten',art:'🎇',price:320,value:'🎇'}
];
for(const item of extraShop)if(!shopItems.some(x=>x.id===item.id))shopItems.push(item);
// Bestaande werelditems bruikbaar maken in logische zones.
for(const i of shopItems.filter(x=>x.cat==='world')){
 if(!i.zones){
  if(i.id.includes('stadium'))i.zones=['stadium','hockey'];
  else if(i.id.includes('campus')||i.id.includes('tower')||i.id.includes('shop'))i.zones=['campus','city','fashion'];
  else if(i.id.includes('rocket'))i.zones=['space','travel'];
  else if(i.id.includes('lambo'))i.zones=['garage','city'];
  else if(i.id.includes('dino'))i.zones=['adventure','animals'];
  else if(i.id.includes('beach')||i.id.includes('pool'))i.zones=['beach','ocean','home'];
  else if(i.id.includes('hockey'))i.zones=['hockey'];
  else i.zones=['home','city','unicorn','animals'];
 }
}

C.storyUniverse={dani:daniMatches.length*daniAdventures.length*daniCompanions.length*daniTwists.length,zana:zanaCases.length*zanaRoles.length*zanaComplications.length,lena:lenaWorlds.length*6*20};
})();
