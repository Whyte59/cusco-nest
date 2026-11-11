/* ==========================================================================
   CUSCO NEST — interações do site
   ========================================================================== */

(function () {
  "use strict";

  var WHATSAPP = "51930284598";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isEnglish = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;
  var MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header ao rolar ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu móvel ---------- */
  var menu = document.getElementById("mobileMenu");
  var menuToggle = document.getElementById("menuToggle");
  var menuClose = document.getElementById("menuClose");
  var body = document.body;

  function openMenu() {
    if (!menu) return;
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    body.classList.add("no-scroll");
    if (menuClose) menuClose.focus();
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("no-scroll");
    if (menuToggle) menuToggle.focus();
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("no-scroll");
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("open")) closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1080 && menu && menu.classList.contains("open")) closeMenu();
  });

  /* ---------- Revelar ao rolar ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Contadores ---------- */
  function formatNumber(value, decimals) {
    var fixed = value.toFixed(decimals);
    return isEnglish ? fixed : fixed.replace(".", ",");
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = formatNumber(target, decimals);
      return;
    }

    var duration = 1500;
    var start = performance.now();

    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(target * eased, decimals);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.65 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Reserva via WhatsApp ---------- */
  var form = document.getElementById("bookingForm");
  var checkin = document.getElementById("checkin");
  var checkout = document.getElementById("checkout");
  var guests = document.getElementById("guests");

  function pad(n) { return String(n).padStart(2, "0"); }

  function toISO(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function addDays(date, days) {
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (isEnglish) {
      var month = MONTHS_EN[parseInt(parts[1], 10) - 1] || parts[1];
      return parseInt(parts[2], 10) + " " + month + " " + parts[0];
    }
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  if (form && checkin && checkout) {
    var today = new Date();
    var tomorrow = addDays(today, 1);
    var dayAfter = addDays(today, 2);

    checkin.min = toISO(today);
    checkout.min = toISO(tomorrow);
    checkin.value = toISO(tomorrow);
    checkout.value = toISO(dayAfter);

    checkin.addEventListener("change", function () {
      checkout.min = checkin.value;
      if (!checkout.value || checkout.value <= checkin.value) {
        checkout.value = toISO(addDays(new Date(checkin.value + "T12:00:00"), 1));
      }
      checkout.setCustomValidity("");
    });

    checkout.addEventListener("change", function () {
      checkout.setCustomValidity("");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!checkin.value || !checkout.value) return;

      if (checkout.value <= checkin.value) {
        checkout.setCustomValidity(isEnglish
          ? "The check-out date must be after the check-in date."
          : "La fecha de check-out debe ser posterior a la fecha de check-in.");
        checkout.reportValidity();
        return;
      }

      var guestLabel = guests ? guests.options[guests.selectedIndex].text : (isEnglish ? "2 guests" : "2 huéspedes");
      var message = isEnglish
        ? "Hi! I'd like to check availability at Cusco Nest.\n\n" +
          "Check-in: " + formatDate(checkin.value) + "\n" +
          "Check-out: " + formatDate(checkout.value) + "\n" +
          "Guests: " + guestLabel
        : "¡Hola! Me gustaría verificar la disponibilidad en Cusco Nest.\n\n" +
          "Check-in: " + formatDate(checkin.value) + "\n" +
          "Check-out: " + formatDate(checkout.value) + "\n" +
          "Huéspedes: " + guestLabel;

      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message), "_blank", "noopener");
    });
  }

  /* ---------- Galeria / lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbCount = document.getElementById("lbCount");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentIndex = 0;
  var lastFocused = null;

  function renderLightbox(index) {
    if (!galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    var trigger = galleryItems[currentIndex];
    var full = trigger.getAttribute("data-full");
    var caption = trigger.getAttribute("data-caption") || "";
    lbImg.src = full;
    lbImg.alt = caption;
    lbCap.textContent = caption;
    lbCount.textContent = (currentIndex + 1) + " / " + galleryItems.length;
  }

  function openLightbox(index, trigger) {
    if (!lightbox) return;
    lastFocused = trigger || galleryItems[index];
    renderLightbox(index);
    lightbox.hidden = false;
    body.classList.add("no-scroll");
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () { openLightbox(index, item); });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { renderLightbox(currentIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { renderLightbox(currentIndex + 1); });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") renderLightbox(currentIndex + 1);
    if (e.key === "ArrowLeft") renderLightbox(currentIndex - 1);
  });

  /* ---------- FAQ: uma resposta por vez ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
