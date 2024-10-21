async function afficherFilms() {
    const reponse = await fetch('geo-les_salles_de_cinemas_en_ile-de-france.json');
    const films = await reponse.json();
    console.log(films);
  }

afficherFilms(); 
let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);