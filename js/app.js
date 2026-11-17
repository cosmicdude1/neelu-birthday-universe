/**
 * ===================================================================
 *  A LITTLE UNIVERSE FOR NEELU - MAIN APPLICATION CONTROLLER
 * ===================================================================
 *  Orchestrates scene rendering, transitions, audio bar,
 *  bottom navigation dock, touch gestures, and keyboard navigation.
 * ===================================================================
 */

class NeeluUniverseApp {
  constructor() {
    this.currentScene = 1;
    this.totalScenes = 8;
    this.sceneContainer = document.getElementById('sceneMount');
    this.navDock = document.getElementById('navDock');
    this.progressBar = document.getElementById('topProgressBar');
    this.universeBg = null;

    this.sceneMeta = [
      { id: 1, name: "Welcome", icon: "✨", render: window.renderScene1Welcome },
      { id: 2, name: "Envelope", icon: "💌", render: window.renderScene2Envelope },
      { id: 3, name: "3D Cake", icon: "🎂", render: window.renderScene3Cake },
      { id: 4, name: "Our Story", icon: "💫", render: window.renderScene4Friendship },
      { id: 5, name: "Memories", icon: "📸", render: window.renderScene5Gallery },
      { id: 6, name: "Angel", icon: "🕊️", render: window.renderScene6Angel },
      { id: 7, name: "Letter", icon: "📜", render: window.renderScene7Letter },
      { id: 8, name: "Grand Finale", icon: "🎆", render: window.renderScene8Finale }
    ];

    this.init();
  }

  init() {
    // 1. Initialize Celestial 3D Background
    this.universeBg = new window.CelestialUniverse('universeCanvas');

    // 2. Render Navigation Dock Items
    this.renderNavDock();

    // 3. Setup Global Audio Header Controls
    this.setupAudioControls();

    // 4. Setup Touch Gestures & Keyboard Navigation
    this.setupGestureControls();

    // 5. Render Initial Scene (Scene 1)
    this.goToScene(1, false);
  }

