/**
 * ===================================================================
 *  A LITTLE UNIVERSE FOR NEELU - 3D INTERACTIVE BIRTHDAY CAKE
 * ===================================================================
 *  Features:
 *   - Multi-tiered celebratory cake with pastel pink, lavender & cream
 *   - Beautiful dripping frosting, cream rosettes & golden pearls
 *   - 3D decorative sugar flowers cascading down the tiers
 *   - Glowing birthday candles with realistic flickering flames & dynamic light
 *   - Orbiting 3D floating hearts and stars
 *   - Interactive candle blow (tap button or microphone)
 *   - Realistic swirling smoke particles on extinguish
 *   - Confetti explosion & animated fireworks celebration
 *   - Mobile touch 360-degree drag rotation
 * ===================================================================
 */

class InteractiveBirthdayCake {
  constructor(containerId, onCandlesBlown) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.onCandlesBlown = onCandlesBlown;
    this.candlesLit = true;
    this.flameMeshes = [];
    this.smokeParticles = [];
    this.orbitingObjects = [];
    this.cakeGroup = null;
    this.warmPointLight = null;
    this.fireworkBursts = [];

    this.isThreeAvailable = typeof THREE !== 'undefined';
    this.micStream = null;
    this.audioContext = null;
    this.micAnalyzer = null;
    this.isListeningMic = false;
    this.isInteracting = false;

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'cake-canvas';
    this.container.appendChild(this.canvas);

    if (this.isThreeAvailable) {
      this.initThreeCake();
    } else {
      this.initCanvas2DCake();
    }

