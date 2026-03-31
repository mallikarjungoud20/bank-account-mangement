# 🚀 BANK MANAGEMENT BACKEND STARTUP SCRIPT
# This script sets environment variables and runs Spring Boot
#
# IMPORTANT: Set your environment variables before running:
# - TWILIO_SID: Your Twilio account SID
# - TWILIO_TOKEN: Your Twilio auth token
# - TWILIO_PHONE: Your Twilio phone number
# - WEATHER_API_KEY: Your OpenWeather API key

Write-Host "🔐 IMPORTANT: Set environment variables before running!" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Set variables in current session:" -ForegroundColor Cyan
Write-Host "`$env:TWILIO_SID = 'your_twilio_sid'" -ForegroundColor White
Write-Host "`$env:TWILIO_TOKEN = 'your_twilio_token'" -ForegroundColor White
Write-Host "`$env:TWILIO_PHONE = '+your_twilio_phone'" -ForegroundColor White
Write-Host "`$env:WEATHER_API_KEY = 'your_weather_api_key'" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Create .env file in project root with:" -ForegroundColor Cyan
Write-Host "TWILIO_SID=your_twilio_sid" -ForegroundColor White
Write-Host "TWILIO_TOKEN=your_twilio_token" -ForegroundColor White
Write-Host "TWILIO_PHONE=+your_twilio_phone" -ForegroundColor White
Write-Host "WEATHER_API_KEY=your_weather_api_key" -ForegroundColor White
Write-Host ""
Write-Host "See .env.example for reference" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Starting Spring Boot backend..." -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Set-Location (Join-Path $PSScriptRoot "backend\bank-backend" -Resolve)

# Run Maven
./mvnw spring-boot:run

Write-Host ""
Write-Host "The backend has stopped" -ForegroundColor Yellow

