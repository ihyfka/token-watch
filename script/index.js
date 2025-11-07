const nav = document.querySelector("nav");
const searchBtn = document.querySelector(".search-block");
const searchbar = nav.querySelector("input");


const cd_url ="https://data-api.coindesk.com/asset/v1/search?"; 
const cd_apiKey = "52c3585330d97bea4d7f3d257fe53885deeeac6d8b9d92ee01d1998eca9923cc";
"https://financialmodelingprep.com/stable/quote?symbol=AAPL&apikey="
const cryptoQuotes = "https://financialmodelingprep.com/stable/batch-crypto-quotes?apikey=uF6ISygDHXhMVc5UqIFfP0e2lFz7o5P5";
//news api=d178932bab63474990cb05527e197ba8
///v2/top-headlines
const newsApi = "https://newsapi.org/v2/everything?q=cryptocurrency&pageSize=8&apiKey=d178932bab63474990cb05527e197ba8";

const newsDataAPI = "https://newsdata.io/api/1/crypto?q=coin&language=en&apikey=pub_d06190c1d4ed41f49ca89fbe2652b219";
/*searchBtn.addEventListener("click",()=>{
fetch(newsDataAPI)
.then(res=>res.json())
.then(data=>console.log(data))
.catch(err=>console.log(err))
})*/

const newsDiv = document.querySelector(".news");
async function fetchCryptoNews(){ //News
  try{
    const res = await fetch(newsDataAPI);
    const data = await res.json();
    data.results.forEach((item, index) => {
      const article = document.createElement("div");
      article.classList.add("article");

      const auth = document.createElement("div");
      auth.classList.add("auth");
      const articleDivChild2 = document.createElement("div");

      const newsImg = document.createElement("img");
      newsImg.classList.add("auth-img");
      newsImg.src = data.results[index].image_url;

      const artTitle = document.createElement("div");
      artTitle.classList.add("article-title");
      artTitle.textContent = data.results[index].title;

      const artDesc = document.createElement("div");
      artDesc.classList.add("article-desc");
      artDesc.textContent = data.results[index].description;

      const published = document.createElement("div");
      published.classList.add("time-published");
      published.textContent = data.results[index].pubDate;

      auth.append(newsImg);
      articleDivChild2.append(artTitle, artDesc, published);
      article.append(auth, articleDivChild2);
      newsDiv.append(article);
    }) 
  }catch(err){
    console.log(err);
  }
}

fetchCryptoNews();



/*
searchBtn.addEventListener("click",()=>{
  let innit = searchbar.value;
  fetch(`${cd_url}search_string=${innit}&limit=4`,{
    method:"GET",
    headers:{
      "Authorization": `Bearer ${cd_apiKey}`,
      "Content-Type": "application.json"
    }
  })
  .then((res)=>res.json())
  //.then((data)=>console.log(data))
  //.catch((err)=>console.log(err))
})
*/




