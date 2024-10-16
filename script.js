async function afficherFilms() {
    const reponse = await fetch('https://github.com/BaptisteCtldWbr/SAE303/blob/main/geo-les_salles_de_cinemas_en_ile-de-france.json');
    const films = await reponse.json();
    console.log(films[nom]);
  }

afficherFilms();