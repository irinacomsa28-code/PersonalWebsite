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