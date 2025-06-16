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

// --------------------------- Algemene API's, variabelen en functie --------------------------------

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

app.get(["/cases", "/cases/page/:pageNumber"], async (req, res) => {
  const page = req.params.pageNumber || 1;
  const perPage = 8;

  const casesResponse = await fetch(`${casesEndpoint}?per_page=${perPage}&page=${page}&${embedFilter}&_fields=title,slug,yoast_head_json.og_description,yoast_head_json.og_image,acf.logo_white`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
      'Accept': 'application/json',
    }
  });

  const casesResponseJSON = await casesResponse.json();
  const totalPages = casesResponse.headers.get("X-WP-TotalPages");
  const casesWithMedia = [];

  for (const singleCase of casesResponseJSON) {
    let logo_white_url = null;

    if (singleCase.acf?.logo_white) {
      const mediaResponseJSON = await fetchJson(`${mediaEndpoint}${singleCase.acf.logo_white}`);
      logo_white_url = mediaResponseJSON?.source_url || null;
    }

    casesWithMedia.push({ ...singleCase, logo_white_url });
  }

  res.render("cases.liquid", {
    cases: casesWithMedia,
    currentPage: parseInt(page),
    totalPages,
  });
});


app.get("/cases/:slug", async (req, res) => {
  const slug = req.params.slug;

  // cases en users data ophalen
  const casesdetailResponseJSON = await fetchJson(`${casesEndpoint}?slug=${slug}&${embedFilter}`);
  const usersResponseJSON = await fetchJson(`${usersEndpoint}`);
  const messagesResponseJSON = await fetchJson(`${messagesEndpoint}`);

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
    submitted: req.query.submitted === "true"
  });
});

// 
// ------------------------ POST routes ------------------------

app.post("/cases/:slug", async (req, res) => {
  const { nameField, lastnameField, emailField, textField, casetitleField } = req.body;
 
  try {
    await fetch("https://fdnd-agency.directus.app/items/avl_messages", {
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

    console.log(`Bericht verzonden door ${nameField} ${lastnameField} voor case "${casetitleField}"`)
        
    res.redirect(`/cases/${req.params.slug}?submitted=true`);
  } catch (error) {
    console.error("Fout bij verzenden van formuliergegevens:", error);
    res.status(500).send("Er ging iets mis met het verzenden van het formulier.");
  }
});

// 404 pagina als je de route niet werkt
 app.use((req, res) => {
   res.status(404).render("404.liquid", { })
 })

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});