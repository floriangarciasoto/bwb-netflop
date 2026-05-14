// ========================================
// ITEMDETAIL-TMDB - Page de détails d'un film/série
// Documentation du code (sans implémentation)
// ========================================

/**
 * Fonction permettant d'obtenir la valeur de la clé d'API "API_KEY" de plusieurs manières
 * @returns {String} - clé API
 */
function obtenirCleAPI() {
    // Si la variable API_KEY_ENV a été définie, c'est que le script .env/tmdb.js a été chargé
    // On demande le type de cette variable avec typeof, ce qui nous permet de vérifier
    // la définition de la variable sans provoquer d'erreur
    // Si le type de variable n'est pas "undefined", c'est qu'elle est déclarée, on peut donc prendre sa valeur
    if (typeof API_KEY_ENV !== "undefined") return API_KEY_ENV;

    // Si le fichier d'environement n'est pas accessible,
    // on essaie alors de récuperer une clé via les paramètres GET
    const parametresGET = new URLSearchParams(window.location.search);
    const API_KEY_GET = parametresGET.get('api_key');
    if (API_KEY_GET !== null) {
        return API_KEY_GET;
    }

    // Sinon on retourne une clé vide
    return '...';
}

// Configuration de l'API TMDB (clé chargée depuis .env/tmdb.js)
const TMDB_API_KEY = obtenirCleAPI();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Fonction pour récupérer les paramètres de l'URL
 * Extrait l'ID et le type (movie/tv) depuis l'URL de la page
 * @returns {Object} - Objet contenant {id, type}
 */
function getURLParams() {
    // Créer un objet URLSearchParams avec la query string de l'URL actuelle
    const GETparams = new URLSearchParams(window.location.search);
    
    // Extraire le paramètre 'id' (ex: "550" pour Fight Club)
    const id = GETparams.get('id');
    
    // Extraire le paramètre 'type' (ex: "movie" ou "tv")
    const type = GETparams.get('type');
    
    // Afficher les paramètres dans la console pour debug
    console.log(`Paramètres : id=${id}, type=${type}`);
    
    // Retourner un objet avec id et type
    return {id:id, type:type};
}

/**
 * Fonction pour charger les détails depuis TMDB avec fetch
 * Fonction asynchrone qui récupère les données d'un film/série depuis l'API TMDB
 */
