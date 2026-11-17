/**
 * ===================================================================
 *  SCENE 2: INTERACTIVE 3D BIRTHDAY ENVELOPE
 * ===================================================================
 *  Design:
 *   - Pastel pink envelope with realistic paper texture & soft shadows
 *   - Heart-shaped wax seal with golden embossed heart
 *   - Floating decorative flowers and stardust particles
 *  Interaction:
 *   1. Heart seal animates with crack and gold particle burst
 *   2. Envelope flap rotates open in 3D
 *   3. Letter slowly emerges from inside
 *   4. Letter smoothly unfolds in 3D
 *   5. Displays the special birthday message for Neelu
 *   6. "Let's Celebrate!" button transitions to 3D Birthday Cake
 * ===================================================================
 */

window.renderScene2Envelope = function(container, onNext) {
  const cfg = window.NEELU_CONFIG.envelope;

  container.innerHTML = `
    <div class="scene-inner envelope-scene" id="envelopeSceneWrap">
      
      <!-- Decorative Floating Flowers & Petals Layer -->
      <div class="floating-decor-layer" id="decorFlowerLayer">
        <span class="decor-flower flower-1">🌸</span>
        <span class="decor-flower flower-2">🌺</span>
        <span class="decor-flower flower-3">🌸</span>
        <span class="decor-flower flower-4">✨</span>
        <span class="decor-flower flower-5">🌸</span>
        <span class="decor-flower flower-6">💮</span>
      </div>

      <!-- Scene Header -->
      <div class="scene-header envelope-header">
        <span class="scene-tag">SPECIAL DELIVERY • 18 NOVEMBER</span>
        <h2 class="scene-title gradient-text">${cfg.heading}</h2>
        <p class="scene-desc">${cfg.subtitle}</p>
      </div>

      <!-- 3D Envelope Master Stage -->
      <div class="envelope-3d-stage" id="envelopeStage">
        
        <!-- Soft Realistic Shadow on Floor -->
        <div class="envelope-floor-shadow" id="envelopeShadow"></div>

        <!-- Envelope 3D Body -->
        <div class="envelope-3d" id="envelopeBody">
          
          <!-- Back Wall with Interior Silky Lining -->
          <div class="env-layer env-back">
            <div class="env-interior-pattern"></div>
          </div>

          <!-- Inside Letter (Tucked inside, emerges and unfolds) -->
          <div class="letter-document" id="letterDoc">
            <div class="letter-paper-texture">
              <div class="letter-inner-frame">
                
                <!-- Decorative Crown / Floral Header -->
                <div class="letter-crest">
                  <span class="crest-line"></span>
                  <span class="crest-icon">👑</span>
                  <span class="crest-line"></span>
                </div>

                <!-- Salutation -->
                <h3 class="letter-salutation">${cfg.salutation}</h3>

                <!-- Message Body -->
                <div class="letter-message-content">
                  <p class="letter-msg-line line-intro">
                    ${cfg.messageLines[0]}
                  </p>
                  <p class="letter-msg-line line-main">
                    ${cfg.messageLines[1]}
                  </p>
                  <div class="letter-msg-highlight">
                    <span class="highlight-sparkle">✦</span>
                    <span class="highlight-text">${cfg.messageLines[2]}</span>
                    <span class="highlight-sparkle">✦</span>
                  </div>
                </div>

                <!-- Decorative Floral Ribbon -->
                <div class="letter-decor-ribbon">
                  <span class="ribbon-flower">🌸</span>
                  <span class="ribbon-flower">✨</span>
                  <span class="ribbon-flower">🌸</span>
                </div>

                <!-- "Let's Celebrate!" Button -->
                <div class="letter-action-wrap">
                  <button id="btnCelebrate" class="btn-primary shimmer-btn btn-celebrate pulse-subtle">
                    <span class="btn-icon">🎂</span>
                    <span class="btn-text">${cfg.buttonText}</span>
                    <span class="btn-icon">✨</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          <!-- Front Sleeve / Pocket Fold Layers -->
          <div class="env-layer env-pocket-left"></div>
          <div class="env-layer env-pocket-right"></div>
          <div class="env-layer env-pocket-bottom"></div>

          <!-- Top Triangular Flap with Golden Foil Rim -->
          <div class="env-flap-hinge" id="envelopeFlap">
            <div class="env-flap-inner">
              <div class="flap-gold-rim"></div>
              
              <!-- Heart-Shaped Wax Seal -->
              <div class="heart-wax-seal" id="heartWaxSeal" title="Touch to open your letter 💌" role="button" tabindex="0">
                <div class="wax-seal-heart-shape">
                  <svg class="heart-seal-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="heartWaxGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#FF4081"/>
                        <stop offset="45%" stop-color="#E91E63"/>
                        <stop offset="85%" stop-color="#C2185B"/>
                        <stop offset="100%" stop-color="#880E4F"/>
                      </linearGradient>
                      <filter id="waxGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#880E4F" flood-opacity="0.5"/>
                      </filter>
                    </defs>
                    <!-- Outer embossed wax puddle -->
                    <path d="M24 6 C28 2, 44 4, 44 20 C44 32, 28 42, 24 45 C20 42, 4 32, 4 20 C4 4, 20 2, 24 6 Z" 
                          fill="url(#heartWaxGrad)" filter="url(#waxGlow)"/>
                    <!-- Inner engraved heart border -->
                    <path d="M24 10 C27 7, 40 8, 40 20 C40 29, 27 38, 24 40 C21 38, 8 29, 8 20 C8 8, 21 7, 24 10 Z" 
                          stroke="rgba(255, 215, 0, 0.65)" stroke-width="1.5" stroke-dasharray="2 1" fill="none"/>
                    <!-- Letter N emblem inside heart -->
                    <text x="24" y="27" font-family="'Playfair Display', Georgia, serif" font-weight="700" font-size="14" fill="#FFFDF8" text-anchor="middle">N</text>
                  </svg>
                </div>
                <div class="heart-seal-aura"></div>
                <div class="heart-seal-sparkle"></div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- Interactive Prompt Banner -->
      <div class="envelope-prompt-banner" id="envelopePrompt">
        <span class="pointer-hand-icon">👆</span>
        <span class="prompt-instruction">${cfg.sealText}</span>
      </div>

    </div>
  `;

  // Elements
  const stage = container.querySelector('#envelopeStage');
  const envelopeBody = container.querySelector('#envelopeBody');
  const envelopeFlap = container.querySelector('#envelopeFlap');
  const heartWaxSeal = container.querySelector('#heartWaxSeal');
  const letterDoc = container.querySelector('#letterDoc');
  const envelopePrompt = container.querySelector('#envelopePrompt');
  const envelopeShadow = container.querySelector('#envelopeShadow');
  const btnCelebrate = container.querySelector('#btnCelebrate');

  let isOpened = false;

  // ----------------------------------------------------
  // INTERACTIVE OPENING CHOREOGRAPHY
  // ----------------------------------------------------
  const handleOpenEnvelope = () => {
    if (isOpened) return;
    isOpened = true;

    // Step 1: Animate heart seal (glow, crack sound, particle burst)
    heartWaxSeal.classList.add('seal-animating');
    envelopePrompt.style.opacity = '0';
    envelopePrompt.style.pointerEvents = 'none';

    if (window.soundEngine) {
      window.soundEngine.playEnvelopeOpen();
    }

    // Confetti & rose petals from the seal
    if (typeof confetti === 'function') {
      const rect = heartWaxSeal.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { x, y },
        colors: ['#FF4081', '#F8BBD0', '#FFD700', '#FFFFFF', '#D1C4E9']
      });
    }

    // Step 2: Open Envelope Flap in 3D (at ~350ms)
    setTimeout(() => {
      heartWaxSeal.classList.add('seal-broken');
      envelopeBody.classList.add('flap-opened');
    }, 350);

    // Step 3: Letter slides out of pocket (at ~800ms)
    setTimeout(() => {
      envelopeBody.classList.add('letter-sliding-out');
      if (window.soundEngine) {
        window.soundEngine.playChime();
      }
    }, 850);

    // Step 4 & 5: Letter unfolds in 3D & reveals message (at ~1400ms)
    setTimeout(() => {
      envelopeBody.classList.add('letter-fully-unfolded');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(letterDoc.querySelectorAll('.letter-msg-line, .letter-msg-highlight, .letter-action-wrap'), 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, stagger: 0.18, duration: 0.8, ease: 'power2.out' }
        );
      }
    }, 1450);
  };

  heartWaxSeal.addEventListener('click', handleOpenEnvelope);
  envelopeBody.addEventListener('click', (e) => {
    // If not open yet, clicking envelope also opens it
    if (!isOpened) {
      handleOpenEnvelope();
    }
  });

  // Touch support for Android mobile
  heartWaxSeal.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleOpenEnvelope();
  }, { passive: false });

  // ----------------------------------------------------
  // TRANSITION TO BIRTHDAY CAKE SCENE
  // ----------------------------------------------------
  btnCelebrate.addEventListener('click', (e) => {
    e.stopPropagation();

    if (window.soundEngine) {
      window.soundEngine.playSparkle();
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#FFD700', '#F8BBD0', '#B39DDB', '#FFFFFF']
      });
    }

    container.classList.add('scene-exit-fade');
    setTimeout(() => {
      onNext();
    }, 500);
  });

  // ----------------------------------------------------
  // SUBTLE 3D PARALLAX TILT
  // ----------------------------------------------------
  const handleTilt = (xNorm, yNorm) => {
    if (!isOpened && stage) {
      const rotX = -yNorm * 12;
      const rotY = xNorm * 14;
      stage.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      if (envelopeShadow) {
        envelopeShadow.style.transform = `translate(${xNorm * -15}px, ${yNorm * -8}px) scale(${1 - yNorm * 0.05})`;
      }
    }
  };

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    handleTilt(x, y);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      const y = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      handleTilt(x, y);
    }
  }, { passive: true });
};
