const SUPPORTED_LANGS = ["lv", "en", "ru", "de", "pl"];
const UI = {
  lv: {
    category: "Kategorija",
    servicesGrouping: "Pakalpojumu grupējums",
    viewAll: "Skatīt visus",
    calculatorsFast: "Kalkulatori ātrākai lēmumu pieņemšanai",
    calculatorsLead: "Siltuma tāmes un iekšējās apdares kalkulatori palīdz saprast apjomu un izmaksu robežas pirms darba sākuma.",
    openCalculators: "Atvērt kalkulatorus",
    heatingService: "Apkures pakalpojums",
    howItWorks: "Kā tas strādā",
    popularServices: "Populāri pakalpojumi",
    servicesKicker: "Pakalpojumi",
    servicesGroupedTitle: "Sakārtoti pakalpojumi pēc klienta loģikas",
    servicesGroupedLead: "Izvēlies kategoriju un atrodi precīzu pakalpojumu 1-2 klikšķos.",
    categoryKicker: "Kategorija",
    submitRequest: "Iesniegt pieteikumu",
    backToCategories: "Atpakaļ uz kategorijām",
    backToCategory: "Atpakaļ uz kategoriju",
    included: "Kas iekļauts",
    faqTitle: "Biežākie jautājumi",
    faqQ1: "Kā notiek darbu process?",
    faqA1: "Sākam ar objekta informācijas precizēšanu, sagatavojam tāmi un saskaņojam izpildes grafiku.",
    faqQ2: "Cik ātri var sākt darbus?",
    faqA2: "Steidzamiem darbiem piesaisti organizējam pēc iespējas ātrāk; precīzs starts atkarīgs no objekta un pieejamības.",
    faqQ3: "Vai var saņemt izmaksu novērtējumu pirms darbu sākuma?",
    faqA3: "Jā, pirms starta var saņemt sākotnējo novērtējumu un darba plānu.",
    howItWorksId: "ka-tas-strada"
  },
  en: {
    category: "Category",
    servicesGrouping: "Service Grouping",
    viewAll: "View all",
    calculatorsFast: "Calculators for faster decisions",
    calculatorsLead: "Heating estimate and interior calculators help you understand scope and budget boundaries before execution.",
    openCalculators: "Open calculators",
    heatingService: "Heating service",
    howItWorks: "How it works",
    popularServices: "Popular Services",
    servicesKicker: "Services",
    servicesGroupedTitle: "Services grouped by practical customer logic",
    servicesGroupedLead: "Choose a category and find the right service in 1-2 clicks.",
    categoryKicker: "Category",
    submitRequest: "Submit a request",
    backToCategories: "Back to categories",
    backToCategory: "Back to category",
    included: "What is included",
    faqTitle: "Frequently asked questions",
    faqQ1: "How does the work process usually happen?",
    faqA1: "We start by clarifying scope, then prepare an estimate and align execution steps.",
    faqQ2: "How quickly can the work start?",
    faqA2: "Urgent requests are prioritized first; start timing depends on scope and team availability.",
    faqQ3: "Can I get a cost estimate before work starts?",
    faqA3: "Yes, you can receive an initial estimate and an execution plan before kickoff.",
    howItWorksId: "how-it-works"
  },
  ru: {
    category: "Категория",
    servicesGrouping: "Группы услуг",
    viewAll: "Смотреть все",
    calculatorsFast: "Калькуляторы для быстрого решения",
    calculatorsLead: "Калькуляторы отопления и внутренней отделки помогают заранее оценить объем и бюджет.",
    openCalculators: "Открыть калькуляторы",
    heatingService: "Услуга отопления",
    howItWorks: "Как это работает",
    popularServices: "Популярные услуги",
    servicesKicker: "Услуги",
    servicesGroupedTitle: "Услуги, сгруппированные по логике клиента",
    servicesGroupedLead: "Выберите категорию и найдите нужную услугу за 1-2 клика.",
    categoryKicker: "Категория",
    submitRequest: "Оставить заявку",
    backToCategories: "Назад к категориям",
    backToCategory: "Назад к категории",
    included: "Что включено",
    faqTitle: "Часто задаваемые вопросы",
    faqQ1: "Как обычно проходит процесс работ?",
    faqA1: "Сначала уточняем объем задачи, затем готовим смету и согласуем этапы выполнения.",
    faqQ2: "Как быстро можно начать работы?",
    faqA2: "Срочные заявки обрабатываются в первую очередь; старт зависит от объема и доступности бригады.",
    faqQ3: "Можно ли получить оценку стоимости до начала?",
    faqA3: "Да, перед стартом можно получить предварительную смету и план работ.",
    howItWorksId: "how-it-works"
  },
  de: {
    category: "Kategorie",
    servicesGrouping: "Leistungsgruppen",
    viewAll: "Alle ansehen",
    calculatorsFast: "Rechner fuer schnellere Entscheidungen",
    calculatorsLead: "Heizungs- und Innenausbau-Rechner helfen, Umfang und Budget vorab zu verstehen.",
    openCalculators: "Rechner oeffnen",
    heatingService: "Heizungsservice",
    howItWorks: "So funktioniert es",
    popularServices: "Beliebte Leistungen",
    servicesKicker: "Leistungen",
    servicesGroupedTitle: "Leistungen nach praktischer Kundenlogik gruppiert",
    servicesGroupedLead: "Waehle eine Kategorie und finde die passende Leistung in 1-2 Klicks.",
    categoryKicker: "Kategorie",
    submitRequest: "Anfrage senden",
    backToCategories: "Zurueck zu Kategorien",
    backToCategory: "Zurueck zur Kategorie",
    included: "Was ist enthalten",
    faqTitle: "Haeufige Fragen",
    faqQ1: "Wie laeuft der Arbeitsprozess normalerweise ab?",
    faqA1: "Wir klaeren zuerst den Umfang, erstellen danach eine Kostenschaetzung und stimmen die Umsetzungsschritte ab.",
    faqQ2: "Wie schnell koennen die Arbeiten starten?",
    faqA2: "Dringende Auftraege priorisieren wir zuerst; der Start haengt vom Umfang und der Verfuegbarkeit ab.",
    faqQ3: "Kann ich vor dem Start eine Kostenschaetzung erhalten?",
    faqA3: "Ja, vor dem Start erhalten Sie eine erste Schaetzung und einen Ausfuehrungsplan.",
    howItWorksId: "how-it-works"
  },
  pl: {
    category: "Kategoria",
    servicesGrouping: "Grupy uslug",
    viewAll: "Zobacz wszystkie",
    calculatorsFast: "Kalkulatory dla szybszych decyzji",
    calculatorsLead: "Kalkulatory ogrzewania i wykonczenia pomagaja oszacowac zakres i budzet przed startem prac.",
    openCalculators: "Otworz kalkulatory",
    heatingService: "Usluga ogrzewania",
    howItWorks: "Jak to dziala",
    popularServices: "Popularne uslugi",
    servicesKicker: "Uslugi",
    servicesGroupedTitle: "Uslugi pogrupowane wedlug logiki klienta",
    servicesGroupedLead: "Wybierz kategorie i znajdz wlasciwa usluge w 1-2 kliknieciach.",
    categoryKicker: "Kategoria",
    submitRequest: "Wyslij zgloszenie",
    backToCategories: "Wroc do kategorii",
    backToCategory: "Wroc do kategorii",
    included: "Co obejmuje",
    faqTitle: "Najczesciej zadawane pytania",
    faqQ1: "Jak zwykle przebiega proces realizacji?",
    faqA1: "Najpierw doprecyzowujemy zakres, potem przygotowujemy wycene i uzgadniamy etapy realizacji.",
    faqQ2: "Jak szybko mozna zaczac prace?",
    faqA2: "Pilne zgloszenia obslugujemy priorytetowo; termin startu zalezy od zakresu i dostepnosci ekipy.",
    faqQ3: "Czy moge dostac wycene przed startem prac?",
    faqA3: "Tak, przed startem otrzymasz wstepna wycene i plan realizacji.",
    howItWorksId: "how-it-works"
  }
};

