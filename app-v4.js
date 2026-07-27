"use strict";
/* LevelUp Leren 4.0 – major experience, curriculum, accessibility and monitoring upgrade. */

const V4_DEFAULT_CODES={dani:"1231",zana:"1405",lena:"3441"};
const V4_OLD_DEFAULT_CODES={dani:"2581",zana:"2582",lena:"2583"};
const V4_MAX_LEVEL={lena:4,dani:7,zana:12};
const V4_MIN_LEVEL={lena:1,dani:1,zana:1};
let readingRecognition=null,readingTranscript="",readingRecognitionActive=false;
let learnTab="missions",gameMode="robot";

function migrateV4(){
 state.version=4;
 state.parent.codes=state.parent.codes||{};
 for(const id of ["dani","zana","lena"]){
  if(!state.parent.codes[id]||state.parent.codes[id]===V4_OLD_DEFAULT_CODES[id])state.parent.codes[id]=V4_DEFAULT_CODES[id];
  const pr=state.profiles[id];
  pr.curriculum={division:false,fractions:false,time:false,algebra:false,sources:false,alphabet:false,numbers:false,...(pr.curriculum||{})};
  pr.settings={sound:true,timer:true,autoSpeak:id==="lena",focusMinutes:id==="lena"?5:id==="dani"?10:15,...(pr.settings||{})};
  pr.readingAssessments=pr.readingAssessments||[];
  pr.learningHistory=pr.learningHistory||[];
  pr.activeWorld=pr.activeWorld||PROFILE_META[id].worldZones?.[0]?.id||"home";
  pr.worlds=pr.worlds||{};
  const zones=PROFILE_META[id].worldZones||[];
  for(const z of zones)if(!Array.isArray(pr.worlds[z.id]))pr.worlds[z.id]=Array(30).fill(null);
  if(Array.isArray(pr.world)&&pr.world.some(Boolean)){
    const first=zones[0]?.id||"home";
    pr.world.forEach((v,i)=>{if(v&&i<pr.worlds[first].length&&!pr.worlds[first][i])pr.worlds[first][i]=v});
  }
  for(const sk of Object.values(pr.skills||{})){
    sk.mastery=Number.isFinite(sk.mastery)?sk.mastery:Math.round((sk.accuracy||0));
    sk.confidence=Number.isFinite(sk.confidence)?sk.confidence:Math.min(1,(sk.attempts||0)/6);
    sk.recent=Array.isArray(sk.recent)?sk.recent:[];
  }
 }
 save();
}

ratingLabel=function(id,r){
 if(id==="lena")return r<1.5?"groep 1/2 start":r<2.5?"groep 2":r<3.5?"eind groep 2":"groep 3-start";
 if(id==="dani")return r<2?"begin groep 5":r<3?"midden groep 5":r<4?"eind groep 5":r<5?"groep 6-start":r<6?"groep 6":"plus groep 6/7";
 if(r<2)return"groep 7";if(r<3)return"groep 8 basis";if(r<4)return"groep 8 plus";if(r<5)return"brugklas HAVO/VWO";if(r<6)return"2 HAVO/VWO";if(r<7)return"3 HAVO";if(r<8)return"3 VWO";if(r<9)return"4 HAVO";if(r<10)return"4/5 VWO";if(r<11)return"5 HAVO / 5 VWO";return"eind middelbare school";
};
function v4LevelPct(id,r){return clamp((r-V4_MIN_LEVEL[id])/(V4_MAX_LEVEL[id]-V4_MIN_LEVEL[id])*100,0,100)}
function curriculumName(k){return{division:"Delen",fractions:"Breuken",time:"Klokkijken",algebra:"Algebra",sources:"Bronnen beoordelen",alphabet:"Alfabet",numbers:"Getallen"}[k]||k}

