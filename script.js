/* ==========================================================================
   JS MEN'S PG HOSTEL — MAIN SCRIPT
   ========================================================================== */


/* ==========================================================================
   CONFIGURATION
   ========================================================================== */

const CONFIG = {
  businessName: "JS Mens PG Hostel",
  shortName: "JS Mens PG",
  area: "EVP Santhosh Nagar, Ramapuram, Chennai 600089",
  exactAddress: "Plot No. 78, EVP Santhosh Nagar, Ramapuram, Chennai 600089",
  phone: "7305169396",
  whatsappNumber: "917305169396",
  mapQuery: "JS Mens PG Hostel Ramapuram Chennai",
  pricingMessage:
    "Contact us for current room availability, sharing options, pricing, deposit, and inclusions.",
  galleryConfirmed: false,
  corporateStaysConfirmed: false
};


const reduceMotion =
  matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ==========================================================================
   BASIC PAGE DATA
   ========================================================================== */

const yearEl =
  document.getElementById("year");

if (yearEl) {
  yearEl.textContent =
    new Date().getFullYear();
}

const addressEl =
  document.getElementById("addressText");

if (addressEl) {
  addressEl.textContent =
    CONFIG.exactAddress;
}

const mapsEl =
  document.getElementById("mapsBtn");

if (mapsEl) {
  mapsEl.href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      CONFIG.mapQuery
    )}`;
}


/* ==========================================================================
   WHATSAPP
   ========================================================================== */

function baseWhatsAppUrl(text) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
    text
  )}`;
}


const defaultPrefill =
  `Hello ${CONFIG.businessName}, I'd like to enquire about room availability. ${CONFIG.pricingMessage}`;


["heroWaBtn", "fabWaBtn"].forEach((id) => {
  const el = document.getElementById(id);

  if (el) {
    el.href = baseWhatsAppUrl(defaultPrefill);
  }
});


/* ==========================================================================
   PHONE
   ========================================================================== */

const footerPhoneLink =
  document.getElementById("footerPhoneLink");

if (footerPhoneLink) {

  footerPhoneLink.href =
    `tel:${CONFIG.phone}`;

  footerPhoneLink.textContent =
    `Call — ${CONFIG.phone}`;

}


const footerWaLink =
  document.getElementById("footerWaLink");

if (footerWaLink) {

  footerWaLink.href =
    baseWhatsAppUrl(defaultPrefill);

  footerWaLink.textContent =
    `WhatsApp — ${CONFIG.phone}`;

}


/* ==========================================================================
   HERO HEADLINE WORD REVEAL
   ========================================================================== */

(function splitHeadline() {

  const el = document.getElementById("heroTitle");

  if (!el) return;

  const words =
    el.textContent.trim().split(" ");

  el.innerHTML =
    words
      .map(
        (word, index) =>
          `<span style="animation-delay:${index * 70}ms">${word}</span>`
      )
      .join(" ");

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      el.classList.add("play");

    });

  });

})();


/* ==========================================================================
   NAVIGATION + INK PROGRESS RAIL
   ========================================================================== */

const nav =
  document.getElementById("siteNav");

const progressBar =
  document.getElementById("progressBar");


const heroEl =
  document.getElementById("hero");


function onScroll() {

  if (nav) {
    nav.classList.toggle(
      "scrolled",
      window.scrollY > 60
    );

    if (heroEl) {
      nav.classList.toggle(
        "over-hero",
        window.scrollY <
          heroEl.offsetHeight - 88
      );
    }

    let onInk = false;

    document
      .querySelectorAll(".hero, .section-ink, footer")
      .forEach((section) => {
        const rect =
          section.getBoundingClientRect();

        if (rect.top <= 64 && rect.bottom >= 64) {
          onInk = true;
        }
      });

    nav.classList.toggle("on-ink", onInk);
  }

  const doc =
    document.documentElement;

  const scrollable =
    doc.scrollHeight - window.innerHeight;

  const pct =
    scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

  if (progressBar) {

    progressBar.style.width =
      `${Math.min(100, Math.max(0, pct))}%`;

  }

}


document.addEventListener(
  "scroll",
  onScroll,
  { passive: true }
);

onScroll();


/* ==========================================================================
   GENTLE HERO PARALLAX
   ========================================================================== */

if (!reduceMotion) {

  const art =
    document.querySelector(".hero-art");


  if (art) {

    document.addEventListener(
      "scroll",
      () => {

        const y =
          window.scrollY;

        if (y < window.innerHeight) {

          art.style.transform =
            `translateY(${y * 0.14}px)`;

        }

      },
      { passive: true }
    );

  }

}


/* ==========================================================================
   CREAMY WHEEL-SCROLL SMOOTHING
   DESKTOP TRACKPAD / MOUSE ONLY

   This is the existing smooth scrolling behavior.
   ========================================================================== */

