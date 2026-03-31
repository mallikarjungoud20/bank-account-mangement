package com.bank.bank_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    // 🌤 RETURN MAP WITH PROPER ERROR HANDLING & FALLBACK DATA
    public Map<String, Object> getWeather(String city) {

        String url = "https://api.openweathermap.org/data/2.5/weather?q="
                + city + "&appid=" + apiKey + "&units=metric";

        // 🔍 DEBUG LOGS
        System.out.println("🔍 [WEATHER] API KEY: " + (apiKey != null ? "Loaded" : "NULL"));
        System.out.println("🔍 [WEATHER] URL: " + url);

        RestTemplate restTemplate = new RestTemplate();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            System.out.println("✅ [WEATHER] RESPONSE: " + response);
            return response;
        } catch (Exception e) {
            System.out.println("❌ [WEATHER] ERROR: " + e.getMessage());
            e.printStackTrace();

            // 🚨 FALLBACK DATA (returns mock weather if API fails)
            System.out.println("🚨 [WEATHER] Returning fallback weather data");
            Map<String, Object> fallback = new HashMap<>();
            Map<String, Object> main = new HashMap<>();
            main.put("temp", 28.0);
            main.put("feels_like", 26.0);
            main.put("humidity", 65);

            fallback.put("main", main);
            fallback.put("name", city);
            fallback.put("sys", new HashMap<String, Object>() {{
                put("country", "IN");
            }});

            return fallback;
        }
    }
}