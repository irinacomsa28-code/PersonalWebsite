//single source of truth for the navbar, injected into every page's [data-navbar] placeholder.
//keeps the markup identical everywhere instead of duplicating it across 5 HTML files.
(function () {
  //language pages are named as siblings, e.g. fintalo.html <-> fintalo.de.html,
  //so the DE/EN switch and nav labels can be derived from the URL alone
  function currentLangInfo() {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    const isDe = file.endsWith('.de.html');
    const base = isDe ? file.slice(0, -'.de.html'.length) : file.replace(/\.html$/, '');
    return { lang: isDe ? 'de' : 'en', enHref: `${base}.html`, deHref: `${base}.de.html` };
  }

  const NAV_LABELS = {
    en: { home: 'Home', about: 'About', projects: 'Projects', contact: 'Contact' },
    de: { home: 'Start', about: 'Über mich', projects: 'Projekte', contact: 'Kontakt' },
  };

  function navbarHTML(homeHref, sectionPrefix) {
    const { lang, enHref, deHref } = currentLangInfo();
    const t = NAV_LABELS[lang];
    return `
    <nav class="navbar">
      <div class="navbar_container">

        <a href="index.html" class="navbar_logo">Irina Comsa</a>

        <button type="button" class="navbar_toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <div class="navbar_nav">
          <a class="nav_link" href="${homeHref}" data-target="home">${t.home}</a>
          <a class="nav_link" href="${sectionPrefix}#about" data-target="about">${t.about}</a>
          <a class="nav_link" href="${sectionPrefix}#projects" data-target="projects">${t.projects}</a>
          <div class="lang_switch" role="group" aria-label="Language">
            <a href="${enHref}" class="lang_link${lang === 'en' ? ' active' : ''}"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
            <span class="lang_divider" aria-hidden="true">|</span>
            <a href="${deHref}" class="lang_link${lang === 'de' ? ' active' : ''}"${lang === 'de' ? ' aria-current="page"' : ''}>DE</a>
          </div>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=irinacomsa28@gmail.com"
            target="_blank"
            aria-label="${t.contact}"
            >${t.contact}</a
          >
        </div>
      </div>
    </nav>
    `;
  }

  const placeholder = document.querySelector('[data-navbar]');
  if (placeholder) {
    const homeHref = placeholder.dataset.homeHref || 'index.html';
    //on index.html itself, About/Projects scroll in-page (#about); on every other page
    //they need to go back to index.html first (index.html#about), or clicking does nothing
    const sectionPrefix = homeHref === '#hero' ? '' : 'index.html';
    placeholder.outerHTML = navbarHTML(homeHref, sectionPrefix);

    //mobile hamburger toggle: opens/closes the dropdown, closes again once a link is picked
    const toggle = document.querySelector('.navbar_toggle');
    const nav = document.querySelector('.navbar_nav');
    if (toggle && nav) {
      const setOpen = (open) => {
        nav.classList.toggle('open', open);
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('nav-open', open);
      };

      toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
      nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));

      //switching from mobile to desktop width shouldn't leave the dropdown stuck open
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setOpen(false);
      });
    }
  }
})();
