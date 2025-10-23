// Netflop version XMLHttpRequest

function chargerNetflopJson() {
    // Créer un nouveal objet XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Configurer une requête
    // Utiliser la méthode 'GET' = pour récuperer des données
    // Le nom du fichier à charger
    // - true = requête asynchrone (ne bloque pas le navigateur et l'exécution du code)
    xhr.open("GET","../data/netflop.json",true);

    // Définir le gestionnaire d'évenement pour le chargement
    xhr.onload = function (){
        // Vérifie si la requête réussi
        // status 200 = OK (succès)
        if (xhr.status === 200) {

            // Parse le texte JSON reçu et convertit en objet JSON
            // xhr.responseText = le contenu du fichier JSON en texte
            let jsonObj = JSON.parse(xhr.responseText);

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
                verifItem(jsonObj,itemType,itemID);
            }

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
 * Vérifie la présence d'un item dans l'objet JSON,
 * si oui, affiche l'élément avec afficherDescription()
 * @param {Object} jsonObj objet JSON issu de netflop.json
 * @param {String} itemType nom des balises à chercher dans le document
 * @param {String} itemID ID de l'objet JSON à chercher
 */
function verifItem(jsonObj,itemType,itemID) {

    let items = jsonObj.netflop[itemType+"s"][itemType];
    if (items.length > 0) {
        let idTrouve = false;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].hasOwn("id") && items[i].id === itemID) {
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
 * @param {Object} jsonItem objet JSON issu du fichier netflop.json représentant notre item
 * @param {String} itemType type d'item (film, serie, documentaire ...)
 */
function afficherDescription(jsonItem,itemType) {

    // Attribution des couleurs pour chaque type d'item
    let itemsAttributes = {
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
        anime: {
            nameType: "Anime",
            color: "orange"
        },
        show: {
            nameType: "Show",
            color: "cyan"
        },
        concert: {
            nameType: "Concert",
            color: "purple"
        }
    };

    // Récupération des informations de l'item
    let backgroundColor = itemsAttributes[itemType].color;
    let nameType = itemsAttributes[itemType].nameType;
    let nom = jsonItem.nom;
    let genre = jsonItem.genre;
    let realisateur = jsonItem.realisateur;
    let dateSortie = jsonItem.dateSortie;
    let resumer = jsonItem.resumer.replace(/ {2,}|\n/g," ");
    let url = jsonItem.url;


    // **** Ajout du HTML au DOM ****

    let main = document.getElementsByTagName("main")[0];

    let sectionItem = document.createElement("section");
        sectionItem.className = "item-description d-flex justify-content-center align-items-start"
                              + " gradient-" + backgroundColor;

        let sectionBox = document.createElement("article");
            sectionBox.className = "p-4 m-5 rounded text-white d-flex bg-dark-grey";

            let itemPoster = document.createElement("img");
                itemPoster.src = "../" + url;
                itemPoster.className = "rounded me-4";
            sectionBox.appendChild(itemPoster);

            let itemTexts = document.createElement("div");

                let itemH1 = document.createElement("h1");
                    itemH1.className = "h1";
                    itemH1.textContent = nom;
                itemTexts.appendChild(itemH1);

                let itemSectionType = document.createElement("p");
                    itemSectionType.className = "my-1";
                    itemSectionType.innerHTML = "<strong>Type :</strong> " + nameType;
                itemTexts.appendChild(itemSectionType);

                let itemRealisateur = document.createElement("p");
                    itemRealisateur.className = "my-1";
                    itemRealisateur.innerHTML = "<strong>Réalisateur :</strong> " + realisateur;
                itemTexts.appendChild(itemRealisateur);

                let itemGenre = document.createElement("p");
                    itemGenre.className = "my-1";
                    itemGenre.innerHTML = "<strong>Genre :</strong> " + genre;
                itemTexts.appendChild(itemGenre);

                let itemDate = document.createElement("date");
                    itemDate.className = "d-block my-2";
                    itemDate.innerHTML = "<strong>Date de sortie :</strong> " + dateSortie;
                itemTexts.appendChild(itemDate);

                let itemSynopsis = document.createElement("p");
                    itemSynopsis.id = "synopsis";
                    itemSynopsis.className = "text-justify overflow-hidden position-relative m-0";
                    itemSynopsis.innerHTML = "<strong>Synopsis :</strong> " + resumer;

                    let itemSynopsisMore = document.createElement("p");
                        itemSynopsisMore.id = "synopsis-more";
                        itemSynopsisMore.className = "position-absolute bottom-0 end-0 bg-dark-grey fw-bold m-0 ps-3 cursor-pointer";
                        itemSynopsisMore.textContent = "... voir plus";
                        itemSynopsisMore.onclick = function() {
                            // On enlève l'attribut style qui contient la hauteur limite
                            let synopsis = document.getElementById("synopsis");
                                synopsis.removeAttribute("style");
                            // On retire le bouton "voir plus"
                            let synopsisMore = document.getElementById("synopsis-more");
                                synopsisMore.style.display = "none";
                        }
                    itemSynopsis.appendChild(itemSynopsisMore);

                itemTexts.appendChild(itemSynopsis);

            sectionBox.appendChild(itemTexts);

        sectionItem.appendChild(sectionBox);

    main.appendChild(sectionItem);

    // Légère attente du chargement de la page pour constater de la hauteur du synopsis
    setTimeout(()=>{
        let synopsis = document.getElementById("synopsis");

        // Si la hauteur du paragraphe synopsis est trop grande
        if (synopsis.offsetHeight > 200) {

            // On lui fixe une hauteur limite en fonction de la taille de chaque ligne,
            // ainsi que le nombre de lignes maximal que l'on veut afficher
            const maxLines = 15;
            const fontSize = window.getComputedStyle(synopsis).fontSize;
            synopsis.style.height = `calc(${maxLines} * ${fontSize})`;

        }
        else {
            // Sinon on peut enlever le bouton "voir plus"
            let synopsisMore = document.getElementById("synopsis-more");
                synopsisMore.style.display = "none";
        }

    },10);

}

/**
 * Charger les données lorsque le DOM est complètement chargé
 * DOMContentLoaded = évenement déclenché lorsque le HTML est prêt
 */
document.addEventListener("DOMContentLoaded",function(){
    // Demander les infos JSON
    chargerNetflopJson();
});
