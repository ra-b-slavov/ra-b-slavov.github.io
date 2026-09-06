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

  /* ---- WhatsApp-Chat-Widget ---- */
  var waw = document.getElementById("wa-widget");
  if (waw) {
    var waIsBg = (document.documentElement.lang || "").toLowerCase().indexOf("bg") === 0;
    var waT = waIsBg
      ? { placeholder: "Напишете съобщение …", fallback: "Здравейте, г-н Славов, имам въпрос относно следното:" }
      : { placeholder: "Nachricht schreiben …", fallback: "Hallo Herr Slavov, ich habe eine Frage zu folgendem Anliegen:" };

    var waNum = waw.getAttribute("data-wa-number");
    var waFab = document.getElementById("wa-fab");
    var waPanel = document.getElementById("wa-panel");
    var waCloseBtn = document.getElementById("wa-close");
    var waForm = document.getElementById("wa-form");
    var waText = document.getElementById("wa-text");
    var waTime = document.getElementById("wa-time");

    if (waTime) {
      var now = new Date();
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      waTime.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
    }
    if (waText) { waText.setAttribute("placeholder", waT.placeholder); }

    var waOpen = function () {
      waPanel.hidden = false;
      void waPanel.offsetWidth;
      waw.classList.add("is-open");
      waFab.setAttribute("aria-expanded", "true");
    };
    var waClose = function () {
      waw.classList.remove("is-open");
      waFab.setAttribute("aria-expanded", "false");
      window.setTimeout(function () { waPanel.hidden = true; }, 200);
    };

    waFab.addEventListener("click", function () {
      if (waw.classList.contains("is-open")) { waClose(); } else { waOpen(); }
    });
    waCloseBtn.addEventListener("click", waClose);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && waw.classList.contains("is-open")) { waClose(); }
    });
    waForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = (waText.value || "").trim() || waT.fallback;
      window.open("https://wa.me/" + waNum + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });

    var waSeen;
    try { waSeen = sessionStorage.getItem("waSeen"); } catch (e) {}
    if (!waSeen) {
      window.setTimeout(function () {
        if (!waw.classList.contains("is-open")) { waOpen(); }
        try { sessionStorage.setItem("waSeen", "1"); } catch (e) {}
      }, 3500);
    }
  }

  /* ---- Lesefortschritts-Balken ---- */
  var bar = document.createElement("div");
  bar.className = "read-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var barPending = false;
  var updateBar = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (doc.scrollTop || document.body.scrollTop) / max * 100 : 0;
    bar.style.width = pct + "%";
    barPending = false;
  };
  window.addEventListener("scroll", function () {
    if (!barPending) { barPending = true; window.requestAnimationFrame(updateBar); }
  }, { passive: true });
  window.addEventListener("resize", updateBar);
  updateBar();

  /* ---- Sanfte Einblende-Effekte beim Scrollen ---- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    var revealTargets = document.querySelectorAll(
      ".eyebrow, .section > .wrap > h2, .section-intro, .trigger, .acc-item, .review, .step, .tip, .about-photo, .about-text > p, .section-head, .dav-strip, .contact-details, .contact-map, .contact-form-wrap"
    );
    var revObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealTargets.forEach(function (el) {
      el.classList.add("reveal-item");
      revObserver.observe(el);
    });

    /* gestaffeltes "Vorhang"-Einblenden innerhalb von Karten-Gruppen */
    var groups = document.querySelectorAll(".triggers, .tips, .steps, .reviews, .accordion");
    groups.forEach(function (grp) {
      var kids = grp.children;
      for (var k = 0; k < kids.length; k++) {
        if (kids[k].classList.contains("reveal-item")) {
          kids[k].style.setProperty("--reveal-delay", Math.min(k, 5) * 45 + "ms");
        }
      }
    });
  }

  /* ---- Hinweis auf die bulgarische Version ---- */
  var pageLang = (document.documentElement.lang || "").toLowerCase();
  if (pageLang.indexOf("bg") !== 0) {
    var langList = navigator.languages || [navigator.language || ""];
    var wantsBg = langList.some(function (l) { return (l || "").toLowerCase().indexOf("bg") === 0; });
    var hintDismissed;
    try { hintDismissed = localStorage.getItem("bgHintDismissed"); } catch (e) {}

    if (wantsBg && !hintDismissed) {
      var switchLink = document.querySelector('.lang-switch a[href*="bg"]');
      var bgHref = switchLink ? switchLink.getAttribute("href") : "bg/index.html";
      var hint = document.createElement("div");
      hint.className = "lang-hint";
      hint.setAttribute("lang", "bg");
      hint.setAttribute("role", "region");
      hint.setAttribute("aria-label", "Езикова бележка");
      hint.innerHTML =
        "<span>Тази страница е налична и на български.</span> " +
        '<a href="' + bgHref + '">Виж българската версия</a>' +
        '<button type="button" class="lang-hint-x" aria-label="Скрий">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
      var hdr = document.querySelector(".site-header");
      if (hdr && hdr.parentNode) {
        hdr.parentNode.insertBefore(hint, hdr);
        hint.querySelector(".lang-hint-x").addEventListener("click", function () {
          hint.parentNode.removeChild(hint);
          try { localStorage.setItem("bgHintDismissed", "1"); } catch (e) {}
        });
      }
    }
  }
})();
