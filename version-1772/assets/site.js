(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  document.querySelectorAll('.filter-panel').forEach(function (panel) {
    const target = document.querySelector(panel.getAttribute('data-target'));
    const search = panel.querySelector('.js-search');
    const buttons = Array.from(panel.querySelectorAll('[data-filter]'));
    let currentFilter = '全部';

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      if (!target) {
        return;
      }

      const keyword = normalize(search ? search.value : '');
      const filter = normalize(currentFilter);
      const cards = Array.from(target.querySelectorAll('[data-card]'));

      cards.forEach(function (card) {
        const haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));
        const matchedKeyword = !keyword || haystack.includes(keyword);
        const matchedFilter = filter === '全部'.toLowerCase() || haystack.includes(filter);
        card.classList.toggle('is-hidden-by-filter', !(matchedKeyword && matchedFilter));
      });
    }

    if (search) {
      search.addEventListener('input', applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        currentFilter = button.getAttribute('data-filter') || '全部';
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilter();
      });
    });

    if (buttons.length) {
      buttons[0].classList.add('is-active');
    }
  });
})();
