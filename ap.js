const container = document.querySelector('.container');
const search = document.querySelector('.search-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const forecastContainer = document.querySelector('.forecast-container');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const APIKey = '47b0383a3a60db961e4de4d9277f92bd';
    const city = document.getElementById('search-input').value;
    if (city === '') {
        return;
    }
    fetchWeatherData(city, APIKey);
});

function fetchWeatherData(city, APIKey) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod == '404') {
                container.style.height = '450px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                return;
            }
            displayCurrentWeather(json);
            fetchForecastData(json.coord.lat, json.coord.lon, APIKey);
        });
}

function displayCurrentWeather(json) {
    container.style.height = '560px';
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    error404.classList.remove('active');

    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    switch (json.weather[0].main) {
        case 'Clear':
            image.src = 'images/clear-new.png';
            break;
        case 'Rain':
            image.src = 'images/rain-new.png';
            break;
        case 'Snow':
            image.src = 'images/snow-new.png';
            break;
        case 'Clouds':
            image.src = 'images/cloud-new.png';
            break;
        case 'Mist':
        case 'Haze':
            image.src = 'images/mist-new.png';
            break;
        default:
            image.src = 'images/clear-new.png';
    }
    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
}

function fetchForecastData(lat, lon, APIKey) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            displayForecast(json);
        });
}

function displayForecast(json) {
    forecastContainer.innerHTML = ''; // Clear previous forecast
    json.list.forEach((item, index) => {
        if (index % 8 === 0) { // Get forecast for every 8 hours (3-hour intervals)
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                <p>${Math.round(item.main.temp)}°C</p>
            `;
            forecastContainer.appendChild(forecastItem);
        }
    });
}
