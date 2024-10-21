async function recupererDonnes(url) {
    const reponse = await fetch(url);
    const cinemas = await reponse.json();
    return cinemas
  }

const donnesCinemas = recupererDonnes('geo-les_salles_de_cinemas_en_ile-de-france.json'); 
console.log(donnesCinemas); 

let map = L.map('map').setView([48.6788809 , 1.8419643], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
