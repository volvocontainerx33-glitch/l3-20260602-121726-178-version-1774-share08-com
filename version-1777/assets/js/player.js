(function () {
  function initMoviePlayer(sourceUrl) {
    var video = document.querySelector("[data-player-video]");
    var overlay = document.querySelector("[data-player-overlay]");
    var button = document.querySelector("[data-player-button]");
    var errorBox = document.querySelector("[data-player-error]");
    var hls = null;
    var started = false;

    if (!video || !sourceUrl) {
      return;
    }

    function showError() {
      if (errorBox) {
        errorBox.textContent = "播放暂时不可用，请稍后重试。";
        errorBox.classList.add("is-visible");
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    }

    function playNative() {
      video.src = sourceUrl;
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(showError);
      }
    }

    function startPlayback() {
      hideOverlay();

      if (started) {
        var repeatPromise = video.play();

        if (repeatPromise && typeof repeatPromise.catch === "function") {
          repeatPromise.catch(showError);
        }

        return;
      }

      started = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });

        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          var playPromise = video.play();

          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(showError);
          }
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }

          showError();
          hls.destroy();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        playNative();
      } else {
        showError();
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        startPlayback();
      });
    }

    video.addEventListener("play", function () {
      if (!started) {
        startPlayback();
      } else {
        hideOverlay();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
