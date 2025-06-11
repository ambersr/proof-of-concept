// Import
import express from "express";
import { Liquid } from "liquidjs";
import fetch from "node-fetch";
import UserAgent from "user-agents";

// Express
const app = express();
app.use(express.static("public"));

// Liquid
const engine = new Liquid();
app.engine("liquid", engine.express());

// Views
app.set("views", "./views");

// --------------------------- Algemene API's, variabelen en functie --------------------------------

const directusApiBaseUrl = "https://labelvier.nl/wp-json";
const casesEndpoint = `${directusApiBaseUrl}/wp/v2/cases/`;
const mediaEndpoint = `${directusApiBaseUrl}/wp/v2/media/`;
const usersEndpoint = `${directusApiBaseUrl}/wp/v2/users/`;
const embedFilter = `_embed=true&acf_format=standard`;

// Functie fetch omzetten naar JSON
async function fetchJson(url) {
  const userAgent = new UserAgent();
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent.toString(),
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
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

// Cases overzicht (met paginatie)
app.get("/cases/page/:pageNumber", async (req, res) => {
  const page = req.params.pageNumber;
  const perPage = 8;

  // Cases ophalen
  const userAgent = new UserAgent();

  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image,acf.logo_white`, {
  headers: {
    'User-Agent': userAgent.toString(),
    'Accept': 'application/json',
    }
  }); 

  const casesResponseJSON = await casesResponse.json();

  // Totaal aantal pagina’s uit headers
  const totalPages = casesResponse.headers.get("X-WP-TotalPages");

  // array met alle cases gekoppeld met media data
  const casesWithMedia = [];

  // als er een logo_white veld is
  for (const singleCase of casesResponseJSON) {
    let logo_white_url = null;

    // als er een logo_white veld is
    if (singleCase.acf?.logo_white) {
      const mediaResponseJSON = await fetchJson(`${mediaEndpoint}${singleCase.acf.logo_white}`);
      logo_white_url = mediaResponseJSON?.source_url || null;
    }

    // voeg aan de singleCase de property logo_white_url toe
    casesWithMedia.push({ ...singleCase, logo_white_url });
  }

  // Pagina renderen
  res.render("cases.liquid", {
    cases: casesWithMedia,
    currentPage: page,
    totalPages,
  });
});

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

    // koppel de rol van de gebruiker aan de projectleider
    projectLeider.role = user?.acf?.user_data?.role;

    // als er een profielfoto is, haal dan de afbeelding op en koppel de URL (projectleider)
    if (user?.acf?.user_data?.profile_image) {
      const media = await fetchJson(`${mediaEndpoint}${user.acf.user_data.profile_image}`);
      projectLeider.profile_image_url = media.source_url;
    }
    else {
      projectLeider.profile_image_url = '';
    }
  }

  // koppel role en profiel afbeelding URL aan teamleden
  for (const teamLid of teamLeden) {
    const user = usersResponseJSON.find(currentUser => currentUser.id === teamLid.ID);
    teamLid.role = user?.acf?.user_data?.role;

    // als er een profielfoto is, haal dan de afbeelding op en koppel de URL (teamleden)
    if (user?.acf?.user_data?.profile_image) {
      const media = await fetchJson(`${mediaEndpoint}${user.acf.user_data.profile_image}`);
      teamLid.profile_image_url = media.source_url;
    } 
    else {
      teamLid.profile_image_url = '';
    }
    
  }

  res.render("cases-detail.liquid", {
    cases: casesdetailResponseJSON,
    projectLeider,
    teamLeden,
  });
});

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});