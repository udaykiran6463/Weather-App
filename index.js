const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-container");

const searchInput = document.querySelector("[data-searchInput]");



// initially varables needed
let currentTab = userTab;
const API_KEY1 = "iqkuxyxma64t08oaw7e8he4pcdvspoii3k0455dl";
const API_KEY = "59747ae19fb2aac71be533d29864a60e";

currentTab.classList.add("current-tab");


getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab?.classList.remove("current-tab");
        clickedTab.classList.add("current-tab");
        currentTab = clickedTab;

        searchInput.value = ""; // Clear the search input when switching tabs


        if(!searchForm.classList.contains("active")){
            userInfoContainer?.classList.remove("active");
            grantAccessContainer?.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
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


function getFromSessionStorage(){
    // chekc if corodintes are present in the session storage
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    // console.log(localCoordinates);
    if(!localCoordinates){
        // if no local coordinates
        grantAccessContainer?.classList?.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    // console.log(coordinates);
    const lati = coordinates.lat;
    const long = coordinates.lon;
    // console.log(long)
    // console.log(lati)

    // make grant container invisible 
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API CALL 
    try{
        // const response1 = await fetch(`https://www.meteosource.com/api/v1/free/point?lon=${long}&lat=${lati}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY1}`);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&appid=${API_KEY}`);
        const data = await response.json();
        // const data1 = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data,coordinates)
        // console.log(data);
    }
    catch(err){
        // pending
        loadingScreen.classList.remove("active");
        console.log("errrrrrrr");
        console.log(err);

    }
}


async function setIcon(coordinates){
    // console.log(coordinates);
    const lati = coordinates.lat;
    const long = coordinates.lon;
    const response1 = await fetch(`https://www.meteosource.com/api/v1/free/point?lon=${long}&lat=${lati}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY1}`);
    const data = await response1.json();
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    weatherIcon.src = `./assets/Weather-icons/${data.current.icon_num}.png`;
}



// async function setTemp(coordinates){
//     // console.log(coordinates);
//     const lati = coordinates.lat;
//     const long = coordinates.lon;
//     const response1 = await fetch(`https://www.meteosource.com/api/v1/free/point?lon=${long}&lat=${lati}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY1}`);
//     const data = await response1.json();
//     const temp = document.querySelector("[data-temp]")
//     // temp.innerText = data.current.temperature;
//     temp = Math.round(data.current.temperature) + 5;
//     console.log(temp);
//     temptext = "${temp} + °C";
//     temp.innerText = temptext;
// }
async function setTemp(coordinates) {
    const lati = coordinates.lat;
    const long = coordinates.lon;
    
    const response = await fetch(`https://www.meteosource.com/api/v1/free/point?lon=${long}&lat=${lati}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY1}`);
    
    const data = await response.json();
    
    const tempValue = Math.round(data.current.temperature); // Calculate temperature
    
    const tempText = `${tempValue} °C`; // Prepare temperature text
    
    const tempElement = document.querySelector("[data-temp]"); // Get DOM element where temperature will be displayed
    
    tempElement.innerText = tempText; // Set temperature text in the DOM
}



function renderWeatherInfo(weatherInfo,coordinates){
    // firstly fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudyness = document.querySelector("[data-cloud]");
    
    errorContainer.classList.remove("active");
    
    // --set city name
    cityName.innerText = weatherInfo?.city?.name;

    // --set country icon
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.city?.country.toLowerCase()}.png`;

    // --set weather description
    desc.innerText = weatherInfo?.list?.[1]?.weather?.[0]?.description;

    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.list?.[1]?.weather?.[0]?.icon}`;
    // console.log(weatherInfo.list[1].weather[0].icon);
    // --set weather icon
    setIcon(coordinates);

    // --set temperature
    setTemp(coordinates);

    // --set windspeed
    windSpeed.innerText = `${weatherInfo?.list[1]?.wind?.speed}Km/h`;

    // -- set humidity
    humidity.innerText = `${weatherInfo.list[1].main?.humidity}%`;

    // --set cloudyness
    cloudyness.innerText = `${weatherInfo?.list[1]?.clouds?.all}%`;

    let clouds = weatherInfo?.list[0]?.clouds?.all;
    console.log(clouds); // Check the value to see if it's getting properly assigned
    if (clouds !== undefined && clouds > 60) {
        setBackgroundDark();
    }
    else{
        setBackgroundLight();
    }
    // const userInfoContainer = document.querySelector(".user-info-container");
    // userInfoContainer.style.marginTop = "3rem";
    
    
}

function renderWeatherInfoSearch(weatherInfo,coordinates){
    // firstly fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudyness = document.querySelector("[data-cloud]");

    
    errorContainer.classList.remove("active");

    // --set city name
    cityName.innerText = weatherInfo?.name;

    // --set country icon
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    // --set weather description
    desc.innerText = weatherInfo?.weather[0]?.description;

    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.list?.[1]?.weather?.[0]?.icon}`;
    // console.log(weatherInfo.list[1].weather[0].icon);
    // --set weather icon
    setIcon(coordinates);

    // --set temperature
    setTemp(coordinates);

    // --set windspeed
    windSpeed.innerText = `${weatherInfo?.wind?.speed}Km/h`;

    // -- set humidity
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;

    // --set cloudyness
    cloudyness.innerText = `${weatherInfo?.clouds?.all}%`;

    let clouds = weatherInfo?.clouds?.all;
    if(weatherInfo?.clouds?.all > 60){
        setBackgroundDark();
    }
    else{
        setBackgroundLight();
    }

    // const weatherContainer = document.querySelector(".weather-container");
    // weatherContainer.style.margin = "2rem auto";

    // const userInfoContainer = document.querySelector(".user-info-container");
    // userInfoContainer.style.marginTop = "0rem";
}



function showPosition(position){
    const userCoordinates =  {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geo loaction support avalible");
    }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);



// for search weather


searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value; // Use 'value' to get the input value
    // console.log("cityName: ", cityName);
    if (cityName === "") {
        return;
    } 
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // console.log(data);

        let cords = {"lat":data?.coord?.lat,"lon":data?.coord?.lon};
        // console.log(data.coord.lat);
        // console.log(data.coord.lon);
        // console.log("cords: ",cords);
        renderWeatherInfoSearch(data,cords);
    }
// Assuming this code is within a try...catch block or error handling function
    catch (err) {
        console.log(err);
        userInfoContainer.classList.remove("active");

        if (errorContainer) {
            errorContainer.classList.add("active");
        }
    }
    
}


// setting background color
function setBackgroundDark() {
    const wrpr = document.querySelector(".wrapper");
    wrpr.style.backgroundColor = " #000000";
    wrpr.style.backgroundImage = "linear-gradient(315deg, #000000 0%, #414141 74%)";
    const loadImg = document.querySelector("[ldImg]");
    loadImg.style.filter = "hue-rotate(45deg) saturate(200%)";
}

// setting background color
function setBackgroundLight() {
    const wrpr = document.querySelector(".wrapper");
    wrpr.style.backgroundColor = "#7a7adb";
    wrpr.style.backgroundImage = "linear-gradient(160deg, #112d4e 0%, #3f72af 100%)";
    const loadImg = document.querySelector("[ldImg]");
    loadImg.style.filter = "invert(0%)"; // inverting the image completely
    
}


