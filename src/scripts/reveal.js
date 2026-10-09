/* REVEAL: fades/blurs .rv elements in when they enter the viewport, staggering siblings. */
BICOL.register('reveal', () => {
  const { $$ } = BICOL;
  const STAGGER = 0.1; // seconds between sibling cards

  $$('.rv').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('rv'));
    el.style.setProperty('--d', siblings.indexOf(el) * STAGGER + 's');
  });

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { threshold: 0.12 });

  $$('.rv').forEach(el => io.observe(el));
});