function t(site, key) {
  const lang = site.lang && UI[site.lang] ? site.lang : "en";
  return UI[lang][key] || UI.en[key] || key;
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escJson(value) {
  return String(value || "").replace(/</g, "\\u003c");
}

function absoluteUrl(site, urlPath) {
  var root = String(site.siteUrl || "").replace(/\/$/, "");
  var clean = String(urlPath || "/");
  if (!clean.startsWith("/")) clean = "/" + clean;
  return root + clean;
}

function asUrlWithLang(path, lang) {
  const clean = path || (lang === "lv" ? "/" : `/${lang}/`);
  const hasQuery = clean.includes("?");
  return `${clean}${hasQuery ? "&" : "?"}lang=${lang}`;
}

function serviceFaqEntries(site) {
  return [
    { question: t(site, "faqQ1"), answer: t(site, "faqA1") },
    { question: t(site, "faqQ2"), answer: t(site, "faqA2") },
    { question: t(site, "faqQ3"), answer: t(site, "faqA3") }
  ];
}

function renderAlternateLinks(currentLang, languagePaths, site) {
  const paths = languagePaths && Object.keys(languagePaths).length
    ? languagePaths
    : { [currentLang]: currentLang === "lv" ? "/" : `/${currentLang}/` };
  const links = SUPPORTED_LANGS
    .filter((lang) => paths[lang])
    .map((lang) => `<link rel="alternate" hreflang="${esc(lang)}" href="${esc(absoluteUrl(site, paths[lang]))}" />`);
  const xDefaultPath = paths.lv || paths[currentLang] || "/";
  links.push(`<link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl(site, xDefaultPath))}" />`);
  return links.join("\n  ");
}

function renderJsonLdBlocks(site, page, canonical) {
  const blocks = [];
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.siteName,
    url: site.siteUrl,
    logo: absoluteUrl(site, "/assets/logo-30sek24.svg"),
    email: "mailto:e.saukans@gmail.com"
  };
  blocks.push(org);

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: site.siteUrl,
    inLanguage: site.lang
  };
  blocks.push(webSite);

  if (page.breadcrumb && Array.isArray(page.breadcrumb.items) && page.breadcrumb.items.length) {
    const items = page.breadcrumb.items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      item: absoluteUrl(site, item.href || page.canonicalPath || "/")
    }));
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items
    });
  }

  if (page.pageType === "service" && page.service && page.category) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.service.name,
      description: page.service.overview,
      serviceType: page.category.name,
      areaServed: "Europe",
      provider: {
        "@type": "Organization",
        name: site.siteName,
        url: site.siteUrl
      },
      url: canonical,
      inLanguage: site.lang
    });

    const faqMain = serviceFaqEntries(site).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }));
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqMain
    });
  }

  if (page.pageType === "category" && Array.isArray(page.categoryServices) && page.categoryServices.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: page.categoryServices.map((service, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: service.name,
        url: absoluteUrl(site, (site.basePath || "") + "/" + service.slug)
      }))
    });
  }

  return blocks
    .map((json) => `<script type="application/ld+json">${escJson(JSON.stringify(json))}</script>`)
    .join("\n  ");
}