async function chargerDetailsItemTMDB() {
    // Afficher un message de chargement temporaire dans le body
    let main = document.getElementsByTagName("main")[0];
    let tempMessage = document.createElement("p");
        tempMessage.className = "m-5 p-5 text-center"
        tempMessage.textContent = "Chargement des détails ...";
    main.appendChild(tempMessage);

    // Récupérer les paramètres de l'URL (id et type)
    const params = getURLParams();
    
    // Extraire l'ID et le type depuis l'objet retourné
    let id = params.id;
    let type = params.type;
    
    // Vérifier que l'ID existe
    // Si pas d'ID, afficher un message d'erreur et arrêter
    if (id === null || id === "") {
        alert("Impossible de charger les détails, vous allez être redirigé vers la page d'accueil.");
        window.location.href = "..";
    }

    // Par défaut: 'movie' si le type n'est pas spécifié
    if (type === null || type === "") {
        type = "movie";
    }

    try {
        // ============================================
        // FETCH : ÉTAPE 1 - Lancer la requête HTTP
        // ============================================
        // fetch(url) envoie une requête HTTP GET vers l'URL
        // C'est ASYNCHRONE : le code continue pendant que la requête se fait
        // await = ATTENDRE que la requête soit terminée avant de continuer
        // Résultat : un objet Response qui contient les infos de la réponse HTTP
        const URL = TMDB_BASE_URL + `${type}/` + id + `?language=fr-FR` + `&api_key=${TMDB_API_KEY}`;
        let response = await fetch(URL);
        
        // ============================================
        // FETCH : ÉTAPE 2 - Vérifier le statut HTTP
        // ============================================
        // response.ok = true si le code HTTP est 200-299 (succès)
        // response.ok = false si erreur 404, 500, etc.
        // Si erreur, on lance une exception avec throw
        if (!response.ok) {
            console.error("Impossible de récuperer les détails.");
            throw new Error(`HTTP ${response.status}`);
        }

        // ============================================
        // FETCH : ÉTAPE 3 - Extraire les données JSON
        // ============================================
        // response.json() lit le corps de la réponse et le convertit en objet JavaScript
        // C'est aussi ASYNCHRONE, donc on utilise await
        // Résultat : un objet JavaScript avec les données de TMDB
        let data = await response.json();
        let details = data;
        
        // ============================================
        // FETCH : Deuxième appel API pour les crédits
        // ============================================
        // Même processus : construire URL, fetch, vérifier, parser JSON
        // Récupère les informations sur le casting (acteurs, réalisateur)
        const creditsURL = TMDB_BASE_URL + `${type}/` + `${id}/` + `credits` + `?language=fr-FR` + `&api_key=${TMDB_API_KEY}`;
        response = await fetch(creditsURL);
        if (!response.ok) {
            console.error("Impossible de récuperer les credits.");
            throw new Error(`HTTP ${response.status}`);
        }
        data = await response.json();
        let credits = data;
        
        // Afficher les détails en appelant la fonction d'affichage
        afficherDetailsItemTMDB(details, credits, type, id);
    }
    catch(error) {
        // ============================================
        // GESTION DES ERREURS
        // ============================================
        // Le bloc try/catch capture toutes les erreurs :
        // - Erreurs réseau (pas d'internet)
        // - Erreurs HTTP (404, 500, etc.)
        // - Erreurs de parsing JSON
        // - Erreurs avec throw new Error()
        console.error("Erreur lors du chargement des détails.");
        console.error(error);
    }
}

/**
 * Fonction pour afficher les détails de l'item
 * Génère dynamiquement tout le HTML de la page avec createElement
 * @param {Object} item - Données du film/série depuis TMDB
 * @param {Object} credits - Données du casting (acteurs, réalisateur)
 * @param {String} itemType - Type: 'movie' ou 'tv'
 * @param {String} itemId - ID TMDB du film/série
 */
