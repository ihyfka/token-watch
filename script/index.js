const nav = document.querySelector("nav");
const searchBtn = document.querySelector(".search-block");
const searchbar = nav.querySelector("input");
const newsDataAPI = "https://newsdata.io/api/1/crypto?q=coin&language=en&apikey=pub_d06190c1d4ed41f49ca89fbe2652b219";
const topCoinsBoxesBox = document.querySelector(".topcoins-boxes");
const refreshBtn = document.querySelector(".new-content");
const fetchErr = document.createElement("div");


const cd_url ="https://data-api.coindesk.com/asset/v1/search?";  //search
const cd_apiKey = "52c3585330d97bea4d7f3d257fe53885deeeac6d8b9d92ee01d1998eca9923cc";
const cryptoQuotes = "https://financialmodelingprep.com/stable/batch-crypto-quotes?apikey=uF6ISygDHXhMVc5UqIFfP0e2lFz7o5P5";

"https://financialmodelingprep.com/stable/quote?symbol=AAPL&apikey="






//THEME TOGGLE
const theme = document.querySelectorAll(".theme");
const lightIcon = document.querySelector(".light-theme");
const darkIcon = document.querySelector(".dark-theme");
const navLight = document.querySelector(".nav-light");
const navDark = document.querySelector(".nav-dark");
let getDarkmode = localStorage.getItem("darkMode");
function launchDarkMode(){
  localStorage.setItem("darkMode", "true");
  document.body.classList.remove("light");
  darkIcon.style.display = "none";
  lightIcon.style.display = "inline-block";
  navLight.style.display = "inline-block";
  navDark.style.display = "none";
}
function launchLightMode(){
  localStorage.setItem("darkMode", "false");
  document.body.classList.add("light");
  darkIcon.style.display = "inline-block";
  lightIcon.style.display = "none";
  navLight.style.display = "none";
  navDark.style.display = "inline-block";
}
getDarkmode === "true" ? launchDarkMode(): 0;
for(let i=0;i<theme.length;i++){
  theme[i].addEventListener("click", ()=>{
    getDarkmode = localStorage.getItem("darkMode");
    getDarkmode !== "true" ? launchDarkMode(): launchLightMode();
  })
}


//SEARCH

// searchBtn.addEventListener("click",()=>{
//   let innit = searchbar.value;
//   fetch(`${cd_url}search_string=${innit}&limit=10`,{
//     method:"GET",
//     headers:{
//       "Authorization": `Bearer ${cd_apiKey}`,
//       "Content-Type": "application.json"
//     }
//   })
//   .then((res)=>res.json())
//   .then((data)=>console.log(data))
//   .catch((err)=>console.log(err))
// })



// const navEntry = document.querySelector("#nav-entry");
// console.log(navEntry.querySelector("input"))
// navEntry.addEventListener("click", (e)=>{
//   if(e.target.contains(navEntry.querySelector("input"))){
//     //(navEntry.querySelector("input")).style.display = "inline-block";
//     //searchBtn.style.display = "100%";
//     console.log("input hit")
//   }else{
//     console.log("target not found")
//   }
// })
















//LAST UPDATED
const lastUpdated = document.querySelector(".last-update");
function updatedInfo(){
  const timeNow = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).replace(",", "");
  lastUpdated.textContent = `Updated ${timeNow}`;
}
updatedInfo();
function notUpdatedInfo(){
  lastUpdated.textContent = "Updated *** **";
}
navigator.onLine ? updatedInfo(): notUpdatedInfo();


//GLOBAL METRICS
async function getGlobalMetric(){
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  try{
    const url = 'https://cryptocurrency-markets.p.rapidapi.com/v1/crypto/modules?module=global_matric';
    const options = {
	    method: 'GET',
	    headers:{
		    'x-rapidapi-key': 'd1a98a9ce2mshc6d3a6de72b33cfp1c8091jsneba9972e64c1',
		    'x-rapidapi-host': 'cryptocurrency-markets.p.rapidapi.com'
	    }
    };
	  const res = await fetch(url, options, {signal});
	  const data = await res.json();
	  console.log(data);
  }catch (error) {
	  console.error(error); 
  }
}
searchBtn.addEventListener("click", getGlobalMetric);











