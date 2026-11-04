/* ==========================================================================
   JS MEN'S PG HOSTEL — MAIN SCRIPT (redesign)
   Business data (CONFIG) is the single source of truth for contact details.
   rooms.js depends on CONFIG + baseWhatsAppUrl defined here.
   ========================================================================== */

/* ==========================================================================
   CONFIGURATION — verified business information. Do not alter.
   ========================================================================== */

const CONFIG = {
  businessName: "JS Mens PG Hostel",
  shortName: "JS Mens PG",
  area: "EVP Santhosh Nagar, Ramapuram, Chennai 600089",
  exactAddress: "Plot No. 78, EVP Santhosh Nagar, Ramapuram, Chennai 600089",
  phone: "7305169396",
  whatsappNumber: "917305169396",
  email: "info.jsmenspg@gmail.com",
  instagram: "https://www.instagram.com/js_mens_pg/",
  mapQuery: "JS Mens PG Hostel Ramapuram Chennai",
  pricingMessage:
    "Contact us for current room availability, sharing options, pricing, deposit, and inclusions."
};

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================================================
   WHATSAPP + PHONE HELPERS
   ========================================================================== */

function baseWhatsAppUrl(text) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

const defaultPrefill =
  `Hello ${CONFIG.businessName}, I'd like to enquire about room availability. ${CONFIG.pricingMessage}`;

/* ==========================================================================
   BASIC PAGE DATA
   ========================================================================== */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const addressEl = document.getElementById("addressText");
if (addressEl) addressEl.textContent = CONFIG.exactAddress;

const mapsEl = document.getElementById("mapsBtn");
if (mapsEl) {
  mapsEl.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONFIG.mapQuery
  )}`;
}

const reviewsMapsEl = document.getElementById("reviewsMapsBtn");
if (reviewsMapsEl) {
  reviewsMapsEl.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONFIG.mapQuery
  )}`;
}

const directionsEl = document.getElementById("directionsBtn");
if (directionsEl) {
  directionsEl.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    CONFIG.exactAddress
  )}`;
}

/* WhatsApp buttons */
["heroWaBtn", "fabWaBtn", "headerWaBtn", "aboutWaBtn", "footerWaLink"].forEach(
  (id) => {
    const node = document.getElementById(id);
    if (node) node.href = baseWhatsAppUrl(defaultPrefill);
  }
);

/* Phone / email footer + contact links */
const footerPhoneLink = document.getElementById("footerPhoneLink");
if (footerPhoneLink) footerPhoneLink.href = `tel:${CONFIG.phone}`;

const contactPhoneLink = document.getElementById("contactPhoneLink");
if (contactPhoneLink) contactPhoneLink.href = `tel:${CONFIG.phone}`;

const footerEmail = document.getElementById("footerEmail");
if (footerEmail) footerEmail.href = `mailto:${CONFIG.email}`;

/* ==========================================================================
   STICKY HEADER
   ========================================================================== */

const header = document.querySelector(".site-header");
const heroBg = document.querySelector(".hero-bg");
const heroMark = document.querySelector(".hero-mark");
const heroSection = document.querySelector(".hero");
const scrollProgress = document.getElementById("scrollProgress");
let scrollTick = false;

function parallax() {
  if (!heroSection) return;
  const y = window.scrollY;
  const h = heroSection.offsetHeight;
  if (y <= h) {
    if (heroBg) {
      heroBg.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(${1 + Math.min(y, h) * 0.00012})`;
    }
    if (heroMark) {
      heroMark.style.transform = `translate3d(0, calc(-50% + ${y * 0.12}px), 0)`;
      heroMark.style.opacity = String(Math.max(0, 0.14 * (1 - y / (h * 0.85))));
    }
  }
}

function onScroll() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  const toTop = document.getElementById("toTop");
  if (toTop) toTop.style.opacity = window.scrollY > 500 ? "1" : "0";
  if (scrollProgress) {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    scrollProgress.style.width = (max > 0 ? window.scrollY / max : 0) * 100 + "%";
  }
  if (!reduceMotion) {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(() => {
        parallax();
        scrollTick = false;
      });
    }
  }
}

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ==========================================================================
   ROOM CAROUSEL ARROWS
   ========================================================================== */

(function initCarousel() {
  const track = document.getElementById("roomGrid");
  const prev = document.getElementById("carPrev");
  const next = document.getElementById("carNext");
  if (!track || !prev || !next) return;

  const step = () => {
    const card = track.querySelector(".room-card");
    if (!card) return card;
    const gap = 22;
    return card.getBoundingClientRect().width + gap;
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  prev.addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" })
  );
  next.addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" })
  );
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  requestAnimationFrame(update);
})();

/* ==========================================================================
   ENQUIRY FORM → WHATSAPP (no backend; opens a real WhatsApp chat)
   ========================================================================== */

(function initEnquiryForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const setError = (field, on) => {
    const wrap = field.closest(".field");
    if (wrap) wrap.classList.toggle("invalid", on);
    return !on;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.name;
    const phoneField = form.elements.phone;
    const room = form.elements.room;
    const message = form.elements.message;

    let valid = true;
    valid = setError(name, !name.value.trim()) && valid;
    valid =
      setError(phoneField, !/^[0-9+\-\s()]{7,}$/.test(phoneField.value.trim())) &&
      valid;

    if (!valid) {
      form.querySelector(".field.invalid input, .field.invalid textarea")?.focus();
      return;
    }

    const lines = [
      `Hello ${CONFIG.businessName}, I would like to enquire about a room.`,
      "",
      `Name: ${name.value.trim()}`,
      `Phone: ${phoneField.value.trim()}`
    ];

    if (room && room.value) {
      lines.push(`Room: ${room.value}`);
    }

    if (message.value.trim()) {
      lines.push("", `Message: ${message.value.trim()}`);
    }

    window.open(baseWhatsAppUrl(lines.join("\n")), "_blank", "noopener");

    const status = document.getElementById("formStatus");
    if (status) {
      status.textContent = "Opening WhatsApp with your enquiry…";
      setTimeout(() => (status.textContent = ""), 4000);
    }
  });
})();

/* ==========================================================================
   BACK TO TOP
   ========================================================================== */

const toTop = document.getElementById("toTop");
if (toTop) {
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );
}

/* ==========================================================================
   REVEAL ON SCROLL
   ========================================================================== */

const revealEls = document.querySelectorAll(".reveal");

if (reduceMotion) {
  revealEls.forEach((node) => node.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  revealEls.forEach((node, index) => {
    node.style.transitionDelay = `${(index % 4) * 60}ms`;
    io.observe(node);
  });

  window.revealObservers = { io };
}
