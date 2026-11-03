import "./style.css";
import partiallyCloudyDay from "./assets/partly-cloudy-day.svg";
import clearDay from "./assets/clear-day.svg";
import rain from "./assets/rain.svg";
import humidityIcon from "./assets/humidity.svg";
import windIcon from "./assets/wind-icon.svg";

const apiKey = "P2YQ8DGWU9H47DW8LUS64L73T";
const search = document.getElementById("search-btn");
const searchInput = document.getElementById("search");
const weatherInfoContainer = document.querySelector(".weather-info");

const city = () => {
  const userCity = searchInput.value.trim();
  return userCity;
};

function searchCity(e) {
  e.preventDefault();
  const location = city();
  searchInput.value = "";

  getWeather(location);
  weatherInfoContainer.innerHTML = "";
}

async function getWeather(searchCity) {
  const queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchCity}?unitGroup=us&include=days%2Calerts%2Chours%2Ccurrent&key=${apiKey}&contentType=json`;

  try {
    const response = await fetch(`${queryUrl}`);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function displayWeather(weatherInfo) {
  const address = weatherInfo.address;
  const formattedAddress =
    address[0].toUpperCase() + address.substring(1).toLowerCase();

  const condition = weatherInfo.currentConditions.conditions;
  const humidity = weatherInfo.currentConditions.humidity;
  const wind = weatherInfo.currentConditions.windspeed;
  const feelslike = weatherInfo.currentConditions.feelslike;

  console.log(condition); //Log the current condition in that locality
  const conditionImage = document.createElement("div");

  function showAddress() {
    const locality = document.createElement("h2");
    locality.textContent = `${formattedAddress}`;
    weatherInfoContainer.appendChild(locality);
  }

  function insertConditionImg() {
    const conditionIcon = document.createElement("img");

    switch (condition) {
      case "Partially cloudy":
      case "Partly cloudy":
      case "Cloudy":
        conditionIcon.src = `${partiallyCloudyDay}`;
        break;
      case "Clear":
        conditionIcon.src = `${clearDay}`;
        break;
      case "Overcast":
      case "Rain":
        conditionIcon.src = `${rain}`;
        break;
      default:
        conditionIcon.src = "";
    }

    conditionImage.appendChild(conditionIcon);
    weatherInfoContainer.appendChild(conditionImage);
  }

  function showMainCondition() {
    const mainCondition = document.createElement("div");
  }

  function showOtherConditions() {
    const otherConditionBox = document.createElement("div");
    const humidityBox = document.createElement("div");
    const windBox = document.createElement("div");

    humidityBox.innerHTML = /*html*/ `
      <div class="header">
        <div class="title">Humidity</div>
        <div class="icon-container">
          <img src=${humidityIcon} alt="humidity icon">
        </div>
      </div>
      <h1>${humidity}%</h1>
    `;

    windBox.innerHTML = /*html*/ `
      <div class="header">
        <div class="title">Wind</div>
        <div class="icon-container">
          <img src=${windIcon} alt="windspeed icon">
        </div>
      </div>
      <h1>${wind}mph</h1>
    `;

    otherConditionBox.appendChild(humidityBox);
    otherConditionBox.appendChild(windBox);
    weatherInfoContainer.appendChild(otherConditionBox);
  }

  showAddress();
  insertConditionImg();
  showOtherConditions();

  if (weatherInfoContainer !== "") {
    weatherInfoContainer.style.border = "1px solid black";
  }
}

search.addEventListener("click", searchCity);
