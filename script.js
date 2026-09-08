/* Katelin Hong - portfolio behaviour
   Loaded with `defer` from index.html, so the HTML is parsed before this runs. */

const header    = document.getElementById('header');
const ginkgoBtn = document.getElementById('ginkgoBtn');
const folderBtn = document.getElementById('folderBtn');
const projects  = document.getElementById('projects');

// Keep --header-h in sync with the real header height so scroll targets land correctly.
function measureHeader() {
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}

// Ginkgo -> top of the page (the description).
ginkgoBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
});

// Folder -> top of the projects section, just below the description.
folderBtn.addEventListener('click', () => {
  const top = projects.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
});

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Swap closed -> open folder once the projects section reaches the header,
// and show the header hairline once the page has scrolled at all.
function updateOnScroll() {
  const inProjects = projects.getBoundingClientRect().top <= header.offsetHeight + 8;

  folderBtn.classList.toggle('is-open', inProjects);
  folderBtn.setAttribute('aria-label', inProjects ? 'Projects section' : 'Go to projects');

  header.classList.toggle('is-stuck', window.scrollY > 4);
}

// Throttle the scroll handler to one update per animation frame.
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateOnScroll(); ticking = false; });
}, { passive: true });

window.addEventListener('resize', () => { measureHeader(); updateOnScroll(); });
window.addEventListener('load',   () => { measureHeader(); updateOnScroll(); });

measureHeader();
updateOnScroll();

/* ---------- quick view ---------- */
const quickview = document.getElementById('quickview');
const qvMedia   = document.getElementById('qvMedia');
const qvCopy    = document.getElementById('qvCopy');
const qvClose   = document.getElementById('qvClose');

document.querySelectorAll('.project__link').forEach((btn) => {
  btn.addEventListener('click', () => {
    const detail = btn.closest('.project').querySelector('.project__detail');
    if (!detail) return;

    // Pull this project's images and copy out of its <template>.
    const clone = detail.content.cloneNode(true);
    qvMedia.replaceChildren(...clone.querySelector('[data-qv-media]').children);
    qvCopy.replaceChildren(...clone.querySelector('[data-qv-copy]').children);

    qvMedia.scrollTop = 0;
    quickview.showModal();
    document.body.style.overflow = 'hidden';   // stop the page behind from scrolling
  });
});

qvClose.addEventListener('click', () => quickview.close());

// Fires for the X button and for Esc, which <dialog> handles for free.
quickview.addEventListener('close', () => {
  document.body.style.overflow = '';
});
