"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherService = void 0;
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("../middleware/errorHandler");
class WeatherService {
    constructor() {
        this.apiKey = process.env.WEATHER_API_KEY || '';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        if (!this.apiKey) {
            console.warn('Weather API key not found in environment variables');
        }
    }
    async getCurrentWeather(latitude, longitude) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`);
            return {
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                rainfall: response.data.rain?.['1h'] || 0,
                windSpeed: response.data.wind.speed,
                pressure: response.data.main.pressure,
                description: response.data.weather[0].description
            };
        }
        catch (error) {
            console.error('Error fetching weather data:', error.response?.data || error.message);
            throw new errorHandler_1.AppError(500, 'Error fetching weather data');
        }
    }
    async getForecast(latitude, longitude, days = 5) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`);
            const forecast = response.data.list
                .filter((item, index) => index % 8 === 0)
                .slice(0, days)
                .map((item) => ({
                date: new Date(item.dt * 1000),
                temperature: item.main.temp,
                humidity: item.main.humidity,
                rainfall: item.rain?.['3h'] || 0,
                windSpeed: item.wind.speed,
                pressure: item.main.pressure,
                description: item.weather[0].description
            }));
            return forecast;
        }
        catch (error) {
            console.error('Error fetching weather forecast:', error.response?.data || error.message);
            throw new errorHandler_1.AppError(500, 'Error fetching weather forecast');
        }
    }
    async getHistoricalWeather(latitude, longitude, date) {
        const timestamp = Math.floor(date.getTime() / 1000);
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${timestamp}&appid=${this.apiKey}&units=metric`);
            const data = response.data.data[0];
            return {
                temperature: data.temp,
                humidity: data.humidity,
                rainfall: data.rain?.['1h'] || 0,
                windSpeed: data.wind_speed,
                pressure: data.pressure,
                description: data.weather[0].description
            };
        }
        catch (error) {
            console.error('Error fetching historical weather:', error.response?.data || error.message);
            throw new errorHandler_1.AppError(500, 'Error fetching historical weather data');
        }
    }
}
exports.weatherService = new WeatherService();
//# sourceMappingURL=weather.js.map