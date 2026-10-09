/* COUNTERS: animates [data-count] numbers from 0 when visible. Optional data-suffix (e.g. "+"). */
BICOL.register('counters', () => {
  const { $$, reduceMotion } = BICOL;
  const DURATION = 1600;

  function animate(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    (function step(now) {
      const k = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased) + (k === 1 ? suffix : '');
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    animate(e.target);
  }), { threshold: 0.6 });

  $$('[data-count]').forEach(el => { el.textContent = '0'; io.observe(el); });
});
