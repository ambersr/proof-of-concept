// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

app.get('/', function (request, response) {
    response.render('index.liquid')
});

app.get('/cases', async function (request, response) {

    const apiResponse = await fetch('https://labelvier.nl/wp-json/wp/v2/cases?per_page=99');
    const apiResponseJSON = await apiResponse.json();
  
    response.render('cases.liquid', {cases: apiResponseJSON});
});

app.get('/cases/case/:id', async function (request, response) {

    const caseResponse = await fetch('https://labelvier.nl/wp-json/wp/v2/cases/' + request.params.id);
    const caseData = await caseResponse.json();
    
    const usersResponse = await fetch('https://labelvier.nl/wp-json/wp/v2/users/');
    const usersData = await usersResponse.json();

    response.render('case.liquid', {case: caseData, users: usersData });
});

// --------------------------- Poort --------------------------------

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});