/**
 * ===================================================================
 *  SCENE 3: 3D BIRTHDAY CAKE SCENE
 * ===================================================================
 *  Visuals:
 *   - 3D Multi-layered cake with beautiful frosting, sugar flowers,
 *     glowing candles & realistic flames.
 *   - Floating hearts & stars orbiting in 3D and floating in CSS.
 *  Display:
 *   1. "Happy Birthday, Neelu!"
 *   2. "Make a wish! ✨"
 *   3. Interactive button: "Blow the Candles"
 *  When Clicked:
 *   - Flames extinguish with breath sound
 *   - Realistic smoke particles curl upward
 *   - Confetti explosion & animated fireworks
 *   - Message reveals: "May all your wishes come true! ❤️"
 *   - Shows the Continue button to move to Scene 4
 * ===================================================================
 */

window.renderScene3Cake = function(container, onNext) {
  const cfg = window.NEELU_CONFIG.cake;

  container.innerHTML = `
    <div class="scene-inner cake-scene" id="cakeSceneWrapper">
      
      <!-- Floating Ambient Hearts & Stars Layer -->
      <div class="cake-ambient-floating-layer">
        <span class="cake-float-item c-heart-1">❤️</span>
        <span class="cake-float-item c-star-1">✨</span>
        <span class="cake-float-item c-heart-2">💖</span>
        <span class="cake-float-item c-star-2">⭐</span>
        <span class="cake-float-item c-heart-3">💕</span>
        <span class="cake-float-item c-flower-1">🌸</span>
      </div>

      <!-- Scene Header -->
      <div class="scene-header cake-header">
        <div class="celebration-badge-pill pulse-glow">
          <span class="badge-sparkle">🎂</span>
          <span class="badge-text">18 NOVEMBER CELEBRATION</span>
          <span class="badge-sparkle">🎂</span>
        </div>

        <h1 class="scene-title cake-main-title gradient-text glow-text">
          ${cfg.title}
        </h1>

        <p class="scene-desc cake-sub-prompt" id="cakeSubPrompt">
          ${cfg.subtitle}
        </p>
      </div>

      <!-- 3D Cake Canvas Mount (Three.js WebGL) -->
      <div class="cake-display-area" id="cakeCanvasContainer" title="Drag to rotate cake in 3D!">
        <div class="cake-touch-hint">
          <span>⟲ Touch or drag to rotate in 3D ⟳</span>
        </div>
      </div>

      <!-- Interactive Blow Controls -->
      <div class="cake-controls-panel glass-panel" id="cakeControls">
        <div class="cake-instruction-banner">
          <span class="instruction-icon">🕯️</span>
          <span class="instruction-text" id="cakeInstruction">
            ${cfg.instructions}
          </span>
        </div>

        <div class="cake-action-buttons">
          <button id="btnBlowCandles" class="btn-primary btn-blow-candles shimmer-btn pulse-glow" aria-label="Blow the Candles">
            <span class="btn-icon">🎂</span>
            <span class="btn-label">${cfg.blowButtonText}</span>
            <span class="btn-icon">✨</span>
          </button>

          <!-- Alternative Mic Blow Option for Mobile -->
          <button id="btnMicBlow" class="btn-secondary mic-btn" title="Blow into your device microphone!">
            <span id="micIcon">🎙️</span>
            <span id="micLabel">Blow With Mic</span>
          </button>
        </div>
      </div>

      <!-- Wish Revealed Card (Appears after blowing candles) -->
      <div class="wish-reveal-card glass-panel" id="wishRevealCard" style="display: none; opacity: 0;">
        <div class="wish-header">
          <span class="wish-star">✨</span>
          <h2 class="wish-title text-glow-gold">
            ${cfg.wishUnlockedTitle}
          </h2>
          <span class="wish-star">✨</span>
        </div>

        <p class="wish-text">
          ${cfg.wishUnlockedText}
        </p>

        <!-- Continue Button -->
        <div class="cake-continue-wrapper">
          <button id="btnCakeContinue" class="btn-primary shimmer-btn pulse-subtle btn-cake-continue">
            <span>${cfg.continueButton}</span>
            <span class="continue-arrow">➜</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Elements
  const cakeContainer = container.querySelector('#cakeCanvasContainer');
  const cakeControls = container.querySelector('#cakeControls');
  const btnBlow = container.querySelector('#btnBlowCandles');
  const btnMic = container.querySelector('#btnMicBlow');
  const micLabel = container.querySelector('#micLabel');
  const cakeInstruction = container.querySelector('#cakeInstruction');
  const cakeSubPrompt = container.querySelector('#cakeSubPrompt');
  const wishCard = container.querySelector('#wishRevealCard');
  const btnContinue = container.querySelector('#btnCakeContinue');

  let cakeInstance = null;

  // ----------------------------------------------------
  // CELEBRATION CHOREOGRAPHY AFTER BLOWING CANDLES
  // ----------------------------------------------------
  const onCandlesBlown = () => {
    // Hide blow controls smoothly
    if (typeof gsap !== 'undefined') {
      gsap.to(cakeControls, {
        opacity: 0,
        y: -15,
        duration: 0.5,
        onComplete: () => {
          cakeControls.style.display = 'none';
        }
      });
    } else {
      cakeControls.style.display = 'none';
    }

    // Update prompt
    cakeSubPrompt.textContent = 'A celestial wish has ascended to the cosmos! ✨';

    // Show "May all your wishes come true! ❤️" card
    setTimeout(() => {
      wishCard.style.display = 'block';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(wishCard, 
          { opacity: 0, y: 35, scale: 0.94 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)' }
        );
      } else {
        wishCard.style.opacity = '1';
      }
    }, 700);
  };

  // Instantiate 3D Birthday Cake
  cakeInstance = new window.InteractiveBirthdayCake('cakeCanvasContainer', onCandlesBlown);

  // Button click: Blow the Candles
  btnBlow.addEventListener('click', () => {
    if (cakeInstance) {
      cakeInstance.blowCandles();
    }
  });

  // Microphone blow option
  btnMic.addEventListener('click', () => {
    if (!cakeInstance) return;
    micLabel.textContent = 'Listening... Blow now! 🌬️';
    btnMic.classList.add('mic-active');
    cakeInstance.startMicDetection(() => {
      micLabel.textContent = 'Blown! ✨';
      btnMic.classList.remove('mic-active');
    });
  });

  // Continue Button
  btnContinue.addEventListener('click', () => {
    if (cakeInstance) {
      cakeInstance.destroy();
    }

    if (window.soundEngine) {
      window.soundEngine.playChime();
    }

    container.classList.add('scene-exit-fade');
    setTimeout(() => {
      onNext();
    }, 450);
  });
};