function renderLanguagePicker(currentLang, languagePaths) {
  const options = SUPPORTED_LANGS.map((lang) => {
    const path = languagePaths[lang] || (lang === "lv" ? "/" : `/${lang}/`);
    const selected = lang === currentLang ? ' selected' : "";
    return `<option value="${esc(asUrlWithLang(path, lang))}" data-lang="${esc(lang)}"${selected}>${esc(lang.toUpperCase())}</option>`;
  }).join("");

  return `<label class="lang-picker" aria-label="Language"><select aria-label="Language picker">${options}</select></label>`;
}

function renderNav(site) {
  return site.nav
    .map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`)
    .join("");
}

function renderFooter(site) {
  const links = (site.footer.links || [])
    .map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`)
    .join("");

  return `<footer class="site-footer"><div class="container"><p>${esc(site.footer.copyright)}</p><p>${links}</p><p class="contact-micro">${esc(site.footer.contact)}</p></div></footer>`;
}

function renderBreadcrumb(breadcrumb) {
  if (!breadcrumb || !breadcrumb.items || !breadcrumb.items.length) {
    return "";
  }
  const itemsHtml = breadcrumb.items
    .map((item, index) => {
      if (index === breadcrumb.items.length - 1) {
        return `<span>${esc(item.label)}</span>`;
      }
      return `<a href="${esc(item.href)}">${esc(item.label)}</a>`;
    })
    .join(" / ");

  return `<nav aria-label="Breadcrumb" class="breadcrumbs"><div class="container">${itemsHtml}</div></nav>`;
}

