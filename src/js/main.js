const navLinks = document.querySelectorAll(".nav_link");
const sections = document.querySelectorAll(".section");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  let current = "";

  // Find which section is in view
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) {
      current = section.id;
    }
  });

  // Update classes
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });

  // Fade the navbar's background/blur in once the page has scrolled past the hero
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }
}, { passive: true });


//staggering the .appear animation onto every hero element marked .hero_animate,
//grouped by data-animate-step so elements sharing a step animate together
window.addEventListener('DOMContentLoaded', () => {
    const heroElements = document.querySelectorAll('.hero_animate');

    heroElements.forEach((el) => {
        const step = Number(el.dataset.animateStep || 0);
        setTimeout(() => {
            el.classList.add('appear');
        }, 600 * step);
    });
});



//animating about_imageAndtext on scroll into about section, and standing in for :hover on
//touch devices for the project teaser images (see the "html.touch" rules in layout.css)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.2 }); // Löst aus, wenn 20% des Bereichs sichtbar sind

const aboutImageAndText = document.querySelector('.about_imageAndText');
if (aboutImageAndText) observer.observe(aboutImageAndText);

//project cards get their own, more sensitive observer: a lower threshold (barely a sliver
//needs to show) plus a rootMargin that extends the trigger zone below the viewport, so the
//reveal fires just before a card is scrolled fully into view instead of only once it's there
const projectCards = document.querySelectorAll('.project_card');
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 150px 0px' });

projectCards.forEach((card) => projectObserver.observe(card));

//"hover: none" misfires on hybrid devices (e.g. a touchscreen laptop with a mouse also
//attached), so a real touchstart is a more reliable signal that this is a touch interaction
document.addEventListener('touchstart', function onFirstTouch() {
  document.documentElement.classList.add('touch');
  document.removeEventListener('touchstart', onFirstTouch);
}, { passive: true });

//tapping a card reveals it immediately instead of waiting on scroll position
projectCards.forEach((card) => card.addEventListener('touchstart', () => card.classList.add('is-visible'), { passive: true }));


//gives #about a "stuck" range long enough to reveal its own overflow before releasing
function sizeHeroAboutSpacer() {
    const about = document.querySelector('#about');
    const spacer = document.querySelector('.hero_about_spacer');
    if (!about || !spacer) return;
    spacer.style.height = '0px'; // reset before measuring
    const overflow = about.scrollHeight - window.innerHeight;
    spacer.style.height = Math.max(0, overflow) + 'px';
}
window.addEventListener('DOMContentLoaded', sizeHeroAboutSpacer);
window.addEventListener('load', sizeHeroAboutSpacer);
window.addEventListener('resize', sizeHeroAboutSpacer);


//native #hash anchor jumps miscalculate against our sticky sections, so scroll manually.
//sticky elements can also misreport their own rect while "stuck", so unstick before measuring
function trueOffsetTop(el) {
    const prevPosition = el.style.position;
    el.style.position = 'static';
    const top = el.getBoundingClientRect().top + window.scrollY;
    el.style.position = prevPosition;
    return top;
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: trueOffsetTop(target), behavior: 'smooth' });
    history.pushState(null, '', link.getAttribute('href'));
});

//same native-jump bug applies when a page loads directly with a #hash (e.g. a cross-page nav link)
window.addEventListener('load', () => {
    if (!window.location.hash) return;
    sizeHeroAboutSpacer();
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) window.scrollTo({ top: trueOffsetTop(target) });
});


//blocking chrome feature
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

//don't fight an intentional #about / #projects link (e.g. from another page's nav) with a forced scroll-to-top
if (!window.location.hash) {
    window.scrollTo(0, 0);

    window.addEventListener('load', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    });
}










