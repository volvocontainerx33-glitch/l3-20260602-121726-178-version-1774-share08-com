(function () {
  var mobileButton = document.querySelector("[data-mobile-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
      mobileButton.textContent = mobileNav.classList.contains("open") ? "×" : "☰";
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function cardText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-year"),
      card.getAttribute("data-type"),
      card.getAttribute("data-genre"),
      card.textContent
    ].join(" "));
  }

  function applyFilters(panel) {
    var scope = panel.closest("section") || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
    if (cards.length === 0) {
      cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    }

    var search = panel.querySelector("[data-search]");
    var region = panel.querySelector("[data-filter='region']");
    var type = panel.querySelector("[data-filter='type']");
    var year = panel.querySelector("[data-filter='year']");
    var query = normalize(search && search.value);
    var regionValue = normalize(region && region.value);
    var typeValue = normalize(type && type.value);
    var yearValue = normalize(year && year.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = cardText(card);
      var ok = true;
      if (query && text.indexOf(query) === -1) ok = false;
      if (regionValue && normalize(card.getAttribute("data-region")).indexOf(regionValue) === -1) ok = false;
      if (typeValue && normalize(card.getAttribute("data-type")).indexOf(typeValue) === -1) ok = false;
      if (yearValue && normalize(card.getAttribute("data-year")) !== yearValue) ok = false;
      card.classList.toggle("is-hidden", !ok);
      if (ok) visible += 1;
    });

    var count = panel.querySelector("[data-result-count]");
    if (count) {
      count.textContent = "显示 " + visible + " 部";
    }
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]")).forEach(function (panel) {
    Array.prototype.slice.call(panel.querySelectorAll("input, select")).forEach(function (control) {
      control.addEventListener("input", function () { applyFilters(panel); });
      control.addEventListener("change", function () { applyFilters(panel); });
    });
    applyFilters(panel);
  });

  Array.prototype.slice.call(document.querySelectorAll(".hero-search [data-search]")).forEach(function (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && input.value.trim()) {
        window.location.href = "./movies.html";
      }
    });
  });

  Array.prototype.slice.call(document.querySelectorAll("[data-hero-slider]")).forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var index = 0;

    function show(next) {
      if (slides.length === 0) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.classList.toggle("active", i === index); });
      dots.forEach(function (dot, i) { dot.classList.toggle("active", i === index); });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { show(i); });
    });

    if (slides.length > 1) {
      window.setInterval(function () { show(index + 1); }, 5200);
    }
  });

  function initPlayer(box) {
    var video = box.querySelector("[data-video]");
    var button = box.querySelector("[data-play]");
    var status = box.querySelector("[data-status]");
    var stream = box.getAttribute("data-stream");
    var loaded = false;
    var hls = null;

    function setStatus(text) {
      if (status) status.textContent = text || "";
    }

    function hideButton() {
      if (button) button.classList.add("is-hidden");
    }

    function showButton() {
      if (button) button.classList.remove("is-hidden");
    }

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          setStatus("点击画面继续播放");
          showButton();
        });
      }
    }

    function loadVideo() {
      if (!video || !stream) return;
      hideButton();
      setStatus("加载中...");

      if (loaded) {
        playVideo();
        return;
      }

      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus("");
          playVideo();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) return;
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setStatus("播放暂时无法加载，请稍后再试");
            showButton();
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        video.addEventListener("loadedmetadata", function () {
          setStatus("");
          playVideo();
        }, { once: true });
        video.load();
      } else {
        setStatus("播放暂时无法加载，请稍后再试");
        showButton();
      }
    }

    if (button) {
      button.addEventListener("click", loadVideo);
    }

    if (video) {
      video.addEventListener("play", hideButton);
      video.addEventListener("pause", showButton);
      video.addEventListener("click", function () {
        if (!loaded) {
          loadVideo();
        } else if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hls) hls.destroy();
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(initPlayer);
})();
