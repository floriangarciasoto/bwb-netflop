const urlParams = new URLSearchParams(window.location.search);
const sectionIndex = urlParams.get('s');
const itemIndex = urlParams.get('i');

let main = document.getElementsByTagName("main")[0];

let sectionItem = document.createElement("section");
    sectionItem.className = "item-description d-flex justify-content-center"
                          + " gradient-" + sections[sectionIndex].color;

    let sectionBox = document.createElement("article");
        sectionBox.className = "p-4 m-5 rounded text-white bg-black d-flex";

        let itemPoster = document.createElement("img");
            itemPoster.src = sections[sectionIndex].items[itemIndex].poster;
            itemPoster.className = "rounded me-4";
        sectionBox.appendChild(itemPoster);

        let itemTexts = document.createElement("div");

            let itemH1 = document.createElement("h1");
                itemH1.className = "h1";
                itemH1.textContent = sections[sectionIndex].items[itemIndex].name;
            itemTexts.appendChild(itemH1);

            let itemDate = document.createElement("date");
                itemDate.className = "d-block my-2";
                itemDate.textContent = sections[sectionIndex].items[itemIndex].date.toLocaleDateString('fr-FR');
            itemTexts.appendChild(itemDate);

            let itemSynopsis = document.createElement("p");
                itemSynopsis.className = "text-justify";
                itemSynopsis.textContent = sections[sectionIndex].items[itemIndex].synopsis;
            itemTexts.appendChild(itemSynopsis);

        sectionBox.appendChild(itemTexts);

    sectionItem.appendChild(sectionBox);

main.appendChild(sectionItem);
