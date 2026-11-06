/* ==========================================================================
   JS MEN'S PG HOSTEL — ROOM CATALOGUE
   Loaded after script.js on both index.html and rooms.html.
   Reuses CONFIG / baseWhatsAppUrl from script.js.
   Single source of truth for room data: the ROOMS array below.
   Renders the horizontal carousel cards + the hash-routed detail view.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     ROOM DATA — verified business information. Prices, deposits, types
     and facilities are preserved exactly; only genuine property photos
     supplied in /assets are attached. Rooms without a dedicated genuine
     photo keep an empty images[] and render a clean neutral frame.
     ------------------------------------------------------------------ */

  const ROOMS = [
    {
      id: "4-sharing",
      name: "4 Sharing Room",
      price: 8000,
      deposit: 10000,
      type: "4 Sharing",
      images: [
        { src: "assets/4_sharing_main.webp", alt: "4 sharing men's PG room at JS Mens PG Hostel, Ramapuram, Chennai — beds, wardrobes and attached washbasin" },
        { src: "assets/4_sharing_angle.webp", alt: "4 sharing room angle showing wooden cots, steel wardrobes and wall-mounted TV" },
        { src: "assets/4_sharing_sink.webp", alt: "Attached washbasin and mirror inside the 4 sharing room bathroom" }
      ],
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
      images: [
        { src: "assets/gallery_rooms.webp", alt: "3 sharing men's PG room with three furnished beds and wall cupboards at JS Mens PG, Ramapuram" }
      ],
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
      images: [
        { src: "assets/rest_easy.webp", alt: "Furnished 2 sharing plus men's PG room with air conditioning and wall-mounted TV at JS Mens PG" }
      ],
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

  const roomById = (id) => ROOMS.find((room) => room.id === id);

  const formatPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");

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

  const phone =
    typeof CONFIG !== "undefined" && CONFIG.phone ? CONFIG.phone : null;

  /* ------------------------------------------------------------------
     SMALL HELPERS
     ------------------------------------------------------------------ */

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function svgIcon(path, cls) {
    const wrap = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    wrap.setAttribute("viewBox", "0 0 24 24");
    wrap.setAttribute("fill", "none");
    wrap.setAttribute("stroke", "currentColor");
    wrap.setAttribute("stroke-width", "2");
    wrap.setAttribute("stroke-linecap", "round");
    wrap.setAttribute("stroke-linejoin", "round");
    if (cls) wrap.setAttribute("class", cls);
    wrap.innerHTML = path;
    return wrap;
  }

  const WA_ICON =
    '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.36A10 10 0 1 0 12 2z" stroke="none" fill="currentColor"/><path d="M8.5 8.5c0 3 2.5 5.5 5.5 5.5.6 0 1.2-.5 1.2-1.1 0-.4-.9-.8-1.3-1-.3-.1-.6.2-.8.4-.5-.2-1.4-1.1-1.6-1.6.2-.2.5-.5.4-.8-.2-.4-.6-1.3-1-1.3-.6 0-1.1.6-1.1 1.2" stroke="none" fill="#fff"/>';

  const CHECK_ICON = '<polyline points="20 6 9 17 4 12"/>';
  const ARROW_ICON = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';

  /* hook dynamically-created elements into the reveal system */
  function revealHookup(root) {
    const obs = window.revealObservers;
    root.querySelectorAll(".reveal").forEach((node) => {
      if (obs && obs.io) obs.io.observe(node);
      else node.classList.add("is-visible");
    });
  }

  function depositLine(room) {
    return room.deposit != null
      ? `Deposit: ${formatPrice(room.deposit)}`
      : "Deposit: details on enquiry";
  }

  /* neutral photo area (no fake image, no text) */
  function neutralPhoto() {
    const box = el("div", "no-photo");
    box.appendChild(
      svgIcon(
        '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
        "ico"
      )
    );
    return box;
  }

  /* ------------------------------------------------------------------
     CARDS
     ------------------------------------------------------------------ */

  const roomGrid = document.getElementById("roomGrid");

  function renderCatalogue() {
    if (!roomGrid) return;
    roomGrid.innerHTML = "";

    ROOMS.forEach((room) => {
      const card = el("article", "room-card");

      const figure = el("div", "room-card__photo");
      if (room.images.length) {
        const img = document.createElement("img");
        img.src = room.images[0].src;
        img.alt = room.images[0].alt;
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 800;
        img.height = 600;
        figure.appendChild(img);
      } else {
        figure.appendChild(neutralPhoto());
      }

      const body = el("div", "room-card__body");
      body.appendChild(el("span", "room-card__type", room.type));
      body.appendChild(el("h3", "room-card__name", room.name));

      const price = el("p", "room-card__price");
      price.appendChild(el("b", null, formatPrice(room.price)));
      price.appendChild(el("span", null, " / month"));
      body.appendChild(price);
      body.appendChild(el("p", "room-card__deposit", depositLine(room)));

      const foot = el("div", "room-card__foot");
      const details = el("a", "btn btn--ghost btn--sm room-details", "View Details");
      details.href = `room.html?room=${encodeURIComponent(room.id)}`;
      foot.appendChild(details);

      const wa = el("a", "icon-btn");
      wa.href = roomEnquiryUrl(room);
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.setAttribute("aria-label", `Enquire about ${room.name} on WhatsApp`);
      wa.appendChild(svgIcon(WA_ICON));
      foot.appendChild(wa);

      body.appendChild(foot);
      card.appendChild(figure);
      card.appendChild(body);
      roomGrid.appendChild(card);
    });

    revealHookup(roomGrid);
  }

  /* ------------------------------------------------------------------
     DETAIL (hash-routed)
     ------------------------------------------------------------------ */

  const detailSection = document.getElementById("roomDetail");
  const detailBody = document.getElementById("detailBody");
  const detailBack = document.getElementById("detailBack");

  function renderDetail(room) {
    if (!detailBody) return;
    detailBody.innerHTML = "";

    const wrap = el("div", "room-detail");

    const grid = el("div", "detail-grid");

    /* photo column */
    const photoCol = el("div", "detail-gallery");
    const main = el("div", "main");
    const thumbs = el("div", "thumbs");

    if (room.images.length) {
      const mainImg = document.createElement("img");
      mainImg.src = room.images[0].src;
      mainImg.alt = room.images[0].alt;
      mainImg.decoding = "async";
      main.appendChild(mainImg);

      room.images.forEach((im, i) => {
        const btn = el("button");
        btn.type = "button";
        if (i === 0) btn.classList.add("is-active");
        btn.setAttribute("aria-label", `Show photo ${i + 1} of ${room.name}`);
        const t = document.createElement("img");
        t.src = im.src;
        t.alt = "";
        t.loading = "lazy";
        t.decoding = "async";
        btn.appendChild(t);
        btn.addEventListener("click", () => {
          mainImg.src = im.src;
          mainImg.alt = im.alt;
          thumbs.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
        });
        thumbs.appendChild(btn);
      });
    } else {
      const box = el("div", "no-photo");
      box.appendChild(svgIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>', "ico"));
      main.appendChild(box);
    }

    photoCol.appendChild(main);
    if (room.images.length > 1) photoCol.appendChild(thumbs);

    /* info column */
    const infoCol = el("div", "detail-info");
    infoCol.appendChild(el("span", "room-card__type", room.type));
    infoCol.appendChild(el("h2", null, room.name));
    infoCol.appendChild(
      el("p", "detail-price", `${formatPrice(room.price)} / month`)
    );

    const facts = el("dl", "detail-facts");
    const rows = [
      ["Room type", room.type],
      ["Security deposit", room.deposit != null ? formatPrice(room.deposit) : "Details on enquiry"],
      ["Furnishing", room.facilities.length ? "Furnished" : "Details on enquiry"]
    ];
    rows.forEach(([label, value]) => {
      const row = el("div", "row");
      row.appendChild(el("dt", null, label));
      row.appendChild(el("dd", null, value));
      facts.appendChild(row);
    });
    infoCol.appendChild(facts);

    if (room.facilities.length) {
      infoCol.appendChild(el("h3", null, "Room facilities"));
      const list = el("ul", "facility-list");
      room.facilities.forEach((f) => {
        const li = el("li");
        li.appendChild(svgIcon(CHECK_ICON));
        li.appendChild(el("span", null, f));
        list.appendChild(li);
      });
      infoCol.appendChild(list);
    }

    const actions = el("div", "detail-actions");
    const wa = el("a", "btn btn--whatsapp");
    wa.href = roomEnquiryUrl(room);
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    wa.appendChild(svgIcon(WA_ICON));
    wa.appendChild(el("span", null, "Enquire on WhatsApp"));
    actions.appendChild(wa);

    if (phone) {
      const call = el("a", "btn btn--call", "Call now");
      call.href = `tel:${phone}`;
      actions.appendChild(call);
    }
    infoCol.appendChild(actions);

    grid.appendChild(photoCol);
    grid.appendChild(infoCol);
    wrap.appendChild(grid);
    detailBody.appendChild(wrap);

    revealHookup(wrap);
  }

  const defaultTitle = document.title;

  const isDetailPage = () =>
    document.body.hasAttribute("data-room-detail");

  function currentRoomId() {
    const params = new URLSearchParams(location.search);
    let id = (params.get("room") || "").trim();
    if (!id && location.hash) {
      id = decodeURIComponent(location.hash.replace("#", "")).trim();
    }
    return id;
  }

  function renderNotFound() {
    detailBody.innerHTML = "";
    const wrap = el("div", "room-detail");
    wrap.appendChild(el("h2", null, "Room not found"));
    wrap.appendChild(
      el("p", null, "Sorry, we couldn't find that room. Browse the full catalogue instead.")
    );
    const back = el("a", "btn btn--gold", "View all rooms");
    back.href = "rooms.html";
    wrap.appendChild(back);
    detailBody.appendChild(wrap);
  }

  function route() {
    if (!isDetailPage()) return;
    if (!detailSection || !detailBody) return;

    const room = roomById(currentRoomId());
    detailSection.hidden = false;
    if (detailBack) detailBack.href = "rooms.html";

    if (room) {
      renderDetail(room);
      document.title = `${room.name} — JS Mens PG Hostel`;
    } else {
      renderNotFound();
      document.title = defaultTitle;
    }
  }

  /* ------------------------------------------------------------------
     ENQUIRY DROPDOWN
     ------------------------------------------------------------------ */

  function populateRoomSelect() {
    const select = document.getElementById("roomSelect");
    if (!select) return;

    select.innerHTML = "";
    select.appendChild(el("option", null, "No specific room yet"));
    select.querySelector("option").value = "";

    ROOMS.forEach((room) => {
      const opt = el("option", null, `${room.name} — ${formatPrice(room.price)}/month`);
      opt.value = `${room.name} (Monthly rent ${formatPrice(room.price)})`;
      select.appendChild(opt);
    });
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */

  renderCatalogue();
  populateRoomSelect();
  route();

  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
})();
