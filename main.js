/* ═══════════════════════════════════════════════
   MATOSHREE ORGANISATION — Main JavaScript
   matoshriseva.org
   ═══════════════════════════════════════════════
   HOW TO ADD NEW SECTION JS:
   Simply paste new JS at the very bottom of this
   file below the last section's code.
   ═══════════════════════════════════════════════ */

/* ===== GOOGLE DRIVE CONFIG ===== */

const API_KEY = "AIzaSyB7BF_9U3YN8h7fNi7lbttcEJiD76Na9o8";

const FOLDERS = {
  school: "",
  eyecare: "",
  library: "",
  environment: "",
  deaddiction: "",
  women: "",
  achievements: "",
  media: ""
};
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

const ACHIEVEMENTS_FOLDER_ID = "1uvEyzKaWOKUvNaXTsHu-XArb2nB9UC1k";

let achievementsLightboxIndex = 0;
let achievementsLightboxPhotos = [];

async function openAchievementsGallery() {

    const grid = document.getElementById('achievements-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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

const SCHOOL_FOLDER_ID = "1UJBh-RIiGYlIjyxIkZpXlWLg78gV7IsX";
let schoolLightboxIndex = 0;
let schoolLightboxPhotos = [];

async function openSchoolGallery() {

    const grid = document.getElementById('school-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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
const EYECARE_FOLDER_ID = "1eHOo7-tWp9ZbhYyCmR6nMPqYNS_jDhC6";

let eyecareLightboxIndex = 0;
let eyecareLightboxPhotos = [];

async function openEyecareGallery() {

    const grid = document.getElementById('eyecare-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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
const LIBRARY_FOLDER_ID = "1C3_mmxSPqXz4b0w7bgDLNPfMUZcf0GB1";

let libraryLightboxIndex = 0;
let libraryLightboxPhotos = [];

async function openLibraryGallery() {

    const grid = document.getElementById('library-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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
const ENVIRONMENT_FOLDER_ID="1_Jj-WQvJnJXFgKsiBzsjkCaQb3lCVveM"

let environmentLightboxIndex = 0;
let environmentLightboxPhotos = [];

async function openEnvironmentGallery() {

    const grid = document.getElementById('environment-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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
const DEADDITION_FOLDER_ID = "1v69oJqnd_QFLNf8jrv_h9WJOG8JTefIf";

let deaddictionLightboxIndex = 0;
let deaddictionLightboxPhotos = [];

async function openDeaddictionGallery() {

    const grid = document.getElementById('deaddiction-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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
const WOMEN_FOLDER_ID = "1cKE6KOTCMXqe3Ko9ReLo3LHC0pd_uScJ";
let womenLightboxIndex = 0;
let womenLightboxPhotos = [];

async function openWomenGallery() {

    const grid = document.getElementById('women-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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
const MEDIA_FOLDER_ID = "1321XyZ5zvXiZI7egXLI-Hmc-0ZZcAr6a";
let mediaLightboxIndex = 0;
let mediaLightboxPhotos = [];

async function openMediaGallery() {

    const grid = document.getElementById('media-gallery-grid');

    grid.innerHTML = '<div class="gallery-empty">Loading...</div>';

    schoolLightboxPhotos = [];

    const url = `https://www.googleapis.com/drive/v3/files?q='${SCHOOL_FOLDER_ID}'+in+parents and mimeType contains 'image/'&fields=files(id,name)&key=${API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        grid.innerHTML = "";

        data.files.forEach((file, index) => {

            const imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`;

            schoolLightboxPhotos.push({
                src: imageUrl,
                caption: file.name
            });

            const item = document.createElement("div");

            item.className = "gallery-grid-item";

            item.innerHTML = `
                <img src="${imageUrl}" alt="${file.name}" loading="lazy">
            `;

            item.onclick = () => openLightbox("school", index);

            grid.appendChild(item);

        });

        if (data.files.length === 0) {

            grid.innerHTML = '<div class="gallery-empty">📷 No Photos Found</div>';

        }

    } catch (e) {

        grid.innerHTML = '<div class="gallery-empty">❌ Failed to Load Gallery</div>';

        console.error(e);

    }

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