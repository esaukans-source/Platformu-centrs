(function () {
  var constants = window.HeatConstants;
  var calculator = window.HeatCalculator;

  var lang = String((document.documentElement && document.documentElement.lang) || "lv")
    .toLowerCase()
    .slice(0, 2);
  if (lang !== "en" && lang !== "ru" && lang !== "de" && lang !== "pl") lang = "lv";

  var I18N = {
    lv: {
      roomDefaultName: "Telpa",
      roomTitle: "Telpa",
      remove: "Noņemt",
      roomName: "Nosaukums",
      roomFloor: "Stāvs",
      roomArea: "Platība (m²)",
      roomHeight: "Augstums (m)",
      roomEmitter: "Emisija",
      emitterUfh: "UFH",
      emitterRadiator: "Radiators",
      emitterMixed: "Jaukta",
      roomUfhShare: "UFH daļa (%)",
      roomUfhArea: "UFH platība (m²)",
      roomStep: "Solis (mm)",
      roomCollectorDistance: "Pievads līdz kolektoram (m)",
      roomCondition: "Ēkas stāvoklis",
      conditionNew: "Jauns",
      conditionRenovated: "Renovēts",
      conditionOld: "Vecs",
      roomCover: "Segums",
      coverTile: "Flīzes",
      coverLaminate: "Lamināts",
      coverParquet: "Parkets",
      engineerFields: "Engineer lauki",
      wallArea: "Sienu platība (m²)",
      wallU: "Sienas U",
      windowArea: "Logu platība (m²)",
      windowU: "Logu U",
      floorArea: "Grīdas platība (m²)",
      floorU: "Grīdas U",
      ceilingArea: "Griestu platība (m²)",
      ceilingU: "Griestu U",
      infiltrationN: "Infiltrācija n (1/h)",
      summaryRooms: "Telpu kopsavilkums",
      summarySystem: "Sistēmas kopsavilkums",
      summaryBom: "BOM un izmaksas",
      colRoom: "Telpa",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Kontūras",
      colFlowPerLoop: "Plūsma/ kontūra (l/min)",
      colRadiators: "Radiatori",
      totalPower: "Kopējā jauda:",
      sourceSuggestion: "Avota ieteikums:",
      radiatorFlow: "Radiatoru plūsma:",
      ufhFlow: "UFH plūsma:",
      ufhLoops: "UFH kontūras:",
      mixingUnit: "Maisīšanas mezgls:",
      boiler: "Boileris:",
      expansion: "Izplešanās tvertne:",
      colPosition: "Pozīcija",
      colQty: "Daudzums",
      colMaterialUnit: "Materiāls / vien.",
      colLaborUnit: "Darbs / vien.",
      colMaterials: "Materiāli",
      colLabor: "Darbs",
      totalMaterials: "Materiāli:",
      totalLabor: "Darbs:",
      totalOverhead: "Pieskaitāmās izmaksas:",
      totalReserve: "Rezerve:",
      totalGrand: "Kopā:",
      validationRooms: "Pievieno vismaz vienu telpu.",
      validationTemp: "Norādi korektas temperatūras.",
      validationRoomFields: "Pārbaudi telpu laukumu, augstumu un nosaukumus.",
      modeQuick: "Quick režīms",
      modeEngineer: "Engineer režīms",
      mixingCompact: "Kompakts mezgls (līdz ~40m², 2 kontūras)",
      mixingStandard: "Standarta mezgls (kolektors + sūknis + maisīšana)",
      unitPcs: "gab",
      unitSet: "kompl",
      bomUfhPipe: "UFH caurule 16x2",
      bomCollector: "Kolektors 8 atzariem",
      bomCabinet: "Kolektora skapis",
      bomMixCompact: "Maisīšanas mezgls (kompakts, līdz ~40m²)",
      bomMixStandard: "Maisīšanas mezgls (standarta)",
      bomActuator: "Servopiedziņa kolektoram",
      bomEdgeTape: "Malu lenta",
      bomInsulation: "Siltumizolācijas slānis UFH",
      bomRadiatorPrefix: "Radiators",
      bomValveSet: "Radiatora termovārsta komplekts",
      bomThermostat: "Telpas termostats",
      bomBalancing: "Noslēgarmatūra un balansēšanas komplekts",
      bomAirVent: "Atgaisotājs + drenāžas mezgls",
      bomFixing: "Stiprinājumi un montāžas materiāli",
      bomSourceConnection: "Avota pieslēguma mezgls",
    },
    en: {
      roomDefaultName: "Room",
      roomTitle: "Room",
      remove: "Remove",
      roomName: "Name",
      roomFloor: "Floor",
      roomArea: "Area (m²)",
      roomHeight: "Height (m)",
      roomEmitter: "Emitter",
      emitterUfh: "UFH",
      emitterRadiator: "Radiator",
      emitterMixed: "Mixed",
      roomUfhShare: "UFH share (%)",
      roomUfhArea: "UFH area (m²)",
      roomStep: "Spacing (mm)",
      roomCollectorDistance: "Lead to manifold (m)",
      roomCondition: "Building condition",
      conditionNew: "New",
      conditionRenovated: "Renovated",
      conditionOld: "Old",
      roomCover: "Floor cover",
      coverTile: "Tile",
      coverLaminate: "Laminate",
      coverParquet: "Parquet",
      engineerFields: "Engineer fields",
      wallArea: "Wall area (m²)",
      wallU: "Wall U",
      windowArea: "Window area (m²)",
      windowU: "Window U",
      floorArea: "Floor area (m²)",
      floorU: "Floor U",
      ceilingArea: "Ceiling area (m²)",
      ceilingU: "Ceiling U",
      infiltrationN: "Infiltration n (1/h)",
      summaryRooms: "Room summary",
      summarySystem: "System summary",
      summaryBom: "BOM and costs",
      colRoom: "Room",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Loops",
      colFlowPerLoop: "Flow / loop (l/min)",
      colRadiators: "Radiators",
      totalPower: "Total power:",
      sourceSuggestion: "Source recommendation:",
      radiatorFlow: "Radiator flow:",
      ufhFlow: "UFH flow:",
      ufhLoops: "UFH loops:",
      mixingUnit: "Mixing unit:",
      boiler: "Boiler:",
      expansion: "Expansion vessel:",
      colPosition: "Item",
      colQty: "Quantity",
      colMaterialUnit: "Material / unit",
      colLaborUnit: "Labor / unit",
      colMaterials: "Materials",
      colLabor: "Labor",
      totalMaterials: "Materials:",
      totalLabor: "Labor:",
      totalOverhead: "Overhead:",
      totalReserve: "Reserve:",
      totalGrand: "Total:",
      validationRooms: "Add at least one room.",
      validationTemp: "Enter valid temperatures.",
      validationRoomFields: "Check room area, height, and names.",
      modeQuick: "Quick mode",
      modeEngineer: "Engineer mode",
      mixingCompact: "Compact mixing unit (up to ~40 m², 2 loops)",
      mixingStandard: "Standard mixing unit (manifold + pump + mixing)",
      unitPcs: "pcs",
      unitSet: "set",
      bomUfhPipe: "UFH pipe 16x2",
      bomCollector: "8-port manifold",
      bomCabinet: "Manifold cabinet",
      bomMixCompact: "Mixing unit (compact, up to ~40 m²)",
      bomMixStandard: "Mixing unit (standard)",
      bomActuator: "Manifold actuator",
      bomEdgeTape: "Edge tape",
      bomInsulation: "UFH insulation layer",
      bomRadiatorPrefix: "Radiator",
      bomValveSet: "Radiator valve set",
      bomThermostat: "Room thermostat",
      bomBalancing: "Shut-off and balancing set",
      bomAirVent: "Air vent + drain set",
      bomFixing: "Fixings and installation materials",
      bomSourceConnection: "Heat source connection set",
    },
    de: {
      roomDefaultName: "Raum",
      roomTitle: "Raum",
      remove: "Entfernen",
      roomName: "Name",
      roomFloor: "Stockwerk",
      roomArea: "Flaeche (m²)",
      roomHeight: "Hoehe (m)",
      roomEmitter: "Heizflaeche",
      emitterUfh: "UFH",
      emitterRadiator: "Heizkoerper",
      emitterMixed: "Gemischt",
      roomUfhShare: "UFH-Anteil (%)",
      roomUfhArea: "UFH-Flaeche (m²)",
      roomStep: "Verlegeabstand (mm)",
      roomCollectorDistance: "Anbindung zum Verteiler (m)",
      roomCondition: "Gebaeudezustand",
      conditionNew: "Neu",
      conditionRenovated: "Saniert",
      conditionOld: "Alt",
      roomCover: "Bodenbelag",
      coverTile: "Fliese",
      coverLaminate: "Laminat",
      coverParquet: "Parkett",
      engineerFields: "Engineer-Felder",
      wallArea: "Wandflaeche (m²)",
      wallU: "Wand-U",
      windowArea: "Fensterflaeche (m²)",
      windowU: "Fenster-U",
      floorArea: "Bodenflaeche (m²)",
      floorU: "Boden-U",
      ceilingArea: "Deckenflaeche (m²)",
      ceilingU: "Decken-U",
      infiltrationN: "Infiltration n (1/h)",
      summaryRooms: "Raumuebersicht",
      summarySystem: "Systemuebersicht",
      summaryBom: "BOM und Kosten",
      colRoom: "Raum",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Kreise",
      colFlowPerLoop: "Durchfluss / Kreis (l/min)",
      colRadiators: "Heizkoerper",
      totalPower: "Gesamtleistung:",
      sourceSuggestion: "Quellenempfehlung:",
      radiatorFlow: "Heizkoerper-Durchfluss:",
      ufhFlow: "UFH-Durchfluss:",
      ufhLoops: "UFH-Kreise:",
      mixingUnit: "Mischgruppe:",
      boiler: "Boiler:",
      expansion: "Ausdehnungsgefaess:",
      colPosition: "Position",
      colQty: "Menge",
      colMaterialUnit: "Material / Einh.",
      colLaborUnit: "Arbeit / Einh.",
      colMaterials: "Material",
      colLabor: "Arbeit",
      totalMaterials: "Material:",
      totalLabor: "Arbeit:",
      totalOverhead: "Gemeinkosten:",
      totalReserve: "Reserve:",
      totalGrand: "Gesamt:",
      validationRooms: "Fuege mindestens einen Raum hinzu.",
      validationTemp: "Bitte gueltige Temperaturen angeben.",
      validationRoomFields: "Pruefe Flaeche, Hoehe und Raumname.",
      modeQuick: "Quick-Modus",
      modeEngineer: "Engineer-Modus",
      mixingCompact: "Kompakte Mischgruppe (bis ~40 m², 2 Kreise)",
      mixingStandard: "Standard-Mischgruppe (Verteiler + Pumpe + Mischer)",
      unitPcs: "Stk",
      unitSet: "Set",
      bomUfhPipe: "UFH-Rohr 16x2",
      bomCollector: "Verteiler 8 Abgaenge",
      bomCabinet: "Verteilerschrank",
      bomMixCompact: "Mischgruppe (kompakt, bis ~40 m²)",
      bomMixStandard: "Mischgruppe (standard)",
      bomActuator: "Stellantrieb fuer Verteiler",
      bomEdgeTape: "Randdaemmstreifen",
      bomInsulation: "UFH-Daemmschicht",
      bomRadiatorPrefix: "Heizkoerper",
      bomValveSet: "Heizkoerper-Thermoventil-Set",
      bomThermostat: "Raumthermostat",
      bomBalancing: "Absperr- und Abgleichset",
      bomAirVent: "Entluefter + Entleerungsset",
      bomFixing: "Befestigungen und Montagematerial",
      bomSourceConnection: "Anschlussset Waermequelle",
    },
    pl: {
      roomDefaultName: "Pomieszczenie",
      roomTitle: "Pomieszczenie",
      remove: "Usun",
      roomName: "Nazwa",
      roomFloor: "Pietro",
      roomArea: "Powierzchnia (m²)",
      roomHeight: "Wysokosc (m)",
      roomEmitter: "Emiter",
      emitterUfh: "UFH",
      emitterRadiator: "Grzejnik",
      emitterMixed: "Mieszany",
      roomUfhShare: "Udzial UFH (%)",
      roomUfhArea: "Powierzchnia UFH (m²)",
      roomStep: "Rozstaw (mm)",
      roomCollectorDistance: "Dojscie do rozdzielacza (m)",
      roomCondition: "Stan budynku",
      conditionNew: "Nowy",
      conditionRenovated: "Po remoncie",
      conditionOld: "Stary",
      roomCover: "Pokrycie podlogi",
      coverTile: "Plytki",
      coverLaminate: "Laminat",
      coverParquet: "Parkiet",
      engineerFields: "Pola Engineer",
      wallArea: "Powierzchnia scian (m²)",
      wallU: "U sciany",
      windowArea: "Powierzchnia okien (m²)",
      windowU: "U okien",
      floorArea: "Powierzchnia podlogi (m²)",
      floorU: "U podlogi",
      ceilingArea: "Powierzchnia sufitu (m²)",
      ceilingU: "U sufitu",
      infiltrationN: "Infiltracja n (1/h)",
      summaryRooms: "Podsumowanie pomieszczen",
      summarySystem: "Podsumowanie systemu",
      summaryBom: "BOM i koszty",
      colRoom: "Pomieszczenie",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Petle",
      colFlowPerLoop: "Przeplyw / petla (l/min)",
      colRadiators: "Grzejniki",
      totalPower: "Moc calkowita:",
      sourceSuggestion: "Rekomendacja zrodla:",
      radiatorFlow: "Przeplyw grzejnikow:",
      ufhFlow: "Przeplyw UFH:",
      ufhLoops: "Petle UFH:",
      mixingUnit: "Uklad mieszajacy:",
      boiler: "Boiler:",
      expansion: "Naczynie wzbiorcze:",
      colPosition: "Pozycja",
      colQty: "Ilosc",
      colMaterialUnit: "Material / jedn.",
      colLaborUnit: "Robocizna / jedn.",
      colMaterials: "Materialy",
      colLabor: "Robocizna",
      totalMaterials: "Materialy:",
      totalLabor: "Robocizna:",
      totalOverhead: "Koszty posrednie:",
      totalReserve: "Rezerwa:",
      totalGrand: "Razem:",
      validationRooms: "Dodaj przynajmniej jedno pomieszczenie.",
      validationTemp: "Podaj poprawne temperatury.",
      validationRoomFields: "Sprawdz powierzchnie, wysokosc i nazwy pomieszczen.",
      modeQuick: "Tryb Quick",
      modeEngineer: "Tryb Engineer",
      mixingCompact: "Kompaktowy uklad (do ~40 m², 2 petle)",
      mixingStandard: "Standardowy uklad (rozdzielacz + pompa + mieszanie)",
      unitPcs: "szt",
      unitSet: "kpl",
      bomUfhPipe: "Rura UFH 16x2",
      bomCollector: "Rozdzielacz 8 obwodow",
      bomCabinet: "Szafka rozdzielacza",
      bomMixCompact: "Uklad mieszajacy (kompaktowy, do ~40 m²)",
      bomMixStandard: "Uklad mieszajacy (standardowy)",
      bomActuator: "Silownik rozdzielacza",
      bomEdgeTape: "Tasma brzegowa",
      bomInsulation: "Warstwa izolacji UFH",
      bomRadiatorPrefix: "Grzejnik",
      bomValveSet: "Zestaw zaworu termostatycznego grzejnika",
      bomThermostat: "Termostat pokojowy",
      bomBalancing: "Zestaw armatury odcinajacej i rownowazacej",
      bomAirVent: "Odpowietrznik + zestaw spustowy",
      bomFixing: "Mocowania i materialy montazowe",
      bomSourceConnection: "Zestaw podlaczenia zrodla ciepla",
    },
    ru: {
      roomDefaultName: "Комната",
      roomTitle: "Комната",
      remove: "Удалить",
      roomName: "Название",
      roomFloor: "Этаж",
      roomArea: "Площадь (м²)",
      roomHeight: "Высота (м)",
      roomEmitter: "Тип отопления",
      emitterUfh: "UFH",
      emitterRadiator: "Радиатор",
      emitterMixed: "Смешанная",
      roomUfhShare: "Доля UFH (%)",
      roomUfhArea: "Площадь UFH (м²)",
      roomStep: "Шаг (мм)",
      roomCollectorDistance: "Подвод к коллектору (м)",
      roomCondition: "Состояние здания",
      conditionNew: "Новое",
      conditionRenovated: "Реновированное",
      conditionOld: "Старое",
      roomCover: "Покрытие пола",
      coverTile: "Плитка",
      coverLaminate: "Ламинат",
      coverParquet: "Паркет",
      engineerFields: "Поля Engineer",
      wallArea: "Площадь стен (м²)",
      wallU: "U стен",
      windowArea: "Площадь окон (м²)",
      windowU: "U окон",
      floorArea: "Площадь пола (м²)",
      floorU: "U пола",
      ceilingArea: "Площадь потолка (м²)",
      ceilingU: "U потолка",
      infiltrationN: "Инфильтрация n (1/ч)",
      summaryRooms: "Сводка по помещениям",
      summarySystem: "Сводка по системе",
      summaryBom: "BOM и стоимость",
      colRoom: "Комната",
      colQ: "Q (Вт)",
      colWm2: "Вт/м²",
      colUfhMeters: "UFH м",
      colLoops: "Контуры",
      colFlowPerLoop: "Расход / контур (л/мин)",
      colRadiators: "Радиаторы",
      totalPower: "Общая мощность:",
      sourceSuggestion: "Рекомендация по источнику:",
      radiatorFlow: "Расход радиаторов:",
      ufhFlow: "Расход UFH:",
      ufhLoops: "Контуры UFH:",
      mixingUnit: "Смесительный узел:",
      boiler: "Бойлер:",
      expansion: "Расширительный бак:",
      colPosition: "Позиция",
      colQty: "Количество",
      colMaterialUnit: "Материал / ед.",
      colLaborUnit: "Работа / ед.",
      colMaterials: "Материалы",
      colLabor: "Работа",
      totalMaterials: "Материалы:",
      totalLabor: "Работа:",
      totalOverhead: "Накладные:",
      totalReserve: "Резерв:",
      totalGrand: "Итого:",
      validationRooms: "Добавьте минимум одну комнату.",
      validationTemp: "Укажите корректные температуры.",
      validationRoomFields: "Проверьте площадь, высоту и названия комнат.",
      modeQuick: "Режим Quick",
      modeEngineer: "Режим Engineer",
      mixingCompact: "Компактный узел (до ~40 м², 2 контура)",
      mixingStandard: "Стандартный узел (коллектор + насос + смешивание)",
      unitPcs: "шт",
      unitSet: "компл",
      bomUfhPipe: "Труба UFH 16x2",
      bomCollector: "Коллектор на 8 выходов",
      bomCabinet: "Шкаф коллектора",
      bomMixCompact: "Смесительный узел (компактный, до ~40 м²)",
      bomMixStandard: "Смесительный узел (стандартный)",
      bomActuator: "Сервопривод коллектора",
      bomEdgeTape: "Кромочная лента",
      bomInsulation: "Теплоизоляция UFH",
      bomRadiatorPrefix: "Радиатор",
      bomValveSet: "Комплект радиаторного термоклапана",
      bomThermostat: "Комнатный термостат",
      bomBalancing: "Комплект запорной и балансировочной арматуры",
      bomAirVent: "Воздухоотводчик + дренажный узел",
      bomFixing: "Крепеж и монтажные материалы",
      bomSourceConnection: "Узел подключения источника тепла",
    },
  };

  function t(key) {
    var dict = I18N[lang] || I18N.lv;
    return dict[key] || I18N.lv[key] || key;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function uid() {
    return "r" + Math.random().toString(36).slice(2, 9);
  }

  function escapeHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function money(v) {
    var locale = lang === "en" ? "en-IE" : lang === "ru" ? "ru-RU" : lang === "de" ? "de-DE" : lang === "pl" ? "pl-PL" : "lv-LV";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(v || 0);
  }

  function displayUnit(unit) {
    if (lang === "lv") return unit;
    if (unit === "gab") return t("unitPcs");
    if (unit === "kompl") return t("unitSet");
    return unit;
  }

  function displayMixingType(value) {
    if (value === I18N.lv.mixingCompact) return t("mixingCompact");
    if (value === I18N.lv.mixingStandard) return t("mixingStandard");
    return value;
  }

  function displayBomName(row) {
    if (lang === "lv") return row.name;

    if (row.id.indexOf("radiator_") === 0) {
      return row.name.replace(/^Radiators\s+/, t("bomRadiatorPrefix") + " ");
    }

    var map = {
      ufh_pipe: t("bomUfhPipe"),
      collector_set: t("bomCollector"),
      cabinet: t("bomCabinet"),
      mixing_compact: t("bomMixCompact"),
      mixing_std: t("bomMixStandard"),
      actuators: t("bomActuator"),
      edge_tape: t("bomEdgeTape"),
      insulation: t("bomInsulation"),
      rad_valves: t("bomValveSet"),
      thermostats: t("bomThermostat"),
      balancing: t("bomBalancing"),
      air_vent: t("bomAirVent"),
      fixing: t("bomFixing"),
      source_conn: t("bomSourceConnection"),
    };

    return map[row.id] || row.name;
  }

  function cloneRoomTemplate(index) {
    var base = constants.roomDefaults;
    return {
      id: uid(),
      name: t("roomDefaultName") + " " + (index + 1),
      floor: base.floor,
      area: base.area,
      height: base.height,
      emitter: base.emitter,
      ufhShare: base.ufhShare,
      ufhArea: base.ufhArea,
      stepMm: base.stepMm,
      pipeDiameter: base.pipeDiameter,
      collectorDistance: base.collectorDistance,
      condition: base.condition,
      floorCover: base.floorCover,
      wallArea: base.wallArea,
      wallU: base.wallU,
      windowArea: base.windowArea,
      windowU: base.windowU,
      floorArea: base.floorArea,
      floorU: base.floorU,
      ceilingArea: base.ceilingArea,
      ceilingU: base.ceilingU,
      infiltrationN: base.infiltrationN,
    };
  }

  var state = {
    mode: "quick",
    rooms: [cloneRoomTemplate(0)],
    lastResult: null,
  };

  function renderRooms() {
    var wrap = byId("rooms-list");
    if (!wrap) return;

    wrap.innerHTML = state.rooms
      .map(function (room, idx) {
        return (
          '<article class="room-card" data-room-id="' + room.id + '">' +
          '<header class="room-card-head"><h3>' + t("roomTitle") + " " + (idx + 1) + '</h3><button type="button" class="btn btn-soft" data-room-remove="' + room.id + '">' + t("remove") + "</button></header>" +
          '<div class="room-grid">' +
          '<label>' + t("roomName") + '<input data-f="name" value="' + escapeHtml(room.name) + '" /></label>' +
          '<label>' + t("roomFloor") + '<input data-f="floor" value="' + escapeHtml(room.floor) + '" /></label>' +
          '<label>' + t("roomArea") + '<input data-f="area" type="number" min="1" step="0.1" value="' + room.area + '" /></label>' +
          '<label>' + t("roomHeight") + '<input data-f="height" type="number" min="2" step="0.01" value="' + room.height + '" /></label>' +
          '<label>' + t("roomEmitter") + '<select data-f="emitter">' +
          '<option value="ufh"' + (room.emitter === "ufh" ? " selected" : "") + ">" + t("emitterUfh") + "</option>" +
          '<option value="radiator"' + (room.emitter === "radiator" ? " selected" : "") + ">" + t("emitterRadiator") + "</option>" +
          '<option value="mixed"' + (room.emitter === "mixed" ? " selected" : "") + ">" + t("emitterMixed") + "</option>" +
          "</select></label>" +
          '<label>' + t("roomUfhShare") + '<input data-f="ufhShare" type="number" min="10" max="90" step="1" value="' + room.ufhShare + '" /></label>' +
          '<label>' + t("roomUfhArea") + '<input data-f="ufhArea" type="number" min="0" step="0.1" value="' + room.ufhArea + '" /></label>' +
          '<label>' + t("roomStep") + '<select data-f="stepMm">' +
          '<option value="200"' + (Number(room.stepMm) === 200 ? " selected" : "") + ">200</option>" +
          '<option value="150"' + (Number(room.stepMm) === 150 ? " selected" : "") + ">150</option>" +
          '<option value="100"' + (Number(room.stepMm) === 100 ? " selected" : "") + ">100</option>" +
          "</select></label>" +
          '<label>' + t("roomCollectorDistance") + '<input data-f="collectorDistance" type="number" min="0" step="0.1" value="' + room.collectorDistance + '" /></label>' +
          '<label>' + t("roomCondition") + '<select data-f="condition">' +
          '<option value="new"' + (room.condition === "new" ? " selected" : "") + ">" + t("conditionNew") + "</option>" +
          '<option value="renovated"' + (room.condition === "renovated" ? " selected" : "") + ">" + t("conditionRenovated") + "</option>" +
          '<option value="old"' + (room.condition === "old" ? " selected" : "") + ">" + t("conditionOld") + "</option>" +
          "</select></label>" +
          '<label>' + t("roomCover") + '<select data-f="floorCover">' +
          '<option value="tile"' + (room.floorCover === "tile" ? " selected" : "") + ">" + t("coverTile") + "</option>" +
          '<option value="laminate"' + (room.floorCover === "laminate" ? " selected" : "") + ">" + t("coverLaminate") + "</option>" +
          '<option value="parquet"' + (room.floorCover === "parquet" ? " selected" : "") + ">" + t("coverParquet") + "</option>" +
          "</select></label>" +
          "</div>" +
          '<details class="room-engineer"><summary>' + t("engineerFields") + '</summary>' +
          '<div class="room-grid room-grid-engineer">' +
          '<label>' + t("wallArea") + '<input data-f="wallArea" type="number" min="0" step="0.1" value="' + room.wallArea + '" /></label>' +
          '<label>' + t("wallU") + '<input data-f="wallU" type="number" min="0" step="0.01" value="' + room.wallU + '" /></label>' +
          '<label>' + t("windowArea") + '<input data-f="windowArea" type="number" min="0" step="0.1" value="' + room.windowArea + '" /></label>' +
          '<label>' + t("windowU") + '<input data-f="windowU" type="number" min="0" step="0.01" value="' + room.windowU + '" /></label>' +
          '<label>' + t("floorArea") + '<input data-f="floorArea" type="number" min="0" step="0.1" value="' + room.floorArea + '" /></label>' +
          '<label>' + t("floorU") + '<input data-f="floorU" type="number" min="0" step="0.01" value="' + room.floorU + '" /></label>' +
          '<label>' + t("ceilingArea") + '<input data-f="ceilingArea" type="number" min="0" step="0.1" value="' + room.ceilingArea + '" /></label>' +
          '<label>' + t("ceilingU") + '<input data-f="ceilingU" type="number" min="0" step="0.01" value="' + room.ceilingU + '" /></label>' +
          '<label>' + t("infiltrationN") + '<input data-f="infiltrationN" type="number" min="0" step="0.01" value="' + room.infiltrationN + '" /></label>' +
          "</div></details></article>"
        );
      })
      .join("");

    var canRemove = state.rooms.length > 1;
    Array.prototype.forEach.call(wrap.querySelectorAll("[data-room-remove]"), function (btn) {
      btn.disabled = !canRemove;
    });
  }

  function collectProject() {
    return {
      name: byId("project-name").value.trim(),
      objectType: byId("project-object-type").value,
      heatSource: byId("project-heat-source").value,
      scheme: byId("project-scheme").value,
      thetaInt: Number(byId("project-theta-int").value),
      thetaExt: Number(byId("project-theta-ext").value),
      radiatorProfile: byId("project-radiator-profile").value,
      ufhProfile: byId("project-ufh-profile").value,
      radiatorDeltaT: Number(byId("project-radiator-delta").value),
      ufhDeltaT: Number(byId("project-ufh-delta").value),
      occupants: Number(byId("project-occupants").value),
      reservePercent: Number(byId("project-reserve").value),
      overheadPercent: Number(byId("project-overhead").value),
      wastePercent: Number(byId("project-waste").value),
      laborFactor: Number(byId("project-labor-factor").value),
      materialFactor: Number(byId("project-material-factor").value),
    };
  }

  function collectRooms() {
    var wrap = byId("rooms-list");
    var cards = wrap.querySelectorAll(".room-card");
    return Array.prototype.map.call(cards, function (card) {
      var roomId = card.getAttribute("data-room-id");
      var room = { id: roomId };
      Array.prototype.forEach.call(card.querySelectorAll("[data-f]"), function (input) {
        var key = input.getAttribute("data-f");
        var value = input.value;
        if (input.type === "number") {
          room[key] = Number(value);
        } else {
          room[key] = value;
        }
      });
      return room;
    });
  }

  function syncRoomsFromDom() {
    var wrap = byId("rooms-list");
    if (!wrap) return;
    var hasCards = wrap.querySelector(".room-card");
    if (!hasCards) return;
    state.rooms = collectRooms();
  }

  function renderRoomResult(result) {
    var rows = result.rooms
      .map(function (r) {
        return (
          "<tr>" +
          "<td>" + escapeHtml(r.room.name) + "</td>" +
          "<td>" + r.load.totalW + "</td>" +
          "<td>" + r.load.wpm2 + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.totalLengthM : "-") + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.loops : "-") + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.flowPerLoopLMin : "-") + "</td>" +
          "<td>" + (r.radiator.enabled ? r.radiator.selected.model + " x" + r.radiator.selected.qty : "-") + "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="result-card">' +
      "<h3>" + t("summaryRooms") + "</h3>" +
      '<div class="table-wrap"><table class="result-table">' +
      "<thead><tr><th>" + t("colRoom") + "</th><th>" + t("colQ") + "</th><th>" + t("colWm2") + "</th><th>" + t("colUfhMeters") + "</th><th>" + t("colLoops") + "</th><th>" + t("colFlowPerLoop") + "</th><th>" + t("colRadiators") + "</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div></div>"
    );
  }

  function renderSystemResult(result) {
    return (
      '<div class="result-card">' +
      "<h3>" + t("summarySystem") + "</h3>" +
      '<div class="sys-grid">' +
      "<p><strong>" + t("totalPower") + "</strong> " + result.system.totalKw + " kW</p>" +
      "<p><strong>" + t("sourceSuggestion") + "</strong> " + result.system.sourceKw + " kW</p>" +
      "<p><strong>" + t("radiatorFlow") + "</strong> " + result.system.radiatorFlowLMin + " l/min</p>" +
      "<p><strong>" + t("ufhFlow") + "</strong> " + result.system.ufhFlowLMin + " l/min</p>" +
      "<p><strong>" + t("ufhLoops") + "</strong> " + result.system.totalLoops + "</p>" +
      "<p><strong>" + t("mixingUnit") + "</strong> " + escapeHtml(displayMixingType(result.system.mixingType)) + "</p>" +
      "<p><strong>" + t("boiler") + "</strong> " + result.system.dhwL + " L</p>" +
      "<p><strong>" + t("expansion") + "</strong> " + result.system.expansionL + " L</p>" +
      "</div></div>"
    );
  }

  function renderBom(result) {
    var rows = result.bom.rows
      .map(function (r) {
        return (
          "<tr>" +
          "<td>" + escapeHtml(displayBomName(r)) + "</td>" +
          "<td>" + r.qty + " " + escapeHtml(displayUnit(r.unit)) + "</td>" +
          "<td>" + money(r.materialUnit) + "</td>" +
          "<td>" + money(r.laborUnit) + "</td>" +
          "<td>" + money(r.materialTotal) + "</td>" +
          "<td>" + money(r.laborTotal) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="result-card">' +
      "<h3>" + t("summaryBom") + "</h3>" +
      '<div class="table-wrap"><table class="result-table">' +
      "<thead><tr><th>" + t("colPosition") + "</th><th>" + t("colQty") + "</th><th>" + t("colMaterialUnit") + "</th><th>" + t("colLaborUnit") + "</th><th>" + t("colMaterials") + "</th><th>" + t("colLabor") + "</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>" +
      '<div class="totals">' +
      "<p><strong>" + t("totalMaterials") + "</strong> " + money(result.bom.totals.material) + "</p>" +
      "<p><strong>" + t("totalLabor") + "</strong> " + money(result.bom.totals.labor) + "</p>" +
      "<p><strong>" + t("totalOverhead") + "</strong> " + money(result.bom.totals.overhead) + "</p>" +
      "<p><strong>" + t("totalReserve") + "</strong> " + money(result.bom.totals.reserve) + "</p>" +
      '<p class="grand"><strong>' + t("totalGrand") + "</strong> " + money(result.bom.totals.grand) + "</p>" +
      "</div></div>"
    );
  }

  function renderResult(result) {
    var wrap = byId("calc-results");
    if (!wrap) return;
    wrap.innerHTML = renderSystemResult(result) + renderRoomResult(result) + renderBom(result);

    byId("pdf-export").disabled = false;
  }

  function validate(project, rooms) {
    if (!rooms.length) return t("validationRooms");
    if (!Number.isFinite(project.thetaInt) || !Number.isFinite(project.thetaExt)) return t("validationTemp");
    var bad = rooms.find(function (r) {
      return !r.name || r.area <= 0 || r.height <= 0;
    });
    if (bad) return t("validationRoomFields");
    return "";
  }

  function calculateAndRender() {
    var error = byId("calc-error");
    var project = collectProject();
    var rooms = collectRooms();
    var err = validate(project, rooms);
    if (err) {
      error.textContent = err;
      return;
    }

    error.textContent = "";
    var result = calculator.calculate({ mode: state.mode, project: project, rooms: rooms });
    state.lastResult = result;
    renderResult(result);
  }

  function bindModeToggle() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (btn) {
      btn.addEventListener("click", function () {
        state.mode = btn.getAttribute("data-mode");
        Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (b) {
          b.classList.toggle("active", b === btn);
        });
        byId("mode-label").textContent = state.mode === "engineer" ? t("modeEngineer") : t("modeQuick");
      });
    });
  }

  function bindRoomActions() {
    byId("add-room").addEventListener("click", function () {
      syncRoomsFromDom();
      state.rooms.push(cloneRoomTemplate(state.rooms.length));
      renderRooms();
    });

    byId("rooms-list").addEventListener("click", function (e) {
      var id = e.target.getAttribute("data-room-remove");
      if (!id) return;
      if (state.rooms.length <= 1) return;
      syncRoomsFromDom();
      state.rooms = state.rooms.filter(function (r) {
        return r.id !== id;
      });
      renderRooms();
    });
  }

  function bindMainActions() {
    byId("calculate-btn").addEventListener("click", calculateAndRender);
    byId("pdf-export").addEventListener("click", function () {
      if (!state.lastResult) return;
      window.HeatCalculatorPDF.download(state.lastResult, { lang: lang });
    });
  }

  function applyDefaults() {
    var p = constants.defaultProject;
    byId("project-name").value = p.name;
    byId("project-object-type").value = p.objectType;
    byId("project-heat-source").value = p.heatSource;
    byId("project-scheme").value = p.scheme;
    byId("project-theta-int").value = p.thetaInt;
    byId("project-theta-ext").value = p.thetaExt;
    byId("project-radiator-profile").value = p.radiatorProfile;
    byId("project-ufh-profile").value = p.ufhProfile;
    byId("project-radiator-delta").value = p.radiatorDeltaT;
    byId("project-ufh-delta").value = p.ufhDeltaT;
    byId("project-occupants").value = p.occupants;
    byId("project-reserve").value = p.reservePercent;
    byId("project-overhead").value = p.overheadPercent;
    byId("project-waste").value = p.wastePercent;
    byId("project-labor-factor").value = p.laborFactor;
    byId("project-material-factor").value = p.materialFactor;
  }

  function init() {
    if (!byId("heat-calculator-root")) return;
    applyDefaults();
    renderRooms();
    bindModeToggle();
    bindRoomActions();
    bindMainActions();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
