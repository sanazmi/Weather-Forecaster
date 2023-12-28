const apiKey = "eba02635cd7e0458fcc2140660a09227";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    // three cities , make the pic loading , remove humidity and wind speed .
    var data = await response.json();

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = data.main.temp + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";


    if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "./cloudy.png"
    } else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "./cloudy_sunny.png"
    } else if (data.weather[0].main == "Rainy") {
        weatherIcon.src = "./rainy.png"
    } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "./drizzle.png"
    } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "./mist.png"
    }

}


searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
})