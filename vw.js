const apiKey = "eba02635cd7e0458fcc2140660a09227";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const cityContainer = document.querySelector(".weather");
const historyContainer = document.querySelector(".history");
const historySearchInput = document.getElementById("historySearchInput");
historySearchInput.addEventListener("input", updateHistoryUI);

let searchedCities = [];

function saveToLocalStorage() {
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
}

function getFromLocalStorage() {
    const storedCities = localStorage.getItem("searchedCities");
    return storedCities ? JSON.parse(storedCities) : [];
}


async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error(`City not found: ${city}`);
        }


        const data = await response.json();
        console.log(data);

        const cityElement = document.createElement("div");
        cityElement.className = "weather1";
        cityElement.innerHTML = `
        <img src="${getWeatherIcon(data.weather[0].main)}" class="weather-icon">
        <h4 class="temp">${data.main.temp}°C</h4>
        <h4>Wind: ${data.wind.speed} m/s</h4>
        <h4>Humidity: ${data.main.humidity}°C</h4>
        <h4>Sunrise: ${formatTime(data.sys.sunrise)} </h4>
        <h4>Sunset: ${formatTime(data.sys.sunset)}</h4>
        <br>
        <h4 class="city">${data.name}</h4>
        `;

        function formatTime(timestamp) {
            const date = new Date(timestamp * 1000);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        }

        function getWeatherIcon(weatherMain) {
            switch (weatherMain) {
                case "Clouds":
                    return "./Source/Weather/cloudy-removebg-preview.png";
                case "Clear":
                    return "./Source/Weather/cloudy_sunny-removebg-preview.png";
                case "Rain":
                    return "./Source/Weather/rainy-removebg-preview.png";
                case "Drizzle":
                    return "./Source/Weather/drizzle-removebg-preview.png";
                case "Mist":
                    return "./Source/Weather/mist-removebg-preview.png";
                default:
                    return "./Source/Weather/download-removebg-preview (1).png";
            }
        }
        if (!searchedCities.some(item => item.name === data.name)) {
            searchedCities.push({
                name: data.name,
                temp: data.main.temp,
                image: getWeatherIcon(data.weather[0].main),
                wind: data.wind.speed,
                hum: data.main.humidity,
                sunrise: formatTime(data.sys.sunrise),
                sunset: formatTime(data.sys.sunset)
            });
            saveToLocalStorage();
        }
        updateHistoryUI();

        cityContainer.innerHTML = "";
        cityContainer.appendChild(cityElement);
    } catch (error) {
        console.error(error);
        const cityError = document.createElement("div");
        cityError.className = "weather1";
        cityError.innerHTML = `
        <img src="./Source/Weather/kisspng-error-computer-icons-orange-error-icon-5ab143d3089ac7.8478409115215666750353-removebg-preview.png" class="error">
        <h4 class="error1">${error.message}</h4>`;
        cityContainer.innerHTML = "";
        cityContainer.appendChild(cityError);
    }

}


function updateHistoryUI() {
    historyContainer.innerHTML = "";

    const historySearchInput = document.getElementById("historySearchInput");
    const searchFilter = historySearchInput.value.toLowerCase();

    const filteredCities = searchedCities.filter(city => city.name.toLowerCase().includes(searchFilter));

    for (const city of filteredCities) {
        const historyItem = document.createElement("div");
        historyItem.className = "weather2";
        historyItem.innerHTML = `
            <img src="${city.image}" class="weather-icon1">
            <h4>${city.name}</h4>
            <p>${city.temp}°C</p>
            <p>Wind: ${city.wind} m/s</p>
            <p>Humidity: ${city.hum}°C</p>
            <p>Sunrise: ${city.sunrise}</p>
            <p>Sunset: ${city.sunset}</p>
            <button class="remove-btn" data-city="${city.name}"><img src="./Source/Weather/image-removebg-preview.png"></button>
        `;
        historyContainer.appendChild(historyItem);
    }

    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const cityName = button.getAttribute("data-city");
            removeCityFromHistory(cityName);
            removeFromLocalStorage(cityName);
        });
    });
}

function removeCityFromHistory(cityName) {
    searchedCities = searchedCities.filter(city => city.name !== cityName);
    saveToLocalStorage();
    updateHistoryUI();
}

function removeFromLocalStorage(cityName) {
    const storedCities = getFromLocalStorage();
    const updatedCities = storedCities.filter(city => city.name !== cityName);
    localStorage.setItem("searchedCities", JSON.stringify(updatedCities));
}


searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    }
});


searchedCities = getFromLocalStorage();

updateHistoryUI();