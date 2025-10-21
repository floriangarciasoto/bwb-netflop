/**
 * Fichier JS simulant une base de données
 */

const sections = [
    {
        name: "Films",
        color: "red",
        items: [
            {
                name: "Fast & Curieux",
                date: new Date("2021-04-02"),
                poster: "https://picsum.photos/id/237/400/600",
                synopsis: "Des livreurs de pizzas découvrent qu’ils peuvent sauver le monde… à condition d’arriver avant la fermeture."
            },
            {
                name: "Jurassic Parc de Stationnement",
                date: new Date("2018-06-11"),
                poster: "https://picsum.photos/id/1025/400/600",
                synopsis: "Quand des dinosaures clonés envahissent un parking de supermarché, les clients n’ont qu’une issue : le rayon surgelés."
            },
            {
                name: "Titanic 2 : La Flotte des Glaces",
                date: new Date("2023-01-15"),
                poster: "https://picsum.photos/id/1015/400/600",
                synopsis: "Le Titanic a coulé, mais son influence reste à flot. Un couple tente de revivre la croisière… en pédalo."
            },
            {
                name: "Le Seigneur des Agrafes",
                date: new Date("2022-09-28"),
                poster: "https://picsum.photos/id/1020/400/600",
                synopsis: "Dans un open-space maudit, un employé timide hérite d’une agrafeuse dotée de pouvoirs anciens."
            },
            {
                name: "Mission Improbable",
                date: new Date("2024-06-18"),
                poster: "https://picsum.photos/id/1084/400/600",
                synopsis: "Un espion maladroit doit sauver le monde, mais oublie son mot de passe à chaque mission."
            }
        ]
    },
    {
        name: "Séries",
        color: "green",
        items: [
            {
                name: "Stranger Bings",
                date: new Date("2020-10-10"),
                poster: "https://picsum.photos/id/1003/400/600",
                synopsis: "Des ados découvrent un portail vers un monde parallèle… dans la réserve d’un hypermarché."
            },
            {
                name: "La Casa del Crêpe",
                date: new Date("2021-02-14"),
                poster: "https://picsum.photos/id/1011/400/600",
                synopsis: "Une bande de pâtissiers masqués prépare le plus grand casse sucré de l’histoire de la Bretagne."
            },
            {
                name: "Breaking Chat",
                date: new Date("2023-06-03"),
                poster: "https://picsum.photos/id/1012/400/600",
                synopsis: "Un prof de code ruiné crée un chatbot illégal pour survivre. Tout dérape quand le bot devient influenceur."
            },
            {
                name: "Chambre 404",
                date: new Date("2023-12-01"),
                poster: "https://picsum.photos/id/1074/400/600",
                synopsis: "Chaque client de l’hôtel qui séjourne dans la chambre 404 disparaît mystérieusement."
            }
        ]
    },
    {
        name: "Documentaires",
        color: "blue",
        items: [
            {
                name: "Les Secrets du Fromage",
                date: new Date("2019-05-05"),
                poster: "https://picsum.photos/id/1018/400/600",
                synopsis: "Plongée dans le monde impitoyable des fromagers, où les odeurs n’ont pas de pitié."
            },
            {
                name: "Planète Paresse",
                date: new Date("2020-09-14"),
                poster: "https://picsum.photos/id/1024/400/600",
                synopsis: "Découvrez l’animal le plus lent du monde… et les humains qui essaient de lui ressembler."
            },
            {
                name: "La Vérité sur les Micro-ondes",
                date: new Date("2021-07-21"),
                poster: "https://picsum.photos/id/1031/400/600",
                synopsis: "Et si les micro-ondes étaient en fait des portails interdimensionnels ? (Spoiler : non, mais c’est drôle)."
            },
            {
                name: "Dans le Cerveau d’un Pigeon",
                date: new Date("2022-11-08"),
                poster: "https://picsum.photos/id/1040/400/600",
                synopsis: "Une enquête exclusive sur l’intelligence urbaine du pigeon moderne, roi des trottoirs."
            },
            {
                name: "Le Dernier Buffet à Volonté",
                date: new Date("2024-04-19"),
                poster: "https://picsum.photos/id/1050/400/600",
                synopsis: "Chronique d’une époque où tout était à volonté… jusqu’à la dignité."
            }
        ]
    },
    {
        name: "Emissions",
        color: "yellow",
        items: [
            {
                name: "Top Chef Micro-Ondes",
                date: new Date("2024-03-03"),
                poster: "https://picsum.photos/id/1060/400/600",
                synopsis: "Des candidats doivent réaliser un plat gastronomique uniquement avec un micro-ondes et un mug."
            },
            {
                name: "Chasseur d’Apparts Hantés",
                date: new Date("2025-01-12"),
                poster: "https://picsum.photos/id/1070/400/600",
                synopsis: "Des agents immobiliers présentent des logements… où les fantômes refusent la colocation."
            }
        ]
    },
    {
        name: "Mangas",
        color: "orange",
        items: [
            {
                name: "Naruto : Le Stage de 3e",
                date: new Date("2017-09-15"),
                poster: "https://images.pexels.com/photos/1319795/pexels-photo-1319795.jpeg?auto=compress&cs=tinysrgb&w=400",
                synopsis: "Naruto doit accomplir son stage professionnel… dans une boutique de ramen en crise."
            },
            {
                name: "Attack on Burger",
                date: new Date("2019-04-30"),
                poster: "https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg?auto=compress&cs=tinysrgb&w=400",
                synopsis: "Des géants attaquent une ville fortifiée… pour voler les meilleures recettes de burger."
            },
            {
                name: "One Push-Man",
                date: new Date("2020-08-09"),
                poster: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=400",
                synopsis: "Un super-héros devient invincible après une séance de gainage un peu trop intense."
            },
            {
                name: "My Little Academia",
                date: new Date("2022-01-25"),
                poster: "https://images.pexels.com/photos/270968/pexels-photo-270968.jpeg?auto=compress&cs=tinysrgb&w=400",
                synopsis: "Dans un lycée de héros, les élèves apprennent à sauver le monde… mais échouent au bac blanc."
            },
            {
                name: "Dragon Sleep Zzz",
                date: new Date("2023-10-04"),
                poster: "https://picsum.photos/id/1069/400/600",
                synopsis: "Goku tente de battre son record : dormir plus de 10 ans d’affilée sans se transformer."
            }
        ]
    }
];
