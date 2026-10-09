/* MAIN: boots every registered module once the DOM is ready. Must load last. */
(function boot() {
  const run = () => {
    // Sections are missing when src/index.html is opened directly (not built): do nothing.
    if (!document.getElementById('nav')) return;
    BICOL.modules.forEach(({ name, init }) => {
      try { init(); } catch (err) { console.error(`[BICOL] module "${name}" failed:`, err); }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
