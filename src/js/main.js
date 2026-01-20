/* Main.js Behavior: smooth scrolling with navbar offset */

document.querySelectorAll('[data-scroll]').forEach(button => { //find all elements with data-scroll attribute  
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-scroll'); //where to scroll
    const target = document.querySelector(targetId); //find the target element

    if (!target) return;

    const offset = 64; // navbar height, so that content is not hidden behind it
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  });
});
