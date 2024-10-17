async function afficherFilms() {
    const reponse = await fetch('geo-les_salles_de_cinemas_en_ile-de-france.json');
    const films = await reponse.json();
    console.log(films);
  }

afficherFilms(); 
