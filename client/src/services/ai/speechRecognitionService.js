class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.threatPatterns = [
      // Threatening phrases and patterns
      /threat|kill|hurt|follow|stalk/i,
      /get you|watch out|watch your/i,
      /gonna|going to.*hurt/i,
      /don't.*scream|be quiet/i
    ];
  }

  initialize() {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

  analyzeSpeech(text) {
    // Check for threatening patterns
    const threats = this.threatPatterns.reduce((acc, pattern) => {
      if (pattern.test(text.toLowerCase())) {
        acc.push({
          pattern: pattern.toString(),
          matchedText: text
        });
      }
      return acc;
    }, []);

    if (threats.length > 0) {
      return {
        isHarassment: true,
        confidence: threats.length / this.threatPatterns.length,
        threats,
        text
      };
    }

    return {
      isHarassment: false,
      confidence: 0,
      threats: [],
      text
    };
  }

  start(onResult, onError) {
    if (!this.recognition) {
      this.initialize();
    }

    this.recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');

      const analysis = this.analyzeSpeech(text);
      onResult(analysis);
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
    };

    this.recognition.start();
    this.isListening = true;
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export default new SpeechRecognitionService(); 