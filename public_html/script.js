let main = document.getElementsByTagName("main")[0];

for (i in sections) {
    let section = document.createElement("section");
        section.className = "p-5 pt-2" + " gradient-" + sections[i].color;

        let sectionTitle = document.createElement("h2");
            sectionTitle.className = "text-center m-5";
            sectionTitle.textContent = sections[i].name;
        section.appendChild(sectionTitle);

        let sectionArticles = document.createElement("div");
            sectionArticles.className = "section-articles d-flex justify-content-center flex-wrap gap-4";

        for (j in sections[i].items) {
            let articleA = document.createElement("a");
                articleA.setAttribute("href","description/?" + "s=" + i + "&i=" + j);
                articleA.className = "d-block pt-4 ps-4 pe-4 pb-3 rounded text-decoration-none text-white bg-black";

                let article = document.createElement("article");
                    
                    let articleImg = document.createElement("img");
                        articleImg.src = sections[i].items[j].poster;
                        articleImg.className = "rounded";
                    article.appendChild(articleImg);
                    
                    let articleName = document.createElement("h3");
                        articleName.className = "h3 text-center my-3";
                        articleName.textContent = sections[i].items[j].name;
                    article.appendChild(articleName);
                    
                    let articleDate = document.createElement("time");
                        articleDate.dateTime = sections[i].items[j].date.toISOString().split("T")[0];
                        articleDate.className = "d-block text-center";
                        articleDate.textContent = sections[i].items[j].date.getFullYear();
                    article.appendChild(articleDate);
                    
                articleA.appendChild(article);

            sectionArticles.appendChild(articleA);
        }

        section.appendChild(sectionArticles);
    
    main.appendChild(section);
}
