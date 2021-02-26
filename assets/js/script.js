var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#search-history-container");
var currentWeatherContainerEl = document.querySelector("#current-weather-container");
var futureWeatherContainerEl = document.querySelector("#future-weather-container");

var getUVIndex = function(data, city) {
    fetch('http://api.openweathermap.org/data/2.5/uvi?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&appid=APIKEY&limit=1').then(function(response) {
        if (response.ok) {
            response.json().then(function(data2) {
                var uvIndex = data2.value;
                displayCurrentWeather(data, city, uvIndex);
            })
        }
    })
}

var displayCurrentWeather = function(data, city, uvIndex) {
    currentWeatherContainerEl.style.border = "2px solid #F8F9FA";
    var cityTitle = document.createElement("h2");
    cityTitle.innerHTML = city + " <span>(" + moment().format('MM/DD/YYYY') + ")" + "<img src='http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png' /></span>";
    var curTemp = document.createElement("p");
    curTemp.textContent = "Temperature:  " + data.main.temp + " \u00B0" + "F";
    var curHumi = document.createElement("p");
    curHumi.textContent = "Humidity: " + data.main.humidity + "%";
    var curWind = document.createElement("p");
    curWind.textContent = "Wind Speed:  " + data.wind.speed + " MPH";
    var curUvIndContainer = document.createElement("p");
    curUvIndContainer.textContent = "UV Index: ";
    var curUvInd = document.createElement("span");
    curUvInd.style.padding = "5px 10px";
    curUvInd.style.color = "#FFF";
    curUvInd.style.borderRadius = "5px";
    curUvInd.innerHTML = uvIndex;

    if (uvIndex < 3) {
        curUvInd.style.backgroundColor = "#8DC443";
    } else if (uvIndex < 6) {
        curUvInd.style.backgroundColor = "#FDD835";
    } else if (uvIndex < 8) {
        curUvInd.style.backgroundColor = "#FFB301";
    } else if (uvIndex < 11) {
        curUvInd.style.backgroundColor = "#D1394A";
    } else {
        curUvInd.style.backgroundColor = "#954F71";
    }

    curUvIndContainer.appendChild(curUvInd);
    currentWeatherContainerEl.appendChild(cityTitle);
    currentWeatherContainerEl.appendChild(curTemp);
    currentWeatherContainerEl.appendChild(curHumi);
    currentWeatherContainerEl.appendChild(curWind);
    currentWeatherContainerEl.appendChild(curUvIndContainer);
}

var displayFutureWeather = function(data, city) {

}

var getWeather = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=APIKEY&limit=1';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getUVIndex(data, city);
                //displayFutureWeather();
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
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