const navLinks = document.querySelectorAll(".nav_link");
const sections = document.querySelectorAll(".section");

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
}, { passive: true });


//animating headlines on page load
window.addEventListener('DOMContentLoaded', () => {
    const sections = [
        document.querySelector('.hero_headlines h1'),
        document.querySelector('.hero_headlines h3'),
        document.querySelector('.hero_image'),
        document.querySelector('.hero_text h4'),
        document.querySelector('.hero_attention'),
    ];

    sections.forEach((el, index) => {
        if(el) {
            setTimeout(() => {
                el.classList.add('appear');
            }, 600 * index); 
        }
    });
});



//animating about_imageAndtext on scroll into about section
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.2 }); // Löst aus, wenn 20% des Bereichs sichtbar sind

observer.observe(document.querySelector('.about_imageAndText'));


//blocking chrome feature
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
});