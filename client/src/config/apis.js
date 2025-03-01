export const APIs = {
  // Primary
  maps: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  
  // Alternatives (free)
  geocoding: {
    primary: 'google',
    fallback: 'opencage',
    keys: {
      opencage: process.env.REACT_APP_OPENCAGE_API_KEY,
    }
  },
  
  weather: {
    provider: 'openweather',
    key: process.env.REACT_APP_OPENWEATHER_API_KEY
  }
}; 