function plainText(s){return String(s??"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"").replace(/[^a-z0-9,:./²%-]+/g," ").trim().replace(/\s+/g," ")}
function parseDutchNumber(v){
 let s=plainText(v).replace(/€/g,"").replace(/\s/g,"").replace(/\.(?=\d{3}(?:\D|$))/g,"").replace(",",".");
 const n=Number(s.replace(/[^0-9+\-.]/g,""));return Number.isFinite(n)?n:null;
}
function parseTimeMinutes(v){
 let s=plainText(v).replace(/uur/g,":").replace(/[u.]/g,":").replace(/\s/g,"");
 if(/^\d{1,2}:$/.test(s))s=s.slice(0,-1);
 if(/^\d{3,4}$/.test(s)){s=s.padStart(4,"0");const h=+s.slice(0,-2),m=+s.slice(-2);return h<24&&m<60?h*60+m:null}
 if(/^\d{1,2}$/.test(s)){const h=+s;return h<24?h*60:null}
 const m=s.match(/^(\d{1,2}):(\d{1,2})$/);if(!m)return null;const hh=+m[1],mm=+m[2];return hh<24&&mm<60?hh*60+mm:null;
}
function parseLengthCm(v){
 const s=plainText(v).replace(/\s/g,"");
 let m=s.match(/^(\d+(?:[.,]\d+)?)m(?:(\d+(?:[.,]\d+)?)cm)?$/);if(m)return Number(m[1].replace(',','.'))*100+(m[2]?Number(m[2].replace(',','.')):0);
 m=s.match(/^(\d+(?:[.,]\d+)?)cm$/);if(m)return Number(m[1].replace(',','.'));
 const n=parseDutchNumber(s);return n;
}
function parseFraction(v){
 const s=plainText(v).replace(/\s/g,"");const m=s.match(/^(-?\d+)\/(\d+)$/);if(m)return +m[1]/+m[2];
 if(s.endsWith('%'))return parseDutchNumber(s)/100;return parseDutchNumber(s);
}
function smartAnswer(q,selected){
 const raw=String(selected??"").trim(),answer=String(q.answer??"").trim();
 const accepted=[answer,...(q.accepted||[])];
 if(q.options){const correct=plainText(raw)===plainText(answer);return{correct,interpretation:raw};}
 if(accepted.some(x=>plainText(x)===plainText(raw)))return{correct:true,interpretation:raw};
 const type=q.answerType||"text",tol=Number.isFinite(q.tolerance)?q.tolerance:0.011;
 if(type==="time"){
  const a=parseTimeMinutes(answer),b=parseTimeMinutes(raw);return{correct:a!==null&&b!==null&&a===b,interpretation:b===null?raw:`${Math.floor(b/60)}:${String(b%60).padStart(2,'0')}`};
 }
 if(type==="length"||type==="lengthM"){
  const target=Number.isFinite(q.baseValueCm)?q.baseValueCm:(type==="lengthM"?parseDutchNumber(answer)*100:parseLengthCm(answer));
  let got=parseLengthCm(raw);if(type==="lengthM"&&!/[a-z]/i.test(raw)&&got!==null)got*=100;
  return{correct:target!==null&&got!==null&&Math.abs(target-got)<.51,interpretation:got===null?raw:`${got} cm`};
 }
 if(type==="fraction"){
  const a=parseFraction(answer),b=parseFraction(raw);return{correct:a!==null&&b!==null&&Math.abs(a-b)<=tol,interpretation:b===null?raw:String(b).replace('.',',')};
 }
 if(["number","money","area","speed"].includes(type)){
  const a=parseDutchNumber(answer),b=parseDutchNumber(raw);return{correct:a!==null&&b!==null&&Math.abs(a-b)<=tol,interpretation:b===null?raw:String(b).replace('.',',')};
 }
 return{correct:plainText(raw)===plainText(answer),interpretation:raw};
}

function v4InputMode(q){return["time","length","lengthM","fraction"].includes(q.answerType)?"text":q.answerType?"decimal":"text"}
function v4QuickKeys(q){
 if(q.answerType==="time")return[":","00","15","30","45"];
 if(q.answerType==="length"||q.answerType==="lengthM")return[" m "," cm",","];
 if(q.answerType==="fraction")return["/",","];
 if(q.answerType==="money")return[","];
 return[];
}
window.appendInput=x=>{const e=$("#answerInput");if(!e)return;e.value=(e.value||"")+x;e.focus();state.task.selected=e.value};

renderProfiles=function(){
 document.body.dataset.profile="";
 $("#app").innerHTML=`<main class="profile-screen v4-profile"><section class="profile-wrap"><div class="brand" style="justify-content:center"><span class="brand-mark">⚡</span> LevelUp Leren 4</div><h1>Wie gaat er op avontuur?</h1><p class="lead">Veilige, persoonlijke leerwerelden met eigen code, niveau, skins, spellen en voortgang.</p><div class="profile-grid">${["dani","zana","lena"].map(profileTile).join("")}</div><button class="ghost parent-entry" style="margin-top:22px" onclick="openPin('parent')">🔐 Papa-dashboard</button><p class="muted" style="margin-top:13px;font-size:13px">Vraag papa om je persoonlijke code. Je kunt die daarna in je eigen profiel wijzigen.</p></section></main>`;
};
profileTile=function(id){const x=PROFILE_META[id],pr=state.profiles[id];return`<button class="profile-tile ${id}" onclick="openPin('${id}')"><div class="profile-art profile-art-v4"><span class="profile-orbit"></span>${x.icon}</div><div class="profile-body"><span class="eyebrow">${esc(x.grade)}</span><h2>${x.name}</h2><p class="muted">${x.subtitle}</p><div class="tag-row">${x.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div><div class="lock-note">🔒 Persoonlijke code · level ${level(pr.xp)} · 🪙 ${pr.coins}</div></div></button>`};

shell=function(body,active){
 document.body.dataset.profile=state.currentProfile;
 return`<div class="app-shell ${state.currentProfile==='lena'?'lena-shell':''}"><header class="topbar"><div class="brand"><span class="brand-mark">⚡</span><span>LevelUp Leren</span></div><div class="top-actions"><span class="pill">🪙 ${p().coins}</span>${state.currentProfile==='lena'?`<button class="icon-btn horn" onclick="readCurrentScreen()" title="Lees dit scherm voor">📣</button>`:""}<button class="icon-btn" onclick="openOwnCode()" title="Mijn code wijzigen">🔑</button><button class="icon-btn" onclick="switchProfile()" title="Profiel wisselen">${m().icon}</button><button class="icon-btn" onclick="openPin('parent')" title="Papa-dashboard">🔐</button></div></header><main class="content">${body}</main><nav class="bottom-nav">${nav("home","🏠","Missies",active)}${nav("learn","📚","Leren",active)}${nav("games","🎮","Spellen",active)}${nav("market","🛍️","Shop",active)}${nav("world","🌍","Werelden",active)}${nav("progress","📈","Groei",active)}</nav></div>`;
};
window.readCurrentScreen=()=>{const main=document.querySelector("main");if(main)speak(main.innerText.replace(/\s+/g,' ').slice(0,1800))};

renderHome=function(){
 const pr=p(),done=pr.daily.completed.length,total=pr.daily.plan.length,next=pr.daily.plan.findIndex((_,i)=>!pr.daily.completed.includes(i)),universe=C.storyUniverse?.[state.currentProfile]||1000;
 const body=`<section class="hero v4-hero"><div class="card hero-copy"><div class="floating-shapes"><i>⭐</i><i>⚽</i><i>🚀</i></div><span class="eyebrow">${new Intl.DateTimeFormat("nl-NL",{weekday:"long"}).format(new Date())} · dagmissie</span><h1>${greeting()}, ${m().name}!</h1><p class="lead">${done>=total?"Dagminimum gehaald. De bonuswerelden, spellen en leerstudio blijven onbeperkt open.":`Nog ${total-done} minimale opdracht${total-done===1?"":"en"}. Rustig goed maken levert meer op dan snel doorklikken.`}</p><div class="hero-stats"><div class="hero-stat"><span>🔥</span><div><strong>${pr.streakDays}</strong><small>actieve dagen</small></div></div><div class="hero-stat"><span>🪙</span><div><strong>${pr.coins}</strong><small>LevelCoins</small></div></div><div class="hero-stat"><span>🏆</span><div><strong>${pr.completed}</strong><small>missies</small></div></div></div></div><div class="card hero-avatar"><div class="world-window mini-world ${pr.activeWorld}"><span class="cloud c1">☁️</span><span class="cloud c2">☁️</span><div class="avatar-bubble">${avatarHTML()}</div></div><h3>${m().subtitle}</h3><div class="tag-row" style="justify-content:center"><button class="ghost" onclick="setView('market')">Nieuwe skin</button><button class="ghost" onclick="setView('world')">Mijn wereld</button></div></div></section>
 <div class="grid-2"><section class="card"><div class="section-head" style="margin-top:0"><div><span class="eyebrow">Dagminimum</span><h2>${done}/${total} klaar</h2></div><strong>${Math.round(done/total*100)}%</strong></div><div class="progress" style="margin-bottom:16px"><span style="--w:${done/total*100}%"></span></div><div class="daily-list">${pr.daily.plan.map((s,i)=>missionItem(s,i,pr.daily.completed.includes(i),i===next)).join("")}</div></section><section class="card"><span class="eyebrow">Vrije keuze</span><h2>Speel, leer of verdien coins</h2><p class="muted">Na het minimum mag je onbeperkt doorgaan. Kies wat nu bij je past.</p><div class="activity-strip">${m().free.slice(0,7).map(s=>activityCard(s)).join("")}</div><button class="primary" onclick="setView('learn')">Open de volledige leerstudio</button></section></div>
 <div class="section-head"><div><span class="eyebrow">Story Universe</span><h2>Minstens 1.000 dagen nieuwe verhalen</h2></div><span class="pill">${universe.toLocaleString('nl-NL')}+ combinaties</span></div><section class="card story-universe"><div class="grid-3"><div class="glass"><h3>${state.currentProfile==='zana'?'Young-adult mysteries & dilemma’s':state.currentProfile==='dani'?'Voetbal, spanning en uitvinden':'Unicorns, dieren en magie'}</h3><p class="muted">Verhaalonderdelen, locaties, problemen en personages worden inhoudelijk gecombineerd.</p></div><div class="glass"><h3>${state.currentProfile==='zana'?'11 diepgaande vragen':state.currentProfile==='dani'?'8 inhoudelijke vragen':'4 luistervragen'}</h3><p class="muted">Feiten, verbanden, conclusie, bewijs en uitleg — niet alleen losse woordjes terugzoeken.</p></div><div class="glass"><h3>Persoonlijk niveau</h3><p class="muted">Het systeem beweegt sneller omhoog of omlaag en toont altijd waarom.</p></div></div></section>`;
 $("#app").innerHTML=shell(body,"home");
};

renderLearn=function(){
 const lessonCards=state.currentProfile==='dani'?[['learn-division','🍕','Delen vanaf nul'],['learn-fractions','⚽','Breuken met velden'],['learn-time','⏰','Klokkijken & tijden']]:state.currentProfile==='zana'?[['learn-algebra','🧩','Algebra stap voor stap'],['learn-sources','🔎','Bronnen, bias & bewijs']]:[['learn-alphabet','🔤','Alfabetavontuur'],['learn-numbers','🌟','Getallenwereld']];
 const future=state.currentProfile==='zana'?['Biologie','Natuurkunde','Scheikunde','Economie','Wiskunde tot VWO-eindexamen']:state.currentProfile==='dani'?['Groep 6 rekenen','Wereldoriëntatie','Engels','Studievaardigheden']:['Groep 3 lezen','Kleine sommen','Schrijven','Wereld ontdekken'];
 const body=`<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Leerstudio</span><h1>Kies: oefenen of eerst begrijpen</h1></div><p class="muted">Nieuwe onderwerpen worden eerst visueel uitgelegd. Daarna pas getoetst.</p></div><div class="learn-tabs"><button class="${learnTab==='missions'?'primary':'ghost'}" onclick="setLearnTab('missions')">⚡ Oefenmissies</button><button class="${learnTab==='lessons'?'primary':'ghost'}" onclick="setLearnTab('lessons')">🎓 Uitleglab</button><button class="${learnTab==='roadmap'?'primary':'ghost'}" onclick="setLearnTab('roadmap')">🗺️ Leerroute</button></div>${learnTab==='missions'?`<div class="games-grid">${m().free.filter(s=>!s.startsWith('learn-')).map(s=>{const a=ACTIVITY_META[s];return`<button class="game-tile" onclick="startActivity('${s}',null)"><div class="big">${a.icon}</div><h3>${a.title}</h3><p class="muted">${a.desc}</p><span class="pill">${s==='math'?'20 gevarieerde vragen':s==='spelling'||s==='language'?'15 duidelijke vragen':s==='reading'||s==='story'?'nieuw verhaal':'adaptief'}</span></button>`}).join("")}</div>`:learnTab==='lessons'?`<div class="games-grid">${lessonCards.map(([s,ic,n])=>`<button class="game-tile lesson-tile ${p().curriculum[s.replace('learn-','')]?'mastered':''}" onclick="startActivity('${s}',null)"><div class="big">${p().curriculum[s.replace('learn-','')]?'✅':ic}</div><h3>${n}</h3><p class="muted">Geanimeerde uitleg, begeleide voorbeelden en een korte beheersingscheck.</p></button>`).join("")}</div>`:`<section class="card roadmap"><h2>Van nu tot einde middelbare school</h2><p class="lead">De architectuur kan doorlopen tot kader, mavo, havo en vwo. De actieve inhoud blijft bewust gericht op wat nu relevant is.</p><div class="roadmap-line"><div class="road-stop active"><strong>Nu</strong><span>${m().grade}</span></div>${future.map((x,i)=>`<div class="road-stop ${i===0?'next':''}"><strong>${i+2}</strong><span>${x}</span></div>`).join("")}</div></section>`}<div class="section-head"><div><span class="eyebrow">Adaptief niveau</span><h2>Per vaardigheid apart</h2></div></div><section class="card skill-dashboard">${Object.entries(p().skills).filter(([s])=>m().free.includes(s)||m().subjects.includes(s)).map(([s,sk])=>`<div class="skill-v4"><div><strong>${ACTIVITY_META[s]?.icon||'⚡'} ${subjectName(state.currentProfile,s)}</strong><small>${ratingLabel(state.currentProfile,sk.rating)} · vertrouwen ${Math.round((sk.confidence||0)*100)}%</small></div><div class="progress"><span style="--w:${v4LevelPct(state.currentProfile,sk.rating)}%"></span></div><span class="pill">${sk.rating.toFixed(1)}</span></div>`).join("")}</section>`;
 $("#app").innerHTML=shell(body,"learn");
};
window.setLearnTab=x=>{learnTab=x;renderLearn()};

// ---------- Activiteiten, uitlegmodules en toegankelijke taken ----------
const LESSONS={
 division:{title:"Delen is eerlijk verdelen",icon:"🍕",unlock:"division",steps:[
  {title:"Maak gelijke teams",visual:"<div class='lesson-pitch'><span>⚽</span><span>⚽</span><span>⚽</span><span>⚽</span><span>⚽</span><span>⚽</span><i></i><i></i></div>",text:"Zes ballen eerlijk over twee teams betekent: ieder team krijgt evenveel. Leg om de beurt één bal bij elk team."},
  {title:"Schrijf de deelsom",visual:"<div class='lesson-equation'>6 ÷ 2 = 3</div>",text:"Het eerste getal is wat je hebt. Het tweede getal is het aantal gelijke groepjes. De uitkomst zegt hoeveel er in ieder groepje komt."},
  {title:"Controleer met keer",visual:"<div class='lesson-equation'>3 × 2 = 6 ✅</div>",text:"Je antwoord controleren is eenvoudig: aantal per groep × aantal groepen moet weer het totaal zijn."},
  {title:"Jouw beurt",question:{prompt:"12 spelers worden verdeeld over 3 gelijke teams. Hoeveel per team?",answer:"4",options:["3","4","6","9"],explain:"Deel 12 één voor één over drie teams. Elk team krijgt 4 spelers."}}
 ]},
 fractions:{title:"Breuken zijn gelijke stukken",icon:"⚽",unlock:"fractions",steps:[
  {title:"Eerst eerlijk verdelen",visual:"<div class='fraction-circle'><i></i><i></i><i></i><i></i></div>",text:"Een breuk werkt alleen wanneer het geheel in gelijke delen is verdeeld."},
  {title:"Noemer onderaan",visual:"<div class='lesson-equation'><span class='frac'><b>1</b><b>4</b></span> = één van vier gelijke delen</div>",text:"Het getal onder de streep heet de noemer. Het vertelt in hoeveel gelijke delen het geheel is verdeeld."},
  {title:"Teller bovenaan",visual:"<div class='lesson-equation'><span class='frac'><b>3</b><b>4</b></span> = drie delen gekozen</div>",text:"Het getal boven de streep heet de teller. Het zegt hoeveel delen je gebruikt."},
  {title:"Jouw beurt",question:{prompt:"Een veld is in 4 gelijke stukken verdeeld. Dani gebruikt 1 stuk. Welke breuk is dat?",answer:"1/4",options:["1/4","4/1","1/2","4/4"],explain:"Eén gekozen stuk van vier gelijke stukken is 1/4."}}
 ]},
 time:{title:"Digitale tijd slim lezen",icon:"⏰",unlock:"time",steps:[
  {title:"Uren vóór de dubbele punt",visual:"<div class='digital-clock'><b>16</b><span>:</span>00</div>",text:"Vóór de dubbele punt staan de uren. 16 betekent vier uur in de middag."},
  {title:"Minuten erachter",visual:"<div class='digital-clock'>16:<b>30</b></div>",text:"Na de dubbele punt staan de minuten. 30 minuten is een half uur."},
  {title:"Over het hele uur",visual:"<div class='time-line'><span>16:40</span><i>+30 min</i><span>17:10</span></div>",text:"Van 16:40 tot 17:00 is 20 minuten. Er blijven dan nog 10 minuten over: 17:10."},
  {title:"Jouw beurt",question:{prompt:"Training begint om 15:30 en duurt 45 minuten. Hoe laat klaar?",answer:"16:15",options:["15:45","16:00","16:15","16:30"],explain:"30 minuten brengt je naar 16:00; nog 15 minuten geeft 16:15."}}
 ]},
 algebra:{title:"Algebra: de onbekende vinden",icon:"🧩",unlock:"algebra",steps:[
  {title:"Een vergelijking is een balans",visual:"<div class='balance'><span>x + 3</span><i>⚖️</i><span>11</span></div>",text:"Links en rechts zijn evenveel waard. Wat je aan de ene kant doet, moet je ook aan de andere kant doen."},
  {title:"Maak x vrij",visual:"<div class='lesson-equation'>x + 3 − 3 = 11 − 3</div>",text:"Trek aan beide kanten 3 af. Dan blijft x = 8 over."},
  {title:"Controleer",visual:"<div class='lesson-equation'>8 + 3 = 11 ✅</div>",text:"Vul de oplossing terug in de oorspronkelijke vergelijking."},
  {title:"Jouw beurt",question:{prompt:"Los op: 2x + 4 = 18",answer:"7",options:["5","6","7","11"],explain:"Trek 4 af: 2x=14. Deel door 2: x=7."}}
 ]},
 sources:{title:"Bronnen, bias en bewijs",icon:"🔎",unlock:"sources",steps:[
  {title:"Wie zegt het?",visual:"<div class='source-cards'><span>📢 reclame</span><span>🧪 onderzoek</span><span>👤 ervaring</span></div>",text:"Iedere bron kan informatie geven, maar heeft een ander doel en andere beperkingen."},
  {title:"Controleer de methode",visual:"<div class='checklist'>✓ steekproef<br>✓ datum<br>✓ definities<br>✓ volledige data</div>",text:"Een overtuigende conclusie is pas sterk wanneer je kunt zien hoe zij tot stand kwam."},
  {title:"Let op bias",visual:"<div class='bias-lens'>👁️ → 🔍 → 🧠</div>",text:"Bias betekent niet automatisch liegen. Mensen selecteren soms onbewust vooral informatie die bij hun verwachting past."},
  {title:"Jouw beurt",question:{prompt:"Een fabrikant zegt dat 9 van 10 gebruikers tevreden zijn, maar legt de steekproef niet uit. Wat moet je eerst vragen?",answer:"Hoe de gebruikers zijn gekozen en hoeveel mensen meededen.",options:["Welke kleur het logo heeft.","Hoe de gebruikers zijn gekozen en hoeveel mensen meededen.","Hoeveel likes de advertentie kreeg.","Of de directeur het product zelf gebruikt."],explain:"Selectie en omvang bepalen hoe sterk de claim is."}}
 ]},
 alphabet:{title:"Letters horen en zien",icon:"🔤",unlock:"alphabet",steps:[
  {title:"Een letter heeft een naam en klank",visual:"<div class='letter-stage'><b>M</b><span>mmm</span></div>",text:"De letter heet em. De klank is mmm, zoals vooraan in maan."},
  {title:"Luister naar het begin",visual:"<div class='picture-row'>🌙 maan · 🐭 muis · 🧤 muts</div>",text:"Maan, muis en muts beginnen allemaal met mmm."},
  {title:"Groot en klein",visual:"<div class='lesson-equation'>M m</div>",text:"Een hoofdletter en kleine letter horen bij elkaar."},
  {title:"Jouw beurt",question:{prompt:"Welk woord begint met mmm?",answer:"maan",options:["maan","vis","kat","roos"],explain:"Maan begint met de klank mmm."}}
 ]},
 numbers:{title:"Getallen zijn hoeveelheden",icon:"🌟",unlock:"numbers",steps:[
  {title:"Wijs aan en tel",visual:"<div class='picture-row'>⭐ ⭐ ⭐ ⭐ ⭐</div>",text:"Wijs ieder plaatje één keer aan. Het laatste getal zegt hoeveel er zijn."},
  {title:"Meer en minder",visual:"<div class='compare-groups'><span>🐶 🐶</span><b>&lt;</b><span>🐱 🐱 🐱 🐱</span></div>",text:"Vier is meer dan twee. De open kant van het teken wijst naar de grootste groep."},
  {title:"Samenvoegen",visual:"<div class='lesson-equation'>2 ⭐ + 1 ⭐ = 3 ⭐</div>",text:"Bij optellen maak je twee groepjes samen."},
  {title:"Jouw beurt",question:{prompt:"Hoeveel zijn er samen: 🦄🦄 + 🦄?",answer:"3",options:["2","3","4","5"],explain:"Twee unicorns en nog één unicorn zijn samen drie."}}
 ]}
};

startActivity=function(subject,dailyIndex=null){
 if(subject==="focus")return startFocus();if(subject==="memory")return startMemory();
 if(subject.startsWith("learn-"))return startLesson(subject.replace("learn-",""),dailyIndex);
 if(subject==="patternpop")return startPatternPop();if(subject==="wordhunt")return startWordHunt();if(subject==="strategy")return startSimon();
 const id=state.currentProfile,pr=p(),serial=++pr.storySerial,seed=`${today()}-${serial}-${dailyIndex??"free"}-${Date.now()%100000}`;
 let task={id:uid(),subject,dailyIndex,source:dailyIndex===null?"free":"daily",startedAt:Date.now(),questionStartedAt:Date.now(),index:0,results:[],answered:false,selected:null,readTranscript:"",readingAnalysis:null};
 if(subject==="reading"||subject==="story"){
  const sk=id==="lena"?pr.skills.story:pr.skills.reading,story=id==="dani"?C.daniStory(seed,Math.round(sk.rating)):id==="zana"?C.zanaStory(seed,Math.round(sk.rating)):C.lenaStory(seed,Math.round(sk.rating));
  task={...task,type:"reading",story,readConfirmed:false,subject:id==="lena"?"story":"reading"};
 }else if(subject==="math")task={...task,type:"quiz",items:C.makeMath(id,seed,20,Math.round(pr.skills.math.rating),pr.curriculum),title:"Rekenmix 20"};
 else if(subject==="counting")task={...task,type:"quiz",items:C.makeMath("lena",seed,12,1,pr.curriculum),title:"Telavontuur"};
 else if(["spelling","language","letters"].includes(subject))task={...task,type:"quiz",items:C.makeSpelling(id,seed,id==="lena"?12:15,Math.round((pr.skills[subject]||{}).rating||2)),title:subject==="language"?"Taalstudio 15":subject==="letters"?"Letterfeest":"Spellingarena 15"};
 else if(subject==="shapes")task={...task,type:"quiz",items:shapeQuestions(seed).concat(C.makeMath("lena",seed+"shape",6,1,pr.curriculum)).slice(0,12),title:"Patroonpret"};
 else task={...task,type:"quiz",items:C.makeBankQuiz(subject,id,seed,id==="zana"?12:10),title:ACTIVITY_META[subject]?.title||"Challenge"};
 state.task=task;save();render();questionStarted=Date.now();
};
window.startActivity=startActivity;

function startLesson(key,dailyIndex=null){
 const lesson=LESSONS[key];if(!lesson)return toast("Deze uitleg wordt nog voorbereid.");
 state.task={id:uid(),type:"lesson",subject:`learn-${key}`,lessonKey:key,lesson,dailyIndex,source:dailyIndex===null?"free":"daily",step:0,startedAt:Date.now(),answered:false,selected:null,results:[]};save();render();
}
window.startLesson=startLesson;

renderTask=function(){
 const t=state.task;
 if(!t)return render();
 $("#app").innerHTML=`<div class="task-shell ${state.currentProfile==='lena'?'lena-task':''}"><div class="task-top"><button class="icon-btn" onclick="leaveTask()">✕</button><div class="progress"><span style="--w:${t.type==='lesson'?((t.step+1)/t.lesson.steps.length*100):taskProgress(t)}%"></span></div><strong class="timer" id="timer">0:00</strong>${state.currentProfile==='lena'?`<button class="horn task-horn" onclick="speakTaskNow()">📣</button>`:""}</div><section class="card task-card">${t.type==='lesson'?lessonHTML(t):t.type==='reading'?readingHTML(t):quizHTML(t)}</section></div>`;
 tick=setInterval(updateTimer,500);
 if(state.currentProfile==="lena")setTimeout(autoSpeakLena,280);
};

function lessonHTML(t){
 const st=t.lesson.steps[t.step];
 if(st.question){
  return`<div class="task-meta"><span class="pill">${t.lesson.icon} ${esc(t.lesson.title)}</span><span class="pill">Beheersingscheck</span></div><span class="eyebrow">Nu jij</span><h1>${esc(st.question.prompt)}</h1><div class="answer-grid lesson-answers">${st.question.options.map(o=>answerButton(o,st.question,t)).join("")}</div>${t.answered?feedbackHTML(t,st.question):""}<div class="task-actions"><span class="muted">Je mag terugdenken aan de voorbeelden.</span>${t.answered?`<button class="primary" onclick="finishLesson()">Les afronden</button>`:`<button class="primary" onclick="checkLessonAnswer()">Controleer</button>`}</div>`;
 }
 return`<div class="task-meta"><span class="pill">${t.lesson.icon} ${esc(t.lesson.title)}</span><span class="pill">Stap ${t.step+1}/${t.lesson.steps.length}</span></div><span class="eyebrow">Begrijpen vóór oefenen</span><h1>${esc(st.title)}</h1><div class="lesson-visual">${st.visual}</div><p class="lesson-text">${esc(st.text)}</p><div class="task-actions"><button class="ghost" onclick="speakLesson()">🔊 Lees uitleg voor</button><button class="primary" onclick="nextLessonStep()">Volgende stap</button></div>`;
}
window.speakLesson=()=>{const st=state.task.lesson.steps[state.task.step];speak(`${st.title}. ${st.text||st.question?.prompt||''}`)};
window.nextLessonStep=()=>{const t=state.task;if(t.step<t.lesson.steps.length-1){t.step++;t.answered=false;t.selected=null;t.results=[];save();render()}};
window.checkLessonAnswer=()=>{const t=state.task,q=t.lesson.steps[t.step].question;if(t.selected==null)return toast("Kies eerst een antwoord.");const result=smartAnswer(q,t.selected);t.results=[{prompt:q.prompt,selected:t.selected,answer:q.answer,correct:result.correct,seconds:1,kind:"uitleg",interpretation:result.interpretation}];t.answered=true;save();render()};
window.finishLesson=()=>{const t=state.task,last=t.results[0],key=t.lessonKey;if(!last?.correct){toast("Bekijk de uitleg nog één keer; daarna kun je opnieuw proberen.");t.step=0;t.answered=false;t.selected=null;t.results=[];save();return render()}p().curriculum[t.lesson.unlock]=true;p().learningHistory.unshift({date:new Date().toISOString(),lesson:key,mastered:true});p().learningHistory=p().learningHistory.slice(0,100);p().coins+=35;p().xp+=50;state.task=null;save();modal(`<div class="reward-icon">🎓</div><span class="eyebrow">Nieuwe vaardigheid</span><h1>${esc(LESSONS[key].title)} beheerst</h1><p class="lead">Deze vraagsoort mag nu rustig in je oefenmix verschijnen. +35 coins.</p><button class="primary" onclick="closeModal();setView('learn')">Naar de leerstudio</button>`);confetti(35)};

readingHTML=function(t){
 const s=t.story;
 if(!t.readConfirmed){
  const coach=state.currentProfile!=="lena";
  return`<div class="task-meta"><span class="pill">${subjectIcon(state.currentProfile,t.subject)} ${subjectName(state.currentProfile,t.subject)}</span><span class="pill">${s.estimatedWords} woorden</span><span class="pill">${esc(s.storyId||`Verhaal ${p().storySerial}`)}</span></div><span class="eyebrow">${esc(s.genre)}</span><h1>${esc(s.title)}</h1>${state.currentProfile==='lena'?`<button class="mega-horn" onclick="speakCurrentStory()"><span>📣</span> Lees het verhaal voor</button>`:""}<div class="story ${state.currentProfile}">${s.story.split("\n\n").map(x=>`<p>${esc(x)}</p>`).join("")}</div><div class="reading-tools"><button class="ghost" onclick="speakCurrentStory()">🔊 Voorlezen</button>${coach?`<button class="${readingRecognitionActive?'danger':'ghost'}" onclick="toggleReadingCoach()">${readingRecognitionActive?'⏹ Stop meeluisteren':'🎙️ Luister mee met hardop lezen'}</button>`:""}<button class="primary" onclick="confirmReading()">✅ ${state.currentProfile==='dani'?'Ik heb hardop gelezen':state.currentProfile==='lena'?'Naar de luistervragen':'Naar de vragen'}</button></div>${coach?`<div class="reading-coach-status" id="readingCoachStatus"><strong>${readingRecognitionActive?'Microfoon luistert mee':'Optionele leescoach'}</strong><span>${readingRecognitionActive?`Herkenning: ${readingTranscript.split(/\s+/).filter(Boolean).length} woorden`:'Er wordt geen audio opgeslagen. Alleen een woordvergelijking komt in het ouderdashboard.'}</span></div>`:""}<p class="pace">${state.currentProfile==='zana'?"Lees analytisch: onderscheid gebeurtenis, bewijs, belang, tegenargument en conclusie.":state.currentProfile==='lena'?"Luister goed. Je mag het verhaal zo vaak horen als je wilt.":"Lees rustig en duidelijk. Een punt is een korte stop; kijk vooruit naar het volgende woord."}</p>`;
 }
 const question=s.questions[t.index];
 return`<div class="task-meta"><span class="pill">Vraag ${t.index+1}/${s.questions.length}</span><span class="pill">${question.kind||'begrip'}</span></div>${dots(t,s.questions.length)}<button class="story-back" onclick="showStoryModal()">📖 Tekst terugkijken</button>${state.currentProfile==='lena'?`<button class="mega-horn small" onclick="speakQuestion()"><span>📣</span> Lees vraag en antwoorden</button>`:""}<h2 class="question-box ${state.currentProfile==='lena'?'lena-question':''}">${question.icon?`<span class="question-icon">${question.icon}</span>`:''}${esc(question.q)}</h2><div class="answer-grid ${state.currentProfile==='lena'?'lena-answers':''}">${question.options.map(o=>answerButton(o,question,t)).join("")}</div>${t.answered?feedbackHTML(t,question):""}<div class="task-actions"><span class="muted">${state.currentProfile==='lena'?'Tik op het antwoord dat je hoorde.':'Kies wat het best door de tekst wordt ondersteund.'}</span><button class="primary" onclick="nextQuestion()">${t.answered?(t.index===s.questions.length-1?'Afronden':'Volgende'):'Controleer'}</button></div>`;
};

quizHTML=function(t){
 const q0=t.items[t.index],keys=v4QuickKeys(q0),isLena=state.currentProfile==='lena';
 return`<div class="task-meta"><span class="pill">${subjectIcon(state.currentProfile,t.subject)} ${esc(t.title)}</span><span class="pill">Vraag ${t.index+1}/${t.items.length}</span>${t.subject==='math'?`<span class="pill">⏱️ totaal + tijd per som</span>`:""}</div>${dots(t,t.items.length)}${isLena?`<button class="mega-horn small" onclick="speakQuestion()"><span>📣</span> Lees alles voor</button>`:""}<h2 class="question-box ${isLena?'lena-question':''}">${q0.icon?`<span class="question-icon">${q0.icon}</span>`:''}${esc(q0.prompt)}</h2>${q0.options?`<div class="answer-grid ${isLena?'lena-answers':''}">${q0.options.map(o=>answerButton(o,q0.answer,t)).join("")}</div>`:`<div class="smart-input-wrap"><input class="answer-input" id="answerInput" inputmode="${v4InputMode(q0)}" autocomplete="off" placeholder="${esc(q0.inputHint||'Typ je antwoord')}" value="${esc(t.selected||'')}" oninput="state.task.selected=this.value" onkeydown="if(event.key==='Enter')checkAnswer()">${keys.length?`<div class="quick-keys">${keys.map(k=>`<button onclick='appendInput(${JSON.stringify(k)})'>${esc(k)}</button>`).join("")}</div>`:""}</div>`}${t.answered?feedbackHTML(t,q0):""}<div class="task-actions"><span class="muted">${t.subject==='math'?`Tempo tot nu toe: ${t.results.length?Math.round(t.results.reduce((a,b)=>a+b.seconds,0)/t.results.length):0}s per som. Verschillende schrijfwijzen worden slim herkend.`:isLena?'Luister, kijk en tik rustig.':'Lees de volledige zin en let op wat logisch én correct is.'}</span>${t.answered?`<button class="primary" onclick="nextQuestion()">${t.index===t.items.length-1?'Afronden':'Volgende'}</button>`:`<button class="primary" onclick="checkAnswer()">Controleer</button>`}</div>`;
};

answerButton=function(o,answer,t){
 const q0=t.type==='reading'?t.story.questions[t.index]:t.type==='lesson'?t.lesson.steps[t.step].question:t.items[t.index],correct=t.answered&&smartAnswer(q0,o).correct,wrong=t.answered&&t.selected===o&&!correct;
 return`<button class="answer ${t.selected===o?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}" onclick='chooseAnswer(${JSON.stringify(o)})' ${t.answered?'disabled':''}>${state.currentProfile==='lena'?`<span class="lena-option-icon">${/^[\p{Emoji}\s]+$/u.test(String(o))?o:'⭐'}</span>`:''}<span>${esc(o)}</span></button>`;
};

feedbackHTML=function(t,q0){
 const last=t.results[t.results.length-1],lesson=q0.lessonKey||({division:'division',fractions:'fractions',algebra:'algebra'}[q0.kind]);
 return`<div class="feedback ${last.correct?'good':'bad'}"><strong>${last.correct?'Goed gezien!':'Nog niet juist — dit is waarom:'}</strong><br>${esc(q0.explain)}${last.correct?'':`<br>Juiste antwoord: <strong>${esc(q0.answer)}</strong>`}${last.interpretation&&String(last.interpretation)!==String(last.selected)?`<br><small>We lazen jouw invoer als: ${esc(last.interpretation)}</small>`:''}${!last.correct&&lesson&&LESSONS[lesson]?`<br><button class="ghost inline-help" onclick="pauseForLesson('${lesson}')">🎓 Bekijk de uitleg</button>`:''}</div>`;
};
window.pauseForLesson=k=>{state.task.pausedCopy=JSON.parse(JSON.stringify(state.task));startLesson(k,null)};

window.speakTaskNow=()=>{if(state.task?.type==='reading'&&!state.task.readConfirmed)return speakCurrentStory();if(state.task?.type==='lesson')return speakLesson();return speakQuestion()};
window.speakQuestion=()=>{
 const t=state.task;if(!t)return;let q0=t.type==='reading'?t.story.questions[t.index]:t.type==='lesson'?t.lesson.steps[t.step].question:t.items[t.index];
 if(!q0)return;const opts=q0.options?.map((o,i)=>`${i+1}. ${o}`).join('. ')||'';speak(`${q0.q||q0.prompt}. ${opts}`);
};
function autoSpeakLena(){
 const t=state.task;if(!t||state.currentProfile!=="lena"||!p().settings.autoSpeak)return;
 const key=`${t.type}-${t.readConfirmed}-${t.index??t.step}`;if(t.lastSpokenKey===key)return;t.lastSpokenKey=key;save();
 if(t.type==='reading'&&!t.readConfirmed)speak(`${t.story.title}. ${t.story.story}`);else if(t.type==='lesson')speakLesson();else speakQuestion();
}

// ---------- Hardop-leescoach (privacyvriendelijk: transcript, geen audio-opslag) ----------
window.toggleReadingCoach=()=>readingRecognitionActive?stopReadingCoach():startReadingCoach();
function startReadingCoach(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR)return toast("Deze browser ondersteunt de meeleesfunctie niet. Chrome op computer of Android werkt meestal wel.");
 readingTranscript="";readingRecognition=new SR();readingRecognition.lang="nl-NL";readingRecognition.continuous=true;readingRecognition.interimResults=true;readingRecognitionActive=true;
 readingRecognition.onresult=e=>{let final="",interim="";for(let i=0;i<e.results.length;i++){const text=e.results[i][0].transcript;if(e.results[i].isFinal)final+=text+" ";else interim+=text+" ";}readingTranscript=(final+interim).trim();if(state.task)state.task.readTranscript=readingTranscript;const status=$("#readingCoachStatus span");if(status)status.textContent=`Herkenning: ${readingTranscript.split(/\s+/).filter(Boolean).length} woorden. Lees rustig door.`};
 readingRecognition.onerror=e=>{readingRecognitionActive=false;toast(e.error==='not-allowed'?"Microfoontoegang is niet toegestaan.":"Meelezen stopte. Je kunt gewoon verder lezen.");render()};
 readingRecognition.onend=()=>{if(readingRecognitionActive)try{readingRecognition.start()}catch(e){readingRecognitionActive=false}};
 try{readingRecognition.start();render()}catch(e){readingRecognitionActive=false;toast("De microfoon kon niet starten.")}
}
function stopReadingCoach(){readingRecognitionActive=false;try{readingRecognition?.stop()}catch(e){}readingRecognition=null;if(state.task)state.task.readTranscript=readingTranscript;save();render()}
function tokeniseReading(text){return String(text||"").split(/\s+/).filter(Boolean).map((raw,i)=>({raw,clean:plainText(raw).replace(/[^a-z0-9]/g,''),i})).filter(x=>x.clean)}
function alignReading(reference,spoken){
 const a=tokeniseReading(reference),b=tokeniseReading(spoken),n=a.length,m=b.length;
 if(!m)return{score:null,words:a.map(x=>({word:x.raw,status:'unknown'})),transcript:spoken,matched:0,total:n};
 // Dynamic-programming alignment; substitution/deletion/insertion cost 1.
 const width=m+1,prev=new Uint16Array(width),cur=new Uint16Array(width),moves=new Uint8Array((n+1)*width);
 for(let j=0;j<=m;j++){prev[j]=j;if(j)moves[j]=2}
 for(let i=1;i<=n;i++){
  cur[0]=i;moves[i*width]=1;
  for(let j=1;j<=m;j++){
   const same=a[i-1].clean===b[j-1].clean,sub=prev[j-1]+(same?0:1),del=prev[j]+1,ins=cur[j-1]+1;
   let val=sub,mv=same?0:3;if(del<val){val=del;mv=1}if(ins<val){val=ins;mv=2}cur[j]=val;moves[i*width+j]=mv;
  }
  prev.set(cur);
 }
 let i=n,j=m;const states=Array(n).fill('missed'),extras=[];let matched=0;
 while(i>0||j>0){const mv=moves[i*width+j];if(i>0&&j>0&&(mv===0||mv===3)){if(mv===0){states[i-1]='good';matched++}else states[i-1]='wrong';i--;j--;}else if(i>0&&(mv===1||j===0)){states[i-1]='missed';i--;}else if(j>0){extras.unshift(b[j-1].raw);j--;}else break;}
 return{score:Math.round(matched/Math.max(1,n)*100),words:a.map((x,k)=>({word:x.raw,status:states[k]})),transcript:spoken,matched,total:n,extras:extras.slice(0,80)};
}
window.confirmReading=()=>{
 if(readingRecognitionActive){readingRecognitionActive=false;try{readingRecognition?.stop()}catch(e){}readingRecognition=null}
 const t=state.task;t.readTranscript=t.readTranscript||readingTranscript;
 if(state.currentProfile!=="lena"&&t.readTranscript)t.readingAnalysis=alignReading(t.story.story,t.readTranscript);
 t.readConfirmed=true;t.index=0;t.questionStartedAt=Date.now();save();readingTranscript="";render();
};

window.checkAnswer=()=>{
 const t=state.task,q0=t.items[t.index];if(!q0.options){const input=$("#answerInput");t.selected=input?.value?.trim()||t.selected}
 if(t.selected===null||t.selected===undefined||String(t.selected).trim()==="")return toast("Kies of typ eerst een antwoord.");recordAnswer(q0);
};
recordAnswer=function(q0){
 const t=state.task,result=smartAnswer(q0,t.selected),seconds=Math.max(.2,(Date.now()-(t.questionStartedAt||Date.now()))/1000);
 t.results.push({prompt:q0.q||q0.prompt,selected:t.selected,answer:q0.answer,accepted:q0.accepted||[],correct:result.correct,interpretation:result.interpretation,seconds:+seconds.toFixed(1),kind:q0.kind||t.subject,lessonKey:q0.lessonKey||null});
 t.answered=true;save();render();
};

updateSkill=function(sk,acc,suspicious){
 sk.attempts=(sk.attempts||0)+1;sk.recent=Array.isArray(sk.recent)?sk.recent:[];sk.recent.push(acc);sk.recent=sk.recent.slice(-10);sk.accuracy=Math.round(sk.recent.reduce((a,b)=>a+b,0)/sk.recent.length);sk.mastery=Math.round(sk.accuracy);sk.confidence=Math.min(1,sk.attempts/6);
 if(!suspicious){
  let step=acc>=95?.38:acc>=86?.26:acc>=76?.13:acc>=60?0:acc>=45?-.2:-.36;
  if(sk.recent.length>=3){const recent=sk.recent.slice(-3).reduce((a,b)=>a+b,0)/3;if(recent>=92)step+=.12;if(recent<48)step-=.12}
  sk.rating+=step;
 }
 sk.rating=clamp(sk.rating,V4_MIN_LEVEL[state.currentProfile],V4_MAX_LEVEL[state.currentProfile]);
};

finishTask=function(){
 const t=state.task,pr=p(),total=t.results.length,correct=t.results.filter(x=>x.correct).length,accuracy=Math.round(correct/Math.max(1,total)*100),seconds=Math.round((Date.now()-t.startedAt)/1000),avg=total?+(t.results.reduce((a,b)=>a+b.seconds,0)/total).toFixed(1):0,fastWrong=t.results.filter(x=>!x.correct&&x.seconds<2.4).length,longWrong=longestWrong(t.results),sameAnswerRuns=maxSameAnswerRun(t.results),suspicious=fastWrong>=4||(avg<2.3&&accuracy<65)||longWrong>=6||sameAnswerRuns>=8;
 let coins=correct*4+25+(t.source==="daily"?25:0),xp=correct*8+30;if(suspicious){coins=Math.round(coins*.45);xp=Math.round(xp*.65)}
 pr.coins+=coins;pr.xp+=xp;pr.completed++;updateStreak(pr);
 const skill=pr.skills[t.subject]||(pr.skills[t.subject]=defaultSkill(state.currentProfile)),before=skill.rating;updateSkill(skill,accuracy,suspicious);
 if(t.dailyIndex!==null&&!pr.daily.completed.includes(t.dailyIndex))pr.daily.completed.push(t.dailyIndex);
 const session={id:t.id,date:new Date().toISOString(),subject:t.subject,title:t.type==="reading"?t.story.title:t.title,storyId:t.story?.storyId||null,source:t.source,questions:total,correct,accuracy,seconds,avgSeconds:avg,fastWrong,longWrong,sameAnswerRuns,suspicious,ratingBefore:+before.toFixed(2),ratingAfter:+skill.rating.toFixed(2),results:t.results,readingAnalysis:t.readingAnalysis||null};
 pr.sessions.unshift(session);pr.sessions=pr.sessions.slice(0,750);
 if(t.readingAnalysis){pr.readingAssessments.unshift({date:session.date,sessionId:session.id,title:session.title,...t.readingAnalysis});pr.readingAssessments=pr.readingAssessments.slice(0,100)}
 const recentSkill=pr.sessions.filter(x=>x.subject===t.subject).slice(0,3),mean=recentSkill.length?recentSkill.reduce((a,b)=>a+b.accuracy,0)/recentSkill.length:accuracy;
 if(recentSkill.length===3&&mean<60&&!pr.alerts.some(a=>a.message.includes(`Herhaald lage score bij ${subjectName(state.currentProfile,t.subject)}`)&&Date.now()-new Date(a.date)<86400000))addAlert(state.currentProfile,"red",`Herhaald lage score bij ${subjectName(state.currentProfile,t.subject)}: gemiddeld ${Math.round(mean)}% over drie sessies.`,session.id);
 pr.questionLog.unshift(...t.results.map(x=>({...x,date:session.date,subject:t.subject,sessionId:t.id})));pr.questionLog=pr.questionLog.slice(0,8000);
 if(suspicious)addAlert(state.currentProfile,"red",`Mogelijk doorklikken: ${accuracy}% goed, ${fastWrong} zeer snelle fouten, foutreeks ${longWrong}, zelfde-antwoordreeks ${sameAnswerRuns}.`,session.id);
 else if(accuracy<60)addAlert(state.currentProfile,"amber",`Extra uitleg of een lager niveau kan helpen bij ${subjectName(state.currentProfile,t.subject)}: ${accuracy}% goed.`,session.id);
 else if(accuracy>=90)addAlert(state.currentProfile,"green",`Sterke sessie ${subjectName(state.currentProfile,t.subject)}: ${accuracy}% goed. Niveau beweegt sneller mee.`,session.id);
 const failedLessons=t.results.filter(x=>!x.correct&&x.lessonKey).map(x=>x.lessonKey);if(failedLessons.length>=2)addAlert(state.currentProfile,"amber",`Uitlegles aanbevolen: ${curriculumName(failedLessons[0])}.`,session.id);
 state.task=null;save();showReward({coins,xp,accuracy,suspicious,title:session.title,ratingBefore:before,ratingAfter:skill.rating});if(state.parent.autoAlerts&&state.parent.webhook&&(suspicious||accuracy<50))sendWebhook(session);
};
function maxSameAnswerRun(results){let best=0,cur=0,last=null;for(const r of results){const x=plainText(r.selected);if(x===last)cur++;else{last=x;cur=1}best=Math.max(best,cur)}return best}
showReward=function(r){const delta=r.ratingAfter-r.ratingBefore,root=$("#modal-root");root.innerHTML=`<div class="reward"><div class="card reward-box"><div class="reward-icon">${r.suspicious?'🧭':r.accuracy>=90?'🏆':r.accuracy>=70?'⭐':'🌱'}</div><span class="eyebrow">Missie voltooid</span><h1>${r.suspicious?'Rustiger is sterker':r.accuracy>=90?'Topprestatie!':r.accuracy>=70?'Sterk geleerd!':'Nieuwe stap gezet'}</h1><p class="lead">${r.accuracy}% goed · +${r.xp} XP · +${r.coins} LevelCoins</p><div class="level-change ${delta>0?'up':delta<0?'down':'same'}">Niveau ${r.ratingBefore.toFixed(1)} → ${r.ratingAfter.toFixed(1)} <small>${delta>0?'omhoog door sterke beheersing':delta<0?'tijdelijk omlaag voor betere aansluiting':'blijft passend'}</small></div>${r.suspicious?`<div class="feedback bad">Meerdere antwoorden kwamen extreem snel of in een vast patroon. De beloning is lager. Lees iedere vraag volledig.</div>`:""}<button class="primary" onclick="closeReward()">Naar mijn overzicht</button></div></div>`;confetti(r.suspicious?12:48);speak(r.suspicious?'Missie klaar. Neem de volgende keer meer denktijd.':'Missie voltooid. Goed gedaan!')};

// ---------- Uitgebreide gamehal met lokaal tweespelers ----------
renderGames=function(){
 const games=state.currentProfile==='lena'?
  [['memory','🃏','Memory'],['focus','👾','Vang de gekke bekken'],['ttt','❌','Boter-kaas-en-eieren'],['connect','🔴','Vier op een rij junior'],['simon','🎵','Kleurgeheugen'],['patternpop','🎈','Patroon Pop'],['tapduel','⚡','Tikduel met z’n tweeën'],['sudoku','🔢','Mini-Sudoku 4×4']]:
  state.currentProfile==='dani'?
  [['ttt','❌','Boter-kaas-en-eieren'],['connect','🔴','Vier op een rij'],['sudoku','🔢','Sudoku 6×6'],['memory','🃏','Memory'],['focus','👾','Focus Arcade'],['simon','🎵','Simon Challenge'],['maze','🧭','Doolhofmissie'],['wordhunt','🔎','Woordjacht'],['tapduel','⚡','Reactieduel'],['logic','🧩','Breinbrekers']]:
  [['ttt','❌','Boter-kaas-en-eieren'],['connect','🔴','Vier op een rij'],['sudoku','🔢','Sudoku 9×9'],['memory','🃏','Memory'],['focus','🎯','Reactie & remkracht'],['simon','🎵','Memory Sequence'],['maze','🧭','Doolhofstrategie'],['wordhunt','🔎','Woord- en codejacht'],['tapduel','⚡','Reactieduel'],['critical','🧠','Argumentenbattle'],['strategy','♟️','Strategie Lab']];
 const body=`<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Gamehal 4.0</span><h1>Robotduels én samen spelen</h1></div><p class="muted">Bij ❌ en 🔴 kies je: tegen Robo of lokaal met twee spelers.</p></div><div class="games-grid">${games.map(([g,ic,n])=>`<button class="game-tile animated-game" onclick="launchGame('${g}')"><div class="big">${ic}</div><h3>${n}</h3><p class="muted">${gameDescV4(g)}</p>${['ttt','connect','tapduel'].includes(g)?`<span class="duo-badge">👥 2 spelers mogelijk</span>`:''}</button>`).join("")}</div><section class="card" style="margin-top:18px"><span class="eyebrow">Spelregels</span><h2>Spelen beloont, leren bouwt sneller</h2><p class="muted">De eerste vijf spellen per dag leveren coins op. Tweespelerswedstrijden bewaren alleen de uitslag, niet wie er ruzie maakte over een zet 😉.</p></section>`;
 $("#app").innerHTML=shell(body,'games');
};
function gameDescV4(g){return{ttt:'Kies Robo of speel om de beurt op hetzelfde scherm.',connect:'Plan vooruit, blokkeer en speel lokaal tegen elkaar.',sudoku:'Logische cijfers op leeftijdsniveau.',memory:'Vind paren met steeds wisselende thema’s.',focus:'Bewegende doelen, remrondes en gekke gezichten.',simon:'Onthoud een steeds langere kleurvolgorde.',maze:'Stuur de held door een doolhof zonder muren te raken.',wordhunt:'Kraak letters, woorden en geheime codes.',tapduel:'Wacht op groen; wie te vroeg tikt verliest.',patternpop:'Tik het patroon in de juiste volgorde.',logic:'Reeksen, posities en slimme conclusies.',critical:'Beoordeel bewijs en argumenten.',strategy:'Denk meerdere zetten vooruit.'}[g]||'Nieuwe uitdaging'}
window.launchGame=g=>{
 if(['ttt','connect'].includes(g))return chooseGameMode(g);
 if(g==='sudoku')return startSudoku();if(g==='memory')return startMemory();if(g==='focus')return startFocus();if(g==='simon'||g==='strategy')return startSimon();if(g==='maze')return startMaze();if(g==='wordhunt')return startWordHunt();if(g==='tapduel')return startTapDuel();if(g==='patternpop')return startPatternPop();startActivity(g,null);
};
function chooseGameMode(g){modal(`<div class="reward-icon">👥</div><span class="eyebrow">Spelmodus</span><h2>${g==='ttt'?'Boter-kaas-en-eieren':'Vier op een rij'}</h2><div class="mode-grid"><button class="game-mode" onclick="closeModal();${g==='ttt'?'startTTT':'startConnect'}('robot')"><span>🤖</span><strong>Tegen Robo</strong><small>De computer speelt terug</small></button><button class="game-mode" onclick="closeModal();${g==='ttt'?'startTTT':'startConnect'}('duo')"><span>👥</span><strong>Met z’n tweeën</strong><small>Om de beurt op hetzelfde scherm</small></button></div>`)}

startTTT=function(mode='robot'){game={type:'ttt',mode,board:Array(9).fill(''),over:false,turn:'❌'};renderTTT()};
renderTTT=function(){gamePage(game.mode==='duo'?'Boter-kaas-en-eieren — 2 spelers':'Boter-kaas-en-eieren tegen Robo',`<p class="lead" id="gameMsg">${game.mode==='duo'?`Aan de beurt: ${game.turn}`:'Jij bent ❌. Maak drie op een rij.'}</p><div class="game-board ttt">${game.board.map((x,i)=>`<button onclick="tttMove(${i})">${x}</button>`).join('')}</div><div class="game-controls"><button class="ghost" onclick="startTTT('${game.mode}')">Opnieuw</button><button class="ghost" onclick="chooseGameMode('ttt')">Andere modus</button></div>`)};
window.tttMove=i=>{
 if(game.over||game.board[i])return;
 if(game.mode==='duo'){
  game.board[i]=game.turn;const w=winner3(game.board);if(w||game.board.every(Boolean))return endTTTV4(w||'draw');game.turn=game.turn==='❌'?'⭕':'❌';return renderTTT();
 }
 game.board[i]='❌';let w=winner3(game.board);if(w)return endTTTV4(w);const open=game.board.map((x,j)=>x?null:j).filter(x=>x!==null);if(!open.length)return endTTTV4('draw');let move=bestTTT('⭕')??bestTTT('❌')??open[Math.floor(Math.random()*open.length)];game.board[move]='⭕';w=winner3(game.board);if(w)return endTTTV4(w);renderTTT();
};
function endTTTV4(w){game.over=true;renderTTT();setTimeout(()=>{const e=$("#gameMsg");if(!e)return;if(game.mode==='duo')e.textContent=w==='draw'?'Gelijkspel!':`${w} wint! Geef elkaar een high five.`;else e.textContent=w==='❌'?'Jij wint! Slim gespeeld.':w==='⭕'?'Robo wint. Kijk waar je eerder had kunnen blokkeren.':'Gelijkspel — sterke verdediging.';if((game.mode==='robot'&&w==='❌')||(game.mode==='duo'&&w!=='draw'))gameReward(18,'Duel voltooid')},50)}

startConnect=function(mode='robot'){game={type:'connect',mode,board:Array(42).fill(0),over:false,turn:1};renderConnect()};
renderConnect=function(){gamePage(game.mode==='duo'?'Vier op een rij — 2 spelers':'Vier op een rij tegen Robo',`<p class="lead" id="gameMsg">${game.mode==='duo'?`Aan de beurt: ${game.turn===1?'🟡 geel':'🔴 rood'}`:'Jij bent geel. Klik op een kolom.'}</p><div class="connect-arrows">${[0,1,2,3,4,5,6].map(c=>`<button onclick="connectMove(${c})">▼</button>`).join('')}</div><div class="game-board connect">${game.board.map(v=>`<button class="${v===1?'p1':v===2?'p2':''}"></button>`).join('')}</div><div class="game-controls"><button class="ghost" onclick="startConnect('${game.mode}')">Opnieuw</button><button class="ghost" onclick="chooseGameMode('connect')">Andere modus</button></div>`)};
window.connectMove=col=>{
 if(game.over)return;
 if(game.mode==='duo'){
  if(drop(col,game.turn)<0)return;const w=connectWinner();if(w)return endConnectV4(w);if(game.board.every(Boolean))return endConnectV4('draw');game.turn=game.turn===1?2:1;return renderConnect();
 }
 if(drop(col,1)<0)return;let w=connectWinner();if(w)return endConnectV4(w);const cols=[0,1,2,3,4,5,6].filter(c=>game.board[c]===0);if(!cols.length)return endConnectV4('draw');let choice=cols.find(c=>{const ix=drop(c,2),win=connectWinner()===2;game.board[ix]=0;return win});if(choice===undefined)choice=cols.find(c=>{const ix=drop(c,1),win=connectWinner()===1;game.board[ix]=0;return win});if(choice===undefined)choice=cols.sort((a,b)=>Math.abs(3-a)-Math.abs(3-b))[Math.floor(Math.random()*Math.min(3,cols.length))];drop(choice,2);w=connectWinner();if(w)return endConnectV4(w);renderConnect();
};
function endConnectV4(w){game.over=true;renderConnect();setTimeout(()=>{const e=$("#gameMsg");if(!e)return;if(game.mode==='duo')e.textContent=w==='draw'?'Vol bord: gelijkspel!':`${w===1?'🟡 Geel':'🔴 Rood'} heeft vier op een rij!`;else e.textContent=w===1?'Vier op een rij! Jij wint.':w===2?'Robo heeft vier. Probeer eerder te blokkeren.':'Gelijkspel.';if((game.mode==='robot'&&w===1)||(game.mode==='duo'&&w!=='draw'))gameReward(24,'Vier op een rij voltooid')},50)}

function startSimon(){game={type:'simon',sequence:[],input:[],round:0,locked:true,over:false};renderSimon();setTimeout(simonNextRound,500)}
function renderSimon(){gamePage('Kleurgeheugen',`<div class="focus-hud"><div class="stat"><strong>${game.round}</strong><small>ronde</small></div></div><p class="lead" id="simonMsg">${game.locked?'Kijk goed naar de volgorde...':'Tik de kleuren na.'}</p><div class="simon-board">${['🔴','🔵','🟢','🟡'].map((x,i)=>`<button id="simon-${i}" onclick="simonTap(${i})">${x}</button>`).join('')}</div><div class="game-controls"><button class="ghost" onclick="startSimon()">Opnieuw</button></div>`)}
function simonNextRound(){game.round++;game.input=[];game.sequence.push(Math.floor(Math.random()*4));game.locked=true;renderSimon();let delay=350;game.sequence.forEach((n,i)=>setTimeout(()=>flashSimon(n),delay+i*520));setTimeout(()=>{game.locked=false;renderSimon()},delay+game.sequence.length*520)}
function flashSimon(i){const e=$(`#simon-${i}`);if(e){e.classList.add('flash');setTimeout(()=>e.classList.remove('flash'),300)}}
window.simonTap=i=>{if(game.locked||game.over)return;flashSimon(i);game.input.push(i);const pos=game.input.length-1;if(game.sequence[pos]!==i){game.over=true;gamePage('Kleurgeheugen klaar',`<div class="center-result"><div class="reward-icon">🎵</div><h2>${game.round-1} rondes onthouden</h2><p class="lead">Sterk geheugen groeit door patronen in kleine stukken te onthouden.</p><button class="primary" onclick="startSimon()">Nog een keer</button></div>`);if(game.round>=4)gameReward(18,'Kleurgeheugen');return}if(game.input.length===game.sequence.length){game.locked=true;setTimeout(simonNextRound,650)}};

function startTapDuel(){game={type:'tapduel',state:'waiting',winner:null,falseStart:null};renderTapDuel();game.timeout=setTimeout(()=>{game.state='go';renderTapDuel()},1200+Math.random()*2800)}
function renderTapDuel(){gamePage('Reactieduel — twee spelers',`<p class="lead" id="tapMsg">${game.state==='waiting'?'Wacht... tik nog niet!':game.state==='go'?'NU TIKKEN!':game.falseStart?`${game.falseStart} tikte te vroeg`:`${game.winner} wint!`}</p><div class="tap-duel ${game.state}"><button onclick="tapDuel('Speler links')">👈<strong>LINKS</strong></button><button onclick="tapDuel('Speler rechts')"><strong>RECHTS</strong>👉</button></div><div class="game-controls"><button class="ghost" onclick="startTapDuel()">Nieuwe ronde</button></div>`)}
window.tapDuel=who=>{if(game.state==='waiting'){clearTimeout(game.timeout);game.state='done';game.falseStart=who;game.winner=who==='Speler links'?'Speler rechts':'Speler links';renderTapDuel();return}if(game.state==='go'){game.state='done';game.winner=who;renderTapDuel();gameReward(10,'Reactieduel')}};

const MAZES={lena:["1111111","1000001","1011101","1010001","1010111","1000001","1111111"],dani:["111111111","100000001","101111101","101000101","101010101","101010001","101011111","100000001","111111111"],zana:["1111111111","1000000001","1011111101","1010000101","1010110101","1010100101","1010101101","1010000001","1011111101","1111111111"]};
function startMaze(){const map=MAZES[state.currentProfile].map(r=>r.split('').map(Number));game={type:'maze',map,pos:{r:1,c:1},goal:{r:map.length-2,c:map[0].length-2},moves:0};game.map[game.goal.r][game.goal.c]=0;renderMaze()}
function renderMaze(){gamePage('Doolhofmissie',`<p class="lead">Breng ${m().icon} naar 🏆. Bewegingen: ${game.moves}</p><div class="maze" style="--cols:${game.map[0].length}">${game.map.flatMap((row,r)=>row.map((wall,c)=>`<i class="${wall?'wall':'path'}">${game.pos.r===r&&game.pos.c===c?m().icon:game.goal.r===r&&game.goal.c===c?'🏆':''}</i>`)).join('')}</div><div class="maze-controls"><button onclick="mazeMove(-1,0)">⬆️</button><button onclick="mazeMove(0,-1)">⬅️</button><button onclick="mazeMove(0,1)">➡️</button><button onclick="mazeMove(1,0)">⬇️</button></div>`)}
window.mazeMove=(dr,dc)=>{const r=game.pos.r+dr,c=game.pos.c+dc;if(game.map[r]?.[c]!==0)return;game.pos={r,c};game.moves++;if(r===game.goal.r&&c===game.goal.c){gamePage('Doolhof gehaald!',`<div class="center-result"><div class="reward-icon">🏆</div><h2>${game.moves} bewegingen</h2><button class="primary" onclick="startMaze()">Nieuw doolhof</button></div>`);gameReward(18,'Doolhof gehaald');return}renderMaze()};

function startWordHunt(){const banks={lena:['MAAN','VIS','BAL','ROOS'],dani:['VOETBAL','ALIEN','HAAI','KASTEEL','RAKET'],zana:['LEIDERSCHAP','HOCKEY','LONDEN','BEWIJS','STRATEGIE']},word=C.pick(C.rng(Date.now()),banks[state.currentProfile]),letters=C.shuffle(C.rng(Date.now()+7),word.split(''));game={type:'wordhunt',word,letters,answer:''};renderWordHunt()}
function renderWordHunt(){gamePage('Woordjacht',`<p class="lead">Zet de letters in de goede volgorde.</p><div class="word-answer">${game.answer||'·'.repeat(game.word.length)}</div><div class="letter-bank">${game.letters.map((x,i)=>`<button onclick="wordPick(${i})">${x}</button>`).join('')}</div><div class="game-controls"><button class="ghost" onclick="game.answer='';renderWordHunt()">Wissen</button><button class="primary" onclick="checkWordHunt()">Controleer</button></div>`)}
window.wordPick=i=>{if(!game.letters[i])return;game.answer+=game.letters[i];game.letters[i]='';renderWordHunt()};
window.checkWordHunt=()=>{if(game.answer===game.word){toast('Woord gevonden!');confetti(25);gameReward(15,'Woordjacht')}else{toast('Nog niet. Kijk naar begin- en eindklanken.');game.answer='';game.letters=C.shuffle(C.rng(Date.now()),game.word.split(''));renderWordHunt()}};

function startPatternPop(){const colors=['🔴','🔵','🟢','🟡','🟣'],len=state.currentProfile==='lena'?3:5,seq=Array.from({length:len},()=>C.pick(C.rng(Date.now()+Math.random()*1000),colors));game={type:'patternpop',seq,input:[]};renderPatternPop()}
function renderPatternPop(){gamePage('Patroon Pop',`<p class="lead">Onthoud: ${game.seq.join(' ')}</p><div class="pattern-input">${game.input.join(' ')||'Tik het patroon na'}</div><div class="pattern-buttons">${['🔴','🔵','🟢','🟡','🟣'].map(x=>`<button onclick="patternTap('${x}')">${x}</button>`).join('')}</div>`)}
window.patternTap=x=>{game.input.push(x);if(game.input[game.input.length-1]!==game.seq[game.input.length-1]){toast('Oeps, opnieuw!');return startPatternPop()}if(game.input.length===game.seq.length){gamePage('Patroon compleet!',`<div class="center-result"><div class="reward-icon">🎈</div><h2>Goed onthouden</h2><button class="primary" onclick="startPatternPop()">Nieuwe ronde</button></div>`);gameReward(12,'Patroon Pop');return}renderPatternPop()};

// ---------- Grotere marketplace en dynamische wereldzones ----------
function compatibleWorldItem(item){const zoneIds=(PROFILE_META[state.currentProfile].worldZones||[]).map(z=>z.id);return item.cat!=='world'||!item.zones||item.zones.some(z=>zoneIds.includes(z))}
renderMarket=function(){
 const cats=['featured','skin','hair','top','bottom','accessory','pet','emote','world'];
 let items=shopCat==='featured'?shopItems.filter(x=>compatibleWorldItem(x)).sort((a,b)=>b.price-a.price).slice(0,18):shopItems.filter(x=>x.cat===shopCat&&compatibleWorldItem(x));
 const body=`<div class="section-head" style="margin-top:0"><div><span class="eyebrow">LevelShop 4.0</span><h1>Skins, pets en werelden</h1></div><span class="coin-wallet">🪙 ${p().coins} LevelCoins</span></div><div class="market-layout"><section class="card avatar-panel"><div class="avatar-studio premium">${avatarHTML()}</div><div class="custom-controls"><div class="glass"><strong>Maak jezelf of een alter ego</strong><p class="muted">Combineer huid, haar, outfit, accessoires, pet en emote. Alles blijft van jou.</p></div><div class="glass"><strong>Geen echt geld</strong><p class="muted">Coins komen uit leren en een beperkte dagelijkse spelbonus. Geen lootboxes.</p></div></div></section><section class="card shop-panel"><div class="shop-tabs">${cats.map(c=>`<button class="ghost ${shopCat===c?'primary':''}" onclick="setShopCat('${c}')">${catName(c)}</button>`).join('')}</div><div class="shop-grid v4-shop">${items.map(shopItemHTML).join('')}</div></section></div>`;
 $("#app").innerHTML=shell(body,'market');
};
shopItemHTML=function(i){const owned=p().owned.includes(i.id),equipped=p().equipped[i.cat]===i.id;return`<button class="shop-item ${owned?'owned':''} ${equipped?'equipped':''}" onclick="shopAction('${i.id}')"><div class="art shop-art">${i.art}</div><strong>${esc(i.name)}</strong><small>${equipped?'In gebruik':owned?'Van jou':`🪙 ${i.price}`}</small>${i.cat==='world'?`<em>${(i.zones||[]).slice(0,2).map(z=>PROFILE_META[state.currentProfile].worldZones.find(x=>x.id===z)?.icon||'🌍').join(' ')}</em>`:''}</button>`};

renderWorld=function(){
 const pr=p(),zones=PROFILE_META[state.currentProfile].worldZones||[],zone=zones.find(z=>z.id===pr.activeWorld)||zones[0],grid=pr.worlds[zone.id]||(pr.worlds[zone.id]=Array(30).fill(null));
 const ownedWorld=shopItems.filter(x=>x.cat==='world'&&pr.owned.includes(x.id)&&compatibleWorldItem(x)&&(x.zones||[]).includes(zone.id));
 const filled=grid.filter(Boolean).length;
 const body=`<div class="section-head" style="margin-top:0"><div><span class="eyebrow">LevelWorlds</span><h1>${zone.icon} ${esc(zone.name)}</h1></div><span class="pill">${filled}/30 geplaatst</span></div><div class="world-tabs">${zones.map(z=>`<button class="world-tab ${z.id===zone.id?'active':''}" onclick="setWorldZone('${z.id}')"><span>${z.icon}</span>${esc(z.name)}</button>`).join('')}</div><section class="card world-builder"><div class="world-scene-v4 sky-${zone.sky} zone-${zone.id}"><span class="sun-moon"></span><span class="world-cloud wc1">☁️</span><span class="world-cloud wc2">☁️</span><span class="world-spark s1">✨</span><span class="world-spark s2">✨</span><div class="world-avatar">${avatarHTML(state.currentProfile,true)}</div><div class="world-grid-v4">${grid.map((id,i)=>{const it=shopItems.find(x=>x.id===id);return`<button class="world-cell-v4 ${it?'occupied':''}" onclick="worldCell(${i})" title="${it?esc(it.name):'Plaats hier'}">${it?`<span>${it.value||it.art}</span>`:''}</button>`}).join('')}</div><div class="world-vehicle">${zone.id==='garage'?'🏎️':zone.id==='travel'?'✈️':zone.id==='ocean'?'🐬':zone.id==='stadium'?'⚽':''}</div></div><div class="world-builder-bottom"><div><strong>Kies een item en tik een vak</strong><p class="muted">Tik zonder selectie op een geplaatst item om het terug te zetten in je inventaris.</p></div><button class="ghost" onclick="clearWorldSelection()">Selectie wissen</button></div><div class="inventory v4-inventory">${ownedWorld.length?ownedWorld.map(i=>`<button class="${selectedWorldItem===i.id?'selected':''}" onclick="selectWorld('${i.id}')" title="${esc(i.name)}"><span>${i.art}</span><small>${esc(i.name)}</small></button>`).join(''):`<div class="empty-inventory"><span>🛍️</span><p>Koop voor deze wereld nieuwe objecten in de LevelShop.</p><button class="primary" onclick="setView('market')">Naar de shop</button></div>`}</div></section>`;
 $("#app").innerHTML=shell(body,'world');
};
window.setWorldZone=id=>{p().activeWorld=id;selectedWorldItem=null;save();renderWorld()};
window.worldCell=i=>{const zone=p().activeWorld,grid=p().worlds[zone];if(selectedWorldItem){const item=shopItems.find(x=>x.id===selectedWorldItem);if(item?.zones&&!item.zones.includes(zone))return toast('Dit item hoort in een andere wereld.');grid[i]=selectedWorldItem;worldPlaceAnimation();}else grid[i]=null;save();renderWorld()};
function worldPlaceAnimation(){confetti(8)}

// ---------- Eigen code kiezen en eenvoudiger inloggen ----------
window.openOwnCode=()=>modal(`<div class="reward-icon">🔑</div><span class="eyebrow">Mijn profielcode</span><h2>${m().name}, kies vier cijfers</h2><p class="muted">Kies een code die jij onthoudt maar je broer of zus niet makkelijk raadt.</p><label>Nieuwe code<input id="own-code-1" inputmode="numeric" maxlength="4" placeholder="4 cijfers"></label><label>Herhaal code<input id="own-code-2" inputmode="numeric" maxlength="4" placeholder="nog een keer"></label><button class="primary" style="margin-top:14px" onclick="saveOwnCode()">Code opslaan</button><button class="ghost" style="margin-top:8px" onclick="closeModal()">Annuleren</button>`);
window.saveOwnCode=()=>{const a=$("#own-code-1").value.trim(),b=$("#own-code-2").value.trim();if(!/^\d{4}$/.test(a))return toast('Gebruik precies 4 cijfers.');if(a!==b)return toast('De twee codes zijn niet gelijk.');state.parent.codes[state.currentProfile]=a;save();closeModal();toast('Jouw nieuwe code is opgeslagen.')};
renderPin=function(){const name=pinTarget==='parent'?'Papa-dashboard':PROFILE_META[pinTarget].name;modal(`<div class="pin-character">${pinTarget==='parent'?'🔐':PROFILE_META[pinTarget].icon}</div><span class="eyebrow">Persoonlijk profiel</span><h2>Code voor ${name}</h2><div class="pin-dots">${Array.from({length:4},(_,i)=>`<i class="pin-dot ${i<pinBuffer.length?'filled':''}"></i>`).join('')}</div><div class="keypad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].map(x=>`<button onclick="pinKey('${x}')">${x}</button>`).join('')}</div><p class="muted" style="margin-top:14px">Code vergeten? Vraag papa. In je profiel kun je daarna zelf een nieuwe code kiezen.</p>`)};

// ---------- Persoonlijke groei en uitgebreid ouderdashboard ----------
function sessionsSince(pr,days){const from=Date.now()-days*86400000;return pr.sessions.filter(x=>new Date(x.date).getTime()>=from)}
function average(arr,key='accuracy'){return arr.length?Math.round(arr.reduce((a,b)=>a+(Number(b[key])||0),0)/arr.length):0}
function weakestSkill(id){const entries=Object.entries(state.profiles[id].skills).filter(([s,x])=>(x.attempts||0)>0);return entries.sort((a,b)=>(a[1].accuracy||0)-(b[1].accuracy||0))[0]}
function repeatedErrors(pr){const map={};for(const x of pr.questionLog.slice(0,300).filter(x=>!x.correct)){const key=(x.lessonKey||x.kind||x.subject||'overig');map[key]=(map[key]||0)+1}return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5)}

