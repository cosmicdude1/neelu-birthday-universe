/**
 * ===================================================================
 *  SCENE 1: CINEMATIC FULL-SCREEN WELCOME EXPERIENCE
 * ===================================================================
 *  Story Sequence:
 *   1. "Some people enter our lives unexpectedly..." (~3s)
 *   2. "And somehow, they become really special." (~3.5s)
 *   3. "Hey Neelu! ❤️" + "Open Your Surprise" button
 *   4. Click triggers:
 *      - Starlight cosmic warp acceleration
 *      - Shower of luminous floating hearts
 *      - Smooth cinematic transition to Scene 2 (Interactive Envelope)
 * ===================================================================
 */

window.renderScene1Welcome = function(container, onNext) {
  const p = window.NEELU_CONFIG.person;

  container.innerHTML = `
    <div class="cinematic-welcome-container" id="welcomeWrapper">
      <!-- Vignette & Glow Overlays -->
      <div class="cinematic-vignette"></div>
      <div class="cinematic-radial-glow"></div>
      
      <!-- Floating Hearts Burst Layer (Triggered on click) -->
      <div class="floating-hearts-layer" id="floatingHeartsLayer"></div>

      <!-- Stage Content Wrap -->
      <div class="cinematic-stage-wrap" id="cinematicStage">
        
        <!-- Phase 1: Line 1 -->
        <div class="cinematic-text-card stage-phase phase-1" id="phase1">
          <div class="cinematic-quote-pill">
            <span class="stardust-icon">✧</span>
            <span class="pill-label">A MOMENT IN TIME</span>
            <span class="stardust-icon">✧</span>
          </div>
          <h2 class="cinematic-phrase text-glow-subtle">
            “Some people enter our lives unexpectedly...”
          </h2>
        </div>

        <!-- Phase 2: Line 2 -->
        <div class="cinematic-text-card stage-phase phase-2" id="phase2" style="display: none; opacity: 0;">
          <div class="cinematic-quote-pill gold-pill">
            <span class="stardust-icon">✧</span>
            <span class="pill-label">DESTINY'S GIFT</span>
            <span class="stardust-icon">✧</span>
          </div>
          <h2 class="cinematic-phrase text-glow-gold">
            “And somehow, they become really special.”
          </h2>
        </div>

        <!-- Phase 3: Hey Neelu! & Grand CTA -->
        <div class="cinematic-text-card stage-phase phase-3" id="phase3" style="display: none; opacity: 0;">
          <div class="birthday-badge-pill pulse-glow">
            <span class="badge-sparkle">✨</span>
            <span class="badge-text">18 NOVEMBER • CELESTIAL CELEBRATION</span>
            <span class="badge-sparkle">✨</span>
          </div>

          <h1 class="cinematic-greeting-title gradient-text glow-text">
            Hey Neelu! <span class="beating-heart">❤️</span>
          </h1>

          <p class="cinematic-greeting-sub">
            Welcome to a little universe created exclusively for you.<br>
            Every star here holds a memory, every constellation sings of gratitude.
          </p>

          <!-- Animated "Open Your Surprise" Button -->
          <div class="surprise-btn-wrapper">
            <button id="btnOpenSurprise" class="btn-cinematic-surprise shimmer-btn pulse-glow" aria-label="Open Your Surprise">
              <span class="btn-sparkle-left">✦</span>
              <span class="btn-text-content">Open Your Surprise</span>
              <span class="btn-sparkle-right">✦</span>
              <div class="btn-halo-glow"></div>
            </button>
          </div>

          <div class="cinematic-bottom-actions">
            <button id="btnToggleWelcomeAudio" class="audio-chip-pill">
              <span id="welcomeAudioIcon">🎵</span>
              <span id="welcomeAudioLabel">Turn Music On</span>
            </button>

            <button id="btnReplayIntro" class="replay-intro-btn" title="Replay intro animation">
              <span>Replay Intro ↺</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Skip Intro Control -->
      <button id="btnSkipIntro" class="btn-skip-intro" title="Skip directly to surprise">
        <span>Skip intro ➜</span>
      </button>
    </div>
  `;

  // Elements
  const wrapper = container.querySelector('#welcomeWrapper');
  const stage = container.querySelector('#cinematicStage');
  const phase1 = container.querySelector('#phase1');
  const phase2 = container.querySelector('#phase2');
  const phase3 = container.querySelector('#phase3');
  const btnSurprise = container.querySelector('#btnOpenSurprise');
  const btnSkip = container.querySelector('#btnSkipIntro');
  const btnReplay = container.querySelector('#btnReplayIntro');
  const btnAudio = container.querySelector('#btnToggleWelcomeAudio');
  const audioIcon = container.querySelector('#welcomeAudioIcon');
  const audioLabel = container.querySelector('#welcomeAudioLabel');
  const heartsLayer = container.querySelector('#floatingHeartsLayer');

  let timers = [];
  let isTransitioning = false;

  const clearAllTimers = () => {
    timers.forEach(t => clearTimeout(t));
    timers = [];
  };

  // ----------------------------------------------------
  // ANIMATION SEQUENCE
  // ----------------------------------------------------
  const runSequence = () => {
    clearAllTimers();

    // Reset styles
    phase1.style.display = 'flex';
    phase1.style.opacity = '0';
    phase1.classList.remove('fade-out');

    phase2.style.display = 'none';
    phase2.style.opacity = '0';
    phase2.classList.remove('fade-out');

    phase3.style.display = 'none';
    phase3.style.opacity = '0';

    btnSkip.style.display = 'inline-flex';

    // Step 1: Fade in Phase 1 ("Some people enter our lives unexpectedly...")
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(phase1, 
        { opacity: 0, y: 30, scale: 0.96, filter: 'blur(10px)' }, 
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' }
      );
    } else {
      phase1.style.opacity = '1';
    }

    // Step 2: Transition to Phase 2 after ~3 seconds
    const t1 = setTimeout(() => {
      // Fade out phase 1
      if (typeof gsap !== 'undefined') {
        gsap.to(phase1, {
          opacity: 0,
          y: -25,
          filter: 'blur(8px)',
          duration: 0.8,
          ease: 'power2.in',
          onComplete: () => {
            phase1.style.display = 'none';
            // Show phase 2
            phase2.style.display = 'flex';
            gsap.fromTo(phase2,
              { opacity: 0, y: 30, scale: 0.96, filter: 'blur(10px)' },
              { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' }
            );

            // Trigger soft shooting star during transition
            if (window.app && window.app.universeBg) {
              window.app.universeBg.spawnShootingStar();
            }
          }
        });
      } else {
        phase1.style.display = 'none';
        phase2.style.display = 'flex';
        phase2.style.opacity = '1';
      }
    }, 3200);
    timers.push(t1);

    // Step 3: Transition to Phase 3 ("Hey Neelu! ❤️" + "Open Your Surprise") after ~6.8 seconds
    const t2 = setTimeout(() => {
      showPhase3();
    }, 6800);
    timers.push(t2);
  };

  const showPhase3 = () => {
    clearAllTimers();
    btnSkip.style.display = 'none';

    const animateInPhase3 = () => {
      phase1.style.display = 'none';
      phase2.style.display = 'none';
      phase3.style.display = 'flex';

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(phase3,
          { opacity: 0, y: 35, scale: 0.95, filter: 'blur(12px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
        );
      } else {
        phase3.style.opacity = '1';
      }

      // Sparkle sound
      if (window.soundEngine && !window.soundEngine.isMuted) {
        window.soundEngine.playChime();
      }
    };

    if (phase2.style.display !== 'none' && typeof gsap !== 'undefined') {
      gsap.to(phase2, {
        opacity: 0,
        y: -25,
        filter: 'blur(8px)',
        duration: 0.7,
        onComplete: animateInPhase3
      });
    } else {
      animateInPhase3();
    }
  };

  // ----------------------------------------------------
  // SPAWN FLOATING HEARTS ON CLICK
  // ----------------------------------------------------
  const spawnFloatingHearts = () => {
    const heartSymbols = ['❤️', '💖', '💕', '✨', '🌸', '💛'];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-cinematic-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      
      const startX = Math.random() * 100; // vw
      const driftX = (Math.random() - 0.5) * 150; // px
      const duration = 1.8 + Math.random() * 1.6; // s
      const delay = Math.random() * 0.4;
      const size = 18 + Math.random() * 24;

      heart.style.left = `${startX}vw`;
      heart.style.bottom = `-40px`;
      heart.style.fontSize = `${size}px`;
      heart.style.setProperty('--drift-x', `${driftX}px`);
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;

      heartsLayer.appendChild(heart);

      setTimeout(() => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
      }, (duration + delay) * 1000);
    }
  };

  // ----------------------------------------------------
  // BUTTON ACTION: OPEN YOUR SURPRISE
  // ----------------------------------------------------
  btnSurprise.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;

    // 1. Play sound
    if (window.soundEngine) {
      window.soundEngine.getContext();
      window.soundEngine.playSparkle();
      if (!window.soundEngine.isMuted && !window.soundEngine.isPlayingBgMusic) {
        window.soundEngine.playBgMusic();
      }
    }

    // 2. Confetti sparkle
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F8BBD0', '#D1C4E9', '#FFE0B2', '#FFD700', '#FFFFFF']
      });
    }

    // 3. Spawn floating hearts
    spawnFloatingHearts();

    // 4. Animate button expansion & light bloom
    btnSurprise.classList.add('surprise-clicked');
    wrapper.classList.add('cinematic-warp-active');

    // 5. Trigger cosmic warp in Three.js universe!
    if (window.app && window.app.universeBg) {
      window.app.universeBg.triggerWarpTransition(() => {
        onNext();
      });
    } else {
      setTimeout(() => {
        onNext();
      }, 1200);
    }
  });

  // Skip button
  btnSkip.addEventListener('click', () => {
    showPhase3();
  });

  // Replay intro
  btnReplay.addEventListener('click', () => {
    runSequence();
  });

  // Audio Toggle
  btnAudio.addEventListener('click', () => {
    if (window.soundEngine) {
      const isMuted = window.soundEngine.toggleMute();
      if (isMuted) {
        audioIcon.textContent = '🔇';
        audioLabel.textContent = 'Muted';
      } else {
        audioIcon.textContent = '🎵';
        audioLabel.textContent = 'Music On';
        window.soundEngine.playSparkle();
      }
    }
  });

  // ----------------------------------------------------
  // SUBTLE PARALLAX TRACKING
  // ----------------------------------------------------
  const handleParallax = (xNorm, yNorm) => {
    if (stage) {
      stage.style.transform = `translate3d(${xNorm * 18}px, ${yNorm * 18}px, 0)`;
    }
  };

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    handleParallax(x, y);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      const y = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      handleParallax(x, y);
    }
  }, { passive: true });

  // Start sequence immediately
  runSequence();
};
