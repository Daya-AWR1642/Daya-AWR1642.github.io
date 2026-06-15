/* ============================================================
   News & Updates — single source of truth.
   To add an update: copy a block below, put it at the TOP of the
   list, and fill it in. Newest first.

   Fields:
     date    "YYYY-MM" or "YYYY-MM-DD"  (used for sorting)
     display "May 2026"                 (what visitors see)
     title   short headline
     text    one or two sentences
     image   "images/news/photo.jpg"    (optional — a single photo)
     images  ["a.jpg", "b.jpg"]         (optional — several photos)
     link    "https://..."              (optional — a "Read more" link)
   ============================================================ */

var NEWS = [
  {
    date: "2026-05",
    display: "May 2026",
    title: "Prof. Xiaoli Bai (Rutgers University) visited our lab",
    text: "It was wonderful to host Prof. Xiaoli Bai from the Department of Mechanical and Aerospace Engineering, Rutgers University, who presented her research on “Orbit Propagation and Estimation of Non-Cooperative Space Objects under Sensing Uncertainty” — covering Modified Chebyshev–Picard Iteration (MCPI) methods, physics-ML orbit prediction for space situational awareness, and trajectory planning for space manipulators.",
    images: ["images/news/xiaoli-bai-talk-1.jpg", "images/news/xiaoli-bai-talk-2.jpg"],
    link: ""
  },
  {
    date: "2026-03",
    display: "2026",
    title: "Started my Master's at the University of Chile",
    text: "Began my M.Sc. in Engineering Sciences (Electrical Engineering) at FCFM, University of Chile, under Prof. Martin Adams, funded by the U.S. Air Force Office of Scientific Research (AFOSR).",
    image: "",
    link: ""
  }
];

(function () {
  var groups = []; // each entry: array of image URLs, indexed by group id

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function imagesOf(n) {
    if (n.images && n.images.length) {
      return n.images.filter(function (s) { return s && s.trim() !== ""; });
    }
    if (n.image && n.image.trim() !== "") return [n.image];
    return [];
  }

  function thumb(src, alt, gi, idx) {
    return '<a class="news-thumb" href="' + esc(src) + '" data-lightbox' +
      ' data-group="' + gi + '" data-index="' + idx + '" aria-label="Open photo">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy"></a>';
  }

  function itemHTML(n, gi) {
    var imgs = imagesOf(n);
    var link = n.link && n.link.trim() !== ""
      ? '<a class="news-link" href="' + esc(n.link) + '" target="_blank" rel="noopener">Read more <i class="fas fa-arrow-right"></i></a>'
      : "";
    var body =
      '<div class="news-body">' +
        '<span class="news-date">' + esc(n.display) + '</span>' +
        '<h3 class="news-title">' + esc(n.title) + '</h3>' +
        '<p>' + esc(n.text) + '</p>' +
        link +
      '</div>';

    if (imgs.length === 0) {
      return '<article class="card news-item no-img">' + body + '</article>';
    }
    if (imgs.length === 1) {
      return '<article class="card news-item">' + thumb(imgs[0], n.title, gi, 0) + body + '</article>';
    }
    var gallery = '<div class="news-gallery">' +
      imgs.map(function (src, idx) { return thumb(src, n.title, gi, idx); }).join("") +
      '</div>';
    return '<article class="card news-item gallery">' + body + gallery + '</article>';
  }

  function render() {
    var sorted = NEWS.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    groups = sorted.map(imagesOf);

    document.querySelectorAll("[data-news]").forEach(function (box) {
      var limit = parseInt(box.getAttribute("data-limit"), 10);
      var items = isNaN(limit) ? sorted : sorted.slice(0, limit);
      box.innerHTML = items.length
        ? items.map(function (n, i) { return itemHTML(n, i); }).join("")
        : '<p class="news-empty">No updates yet.</p>';
    });
    setupLightbox();
  }

  function setupLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;

    var overlay = document.getElementById("lightbox");
    var state = { group: 0, index: 0 };

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "lightbox";
      overlay.className = "lightbox";
      overlay.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-nav prev" aria-label="Previous photo">&#8249;</button>' +
        '<img alt="">' +
        '<button class="lightbox-nav next" aria-label="Next photo">&#8250;</button>';
      document.body.appendChild(overlay);

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
          close();
        }
      });
      overlay.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
      overlay.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
      document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
      });
    }

    var img = overlay.querySelector("img");
    var prevBtn = overlay.querySelector(".prev");
    var nextBtn = overlay.querySelector(".next");

    function update() {
      var list = groups[state.group] || [];
      img.src = list[state.index] || "";
      var many = list.length > 1;
      prevBtn.style.display = many ? "" : "none";
      nextBtn.style.display = many ? "" : "none";
    }
    function step(dir) {
      var list = groups[state.group] || [];
      if (!list.length) return;
      state.index = (state.index + dir + list.length) % list.length;
      update();
    }
    function close() { overlay.classList.remove("open"); }

    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        state.group = parseInt(t.getAttribute("data-group"), 10) || 0;
        state.index = parseInt(t.getAttribute("data-index"), 10) || 0;
        update();
        overlay.classList.add("open");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
