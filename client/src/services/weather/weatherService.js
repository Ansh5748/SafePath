class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?` +
        `lat=${lat}&lon=${lon}` +
        `&appid=${this.apiKey}` +
        `&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API error');
      }

      const data = await response.json();
      return {
        temp: data.main.temp,
        conditions: data.weather[0].main,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        isHazardous: this.checkHazardousConditions(data)
      };
    } catch (error) {
      console.error('Weather service error:', error);
      return null;
    }
  }

  checkHazardousConditions(data) {
    // Check for dangerous weather conditions
    return (
      data.weather[0].main === 'Thunderstorm' ||
      data.visibility < 1000 ||  // Less than 1km visibility
      data.wind.speed > 20    // Strong winds
    );
  }
}

export default new WeatherService(); 