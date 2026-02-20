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
      image: "Katra bilde drikst but lidz 10MB.",
      video: "Video drikst but lidz 50MB."
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
    }
  });

  toggleRequired();
})();
