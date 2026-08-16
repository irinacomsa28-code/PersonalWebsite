//single source of truth for the navbar, injected into every page's [data-navbar] placeholder.
//keeps the markup identical everywhere instead of duplicating it across 5 HTML files.
(function () {
  function navbarHTML(homeHref, sectionPrefix) {
    return `
    <nav class="navbar">
      <div class="navbar_container">

        <a href="index.html" class="navbar_logo">Irina Comsa</a>

        <div class="navbar_nav">
          <a class="nav_link" href="${homeHref}" data-target="home" role="button">Home</a>
          <a class="nav_link" href="${sectionPrefix}#about" data-target="about" role="button">About</a>
          <a class="nav_link" href="${sectionPrefix}#projects" data-target="projects" role="button">Projects</a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=irinacomsa28@gmail.com"
            target="_blank"
            role="button"
            aria-label="Contact"
            >Contact</a
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
  }
})();
