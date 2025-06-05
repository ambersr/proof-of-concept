// Import
import express from "express";
import { Liquid } from "liquidjs";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const embedFilter = `_embed=true&acf_format=standard`;

const perPage = 8;

// --------------------------- GET routes --------------------------------

// Home
app.get("/", async function (req, res) {

  res.render("index.liquid");
});

// Functie fetch omzetten naar JSON
async function fetchJson(url) {
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON
}

// test
app.get("/test", async function (req, res) {

const casesResponseJSON = await fetchJson(`${casesEndpoint}?_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image`);

  res.render("test.liquid", {
    cases: casesResponseJSON
  });
});


// Cases
app.get("/cases", async (req, res) => {
  const page = 1;

  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image`);
  const casesResponseJSON = await casesResponse.json();

  const mediaResponse = await fetch(`${mediaEndpoint}`);
  const mediaResponseJSON = await mediaResponse.json();

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
    
  const slug = req.params.slug;
const submitted = req.query.submitted === 'true';

  const casesdetailResponse = await fetch(`${casesEndpoint}?slug=${slug}&${embedFilter}`);
  const casesdetailResponseJSON = await casesdetailResponse.json();

  const usersResponse = await fetch(`${usersEndpoint}`);
  const usersResponseJSON = await usersResponse.json();

  res.render("cases-detail.liquid", {
      cases: casesdetailResponseJSON,
      users: usersResponseJSON,
      submitted
    });
});

// --------------------------- POST routes -----------------------------------

app.post('/cases/:slug', (req, res) => {
  const { voornaam, achternaam, email, bericht } = req.body;

  const newMessage = {
    voornaam,
    achternaam,
    email,
    bericht
  };

  const filePath = path.join(__dirname, 'messages.json');

  let messages = [];

  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    try {
      messages = JSON.parse(fileData);
    } catch (err) {
      console.error('Fout bij JSON parse:', err);
    }
  }

  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf-8');

  res.redirect(303, `/cases/${req.params.slug}?submitted=true`);
});

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});