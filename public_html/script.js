// Netflop version XMLHttpRequest

function chargerNetflopXml() {
    // Créer un nouveal objet XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Configurer une requête
    // Utiliser la méthode 'GET' = pour récuperer des données
    // Le nom du fichier à charger
    // - true = requête asynchrone (ne bloque pas le navigateur et l'exécution du code)
    xhr.open("GET","data/netflop.xml",true);

    // Définir le gestionnaire d'évenement pour le chargement
    xhr.onload = function (){
        // Vérifie si la requête réussi
        // status 200 = OK (succès)
        if (xhr.status === 200) {

            // Parser le XML avec DOMPARSER
            // On créé une instance de DOMParser
            let parser = new DOMParser();
            // console.log(parser);

            // Parse le texte XML reçu et convertit en document XML
            // xhr.responseText = le contenu du fichier XML en texte
            // "text/xml" = type MIME pour indiquer que c'est du XML
            let xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
            // console.log(xmlDoc);

            afficherFilmsXML(xmlDoc);

        }
        else {
            console.error("Erreur lors du chargement du fichier XML");
            console.error("Status  :",xhr.status);
            console.error("Message :",xhr.statusText);
        }
    }

    // Gérer les erreurs réseau
    xhr.onerror = function (){
        console.log("Erreur réseau lors du chargement du fichier XML.");
        alert("Impossible de charger les données. Vérifiez votre connexion !");
    }

    // Envoi de la requête
    xhr.send();

}

/**
 * Fonction pour afficher les films depuis le document XML
 * @param {Document} xmlDoc Document XML parsé par DOMParser
 */
function afficherFilmsXML(xmlDoc) {
    // Récupérer le conteneur HTML où afficher les films
    let container = document.getElementById("section-films");

    // Créer un titre pour la section
    let titre = document.createElement("h2");
    titre.textContent = "Films";
    container.appendChild(titre);

    // Recupéérer TOUS les éléments <film> du XML
    // getElementsByTagName() retourne une collection
    let films = xmlDoc.getElementsByTagName("film");
    // console.log(films);

    // Parcourir tous les films (attention fils est un HTMLCollection, du coup pas un vrai tableau)
    for (let i = 0; i < films.length; i++) {
        let filmCard = creerCarteXML(films[i]);
        container.appendChild(filmCard);
    }

}

/**
 * Fonction générique pour créer une carte d'affichage à partir d'un élément XML
 * @param {element} item  - element XML (film, serie, etc)
 * @returns {HTMLElement} - element div representant la carte
 */
function creerCarteXML(item) {
    // Créer le conteneur de la carte
    // Créer une div pour la carte
    let card = document.createElement("div");
    card.className = "card";

    // Extraire du XML
    console.log("---");

    // Récuperer le nom depuis la balise <nom>
    let nom = item.getElementsByTagName("nom")[0].textContent;
    console.log(nom);

    // Récuperer le genre depuis la balise <genre>
    let genre = item.getElementsByTagName("genre")[0].textContent;
    console.log(genre);

    // Récuperer le realisateur depuis la balise <realisateur>
    let realisateur = item.getElementsByTagName("realisateur")[0].textContent;
    console.log(realisateur);

    // Récuperer la dateSortie depuis la balise <dateSortie>
    let dateSortie = item.getElementsByTagName("dateSortie")[0].textContent;
    console.log(dateSortie);

    // Récuperer le resumer depuis la balise <resumer>
    // trim() : supprimer les espaces au début et à la fin
    let resumer = item.getElementsByTagName("resumer")[0].textContent.trim();
    // Après ça c'est mieux :
    resumer = resumer.replace(/ {2,}|\n/g," ");
    console.log(resumer);

    // Récuperer l'url depuis la balise <url>
    let url = item.getElementsByTagName("url")[0].textContent;
    console.log(url);

    // Créer un élément img pour afficher l'image
    let img = document.createElement("img");
    // Définir la source de l'image
    img.src = url;
    img.alt = nom;
    img.className = "card-image";

    // Créer le conteneur pour les informations
    // Créer une div pour contenir toutes les infos textuelles
    let infoDiv = document.createElement("div");
    infoDiv.className = "card-info";

    // Créer le titre
    // Créer un élément H3 pour le titre
    let titreElement = document.createElement("h3");
    titreElement.textContent = nom;

    // Créer le titre
    // Créer un paragraphe pour le titre
    let genreElement = document.createElement("p");
    // innerHTML permet d'inserer du HTML
    genreElement.innerHTML = "<strong>Genre :</strong> " + genre;

    // Créer l'élément réalisateur
    // Créer un paragraphe pour le réalisateur
    let realisateurElement = document.createElement("p");
    realisateurElement.innerHTML = "<strong>Réalisateur :</strong> " + realisateur;

    // Créer l'élément date de sortie
    // Créer un paragraphe pour la date de sortie
    let dateElement = document.createElement("p");
    dateElement.innerHTML = "<strong>Date de sortie :</strong> " + dateSortie;

    // Créer le conteneur resumer
    // Créer une div pour le contenir le résumé et le bouton
    let resumeContainer = document.createElement("div");
    resumeContainer.className = "resume-container";

    // Créer l'élément résumé
    // Créer le paragraphe pour le résumé
    let resumeElement = document.createElement("p");
    resumeElement.className = "resume"
    resumeElement.innerHTML = "<strong>Résumé :</strong> " + resumer;

    // Ajouter le résumé au conteneur
    resumeContainer.appendChild(resumeElement);

    // Vérifier si le résumé dépasse 4 lignes
    // On va utiliser le setTimeout pour laisser le DOM se mettre à jour
    // Permet aussi de mesurer la hauteur réelle

    // Assembler tous les éléments
    // Ajouter tous les éléments au conteneur d'information
    infoDiv.appendChild(titreElement);
    infoDiv.appendChild(genreElement);
    infoDiv.appendChild(realisateurElement);
    infoDiv.appendChild(dateElement);
    infoDiv.appendChild(resumeContainer);

    // On ajoute l'image et les informations à la carte
    card.appendChild(img);
    card.appendChild(infoDiv);

    // On retourne la carte complète
    return card;
}

/**
 * Charger les données lorsque le DOM est complètement chargé
 * DOMContentLoaded = évenement déclenché lorsque le HTML est prêt
 */
document.addEventListener("DOMContentLoaded",function(){
    console.log("Le DOM est chargé, lancement de netflop avec DOMParser ...");

    // Demander les infos XML
    chargerNetflopXml();
});