//TRENDING COINS
const trendingDiv = document.querySelector(".trending-block");
async function getTrending(){
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  try{
    const res = await fetch("https://api.coinranking.com/v2/coins/trending?timePeriod=1h&limit=4&tiers[]=2&tiers[]=3", {
      headers:{
      'x-access-token': 'coinranking86f7f6b674c68d00e691f169dcf49d8fa5df15aafd2476a2',
      }
    }, {signal});
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }else{
      const data = await res.json();
      console.log(data);
      data.data.coins.forEach((item, index)=>{
        const topTrending = document.createElement("div");
        numSpan = document.createElement("span");
        trendingTokenImg = document.createElement("img");
        tokName = document.createElement("span");
        tokSymbol = document.createElement("span");
        trendingTokenVchange = document.createElement("div");
        topTrending.classList.add("top-trending");
        numSpan.classList.add("num");
        numSpan.textContent = index + 1;
        trendingTokenImg.src = data.data.coins[index].iconUrl || "./resources/images/general-purpose-cover.png";
        tokName.classList.add("token-name");
        tokName.textContent = data.data.coins[index].name;
        tokSymbol.classList.add("token-symbol");
        tokSymbol.textContent = data.data.coins[index].symbol;
        trendingTokenVchange.classList.add("token-value");
        trendingTokenVchange.textContent = data.data.coins[index].change + "%";
        if(Math.sign(data.data.coins[index].change) === 1){
          trendingTokenVchange.style.color = "var(--bullish)";
        }else{
          trendingTokenVchange.style.color = "var(--bearish)";
        }
      topTrending.append(numSpan, trendingTokenImg, tokName, tokSymbol, trendingTokenVchange);
      trendingDiv.append(topTrending);
      })
    }
  }catch(err){
    clearTimeout(timeoutId);
    const fragment = document.createDocumentFragment();
    for(let i=0;i<3;i++){
      const lazyTrendingBox = document.createElement("div");
      lazyTrendingBox.classList.add("lazy");
      fragment.append(lazyTrendingBox);   
    }
    trendingDiv.append(fragment);
    console.log(err)
  }
}
//getTrending();


//RECENTLY ADDED COINS
// async function raCoins(){
// //   // const controller = new AbortController();
// //   // const signal = controller.signal;
// //   // const timeoutId = setTimeout(()=>{
// //   //   controller.abort()
// //   // }, 5000)
// //       const url = 'https://crypto-tracker.p.rapidapi.com/api/recentlyadded';
// //     const options = {
// // 	    method: 'GET',
// // 	    headers: {
// // 		  'x-rapidapi-key': 'd1a98a9ce2mshc6d3a6de72b33cfp1c8091jsneba9972e64c1',
// // 		  'x-rapidapi-host': 'crypto-tracker.p.rapidapi.com'
// // 	    }
// //     }
// //   try{

// //     const res = await fetch(url, options);
// //     if(!res.ok){
// //       throw new Error(`HTTP error! status code: ${res.status}`);
// //     }
// // 	  const data = await res.json();//res.text();
// // 	  console.log(data)
// //     data.result.forEach((item, index)=>{

// //     })
// //   }catch(err){
// //     console.log(err)
// //   }
// // const url = 'https://cryptopricesapi-by-xcrypto.p.rapidapi.com/';
// // const options = {
// // 	method: 'GET',
// // 	headers: {
// // 		'x-rapidapi-key': 'd1a98a9ce2mshc6d3a6de72b33cfp1c8091jsneba9972e64c1',
// // 		'x-rapidapi-host': 'cryptopricesapi-by-xcrypto.p.rapidapi.com'
// // 	}
// // };

// // try {
// // 	const response = await fetch(url, options);
// // 	const result = await response.text();
// // 	console.log(result);
// // } catch (error) {
// // 	console.error(error);
// // }



// }
// // searchBtn.addEventListener("click", raCoins)



//TOP COINS
async function getTopCoins(){
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  try{
    const res = await fetch(`https://api.coinlore.com/api/tickers/?start=0&limit=10`, {signal});
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
      topCoinBoxImg.src = `./resources/images/${data.data[index].name}.png` || "./resources/images/general-purpose-cover.png";
      topCoinBoxName.textContent = data.data[index].name;
      topCoinBoxValue.textContent = "$" + data.data[index].price_usd;
      topCoinValueChange.textContent = data.data[index].percent_change_1h + "%";
      if(Math.sign(data.data[index].percent_change_1h) === 1){
        topCoinValueChange.style.color = "var(--bullish)";
      }else{
        topCoinValueChange.style.color = "var(--bearish)";
      }
      valueTimePeriod.style.color = "var(--tab-hover)";
      valueTimePeriod.textContent = "1H";
      topCoinValueChange.append(valueTimePeriod);
      topCoinsBox.append(topCoinBoxImg, topCoinBoxName, topCoinBoxValue, topCoinValueChange);
      topCoinsBoxesBox.append(topCoinsBox);
    }) 
  }catch(err){
    clearTimeout(timeoutId);
    const fetchErr = document.createElement("div");
    fetchErr.classList.add("fetch-err");
    fetchErr.textContent = "Error! Unable to fetch coin metrics.";
    topCoinsBoxesBox.append(fetchErr);
    //console.log(err);
  }
}
getTopCoins();
    

