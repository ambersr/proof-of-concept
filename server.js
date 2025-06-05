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

// --------------------------- Algemene API's & variabelen --------------------------------

const directusApiBaseUrl = "https://labelvier.nl/wp-json";
const casesEndpoint = `${directusApiBaseUrl}/wp/v2/cases`;
const mediaEndpoint = `${directusApiBaseUrl}/wp/v2/media/4374`;
const usersEndpoint = `${directusApiBaseUrl}/wp/v2/users`;

const embedFilter = `?_embed&acf_format=standard`;

const perPage = 8;

// --------------------------- GET routes --------------------------------

// Home
app.get("/", async function (req, res) {

  res.render("index.liquid");
});

// Cases
app.get("/cases", async (req, res) => {
  const page = 1;

  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image`);
  const casesResponseJSON = await casesResponse.json();

  const mediaResponse = await fetch(`${mediaEndpoint}`);
  const mediaResponseJSON = await mediaResponse.json();

  res.render("cases.liquid");
  const totalPages = casesResponse.headers.get("X-WP-TotalPages");

  console.log(`${totalPages}`);

  res.render("cases.liquid", {
    cases: casesResponseJSON,
    media: mediaResponseJSON,
    currentPage: page,
    totalPages,
  });
});

// Paginatie
app.get("/cases/page/:pageNumber", async (req, res) => {
  const page = req.params.pageNumber;

  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image`);
  const casesResponseJSON = await casesResponse.json();

  const totalPages = casesResponse.headers.get("X-WP-TotalPages");

  res.render("cases.liquid", {
    cases: casesResponseJSON,
    currentPage: page,
    totalPages,
  });
});

// Cases detail
app.get("/cases/:slug", async function (req, res) {

  res.render("cases-detail.liquid")
});

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});