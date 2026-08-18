//single source of truth for the footer, injected into every page's [data-footer] placeholder
(function () {
  //same convention as navbar.js: fintalo.html <-> fintalo.de.html
  function currentLang() {
    return window.location.pathname.split('/').pop().endsWith('.de.html') ? 'de' : 'en';
  }

  const FOOTER_COPY = {
    en: {
      heading: "You've hit the footer, thanks for stopping by!",
      sub: 'Feel free to reach out for collaborations, questions or just a friendly hello.',
      copyright: 'Copyright 2026 Irina Comsa. All rights reserved.',
      backToTop: 'Back to Top',
    },
    de: {
      heading: 'Du hast den Footer erreicht, danke fürs Vorbeischauen!',
      sub: 'Melde dich gerne für Kooperationen, Fragen oder einfach nur zum Hallosagen.',
      copyright: 'Copyright 2026 Irina Comsa. Alle Rechte vorbehalten.',
      backToTop: 'Nach oben',
    },
  };

  function footerHTML() {
    const t = FOOTER_COPY[currentLang()];
    return `
    <section id="footer" class="footer_section">
      <div class="footer_home_container">
        <div class="footer_home_content">
          <img src="public/assets/icons/footer_icon.svg" alt="" class="footer_home_icon" />
          <div class="footer_home_text">
            <h3>${t.heading}</h3>
            <h4>${t.sub}</h4>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=irinacomsa28@gmail.com"
              target="_blank"
              class="footer_home_email"
              >irinacomsa28@gmail.com</a
            >
          </div>
        </div>

        <div class="footer_home_bottom">
          <p class="footer_home_copyright">${t.copyright}</p>
          <a href="#hero" class="footer_home_backtotop">${t.backToTop}</a>
        </div>
      </div>
    </section>
    `;
  }

  const placeholder = document.querySelector('[data-footer]');
  if (placeholder) {
    placeholder.outerHTML = footerHTML();
  }
})();
