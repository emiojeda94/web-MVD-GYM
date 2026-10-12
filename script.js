// Menú accesible para celulares y tablets.
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
function closeMenu() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); }
toggle.addEventListener('click', () => { const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
// Las próximas secciones todavía no están construidas: no se simulan reservas.
const notice = document.querySelector('#notice');
document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => { closeMenu(); document.querySelector('#notice-title').textContent = button.dataset.section; notice.showModal(); }));
notice.querySelectorAll('.close, .dismiss').forEach(button => button.addEventListener('click', () => notice.close()));
notice.addEventListener('click', event => { if (event.target === notice) { const rect = notice.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) notice.close(); } });

// Resalta la sección visible sin interferir con el menú móvil.
const navigationLinks = menu.querySelectorAll('a');
const sectionObserver = new IntersectionObserver(entries => {
 entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const target = entry.target.classList.contains('hero') ? '#inicio' : '#' + entry.target.id;
  navigationLinks.forEach(link => {
   const active = link.getAttribute('href') === target;
   link.classList.toggle('active', active);
   if (active) link.setAttribute('aria-current', 'location');
   else link.removeAttribute('aria-current');
  });
 });
}, { rootMargin: '-20% 0px -45% 0px', threshold: 0 });
document.querySelectorAll('.hero, #nosotros, #clases, #horarios, #planes, #contacto').forEach(section => sectionObserver.observe(section));

// Las flechas recorren las tarjetas; también se puede deslizar con el dedo.
const classTrack = document.querySelector('.class-track');
const classCards = [...classTrack.querySelectorAll('.class-card')];
const classCount = document.querySelector('.class-count');
function currentClass() {
 return classCards.reduce((best, card, index) => Math.abs(card.offsetLeft - classCards[0].offsetLeft - classTrack.scrollLeft) < Math.abs(classCards[best].offsetLeft - classCards[0].offsetLeft - classTrack.scrollLeft) ? index : best, 0);
}
function moveClass(direction) {
 const index = (currentClass() + direction + classCards.length) % classCards.length;
 classTrack.scrollTo({ left: classCards[index].offsetLeft - classCards[0].offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
document.querySelector('.class-prev').addEventListener('click', () => moveClass(-1));
document.querySelector('.class-next').addEventListener('click', () => moveClass(1));
classTrack.addEventListener('scroll', () => { classCount.textContent = String(currentClass() + 1).padStart(2, '0') + ' / 04'; }, { passive: true });


// Detalle del plan elegido y consulta de WhatsApp contextual.
const planDialog = document.querySelector('#plan-dialog');
const planDescriptions = {
 'BÁSICO': 'Una opción para entrenar en sala de musculación, con acceso a una sede y horarios completos.',
 'FULL': 'Combina sala de musculación y clases grupales, con acceso a todas las sedes y asesoramiento inicial.',
 'PREMIUM': 'Incluye clases grupales, una sesión de entrenamiento personalizado al mes y asesoramiento en nutrición, con acceso a todas las sedes.'
};
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
 const card = button.closest('.plan-card');
 const name = button.dataset.plan;
 document.querySelector('#plan-dialog-title').textContent = 'Plan ' + name;
 document.querySelector('.plan-dialog-price').textContent = card.querySelector('.plan-price').textContent;
 document.querySelector('.plan-dialog-description').textContent = planDescriptions[name];
 const benefits = document.querySelector('.plan-dialog-benefits');
 benefits.replaceChildren();
 card.querySelectorAll('li').forEach(item => { const li = document.createElement('li'); li.textContent = item.textContent; benefits.append(li); });
 document.querySelector('.plan-whatsapp').href = 'https://wa.me/59892345678?text=' + encodeURIComponent('Hola, quisiera consultar por el plan ' + name + ' de MVD GYM.');
 planDialog.showModal();
}));
planDialog.querySelector('.plan-close').addEventListener('click', () => planDialog.close());
planDialog.addEventListener('click', event => {
 if (event.target !== planDialog) return;
 const rect = planDialog.getBoundingClientRect();
 if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) planDialog.close();
});

// Carrusel de planes: flechas y desplazamiento táctil.
const plansTrack = document.querySelector('#plans-track');
const planCards = [...plansTrack.querySelectorAll('.plan-card')];
function currentPlan() {
 return planCards.reduce((best, card, index) => Math.abs(card.offsetLeft - planCards[0].offsetLeft - plansTrack.scrollLeft) < Math.abs(planCards[best].offsetLeft - planCards[0].offsetLeft - plansTrack.scrollLeft) ? index : best, 0);
}
function movePlan(direction) {
 const index = (currentPlan() + direction + planCards.length) % planCards.length;
 plansTrack.scrollTo({left: planCards[index].offsetLeft - planCards[0].offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}
document.querySelector('.plans-prev').addEventListener('click', () => movePlan(-1));
document.querySelector('.plans-next').addEventListener('click', () => movePlan(1));
plansTrack.addEventListener('scroll', () => { document.querySelector('.plans-count').textContent = String(currentPlan() + 1).padStart(2, '0') + ' / 03'; }, {passive: true});

// Horarios de la clase elegida en un diálogo accesible.
const classHoursDialog = document.querySelector('#class-hours-dialog');
document.querySelectorAll('[data-class-hours]').forEach(button => button.addEventListener('click', () => {
 document.querySelector('#class-hours-title').textContent = button.dataset.classHours;
 classHoursDialog.showModal();
}));
classHoursDialog.querySelectorAll('.hours-close').forEach(button => button.addEventListener('click', () => classHoursDialog.close()));
classHoursDialog.addEventListener('click', event => {
 if (event.target !== classHoursDialog) return;
 const rect = classHoursDialog.getBoundingClientRect();
 if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) classHoursDialog.close();
});

// El enlace de Instagram se completará con la cuenta del gimnasio.
document.querySelector('.instagram-pending').addEventListener('click', () => {
 document.querySelector('#notice-title').textContent = 'Instagram';
 notice.showModal();
});

// Aparición al entrar en pantalla, una sola vez y sin ocultar contenido al reducir movimiento.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
 const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   entry.target.classList.add('is-visible');
   revealObserver.unobserve(entry.target);
  });
 }, {threshold: 0.08});
 document.querySelectorAll('.hero-content, .about-copy, .about-image, .classes-heading, .class-card, .opening-heading, .opening-grid, .plans>h2, .plan-card, .contact>h2, .contact-details, .footer-copy, .footer-join, .footer-socials').forEach(element => {
  element.classList.add('reveal');
  revealObserver.observe(element);
 });
}
