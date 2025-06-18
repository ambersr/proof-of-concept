## Project Label Vier

De afgelopen 3 weken heb ik gewerkt aan het project Label Vier, een frontendbedrijf die zich bezig houdt met de interface en het ontwikkelen van online platforms. Tijdens dit project heb ik de Cases overzichtspagina en de case detailpagina opnieuw ontworpen en ontwikkeld met als doel de huidige stijl te behouden.

### Wie is Label Vier
Label Vier is een creatief bureau gevestigd in Amersfoort. Zij richten zich op branding, webdesign en ontwikkeling, en werkt voor zowel start-up-bedrijven als gevestigde bedrijven. Label Vier werkt volgens een gestructureerde werkwijze die bestaat uit 4 fases: onderzoeken, ontwerpen, ontwikkelen en optimaliseren.

### Klantvraag
Ontwikkel een verbeterde versie van de cases overzichtspagina en de detailpagina van de Label Vier website met als doel de gebruikservaring, structuur en visuele kwaliteit te optimaliseren ten opzichte van het bestaande ontwerp.

[Live link](www.edu.nl/a3tah) naar het eindresultaat.

![mockup-label](https://github.com/user-attachments/assets/b43e3db7-95b2-47f8-b313-be3a6df1bd91)


## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
### Cases overzichtpagina  
De cases overzichtpagina toont een lijst met projectcases en teamleden, waarbij belangrijke functies zoals ophalen, tonen en filteren centraal staan. Deze pagina is opgebouwd volgens de vier lagen van de Hierarchy of User Needs.

[Livelink](https://proof-of-concept-ip1p.onrender.com/cases) naar de case overzichtspagina.

### Paginatie  

#### 1 & 2 – Functional & Reliable  
- De paginatie wordt server-side gerenderd, waardoor de pagina ook zonder client-side JavaScript en CSS volledig functioneel blijft.  
- De HTML is semantisch correct opgebouwd, met bijvoorbeeld anchor links `<a>` en een logische heading-structuur. Dit is getest met de W3C Validator.  
- Met Liquid wordt via `if`- en `else`-condities gecontroleerd welke paginatieknop actief is en welke links getoond worden.

#### 3 – Usable  
- De paginatie is responsive en volgt het mobile-first principe, zodat navigatie op alle apparaten soepel verloopt.  
- De paginatieknoppen zijn goed bereikbaar via het toetsenbord (tab-navigatie), wat de toegankelijkheid verbetert.

https://github.com/user-attachments/assets/bddb86a6-0498-4500-9ac9-4a24dbe4430d

### Case Cards  

#### 1 & 2 – Functional & Reliable  
- De projectdata wordt server-side opgehaald, waardoor de inhoud altijd zichtbaar is, ook zonder client-side JavaScript en CSS.  
- Er is gebruikgemaakt van semantische HTML-structuur, zoals `<section>`, `<ul>` en `<li>` elementen. De data wordt met Liquid templates netjes in de HTML gerenderd.

#### 3 – Usable  
- De case cards zijn responsive gemaakt met media queries, waarbij de schermbreedtes `min-width: 920px` en `min-width: 1200px` consistent worden toegepast.  
- Ook hier zijn de knoppen eenvoudig te bedienen met de tab-toets, wat zorgt voor goede toetsenbordnavigatie.

#### 4 – Pleasurable  
- Bij het hoveren over een project verschijnt een stijlvolle animatie over de titel en knop, wat zorgt voor een prettige interactieve ervaring.  
- Daarnaast is er een scroll-driven animatie geïmplementeerd: wanneer je door de projecten scrollt, verschijnen ze één voor één met een fade-in effect.

https://github.com/user-attachments/assets/abcaad01-88c4-40f4-994c-d03f01e545aa

---

### Cases Detailpagina

De detailpagina toont informatie over een specifieke case en bevat een contactformulier dat functioneel, bruikbaar én plezierig is volgens de vier lagen van de Hierarchy of User Needs.

[Livelink](https://proof-of-concept-ip1p.onrender.com/cases/munji-zo-bouwden-we-een-webshop-voor-dit-bordspel) naar de case detailpagina.

### Contactformulier

#### 1 & 2 – Functional & Reliable  
- Het contactformulier verstuurt data via een POST-request en slaat dit server-side op in de database.
- De standaard- en successtatus worden afgehandeld via Liquid templating met `if` en `else` tags.
- Er is gebruikgemaakt van semantische HTML: bijvoorbeeld een `<form>` met correcte `<label>` en `<input>` elementen voor optimale toegankelijkheid.

#### 3 – Usable  
- Het formulier werkt op alle schermgroottes dankzij een mobile-first aanpak met `@media queries`.
- Alle velden zijn duidelijk gelabeld en eenvoudig te bedienen, ook met toetsenbord.
- Er is gebruikgemaakt van `:user-valid` en `:user-invalid` pseudo-classes voor visuele feedback tijdens het invullen, zonder extra JavaScript. Zo ziet de gebruiker direct of een veld correct is ingevuld.

#### 4 – Pleasurable  
- De pagina wordt tijdens het verzenden niet volledig gerefresht. Dit wordt voorkomen met client-side JavaScript (`event.preventDefault()`), wat zorgt voor een vloeiendere ervaring.
- Tijdens het verzenden verschijnt een loading state, waardoor de wachttijd voor de gebruiker minder lang aanvoelt (perceived performance).

https://github.com/user-attachments/assets/09be0a07-7ea5-43bb-8d8a-be0946251f02

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

### Code Conventies
#### HTML / Liquid
- Gebruik semantische HTML: <section>, <article>, <main>
- 2 spaties voor inspringing (geen tabs)
- kebab-case voor classnamen: section-title
- Voeg alt-teksten toe aan afbeeldingen (wanneer dit voor toegankelijkheid nodig is)
- Structuur volgens sitemap (routes & includes)

#### CSS
- kebab-case voor classnamen: .form-field
- Naamgeving in het engels
- Schrijf mobile-first met zo mogelijk geneste media queries
- Gebruik --custom-properties waar mogelijk
- Houd CSS DRY (vermijd dubbele regels)

#### JavaScript
- camelCase voor variabelen/functies: handleSubmit
- Gebruik const/let
- Voeg comments of JSDoc toe bij functies

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
