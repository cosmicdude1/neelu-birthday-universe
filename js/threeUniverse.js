/**
 * ===================================================================
 *  A LITTLE UNIVERSE FOR NEELU - 3D CELESTIAL BACKGROUND (THREE.JS)
 * ===================================================================
 *  Renders an ethereal cosmic universe with:
 *   - Thousands of twinkling multi-depth stars (pink, lavender, gold, white)
 *   - Glowing rotating nebula clouds
 *   - Dynamic shooting stars with glowing tails
 *   - Floating 3D gem crystals & floating hearts
 *   - Subtle camera parallax (mouse on desktop, touch tilt on mobile)
 *   - Cinematic Cosmic Warp mode when "Open Your Surprise" is pressed!
 * ===================================================================
 */

class CelestialUniverse {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stars = null;
    this.starPositions = null;
    this.starCount = window.innerWidth <= 768 ? 1800 : 3500;
    this.nebulaParticles = null;
    this.floatingObjects = [];
    this.shootingStars = [];
    this.floatingHearts = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.isThreeAvailable = typeof THREE !== 'undefined';
    this.animFrameId = null;
    this.isWarping = false;
    this.warpSpeed = 0.5;

    this.init();
  }

  init() {
    if (this.isThreeAvailable) {
      this.initThree();
    } else {
      this.initCanvasFallback();
    }
    this.setupListeners();
    this.startShootingStarScheduler();
  }

  initThree() {
    try {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3500);
      this.camera.position.z = 900;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 1. Star Texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.2, 'rgba(255,230,245,0.9)');
      grad.addColorStop(0.5, 'rgba(209,196,233,0.5)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();

      const starTexture = new THREE.CanvasTexture(canvas);

      // 2. Multi-tier Starfield (3500+ stars)
      const starGeo = new THREE.BufferGeometry();
      this.starPositions = new Float32Array(this.starCount * 3);
      const colors = new Float32Array(this.starCount * 3);

      const colorPalette = [
        new THREE.Color(0xF8BBD0), // pastel pink
        new THREE.Color(0xD1C4E9), // lavender
        new THREE.Color(0xFFE0B2), // soft peach
        new THREE.Color(0xFFFFFF), // brilliant white
        new THREE.Color(0xFFD700), // warm gold
        new THREE.Color(0x80DEEA)  // celestial cyan
      ];

      for (let i = 0; i < this.starCount; i++) {
        const i3 = i * 3;
        this.starPositions[i3] = (Math.random() - 0.5) * 2600;
        this.starPositions[i3 + 1] = (Math.random() - 0.5) * 2600;
        this.starPositions[i3 + 2] = (Math.random() - 0.5) * 2400;

        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(this.starPositions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 4.5,
        vertexColors: true,
        map: starTexture,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.stars = new THREE.Points(starGeo, starMat);
      this.scene.add(this.stars);

      // 3. Cosmic Nebula Clouds
      const nebulaGeo = new THREE.BufferGeometry();
      const nebulaCount = 220;
      const nebPositions = new Float32Array(nebulaCount * 3);
      const nebColors = new Float32Array(nebulaCount * 3);

      for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 280 + Math.random() * 550;
        nebPositions[i3] = Math.cos(angle) * radius;
        nebPositions[i3 + 1] = Math.sin(angle) * radius;
        nebPositions[i3 + 2] = (Math.random() - 0.5) * 600;

        const c = Math.random() > 0.4 ? new THREE.Color(0x9575CD) : new THREE.Color(0xF48FB1);
        nebColors[i3] = c.r;
        nebColors[i3 + 1] = c.g;
        nebColors[i3 + 2] = c.b;
      }

      nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebPositions, 3));
      nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebColors, 3));

      const nebMat = new THREE.PointsMaterial({
        size: 90,
        vertexColors: true,
        map: starTexture,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.nebulaParticles = new THREE.Points(nebulaGeo, nebMat);
      this.scene.add(this.nebulaParticles);

      // 4. Floating 3D Geometric Gem Crystals
      const gemGeo = new THREE.OctahedronGeometry(7, 0);
      for (let i = 0; i < 28; i++) {
        const gemMat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xFFD700 : 0xF8BBD0,
          wireframe: true,
          transparent: true,
          opacity: 0.45
        });
        const mesh = new THREE.Mesh(gemGeo, gemMat);
        mesh.position.set(
          (Math.random() - 0.5) * 1200,
          (Math.random() - 0.5) * 900,
          (Math.random() - 0.5) * 500
        );
        mesh.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.02,
          rotSpeedY: (Math.random() - 0.5) * 0.02,
          driftY: 0.2 + Math.random() * 0.35
        };
        this.floatingObjects.push(mesh);
        this.scene.add(mesh);
      }

      this.animateThree();
    } catch (e) {
      console.warn('Three.js failed, falling back to 2D Canvas:', e);
      this.initCanvasFallback();
    }
  }

  // Shooting Star Creator
  spawnShootingStar() {
    if (this.isThreeAvailable && this.scene) {
      const length = 120 + Math.random() * 80;
      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(6);

      const startX = (Math.random() - 0.5) * 1200;
      const startY = 400 + Math.random() * 300;
      const startZ = 200 + Math.random() * 300;

      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const endX = startX - Math.cos(angle) * length;
      const endY = startY - Math.sin(angle) * length;
      const endZ = startZ - 40;

      positions[0] = startX;
      positions[1] = startY;
      positions[2] = startZ;
      positions[3] = endX;
      positions[4] = endY;
      positions[5] = endZ;

      lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: Math.random() > 0.5 ? 0xFFD700 : 0xF8BBD0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(lineGeo, lineMat);
      line.userData = {
        vx: -Math.cos(angle) * (18 + Math.random() * 10),
        vy: -Math.sin(angle) * (18 + Math.random() * 10),
        opacity: 0.9,
        life: 0
      };

      this.scene.add(line);
      this.shootingStars.push(line);

      // Play soft shooting star audio cue
      if (window.soundEngine && Math.random() > 0.3) {
        window.soundEngine.playShootingStar();
      }
    } else if (this.canvas2DFallback) {
      // 2D Fallback shooting star
      this.canvas2DFallback.spawnShootingStar();
    }
  }

  startShootingStarScheduler() {
    const triggerNext = () => {
      this.spawnShootingStar();
      const nextDelay = 2600 + Math.random() * 3500;
      setTimeout(triggerNext, nextDelay);
    };
    setTimeout(triggerNext, 1800);
  }

  // Cinematic Cosmic Warp Transition
  triggerWarpTransition(onComplete) {
    this.isWarping = true;
    if (window.soundEngine) {
      window.soundEngine.playWarp();
    }

    // Accelerate stars toward camera
    let elapsed = 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    const warpStep = () => {
      const now = performance.now();
      elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      this.warpSpeed = 1 + progress * 24; // Acceleration curve

      if (progress < 1) {
        requestAnimationFrame(warpStep);
      } else {
        // Slow down and finish
        setTimeout(() => {
          this.isWarping = false;
          this.warpSpeed = 0.5;
          if (onComplete) onComplete();
        }, 200);
      }
    };
    warpStep();
  }

  animateThree() {
    this.animFrameId = requestAnimationFrame(() => this.animateThree());

    // Smooth cursor & touch parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    if (this.camera) {
      this.camera.position.x = this.mouseX * 70;
      this.camera.position.y = -this.mouseY * 70;
      this.camera.lookAt(0, 0, 0);
    }

    // Rotate and animate stars
    if (this.stars && this.starPositions) {
      const positions = this.stars.geometry.attributes.position.array;
      const speed = this.isWarping ? this.warpSpeed : 0.6;

      for (let i = 0; i < this.starCount; i++) {
        const i3 = i * 3 + 2; // z-coordinate
        positions[i3] += speed;
        if (positions[i3] > 950) {
          positions[i3] = -1200;
        }
      }
      this.stars.geometry.attributes.position.needsUpdate = true;

      if (!this.isWarping) {
        this.stars.rotation.y += 0.00025;
        this.stars.rotation.x += 0.0001;
      }
    }

    if (this.nebulaParticles) {
      this.nebulaParticles.rotation.z -= this.isWarping ? 0.003 : 0.0004;
      if (this.isWarping) {
        this.nebulaParticles.scale.multiplyScalar(1.002);
      }
    }

    // Floating gem crystals
    for (const obj of this.floatingObjects) {
      obj.rotation.x += obj.userData.rotSpeedX;
      obj.rotation.y += obj.userData.rotSpeedY;
      obj.position.y += obj.userData.driftY;
      if (obj.position.y > 600) {
        obj.position.y = -600;
      }
    }

    // Animate Shooting Stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.position.x += ss.userData.vx;
      ss.position.y += ss.userData.vy;
      ss.userData.life += 1;
      ss.material.opacity -= 0.025;

      if (ss.material.opacity <= 0 || ss.userData.life > 45) {
        this.scene.remove(ss);
        ss.geometry.dispose();
        ss.material.dispose();
        this.shootingStars.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Pure Canvas 2D Fallback
  initCanvasFallback() {
    const ctx = this.canvas.getContext('2d');
    const width = this.canvas.width = window.innerWidth;
    const height = this.canvas.height = window.innerHeight;

    const stars = [];
    for (let i = 0; i < 350; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 100,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        color: ['#F8BBD0', '#D1C4E9', '#FFE0B2', '#FFFFFF', '#FFD700'][Math.floor(Math.random() * 5)]
      });
    }

    const shootingStars2D = [];
    this.canvas2DFallback = {
      spawnShootingStar: () => {
        shootingStars2D.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.5),
          vx: -(12 + Math.random() * 8),
          vy: 8 + Math.random() * 6,
          length: 80 + Math.random() * 60,
          alpha: 1,
          color: Math.random() > 0.5 ? '#FFD700' : '#F8BBD0'
        });
      }
    };

    const render = () => {
      this.animFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Deep celestial gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#070914');
      bgGrad.addColorStop(0.4, '#150E28');
      bgGrad.addColorStop(0.7, '#231238');
      bgGrad.addColorStop(1, '#090B16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Nebula glow
      const nebGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 60, width * 0.5, height * 0.45, 450);
      nebGrad.addColorStop(0, 'rgba(179, 157, 219, 0.22)');
      nebGrad.addColorStop(0.5, 'rgba(244, 143, 177, 0.12)');
      nebGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      for (const s of stars) {
        s.alpha += s.speed;
        const opacity = Math.abs(Math.sin(s.alpha));
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Shooting stars
      for (let i = shootingStars2D.length - 1; i >= 0; i--) {
        const ss = shootingStars2D[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha -= 0.025;
        if (ss.alpha <= 0) {
          shootingStars2D.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ss.alpha;
        ctx.strokeStyle = ss.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        ctx.stroke();
        ctx.restore();
      }
    };
    render();
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      if (this.renderer && this.camera) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      } else if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // Touch support for Android mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    }, { passive: true });
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

window.CelestialUniverse = CelestialUniverse;