    this.setupInteractivity();
  }

  initThreeCake() {
    try {
      const width = this.container.clientWidth || 360;
      const height = this.container.clientHeight || 380;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 72, 175);
      this.camera.lookAt(0, 18, 0);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 1. Ambient & Directional Lighting
      const ambientLight = new THREE.AmbientLight(0xFFF0F5, 1.1);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.75);
      dirLight.position.set(50, 90, 60);
      this.scene.add(dirLight);

      // Warm flickering candle light
      this.warmPointLight = new THREE.PointLight(0xFFD54F, 1.4, 120);
      this.warmPointLight.position.set(0, 52, 0);
      this.scene.add(this.warmPointLight);

      // Cake Root Group
      this.cakeGroup = new THREE.Group();
      this.scene.add(this.cakeGroup);

      // Shared Materials
      const frostWhiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.25 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
      const pinkPetalMat = new THREE.MeshStandardMaterial({ color: 0xF48FB1, roughness: 0.4 });
      const lavenderTierMat = new THREE.MeshStandardMaterial({ color: 0xD1C4E9, roughness: 0.5 });
      const pinkTierMat = new THREE.MeshStandardMaterial({ color: 0xF8BBD0, roughness: 0.5 });
      const peachTierMat = new THREE.MeshStandardMaterial({ color: 0xFFE0B2, roughness: 0.5 });

      // 2. Ceramic Pedestal Plate with Gold Rim
      const plateGeo = new THREE.CylinderGeometry(44, 38, 4.5, 36);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2, metalness: 0.1 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = -2;
      this.cakeGroup.add(plate);

      const rimGeo = new THREE.TorusGeometry(44, 1.2, 16, 64);
      const rim = new THREE.Mesh(rimGeo, goldMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.2;
      this.cakeGroup.add(rim);

      // 3. Tier 1 (Bottom Tier: Lavender & Vanilla Sponge)
      const tier1Geo = new THREE.CylinderGeometry(34, 34, 18, 36);
      const tier1 = new THREE.Mesh(tier1Geo, lavenderTierMat);
      tier1.position.y = 9.2;
      this.cakeGroup.add(tier1);

      // Bottom Frosting Piping Rim
      const drip1Geo = new THREE.TorusGeometry(34.2, 1.6, 16, 36);
      const drip1 = new THREE.Mesh(drip1Geo, frostWhiteMat);
      drip1.rotation.x = Math.PI / 2;
      drip1.position.y = 18.2;
      this.cakeGroup.add(drip1);

      // Golden Pearls around Tier 1 Base
      const pearlGeo = new THREE.SphereGeometry(1.2, 10, 10);
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const pearl = new THREE.Mesh(pearlGeo, goldMat);
        pearl.position.set(Math.cos(angle) * 34.5, 1.2, Math.sin(angle) * 34.5);
        this.cakeGroup.add(pearl);
      }

      // 4. Tier 2 (Middle Tier: Pastel Pink Strawberry Cream)
      const tier2Geo = new THREE.CylinderGeometry(23, 23, 16, 36);
      const tier2 = new THREE.Mesh(tier2Geo, pinkTierMat);
      tier2.position.y = 26.2;
      this.cakeGroup.add(tier2);

      const drip2Geo = new THREE.TorusGeometry(23.2, 1.5, 16, 36);
      const drip2 = new THREE.Mesh(drip2Geo, frostWhiteMat);
      drip2.rotation.x = Math.PI / 2;
      drip2.position.y = 34.2;
      this.cakeGroup.add(drip2);

      // 5. Tier 3 (Top Tier: Soft Peach & Cream)
      const tier3Geo = new THREE.CylinderGeometry(14, 14, 14, 32);
      const tier3 = new THREE.Mesh(tier3Geo, peachTierMat);
      tier3.position.y = 41.2;
      this.cakeGroup.add(tier3);

      const drip3Geo = new THREE.TorusGeometry(14.2, 1.2, 16, 32);
      const drip3 = new THREE.Mesh(drip3Geo, frostWhiteMat);
      drip3.rotation.x = Math.PI / 2;
      drip3.position.y = 48.2;
      this.cakeGroup.add(drip3);

      // 6. Cream Rosettes on Top & Tier Rims
      const rosetteGeo = new THREE.SphereGeometry(1.5, 12, 12);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const rosette = new THREE.Mesh(rosetteGeo, frostWhiteMat);
        rosette.position.set(Math.cos(angle) * 12, 48.8, Math.sin(angle) * 12);
        this.cakeGroup.add(rosette);
      }

      // 7. 3D Decorative Sugar Flowers on Cake Tiers
      const createFlower = (scale = 1) => {
        const flowerGroup = new THREE.Group();
        const petalGeo = new THREE.SphereGeometry(1.4, 8, 8);
        petalGeo.scale(1, 0.4, 1.8);

        for (let p = 0; p < 5; p++) {
          const pAngle = (p / 5) * Math.PI * 2;
          const petal = new THREE.Mesh(petalGeo, pinkPetalMat);
          petal.position.set(Math.cos(pAngle) * 1.5, 0, Math.sin(pAngle) * 1.5);
          petal.rotation.y = -pAngle;
          flowerGroup.add(petal);
        }

        const centerGeo = new THREE.SphereGeometry(0.9, 8, 8);
        const center = new THREE.Mesh(centerGeo, goldMat);
        center.position.y = 0.3;
        flowerGroup.add(center);

        flowerGroup.scale.set(scale, scale, scale);
        return flowerGroup;
      };

      // Arrange sugar flowers cascading down the tiers
      const flowerPositions = [
        { x: 10, y: 48.5, z: 8, s: 1.1 },
        { x: -11, y: 48.5, z: 6, s: 1 },
        { x: 19, y: 34.5, z: 12, s: 1.2 },
        { x: -18, y: 34.5, z: 14, s: 1.1 },
        { x: 28, y: 18.5, z: 18, s: 1.3 },
        { x: -26, y: 18.5, z: 20, s: 1.2 }
      ];

      flowerPositions.forEach(fp => {
        const fl = createFlower(fp.s);
        fl.position.set(fp.x, fp.y, fp.z);
        this.cakeGroup.add(fl);
      });

      // 8. Glowing Birthday Candles (5 Candles on Top)
      const candlePositions = [
        { x: 0, z: 0 },
        { x: -5.5, z: -3.5 },
        { x: 5.5, z: -3.5 },
        { x: -4, z: 5 },
        { x: 4, z: 5 }
      ];

      const candleGeo = new THREE.CylinderGeometry(0.75, 0.75, 11, 16);
      const candleColors = [0xFFEB3B, 0xF48FB1, 0xCE93D8, 0x80DEEA, 0xFFCC80];

      candlePositions.forEach((pos, idx) => {
        const candleMat = new THREE.MeshStandardMaterial({
          color: candleColors[idx % candleColors.length],
          roughness: 0.3
        });
        const candle = new THREE.Mesh(candleGeo, candleMat);
        candle.position.set(pos.x, 54, pos.z);
        this.cakeGroup.add(candle);

        // Wick
        const wickGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 8);
        const wickMat = new THREE.MeshBasicMaterial({ color: 0x3E2723 });
        const wick = new THREE.Mesh(wickGeo, wickMat);
        wick.position.set(pos.x, 60, pos.z);
        this.cakeGroup.add(wick);

        // Realistic Flame (Dual-layer teardrop)
        const flameGroup = new THREE.Group();
        flameGroup.position.set(pos.x, 62, pos.z);

        // Inner bright core
        const coreGeo = new THREE.SphereGeometry(0.9, 10, 10);
        coreGeo.scale(0.8, 2, 0.8);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFEB3B, transparent: true, opacity: 0.95 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        flameGroup.add(core);

        // Outer glow halo
        const haloGeo = new THREE.SphereGeometry(1.4, 12, 12);
        haloGeo.scale(1, 2.4, 1);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xFF9800,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        flameGroup.add(halo);

        flameGroup.userData = {
          initialY: 62,
          wickPos: new THREE.Vector3(pos.x, 60.5, pos.z),
          seed: Math.random() * 50
        };

        this.cakeGroup.add(flameGroup);
        this.flameMeshes.push(flameGroup);
      });

      // 9. Orbiting 3D Floating Hearts & Stars
      this.initOrbitingDecorations();

      this.animateThree();
    } catch (e) {
      console.warn('Three.js cake initialization failed, falling back to 2D:', e);
      this.initCanvas2DCake();
    }
  }

  // Orbiting Hearts & Stars in 3D Space
  initOrbitingDecorations() {
    const starGeo = new THREE.OctahedronGeometry(2.5, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true, transparent: true, opacity: 0.75 });
    const heartMat = new THREE.MeshBasicMaterial({ color: 0xFF4081, wireframe: true, transparent: true, opacity: 0.75 });

    for (let i = 0; i < 12; i++) {
      const isHeart = i % 2 === 0;
      const mesh = new THREE.Mesh(isHeart ? starGeo : starGeo, isHeart ? heartMat : starMat);
      mesh.userData = {
        orbitRadius: 46 + (i * 3.5),
        angle: (i / 12) * Math.PI * 2,
        speed: 0.008 + (i % 3) * 0.003,
        heightOffset: 20 + Math.sin(i) * 25,
        bobSpeed: 0.02 + Math.random() * 0.02
      };
      this.scene.add(mesh);
      this.orbitingObjects.push(mesh);
    }
  }

  animateThree() {
    this.animId = requestAnimationFrame(() => this.animateThree());

    const now = performance.now();

    // Gentle slow cake auto-rotation when user is not dragging
    if (this.cakeGroup && !this.isInteracting) {
      this.cakeGroup.rotation.y += 0.004;
    }

    // Flame flicker animation & warm dynamic light
    if (this.candlesLit) {
      const time = now * 0.009;
      this.flameMeshes.forEach(flame => {
        const offset = flame.userData.seed;
        const scaleFlicker = 1 + Math.sin(time * 2 + offset) * 0.12;
        flame.scale.set(scaleFlicker, scaleFlicker * (1 + Math.sin(time * 3 + offset) * 0.15), scaleFlicker);
        flame.position.y = flame.userData.initialY + Math.sin(time * 2.5 + offset) * 0.3;
      });

      if (this.warmPointLight) {
        this.warmPointLight.intensity = 1.3 + Math.sin(time * 8) * 0.2;
      }
    }

    // Animate Orbiting 3D Hearts & Stars
    this.orbitingObjects.forEach(obj => {
      const data = obj.userData;
      data.angle += data.speed;
      obj.position.x = Math.cos(data.angle) * data.orbitRadius;
      obj.position.z = Math.sin(data.angle) * data.orbitRadius;
      obj.position.y = data.heightOffset + Math.sin(now * data.bobSpeed) * 4;
      obj.rotation.x += 0.02;
      obj.rotation.y += 0.03;
    });

    // Update Smoke Particles
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const sp = this.smokeParticles[i];
      sp.mesh.position.add(sp.velocity);
      sp.velocity.x += (Math.random() - 0.5) * 0.02; // gentle curl
      sp.mesh.scale.multiplyScalar(1.025);
      sp.mesh.material.opacity -= 0.015;

      if (sp.mesh.material.opacity <= 0) {
        this.scene.remove(sp.mesh);
        sp.mesh.geometry.dispose();
        sp.mesh.material.dispose();
        this.smokeParticles.splice(i, 1);
      }
    }

    // Update Firework Bursts in 3D
    for (let i = this.fireworkBursts.length - 1; i >= 0; i--) {
      const fb = this.fireworkBursts[i];
      fb.particles.forEach(p => {
        p.position.add(p.userData.velocity);
        p.userData.velocity.y -= 0.025; // gravity
        p.material.opacity -= 0.02;
      });
      fb.life -= 1;
      if (fb.life <= 0) {
        fb.particles.forEach(p => {
          this.scene.remove(p);
          p.geometry.dispose();
          p.material.dispose();
        });
        this.fireworkBursts.splice(i, 1);
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Spawn Realistic Smoke Particle Simulation
  spawnSmokeParticles() {
    if (!this.isThreeAvailable || !this.scene) return;

    const smokeGeo = new THREE.SphereGeometry(0.9, 8, 8);

    this.flameMeshes.forEach(flame => {
      const wickWorldPos = new THREE.Vector3();
      flame.getWorldPosition(wickWorldPos);

      for (let s = 0; s < 18; s++) {
        setTimeout(() => {
          const smokeMat = new THREE.MeshBasicMaterial({
            color: 0xE0E0E0,
            transparent: true,
            opacity: 0.65,
            depthWrite: false
          });
          const smokeMesh = new THREE.Mesh(smokeGeo, smokeMat);
          smokeMesh.position.copy(wickWorldPos);
          smokeMesh.position.y += Math.random() * 1.5;

          this.scene.add(smokeMesh);
          this.smokeParticles.push({
            mesh: smokeMesh,
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.25,
              0.45 + Math.random() * 0.35,
              (Math.random() - 0.5) * 0.25
            )
          });
        }, s * 65);
      }
    });
  }

  // Spawn 3D Firework Particle Burst
  spawn3DFireworkBurst(x, y, z, colorHex) {
    if (!this.isThreeAvailable || !this.scene) return;

    const particles = [];
    const pGeo = new THREE.SphereGeometry(0.8, 6, 6);
    const count = 35;

    for (let i = 0; i < count; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.95
      });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(x, y, z);

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 1.8;
      p.userData = {
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          (Math.random() - 0.3) * speed,
          Math.sin(angle) * speed
        )
      };
      this.scene.add(p);
      particles.push(p);
    }

    this.fireworkBursts.push({ particles, life: 45 });
  }

  // Blow Out Candles Ritual
  blowCandles() {
    if (!this.candlesLit) return;
    this.candlesLit = false;

    // 1. Play candle blow whoosh sound
    if (window.soundEngine) {
      window.soundEngine.playCandleBlow();
    }

    // 2. Animate candle flames going out
    this.flameMeshes.forEach(flame => {
      if (typeof gsap !== 'undefined') {
        gsap.to(flame.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            flame.visible = false;
          }
        });
      } else {
        flame.visible = false;
      }
    });

    if (this.warmPointLight && typeof gsap !== 'undefined') {
      gsap.to(this.warmPointLight, { intensity: 0.3, duration: 0.5 });
    }

    // 3. Create realistic smoke effect
    this.spawnSmokeParticles();

    // 4. Trigger beautiful confetti explosion
    if (window.soundEngine) {
      window.soundEngine.playConfettiExplosion();
    }
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F8BBD0', '#D1C4E9', '#FFE0B2', '#FFD700', '#FFFFFF', '#FF4081']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#FFD700', '#F8BBD0', '#E1BEE7']
        });
      }, 400);
    }

    // 5. Trigger animated fireworks
    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.playFirework();
      this.spawn3DFireworkBurst(-40, 75, -20, 0xFF4081);
      this.spawn3DFireworkBurst(45, 80, -10, 0xFFD700);
    }, 250);

    setTimeout(() => {
      this.spawn3DFireworkBurst(0, 90, -30, 0xD1C4E9);
    }, 600);

    // 6. Callback to UI scene
    if (this.onCandlesBlown) {
      this.onCandlesBlown();
    }
  }

  // Microphone Blow Detection
  startMicDetection(onBlowSuccess) {
    if (this.isListeningMic) return;
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.micStream = stream;
        this.isListeningMic = true;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.micAnalyzer = this.audioContext.createAnalyser();
        this.micAnalyzer.fftSize = 256;
        source.connect(this.micAnalyzer);

        const dataArray = new Uint8Array(this.micAnalyzer.frequencyBinCount);
        const checkBlow = () => {
          if (!this.isListeningMic) return;
          this.micAnalyzer.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < 20; i++) sum += dataArray[i];
          const avg = sum / 20;

          if (avg > 65) {
            this.stopMicDetection();
            this.blowCandles();
            if (onBlowSuccess) onBlowSuccess();
            return;
          }
          requestAnimationFrame(checkBlow);
        };
        checkBlow();
      }).catch(err => {
        console.warn('Microphone permission notice:', err);
      });
    } catch (e) {
      console.warn('Mic detection init error:', e);
    }
  }

  stopMicDetection() {
    this.isListeningMic = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  // Interactivity: Drag to rotate cake 360 degrees + responsive resize
  setupInteractivity() {
    let isDragging = false;
    let prevX = 0;

    const startDrag = (x) => {
      isDragging = true;
      this.isInteracting = true;
      prevX = x;
    };

    const doDrag = (x) => {
      if (!isDragging) return;
      const delta = x - prevX;
      prevX = x;
      if (this.cakeGroup) {
        this.cakeGroup.rotation.y += delta * 0.015;
      }
    };

    const stopDrag = () => {
      isDragging = false;
      setTimeout(() => {
        this.isInteracting = false;
      }, 1400);
    };

    this._onMouseMove = (e) => doDrag(e.clientX);
    this._onMouseUp = stopDrag;
    this._onTouchMove = (e) => {
      if (e.touches.length > 0) doDrag(e.touches[0].clientX);
    };
    this._onTouchEnd = stopDrag;
    this._onResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || 320;
      const height = this.container.clientHeight || 320;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };

    this.canvas.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) startDrag(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', this._onTouchMove, { passive: true });
    window.addEventListener('touchend', this._onTouchEnd);
    window.addEventListener('resize', this._onResize);

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._onResize());
      this._resizeObserver.observe(this.container);
    }
  }

  // 2D Canvas Fallback
  initCanvas2DCake() {
    const ctx = this.canvas.getContext('2d');
    const width = this.canvas.width = this.container.clientWidth || 340;
    const height = this.canvas.height = this.container.clientHeight || 340;

    let rot = 0;
    const render2D = () => {
      this.animId = requestAnimationFrame(render2D);
      ctx.clearRect(0, 0, width, height);

      rot += 0.01;
      const cx = width / 2;
      const cy = height / 2 + 25;

      // Plate
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 50, 110, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Tier 1
      ctx.fillStyle = '#D1C4E9';
      ctx.fillRect(cx - 80, cy, 160, 50);
      ctx.beginPath();
      ctx.ellipse(cx, cy + 50, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tier 2
      ctx.fillStyle = '#F8BBD0';
      ctx.fillRect(cx - 55, cy - 35, 110, 35);
      ctx.beginPath();
      ctx.ellipse(cx, cy, 55, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tier 3
      ctx.fillStyle = '#FFE0B2';
      ctx.fillRect(cx - 35, cy - 65, 70, 30);
      ctx.beginPath();
      ctx.ellipse(cx, cy - 35, 35, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Candles & Flames
      const cPositions = [-20, -10, 0, 10, 20];
      cPositions.forEach(x => {
        ctx.fillStyle = '#FFEB3B';
        ctx.fillRect(cx + x - 2, cy - 85, 4, 22);

        if (this.candlesLit) {
          ctx.fillStyle = '#FF9800';
          ctx.beginPath();
          ctx.arc(cx + x, cy - 90 + Math.sin(rot * 5 + x) * 2, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFF59D';
          ctx.beginPath();
          ctx.arc(cx + x, cy - 90 + Math.sin(rot * 5 + x) * 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
    render2D();
  }

  destroy() {
    this.stopMicDetection();
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this._onMouseMove) window.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseUp) window.removeEventListener('mouseup', this._onMouseUp);
    if (this._onTouchMove) window.removeEventListener('touchmove', this._onTouchMove);
    if (this._onTouchEnd) window.removeEventListener('touchend', this._onTouchEnd);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this.renderer) this.renderer.dispose();
  }
}

window.InteractiveBirthdayCake = InteractiveBirthdayCake;
