(function () {
  var faq = document.getElementById("faq");
  if (!faq) return;

  var details = faq.querySelectorAll("details");
  if (!details.length) return;

  var mainEntity = [];
  for (var i = 0; i < details.length; i++) {
    var summary = details[i].querySelector("summary");
    var answerNode = details[i].querySelector("p");
    if (!summary || !answerNode) continue;

    var question = (summary.textContent || "").trim();
    var answer = (answerNode.textContent || "").trim();
    if (!question || !answer) continue;

    mainEntity.push({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    });
  }

  if (!mainEntity.length) return;

  var jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mainEntity,
  };

  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(jsonLd);
  document.head.appendChild(script);
})();
