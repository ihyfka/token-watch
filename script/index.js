/*    with authentication
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


const nav = document.querySelector("nav");
const searchBtn = document.querySelector(".search-block");
const searchbar = nav.querySelector("input");
const newsDataAPI = "https://newsdata.io/api/1/crypto?q=coin&language=en&apikey=pub_d06190c1d4ed41f49ca89fbe2652b219";
const topCoinsBoxesBox = document.querySelector(".topcoins-boxes");

const cd_url ="https://data-api.coindesk.com/asset/v1/search?";  //search
const cd_apiKey = "52c3585330d97bea4d7f3d257fe53885deeeac6d8b9d92ee01d1998eca9923cc";



"https://financialmodelingprep.com/stable/quote?symbol=AAPL&apikey="


const cryptoQuotes = "https://financialmodelingprep.com/stable/batch-crypto-quotes?apikey=uF6ISygDHXhMVc5UqIFfP0e2lFz7o5P5";



//searchBtn.addEventListener("click",()=>{
//   fetch(`https://api.coinlore.com/api/tickers/?start=0&limit=10`)
//   .then(response => response.json())
//   .then(data => console.log(data))
// fetch(cryptoQuotes)
// .then(res=>res.json())
// .then(data=>console.log(data))
// .catch(err=>console.log(err))
//fetchCryptoNews();
//})


//SEARCH
//TODAY OVERVIEW

//TOP COINS
async function getTopCoins(){
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 3000)

  try{
    const res = await fetch(`https://api.coinlore.com/api/tickers/?start=0&limit=10`, {signal});
    clearTimeout(timeoutId);
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }
    const data = await res.json();
    data.data.forEach((item, index)=>{
    const topCoinsBox = document.createElement("div");
    topCoinsBox.classList.add("topcoins-box");
    topCoinsBox.style.padding = "2rem";
      
      const topCoinBoxImg = document.createElement("img");
      const topCoinBoxName = document.createElement("p");
      const topCoinBoxValue = document.createElement("span");
      topCoinBoxValue.classList.add("topcoins-value");
      const topCoinValueChange = document.createElement("p");
      const valueTimePeriod = document.createElement("span");

      //topCoinsBox.textContent = data.data[index].title;
      topCoinBoxImg.src = data.data[index].pic || "./resources/images/Screenshot_20251102_170026_Chrome.jpg";
      topCoinBoxName.textContent = data.data[index].name;
      topCoinBoxValue.textContent = "$" + data.data[index].price_usd;
      topCoinValueChange.textContent = data.data[index].percent_change_1h + "%";
      if(Math.sign(data.data[index].percent_change_1h) === 1){
        topCoinValueChange.style.color = "var(--bullish)";
      }else{
        topCoinValueChange.style.color = "var(--bearish)";
      }
      valueTimePeriod.textContent = "1H";
      topCoinValueChange.append(valueTimePeriod);
      topCoinsBox.append(topCoinBoxImg, topCoinBoxName, topCoinBoxValue, topCoinValueChange);
      
      topCoinsBoxesBox.append(topCoinsBox);
    }) 
  }catch(err){
    //clearTimeout(timeoutId);
    const fragment = document.createDocumentFragment();
    for(let i=0;i<10;i++){
      const topCoinsBox = document.createElement("div");
      topCoinsBox.classList.add("topcoins-box");
      const tcInput = document.createElement("div");
      tcInput.classList.add("lazy");
      topCoinsBox.append(tcInput);
      fragment.append(topCoinsBox);  
    }
    topCoinsBoxesBox.append(fragment);    
    console.log(err);
  }
}
getTopCoins();



//NEWS
const newsDiv = document.querySelector(".news");
const fetchErr = document.createElement("div");
async function fetchCryptoNews(){ //News
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 3000)
  try{
    const res = await fetch(newsDataAPI, {signal});
    clearTimeout(timeoutId);
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }
    const data = await res.json();
    data.results.forEach((item, index) => {
      // console.log(data.data);
      const article = document.createElement("div");
      const auth = document.createElement("div");
      const articleDivChild2 = document.createElement("div");
      const newsImg = document.createElement("img");
      const artTitle = document.createElement("div");
      const artDesc = document.createElement("div");
      const published = document.createElement("div");
      article.classList.add("article");
      auth.classList.add("auth");
      newsImg.classList.add("auth-img");
      newsImg.src = data.results[index].image_url || "./resources/images/resolve-images-not-showing-problem-1.jpg";
      artTitle.classList.add("article-title");
      artTitle.textContent = data.results[index].title;
      artDesc.classList.add("article-desc");
      artDesc.textContent = data.results[index].description;
      published.classList.add("time-published");
      published.textContent = data.results[index].pubDate;
      auth.append(newsImg);
      articleDivChild2.append(artTitle, artDesc, published);
      article.append(auth, articleDivChild2);
      newsDiv.append(article);
    }) 
  }catch(err){
    // clearTimeout(timeoutId);
    // const fetchErr = document.createElement("div");
    fetchErr.classList.add("fetch-err");
    fetchErr.textContent = "Error! Unable to fetch news data.";
    newsDiv.append(fetchErr);
    console.log(err);
  }
}
fetchCryptoNews();


//BUTTON
// const refreshBtn = document.querySelector(".new-content");
// refreshBtn.addEventListener("click", ()=>{
//   refreshBtn.querySelector("span").textContent = "Refreshing...";
//   refreshBtn.querySelector(".refresh-icon").classList.add("refresh-load");
//   // topCoinsBoxesBox.style.display = "none";
//   fetchErr.textContent = "";
//   setTimeout((err)=>{
//     // if(err){
//     //   topCoinsBoxesBox.style.display = "flex";
//     //   fetchErr.textContent = "Error! Unable to fetch news data.";
//     // }

//     refreshBtn.querySelector("span").textContent = "Refresh";
//     refreshBtn.querySelector(".refresh-icon").classList.remove("refresh-load");
//   }, 6000)
// })