renderProgress=function(){
 const pr=p(),sessions=pr.sessions,recent=sessions.slice(0,12),avg=average(recent),week=sessionsSince(pr,7),reading=pr.readingAssessments?.[0],unlocks=Object.entries(pr.curriculum).filter(([,v])=>v);
 const body=`<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Mijn groei</span><h1>${m().name}'s LevelReport</h1></div><button class="ghost" onclick="openOwnCode()">🔑 Mijn code</button></div><div class="stat-grid v4-stats"><div class="stat"><strong>${pr.completed}</strong><small>missies totaal</small></div><div class="stat"><strong>${avg}%</strong><small>laatste 12</small></div><div class="stat"><strong>${week.length}</strong><small>sessies deze week</small></div><div class="stat"><strong>${level(pr.xp)}</strong><small>heldenlevel</small></div></div><div class="grid-2" style="margin-top:18px"><section class="card"><span class="eyebrow">Vaardigheden</span><h2>Niveau en beheersing</h2>${Object.entries(pr.skills).filter(([s,x])=>(x.attempts||0)>0||m().subjects.includes(s)).map(([s,x])=>`<div class="skill-v4"><div><strong>${ACTIVITY_META[s]?.icon||'⚡'} ${subjectName(state.currentProfile,s)}</strong><small>${ratingLabel(state.currentProfile,x.rating)} · ${x.accuracy||0}% recent</small></div><div class="progress"><span style="--w:${v4LevelPct(state.currentProfile,x.rating)}%"></span></div><span class="pill">${x.rating.toFixed(1)}</span></div>`).join('')}</section><section class="card"><span class="eyebrow">Ontgrendeld</span><h2>Uitlegmodules beheerst</h2><div class="unlock-grid">${unlocks.length?unlocks.map(([k])=>`<div><span>✅</span><strong>${curriculumName(k)}</strong></div>`).join(''):`<p class="muted">Start een uitlegmodule in de leerstudio.</p>`}</div>${reading?`<div class="reading-score"><span>🎙️</span><div><strong>${reading.score??'—'}%</strong><small>laatste hardop-leesherkenning</small></div></div>`:''}</section></div><section class="card" style="margin-top:18px"><span class="eyebrow">Scoretrend</span><h2>Laatste sessies</h2><div class="mini-chart big-chart">${recent.slice().reverse().map(x=>`<i style="--h:${Math.max(5,x.accuracy)}%" data-v="${x.accuracy}%"></i>`).join('')||`<p class='muted'>Nog geen resultaten.</p>`}</div><p class="muted">Het niveau reageert sneller: zeer sterke beheersing verhoogt het duidelijk; herhaalde moeite brengt de oefeningen tijdelijk terug.</p></section><section class="card" style="margin-top:18px"><span class="eyebrow">Recente missies</span><h2>Resultaten</h2>${sessionsTable(sessions.slice(0,20),false)}</section>`;
 $("#app").innerHTML=shell(body,'progress');
};

