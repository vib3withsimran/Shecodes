// It's better practice to select the form itself
const searchForm = document.querySelector("header form");
const searchInput = document.querySelector(".search-input");

const API_KEY = "d623ca40665tef4e47d4bbb644o59660"; // Make sure this is your own valid key

// This function will handle the form submission
async function handleSearchSubmit(event) {
  // 1. Prevent the page from reloading
  event.preventDefault();

  let city = searchInput.value;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${API_KEY}&units=metric`;

  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    // Check if the city was found
    if (data.status === "not_found") {
      alert("City not found. Please try again.");
      return;
    }

    // Call a function to update the UI with the new data
    updateWeatherInfo(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Sorry, something went wrong.");
  }
}

// This function updates the HTML with the weather data
function updateWeatherInfo(data) {
  // Correctly update the city name
  document.querySelector(".current-city").innerHTML = data.city;

  // Format the date and time from the timestamp
  let date = new Date(data.time * 1000); // API provides time in seconds, JS needs milliseconds
  let day = date.toLocaleDateString("en-US", { weekday: "long" });
  let time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  document.querySelector(".day").innerHTML = day;
  document.querySelector(".time").innerHTML = time;

  // Correctly update weather details, preserving the HTML structure
  document.querySelector(".current-condition").innerHTML = data.condition.description;
  document.querySelector(".current-humidity").innerHTML = `Humidity: <strong>${data.temperature.humidity}%</strong>`;
  document.querySelector(".current-wind").innerHTML = `Wind: <strong>${data.wind.speed}km/h</strong>`;

  // Update ONLY the parts of the temperature that need to change
  document.querySelector(".current-temperature-icon").innerHTML = `<img src="${data.condition.icon_url}" alt="${data.condition.icon}">`;
  document.querySelector(".current-temperature-value").innerHTML = Math.round(data.temperature.current);
  // The unit °C is already there, so no need to change it
}

// Listen for the "submit" event on the form
searchForm.addEventListener("submit", handleSearchSubmit);