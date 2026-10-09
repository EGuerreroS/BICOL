/* GLYPHS: faint letters from many alphabets drifting upward in dark sections.
   Add data-glyphs to any section to enable it. */
BICOL.register('glyphs', () => {
  const { $$, reduceMotion } = BICOL;
  if (reduceMotion) return;

  const CHARS = 'AÑÇΩあ한Жéßãأ文ñüΣधλ'.split('');
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  $$('[data-glyphs]').forEach(section => {
    const layer = document.createElement('div');
    layer.className = 'fx';
    layer.setAttribute('aria-hidden', 'true');
    const count = innerWidth < 640 ? 6 : 14;

    for (let i = 0; i < count; i++) {
      const g = document.createElement('span');
      g.className = 'glyph';
      g.textContent = pick(CHARS);
      g.style.cssText = [
        `left:${Math.random() * 96}%`,
        `top:${10 + Math.random() * 80}%`,
        `font-size:${28 + Math.random() * 90}px`,
        `--o:${(0.05 + Math.random() * 0.07).toFixed(2)}`,
        `--r:${(Math.random() * 60 - 30) | 0}deg`,
        `animation-duration:${14 + Math.random() * 16}s`,
        `animation-delay:-${Math.random() * 20}s`
      ].join(';');
      layer.appendChild(g);
    }
    section.prepend(layer);
  });
});
