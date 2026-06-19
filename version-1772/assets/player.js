import { H as LocalHls } from './hls-vendor-dru42stk.js';

const players = Array.from(document.querySelectorAll('[data-player]'));

players.forEach(function (container) {
  const video = container.querySelector('video');
  const cover = container.querySelector('.player-cover');
  const stream = video ? video.getAttribute('data-stream') : '';
  let hls = null;
  let ready = false;

  function attachStream() {
    if (!video || !stream || ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      ready = true;
      return;
    }

    const HlsPlayer = window.Hls || LocalHls;

    if (HlsPlayer && HlsPlayer.isSupported()) {
      hls = new HlsPlayer({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      ready = true;
    }
  }

  function startPlay() {
    attachStream();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    if (video) {
      video.controls = true;
      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }
  }

  if (cover) {
    cover.addEventListener('click', startPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!ready) {
        attachStream();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
});
