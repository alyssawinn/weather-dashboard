var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#search-history-container");
var currentWeatherContainerEl = document.querySelector("#current-weather-container");
var futureWeatherContainerEl = document.querySelector("#future-weather-container");
var searchHistoryItems = [];

var getUVIndex = function(data, city) {
    fetch('http://api.openweathermap.org/data/2.5/uvi?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&appid=YOUR_API_KEY_HERE&limit=1').then(function(response) {
        if (response.ok) {
            response.json().then(function(data2) {
                var uvIndex = data2.value;
                displayCurrentWeather(data, city, uvIndex);
            })
        }
    })
};

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

var getCurrentWeather = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=YOUR_API_KEY_HERE&limit=1';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getUVIndex(data, city);
                getFutureWeather(data.coord.lon, data.coord.lat)
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var getFutureWeather = function(longitude, latitude) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=current,minutely,hourly,alerts&units=imperial&appid=YOUR_API_KEY_HERE&limit=1';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayFutureWeather(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var displayFutureWeather = function(data) {
    var dayCount = 1;
    var currentDate = moment().format("MM/DD/YYYY");
    futureWeatherContainerEl.className = "future-weather-container";
    var cardContainerEl = document.createElement("div");
    cardContainerEl.className = "card-container";
    
    for (var i = 1; i < 6; i++) {
        var nextDay = moment(currentDate, "MM/DD/YYYY").add(dayCount, 'days');
        var nextDayFormatted = moment(nextDay, "MM/DD/YYYY").format("MM/DD/YYYY");
        dayCount++;
        var cardEl = document.createElement("div");
        cardEl.classList = "card col-12 col-sm-2";
        var cardDate = document.createElement("h4");
        cardDate.textContent = nextDayFormatted;
        var cardIcon = document.createElement("img");
        cardIcon.src = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png';
        cardIcon.style.width = "50px";
        var cardTemp = document.createElement("p");
        cardTemp.textContent = "Temp:  " + data.daily[i].temp.day + " \u00B0" + "F";
        var cardHum = document.createElement("p");
        cardHum.textContent = "Humidity: " + data.daily[i].humidity + "%";

        futureWeatherContainerEl.appendChild(cardContainerEl);
        cardContainerEl.appendChild(cardEl);
        cardEl.appendChild(cardDate);
        cardEl.appendChild(cardIcon);
        cardEl.appendChild(cardTemp);
        cardEl.appendChild(cardHum);
    }
}

var getSearchHistory = function() {
    searchHistoryItems = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchHistoryItems) {
        return false;
    }

    for(var i = 0; i < searchHistoryItems.length; i++) {
        loadSearchHistory(searchHistoryItems[i]);
    } 
}

var loadSearchHistory = function(city) {
    var searchedCityEl = document.createElement("div");
    searchedCityEl.classList = "col-12 searched-city";
    searchedCityEl.textContent = city;
    searchHistoryEl.appendChild(searchedCityEl);
}

var saveSearchHistory = function() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryItems));
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        currentWeatherContainerEl.textContent = "";
        futureWeatherContainerEl.textContent = "";
        getCurrentWeather(city);

        if (searchHistoryItems.includes(city)) {
            //do nothing
        } else {
            if (searchHistoryItems.length >= 8) {
                searchHistoryItems.shift();
                searchHistoryItems.push(city);
            } else {
                searchHistoryItems.push(city);
            }
        }

        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
    searchHistoryEl.textContent = "";
    saveSearchHistory();
    getSearchHistory();
};

var searchedCityClickHandler = function(event) {
    event.preventDefault();
    var targetEl = event.target;

    if (targetEl.matches(".searched-city")) {
        cityInputEl.value = targetEl.innerHTML;
        document.getElementById("search-button").click();
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryEl.addEventListener("click", searchedCityClickHandler);

getSearchHistory();