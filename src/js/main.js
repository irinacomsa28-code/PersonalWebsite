//covers OS-level pref + the a11y panel's Reduce Motion toggle; checked live since JS-driven
//motion (setTimeout, scrollTo) doesn't stop just because a CSS rule says none
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
        || document.documentElement.classList.contains('a11y-reduce-motion');
}

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


//pre-allocates the heading's height to its tallest phrase, so cycling text doesn't reflow the page
function reserveHeroHeadingHeight(heading, target, phrases) {
    const heights = phrases.map((phrase) => {
        target.textContent = phrase;
        return heading.getBoundingClientRect().height;
    });
    target.textContent = '';
    heading.style.minHeight = Math.max(...heights) + 'px';
}

//cycles the hero heading's tail through phrases: type, pause, delete, next phrase, repeat
window.addEventListener('DOMContentLoaded', () => {
    const target = document.querySelector('[data-typewriter-phrases]');
    if (!target) return;

    const heading = target.closest('h1');
    const phrases = JSON.parse(target.dataset.typewriterPhrases);
    reserveHeroHeadingHeight(heading, target, phrases);
    window.addEventListener('resize', () => reserveHeroHeadingHeight(heading, target, phrases));

    if (prefersReducedMotion()) {
        target.textContent = phrases[0];
        target.classList.add('typewriter-done');
        return;
    }

    const typeSpeedMs = 55;
    const deleteSpeedMs = 30;
    const pauseAfterTypeMs = 1800;
    const pauseAfterDeleteMs = 400;

    let phraseIndex = 0;
    let charIndex = 0;

    //checked every tick so toggling Reduce Motion mid-animation stops it instead of finishing the cycle
    function stopIfMotionNowReduced() {
        if (!prefersReducedMotion()) return false;
        target.textContent = phrases[phraseIndex];
        target.classList.add('typewriter-done');
        return true;
    }

    function typeNextChar() {
        if (stopIfMotionNowReduced()) return;
        charIndex++;
        target.textContent = phrases[phraseIndex].slice(0, charIndex);
        if (charIndex < phrases[phraseIndex].length) {
            setTimeout(typeNextChar, typeSpeedMs);
        } else {
            setTimeout(deletePhrase, pauseAfterTypeMs);
        }
    }

    function deletePhrase() {
        if (stopIfMotionNowReduced()) return;
        charIndex--;
        target.textContent = phrases[phraseIndex].slice(0, charIndex);
        if (charIndex > 0) {
            setTimeout(deletePhrase, deleteSpeedMs);
        } else {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeNextChar, pauseAfterDeleteMs);
        }
    }

    typeNextChar();
});



//reveals about_imageAndText on scroll; also stands in for :hover on touch (see html.touch rules in layout.css)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.2 });

const aboutImageAndText = document.querySelector('.about_imageAndText');
if (aboutImageAndText) observer.observe(aboutImageAndText);

//project cards use a lower threshold + rootMargin below the viewport so the reveal fires just before they're fully in view
const projectCards = document.querySelectorAll('.project_card');
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 150px 0px' });

projectCards.forEach((card) => projectObserver.observe(card));

//"hover:none" misfires on hybrid touchscreen+mouse devices, so touchstart is the reliable signal
document.addEventListener('touchstart', function onFirstTouch() {
  document.documentElement.classList.add('touch');
  document.removeEventListener('touchstart', onFirstTouch);
}, { passive: true });

//tapping a card reveals it immediately instead of waiting on scroll position
projectCards.forEach((card) => card.addEventListener('touchstart', () => card.classList.add('is-visible'), { passive: true }));

//SWIPE NAVIGATION (project pages only): swipe left/right anywhere to go to the next/previous project
const sideNav = document.querySelector('.side-nav');
if (sideNav) {
  const prevLink = sideNav.querySelector('.side-nav_prev');
  const nextLink = sideNav.querySelector('.side-nav_next');
  const SWIPE_MIN_DISTANCE = 60; //px
  const SWIPE_MIN_RATIO = 1.5; //horizontal must dominate over vertical, so scrolling isn't mistaken for a swipe
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < SWIPE_MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * SWIPE_MIN_RATIO) return;
    const link = dx < 0 ? nextLink : prevLink;
    if (link) window.location.href = link.getAttribute('href');
  }, { passive: true });
}


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


//native #hash jumps miscalculate against sticky sections; unstick elements before measuring their rect
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
    window.scrollTo({ top: trueOffsetTop(target), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
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










