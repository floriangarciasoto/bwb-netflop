// Netflop version XMLHttpRequest

function chargerNetflopXml() {
    // Créer un nouveal objet XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Configurer une requête
    // Utiliser la méthode 'GET' = pour récuperer des données
    // Le nom du fichier à charger
    // - true = requête asynchrone (ne bloque pas le navigateur et l'exécution du code)
    xhr.open("GET","../data/netflop.xml",true);

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

            // On récupere la partie de l'URL contenant
            // nos variables GET envoyées par l'utilisateur
            const parametresGET = new URLSearchParams(window.location.search);
            // On récupere la valeur de itemtype depuis les paramètres GET
            const itemType = parametresGET.get('itemtype');
            // On récupere la valeur de itemid depuis les paramètres GET
            const itemID = parametresGET.get('itemid');

            if (itemType === null || itemID === null) {
                alert("Erreur dans les paramètres de la description, vous allez être redirigé vers la page d'accueil.");
                window.location.href = "..";
            }
            else {
                verifItem(xmlDoc,itemType,itemID);
            }

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
 * Vérifie la présence d'un item dans le fichier XML
 * @param {Document} xmlDoc document netflox.xml
 * @param {String} itemtype nom des balises à chercher dans le document
 * @param {String} itemid id xml de la balise à chercher
 */
function verifItem(xmlDoc,itemType,itemID) {

    let items = xmlDoc.getElementsByTagName(itemType);
    if (items.length > 0) {
        let idTrouve = false;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].getAttribute("xml:id") === itemID) {
                idTrouve = true;
                afficherDescription(items[i],itemType);
                break;
            }
        }

        if (!idTrouve) {
            alert("La vidéo de type " + itemType + " n'existe pas, vous allez être redirigé vers la page d'accueil.");
            window.location.href = "..";
        }
    }
    else {
        alert("Le type de vidéo n'existe pas, vous allez être redirigé vers la page d'accueil.");
        window.location.href = "..";
    }
}

/**
 * Ajoute au HTML une description complète d'un item
 * @param {Node} itemid noeud XML de l'item
 */
function afficherDescription(xmlItem,itemType) {

    // Attribution des couleurs pour chaque type d'item
    let sectionAttributes = {
        film: {
            nameType: "Film",
            color: "red"
        },
        serie: {
            nameType: "Série",
            color: "blue"
        },
        documentaire: {
            nameType: "Documentaire",
            color: "green"
        },
        manga: {
            nameType: "Manga",
            color: "yellow"
        },
        animes: {
            nameType: "Anime",
            color: "orange"
        },
        shows: {
            nameType: "Show",
            color: "cyan"
        },
        concerts: {
            nameType: "Concert",
            color: "purple"
        }
    };

    // Récupération des informations de l'item
    let nameType = sectionAttributes[itemType].nameType;
    let nom = xmlItem.getElementsByTagName("nom")[0].textContent;
    let genre = xmlItem.getElementsByTagName("genre")[0].textContent;
    let realisateur = xmlItem.getElementsByTagName("realisateur")[0].textContent;
    let dateSortie = xmlItem.getElementsByTagName("dateSortie")[0].textContent;
    let resumer = xmlItem.getElementsByTagName("resumer")[0].textContent.replace(/ {2,}|\n/g," ");
    let url = xmlItem.getElementsByTagName("url")[0].textContent;
    let backgroundColor = sectionAttributes[itemType].color;


    // **** Ajout du HTML au DOM ****

    let main = document.getElementsByTagName("main")[0];

    let sectionItem = document.createElement("section");
        sectionItem.setAttribute("class","item-description d-flex justify-content-center");
        sectionItem.style.background = "linear-gradient(120deg, " + backgroundColor + ", black)";

        let sectionBox = document.createElement("article");
            sectionBox.setAttribute("class","p-4 m-5 rounded text-white bg-black d-flex");

            let itemPoster = document.createElement("img");
                itemPoster.setAttribute("src","../" + url);
                itemPoster.setAttribute("class","rounded me-4");
            sectionBox.appendChild(itemPoster);

            let itemTexts = document.createElement("div");

                let itemH1 = document.createElement("h1");
                    itemH1.setAttribute("class","h1");
                    itemH1.textContent = nom;
                itemTexts.appendChild(itemH1);

                let itemSectionType = document.createElement("p");
                    itemSectionType.setAttribute("class","my-1");
                    itemSectionType.innerHTML = "<strong>Type :</strong> " + nameType;
                itemTexts.appendChild(itemSectionType);

                let itemRealisateur = document.createElement("p");
                    itemRealisateur.setAttribute("class","my-1");
                    itemRealisateur.innerHTML = "<strong>Réalisateur :</strong> " + realisateur;
                itemTexts.appendChild(itemRealisateur);

                let itemGenre = document.createElement("p");
                    itemGenre.setAttribute("class","my-1");
                    itemGenre.innerHTML = "<strong>Genre :</strong> " + genre;
                itemTexts.appendChild(itemGenre);

                let itemDate = document.createElement("date");
                    itemDate.setAttribute("class","d-block my-2");
                    itemDate.innerHTML = "<strong>Date de sortie :</strong> " + dateSortie;
                itemTexts.appendChild(itemDate);

                let itemSynopsis = document.createElement("p");
                    itemSynopsis.setAttribute("class","text-justify");
                    itemSynopsis.innerHTML = "<strong>Synopsis :</strong> " + resumer;
                itemTexts.appendChild(itemSynopsis);

            sectionBox.appendChild(itemTexts);

        sectionItem.appendChild(sectionBox);

    main.appendChild(sectionItem);

}

/**
 * Charger les données lorsque le DOM est complètement chargé
 * DOMContentLoaded = évenement déclenché lorsque le HTML est prêt
 */
document.addEventListener("DOMContentLoaded",function(){
    // Demander les infos XML
    chargerNetflopXml();
});
