/* CORE: shared namespace and helpers used by every module. Must load first. */
window.BICOL = window.BICOL || {};

BICOL.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
BICOL.$ = (sel, root = document) => root.querySelector(sel);
BICOL.$$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Modules register an init function; main.js runs them in order once the DOM is ready. */
BICOL.modules = [];
BICOL.register = (name, init) => BICOL.modules.push({ name, init });
