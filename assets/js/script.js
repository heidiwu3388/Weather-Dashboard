// select elements and store them in variables
let cityFormEl = document.querySelector("#city-form");
let cityInputEl = document.querySelector("#cityname");
let currentContainerEl = document.querySelector("#current-container");
let forecastContainerEl = document.querySelector("#forecast-container");
let cityListEl = document.querySelector("#city-list");
// keep the API key in a const variable
const apiKey = "acb86fe319a24c757eca1a7db0fec11e";
// declare a varible to store the city search history
let cities = [];


function renderCityHistoryList() {
  // get all cities from local storage
  cities = JSON.parse(localStorage.getItem("cities") || "[]");
  // built HTML for buttons of the cities
  let template = ``;
  for (let i = 0; i < cities.length; i++) {
    template += `
      <button class="btn">${cities[i]}</button>
    `;
  }
  cityListEl.innerHTML = template;
}

// get 5-day forecast using the parameters lat (latitude) and lon (longitue)
function getForecast(lat, lon) {
  // setup URL for 5-day forecast API
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  // call the API
  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let template = ``;
      // since the list has 40 records, 8 records for each day
      // the first one to pick is the 8th record which is for the day after today
      // then get data for every 8 records
      for (let i = 7; i < data.list.length; i += 8) {
        // get the required data
        let unixDate = data.list[i].dt;
        let date = moment(unixDate, "X").format("MM/DD/YYYY");
        let icon = data.list[i].weather[0].icon;
        let temp = data.list[i].main.temp;
        let wind = data.list[i].wind.speed;
        let humidity = data.list[i].main.humidity;
        // build the HTML to display 5-day forecast
        template += `
            <div class="flex-column align-start justify-space-around forecast">
                <h3>${date}</h3>
                <img src="https://openweathermap.org/img/w/${icon}.png" alt="weather icon"</img>
                <p>Temp: ${temp} F</p>
                <p>Wind: ${wind} MPH</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        `;
      }
      forecastContainerEl.innerHTML = template;
    });
}

function getWeather(city) {
  // setup URL for current weather
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  // GET current weather from the API url
  fetch(currentUrl)
    .then(function (response) {
      // error handling
      if (response.status !== 200) {
        alert(`${city} not found`);
        throw new Error("city not found");
      }
      return response.json();
    })
    .then(function (data) {
      // store all information required in variables
      let cityName = data.name;
      let today = moment().format("MM/DD/YYYY");
      let icon = data.weather[0].icon;
      let temp = data.main.temp;
      let wind = data.wind.speed;
      let humidity = data.main.humidity;

      // get geographical coordinate for the city
      let latitude = data.coord.lat;
      let longitude = data.coord.lon;
      // use coordinate of the city to get 5-day forecast
      getForecast(latitude, longitude);

      // build the HTML to display current weather of the city
      let template = `
        <div class="col-12 flex-column align-start justify-space-around current-weather">
        <h1>${cityName} (${today})</h1>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="weather icon"</img>
        <h3>Temp: ${temp} F</h3>
        <h3>Wind: ${wind} MPH </h3>
        <h3>Humidity: ${humidity}% </h3>
        </div>
        <h2>5-Day Forecast:</h2>
      `;
      currentContainerEl.innerHTML = template;

      // add the current city to the array "cities" if it's not already there
      if (!cities.includes(cityName)) {
        cities.push(cityName);
      }
      // store updated cities to local storage
      localStorage.setItem("cities", JSON.stringify(cities));
      // render city history list for display
      renderCityHistoryList();
    })
    .catch(function(error){
      console.log(error);
    });
}

function getWeatherByInput(event) {
  // prvent default for form input
  event.preventDefault();
  // get city name from user input, return if no input
  let cityInput = cityInputEl.value.trim();
  if (cityInput.length === 0) {
    alert("Please input a city!");
    return;
  }
  // clear city input
  cityInputEl.value = "";
  // get weather of the city input
  getWeather(cityInput);
}

function getWeatherByButton(event) {
  if (event.target.matches("button")) {
    // clear city input
    cityInputEl.value = "";
    // get weather of the city on the button
    getWeather(event.target.textContent);
  }
}

// *** start here ***
renderCityHistoryList();
cityFormEl.addEventListener("submit", getWeatherByInput);
cityListEl.addEventListener("click", getWeatherByButton);
