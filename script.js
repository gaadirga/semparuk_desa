// ======================================================
// NAVIGASI
// ======================================================

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

const activeButton =
  document.querySelector('#chapters button.active');

if (activeButton) {
  moveIndicator(activeButton);
}

window.addEventListener('resize', () => {
  const active =
    document.querySelector('#chapters button.active');

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

const galFilters =
  document.querySelectorAll('.gal-filter');

function replayGalleryAnimation() {

  galleryItems.forEach(item => {

    if (item.classList.contains('hidden-filter')) {
      return;
    }

    item.classList.remove('in-view');

  });

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      galleryItems.forEach(item => {

        if (item.classList.contains('hidden-filter')) {
          return;
        }

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

      item.classList.toggle(
        'hidden-filter',
        !show
      );

    });

    replayGalleryAnimation();

  });

});


// ======================================================
// ANIMASI GALERI
// ======================================================

if ('IntersectionObserver' in window) {

  const galObserver =
    new IntersectionObserver(
      entries => {

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

const lightbox =
  document.getElementById('lightbox');

const lbMedia =
  document.getElementById('lbMedia');

const lbTitle =
  document.getElementById('lbTitle');

const lbCat =
  document.getElementById('lbCat');

const lbNum =
  document.getElementById('lbNum');

let lbIndex = 0;


function visibleItems() {

  return galleryItems.filter(
    item =>
      !item.classList.contains('hidden-filter')
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

  const frame =
    item.querySelector('.frame');

  const category =
    item.querySelector('.cat');


  if (frame) {
    lbMedia.innerHTML = frame.innerHTML;
  }


  if (lbTitle) {
    lbTitle.textContent =
      item.dataset.title || '';
  }


  if (lbCat && category) {
    lbCat.textContent =
      category.textContent;
  }


  if (lbNum) {
    lbNum.textContent =
      item.dataset.num || '';
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


const lbClose =
  document.getElementById('lbClose');

const lbPrev =
  document.getElementById('lbPrev');

const lbNext =
  document.getElementById('lbNext');


if (lbClose) {
  lbClose.addEventListener(
    'click',
    closeLightbox
  );
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

  if (
    !lightbox ||
    !lightbox.classList.contains('open')
  ) {
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

// URL GOOGLE APPS SCRIPT BARU
const ASPIRATION_API =
  'https://script.google.com/macros/s/AKfycbz4VzpsodnRxXqajDnQe1L11PXqoUzkDg9QWILcnIkHMZWG8IEMH7ZXtNk9GWWgGCUTlg/exec';


const aspirationForm =
  document.getElementById('aspirationForm');

const formStatus =
  document.getElementById('formStatus');


// ======================================================
// KIRIM ASPIRASI
// ======================================================

if (aspirationForm) {

  aspirationForm.addEventListener(
    'submit',
    async function(e) {

      e.preventDefault();


      const nama =
        document
          .getElementById('nama')
          .value
          .trim();


      const email =
        document
          .getElementById('email')
          .value
          .trim();


      const pesan =
        document
          .getElementById('pesan')
          .value
          .trim();


      // Pastikan semua terisi
      if (!nama || !email || !pesan) {

        if (formStatus) {

          formStatus.textContent =
            'Mohon isi semua kolom terlebih dahulu.';

        }

        return;
      }


      if (formStatus) {

        formStatus.textContent =
          'Mengirim aspirasi...';

      }


      const submitButton =
        aspirationForm.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {
        submitButton.disabled = true;
      }


      try {

        await fetch(
          ASPIRATION_API,
          {
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
          }
        );


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

    }
  );

}


// ======================================================
// MENAMPILKAN ASPIRASI PUBLIK
// ======================================================

function createAspirationContainer() {

  const aspirationBox =
    document.querySelector('.aspiration-box');

  if (!aspirationBox) {
    return null;
  }


  let container =
    document.getElementById('aspirationList');


  if (container) {
    return container;
  }


  container =
    document.createElement('div');

  container.id = 'aspirationList';

  container.className =
    'wrap aspiration-list-box';


  aspirationBox.after(container);


  return container;

}


// ======================================================
// FORMAT TANGGAL
// ======================================================

function formatAspirationDate(value) {

  if (!value) {
    return '';
  }


  const date = new Date(value);


  if (isNaN(date.getTime())) {
    return String(value);
  }


  return date.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  );

}


// ======================================================
// RENDER ASPIRASI
// ======================================================

function renderPublicAspirations(data) {

  const container =
    createAspirationContainer();


  if (!container) {
    return;
  }


  container.innerHTML = '';


  const card =
    document.createElement('div');

  card.className = 'card';


  const role =
    document.createElement('div');

  role.className = 'role';

  role.textContent =
    'Aspirasi Masyarakat';


  const title =
    document.createElement('div');

  title.className = 'name';

  title.textContent =
    'Suara Warga Semparuk';


  card.appendChild(role);
  card.appendChild(title);


  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {

    const empty =
      document.createElement('p');

    empty.className = 'desc';

    empty.textContent =
      'Belum ada aspirasi yang dipublikasikan.';

    card.appendChild(empty);

    container.appendChild(card);

    return;
  }


  data.forEach(item => {

    const comment =
      document.createElement('div');

    comment.className =
      'aspiration-comment';


    const header =
      document.createElement('div');

    header.className =
      'aspiration-comment-header';


    const name =
      document.createElement('strong');

    name.textContent =
      item.nama || 'Warga Semparuk';


    const date =
      document.createElement('span');

    date.textContent =
      formatAspirationDate(
        item.tanggal
      );


    header.appendChild(name);
    header.appendChild(date);


    const message =
      document.createElement('p');

    message.textContent =
      item.pesan || '';


    comment.appendChild(header);
    comment.appendChild(message);


    card.appendChild(comment);

  });


  container.appendChild(card);

}


// ======================================================
// AMBIL ASPIRASI DARI GOOGLE APPS SCRIPT
// ======================================================
//
// Menggunakan JSONP agar bisa dibaca dari
// GitHub Pages tanpa masalah CORS.
// ======================================================

function loadPublicAspirations() {

  const container =
    createAspirationContainer();


  if (!container) {
    return;
  }


  container.innerHTML = '';


  const loading =
    document.createElement('div');

  loading.className = 'card';


  const loadingText =
    document.createElement('p');

  loadingText.className = 'desc';

  loadingText.textContent =
    'Memuat aspirasi warga...';


  loading.appendChild(loadingText);

  container.appendChild(loading);


  const callbackName =
    'aspirationCallback_' +
    Date.now();


  window[callbackName] =
    function(data) {

      renderPublicAspirations(data);

      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

    };


  const script =
    document.createElement('script');


  script.src =
    ASPIRATION_API +
    '?callback=' +
    encodeURIComponent(callbackName);


  script.onerror =
    function() {

      container.innerHTML = '';


      const errorCard =
        document.createElement('div');

      errorCard.className =
        'card';


      const errorText =
        document.createElement('p');

      errorText.className =
        'desc';

      errorText.textContent =
        'Aspirasi belum dapat dimuat. Silakan coba lagi nanti.';


      errorCard.appendChild(errorText);

      container.appendChild(errorCard);


      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

    };


  document.body.appendChild(script);

}


// Jalankan hanya di halaman Kontak
if (
  document.body.dataset.page === 'kontak'
) {

  loadPublicAspirations();

}
