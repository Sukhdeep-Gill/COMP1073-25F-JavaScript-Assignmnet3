/* 
--------------------------------------------------------------
Attributions:
- Country Information Feature:
  Implemented using concepts learned from:
  • Rest Countries API Official Documentation
  • MDN Web Docs (fetch API and DOM manipulation)

- Country News Feature:
  Implemented using concepts learned from:
  • NewsAPI Official Documentation
  • MDN Web Docs (fetch API and promises)
--------------------------------------------------------------
*/


// STEP 1: API Key for NewsAPI
const NEWS_API_KEY = "a201847d00494eb1a45d7f2915403379";

// STEP 2: Grab DOM elements
const countryForm = document.querySelector('#countryForm');
const countryInput = document.querySelector('#countryInput');
const resultSection = document.querySelector('#result');

// STEP 3: Add submit event listener to the form
countryForm.addEventListener('submit', fetchCountryInfo);


// STEP 4: Function to fetch country info from Rest Countries API
function fetchCountryInfo(event) {
    event.preventDefault(); // STEP 4a: Prevent form submission

    const countryName = countryInput.value.trim();
    if (!countryName) return alert("Please enter a country name."); // STEP 4b: Input validation

    // STEP 4c: Show loading message
    resultSection.innerHTML = "";
    const loading = document.createElement('p');
    loading.textContent = "Loading...";
    resultSection.appendChild(loading);

    // STEP 4d: Fetch country data
    const countryURL = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;

    fetch(countryURL)
        .then(response => {
            if (!response.ok) throw new Error("Country not found");
            return response.json();
        })
        .then(data => displayCountryInfo(data[0]))
        .catch(error => {
            resultSection.innerHTML = "";
            const errorMsg = document.createElement('p');
            errorMsg.textContent = `Error fetching country info: ${error.message}`;
            resultSection.appendChild(errorMsg);
        });
}

// STEP 5: Function to display country info 
function displayCountryInfo(country) {
    // STEP 5a: Clear previous results
    resultSection.innerHTML = "";

    // STEP 5b: Create container for country info
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('country');

    // STEP 5c: Create elements for each piece of info
    const nameElem = document.createElement('h2');
    nameElem.textContent = country.name.common;
    countryContainer.appendChild(nameElem);

    const capitalElem = document.createElement('p');
    capitalElem.innerHTML = `<strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}`;
    countryContainer.appendChild(capitalElem);

    const populationElem = document.createElement('p');
    populationElem.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`;
    countryContainer.appendChild(populationElem);

    const regionElem = document.createElement('p');
    regionElem.innerHTML = `<strong>Region:</strong> ${country.region}`;
    countryContainer.appendChild(regionElem);

    const subregionElem = document.createElement('p');
    subregionElem.innerHTML = `<strong>Subregion:</strong> ${country.subregion || "N/A"}`;
    countryContainer.appendChild(subregionElem);

    const currencyElem = document.createElement('p');
    currencyElem.innerHTML = `<strong>Currency:</strong> ${country.currencies ? Object.keys(country.currencies)[0] : "N/A"}`;
    countryContainer.appendChild(currencyElem);

    // STEP 5d: Add country flag
    const flagImg = document.createElement('img');
    flagImg.src = country.flags.png;
    flagImg.alt = `Flag of ${country.name.common}`;
    flagImg.style.width = "150px";
    flagImg.style.marginTop = "10px";
    countryContainer.appendChild(flagImg);

    // STEP 5e: Append the container to the result section
    resultSection.appendChild(countryContainer);
        // STEP 6: Fetch news for this country
    const newsCode = country.cca2.toLowerCase();
const newsURL = `https://newsapi.org/v2/everything?q=${country.name.common}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;


    fetch(newsURL)
        .then(response => response.json())
        .then(data => displayNews(data))
        .catch(error => {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = `Error fetching news: ${error.message}`;
            resultSection.appendChild(errorMsg);
        });
}


// STEP 7: Function to display news articles and DOM manipulation
function displayNews(newsData) {
    // STEP 7a: Create container for news
    const newsContainer = document.createElement('div');
    newsContainer.classList.add('news-container');

    // STEP 7b: Check if articles exist
    if (newsData.articles && newsData.articles.length > 0) {
        newsData.articles.forEach(article => {
            const articleElem = document.createElement('article');

            const title = document.createElement('h3');
            title.textContent = article.title;
            articleElem.appendChild(title);

            const desc = document.createElement('p');
            desc.textContent = article.description || "";
            articleElem.appendChild(desc);

            const link = document.createElement('a');
            link.href = article.url;
            link.target = "_blank";
            link.textContent = "Read more";
            articleElem.appendChild(link);

            if (article.urlToImage) {
                const img = document.createElement('img');
                img.src = article.urlToImage;
                img.alt = "News image";
                img.style.width = "200px";
                img.style.display = "block";
                img.style.marginTop = "5px";
                articleElem.appendChild(img);
            }

            newsContainer.appendChild(articleElem);
        });
    } else {
        const noNews = document.createElement('p');
        noNews.textContent = "No news found for this country.";
        newsContainer.appendChild(noNews);
    }

    // STEP 7c: Append news container to the result section
    resultSection.appendChild(newsContainer);
}
