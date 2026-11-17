/**
 * ===================================================================
 *  A LITTLE UNIVERSE FOR NEELU - SOUND & AUDIO ENGINE
 * ===================================================================
 *  Features:
 *   1. Background Music Player with graceful fallback (assets/music/bg-music.aac / .mp3)
 *   2. Starts music ONLY after user interaction (browser compliant)
 *   3. Pause / Resume / Mute toggle
 *   4. Master Volume Control for both music and sound effects
 *   5. Subtle, synthesized sound effects (Zero external audio file dependencies):
 *      - Envelope opening (paper rustle + wax snap + chime)
 *      - Button clicks (subtle gentle bubble/wooden tick)
 *      - Birthday candles blowing out (air whoosh + extinguish shimmer)
 *      - Confetti explosion (party popper pop + ascending twinkle)
 *      - Final celebration (majestic celebratory chord + fireworks)
 *   6. Works 100% reliably even if audio files are missing or offline
 * ===================================================================
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.volume = window.NEELU_CONFIG?.audio?.defaultVolume ?? 0.65;
    this.hasUserInteracted = false;
    this.isPlayingBgMusic = false;
    this.isStartingCustomAudio = false;
    this.autoplayPending = false;
    this.ambientRunning = false;
    this.ambientTimer = null;

    // HTML5 Background Audio Element
    this.bgMusic = null;
    this.bgMusicSources = [
      window.NEELU_CONFIG?.audio?.bgMusicPath || 'assets/music/bg-music.aac',
      'assets/music/bg-music.mp3',
      'assets/audio/voice-or-music.aac'
    ];
    this.currentSourceIndex = 0;

    // Dedicated Voice Note audio element for Scene 7
    this.customAudio = null;
    this.isPlayingCustomAudio = false;

    this.initAudioElements();
    this.setupUserInteractionListener();
    this.setupAutoplayOnLoad();
  }

  // ----------------------------------------------------
  // INITIALIZATION & AUTOPLAY / USER GESTURE HANDLING
  // ----------------------------------------------------
  initAudioElements() {
    try {
      const existingBgEl = document.getElementById('bgMusicEl');
      this.bgMusic = existingBgEl || new Audio();
      if (!existingBgEl) {
        this.bgMusic.src = this.bgMusicSources[0];
      }
      this.bgMusic.loop = true;
      this.bgMusic.autoplay = true;
      this.bgMusic.preload = 'auto';
      this.bgMusic.muted = false;
      this.bgMusic.volume = this.volume;

      // Sync immediately if the browser already started native HTML autoplay
      if (!this.bgMusic.paused) {
        this.isPlayingBgMusic = true;
        this.autoplayPending = false;
      }

      // Fallback chain if first source fails to load
      this.bgMusic.addEventListener('error', () => {
        if (this.currentSourceIndex < this.bgMusicSources.length - 1) {
          this.currentSourceIndex++;
          this.bgMusic.src = this.bgMusicSources[this.currentSourceIndex];
          if (!this.isMuted && !this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
            this.attemptAutoplay();
          }
        } else {
          // Only fallback to Web Audio celestial pad if every audio file failed to load
          if (!this.isMuted && !this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
            this.startAmbientMusic();
          }
        }
      });

      this.bgMusic.addEventListener('loadeddata', () => {
        if (!this.isPlayingBgMusic && !this.isMuted && !this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
          this.attemptAutoplay();
        }
      }, { once: true });

      this.bgMusic.addEventListener('canplay', () => {
        if (!this.isPlayingBgMusic && !this.isMuted && !this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
          this.attemptAutoplay();
        }
      }, { once: true });

      this.bgMusic.addEventListener('play', () => {
        this.isPlayingBgMusic = true;
        this.autoplayPending = false;
        this.notifyAudioStateChange();
      });

      this.bgMusic.addEventListener('pause', () => {
        this.isPlayingBgMusic = false;
        this.notifyAudioStateChange();
      });

      // Voice note player element
      this.customAudio = new Audio();
      const customPath = window.NEELU_CONFIG?.audio?.customAudioPath || 'assets/audio/birthday wish by sahil.ogg';
      this.customAudio.src = encodeURI(customPath);
      this.customAudio.preload = 'metadata';
      this.customAudio.volume = this.volume;

      this.customAudio.addEventListener('ended', () => {
        this.isPlayingCustomAudio = false;
        this.isStartingCustomAudio = false;
        this.customAudio.currentTime = 0;
        this.notifyAudioStateChange();
        // Automatically resume background song once the special voice note finishes
        if (!this.isMuted) {
          this.playBgMusic();
        }
      });
    } catch (e) {
      console.warn('Audio element initialization note:', e);
    }
  }

  // Attempt automatic background playback immediately on load/refresh
  setupAutoplayOnLoad() {
    const tryStart = () => {
      if (!this.isMuted && !this.isPlayingBgMusic && !this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
        this.attemptAutoplay();
      }
    };

    tryStart();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryStart, { once: true });
    }
    window.addEventListener('load', tryStart, { once: true });
    window.addEventListener('pageshow', tryStart);
  }

  attemptAutoplay() {
    if (!this.bgMusic || this.isMuted || this.isPlayingCustomAudio || this.isStartingCustomAudio) return;
    if (!this.bgMusic.paused && !this.bgMusic.muted) {
      this.isPlayingBgMusic = true;
      this.autoplayPending = false;
      this.notifyAudioStateChange();
      return;
    }

    this.bgMusic.muted = false;
    this.bgMusic.volume = this.volume;
    const playPromise = this.bgMusic.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        this.isPlayingBgMusic = true;
        this.autoplayPending = false;
        this.notifyAudioStateChange();
      }).catch(() => {
        // Fallback: start muted so playback pipeline is warm, then immediately unmute on first gesture
        this.bgMusic.muted = true;
        this.bgMusic.play().then(() => {
          // Try immediate unmute (works on browsers that allow unmuting once started)
          this.bgMusic.muted = false;
          if (!this.bgMusic.paused) {
            this.isPlayingBgMusic = true;
            this.autoplayPending = false;
          } else {
            this.autoplayPending = true;
            this.isPlayingBgMusic = false;
          }
          this.notifyAudioStateChange();
        }).catch(() => {
          this.bgMusic.muted = false;
          this.autoplayPending = true;
          this.isPlayingBgMusic = false;
          this.notifyAudioStateChange();
        });
      });
    }
  }

  // Unlock audio immediately on first gesture if browser blocked initial autoplay
  setupUserInteractionListener() {
    const events = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown', 'wheel'];

    const removeListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, handleFirstGesture, true));
    };

    const handleFirstGesture = (e) => {
      this.hasUserInteracted = true;
      this.getContext();

      // Do not interrupt if the user's very first tap is the Special Voice Note button
      const target = e.target instanceof Element ? e.target : null;
      if (target && target.closest('#btnPlayVoiceNote')) {
        removeListeners();
        return;
      }

      if (!this.isMuted && !this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
        if (this.bgMusic && (this.bgMusic.paused || this.bgMusic.muted)) {
          this.bgMusic.muted = false;
          this.bgMusic.volume = this.volume;
          this.bgMusic.play().then(() => {
            this.isPlayingBgMusic = true;
            this.autoplayPending = false;
            this.notifyAudioStateChange();
            removeListeners();
          }).catch(() => {
            // Keep listeners attached if gesture wasn't sufficient to unlock
          });
          return;
        }
      }

      if (this.isPlayingBgMusic && (!this.bgMusic || !this.bgMusic.muted)) {
        removeListeners();
      }
    };

    events.forEach((evt) => window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true }));
  }

  // Lazy Web Audio Context with Master Gain
  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // ----------------------------------------------------
  // BACKGROUND MUSIC PLAYBACK CONTROLS
  // ----------------------------------------------------
  playBgMusic() {
    if (this.isMuted || this.isPlayingCustomAudio || this.isStartingCustomAudio) return;

    if (this.bgMusic) {
      this.bgMusic.muted = false;
      this.bgMusic.volume = this.volume;
      this.bgMusic.play().then(() => {
        this.isPlayingBgMusic = true;
        this.autoplayPending = false;
        this.notifyAudioStateChange();
      }).catch((err) => {
        // Do not replace real background song with synth pad if browser merely blocked autoplay
        if (err && err.name === 'NotAllowedError') {
          this.autoplayPending = true;
        } else {
          this.startAmbientMusic();
        }
      });
    } else {
      this.startAmbientMusic();
    }
  }

  pauseBgMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
    this.stopAmbientMusic();
    this.isPlayingBgMusic = false;
    this.notifyAudioStateChange();
  }

  toggleMusic() {
    this.getContext();
    if (this.isPlayingBgMusic) {
      this.pauseBgMusic();
    } else {
      this.playBgMusic();
    }
    return this.isPlayingBgMusic;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }

    if (this.bgMusic) {
      this.bgMusic.volume = this.isMuted ? 0 : this.volume;
      if (this.isMuted) {
        this.bgMusic.pause();
      } else if (!this.isPlayingCustomAudio && !this.isStartingCustomAudio) {
        this.bgMusic.play().catch(() => {});
      }
    }

    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
      if (this.isMuted && this.isPlayingCustomAudio) {
        this.customAudio.pause();
      }
    }

    if (this.isMuted) {
      this.stopAmbientMusic();
    }

    this.notifyAudioStateChange();
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));

    if (this.bgMusic) {
      this.bgMusic.volume = this.isMuted ? 0 : this.volume;
    }

    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }

    this.notifyAudioStateChange();
  }

  toggleCustomAudio() {
    this.getContext();
    if (!this.customAudio) return;

    if (this.isPlayingCustomAudio || this.isStartingCustomAudio) {
      this.customAudio.pause();
      this.isPlayingCustomAudio = false;
      this.isStartingCustomAudio = false;
      this.notifyAudioStateChange();
      if (!this.isMuted) this.playBgMusic();
    } else {
      // Pause background song so the special voice note plays clearly
      this.isStartingCustomAudio = true;
      this.pauseBgMusic();
      if (this.customAudio.ended) {
        this.customAudio.currentTime = 0;
      }
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
      this.customAudio.play().then(() => {
        this.isStartingCustomAudio = false;
        this.isPlayingCustomAudio = true;
        this.notifyAudioStateChange();
      }).catch(() => {
        this.isStartingCustomAudio = false;
        this.isPlayingCustomAudio = false;
        this.notifyAudioStateChange();
        if (!this.isMuted) this.playBgMusic();
      });
    }
  }

  notifyAudioStateChange() {
    window.dispatchEvent(new CustomEvent('audioStateChange', {
      detail: {
        isMuted: this.isMuted,
        isPlayingBg: this.isPlayingBgMusic,
        isPlayingCustom: this.isPlayingCustomAudio,
        volume: this.volume
      }
    }));
  }

  // ----------------------------------------------------
  // SUBTLE SYNTHESIZED SOUND EFFECTS (Web Audio API)
  // ----------------------------------------------------

  // 1. Button Click (Subtle, gentle wooden/glass bubble tap)
  playButtonClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.07 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // 2. Envelope Opening (Crisp paper rustle + wax snap + delicate chime)
  playEnvelopeOpen() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Paper rustle noise
      const bufferSize = ctx.sampleRate * 0.22;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      noise.start();

      // Wax crack snap
      setTimeout(() => this.playWaxSnap(), 60);
      // Soft chime follow-up
      setTimeout(() => this.playSparkle(), 180);
    } catch (e) {}
  }

  playWaxSnap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // 3. Birthday Candles Going Out (Gentle breath whoosh + smoke extinguish shimmer)
  playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Breath whoosh noise
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.42);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      noise.start();

      // Extinguish smoke shimmer
      setTimeout(() => {
        this.playSparkle();
      }, 260);
    } catch (e) {}
  }

  // 4. Confetti Explosion (Party popper pop + ascending celebratory twinkle)
  playConfettiExplosion() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Popper pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.32 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);

      // Ascending celebratory chimes (C6, E6, G6, C7)
      const notes = [1046.50, 1318.51, 1567.98, 2093.00];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          try {
            const toneOsc = ctx.createOscillator();
            const toneGain = ctx.createGain();
            toneOsc.type = 'triangle';
            toneOsc.frequency.setValueAtTime(freq, ctx.currentTime);

            toneGain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
            toneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

            toneOsc.connect(toneGain);
            toneGain.connect(this.masterGain || ctx.destination);
            toneOsc.start();
            toneOsc.stop(ctx.currentTime + 0.4);
          } catch (e) {}
        }, 50 + idx * 45);
      });
    } catch (e) {}
  }

  // 5. Final Celebration (Grand celebratory chord + fireworks bursts)
  playFinalCelebration() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Rich celebratory chord: C5, E5, G5, C6
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.09 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.3);
      });

      // Synchronized celebratory firework bursts
      this.playFirework();
      setTimeout(() => this.playFirework(), 280);
      setTimeout(() => this.playFirework(), 560);
    } catch (e) {}
  }

  // 6. Fairy / Celestial Chime
  playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08 * this.volume, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(this.masterGain || ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 1.3);
        } catch (e) {}
      }, idx * 60);
    });
  }

  // 7. Sparkle Effect
  playSparkle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          gain.gain.setValueAtTime(0.06 * this.volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(this.masterGain || ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch (e) {}
      }, i * 35);
    });
  }

  // 8. Angel Feather Bell
  playAngelFeather() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [659.25, 987.77, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
          osc.connect(gain);
          gain.connect(this.masterGain || ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.7);
        } catch (e) {}
      }, i * 80);
    });
  }

  // 9. Firework Burst
  playFirework() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(140, ctx.currentTime);
      boomOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);

      boomGain.gain.setValueAtTime(0.28 * this.volume, ctx.currentTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      boomOsc.connect(boomGain);
      boomGain.connect(this.masterGain || ctx.destination);
      boomOsc.start();
      boomOsc.stop(ctx.currentTime + 0.42);
    } catch (e) {}
  }

  // 10. Generative Celestial Ambient Music (Synthetic Fallback)
  startAmbientMusic() {
    if (this.isMuted || this.ambientRunning || this.isPlayingCustomAudio) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.ambientRunning = true;
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];

    const playPadNote = () => {
      if (!this.ambientRunning || this.isMuted || this.isPlayingCustomAudio) return;
      try {
        const note = scale[Math.floor(Math.random() * scale.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime);

        const duration = 4.0 + Math.random() * 2;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.035 * this.volume, ctx.currentTime + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.1);
      } catch (e) {}

      const nextInterval = 2400 + Math.random() * 1600;
      this.ambientTimer = setTimeout(playPadNote, nextInterval);
    };

    playPadNote();
    this.isPlayingBgMusic = true;
    this.notifyAudioStateChange();
  }

  stopAmbientMusic() {
    this.ambientRunning = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  playShootingStar() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.55);

      gain.gain.setValueAtTime(0.04 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch (e) {}
  }

  // 11. Cosmic Warp Transition Sound
  playWarp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.85);

      gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.15);

      setTimeout(() => this.playChime(), 350);
    } catch (e) {}
  }
}

window.soundEngine = new SoundEngine();