//NEWS
const newsDiv = document.querySelector(".news");
async function cryptoNews(){
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000);
  try{
    const res = await fetch(newsDataAPI, {signal});
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }
    const data = await res.json();
    data.results.forEach((item, index) => {
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
      const utcDate = new Date((`${data.results[index].pubDate}Z`));
      const publishedDate = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(utcDate).replace(",", " ").replace(/\//g,"-");
      published.textContent = `${publishedDate}  UTC+1`;
      auth.append(newsImg);
      articleDivChild2.append(artTitle, artDesc, published);
      article.append(auth, articleDivChild2);
      newsDiv.append(article);
    })
  }catch(err){
    clearTimeout(timeoutId);
    fetchErr.classList.add("fetch-err");
    fetchErr.textContent = "Error! Unable to fetch news data.";
    newsDiv.append(fetchErr);
    refreshBtn.style.display = "flex";
    //console.log(err);
  }
}
//cryptoNews();


//REFRESH BUTTON
refreshBtn.addEventListener("click", ()=>{
  newsDiv.innerHTML = "";
  refreshBtn.querySelector("span").textContent = "Refreshing...";
  refreshBtn.querySelector(".refresh-icon").classList.add("refresh-load");
  fetchCryptoNews();
  setTimeout(()=>{
    refreshBtn.querySelector("span").textContent = "Refresh";
    refreshBtn.querySelector(".refresh-icon").classList.remove("refresh-load");
  }, 2500)
})
























// const lazyCoins = setInterval(()=>{
//   const fragment = document.createDocumentFragment();
//   for(let i=0;i<10;i++){
//     const topCoinsBox = document.createElement("div");
//     topCoinsBox.classList.add("topcoins-box");
//     const tcInput = document.createElement("div");
//     tcInput.classList.add("lazy");
//     topCoinsBox.append(tcInput);
//     fragment.append(topCoinsBox);  
//   }
//   topCoinsBoxesBox.append(fragment);
// },30000)


// function checkErr(){
//   if(topCoinsBoxesBox.contains(fetchErr)){
//    console.log("button is clicked and errbox is visible");
// }else{
//   console.log("button is not clicked and errbox is invisible");
// }
// }




// coinmarket cap api = "0b5c5dafd83b424f8dc9d5fc8774ef14"
// //FEAR AND GREED INDEX
// URL = "https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest"
// {
// "data": {
// "value ": 40,
// "value_classification": "Neutral",
// "update_time": "2024-09-19T02:54:56.017Z"
// },
// "status": {
// "timestamp": "2025-11-08T09:42:16.469Z",
// "error_code": 0,
// "error_message": "",
// "elapsed": 10,
// "credit_count": 1,
// "notice": ""
// }
// }



// //COIN META DATA
// URL = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info"
// {
// "data": {
// "1": {
// "urls": {
// "website": [
// "https://bitcoin.org/"
// ],
// "technical_doc": [
// "https://bitcoin.org/bitcoin.pdf"
// ],
// "twitter": [ ],
// "reddit": [
// "https://reddit.com/r/bitcoin"
// ],
// "message_board": [
// "https://bitcointalk.org"
// ],
// "announcement": [ ],
// "chat": [ ],
// "explorer": [
// "https://blockchain.coinmarketcap.com/chain/bitcoin",
// "https://blockchain.info/",
// "https://live.blockcypher.com/btc/"
// ],
// "source_code": [
// "https://github.com/bitcoin/"
// ]
// },
// "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
// "id": 1,
// "name": "Bitcoin",
// "symbol": "BTC",
// "slug": "bitcoin",
// "description": "Bitcoin (BTC) is a consensus network that enables a new payment system and a completely digital currency. Powered by its users, it is a peer to peer payment network that requires no central authority to operate. On October 31st, 2008, an individual or group of individuals operating under the pseudonym "Satoshi Nakamoto" published the Bitcoin Whitepaper and described it as: "a purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."",
// "date_added": "2013-04-28T00:00:00.000Z",
// "date_launched": "2013-04-28T00:00:00.000Z",
// "tags": [
// "mineable"
// ],
// "platform": null,
// "category": "coin"
// },
