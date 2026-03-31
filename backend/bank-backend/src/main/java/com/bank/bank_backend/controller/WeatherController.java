package com.bank.bank_backend.controller;

import com.bank.bank_backend.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    // 🌤 RETURN MAP<String, Object> FOR PROPER JSON SERIALIZATION
    @GetMapping
    public Map<String, Object> getWeather(@RequestParam String city) {
        return weatherService.getWeather(city);
    }
}