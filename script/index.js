const container = document.querySelector(".container");
const bodyOverlay = document.querySelector("#overlay");
const nav = document.querySelector("nav");
const searchBtn = document.querySelector(".search-block");
const searchbar = nav.querySelector("input");
const topCoinsBoxesBox = document.querySelector(".topcoins-boxes");
const refreshBtn = document.querySelector(".new-content");
const fetchErr = document.createElement("div");
const trendingDiv = document.querySelector(".trending-block");
const raDiv = document.querySelector(".recently-added-block");

/* theme toggle */
document.querySelector(".nav-notif").addEventListener("click", ()=>alert("You have no new notifications"))
const theme = document.querySelector(".theme");
const navLight = document.querySelector(".nav-light");
const navDark = document.querySelector(".nav-dark");
let getDarkmode = localStorage.getItem("darkMode");
function launchDarkMode(){
  localStorage.setItem("darkMode", "true");
  document.body.classList.remove("light");
  navLight.style.display = "inline-block";
  navDark.style.display = "none";
}
function launchLightMode(){
  localStorage.setItem("darkMode", "false");
  document.body.classList.add("light");
  navLight.style.display = "none";
  navDark.style.display = "inline-block";
}
getDarkmode === "true" ? launchDarkMode(): launchLightMode();
theme.addEventListener("click", ()=>{
  getDarkmode = localStorage.getItem("darkMode");
  getDarkmode !== "true" ? launchDarkMode(): launchLightMode();
})


/* search */
let isCIP = false;
const navEntry = document.querySelector("#nav-entry");
const searchResContainer = document.querySelector("#search-res-block");
const proceedAdvSearch = document.querySelector(".proceed-adv");
const cancelSearch = searchResContainer.querySelector(".search-cancel");
navEntry.addEventListener("click",()=>{
  document.body.style.overflow = "hidden";
  if(window.matchMedia("(max-width:425px)").matches){
    if(document.body.classList.contains("light")){
      nav.style.background = "#666666";
    }
  }
  if(!document.body.classList.contains("light")){
    nav.style.background = "#00000593";
  }
  bodyOverlay.style.display = "block";
  navEntry.style.display = "none";
  searchResContainer.style.display = "flex";
  const existingRes = searchResContainer.querySelectorAll(".search-results, .res-num-display");
  existingRes.forEach(el => el.remove());
  mainInp.value = "";
})
const mainInp = searchResContainer.querySelector("input");
searchResContainer.addEventListener("click", (e)=>{
  e.stopPropagation();
})
async function advSearch(){
  if(isCIP){return};
  isCIP = true;
  if(!mainInp.value.trim()){return};
  const existingRes = searchResContainer.querySelectorAll(".search-results, .res-num-display");
  existingRes.forEach(el => el.remove());
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  let innit = mainInp.value;
  try{
    const res = await fetch(`/api/search?search_string=${encodeURIComponent(innit)}&limit=7`, {signal});
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }else{
      const data = await res.json();
      data.Data.LIST.forEach((item, index, arr)=>{
        const searchResults = document.createElement("div");
        searchResults.classList.add("search-results");
        const searchRes = document.createElement("div");
        searchRes.classList.add("search-res");
        const searchResIcon = document.createElement("div");
        searchResIcon.classList.add("search-res-icon");
        const searchImg = document.createElement("img");
        searchImg.src = data.Data.LIST[index].LOGO_URL;
        searchImg.onerror = ()=> searchImg.src='./resources/images/general-purpose-cover.png';
        searchResIcon.append(searchImg);
        const div = document.createElement("div");
        const searchResId = document.createElement("div");
        searchResId.classList.add("search-res-id");
        const sResName = document.createElement("span");
        sResName.classList.add("search-res-name");
        sResName.textContent = data.Data.LIST[index].NAME;
        const sResSymbol = document.createElement("span");
        sResSymbol.classList.add("search-res-symbol");
        sResSymbol.textContent = data.Data.LIST[index].SYMBOL;
        searchResId.append(sResName, sResSymbol);
        const sResAssetType = document.createElement("span");
        sResAssetType.classList.add("search-res-asset-type");
        sResAssetType.textContent = data.Data.LIST[index].ASSET_TYPE;
        div.append(searchResId, sResAssetType);
        searchRes.append(searchResIcon, div);
        searchResults.append(searchRes);
        searchResContainer.append(searchResults);
      });
      const resNumDisp = document.createElement("div");
      resNumDisp.classList.add("res-num-display");
      resNumDisp.textContent = `Showing ${data.Data.LIST.length} of 50+ relevant results.`;
      searchResContainer.append(resNumDisp);
    }
  }catch(err){
    console.log(err);
    isCIP = false;
  }finally{
    clearTimeout(timeoutId);
    if(isCIP){isCIP = false}
  }
}
proceedAdvSearch.addEventListener("click", advSearch);
mainInp.addEventListener("keypress", (e)=>{
  if(e.key === "Enter"){
    e.preventDefault();
    advSearch();
  }
});
function closeSearchModal(){
  document.body.style.overflow = "auto";
  nav.style.background = "var(--bg)";
  mainInp.value = "";
  const alrExistingRes = searchResContainer.querySelectorAll(".search-results, .res-num-display");
  alrExistingRes.forEach(info => info.remove());
  bodyOverlay.style.display = "none";
  navEntry.style.display = "flex";
  searchResContainer.style.display = "none";
}
cancelSearch.addEventListener("click", closeSearchModal);
bodyOverlay.addEventListener("click", closeSearchModal);


