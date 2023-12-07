const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initially varables needed
let currentTab = userTab;
const API_KEY1 = "iqkuxyxma64t08oaw7e8he4pcdvspoii3k0455dl";
const API_KEY = "59747ae19fb2aac71be533d29864a60e";

currentTab.classList.add("current-tab");
// one task is still pending

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab?.classList.remove("current-tab");
        clickedTab.classList.add("current-tab");
        currentTab = clickedTab;

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
    if(!localCoordinates){
        // if no local coordinates
        grantAccessContainer?.classList?.add("active");
    }
    else{
        const coordinates = json.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    console.log(coordinates);
    const lati = coordinates.lat;
    const long = coordinates.lon;
    console.log(long)
    console.log(lati)

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
        console.log(data);

    }
    catch(err){
        // pending
        loadingScreen.classList.remove("active");
        console.log("errrrrrrr");
        console.log(err);

    }
}


async function setIcon(coordinates){
    console.log(coordinates);
    const lati = coordinates.lat;
    const long = coordinates.lon;
    const response1 = await fetch(`https://www.meteosource.com/api/v1/free/point?lon=${long}&lat=${lati}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY1}`);
    const data = await response1.json();
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    weatherIcon.src = `./assets/Weather-icons/${data.current.icon_num}.png`;
}



async function setTemp(coordinates){
    console.log(coordinates);
    const lati = coordinates.lat;
    const long = coordinates.lon;
    const response1 = await fetch(`https://www.meteosource.com/api/v1/free/point?lon=${long}&lat=${lati}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY1}`);
    const data = await response1.json();
    const temp = document.querySelector("[data-temp]")
    temp.innerText = data.current.temperature;
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
    windSpeed.innerText = weatherInfo?.list[0]?.wind?.speed;

    // -- set humidity
    humidity.innerText = weatherInfo.list[1].main?.humidity;

    // --set cloudyness
    cloudyness.innerText = weatherInfo?.list[0]?.clouds?.all;
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
    windSpeed.innerText = weatherInfo?.wind?.speed;

    // -- set humidity
    humidity.innerText = weatherInfo?.main?.humidity;

    // --set cloudyness
    cloudyness.innerText = weatherInfo?.clouds?.all;
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

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value; // Use 'value' to get the input value
    console.log("cityName: ", cityName);
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
        console.log(data);

        let cords = {"lat":data?.coord?.lat,"lon":data?.coord?.lon};
        console.log(data.coord.lat);
        console.log(data.coord.lon);
        console.log("cords: ",cords);
        renderWeatherInfoSearch(data,cords);
    }
    catch(err){
        console.log(err);
    }
}
