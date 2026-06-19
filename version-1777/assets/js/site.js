(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")));
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    showSlide(0);
    startTimer();
  }

  var categoryJump = document.querySelector("[data-category-jump]");

  if (categoryJump) {
    categoryJump.addEventListener("change", function () {
      if (categoryJump.value) {
        window.location.href = "category-" + categoryJump.value + ".html";
      }
    });
  }

  var filterScopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));

  filterScopes.forEach(function (scope) {
    var searchInput = scope.querySelector("[data-card-search]");
    var categorySelect = scope.querySelector("[data-card-category]");
    var yearSelect = scope.querySelector("[data-card-year]");
    var list = document.querySelector("[data-card-list]");
    var count = document.querySelector("[data-result-count]");

    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));

    function applyFilter() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var category = categorySelect ? categorySelect.value : "";
      var year = yearSelect ? yearSelect.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchCategory = !category || card.getAttribute("data-category") === category;
        var matchYear = !year || card.getAttribute("data-year") === year;
        var matched = matchKeyword && matchCategory && matchYear;

        card.classList.toggle("is-hidden-by-filter", !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "共 " + visible + " 部影片";
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", applyFilter);
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", applyFilter);
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query && searchInput) {
      searchInput.value = query;
    }

    applyFilter();
  });
})();
