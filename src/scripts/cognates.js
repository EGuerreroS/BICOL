/* COGNATES: hovering/tapping a .cog highlights its pair (same data-p) in both languages. */
BICOL.register('cognates', () => {
  const { $, $$ } = BICOL;
  const demo = $('#demo');
  if (!demo) return;

  const clear = () => $$('.hl', demo).forEach(x => x.classList.remove('hl'));
  const light = id => $$(`[data-p="${id}"]`, demo).forEach(x => x.classList.add('hl'));

  $$('.cog', demo).forEach(word => {
    word.addEventListener('mouseenter', () => light(word.dataset.p));
    word.addEventListener('mouseleave', clear);
    word.addEventListener('click', () => { clear(); light(word.dataset.p); });
  });

  $('#showAll').addEventListener('change', e => demo.classList.toggle('show-all', e.target.checked));
});
