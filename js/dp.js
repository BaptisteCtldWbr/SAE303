//Cache la comparaison le temps que l'utilisateur sélectionnes les deux départements
let comparaisonDP = document.querySelector("div.grid-dp");
comparaisonDP.classList.add("cache")

let btnValidation = document.querySelector("#selection-dp button");

let selectDP1 = document.querySelector("form#selection-dp #dp1");
let selectDP2 = document.querySelector("form#selection-dp #dp2");

let imgDP1 = document.querySelector("div.dp1.contours img");
let imgDP2 = document.querySelector("div.dp2.contours img");


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
            imgDP2.src = `images/departements/${dp2}.png`;
        }
    }
})