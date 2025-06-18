## Project Label Vier

De afgelopen 3 weken heb ik gewerkt aan het project Label Vier, een frontendbedrijf die zich bezig houdt met de interface en het ontwikkelen van online platforms. Tijdens dit project heb ik de Cases overzichtspagina en de case detailpagina opnieuw ontworpen en ontwikkeld met als doel de huidige stijl te behouden.

### Wie is Label Vier
Label Vier is een creatief bureau gevestigd in Amersfoort. Zij richten zich op branding, webdesign en ontwikkeling, en werkt voor zowel start-up-bedrijven als gevestigde bedrijven. Label Vier werkt volgens een gestructureerde werkwijze die bestaat uit 4 fases: onderzoeken, ontwerpen, ontwikkelen en optimaliseren.

[Live link](www.edu.nl/a3tah) naar het eindresultaat.

![mockup-label](https://github.com/user-attachments/assets/b43e3db7-95b2-47f8-b313-be3a6df1bd91)


## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
<!-- Bij Beschrijving staat kort beschreven wat voor project het is en wat je hebt gemaakt -->
<!-- Voeg een mooie poster visual toe 📸 -->
<!-- Voeg een link toe naar Github Pages 🌐-->

## Gebruik
<!-- Bij Gebruik staat de user story, hoe het werkt en wat je er mee kan. -->

## Kenmerken

Voor dit project is gebruik gemaakt van Node.js en Express om een webserver te bouwen. De HTML-pagina’s worden gegenereerd met Liquid, een template-engine waarmee je makkelijk dynamische content kunt tonen.

### Routes en data

- ``GET /``: Laadt de homepage en toont `index.liquid`.
- ``GET /cases``: Haalt alle cases op vanuit de WordPress API. Ondersteunt paginering met `:pageNumber` en laat de resultaten zien in `cases.liquid`.
- ``GET /cases/:slug``: Laadt detailinformatie van één case, inclusief projectleider en teamleden. Data komt uit WordPress en wordt gecombineerd met profielinfo zoals afbeeldingen en rollen.
- ``POST /cases/:slug``: Verwerkt een formulier dat gekoppeld is aan een specifieke case. Het bericht wordt opgeslagen via de Directus API.
- ``404``: Voor routes die niet bestaan wordt een aparte foutpagina getoond (`404.liquid`).

### Hoe de data wordt opgehaald en getoond

- Data wordt opgehaald met `fetch()` vanuit de WordPress REST API (`/wp-json/wp/v2/`) en de Directus API.
- Voor cases worden o.a. titel, slug, logo en SEO-data opgehaald. Bij detailpagina’s worden ook gebruikersinformatie en afbeeldingen van teamleden opgehaald.
- Formulierinzendingen worden als berichten opgeslagen in een Directus collectie (`avl_messages`).
- De pagina’s worden gerenderd met behulp van Liquid templates. De data wordt via Express aan deze templates doorgegeven.

### Gebruikte tools

- **Express.js** – server en routing  
- **LiquidJS** – templates renderen  
- **WordPress API** – content ophalen  
- **Directus API** – formulierdata opslaan  
- **Fetch API** – data ophalen in routes  

## Installatie

Om het project lokaal te gebruiken heb je Node.js nodig. Daarna kun je het project openen in een code-editor.

1. Installeer de benodigde pakketten:
   ```bash
   npm install
2. Start de server:
   ```bash
   npm start
3. Bekijk het project in je browser via:
   ```bash
   http://localhost:8000

## Bronnen
- Website Label Vier
- Huisstijl document Label Vier

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
