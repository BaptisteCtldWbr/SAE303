  function initMap() {
    let map = L.map('map').setView([48.8566, 2.3522], 12); // Paris
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    return map;
  }
async function recupererDonnes(url) {
    return fetch(url)
      .then(response => response.json()) // Convertir en JSON
      .catch(error => {
        console.error('Erreur lors du chargement du fichier JSON:', error);
      });
  }

  // Fonction pour convertir les données JSON en GeoJSON
  function convertToGeoJSON(data) {
    return data.map(function(cinema) {
      let coords = cinema.geo.split(',').map(Number); // Séparer les coordonnées lat, long

      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [coords[1], coords[0]] // [longitude, latitude]
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
    L.geoJSON(geoJSONData, {
      onEachFeature: function (feature, layer) {
        let popupContent = 
                          "<div class=\"popup\"> <p class=\"nomCinema\">" + feature.properties.nom + "</p><br>" +
                           "<span class=\"proprietePopup\">Adresse : </span>" + feature.properties.adresse + "<br>" +
                           "<span class=\"proprietePopup\">Commune : </span>" + feature.properties.commune + "<br>" +
                           "<span class=\"proprietePopup\">Nombre d'écrans : </span>" + feature.properties.ecrans + "<br>" +
                           "<span class=\"proprietePopup\">Nombre de fauteuils : </span>" + feature.properties.fauteuils + "<br>" +
                           "<span class=\"proprietePopup\">Propriétaire : </span>" + feature.properties.proprietaire + "<br>" +
                           "<span class=\"proprietePopup\">Nombre d'entrées en 2016 : </span>" + feature.properties.entrees + "<br>" +
                           "<span class=\"proprietePopup\">Evolution des entrées depuis 2015 : </span>" + feature.properties.evolution_entrees + "% </div>";
        layer.bindPopup(popupContent);
      }
    }).addTo(map);
  }


  // Exécution du script en style procédural
  let map = initMap(); // Étape 1 : Initialiser la carte
  recupererDonnes('geo-les_salles_de_cinemas_en_ile-de-france.json') // Étape 2 : Charger les données
    .then(data => {
      let geoJSONData = {
        "type": "FeatureCollection",
        "features": convertToGeoJSON(data) // Étape 3 : Conversion en GeoJSON
      };
      addDataToMap(map, geoJSONData); // Étape 4 : Ajouter les données sur la carte
    });
