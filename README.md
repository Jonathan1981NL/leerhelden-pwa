# LeerHelden

Een volledig statische, responsive Progressive Web App (PWA) voor adaptief huiswerk van Dani en Zana.

## Wat zit erin?

- Profielen voor Dani (midden groep 5, rekenen eind groep 5) en Zana (groep 8 met brugklas HAVO/VWO-uitdaging).
- Dani's dagverdeling: 2× lezen, 2× spelling en 1× rekenen.
- Zana's dagverdeling: 2× begrijpend lezen, rekenen, taal, Engels en wereldoriëntatie.
- Originele, gepersonaliseerde verhalen en inhoudsvragen.
- Adaptief niveau per vak op schaal 1–5.
- Beloningen, XP, bouwmunten, bekers en een bouwwereld.
- Focuscoaching en een grappig Afleidings-Alien-signaal.
- Ouderomgeving met resultaten, niveaubeweging, CSV-export en JSON-back-up.
- Lokale opslag in de browser; geen account of tracking.
- Offline werking na het eerste bezoek.
- Optionele rapportwebhook voor Make/Zapier/Formspree of een eigen server.

## Direct openen

Open `index.html` via een lokale webserver. Een service worker werkt niet goed via `file://`.

Bijvoorbeeld met Python:

```bash
python -m http.server 8080
```

Open daarna `http://localhost:8080`.

## Publiceren op GitHub Pages

1. Maak een nieuwe GitHub-repository.
2. Upload alle bestanden uit deze map naar de root van de repository.
3. Open **Settings → Pages**.
4. Kies **Deploy from a branch**, branch `main`, map `/root`.
5. Open de GitHub Pages-link.

## Ouderomgeving

De standaard oudercode is `2580`. Verander die direct in **Ouder → Instellingen**.

Let op: dit is een lokale drempel, geen server-side beveiliging. Voor echte accounts en synchronisatie tussen apparaten is een backend nodig.

## Rapportage per e-mail

Een statische GitHub Pages-site kan niet zelfstandig en veilig e-mail versturen zonder externe dienst.

De app biedt daarom drie routes:

1. **E-mailrapport** opent een voorgeschreven e-mail aan `J_van_geelen@hotmail.com`.
2. **CSV/JSON-export** bewaart alle resultaten.
3. Vul een **webhook-URL** in voor automatische verzending na elke missie. Het webhookbericht bevat `to`, `subject`, `child`, `session` en `report`.

## Belangrijke technische beperking

Voortgang wordt standaard per browser/apparaat opgeslagen via `localStorage`. Voor gedeelde voortgang tussen iPad, telefoon en computer is in een volgende fase een backend nodig, bijvoorbeeld Supabase of Firebase met ouderaccount en kindprofielen.

## Onderwijskundige uitgangspunten

De inhoud sluit aan op Nederlandse kerndoelen en referentieniveaus voor lezen, taalverzorging en rekenen. De adaptieve score is een interne oefenindicator en geen officiële Cito-, IEP- of schoolscore.
