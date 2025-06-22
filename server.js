// Import
import express from "express";
import { Liquid } from "liquidjs";

// Express
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Liquid
const engine = new Liquid();
app.engine("liquid", engine.express());

// Views
app.set("views", "./views");

// --------------------------- Algemene API's & functies --------------------------------

const directusApiBaseUrl = "https://labelvier.nl/wp-json";
const casesEndpoint = `${directusApiBaseUrl}/wp/v2/cases/`;
const mediaEndpoint = `${directusApiBaseUrl}/wp/v2/media/`;
const usersEndpoint = `${directusApiBaseUrl}/wp/v2/users/`;
const embedFilter = `_embed=true&acf_format=standard`;
const messagesEndpoint = "https://fdnd-agency.directus.app/items/avl_messages";

// Functie fetch omzetten naar JSON
async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
      'Accept': 'application/json',
    }
  });
  const responseJSON = await response.json();
  return responseJSON;
}

// --------------------------- GET routes --------------------------------

// Homepagina
app.get("/", async function (req, res) {

  res.render("index.liquid");
});

// Cases overzichtspagina (incl. pagination)
app.get(["/cases", "/cases/page/:pageNumber"], async (req, res) => {
  const page = req.params.pageNumber || 1;
  const perPage = 8;

  // benodigde velden voor cases ophalen
  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&${embedFilter}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image,acf.logo_white`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
      'Accept': 'application/json',
    }
  });

  const casesResponseJSON = await casesResponse.json();

  // haal totaal aantal op
  const totalPages = casesResponse.headers.get("X-WP-TotalPages");

  // array waarin alle cases met het logo worden opgeslagen
  const casesWithLogo = [];

  // voor elke case
  for (const singleCase of casesResponseJSON) {

    // fallback voor wanneer logo_white_url leeg is
    let logo_white_url = null;

    // als een case het veld logo_white bevat haal dan de URL van dat logo op via de media endpoint
    if (singleCase.acf?.logo_white) {
      const mediaResponseJSON = await fetchJson(`${mediaEndpoint}${singleCase.acf.logo_white}`);
      logo_white_url = mediaResponseJSON?.source_url || null;
    }

    // voeg de case met de logo_white_url toe aan de array casesWithLogo
    casesWithLogo.push({ ...singleCase, logo_white_url });
  }

  res.render("cases.liquid", {
    cases: casesWithLogo,
    currentPage: parseInt(page), // zet page om van een string naar een getal (voor de active state)
    totalPages,
  });
});

// Case detailpagina
app.get("/cases/:slug", async (req, res) => {
  const slug = req.params.slug;

  // cases en users data ophalen
  const casesdetailResponseJSON = await fetchJson(`${casesEndpoint}?slug=${slug}&${embedFilter}`);
  const usersResponseJSON = await fetchJson(`${usersEndpoint}`);

  // haal de projectleider en teamleden op uit de acf velden
  const projectLeider = casesdetailResponseJSON[0].acf?.case_projectleider;
  const teamLeden = casesdetailResponseJSON[0].acf?.case_team;

  // koppel role en profiel afbeelding URL aan projectleider
  if (projectLeider) {
    const user = usersResponseJSON.find(currentUser => currentUser.id === projectLeider.ID);

    // koppel de rol aan de projectleider
    projectLeider.role = user?.acf?.user_data?.role;

    // als er een profielfoto is voeg dan de profile_image_url toe aan de projectLeider
    if (user?.acf?.user_data?.profile_image) {
      const media = await fetchJson(`${mediaEndpoint}${user.acf.user_data.profile_image}`);
      projectLeider.profile_image_url = media.source_url;
    }

    // als er geen profielfoto is laat dan het veld leeg
    else {
      projectLeider.profile_image_url = '';
    }
  }

  // koppel role en profiel afbeelding URL aan teamleden
  for (const teamLid of teamLeden) {

    // zoek in de lijst van users naar hetzelfde ID die overeenkomt met het teamlid
    const user = usersResponseJSON.find(currentUser => currentUser.id === teamLid.ID);

    // koppel de rol aan het juiste teamlid
    teamLid.role = user?.acf?.user_data?.role;

    // als er een profielfoto is voeg dan de profile_image_url toe aan het teamLid
    if (user?.acf?.user_data?.profile_image) {
      const media = await fetchJson(`${mediaEndpoint}${user.acf.user_data.profile_image}`);
      teamLid.profile_image_url = media.source_url;
    } 

    // als er geen profielfoto is laat dan het veld leeg
    else {
      teamLid.profile_image_url = '';
    }
  }

  res.render("cases-detail.liquid", {
    cases: casesdetailResponseJSON,
    projectLeider,
    teamLeden,
    submitted: req.query.submitted === "true" // check of het formulier verzonden is
  });
});

// ------------------------ POST routes ------------------------

// Contactformulier op case detailpagina
app.post("/cases/:slug", async (req, res) => {

  // haal alle invoervelden op die in het contactformulier staan
  const { nameField, lastnameField, emailField, textField, casetitleField } = req.body;
 
  // sla alle ingevulde formuliervelden op in de messages database
  try {
    await fetch(`${messagesEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        from: `${nameField} ${lastnameField}`,
        for: emailField,
        text: `Case:${casetitleField} - Bericht:${textField}`
      }),
    });

    // dubbelcheck of het formulier verzonden wordt
    console.log(`Bericht verzonden door ${nameField} ${lastnameField} voor case "${casetitleField}"`)
    
    // redirect terug naar de cases detailpagina met url ?submitted=true
    res.redirect(`/cases/${req.params.slug}?submitted=true`);
  
  // wanneer het verzenden niet lukt
  } catch (error) {

    // geef een log error terug
    console.error("Verzenden gegevens niet gelukt", error);
  }
});

// 404 pagina als de route niet werkt
 app.use((req, res) => {
   res.status(404).render("404.liquid", { })
 })

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});