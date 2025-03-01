class GeocodingService {
  constructor() {
    this.cache = new Map();
    this.requestCount = 0;
    this.resetTime = new Date().setHours(0,0,0,0);
    // OpenCage free tier: 2,500 requests per day
    this.dailyLimit = 2400; // Set slightly below limit
  }

  async checkRateLimit() {
    const now = new Date().setHours(0,0,0,0);
    if (now > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = now;
    }

    if (this.requestCount >= this.dailyLimit) {
      throw new Error('Daily rate limit exceeded');
    }

    this.requestCount++;
  }

  async getLocation(address) {
    // Check cache first
    if (this.cache.has(address)) {
      return this.cache.get(address);
    }

    try {
      // Try Google Maps first
      const result = await this.googleGeocode(address);
      this.cache.set(address, result);
      return result;
    } catch (error) {
      console.log('Falling back to OpenCage');
      try {
        // Fallback to OpenCage
        const result = await this.openCageGeocode(address);
        this.cache.set(address, result);
        return result;
      } catch (fallbackError) {
        throw new Error('Both geocoding services failed');
      }
    }
  }

  async openCageGeocode(address) {
    await this.checkRateLimit();
    
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?` +
      `q=${encodeURIComponent(address)}` +
      `&key=${process.env.REACT_APP_OPENCAGE_API_KEY}` +
      `&countrycode=in` + // Focus on India
      `&limit=1` + // Get only one result
      `&no_annotations=1` // Reduce response size
    );
    
    if (!response.ok) {
      throw new Error('OpenCage API error');
    }

    const data = await response.json();
    if (data.results.length === 0) {
      throw new Error('No results found');
    }

    return {
      lat: data.results[0].geometry.lat,
      lng: data.results[0].geometry.lng,
      formatted: data.results[0].formatted,
      confidence: data.results[0].confidence
    };
  }

  async googleGeocode(address) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?` +
        `address=${encodeURIComponent(address)}` +
        `&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}` +
        `&region=in` // Focus on India
      );
      
      if (!response.ok) {
        throw new Error('Google Geocoding failed');
      }

      const data = await response.json();
      return {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      };
    } catch (error) {
      throw new Error('Google Geocoding error: ' + error.message);
    }
  }
}

export default new GeocodingService(); 