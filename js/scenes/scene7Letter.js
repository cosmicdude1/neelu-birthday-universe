/**
 * ===================================================================
 *  SCENE 7: A PERSONALIZED BIRTHDAY LETTER
 * ===================================================================
 *  Features:
 *   - Cream-colored textured paper on a dreamy soft pink celestial backdrop
 *   - Elegant handwritten typography (Caveat / Dancing Script)
 *   - Ambient floating flowers and blossoms (🌸 🌺 💮)
 *   - Realistic letter-opening and unfolding animation
 *   - Fluid, comfortable typewriter effect with autoscroll
 *   - Instant "⚡ Skip & Read All" option
 *   - Animated pulsing glowing heart at the end
 *   - Integrated audio voice note player ribbon & Print Keepsake
 * ===================================================================
 */

window.renderScene7Letter = function(container, onNext) {
  const cfg = window.NEELU_CONFIG.letter;
  const audioCfg = window.NEELU_CONFIG.audio;
  const paragraphs = cfg.paragraphs;

  let isTyping = false;
  let isSkipped = false;
  let typewriterTimeout = null;
  let currentParaIndex = 0;
  let currentCharIndex = 0;

  container.innerHTML = `
    <div class="scene-inner letter-scene-wrapper" id="letterSceneWrapper">
      
      <!-- Floating Flowers & Blossom Petals Layer -->
      <div class="floating-flowers-layer" aria-hidden="true">
        <span class="drift-flower fl-1">🌸</span>
        <span class="drift-flower fl-2">💮</span>
        <span class="drift-flower fl-3">🌺</span>
        <span class="drift-flower fl-4">🌸</span>
        <span class="drift-flower fl-5">✨</span>
        <span class="drift-flower fl-6">🌸</span>
        <span class="drift-flower fl-7">💮</span>
      </div>

      <!-- Scene Header -->
      <div class="scene-header letter-header">
        <div class="letter-badge-pill pulse-glow">
          <span class="badge-icon">💌</span>
          <span>HANDWRITTEN FROM THE SOUL • 18 NOVEMBER</span>
          <span class="badge-icon">💌</span>
        </div>
        <h1 class="scene-title letter-main-title gradient-text">${cfg.title}</h1>
        <p class="scene-desc letter-sub-desc">${cfg.date}</p>
      </div>

      <!-- Audio Voice Note Player Ribbon -->
      <div class="voice-note-player-card glass-panel" id="voiceNoteCard">
        <div class="voice-left">
          <button class="btn-voice-play pulse-subtle" id="btnPlayVoiceNote" title="Play / Pause Audio Note">
            <span id="voicePlayIcon">▶</span>
          </button>
          <div class="voice-meta">
            <span class="voice-title">${audioCfg.customAudioTitle}</span>
            <span class="voice-status" id="voiceStatus">Tap to listen before reading 🎧</span>
          </div>
        </div>
        <div class="voice-waves" id="voiceWaves">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>

      <!-- Controls Strip: Skip & Speed Controls -->
      <div class="letter-control-strip" id="letterControlStrip">
        <button id="btnSkipTyping" class="btn-skip-typing" title="Skip typing and display full letter">
          <span class="skip-icon">⚡</span>
          <span id="skipBtnText">Skip & Read All Immediately</span>
        </button>
      </div>

      <!-- Main Letter Unfolding & Parchment Container -->
      <div class="letter-envelope-viewport" id="envelopeViewport">
        
        <!-- Pre-Open Folded Parchment State -->
        <div class="folded-letter-envelope" id="foldedLetterCard">
          <div class="folded-paper-flap top-flap"></div>
          <div class="folded-envelope-body">
            <div class="folded-wax-seal" id="btnOpenLetter">
              <span class="seal-ring"></span>
              <span class="seal-inner">N</span>
              <div class="seal-glow-halo"></div>
            </div>
            <p class="folded-prompt">Tap the seal to open Neelu's Letter 💌</p>
          </div>
        </div>

        <!-- Realistic Unfolded Cream Parchment Sheet -->
        <div class="cream-parchment-sheet" id="creamParchment" style="display: none;">
          <div class="parchment-inner-frame">
            
            <!-- Parchment Ornaments -->
            <div class="parchment-top-bar">
              <span class="parchment-filigree">❦</span>
              <span class="parchment-date-stamp">18 November • Exclusively for Neelu</span>
              <span class="parchment-filigree">❦</span>
            </div>

            <!-- Dynamic Typed Letter Content -->
            <div class="parchment-typed-content" id="parchmentTypedContent">
              <!-- Typed paragraphs will stream here -->
            </div>

            <!-- Animated Heart Climax (Revealed at the end) -->
            <div class="letter-animated-heart-wrapper" id="letterHeartWrapper" style="display: none; opacity: 0;">
              <div class="heart-pulse-halo"></div>
              <div class="animated-beating-heart">
                <svg viewBox="0 0 32 29.6" class="heart-svg">
                  <defs>
                    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FF4081" />
                      <stop offset="50%" stop-color="#E91E63" />
                      <stop offset="100%" stop-color="#C2185B" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#heartGrad)" d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"/>
                </svg>
              </div>
              <p class="heart-caption">Forever cherished • Happy Birthday Neelu ❤️</p>
            </div>

            <!-- Golden Wax Stamp Seal at bottom -->
            <div class="parchment-bottom-seal">
              <div class="seal-stamp-circle">
                <span>N</span>
              </div>
              <span class="seal-label">Sealed with Endless Gratitude • 18 November</span>
            </div>

          </div>
        </div>

      </div>

      <!-- Action Buttons (Print & Continue to Finale) -->
      <div class="letter-actions-group" id="letterActionsGroup">
        <button id="btnPrintLetter" class="btn-secondary btn-print">
          <span class="btn-icon">🖨️</span>
          <span>Print / Save Keepsake</span>
        </button>

        <button id="btnProceedFinale" class="btn-primary shimmer-btn btn-to-finale">
          <span class="btn-icon">🎆</span>
          <span>${cfg.continueButton}</span>
          <span class="btn-arrow">➜</span>
        </button>
      </div>

    </div>
  `;

  // DOM Elements
  const foldedCard = container.querySelector('#foldedLetterCard');
  const btnOpen = container.querySelector('#btnOpenLetter');
  const parchmentSheet = container.querySelector('#creamParchment');
  const typedContainer = container.querySelector('#parchmentTypedContent');
  const heartWrapper = container.querySelector('#letterHeartWrapper');
  const btnSkip = container.querySelector('#btnSkipTyping');
  const skipText = container.querySelector('#skipBtnText');
  const btnPlayVoice = container.querySelector('#btnPlayVoiceNote');
  const voiceIcon = container.querySelector('#voicePlayIcon');
  const voiceStatus = container.querySelector('#voiceStatus');
  const voiceWaves = container.querySelector('#voiceWaves');
  const btnPrint = container.querySelector('#btnPrintLetter');
  const btnProceed = container.querySelector('#btnProceedFinale');

  // ----------------------------------------------------
  // TYPEWRITER ENGINE
  // ----------------------------------------------------
  let activeParaElem = null;
  let cursorSpan = null;

  const createCursor = () => {
    cursorSpan = document.createElement('span');
    cursorSpan.className = 'typewriter-cursor';
    cursorSpan.textContent = '▮';
  };

  const removeCursor = () => {
    if (cursorSpan && cursorSpan.parentNode) {
      cursorSpan.parentNode.removeChild(cursorSpan);
    }
  };

  const startTypewriter = () => {
    if (isTyping) return;
    isTyping = true;
    createCursor();
    typeNextChar();
  };

  const typeNextChar = () => {
    if (isSkipped) return;

    if (currentParaIndex >= paragraphs.length) {
      // Completed typing all paragraphs
      finishLetterDisplay();
      return;
    }

    const currentParaText = paragraphs[currentParaIndex];

    // If starting a new paragraph
    if (currentCharIndex === 0) {
      activeParaElem = document.createElement('p');
      activeParaElem.className = 'handwritten-para';
      
      // Styling distinction for salutation or emphasis
      if (currentParaIndex === 0) {
        activeParaElem.classList.add('para-salutation');
      } else if (currentParaText.includes('HAPPY BIRTHDAY')) {
        activeParaElem.classList.add('para-highlight');
      } else if (currentParaIndex === paragraphs.length - 1) {
        activeParaElem.classList.add('para-signature');
      }

      typedContainer.appendChild(activeParaElem);
      activeParaElem.appendChild(cursorSpan);
    }

    if (currentCharIndex < currentParaText.length) {
      // Append character before the cursor
      const char = currentParaText.charAt(currentCharIndex);
      activeParaElem.insertBefore(document.createTextNode(char), cursorSpan);
      currentCharIndex++;

      // Autoscroll gently as new lines appear
      if (currentCharIndex % 15 === 0 && !isSkipped) {
        parchmentSheet.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Dynamic typing cadence: faster for standard letters, slight pause on punctuation
      let charDelay = 18;
      if (char === '.' || char === '!' || char === '?') {
        charDelay = 90;
      } else if (char === ',') {
        charDelay = 45;
      }

      typewriterTimeout = setTimeout(typeNextChar, charDelay);
    } else {
      // Finished current paragraph, advance to next
      removeCursor();
      currentParaIndex++;
      currentCharIndex = 0;
      // Short pause between paragraphs
      typewriterTimeout = setTimeout(typeNextChar, 160);
    }
  };

  // ----------------------------------------------------
  // SKIP TYPING & REVEAL ALL
  // ----------------------------------------------------
  const skipToFullLetter = () => {
    if (isSkipped) return;
    isSkipped = true;
    isTyping = false;

    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }

    removeCursor();

    // Render all paragraphs instantly
    typedContainer.innerHTML = '';
    paragraphs.forEach((pText, idx) => {
      const p = document.createElement('p');
      p.className = 'handwritten-para';
      if (idx === 0) p.classList.add('para-salutation');
      else if (pText.includes('HAPPY BIRTHDAY')) p.classList.add('para-highlight');
      else if (idx === paragraphs.length - 1) p.classList.add('para-signature');
      p.textContent = pText;
      typedContainer.appendChild(p);
    });

    if (window.soundEngine) {
      window.soundEngine.playSparkle();
    }

    finishLetterDisplay();
  };

  // ----------------------------------------------------
  // LETTER COMPLETION & HEART CELEBRATION
  // ----------------------------------------------------
  const finishLetterDisplay = () => {
    removeCursor();
    isTyping = false;

    btnSkip.style.display = 'none';

    // Reveal Animated Heart
    heartWrapper.style.display = 'flex';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(heartWrapper, 
        { opacity: 0, scale: 0.6, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'back.out(1.8)' }
      );
    } else {
      heartWrapper.style.opacity = '1';
    }

    // Play heart chime
    if (window.soundEngine) {
      window.soundEngine.playAngelFeather();
    }

    // Confetti celebration
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.75 },
        colors: ['#FF4081', '#F8BBD0', '#FFD700', '#FFFFFF', '#D1C4E9']
      });
    }
  };

  // ----------------------------------------------------
  // LETTER OPENING INTERACTION
  // ----------------------------------------------------
  const openLetter = () => {
    if (window.soundEngine) {
      window.soundEngine.playWaxSnap();
    }

    // 3D unfold animation
    if (typeof gsap !== 'undefined') {
      gsap.to(foldedCard, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          foldedCard.style.display = 'none';
          parchmentSheet.style.display = 'block';

          gsap.fromTo(parchmentSheet, 
            { opacity: 0, scale: 0.95, y: 25, rotateX: 12 }, 
            { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 0.85, ease: 'power2.out', onComplete: startTypewriter }
          );
        }
      });
    } else {
      foldedCard.style.display = 'none';
      parchmentSheet.style.display = 'block';
      startTypewriter();
    }
  };

  btnOpen.addEventListener('click', openLetter);
  foldedCard.addEventListener('click', openLetter);

  btnSkip.addEventListener('click', () => {
    if (foldedCard.style.display !== 'none') {
      foldedCard.style.display = 'none';
      parchmentSheet.style.display = 'block';
    }
    skipToFullLetter();
  });

  // ----------------------------------------------------
  // AUDIO VOICE NOTE INTEGRATION
  // ----------------------------------------------------
  let hasStartedVoice = false;

  btnPlayVoice.addEventListener('click', () => {
    if (window.soundEngine) {
      hasStartedVoice = true;
      window.soundEngine.toggleCustomAudio();
    }
  });

  window.addEventListener('audioStateChange', (e) => {
    if (e.detail) {
      if (e.detail.isPlayingCustom) {
        voiceIcon.textContent = '❚❚';
        voiceStatus.textContent = 'Playing Special Voice Note for Neelu 🎙️';
        voiceWaves.classList.add('playing');
      } else {
        voiceIcon.textContent = '▶';
        voiceStatus.textContent = hasStartedVoice ? 'Paused • Tap to resume' : 'Tap to listen before reading 🎧';
        voiceWaves.classList.remove('playing');
      }
    }
  });

  // ----------------------------------------------------
  // ACTION BUTTONS
  // ----------------------------------------------------
  btnPrint.addEventListener('click', () => {
    // If typing hasn't finished, reveal all before printing
    if (!isSkipped && isTyping) {
      skipToFullLetter();
    }
    window.print();
  });

  btnProceed.addEventListener('click', () => {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if (window.soundEngine) window.soundEngine.playChime();
    container.classList.add('scene-exit-fade');
    setTimeout(() => onNext(), 400);
  });
};