function renderServiceCard(site, service) {
  const base = site.basePath || "";
  return `<a class="card service-card" href="${esc(base + "/" + service.slug)}"><img class="card-thumb" loading="lazy" src="${esc(service.image)}" alt="${esc(service.name)}" /><h3>${esc(service.name)}</h3><p>${esc(service.overview)}</p></a>`;
}

function renderCategoryCard(site, category) {
  const base = site.basePath || "";
  return `<a class="card category-card" href="${esc(base + "/pakalpojumi/" + category.slug)}"><p class="category-card-kicker">${esc(t(site, "category"))}</p><h3>${esc(category.name)}</h3><p>${esc(category.description)}</p></a>`;
}

export function renderHomeMain(site) {
  const categoriesHtml = site.categories.map((category) => renderCategoryCard(site, category)).join("");
  const featuredServices = site.services.slice(0, 8).map((service) => renderServiceCard(site, service)).join("");
  const howItWorksId = t(site, "howItWorksId");
  const platformCenterBlock =
    site.lang === "lv"
      ? `<section class="block">
      <div class="block-head">
        <h2>Platformu Centrs partneru biznesam</h2>
      </div>
      <p>Izvēlies gatavu biznesa struktūru ar cenu plānu, komisijām, līguma ietvaru un 14 dienu onboarding plūsmu.</p>
      <div class="cta-row">
        <a href="/platformu-centrs" class="btn">Atvērt partneru modeli</a>
        <a href="/pieteikt-darbu?pakalpojums=Platformu%20Centrs%20Partneris" class="btn btn-soft">Pieteikties programmai</a>
      </div>
    </section>`
      : "";
  const statsHtml = (site.home.stats || [])
    .map((stat) => `<article class="stat-pill"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></article>`)
    .join("");
  const trustHtml = (site.home.trustPoints || [])
    .map((item) => `<li>${esc(item)}</li>`)
    .join("");
  const stepsHtml = (site.home.howItWorks || [])
    .map((step) => `<article class="process-card"><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p></article>`)
    .join("");

  return `<main>
    <section class="hero hero-premium">
      <p class="hero-kicker">${esc(site.home.kicker)}</p>
      <h1>${esc(site.home.title)}</h1>
      <p class="hero-lead">${esc(site.home.lead)}</p>
      <div class="cta-row">
        <a href="${esc(site.home.primaryCta.href)}" class="btn">${esc(site.home.primaryCta.label)}</a>
        <a href="${esc(site.home.secondaryCta.href)}" class="btn btn-soft">${esc(site.home.secondaryCta.label)}</a>
      </div>
      <div class="stats-row">${statsHtml}</div>
      <ul class="trust-list">${trustHtml}</ul>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>${esc(t(site, "servicesGrouping"))}</h2>
        <a href="${esc((site.basePath || "") + "/pakalpojumi")}" class="text-link">${esc(t(site, "viewAll"))}</a>
      </div>
      <div class="cards">${categoriesHtml}</div>
    </section>

    <section class="block calculator-teaser">
      <h2>${esc(t(site, "calculatorsFast"))}</h2>
      <p>${esc(t(site, "calculatorsLead"))}</p>
      <div class="cta-row">
        <a href="${esc((site.basePath || "") + "/kalkulators")}" class="btn">${esc(t(site, "openCalculators"))}</a>
        <a href="${esc((site.basePath || "") + "/apkure")}" class="btn btn-soft">${esc(t(site, "heatingService"))}</a>
      </div>
    </section>
    ${platformCenterBlock}

    <section class="block" id="${esc(howItWorksId)}">
      <h2>${esc(t(site, "howItWorks"))}</h2>
      <div class="process-grid">${stepsHtml}</div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>${esc(t(site, "popularServices"))}</h2>
      </div>
      <div class="cards service-grid">${featuredServices}</div>
    </section>
  </main>`;
}

