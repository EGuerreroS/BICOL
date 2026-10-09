/* SCROLL: everything driven by scroll position, batched in one rAF per frame.
   - nav glass state      - top progress bar
   - hero parallax (--sy) - books fan (--f)
   - roadmap fill (--p) and lit phases */
BICOL.register('scroll', () => {
  const { $, $$, reduceMotion } = BICOL;
  const nav = $('#nav'), bar = $('#progress'), hero = $('#top'), books = $('#books'), road = $('#road');
  const phases = road ? $$('.phase', road) : [];

  // Books start stacked and fan open shortly after load
  if (books) setTimeout(() => books.classList.add('open'), 400);

  function update() {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 30);
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (reduceMotion) return;

    if (y < innerHeight * 1.2) {
      hero.style.setProperty('--sy', y);
      books.style.setProperty('--f', Math.min(y / 350, 1));
    }
    if (road) {
      const r = road.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.25)));
      road.style.setProperty('--p', p);
      phases.forEach((ph, i) => ph.classList.toggle('lit', p >= i / (phases.length - 1) * 0.92));
    }
  }

  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  if (reduceMotion) phases.forEach(ph => ph.classList.add('lit'));
});