if (
  !reduceMotion &&
  matchMedia("(pointer: fine)").matches
) {

  let targetY =
    window.scrollY;

  let currentY =
    window.scrollY;

  let animating =
    false;


  const maxScrollY = () =>
    document.documentElement.scrollHeight -
    window.innerHeight;


  function wheelStep() {

    currentY +=
      (targetY - currentY) * 0.12;


    if (
      Math.abs(targetY - currentY) < 0.4
    ) {

      currentY =
        targetY;

      animating =
        false;

    }


    window.scrollTo(
      0,
      currentY
    );


    if (animating) {

      requestAnimationFrame(
        wheelStep
      );

    }

  }


  window.addEventListener(
    "wheel",
    (event) => {

      event.preventDefault();


      targetY =
        Math.min(
          Math.max(
            0,
            targetY + event.deltaY
          ),
          maxScrollY()
        );


      if (!animating) {

        animating =
          true;

        requestAnimationFrame(
          wheelStep
        );

      }

    },
    {
      passive: false
    }
  );


  window.addEventListener(
    "scroll",
    () => {

      if (!animating) {

        targetY =
          window.scrollY;

        currentY =
          window.scrollY;

      }

    },
    {
      passive: true
    }
  );

}


/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

const menuBtn =
  document.getElementById("menuBtn");

const navLinks =
  document.querySelector(".nav-links");


if (menuBtn && navLinks) {

  menuBtn.addEventListener(
    "click",
    () => {

      const isOpen =
        navLinks.style.display === "flex";


      navLinks.style.cssText =
        isOpen
          ? ""
          : `
            display:flex;
            flex-direction:column;
            position:fixed;
            top:74px;
            left:0;
            right:0;
            background:var(--paper);
            padding:22px 8vw;
            gap:18px;
            border-bottom:2px solid var(--ink);
          `;


      menuBtn.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

    }
  );

}


/* ==========================================================================
   REVEAL ON SCROLL + HANKO STAMP
   ========================================================================== */

const revealEls =
  document.querySelectorAll(".reveal");

const hankoEls =
  document.querySelectorAll(
    ".hanko:not(.stamped)"
  );


if (reduceMotion) {

  revealEls.forEach(
    (el) =>
      el.classList.add("visible")
  );

  hankoEls.forEach(
    (el) =>
      el.classList.add("stamped")
  );


} else {

  const io =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );

              io.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.16,
        rootMargin:
          "0px 0px -8% 0px"
      }
    );


  revealEls.forEach(
    (el, index) => {

      el.style.transitionDelay =
        `${(index % 4) * 70}ms`;

      io.observe(el);

    }
  );


  const hankoIo =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "stamped"
              );

              hankoIo.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.6
      }
    );


  hankoEls.forEach(
    (el) =>
      hankoIo.observe(el)
  );


  window.revealObservers =
    { io, hankoIo };

}


/* ==========================================================================
   CREAMY EASED IN-PAGE SCROLLING
   ========================================================================== */

function easeInOutQuint(t) {

  return t < 0.5
    ? 16 *
        t *
        t *
        t *
        t *
        t
    : 1 -
        Math.pow(
          -2 * t + 2,
          5
        ) /
          2;

}


function creamyScrollTo(
  targetY,
  duration = 1300
) {

  const startY =
    window.scrollY;

  const distance =
    targetY - startY;

  const startTime =
    performance.now();


  function step(now) {

    const elapsed =
      Math.min(
        1,
        (now - startTime) /
          duration
      );


    const eased =
      easeInOutQuint(
        elapsed
      );


    window.scrollTo(
      0,
      startY +
        distance * eased
    );


    if (elapsed < 1) {

      requestAnimationFrame(
        step
      );

    }

  }


  requestAnimationFrame(
    step
  );

}


/* ==========================================================================
   ANCHOR LINKS
   ========================================================================== */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const id =
          link.getAttribute("href");


        if (
          !id ||
          id.length < 2
        ) {

          return;

        }


        const targetEl =
          document.querySelector(id);


        if (!targetEl) {

          return;

        }


        event.preventDefault();


        const y =
          targetEl.getBoundingClientRect()
            .top +
          window.scrollY -
          12;


        if (reduceMotion) {

          window.scrollTo(
            0,
            y
          );

        } else {

          creamyScrollTo(
            y,
            1300
          );

        }


        if (
          navLinks &&
          navLinks.style.display ===
            "flex"
        ) {

          navLinks.style.display =
            "";

          if (menuBtn) {

            menuBtn.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        }

      }
    );

  });


/* ==========================================================================
   COPY ADDRESS
   ========================================================================== */

const copyAddressBtn =
  document.getElementById(
    "copyAddressBtn"
  );


if (copyAddressBtn) {

  copyAddressBtn.addEventListener(
    "click",
    async (event) => {

      try {

        await navigator.clipboard.writeText(
          CONFIG.exactAddress
        );


        const btn =
          event.currentTarget;

        const original =
          btn.textContent;


        btn.textContent =
          "Copied";


        setTimeout(
          () => {

            btn.textContent =
              original;

          },
          1800
        );


      } catch (error) {

        /* Clipboard unavailable */

      }

    }
  );

}


/* ==========================================================================
   END
   ========================================================================== */