export function renderHubMain(site) {
  const cardsHtml = site.categories.map((category) => renderCategoryCard(site, category)).join("");
  return `<main>
    <section class="hero hero-premium compact-hero">
      <p class="hero-kicker">${esc(t(site, "servicesKicker"))}</p>
      <h1>${esc(t(site, "servicesGroupedTitle"))}</h1>
      <p class="hero-lead">${esc(t(site, "servicesGroupedLead"))}</p>
    </section>
    <section class="block"><div class="cards">${cardsHtml}</div></section>
  </main>`;
}

export function renderCategoryMain(site, category, services) {
  const serviceCards = services.map((service) => renderServiceCard(site, service)).join("");
  return `<main>
    <section class="hero hero-premium compact-hero">
      <p class="hero-kicker">${esc(t(site, "categoryKicker"))}</p>
      <h1>${esc(category.name)}</h1>
      <p class="hero-lead">${esc(category.description)}</p>
      <div class="cta-row">
        <a href="${esc((site.basePath || "") + "/pieteikt-darbu")}" class="btn">${esc(t(site, "submitRequest"))}</a>
        <a href="${esc((site.basePath || "") + "/pakalpojumi")}" class="btn btn-soft">${esc(t(site, "backToCategories"))}</a>
      </div>
    </section>
    <section class="block">
      <div class="cards service-grid">${serviceCards}</div>
    </section>
  </main>`;
}

export function renderServiceMain(site, service, category) {
  const bulletHtml = (service.bullets || []).map((item) => `<li>${esc(item)}</li>`).join("");
  const faqItems = serviceFaqEntries(site);
  const faqHtml = faqItems
    .map((item) => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`)
    .join("");
  return `<main>
    <section class="hero hero-premium service-hero">
      <div class="service-hero-copy">
        <p class="hero-kicker">${esc(category.name)}</p>
        <h1>${esc(service.name)}</h1>
        <p class="hero-lead">${esc(service.overview)}</p>
        <div class="cta-row">
          <a href="${esc((site.basePath || "") + "/pieteikt-darbu?pakalpojums=" + encodeURIComponent(service.name))}" class="btn">${esc(service.cta)}</a>
          <a href="${esc((site.basePath || "") + "/pakalpojumi/" + category.slug)}" class="btn btn-soft">${esc(t(site, "backToCategory"))}</a>
        </div>
      </div>
      <div class="service-hero-media">
        <img src="${esc(service.image)}" alt="${esc(service.name)}" loading="lazy" />
      </div>
    </section>

    <section class="block">
      <h2>${esc(t(site, "included"))}</h2>
      <ul class="list-tight">${bulletHtml}</ul>
    </section>

    <section class="block" id="faq">
      <h2>${esc(t(site, "faqTitle"))}</h2>
      <div class="faq-list">${faqHtml}</div>
    </section>
  </main>`;
}

export function renderLayout(site, page) {
  const pageTitle = page.title ? `${page.title} | ${site.siteName}` : site.title;
  const description = page.description || site.description;
  const canonical = `${site.siteUrl.replace(/\/$/, "")}${page.canonicalPath}`;
  const langPicker = renderLanguagePicker(site.lang, page.languagePaths || {});
  const navHtml = renderNav(site);
  const breadcrumbHtml = renderBreadcrumb(page.breadcrumb);
  const alternateLinks = renderAlternateLinks(site.lang, page.languagePaths || {}, site);
  const jsonLd = renderJsonLdBlocks(site, page, canonical);

  return `<!doctype html>
<html lang="${esc(site.lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  ${alternateLinks}
  <link rel="stylesheet" href="/assets/styles.css" />
  ${jsonLd}
</head>
<body>
  <header class="site-header">
    <div class="container site-header-main">
      <a href="${esc(site.basePath || "/")}" class="logo brand-lockup"><img src="/assets/logo-30sek24.svg" alt="30Sek logo" class="logo-img" /><span class="logo-wordmark">30Sek</span></a>
      <nav class="nav nav-primary">${navHtml}</nav>
      <div class="nav-actions"><a class="btn btn-nav" href="${esc(site.navCta.href)}">${esc(site.navCta.label)}</a>${langPicker}</div>
    </div>
  </header>
  ${breadcrumbHtml}
  ${page.mainHtml}
  ${renderFooter(site)}
  <script src="/assets/language-switcher.js"></script>
</body>
</html>`;
}
