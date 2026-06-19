
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    initHero();
    initFilters();
    initPlayer();
  });

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }

    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        play();
      });
    });

    play();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
    panels.forEach(function (panel) {
      var input = panel.querySelector("[data-filter-input]");
      var year = panel.querySelector("[data-filter-year]");
      var type = panel.querySelector("[data-filter-type]");
      var list = panel.parentElement.querySelector("[data-filter-list]");
      if (!list) {
        return;
      }

      var items = Array.prototype.slice.call(list.children);

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var y = year ? year.value : "";
        var t = type ? type.value : "";

        items.forEach(function (item) {
          var text = (item.getAttribute("data-title") || "").toLowerCase();
          var itemYear = item.getAttribute("data-year") || "";
          var itemType = item.getAttribute("data-type") || "";
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (y && itemYear !== y) {
            ok = false;
          }
          if (t && itemType !== t) {
            ok = false;
          }
          item.classList.toggle("is-filter-hidden", !ok);
        });
      }

      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });
  }

  function initPlayer() {
    var shell = document.querySelector("[data-player-url]");
    if (!shell) {
      return;
    }

    var video = shell.querySelector("video");
    var button = shell.querySelector("[data-play-button]");
    var url = shell.getAttribute("data-player-url");
    var loaded = false;

    function loadVideo() {
      if (!video || !url) {
        return;
      }

      if (!loaded) {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else {
          video.src = url;
        }
        loaded = true;
      }

      if (button) {
        button.classList.add("is-hidden");
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", loadVideo);
    }

    shell.addEventListener("click", function (event) {
      if (event.target === video) {
        return;
      }
      loadVideo();
    });
  }
})();
