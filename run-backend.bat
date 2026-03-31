@echo off
REM 🚀 BANK MANAGEMENT BACKEND STARTUP SCRIPT
REM This batch file sets environment variables and runs Spring Boot
REM
REM IMPORTANT: Set your environment variables before running:
REM - TWILIO_SID: Your Twilio account SID
REM - TWILIO_TOKEN: Your Twilio auth token
REM - TWILIO_PHONE: Your Twilio phone number
REM - WEATHER_API_KEY: Your OpenWeather API key

echo.
echo 🔐 INSTRUCTIONS:
echo ================
echo Please set environment variables before running:
echo.
echo PowerShell:
echo   $env:TWILIO_SID="your_twilio_sid"
echo   $env:TWILIO_TOKEN="your_twilio_token"
echo   $env:TWILIO_PHONE="+your_twilio_phone"
echo   $env:WEATHER_API_KEY="your_weather_api_key"
echo.
echo CMD:
echo   set TWILIO_SID=your_twilio_sid
echo   set TWILIO_TOKEN=your_twilio_token
echo   set TWILIO_PHONE=+your_twilio_phone
echo   set WEATHER_API_KEY=your_weather_api_key
echo.
echo Or load from .env file (create .env in project root)
echo.
REM Uncomment below to load from .env file manually:
REM for /f "delims==" %%x in (.env) do (set %%x)

echo 🚀 Starting Spring Boot backend...
echo.

cd /d "%~dp0backend\bank-backend"
call mvnw spring-boot:run

echo.
echo ❌ Backend stopped
echo.
pause

