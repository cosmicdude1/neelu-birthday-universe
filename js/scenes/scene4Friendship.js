/**
 * ===================================================================
 *  SCENE 4: AN UNEXPECTED FRIENDSHIP (STORYTELLING)
 * ===================================================================
 *  Central Idea:
 *   "Sometimes, the best friendships are the ones we never planned."
 *  Sentences displayed one by one:
 *   1. "Funny how life works..."
 *   2. "I wasn't searching for a friend like you."
 *   3. "I wasn't expecting someone like you to enter my life."
 *   4. "But somehow, our paths crossed."
 *   5. "And what started as a completely unplanned friendship became something I genuinely cherish."
 *  Climax:
 *   "Some of life's best surprises are the ones we never planned."
 * ===================================================================
 */

window.renderScene4Friendship = function(container, onNext) {
  const cfg = window.NEELU_CONFIG.story;
  const sentences = cfg.sentences;
  let currentIndex = 0;
  let autoPlayTimer = null;
  let isAutoPlaying = true;
  let isClimaxRevealed = false;

  container.innerHTML = `
    <div class="scene-inner story-scene" id="storySceneWrap">
      
      <!-- Slowly Moving Decorative Elements & Ambient Glowing Dust -->
      <div class="story-ambient-decor">
        <div class="constellation-node node-1"><span class="node-dot"></span><span class="node-line"></span></div>
        <div class="constellation-node node-2"><span class="node-dot"></span><span class="node-line"></span></div>
        <div class="constellation-node node-3"><span class="node-dot"></span></div>
        <span class="story-floating-star s-star-1">✨</span>
        <span class="story-floating-star s-star-2">✦</span>
        <span class="story-floating-star s-star-3">✧</span>
        <span class="story-floating-star s-star-4">✨</span>
      </div>

      <!-- Header Section -->
      <div class="scene-header story-header">
        <div class="story-tag-pill pulse-glow">
          <span class="tag-star">✦</span>
          <span class="tag-text">OUR FRIENDSHIP STORY</span>
          <span class="tag-star">✦</span>
        </div>

        <h1 class="scene-title story-main-title gradient-text glow-text">
          ${cfg.title}
        </h1>

        <div class="story-central-idea-card glass-panel">
          <p class="central-idea-text">
            “${cfg.centralIdea}”
          </p>
        </div>
      </div>

      <!-- Story Timeline Stepper / Progress Dots -->
      <div class="story-stepper-track" id="storyStepper">
        ${sentences.map((_, i) => `
          <button class="story-step-dot ${i === 0 ? 'active' : ''}" data-index="${i}" title="Moment ${i + 1}">
            <span class="dot-inner"></span>
            <span class="dot-num">${i + 1}</span>
          </button>
        `).join('')}
      </div>

      <!-- Cinematic Sentence Display Card -->
      <div class="story-stage-viewport">
        
        <div class="story-quote-card glass-panel" id="storyQuoteCard">
          <div class="story-card-top-decor">
            <span class="card-quote-glyph">“</span>
            <span class="card-step-badge" id="cardStepBadge">Part 1 of ${sentences.length}</span>
          </div>

          <div class="story-sentence-container" id="sentenceBox">
            <h2 class="story-active-sentence" id="storyText">
              ${sentences[0]}
            </h2>
          </div>

          <div class="story-card-bottom-decor">
            <div class="sentence-progress-bar-wrap">
              <div class="sentence-progress-bar" id="sentenceProgressBar"></div>
            </div>
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="story-playback-controls">
          <button id="btnPrevSentence" class="btn-secondary btn-icon-round" disabled title="Previous sentence">
            <span>◀</span>
          </button>

          <button id="btnToggleAutoPlay" class="btn-secondary autoplay-pill" title="Toggle autoplay">
            <span id="autoplayIcon">❚❚</span>
            <span id="autoplayLabel">Pause Story</span>
          </button>

          <button id="btnNextSentence" class="btn-primary btn-icon-round" title="Next sentence">
            <span>▶</span>
          </button>
        </div>

      </div>

      <!-- Climax Conclusion Card (Appears after Sentence 5) -->
      <div class="story-climax-card glass-panel" id="storyClimaxCard" style="display: none; opacity: 0;">
        <div class="climax-decor-star">✧</div>
        
        <h2 class="climax-main-quote text-glow-gold">
          “${cfg.climaxQuote}”
        </h2>

        <p class="climax-friendship-note">
          What began without expectation became one of the purest, most treasured friendships in my life.
          Thank you for being you, Neelu. 💛
        </p>

        <!-- Continue Button to Photo Gallery -->
        <div class="story-continue-wrap">
          <button id="btnProceedGallery" class="btn-primary shimmer-btn pulse-glow btn-gallery-continue">
            <span class="btn-icon">📸</span>
            <span class="btn-text">${cfg.continueButton}</span>
            <span class="btn-arrow">➜</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Elements
  const storyText = container.querySelector('#storyText');
  const cardBadge = container.querySelector('#cardStepBadge');
  const progressBar = container.querySelector('#sentenceProgressBar');
  const stepDots = container.querySelectorAll('.story-step-dot');
  const btnPrev = container.querySelector('#btnPrevSentence');
  const btnNext = container.querySelector('#btnNextSentence');
  const btnAutoPlay = container.querySelector('#btnToggleAutoPlay');
  const autoplayIcon = container.querySelector('#autoplayIcon');
  const autoplayLabel = container.querySelector('#autoplayLabel');
  const quoteCard = container.querySelector('#storyQuoteCard');
  const climaxCard = container.querySelector('#storyClimaxCard');
  const btnProceed = container.querySelector('#btnProceedGallery');

  // ----------------------------------------------------
  // STORY DISPLAY & ANIMATION
  // ----------------------------------------------------
  const showSentence = (index, animate = true) => {
    currentIndex = index;

    // Audio chime on transition
    if (window.soundEngine) {
      window.soundEngine.playSparkle();
    }

    // Update Dots
    stepDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.classList.toggle('passed', idx < currentIndex);
    });

    // Update Nav Buttons
    btnPrev.disabled = currentIndex === 0;
    cardBadge.textContent = `Part ${currentIndex + 1} of ${sentences.length}`;

    // Reset Progress Bar
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    // Text Transition
    const renderContent = () => {
      storyText.textContent = sentences[currentIndex];

      if (animate && typeof gsap !== 'undefined') {
        gsap.fromTo(storyText, 
          { opacity: 0, y: 22, filter: 'blur(8px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
        );
      } else {
        storyText.style.opacity = '1';
      }

      // Animate progress bar fill over duration
      if (isAutoPlaying) {
        setTimeout(() => {
          progressBar.style.transition = 'width 3.5s linear';
          progressBar.style.width = '100%';
        }, 50);
      }
    };

    if (animate && typeof gsap !== 'undefined') {
      gsap.to(storyText, {
        opacity: 0,
        y: -15,
        filter: 'blur(6px)',
        duration: 0.35,
        onComplete: renderContent
      });
    } else {
      renderContent();
    }

    // Schedule next sentence if autoplay is on
    resetAutoplayTimer();

    // If reached the last sentence, reveal climax conclusion card
    if (currentIndex === sentences.length - 1 && !isClimaxRevealed) {
      isClimaxRevealed = true;
      setTimeout(() => {
        revealClimax();
      }, 3500);
    }
  };

  const revealClimax = () => {
    climaxCard.style.display = 'block';

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#FFD700', '#F8BBD0', '#D1C4E9', '#FFFFFF']
      });
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(climaxCard, 
        { opacity: 0, y: 35, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.4)' }
      );
    } else {
      climaxCard.style.opacity = '1';
    }

    // Smooth scroll down to climax card on mobile
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
        if (currentIndex < sentences.length - 1) {
          showSentence(currentIndex + 1);
        } else {
          // Finished all sentences
          pauseAutoPlay();
        }
      }, 3800);
    }
  };

  const pauseAutoPlay = () => {
    isAutoPlaying = false;
    autoplayIcon.textContent = '▶';
    autoplayLabel.textContent = 'Play Story';
    if (autoPlayTimer) clearTimeout(autoPlayTimer);
    progressBar.style.transition = 'none';
  };

  const resumeAutoPlay = () => {
    isAutoPlaying = true;
    autoplayIcon.textContent = '❚❚';
    autoplayLabel.textContent = 'Pause Story';
    showSentence(currentIndex);
  };

  // ----------------------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------------------
  btnNext.addEventListener('click', () => {
    pauseAutoPlay();
    if (currentIndex < sentences.length - 1) {
      showSentence(currentIndex + 1);
    } else if (!isClimaxRevealed) {
      revealClimax();
    }
  });

  btnPrev.addEventListener('click', () => {
    pauseAutoPlay();
    if (currentIndex > 0) {
      showSentence(currentIndex - 1);
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
      showSentence(idx);
    });
  });

  // Continue Button to Scene 5 (Photo Gallery)
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

  // Mobile Touch Swipe Gesture Support
  let touchStartX = 0;
  quoteCard.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) touchStartX = e.touches[0].clientX;
  }, { passive: true });

  quoteCard.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      if (diffX < -50 && currentIndex < sentences.length - 1) {
        pauseAutoPlay();
        showSentence(currentIndex + 1);
      } else if (diffX > 50 && currentIndex > 0) {
        pauseAutoPlay();
        showSentence(currentIndex - 1);
      }
    }
  });

  // Start with sentence 1
  showSentence(0, false);
};
