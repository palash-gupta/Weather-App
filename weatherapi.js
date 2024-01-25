const API_Key = "30fc722d30d80db144b8d64205121ee8";

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}

function getWeather(){
    const location = document.getElementById('location').value;
    if (!location) {
        alert('Please enter a location');
        return;
    }
    const geocoding_url=`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_Key}`;
    fetch(geocoding_url)
        .then(response => response.json())
        .then(data =>{
            let lat=data[0].lat;
            let lon=data[0].lon;
            fetchWeather(lon,lat);
            fetchAQI(lon,lat);
            fetchforecast(lon,lat);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

function fetchWeather(lon,lat){
    const weather_url=`https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${API_Key}&units=metric`;
    fetch(weather_url)
        .then(response => response.json())
        .then(data => {

            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

function fetchAQI(lon,lat){
    const aqi_url=`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_Key}`;
    fetch(aqi_url)
        .then(response => response.json())
        .then(data => {

            try {
                let wordaqi = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][data.list[0].main.aqi-1];
            displayAQI(wordaqi);
            } catch (e) {
                alert("Error fetching AQI");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

function fetchforecast(lon,lat){
    const forecast_url=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`;
    fetch(forecast_url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            /*console.log(data.list[0].dt_txt);
            console.log(data.list[0].main.temp);
            console.log(data.list[0].weather[0].description);*/
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

//Displaying

function displayWeather(data) {
    const Location = document.getElementById('location').value;
    const weather = document.getElementById('weather');

    
    weather.innerHTML = `
        <p><strong>Location:</strong> ${Location}</p>
        <p><strong>Country Code:</strong> ${data.sys.country}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} &deg;C</p>
        <p><strong>Feels like:</strong> ${data.main.feels_like} &deg;C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        <p><strong>Pressure:</strong> ${data.main.pressure} mb</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;

    document.getElementById('weatherData').classList.remove('hidden');
}

function displayAQI(wordaqi) {
    aqi.innerHTML = `
        <p><strong>AQI:</strong> ${wordaqi}</p>
    `;
    document.getElementById('weatherData').classList.remove('hidden');
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = `
        <br>
        <p><strong>Forecast for the next 5 days:</strong></p>
    `;
    let forecastHTML = "";
    for (let i = 0; i < 40; i++) {
        forecastHTML += `
            <br>
            <p><strong>Date and Time:</strong> ${data.list[i].dt_txt}</p>
            <p><strong>Temperature:</strong> ${data.list[i].main.temp} &deg;C</p>
            <p><strong>Description:</strong> ${data.list[i].weather[0].description}</p>
        `;
    }
    forecast.innerHTML += forecastHTML;
    
    document.getElementById('weatherData').classList.remove('hidden');
}
