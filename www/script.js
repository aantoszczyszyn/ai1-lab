const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey=apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector)

        this.currentWeatherLink=`https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecastLink=`https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;

        this.currentWeather=undefined;
        this.forecast=undefined;
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}",query);
        let req=new XMLHttpRequest();
        req.open("GET",url,true);
        req.addEventListener("load",()=>{
            this.currentWeather=JSON.parse(req.responseText);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url=this.forecastLink.replace("{query}",query);
        fetch(url)
            .then((response)=>{
            //console.log(response);
                return response.json();
            })
            .then((data)=>{
                this.forecast=data.list;
                this.drawWeather();
            })
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        this.resultsBlock.innerHTML = '';
    
        // Dodaj blok z napisem "Aktualna" przed obecną pogodą
        if (this.currentWeather) {
            const currentLabel = document.createElement("div");
            currentLabel.className = "weather-label"; // Klasa CSS do stylizacji
            currentLabel.innerHTML = "Aktualna";
            this.resultsBlock.appendChild(currentLabel);
    
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.resultsBlock.appendChild(weatherBlock);
        }
    
        if (this.forecast) {
            let isFirstForecast = true;
    
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
    
                if (isFirstForecast) {
                    const forecastLabel = document.createElement("div");
                    forecastLabel.className = "weather-label";
                    forecastLabel.innerHTML = "Przewidywana";
                    this.resultsBlock.appendChild(forecastLabel);
                    isFirstForecast = false;
                }
    
                const date = new Date(weather.dt * 1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    weather.main.temp,
                    weather.main.feels_like,
                    weather.weather[0].icon,
                    weather.weather[0].description
                );
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }
    

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const weatherBlock=document.createElement("div");
        weatherBlock.className="weather-block";
        
        const dateBlock=document.createElement("div");
        dateBlock.className="weather-date";
        dateBlock.innerHTML = dateString;
        weatherBlock.appendChild(dateBlock);

        const temperatureBlock=document.createElement("div");
        temperatureBlock.className="weather-temperature";
        temperatureBlock.innerHTML=`${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        const temperatureFeelBlock=document.createElement("div");
        temperatureFeelBlock.className="weather-temperature-feels-like";
        temperatureFeelBlock.innerHTML=`Feel: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(temperatureFeelBlock);

        const iconImg=document.createElement("img");
        iconImg.className="weather-icon";
        iconImg.src= `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherBlock.appendChild(iconImg);

        const descriptionBlock=document.createElement("div");
        descriptionBlock.className="weather-description";
        descriptionBlock.innerHTML=description;
        weatherBlock.appendChild(descriptionBlock);

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("77be206ebf0b1cae595824f8969f487f", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});