// Import
import express from "express";
import { Liquid } from "liquidjs";

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
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON
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
  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image,acf.logo_white`);
  const casesResponseJSON = await casesResponse.json();

  // Totaal aantal pagina’s uit headers
  const totalPages = casesResponse.headers.get("X-WP-TotalPages");

  // cases met media data gekoppeld
  const casesWithMedia = [];

  for (const singleCase of casesResponseJSON) {
    let logo_white_url = null;

    if (singleCase.acf?.logo_white) {
      const mediaResponseJSON = await fetchJson(`${mediaEndpoint}${singleCase.acf.logo_white}`);
      logo_white_url = mediaResponseJSON?.source_url || null;
    }

    casesWithMedia.push({ ...singleCase, logo_white_url });
  }

  // Pagina renderen
  res.render("cases.liquid", {
    cases: casesWithMedia,
    currentPage: page,
    totalPages,
  });
});

// Cases detail
app.get("/cases/:slug", async (req, res) => {
  const slug = req.params.slug;

  // Cases detail ophalen
  const casesdetailResponseJSON = await fetchJson(`${casesEndpoint}?slug=${slug}&${embedFilter}`);

  // Users ophalen
  const usersResponseJSON = await fetchJson(`${usersEndpoint}?_fields=id,name,acf.user_data.profile_image`);

  res.render("cases-detail.liquid", {
      cases: casesdetailResponseJSON,
      users: usersResponseJSON
    });
});

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});