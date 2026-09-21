/* ==========================================================================
   JS MEN'S PG HOSTEL — ROOM CATALOGUE
   Loaded after script.js. Reuses CONFIG / baseWhatsAppUrl / reveal system.
   One shared implementation used by both index.html (#catalogue) and
   rooms.html. No cart, no multi-room selection: each room is viewed and
   enquired about independently.
   ========================================================================== */

(function () {

  "use strict";


  /* ------------------------------------------------------------------
     ROOM DATA — the single source of truth.
     Only information confirmed by the owner / supplied catalogue.
     Nothing is invented: unknown fields stay null and are rendered
     as "Details on enquiry". images[] stays empty until real photos
     are supplied — frames render as reserved placeholders.
     ------------------------------------------------------------------ */

  const ROOMS = [
    {
      id: "4-sharing",
      name: "4 Sharing Room",
      price: 8000,
      deposit: 10000,
      type: "4 Sharing",
      images: [],
      facilities: [
        "Wooden cot with bed and pillow",
        "Attached restroom",
        "Smart TV, geyser, and air conditioning",
        "Individual steel and wooden wardrobes",
        "CCTV surveillance and Face ID entry",
        "Daily housekeeping",
        "Sofa, high-speed unlimited Wi-Fi, refrigerator, washing machine",
        "Basic cooking utensils and Dining area",
        "Covered parking space"
      ]
    },
    {
      id: "3-sharing",
      name: "3 sharing",
      price: 8000,
      deposit: 10000,
      type: "3 Sharing",
      images: [],
      facilities: [
        "Wooden cot with bed and pillow",
        "Attached restroom",
        "Smart TV, geyser, and air conditioning",
        "Individual steel and wooden wardrobes",
        "CCTV surveillance and Face ID entry",
        "Daily housekeeping",
        "Sofa, high-speed unlimited Wi-Fi, refrigerator, washing machine",
        "Basic cooking utensils and Dining area",
        "Covered parking space"
      ]
    },
    {
      id: "2-sharing-plus",
      name: "2 Sharing Plus",
      price: 10500,
      deposit: 15000,
      type: "2 Sharing",
      images: [],
      facilities: ["Fully furnished"]
    },
    {
      id: "2-sharing",
      name: "2 Sharing",
      price: 9500,
      deposit: null,
      type: "2 Sharing",
      images: [],
      facilities: []
    },
    {
      id: "3-sharing-plus",
      name: "3 Sharing Plus",
      price: 9000,
      deposit: 15000,
      type: "3 Sharing",
      images: [],
      facilities: ["Fully furnished"]
    },
    {
      id: "executive-1bhk-unit-1",
      name: "Executive 1BHK Unit-1",
      price: 7500,
      deposit: null,
      type: "1 BHK",
      images: [],
      facilities: []
    },
    {
      id: "1bhk-unit-2",
      name: "1 BHK Unit-2",
      price: 8500,
      deposit: null,
      type: "1 BHK",
      images: [],
      facilities: []
    }
  ];


  const roomById = (id) =>
    ROOMS.find((room) => room.id === id);


  const formatPrice = (n) =>
    "₹" + Number(n).toLocaleString("en-IN");


  /* ------------------------------------------------------------------
     WHATSAPP + PHONE — always about ONE specific room
     ------------------------------------------------------------------ */

  function roomEnquiryUrl(room) {
    const text =
      `Hello, I am interested in the ${room.name} room at JS Men's PG Hostel.\n\n` +
      `Monthly Rent: ${formatPrice(room.price)}\n\n` +
      "Please let me know the current availability and further details.";

    return baseWhatsAppUrl(text);
  }

  /* Call Now renders whenever a phone number is configured. */
  const phone =
    typeof CONFIG !== "undefined" && CONFIG.phone
      ? CONFIG.phone
      : null;


  /* ------------------------------------------------------------------
     SMALL HELPERS
     ------------------------------------------------------------------ */

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* hook dynamically-created elements into the existing reveal system */
  function revealHookup(root) {
    const obs = window.revealObservers;

    root.querySelectorAll(".reveal").forEach((node) => {
      if (obs && obs.io) {
        obs.io.observe(node);
      } else {
        node.classList.add("visible");
      }
    });

    root.querySelectorAll(".hanko:not(.stamped)").forEach((node) => {
      if (obs && obs.hankoIo) {
        obs.hankoIo.observe(node);
      } else {
        node.classList.add("stamped");
      }
    });
  }

  /* reserved-photo frame, matching the existing polaroid placeholder look */
  function photoFrame(label) {
    const frame = el("div", "room-frame");
    frame.appendChild(el("span", null, label));
    return frame;
  }

  function depositLine(room) {
    return room.deposit != null
      ? `Security deposit: ${formatPrice(room.deposit)}`
      : "Security deposit: details on enquiry";
  }


  /* ------------------------------------------------------------------
     CATALOGUE CARDS
     ------------------------------------------------------------------ */

  const roomGrid = document.getElementById("roomGrid");

  function renderCatalogue() {
    if (!roomGrid) return;

    roomGrid.innerHTML = "";

    ROOMS.forEach((room, index) => {
      const card = el("article", "room-card reveal");
      card.style.setProperty("--rot", `${index % 2 === 0 ? -1.2 : 1.4}deg`);

      const figure = el("figure", "room-photo");
      if (room.images.length) {
        const img = document.createElement("img");
        img.src = room.images[0];
        img.alt = room.name;
        img.loading = "lazy";
        figure.appendChild(img);
      } else {
        figure.appendChild(photoFrame(`photograph reserved — ${room.name}`));
      }

      const body = el("div", "room-body");

      const num = el("span", "room-num brush", String(index + 1).padStart(2, "0"));
      const name = el("h3", null, room.name);

      const price = el("p", "room-price");
      price.appendChild(el("b", null, formatPrice(room.price)));
      price.appendChild(el("span", null, " / month"));

      const specs = el("ul", "room-specs");
      specs.appendChild(el("li", null, room.type));
      
      const shownFacilities = room.facilities.slice(0, 3);
      shownFacilities.forEach((f) =>
        specs.appendChild(el("li", null, f))
      );
      
      if (room.facilities.length > 3) {
        specs.appendChild(el("li", "muted", `+ ${room.facilities.length - 3} more inside`));
      }
      
      specs.appendChild(el("li", "muted", depositLine(room)));

      const actions = el("div", "room-actions");

      const details = el("a", "btn room-details", "View room");
      details.href = `#${room.id}`;

      actions.appendChild(details);

      body.appendChild(num);
      body.appendChild(name);
      body.appendChild(price);
      body.appendChild(specs);
      body.appendChild(actions);

      card.appendChild(figure);
      card.appendChild(body);
      roomGrid.appendChild(card);
    });

    revealHookup(roomGrid);
  }


  /* ------------------------------------------------------------------
     ROOM DETAIL (hash-routed)
     ------------------------------------------------------------------ */

  const detailSection = document.getElementById("roomDetail");
  const detailBody = document.getElementById("detailBody");
  const detailBack = document.getElementById("detailBack");

  /* the torn divider directly above the detail section only makes sense
     while the detail is visible — hide/show them together */
  const detailTorn =
    detailSection &&
    detailSection.previousElementSibling &&
    detailSection.previousElementSibling.classList.contains("torn")
      ? detailSection.previousElementSibling
      : null;

  function renderDetail(room) {
    if (!detailBody) return;

    detailBody.innerHTML = "";

    const mark = el("div", "section-mark reveal");
    mark.innerHTML =
      '<div class="hanko"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26"/></svg><span>室</span></div>';
    mark.appendChild(el("span", "tag", room.type));

    const title = el("h2", "reveal", room.name);

    const grid = el("div", "detail-grid reveal");

    /* photo column — hero frame + reserved strip */
    const photoCol = el("div", "detail-photo");
    const main = el("div", "detail-main-photo");
    if (room.images.length) {
      const img = document.createElement("img");
      img.src = room.images[0];
      img.alt = room.name;
      main.appendChild(img);
    } else {
      main.appendChild(photoFrame("main photograph reserved"));
    }
    photoCol.appendChild(main);

    const strip = el("div", "detail-strip");
    (room.images.length ? room.images.slice(1) : [null, null]).forEach(() => {
      strip.appendChild(photoFrame("photo reserved"));
    });
    photoCol.appendChild(strip);

    /* info column */
    const infoCol = el("div", "detail-info");

    const priceLine = el("p", "room-price");
    priceLine.appendChild(el("b", null, formatPrice(room.price)));
    priceLine.appendChild(el("span", null, " / month"));
    infoCol.appendChild(priceLine);

    const facts = el("dl", "detail-facts");
    const rows = [
      ["Room type", room.type],
      ["Security deposit", room.deposit != null ? formatPrice(room.deposit) : "Details on enquiry"],
      ["Furnishing", room.facilities.length ? room.facilities.join(", ") : "Details on enquiry"]
    ];
    rows.forEach(([label, value]) => {
      facts.appendChild(el("dt", null, label));
      facts.appendChild(el("dd", null, value));
    });
    infoCol.appendChild(facts);

    const note = el("p", "detail-note");
    note.textContent =
      "Photographs and any further specifics are confirmed on enquiry — nothing here is guessed.";
    infoCol.appendChild(note);

    const actions = el("div", "detail-actions");

    const wa = el("a", "btn btn-solid", "Enquire on WhatsApp");
    wa.href = roomEnquiryUrl(room);
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    actions.appendChild(wa);

    if (phone) {
      const call = el("a", "btn", "Call now");
      call.href = `tel:${phone}`;
      actions.appendChild(call);
    }

    infoCol.appendChild(actions);

    grid.appendChild(photoCol);
    grid.appendChild(infoCol);

    detailBody.appendChild(mark);
    detailBody.appendChild(title);
    detailBody.appendChild(grid);

    revealHookup(detailBody);
  }

  const defaultTitle = document.title;
  let lastRoutedHash = null;

  function route() {
    if (!detailSection || !detailBody) return;

    const hash = decodeURIComponent(location.hash.replace("#", "")).trim();
    const room = hash ? roomById(hash) : null;
    const changed = hash !== lastRoutedHash;
    lastRoutedHash = hash;

    if (room) {
      renderDetail(room);
      detailSection.hidden = false;
      if (detailTorn) detailTorn.hidden = false;
      if (detailBack) detailBack.href = location.pathname;
      document.title = `${room.name} — JS Mens PG Hostel`;
      if (changed) {
        requestAnimationFrame(() => {
          window.scrollTo(0, Math.max(0, detailSection.offsetTop - 12));
        });
      }
    } else {
      const wasDetail = detailSection.hidden === false;
      detailSection.hidden = true;
      if (detailTorn) detailTorn.hidden = true;
      detailBody.innerHTML = "";
      document.title = defaultTitle;
      if (changed && wasDetail) {
        requestAnimationFrame(() => {
          const catalogue = document.getElementById("catalogue");
          const y = catalogue ? catalogue.offsetTop - 12 : 0;
          window.scrollTo(0, Math.max(0, y));
        });
      }
    }
  }


  /* ------------------------------------------------------------------
     GLOBAL CLICK DELEGATION — View room / Back, without page reloads
     ------------------------------------------------------------------ */

  document.addEventListener("click", (event) => {
    if (!detailSection) return;

    const detailsLink = event.target.closest(".room-details");
    if (detailsLink) {
      event.preventDefault();
      const id = detailsLink.getAttribute("href").split("#")[1];
      history.pushState(null, "", `#${id}`);
      route();
      return;
    }

    const backLink = event.target.closest(".detail-back");
    if (backLink) {
      event.preventDefault();
      history.pushState(null, "", location.pathname + location.search);
      route();
    }
  });


  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */

  renderCatalogue();
  route();

  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);

})();
