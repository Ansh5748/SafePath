export const validateOpenCageKey = async () => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?` +
      `q=Delhi` +
      `&key=${process.env.REACT_APP_OPENCAGE_API_KEY}` +
      `&limit=1`
    );
    
    const data = await response.json();
    
    if (data.status.code === 401 || data.status.code === 403) {
      console.error('OpenCage API key invalid or expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating OpenCage API key:', error);
    return false;
  }
};

export const validateWeatherKey = async () => {
  try {
    // Test with Delhi coordinates
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?` +
      `lat=28.6139&lon=77.2090` +
      `&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.cod === 401) {
      console.error('OpenWeather API key invalid');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating OpenWeather API key:', error);
    return false;
  }
}; 