/* ═══════════════════════════════════════════════
   MATOSHREE ORGANISATION — Main JavaScript
   matoshriseva.org
   ═══════════════════════════════════════════════
   HOW TO ADD NEW SECTION JS:
   Simply paste new JS at the very bottom of this
   file below the last section's code.
   ═══════════════════════════════════════════════ */


/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const h1 = document.getElementById('h1');
const h2 = document.getElementById('h2');
const h3 = document.getElementById('h3');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('hidden', !menuOpen);
  hamburger.setAttribute('aria-expanded', menuOpen);
  if (menuOpen) {
    h1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    h2.style.opacity = '0';
    h3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    h1.style.transform = '';
    h2.style.opacity = '';
    h3.style.transform = '';
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.add('hidden');
    h1.style.transform = '';
    h2.style.opacity = '';
    h3.style.transform = '';
  });
});


/* ── BACK TO TOP ── */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('hidden', window.scrollY < 400);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));


/* ════════════════════════════════════════════════
   PASTE NEW SECTION JS BELOW THIS LINE
   ════════════════════════════════════════════════ */


   /* ═══ SECTION 2 — FOUNDER & TEAM ═══ */
/* No extra JS needed for this section —
   Scroll reveal already handles the animations
   via the existing revealObserver in main.js    */


   /* ═══ SECTION 3 — ACHIEVEMENTS GALLERY ═══ */

const achievementsPhotos = [
  { src: 'Achievements/maharashtra-gaurav-puraskar-2025-certificate.jpg', caption: 'महाराष्ट्र गौरव पुरस्कार २०२५' },
  { src: 'Achievements/maharashtra-gaurav-puraskar-2024.jpg',             caption: 'महाराष्ट्र गौरव पुरस्कार २०२४' },
  { src: 'Achievements/netramitra-certificate-tulsi-hospital.jpg',        caption: 'नेत्र-मित्र पुरस्कार — तुलसी आय हॉस्पिटल' },
  { src: 'Achievements/sanman-plate-2021.jpg',                            caption: 'जिल्हा युवा पुरस्कार २०२१' },
  { src: 'Achievements/police-ceremony-certificate.jpg',                  caption: 'Award Ceremony' },
  { src: 'Achievements/plantation-award.jpg',                             caption: 'वृक्ष लागवड पुरस्कार' },
  { src: 'Achievements/iso-certificate.jpg',                              caption: 'ISO Certificate' },
];

let achievementsLightboxIndex = 0;
let achievementsLightboxPhotos = [];

