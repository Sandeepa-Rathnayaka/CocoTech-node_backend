import axios from 'axios';
import { AppError } from '../middleware/errorHandler';

interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    description: string;
}

class WeatherService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiKey = process.env.WEATHER_API_KEY || '';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';

        if (!this.apiKey) {
            console.warn('Weather API key not found in environment variables');
        }
    }

    async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
            );

            return {
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                rainfall: response.data.rain?.['1h'] || 0,
                windSpeed: response.data.wind.speed,
                pressure: response.data.main.pressure,
                description: response.data.weather[0].description
            };
        } catch (error: any) {
            console.error('Error fetching weather data:', error.response?.data || error.message);
            throw new AppError(500, 'Error fetching weather data');
        }
    }

    async getForecast(latitude: number, longitude: number, days: number = 5): Promise<any> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
            );

            // Process and filter forecast data
            const forecast = response.data.list
                .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day
                .slice(0, days)
                .map((item: any) => ({
                    date: new Date(item.dt * 1000),
                    temperature: item.main.temp,
                    humidity: item.main.humidity,
                    rainfall: item.rain?.['3h'] || 0,
                    windSpeed: item.wind.speed,
                    pressure: item.main.pressure,
                    description: item.weather[0].description
                }));

            return forecast;
        } catch (error: any) {
            console.error('Error fetching weather forecast:', error.response?.data || error.message);
            throw new AppError(500, 'Error fetching weather forecast');
        }
    }

    async getHistoricalWeather(latitude: number, longitude: number, date: Date): Promise<WeatherData> {
        const timestamp = Math.floor(date.getTime() / 1000);
        
        try {
            const response = await axios.get(
                `${this.baseUrl}/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${timestamp}&appid=${this.apiKey}&units=metric`
            );

            const data = response.data.data[0];
            return {
                temperature: data.temp,
                humidity: data.humidity,
                rainfall: data.rain?.['1h'] || 0,
                windSpeed: data.wind_speed,
                pressure: data.pressure,
                description: data.weather[0].description
            };
        } catch (error: any) {
            console.error('Error fetching historical weather:', error.response?.data || error.message);
            throw new AppError(500, 'Error fetching historical weather data');
        }
    }
}

export const weatherService = new WeatherService();