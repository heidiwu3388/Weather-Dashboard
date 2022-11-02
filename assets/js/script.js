const apiKey = "acb86fe319a24c757eca1a7db0fec11e";
let btnSearchEl = document.querySelector("#btn-search");
let cityInputEl = document.querySelector("#cityname");
let resultContainerEl = document.querySelector(".result-container");

function searchCityWeather(event) {
  event.preventDefault();
  // get city name from user input, return if no input
  let city = cityInputEl.value.trim();
  if (city.length === 0) {
    return;
  }

  // clear city input
  cityInputEl.value = "";

  // get current weather
  let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(currentUrl)
    .then(function (response) {
        console.log("response: \n", response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let cityName = data.name;
      let today = moment().format("MM/DD/YYYY");
      let icon = data.weather[0].icon;
      let temp = data.main.temp;
      let wind = data.wind.speed;
      let humidity = data.main.humidity;

      let template = `
      <div class="col-12 flex-column align-start current-weather">
        <h1>${cityName} (${today})</h1>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon"</img>
        <h3>Temp: ${temp} F</h3>
        <h3>Wind: ${wind} MPH </h3>
        <h3>Humidity: ${humidity}% </h3>
        </div>
      `;
      resultContainerEl.innerHTML = template;
    });

  // get 5 days forecast
  let forecastUrl = ``;
}

btnSearchEl.addEventListener("click", searchCityWeather);
