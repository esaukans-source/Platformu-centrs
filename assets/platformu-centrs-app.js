(function () {
  var USERS_KEY = "pc_users_v1";
  var SESSION_KEY = "pc_session_v1";
  var PLATFORMS_KEY = "pc_platforms_v1";

  var THEMES = ["forest", "sand", "steel", "sunset", "ocean", "graphite"];
  var LAYOUTS = ["split", "stack", "tiles"];
  var DEFAULT_STRUCTURE = [
    "Nišas piedāvājums un mērķa klienta profils",
    "Lead uztveršana un kvalifikācija",
    "Tāmes sagatavošana ar atbilstošo kalkulatoru",
    "Izpildes komandas piesaiste",
    "Darījuma aizvēršana un atkārtotie klienti",
  ];

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

  function nonEmpty(value) {
    return String(value || "").trim();
  }

  function parseLines(value) {
    return String(value || "")
      .split(/\r?\n/)
      .map(function (line) {
        return nonEmpty(line);
      })
      .filter(Boolean);
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

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hashString(value) {
    var str = String(value || "");
    var hash = 0;
    for (var i = 0; i < str.length; i += 1) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  function toHexComponent(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  function hslToHex(h, s, l) {
    var hue = ((h % 360) + 360) % 360;
    var sat = Math.max(0, Math.min(100, s)) / 100;
    var light = Math.max(0, Math.min(100, l)) / 100;

    var c = (1 - Math.abs(2 * light - 1)) * sat;
    var x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    var m = light - c / 2;

    var r = 0;
    var g = 0;
    var b = 0;

    if (hue < 60) {
      r = c;
      g = x;
    } else if (hue < 120) {
      r = x;
      g = c;
    } else if (hue < 180) {
      g = c;
      b = x;
    } else if (hue < 240) {
      g = x;
      b = c;
    } else if (hue < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    var r255 = Math.round((r + m) * 255);
    var g255 = Math.round((g + m) * 255);
    var b255 = Math.round((b + m) * 255);

    return "#" + toHexComponent(r255) + toHexComponent(g255) + toHexComponent(b255);
  }

  function normalizeHexColor(value, fallback) {
    var raw = String(value || "").trim().toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(raw)) {
      return "#" + raw.charAt(1) + raw.charAt(1) + raw.charAt(2) + raw.charAt(2) + raw.charAt(3) + raw.charAt(3);
    }
    if (/^#[0-9a-f]{6}$/.test(raw)) {
      return raw;
    }
    return fallback;
  }

  function toSafeLink(value) {
    var text = nonEmpty(value);
    if (!text) return "";
    if (/^https?:\/\/[\w.-]/i.test(text)) return text;
    if (text.charAt(0) === "/") return text;
    return "";
  }

  function generateDesign(seedValue) {
    var seed = Math.abs(hashString(seedValue || "platform"));
    var hue = seed % 360;
    var altHue = (hue + 24 + (seed % 28)) % 360;
    return {
      primaryColor: hslToHex(hue, 62, 34),
      softColor: hslToHex(altHue, 78, 95),
      lineColor: hslToHex(hue, 35, 72),
    };
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

  function defaultHeroLead(niche) {
    var calc = calculatorByNiche(niche);
    return "Šī platforma palīdz klientiem saņemt konkrētu piedāvājumu un izmantot " + calc.label.toLowerCase() + ".";
  }

  function defaultAbout(niche, region) {
    var nicheText = nonEmpty(niche) || "pakalpojumiem";
    var regionText = nonEmpty(region) || "reģionā";
    return "Specializēta platforma " + nicheText.toLowerCase() + " nišai " + regionText + ", ar skaidru procesu no pieprasījuma līdz izpildei.";
  }

  function buildDefaultContent(name, niche, region) {
    return {
      heroTitle: nonEmpty(name) || "Platforma",
      heroLead: defaultHeroLead(niche),
      about: defaultAbout(niche, region),
      heroImage: "",
    };
  }

  function normalizeAd(ad) {
    var clean = {
      title: nonEmpty(ad && ad.title),
      text: nonEmpty(ad && ad.text),
      image: toSafeLink(ad && ad.image),
      link: toSafeLink(ad && ad.link),
    };

    if (!clean.title && !clean.text && !clean.image && !clean.link) {
      return null;
    }

    if (!clean.title) clean.title = "Partnera piedāvājums";
    return clean;
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

  function pickTheme(platformCount) {
    return THEMES[platformCount % THEMES.length];
  }

  function pickLayout(platformCount) {
    var layoutIdx = Math.floor(platformCount / THEMES.length) % LAYOUTS.length;
    return LAYOUTS[layoutIdx];
  }

  function ensurePlatformDefaults(platform, index) {
    if (!platform || typeof platform !== "object") return false;
    var changed = false;

    if (!platform.id) {
      platform.id = toId("pf");
      changed = true;
    }

    if (!platform.slug) {
      platform.slug = slugify(platform.name) || platform.id;
      changed = true;
    }

    if (!platform.theme || THEMES.indexOf(platform.theme) === -1) {
      platform.theme = pickTheme(index || 0);
      changed = true;
    }

    if (!platform.layout || LAYOUTS.indexOf(platform.layout) === -1) {
      platform.layout = pickLayout(index || 0);
      changed = true;
    }

    var calc = calculatorByNiche(platform.niche);
    if (platform.calculatorUrl !== calc.url) {
      platform.calculatorUrl = calc.url;
      changed = true;
    }
    if (platform.calculatorLabel !== calc.label) {
      platform.calculatorLabel = calc.label;
      changed = true;
    }

    if (!Array.isArray(platform.structure) || !platform.structure.length) {
      platform.structure = DEFAULT_STRUCTURE.slice();
      changed = true;
    }

    var baseDesign = generateDesign(platform.id + "|" + (platform.slug || ""));
    if (!platform.design || typeof platform.design !== "object") {
      platform.design = baseDesign;
      changed = true;
    } else {
      var normalizedDesign = {
        primaryColor: normalizeHexColor(platform.design.primaryColor, baseDesign.primaryColor),
        softColor: normalizeHexColor(platform.design.softColor, baseDesign.softColor),
        lineColor: normalizeHexColor(platform.design.lineColor, baseDesign.lineColor),
      };
      if (
        platform.design.primaryColor !== normalizedDesign.primaryColor ||
        platform.design.softColor !== normalizedDesign.softColor ||
        platform.design.lineColor !== normalizedDesign.lineColor
      ) {
        platform.design = normalizedDesign;
        changed = true;
      }
    }

    if (!platform.content || typeof platform.content !== "object") {
      platform.content = buildDefaultContent(platform.name, platform.niche, platform.region);
      changed = true;
    } else {
      if (!nonEmpty(platform.content.heroTitle)) {
        platform.content.heroTitle = nonEmpty(platform.name) || "Platforma";
        changed = true;
      }
      if (!nonEmpty(platform.content.heroLead)) {
        platform.content.heroLead = defaultHeroLead(platform.niche);
        changed = true;
      }
      if (!nonEmpty(platform.content.about)) {
        platform.content.about = defaultAbout(platform.niche, platform.region);
        changed = true;
      }
      var normalizedHeroImage = toSafeLink(platform.content.heroImage);
      if (platform.content.heroImage !== normalizedHeroImage) {
        platform.content.heroImage = normalizedHeroImage;
        changed = true;
      }
    }

    var ads = Array.isArray(platform.ads) ? platform.ads : [];
    var normalizedAds = ads
      .map(function (ad) {
        return normalizeAd(ad);
      })
      .filter(Boolean)
      .slice(0, 6);

    if (!Array.isArray(platform.ads) || JSON.stringify(ads) !== JSON.stringify(normalizedAds)) {
      platform.ads = normalizedAds;
      changed = true;
    }

    if (!platform.createdAt) {
      platform.createdAt = nowIso();
      changed = true;
    }
    if (!platform.status) {
      platform.status = "active";
      changed = true;
    }

    return changed;
  }

  function migratePlatformsStorage() {
    var platforms = getPlatforms();
    if (!Array.isArray(platforms) || !platforms.length) return;
    var changed = false;

    platforms.forEach(function (platform, index) {
      if (ensurePlatformDefaults(platform, index)) {
        changed = true;
      }
    });

    if (changed) {
      setPlatforms(platforms);
    }
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
    return (
      getUsers().find(function (item) {
        return item.id === session.userId;
      }) || null
    );
  }

  function createPlatform(user, payload) {
    if (!user) {
      return { ok: false, error: "Nav aktīvs lietotājs." };
    }

    var name = nonEmpty(payload.name);
    var niche = nonEmpty(payload.niche);
    var region = nonEmpty(payload.region);
    var plan = nonEmpty(payload.plan || "starter");

    if (!name || !niche || !region) {
      return { ok: false, error: "Nosaukums, niša un reģions ir obligāti." };
    }

    var platforms = getPlatforms();
    var platformCount = platforms.length;
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
      theme: pickTheme(platformCount),
      layout: pickLayout(platformCount),
      calculatorUrl: calculator.url,
      calculatorLabel: calculator.label,
      structure: DEFAULT_STRUCTURE.slice(),
      revenueModel: {
        partner: "Pelna no klienta pasūtījumiem savā reģionā",
        center: "Platforma pelna no plāna maksas un komisijas par pabeigtiem darbiem",
      },
      design: generateDesign(name + "|" + region + "|" + nowIso()),
      content: buildDefaultContent(name, niche, region),
      ads: [],
      createdAt: nowIso(),
      status: "active",
    };

    platforms.push(platform);
    setPlatforms(platforms);

    return { ok: true, platform: platform };
  }

  function resolveCalculator(platform) {
    var fromNiche = calculatorByNiche(platform && platform.niche);
    return {
      url: fromNiche.url,
      label: fromNiche.label,
    };
  }

  function resolveDesign(platform) {
    if (!platform || !platform.design) {
      return generateDesign((platform && platform.id) || "platform");
    }
    var fallback = generateDesign(platform.id + "|" + platform.slug);
    return {
      primaryColor: normalizeHexColor(platform.design.primaryColor, fallback.primaryColor),
      softColor: normalizeHexColor(platform.design.softColor, fallback.softColor),
      lineColor: normalizeHexColor(platform.design.lineColor, fallback.lineColor),
    };
  }

  function byUser(userId) {
    var platforms = getPlatforms();
    var changed = false;

    platforms.forEach(function (platform, index) {
      if (ensurePlatformDefaults(platform, index)) changed = true;
    });

    if (changed) setPlatforms(platforms);

    return platforms
      .filter(function (item) {
        return item.ownerId === userId;
      })
      .sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  function renderCard(platform) {
    var publicUrl = "/platformu-centrs/platforma/?id=" + encodeURIComponent(platform.id);
    var calculator = resolveCalculator(platform);
    var design = resolveDesign(platform);
    var adCount = Array.isArray(platform.ads) ? platform.ads.length : 0;
    var styleVars =
      "--pc-main:" + design.primaryColor + ";" +
      "--pc-soft:" + design.softColor + ";" +
      "--pc-line:" + design.lineColor + ";";

    return (
      '<article class="card pc-platform-card pc-theme-' + escapeHtml(platform.theme) + '" style="' + escapeHtml(styleVars) + '">' +
      '<p class="category-card-kicker">' + escapeHtml(platform.niche) + " / " + escapeHtml(platform.region) + "</p>" +
      "<h3>" + escapeHtml(platform.name) + "</h3>" +
      '<p class="note">Plāns: ' + escapeHtml(platform.plan.toUpperCase()) + "</p>" +
      '<p class="note">Dizains: ' + escapeHtml(platform.theme) + " | Layout: " + escapeHtml(platform.layout) + "</p>" +
      '<p class="note">Reklāmas bloki: ' + escapeHtml(String(adCount)) + "</p>" +
      '<div class="cta-row">' +
      '<a class="btn" href="' + escapeHtml(publicUrl) + '">Atvērt platformu</a>' +
      '<a class="btn btn-soft" href="' + escapeHtml(calculator.url) + '">' + escapeHtml(calculator.label) + "</a>" +
      '<button type="button" class="btn btn-soft" data-pc-edit="' + escapeHtml(platform.id) + '">Rediģēt</button>' +
      "</div>" +
      "</article>"
    );
  }

  function renderCabinet(user) {
    var authWrap = qs("#pc-auth-wrap");
    var appWrap = qs("#pc-app-wrap");
    var editorWrap = qs("#pc-editor-wrap");

    if (!authWrap || !appWrap) return;

    if (!user) {
      authWrap.hidden = false;
      appWrap.hidden = true;
      if (editorWrap) editorWrap.hidden = true;
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
        : '<article class="card"><h3>Vēl nav platformu</h3><p>Sāc ar pirmās platformas izveidi augstāk.</p></article>';
    }
  }

  function findPlatformById(platformId) {
    var platforms = getPlatforms();
    var index = platforms.findIndex(function (item) {
      return item.id === platformId;
    });

    if (index < 0) return null;
    if (ensurePlatformDefaults(platforms[index], index)) {
      setPlatforms(platforms);
    }

    return { index: index, platform: platforms[index], platforms: platforms };
  }

  function bindCabinet() {
    var registerForm = qs("#pc-register-form");
    var loginForm = qs("#pc-login-form");
    var createForm = qs("#pc-create-form");
    var logoutBtn = qs("#pc-logout-btn");
    var msg = qs("#pc-auth-msg");
    var createMsg = qs("#pc-create-msg");

    var editorWrap = qs("#pc-editor-wrap");
    var editForm = qs("#pc-edit-form");
    var editMsg = qs("#pc-edit-msg");
    var editCancel = qs("#pc-edit-cancel");
    var listNode = qs("#pc-platform-list");

    function getField(form, name) {
      return qs('[name="' + name + '"]', form);
    }

    function showAuthMsg(value) {
      if (!msg) return;
      msg.textContent = value || "";
    }

    function showCreateMsg(value) {
      if (!createMsg) return;
      createMsg.textContent = value || "";
    }

    function showEditMsg(value) {
      if (!editMsg) return;
      editMsg.textContent = value || "";
    }

    function closeEditor() {
      if (editorWrap) editorWrap.hidden = true;
      showEditMsg("");
      if (editForm) editForm.reset();
      var idField = editForm ? getField(editForm, "platform_id") : null;
      if (idField) idField.value = "";
    }

    function fillEditor(platform) {
      if (!editForm || !platform) return;
      var content = platform.content || buildDefaultContent(platform.name, platform.niche, platform.region);
      var design = resolveDesign(platform);

      getField(editForm, "platform_id").value = platform.id;
      getField(editForm, "hero_title").value = content.heroTitle || platform.name || "";
      getField(editForm, "hero_lead").value = content.heroLead || defaultHeroLead(platform.niche);
      getField(editForm, "about_text").value = content.about || defaultAbout(platform.niche, platform.region);
      getField(editForm, "hero_image").value = content.heroImage || "";
      getField(editForm, "layout").value = LAYOUTS.indexOf(platform.layout) !== -1 ? platform.layout : "split";
      getField(editForm, "primary_color").value = normalizeHexColor(design.primaryColor, "#1f5c47");
      getField(editForm, "soft_color").value = normalizeHexColor(design.softColor, "#e8f3ee");
      getField(editForm, "line_color").value = normalizeHexColor(design.lineColor, "#8bb9a7");
      getField(editForm, "structure_lines").value = (platform.structure || DEFAULT_STRUCTURE).join("\n");

      var ads = Array.isArray(platform.ads) ? platform.ads : [];
      for (var i = 1; i <= 3; i += 1) {
        var ad = ads[i - 1] || {};
        getField(editForm, "ad" + i + "_title").value = ad.title || "";
        getField(editForm, "ad" + i + "_text").value = ad.text || "";
        getField(editForm, "ad" + i + "_image").value = ad.image || "";
        getField(editForm, "ad" + i + "_link").value = ad.link || "";
      }
    }

    function openEditor(platformId) {
      var user = currentUser();
      if (!user) {
        showEditMsg("Ielogojies, lai rediģētu platformu.");
        return;
      }

      var result = findPlatformById(platformId);
      if (!result || !result.platform) {
        showEditMsg("Platforma nav atrasta.");
        return;
      }

      if (result.platform.ownerId !== user.id) {
        showEditMsg("Šo platformu nevar rediģēt ar šo kontu.");
        return;
      }

      fillEditor(result.platform);
      if (editorWrap) {
        editorWrap.hidden = false;
        editorWrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      showEditMsg("");
    }

    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var payload = {
          name: getField(registerForm, "name").value,
          email: getField(registerForm, "email").value,
          password: getField(registerForm, "password").value,
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
          email: getField(loginForm, "email").value,
          password: getField(loginForm, "password").value,
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
          name: getField(createForm, "platform_name").value,
          niche: getField(createForm, "niche").value,
          region: getField(createForm, "region").value,
          plan: getField(createForm, "plan").value,
        };

        var result = createPlatform(user, payload);
        showCreateMsg(result.ok ? "Platforma izveidota." : result.error);
        if (result.ok) {
          createForm.reset();
          renderCabinet(currentUser());
          if (result.platform && result.platform.id) {
            openEditor(result.platform.id);
          }
          return;
        }
        renderCabinet(currentUser());
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var user = currentUser();
        if (!user) {
          showEditMsg("Ielogojies, lai saglabātu izmaiņas.");
          return;
        }

        var platformId = nonEmpty(getField(editForm, "platform_id").value);
        if (!platformId) {
          showEditMsg("Nav izvēlēta platforma rediģēšanai.");
          return;
        }

        var result = findPlatformById(platformId);
        if (!result || !result.platform) {
          showEditMsg("Platforma nav atrasta.");
          return;
        }

        var platform = result.platform;
        if (platform.ownerId !== user.id) {
          showEditMsg("Šo platformu nevar rediģēt ar šo kontu.");
          return;
        }

        ensurePlatformDefaults(platform, result.index);

        platform.layout = LAYOUTS.indexOf(getField(editForm, "layout").value) !== -1
          ? getField(editForm, "layout").value
          : platform.layout;

        platform.design = {
          primaryColor: normalizeHexColor(getField(editForm, "primary_color").value, platform.design.primaryColor),
          softColor: normalizeHexColor(getField(editForm, "soft_color").value, platform.design.softColor),
          lineColor: normalizeHexColor(getField(editForm, "line_color").value, platform.design.lineColor),
        };

        platform.content = {
          heroTitle: nonEmpty(getField(editForm, "hero_title").value) || platform.name,
          heroLead: nonEmpty(getField(editForm, "hero_lead").value) || defaultHeroLead(platform.niche),
          about: nonEmpty(getField(editForm, "about_text").value) || defaultAbout(platform.niche, platform.region),
          heroImage: toSafeLink(getField(editForm, "hero_image").value),
        };

        var structure = parseLines(getField(editForm, "structure_lines").value);
        platform.structure = structure.length ? structure : DEFAULT_STRUCTURE.slice();

        var ads = [];
        for (var i = 1; i <= 3; i += 1) {
          var ad = normalizeAd({
            title: getField(editForm, "ad" + i + "_title").value,
            text: getField(editForm, "ad" + i + "_text").value,
            image: getField(editForm, "ad" + i + "_image").value,
            link: getField(editForm, "ad" + i + "_link").value,
          });
          if (ad) ads.push(ad);
        }
        platform.ads = ads;
        platform.updatedAt = nowIso();

        result.platforms[result.index] = platform;
        setPlatforms(result.platforms);

        showEditMsg("Saglabāts. Publicētais platformas skats ir atjaunināts.");
        renderCabinet(user);
        openEditor(platformId);
      });
    }

    if (editCancel) {
      editCancel.addEventListener("click", function () {
        closeEditor();
      });
    }

    if (listNode) {
      listNode.addEventListener("click", function (event) {
        var btn = event.target && event.target.closest ? event.target.closest("[data-pc-edit]") : null;
        if (!btn) return;
        var platformId = btn.getAttribute("data-pc-edit");
        if (!platformId) return;
        openEditor(platformId);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        showAuthMsg("Izlogots.");
        showCreateMsg("");
        closeEditor();
        renderCabinet(null);
      });
    }

    renderCabinet(currentUser());
  }

  function parseId() {
    var params = new URLSearchParams(location.search);
    return String(params.get("id") || "").trim();
  }

  function renderAdCard(ad) {
    var image = toSafeLink(ad.image);
    var link = toSafeLink(ad.link);
    var title = nonEmpty(ad.title) || "Partnera piedāvājums";
    var text = nonEmpty(ad.text);

    return (
      '<article class="card pc-ad-card">' +
      (image
        ? '<img class="card-thumb" loading="lazy" src="' + escapeHtml(image) + '" alt="' + escapeHtml(title) + '" />'
        : "") +
      "<h3>" + escapeHtml(title) + "</h3>" +
      (text ? "<p>" + escapeHtml(text) + "</p>" : "") +
      (link
        ? '<div class="cta-row"><a class="btn btn-soft" href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">Atvērt piedāvājumu</a></div>'
        : "") +
      "</article>"
    );
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

    var result = findPlatformById(id);
    if (!result || !result.platform) {
      if (empty) empty.hidden = false;
      if (app) app.hidden = true;
      return;
    }

    var platform = result.platform;
    if (empty) empty.hidden = true;
    if (app) app.hidden = false;

    var root = qs("#pc-platform-app");
    var design = resolveDesign(platform);
    var content = platform.content || buildDefaultContent(platform.name, platform.niche, platform.region);

    if (root) {
      THEMES.forEach(function (theme) {
        root.classList.remove("pc-theme-" + theme);
      });
      LAYOUTS.forEach(function (layout) {
        root.classList.remove("pc-layout-" + layout);
      });

      root.classList.add("pc-theme-" + platform.theme);
      root.classList.add("pc-layout-" + platform.layout);
      root.style.setProperty("--pc-main", design.primaryColor);
      root.style.setProperty("--pc-soft", design.softColor);
      root.style.setProperty("--pc-line", design.lineColor);
    }

    setText(qs("#pc-v-name"), content.heroTitle || platform.name);
    setText(qs("#pc-v-lead"), content.heroLead || defaultHeroLead(platform.niche));
    setText(qs("#pc-v-niche"), platform.niche);
    setText(qs("#pc-v-region"), platform.region);
    setText(qs("#pc-v-plan"), platform.plan.toUpperCase());
    setText(qs("#pc-v-owner"), platform.ownerName);
    setText(qs("#pc-v-theme"), platform.theme + " / " + platform.layout);

    var heroMediaWrap = qs("#pc-v-hero-media");
    var heroImage = qs("#pc-v-hero-image");
    var heroImageUrl = toSafeLink(content.heroImage);
    if (heroMediaWrap && heroImage) {
      if (heroImageUrl) {
        heroImage.setAttribute("src", heroImageUrl);
        heroMediaWrap.hidden = false;
      } else {
        heroImage.removeAttribute("src");
        heroMediaWrap.hidden = true;
      }
    }

    var aboutWrap = qs("#pc-v-about-wrap");
    var aboutNode = qs("#pc-v-about");
    var aboutText = nonEmpty(content.about);
    if (aboutWrap && aboutNode) {
      if (aboutText) {
        aboutWrap.hidden = false;
        setText(aboutNode, aboutText);
      } else {
        aboutWrap.hidden = true;
        setText(aboutNode, "");
      }
    }

    var calculator = resolveCalculator(platform);
    var calcA = qs("#pc-v-calc");
    if (calcA) {
      calcA.setAttribute("href", calculator.url);
      calcA.textContent = "Atvērt " + calculator.label.toLowerCase();
    }

    var list = qs("#pc-v-structure");
    if (list) {
      list.innerHTML = (platform.structure || []).map(function (step) {
        return "<li>" + escapeHtml(step) + "</li>";
      }).join("");
    }

    var adsWrap = qs("#pc-v-ads-wrap");
    var adsNode = qs("#pc-v-ads");
    var ads = (platform.ads || [])
      .map(function (ad) {
        return normalizeAd(ad);
      })
      .filter(Boolean);

    if (adsWrap && adsNode) {
      if (ads.length) {
        adsWrap.hidden = false;
        adsNode.innerHTML = ads.map(renderAdCard).join("");
      } else {
        adsWrap.hidden = true;
        adsNode.innerHTML = "";
      }
    }
  }

  function boot() {
    migratePlatformsStorage();

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
