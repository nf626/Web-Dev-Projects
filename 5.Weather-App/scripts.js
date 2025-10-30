import {ausCities} from "./city.js";

// Weather API Key from OpenWeatherMap
const weatherKey = "";

const suggestList = document.getElementById("js-list");
const searchInput = document.getElementById("js-search-input");

// User enters city to search
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    suggestList.innerHTML = "";

    if (!searchTerm.length) return;

    // Find matching Aus cities
    const filteredList = ausCities.filter(city =>
        city.name.toLowerCase().startsWith(searchTerm)
    );

    // Dropdown menu
    filteredList.forEach(city => {
        const listItem = document.createElement("li");
        listItem.textContent = city.name;

        // Select city from menu
        listItem.addEventListener("click", () => {
            searchInput.value = city.name;
            suggestList.innerHTML = "";
        });
        suggestList.appendChild(listItem);
    });
});

searchInput.addEventListener("blur", () => {
    setTimeout(() => {
        suggestList.innerHTML = "";
    }, 150);
});

// Send city name to get weather details
const searchButton = document.getElementById("js-search-button");
searchButton.addEventListener("click", async () => {
    await fetchWeather(searchInput.value);
    searchInput.value = "";
});

/**
 * Fetch weather information from API.
 * @param {string} city - Name of city.
 * @throws {Error} If API fails.
 */
async function fetchWeather(city) {
    const urls = [
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`,
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherKey}&units=metric`
    ];

    const fetchPromises = urls.map(url => fetch(url)); // Creates new array

    try {
        const responses = await Promise.all(fetchPromises);
        const weatherPromises = responses.map(response => {
            if (!response.ok) {
                throw new Error("No city matches.", response.status);
            }
            return response.json(); // Return a promise
        });
        const weatherData = await Promise.all(weatherPromises);
        displayWeather(weatherData[0], weatherData[1]);
        backgroundImage(weatherData[0].weather[0].main);

    } catch (error) {
        console.log(error);
    }
}

/**
 * Displays Current and Forecasted Weather data.
 * @param {object} currentData - Current weather object.
 * @param {object} forecastData - Forecast weather object.
 */
function displayWeather(currentData, forecastData) {
    // Current weather details
    const currentTitle = currentData.name;
    const currentIcon = currentData.weather[0].icon;
    const currentDescription = currentData.weather[0].description;
    const currentTemp = Math.round(currentData.main.temp);

    const weatherIcon = document.querySelector(".image");
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="weather icon" width="80" height="80">`;

    document.querySelector(".js-name").textContent = currentTitle;
    document.querySelector(".js-temp").textContent = currentTemp + " " + "°C";
    document.querySelector(".js-description").textContent = currentDescription;

    // 5-days forecast weather details
    const foreCastDays = document.querySelectorAll(".js-forecast");
    foreCastDays.forEach((day, index) => {
        const forecastList = forecastData.list[index * 8]; // day - 24 hour interval
        const forecastIcon = forecastList.weather[0].icon;
        const week = new Date(forecastList.dt_txt);
        const ausWeekDay = new Intl.DateTimeFormat("en-AU", { weekday: "long" }).format(week);
        
        day.querySelector(".js-day").textContent = ausWeekDay;
        day.querySelector(".js-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="icon" width="50" height="50">`;
        day.querySelector(".js-forecast-temp").textContent = Math.round(forecastList.main.temp) + " " + "°C";
    });
}

/**
 * Change background to current weather reading.
 * @param {string} weather - Current weather.
 */
function backgroundImage(weather) {
    const body = document.body;
    body.className = "";

    const weatherBorder = document.querySelector(".weatherStatus");
    const forecastBorder = document.querySelectorAll(".js-forecast");

    switch (weather) {
        case "Clear":
            body.classList.add("clear");
            
            weatherBorder.style.border = "2px solid rgba(0, 0, 0, 0.4)";
            weatherBorder.style.borderRadius = "15px";
            weatherBorder.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";

            forecastBorder.forEach(border => {
                border.style.border = "1px solid rgba(0, 0, 0, 0.4)";
                border.style.borderRadius = "15px";
                border.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";
            });

            break;

        case "Rain":
        case "Drizzle":
            body.classList.add("rainy");
            
            weatherBorder.style.border = "2px solid rgba(0, 0, 0, 0.4)";
            weatherBorder.style.borderRadius = "15px";
            weatherBorder.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";

            forecastBorder.forEach(border => {
                border.style.border = "1px solid rgba(0, 0, 0, 0.4)";
                border.style.borderRadius = "15px";
                border.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";
            });

            break;

        case "Clouds":
            body.classList.add("cloudy");
            
            weatherBorder.style.border = "2px solid rgba(0, 0, 0, 0.4)";
            weatherBorder.style.borderRadius = "15px";
            weatherBorder.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";

            forecastBorder.forEach(border => {
                border.style.border = "1px solid rgba(0, 0, 0, 0.4)";
                border.style.borderRadius = "15px";
                border.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";
            });

            break;

        case "Thunderstorm":
        body.classList.add("storm");
        
        weatherBorder.style.border = "2px solid rgba(0, 0, 0, 0.4)";
        weatherBorder.style.borderRadius = "15px";
        weatherBorder.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";

        forecastBorder.forEach(border => {
            border.style.border = "1px solid rgba(0, 0, 0, 0.4)";
            border.style.borderRadius = "15px";
            border.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";
        });

        break;

        case "Snow":
        body.classList.add("snow");
        
        weatherBorder.style.border = "2px solid rgba(0, 0, 0, 0.4)";
        weatherBorder.style.borderRadius = "15px";
        weatherBorder.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";

        forecastBorder.forEach(border => {
            border.style.border = "1px solid rgba(0, 0, 0, 0.4)";
            border.style.borderRadius = "15px";
            border.style.boxShadow = "inset 0 0 10px rgb(175, 175, 175)";
        });

        break;
    }
}
