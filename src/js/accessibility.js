//single source of truth for the a11y widget (trigger + dialog + filters + masks), injected per page like navbar.js/footer.js
(function () {
  //same convention as navbar.js/footer.js: fintalo.html <-> fintalo.de.html
  function currentLang() {
    return window.location.pathname.split('/').pop().endsWith('.de.html') ? 'de' : 'en';
  }

  const STRINGS = {
    en: {
      triggerLabel: 'Accessibility options',
      panelTitle: 'Accessibility Menu',
      closeLabel: 'Close accessibility menu',
      textSize: 'Text Size',
      decreaseLabel: 'Decrease text size',
      increaseLabel: 'Increase text size',
      textSizeLevels: ['Normal', 'Large', 'Larger'],
      highContrast: 'High Contrast',
      grayscale: 'Grayscale',
      colorVision: 'Color Vision',
      colorVisionOptions: {
        none: 'None',
        protanopia: 'Protanopia (red-green)',
        deuteranopia: 'Deuteranopia (red-green)',
        tritanopia: 'Tritanopia (blue-yellow)',
      },
      underlineLinks: 'Underline Links',
      highlightTitles: 'Highlight Titles',
      dyslexiaFont: 'Dyslexia-Friendly Font',
      bigCursor: 'Big Cursor',
      readingFocus: 'Reading Focus',
      reduceMotion: 'Reduce Motion',
      resetAll: 'Reset All',
    },
    de: {
      triggerLabel: 'Barrierefreiheit-Optionen',
      panelTitle: 'Barrierefreiheit-Menü',
      closeLabel: 'Barrierefreiheit-Menü schließen',
      textSize: 'Textgröße',
      decreaseLabel: 'Textgröße verkleinern',
      increaseLabel: 'Textgröße vergrößern',
      textSizeLevels: ['Normal', 'Groß', 'Größer'],
      highContrast: 'Hoher Kontrast',
      grayscale: 'Graustufen',
      colorVision: 'Farbsehschwäche',
      colorVisionOptions: {
        none: 'Keine',
        protanopia: 'Protanopie (Rot-Grün)',
        deuteranopia: 'Deuteranopie (Rot-Grün)',
        tritanopia: 'Tritanopie (Blau-Gelb)',
      },
      underlineLinks: 'Links unterstreichen',
      highlightTitles: 'Überschriften hervorheben',
      dyslexiaFont: 'Legasthenie-freundliche Schrift',
      bigCursor: 'Großer Mauszeiger',
      readingFocus: 'Lesefokus',
      reduceMotion: 'Bewegung reduzieren',
      resetAll: 'Alles zurücksetzen',
    },
  };

  //separate from panelHTML(): this must land inside .social-links as a flex child for gap/alignment; the dialog is page-level
  function triggerHTML(t) {
    return `
    <button
      type="button"
      class="accessibility_button"
      aria-label="${t.triggerLabel}"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="a11yPanel"
      id="a11yTrigger"
    >
      <span class="accessibility_icon"></span>
    </button>
    `;
  }

  function panelHTML(t) {
    return `
    <!-- native <dialog>: showModal() gives focus trap, Escape-close, top-layer stacking, focus-return for free -->
    <dialog class="a11y_panel" id="a11yPanel" aria-labelledby="a11yPanelTitle">
      <div class="a11y_panel_header">
        <p id="a11yPanelTitle" class="a11y_panel_title">${t.panelTitle}</p>
        <button type="button" class="a11y_panel_close" aria-label="${t.closeLabel}">&times;</button>
      </div>

      <div class="a11y_panel_body">
        <div class="a11y_option_row">
          <span>${t.textSize}</span>
          <div class="a11y_stepper">
            <button type="button" class="a11y_stepper_button" data-a11y-action="text-decrease" aria-label="${t.decreaseLabel}">A&minus;</button>
            <span class="a11y_stepper_value" id="a11yTextSizeLabel" aria-live="polite">${t.textSizeLevels[0]}</span>
            <button type="button" class="a11y_stepper_button" data-a11y-action="text-increase" aria-label="${t.increaseLabel}">A&plus;</button>
          </div>
        </div>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.highContrast}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="contrast" />
        </label>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.grayscale}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="grayscale" />
        </label>

        <div class="a11y_option_row">
          <label for="a11yColorVision">${t.colorVision}</label>
          <select class="a11y_select" id="a11yColorVision" data-a11y-select="color-vision">
            <option value="none">${t.colorVisionOptions.none}</option>
            <option value="protanopia">${t.colorVisionOptions.protanopia}</option>
            <option value="deuteranopia">${t.colorVisionOptions.deuteranopia}</option>
            <option value="tritanopia">${t.colorVisionOptions.tritanopia}</option>
          </select>
        </div>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.underlineLinks}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="underline-links" />
        </label>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.highlightTitles}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="highlight-titles" />
        </label>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.dyslexiaFont}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="dyslexia-font" />
        </label>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.bigCursor}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="big-cursor" />
        </label>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.readingFocus}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="reading-focus" />
        </label>

        <label class="a11y_option_row a11y_toggle_row">
          <span>${t.reduceMotion}</span>
          <input type="checkbox" class="a11y_toggle" data-a11y-toggle="reduce-motion" />
        </label>

        <button type="button" class="a11y_reset_button" data-a11y-action="reset">${t.resetAll}</button>
      </div>
    </dialog>

    <!-- real daltonization matrices (Machado/Fidaner RGB→LMS), not simulation — corrects colors instead of mimicking what users can't see -->
    <svg aria-hidden="true" focusable="false" style="position: absolute; width: 0; height: 0; overflow: hidden">
      <defs>
        <filter id="a11yProtanopiaFilter" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0
                  0.5089 0.4911 0 0 0
                  0.6173 -0.6173 1 0 0
                  0 0 0 1 0" />
        </filter>
        <filter id="a11yDeuteranopiaFilter" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0
                  0.2023 0.7977 0 0 0
                  0.5174 -0.5174 1 0 0
                  0 0 0 1 0" />
        </filter>
        <filter id="a11yTritanopiaFilter" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0
                  -0.1385 1.1385 0 0 0
                  3.3656 -3.3656 1 0 0
                  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>

    <!-- reading-focus overlay: two masks that track the mouse, keeping a horizontal
      band clear and dimming/blurring everything above and below it -->
    <div class="a11y_focus_mask a11y_focus_mask_top" id="a11yFocusMaskTop" hidden></div>
    <div class="a11y_focus_mask a11y_focus_mask_bottom" id="a11yFocusMaskBottom" hidden></div>
    `;
  }

  const triggerPlaceholder = document.querySelector('[data-accessibility-trigger]');
  const panelPlaceholder = document.querySelector('[data-accessibility-panel]');
  if (!triggerPlaceholder || !panelPlaceholder) return;
  const t = STRINGS[currentLang()];
  triggerPlaceholder.outerHTML = triggerHTML(t);
  panelPlaceholder.outerHTML = panelHTML(t);

  const STORAGE_KEY = 'a11y-preferences';

  //one class per toggle; contrast/grayscale/color-vision handled separately in applyFilters() since they all need `filter` (classes would drop two)
  const TOGGLE_CLASSES = {
    'underline-links': 'a11y-underline-links',
    'reduce-motion': 'a11y-reduce-motion',
    'highlight-titles': 'a11y-highlight-titles',
    'dyslexia-font': 'a11y-dyslexia-font',
    'big-cursor': 'a11y-big-cursor',
  };

  //daltonization filters defined inline above; see that comment for how the matrices were derived
  const COLOR_VISION_FILTERS = {
    protanopia: 'url(#a11yProtanopiaFilter)',
    deuteranopia: 'url(#a11yDeuteranopiaFilter)',
    tritanopia: 'url(#a11yTritanopiaFilter)',
  };

  const TEXT_SIZE_CLASSES = ['', 'a11y-text-1', 'a11y-text-2'];
  const FOCUS_BAND_HALF_HEIGHT = 60; //px above/below the cursor that stays clear

  const DEFAULT_STATE = {
    textSize: 0,
    contrast: false,
    grayscale: false,
    'color-vision': 'none',
    'underline-links': false,
    'highlight-titles': false,
    'dyslexia-font': false,
    'big-cursor': false,
    'reading-focus': false,
    'reduce-motion': false,
  };

  const root = document.documentElement;
  const trigger = document.getElementById('a11yTrigger');
  const dialog = document.getElementById('a11yPanel');
  if (!trigger || !dialog) return;

  const toggles = dialog.querySelectorAll('[data-a11y-toggle]');
  const selects = dialog.querySelectorAll('[data-a11y-select]');
  const actionEls = dialog.querySelectorAll('[data-a11y-action]');
  const closeButton = dialog.querySelector('.a11y_panel_close');
  const textSizeLabel = document.getElementById('a11yTextSizeLabel');
  const decreaseButton = dialog.querySelector('[data-a11y-action="text-decrease"]');
  const increaseButton = dialog.querySelector('[data-a11y-action="text-increase"]');
  const focusMaskTop = document.getElementById('a11yFocusMaskTop');
  const focusMaskBottom = document.getElementById('a11yFocusMaskBottom');
  const contrastQuery = window.matchMedia('(prefers-contrast: more)');

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /*private-browsing/storage-blocked — preferences just won't persist across reloads*/
    }
  }

  let state = Object.assign({}, DEFAULT_STATE, loadState());

  //composes contrast+grayscale+color-vision into one inline filter so any combination can be active; falls back to the site's @media(prefers-contrast) rule when nothing is on
  function applyFilters() {
    const filters = [];
    if (state.contrast || contrastQuery.matches) filters.push('contrast(1.5) brightness(1.05)');
    if (state.grayscale) filters.push('grayscale(1)');
    if (COLOR_VISION_FILTERS[state['color-vision']]) filters.push(COLOR_VISION_FILTERS[state['color-vision']]);
    if (filters.length) {
      root.style.filter = filters.join(' ');
    } else {
      root.style.removeProperty('filter');
    }
  }

  function updateTextSizeUI() {
    if (textSizeLabel) textSizeLabel.textContent = t.textSizeLevels[state.textSize];
    if (decreaseButton) decreaseButton.disabled = state.textSize === 0;
    if (increaseButton) increaseButton.disabled = state.textSize === TEXT_SIZE_CLASSES.length - 1;
  }

  function positionFocusMasks(y) {
    const clampedY = Math.max(0, Math.min(y, window.innerHeight));
    focusMaskTop.style.height = Math.max(0, clampedY - FOCUS_BAND_HALF_HEIGHT) + 'px';
    focusMaskBottom.style.height = Math.max(0, window.innerHeight - clampedY - FOCUS_BAND_HALF_HEIGHT) + 'px';
  }

  function onFocusMaskMouseMove(e) {
    positionFocusMasks(e.clientY);
  }

  //touchscreens never fire mousemove, so a dragging finger drives the band instead
  function onFocusMaskTouchMove(e) {
    if (e.touches.length) positionFocusMasks(e.touches[0].clientY);
  }

  function updateReadingFocus() {
    if (!focusMaskTop || !focusMaskBottom) return;
    const active = !!state['reading-focus'];
    focusMaskTop.hidden = !active;
    focusMaskBottom.hidden = !active;
    if (active) {
      positionFocusMasks(window.innerHeight / 2);
      document.addEventListener('mousemove', onFocusMaskMouseMove);
      document.addEventListener('touchmove', onFocusMaskTouchMove, { passive: true });
    } else {
      document.removeEventListener('mousemove', onFocusMaskMouseMove);
      document.removeEventListener('touchmove', onFocusMaskTouchMove);
    }
  }

  function applyState() {
    Object.keys(TOGGLE_CLASSES).forEach((key) => {
      root.classList.toggle(TOGGLE_CLASSES[key], !!state[key]);
    });
    toggles.forEach((el) => {
      el.checked = !!state[el.dataset.a11yToggle];
    });
    selects.forEach((el) => {
      el.value = state[el.dataset.a11ySelect];
    });

    TEXT_SIZE_CLASSES.forEach((cls) => cls && root.classList.remove(cls));
    const sizeClass = TEXT_SIZE_CLASSES[state.textSize];
    if (sizeClass) root.classList.add(sizeClass);

    applyFilters();
    updateTextSizeUI();
    updateReadingFocus();
  }

  applyState();
  //keeps the composed filter in sync if the OS contrast pref changes while the tab is open
  contrastQuery.addEventListener('change', applyFilters);

  trigger.addEventListener('click', () => {
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
  });

  //fires on every close path (close(), Escape/cancel) to keep aria-expanded in sync
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
  });

  if (closeButton) closeButton.addEventListener('click', () => dialog.close());

  //click on the backdrop (the dialog's own box, outside its content) closes it
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  toggles.forEach((el) => {
    el.addEventListener('change', () => {
      state[el.dataset.a11yToggle] = el.checked;
      saveState(state);
      applyState();
    });
  });

  selects.forEach((el) => {
    el.addEventListener('change', () => {
      state[el.dataset.a11ySelect] = el.value;
      saveState(state);
      applyState();
    });
  });

  actionEls.forEach((el) => {
    el.addEventListener('click', () => {
      const action = el.dataset.a11yAction;
      if (action === 'text-increase') {
        state.textSize = Math.min(state.textSize + 1, TEXT_SIZE_CLASSES.length - 1);
      } else if (action === 'text-decrease') {
        state.textSize = Math.max(state.textSize - 1, 0);
      } else if (action === 'reset') {
        state = Object.assign({}, DEFAULT_STATE);
      }
      saveState(state);
      applyState();
    });
  });
})();
