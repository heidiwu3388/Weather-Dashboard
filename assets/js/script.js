const apiKey = "acb86fe319a24c757eca1a7db0fec11e";
let btnSearchEl = document.querySelector("#btn-search");
let cityInputEl = document.querySelector("#cityname");
let currentContainerEl = document.querySelector("#current-container");
let forecastContainerEl = document.querySelector("#forecast-container");

function getWeather(city) {
  // setup URL for current weather
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  // GET data from the API url
  fetch(currentUrl)
    .then(function (response) {
      console.log("current response: ", response);
      return response.json();
    })
    .then(function (data) {
      console.log("current data: ", data);
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

      // display current weather of the city
      let template = `
        <div class="col-12 flex-column align-start justify-space-around current-weather">
        <h1>${cityName} (${today})</h1>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon"</img>
        <h3>Temp: ${temp} F</h3>
        <h3>Wind: ${wind} MPH </h3>
        <h3>Humidity: ${humidity}% </h3>
        </div>
        <h2>5-Day Forecast:</h2>
      `;
      currentContainerEl.innerHTML = template;
    });
}

function getForecast(lat, lon) {
  console.log("latitude : ", lat);
  console.log("longitude : ", lon);

  // setup URL for 5-day forecast API
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(forecastUrl)
    .then(function (response) {
      console.log("forecast response: ", response);
      return response.json();
    })
    .then(function (data) {
      console.log("forecast data: ", data);
      console.log("data.list.length: ", data.list.length);

      let template = ``;
      for (let i = 7; i < data.list.length; i += 8) {
        console.log("i: ", i);
        let unixDate = data.list[i].dt;
        let date = moment(unixDate, "X").format("MM/DD/YYYY");
        let icon = data.list[i].weather[0].icon;
        let temp = data.list[i].main.temp;
        let wind = data.list[i].wind.speed;
        let humidity = data.list[i].main.humidity;
        template += `
            <div class="flex-column align-start justify-space-around forecast">
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon"</img>
                <p>Temp: ${temp} F</p>
                <p>Wind: ${wind} MPH</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        `;
      }
      forecastContainerEl.innerHTML = template;
    });
}

function searchCityWeather(event) {
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

  // get current weather of the city input
  getWeather(cityInput);
}

btnSearchEl.addEventListener("click", searchCityWeather);