function afficherDetailsItemTMDB(item, credits, itemType, itemId) {
    console.log("afficherDetailsItemTMDB", item, credits, itemType, itemId);
    // === EXTRACTION DES DONNÉES ===
    // Extraire le titre (title pour films, name pour séries)
    let title = item.title;
    if (title === undefined) title = item.name;
    
    // Extraire les chemins des images (poster et backdrop)
    let poster = item.poster_path;
    let backdrop = item.backdrop_path;
    
    // Extraire le résumé (overview)
    let resume = item.overview;
    
    // Extraire la date de sortie (release_date pour films, first_air_date pour séries)
    let releaseDate = item.release_date;
    if (releaseDate === undefined) releaseDate = item.first_air_date;
    
    // Extraire et formater la note moyenne (vote_average) à 1 décimale
    let note = item.vote_average;
    if (note === 0) note = "N/A";
    else note = note.toFixed(1);
    
    // Extraire le nombre de votes (vote_count)
    let nbVotes = item.vote_count;
    if (nbVotes === 0) nbVotes = "N/A";
    
    // Extraire la popularité et l'arrondir
    let popularity = item.popularity;
    if (popularity === 0) popularity = "N/A";
    else popularity = popularity.toFixed(0);
    
    // Construire les URLs complètes des images
    // Utiliser une image de fallback si pas d'image disponible
    const fallbackImgURL = "../images/film-poster-placeholder.jpg";
    if (poster !== "") poster = TMDB_IMAGE_BASE_URL + poster;
    else poster = fallbackImgURL;
    if (backdrop !== "") backdrop = TMDB_IMAGE_BASE_URL + backdrop;
    else backdrop = fallbackImgURL;
    
    // Extraire et joindre les genres en chaîne de caractères
    let genres = item.genres.map(genre => genre.name).join(", ");
    if (genres === "") genres = "N/A";
    
    // Chercher le réalisateur dans les crédits (job === 'Director')
    // Ou le créateur dans item.created_by pour les séries
    let director;
    if (itemType === "movie") {
        let directorInCrew = credits.crew.filter(member => member.job === "Director");
        if (directorInCrew.length > 0) director = directorInCrew[0].name;
        else director = "N/A";
    }
    else {
        let directorInCreatedBy = item.created_by;
        if (directorInCreatedBy.length > 0) director = directorInCreatedBy[0].name;
        else director = "N/A";
    }
    
    // Extraire les 5 premiers acteurs principaux depuis credits.cast
    let actors = credits.cast.slice(0,5).map(actor => actor.name).join(", ");
    
    // Calculer budget et revenus en millions de dollars (seulement pour films)
    let budget = 0;
    let revenue = 0;
    if (itemType === "movie") {
        budget = item.budget > 0 ? (item.budget / 1000000).toFixed(1) + " M" : "N/A";
        revenue = item.revenue > 0 ? (item.revenue / 1000000).toFixed(1) + " M" : "N/A";
    }
    
    // Extraire la durée (runtime pour films, episode_run_time pour séries)
    let duration = item.runtime;
    if (duration === undefined) duration = item.episode_runtime;
    if (duration === 0) duration = "N/A";
    else {
        let hours = Math.trunc(duration / 60);
        duration = hours + "h" + (duration - hours * 60);
    }
    
    // Choisir l'emoji selon le type (🎬 pour films, 📺 pour séries)
    let badge = itemType === "movie" ? "🎬" : "📺";

    // Apparemment ya le nombre d'épisodes et de saisons aussi
    let episodes;
    let seasons;
    if (itemType === "tv") {
        episodes = item.number_of_episodes;
        seasons = item.number_of_seasons;
    }

    // Ah et la langue aussi
    let language = item.original_language;

    // Et le statut aussi
    let status = item.status;
    
    // === CONSTRUCTION DU DOM ===
    // Vider complètement le body pour repartir de zéro
    let main = document.getElementsByTagName("main")[0];
        main.innerHTML = "";
    
    // === CRÉER LE CONTAINER PRINCIPAL ===
    // Créer un div qui contiendra toute la page
    let section = document.createElement("section");
    
    // === CRÉER L'EN-TÊTE ===
    // Créer un header avec image de fond (backdrop)
    // Appliquer un gradient pour améliorer la lisibilité du texte
    let itemHeader = document.createElement("div");
        itemHeader.style.background = "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%), "
                                    + "url(" + backdrop + ") center / cover no-repeat";
    
    // Créer un bouton "Retour" en haut à gauche
    // onclick = appeler la fonction retourAccueil()
    let returnButton = document.createElement("button");
        returnButton.textContent = "Retour";
        returnButton.onclick = () => retourAccueil();
        returnButton.style.float = "left";
    
    // Créer le contenu de l'en-tête (titre + métadonnées)
    
    // Créer le titre avec emoji
    let h1 = document.createElement("h1");
        h1.textContent = badge + " " + title;
    
    // Créer le conteneur des métadonnées (note, année, genre, durée)
    let metaDv = document.createElement("div");
    
    // Créer la note avec couleur selon la valeur (getNoteColor)
    let noteDv = document.createElement("div");
    if (note > 0) {
        noteDv.textContent = "⭐ " + note;
        noteDv.className = "card-note rounded m-0 card-note-" + getNoteColor(note);
    }
    else {
        noteDv.textContent = "⭐ N/A";
        noteDv.className = "card-note rounded m-0";
    }
    metaDv.appendChild(noteDv);
    
    // Extraire l'année de la date de sortie
    let releaseDateObj = new Date(releaseDate);
    let releaseYear = releaseDateObj.getFullYear();
    let dateDv = document.createElement("div");
        dateDv.textContent = releaseYear;
    metaDv.appendChild(dateDv);
    
    // Afficher les genres
    let genresDv = document.createElement("div");
        genresDv.textContent = genres;
    metaDv.appendChild(genresDv);
    
    // Afficher la durée
    let durationDv = document.createElement("div");
        durationDv.textContent = duration;
    metaDv.appendChild(durationDv);
    
    // Assembler l'en-tête et l'ajouter au container
    itemHeader.appendChild(returnButton);
    itemHeader.appendChild(h1);
    itemHeader.appendChild(metaDv);
    section.appendChild(itemHeader);
    
    // === CRÉER LE CORPS ===
    // Créer un div pour le contenu principal
    let mainContent = document.createElement("article");
    
    // === SECTION POSTER (gauche) ===
    // Créer la section pour l'affiche du film
    let posterDv = document.createElement("div");
    
    // Créer l'élément img avec le poster
    let posterImg = document.createElement("img");
        posterImg.src = poster;
        posterImg.alt = "Affiche pour " + title;
        posterImg.title = title;
    
    // Créer le conteneur des boutons d'action
    let posterCTAs = document.createElement("div");
    
    // Bouton "Bande-annonce" → appelle rechercherBandeAnnonce()
    let posterButtonTrailer = document.createElement("button");
        posterButtonTrailer.textContent = "Bande-annonce";
        posterButtonTrailer.onclick = () => rechercherBandeAnnonce(itemId, itemType);
    
    // Bouton "J'aime" (placeholder, pas d'action pour l'instant)
    let posterButtonLike = document.createElement("button");
        posterButtonLike.textContent = "J'aime";
    
    // Bouton "Voir sur TMDB" → ouvre le site TMDB dans nouvel onglet
    let posterButtonWatchTMDB = document.createElement("button");
        posterButtonWatchTMDB.textContent = "Voir sur TMDB";
        posterButtonWatchTMDB.onclick = () => window.open(`https://www.themoviedb.org/${itemType}/${itemId}`, "_blank").focus();
    
    // Assembler la section poster
    posterCTAs.appendChild(posterButtonTrailer);
    posterCTAs.appendChild(posterButtonLike);
    posterCTAs.appendChild(posterButtonWatchTMDB);
    posterDv.appendChild(posterImg);
    posterDv.appendChild(posterCTAs);
    
    // === SECTION INFORMATIONS (droite) ===
    // Créer la section pour toutes les informations textuelles
    let infosDv = document.createElement("div");
    
    // --- Sous-section Synopsis ---
    // Créer un conteneur pour le synopsis
    // Créer un h2 avec titre "📝 Synopsis"
    // Créer un paragraphe avec le résumé (overview)
    let synopsisDv = document.createElement("div");
        let synopsisDvTitle = document.createElement("h2");
            synopsisDvTitle.textContent = "📝 Synopsis";
        synopsisDv.appendChild(synopsisDvTitle);
        let synopsisDvP = document.createElement("p");
            synopsisDvP.textContent = resume;
        synopsisDv.appendChild(synopsisDvP);
    infosDv.appendChild(synopsisDv);
    
    // --- Sous-section Casting ---
    // Créer un conteneur pour le casting
    // Créer un h2 avec titre "🎭 Casting"
    // Créer un paragraphe avec réalisateur et acteurs
    let castingDv = document.createElement("div");
        let castingDvTitle = document.createElement("h2");
            castingDvTitle.textContent = "🎭 Casting";
        castingDv.appendChild(castingDvTitle);
        let castingDvP = document.createElement("p");
            castingDvP.innerHTML = "<strong>Réalisateur :</strong> " + director;
            castingDvP.innerHTML += "<br><strong>Acteurs :</strong> " + actors;
        castingDv.appendChild(castingDvP);
    infosDv.appendChild(castingDv);
    
    // --- Sous-section Informations détaillées ---
    // Créer un conteneur pour les infos techniques
    // Créer un h2 avec titre "ℹ️ Informations"
    // Créer une grille d'informations
    let infos = [];
    let technicalDv = document.createElement("div");
        let technicalDvTitle = document.createElement("h2");
            technicalDvTitle.textContent = "ℹ️ Informations";
        technicalDv.appendChild(technicalDvTitle);
        let technicalDvGrid = document.createElement("div");

    // Si type === 'movie', afficher budget/revenus
    // Si type === 'tv', afficher nombre de saisons/épisodes
    if (itemType === "movie") {
        infos = infos.concat([
            {label: "Budget :", value: budget},
            {label: "Revenus :", value: revenue}
        ]);
    }
    else {
        infos = infos.concat([
            {label: "Nombre d'épisodes :", value: episodes},
            {label: "Nombre de saisons :", value: seasons}
        ]);
    }
    
    // Afficher genres, date, durée, langue, statut
    infos = infos.concat([
        {label: "Genres :", value: genres},
        {label: "Année de sortie :", value: releaseYear},
        {label: "Durée :", value: duration},
        {label: "Langue :", value: language},
        {label: "Statut :", value: status}
    ]);

    // Utiliser creerInfoItem() pour chaque information
    infos.forEach(info => technicalDvGrid.appendChild(creerInfoItem(info.label,info.value)));
    
    technicalDv.appendChild(technicalDvGrid);
    infosDv.appendChild(technicalDv);
    
    // --- Sous-section Statistiques TMDB ---
    // Créer un conteneur pour les statistiques
    // Créer un h2 avec titre "📊 Statistiques TMDB"
    // Créer un conteneur flex pour les stats
    let statsDv = document.createElement("div");
        let statsDvTitle = document.createElement("h2");
            statsDvTitle.textContent = "📊 Statistiques TMDB";
        statsDv.appendChild(statsDvTitle);
        let statsDvGrid = document.createElement("div");
    
    // Afficher note moyenne, nombre de votes, popularité
    // Utiliser creerStatItem() pour chaque statistique
    [
        {label: "Note moyenne", value: note},
        {label: "Nombre de votes", value: nbVotes},
        {label: "Popularité", value: popularity}
    ].forEach(stat => statsDvGrid.appendChild(creerStatItem(stat.value,stat.label)));

    statsDv.appendChild(statsDvGrid);
    infosDv.appendChild(statsDv);

    // === ASSEMBLER TOUS LES ÉLÉMENTS ===
    // Ajouter la section poster au body
    // Ajouter la section informations au body
    // Ajouter le body au container
    // Ajouter le container au document.body
    mainContent.appendChild(posterDv);
    mainContent.appendChild(infosDv);
    section.appendChild(mainContent);
    main.appendChild(section);
}

