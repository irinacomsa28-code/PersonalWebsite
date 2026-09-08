//accessibility widget: floating button opens a panel with text size, contrast, underline-links and reduce-motion controls
(function () {
  const STORAGE_KEY = 'a11y-preferences';
  const TOGGLE_CLASSES = {
    contrast: 'a11y-contrast',
    'underline-links': 'a11y-underline-links',
    'reduce-motion': 'a11y-reduce-motion',
  };
  const TEXT_SIZE_CLASSES = ['', 'a11y-text-1', 'a11y-text-2'];

  const root = document.documentElement;
  const trigger = document.getElementById('a11yTrigger');
  const overlay = document.getElementById('a11yOverlay');
  if (!trigger || !overlay) return;

  const panel = document.getElementById('a11yPanel');
  const toggles = overlay.querySelectorAll('[data-a11y-toggle]');
  const closeEls = overlay.querySelectorAll('[data-a11y-close]');
  const actionEls = overlay.querySelectorAll('[data-a11y-action]');

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

  let state = Object.assign({ textSize: 0, contrast: false, 'underline-links': false, 'reduce-motion': false }, loadState());

  function applyState() {
    Object.keys(TOGGLE_CLASSES).forEach((key) => {
      root.classList.toggle(TOGGLE_CLASSES[key], !!state[key]);
    });
    toggles.forEach((el) => {
      el.checked = !!state[el.dataset.a11yToggle];
    });

    TEXT_SIZE_CLASSES.forEach((cls) => cls && root.classList.remove(cls));
    const sizeClass = TEXT_SIZE_CLASSES[state.textSize] || '';
    if (sizeClass) root.classList.add(sizeClass);
  }

  applyState();

  function openPanel() {
    overlay.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    const closeButton = overlay.querySelector('.a11y_panel_close');
    if (closeButton) closeButton.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closePanel() {
    overlay.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closePanel();
  }

  trigger.addEventListener('click', () => {
    if (overlay.hidden) openPanel();
    else closePanel();
  });

  closeEls.forEach((el) => el.addEventListener('click', closePanel));

  //stop clicks inside the panel from bubbling to the backdrop and closing it
  if (panel) panel.addEventListener('click', (e) => e.stopPropagation());

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
        state = { textSize: 0, contrast: false, 'underline-links': false, 'reduce-motion': false };
      }
      saveState(state);
      applyState();
    });
  });
})();
