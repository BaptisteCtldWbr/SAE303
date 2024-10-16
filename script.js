async function afficherFilms() {
    const reponse = await fetch('https://raw.githubusercontent.com/BaptisteCtldWbr/SAE303/refs/heads/main/geo-les_salles_de_cinemas_en_ile-de-france.json?token=GHSAT0AAAAAACY5XC2H6ZZCQTUJZG66MPVAZYP34SA');
    const films = await reponse.json();
    console.log(films[nom]);
  }

afficherFilms();