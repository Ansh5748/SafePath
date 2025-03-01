export const mapsConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries: ['places'], // Add libraries you need
  defaultCenter: {
    lat: 20.5937,
    lng: 78.9629
  },
  defaultZoom: 15
}; 