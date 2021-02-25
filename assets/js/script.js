var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#search-history-container");
var currentWeatherContainerEl = document.querySelector("#current-weather-container");
var futureWeatherContainerEl = document.querySelector("#future-weather-container");

var displayCurrentWeather = function(city) {
    var cityTitle = document.createElement("h2");
    cityTitle.textContent = city + " (" + moment().format('MM/DD/YYYY') + ")";
    var curWeatherIconContainer = document.createElement("span");
    var curWeatherIcon = document.createElement("i");
    var curTemp = document.createElement("p");
    curTemp.textContent = "Temperature:  ";
    var curHumi = document.createElement("p");
    curHumi.textContent = "Humidity: ";
    var curWind = document.createElement("p");
    curWind.textContent = "Wind Speed:  ";
    var curUvInd = document.createElement("p");
    curUvInd.textContent = "UV Index:  ";

    currentWeatherContainerEl.appendChild(cityTitle);
}

var getWeather = function(city) {
    /* var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=1234";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(city);
                displayFutureWeather();
            });
        } else {
            alert("Error: " + response.statusText);
        }
    }); */
    displayCurrentWeather(city);
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        currentWeatherContainerEl.textContent = "";
        getWeather(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);