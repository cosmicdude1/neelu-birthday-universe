/**
 * ===================================================================
 *  SCENE 6: MY GUARDIAN ANGEL
 * ===================================================================
 *  Visuals:
 *   - Dreamy peaceful night sky with a luminous glowing moon
 *   - Soft ethereal light rays streaming through lavender & pink mist
 *   - Fluttering animated butterflies & drifting tiny stars
 *  Story Sequence:
 *   - Gradual handwritten reveal of the 7 heartfelt reflections
 *   - Pure, emotional, friendly appreciation of her support
 *   - Climax: "Thank you for being my guardian angel, Neelu. ❤️"
 *   - Smooth transition to Scene 7 (Personalized Birthday Letter)
 * ===================================================================
 */

window.renderScene6Angel = function(container, onNext) {
  const cfg = window.NEELU_CONFIG.angel;
  const lines = cfg.lines;
  let currentLineIndex = 0;
  let autoPlayTimer = null;
  let isAutoPlaying = true;
  let isEnded = false;

  container.innerHTML = `
    <div class="scene-inner angel-scene" id="angelSceneWrapper">
      
      <!-- Dreamy Celestial Sky: Luminous Moon & Volumetric Light Rays -->
      <div class="celestial-moon-system">
        <div class="moon-halo-outer"></div>
        <div class="moon-halo-inner"></div>
        <div class="glowing-moon" id="glowingMoon">
          <div class="moon-surface">
            <span class="moon-crater c1"></span>
            <span class="moon-crater c2"></span>
            <span class="moon-crater c3"></span>
          </div>
        </div>
        <!-- Ethereal Downward Light Rays -->
        <div class="moon-light-rays">
          <span class="light-ray ray-1"></span>
          <span class="light-ray ray-2"></span>
          <span class="light-ray ray-3"></span>
        </div>
      </div>

      <!-- Animated Floating Glowing Butterflies Layer -->
      <div class="floating-butterflies-layer">
        
        <!-- Butterfly 1 (Pastel Pink) -->
        <div class="butterfly-flight-wrap bfly-1">
          <div class="butterfly pink-butterfly">
            <span class="wing wing-l"></span>
            <span class="bfly-body"></span>
            <span class="wing wing-r"></span>
          </div>
        </div>

        <!-- Butterfly 2 (Lavender) -->
        <div class="butterfly-flight-wrap bfly-2">
          <div class="butterfly lavender-butterfly">
            <span class="wing wing-l"></span>
            <span class="bfly-body"></span>
            <span class="wing wing-r"></span>
          </div>
        </div>

        <!-- Butterfly 3 (Golden Glow) -->
        <div class="butterfly-flight-wrap bfly-3">
          <div class="butterfly gold-butterfly">
            <span class="wing wing-l"></span>
            <span class="bfly-body"></span>
            <span class="wing wing-r"></span>
          </div>
        </div>

        <!-- Floating ambient stardust -->
        <span class="angel-star a-star-1">✨</span>
        <span class="angel-star a-star-2">✧</span>
        <span class="angel-star a-star-3">✦</span>
        <span class="angel-star a-star-4">✨</span>
      </div>

      <!-- Scene Header -->
      <div class="scene-header angel-header">
        <div class="angel-badge-pill pulse-glow">
          <span class="badge-star">🕊️</span>
          <span class="badge-text">SACRED GRATITUDE • 18 NOVEMBER</span>
          <span class="badge-star">🕊️</span>
        </div>

        <h1 class="scene-title angel-main-title gradient-text glow-gold">
          ${cfg.title}
        </h1>

        <p class="scene-desc angel-sub-desc">
          ${cfg.subtitle}
        </p>
      </div>

      <!-- Progressive Timeline Stepper -->
      <div class="angel-stepper-track" id="angelStepper">
        ${lines.map((_, i) => `
          <button class="angel-step-dot ${i === 0 ? 'active' : ''}" data-index="${i}" title="Thought ${i + 1}">
            <span class="dot-core"></span>
          </button>
        `).join('')}
      </div>

      <!-- Cinematic Reflection Stage Card -->
      <div class="angel-stage-viewport">
        <div class="angel-reflection-card glass-panel" id="angelCard">
          
          <div class="angel-card-header">
            <span class="angel-card-counter" id="angelLineCounter">Thought 1 of ${lines.length}</span>
            <span class="angel-halo-icon">✧</span>
          </div>

          <!-- Active Handwritten Sentence -->
          <div class="angel-text-container">
            <h2 class="angel-active-text" id="angelActiveText">
              ${lines[0]}
            </h2>
          </div>

          <div class="angel-progress-wrap">
            <div class="angel-progress-fill" id="angelProgressFill"></div>
          </div>
        </div>

        <!-- Micro Playback Navigation -->
        <div class="angel-controls-bar">
          <button id="btnAngelPrev" class="btn-secondary btn-icon-round" disabled title="Previous reflection">
            <span>◀</span>
          </button>

          <button id="btnAngelAutoplay" class="btn-secondary autoplay-pill" title="Toggle autoplay">
            <span id="angelPlayIcon">❚❚</span>
            <span id="angelPlayLabel">Pause</span>
          </button>

          <button id="btnAngelNext" class="btn-primary btn-icon-round" title="Next reflection">
            <span>▶</span>
          </button>
        </div>
      </div>

      <!-- Ending Climax Card (Appears after line 7) -->
      <div class="angel-climax-card glass-panel" id="angelClimaxCard" style="display: none; opacity: 0;">
        <div class="angel-wings-crest">
          <span class="wings-left">🪶</span>
          <span class="heart-center">🤍</span>
          <span class="wings-right">🪶</span>
        </div>

        <h2 class="angel-final-quote text-glow-gold">
          “${cfg.ending}”
        </h2>

        <p class="angel-final-sub">
          Some friends enter your life by chance, but stay as a lifelong blessing.<br>
          I will always be thankful for your gentle heart, Neelu.
        </p>

        <!-- Continue Button to Scene 7: Personalized Letter -->
        <div class="angel-continue-wrap">
          <button id="btnProceedLetter" class="btn-primary shimmer-btn pulse-glow btn-angel-continue">
            <span class="btn-icon">📜</span>
            <span class="btn-text">${cfg.continueButton}</span>
            <span class="btn-arrow">➜</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Elements
  const activeText = container.querySelector('#angelActiveText');
  const counterLabel = container.querySelector('#angelLineCounter');
  const progressFill = container.querySelector('#angelProgressFill');
  const stepDots = container.querySelectorAll('.angel-step-dot');
  const btnPrev = container.querySelector('#btnAngelPrev');
  const btnNext = container.querySelector('#btnAngelNext');
  const btnAutoPlay = container.querySelector('#btnAngelAutoplay');
  const playIcon = container.querySelector('#angelPlayIcon');
  const playLabel = container.querySelector('#angelPlayLabel');
  const angelCard = container.querySelector('#angelCard');
  const climaxCard = container.querySelector('#angelClimaxCard');
  const btnProceed = container.querySelector('#btnProceedLetter');

  // ----------------------------------------------------
  // SEQUENCED THOUGHT REVEAL
  // ----------------------------------------------------
  const showThought = (index, animate = true) => {
    currentLineIndex = index;

    // Play angelic chime sound
    if (window.soundEngine) {
      window.soundEngine.playAngelFeather();
    }

    // Update Dots
    stepDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentLineIndex);
      dot.classList.toggle('passed', idx < currentLineIndex);
    });

    btnPrev.disabled = currentLineIndex === 0;
    counterLabel.textContent = `Thought ${currentLineIndex + 1} of ${lines.length}`;

    // Reset Progress Bar
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    const renderText = () => {
      activeText.textContent = `“${lines[currentLineIndex]}”`;

      if (animate && typeof gsap !== 'undefined') {
        gsap.fromTo(activeText, 
          { opacity: 0, y: 20, filter: 'blur(8px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }
        );
      } else {
        activeText.style.opacity = '1';
      }

      if (isAutoPlaying) {
        setTimeout(() => {
          progressFill.style.transition = 'width 3.8s linear';
          progressFill.style.width = '100%';
        }, 50);
      }
    };

    if (animate && typeof gsap !== 'undefined') {
      gsap.to(activeText, {
        opacity: 0,
        y: -15,
        filter: 'blur(6px)',
        duration: 0.35,
        onComplete: renderText
      });
    } else {
      renderText();
    }

    // Schedule next thought
    resetAutoplayTimer();

    // If final line reached, reveal emotional climax card
    if (currentLineIndex === lines.length - 1 && !isEnded) {
      isEnded = true;
      setTimeout(() => {
        revealClimax();
      }, 4000);
    }
  };

  const revealClimax = () => {
    climaxCard.style.display = 'block';

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.72 },
        colors: ['#FFD700', '#F8BBD0', '#D1C4E9', '#FFFFFF']
      });
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(climaxCard, 
        { opacity: 0, y: 35, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }
      );
    } else {
      climaxCard.style.opacity = '1';
    }

    setTimeout(() => {
      climaxCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  const resetAutoplayTimer = () => {
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer);
      autoPlayTimer = null;
    }

    if (isAutoPlaying) {
      autoPlayTimer = setTimeout(() => {
        if (currentLineIndex < lines.length - 1) {
          showThought(currentLineIndex + 1);
        } else {
          pauseAutoPlay();
        }
      }, 4200);
    }
  };

  const pauseAutoPlay = () => {
    isAutoPlaying = false;
    playIcon.textContent = '▶';
    playLabel.textContent = 'Play';
    if (autoPlayTimer) clearTimeout(autoPlayTimer);
    progressFill.style.transition = 'none';
  };

  const resumeAutoPlay = () => {
    isAutoPlaying = true;
    playIcon.textContent = '❚❚';
    playLabel.textContent = 'Pause';
    showThought(currentLineIndex);
  };

  // Event Listeners
  btnNext.addEventListener('click', () => {
    pauseAutoPlay();
    if (currentLineIndex < lines.length - 1) {
      showThought(currentLineIndex + 1);
    } else if (!isEnded) {
      revealClimax();
    }
  });

  btnPrev.addEventListener('click', () => {
    pauseAutoPlay();
    if (currentLineIndex > 0) {
      showThought(currentLineIndex - 1);
    }
  });

  btnAutoPlay.addEventListener('click', () => {
    if (isAutoPlaying) pauseAutoPlay();
    else resumeAutoPlay();
  });

  stepDots.forEach(dot => {
    dot.addEventListener('click', () => {
      pauseAutoPlay();
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showThought(idx);
    });
  });

  // Continue to Scene 7 (Personalized Letter)
  btnProceed.addEventListener('click', () => {
    if (autoPlayTimer) clearTimeout(autoPlayTimer);

    if (window.soundEngine) {
      window.soundEngine.playChime();
    }

    container.classList.add('scene-exit-fade');
    setTimeout(() => {
      onNext();
    }, 450);
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  angelCard.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) touchStartX = e.touches[0].clientX;
  }, { passive: true });

  angelCard.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      if (diffX < -50 && currentLineIndex < lines.length - 1) {
        pauseAutoPlay();
        showThought(currentLineIndex + 1);
      } else if (diffX > 50 && currentLineIndex > 0) {
        pauseAutoPlay();
        showThought(currentLineIndex - 1);
      }
    }
  });

  // Initialize with line 1
  showThought(0, false);
};
