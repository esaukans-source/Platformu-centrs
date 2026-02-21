(function () {
  var form = document.querySelector('form[id^="form-"]');
  var service = document.querySelector('select[id^="service-"]');
  var photos = document.querySelector('input[type="file"][id^="photos-"]');
  var video = document.querySelector('input[type="file"][id^="video-"]');
  var photosPreview = document.querySelector('div[id^="photos-preview-"]');
  var videoPreview = document.querySelector('div[id^="video-preview-"]');
  var error = document.querySelector('p[id^="error-"]');

  if (!form || !service || !photos || !video || !photosPreview || !videoPreview || !error) {
    return;
  }

  var lang = ((document.documentElement.lang || "lv") + "").toLowerCase().slice(0, 2);
  var messages = {
    lv: {
      image: "Katra bilde drīkst būt līdz 10MB.",
      video: "Video drīkst būt līdz 50MB."
    },
    en: {
      image: "Each image must be 10MB or smaller.",
      video: "Video must be 50MB or smaller."
    },
    ru: {
      image: "Kazhdoe foto dolzhno byt ne bolshe 10MB.",
      video: "Video dolzhno byt ne bolshe 50MB."
    },
    de: {
      image: "Jedes Bild darf maximal 10MB gross sein.",
      video: "Video darf maximal 50MB gross sein."
    },
    pl: {
      image: "Kazde zdjecie musi miec maksymalnie 10MB.",
      video: "Wideo musi miec maksymalnie 50MB."
    }
  };
  var text = messages[lang] || messages.lv;

  var MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  var MAX_VIDEO_BYTES = 50 * 1024 * 1024;
  var TRACKING_VERSION = "v1";
  var FIRST_TOUCH_KEY = "leadTrackingFirstTouch";
  var LAST_TOUCH_KEY = "leadTrackingLastTouch";
  var FORM_STARTED_AT = new Date().toISOString();
  var PIPELINE_NAME = "lead_pipeline_v1";
  var PIPELINE_STAGES = ["jauns", "sazvanits", "tame", "uzvarets_zaudets"];
  var LEAD_ID = createLeadId();

  function safeGetStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return "";
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function readJsonStorage(key) {
    var raw = safeGetStorage(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function writeJsonStorage(key, value) {
    safeSetStorage(key, JSON.stringify(value));
  }

  function normalizeText(value) {
    var out = String(value || "").toLowerCase();
    if (typeof out.normalize === "function") {
      out = out.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return out.trim();
  }

  function createLeadId() {
    if (typeof crypto !== "undefined" && crypto && typeof crypto.randomUUID === "function") {
      return "lead_" + crypto.randomUUID();
    }
    return "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  }

  function getMetaContent(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) return "";
    return String(el.getAttribute("content") || "").trim();
  }

  function resolveWebhookConfig() {
    var dataUrl = String(form.getAttribute("data-lead-webhook") || "").trim();
    var dataMode = String(form.getAttribute("data-lead-webhook-mode") || "").trim();
    var dataToken = String(form.getAttribute("data-lead-webhook-token") || "").trim();
    var globalUrl = typeof window.LEAD_WEBHOOK_URL === "string" ? window.LEAD_WEBHOOK_URL : "";
    var globalMode = typeof window.LEAD_WEBHOOK_MODE === "string" ? window.LEAD_WEBHOOK_MODE : "";
    var globalToken = typeof window.LEAD_WEBHOOK_TOKEN === "string" ? window.LEAD_WEBHOOK_TOKEN : "";
    var metaUrl = getMetaContent("lead-webhook-url");
    var metaMode = getMetaContent("lead-webhook-mode");
    var metaToken = getMetaContent("lead-webhook-token");

    var url = dataUrl || metaUrl || globalUrl;
    var mode = (dataMode || metaMode || globalMode || "no-cors").toLowerCase();
    var token = dataToken || metaToken || globalToken;

    if (mode !== "cors" && mode !== "same-origin" && mode !== "no-cors") {
      mode = "no-cors";
    }

    return {
      url: url,
      mode: mode,
      token: token
    };
  }

  function hasAnyCampaignParam(params) {
    return (
      params.has("utm_source") ||
      params.has("utm_medium") ||
      params.has("utm_campaign") ||
      params.has("utm_term") ||
      params.has("utm_content") ||
      params.has("gclid") ||
      params.has("fbclid") ||
      params.has("msclkid") ||
      params.has("ttclid")
    );
  }

  function toHidden(name, value) {
    if (!name) return;
    var existing = form.querySelector('input[type="hidden"][name="' + name + '"]');
    var field = existing || document.createElement("input");
    field.type = "hidden";
    field.name = name;
    field.value = String(value || "");
    if (!existing) form.appendChild(field);
  }

  function getFieldValue(name) {
    var field = form.querySelector('[name="' + name + '"]');
    if (!field) return "";
    return String(field.value || "");
  }

  function collectFileMeta(fileInput, maxFiles) {
    var out = [];
    if (!fileInput || !fileInput.files || !fileInput.files.length) return out;
    var limit = maxFiles > 0 ? maxFiles : 10;
    Array.prototype.slice.call(fileInput.files, 0, limit).forEach(function (file) {
      out.push({
        name: file.name || "",
        size: Number(file.size || 0),
        type: file.type || ""
      });
    });
    return out;
  }

  function collectSubmissionData() {
    return {
      name: getFieldValue("name"),
      phone: getFieldValue("phone"),
      email: getFieldValue("email"),
      service: getFieldValue("service"),
      location: getFieldValue("location"),
      message: getFieldValue("message"),
      language: lang,
      form_name: form.getAttribute("name") || "",
      page_url: window.location.href || "",
      photos: collectFileMeta(photos, 12),
      video: collectFileMeta(video, 1)
    };
  }

  function initPipelineFields() {
    toHidden("lead_id", LEAD_ID);
    toHidden("lead_pipeline_name", PIPELINE_NAME);
    toHidden("lead_pipeline_stages", PIPELINE_STAGES.join(" > "));
    toHidden("lead_status", "new");
    toHidden("lead_stage", PIPELINE_STAGES[0]);
    toHidden("lead_stage_index", "0");
    toHidden("lead_source", "website_form");
  }

  function sendLeadWebhook(eventType) {
    var cfg = resolveWebhookConfig();
    if (!cfg.url) return;

    var payload = {
      event_type: String(eventType || "lead_submitted"),
      lead_id: LEAD_ID,
      tracking_version: TRACKING_VERSION,
      form_started_at: getFieldValue("lead_form_started_at"),
      form_submitted_at: getFieldValue("lead_form_submitted_at"),
      pipeline: {
        name: getFieldValue("lead_pipeline_name"),
        status: getFieldValue("lead_status"),
        stage: getFieldValue("lead_stage"),
        stage_index: Number(getFieldValue("lead_stage_index") || 0)
      },
      tracking: {
        utm_source: getFieldValue("utm_source"),
        utm_medium: getFieldValue("utm_medium"),
        utm_campaign: getFieldValue("utm_campaign"),
        utm_term: getFieldValue("utm_term"),
        utm_content: getFieldValue("utm_content"),
        gclid: getFieldValue("gclid"),
        fbclid: getFieldValue("fbclid"),
        msclkid: getFieldValue("msclkid"),
        ttclid: getFieldValue("ttclid"),
        first_touch_ts: getFieldValue("first_touch_ts"),
        first_touch_page_url: getFieldValue("first_touch_page_url"),
        first_touch_referrer: getFieldValue("first_touch_referrer"),
        last_touch_ts: getFieldValue("last_touch_ts"),
        last_touch_page_url: getFieldValue("last_touch_page_url"),
        last_touch_referrer: getFieldValue("last_touch_referrer")
      },
      lead: collectSubmissionData()
    };

    var textPayload = JSON.stringify(payload);
    var beaconSent = false;
    if (typeof navigator !== "undefined" && navigator && typeof navigator.sendBeacon === "function") {
      try {
        beaconSent = navigator.sendBeacon(cfg.url, new Blob([textPayload], { type: "text/plain;charset=UTF-8" }));
      } catch (e) {
        beaconSent = false;
      }
    }
    if (beaconSent) return;

    var headers = {};
    if (cfg.mode === "no-cors") {
      headers["Content-Type"] = "text/plain;charset=UTF-8";
    } else {
      headers["Content-Type"] = "application/json";
      if (cfg.token) {
        headers.Authorization = "Bearer " + cfg.token;
      }
    }

    fetch(cfg.url, {
      method: "POST",
      mode: cfg.mode,
      keepalive: true,
      credentials: "omit",
      headers: headers,
      body: cfg.mode === "no-cors" ? textPayload : JSON.stringify(payload)
    }).catch(function () {});
  }

  function captureTracking() {
    var params = new URLSearchParams(window.location.search || "");
    var nowIso = new Date().toISOString();
    var nowTouch = {
      ts: nowIso,
      lang: lang,
      page_path: window.location.pathname || "",
      page_url: window.location.href || "",
      referrer: document.referrer || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
      gclid: params.get("gclid") || "",
      fbclid: params.get("fbclid") || "",
      msclkid: params.get("msclkid") || "",
      ttclid: params.get("ttclid") || ""
    };

    var firstTouch = readJsonStorage(FIRST_TOUCH_KEY);
    var prevLastTouch = readJsonStorage(LAST_TOUCH_KEY);
    var shouldSetFirstTouch = !firstTouch;
    if (!shouldSetFirstTouch && firstTouch && !firstTouch.page_url && nowTouch.page_url) {
      shouldSetFirstTouch = true;
    }
    if (!shouldSetFirstTouch && firstTouch && !firstTouch.referrer && nowTouch.referrer) {
      shouldSetFirstTouch = true;
    }
    if (!shouldSetFirstTouch && firstTouch && !firstTouch.utm_source && hasAnyCampaignParam(params)) {
      shouldSetFirstTouch = true;
    }
    if (shouldSetFirstTouch) {
      firstTouch = nowTouch;
      writeJsonStorage(FIRST_TOUCH_KEY, firstTouch);
    }

    var lastTouch = nowTouch;
    writeJsonStorage(LAST_TOUCH_KEY, lastTouch);

    var resolveCampaign = function (key) {
      var current = nowTouch[key];
      if (current) return current;
      if (prevLastTouch && prevLastTouch[key]) return prevLastTouch[key];
      if (firstTouch && firstTouch[key]) return firstTouch[key];
      return "";
    };

    toHidden("lead_tracking_version", TRACKING_VERSION);
    toHidden("lead_lang", lang);
    toHidden("lead_form_started_at", FORM_STARTED_AT);
    toHidden("lead_page_path", nowTouch.page_path);
    toHidden("lead_page_url", nowTouch.page_url);
    toHidden("lead_referrer", nowTouch.referrer || "(direct)");

    toHidden("utm_source", resolveCampaign("utm_source"));
    toHidden("utm_medium", resolveCampaign("utm_medium"));
    toHidden("utm_campaign", resolveCampaign("utm_campaign"));
    toHidden("utm_term", resolveCampaign("utm_term"));
    toHidden("utm_content", resolveCampaign("utm_content"));
    toHidden("gclid", resolveCampaign("gclid"));
    toHidden("fbclid", resolveCampaign("fbclid"));
    toHidden("msclkid", resolveCampaign("msclkid"));
    toHidden("ttclid", resolveCampaign("ttclid"));

    toHidden("first_touch_ts", (firstTouch && firstTouch.ts) || "");
    toHidden("first_touch_page_url", (firstTouch && firstTouch.page_url) || "");
    toHidden("first_touch_referrer", (firstTouch && firstTouch.referrer) || "");
    toHidden("first_touch_utm_source", (firstTouch && firstTouch.utm_source) || "");
    toHidden("first_touch_utm_medium", (firstTouch && firstTouch.utm_medium) || "");
    toHidden("first_touch_utm_campaign", (firstTouch && firstTouch.utm_campaign) || "");
    toHidden("last_touch_ts", (lastTouch && lastTouch.ts) || "");
    toHidden("last_touch_page_url", (lastTouch && lastTouch.page_url) || "");
    toHidden("last_touch_referrer", (lastTouch && lastTouch.referrer) || "");
    toHidden("last_touch_utm_source", (lastTouch && lastTouch.utm_source) || "");
    toHidden("last_touch_utm_medium", (lastTouch && lastTouch.utm_medium) || "");
    toHidden("last_touch_utm_campaign", (lastTouch && lastTouch.utm_campaign) || "");
  }

  function prefillServiceFromUrl() {
    var params = new URLSearchParams(window.location.search || "");
    var fromUrl = params.get("pakalpojums") || params.get("service");
    if (!fromUrl) return;

    var wanted = normalizeText(fromUrl);
    var options = Array.prototype.slice.call(service.options || []);
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var textNorm = normalizeText(option.textContent);
      var valueNorm = normalizeText(option.value);
      if (!wanted) continue;
      if (wanted === textNorm || wanted === valueNorm || textNorm.indexOf(wanted) !== -1 || valueNorm.indexOf(wanted) !== -1) {
        service.value = option.value;
        toHidden("lead_service_prefill", fromUrl);
        break;
      }
    }
  }

  function toggleRequired() {
    var emergency = (service.value || "").indexOf("24/7") !== -1;
    photos.required = emergency;
    video.required = emergency;
  }

  function renderPhotos() {
    photosPreview.replaceChildren();
    if (!photos.files || photos.files.length === 0) return;
    Array.prototype.slice.call(photos.files, 0, 6).forEach(function (file) {
      var img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.className = "preview-thumb";
      photosPreview.appendChild(img);
    });
  }

  function renderVideo() {
    videoPreview.replaceChildren();
    if (!video.files || video.files.length === 0) return;
    var v = document.createElement("video");
    v.controls = true;
    v.className = "preview-video";
    v.src = URL.createObjectURL(video.files[0]);
    videoPreview.appendChild(v);
  }

  service.addEventListener("change", toggleRequired);
  photos.addEventListener("change", renderPhotos);
  video.addEventListener("change", renderVideo);

  form.addEventListener("submit", function (e) {
    error.textContent = "";
    toHidden("lead_form_submitted_at", new Date().toISOString());
    toHidden("lead_status", "new");
    toHidden("lead_stage", PIPELINE_STAGES[0]);
    toHidden("lead_stage_index", "0");
    if (photos.files && photos.files.length) {
      for (var i = 0; i < photos.files.length; i++) {
        if (photos.files[i].size > MAX_IMAGE_BYTES) {
          e.preventDefault();
          error.textContent = text.image;
          return;
        }
      }
    }
    if (video.files && video.files[0] && video.files[0].size > MAX_VIDEO_BYTES) {
      e.preventDefault();
      error.textContent = text.video;
      return;
    }
    sendLeadWebhook("lead_submitted");
  });

  prefillServiceFromUrl();
  initPipelineFields();
  captureTracking();
  toggleRequired();
})();