/**
 * Fonction pour rechercher la bande-annonce sur YouTube
 * Appelle l'API TMDB pour obtenir les vidéos associées au film/série
 * @param {String} itemId - ID TMDB du film/série
 * @param {String} itemType - Type: 'movie' ou 'tv'
 */
async function rechercherBandeAnnonce(itemId, itemType) {
    // Construire l'endpoint selon le type (movie ou tv)
    
    try {
        // Construire l'URL pour récupérer les vidéos
        // Endpoint: /{type}/{id}/videos
        const URL = TMDB_BASE_URL + `${itemType}/`+ `${itemId}/` + `videos` + `?api_key=${TMDB_API_KEY}`;
        
        // Faire la requête fetch
        response = await fetch(URL);
        if (!response.ok) {
            console.error("Impossible de récuperer les vidéos.");
            throw new Error(`HTTP ${response.status}`);
        }
    
        // Parser la réponse JSON
        data = await response.json();
        console.log("rechercherBandeAnnonce:",data);
    
        // Vérifier si des résultats existent
        let videoFound = false;
        if (data.results.length > 0) {
            // Chercher une vidéo avec type === 'Trailer' et site === 'YouTube'
            let videos = data.results.filter(video => video.type === "Trailer" && video.site === "YouTube");
    
            // Si trouvée, ouvrir YouTube dans un nouvel onglet
            if (videos.length > 0) {
                // Une vidéo a été trouvée
                videoFound = true;

                // On prend la première
                let video = videos[0];

                // Puis on ouvre un nouvel onglet vers YouTube
                // URL: https://www.youtube.com/watch?v={video.key}
                window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank").focus();
            }
        }
        if (!videoFound) {
            // Sinon, afficher une alerte "Aucune bande-annonce disponible"
            alert("Aucune bande-annonce disponible.");
        }
    } catch (error) {
        // En cas d'erreur, afficher dans console et alerte
        console.error("Erreur lors du chargement de la bande annonce.");
        console.error(error);        
        alert("Erreur lors du chargement de la bande annonce.");
    }
}

