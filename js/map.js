// Initialiser la carte
function initMap() {
  let map = L.map('map').setView([48.8566, 2.3522], 12); // Paris
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  return map;
}

async function recupererDonnes(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Erreur lors du chargement du fichier JSON:', error);
    });
}

// Fonction pour convertir les données JSON en GeoJSON
function convertToGeoJSON(data) {
  return data.map(function (cinema) {
    let coords = cinema.geo.split(',').map(Number);

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [coords[1], coords[0]]
      },
      "properties": {
        "ndeg_auto": cinema.ndeg_auto,
        "dep": cinema.dep,
        "nom": cinema.nom,
        "region_administrative": cinema.region_administrative,
        "adresse": cinema.adresse,
        "code_insee": cinema.code_insee,
        "commune": cinema.commune,
        "situation_geographique": cinema.situation_geographique,
        "ecrans": cinema.ecrans,
        "fauteuils": cinema.fauteuils,
        "semaines_d_activite": cinema.semaines_d_activite,
        "seances": cinema.seances,
        "entrees": cinema.entrees,
        "entrees_2015": cinema.entrees_2015,
        "evolution_entrees": cinema.evolution_entrees,
        "tranche_d_entrees": cinema.tranche_d_entrees,
        "proprietaire": cinema.proprietaire,
        "programmateur": cinema.programmateur,
        "ae": cinema.ae,
        "categorie_art_et_essai": cinema.categorie_art_et_essai,
        "label_art_et_essai": cinema.label_art_et_essai,
        "genre": cinema.genre,
        "multiplexe": cinema.multiplexe,
        "nombre_de_films_programmes": cinema.nombre_de_films_programmes,
        "nombre_de_films_inedits": cinema.nombre_de_films_inedits,
        "nombre_de_films_en_semaine_1": cinema.nombre_de_films_en_semaine_1,
        "pdm_en_entrees_des_films_francais": cinema.pdm_en_entrees_des_films_francais,
        "pdm_en_entrees_des_films_americains": cinema.pdm_en_entrees_des_films_americains,
        "pdm_en_entrees_des_films_europeens": cinema.pdm_en_entrees_des_films_europeens,
        "pdm_en_entrees_des_autres_films": cinema.pdm_en_entrees_des_autres_films,
        "films_art_et_essai": cinema.films_art_et_essai,
        "part_des_seances_de_films_art_et_essai": cinema.part_des_seances_de_films_art_et_essai,
        "pdm_en_entrees_des_films_art_et_essai": cinema.pdm_en_entrees_des_films_art_et_essai
      }
    };
  });
}

// Fonction pour ajouter les données GeoJSON à la carte
function addDataToMap(map, geoJSONData) {
  let markers = L.markerClusterGroup();

  const iconCinema = L.icon({
    iconUrl: 'images/pin-cinema.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  const imgUrls = [
    'images/drapeaux/fr.png',
    'images/drapeaux/usa.png',
    'images/drapeaux/eu.png',
    'images/drapeaux/world.png',
  ];
  const images = imgUrls.map(url => {
    const img = new Image();
    img.src = url;
    return img;
  });

  const imagePlugin = {
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      chart.data.datasets.forEach((dataset) => {
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((arc, index) => {
          const radius = (arc.outerRadius + arc.innerRadius) / 2;
          const angle = (arc.startAngle + arc.endAngle) / 2;
          const x = arc.x + radius * Math.cos(angle) - 5; // Centre ajusté pour 10px
          const y = arc.y + radius * Math.sin(angle) - 5; // Centre ajusté pour 10px
          if (images[index].complete) {
            ctx.drawImage(images[index], x, y, 15, 15); // Taille réduite à 20x20 pixels
          }
        });
      });
    }
  };
  L.geoJSON(geoJSONData, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: iconCinema });
    },
    onEachFeature: function (feature, layer) {
      const canvasId = 'myChart' + feature.properties.ndeg_auto;
      let popupContent =
        `<article class="popupCinema">
        <div class="enteteCinema">
          <img src="images/pin-cinema.svg" alt="Pin Cinema">
          <div class="enteteCinema-texte">
            <p class="nomCinema">${feature.properties.nom}</p>
            <p class="villeCinema">${feature.properties.commune}</p>
          </div>
        </div>
        <p class="proprietePopup"><i class="bi bi-geo-fill"></i> ${feature.properties.adresse}</p>
        <p class="proprietePopup"><i class="bi bi-tv-fill"></i> ${feature.properties.ecrans} salle pour ${feature.properties.fauteuils} fauteuils</p>
        <p class="proprietePopup"><i class="bi bi-ticket-perforated-fill"></i> ${feature.properties.entrees} entrées (+${feature.properties.evolution_entrees} % depuis 2015)</p>
        <p class="proprietePopup"><i class="bi bi-film"></i> ${feature.properties.nombre_de_films_programmes} films projetés</p>
        <p class="proprietePopup"><i class="bi bi-tv-fill"></i> ${feature.properties.seances} séances en 2021</p>
        <p class="proprietePopup"><i class="bi bi-pie-chart"></i> Part des entrées : </p>
        <canvas id="${canvasId}"></canvas>
        <p class="proprietePopup"><i class="bi bi-building-fill"></i> Séances programmées par ${feature.properties.programmateur}</p>
        <p class="proprietePopup"><i class="bi bi-palette"></i> Art et essai : ${feature.properties.ae} (${feature.properties.films_art_et_essai} films)</p>
      </article>`;
      layer.bindPopup(popupContent);
      layer.on('popupopen', function () {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            datasets: [{
              label: 'Part de marché',
              data: [
                feature.properties.pdm_en_entrees_des_films_francais,
                feature.properties.pdm_en_entrees_des_films_americains,
                feature.properties.pdm_en_entrees_des_films_europeens,
                feature.properties.pdm_en_entrees_des_autres_films
              ],
              backgroundColor: ['#C63D31', '#C63D31', '#C63D31', '#C63D31'],
              borderColor: '#25303B',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: false, text: 'Répartition des entrées par origine des films' }
            }
          },
          plugins: [imagePlugin]
        });
      });
    }
  }).eachLayer(function (layer) {
    markers.addLayer(layer); // Ajouter chaque marqueur au cluster
  });

  map.addLayer(markers); // Ajouter le groupe de clusters à la carte
}

let map = initMap();
recupererDonnes('data/geo-les_salles_de_cinemas_en_ile-de-france.json')
  .then(data => {
    let geoJSONData = {
      "type": "FeatureCollection",
      "features": convertToGeoJSON(data)
    };
    addDataToMap(map, geoJSONData);
  });
//ça marcha paaaaaaaaaaaaaaaaaaaaaaaaaaas