function readingColoredHTML(a){if(!a?.words)return'<p class="muted">Geen woordanalyse beschikbaar.</p>';return`<div class="reading-legend"><span class="good">goed herkend</span><span class="wrong">anders herkend</span><span class="missed">niet herkend</span></div><div class="reading-word-map">${a.words.map(x=>`<span class="${x.status}">${esc(x.word)}</span>`).join(' ')}</div><p class="muted">Deze browserherkenning is een hulpmiddel, geen officiële leesdiagnose. Audio is niet opgeslagen.</p>`}
window.openSessionDetails=(id,sid)=>{const x=state.profiles[id].sessions.find(s=>s.id===sid);if(!x)return;modal(`<span class="eyebrow">${PROFILE_META[id].name} · ${fmtDate(x.date)}</span><h2>${esc(x.title)}</h2><div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:15px"><div class="stat"><strong>${x.accuracy}%</strong><small>score</small></div><div class="stat"><strong>${x.avgSeconds}s</strong><small>per vraag</small></div><div class="stat"><strong>${x.fastWrong}</strong><small>snelle fouten</small></div><div class="stat"><strong>${x.ratingBefore}→${x.ratingAfter}</strong><small>niveau</small></div></div>${x.readingAnalysis?`<h3>🎙️ Hardop-leesanalyse</h3>${readingColoredHTML(x.readingAnalysis)}`:''}<h3 style="margin-top:18px">Alle antwoorden</h3><div class="table-wrap"><table><thead><tr><th>#</th><th>Vraag</th><th>Gegeven</th><th>Geïnterpreteerd</th><th>Juiste antwoord</th><th>Tijd</th></tr></thead><tbody>${(x.results||[]).map((r,i)=>`<tr><td>${i+1} ${r.correct?'✅':'❌'}</td><td>${esc(r.prompt)}</td><td>${esc(r.selected)}</td><td>${esc(r.interpretation||r.selected)}</td><td>${esc(r.answer)}</td><td>${r.seconds}s</td></tr>`).join('')}</tbody></table></div><button class="primary" style="margin-top:14px" onclick="closeModal()">Sluiten</button>`)};

