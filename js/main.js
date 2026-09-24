(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. Imágenes: primero la copia local (assets/img);
        si no existe, se carga la URL original de Unicauca.
     --------------------------------------------------------- */
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const useFallback = () => {
      const url = img.dataset.fallback;
      if (!url) return;
      delete img.dataset.fallback; // evita bucles si la URL original también falla
      img.src = url;
    };
    img.addEventListener('error', useFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) useFallback();
  });

  /* ---------------------------------------------------------
     2. Menús desplegables (botones con data-toggle)
     --------------------------------------------------------- */
  const toggles = Array.from(document.querySelectorAll('[data-toggle]'));

  const setOpen = (btn, open) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };

  const closeAll = (except) => {
    toggles.forEach((btn) => {
      if (btn !== except) setOpen(btn, false);
    });
  };

  toggles.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(btn);
      setOpen(btn, willOpen);
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-toggle], [data-panel]')) closeAll();
    if (!event.target.closest('.fab')) closeFab();
    if (!event.target.closest('.a11y')) closeA11y();
  });

  /* ---------------------------------------------------------
     3. Buscador a pantalla completa
     --------------------------------------------------------- */
  const search = document.getElementById('search');
  const openSearchBtn = document.getElementById('open-search');
  const closeSearchBtn = document.getElementById('close-search');
  const searchInput = document.getElementById('search-input');

  const openSearch = () => {
    closeAll();
    search.hidden = false;
    document.body.style.overflow = 'hidden';
    searchInput.focus();
  };
  const closeSearch = () => {
    if (search.hidden) return;
    search.hidden = true;
    document.body.style.overflow = '';
    openSearchBtn.focus();
  };

  openSearchBtn.addEventListener('click', openSearch);
  closeSearchBtn.addEventListener('click', closeSearch);
  search.addEventListener('click', (event) => {
    if (event.target === search) closeSearch();
  });

  /* ---------------------------------------------------------
     4. Accesos rápidos (botón rojo)
     --------------------------------------------------------- */
  const fabBtn = document.getElementById('fab-toggle');
  const fabPanel = document.getElementById('fab-panel');

  function closeFab() {
    fabPanel.hidden = true;
    fabBtn.setAttribute('aria-expanded', 'false');
  }
  fabBtn.addEventListener('click', () => {
    const willOpen = fabPanel.hidden;
    fabPanel.hidden = !willOpen;
    fabBtn.setAttribute('aria-expanded', String(willOpen));
  });

  /* ---------------------------------------------------------
     5. Herramientas de accesibilidad (botón verde)
     --------------------------------------------------------- */
  const a11yBtn = document.getElementById('a11y-toggle');
  const a11yPanel = document.getElementById('a11y-panel');
  const STORAGE_KEY = 'permaneser-a11y';
  const DEFAULTS = { fs: 0, sp: 0, gray: false, contrast: false, dyslexia: false, links: false };

  const load = () => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch (e) {
      return { ...DEFAULTS };
    }
  };
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* almacenamiento no disponible */ }
  };

  let state = load();

  const apply = () => {
    const root = document.documentElement;
    root.style.setProperty('--fs', (1 + state.fs * 0.06).toFixed(2));
    root.style.setProperty('--sp', String(state.sp));
    root.classList.toggle('a11y-gray', state.gray);
    document.body.classList.toggle('a11y-contrast', state.contrast);
    document.body.classList.toggle('a11y-dyslexia', state.dyslexia);
    document.body.classList.toggle('a11y-links', state.links);
    a11yPanel.querySelectorAll('[aria-pressed]').forEach((b) => {
      b.setAttribute('aria-pressed', String(state[b.dataset.action]));
    });
    save();
  };

  function closeA11y() {
    a11yPanel.hidden = true;
    a11yBtn.setAttribute('aria-expanded', 'false');
  }

  a11yBtn.addEventListener('click', () => {
    const willOpen = a11yPanel.hidden;
    a11yPanel.hidden = !willOpen;
    a11yBtn.setAttribute('aria-expanded', String(willOpen));
  });

  a11yPanel.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    switch (action) {
      case 'fs-up':   state.fs = Math.min(state.fs + 1, 4); break;
      case 'fs-down': state.fs = Math.max(state.fs - 1, -2); break;
      case 'sp-up':   state.sp = Math.min(state.sp + 1, 3); break;
      case 'sp-down': state.sp = Math.max(state.sp - 1, 0); break;
      case 'reset':   state = { ...DEFAULTS }; break;
      default:        state[action] = !state[action]; // gray, contrast, dyslexia, links
    }
    apply();
  });

  apply();

  /* ---------------------------------------------------------
     6. Slider (se activa solo con las diapositivas que agregues)
        0 diapositivas = vacío | 1 = fija | 2 o más = carrusel
     --------------------------------------------------------- */
  (() => {
    const slider = document.getElementById('slider');
    if (!slider) return;

    const AUTOPLAY_MS = 6000;
    const viewport = slider.querySelector('.slider__viewport');
    const track = slider.querySelector('.slider__track');
    const slides = Array.from(track.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider__arrow--prev');
    const nextBtn = slider.querySelector('.slider__arrow--next');
    const dotsBox = slider.querySelector('.slider__dots');
    const total = slides.length;

    slider.dataset.state = total === 0 ? 'empty' : total === 1 ? 'single' : 'multi';
    if (total < 2) return; // vacío o con una sola imagen: no hay nada que animar

    prevBtn.disabled = false;
    nextBtn.disabled = false;

    let index = 0;
    let timer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dots = slides.map((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', `${i + 1} de ${total}`);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); restart(); });
      dotsBox.appendChild(dot);
      return dot;
    });

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = `translateX(${-index * 100}%)`;
      slides.forEach((slide, k) => { slide.inert = k !== index; });
      dots.forEach((dot, k) => dot.setAttribute('aria-current', String(k === index)));
    }

    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      if (reduceMotion) return;
      stop();
      timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    };
    const restart = () => { stop(); start(); };

    prevBtn.addEventListener('click', () => { goTo(index - 1); restart(); });
    nextBtn.addEventListener('click', () => { goTo(index + 1); restart(); });

    // Pausa al pasar el mouse, al enfocar con teclado o al cambiar de pestaña
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    // Teclado: flechas izquierda / derecha
    slider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { goTo(index - 1); restart(); }
      if (event.key === 'ArrowRight') { goTo(index + 1); restart(); }
    });

    // Deslizar con el dedo (táctil)
    let startX = null;
    viewport.addEventListener('pointerdown', (event) => { startX = event.clientX; });
    viewport.addEventListener('pointerup', (event) => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) { goTo(index + (dx < 0 ? 1 : -1)); restart(); }
    });
    viewport.addEventListener('pointercancel', () => { startX = null; });

    goTo(0);
    start();
  })();

  /* ---------------------------------------------------------
     7. Tecla Escape: cierra todo
     --------------------------------------------------------- */
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeSearch();
    closeFab();
    closeA11y();
    closeAll();
  });
})();
