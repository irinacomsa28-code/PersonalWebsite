//accessibility widget: floating button opens a <dialog> with text size, contrast,
//grayscale, underline-links, highlight-titles, dyslexia-friendly font, big cursor and
//reduce-motion controls. showModal()/close() give us a real focus trap, Escape-to-close
//and focus-return-to-trigger natively — no need to hand-roll them.
(function () {
  const STORAGE_KEY = 'a11y-preferences';

  //simple one-class-per-toggle state. contrast/grayscale are handled separately in
  //applyFilters() below since they both need the `filter` property — two competing
  //classes on the same element would silently drop one instead of combining.
  const TOGGLE_CLASSES = {
    'underline-links': 'a11y-underline-links',
    'reduce-motion': 'a11y-reduce-motion',
    'highlight-titles': 'a11y-highlight-titles',
    'dyslexia-font': 'a11y-dyslexia-font',
    'big-cursor': 'a11y-big-cursor',
  };

  const TEXT_SIZE_CLASSES = ['', 'a11y-text-1', 'a11y-text-2'];
  const TEXT_SIZE_LABELS = ['Normal', 'Large', 'Larger'];

  const DEFAULT_STATE = {
    textSize: 0,
    contrast: false,
    grayscale: false,
    'underline-links': false,
    'highlight-titles': false,
    'dyslexia-font': false,
    'big-cursor': false,
    'reduce-motion': false,
  };

  const root = document.documentElement;
  const trigger = document.getElementById('a11yTrigger');
  const dialog = document.getElementById('a11yPanel');
  if (!trigger || !dialog) return;

  const toggles = dialog.querySelectorAll('[data-a11y-toggle]');
  const actionEls = dialog.querySelectorAll('[data-a11y-action]');
  const closeButton = dialog.querySelector('.a11y_panel_close');
  const textSizeLabel = document.getElementById('a11yTextSizeLabel');
  const decreaseButton = dialog.querySelector('[data-a11y-action="text-decrease"]');
  const increaseButton = dialog.querySelector('[data-a11y-action="text-increase"]');
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

  //composes contrast + grayscale into one inline filter so both can be active at once.
  //Falls back to nothing (letting the site's own @media (prefers-contrast: more) rule
  //take over) unless a toggle is explicitly on or the OS already prefers more contrast.
  function applyFilters() {
    const filters = [];
    if (state.contrast || contrastQuery.matches) filters.push('contrast(1.5) brightness(1.05)');
    if (state.grayscale) filters.push('grayscale(1)');
    if (filters.length) {
      root.style.filter = filters.join(' ');
    } else {
      root.style.removeProperty('filter');
    }
  }

  function updateTextSizeUI() {
    if (textSizeLabel) textSizeLabel.textContent = TEXT_SIZE_LABELS[state.textSize];
    if (decreaseButton) decreaseButton.disabled = state.textSize === 0;
    if (increaseButton) increaseButton.disabled = state.textSize === TEXT_SIZE_CLASSES.length - 1;
  }

  function applyState() {
    Object.keys(TOGGLE_CLASSES).forEach((key) => {
      root.classList.toggle(TOGGLE_CLASSES[key], !!state[key]);
    });
    toggles.forEach((el) => {
      el.checked = !!state[el.dataset.a11yToggle];
    });

    TEXT_SIZE_CLASSES.forEach((cls) => cls && root.classList.remove(cls));
    const sizeClass = TEXT_SIZE_CLASSES[state.textSize];
    if (sizeClass) root.classList.add(sizeClass);

    applyFilters();
    updateTextSizeUI();
  }

  applyState();
  //OS-level contrast preference can change while the tab is open — keep the composed
  //filter in sync even if the user never touches the panel
  contrastQuery.addEventListener('change', applyFilters);

  trigger.addEventListener('click', () => {
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
  });

  //fires on every close path — close(), Escape/cancel — so this is the one place
  //that needs to keep the trigger's aria-expanded in sync
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