function openAchievementsGallery() {
  const grid = document.getElementById('achievements-gallery-grid');
  grid.innerHTML = '';
  achievementsLightboxPhotos = [];

  achievementsPhotos.forEach((photo, i) => {
    const img = new Image();
    img.onload = () => {
      achievementsLightboxPhotos.push({ ...photo });
      const item = document.createElement('div');
      item.className = 'gallery-grid-item';
      item.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy"/>`;
      const idx = achievementsLightboxPhotos.length - 1;
      item.addEventListener('click', () => openAchievementsLightbox(idx));
      grid.appendChild(item);
    };
    img.onerror = () => {
      if (i === achievementsPhotos.length - 1 && grid.children.length === 0) {
        grid.innerHTML = '<div class="gallery-empty">📷 Photos येतील लवकरच</div>';
      }
    };
    img.src = photo.src;
  });

  setTimeout(() => {
    if (grid.children.length === 0) {
      grid.innerHTML = '<div class="gallery-empty">📷 Photos येतील लवकरच — Coming soon</div>';
    }
  }, 2000);

  document.getElementById('achievements-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAchievementsGallery() {
  document.getElementById('achievements-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function openAchievementsLightbox(index) {
  achievementsLightboxIndex = index;
  const photo = achievementsLightboxPhotos[index];
  document.getElementById('achievements-lightbox-img').src = photo.src;
  document.getElementById('achievements-lightbox-caption').textContent = photo.caption;
  document.getElementById('achievements-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function achievementsLightboxNav(dir) {
  achievementsLightboxIndex = (achievementsLightboxIndex + dir + achievementsLightboxPhotos.length) % achievementsLightboxPhotos.length;
  const photo = achievementsLightboxPhotos[achievementsLightboxIndex];
  document.getElementById('achievements-lightbox-img').src = photo.src;
  document.getElementById('achievements-lightbox-caption').textContent = photo.caption;
}

// Keyboard nav for achievements lightbox
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('achievements-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') achievementsLightboxNav(1);
    if (e.key === 'ArrowLeft')  achievementsLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('achievements');
  }
  const modal = document.getElementById('achievements-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeAchievementsGallery();
});

   /* ═══ SECTION 4 — SCHOOL GALLERY & LIGHTBOX ═══ */

const schoolPhotos = [
  { src: 'School/school-building-01.jpg',          caption: 'School Building' },
  { src: 'School/school-building-02.jpg',          caption: 'School Building' },
  { src: 'School/school-classroom-01.jpg',         caption: 'Classroom' },
  { src: 'School/school-classroom-02.jpg',         caption: 'Classroom' },
  { src: 'School/school-students-activity-01.jpg', caption: 'Student Activity' },
  { src: 'School/school-students-activity-02.jpg', caption: 'Student Activity' },
  { src: 'School/school-principal.jpg',            caption: 'Principal' },
  { src: 'School/school-iso-certificate.jpg',      caption: 'ISO Certificate' },
];

let schoolLightboxIndex = 0;
let schoolLightboxPhotos = [];

function openSchoolGallery() {
  const grid = document.getElementById('school-gallery-grid');
  grid.innerHTML = '';
  schoolLightboxPhotos = [];

  let loaded = 0;

  schoolPhotos.forEach((photo, i) => {
    const img = new Image();
    img.onload = () => {
      schoolLightboxPhotos.push({ src: photo.src, caption: photo.caption, index: i });
      const item = document.createElement('div');
      item.className = 'gallery-grid-item';
      item.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy"/>`;
      item.addEventListener('click', () => openLightbox('school', schoolLightboxPhotos.length - 1));
      grid.appendChild(item);
      loaded++;
    };
    img.onerror = () => {
      loaded++;
      if (loaded === schoolPhotos.length && grid.children.length === 0) {
        grid.innerHTML = '<div class="gallery-empty">📷 Photos coming soon...</div>';
      }
    };
    img.src = photo.src;
  });

  setTimeout(() => {
    if (grid.children.length === 0) {
      grid.innerHTML = '<div class="gallery-empty">📷 Photos येतील लवकरच — Photos coming soon...</div>';
    }
  }, 2000);

  document.getElementById('school-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSchoolGallery() {
  document.getElementById('school-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function openLightbox(section, index) {
  schoolLightboxIndex = index;
  const photos = schoolLightboxPhotos;
  const lb = document.getElementById(`${section}-lightbox`);
  const img = document.getElementById(`${section}-lightbox-img`);
  const caption = document.getElementById(`${section}-lightbox-caption`);
  img.src = photos[index].src;
  caption.textContent = photos[index].caption;
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(section) {
  document.getElementById(`${section}-lightbox`).classList.add('hidden');
  document.body.style.overflow = '';
}

function lightboxNav(section, dir) {
  schoolLightboxIndex = (schoolLightboxIndex + dir + schoolLightboxPhotos.length) % schoolLightboxPhotos.length;
  const img = document.getElementById(`${section}-lightbox-img`);
  const caption = document.getElementById(`${section}-lightbox-caption`);
  img.src = schoolLightboxPhotos[schoolLightboxIndex].src;
  caption.textContent = schoolLightboxPhotos[schoolLightboxIndex].caption;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('school-lightbox');
  if (!lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') lightboxNav('school', 1);
    if (e.key === 'ArrowLeft')  lightboxNav('school', -1);
    if (e.key === 'Escape')     closeLightbox('school');
  }
  const modal = document.getElementById('school-gallery-modal');
  if (!modal.classList.contains('hidden') && e.key === 'Escape') closeSchoolGallery();
});


/* ═══ SECTION 5 — EYECARE GALLERY ═══ */
const eyecarePhotos = [
  { src: 'Eyecare/eyecamp-01.jpg',     caption: 'नेत्र तपासणी शिबिर' },
  { src: 'Eyecare/eyecamp-02.jpg',     caption: 'नेत्र तपासणी शिबिर' },
  { src: 'Eyecare/eyecamp-03.jpg',     caption: 'नेत्र तपासणी शिबिर' },
  { src: 'Eyecare/bloodcamp-01.jpg',   caption: 'रक्तदान शिबिर' },
  { src: 'Eyecare/bloodcamp-02.jpg',   caption: 'रक्तदान शिबिर' },
  { src: 'Eyecare/healthcamp-01.jpg',  caption: 'आरोग्य शिबिर' },
  { src: 'Eyecare/healthcamp-02.jpg',  caption: 'आरोग्य शिबिर' },
  { src: 'Eyecare/netramitra-award.jpg', caption: 'नेत्र-मित्र पुरस्कार' },
];

let eyecareLightboxIndex = 0;
let eyecareLightboxPhotos = [];

function openEyecareGallery() {
  buildGallery('eyecare-gallery-grid', eyecarePhotos, eyecareLightboxPhotos, openEyecareLightbox);
  document.getElementById('eyecare-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeEyecareGallery() {
  document.getElementById('eyecare-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
function openEyecareLightbox(index) {
  eyecareLightboxIndex = index;
  updateLightbox('eyecare', eyecareLightboxPhotos[index]);
  document.getElementById('eyecare-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function eyecareLightboxNav(dir) {
  eyecareLightboxIndex = (eyecareLightboxIndex + dir + eyecareLightboxPhotos.length) % eyecareLightboxPhotos.length;
  updateLightbox('eyecare', eyecareLightboxPhotos[eyecareLightboxIndex]);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('eyecare-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') eyecareLightboxNav(1);
    if (e.key === 'ArrowLeft')  eyecareLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('eyecare');
  }
  const modal = document.getElementById('eyecare-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeEyecareGallery();
});

/* ═══ SECTION 6 — LIBRARY GALLERY ═══ */
const libraryPhotos = [
  { src: 'Library/library-interior-01.jpg', caption: 'वाचनालय — आतील दृश्य' },
  { src: 'Library/library-interior-02.jpg', caption: 'वाचनालय — आतील दृश्य' },
  { src: 'Library/library-books-01.jpg',    caption: 'पुस्तक संग्रह' },
  { src: 'Library/library-readers-01.jpg',  caption: 'वाचक' },
  { src: 'Library/library-readers-02.jpg',  caption: 'वाचक' },
];

let libraryLightboxIndex = 0;
let libraryLightboxPhotos = [];

function openLibraryGallery() {
  buildGallery('library-gallery-grid', libraryPhotos, libraryLightboxPhotos, openLibraryLightbox);
  document.getElementById('library-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLibraryGallery() {
  document.getElementById('library-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
function openLibraryLightbox(index) {
  libraryLightboxIndex = index;
  updateLightbox('library', libraryLightboxPhotos[index]);
  document.getElementById('library-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function libraryLightboxNav(dir) {
  libraryLightboxIndex = (libraryLightboxIndex + dir + libraryLightboxPhotos.length) % libraryLightboxPhotos.length;
  updateLightbox('library', libraryLightboxPhotos[libraryLightboxIndex]);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('library-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') libraryLightboxNav(1);
    if (e.key === 'ArrowLeft')  libraryLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('library');
  }
  const modal = document.getElementById('library-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeLibraryGallery();
});

/* ═══ SECTION 7 — ENVIRONMENT GALLERY ═══ */
const environmentPhotos = [
  { src: 'Environment/plantation-01.jpg',    caption: 'वृक्षारोपण मोहीम' },
  { src: 'Environment/plantation-02.jpg',    caption: 'वृक्षारोपण मोहीम' },
  { src: 'Environment/plantation-03.jpg',    caption: 'वृक्षारोपण मोहीम' },
  { src: 'Environment/vatsavitri-01.jpg',    caption: 'वटसावित्री वृक्षारोपण' },
  { src: 'Environment/school-tree-01.jpg',   caption: 'एक झाड – मुलाच्या नावे' },
  { src: 'Environment/plantation-award.jpg', caption: 'वृक्षमित्र पुरस्कार' },
];

let environmentLightboxIndex = 0;
let environmentLightboxPhotos = [];

function openEnvironmentGallery() {
  buildGallery('environment-gallery-grid', environmentPhotos, environmentLightboxPhotos, openEnvironmentLightbox);
  document.getElementById('environment-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeEnvironmentGallery() {
  document.getElementById('environment-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
function openEnvironmentLightbox(index) {
  environmentLightboxIndex = index;
  updateLightbox('environment', environmentLightboxPhotos[index]);
  document.getElementById('environment-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function environmentLightboxNav(dir) {
  environmentLightboxIndex = (environmentLightboxIndex + dir + environmentLightboxPhotos.length) % environmentLightboxPhotos.length;
  updateLightbox('environment', environmentLightboxPhotos[environmentLightboxIndex]);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('environment-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') environmentLightboxNav(1);
    if (e.key === 'ArrowLeft')  environmentLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('environment');
  }
  const modal = document.getElementById('environment-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeEnvironmentGallery();
});

/* ═══ SECTION 8 — DEADDICTION GALLERY ═══ */
const deaddictionPhotos = [
  { src: 'Deaddiction/deaddiction-program-01.jpg',  caption: 'व्यसनमुक्ती जनजागृती कार्यक्रम' },
  { src: 'Deaddiction/deaddiction-program-02.jpg',  caption: 'व्यसनमुक्ती जनजागृती कार्यक्रम' },
  { src: 'Deaddiction/deaddiction-rally-01.jpg',    caption: 'व्यसनमुक्ती रॅली' },
  { src: 'Deaddiction/deaddiction-poster-01.jpg',   caption: 'पोस्टर प्रदर्शन' },
  { src: 'Deaddiction/deaddiction-poster-02.jpg',   caption: 'पोस्टर प्रदर्शन' },
  { src: 'Deaddiction/deaddiction-camp-01.jpg',     caption: 'जनजागृती शिबिर' },
  { src: 'Deaddiction/deaddiction-police-01.jpg',   caption: 'पोलीस सहकार्य' },
  { src: 'Deaddiction/deaddiction-rec-letter.jpg',  caption: 'शासकीय शिफारस पत्र' },
];

let deaddictionLightboxIndex = 0;
let deaddictionLightboxPhotos = [];

function openDeaddictionGallery() {
  buildGallery('deaddiction-gallery-grid', deaddictionPhotos, deaddictionLightboxPhotos, openDeaddictionLightbox);
  document.getElementById('deaddiction-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeDeaddictionGallery() {
  document.getElementById('deaddiction-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
function openDeaddictionLightbox(index) {
  deaddictionLightboxIndex = index;
  updateLightbox('deaddiction', deaddictionLightboxPhotos[index]);
  document.getElementById('deaddiction-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function deaddictionLightboxNav(dir) {
  deaddictionLightboxIndex = (deaddictionLightboxIndex + dir + deaddictionLightboxPhotos.length) % deaddictionLightboxPhotos.length;
  updateLightbox('deaddiction', deaddictionLightboxPhotos[deaddictionLightboxIndex]);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('deaddiction-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') deaddictionLightboxNav(1);
    if (e.key === 'ArrowLeft')  deaddictionLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('deaddiction');
  }
  const modal = document.getElementById('deaddiction-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeDeaddictionGallery();
});



/* ═══ SECTION 9 — WOMEN GALLERY ═══ */
const womenPhotos = [
  { src: 'Women Empowerment/women-workshop-01.jpg', caption: 'महिला कार्यशाळा' },
  { src: 'Women Empowerment/women-workshop-02.jpg', caption: 'महिला कार्यशाळा' },
  { src: 'Women Empowerment/women-program-01.jpg',  caption: 'महिला कार्यक्रम' },
  { src: 'Women Empowerment/women-program-02.jpg',  caption: 'महिला कार्यक्रम' },
  { src: 'Women Empowerment/women-group-01.jpg',    caption: 'महिला गट फोटो' },
  { src: 'Women Empowerment/vatsavitri-01.jpg',     caption: 'वटसावित्री उपक्रम' },
];

let womenLightboxIndex = 0;
let womenLightboxPhotos = [];

function openWomenGallery() {
  buildGallery('women-gallery-grid', womenPhotos, womenLightboxPhotos, openWomenLightbox);
  document.getElementById('women-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeWomenGallery() {
  document.getElementById('women-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
function openWomenLightbox(index) {
  womenLightboxIndex = index;
  updateLightbox('women', womenLightboxPhotos[index]);
  document.getElementById('women-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function womenLightboxNav(dir) {
  womenLightboxIndex = (womenLightboxIndex + dir + womenLightboxPhotos.length) % womenLightboxPhotos.length;
  updateLightbox('women', womenLightboxPhotos[womenLightboxIndex]);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('women-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') womenLightboxNav(1);
    if (e.key === 'ArrowLeft')  womenLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('women');
  }
  const modal = document.getElementById('women-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeWomenGallery();
});

/* ═══ SECTION 10 — MEDIA GALLERY ═══ */
const mediaPhotos = [
  { src: 'Media Press/newspaper-01.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-02.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-03.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-04.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-05.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-06.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-07.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/newspaper-08.jpg',       caption: 'वृत्तपत्र Coverage' },
  { src: 'Media Press/news-interview-abp.jpg', caption: 'TV News Interview' },
  { src: 'Media Press/youth-festival-stage.jpg', caption: '27वा राष्ट्रीय युवक महोत्सव २०२४' },
  { src: 'Media Press/youth-festival-01.jpg',  caption: 'राष्ट्रीय युवक महोत्सव' },
  { src: 'Media Press/youth-festival-02.jpg',  caption: 'राष्ट्रीय युवक महोत्सव' },
];

let mediaLightboxIndex = 0;
let mediaLightboxPhotos = [];

function openMediaGallery() {
  buildGallery('media-gallery-grid', mediaPhotos, mediaLightboxPhotos, openMediaLightbox);
  document.getElementById('media-gallery-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeMediaGallery() {
  document.getElementById('media-gallery-modal').classList.add('hidden');
  document.body.style.overflow = '';
}
function openMediaLightbox(index) {
  mediaLightboxIndex = index;
  updateLightbox('media', mediaLightboxPhotos[index]);
  document.getElementById('media-lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function mediaLightboxNav(dir) {
  mediaLightboxIndex = (mediaLightboxIndex + dir + mediaLightboxPhotos.length) % mediaLightboxPhotos.length;
  updateLightbox('media', mediaLightboxPhotos[mediaLightboxIndex]);
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('media-lightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') mediaLightboxNav(1);
    if (e.key === 'ArrowLeft')  mediaLightboxNav(-1);
    if (e.key === 'Escape')     closeLightbox('media');
  }
  const modal = document.getElementById('media-gallery-modal');
  if (modal && !modal.classList.contains('hidden') && e.key === 'Escape') closeMediaGallery();
});

/* ═══ SECTION 11 — DOCUMENTS ═══ */
/* No gallery needed for documents section —
   individual document cards shown directly    */


/* ═══ CONTACT FORM ═══ */
function submitContactForm() {
  const name    = document.getElementById('cf-name').value.trim();
  const phone   = document.getElementById('cf-phone').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  if (!name || !phone || !message) {
    alert('कृपया नाव, दूरध्वनी क्रमांक आणि संदेश भरा.');
    return;
  }

  document.getElementById('contact-form').classList.add('hidden');
  document.getElementById('contact-success').classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('contact-form').classList.remove('hidden');
    document.getElementById('contact-success').classList.add('hidden');
    document.getElementById('cf-name').value    = '';
    document.getElementById('cf-phone').value   = '';
    document.getElementById('cf-email').value   = '';
    document.getElementById('cf-subject').value = '';
    document.getElementById('cf-message').value = '';
  }, 4000);
}











/* ═══ SHARED GALLERY HELPERS ═══ */
function buildGallery(gridId, photos, lightboxArr, openFn) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';
  lightboxArr.length = 0;
  photos.forEach((photo) => {
    const img = new Image();
    img.onload = () => {
      lightboxArr.push({ src: photo.src, caption: photo.caption });
      const item = document.createElement('div');
      item.className = 'gallery-grid-item';
      item.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy"/>`;
      const idx = lightboxArr.length - 1;
      item.addEventListener('click', () => openFn(idx));
      grid.appendChild(item);
    };
    img.onerror = () => {
      if (grid.children.length === 0 && lightboxArr.length === 0) {
        setTimeout(() => {
          if (grid.children.length === 0)
            grid.innerHTML = '<div class="gallery-empty">📷 Photos येतील लवकरच</div>';
        }, 1500);
      }
    };
    img.src = photo.src;
  });
}

function updateLightbox(section, photo) {
  document.getElementById(`${section}-lightbox-img`).src = photo.src;
  document.getElementById(`${section}-lightbox-caption`).textContent = photo.caption;
}

function closeLightbox(section) {
  document.getElementById(`${section}-lightbox`).classList.add('hidden');
  document.body.style.overflow = '';
}