/**
 * Fonction helper pour créer un item d'information
 * Génère un div avec label et valeur pour la grille d'infos
 * @param {String} label - Label de l'information (ex: "🎬 Réalisateur:")
 * @param {String} value - Valeur de l'information (ex: "David Fincher")
 * @returns {HTMLElement} - Élément div contenant label et valeur
 */
function creerInfoItem(label, value) {
    // Créer un div conteneur avec classe 'info-item'
    let container = document.createElement("div");
        container.className = "info-item";
    
    // Créer un span pour le label avec classe 'info-label'
    // Définir le texte du label
    let spanLabel = document.createElement("span");
        spanLabel.className = "info-label";
        spanLabel.textContent = label;
    
    // Créer un span pour la valeur avec classe 'info-value'
    // Définir le texte de la valeur
    let spanValue = document.createElement("span");
        spanValue.className = "info-value";
        spanValue.textContent = value;
    
    // Ajouter label et valeur au conteneur
    container.appendChild(spanLabel);
    container.appendChild(spanValue);
    
    // Retourner le conteneur
    return container;
}

/**
 * Fonction helper pour créer un item de statistique
 * Génère un div pour afficher une stat (note, votes, popularité)
 * @param {String} value - Valeur de la statistique (ex: "8.4/10")
 * @param {String} label - Label de la statistique (ex: "Note moyenne")
 * @returns {HTMLElement} - Élément div contenant valeur et label
 */