function parentOverviewCard(id){const pr=state.profiles[id],week=sessionsSince(pr,7),recent=pr.sessions.slice(0,10),avg=average(recent),susp=recent.filter(x=>x.suspicious).length,weak=weakestSkill(id),read=pr.readingAssessments?.[0];ensureDaily(id);return`<section class="card parent-child-v4"><div class="parent-child-head"><span>${PROFILE_META[id].icon}</span><div><span class="eyebrow">${PROFILE_META[id].grade}</span><h2>${PROFILE_META[id].name}</h2></div><i class="status-dot ${susp?'red':avg&&avg<65?'amber':'green'}"></i></div><div class="stat-grid" style="grid-template-columns:1fr 1fr"><div class="stat"><strong>${pr.daily.completed.length}/${pr.daily.plan.length}</strong><small>vandaag</small></div><div class="stat"><strong>${avg||'—'}${avg?'%':''}</strong><small>laatste 10</small></div><div class="stat"><strong>${week.length}</strong><small>deze week</small></div><div class="stat"><strong>${susp}</strong><small>doorkliksignalen</small></div></div><div class="parent-insight"><strong>Aandacht:</strong> ${weak?`${subjectName(id,weak[0])} (${weak[1].accuracy||0}% recent)`:'nog onvoldoende data'}</div>${read?`<div class="parent-insight"><strong>Hardop lezen:</strong> ${read.score??'—'}% herkenning</div>`:''}<div class="mini-chart">${recent.slice().reverse().map(x=>`<i style="--h:${Math.max(5,x.accuracy)}%" data-v="${x.accuracy}%"></i>`).join('')}</div></section>`}

