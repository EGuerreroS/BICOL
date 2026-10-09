/* PARTICLES: canvas "story dust" behind any element with data-fx="<tone>".
   Particles drift upward, twinkle, are repelled by the cursor, and pause off-screen. */
BICOL.register('particles', () => {
  const { $$, reduceMotion } = BICOL;
  if (reduceMotion) return;

  // Tone presets: n = density, c = RGB colors, a = max alpha, glow = additive light (dark backgrounds)
  const TONES = {
    hero:   { n: 70, c: [[255,210,122],[242,165,22],[95,209,201]], a: .9,  glow: true },
    impact: { n: 55, c: [[255,210,122],[95,209,201]],              a: .8,  glow: true },
    cta:    { n: 80, c: [[255,210,122],[242,165,22],[168,210,126]], a: .95, glow: true },
    band:   { n: 30, c: [[255,210,122],[95,209,201]],              a: .8,  glow: true },
    light:  { n: 28, c: [[214,170,90],[31,138,138]],               a: .35, glow: false }
  };
  const REPEL_RADIUS = 120;
  const fields = [];

  function createField(section) {
    const tone = TONES[section.dataset.fx];
    if (!tone) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'fx';
    canvas.setAttribute('aria-hidden', 'true');
    section.prepend(canvas);

    const f = { section, canvas, ctx: canvas.getContext('2d'), tone, ps: [], w: 0, h: 0, mx: -999, my: -999, visible: false };

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      f.w = section.offsetWidth; f.h = section.offsetHeight;
      canvas.width = f.w * dpr; canvas.height = f.h * dpr;
      f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = innerWidth < 640 ? 0.35 : 1;
      const areaFactor = Math.min(1.6, (f.w * f.h) / (1400 * 800) + 0.4);
      f.ps = Array.from({ length: Math.round(tone.n * mobile * areaFactor) }, () => ({
        x: Math.random() * f.w, y: Math.random() * f.h,
        r: 0.8 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.25, vy: -(0.15 + Math.random() * 0.45),
        c: tone.c[(Math.random() * tone.c.length) | 0],
        tw: Math.random() * Math.PI * 2, ts: 0.01 + Math.random() * 0.03
      }));
    }
    resize();
    addEventListener('resize', resize);

    section.addEventListener('mousemove', e => {
      const r = section.getBoundingClientRect();
      f.mx = e.clientX - r.left; f.my = e.clientY - r.top;
    });
    section.addEventListener('mouseleave', () => { f.mx = f.my = -999; });
    new IntersectionObserver(([e]) => { f.visible = e.isIntersecting; }).observe(section);

    fields.push(f);
  }

  function draw(f) {
    const { ctx, tone } = f;
    ctx.clearRect(0, 0, f.w, f.h);

    // Soft golden light following the cursor
    if (tone.glow && f.mx > -999) {
      const g = ctx.createRadialGradient(f.mx, f.my, 0, f.mx, f.my, 260);
      g.addColorStop(0, 'rgba(242,165,22,.13)');
      g.addColorStop(1, 'rgba(242,165,22,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, f.w, f.h);
    }

    ctx.globalCompositeOperation = tone.glow ? 'lighter' : 'source-over';
    for (const p of f.ps) {
      const dx = p.x - f.mx, dy = p.y - f.my, d2 = dx * dx + dy * dy;
      if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
        const d = Math.sqrt(d2) || 1, k = (REPEL_RADIUS - d) / REPEL_RADIUS * 1.6;
        p.x += dx / d * k; p.y += dy / d * k;
      }
      p.x += p.vx + Math.sin(p.tw) * 0.15; p.y += p.vy; p.tw += p.ts;
      if (p.y < -10) { p.y = f.h + 10; p.x = Math.random() * f.w; }
      if (p.x < -10) p.x = f.w + 10;
      if (p.x > f.w + 10) p.x = -10;

      const a = tone.a * (0.45 + 0.55 * Math.sin(p.tw) ** 2), [r, g, b] = p.c;
      if (tone.glow) {
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gr.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  $$('[data-fx]').forEach(createField);

  (function loop() {
    if (!document.hidden) fields.forEach(f => f.visible && draw(f));
    requestAnimationFrame(loop);
  })();
});
