(function () {
  var path = location.pathname;
  var isRoot = path === "/" || path === "/index.html";
  var previousUrlKey = "previousLanguageUrl";
  var uiLang = normalizeLang(document.documentElement.lang) || "lv";
  var supported = {
    lv: "/",
    en: "/en/",
    ru: "/ru/",
    de: "/de/",
    pl: "/pl/",
  };

  function normalizeLang(value) {
    if (!value) return "";
    return String(value).toLowerCase().slice(0, 2);
  }

  function toSafeLocalUrl(value) {
    if (!value) return "";
    try {
      var url = new URL(value, location.origin);
      if (url.origin !== location.origin) return "";
      return url.pathname + url.search + url.hash;
    } catch (e) {
      return "";
    }
  }

  function backButtonMeta(lang) {
    if (lang === "en") {
      return {
        text: "Back",
        label: "Back to previous language",
      };
    }
    if (lang === "ru") {
      return {
        text: "Назад",
        label: "Вернуться к предыдущему языку",
      };
    }
    if (lang === "de") {
      return {
        text: "Zurück",
        label: "Zur vorherigen Sprache zurückkehren",
      };
    }
    if (lang === "pl") {
      return {
        text: "Wstecz",
        label: "Wróć do poprzedniego języka",
      };
    }
    return {
      text: "Atpakaļ",
      label: "Atgriezt iepriekšējo valodu",
    };
  }

  function redirectTo(lang) {
    var target = supported[lang];
    if (!target) return false;
    if (target === path) return false;
    location.replace(target);
    return true;
  }

  try {
    var params = new URLSearchParams(location.search);
    var forced = normalizeLang(params.get("lang"));
    var htmlLang = normalizeLang(document.documentElement.lang) || "lv";
    var browserLang = normalizeLang(navigator.language || navigator.userLanguage || "");
    var savedLang = normalizeLang(localStorage.getItem("preferredLang"));

    if (forced && supported[forced]) {
      localStorage.setItem("preferredLang", forced);
      savedLang = forced;
      if (isRoot && forced !== "lv") {
        redirectTo(forced);
        return;
      }
      if (isRoot && forced === "lv") {
        history.replaceState(null, "", path + location.hash);
      }
    }

    if (isRoot) {
      if (savedLang && supported[savedLang] && savedLang !== "lv") {
        redirectTo(savedLang);
        return;
      }
      if (!savedLang && supported[browserLang] && browserLang !== "lv") {
        redirectTo(browserLang);
        return;
      }
    }

    if (htmlLang && supported[htmlLang]) {
      localStorage.setItem("preferredLang", htmlLang);
    }
  } catch (e) {}

  var select = document.querySelector(".lang-picker select");
  if (!select) return;

  try {
    var previousUrl = toSafeLocalUrl(localStorage.getItem(previousUrlKey));
    var currentUrl = path + location.search + location.hash;
    if (previousUrl && previousUrl !== currentUrl) {
      var meta = backButtonMeta(uiLang);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "lang-back-btn";
      button.setAttribute("aria-label", meta.label);
      button.title = meta.label;
      button.textContent = meta.text;
      button.addEventListener("click", function () {
        location.href = previousUrl;
      });
      var picker = select.closest(".lang-picker");
      if (picker && picker.parentNode) {
        picker.parentNode.insertBefore(button, picker.nextSibling);
      }
    }
  } catch (e) {}

  select.addEventListener("change", function () {
    var option = select.options[select.selectedIndex];
    var selectedLang = normalizeLang(option && option.getAttribute("data-lang"));
    if (selectedLang) {
      try {
        localStorage.setItem("preferredLang", selectedLang);
      } catch (e) {}
    }
    if (select.value) {
      var targetUrl = toSafeLocalUrl(select.value);
      if (!targetUrl) return;
      try {
        localStorage.setItem(previousUrlKey, path + location.search + location.hash);
      } catch (e) {}
      location.href = targetUrl;
    }
  });
})();