renderParent=function(){
 const ids=['dani','zana','lena'],all=ids.flatMap(id=>state.profiles[id].sessions.map(x=>({...x,child:PROFILE_META[id].name,profile:id}))).sort((a,b)=>new Date(b.date)-new Date(a.date)),alerts=ids.flatMap(id=>state.profiles[id].alerts.map(x=>({...x,child:PROFILE_META[id].name,profile:id}))).sort((a,b)=>new Date(b.date)-new Date(a.date)),filtered=parentFilter==='all'?all:all.filter(x=>x.profile===parentFilter);
 const errorRows=ids.flatMap(id=>repeatedErrors(state.profiles[id]).map(([kind,count])=>({id,kind,count}))).sort((a,b)=>b.count-a.count).slice(0,12);
 const body=`<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Papa-dashboard 4.0</span><h1>In één minuut zien wat er gebeurt</h1></div><button class="ghost" onclick="closeParent()">Terug naar ${m().name}</button></div><div class="grid-3">${ids.map(parentOverviewCard).join('')}</div><section class="card parent-priority" style="margin-top:18px"><div class="section-head" style="margin-top:0"><div><span class="eyebrow">Prioriteiten</span><h2>Wat vraagt nu aandacht?</h2></div><span class="pill">${alerts.filter(x=>!x.read&&x.severity!=='green').length} open</span></div>${alerts.filter(x=>!x.read).slice(0,10).map(a=>`<div class="alert ${a.severity}"><i class="traffic"></i><div><strong>${a.child} · ${fmtDate(a.date)}</strong><p>${esc(a.message)}</p></div><button class="ghost" onclick="parentReadAlert('${a.profile}','${a.id}')">Afhandelen</button></div>`).join('')||`<div class="alert green"><i class="traffic"></i><div><strong>Geen open waarschuwingen</strong><p>De recente patronen zien er normaal uit.</p></div></div>`}</section><div class="grid-2" style="margin-top:18px"><section class="card"><span class="eyebrow">Foutenpatronen</span><h2>Waar gaan fouten over?</h2>${errorRows.length?`<div class="error-clusters">${errorRows.map(x=>`<div><span>${PROFILE_META[x.id].icon}</span><strong>${esc(curriculumName(x.kind))}</strong><i>${x.count} fouten</i></div>`).join('')}</div>`:`<p class="muted">Nog onvoldoende foutdata.</p>`}</section><section class="card"><span class="eyebrow">Curriculumstatus</span><h2>Uitlegmodules</h2>${ids.map(id=>`<div class="curriculum-row"><strong>${PROFILE_META[id].name}</strong><div>${Object.entries(state.profiles[id].curriculum).map(([k,v])=>`<span class="${v?'on':''}">${v?'✅':'○'} ${curriculumName(k)}</span>`).join('')}</div></div>`).join('')}</section></div><section class="card" style="margin-top:18px"><div class="section-head" style="margin-top:0"><div><span class="eyebrow">Alle sessies</span><h2>Score, tijd, niveau en gedrag</h2></div><select onchange="setParentFilter(this.value)"><option value="all" ${parentFilter==='all'?'selected':''}>Alle kinderen</option>${ids.map(id=>`<option value="${id}" ${parentFilter===id?'selected':''}>${PROFILE_META[id].name}</option>`).join('')}</select></div>${sessionsTable(filtered.slice(0,100),true)}</section><div class="grid-2" style="margin-top:18px"><section class="card"><span class="eyebrow">Profielcodes</span><h2>Codes beheren</h2><div class="settings-grid">${ids.map(id=>`<label>${PROFILE_META[id].name}<input id="code-${id}" value="${esc(state.parent.codes[id])}" maxlength="4" inputmode="numeric"><small>Het kind kan de eigen code ook in het profiel wijzigen.</small></label>`).join('')}<label>Oudercode<input id="parent-pin" value="${esc(state.parent.pin)}" maxlength="4" inputmode="numeric"></label><label>Rapport e-mail<input id="parent-email" type="email" value="${esc(state.parent.email)}"></label></div><button class="primary" style="margin-top:14px" onclick="saveParentSettings()">Codes opslaan</button></section><section class="card"><span class="eyebrow">Rapportage</span><h2>Export en meldingen</h2><label>Optionele webhook-URL<input id="parent-webhook" value="${esc(state.parent.webhook)}" placeholder="https://..."><small>Voor automatische waarschuwingen via een eigen dienst.</small></label><div class="toggle" style="margin:13px 0"><div><strong>Automatische waarschuwing</strong><small class="muted" style="display:block">Bij doorklikken of minder dan 50% goed</small></div><input id="auto-alert" type="checkbox" ${state.parent.autoAlerts?'checked':''}></div><div class="tag-row"><button class="ghost" onclick="emailReport()">✉ E-mailrapport</button><button class="ghost" onclick="exportCSV()">⬇ CSV</button><button class="ghost" onclick="exportBackup()">⬇ Back-up</button><button class="ghost" onclick="restoreBackup()">↥ Terugzetten</button></div></section></div>`;
 $("#app").innerHTML=shell(body,'none');
};
window.saveParentSettings=()=>{for(const id of ['dani','zana','lena']){const v=$("#code-"+id).value.trim();if(!/^\d{4}$/.test(v))return toast(`Gebruik voor ${PROFILE_META[id].name} precies 4 cijfers.`);state.parent.codes[id]=v}const pp=$("#parent-pin").value.trim();if(!/^\d{4}$/.test(pp))return toast('Gebruik voor de oudercode precies 4 cijfers.');state.parent.pin=pp;state.parent.email=$("#parent-email").value.trim()||state.parent.email;state.parent.webhook=$("#parent-webhook").value.trim();state.parent.autoAlerts=$("#auto-alert").checked;save();toast('Codes en ouderinstellingen opgeslagen.')};

