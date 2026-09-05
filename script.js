/* Vanilla JS: mobile navigation toggle + Rechtsgebiete-Accordion. */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var list = document.getElementById("nav-list");
  if (toggle && list) {
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
  }

  /* ---- Accordion: one panel open at a time ---- */
  var heads = document.querySelectorAll(".acc-head");
  heads.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var wasOpen = item.classList.contains("is-open");

      document.querySelectorAll(".acc-item.is-open").forEach(function (open) {
        open.classList.remove("is-open");
        open.querySelector(".acc-head").setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- Kontaktformular ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var isBg = (document.documentElement.lang || "").toLowerCase().indexOf("bg") === 0;
    var t = isBg ? {
      notActivated: "Формулярът все още не е активиран. Моля, свържете се по телефон или имейл.",
      sending: "Изпращане …",
      ok: "Благодаря Ви. Съобщението Ви пристигна, ще се свържа с Вас скоро.",
      err: "Изпращането не бе успешно. Моля, опитайте отново по-късно или се обадете.",
      send: "Изпрати съобщение"
    } : {
      notActivated: "Das Formular ist noch nicht aktiviert. Bitte per Telefon oder E-Mail Kontakt aufnehmen.",
      sending: "Wird gesendet …",
      ok: "Vielen Dank. Ihre Nachricht ist angekommen, ich melde mich zeitnah bei Ihnen.",
      err: "Das Senden hat nicht geklappt. Bitte versuchen Sie es später erneut oder rufen Sie an.",
      send: "Nachricht senden"
    };

    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');

    var show = function (kind, msg) {
      status.textContent = msg;
      status.className = "form-status " + (kind === "ok" ? "is-ok" : "is-err");
      status.hidden = false;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var key = form.querySelector('[name="access_key"]').value;
      if (key.indexOf("HIER-EINSETZEN") !== -1) {
        show("err", t.notActivated);
        return;
      }

      btn.disabled = true;
      btn.textContent = t.sending;

      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            show("ok", t.ok);
          } else {
            show("err", t.err);
          }
        })
        .catch(function () {
          show("err", t.err);
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = t.send;
        });
    });
  }
})();
