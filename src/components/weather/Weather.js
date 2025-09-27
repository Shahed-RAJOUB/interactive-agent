import React, { useState, useEffect } from "react";
import "./Weather.css";

const Weather = ({ city = "Berlin" }) => {
    const [weather, setWeather] = useState(null);
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=de`
                );
                const data = await response.json();
                if (data.main) {
                    setWeather({
                        temp: Math.round(data.main.temp),
                        desc: data.weather[0].description,
                        name: data.name,
                        icon: data.weather[0].icon,
                    });
                }
            } catch (err) {
                console.error("Weather fetch failed:", err);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 10 * 60 * 1000); // update every 10 min
        return () => clearInterval(interval);
    }, [city, apiKey]);

    if (!weather) return null;

    return (
        <div className="weather-display">
            {weather.icon && (
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.desc}
                    className="weather-icon"
                />
            )}
            <div>
                {weather.name}: {weather.temp}°C, {weather.desc}
            </div>
        </div>
    );
};

export default Weather;
