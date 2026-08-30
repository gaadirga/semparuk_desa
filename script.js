const currentPage = document.body.dataset.page;
const buttons = document.querySelectorAll('#chapters button');
const indicator = document.getElementById('navIndicator');

function moveIndicator(btn){
  if (!indicator || !btn) return;
  indicator.style.left = btn.offsetLeft + 'px';
  indicator.style.width = btn.offsetWidth + 'px';
}

buttons.forEach(btn => {
  const target = btn.dataset.target;
  btn.classList.toggle('active', target === currentPage);
  btn.addEventListener('click', () => {
    window.location.href = target === 'beranda' ? 'index.html' : target + '.html';
  });
});

const activeButton = document.querySelector('#chapters button.active');
if (activeButton) moveIndicator(activeButton);
window.addEventListener('resize', () => {
  const active = document.querySelector('#chapters button.active');
  if (active) moveIndicator(active);
});

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const galFilters = document.querySelectorAll('.gal-filter');

function replayGalleryAnimation(){
  galleryItems.forEach(item => {
    if(item.classList.contains('hidden-filter')) return;
    item.classList.remove('in-view');
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      galleryItems.forEach(item => {
        if(item.classList.contains('hidden-filter')) return;
        item.classList.add('in-view');
      });
    });
  });
}

galFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    galFilters.forEach(b => b.classList.toggle('active', b === btn));
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'semua' || item.dataset.cat === filter;
      item.classList.toggle('hidden-filter', !show);
    });
    replayGalleryAnimation();
  });
});

const galObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });
galleryItems.forEach(item => galObserver.observe(item));

const lightbox = document.getElementById('lightbox');
const lbMedia = document.getElementById('lbMedia');
const lbTitle = document.getElementById('lbTitle');
const lbCat = document.getElementById('lbCat');
const lbNum = document.getElementById('lbNum');
let lbIndex = 0;

function visibleItems(){ return galleryItems.filter(i => !i.classList.contains('hidden-filter')); }

function openLightbox(item){
  const items = visibleItems();
  lbIndex = items.indexOf(item);
  renderLightbox();
  lightbox.classList.add('open');
}

function renderLightbox(){
  const items = visibleItems();
  const item = items[lbIndex];
  if(!item) return;
  lbMedia.innerHTML = item.querySelector('.frame').innerHTML;
  lbTitle.textContent = item.dataset.title;
  lbCat.textContent = item.querySelector('.cat').textContent;
  lbNum.textContent = item.dataset.num;
}

function closeLightbox(){ lightbox.classList.remove('open'); }
function lbStep(dir){
  const items = visibleItems();
  lbIndex = (lbIndex + dir + items.length) % items.length;
  renderLightbox();
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', (e) => { if(e.key === 'Enter') openLightbox(item); });
});
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', (e) => { e.stopPropagation(); lbStep(-1); });
document.getElementById('lbNext').addEventListener('click', (e) => { e.stopPropagation(); lbStep(1); });
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') lbStep(-1);
  if(e.key === 'ArrowRight') lbStep(1);
});
  buttons.forEach(btn => btn.addEventListener('click', () => goTo(btn.dataset.target)));
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#','');
    if(order.includes(id)) goTo(id);
  });
  window.addEventListener('resize', () => {
    const active = document.querySelector('#chapters button.active');
    if(active) moveIndicator(active);
  });

  window.addEventListener('load', () => {
    const initial = window.location.hash.replace('#','');
    if(order.includes(initial)) goTo(initial);
    else moveIndicator(document.querySelector('#chapters button.active'));
  });
