(function () {
  var cachedHls = null;

  function getVideo(container) {
    return container ? container.querySelector("video") : null;
  }

  function getOverlay(container) {
    return container ? container.querySelector(".play-overlay") : null;
  }

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (cachedHls) {
      return Promise.resolve(cachedHls);
    }
    return import("./hls-vendor-dru42stk.js").then(function (module) {
      cachedHls = module.H;
      return cachedHls;
    });
  }

  window.initPlayer = function (playerId, streamUrl) {
    var container = document.getElementById(playerId);
    var video = getVideo(container);
    var overlay = getOverlay(container);
    var hlsInstance = null;
    var prepared = false;

    if (!container || !video || !overlay || !streamUrl) {
      return;
    }

    function hideOverlay() {
      overlay.classList.add("is-hidden");
    }

    function showOverlay() {
      overlay.classList.remove("is-hidden");
    }

    function attachNative() {
      video.src = streamUrl;
      return Promise.resolve();
    }

    function attachHls() {
      return loadHls().then(function (HlsClass) {
        if (HlsClass && HlsClass.isSupported && HlsClass.isSupported()) {
          hlsInstance = new HlsClass({
            autoStartLoad: true,
            capLevelToPlayerSize: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          return;
        }
        video.src = streamUrl;
      }).catch(function () {
        video.src = streamUrl;
      });
    }

    function prepare() {
      if (prepared) {
        return Promise.resolve();
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        return attachNative();
      }
      return attachHls();
    }

    function play() {
      hideOverlay();
      prepare().then(function () {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            showOverlay();
          });
        }
      });
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (!prepared || video.paused) {
        play();
      }
    });
    video.addEventListener("play", hideOverlay);
    video.addEventListener("ended", showOverlay);
    window.addEventListener("beforeunload", function () {
      if (hlsInstance && hlsInstance.destroy) {
        hlsInstance.destroy();
      }
    });
  };
})();
