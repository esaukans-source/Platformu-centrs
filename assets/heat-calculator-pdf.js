(function () {
  function esc(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function formatMoney(v) {
    var n = Number(v);
    return "EUR " + (Number.isFinite(n) ? n.toFixed(2) : "0.00");
  }

  function ascii(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7E]/g, "?");
  }

  var I18N = {
    lv: {
      title: "Siltuma tāmes kalkulators",
      date: "Datums",
      project: "Projekts",
      mode: "Režīms",
      noName: "(bez nosaukuma)",
      modeQuick: "Quick",
      modeEngineer: "Engineer",
      sectionSystem: "1) Sistēmas kopsavilkums",
      totalPower: "Kopā jauda",
      source: "Avota ieteikums",
      radiatorFlow: "Radiatoru plūsma",
      ufhFlow: "UFH plūsma",
      ufhLoops: "UFH kontūras",
      mixing: "Maisīšanas mezgls",
      boiler: "Boileris",
      boilerRange: "Boilera diapazons",
      expansion: "Izplešanās tvertne",
      pipeNeed: "UFH caurule ar rezervi",
      pipeRolls: "Rullīši (200m)",
      pipeLeftover: "Prognozētais atlikums",
      sectionRooms: "2) Telpu rezultāti",
      emitter: "emisija",
      emitterUfh: "UFH",
      emitterRadiator: "Radiators",
      emitterMixed: "Jaukta",
      ufhLine: "UFH",
      loops: "kontūras",
      radiator: "Radiators",
      sectionBom: "3) BOM un izmaksas",
      materials: "Materiāli",
      labor: "Darbs",
      overhead: "Pieskaitāmās izmaksas",
      reserve: "Rezerve",
      total: "KOPA",
      note: "Piezīme: Quick režīms ir orientējošs; Engineer precizitāte atkarīga no ievades datiem.",
      filename: "siltuma-tame.pdf",
      unitPcs: "gab",
      unitSet: "kompl",
      unitPack: "paka",
      mixingCompact: "Kompakts mezgls (līdz ~40m2, 2 kontūras)",
      mixingStandard: "Standarta mezgls (kolektors + sūknis + maisīšana)",
      bomUfhPipe: "UFH caurule 16x2",
      bomPipeRoll: "UFH caurules rullis 200m",
      bomCollector: "Kolektors 8 atzariem",
      bomCabinet: "Kolektora skapis",
      bomMixCompact: "Maisīšanas mezgls (kompakts, līdz ~40m2)",
      bomMixStandard: "Maisīšanas mezgls (standarta)",
      bomActuator: "Servopiedziņa kolektoram",
      bomEdgeTape: "Malu lente",
      bomInsulation: "Siltumizolācijas slānis UFH",
      bomClipPack: "UFH skavu paka (200 gab)",
      bomVaporBarrier: "Hidro/PE plēve UFH",
      bomRadiatorPrefix: "Radiators",
      bomValveSet: "Radiatora termovārsta komplekts",
      bomThermostat: "Telpas termostats",
      bomBalancing: "Noslēgarmatūra un balansēšanas komplekts",
      bomAirVent: "Atgaisotājs + drenāžas mezgls",
      bomFixing: "Stiprinājumi un montāžas materiāli",
      bomSourceConnection: "Avota pieslēguma mezgls",
    },
    en: {
      title: "Heat estimate calculator",
      date: "Date",
      project: "Project",
      mode: "Mode",
      noName: "(untitled)",
      modeQuick: "Quick",
      modeEngineer: "Engineer",
      sectionSystem: "1) System summary",
      totalPower: "Total power",
      source: "Source recommendation",
      radiatorFlow: "Radiator flow",
      ufhFlow: "UFH flow",
      ufhLoops: "UFH loops",
      mixing: "Mixing unit",
      boiler: "Boiler",
      boilerRange: "Boiler range",
      expansion: "Expansion vessel",
      pipeNeed: "UFH pipe incl. waste",
      pipeRolls: "Rolls (200m)",
      pipeLeftover: "Estimated leftover",
      sectionRooms: "2) Room results",
      emitter: "emitter",
      emitterUfh: "UFH",
      emitterRadiator: "Radiator",
      emitterMixed: "Mixed",
      ufhLine: "UFH",
      loops: "loops",
      radiator: "Radiator",
      sectionBom: "3) BOM and costs",
      materials: "Materials",
      labor: "Labor",
      overhead: "Overhead",
      reserve: "Reserve",
      total: "TOTAL",
      note: "Note: Quick mode is indicative; Engineer accuracy depends on input quality.",
      filename: "heat-estimate.pdf",
      unitPcs: "pcs",
      unitSet: "set",
      unitPack: "pack",
      mixingCompact: "Compact mixing unit (up to ~40 m2, 2 loops)",
      mixingStandard: "Standard mixing unit (manifold + pump + mixing)",
      bomUfhPipe: "UFH pipe 16x2",
      bomPipeRoll: "UFH pipe roll 200m",
      bomCollector: "8-port manifold",
      bomCabinet: "Manifold cabinet",
      bomMixCompact: "Mixing unit (compact, up to ~40 m2)",
      bomMixStandard: "Mixing unit (standard)",
      bomActuator: "Manifold actuator",
      bomEdgeTape: "Edge tape",
      bomInsulation: "UFH insulation layer",
      bomClipPack: "UFH clip pack (200 pcs)",
      bomVaporBarrier: "UFH PE/vapor film",
      bomRadiatorPrefix: "Radiator",
      bomValveSet: "Radiator valve set",
      bomThermostat: "Room thermostat",
      bomBalancing: "Shut-off and balancing set",
      bomAirVent: "Air vent + drain set",
      bomFixing: "Fixings and installation materials",
      bomSourceConnection: "Heat source connection set",
    },
    de: {
      title: "Waerme-Kostenvoranschlag Rechner",
      date: "Datum",
      project: "Projekt",
      mode: "Modus",
      noName: "(ohne Namen)",
      modeQuick: "Quick",
      modeEngineer: "Engineer",
      sectionSystem: "1) Systemuebersicht",
      totalPower: "Gesamtleistung",
      source: "Quellenempfehlung",
      radiatorFlow: "Heizkoerper-Durchfluss",
      ufhFlow: "UFH-Durchfluss",
      ufhLoops: "UFH-Kreise",
      mixing: "Mischgruppe",
      boiler: "Boiler",
      boilerRange: "Boiler-Bereich",
      expansion: "Ausdehnungsgefaess",
      pipeNeed: "UFH-Rohr inkl. Reserve",
      pipeRolls: "Rollen (200m)",
      pipeLeftover: "Geschaetzter Rest",
      sectionRooms: "2) Raumergebnisse",
      emitter: "typ",
      emitterUfh: "UFH",
      emitterRadiator: "Heizkoerper",
      emitterMixed: "Gemischt",
      ufhLine: "UFH",
      loops: "Kreise",
      radiator: "Heizkoerper",
      sectionBom: "3) BOM und Kosten",
      materials: "Material",
      labor: "Arbeit",
      overhead: "Gemeinkosten",
      reserve: "Reserve",
      total: "GESAMT",
      note: "Hinweis: Quick-Modus ist orientierend; die Genauigkeit von Engineer haengt von der Eingabequalitaet ab.",
      filename: "waerme-kostenvoranschlag.pdf",
      unitPcs: "Stk",
      unitSet: "Set",
      unitPack: "Pack",
      mixingCompact: "Kompakte Mischgruppe (bis ~40 m2, 2 Kreise)",
      mixingStandard: "Standard-Mischgruppe (Verteiler + Pumpe + Mischer)",
      bomUfhPipe: "UFH-Rohr 16x2",
      bomPipeRoll: "UFH-Rohrrolle 200m",
      bomCollector: "Verteiler 8 Abgaenge",
      bomCabinet: "Verteilerschrank",
      bomMixCompact: "Mischgruppe (kompakt, bis ~40 m2)",
      bomMixStandard: "Mischgruppe (standard)",
      bomActuator: "Stellantrieb fuer Verteiler",
      bomEdgeTape: "Randdaemmstreifen",
      bomInsulation: "UFH-Daemmschicht",
      bomClipPack: "UFH-Klammerpaket (200 Stk)",
      bomVaporBarrier: "UFH PE-/Dampffolie",
      bomRadiatorPrefix: "Heizkoerper",
      bomValveSet: "Heizkoerper-Thermoventil-Set",
      bomThermostat: "Raumthermostat",
      bomBalancing: "Absperr- und Abgleichset",
      bomAirVent: "Entluefter + Entleerungsset",
      bomFixing: "Befestigungen und Montagematerial",
      bomSourceConnection: "Anschlussset Waermequelle",
    },
    pl: {
      title: "Kalkulator wyceny ogrzewania",
      date: "Data",
      project: "Projekt",
      mode: "Tryb",
      noName: "(bez nazwy)",
      modeQuick: "Quick",
      modeEngineer: "Engineer",
      sectionSystem: "1) Podsumowanie systemu",
      totalPower: "Moc calkowita",
      source: "Rekomendacja zrodla",
      radiatorFlow: "Przeplyw grzejnikow",
      ufhFlow: "Przeplyw UFH",
      ufhLoops: "Petle UFH",
      mixing: "Uklad mieszajacy",
      boiler: "Boiler",
      boilerRange: "Zakres boilera",
      expansion: "Naczynie wzbiorcze",
      pipeNeed: "Rura UFH z zapasem",
      pipeRolls: "Rolki (200m)",
      pipeLeftover: "Szacowany nadmiar",
      sectionRooms: "2) Wyniki pomieszczen",
      emitter: "typ",
      emitterUfh: "UFH",
      emitterRadiator: "Grzejnik",
      emitterMixed: "Mieszany",
      ufhLine: "UFH",
      loops: "petle",
      radiator: "Grzejnik",
      sectionBom: "3) BOM i koszty",
      materials: "Materialy",
      labor: "Robocizna",
      overhead: "Koszty posrednie",
      reserve: "Rezerwa",
      total: "RAZEM",
      note: "Uwaga: tryb Quick jest orientacyjny; dokladnosc Engineer zalezy od jakosci danych wejsciowych.",
      filename: "wycena-ogrzewania.pdf",
      unitPcs: "szt",
      unitSet: "kpl",
      unitPack: "paczka",
      mixingCompact: "Kompaktowy uklad (do ~40 m2, 2 petle)",
      mixingStandard: "Standardowy uklad (rozdzielacz + pompa + mieszanie)",
      bomUfhPipe: "Rura UFH 16x2",
      bomPipeRoll: "Rolka rury UFH 200m",
      bomCollector: "Rozdzielacz 8 obwodow",
      bomCabinet: "Szafka rozdzielacza",
      bomMixCompact: "Uklad mieszajacy (kompaktowy, do ~40 m2)",
      bomMixStandard: "Uklad mieszajacy (standardowy)",
      bomActuator: "Silownik rozdzielacza",
      bomEdgeTape: "Tasma brzegowa",
      bomInsulation: "Warstwa izolacji UFH",
      bomClipPack: "Paczka klipsow UFH (200 szt)",
      bomVaporBarrier: "Folia PE/paroszczelna UFH",
      bomRadiatorPrefix: "Grzejnik",
      bomValveSet: "Zestaw zaworu termostatycznego grzejnika",
      bomThermostat: "Termostat pokojowy",
      bomBalancing: "Zestaw armatury odcinajacej i rownowazacej",
      bomAirVent: "Odpowietrznik + zestaw spustowy",
      bomFixing: "Mocowania i materialy montazowe",
      bomSourceConnection: "Zestaw podlaczenia zrodla ciepla",
    },
    ru: {
      title: "Калькулятор тепловой сметы",
      date: "Дата",
      project: "Проект",
      mode: "Режим",
      noName: "(без названия)",
      modeQuick: "Quick",
      modeEngineer: "Engineer",
      sectionSystem: "1) Сводка по системе",
      totalPower: "Общая мощность",
      source: "Рекомендация по источнику",
      radiatorFlow: "Расход радиаторов",
      ufhFlow: "Расход UFH",
      ufhLoops: "Контуры UFH",
      mixing: "Смесительный узел",
      boiler: "Бойлер",
      boilerRange: "Диапазон бойлера",
      expansion: "Расширительный бак",
      pipeNeed: "Труба UFH с запасом",
      pipeRolls: "Рулоны (200м)",
      pipeLeftover: "Оценка остатка",
      sectionRooms: "2) Результаты по помещениям",
      emitter: "тип",
      emitterUfh: "UFH",
      emitterRadiator: "Радиатор",
      emitterMixed: "Смешанная",
      ufhLine: "UFH",
      loops: "контуры",
      radiator: "Радиатор",
      sectionBom: "3) BOM и стоимость",
      materials: "Материалы",
      labor: "Работа",
      overhead: "Накладные",
      reserve: "Резерв",
      total: "ИТОГО",
      note: "Примечание: Quick режим ориентировочный; точность Engineer зависит от качества входных данных.",
      filename: "teplovaya-smeta.pdf",
      unitPcs: "шт",
      unitSet: "компл",
      unitPack: "уп.",
      mixingCompact: "Компактный узел (до ~40 м2, 2 контура)",
      mixingStandard: "Стандартный узел (коллектор + насос + смешивание)",
      bomUfhPipe: "Труба UFH 16x2",
      bomPipeRoll: "Рулон трубы UFH 200м",
      bomCollector: "Коллектор на 8 выходов",
      bomCabinet: "Шкаф коллектора",
      bomMixCompact: "Смесительный узел (компактный, до ~40 м2)",
      bomMixStandard: "Смесительный узел (стандартный)",
      bomActuator: "Сервопривод коллектора",
      bomEdgeTape: "Кромочная лента",
      bomInsulation: "Теплоизоляция UFH",
      bomClipPack: "Пачка клипс UFH (200 шт)",
      bomVaporBarrier: "UFH PE/пароизоляционная пленка",
      bomRadiatorPrefix: "Радиатор",
      bomValveSet: "Комплект радиаторного термоклапана",
      bomThermostat: "Комнатный термостат",
      bomBalancing: "Комплект запорной и балансировочной арматуры",
      bomAirVent: "Воздухоотводчик + дренажный узел",
      bomFixing: "Крепеж и монтажные материалы",
      bomSourceConnection: "Узел подключения источника тепла",
    },
  };

  function normalizeLang(input) {
    var lang = String(input || "").toLowerCase().slice(0, 2);
    if (lang === "en" || lang === "ru" || lang === "de" || lang === "pl") return lang;
    return "lv";
  }

  function t(lang, key) {
    var dict = I18N[lang] || I18N.lv;
    return dict[key] || I18N.lv[key] || key;
  }

  function displayUnit(unit, lang) {
    if (lang === "lv") return unit;
    if (unit === "gab") return t(lang, "unitPcs");
    if (unit === "kompl") return t(lang, "unitSet");
    if (unit === "paka") return t(lang, "unitPack");
    return unit;
  }

  function displayEmitter(emitter, lang) {
    if (emitter === "ufh") return t(lang, "emitterUfh");
    if (emitter === "radiator") return t(lang, "emitterRadiator");
    if (emitter === "mixed") return t(lang, "emitterMixed");
    return emitter;
  }

  function displayMixingType(value, lang) {
    if (!value || value === "-") return "-";
    if (value.indexOf("Kompakts mezgls") === 0) return t(lang, "mixingCompact");
    if (value.indexOf("Standarta mezgls") === 0) return t(lang, "mixingStandard");
    return value;
  }

  function displayBomName(row, lang) {
    if (lang === "lv") return row.name;

    if (row.id.indexOf("radiator_") === 0) {
      return row.name.replace(/^Radiators\s+/, t(lang, "bomRadiatorPrefix") + " ");
    }

    var map = {
      ufh_pipe: t(lang, "bomUfhPipe"),
      ufh_pipe_roll_200: t(lang, "bomPipeRoll"),
      collector_set: t(lang, "bomCollector"),
      cabinet: t(lang, "bomCabinet"),
      mixing_compact: t(lang, "bomMixCompact"),
      mixing_std: t(lang, "bomMixStandard"),
      actuators: t(lang, "bomActuator"),
      edge_tape: t(lang, "bomEdgeTape"),
      clips_pack: t(lang, "bomClipPack"),
      insulation: t(lang, "bomInsulation"),
      vapor_barrier: t(lang, "bomVaporBarrier"),
      rad_valves: t(lang, "bomValveSet"),
      thermostats: t(lang, "bomThermostat"),
      balancing: t(lang, "bomBalancing"),
      air_vent: t(lang, "bomAirVent"),
      fixing: t(lang, "bomFixing"),
      source_conn: t(lang, "bomSourceConnection"),
    };

    return map[row.id] || row.name;
  }

  function toLines(result, lang) {
    var lines = [];
    var locale = lang === "en" ? "en-IE" : lang === "ru" ? "ru-RU" : lang === "de" ? "de-DE" : lang === "pl" ? "pl-PL" : "lv-LV";

    lines.push(t(lang, "title"));
    lines.push(t(lang, "date") + ": " + new Date(result.generatedAt).toLocaleString(locale));
    lines.push(t(lang, "project") + ": " + (result.project.name || t(lang, "noName")));
    lines.push(t(lang, "mode") + ": " + (result.mode === "engineer" ? t(lang, "modeEngineer") : t(lang, "modeQuick")));
    lines.push("");

    lines.push(t(lang, "sectionSystem"));
    lines.push("  " + t(lang, "totalPower") + ": " + result.system.totalKw + " kW");
    lines.push("  " + t(lang, "source") + ": " + result.system.sourceKw + " kW");
    lines.push("  " + t(lang, "radiatorFlow") + ": " + result.system.radiatorFlowLMin + " l/min");
    lines.push("  " + t(lang, "ufhFlow") + ": " + result.system.ufhFlowLMin + " l/min");
    lines.push("  " + t(lang, "ufhLoops") + ": " + result.system.totalLoops);
    lines.push("  " + t(lang, "mixing") + ": " + displayMixingType(result.system.mixingType, lang));
    lines.push("  " + t(lang, "boiler") + ": " + result.system.dhwL + " L");
    lines.push("  " + t(lang, "boilerRange") + ": " + result.system.dhwMinL + "-" + result.system.dhwMaxL + " L");
    lines.push("  " + t(lang, "expansion") + ": " + result.system.expansionL + " L");
    lines.push("  " + t(lang, "pipeNeed") + ": " + result.system.pipeNeededM + " m");
    lines.push("  " + t(lang, "pipeRolls") + ": " + result.system.pipeRolls200 + " x " + result.system.pipeRollLengthM + " m");
    lines.push("  " + t(lang, "pipeLeftover") + ": " + result.system.pipeLeftoverM + " m");
    lines.push("");

    lines.push(t(lang, "sectionRooms"));
    result.rooms.forEach(function (room) {
      lines.push(
        "  - " +
          room.room.name +
          " | " +
          room.load.totalW +
          " W" +
          " | " +
          room.load.wpm2 +
          " W/m2" +
          " | " +
          t(lang, "emitter") +
          ": " +
          displayEmitter(room.room.emitter, lang)
      );
      if (room.ufh.enabled) {
        lines.push(
          "      " +
            t(lang, "ufhLine") +
            ": " +
            room.ufh.area +
            " m2, " +
            room.ufh.totalLengthM +
            " m, " +
            room.ufh.loops +
            " " +
            t(lang, "loops")
        );
      }
      if (room.radiator.enabled && room.radiator.selected.qty > 0) {
        lines.push("      " + t(lang, "radiator") + ": " + room.radiator.selected.model + " x" + room.radiator.selected.qty);
      }
    });
    lines.push("");

    lines.push(t(lang, "sectionBom"));
    result.bom.rows.forEach(function (row) {
      lines.push(
        "  - " +
          displayBomName(row, lang) +
          " | " +
          row.qty +
          " " +
          displayUnit(row.unit, lang) +
          " | " +
          t(lang, "materials").toLowerCase() +
          " " +
          formatMoney(row.materialTotal) +
          " | " +
          t(lang, "labor").toLowerCase() +
          " " +
          formatMoney(row.laborTotal)
      );
    });
    lines.push("  " + t(lang, "materials") + ": " + formatMoney(result.bom.totals.material));
    lines.push("  " + t(lang, "labor") + ": " + formatMoney(result.bom.totals.labor));
    lines.push("  " + t(lang, "overhead") + ": " + formatMoney(result.bom.totals.overhead));
    lines.push("  " + t(lang, "reserve") + ": " + formatMoney(result.bom.totals.reserve));
    lines.push("  " + t(lang, "total") + ": " + formatMoney(result.bom.totals.grand));

    lines.push("");
    lines.push(t(lang, "note"));
    return lines;
  }

  function buildPdfFromLines(lines) {
    var pageW = 595;
    var pageH = 842;
    var marginX = 40;
    var marginTop = 800;
    var lineH = 14;

    var pages = [];
    var page = [];
    var y = marginTop;

    lines.forEach(function (line) {
      if (y < 50) {
        pages.push(page);
        page = [];
        y = marginTop;
      }
      page.push({ x: marginX, y: y, text: line });
      y -= lineH;
    });
    if (page.length) pages.push(page);

    var objects = [null, null];
    function addObject(body) {
      objects.push(body);
      return objects.length;
    }

    var fontObj = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    var pageIds = [];

    pages.forEach(function (items) {
      var stream = "BT\n/F1 10 Tf\n";
      items.forEach(function (it) {
        stream += "1 0 0 1 " + it.x + " " + it.y + " Tm (" + esc(ascii(it.text)) + ") Tj\n";
      });
      stream += "ET";
      var contentBody = "<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream";
      var contentId = addObject(contentBody);

      var pageBody =
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " +
        pageW +
        " " +
        pageH +
        "] " +
        "/Resources << /Font << /F1 " +
        fontObj +
        " 0 R >> >> /Contents " +
        contentId +
        " 0 R >>";
      var pageId = addObject(pageBody);
      pageIds.push(pageId);
    });

    var kids = pageIds
      .map(function (id) {
        return id + " 0 R";
      })
      .join(" ");
    objects[1] = "<< /Type /Pages /Kids [ " + kids + " ] /Count " + pageIds.length + " >>";
    objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";

    var pdf = "%PDF-1.4\n";
    var offsets = [0];
    for (var i = 0; i < objects.length; i++) {
      offsets.push(pdf.length);
      pdf += i + 1 + " 0 obj\n" + objects[i] + "\nendobj\n";
    }

    var xrefStart = pdf.length;
    pdf += "xref\n0 " + (objects.length + 1) + "\n";
    pdf += "0000000000 65535 f \n";
    for (var j = 1; j <= objects.length; j++) {
      pdf += String(offsets[j]).padStart(10, "0") + " 00000 n \n";
    }
    pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\n";
    pdf += "startxref\n" + xrefStart + "\n%%EOF";
    return new Blob([pdf], { type: "application/pdf" });
  }

  function download(result, options) {
    if (!result) return;
    var lang = normalizeLang((options && options.lang) || (document.documentElement && document.documentElement.lang));
    var lines = toLines(result, lang);
    var blob = buildPdfFromLines(lines);
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = t(lang, "filename");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 500);
  }

  window.HeatCalculatorPDF = {
    download: download,
  };
})();