/* last updated */
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


/* global metrics */
const mrktOverview = document.querySelector("#market-overview");
const mcDaily = document.createElement("div");
const mrktDom = document.createElement("div");
const fgSentiment = document.createElement("div");
async function getGlobalMetric(){
  const mcValue = document.createElement("span");
  const mcChange = document.createElement("p");
  const btcDom = document.createElement("span");
  const ethDom = document.createElement("span");
  const fgInfo = document.createElement("div");
  const fgImgDiv = document.createElement("div");
  const fgValue = document.createElement("div");
  const fgNum = document.createElement("span");
  const fgComment = document.createElement("p");
const metricCovers = [mcDaily, mrktDom, fgSentiment];
metricCovers.forEach(item => item.classList.add("lz-metric-covers"));
const metricInfo = [mcValue, mcChange, btcDom, ethDom, fgImgDiv, fgNum, fgComment];
metricInfo.forEach(item => item.classList.add("lz-metrics"));
  mcDaily.append(mcValue, mcChange);
  mrktDom.append(btcDom, ethDom);
  fgValue.append(fgNum, fgComment);
  fgInfo.append(fgImgDiv, fgValue);
  fgSentiment.append(fgInfo);
  mrktOverview.append(mcDaily, mrktDom, fgSentiment);
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  try{
    const gbRes = await fetch(`/api/global-metrics`, {signal});
    const fgRes = await fetch(`/api/fear-greed-index`, {signal});
    if(!gbRes.ok || !fgRes.ok){
      throw new Error(`error code: ${res.status}`);
    }else{
      if(mrktOverview){
        metricCovers.forEach(item => item.classList.remove("lz-metric-covers"));
        metricInfo.forEach(item => item.classList.remove("lz-metrics"));
        mrktOverview.innerHTML = "";
      }
	    const gbData = await gbRes.json();
      mcDaily.classList.add("daily-mc");
      mcDaily.setAttribute("title", "The total value of all outstanding shares or cryptocurrency coins in circulation.");
      const commonMrktHeaderMC = document.createElement("span");
      commonMrktHeaderMC.classList.add("mrkt-sentiment-header");
      commonMrktHeaderMC.textContent = "Market cap";
      mcValue.classList.add("mc-value");
      mcValue.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format((Math.round((gbData.body.market_cap) *100) /100));
      //mcp
      mcChange.classList.add("mc-change");
      mcChange.textContent = (Math.round((gbData.body.market_cap_change) *100) /100) + "%";
      const mcChangeUp = `<svg fill="var(--bullish)" width="9px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"/></svg>`;
      const mcChangeDown = `<svg fill="var(--bearish)" width="9px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"/></svg>`;
      if(Math.sign((Math.round((gbData.body.market_cap_change) *100) /100)) === 1){
        mcChange.style.color = "var(--bullish)";
        mcChange.innerHTML += mcChangeUp;
      }else{
        mcChange.style.color = "var(--bearish)";
        mcChange.innerHTML += mcChangeDown;
      }
      mcDaily.append(commonMrktHeaderMC, mcValue, mcChange);
      //dominance
      mrktDom.classList.add("mrk-dom");
      mrktDom.setAttribute("title", "Market dominance metrics measure an asset's percentage share of the total market.");
      const commonMrktHeaderMD = document.createElement("span");
      commonMrktHeaderMD.classList.add("mrkt-sentiment-header");
      commonMrktHeaderMD.textContent = "Dominance";
      btcDom.classList.add("btc-dom");
      btcDom.textContent = `BTC:   ${(Math.round((gbData.body.btc_dominance) *100) /100)}%`;
      ethDom.classList.add("eth-dom");
      ethDom.textContent = `ETH:   ${(Math.round((gbData.body.eth_dominance) *100) /100)}%`;
      mrktDom.append(commonMrktHeaderMD, btcDom, ethDom);
      //fear and greed
      const fgData = await fgRes.json();
      fgSentiment.classList.add("fg-sentiment");
      fgSentiment.setAttribute("title", "The Index registers investor sentiment on a 0 (extreme fear) to 100 (extreme greed) scale.");
      const commonMrktHeaderFG = document.createElement("span");
      commonMrktHeaderFG.classList.add("mrkt-sentiment-header");
      commonMrktHeaderFG.textContent = "Fear & Greed";
      fgInfo.classList.add("fear-greed-info");
      fgImgDiv.classList.add("fg-img");
      const fgSvg = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 500 500" width="40" height="40">
          <path d="M0 0 C1.52043915 0.00081573 1.52043915 0.00081573 3.07159424 0.00164795 C19.26871221 0.04152583 34.81258365 0.90752199 50.6875 4.375 C52.22688232 4.70443604 52.22688232 4.70443604 53.79736328 5.04052734 C90.19954314 13.02876778 124.32904613 28.27148766 153.6875 51.375 C155.1415625 52.51195312 155.1415625 52.51195312 156.625 53.671875 C171.32719241 65.45033596 185.05648647 78.54596699 196.6875 93.375 C197.45449219 94.3134375 198.22148437 95.251875 199.01171875 96.21875 C206.84422597 106.00623084 213.31488682 116.5958611 219.6875 127.375 C220.08211426 128.03725586 220.47672852 128.69951172 220.88330078 129.38183594 C242.34487465 165.84769426 250.6875 208.6522213 250.6875 250.375 C219.6675 250.375 188.6475 250.375 156.6875 250.375 C155.6975 242.455 154.7075 234.535 153.6875 226.375 C150.69089569 212.93308924 146.51422993 200.80406911 140.6875 188.375 C140.37441895 187.70484863 140.06133789 187.03469727 139.73876953 186.34423828 C128.99204665 163.80968597 111.00577423 143.6967635 90.6875 129.375 C86.35954336 130.88310607 84.52005627 134.12157251 82.15234375 137.8046875 C81.72141418 138.45813141 81.29048462 139.11157532 80.84649658 139.78482056 C79.9170592 141.1964028 78.99184205 142.61077094 78.07040405 144.02758789 C76.11125276 147.03992312 74.13207734 150.03890835 72.1542511 153.03900146 C71.14102719 154.57657438 70.12889972 156.11487036 69.11784363 157.65386963 C64.43831146 164.77431104 59.67163325 171.83311013 54.875 178.875 C54.09685117 180.01899355 53.31877478 181.16303638 52.54077148 182.30712891 C51.01277636 184.55355919 49.48398073 186.79944164 47.95458984 189.04492188 C45.6712984 192.39780238 43.39197241 195.75336698 41.11328125 199.109375 C25.91410686 221.48990205 25.91410686 221.48990205 19.12988281 231.29101562 C18.07334181 232.81752782 17.01820107 234.34500943 15.96386719 235.87304688 C14.10521667 238.56420769 12.24076052 241.25126474 10.375 243.9375 C9.79983643 244.77128174 9.22467285 245.60506348 8.63208008 246.46411133 C-2.40673026 262.3040755 -2.40673026 262.3040755 -12.3125 265.375 C-19.08878859 266.30236723 -25.65225199 266.27522609 -31.66015625 262.71875 C-35.43995813 259.64486857 -37.78432055 255.95953834 -39.3125 251.375 C-40.13778898 242.30861104 -39.87025721 234.82119945 -34.3125 227.375 C-31.70602439 224.51952364 -29.04808939 221.85357796 -26.2265625 219.2109375 C-24.14126769 217.24174914 -22.27191493 215.18665347 -20.42333984 212.99462891 C-15.67949204 207.54377834 -10.54002747 202.4907177 -5.41537476 197.40270996 C-3.58737821 195.58764434 -1.76267044 193.76932699 0.0612793 191.95019531 C4.58906143 187.43568084 9.12230807 182.92666663 13.65539551 178.41748047 C17.49716339 174.59554384 21.33680702 170.77149624 25.17373657 166.94470215 C26.95905545 165.16579745 28.74739139 163.38996604 30.53588867 161.61425781 C35.59285265 156.5798339 40.56087804 151.52491634 45.19512939 146.09222412 C47.59912315 143.32602379 50.193259 140.76404707 52.8046875 138.1953125 C53.61862473 137.38705521 53.61862473 137.38705521 54.44900513 136.56246948 C56.15103964 134.87247151 57.85633664 133.18582884 59.5625 131.5 C61.83359613 129.25547379 64.10136175 127.00765749 66.3671875 124.7578125 C66.88691132 124.24638702 67.40663513 123.73496155 67.94210815 123.20803833 C70.65765109 120.55199878 70.65765109 120.55199878 72.6875 117.375 C71.511875 117.00375 70.33625 116.6325 69.125 116.25 C64.94114537 114.87270624 60.92993007 113.21759047 56.875 111.5 C20.40213793 96.49525269 -22.16897207 97.76441099 -58.51953125 112.4140625 C-99.10473943 129.59778256 -128.97635682 161.57462515 -145.44873047 202.14013672 C-151.47601888 217.73476591 -153.80485256 233.79087817 -155.3125 250.375 C-186.3325 250.375 -217.3525 250.375 -249.3125 250.375 C-249.3125 223.63679189 -249.3125 223.63679189 -247.6875 213.9375 C-247.51001221 212.82044678 -247.33252441 211.70339355 -247.1496582 210.55249023 C-240.28784236 169.30881393 -224.24510056 130.32847677 -198.3125 97.375 C-197.55453125 96.405625 -196.7965625 95.43625 -196.015625 94.4375 C-184.23716404 79.73530759 -171.14153301 66.00601353 -156.3125 54.375 C-155.3740625 53.60800781 -154.435625 52.84101563 -153.46875 52.05078125 C-143.68126916 44.21827403 -133.0916389 37.74761318 -122.3125 31.375 C-121.65024414 30.98038574 -120.98798828 30.58577148 -120.30566406 30.17919922 C-98.82418632 17.53651528 -74.32547755 9.79291281 -50.0625 4.625 C-49.12913818 4.42608154 -48.19577637 4.22716309 -47.23413086 4.0222168 C-31.44413763 0.82693299 -16.0666681 -0.03248443 0 0 Z " fill="#F8D81B" transform="translate(249.3125,129.625)"/>
          <path d="M0 0 C0 33 0 66 0 100 C-7.26 100.66 -14.52 101.32 -22 102 C-26.04462333 102.65898231 -29.90950554 103.3229769 -33.875 104.25 C-34.82640869 104.46615967 -35.77781738 104.68231934 -36.75805664 104.9050293 C-63.07293337 111.13136664 -87.20813614 124.72137198 -107 143 C-107.87011719 143.78761719 -108.74023438 144.57523438 -109.63671875 145.38671875 C-138.78032919 173.02856504 -152.44066412 210.84730533 -156 250 C-187.02 250 -218.04 250 -250 250 C-250 223.26179189 -250 223.26179189 -248.375 213.5625 C-248.19751221 212.44544678 -248.02002441 211.32839355 -247.8371582 210.17749023 C-240.97534236 168.93381393 -224.93260056 129.95347677 -199 97 C-198.24203125 96.030625 -197.4840625 95.06125 -196.703125 94.0625 C-184.92466404 79.36030759 -171.82903301 65.63101353 -157 54 C-156.0615625 53.23300781 -155.123125 52.46601563 -154.15625 51.67578125 C-144.36876916 43.84327403 -133.7791389 37.37261318 -123 31 C-122.33774414 30.60538574 -121.67548828 30.21077148 -120.99316406 29.80419922 C-84.52730574 8.34262535 -41.7227787 0 0 0 Z " fill="#6DB911" transform="translate(250,130)"/>
          <path d="M0 0 C1.11980193 0.95048447 2.23827994 1.90252884 3.35620117 2.85522461 C4.29069344 3.65022621 4.29069344 3.65022621 5.24406433 4.46128845 C46.35362204 40.48524553 67.354509 101.40779435 73 154 C73 161.59 73 169.18 73 177 C41.98 177 10.96 177 -21 177 C-21.99 169.08 -22.98 161.16 -24 153 C-26.99660431 139.55808924 -31.17327007 127.42906911 -37 115 C-37.31308105 114.32984863 -37.62616211 113.65969727 -37.94873047 112.96923828 C-44.89846257 98.39650728 -54.70205053 85.89453647 -66.015625 74.453125 C-68 72 -68 72 -68 68 C-66.9380188 66.44582748 -66.9380188 66.44582748 -65.41845703 64.93743896 C-64.84629456 64.35977783 -64.27413208 63.7821167 -63.68463135 63.18695068 C-63.04878113 62.56548157 -62.41293091 61.94401245 -61.7578125 61.30371094 C-61.0945697 60.63988403 -60.4313269 59.97605713 -59.74798584 59.29211426 C-57.54967084 57.09658972 -55.33751882 54.91557747 -53.125 52.734375 C-51.59955409 51.21638799 -50.07498794 49.69751643 -48.55126953 48.17779541 C-44.53553432 44.17734385 -40.50793243 40.18904817 -36.4777832 36.203125 C-32.36861132 32.13484645 -28.27071821 28.05524246 -24.171875 23.9765625 C-16.12561226 15.9732189 -8.06677399 7.98266563 0 0 Z " fill="#BF1200" transform="translate(427,203)"/>
          <path d="M0 0 C0 3.80211506 -1.08148589 4.75845985 -3.375 7.75 C-6.53241456 11.95036791 -9.53092129 16.22070011 -12.421875 20.609375 C-16.49354679 26.75322217 -20.60645727 32.86785041 -24.7421875 38.96875 C-25.92189831 40.71092172 -27.1015856 42.45310936 -28.28125 44.1953125 C-30.09026857 46.86637976 -31.90005658 49.53691216 -33.71191406 52.20605469 C-35.49514917 54.83372929 -37.27517574 57.46355294 -39.0546875 60.09375 C-39.59326385 60.88551636 -40.13184021 61.67728271 -40.68673706 62.49304199 C-42.93706588 65.82385521 -45.13035974 69.14715572 -47.10180664 72.65161133 C-49.02807404 76.04952224 -51.11861354 79.25228823 -53.31640625 82.48046875 C-53.72509445 83.08235519 -54.13378265 83.68424164 -54.55485535 84.30436707 C-55.88834216 86.26705205 -57.22540517 88.22727166 -58.5625 90.1875 C-59.50383191 91.57160655 -60.4449087 92.95588664 -61.38574219 94.34033203 C-63.31533003 97.17906798 -65.24623826 100.0168985 -67.17822266 102.85400391 C-69.79358362 106.6954024 -72.40386427 110.54022131 -75.01171875 114.38671875 C-75.4081105 114.97136398 -75.80450226 115.55600922 -76.21290588 116.15837097 C-77.001551 117.32157066 -77.79019139 118.48477354 -78.5788269 119.64797974 C-81.66994496 124.20616463 -84.7641814 128.76223409 -87.8581543 133.31848145 C-88.62202206 134.44337757 -89.38585646 135.56829635 -90.1496582 136.6932373 C-108.50689916 163.72990034 -108.50689916 163.72990034 -115.55761719 173.91601562 C-116.61415819 175.44252782 -117.66929893 176.97000943 -118.72363281 178.49804688 C-120.58228333 181.18920769 -122.44673948 183.87626474 -124.3125 186.5625 C-124.88766357 187.39628174 -125.46282715 188.23006348 -126.05541992 189.08911133 C-137.09423026 204.9290755 -137.09423026 204.9290755 -147 208 C-153.77628859 208.92736723 -160.33975199 208.90022609 -166.34765625 205.34375 C-170.12745813 202.26986857 -172.47182055 198.58453834 -174 194 C-174.82528898 184.93361104 -174.55775721 177.44619945 -169 170 C-166.39352439 167.14452364 -163.73558939 164.47857796 -160.9140625 161.8359375 C-158.82876769 159.86674914 -156.95941493 157.81165347 -155.11083984 155.61962891 C-150.36699204 150.16877834 -145.22752747 145.1157177 -140.10287476 140.02770996 C-138.27487821 138.21264434 -136.45017044 136.39432699 -134.6262207 134.57519531 C-130.09843857 130.06068084 -125.56519193 125.55166663 -121.03210449 121.04248047 C-117.19033661 117.22054384 -113.35069298 113.39649624 -109.51376343 109.56970215 C-107.72844455 107.79079745 -105.94010861 106.01496604 -104.15161133 104.23925781 C-99.09496719 99.20520355 -94.12434977 94.15167568 -89.49020386 88.71951294 C-87.08817203 85.94786207 -84.50768784 83.36451459 -81.91015625 80.77734375 C-81.3619371 80.22816788 -80.81371796 79.678992 -80.24888611 79.11317444 C-79.1014768 77.96509162 -77.95283192 76.81824237 -76.80297852 75.67260742 C-75.066064 73.941053 -73.33456111 72.20421641 -71.60351562 70.46679688 C-70.47688294 69.34082512 -69.34994002 68.21516367 -68.22265625 67.08984375 C-67.71718765 66.58235092 -67.21171906 66.07485809 -66.69093323 65.55198669 C-64.01088221 62.8889219 -61.27154323 60.35406107 -58.39819336 57.90039062 C-52.44553691 52.73807271 -46.96154073 47.08486606 -41.40625 41.50390625 C-40.20721046 40.30299797 -39.00794723 39.102313 -37.80847168 37.90184021 C-34.67619792 34.76577715 -31.5469409 31.62672111 -28.41833496 28.48699951 C-25.2156273 25.27399999 -22.01003092 22.06388529 -18.8046875 18.85351562 C-12.53365211 12.57180629 -6.26580477 6.28692642 0 0 Z " 
          fill="var(--default-color)" transform="translate(384,187)"/>
        </svg>
      `;
      fgImgDiv.innerHTML += fgSvg;
      fgValue.classList.add("fear-greed-value");
      fgNum.classList.add("fg-number");
      fgNum.textContent = fgData.data.value;
      fgComment.classList.add("fg-comment");
      fgComment.textContent = fgData.data.value_classification;
      fgValue.append(fgNum, fgComment);
      fgInfo.append(fgImgDiv, fgValue);
      fgSentiment.append(commonMrktHeaderFG, fgInfo);
      mrktOverview.append(mcDaily, mrktDom, fgSentiment);
    }
  }catch(err){
	  //console.error(err); 
  }finally{
    if(mrktOverview){
      metricCovers.forEach(item => item.classList.remove("lz-metric-covers"));
      metricInfo.forEach(item => item.classList.remove("lz-metrics"));
    }
  }
}
getGlobalMetric();


/* trending/recent coins */
async function getTrending(){
  const lazyTrendingBox = document.createElement('div');
  const lazyRecentlyAddedBox = document.createElement('div');
  lazyTrendingBox.classList.add("lazy-trendbox-tag");
  lazyRecentlyAddedBox.classList.add("lazy-rabox-tag");
  lazyTrendingBox.innerHTML = `
    <div class="lazy"></div>
    <div class="lazy"></div>
    <div class="lazy"></div>
    <div class="lazy"></div>
  `;
  lazyRecentlyAddedBox.innerHTML = `
    <div class="lazy"></div>
    <div class="lazy"></div>
    <div class="lazy"></div>
    <div class="lazy"></div>
  `;
  trendingDiv.appendChild(lazyTrendingBox);
  raDiv.appendChild(lazyRecentlyAddedBox);

  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  try{
    const tRes = await fetch(`/api/trending-coins?timePeriod=1h&limit=4&tiers[]=1`, {signal});
    const rRes = await fetch(`/api/trending-coins?timePeriod=1h&limit=4&tiers[]=2`, {signal});
    if(!tRes.ok || !rRes.ok){
      throw new Error(`HTTP error! status code: ${tRes.status, rRes.status}`);
    }else{
      const lzyTB = document.querySelector(".lazy-trendbox-tag");
      const lzyRaB = document.querySelector(".lazy-rabox-tag");
      if (lzyTB || lzyRaB){
        lazyTrendingBox.remove();
        lazyRecentlyAddedBox.remove();
      }
      const tData = await tRes.json();
      const rData = await rRes.json();
      tData.data.coins.forEach((item, index)=>{
        const numSpan = document.createElement("span");
        const trendingTokenImg = document.createElement("img");
        const tokName = document.createElement("span");
        const tokSymbol = document.createElement("span");
        const trendingTokenVchange = document.createElement("div");
        const topTrending = document.createElement("div");
        topTrending.classList.add("top-trending");
        numSpan.classList.add("num");
        numSpan.textContent = index + 1;
        trendingTokenImg.src = tData.data.coins[index].iconUrl;
        trendingTokenImg.onerror = ()=> trendingTokenImg.src='./resources/images/general-purpose-cover.png';
        tokName.classList.add("token-name");
        tokName.textContent = tData.data.coins[index].name;
        tokSymbol.classList.add("token-symbol");
        tokSymbol.textContent = tData.data.coins[index].symbol;
        trendingTokenVchange.classList.add("token-value");
        trendingTokenVchange.textContent = tData.data.coins[index].change + "%";
        if(Math.sign(tData.data.coins[index].change) === 1){
          trendingTokenVchange.style.color = "var(--bullish)";
        }else{
          trendingTokenVchange.style.color = "var(--bearish)";
        }
      topTrending.append(numSpan, trendingTokenImg, tokName, tokSymbol, trendingTokenVchange);
      trendingDiv.append(topTrending);
      })

      rData.data.coins.forEach((item, index)=>{
        const numSpan = document.createElement("span");
        const trendingTokenImg = document.createElement("img");
        const tokName = document.createElement("span");
        const tokSymbol = document.createElement("span");
        const trendingTokenVchange = document.createElement("div");
        const raBlock = document.createElement("div");
        raBlock.classList.add("top-ra");
        numSpan.classList.add("num");
        numSpan.textContent = index + 1;
        trendingTokenImg.src = rData.data.coins[index].iconUrl;
        trendingTokenImg.onerror = ()=> trendingTokenImg.src='./resources/images/general-purpose-cover.png';
        tokName.classList.add("token-name");
        tokName.textContent = rData.data.coins[index].name;
        tokSymbol.classList.add("token-symbol");
        tokSymbol.textContent = rData.data.coins[index].symbol;
        trendingTokenVchange.classList.add("token-value");
        trendingTokenVchange.textContent = rData.data.coins[index].change + "%";
        if(Math.sign(rData.data.coins[index].change) === 1){
          trendingTokenVchange.style.color = "var(--bullish)";
        }else{
          trendingTokenVchange.style.color = "var(--bearish)";
        }
      raBlock.append(numSpan, trendingTokenImg, tokName, tokSymbol, trendingTokenVchange);
      raDiv.append(raBlock);
      })
    }
  }catch(err){
    clearTimeout(timeoutId);
    console.log(err)
  }
}
getTrending();


/* top coins */
const topCoinsSection = document.querySelector("#topcoins");
async function getTopCoins(){
  const lazyCoinBoxesBox = document.createElement('div');
    lazyCoinBoxesBox.classList.add("lazy-tag");
    const fragment = document.createDocumentFragment();
    const lazyCoinContainer = document.createElement("div");
      lazyCoinContainer.classList.add("lazycoins-div");
    for(let i=0;i<10;i++){
      const lazyCoinBox = document.createElement("div");
      lazyCoinBox.classList.add("lazycoins");
      const lazyCoinNameSkeleton = document.createElement("p");
      lazyCoinNameSkeleton.classList.add("coin-framework");
      const lazyCoinPriceSkeleton = document.createElement("p");
      lazyCoinPriceSkeleton.classList.add("coin-framework");
      const lazyCoinOtherSkeleton = document.createElement("p");
      lazyCoinOtherSkeleton.classList.add("coin-framework");
      lazyCoinBox.append(lazyCoinNameSkeleton, lazyCoinPriceSkeleton, lazyCoinOtherSkeleton);
      fragment.append(lazyCoinBox);   
    }
    lazyCoinBoxesBox.append(fragment);
    lazyCoinContainer.append(lazyCoinBoxesBox);
    topCoinsSection.appendChild(lazyCoinContainer);
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000)
  try{
    const res = await fetch(`/api/top-coins`, {signal});
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }else{
      if (lazyCoinBoxesBox) {
        lazyCoinBoxesBox.remove();
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
        topCoinBoxImg.src = `./resources/images/${data.data[index].name}.png`;
        topCoinBoxImg.onerror = ()=> topCoinBoxImg.src='./resources/images/general-purpose-cover.png';
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
    }
  }catch(err){
    clearTimeout(timeoutId);
    const fetchErr = document.createElement("div");
    fetchErr.classList.add("fetch-err");
    fetchErr.textContent = "Error! Unable to fetch coin metrics.";
    topCoinsBoxesBox.append(fetchErr);
    if(fetchErr){
      fetchErr.addEventListener("click", ()=>{
        topCoinsBoxesBox.innerHTML = "";
        getTopCoins();
      })
    }
    console.log(err);
  }finally{
    if (lazyCoinBoxesBox) {
      lazyCoinBoxesBox.remove();
    }
  }
}
getTopCoins();


/* news */
const newsDiv = document.querySelector(".news");
async function cryptoNews(){
  const lazyNews = document.createElement('div');
  lazyNews.classList.add("lazy-news");  
  const fragment = document.createDocumentFragment();
  for(let e=0;e<7;e++){
    const lazyArticle = document.createElement("div");
    lazyArticle.classList.add("lz-art");
    const lazyNewsImg = document.createElement("div");
    lazyNewsImg.classList.add("art-img-lz", "coin-framework");    
    const div = document.createElement("div");
    div.classList.add("div");
    const lazyArtTitle = document.createElement("div");
    lazyArtTitle.classList.add("art-title", "coin-framework");
    const lazyArtDesc = document.createElement("div");
    lazyArtDesc.classList.add("art-desc", "coin-framework");
    div.append(lazyArtTitle, lazyArtDesc);
    lazyArticle.append(lazyNewsImg, div);
    fragment.append(lazyArticle);   
  }
  lazyNews.append(fragment);
  newsDiv.appendChild(lazyNews);
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(()=>{
    controller.abort()
  }, 5000);
  try{
    const res = await fetch(`/api/news`, {signal});
    if(!res.ok){
      throw new Error(`HTTP error! status code: ${res.status}`);
    }else{
      if(lazyNews){
        lazyNews.remove();
      }
      refreshBtn.style.display = "flex";
      const data = await res.json();
      data.results.forEach((item, index) => {
        const article = document.createElement("div");
        article.addEventListener("click", ()=>{
          window.open(data.results[index].link, "_blank", "noopener, noreferrer");
        })
        const auth = document.createElement("div");
        const articleDivChild2 = document.createElement("div");
        const newsImg = document.createElement("img");
        const artTitle = document.createElement("div");
        const artDesc = document.createElement("div");
        const published = document.createElement("div");
        article.classList.add("article");
        auth.classList.add("auth");
        newsImg.classList.add("auth-img");
        newsImg.src = data.results[index].image_url;
        newsImg.onerror = ()=> newsImg.src='./resources/images/resolve-images-not-showing-problem-1.jpg';
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
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true
        }).format(utcDate).replace(",", " ").replace(/\//g,"-");     
        published.textContent = publishedDate;
        auth.append(newsImg);
        articleDivChild2.append(artTitle, artDesc, published);
        article.append(auth, articleDivChild2);
        newsDiv.append(article);
      })
    }
  }catch(err){
    clearTimeout(timeoutId);
    if(lazyNews){
        lazyNews.remove();
      }
    fetchErr.classList.add("fetch-err");
    fetchErr.textContent = "Error! Unable to fetch news data.";
    newsDiv.append(fetchErr);
    if(fetchErr){
      fetchErr.addEventListener("click", ()=>{
        newsDiv.innerHTML = "";
        cryptoNews();
      })
    }
    console.log(err);
  }
}
cryptoNews();


/* refresh */
refreshBtn.addEventListener("click", ()=>{
  newsDiv.innerHTML = "";
  refreshBtn.querySelector("span").textContent = "Refreshing...";
  refreshBtn.querySelector(".refresh-icon").classList.add("refresh-load");
  cryptoNews();
  setTimeout(()=>{
    refreshBtn.querySelector("span").textContent = "Refresh";
    refreshBtn.querySelector(".refresh-icon").classList.remove("refresh-load");
  }, 1500)
})
