/**
 * ===================================================================
 *  SCENE 8: GRAND BIRTHDAY FINALE (VISUAL CLIMAX)
 * ===================================================================
 *  Sequence:
 *   1. Starts with a dark screen
 *   2. Gradually introduces glowing particles, stardust & lights
 *   3. Displays: "HAPPY BIRTHDAY!"
 *   4. Displays: "NEELAM ❤️" with beautiful glowing animations
 *   5. Displays: "Keep shining, Neelu. The world is a little more beautiful with people like you in it."
 *   6. Displays interactive button: "One Last Thing..."
 *   7. On click, reveals the heartfelt hidden message & closing signature
 *   8. Displays: "Replay Our Little Universe" button
 *   9. Fullscreen canvas fireworks, floating confetti, glowing hearts,
 *      stars, flowers, and ambient light effects
 * ===================================================================
 */

window.renderScene8Finale = function(container, onRestart) {
  const cfg = window.NEELU_CONFIG.finale;
  let fireworksInstance = null;
  let hasRevealedLastThing = false;

  container.innerHTML = `
    <div class="scene-inner finale-scene-wrapper" id="finaleSceneWrapper">
      
      <!-- Initial Dark Screen Overlay (Dissolves at start) -->
      <div class="finale-dark-curtain" id="finaleDarkCurtain"></div>

      <!-- Fullscreen Particle Fireworks Canvas -->
      <canvas id="finaleFireworksCanvas" class="finale-fireworks-canvas"></canvas>

      <!-- Ambient Light Auroras & Beams -->
      <div class="finale-aurora-beam beam-left"></div>
      <div class="finale-aurora-beam beam-right"></div>
      <div class="finale-glow-radial"></div>

      <!-- Floating Glowing Hearts Layer -->
      <div class="finale-floating-hearts" aria-hidden="true">
        <span class="f-heart fh-1">❤️</span>
        <span class="f-heart fh-2">💖</span>
        <span class="f-heart fh-3">✨</span>
        <span class="f-heart fh-4">🤍</span>
        <span class="f-heart fh-5">💕</span>
        <span class="f-heart fh-6">🌸</span>
        <span class="f-heart fh-7">❤️</span>
      </div>

      <!-- Floating Flowers & Blossom Layer -->
      <div class="finale-flowers-layer" aria-hidden="true">
        <span class="f-flower ff-1">🌸</span>
        <span class="f-flower ff-2">💮</span>
        <span class="f-flower ff-3">🌺</span>
        <span class="f-flower ff-4">🌸</span>
      </div>

      <!-- Floating Sparkles Layer -->
      <div class="finale-sparkles-layer" aria-hidden="true">
        <span class="f-sparkle fs-1">✧</span>
        <span class="f-sparkle fs-2">✦</span>
        <span class="f-sparkle fs-3">✨</span>
        <span class="f-sparkle fs-4">✧</span>
        <span class="f-sparkle fs-5">✦</span>
      </div>

      <!-- Main Central Staged Content -->
      <div class="finale-content-stage" id="finaleContentStage">
        
        <!-- Badge -->
        <div class="finale-badge-pill" id="finaleBadge" style="opacity: 0;">
          <span class="badge-star">✨</span>
          <span>${cfg.badge}</span>
          <span class="badge-star">✨</span>
        </div>

        <!-- Staged Line 1: "HAPPY BIRTHDAY!" -->
        <h2 class="finale-greeting-title" id="finaleGreeting" style="opacity: 0;">
          ${cfg.greeting}
        </h2>

        <!-- Staged Line 2: "NEELAM ❤️" with radiant glowing animation -->
        <h1 class="finale-hero-name glow-neon-heart" id="finaleName" style="opacity: 0;">
          <span class="name-letters">NEELAM</span>
          <span class="name-heart">❤️</span>
        </h1>

        <!-- Staged Line 3: "Keep shining, Neelu..." -->
        <p class="finale-blessing-text" id="finaleBlessing" style="opacity: 0;">
          “${cfg.blessing}”
        </p>

        <!-- Interactive Button: "One Last Thing..." -->
        <div class="finale-last-thing-wrapper" id="lastThingBtnWrap" style="opacity: 0;">
          <button id="btnOneLastThing" class="btn-primary shimmer-btn pulse-glow btn-last-thing">
            <span class="btn-icon">💌</span>
            <span class="btn-text">${cfg.oneLastThingBtn}</span>
            <span class="btn-sparkle">✨</span>
          </button>
        </div>

        <!-- Hidden Message Card (Revealed on click of "One Last Thing...") -->
        <div class="finale-hidden-card glass-panel" id="finaleHiddenCard" style="display: none; opacity: 0;">
          <div class="hidden-card-filigree">❦</div>
          
          <div class="hidden-message-body">
            ${cfg.hiddenMessageParagraphs.map(p => `<p class="hidden-para">${p}</p>`).join('')}
          </div>

          <div class="hidden-card-closing">
            <p class="closing-pfx">${cfg.closingPrefix}</p>
            <p class="closing-sign">${cfg.closingSignature}</p>
          </div>

          <!-- Bottom Action Buttons: Fireworks volley & Replay -->
          <div class="finale-bottom-actions">
            <button id="btnLaunchFireworkBurst" class="btn-secondary btn-more-fw">
              <span>Launch More Fireworks! 🎆</span>
            </button>

            <button id="btnReplayUniverse" class="btn-primary shimmer-btn btn-replay">
              <span>${cfg.replayButton}</span>
            </button>
          </div>
        </div>

        <!-- Interactive Canvas Tap Hint -->
        <p class="canvas-tap-hint" id="canvasTapHint" style="opacity: 0;">
          Tap anywhere in the sky to launch fireworks 🎆
        </p>

      </div>

    </div>
  `;

  // DOM Elements
  const curtain = container.querySelector('#finaleDarkCurtain');
  const badge = container.querySelector('#finaleBadge');
  const greeting = container.querySelector('#finaleGreeting');
  const heroName = container.querySelector('#finaleName');
  const blessing = container.querySelector('#finaleBlessing');
  const lastThingWrap = container.querySelector('#lastThingBtnWrap');
  const btnLastThing = container.querySelector('#btnOneLastThing');
  const hiddenCard = container.querySelector('#finaleHiddenCard');
  const tapHint = container.querySelector('#canvasTapHint');
  const canvas = container.querySelector('#finaleFireworksCanvas');
  const btnMoreFw = container.querySelector('#btnLaunchFireworkBurst');
  const btnReplay = container.querySelector('#btnReplayUniverse');

  // ----------------------------------------------------
  // INITIALIZE FIREWORKS ENGINE
  // ----------------------------------------------------
  setTimeout(() => {
    fireworksInstance = new window.FireworksAndLanterns('finaleFireworksCanvas');
    fireworksInstance.start();

    // Enable click/tap anywhere on canvas or scene to shoot fireworks
    container.addEventListener('click', (e) => {
      // Don't intercept button clicks
      if (e.target.closest('button') || e.target.closest('a')) return;
      if (fireworksInstance) {
        fireworksInstance.launchFirework(e.clientX, e.clientY);
        if (window.soundEngine) window.soundEngine.playSparkle();
      }
    });
  }, 100);

  // ----------------------------------------------------
  // SEQUENCED CINEMATIC TIMELINE
  // ----------------------------------------------------
  
  // 1. Gradually introduce glowing particles (dissolve dark curtain)
  setTimeout(() => {
    if (typeof gsap !== 'undefined') {
      gsap.to(curtain, {
        opacity: 0,
        duration: 2.0,
        ease: 'power2.out',
        onComplete: () => {
          curtain.style.display = 'none';
        }
      });
    } else {
      curtain.style.opacity = '0';
      setTimeout(() => curtain.style.display = 'none', 1000);
    }
  }, 400);

  // 2. Display: "HAPPY BIRTHDAY!" (after ~1.8s)
  setTimeout(() => {
    if (window.soundEngine) window.soundEngine.playSparkle();

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(badge, 
        { opacity: 0, y: -15 }, 
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
      );
      gsap.fromTo(greeting, 
        { opacity: 0, y: 30, scale: 0.88, filter: 'blur(8px)' }, 
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'power2.out' }
      );
    } else {
      badge.style.opacity = '1';
      greeting.style.opacity = '1';
    }

    if (fireworksInstance) {
      fireworksInstance.launchFirework();
    }
  }, 1800);

  // 3. Display: "NEELAM ❤️" with beautiful glowing animation (after ~3.6s)
  setTimeout(() => {
    if (window.soundEngine) {
      window.soundEngine.playAngelFeather();
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(heroName, 
        { opacity: 0, scale: 0.7, y: 40, filter: 'blur(12px)' }, 
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'back.out(1.5)' }
      );
    } else {
      heroName.style.opacity = '1';
    }

    // Grand confetti explosion celebrating her name!
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FF4081', '#F8BBD0', '#D1C4E9', '#FFFFFF']
      });
    }

    if (fireworksInstance) {
      fireworksInstance.launchFirework();
      setTimeout(() => fireworksInstance.launchFirework(), 250);
    }
  }, 3600);

  // 4. Display: "Keep shining, Neelu..." (after ~5.5s)
  setTimeout(() => {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(blessing, 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
      );
    } else {
      blessing.style.opacity = '1';
    }
  }, 5500);

  // 5. Display interactive button: "One Last Thing..." (after ~7.0s)
  setTimeout(() => {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(lastThingWrap, 
        { opacity: 0, y: 25, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'back.out(1.6)' }
      );
      gsap.fromTo(tapHint, 
        { opacity: 0 }, 
        { opacity: 0.75, duration: 1.0, delay: 0.5 }
      );
    } else {
      lastThingWrap.style.opacity = '1';
      tapHint.style.opacity = '0.75';
    }
  }, 7000);

  // ----------------------------------------------------
  // INTERACTION: "ONE LAST THING..." REVEALS HIDDEN MESSAGE
  // ----------------------------------------------------
  btnLastThing.addEventListener('click', () => {
    if (hasRevealedLastThing) return;
    hasRevealedLastThing = true;

    if (window.soundEngine) {
      window.soundEngine.playFinalCelebration();
    }

    // Confetti shower
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.65 },
        colors: ['#FFD700', '#FF4081', '#FFE0B2', '#FFFFFF', '#D1C4E9']
      });
    }

    // Launch multiple celebratory fireworks
    if (fireworksInstance) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => fireworksInstance.launchFirework(), i * 200);
      }
    }

    // Collapse button & reveal hidden message card
    if (typeof gsap !== 'undefined') {
      gsap.to(lastThingWrap, {
        opacity: 0,
        scale: 0.85,
        duration: 0.35,
        onComplete: () => {
          lastThingWrap.style.display = 'none';
          hiddenCard.style.display = 'block';

          gsap.fromTo(hiddenCard, 
            { opacity: 0, y: 35, scale: 0.94 }, 
            { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.4)' }
          );

          // Smooth scroll to make sure card is in full view
          setTimeout(() => {
            hiddenCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      });
    } else {
      lastThingWrap.style.display = 'none';
      hiddenCard.style.display = 'block';
      hiddenCard.style.opacity = '1';
    }
  });

  // Launch extra fireworks button
  btnMoreFw.addEventListener('click', () => {
    if (fireworksInstance) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => fireworksInstance.launchFirework(), i * 180);
      }
    }
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.8 }
      });
    }
    if (window.soundEngine) window.soundEngine.playSparkle();
  });

  // Replay button: "Replay Our Little Universe"
  btnReplay.addEventListener('click', () => {
    if (fireworksInstance) fireworksInstance.stop();
    if (window.soundEngine) window.soundEngine.playChime();

    // Trigger cosmic warp transition
    if (window.app && window.app.universeBg) {
      window.app.universeBg.triggerWarpTransition();
    }

    container.classList.add('scene-exit-fade');
    setTimeout(() => {
      onRestart();
    }, 450);
  });
};
