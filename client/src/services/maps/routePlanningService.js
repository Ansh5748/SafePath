import axios from 'axios';
import { db } from '../../config/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';

class RoutePlanningService {
  constructor() {
    this.googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  }

  async getSafeRoute(origin, destination) {
    try {
      // Get multiple route options from Google Maps
      const routes = await this.getRouteAlternatives(origin, destination);
      
      // Get safety scores for areas along routes
      const safetyScores = await this.getSafetyScoresForRoutes(routes);
      
      // Calculate safety-weighted routes
      const safeRoutes = this.calculateSafeRoutes(routes, safetyScores);
      
      return safeRoutes;
    } catch (error) {
      console.error('Error getting safe route:', error);
      throw error;
    }
  }

  async getRouteAlternatives(origin, destination) {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=true&key=${this.googleMapsApiKey}`
    );

    return response.data.routes;
  }

  async getSafetyScoresForRoutes(routes) {
    const safetyScores = new Map();
    
    for (const route of routes) {
      const points = this.getRoutePoints(route);
      
      // Query safety scores from Firestore
      const scores = await this.querySafetyScores(points);
      
      for (const [point, score] of scores) {
        safetyScores.set(point, score);
      }
    }
    
    return safetyScores;
  }

  getRoutePoints(route) {
    // Extract points along the route at regular intervals
    const points = [];
    
    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        points.push({
          lat: step.start_location.lat,
          lng: step.start_location.lng
        });
      });
    });
    
    return points;
  }

  async querySafetyScores(points) {
    const scores = new Map();
    const safetyScoresRef = collection(db, 'safetyScores');
    
    for (const point of points) {
      // Query safety scores within radius of point
      const nearbyScores = await getDocs(
        query(
          safetyScoresRef,
          where('coordinates.lat', '>=', point.lat - 0.01),
          where('coordinates.lat', '<=', point.lat + 0.01)
        )
      );
      
      let avgScore = 0;
      let count = 0;
      
      nearbyScores.forEach(doc => {
        const data = doc.data();
        if (this.isPointInRadius(point, data.coordinates, data.coordinates.radius)) {
          avgScore += data.safetyScore;
          count++;
        }
      });
      
      if (count > 0) {
        scores.set(`${point.lat},${point.lng}`, avgScore / count);
      }
    }
    
    return scores;
  }

  calculateSafeRoutes(routes, safetyScores) {
    return routes.map(route => {
      const points = this.getRoutePoints(route);
      let totalSafetyScore = 0;
      let scoredPoints = 0;
      
      points.forEach(point => {
        const score = safetyScores.get(`${point.lat},${point.lng}`);
        if (score) {
          totalSafetyScore += score;
          scoredPoints++;
        }
      });
      
      const avgSafetyScore = scoredPoints > 0 ? totalSafetyScore / scoredPoints : 50;
      
      return {
        ...route,
        safetyScore: avgSafetyScore,
        safetyLevel: this.getSafetyLevel(avgSafetyScore)
      };
    }).sort((a, b) => b.safetyScore - a.safetyScore);
  }

  getSafetyLevel(score) {
    if (score >= 80) return 'very_safe';
    if (score >= 60) return 'safe';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'unsafe';
    return 'very_unsafe';
  }

  isPointInRadius(point, center, radius) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(center.lat - point.lat);
    const dLon = this.toRad(center.lng - point.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(this.toRad(point.lat)) * Math.cos(this.toRad(center.lat)) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
             
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    return d <= radius;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }
}

export default new RoutePlanningService(); 