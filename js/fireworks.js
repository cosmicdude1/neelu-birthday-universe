/**
 * ===================================================================
 *  A LITTLE UNIVERSE FOR NEELU - FIREWORKS & SKY LANTERNS ENGINE
 * ===================================================================
 *  Features:
 *   - Multicolored canvas particle fireworks (peony, willow, glitter)
 *   - Realistic rising sky lanterns with golden candlelight glow
 *   - Interactive lantern release with custom wish tags
 *   - Ambient floating stars & confetti
 * ===================================================================
 */

class FireworksAndLanterns {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.fireworks = [];
    this.particles = [];
    this.lanterns = [];
    this.isRunning = false;
    this.animId = null;
    this.fireworkTimer = null;

    this.palette = [
      '#F8BBD0', '#F48FB1', '#E91E63', // Pinks
      '#D1C4E9', '#B39DDB', '#9575CD', // Lavenders
      '#FFE0B2', '#FFD700', '#FFF59D', // Golds/Peaches
      '#80DEEA', '#4DD0E1', '#E0F7FA'  // Celestial cyans
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.seedInitialLanterns();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  seedInitialLanterns() {
    const initialWishes = [
      "Endless Joy 🌸",
      "Serenity & Health 🕊️",
      "Dreams Coming True 💫",
      "Laughter Always ✨",
      "A Heart at Peace 💛"
    ];

    initialWishes.forEach((wish, idx) => {
      this.lanterns.push({
        x: Math.random() * (this.canvas.width || 800),
        y: (this.canvas.height || 600) * 0.4 + idx * 70,
        size: 26 + Math.random() * 12,
        speedY: 0.35 + Math.random() * 0.3,
        swaySpeed: 0.01 + Math.random() * 0.01,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.75 + Math.random() * 0.2,
        wish: wish
      });
    });
  }

  // Release a new personalized lantern
  addLantern(wishText) {
    const startX = this.canvas.width * 0.3 + Math.random() * (this.canvas.width * 0.4);
    const lantern = {
      x: startX,
      y: this.canvas.height + 40,
      size: 38,
      speedY: 0.8 + Math.random() * 0.3,
      swaySpeed: 0.015,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: 0.95,
      wish: wishText || "A Beautiful Birthday Wish ✨",
      isHero: true
    };
    this.lanterns.push(lantern);

    if (window.soundEngine) {
      window.soundEngine.playAngelFeather();
    }
  }

  // Launch a firework shell
  launchFirework(targetX, targetY) {
    const startX = targetX || Math.random() * this.canvas.width;
    const startY = this.canvas.height;
    const destX = targetX || (this.canvas.width * 0.15 + Math.random() * (this.canvas.width * 0.7));
    const destY = targetY || (this.canvas.height * 0.15 + Math.random() * (this.canvas.height * 0.4));

    const color = this.palette[Math.floor(Math.random() * this.palette.length)];
    const speed = 7 + Math.random() * 4;
    const angle = Math.atan2(destY - startY, destX - startX);

    this.fireworks.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      destX: destX,
      destY: destY,
      color: color,
      trail: []
    });
  }

  // Explode firework into particles
  explode(x, y, color) {
    if (window.soundEngine) {
      window.soundEngine.playFirework();
    }

    const count = 70 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.012,
        color: Math.random() > 0.3 ? color : '#FFD700',
        gravity: 0.05,
        friction: 0.96,
        size: Math.random() * 2.8 + 1
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.render();

    // Auto launch fireworks periodically
    this.fireworkTimer = setInterval(() => {
      if (!this.isRunning) return;
      this.launchFirework();
      if (Math.random() > 0.4) {
        setTimeout(() => this.launchFirework(), 250);
      }
    }, 1400);

    // Initial volley
    this.launchFirework(this.canvas.width * 0.3, this.canvas.height * 0.25);
    setTimeout(() => this.launchFirework(this.canvas.width * 0.7, this.canvas.height * 0.22), 300);
    setTimeout(() => this.launchFirework(this.canvas.width * 0.5, this.canvas.height * 0.18), 600);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.fireworkTimer) clearInterval(this.fireworkTimer);
  }

  render() {
    if (!this.isRunning) return;
    this.animId = requestAnimationFrame(() => this.render());

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Trail clear effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    // 1. Update & Draw Fireworks Shells
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.trail.push({ x: fw.x, y: fw.y });
      if (fw.trail.length > 5) fw.trail.shift();

      fw.x += fw.vx;
      fw.y += fw.vy;

      // Draw trail
      ctx.strokeStyle = fw.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let t = 0; t < fw.trail.length; t++) {
        if (t === 0) ctx.moveTo(fw.trail[t].x, fw.trail[t].y);
        else ctx.lineTo(fw.trail[t].x, fw.trail[t].y);
      }
      ctx.stroke();

      // Check detonation
      if (fw.y <= fw.destY || fw.vy >= 0) {
        this.explode(fw.destX, fw.destY, fw.color);
        this.fireworks.splice(i, 1);
      }
    }

    // 2. Update & Draw Exploded Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Update & Draw Rising Sky Lanterns
    ctx.globalCompositeOperation = 'source-over';
    const now = performance.now();

    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.y -= l.speedY;
      const sway = Math.sin(now * l.swaySpeed + l.swayOffset) * 0.8;
      l.x += sway;

      // If lantern ascends past top, reset to bottom
      if (l.y < -80) {
        if (l.isHero) {
          this.lanterns.splice(i, 1);
          continue;
        } else {
          l.y = h + 40;
          l.x = Math.random() * w;
        }
      }

      ctx.save();
      ctx.globalAlpha = l.opacity;

      // Outer golden glow
      const glowGrad = ctx.createRadialGradient(l.x, l.y, l.size * 0.2, l.x, l.y, l.size * 1.6);
      glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(255, 152, 0, 0.2)');
      glowGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.size * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Lantern body (Soft Peach / Warm Amber)
      const bodyGrad = ctx.createLinearGradient(l.x, l.y - l.size * 0.7, l.x, l.y + l.size * 0.7);
      bodyGrad.addColorStop(0, '#FFE082');
      bodyGrad.addColorStop(0.5, '#FFB74D');
      bodyGrad.addColorStop(1, '#FF8A65');

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      // Rounded lantern shape
      const rx = l.size * 0.65;
      const ry = l.size * 0.85;
      ctx.ellipse(l.x, l.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Candle Flame inside lantern
      ctx.fillStyle = '#FFFDE7';
      ctx.beginPath();
      ctx.arc(l.x, l.y + ry * 0.4, l.size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Tag with wish
      if (l.wish && l.size > 24) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(l.wish, l.x, l.y + ry + 16);
      }

      ctx.restore();
    }
  }
}

window.FireworksAndLanterns = FireworksAndLanterns;

