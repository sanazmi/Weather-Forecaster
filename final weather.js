const apiKey = "eba02635cd7e0458fcc2140660a09227";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
// const addBtn = document.getElementById("addBtn");
const cityInput = document.getElementById("cityInput");
const weatherIcon = document.querySelector(".weather-icon");
const cityContainer = document.querySelector(".card2");

const historyInput = document.getElementById("historyInput");
const searchHistoryBtn = document.getElementById("searchHistoryBtn")



async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        console.log(data);

        if (!data.main || typeof data.main.temp === 'undefined' || typeof data.name === 'undefined') {
            console.error('Invalid data received:', data);
            return;
        }



        const cityElement = document.createElement("div");
        cityElement.className = "weather1";
        cityElement.innerHTML = `
            <img src="${getWeatherIcon(data.weather[0].main)}" class="weather-icon">
            <h1 class="temp" style="color: rgb(14, 13, 13);">${data.main.temp}°C</h1>
            <h2 class="city" style="color: rgb(14, 13, 13);">${data.name}</h2>
            <h3>Wind: ${data.wind.speed} m/s</h3>
            <h4> Humidity: ${ data.main.humidity }°C </h4>
            

            
            <button class="removeBtn"><img src=" ./remove1.png " style="width:20px; height: 20px;   background-color: #e5dbeb;"></button>
        `;


        function getWeatherIcon(weatherMain) {
            switch (weatherMain) {
                case "Clouds":
                    return "./cloudy.png";
                case "Clear":
                    return "./cloudy_sunny.png";
                case "Rain":
                    return "./rainy.png";
                case "Drizzle":
                    return "./drizzle.png";
                case "Mist":
                    return "./mist.png";
                default:
                    return "./w-f.png ";
            }
        }


        cityContainer.appendChild(cityElement);

        const removeBtn = cityElement.querySelector(".removeBtn");
        removeBtn.addEventListener("click", () => {
            removeCityFromLocalStorage(city);
            cityElement.remove();
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// adding +removing from local storage
function addCityToLocalStorage(city) {
    // Check if the city is a valid string (not empty and contains only letters)
    if (/^[A-Za-z ]+$/.test(city)) {
        let cities = JSON.parse(localStorage.getItem("cities")) || [];

        // Check if the city is not already present
        if (!cities.includes(city)) {
            cities.push(city);
            localStorage.setItem("cities", JSON.stringify(cities));
        } else {
            alert('City is already present!');
        }
    } else {
        alert('Invalid city. Please enter a valid city name.');
    }
}

function removeCityFromLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities = cities.filter(c => c !== city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

function loadCitiesFromLocalStorage() {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities.forEach(city => {
        checkWeather(city);
    });
}


// input+history 
cityInput.addEventListener("input", () => {
    let enteredCity = cityInput.value.trim().toLowerCase();
    cityInput.value = enteredCity;

    if (!isValidCity(enteredCity)) {
        alert('Invalid city. Please enter a valid city name :(');
    }
});

function isValidCity(city) {
    const doubleLetterRegex = /(.)\1/;
    const nonsenseWords = ['example1', 'example2', 'example3'];

    // Check for consecutive letters of the same alphabet type (vowels or consonants)
    const consecutiveLettersRegex = /([aeiouy])\1|([bcdfghjklmnpqrstvwxyz])\2/i;

    return !doubleLetterRegex.test(city) &&
        !nonsenseWords.includes(city) &&
        !consecutiveLettersRegex.test(city);
}


searchBtn.addEventListener("click", () => {
    const city = searchBox.value;

    // Check if the city is a valid string (not empty and contains only letters)
    if (/^[A-Za-z ]+$/.test(city)) {
        if (!isCityAlreadyPresent(city)) {
            checkWeather(city);
            addCityToLocalStorage(city);
        } else {
            alert('City is already present!');
        }
    } else {
        alert('Invalid city. Please enter a valid city name :)');
    }
});

function isCityAlreadyPresent(city) {
    // Check if the city is already in the local storage
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (cities.includes(city)) {
        return true;
    }

    // Check if the city is already displayed on the page
    const displayedCities = Array.from(document.querySelectorAll(".weather1 .city")).map(cityElement => cityElement.textContent.trim().toLowerCase());
    return displayedCities.includes(city.toLowerCase());
}


// addbutton
// addBtn.addEventListener("click", () => {
//     const city = searchBox.value.trim();
//     if (city !== "") {
//         checkWeather(city);
//         addCityToLocalStorage(city);

//     }
// });





window.addEventListener("load", loadCitiesFromLocalStorage);

// scroll button

let mybutton = document.getElementById("myBtn");

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}