/**
 * ===================================================================
 *  SCENE 5: NEELU'S INTERACTIVE 3D MEMORY PHOTO GALLERY
 * ===================================================================
 *  Features:
 *   - Uses ONLY actual photographs of Neelam (photo-01 to photo-20)
 *   - No distortion, no face cropping, object-fit: contain in lightbox
 *   - 3D Polaroid cards with authentic washi tape, paper texture & shadows
 *   - 3D Card Flipping effect: front photo, back postcard note & stamp
 *   - Floating hearts, flowers & sparkling ambient particles
 *   - Organic scattered rotations & scroll-triggered floating entrance
 *   - Fullscreen Lightbox modal with zoom, next/prev, touch swipe
 *   - Header: "Every picture has a story..." / "Here are a few little moments..."
 * ===================================================================
 */

window.renderScene5Gallery = function(container, onNext) {
  const cfg = window.NEELU_CONFIG.gallery;
  const vidCfg = window.NEELU_CONFIG.video;
  let activeFilter = 'all';
  let activeLightboxIndex = 0;
  let isLightboxZoomed = false;

  container.innerHTML = `
    <div class="scene-inner gallery-scene" id="gallerySceneWrap">
      
      <!-- Ambient Floating Hearts, Sparkles & Flowers Layer -->
      <div class="gallery-ambient-decor">
        <span class="g-decor g-heart-1">❤️</span>
        <span class="g-decor g-flower-1">🌸</span>
        <span class="g-decor g-sparkle-1">✨</span>
        <span class="g-decor g-heart-2">💖</span>
        <span class="g-decor g-flower-2">🌺</span>
        <span class="g-decor g-sparkle-2">✦</span>
        <span class="g-decor g-heart-3">💕</span>
      </div>

      <!-- Scene Header -->
      <div class="scene-header gallery-header">
        <div class="gallery-tag-pill pulse-glow">
          <span class="tag-star">✧</span>
          <span class="tag-text">NEELU'S GOLDEN ARCHIVE</span>
          <span class="tag-star">✧</span>
        </div>

        <h1 class="scene-title gallery-main-title gradient-text glow-text">
          ${cfg.title}
        </h1>

        <p class="scene-desc gallery-sub-desc">
          ${cfg.subtitle}
        </p>

        <!-- Gallery Tip / Micro-Interaction Hint -->
        <div class="gallery-hint-badge">
          <span class="hint-icon">💡</span>
          <span class="hint-text">Tap photo to enlarge • Tap <strong>↻ Flip</strong> to read personal memory note</span>
        </div>
      </div>

      <!-- Filter Tabs Bar -->
      <div class="gallery-filters-bar" id="galleryFilters">
        <button class="filter-pill active" data-filter="all">All Memories (${cfg.photos.length})</button>
        <button class="filter-pill" data-filter="Radiance">Radiance</button>
        <button class="filter-pill" data-filter="Smiles">Smiles & Joy</button>
        <button class="filter-pill" data-filter="Elegance">Elegance</button>
        <button class="filter-pill" data-filter="Moments">Special Moments</button>
        <button class="filter-pill video-filter-pill" data-filter="video">Memory Video 🎬</button>
      </div>

      <!-- Special Video Reel Panel (When Video Filter is active) -->
      <div class="gallery-video-theater glass-panel" id="videoTheaterPanel" style="display: none;">
        <div class="theater-header">
          <span class="theater-badge">✨ SPECIAL MEMORY REEL</span>
          <h3 class="theater-title">${vidCfg.title}</h3>
          <p class="theater-desc">${vidCfg.subtitle}</p>
        </div>
        <div class="theater-video-wrap">
          <video id="galleryVideoPlayer" class="theater-video" controls playsinline preload="metadata">
            <source src="${vidCfg.path}" type="video/mp4">
            Your browser does not support video playback.
          </video>
        </div>
      </div>

      <!-- 3D Polaroid Memory Wall Grid -->
      <div class="memory-wall-grid" id="memoryWallGrid">
        <!-- Rendered dynamically -->
      </div>

      <!-- Fullscreen Lightbox Modal -->
      <div class="memory-lightbox-modal" id="memoryLightbox" style="display: none;" role="dialog" aria-modal="true">
        <div class="lightbox-backdrop" id="lightboxBackdrop"></div>
        
        <div class="lightbox-stage">
          <!-- Lightbox Top Bar -->
          <div class="lightbox-top-bar">
            <span class="lightbox-counter-pill" id="lightboxCounter">1 / ${cfg.photos.length}</span>
            <div class="lightbox-actions-top">
              <button class="lb-tool-btn" id="btnToggleZoom" title="Toggle zoom">🔍 Zoom</button>
              <button class="lb-close-btn" id="btnCloseLightbox" title="Close Lightbox">✕</button>
            </div>
          </div>

          <!-- Main Image Viewport -->
          <div class="lightbox-media-viewport">
            <button class="lb-nav-btn lb-prev" id="btnLbPrev" title="Previous photo (Left Arrow)">◀</button>
            
            <div class="lightbox-photo-container" id="lightboxPhotoContainer">
              <img id="lightboxMainImg" src="" alt="Neelam's Memory" class="lightbox-main-img">
            </div>

            <button class="lb-nav-btn lb-next" id="btnLbNext" title="Next photo (Right Arrow)">▶</button>
          </div>

          <!-- Lightbox Bottom Caption Bar -->
          <div class="lightbox-bottom-caption">
            <div class="lb-caption-content">
              <div class="lb-title-row">
                <h3 class="lb-photo-title" id="lightboxTitle"></h3>
                <span class="lb-photo-date" id="lightboxDate"></span>
              </div>
              <p class="lb-photo-caption" id="lightboxCaption"></p>
              <div class="lb-photo-note" id="lightboxNote"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery Continue Button to Scene 6 -->
      <div class="gallery-footer-action">
        <button id="btnProceedAngel" class="btn-primary shimmer-btn pulse-subtle btn-continue-angel">
          <span class="btn-icon">🕊️</span>
          <span class="btn-text">${cfg.continueButton}</span>
          <span class="btn-icon">✨</span>
        </button>
      </div>

    </div>
  `;

  // Elements
  const grid = container.querySelector('#memoryWallGrid');
  const filters = container.querySelectorAll('.filter-pill');
  const videoTheater = container.querySelector('#videoTheaterPanel');
  const videoPlayer = container.querySelector('#galleryVideoPlayer');
  const lightbox = container.querySelector('#memoryLightbox');
  const lightboxImg = container.querySelector('#lightboxMainImg');
  const lightboxTitle = container.querySelector('#lightboxTitle');
  const lightboxDate = container.querySelector('#lightboxDate');
  const lightboxCaption = container.querySelector('#lightboxCaption');
  const lightboxNote = container.querySelector('#lightboxNote');
  const lightboxCounter = container.querySelector('#lightboxCounter');
  const btnCloseLb = container.querySelector('#btnCloseLightbox');
  const lbBackdrop = container.querySelector('#lightboxBackdrop');
  const btnLbPrev = container.querySelector('#btnLbPrev');
  const btnLbNext = container.querySelector('#btnLbNext');
  const btnZoom = container.querySelector('#btnToggleZoom');
  const btnProceedAngel = container.querySelector('#btnProceedAngel');

  // ----------------------------------------------------
  // RENDER 3D POLAROID CARDS
  // ----------------------------------------------------
  const renderPolaroids = (filter) => {
    activeFilter = filter;

    if (filter === 'video') {
      grid.style.display = 'none';
      videoTheater.style.display = 'block';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(videoTheater, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
      }
      return;
    } else {
      grid.style.display = 'grid';
      videoTheater.style.display = 'none';
      if (videoPlayer) videoPlayer.pause();
    }

    const filtered = filter === 'all'
      ? cfg.photos
      : cfg.photos.filter(p => p.tag === filter);

    grid.innerHTML = filtered.map((photo, index) => {
      // Slightly varied organic rotation for realistic memory pinboard aesthetic
      const rot = ((photo.id * 17) % 7 - 3) * 1.1; // -3.3deg to +3.3deg
      const washiColor = ['washi-peach', 'washi-lavender', 'washi-pink', 'washi-gold'][photo.id % 4];

      return `
        <div class="polaroid-flipper-card" data-id="${photo.id}" style="--scatter-rot: ${rot}deg;" tabindex="0">
          <div class="polaroid-flipper-inner" id="flipper-${photo.id}">
            
            <!-- FRONT FACE: The Physical Polaroid -->
            <div class="polaroid-face polaroid-front">
              <!-- Decorative Tape / Pin -->
              <div class="washi-tape-strip ${washiColor}"></div>
              
              <!-- Image Frame: Carefully calibrated to preserve quality & avoid cropping faces -->
              <div class="polaroid-photo-frame">
                <img src="${photo.src}" alt="${photo.title}" loading="lazy" class="polaroid-actual-img">
                <div class="polaroid-hover-scrim">
                  <span class="scrim-enlarge-btn" title="View Fullsize">🔍 Enlarge</span>
                </div>
              </div>

              <!-- Handwritten Caption Area -->
              <div class="polaroid-meta-bottom">
                <div class="polaroid-caption-row">
                  <h4 class="polaroid-title">${photo.title}</h4>
                  <button class="btn-flip-card" data-flip-id="${photo.id}" title="Flip to read memory note">
                    <span>↻ Flip</span>
                  </button>
                </div>
                <p class="polaroid-handwritten-note">${photo.caption}</p>
              </div>
            </div>

            <!-- BACK FACE: Postcard / Scrapbook Note -->
            <div class="polaroid-face polaroid-back">
              <div class="postcard-inner">
                <div class="postcard-top-row">
                  <span class="postcard-stamp">🌸</span>
                  <div class="postcard-postmark">
                    <span>18 NOV</span>
                    <span>NEELU'S UNIVERSE</span>
                  </div>
                  <button class="btn-flip-back" data-flip-id="${photo.id}" title="Flip back to photo">
                    <span>↺ Back</span>
                  </button>
                </div>

                <div class="postcard-message-box">
                  <span class="postcard-quote-mark">“</span>
                  <p class="postcard-note-text">${photo.backNote || photo.caption}</p>
                </div>

                <div class="postcard-bottom-row">
                  <span class="postcard-date-tag">${photo.date || 'Memory'}</span>
                  <button class="btn-postcard-view" data-view-id="${photo.id}">
                    <span>View Photo 🔍</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');

    // Staggered Floating Entrance Animation
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(grid.querySelectorAll('.polaroid-flipper-card'), 
        { opacity: 0, y: 45, scale: 0.92 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.75, ease: 'power2.out' }
      );
    }

    // Attach Event Listeners to cards
    attachCardListeners();
  };

  const attachCardListeners = () => {
    const cards = grid.querySelectorAll('.polaroid-flipper-card');

    cards.forEach(card => {
      const id = parseInt(card.getAttribute('data-id'), 10);
      const flipper = card.querySelector(`#flipper-${id}`);
      const btnFlip = card.querySelector('.btn-flip-card');
      const btnFlipBack = card.querySelector('.btn-flip-back');
      const photoFrame = card.querySelector('.polaroid-photo-frame');
      const btnView = card.querySelector('.btn-postcard-view');

      // Flip front to back
      if (btnFlip) {
        btnFlip.addEventListener('click', (e) => {
          e.stopPropagation();
          flipper.classList.toggle('is-flipped');
          if (window.soundEngine) window.soundEngine.playSparkle();
        });
      }

      // Flip back to front
      if (btnFlipBack) {
        btnFlipBack.addEventListener('click', (e) => {
          e.stopPropagation();
          flipper.classList.remove('is-flipped');
          if (window.soundEngine) window.soundEngine.playSparkle();
        });
      }

      // Clicking photo frame opens Lightbox
      if (photoFrame) {
        photoFrame.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightboxById(id);
        });
      }

      // Clicking view on back opens Lightbox
      if (btnView) {
        btnView.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightboxById(id);
        });
      }

      // 3D Tilt Effect on mouse move
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  // ----------------------------------------------------
  // FULLSCREEN LIGHTBOX MODAL
  // ----------------------------------------------------
  const openLightboxById = (photoId) => {
    const idx = cfg.photos.findIndex(p => p.id === photoId);
    if (idx !== -1) {
      activeLightboxIndex = idx;
      isLightboxZoomed = false;
      lightboxImg.classList.remove('zoomed');
      btnZoom.textContent = '🔍 Zoom';
      updateLightbox();
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      if (window.soundEngine) {
        window.soundEngine.playSparkle();
      }

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(lightbox.querySelector('.lightbox-stage'), 
          { opacity: 0, scale: 0.9 }, 
          { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
  };

  const updateLightbox = () => {
    const photo = cfg.photos[activeLightboxIndex];
    if (!photo) return;

    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDate.textContent = photo.date || `Memory ${activeLightboxIndex + 1}`;
    lightboxCaption.textContent = photo.caption;
    lightboxNote.textContent = photo.backNote ? `“${photo.backNote}”` : '';
    lightboxCounter.textContent = `${activeLightboxIndex + 1} / ${cfg.photos.length}`;
  };

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  const nextLightboxPhoto = () => {
    if (activeLightboxIndex < cfg.photos.length - 1) {
      activeLightboxIndex++;
    } else {
      activeLightboxIndex = 0;
    }
    updateLightbox();
    if (window.soundEngine) window.soundEngine.playSparkle();
  };

  const prevLightboxPhoto = () => {
    if (activeLightboxIndex > 0) {
      activeLightboxIndex--;
    } else {
      activeLightboxIndex = cfg.photos.length - 1;
    }
    updateLightbox();
    if (window.soundEngine) window.soundEngine.playSparkle();
  };

  // Lightbox Controls
  btnLbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextLightboxPhoto();
  });

  btnLbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevLightboxPhoto();
  });

  btnCloseLb.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);

  // Zoom Toggle
  btnZoom.addEventListener('click', (e) => {
    e.stopPropagation();
    isLightboxZoomed = !isLightboxZoomed;
    lightboxImg.classList.toggle('zoomed', isLightboxZoomed);
    btnZoom.textContent = isLightboxZoomed ? '🔍 Reset' : '🔍 Zoom';
  });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextLightboxPhoto();
    else if (e.key === 'ArrowLeft') prevLightboxPhoto();
  });

  // Touch Swipe navigation in Lightbox
  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) lbTouchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - lbTouchStartX;
      if (diffX < -50) nextLightboxPhoto();
      else if (diffX > 50) prevLightboxPhoto();
    }
  });

  // Filter Buttons
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      renderPolaroids(f);
      if (window.soundEngine) window.soundEngine.playSparkle();
    });
  });

  // Continue Button to Scene 6 (My Guardian Angel)
  btnProceedAngel.addEventListener('click', () => {
    if (videoPlayer) videoPlayer.pause();
    if (window.soundEngine) window.soundEngine.playChime();
    container.classList.add('scene-exit-fade');
    setTimeout(() => {
      onNext();
    }, 450);
  });

  // Initial render
  renderPolaroids('all');
};
