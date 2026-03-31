import { useEffect, useState } from "react";

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🌤 [WEATHER] Fetching weather for Hyderabad...");
    
    fetch("http://localhost:8080/api/weather?city=Hyderabad")
      .then(res => {
        console.log("🌤 [WEATHER] Response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("✅ [WEATHER] Data received:", data);
        setWeather(data);
      })
      .catch(err => {
        console.error("❌ [WEATHER] Fetch error:", err);
        setError("Unable to fetch weather");
      });
  }, []);

  // 🌤 SAFETY CHECK: Prevent crash if weather data is missing
  if (!weather || !weather.main) {
    console.log("⚠️ [WEATHER] Waiting for data or API failed. weather:", weather);
    return <div style={styles.weather}>🌤 Weather unavailable</div>;
  }

  if (error) {
    return <div style={styles.weather}>⚠️ {error}</div>;
  }

  return (
    <div style={styles.weather}>
      {Math.round(weather.main.temp)}°C | {weather.name}
    </div>
  );
}

const styles = {
  weather: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a237e"
  }
};

export default WeatherWidget;