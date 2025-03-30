const apiKey = 'aeb9757f0a84c30b0adc0f4c003b47a0'; // Replace with your OpenWeather API Key

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("getWeatherBtn").addEventListener("click", getWeather);
});

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("weatherInfo").innerHTML = "";
    document.getElementById("forecastTable").innerHTML = "";

    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!weatherResponse.ok) throw new Error("City not found.");

        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        // Fetch 5-day forecast (every 3 hours)
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!forecastResponse.ok) throw new Error("Error fetching forecast data.");

        const forecastData = await forecastResponse.json();
        displayForecast(forecastData.list);

    } catch (error) {
        document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">${error.message}</p>`;
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById("weatherInfo");
    weatherDiv.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
    `;
}

function displayForecast(forecastData) {
    let tableContent = `
        <table>
            <tr>
                <th>Date</th>
                <th>Temperature</th>
                <th>Weather</th>
                <th>Humidity</th>
                <th>Wind Speed</th>
            </tr>
    `;

    let displayedDates = new Set(); // To store unique dates

    forecastData.forEach(item => {
        let date = new Date(item.dt * 1000).toLocaleDateString(); // Get the date only

        // Show only one forecast per day (at 12:00 PM)
        if (!displayedDates.has(date) && item.dt_txt.includes("12:00:00")) {
            displayedDates.add(date); // Mark this date as displayed

            tableContent += `
                <tr>
                    <td>${date}</td>
                    <td>${item.main.temp}°C</td>
                    <td>${item.weather[0].description}</td>
                    <td>${item.main.humidity}%</td>
                    <td>${item.wind.speed} m/s</td>
                </tr>
            `;
        }
    });

    tableContent += `</table>`;
    document.getElementById("forecastTable").innerHTML = tableContent;
}
