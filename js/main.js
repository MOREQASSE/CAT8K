(function () {
  "use strict";

  /* ---------- nav state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          countObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".m-num").forEach(function (el) { countObs.observe(el); });

  /* ---------- ticker duplication for seamless loop ---------- */
  var tick = document.getElementById("tickerTrack");
  if (tick) {
    tick.innerHTML += tick.innerHTML;
  }

  /* ---------- hero feed typing ---------- */
  var feedLog = document.getElementById("feedLog");
  var feedLines = [
    "GET /restconf/data/ietf-interfaces",
    "→ 200 OK · 18 interfaces",
    "if-status  Gi0/0/0   up/up",
    "if-status  Gi0/0/1   up/up",
    "arp-rows   3 · bgp-peers 2 · ospf 2",
    "cpu 34% · mem 62% · snap #418",
    "audit-scan 16 policies → 14 pass",
    "compliance-score 69 / 100",
    "provision add-branch BR-2 ... done",
    "ledger +1 entry · hash verified",
    "vault locked · creds never persisted"
  ];
  var li = 0, ci = 0, line = "";
  var typing = true;

  function typeLoop() {
    if (!feedLog) return;
    line = feedLines[li];
    if (typing) {
      ci++;
      feedLog.textContent = line.slice(0, ci) + "\n▮";
      if (ci >= line.length) { typing = false; setTimeout(typeLoop, 900); }
      else setTimeout(typeLoop, 16 + Math.random() * 40);
    } else {
      ci = 0; typing = true; li = (li + 1) % feedLines.length;
      setTimeout(typeLoop, 320);
    }
  }
  setTimeout(typeLoop, 900);

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");

  function openLb(src, cap) {
    lbImg.src = src;
    lbCap.textContent = cap;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
    lbImg.src = "";
  }
  document.querySelectorAll(".g-item").forEach(function (item) {
    item.addEventListener("click", function () {
      openLb(item.getAttribute("data-src"), item.getAttribute("data-cap"));
    });
  });
  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lb.hidden) closeLb();
  });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-locked", open);
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && menu.classList.contains("open")) setMenu(false);
    });
  }

  /* ---------- smooth anchor offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (menu && menu.classList.contains("open")) setMenu(false);
      var top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();