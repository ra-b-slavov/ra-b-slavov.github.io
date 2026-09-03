/* Minimal vanilla JS: mobile navigation toggle. */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var list = document.getElementById("nav-list");
  if (!toggle || !list) return;

  toggle.addEventListener("click", function () {
    var open = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  list.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      list.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
