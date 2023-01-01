let newsContainer = document.getElementsByClassName("newsContainer")[0];
const getMoreBtn = document.getElementsByClassName("getMore")[0];
const newsInput = document.getElementsByClassName("newsInput")[0];
const seacrhIcon = document.getElementsByClassName("newsSearch")[0].querySelector("img");

const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const monthInYear = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let querydata = {
    nextPage: 0,
    category: "business,science",
    apiKey: "pub_5544807c0c110413e3eadb4dc0bd2db587d6",
    query: "",
};
let searchValue = false;

let url = `https://newsdata.io/api/1/news?apikey=${querydata.apiKey}&category=${querydata.category}&language=en`;
const getNews = async() => {
    if (document.getElementsByClassName("notFound")[0])
        document.getElementsByClassName("notFound")[0].remove();

    url = `https://newsdata.io/api/1/news?apikey=${querydata.apiKey}&category=${querydata.category}&language=en`;
    if (querydata.nextPage !== 0) {
        url = `https://newsdata.io/api/1/news?apikey=${querydata.apiKey}&category=${querydata.category}&language=en&page=${querydata.nextPage}`;
    }

    if (querydata.query !== "") {
        url = url + `&q=${querydata.query}`;
    } else {
        url = url;
    }

    let loader = document.createElement("div");
    loader.className = "loadingGif";
    loader.innerHTML = `<img src="./loading.gif" alt="">
                        <p>Loading...</p>`;
    if (querydata.query !== "" && querydata.nextPage === 0) {
        newsContainer.innerHTML = "";
    }
    newsContainer.appendChild(loader);

    console.log(url);
    // url = "/temp.json";
    let data = await fetch(url);
    data = await data.json();
    console.log(data);
    if (newsContainer.getElementsByClassName("loadingGif")[0]) {
        newsContainer.getElementsByClassName("loadingGif")[0].remove();
    }
    if (querydata.nextPage === 0) {
        newsContainer.innerHTML = "";
    }
    console.log(data.results.length);
    if (data.results.length === 0) {
        querydata.nextPage = 0;
        querydata.query = "";
        warningNode = document.createElement("div");
        warningNode.className = "notFound";
        if (newsInput.value !== "") {
            if (querydata.nextPage === 0) {
                warningNode.innerHTML = `<h1>Not Found</h1>
        <p>Can't find news articles with keyword: ${newsInput.value}</p>`;
            } else if (querydata.nextPage !== 0) {
                warningNode.innerHTML = `<h1>Not Found</h1>
        <p>Can't find any more news alticles with keyword: ${newsInput.value}</p>`;
            }
        } else {
            warningNode.innerHTML = `<h1>Not Found</h1>
                                <p>Can't find any more news </p>`;
        }
        newsContainer.appendChild(warningNode);
    } else {
        querydata.nextPage = data.nextPage;
        let skipCount = 0;
        data.results.forEach((itemData) => {
            let image_url = itemData.image_url;
            if (!itemData.image_url) {
                skipCount++;
                return;
            }
            let day = "Unknown",
                desc = "Unknown",
                dop = "Unknown",
                tit = "Unknown";
            if (itemData.link) {
                link = itemData.link;
            } else if (!itemData.link) {
                skipCount++;
                return;
            }
            if (itemData.pubDate) {
                let date = new Date(itemData.pubDate);
                day = weekday[date.getDay()];
                dop = `${
          monthInYear[date.getMonth()]
        } ${date.getDate()} ${date.getFullYear()}`;
            }
            if (itemData.description) {
                desc = itemData.description.slice(0, 300);
                if (itemData.description.length > 300) {
                    desc = desc + "...";
                }
            }
            if (itemData.title) {
                tit = itemData.title.slice(0, 100);
                if (itemData.title.length > 100) tit = tit + "...";
            }
            let newNode = document.createElement("div");
            newNode.className = "newsItem";
            newNode.innerHTML = ` <div class="newsImg">
                              <img src=${image_url} alt="">
                          </div>
                          <div class="newsInfo">
                              <div class="publishedAt">
                                  <span>${day}</span>
                                  <br>
                                  <span>${dop}</span>
                              </div>
                              <h1 class="newstitle">${tit}</h1>
                              <p class="description">${desc}
                              </p>
                              <a href=${link} target="_blank" class="newsUrl">Read More</a>
                          </div>`;
            newsContainer.appendChild(newNode);
        });
        if (skipCount > 7) {
            skipCount = 0;
            getNews();
        }
    }
};

newsInput.addEventListener("input", () => {
    console.log(newsInput.value);
    if (newsInput.value === "") {
        querydata.query = "";
        querydata.nextPage = 0;
        getNews();
    }
});

seacrhIcon.addEventListener("click", () => {
    let q = newsInput.value.split(/ +/);
    if (q[-1] === "") q = q.slice(0, -1);
    q = q.join("%20");
    querydata.query = q;
    querydata.nextPage = 0;
    getNews();
});

getMoreBtn.addEventListener("click", () => {
    getNews();
});

getNews();