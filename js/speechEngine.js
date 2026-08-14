/**
 * TuitionBoard AI - Speech Engine
 * Controls Text-To-Speech (AI Tutor Voice) & Speech Recognition (Student Voice Input)
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.isMuted = false;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.selectedVoice = null;
    this.voices = [];
    this.currentUtterance = null;
    this.recognition = null;
    this.isListening = false;

    this.onSpeakingStateChange = null;
    this.onWordBoundary = null;
    this.onSpeechRecognized = null;

    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;

    const populateVoices = () => {
      this.voices = this.synth.getVoices();
      if (!this.voices || this.voices.length === 0) return;

      // Prefer high quality natural English voices
      const preferred = this.voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('George')))
      ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];

      if (preferred && !this.selectedVoice) {
        this.selectedVoice = preferred;
      }
    };

    populateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populateVoices;
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange({ isListening: true });
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onSpeechRecognized) {
          this.onSpeechRecognized(transcript, event.results[0].isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange({ isListening: false });
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange({ isListening: false });
      };
    }
  }

  speak(text, onComplete) {
    if (!this.synth) {
      if (onComplete) onComplete();
      return;
    }

    this.stop();

    if (this.isMuted) {
      if (onComplete) onComplete();
      return;
    }

    // Clean text of LaTeX formulas / code brackets for natural speech
    const cleanSpeechText = text
      .replace(/\\\w+(\{[^}]*\}|\[[^\]]*\])?/g, ' ')
      .replace(/[\$\{\}\\\#\^\_\*\~]/g, '')
      .replace(/df\/dx/gi, 'd f by d x')
      .replace(/dy\/dx/gi, 'd y by d x')
      .replace(/->/g, 'leads to')
      .replace(/=>/g, 'which implies that')
      .replace(/([0-9]+)\^([0-9]+)/g, '$1 to the power of $2')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanSpeechText) {
      if (onComplete) onComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeakingStateChange) {
        this.onSpeakingStateChange({ isSpeaking: true, isListening: this.isListening });
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word' && this.onWordBoundary) {
        this.onWordBoundary(event.charIndex, event.charLength);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onSpeakingStateChange) {
        this.onSpeakingStateChange({ isSpeaking: false, isListening: this.isListening });
      }
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onSpeakingStateChange) {
        this.onSpeakingStateChange({ isSpeaking: false, isListening: this.isListening });
      }
      if (onComplete) onComplete();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    if (this.onSpeakingStateChange) {
      this.onSpeakingStateChange({ isSpeaking: false, isListening: this.isListening });
    }
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  toggleVoiceMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  setRate(newRate) {
    this.rate = Math.max(0.5, Math.min(2.0, newRate));
  }

  setPitch(newPitch) {
    this.pitch = Math.max(0.5, Math.min(1.5, newPitch));
  }

  setVoiceByName(voiceName) {
    const v = this.voices.find(item => item.name === voiceName);
    if (v) this.selectedVoice = v;
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.stop(); // stop tutor from talking while student speaks
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {}
    }
  }
}

window.speechEngine = new SpeechEngine();