// Pause a quiz for an explanation and return afterwards.
let pausedTaskV4=null;
window.pauseForLesson=k=>{pausedTaskV4=JSON.parse(JSON.stringify(state.task));startLesson(k,null)};
const finishLessonBase=window.finishLesson;
window.finishLesson=()=>{const t=state.task,last=t.results[0],key=t.lessonKey;if(!last?.correct){toast('Bekijk de uitleg nog één keer; daarna kun je opnieuw proberen.');t.step=0;t.answered=false;t.selected=null;t.results=[];save();return render()}p().curriculum[t.lesson.unlock]=true;p().learningHistory.unshift({date:new Date().toISOString(),lesson:key,mastered:true});p().coins+=35;p().xp+=50;if(pausedTaskV4){state.task=pausedTaskV4;pausedTaskV4=null;save();modal(`<div class="reward-icon">🎓</div><h2>Uitleg beheerst</h2><p class="lead">Je gaat terug naar je oefening. Probeer de volgende vraag met deze nieuwe aanpak.</p><button class="primary" onclick="closeModal();render()">Terug naar de opdracht</button>`);return}state.task=null;save();modal(`<div class="reward-icon">🎓</div><h2>${esc(LESSONS[key].title)} beheerst</h2><p class="lead">+35 coins. Deze vraagsoort kan nu in je oefenmix verschijnen.</p><button class="primary" onclick="closeModal();setView('learn')">Naar de leerstudio</button>`);confetti(35)};

window.leaveTask=()=>{if(readingRecognitionActive){readingRecognitionActive=false;try{readingRecognition?.stop()}catch(e){}}if(confirm('Missie pauzeren? Niet afgeronde vragen worden niet opgeslagen.')){state.task=null;pausedTaskV4=null;save();render()}};

// Final render dispatcher after all 4.0 overrides.
render=function(){
 clearInterval(tick);
 if(!state.currentProfile)return renderProfiles();
 ensureDaily();
 if(state.task)return renderTask();
 if(state.parentOpen)return renderParent();
 ({home:renderHome,learn:renderLearn,games:renderGames,market:renderMarket,world:renderWorld,progress:renderProgress}[state.view]||renderHome)();
};

migrateV4();
render();
