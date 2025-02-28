import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as poseDetection from '@tensorflow-models/pose-detection';

class TensorFlowService {
  constructor() {
    this.objectDetector = null;
    this.poseDetector = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Load COCO-SSD model for object detection
      this.objectDetector = await cocossd.load();
      
      // Load MoveNet model for pose detection
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      };
      this.poseDetector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing TensorFlow models:', error);
      throw error;
    }
  }

  async detectPeople(imageElement) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const predictions = await this.objectDetector.detect(imageElement);
      return predictions.filter(pred => pred.class === 'person');
    } catch (error) {
      console.error('Error detecting people:', error);
      return [];
    }
  }

  async detectPoses(imageElement) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const poses = await this.poseDetector.estimatePoses(imageElement);
      return poses;
    } catch (error) {
      console.error('Error detecting poses:', error);
      return [];
    }
  }

  analyzeStalking(detectionHistory) {
    // Analyze movement patterns to detect potential stalking
    if (detectionHistory.length < 5) return { isStalking: false, confidence: 0 };

    const followingPatterns = this.detectFollowingPatterns(detectionHistory);
    const suspiciousMovements = this.detectSuspiciousMovements(detectionHistory);

    const confidence = (followingPatterns + suspiciousMovements) / 2;
    return {
      isStalking: confidence > 0.7,
      confidence
    };
  }

  detectFollowingPatterns(history) {
    // Analyze if a person is consistently following the user
    let followingScore = 0;
    
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      
      // Calculate movement correlation
      const correlation = this.calculateMovementCorrelation(prev, curr);
      followingScore += correlation;
    }

    return followingScore / (history.length - 1);
  }

  detectSuspiciousMovements(history) {
    // Analyze movement patterns that might indicate stalking
    let suspiciousScore = 0;
    
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      
      // Check for suspicious behaviors
      if (this.isLurking(curr)) suspiciousScore += 0.3;
      if (this.isFollowingAtDistance(prev, curr)) suspiciousScore += 0.4;
      if (this.isMatchingMovements(prev, curr)) suspiciousScore += 0.3;
    }

    return Math.min(suspiciousScore / history.length, 1);
  }

  private calculateMovementCorrelation(prev, curr) {
    // Calculate how correlated two consecutive movements are
    const movement = {
      x: curr.bbox[0] - prev.bbox[0],
      y: curr.bbox[1] - prev.bbox[1]
    };

    // Return a score between 0 and 1
    return Math.min(
      Math.abs(movement.x) + Math.abs(movement.y),
      1
    );
  }

  private isLurking(detection) {
    // Check if person is staying in one place for too long
    const movementThreshold = 10;
    return Math.abs(detection.bbox[0]) < movementThreshold &&
           Math.abs(detection.bbox[1]) < movementThreshold;
  }

  private isFollowingAtDistance(prev, curr) {
    // Check if person maintains a consistent following distance
    const distanceThreshold = 100;
    const distance = Math.sqrt(
      Math.pow(curr.bbox[0] - prev.bbox[0], 2) +
      Math.pow(curr.bbox[1] - prev.bbox[1], 2)
    );
    return distance > distanceThreshold && distance < distanceThreshold * 2;
  }

  private isMatchingMovements(prev, curr) {
    // Check if person's movements match user's movements
    const movementThreshold = 0.8;
    const correlation = this.calculateMovementCorrelation(prev, curr);
    return correlation > movementThreshold;
  }
}

export default new TensorFlowService(); 