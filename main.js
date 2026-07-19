/* ═══════════════════════════════════════════════
   MATOSHREE ORGANISATION — Main JavaScript
   matoshriseva.org
   ═══════════════════════════════════════════════
   SECURITY NOTES:
   • Wrapped in IIFE — no globals leaked to window
     except the explicit legacy alias functions
     required for HTML onclick= attributes.
   • API Key read from window.CONFIG (config.js).
   • 'use strict' mode enabled.
   • No innerHTML used with any API/user-supplied data.
   • All dynamic text set via textContent / DOM API.
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     INTERNAL LOGGER
     Calls console.error only when DEBUG: true.
     Prevents leaking internal structure in production.
     ───────────────────────────────────────────── */
  function log(msg, data) {
    if (window.CONFIG && window.CONFIG.DEBUG) {
      if (data !== undefined) {
        console.error('[Matoshree]', msg, data);
      } else {
        console.error('[Matoshree]', msg);
      }
    }
  }

  /* ─────────────────────────────────────────────
     CONFIG GUARD
     Fail loudly (but safely) if config.js is missing.
     ───────────────────────────────────────────── */
  if (!window.CONFIG || !window.CONFIG.GOOGLE_API_KEY) {
    var missing = document.createElement('div');
    missing.textContent = 'Configuration error: config.js is missing. See config.example.js for setup instructions.';
    missing.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#c0392b;color:#fff;padding:12px 16px;font:14px sans-serif;z-index:99999;text-align:center';
    document.body.appendChild(missing);
    return; // Stop execution — nothing else will work without the key
  }

  var API_KEY = window.CONFIG.GOOGLE_API_KEY;

  /* ─────────────────────────────────────────────
     SECTION 1 — GALLERY CONFIGURATION
     ─────────────────────────────────────────────
     Mapped to actual Google Drive folders:
       achievements → Award and Achievements Gallery
       school       → School Gallery
       eyecare      → Health Sector Gallery
       library      → (no folder yet — will show "No Photos Found")
       environment  → Environment Gallery
       deaddiction  → De-Addiction Gallery
       women        → Women Empowerment Gallery
       media        → Awareness Gallery
     ───────────────────────────────────────────── */

  var GALLERIES = Object.freeze({
    achievements: { folderId: '1xe2kq4U-TODZ9t89S_eYMXaAHE_aIAb6', photos: [], index: 0 },
    school:       { folderId: '1UJBh-RIiGYlIjyxIkZpXlWLg78gV7IsX', photos: [], index: 0 },
    eyecare:      { folderId: '1FptjBy_I91xIFF8197EA6CoBcCEencLN', photos: [], index: 0 },
    library:      { folderId: '', photos: [], index: 0 },
    environment:  { folderId: '1_Jj-WQvJnJXFgKsiBzsjkCaQb3lCVveM', photos: [], index: 0 },
    deaddiction:  { folderId: '1v69oJqnd_QFLNf8jrv_h9WJOG8JTefIf', photos: [], index: 0 },
    women:        { folderIds: ['1cKE6KOTCMXqe3Ko9ReLo3LHC0pd_uScJ', '1C3_mmxSPqXz4b0w7bgDLNPfMUZcf0GB1'], photos: [], index: 0 },
    media:        { folderId: '1uvEyzKaWOKUvNaXTsHu-XArb2nB9UC1k', photos: [], index: 0 }
  });

  /* Allowed gallery keys — prevents prototype pollution via key injection */
  var GALLERY_KEYS = Object.keys(GALLERIES);

  function isValidKey(key) {
    return GALLERY_KEYS.indexOf(key) !== -1;
  }

  /* ─────────────────────────────────────────────
     SECTION 2 — HAMBURGER MENU
     ───────────────────────────────────────────── */

  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var hBar1      = document.getElementById('h1');
  var hBar2      = document.getElementById('h2');
  var hBar3      = document.getElementById('h3');
  var menuOpen   = false;

  function closeHamburger() {
    menuOpen = false;
    mobileMenu.classList.add('hidden');
    hamburger.setAttribute('aria-expanded', 'false');
    hBar1.style.transform = '';
    hBar2.style.opacity   = '';
    hBar3.style.transform = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('hidden', !menuOpen);
      hamburger.setAttribute('aria-expanded', String(menuOpen));
      if (menuOpen) {
        hBar1.style.transform = 'rotate(45deg) translate(5px, 5px)';
        hBar2.style.opacity   = '0';
        hBar3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        closeHamburger();
      }
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeHamburger);
    });
  }

  /* ─────────────────────────────────────────────
     SECTION 3 — BACK TO TOP
     ───────────────────────────────────────────── */

  var backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('hidden', window.scrollY < 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
     SECTION 4 — SCROLL REVEAL
     ───────────────────────────────────────────── */

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ═════════════════════════════════════════════
     GALLERY ENGINE
     ═════════════════════════════════════════════ */

  /* Creates a safe status message element — no innerHTML involved */
  function makeStatusEl(text) {
    var div       = document.createElement('div');
    div.className = 'gallery-empty';
    div.textContent = text;
    return div;
  }

  /**
   * Fetches images from Google Drive and renders them into the gallery modal.
   * All data returned from the API is set via DOM properties, never innerHTML.
   * @param {string} key - Gallery key.
   */
  async function loadGallery(key) {
  if (!isValidKey(key)) { log('Invalid gallery key', key); return; }

  var gallery = GALLERIES[key];
  var grid    = document.getElementById(key + '-gallery-grid');

  if (!grid) { log('Gallery grid not found: #' + key + '-gallery-grid'); return; }

  /* Reset state */
  gallery.photos = [];
  gallery.index  = 0;
  grid.innerHTML = '';

  /* Normalize to always work with an array of folder IDs */
  var folderIds = gallery.folderIds
    ? gallery.folderIds
    : (gallery.folderId ? [gallery.folderId] : []);

  /* Handle galleries with no folder configured yet (e.g. library) */
  if (folderIds.length === 0) {
    grid.appendChild(makeStatusEl('📷 Photos येतील लवकरच — Coming Soon'));
    return;
  }

  grid.appendChild(makeStatusEl('Loading...'));

  try {
    /* Fetch from ALL folders in parallel */
    var allFiles = [];

    for (var f = 0; f < folderIds.length; f++) {
      var folderId = folderIds[f];

      var url = 'https://www.googleapis.com/drive/v3/files'
        + '?q=%27' + folderId + '%27+in+parents+and+mimeType+contains+%27image/%27'
        + '&fields=files(id,name)&key=' + encodeURIComponent(API_KEY);

      var response = await fetch(url);

      if (!response.ok) {
        log('Folder fetch failed: ' + folderId, response.status);
        continue; // skip this folder, try the next one
      }

      var data = await response.json();

      if (data.files && data.files.length > 0) {
        allFiles = allFiles.concat(data.files);
      }
    }

    if (allFiles.length === 0) {
      grid.innerHTML = '';
      grid.appendChild(makeStatusEl('📷 No Photos Found'));
      return;
    }

    grid.innerHTML = '';

    allFiles.forEach(function (file, index) {
      /* Validate that id and name are non-empty strings */
      if (!file.id || typeof file.id !== 'string') return;
      var safeName = (typeof file.name === 'string' && file.name) ? file.name : 'Photo ' + (index + 1);

      /* Validate the Drive file ID looks like a Drive ID (alphanumeric + _ -) */
      if (!/^[\w-]+$/.test(file.id)) {
        log('Suspicious file ID skipped', file.id);
        return;
      }

      var imageUrl = 'https://drive.google.com/thumbnail?id=' + file.id + '&sz=w1200';

      gallery.photos.push({ src: imageUrl, caption: safeName });

      /* Build the grid item entirely via DOM API — zero innerHTML with API data */
      var item = document.createElement('div');
      item.className = 'gallery-grid-item';

      var img = document.createElement('img');
      img.src     = imageUrl;
      img.alt     = safeName;
      img.loading = 'lazy';
      img.width   = 400;
      img.height  = 300;

      item.appendChild(img);

      (function (capturedIndex) {
        item.addEventListener('click', function () {
          openLightbox(key, capturedIndex);
        });
      }(gallery.photos.length - 1));

      grid.appendChild(item);
    });

  } catch (err) {
    grid.innerHTML = '';
    grid.appendChild(makeStatusEl('❌ Failed to Load Gallery'));
    log('Gallery "' + key + '" failed to load', err);
  }
}

  /**
   * Opens the gallery modal, then loads photos from Drive.
   * @param {string} key - Gallery key.
   */
  async function openGallery(key) {
    if (!isValidKey(key)) return;
    var modal = document.getElementById(key + '-gallery-modal');
    if (!modal) { log('Modal not found: #' + key + '-gallery-modal'); return; }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    await loadGallery(key);
  }

  /**
   * Closes the gallery modal.
   * @param {string} key - Gallery key.
   */
  function closeGallery(key) {
    if (!isValidKey(key)) return;
    var modal = document.getElementById(key + '-gallery-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Updates lightbox img src and caption using DOM properties (not innerHTML).
   * @param {string} key
   * @param {{ src: string, caption: string }} photo
   */
  function updateLightbox(key, photo) {
    var img     = document.getElementById(key + '-lightbox-img');
    var caption = document.getElementById(key + '-lightbox-caption');
    if (img)     img.src             = photo.src;
    if (caption) caption.textContent = photo.caption; /* textContent — XSS-safe */
  }

  /**
   * Opens the lightbox at the given index.
   * @param {string} key
   * @param {number} index
   */
  function openLightbox(key, index) {
    if (!isValidKey(key)) return;
    var gallery = GALLERIES[key];
    if (!gallery || !gallery.photos[index]) return;

    gallery.index = index;
    updateLightbox(key, gallery.photos[index]);

    var lb = document.getElementById(key + '-lightbox');
    if (lb) lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the lightbox.
   * @param {string} key
   */
  function closeLightbox(key) {
    if (!isValidKey(key)) return;
    var lb = document.getElementById(key + '-lightbox');
    if (lb) lb.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Navigates within the lightbox.
   * @param {string} key
   * @param {number} dir — +1 next, -1 previous
   */
  function lightboxNav(key, dir) {
    if (!isValidKey(key)) return;
    var gallery = GALLERIES[key];
    if (!gallery || gallery.photos.length === 0) return;

    gallery.index = (gallery.index + dir + gallery.photos.length) % gallery.photos.length;
    updateLightbox(key, gallery.photos[gallery.index]);
  }

  /**
   * Single keyboard handler for ALL galleries and lightboxes.
   */
  document.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'ArrowLeft', 'Escape'].indexOf(e.key) === -1) return;

    for (var i = 0; i < GALLERY_KEYS.length; i++) {
      var key = GALLERY_KEYS[i];

      var lb = document.getElementById(key + '-lightbox');
      if (lb && !lb.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') lightboxNav(key, 1);
        if (e.key === 'ArrowLeft')  lightboxNav(key, -1);
        if (e.key === 'Escape')     closeLightbox(key);
        return;
      }

      var modal = document.getElementById(key + '-gallery-modal');
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeGallery(key);
        return;
      }
    }
  });
