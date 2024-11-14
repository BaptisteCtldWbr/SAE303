// Cache la comparaison le temps que l'utilisateur sélectionne les deux départements
let comparaisonDP = document.querySelector("div.grid-dp");
comparaisonDP.classList.add("cache");

let btnValidation = document.querySelector("#selection-dp button");

let selectDP1 = document.querySelector("form#selection-dp #dp1");
let selectDP2 = document.querySelector("form#selection-dp #dp2");

let imgDP1 = document.querySelector("div.dp1.contours img");
let imgDP2 = document.querySelector("div.dp2.contours img");

let departementData = {};

// Fonction pour charger les données depuis un fichier JSON
async function loadDepartementData() {
    const response = await fetch("data/geo-les_salles_de_cinemas_en_ile-de-france.json");
    const data = await response.json();
    console.log("Données chargées:", data); // Vérifie si les données sont chargées correctement
    return data;
}

// Charger les données et organiser par département
loadDepartementData().then(data => {
    data.forEach(cinema => {
        const dep = cinema.dep;

        if (!departementData[dep]) { //initialise departementData
            departementData[dep] = {
                nbCinema: 0,
                nbEcrans: 0,
                nbFauteuils: 0,
                nbSeances: 0,
                nbEntrees: 0,
                nbFilms: 0,
                nbCinemasAE: 0,
                nbFilmsProgAE: 0,
                pourcentFilmsAE: 0,
                pourcentSeancesAE: 0,
                pourcentEntreesAE: 0,
                moinsDe30K: 0,
                moinsDe100K: 0,
                moinsDe1M: 0,
                plusDe1M: 0
            };
        }

        // Additionner les données pour chaque cinéma
        departementData[dep].nbCinema++;
        departementData[dep].nbEcrans += cinema.ecrans;
        departementData[dep].nbFauteuils += cinema.fauteuils;
        departementData[dep].nbSeances += cinema.seances;
        departementData[dep].nbEntrees += cinema.entrees;
        departementData[dep].nbFilms += cinema.nombre_de_films_programmes;

        if (cinema.entrees < 30000) {
            departementData[dep].moinsDe30K += 1;
        } else if (cinema.entrees >= 30000 && cinema.entrees < 100000) {
            departementData[dep].moinsDe100K += 1;
        } else if (cinema.entrees >= 100000 && cinema.entrees < 1000000) {
            departementData[dep].moinsDe1M += 1;
        } else {
            departementData[dep].plusDe1M += 1;
        }

        if (cinema.ae === "oui") { //vérifie si le cinema est un cinéma art et essai
            departementData[dep].nbCinemasAE++;
            departementData[dep].nbFilmsProgAE += cinema.films_art_et_essai;
            departementData[dep].pourcentFilmsAE += cinema.part_des_seances_de_films_art_et_essai;
            departementData[dep].pourcentEntreesAE += cinema.pdm_en_entrees_des_films_art_et_essai;
        }
    });
});

