//single source of truth for the footer, injected into every page's [data-footer] placeholder
(function () {
  function footerHTML() {
    return `
    <section id="footer" class="footer_section">
      <div class="footer_home_container">
        <div class="footer_home_content">
          <img src="public/assets/icons/footer_icon.svg" alt="" class="footer_home_icon" />
          <div class="footer_home_text">
            <h3>You've hit the footer, thanks for stopping by!</h3>
            <h4>Feel free to reach out for collaborations, questions or just a friendly hello.</h4>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=irinacomsa28@gmail.com"
              target="_blank"
              class="footer_home_email"
              >irinacomsa28@gmail.com</a
            >
          </div>
        </div>

        <div class="footer_home_bottom">
          <p class="footer_home_copyright">Copyright 2026 Irina Comsa. All rights reserved.</p>
          <a href="#hero" class="footer_home_backtotop">Back to Top</a>
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
