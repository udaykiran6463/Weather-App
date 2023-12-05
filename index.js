const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initially varables needed
let currentTab = userTab;
const API_KEY = "iqkuxyxma64t08oaw7e8he4pcdvspoii3k0455dl";

currentTab.classList.add("current-tab");
// one task is still pending

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab?.classList.remove("current-tab");
        clickedTab.classList.add("current-tab");
        currentTab = clickedTab;
    }
    
}

userTab.addEventListener("click",()=>{
    // pass clicked tab as input
    switchTab(userTab);
    
});

searchTab.addEventListener("click",()=>{
    // pass clicked tab as input
    switchTab(searchTab);
});


