(function () {
  var USERS_KEY = "pc_users_v1";
  var SESSION_KEY = "pc_session_v1";
  var PLATFORMS_KEY = "pc_platforms_v1";

  var THEMES = ["forest", "sand", "steel", "sunset", "ocean", "graphite"];
  var LAYOUTS = ["split", "stack", "tiles"];

  function toId(prefix) {
    return prefix + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function randOf(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function normalizeNiche(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[ā]/g, "a")
      .replace(/[č]/g, "c")
      .replace(/[ē]/g, "e")
      .replace(/[ģ]/g, "g")
      .replace(/[ī]/g, "i")
      .replace(/[ķ]/g, "k")
      .replace(/[ļ]/g, "l")
      .replace(/[ņ]/g, "n")
      .replace(/[š]/g, "s")
      .replace(/[ū]/g, "u")
      .replace(/[ž]/g, "z")
      .trim();
  }

  function calculatorByNiche(niche) {
    var value = normalizeNiche(niche);
    var interiorTokens = [
      "apdare",
      "iekseja apdare",
      "interjera apdare",
      "interior",
      "interior finishing",
      "innenausbau",
      "wykonczenie wnetrz",
      "vnutrennyaya otdelka",
    ];
    var isInterior = interiorTokens.some(function (token) {
      return value.indexOf(token) !== -1;
    });
    if (isInterior) {
      return {
        url: "/kalkulators/apdare",
        label: "Iekšējās apdares kalkulators",
      };
    }
    return {
      url: "/kalkulators",
      label: "Siltuma kalkulators",
    };
  }

  function resolveCalculator(platform) {
    var fromNiche = calculatorByNiche(platform && platform.niche);
    return {
      url: fromNiche.url,
      label: fromNiche.label,
    };
  }

  function safeGet(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (_error) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {}
  }

  function hashPassword(value) {
    try {
      return btoa(unescape(encodeURIComponent(String(value || ""))));
    } catch (_error) {
      return String(value || "");
    }
  }

  function getUsers() {
    return safeGet(USERS_KEY, []);
  }

  function setUsers(users) {
    safeSet(USERS_KEY, users);
  }

  function getSession() {
    return safeGet(SESSION_KEY, null);
  }

  function setSession(session) {
    safeSet(SESSION_KEY, session);
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (_error) {}
  }

  function getPlatforms() {
    return safeGet(PLATFORMS_KEY, []);
  }

  function setPlatforms(platforms) {
    safeSet(PLATFORMS_KEY, platforms);
  }

  function register(payload) {
    var users = getUsers();
    var email = String(payload.email || "").trim().toLowerCase();
    if (!email || !payload.password || !payload.name) {
      return { ok: false, error: "Aizpildi visus laukus." };
    }
    var exists = users.some(function (user) {
      return user.email === email;
    });
    if (exists) {
      return { ok: false, error: "Lietotājs ar šo e-pastu jau eksistē." };
    }

    var user = {
      id: toId("usr"),
      name: String(payload.name || "").trim(),
      email: email,
      passwordHash: hashPassword(payload.password),
      createdAt: nowIso(),
    };

    users.push(user);
    setUsers(users);
    setSession({ userId: user.id, loggedAt: nowIso() });
    return { ok: true, user: user };
  }

  function login(payload) {
    var email = String(payload.email || "").trim().toLowerCase();
    var passHash = hashPassword(payload.password);
    var user = getUsers().find(function (item) {
      return item.email === email && item.passwordHash === passHash;
    });
    if (!user) {
      return { ok: false, error: "Nepareizs e-pasts vai parole." };
    }
    setSession({ userId: user.id, loggedAt: nowIso() });
    return { ok: true, user: user };
  }

  function currentUser() {
    var session = getSession();
    if (!session || !session.userId) return null;
    return getUsers().find(function (item) {
      return item.id === session.userId;
    }) || null;
  }

  function createPlatform(user, payload) {
    if (!user) {
      return { ok: false, error: "Nav aktīvs lietotājs." };
    }

    var name = String(payload.name || "").trim();
    var niche = String(payload.niche || "").trim();
    var region = String(payload.region || "").trim();
    var plan = String(payload.plan || "starter").trim();

    if (!name || !niche || !region) {
      return { ok: false, error: "Nosaukums, niša un reģions ir obligāti." };
    }

    var calculator = calculatorByNiche(niche);
    var platform = {
      id: toId("pf"),
      slug: slugify(name) || toId("platform"),
      ownerId: user.id,
      ownerName: user.name,
      name: name,
      niche: niche,
      region: region,
      plan: plan,
      theme: randOf(THEMES),
      layout: randOf(LAYOUTS),
      calculatorUrl: calculator.url,
      calculatorLabel: calculator.label,
      structure: [
        "Nišas piedāvājums un mērķa klienta profils",
        "Lead uztveršana un kvalifikācija",
        "Tāmes sagatavošana ar atbilstošo kalkulatoru",
        "Izpildes komandas piesaiste",
        "Darījuma aizvēršana un atkārtotie klienti",
      ],
      revenueModel: {
        partner: "Pelna no klienta pasūtījumiem savā reģionā",
        center: "Platforma pelna no plāna maksas un komisijas par pabeigtiem darbiem",
      },
      createdAt: nowIso(),
      status: "active",
    };

    var platforms = getPlatforms();
    platforms.push(platform);
    setPlatforms(platforms);

    return { ok: true, platform: platform };
  }

  function byUser(userId) {
    return getPlatforms()
      .filter(function (item) {
        return item.ownerId === userId;
      })
      .sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value;
  }

  function renderCard(platform) {
    var publicUrl = "/platformu-centrs/platforma/?id=" + encodeURIComponent(platform.id);
    var calculator = resolveCalculator(platform);
    return (
      '<article class="card pc-platform-card pc-theme-' + platform.theme + '">' +
      '<p class="category-card-kicker">' + platform.niche + " / " + platform.region + "</p>" +
      "<h3>" + platform.name + "</h3>" +
      '<p class="note">Plāns: ' + platform.plan.toUpperCase() + "</p>" +
      '<p class="note">Dizains: ' + platform.theme + " | Layout: " + platform.layout + "</p>" +
      '<div class="cta-row">' +
      '<a class="btn" href="' + publicUrl + '">Atvērt platformu</a>' +
      '<a class="btn btn-soft" href="' + calculator.url + '">' + calculator.label + "</a>" +
      "</div>" +
      "</article>"
    );
  }

  function renderCabinet(user) {
    var authWrap = qs("#pc-auth-wrap");
    var appWrap = qs("#pc-app-wrap");
    if (!authWrap || !appWrap) return;

    if (!user) {
      authWrap.hidden = false;
      appWrap.hidden = true;
      return;
    }

    authWrap.hidden = true;
    appWrap.hidden = false;
    setText(qs("#pc-user-name"), user.name);

    var listNode = qs("#pc-platform-list");
    if (listNode) {
      var items = byUser(user.id);
      listNode.innerHTML = items.length
        ? items.map(renderCard).join("")
        : '<article class="card"><h3>Vēl nav platformu</h3><p>Sāc ar pirmās platformas izveidi zemāk.</p></article>';
    }
  }

  function bindCabinet() {
    var registerForm = qs("#pc-register-form");
    var loginForm = qs("#pc-login-form");
    var createForm = qs("#pc-create-form");
    var logoutBtn = qs("#pc-logout-btn");
    var msg = qs("#pc-auth-msg");
    var createMsg = qs("#pc-create-msg");

    function showAuthMsg(value) {
      if (!msg) return;
      msg.textContent = value || "";
    }

    function showCreateMsg(value) {
      if (!createMsg) return;
      createMsg.textContent = value || "";
    }

    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var payload = {
          name: qs('[name="name"]', registerForm).value,
          email: qs('[name="email"]', registerForm).value,
          password: qs('[name="password"]', registerForm).value,
        };
        var result = register(payload);
        showAuthMsg(result.ok ? "Reģistrācija izdevusies." : result.error);
        renderCabinet(currentUser());
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var payload = {
          email: qs('[name="email"]', loginForm).value,
          password: qs('[name="password"]', loginForm).value,
        };
        var result = login(payload);
        showAuthMsg(result.ok ? "Ielogošanās izdevusies." : result.error);
        renderCabinet(currentUser());
      });
    }

    if (createForm) {
      createForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var user = currentUser();
        var payload = {
          name: qs('[name="platform_name"]', createForm).value,
          niche: qs('[name="niche"]', createForm).value,
          region: qs('[name="region"]', createForm).value,
          plan: qs('[name="plan"]', createForm).value,
        };
        var result = createPlatform(user, payload);
        showCreateMsg(result.ok ? "Platforma izveidota." : result.error);
        if (result.ok) {
          createForm.reset();
        }
        renderCabinet(currentUser());
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        showAuthMsg("Izlogots.");
        renderCabinet(null);
      });
    }

    renderCabinet(currentUser());
  }

  function parseId() {
    var params = new URLSearchParams(location.search);
    return String(params.get("id") || "").trim();
  }

  function renderPlatformPage() {
    var id = parseId();
    var empty = qs("#pc-platform-empty");
    var app = qs("#pc-platform-app");
    if (!id) {
      if (empty) empty.hidden = false;
      if (app) app.hidden = true;
      return;
    }

    var platform = getPlatforms().find(function (item) {
      return item.id === id;
    });

    if (!platform) {
      if (empty) empty.hidden = false;
      if (app) app.hidden = true;
      return;
    }

    if (empty) empty.hidden = true;
    if (app) app.hidden = false;

    var themeClass = "pc-theme-" + platform.theme;
    var layoutClass = "pc-layout-" + platform.layout;
    var root = qs("#pc-platform-app");
    if (root) {
      root.classList.add(themeClass);
      root.classList.add(layoutClass);
    }

    setText(qs("#pc-v-name"), platform.name);
    setText(qs("#pc-v-niche"), platform.niche);
    setText(qs("#pc-v-region"), platform.region);
    setText(qs("#pc-v-plan"), platform.plan.toUpperCase());
    setText(qs("#pc-v-owner"), platform.ownerName);
    setText(qs("#pc-v-theme"), platform.theme + " / " + platform.layout);

    var calculator = resolveCalculator(platform);
    var calcA = qs("#pc-v-calc");
    if (calcA) {
      calcA.setAttribute("href", calculator.url);
      calcA.textContent = "Atvērt " + calculator.label.toLowerCase();
    }

    var list = qs("#pc-v-structure");
    if (list) {
      list.innerHTML = (platform.structure || []).map(function (step) {
        return "<li>" + step + "</li>";
      }).join("");
    }
  }

  function boot() {
    var page = document.body.getAttribute("data-pc-page");
    if (page === "kabinets") {
      bindCabinet();
      return;
    }
    if (page === "platforma") {
      renderPlatformPage();
      return;
    }
  }

  boot();
})();