// Fonction pour mettre à jour les statistiques sur la page
function updateStats(dp, prefix) {
    const data = departementData[dp];
    const ileDeFrancePopulation = {
        "75": 2187526,  // Paris
        "77": 1416138,  // Seine-et-Marne
        "78": 1467020,  // Yvelines
        "91": 1348447,  // Essonne
        "92": 1628757,  // Hauts-de-Seine
        "93": 1673789,  // Seine-Saint-Denis
        "94": 1395611,  // Val-de-Marne
        "95": 1266791   // Val-d'Oise
    };

    if (!data) {
        console.error("Données non disponibles pour le département:", dp); //renvoi une erreur si il n'y a pas de données disponible
        return;
    }

    console.log("Données pour le département", dp, data); // Vérifie les données pour le département
    //prefix est défini plus bas, il sert pour l'intégration des éléments
    document.querySelector(`.${prefix} .nbCinema`).textContent = data.nbCinema;
    document.querySelector(`.${prefix} .nbEcrans`).textContent = data.nbEcrans;
    document.querySelector(`.${prefix} .nbCinemaParHab`).textContent = ((data.nbCinema / ileDeFrancePopulation[dp]) * 100000).toFixed(2); //formule pour le calcul du nombre de cinéma pour 100000 habitants
    document.querySelector(`.${prefix} .nbFauteuils`).textContent = data.nbFauteuils;
    document.querySelector(`.${prefix} .nbSeances`).textContent = data.nbSeances;
    document.querySelector(`.${prefix} .nbEntrees`).textContent = data.nbEntrees;
    document.querySelector(`.${prefix} .nbFilms`).textContent = data.nbFilms;
    document.querySelector(`.${prefix} .nbCinemasAE`).textContent = data.nbCinemasAE;
    document.querySelector(`.${prefix} .nbFilmsProgAE`).textContent = data.nbFilmsProgAE;

    // Pourcentage pour les films AE
    const pourcentFilmsAE = (data.nbFilmsProgAE / data.nbFilms) * 100;
    const pourcentSeancesAE = (data.pourcentFilmsAE / data.nbSeances) * 100;
    const pourcentEntreesAE = (data.pourcentEntreesAE / data.nbEntrees) * 100;

    document.querySelector(`.${prefix} .pourcentFilmsAE`).textContent = `${pourcentFilmsAE.toFixed(2)}%`;
    document.querySelector(`.${prefix} .pourcentSeancesAE`).textContent = `${pourcentSeancesAE.toFixed(2)}%`;
    document.querySelector(`.${prefix} .pourcentEntreesAE`).textContent = `${pourcentEntreesAE.toFixed(2)}%`;

}
function trancheEntrees(dp1, dp2) {//insère la table pour le calcul des tranches de données
    const dpnum1 = departementData[dp1];
    const dpnum2 = departementData[dp2];
    // Mise à jour des tranches d'entrées, mais cette fois séparément pour chaque département
    const tableRow = document.querySelector(`#tranches-entrees tbody`); //récupère le tbody de la table
    if (tableRow) { //vérificaiton de la table existe bien dans le document
        tableRow.innerHTML = `  <!-- Mettre à jour les tranches d'entrées pour ce département -->
            <tr>
                <td>${dpnum1.moinsDe30K}</td>
                <th>&lt; 30 000</th>
                <td>${dpnum2.moinsDe30K}</td>
            </tr>
            <tr>
                <td>${dpnum1.moinsDe100K}</td>
                <th>&lt; 100 000</th>
                <td>${dpnum2.moinsDe100K}</td>
            </tr>
            <tr>
                <td>${dpnum1.moinsDe1M}</td>
                <th>&lt; 1 000 000</th>
                <td>${dpnum2.moinsDe1M}</td>
            </tr>
            <tr>
                <td>${dpnum1.plusDe1M}</td>
                <th>&gt; 1 000 000</th>
                <td>${dpnum2.plusDe1M}</td>
            </tr>
        `;
    } else { //si la table n'existe pas
        console.error(`Élément #tranches-entrees tbody non trouvé !`);
    }
}
btnValidation.addEventListener("click", function(event){                        //Pour récupérer les valeurs du form
    event.preventDefault();                                                         //Empécher le rechargement de la page
    let dp1 = selectDP1.value;
    let dp2 = selectDP2.value;
    if(dp1 == "" || dp2 == ""){                                                     //Vérifie que les deux départements sont bons
        console.log("Un des champs est vide, pb !")
    } else {
        if(dp1 == dp2){                                                             //Et qu'ils ne sont pas les mêmes
            console.log("Ce sont les deux même départements.")
        } else {
            //Affiche la comparaison
            comparaisonDP.classList.remove("cache");

            //Change les images pour les deux départements
            imgDP1.src = `images/departements/${dp1}.png`;
            imgDP1.alt = `${dp1}`;
            imgDP2.alt = `${dp2}`;
            imgDP2.src = `images/departements/${dp2}.png`;
            updateStats(dp1, 'dp1');
            updateStats(dp2, 'dp2');
            trancheEntrees(dp1, dp2);
        }
    }
})