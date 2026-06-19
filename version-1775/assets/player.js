(function () {
  function setupMoviePlayer(source) {
    var video = document.querySelector(".movie-video");
    var overlay = document.querySelector(".play-overlay");
    var started = false;
    var hlsInstance = null;

    function bindSource() {
      if (!video || started) {
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      if (!video) {
        return;
      }
      bindSource();
      if (overlay) {
        overlay.classList.add("hidden");
      }
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("hidden");
        }
      });
    }

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