  renderNavDock() {
    if (!this.navDock) return;
    this.navDock.innerHTML = `
      <div class="dock-inner glass-panel">
        <button class="dock-nav-btn prev" id="btnDockPrev" title="Previous Scene">
          <span>◀</span>
        </button>

        <div class="dock-items-wrapper">
          ${this.sceneMeta.map(s => `
            <button class="dock-item ${s.id === 1 ? 'active' : ''}" data-scene="${s.id}" title="${s.name}">
              <span class="dock-icon">${s.icon}</span>
              <span class="dock-label">${s.name}</span>
            </button>
          `).join('')}
        </div>

        <button class="dock-nav-btn next" id="btnDockNext" title="Next Scene">
          <span>▶</span>
        </button>
      </div>
    `;

    // Dock click events
    const dockButtons = this.navDock.querySelectorAll('.dock-item');
    dockButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = parseInt(btn.getAttribute('data-scene'), 10);
        this.goToScene(sceneId);
      });
    });

    const btnPrev = this.navDock.querySelector('#btnDockPrev');
    const btnNext = this.navDock.querySelector('#btnDockNext');

    btnPrev.addEventListener('click', () => {
      if (this.currentScene > 1) this.goToScene(this.currentScene - 1);
    });

    btnNext.addEventListener('click', () => {
      if (this.currentScene < this.totalScenes) this.goToScene(this.currentScene + 1);
    });
  }

  updateNavDock() {
    if (!this.navDock) return;
    const items = this.navDock.querySelectorAll('.dock-item');
    items.forEach(btn => {
      const id = parseInt(btn.getAttribute('data-scene'), 10);
      const isActive = id === this.currentScene;
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('passed', id < this.currentScene);
      if (isActive && typeof btn.scrollIntoView === 'function') {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    const btnPrev = this.navDock.querySelector('#btnDockPrev');
    const btnNext = this.navDock.querySelector('#btnDockNext');
    if (btnPrev) btnPrev.disabled = this.currentScene === 1;
    if (btnNext) btnNext.disabled = this.currentScene === this.totalScenes;

    // Hide navigation dock in Scene 1 for 100% full-screen cinematic immersion
    if (this.currentScene === 1) {
      this.navDock.classList.add('dock-subtle-hidden');
    } else {
      this.navDock.classList.remove('dock-subtle-hidden');
    }

    // Update Progress Bar
    if (this.progressBar) {
      const pct = ((this.currentScene - 1) / (this.totalScenes - 1)) * 100;
      this.progressBar.style.width = `${Math.max(5, pct)}%`;
    }
  }

  setupAudioControls() {
    const audioBtn = document.getElementById('globalAudioToggle');
    const audioIcon = document.getElementById('globalAudioIcon');
    const audioLabel = document.getElementById('globalAudioLabel');
    const equalizer = document.getElementById('headerEqualizer');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeMuteBtn = document.getElementById('volumeMuteBtn');
    const volumeIcon = document.getElementById('volumeIcon');

    // Toggle Music Play / Pause / Mute
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          window.soundEngine.toggleMusic();
        }
      });
    }

    // Master Volume Slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        if (window.soundEngine) {
          window.soundEngine.setVolume(parseFloat(e.target.value));
        }
      });
    }

    // Volume Mute Button Icon Click
    if (volumeMuteBtn) {
      volumeMuteBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          window.soundEngine.toggleMute();
        }
      });
    }

    // Global subtle audio feedback on button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, .dock-item, .polaroid-flipper, .quick-tag-pill, .btn-primary, .btn-secondary')) {
        if (window.soundEngine) {
          window.soundEngine.playButtonClick();
        }
      }
    });

    // Sync UI with audio engine state changes
    window.addEventListener('audioStateChange', (e) => {
      const state = e.detail;
      if (!state) return;

      const isPlaying = state.isPlayingBg || state.isPlayingCustom;

      if (audioBtn) {
        if (state.isMuted) {
          audioIcon.textContent = '🔇';
          audioLabel.textContent = 'Muted';
          audioBtn.classList.add('muted');
          if (equalizer) equalizer.classList.remove('eq-active');
        } else if (isPlaying) {
          audioIcon.textContent = '🎵';
          audioLabel.textContent = state.isPlayingCustom ? 'Voice Note' : 'Music On';
          audioBtn.classList.remove('muted');
          if (equalizer) equalizer.classList.add('eq-active');
        } else {
          audioIcon.textContent = '⏸️';
          audioLabel.textContent = 'Paused';
          audioBtn.classList.add('muted');
          if (equalizer) equalizer.classList.remove('eq-active');
        }
      }

      // Update volume icon & slider
      if (volumeSlider && state.volume !== undefined) {
        volumeSlider.value = state.volume;
      }

      if (volumeIcon) {
        if (state.isMuted || state.volume === 0) {
          volumeIcon.textContent = '🔇';
        } else if (state.volume > 0.5) {
          volumeIcon.textContent = '🔊';
        } else if (state.volume > 0.15) {
          volumeIcon.textContent = '🔉';
        } else {
          volumeIcon.textContent = '🔈';
        }
      }
    });

    // Sync initial header UI with current autoplay/audio state
    if (window.soundEngine) {
      window.soundEngine.notifyAudioStateChange();
    }
  }

  setupGestureControls() {
    // Touch swipe left/right for mobile navigation (ignoring interactive drag/scroll regions)
    let touchStartX = 0;
    let touchStartY = 0;
    let ignoreSwipe = false;

    const interactiveSwipeBlockSelector = [
      '.cake-display-area',
      '.cake-canvas',
      '.memory-lightbox-modal',
      '.bottom-nav-dock',
      '.gallery-filters-bar',
      '.volume-control-wrap',
      'input[type="range"]',
      'video',
      'audio'
    ].join(', ');

    window.addEventListener('touchstart', (e) => {
      const lightbox = document.getElementById('memoryLightbox');
      const isLightboxOpen = lightbox && lightbox.style.display !== 'none';
      const target = e.target instanceof Element ? e.target : null;

      ignoreSwipe = Boolean(
        isLightboxOpen ||
        e.touches.length !== 1 ||
        (target && target.closest(interactiveSwipeBlockSelector))
      );

      if (!ignoreSwipe && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (ignoreSwipe) {
        ignoreSwipe = false;
        return;
      }
      if (e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        // Ensure horizontal swipe dominates vertical scroll
        if (Math.abs(deltaX) > 90 && Math.abs(deltaY) < 70) {
          if (deltaX < 0 && this.currentScene < this.totalScenes) {
            this.goToScene(this.currentScene + 1); // Swipe left = next
          } else if (deltaX > 0 && this.currentScene > 1) {
            this.goToScene(this.currentScene - 1); // Swipe right = prev
          }
        }
      }
    }, { passive: true });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' && this.currentScene < this.totalScenes) {
        this.goToScene(this.currentScene + 1);
      } else if (e.key === 'ArrowLeft' && this.currentScene > 1) {
        this.goToScene(this.currentScene - 1);
      } else if (e.key.toLowerCase() === 'm') {
        if (window.soundEngine) window.soundEngine.toggleMute();
      }
    });
  }

  goToScene(sceneId, animate = true) {
    if (sceneId < 1 || sceneId > this.totalScenes) return;

    this.currentScene = sceneId;
    this.updateNavDock();

    const meta = this.sceneMeta.find(s => s.id === sceneId);
    if (!meta || !meta.render) return;

    const transitionOut = () => {
      this.sceneContainer.innerHTML = '';
      this.sceneContainer.className = `scene-container scene-${sceneId}-active`;

      // Call scene renderer
      meta.render(this.sceneContainer, () => {
        // Callback on next
        if (this.currentScene < this.totalScenes) {
          this.goToScene(this.currentScene + 1);
        } else {
          this.goToScene(1);
        }
      });

      // Smooth scroll to top of scene
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Fade-in animation
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(this.sceneContainer, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    };

    if (animate && typeof gsap !== 'undefined') {
      gsap.to(this.sceneContainer, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        onComplete: transitionOut
      });
    } else {
      transitionOut();
    }
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new NeeluUniverseApp();
});

