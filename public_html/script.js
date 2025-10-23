// Netflop version XMLHttpRequest

function chargerNetflopJson() {
    // Créer un nouveal objet XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Configurer une requête
    // Utiliser la méthode 'GET' = pour récuperer des données
    // Le nom du fichier à charger
    // - true = requête asynchrone (ne bloque pas le navigateur et l'exécution du code)
    xhr.open("GET","data/netflop.json",true);

    // Définir le gestionnaire d'évenement pour le chargement
    xhr.onload = function (){
        // Vérifie si la requête réussi
        // status 200 = OK (succès)
        if (xhr.status === 200) {

            // Parse le texte JSON reçu et convertit en objet JSON
            // xhr.responseText = le contenu du fichier JSON en texte
            let jsonObj = JSON.parse(xhr.responseText);

            afficherSections(jsonObj);

        }
        else {
            console.error("Erreur lors du chargement du fichier JSON.");
            console.error("Status  :",xhr.status);
            console.error("Message :",xhr.statusText);
        }
    }

    // Gérer les erreurs réseau
    xhr.onerror = function (){
        console.error("Erreur réseau lors du chargement du fichier JSON.");
        alert("Impossible de charger les données. Vérifiez votre connexion !");
    }

    // Envoi de la requête
    xhr.send();
}

/**
 * Fonction pour afficher les items depuis le objet JSON
 * @param {Object} jsonObj objet JSON parsé par JSON.parse()
 */
function afficherSections(jsonObj) {
    const sectionsSpecs = [
      {
        title: "Films",
        itemContainer: "films",
        itemName: "film",
        color: "red"
      },
      {
        title: "Séries",
        itemContainer: "series",
        itemName: "serie",
        color: "blue"
      },
      {
        title: "Documentaires",
        itemContainer: "documentaires",
        itemName: "documentaire",
        color: "green"
      },
      {
        title: "Mangas",
        itemContainer: "mangas",
        itemName: "manga",
        color: "yellow"
      },
      {
        title: "Animes",
        itemContainer: "animes",
        itemName: "anime",
        color: "orange"
      },
      {
        title: "Shows",
        itemContainer: "shows",
        itemName: "show",
        color: "cyan"
      },
      {
        title: "Concerts",
        itemContainer: "concerts",
        itemName: "concert",
        color: "purple"
      }
    ];

    for (let i = 0; i < sectionsSpecs.length; i++) {
        afficherSection(jsonObj,sectionsSpecs[i],i);
    }
}

/**
 * Fonction pour afficher les sections depuis le objet JSON
 * @param {Object} jsonObj objet JSON parsé par JSON.parse()
 */
function afficherSection(jsonObj,specs) {
    let main = document.getElementsByTagName("main")[0];

        // Récupérer le conteneur HTML où afficher les items
        let section = document.createElement("section");
            section.className = "p-5 pt-2" + " gradient-" + specs.color;

            // Créer un titre pour la section
            let titre = document.createElement("h2");
                titre.className = "text-center m-5";
                titre.textContent = specs.title;
            section.appendChild(titre);

            // Recupérer TOUS les éléments par rapport au nom de l'item dans le JSON
            // jsonObj[specs.itemName] retourne un tableau d'objets*
            let items = jsonObj.netflop[specs.itemContainer][specs.itemName];

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
 * Fonction générique pour créer une carte d'affichage à partir d'un élément JSON
 * @param {Object} item   - objet JSON (un film, une série, etc ...)
 * @returns {HTMLElement} - element a representant la carte
 */
function creerCarte(itemType,item) {
    // Récupération des données du JSON
    let nom = item.nom;
    let genre = item.genre;
    let dateSortie = item.dateSortie.trim();
    let url = item.url;

    // Créer le conteneur de la carte
    let card = document.createElement("article");
        card.className = "card pt-4 ps-4 pe-4 pb-3 rounded text-decoration-none text-white bg-dark-grey";

        // Vérification si l'ID existe : rend l'élément cliquable si l'ID existe
        const itemID = item.id;
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
            articleName.setAttribute("class","h3 text-center my-3 mb-0");
            articleName.textContent = nom;
        card.appendChild(articleName);
        
        let articleInfos = document.createElement("date");
            let dateSortieObj = formatterDateObj(dateSortie);
            articleInfos.setAttribute("date",dateSortieObj.getDate());
            articleInfos.setAttribute("class","d-block text-center");
            articleInfos.textContent = genre + " - " + dateSortieObj.getFullYear();
        card.appendChild(articleInfos);

    // On retourne la carte complète
    return card;
}

/**
 * Retourne une date en français au format de variable Date() manipulable
 * @param {String} dateTexte date sous la forme JJ/MM/AAAA
 * @returns {Date} objet Date()
 */
function formatterDateObj(dateTexte) {
    // Séparation de jour, mois, année
    dateTexte = dateTexte.split("/");
    // Si la date de base n'avait que l'année
    if (dateTexte.length === 1) dateTexte = ["1",...dateTexte];
    // Si la date de base n'avait que l'année et le mois
    if (dateTexte.length === 2) dateTexte = ["1",...dateTexte];
    // Mise en forme de la date sous la forme YYYY-MM-DD
    dateTexte = dateTexte[2].padStart(4,"0") + "-" + dateTexte[1].padStart(2,"0") + "-" + dateTexte[0].padStart(2,"0");
    // On retourne la date sous forme d'objet Date() manipulable
    return new Date(dateTexte);
}

/**
 * Charger les données lorsque le DOM est complètement chargé
 * DOMContentLoaded = évenement déclenché lorsque le HTML est prêt
 */
document.addEventListener("DOMContentLoaded",function(){
    // Demander les infos JSON
    chargerNetflopJson();
});
