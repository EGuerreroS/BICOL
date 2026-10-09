/* INTERACTIONS: 3D tilt + sheen on .tilt cards, magnetic pull on .btn. Desktop pointer only. */
BICOL.register('interactions', () => {
  const { $$, reduceMotion } = BICOL;
  if (reduceMotion || !matchMedia('(hover: hover)').matches) return;

  const MAX_TILT = 10; // degrees, full range across the card

  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', (x - 0.5) * MAX_TILT + 'deg');
      card.style.setProperty('--rx', (0.5 - y) * MAX_TILT + 'deg');
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  $$('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
});
