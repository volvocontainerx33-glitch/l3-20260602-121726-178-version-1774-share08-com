(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var hero = document.querySelector(".hero-carousel");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(document.querySelectorAll(".carousel-dots button"));
      var index = 0;
      var activate = function (next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          activate(i);
        });
      });
      activate(0);
      setInterval(function () {
        activate(index + 1);
      }, 5200);
    }

    var heroSearch = document.querySelector(".hero-search");
    if (heroSearch) {
      heroSearch.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = heroSearch.querySelector("input");
        var keyword = input ? input.value.trim() : "";
        if (keyword) {
          location.href = "categories.html?search=" + encodeURIComponent(keyword);
        } else {
          location.href = "categories.html";
        }
      });
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var search = document.querySelector(".movie-search");
    var yearFilter = document.querySelector(".movie-year-filter");
    var typeFilter = document.querySelector(".movie-type-filter");
    var noResult = document.querySelector(".no-result");

    if (cards.length && (search || yearFilter || typeFilter)) {
      var params = new URLSearchParams(location.search);
      var initialSearch = params.get("search");
      if (initialSearch && search) {
        search.value = initialSearch;
      }

      var filter = function () {
        var query = search ? search.value.trim().toLowerCase() : "";
        var year = yearFilter ? yearFilter.value : "";
        var type = typeFilter ? typeFilter.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (year && cardYear !== year) {
            matched = false;
          }
          if (type && cardType !== type) {
            matched = false;
          }
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        if (noResult) {
          noResult.style.display = visible ? "none" : "block";
        }
      };

      [search, yearFilter, typeFilter].forEach(function (element) {
        if (element) {
          element.addEventListener("input", filter);
          element.addEventListener("change", filter);
        }
      });
      filter();
    }
  });
})();
