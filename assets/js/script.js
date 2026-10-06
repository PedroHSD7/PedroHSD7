const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const backTop = document.getElementById('backTop');
const header = document.querySelector('.site-header');
const progress = document.getElementById('scrollProgress');
const navLinks = [...document.querySelectorAll('#mainNav a[data-section]')];

// Menu mobile
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Rolagem suave com compensação do cabeçalho fixo.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    const offset = (header?.offsetHeight || 82) + 12;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });

    if (mainNav?.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }

    history.replaceState(null, '', id);
  });
});

// Animações de entrada
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Estado do cabeçalho, botão voltar ao topo e barra de progresso.
function updateScrollUI() {
  const scrollY = window.scrollY;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const percentage = max > 0 ? (scrollY / max) * 100 : 0;

  header?.classList.toggle('scrolled', scrollY > 24);
  backTop?.classList.toggle('show', scrollY > 500);
  if (progress) progress.style.width = `${percentage}%`;
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

// Botão de voltar ao topo: funciona mesmo sem depender do hash da URL.
backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#top');
});

// Destaque automático do item do menu conforme a seção visível.
const sections = navLinks
  .map(link => document.getElementById(link.dataset.section))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === entry.target.id);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