function creerStatItem(value, label) {
    // Créer un div conteneur avec classe 'stat-item'
    let container = document.createElement("div");
        container.className = "stat-item";
    
    // Créer un div pour la valeur avec classe 'stat-value'
    // Définir le texte de la valeur (gros chiffre)
    let divValue = document.createElement("div");
        divValue.className = "stat-value";
        divValue.textContent = value;
    
    // Créer un div pour le label avec classe 'stat-label'
    // Définir le texte du label (description)
    let divLabel = document.createElement("div");
        divLabel.className = "stat-label";
        divLabel.textContent = label;
    
    // Ajouter valeur et label au conteneur
    container.appendChild(divValue);
    container.appendChild(divLabel);
    
    // Retourner le conteneur
    return container;
}

/**
 * Fonction pour obtenir la couleur selon la note
 * Retourne une classe CSS selon la valeur de la note
 * @param {Number} note - Note entre 0 et 10
 * @returns {String} - Partie de classe CSS
 */
function getNoteColor(note) {
    // Si note >= 7, retourner vert - Bonne note
    if (note >= 7) return "green";
    
    // Si note >= 5, retourner orange - Note moyenne
    if (note >= 5) return "orange";
    
    // Sinon, retourner rouge - Mauvaise note
    return "red";
}

/**
 * Fonction pour retourner à l'accueil
 * Utilise l'historique du navigateur pour revenir à la page précédente
 */
function retourAccueil() {
    // Appeler window.history.back() pour retourner à la page précédente
    window.history.back();
}

// ========================================
// INITIALISATION
// ========================================

/**
 * Événement déclenché quand le DOM est complètement chargé
 * Lance le chargement des détails du film/série
 */
document.addEventListener('DOMContentLoaded', function() {
    // Appeler chargerDetailsItemTMDB() pour démarrer le chargement
    chargerDetailsItemTMDB();
});
