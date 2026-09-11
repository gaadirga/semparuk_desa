const currentPage = document.body.dataset.page;
const buttons = document.querySelectorAll('#chapters button');
const indicator = document.getElementById('navIndicator');

function moveIndicator(btn) {
  if (!indicator || !btn) return;

  indicator.style.left = btn.offsetLeft + 'px';
  indicator.style.width = btn.offsetWidth + 'px';
}

buttons.forEach(btn => {
  const target = btn.dataset.target;

  btn.classList.toggle('active', target === currentPage);

  btn.addEventListener('click', () => {
    window.location.href =
      target === 'beranda' ? 'index.html' : target + '.html';
  });
});

const activeButton = document.querySelector('#chapters button.active');

if (activeButton) {
  moveIndicator(activeButton);
}

window.addEventListener('resize', () => {
  const active = document.querySelector('#chapters button.active');

  if (active) {
    moveIndicator(active);
  }
});


// ======================================================
// GALERI
// ======================================================

const galleryItems = Array.from(
  document.querySelectorAll('.gallery-item')
);

const galFilters = document.querySelectorAll('.gal-filter');

function replayGalleryAnimation() {
  galleryItems.forEach(item => {
    if (item.classList.contains('hidden-filter')) return;

    item.classList.remove('in-view');
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      galleryItems.forEach(item => {
        if (item.classList.contains('hidden-filter')) return;

        item.classList.add('in-view');
      });
    });
  });
}

galFilters.forEach(btn => {
  btn.addEventListener('click', () => {

    galFilters.forEach(b => {
      b.classList.toggle('active', b === btn);
    });

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const show =
        filter === 'semua' ||
        item.dataset.cat === filter;

      item.classList.toggle('hidden-filter', !show);
    });

    replayGalleryAnimation();
  });
});


// ======================================================
// ANIMASI GALERI
// ======================================================

if ('IntersectionObserver' in window) {

  const galObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }

      });

    },
    {
      threshold: 0.15
    }
  );

  galleryItems.forEach(item => {
    galObserver.observe(item);
  });

}


// ======================================================
// LIGHTBOX GALERI
// ======================================================

const lightbox = document.getElementById('lightbox');
const lbMedia = document.getElementById('lbMedia');
const lbTitle = document.getElementById('lbTitle');
const lbCat = document.getElementById('lbCat');
const lbNum = document.getElementById('lbNum');

let lbIndex = 0;

function visibleItems() {
  return galleryItems.filter(
    item => !item.classList.contains('hidden-filter')
  );
}

function openLightbox(item) {

  if (!lightbox) return;

  const items = visibleItems();

  lbIndex = items.indexOf(item);

  renderLightbox();

  lightbox.classList.add('open');
}

function renderLightbox() {

  if (!lightbox || !lbMedia) return;

  const items = visibleItems();
  const item = items[lbIndex];

  if (!item) return;

  const frame = item.querySelector('.frame');
  const category = item.querySelector('.cat');

  if (frame) {
    lbMedia.innerHTML = frame.innerHTML;
  }

  if (lbTitle) {
    lbTitle.textContent = item.dataset.title || '';
  }

  if (lbCat && category) {
    lbCat.textContent = category.textContent;
  }

  if (lbNum) {
    lbNum.textContent = item.dataset.num || '';
  }
}

function closeLightbox() {

  if (!lightbox) return;

  lightbox.classList.remove('open');
}

function lbStep(dir) {

  const items = visibleItems();

  if (!items.length) return;

  lbIndex =
    (lbIndex + dir + items.length) %
    items.length;

  renderLightbox();
}

galleryItems.forEach(item => {

  item.addEventListener('click', () => {
    openLightbox(item);
  });

  item.setAttribute('tabindex', '0');

  item.addEventListener('keydown', e => {

    if (e.key === 'Enter') {
      openLightbox(item);
    }

  });

});

const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

if (lbClose) {
  lbClose.addEventListener('click', closeLightbox);
}

if (lbPrev) {
  lbPrev.addEventListener('click', e => {
    e.stopPropagation();
    lbStep(-1);
  });
}

if (lbNext) {
  lbNext.addEventListener('click', e => {
    e.stopPropagation();
    lbStep(1);
  });
}

if (lightbox) {

  lightbox.addEventListener('click', e => {

    if (e.target === lightbox) {
      closeLightbox();
    }

  });

}

document.addEventListener('keydown', e => {

  if (!lightbox || !lightbox.classList.contains('open')) {
    return;
  }

  if (e.key === 'Escape') {
    closeLightbox();
  }

  if (e.key === 'ArrowLeft') {
    lbStep(-1);
  }

  if (e.key === 'ArrowRight') {
    lbStep(1);
  }

});


// ======================================================
// ASPIRASI MASYARAKAT
// ======================================================

// URL Google Apps Script Web App
const ASPIRATION_API =
  'https://script.google.com/macros/s/AKfycbyLpn-g_VQ292P2DmpztwZ2hf5LsjKDC2El39yK09A8yKbqMKR3JOD0nd6Nlrh1KHxYEA/exec';


const aspirationForm =
  document.getElementById('aspirationForm');

const formStatus =
  document.getElementById('formStatus');


if (aspirationForm) {

  aspirationForm.addEventListener('submit', async function(e) {

    e.preventDefault();


    const nama =
      document.getElementById('nama').value.trim();

    const email =
      document.getElementById('email').value.trim();

    const pesan =
      document.getElementById('pesan').value.trim();


    // Pastikan semua data terisi
    if (!nama || !email || !pesan) {

      if (formStatus) {
        formStatus.textContent =
          'Mohon isi semua kolom terlebih dahulu.';
      }

      return;
    }


    // Tampilkan status
    if (formStatus) {
      formStatus.textContent =
        'Mengirim aspirasi...';
    }


    // Cari tombol submit
    const submitButton =
      aspirationForm.querySelector(
        'button[type="submit"]'
      );


    if (submitButton) {
      submitButton.disabled = true;
    }


    try {

      await fetch(ASPIRATION_API, {

        method: 'POST',

        mode: 'no-cors',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body: JSON.stringify({

          nama: nama,
          email: email,
          pesan: pesan

        })

      });


      // Karena menggunakan no-cors,
      // browser tidak bisa membaca respons Apps Script.
      // Jadi kita tampilkan pesan berhasil setelah request terkirim.

      if (formStatus) {

        formStatus.textContent =
          'Aspirasi berhasil dikirim. Terima kasih!';

      }


      aspirationForm.reset();


    } catch (error) {

      console.error(
        'Gagal mengirim aspirasi:',
        error
      );


      if (formStatus) {

        formStatus.textContent =
          'Aspirasi gagal dikirim. Silakan coba lagi.';

      }

    }


    if (submitButton) {
      submitButton.disabled = false;
    }

  });

}
