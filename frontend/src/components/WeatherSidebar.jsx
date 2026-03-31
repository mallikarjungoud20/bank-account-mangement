import { useEffect, useState } from "react";
import axios from "axios";

function WeatherSidebar() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/weather?city=Hyderabad")
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h3>Weather</h3>
      <p>City: {weather.name}</p>
      <p>Temperature: {weather.main.temp} °C</p>
      <p>Condition: {weather.weather[0].description}</p>
    </div>
  );
}

export default WeatherSidebar;