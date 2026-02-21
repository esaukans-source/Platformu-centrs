#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  renderLayout,
  renderHomeMain,
  renderHubMain,
  renderCategoryMain,
  renderServiceMain
} from "../templates/site-template.mjs";

const ROOT = process.cwd();
const BUILD_LANGS = ["lv", "en", "ru", "de", "pl"];
const ALL_LANGS = ["lv", "en", "ru", "de", "pl"];
const BASE_BY_LANG = {
  lv: "",
  en: "/en",
  ru: "/ru",
  de: "/de",
  pl: "/pl"
};

function cleanPath(urlPath) {
  if (!urlPath || urlPath === "/") return "/";
  return `/${urlPath.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

function routeToFile(urlPath) {
  const cleaned = cleanPath(urlPath);
  if (cleaned === "/") {
    return path.join(ROOT, "index.html");
  }
  return path.join(ROOT, cleaned.slice(1), "index.html");
}

async function writePage(urlPath, html) {
  const filePath = routeToFile(urlPath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, html, "utf8");
}

async function readJson(filePath) {
  const raw = await fs.readFile(path.join(ROOT, filePath), "utf8");
  return JSON.parse(raw);
}

function labelFor(site, key) {
  const labelsByLang = {
    lv: { home: "Sākums", services: "Pakalpojumi" },
    en: { home: "Home", services: "Services" },
    ru: { home: "Главная", services: "Услуги" },
    de: { home: "Start", services: "Leistungen" },
    pl: { home: "Start", services: "Uslugi" }
  };
  const labels = labelsByLang[site.lang] || labelsByLang.en;
  return labels[key] || labelsByLang.en[key];
}

function buildHomeLanguagePaths() {
  return {
    lv: "/",
    en: "/en/",
    ru: "/ru/",
    de: "/de/",
    pl: "/pl/"
  };
}

function buildHubLanguagePaths() {
  return {
    lv: "/pakalpojumi",
    en: "/en/pakalpojumi",
    ru: "/ru/pakalpojumi",
    de: "/de/pakalpojumi",
    pl: "/pl/pakalpojumi"
  };
}

function serviceRoute(lang, slug) {
  const base = BASE_BY_LANG[lang] || "";
  return cleanPath(`${base}/${slug}`);
}

function categoryRoute(lang, slug) {
  const base = BASE_BY_LANG[lang] || "";
  return cleanPath(`${base}/pakalpojumi/${slug}`);
}

function hubRoute(lang) {
  const base = BASE_BY_LANG[lang] || "";
  return cleanPath(`${base}/pakalpojumi`);
}

function homeRoute(lang) {
  const base = BASE_BY_LANG[lang] || "";
  return base ? `${base}/` : "/";
}

async function existsRoute(urlPath) {
  const filePath = routeToFile(urlPath);
  try {
    await fs.access(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}

async function buildServiceLanguagePaths(slug) {
  const pairs = await Promise.all(
    ALL_LANGS.map(async (lang) => {
      const candidate = serviceRoute(lang, slug);
      const exists = await existsRoute(candidate);
      if (exists || BUILD_LANGS.includes(lang)) {
        return [lang, candidate];
      }
      return [lang, homeRoute(lang)];
    })
  );
  return Object.fromEntries(pairs);
}

function buildCategoryLanguagePaths(slug) {
  return {
    lv: categoryRoute("lv", slug),
    en: categoryRoute("en", slug),
    ru: categoryRoute("ru", slug),
    de: categoryRoute("de", slug),
    pl: categoryRoute("pl", slug)
  };
}

async function buildLanguage(site) {
  const servicesBySlug = new Map(site.services.map((service) => [service.slug, service]));

  const homeHtml = renderLayout(site, {
    title:
      site.lang === "lv"
        ? "Meistaru platforma Eiropā"
        : site.lang === "ru"
          ? "Платформа мастеров в Европе"
          : site.lang === "de"
            ? "Handwerkerplattform in Europa"
            : site.lang === "pl"
              ? "Platforma fachowcow w Europie"
              : "Contractor Platform in Europe",
    description: site.description,
    canonicalPath: homeRoute(site.lang),
    languagePaths: buildHomeLanguagePaths(),
    mainHtml: renderHomeMain(site)
  });
  await writePage(homeRoute(site.lang), homeHtml);

  const hubHtml = renderLayout(site, {
    title: labelFor(site, "services"),
    description:
      site.lang === "lv"
        ? "Pakalpojumu kategorijas un nozares klientiem un meistariem."
        : site.lang === "ru"
          ? "Категории услуг и направления для клиентов и мастеров."
          : site.lang === "de"
            ? "Leistungskategorien und Fachbereiche fuer Kunden und Handwerker."
            : site.lang === "pl"
              ? "Kategorie uslug i specjalizacje dla klientow i fachowcow."
              : "Service categories and disciplines for customers and contractors.",
    canonicalPath: hubRoute(site.lang),
    languagePaths: buildHubLanguagePaths(),
    breadcrumb: {
      items: [
        { label: labelFor(site, "home"), href: homeRoute(site.lang) },
        { label: labelFor(site, "services"), href: hubRoute(site.lang) }
      ]
    },
    mainHtml: renderHubMain(site)
  });
  await writePage(hubRoute(site.lang), hubHtml);

  for (const category of site.categories) {
    const categoryServices = category.serviceSlugs
      .map((slug) => servicesBySlug.get(slug))
      .filter(Boolean);

    const categoryHtml = renderLayout(site, {
      title: category.name,
      description: category.description,
      canonicalPath: categoryRoute(site.lang, category.slug),
      languagePaths: buildCategoryLanguagePaths(category.slug),
      breadcrumb: {
        items: [
          { label: labelFor(site, "home"), href: homeRoute(site.lang) },
          { label: labelFor(site, "services"), href: hubRoute(site.lang) },
          { label: category.name, href: categoryRoute(site.lang, category.slug) }
        ]
      },
      mainHtml: renderCategoryMain(site, category, categoryServices)
    });

    await writePage(categoryRoute(site.lang, category.slug), categoryHtml);
  }

  for (const service of site.services) {
    const category = site.categories.find((item) => item.slug === service.categorySlug);
    if (!category) {
      continue;
    }

    const serviceHtml = renderLayout(site, {
      title: service.name,
      description: service.overview,
      canonicalPath: serviceRoute(site.lang, service.slug),
      languagePaths: await buildServiceLanguagePaths(service.slug),
      breadcrumb: {
        items: [
          { label: labelFor(site, "home"), href: homeRoute(site.lang) },
          { label: labelFor(site, "services"), href: hubRoute(site.lang) },
          { label: category.name, href: categoryRoute(site.lang, category.slug) },
          { label: service.name, href: serviceRoute(site.lang, service.slug) }
        ]
      },
      mainHtml: renderServiceMain(site, service, category)
    });

    await writePage(serviceRoute(site.lang, service.slug), serviceHtml);
  }
}

async function run() {
  const datasets = await Promise.all(
    BUILD_LANGS.map(async (lang) => readJson(`content/${lang}/site.json`))
  );

  for (const site of datasets) {
    await buildLanguage(site);
  }

  process.stdout.write("Site build completed for lv + en + ru + de + pl.\n");
}

run().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
