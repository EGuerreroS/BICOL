/* LANG: swaps every [data-i18n] text and [data-i18n-list] list using BICOL.i18n.<lang>.
   The choice is remembered per visitor; first visit follows the browser language. */
BICOL.register('lang', () => {
  const { $$, i18n } = BICOL;
  const STORAGE_KEY = 'bicol-lang';

  function setLang(lang) {
    const dict = i18n[lang];
    if (!dict) return;
    document.documentElement.lang = lang;

    $$('[data-i18n]').forEach(el => {
      const value = dict[el.dataset.i18n];
      if (value == null) return;
      el.innerHTML = value;
      el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
    });
    $$('[data-i18n-list]').forEach(el => {
      el.innerHTML = dict[el.dataset.i18nList].map(item => `<span>${item}</span>`).join('');
    });
    $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  let initial = 'en';
  try { initial = localStorage.getItem(STORAGE_KEY) || (navigator.language || 'en').slice(0, 2); } catch (e) {}
  setLang(i18n[initial] ? initial : 'en');

  BICOL.setLang = setLang;
});
