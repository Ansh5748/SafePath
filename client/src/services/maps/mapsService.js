class MapsService {
  constructor() {
    this.dailyRequests = 0;
    this.resetDate = new Date().setHours(0,0,0,0);
  }

  checkQuota() {
    // Reset counter daily
    const today = new Date().setHours(0,0,0,0);
    if (today > this.resetDate) {
      this.dailyRequests = 0;
      this.resetDate = today;
    }

    // Check if within free tier
    if (this.dailyRequests > 950) { // 28,500/30 days
      return false;
    }

    this.dailyRequests++;
    return true;
  }
} 