/* ═════════════════════════════════════════════
     CONTACT FORM — EmailJS Integration
     ═════════════════════════════════════════════ */

  var EMAILJS_SERVICE_ID  = 'service_zeodimh';
  var EMAILJS_TEMPLATE_ID = 'template_6lqdil7';
  var EMAILJS_PUBLIC_KEY   = 'LpS1gulO8JKKyErMB';

  /* Initialize EmailJS once, if the library loaded successfully */
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  function submitContactForm() {
    var name    = document.getElementById('cf-name').value.trim();
    var phone   = document.getElementById('cf-phone').value.trim();
    var email   = document.getElementById('cf-email').value.trim();
    var subject = document.getElementById('cf-subject').value.trim();
    var message = document.getElementById('cf-message').value.trim();

    /* Basic presence check */
    if (!name || !phone || !message) {
      alert('कृपया नाव, दूरध्वनी क्रमांक आणि संदेश भरा.');
      return;
    }

    /* Length guards */
    if (name.length > 100 || message.length > 2000) {
      alert('कृपया माहिती मर्यादित ठेवा.');
      return;
    }

    /* Phone format: digits, spaces, +, -, (, ) only */
    if (!/^[0-9\s\+\-\(\)]{6,20}$/.test(phone)) {
      alert('कृपया योग्य दूरध्वनी क्रमांक भरा. (उदा: +91 8007011941)');
      return;
    }

    if (typeof emailjs === 'undefined') {
      log('EmailJS library not loaded');
      alert('संदेश पाठवण्यात अडचण आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.');
      return;
    }

    var submitBtn = document.querySelector('.contact-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
    }

    var templateParams = {
      name:    name,
      phone:   phone,
      email:   email || 'दिलेला नाही',
      subject: subject || 'सामान्य चौकशी',
      message: message
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        document.getElementById('contact-form').classList.add('hidden');
        document.getElementById('contact-success').classList.remove('hidden');

        setTimeout(function () {
          document.getElementById('contact-form').classList.remove('hidden');
          document.getElementById('contact-success').classList.add('hidden');
          ['cf-name', 'cf-phone', 'cf-email', 'cf-subject', 'cf-message'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.value = '';
          });
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
          }
        }, 4000);
      })
      .catch(function (err) {
        log('EmailJS send failed', err);
        alert('संदेश पाठवण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा किंवा फोनवर संपर्क करा.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
        }
      });
  }

  /* ═════════════════════════════════════════════
     LEGACY WINDOW ALIASES
     ─────────────────────────────────────────────
     These are the ONLY names intentionally exposed
     on window. They are required because HTML uses
     onclick="openSchoolGallery()" etc. and we must
     not change the HTML to preserve stability.

     All other internal functions remain private
     inside this IIFE and are NOT accessible from
     the browser console or external scripts.
     ═════════════════════════════════════════════ */

  /* Generic — used by any future onclick="openGallery('key')" */
  window.openGallery     = openGallery;
  window.closeGallery    = closeGallery;
  window.openLightbox    = openLightbox;
  window.closeLightbox   = closeLightbox;
  window.lightboxNav     = lightboxNav;

  /* Achievements */
  window.openAchievementsGallery  = function () { openGallery('achievements');    };
  window.closeAchievementsGallery = function () { closeGallery('achievements');   };
  window.openAchievementsLightbox = function (i) { openLightbox('achievements', i); };
  window.achievementsLightboxNav  = function (d) { lightboxNav('achievements', d);  };

  /* School */
  window.openSchoolGallery        = function () { openGallery('school');    };
  window.closeSchoolGallery       = function () { closeGallery('school');   };
  window.openSchoolLightbox       = function (i) { openLightbox('school', i); };
  window.schoolLightboxNav        = function (d) { lightboxNav('school', d);  };

  /* Eyecare */
  window.openEyecareGallery       = function () { openGallery('eyecare');    };
  window.closeEyecareGallery      = function () { closeGallery('eyecare');   };
  window.openEyecareLightbox      = function (i) { openLightbox('eyecare', i); };
  window.eyecareLightboxNav       = function (d) { lightboxNav('eyecare', d);  };

  /* Library */
  window.openLibraryGallery       = function () { openGallery('library');    };
  window.closeLibraryGallery      = function () { closeGallery('library');   };
  window.openLibraryLightbox      = function (i) { openLightbox('library', i); };
  window.libraryLightboxNav       = function (d) { lightboxNav('library', d);  };

  /* Environment */
  window.openEnvironmentGallery   = function () { openGallery('environment');    };
  window.closeEnvironmentGallery  = function () { closeGallery('environment');   };
  window.openEnvironmentLightbox  = function (i) { openLightbox('environment', i); };
  window.environmentLightboxNav   = function (d) { lightboxNav('environment', d);  };

  /* Deaddiction */
  window.openDeaddictionGallery   = function () { openGallery('deaddiction');    };
  window.closeDeaddictionGallery  = function () { closeGallery('deaddiction');   };
  window.openDeaddictionLightbox  = function (i) { openLightbox('deaddiction', i); };
  window.deaddictionLightboxNav   = function (d) { lightboxNav('deaddiction', d);  };

  /* Women */
  window.openWomenGallery         = function () { openGallery('women');    };
  window.closeWomenGallery        = function () { closeGallery('women');   };
  window.openWomenLightbox        = function (i) { openLightbox('women', i); };
  window.womenLightboxNav         = function (d) { lightboxNav('women', d);  };

  /* Media */
  window.openMediaGallery         = function () { openGallery('media');    };
  window.closeMediaGallery        = function () { closeGallery('media');   };
  window.openMediaLightbox        = function (i) { openLightbox('media', i); };
  window.mediaLightboxNav         = function (d) { lightboxNav('media', d);  };

  /* Contact form — called from HTML onsubmit / onclick */
  window.submitContactForm        = submitContactForm;

}()); /* End IIFE */