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

            // Parse le texte XML reçu et convertit en document XML
            // xhr.responseText = le contenu du fichier XML en texte
            // "text/xml" = type MIME pour indiquer que c'est du XML
            let xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");

            afficherSections(xmlDoc);

        }
        else {
            console.error("Erreur lors du chargement du fichier XML");
            console.error("Status  :",xhr.status);
            console.error("Message :",xhr.statusText);
        }
    }

    // Gérer les erreurs réseau
    xhr.onerror = function (){
        console.error("Erreur réseau lors du chargement du fichier XML.");
        alert("Impossible de charger les données. Vérifiez votre connexion !");
    }

    // Envoi de la requête
    xhr.send();
}

/**
 * Fonction pour afficher les items depuis le document XML
 * @param {Document} xmlDoc Document XML parsé par DOMParser
 */
function afficherSections(xmlDoc) {
    const sectionsSpecs = [
      {
        title: "Films",
        itemName: "film",
        color: "red"
      },
      {
        title: "Séries",
        itemName: "serie",
        color: "blue"
      },
      {
        title: "Documentaires",
        itemName: "documentaire",
        color: "green"
      },
      {
        title: "Mangas",
        itemName: "manga",
        color: "yellow"
      },
      {
        title: "Animes",
        itemName: "anime",
        color: "orange"
      },
      {
        title: "Shows",
        itemName: "show",
        color: "cyan"
      },
      {
        title: "Concerts",
        itemName: "concert",
        color: "purple"
      }
    ];

    for (let i = 0; i < sectionsSpecs.length; i++) {
        afficherSection(xmlDoc,sectionsSpecs[i],i);
    }
}

/**
 * Fonction pour afficher les sections depuis le document XML
 * @param {Document} xmlDoc Document XML parsé par DOMParser
 */
function afficherSection(xmlDoc,specs) {
    let main = document.getElementsByTagName("main")[0];

        // Récupérer le conteneur HTML où afficher les items
        let section = document.createElement("section");
            section.className = "p-5 pt-2" + " gradient-" + specs.color;

            // Créer un titre pour la section
            let titre = document.createElement("h2");
                titre.className = "text-center m-5";
                titre.textContent = specs.title;
            section.appendChild(titre);

            // Recupérer TOUS les éléments par rapport au nom de l'item dans le XML
            // getElementsByTagName() retourne une collection
            let items = xmlDoc.getElementsByTagName(specs.itemName);

            // Conteneur qui va contenir tous les cards
            let sectionArticles = document.createElement("div");
                sectionArticles.className = "section-articles d-flex justify-content-center flex-wrap gap-4";

                // Parcourir tous les items (attention items est un HTMLCollection, du coup pas un vrai tableau)
                for (let i = 0; i < items.length; i++) {
                    let card = creerCarte(specs.itemName,items[i]);
                    sectionArticles.appendChild(card);
                }

        section.appendChild(sectionArticles);

    main.appendChild(section);
}

/**
 * Fonction générique pour créer une carte d'affichage à partir d'un élément XML
 * @param {element} item  - element XML (film, serie, etc)
 * @returns {HTMLElement} - element a representant la carte
 */
function creerCarte(itemType,item) {
    // Récupération des données du XML
    let nom = item.getElementsByTagName("nom")[0].textContent;
    let dateSortie = item.getElementsByTagName("dateSortie")[0].textContent;
    let url = item.getElementsByTagName("url")[0].textContent;

    // Créer le conteneur de la carte
    let card = document.createElement("article");
        card.className = "card pt-4 ps-4 pe-4 pb-3 rounded text-decoration-none text-white";

        // Vérification si l'ID existe : rend l'élément cliquable si l'ID existe
        const itemID = item.getAttribute("xml:id");
        if (itemID !== "") {

            // On attribut un ID à la card pour que l'évenement onclick puisse s'y référer
            card.id = itemType + "-" + itemID;
            
            card.onclick = function(){
                // Récupération du type d'item avec la décomposition de variables avec le tableau créé
                // grâce au tableau ["item","id"] -> exemple pour l'id "film-1", on split avec "-" : ["film","1"]
                const [itemType, itemID] = this.id.split('-');

                // Redirection vers la page de description avec les paramètres GET
                window.location.href = "description?" + "itemtype=" + itemType + "&itemid=" + itemID;
            };
        }
        
        let articleImg = document.createElement("img");
            articleImg.src = url;
            articleImg.setAttribute("class","card-img rounded");
        card.appendChild(articleImg);
        
        let articleName = document.createElement("h3");
            articleName.setAttribute("class","h3 text-center my-3");
            articleName.textContent = nom;
        card.appendChild(articleName);
        
        let articleDate = document.createElement("date");
            articleDate.setAttribute("date",dateSortie);
            articleDate.setAttribute("class","d-block text-center");
            articleDate.textContent = dateSortie;
        card.appendChild(articleDate);
            
    // On retourne la carte complète
    return card;
}

/**
 * Charger les données lorsque le DOM est complètement chargé
 * DOMContentLoaded = évenement déclenché lorsque le HTML est prêt
 */
document.addEventListener("DOMContentLoaded",function(){
    // Demander les infos XML
    chargerNetflopXml();
});
