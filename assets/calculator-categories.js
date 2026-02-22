(function () {
  function normalizeCategory(hashValue) {
    return String(hashValue || "")
      .replace(/^#/, "")
      .trim()
      .toLowerCase();
  }

  function init() {
    var root = document.getElementById("heat-calculator-root");
    if (!root) return;

    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-calc-category-btn]"));
    var modules = Array.prototype.slice.call(root.querySelectorAll("[data-calc-category]"));
    if (!buttons.length || !modules.length) return;

    var available = {};
    modules.forEach(function (module) {
      available[module.getAttribute("data-calc-category")] = true;
    });

    function interiorPath() {
      var lang = String(document.documentElement.lang || "lv").toLowerCase().slice(0, 2);
      if (lang === "lv") return "/kalkulators/apdare";
      return "/" + lang + "/kalkulators/apdare";
    }

    function applyCategory(category, updateHash) {
      var target = available[category] ? category : "heating";

      buttons.forEach(function (button) {
        var active = button.getAttribute("data-calc-category-btn") === target;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
      });

      modules.forEach(function (module) {
        var visible = module.getAttribute("data-calc-category") === target;
        module.hidden = !visible;
        module.classList.toggle("is-active", visible);
      });

      if (updateHash) {
        var wantedHash = "#" + target;
        if (window.location.hash !== wantedHash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search + wantedHash);
        }
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyCategory(button.getAttribute("data-calc-category-btn"), true);
      });
    });

    window.addEventListener("hashchange", function () {
      var hashCategory = normalizeCategory(window.location.hash);
      if (hashCategory === "interior" && !available.interior) {
        window.location.replace(interiorPath() + window.location.search);
        return;
      }
      applyCategory(hashCategory, false);
    });

    var initialCategory = normalizeCategory(window.location.hash);
    if (initialCategory === "interior" && !available.interior) {
      window.location.replace(interiorPath() + window.location.search);
      return;
    }
    applyCategory(initialCategory, false);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
