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

// --------------------------- GET routes --------------------------------

// Home
app.get("/", async function (req, res) {

  res.render("index.liquid");
});

// Cases
app.get("/cases", async (req, res) => {

  res.render("cases.liquid");
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