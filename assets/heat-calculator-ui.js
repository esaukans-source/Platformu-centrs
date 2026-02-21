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
      roomPerimeter: "Perimetrs P (m)",
      roomOccupiedArea: "Aizņemtā zona (m²)",
      roomZoneMode: "Zonu režīms",
      zoneNone: "Nav zonu",
      zoneOuter: "Ārsienu zona",
      roomOuterWallLength: "Ārsienu metri (m)",
      roomZoneWidth: "Ārējās zonas platums (m)",
      roomOuterStep: "Ārējās zonas solis (mm)",
      roomCollectorDistance: "Pievads līdz kolektoram (m)",
      roomLoopMax: "Maks. kontūras garums (m)",
      roomDoorWidth: "Durvju platums (m)",
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
      infiltrationProfile: "Infiltrācijas profils",
      infiltrationLow: "Zema",
      infiltrationMedium: "Vidēja",
      infiltrationHigh: "Augsta",
      infiltrationManual: "Manuāli",
      infiltrationN: "Infiltrācija n (1/h)",
      summaryRooms: "Telpu kopsavilkums",
      summarySystem: "Sistēmas kopsavilkums",
      summaryBom: "BOM un izmaksas",
      colRoom: "Telpa",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Kontūras",
      colLoopLen: "Kontūras garums (m)",
      colFlowPerLoop: "Plūsma/ kontūra (l/min)",
      colUfhStatus: "UFH statuss",
      colRadiators: "Radiatori",
      totalPower: "Kopējā jauda:",
      sourceSuggestion: "Avota ieteikums:",
      radiatorFlow: "Radiatoru plūsma:",
      ufhFlow: "UFH plūsma:",
      ufhLoops: "UFH kontūras:",
      mixingUnit: "Maisīšanas mezgls:",
      boiler: "Boileris:",
      boilerRange: "Boilera diapazons:",
      expansion: "Izplešanās tvertne:",
      pipeNeed: "UFH caurule ar rezervi:",
      pipeRolls: "Rullīši (200m):",
      pipeLeftover: "Prognozētais atlikums:",
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
      unitPack: "paka",
      bomUfhPipe: "UFH caurule 16x2",
      bomCollector: "Kolektors 8 atzariem",
      bomCabinet: "Kolektora skapis",
      bomMixCompact: "Maisīšanas mezgls (kompakts, līdz ~40m²)",
      bomMixStandard: "Maisīšanas mezgls (standarta)",
      bomActuator: "Servopiedziņa kolektoram",
      bomEdgeTape: "Malu lenta",
      bomInsulation: "Siltumizolācijas slānis UFH",
      bomPipeRoll: "UFH caurules rullis 200m",
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
      roomPerimeter: "Perimeter P (m)",
      roomOccupiedArea: "Occupied area (m²)",
      roomZoneMode: "Zone mode",
      zoneNone: "No zones",
      zoneOuter: "Outer wall zone",
      roomOuterWallLength: "Outer wall length (m)",
      roomZoneWidth: "Outer zone width (m)",
      roomOuterStep: "Outer zone spacing (mm)",
      roomCollectorDistance: "Lead to manifold (m)",
      roomLoopMax: "Max loop length (m)",
      roomDoorWidth: "Door width (m)",
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
      infiltrationProfile: "Infiltration profile",
      infiltrationLow: "Low",
      infiltrationMedium: "Medium",
      infiltrationHigh: "High",
      infiltrationManual: "Manual",
      infiltrationN: "Infiltration n (1/h)",
      summaryRooms: "Room summary",
      summarySystem: "System summary",
      summaryBom: "BOM and costs",
      colRoom: "Room",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Loops",
      colLoopLen: "Loop length (m)",
      colFlowPerLoop: "Flow / loop (l/min)",
      colUfhStatus: "UFH status",
      colRadiators: "Radiators",
      totalPower: "Total power:",
      sourceSuggestion: "Source recommendation:",
      radiatorFlow: "Radiator flow:",
      ufhFlow: "UFH flow:",
      ufhLoops: "UFH loops:",
      mixingUnit: "Mixing unit:",
      boiler: "Boiler:",
      boilerRange: "Boiler range:",
      expansion: "Expansion vessel:",
      pipeNeed: "UFH pipe incl. waste:",
      pipeRolls: "Rolls (200m):",
      pipeLeftover: "Estimated leftover:",
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
      unitPack: "pack",
      bomUfhPipe: "UFH pipe 16x2",
      bomCollector: "8-port manifold",
      bomCabinet: "Manifold cabinet",
      bomMixCompact: "Mixing unit (compact, up to ~40 m²)",
      bomMixStandard: "Mixing unit (standard)",
      bomActuator: "Manifold actuator",
      bomEdgeTape: "Edge tape",
      bomInsulation: "UFH insulation layer",
      bomPipeRoll: "UFH pipe roll 200m",
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
      roomPerimeter: "Umfang P (m)",
      roomOccupiedArea: "Belegte Flaeche (m²)",
      roomZoneMode: "Zonenmodus",
      zoneNone: "Keine Zonen",
      zoneOuter: "Aussenwandzone",
      roomOuterWallLength: "Aussenwandlaenge (m)",
      roomZoneWidth: "Aussenzonen-Breite (m)",
      roomOuterStep: "Aussenzonen-Abstand (mm)",
      roomCollectorDistance: "Anbindung zum Verteiler (m)",
      roomLoopMax: "Max. Kreislaenge (m)",
      roomDoorWidth: "Tuerbreite (m)",
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
      infiltrationProfile: "Infiltrationsprofil",
      infiltrationLow: "Niedrig",
      infiltrationMedium: "Mittel",
      infiltrationHigh: "Hoch",
      infiltrationManual: "Manuell",
      infiltrationN: "Infiltration n (1/h)",
      summaryRooms: "Raumuebersicht",
      summarySystem: "Systemuebersicht",
      summaryBom: "BOM und Kosten",
      colRoom: "Raum",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Kreise",
      colLoopLen: "Kreislaenge (m)",
      colFlowPerLoop: "Durchfluss / Kreis (l/min)",
      colUfhStatus: "UFH-Status",
      colRadiators: "Heizkoerper",
      totalPower: "Gesamtleistung:",
      sourceSuggestion: "Quellenempfehlung:",
      radiatorFlow: "Heizkoerper-Durchfluss:",
      ufhFlow: "UFH-Durchfluss:",
      ufhLoops: "UFH-Kreise:",
      mixingUnit: "Mischgruppe:",
      boiler: "Boiler:",
      boilerRange: "Boiler-Bereich:",
      expansion: "Ausdehnungsgefaess:",
      pipeNeed: "UFH-Rohr inkl. Reserve:",
      pipeRolls: "Rollen (200m):",
      pipeLeftover: "Geschaetzter Rest:",
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
      unitPack: "Pack",
      bomUfhPipe: "UFH-Rohr 16x2",
      bomCollector: "Verteiler 8 Abgaenge",
      bomCabinet: "Verteilerschrank",
      bomMixCompact: "Mischgruppe (kompakt, bis ~40 m²)",
      bomMixStandard: "Mischgruppe (standard)",
      bomActuator: "Stellantrieb fuer Verteiler",
      bomEdgeTape: "Randdaemmstreifen",
      bomInsulation: "UFH-Daemmschicht",
      bomPipeRoll: "UFH-Rohrrolle 200m",
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
      roomPerimeter: "Obwod P (m)",
      roomOccupiedArea: "Strefa zajeta (m²)",
      roomZoneMode: "Tryb stref",
      zoneNone: "Bez stref",
      zoneOuter: "Strefa przy scianie zew.",
      roomOuterWallLength: "Dlugosc sciany zew. (m)",
      roomZoneWidth: "Szerokosc strefy zew. (m)",
      roomOuterStep: "Rozstaw strefy zew. (mm)",
      roomCollectorDistance: "Dojscie do rozdzielacza (m)",
      roomLoopMax: "Maks. dlugosc petli (m)",
      roomDoorWidth: "Szerokosc drzwi (m)",
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
      infiltrationProfile: "Profil infiltracji",
      infiltrationLow: "Niska",
      infiltrationMedium: "Srednia",
      infiltrationHigh: "Wysoka",
      infiltrationManual: "Recznie",
      infiltrationN: "Infiltracja n (1/h)",
      summaryRooms: "Podsumowanie pomieszczen",
      summarySystem: "Podsumowanie systemu",
      summaryBom: "BOM i koszty",
      colRoom: "Pomieszczenie",
      colQ: "Q (W)",
      colWm2: "W/m²",
      colUfhMeters: "UFH m",
      colLoops: "Petle",
      colLoopLen: "Dlugosc petli (m)",
      colFlowPerLoop: "Przeplyw / petla (l/min)",
      colUfhStatus: "Status UFH",
      colRadiators: "Grzejniki",
      totalPower: "Moc calkowita:",
      sourceSuggestion: "Rekomendacja zrodla:",
      radiatorFlow: "Przeplyw grzejnikow:",
      ufhFlow: "Przeplyw UFH:",
      ufhLoops: "Petle UFH:",
      mixingUnit: "Uklad mieszajacy:",
      boiler: "Boiler:",
      boilerRange: "Zakres boilera:",
      expansion: "Naczynie wzbiorcze:",
      pipeNeed: "Rura UFH z zapasem:",
      pipeRolls: "Rolki (200m):",
      pipeLeftover: "Szacowany nadmiar:",
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
      unitPack: "paczka",
      bomUfhPipe: "Rura UFH 16x2",
      bomCollector: "Rozdzielacz 8 obwodow",
      bomCabinet: "Szafka rozdzielacza",
      bomMixCompact: "Uklad mieszajacy (kompaktowy, do ~40 m²)",
      bomMixStandard: "Uklad mieszajacy (standardowy)",
      bomActuator: "Silownik rozdzielacza",
      bomEdgeTape: "Tasma brzegowa",
      bomInsulation: "Warstwa izolacji UFH",
      bomPipeRoll: "Rolka rury UFH 200m",
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
      roomPerimeter: "Периметр P (м)",
      roomOccupiedArea: "Занятая зона (м²)",
      roomZoneMode: "Режим зон",
      zoneNone: "Без зон",
      zoneOuter: "Зона у наружной стены",
      roomOuterWallLength: "Наружные стены (м)",
      roomZoneWidth: "Ширина наружной зоны (м)",
      roomOuterStep: "Шаг наружной зоны (мм)",
      roomCollectorDistance: "Подвод к коллектору (м)",
      roomLoopMax: "Макс. длина контура (м)",
      roomDoorWidth: "Ширина двери (м)",
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
      infiltrationProfile: "Профиль инфильтрации",
      infiltrationLow: "Низкая",
      infiltrationMedium: "Средняя",
      infiltrationHigh: "Высокая",
      infiltrationManual: "Вручную",
      infiltrationN: "Инфильтрация n (1/ч)",
      summaryRooms: "Сводка по помещениям",
      summarySystem: "Сводка по системе",
      summaryBom: "BOM и стоимость",
      colRoom: "Комната",
      colQ: "Q (Вт)",
      colWm2: "Вт/м²",
      colUfhMeters: "UFH м",
      colLoops: "Контуры",
      colLoopLen: "Длина контура (м)",
      colFlowPerLoop: "Расход / контур (л/мин)",
      colUfhStatus: "Статус UFH",
      colRadiators: "Радиаторы",
      totalPower: "Общая мощность:",
      sourceSuggestion: "Рекомендация по источнику:",
      radiatorFlow: "Расход радиаторов:",
      ufhFlow: "Расход UFH:",
      ufhLoops: "Контуры UFH:",
      mixingUnit: "Смесительный узел:",
      boiler: "Бойлер:",
      boilerRange: "Диапазон бойлера:",
      expansion: "Расширительный бак:",
      pipeNeed: "Труба UFH с запасом:",
      pipeRolls: "Рулоны (200м):",
      pipeLeftover: "Остаток (оценка):",
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
      unitPack: "уп.",
      bomUfhPipe: "Труба UFH 16x2",
      bomCollector: "Коллектор на 8 выходов",
      bomCabinet: "Шкаф коллектора",
      bomMixCompact: "Смесительный узел (компактный, до ~40 м²)",
      bomMixStandard: "Смесительный узел (стандартный)",
      bomActuator: "Сервопривод коллектора",
      bomEdgeTape: "Кромочная лента",
      bomInsulation: "Теплоизоляция UFH",
      bomPipeRoll: "Рулон трубы UFH 200м",
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

  function t(key) {
    var dict = I18N[lang] || I18N.lv;
    return dict[key] || I18N.lv[key] || key;
  }

  var UX_TEXT = {
    lv: {
      statusHeading: "Aprēķina statuss",
      statusData: "Datu pilnība",
      statusPrecision: "Precizitāte",
      statusHydraulics: "Hidraulika",
      statusOk: "OK",
      statusRange: "Robežās",
      statusReview: "Jāpārskata",
      statusDataOk: "Pilns minimālais datu komplekts.",
      statusDataRange: "Daļa lauku nav aizpildīta pilnībā.",
      statusDataReview: "Trūkst kritiski lauki precīzam kW.",
      statusPrecisionQuick: "Quick režīms ir ātrajai tāmei.",
      statusPrecisionEngineerOk: "Engineer režīmā dati ir pietiekami.",
      statusPrecisionEngineerWarn: "Engineer režīmā trūkst daļa ievades.",
      statusHydraulicsNone: "UFH kontūras nav izmantotas.",
      statusHydraulicsOk: "Kontūru garumi ir drošā diapazonā.",
      statusHydraulicsRange: "Daļa kontūru tuvojas 100 m robežai.",
      statusHydraulicsReview: "Ir kontūras virs 100 m, jāpārdala.",
      missingTitle: "Trūkst dati",
      missingLead: "Precīzam kW aprēķinam aizpildi šos laukus:",
      missingQuickNote: "Quick režīms izmanto vienkāršotu pieņēmumu; precīzam kW pārslēdzies uz Engineer.",
      missingProjectPrefix: "Projekts",
      missingRoomPrefix: "Telpa",
    },
    en: {
      statusHeading: "Calculation status",
      statusData: "Data completeness",
      statusPrecision: "Precision",
      statusHydraulics: "Hydraulics",
      statusOk: "OK",
      statusRange: "Within range",
      statusReview: "Needs review",
      statusDataOk: "Minimum dataset is complete.",
      statusDataRange: "Some fields are only partially filled.",
      statusDataReview: "Critical fields for accurate kW are missing.",
      statusPrecisionQuick: "Quick mode is for rapid estimates.",
      statusPrecisionEngineerOk: "Engineer mode has sufficient input.",
      statusPrecisionEngineerWarn: "Engineer mode is missing part of the input.",
      statusHydraulicsNone: "No UFH loops are used.",
      statusHydraulicsOk: "Loop lengths are in a safe range.",
      statusHydraulicsRange: "Some loops are close to the 100 m limit.",
      statusHydraulicsReview: "Some loops exceed 100 m and should be split.",
      missingTitle: "Missing data",
      missingLead: "Fill these fields for accurate kW calculation:",
      missingQuickNote: "Quick mode uses simplified assumptions; switch to Engineer for precise kW.",
      missingProjectPrefix: "Project",
      missingRoomPrefix: "Room",
    },
  };

  var HELP_TEXTS = {
    lv: {
      project_name: "Nosaukums tiek izmantots rezultātu kopsavilkumā un PDF eksportā.",
      project_object_type: "Objekta tips palīdz izvēlēties atbilstošu projektēšanas loģiku.",
      project_heat_source: "Avots ietekmē ieteikuma kW un mezglu komplektāciju.",
      project_scheme: "Shēma nosaka, vai jāparedz UFH maisīšanas mezgls.",
      project_theta_int: "Projektējamā iekštelpu temperatūra tieši ietekmē aprēķina slodzi.",
      project_theta_ext: "Āra temperatūra nosaka temperatūras starpību slodzes aprēķinam.",
      project_radiator_profile: "Režīms ietekmē radiatoru jaudas korekciju izvēlē.",
      project_ufh_profile: "Režīms tiek izmantots UFH darba parametru novērtēšanai.",
      project_radiator_delta: "ΔT radiatoriem ietekmē plūsmas aprēķinu l/min.",
      project_ufh_delta: "ΔT UFH ietekmē plūsmu uz kontūrām un kolektoru.",
      project_occupants: "Cilvēku skaits tiek izmantots boilera tilpuma ieteikumam.",
      project_reserve: "Rezerve pievieno drošības procentu kopējai avota jaudai.",
      project_overhead: "Pieskaitāmās izmaksas pieskaita pie materiāliem un darba.",
      project_waste: "Materiālu rezerve kompensē griezumus un zudumus montāžā.",
      project_labor_factor: "Koeficients palielina vai samazina darba izmaksu līmeni.",
      project_material_factor: "Koeficients palielina vai samazina materiālu cenu līmeni.",
      room_name: "Nosaukums palīdz saprast telpas rezultātu tabulā un PDF.",
      room_floor: "Stāvu vari izmantot orientācijai pie montāžas un loģistikas.",
      room_area: "Platība ir bāze gan slodzei, gan UFH cauruļu garumam.",
      room_height: "Augstums ietekmē telpas tilpumu un ventilācijas zudumus.",
      room_perimeter: "Perimetrs tiek izmantots malas lentas un telpas malas materiālu aprēķinam.",
      room_emitter: "Izvēle nosaka, kā slodze tiek sadalīta starp UFH un radiatoriem.",
      room_ufh_share: "Jauktā režīmā nosaka UFH daļu no telpas kopējās slodzes.",
      room_ufh_area: "Apsildāmā UFH platība nosaka kontūru garumu un skaitu.",
      room_occupied_area: "Aizņemtā zona tiek atņemta no UFH aktīvās apsildāmās platības.",
      room_step: "Solis tieši ietekmē cauruļu metrus uz m².",
      room_zone_mode: "Zonu režīms ļauj pie ārsienām lietot citu soli nekā telpas vidū.",
      room_outer_wall_length: "Ārsienu metri nosaka ārējās zonas laukumu pie logiem un fasādes.",
      room_zone_width: "Ārējās zonas platums nosaka, cik liela telpas daļa ir ciešākā solī.",
      room_outer_step: "Ārējās zonas solis tiek izmantots aukstāku malu lokālai kompensācijai.",
      room_collector_distance: "Attālums līdz kolektoram pieskaitās katras kontūras garumam.",
      room_loop_max: "Maksimālais garums ierobežo kontūru hidraulisko pretestību.",
      room_door_width: "Durvju platums tiek atskaitīts no malas lentas garuma.",
      room_condition: "Ēkas stāvoklis Quick režīmā izvēlas tipisko W/m² intervālu.",
      room_cover: "Segums nedaudz koriģē nepieciešamo jaudu uz m².",
      room_wall_area: "Sienu laukums ar U vērtību ir daļa no transmisijas zudumiem.",
      room_wall_u: "U vērtība rāda, cik daudz siltuma zūd caur sienām.",
      room_window_area: "Logu laukums būtiski ietekmē telpas siltuma zudumus.",
      room_window_u: "U vērtība logiem nosaka zudumu intensitāti caur stiklojumu.",
      room_floor_area: "Grīdas laukums kopā ar U piedalās zudumu aprēķinā.",
      room_floor_u: "U grīdai nosaka zudumus uz grunti vai neapsildāmām zonām.",
      room_ceiling_area: "Griestu laukums ietekmē zudumus uz augšējo zonu.",
      room_ceiling_u: "U griestiem nosaka siltuma zudumus caur pārsegumu.",
      room_infiltration_profile: "Profils iestata tipisku n vērtību, ja manuāla nav ievadīta.",
      room_infiltration_n: "Infiltrācija n apraksta gaisa apmaiņas zudumus telpā.",
    },
    en: {
      project_name: "The name is used in summaries and in the PDF export.",
      project_object_type: "Object type helps choose suitable calculation defaults.",
      project_heat_source: "Source type affects kW recommendation and equipment setup.",
      project_scheme: "Scheme determines whether UFH mixing is required.",
      project_theta_int: "Indoor design temperature directly affects heat load.",
      project_theta_ext: "Outdoor design temperature sets the load delta.",
      project_radiator_profile: "Profile affects radiator output correction.",
      project_ufh_profile: "Profile is used for UFH operating assumptions.",
      project_radiator_delta: "Radiator ΔT affects l/min flow calculation.",
      project_ufh_delta: "UFH ΔT affects loop and manifold flow values.",
      project_occupants: "Occupants are used for DHW boiler sizing advice.",
      project_reserve: "Reserve adds a safety percentage to total source kW.",
      project_overhead: "Overhead adds extra cost on top of labor and materials.",
      project_waste: "Material waste covers cuts and on-site losses.",
      project_labor_factor: "Factor scales labor cost up or down.",
      project_material_factor: "Factor scales material cost up or down.",
      room_name: "Room name improves clarity in tables and PDF output.",
      room_floor: "Floor helps orientation for planning and installation.",
      room_area: "Area is the base for load and UFH length estimates.",
      room_height: "Height affects room volume and ventilation losses.",
      room_perimeter: "Perimeter is used for edge tape and perimeter material sizing.",
      room_emitter: "Emitter defines load split between UFH and radiators.",
      room_ufh_share: "In mixed mode it sets UFH share of room load.",
      room_ufh_area: "UFH area defines loop length and loop count.",
      room_occupied_area: "Occupied zones are excluded from active UFH heated area.",
      room_step: "Pipe spacing directly changes meters per m².",
      room_zone_mode: "Zone mode allows tighter spacing along colder outer walls.",
      room_outer_wall_length: "Outer wall length defines the size of colder edge zone.",
      room_zone_width: "Outer zone width controls how much area uses tighter spacing.",
      room_outer_step: "Outer zone spacing applies in perimeter strips near facades.",
      room_collector_distance: "Distance to manifold adds to each loop length.",
      room_loop_max: "Max loop length limits pressure drop and hydraulic imbalance.",
      room_door_width: "Door width is subtracted from total edge tape length.",
      room_condition: "In Quick mode it selects a typical W/m² range.",
      room_cover: "Floor cover slightly adjusts required W/m².",
      room_wall_area: "Wall area with U-value contributes to transmission losses.",
      room_wall_u: "U-value shows heat loss level through walls.",
      room_window_area: "Window area strongly affects room heat losses.",
      room_window_u: "Window U-value defines glazing loss intensity.",
      room_floor_area: "Floor area with U-value contributes to losses.",
      room_floor_u: "Floor U-value defines losses to ground/unheated zones.",
      room_ceiling_area: "Ceiling area contributes to upper-envelope losses.",
      room_ceiling_u: "Ceiling U-value defines losses through top structure.",
      room_infiltration_profile: "Profile applies a default n-value when manual n is not set.",
      room_infiltration_n: "Infiltration n defines air-exchange related losses.",
    },
  };

  function ux(key) {
    var dict = UX_TEXT[lang] || UX_TEXT.en || UX_TEXT.lv;
    return dict[key] || UX_TEXT.lv[key] || key;
  }

  function helpText(key) {
    var dict = HELP_TEXTS[lang] || HELP_TEXTS.en || HELP_TEXTS.lv;
    return dict[key] || HELP_TEXTS.lv[key] || "";
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
    if (unit === "paka") return t("unitPack");
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
      ufh_pipe_roll_200: t("bomPipeRoll"),
      collector_set: t("bomCollector"),
      cabinet: t("bomCabinet"),
      mixing_compact: t("bomMixCompact"),
      mixing_std: t("bomMixStandard"),
      actuators: t("bomActuator"),
      edge_tape: t("bomEdgeTape"),
      clips_pack: t("bomClipPack"),
      insulation: t("bomInsulation"),
      vapor_barrier: t("bomVaporBarrier"),
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
      perimeterM: base.perimeterM,
      emitter: base.emitter,
      ufhShare: base.ufhShare,
      ufhArea: base.ufhArea,
      occupiedArea: base.occupiedArea,
      stepMm: base.stepMm,
      zoneMode: base.zoneMode,
      outerWallLength: base.outerWallLength,
      outerZoneWidth: base.outerZoneWidth,
      outerStepMm: base.outerStepMm,
      pipeDiameter: base.pipeDiameter,
      collectorDistance: base.collectorDistance,
      maxLoopLengthM: base.maxLoopLengthM,
      doorWidthM: base.doorWidthM,
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
      infiltrationProfile: base.infiltrationProfile,
      infiltrationN: base.infiltrationN,
    };
  }

  var state = {
    mode: "quick",
    rooms: [cloneRoomTemplate(0)],
    lastResult: null,
    lastMissingData: { items: [], critical: [], warning: [], criticalCount: 0, warningCount: 0 },
  };

  var PROJECT_HELP_KEYS = {
    "project-name": "project_name",
    "project-object-type": "project_object_type",
    "project-heat-source": "project_heat_source",
    "project-scheme": "project_scheme",
    "project-theta-int": "project_theta_int",
    "project-theta-ext": "project_theta_ext",
    "project-radiator-profile": "project_radiator_profile",
    "project-ufh-profile": "project_ufh_profile",
    "project-radiator-delta": "project_radiator_delta",
    "project-ufh-delta": "project_ufh_delta",
    "project-occupants": "project_occupants",
    "project-reserve": "project_reserve",
    "project-overhead": "project_overhead",
    "project-waste": "project_waste",
    "project-labor-factor": "project_labor_factor",
    "project-material-factor": "project_material_factor",
  };

  var ROOM_HELP_KEYS = {
    name: "room_name",
    floor: "room_floor",
    area: "room_area",
    height: "room_height",
    perimeterM: "room_perimeter",
    emitter: "room_emitter",
    ufhShare: "room_ufh_share",
    ufhArea: "room_ufh_area",
    occupiedArea: "room_occupied_area",
    stepMm: "room_step",
    zoneMode: "room_zone_mode",
    outerWallLength: "room_outer_wall_length",
    outerZoneWidth: "room_zone_width",
    outerStepMm: "room_outer_step",
    collectorDistance: "room_collector_distance",
    maxLoopLengthM: "room_loop_max",
    doorWidthM: "room_door_width",
    condition: "room_condition",
    floorCover: "room_cover",
    wallArea: "room_wall_area",
    wallU: "room_wall_u",
    windowArea: "room_window_area",
    windowU: "room_window_u",
    floorArea: "room_floor_area",
    floorU: "room_floor_u",
    ceilingArea: "room_ceiling_area",
    ceilingU: "room_ceiling_u",
    infiltrationProfile: "room_infiltration_profile",
    infiltrationN: "room_infiltration_n",
  };

  var ENGINEER_REQUIRED_FIELDS = [
    "wallArea",
    "wallU",
    "windowArea",
    "windowU",
    "floorArea",
    "floorU",
    "ceilingArea",
    "ceilingU",
  ];

  function isFilledNumber(v, allowZero) {
    return Number.isFinite(v) && (allowZero ? v >= 0 : v > 0);
  }

  function statusLabel(level) {
    if (level === "review") return ux("statusReview");
    if (level === "range") return ux("statusRange");
    return ux("statusOk");
  }

  function ensureLabelHead(label, fallbackText) {
    if (!label) return null;
    var existing = label.querySelector(".label-head");
    if (existing) return existing;

    var control = label.querySelector("input,select,textarea");
    if (!control) return null;

    var parts = [];
    var node = label.firstChild;
    while (node && node !== control) {
      var next = node.nextSibling;
      if (node.nodeType === 3 && node.nodeValue) {
        parts.push(node.nodeValue);
        label.removeChild(node);
      } else if (node.nodeType === 1 && !node.classList.contains("label-head")) {
        parts.push(node.textContent || "");
        label.removeChild(node);
      }
      node = next;
    }

    var text = parts.join(" ").replace(/\s+/g, " ").trim() || String(fallbackText || "");
    var head = document.createElement("span");
    head.className = "label-head";
    var textEl = document.createElement("span");
    textEl.className = "label-text";
    textEl.textContent = text;
    head.appendChild(textEl);
    label.insertBefore(head, control);
    return head;
  }

  function labelTextFromControl(control, fallbackText) {
    if (!control) return String(fallbackText || "");
    var label = control.closest("label");
    if (!label) return String(fallbackText || "");
    var textEl = label.querySelector(".label-text");
    if (textEl && textEl.textContent.trim()) return textEl.textContent.trim();

    var clone = label.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll("input,select,textarea,.field-help"), function (node) {
      node.remove();
    });
    var text = clone.textContent.replace(/\s+/g, " ").trim();
    return text || String(fallbackText || "");
  }

  function addHelpToLabel(label, help) {
    if (!label || !help) return;
    var head = ensureLabelHead(label);
    if (!head) return;
    var existing = head.querySelector(".field-help");
    if (existing) {
      existing.title = help;
      existing.setAttribute("aria-label", help);
      return;
    }
    var helpEl = document.createElement("span");
    helpEl.className = "field-help";
    helpEl.textContent = "?";
    helpEl.title = help;
    helpEl.setAttribute("aria-label", help);
    helpEl.setAttribute("role", "note");
    helpEl.tabIndex = 0;
    head.appendChild(helpEl);
  }

  function applyProjectFieldHelp() {
    Object.keys(PROJECT_HELP_KEYS).forEach(function (id) {
      var control = byId(id);
      if (!control) return;
      var label = control.closest("label");
      addHelpToLabel(label, helpText(PROJECT_HELP_KEYS[id]));
    });
  }

  function applyRoomFieldHelp() {
    var wrap = byId("rooms-list");
    if (!wrap) return;
    Array.prototype.forEach.call(wrap.querySelectorAll(".room-card"), function (card) {
      Object.keys(ROOM_HELP_KEYS).forEach(function (field) {
        var control = card.querySelector('[data-f="' + field + '"]');
        if (!control) return;
        var label = control.closest("label");
        addHelpToLabel(label, helpText(ROOM_HELP_KEYS[field]));
      });
    });
  }

  function buildMissingDataSummary(project, rooms) {
    var critical = [];
    var warning = [];
    var roomWrap = byId("rooms-list");
    var roomCards = roomWrap ? roomWrap.querySelectorAll(".room-card") : [];
    var cardById = {};

    Array.prototype.forEach.call(roomCards, function (card) {
      cardById[card.getAttribute("data-room-id")] = card;
    });

    function pushMissing(target, scope, fieldName) {
      target.push(scope + ": " + fieldName);
    }

    function projectFieldLabel(id, fallback) {
      return labelTextFromControl(byId(id), fallback);
    }

    if (!Number.isFinite(project.thetaInt)) {
      pushMissing(critical, ux("missingProjectPrefix"), projectFieldLabel("project-theta-int", "θint"));
    }
    if (!Number.isFinite(project.thetaExt)) {
      pushMissing(critical, ux("missingProjectPrefix"), projectFieldLabel("project-theta-ext", "θe"));
    }

    rooms.forEach(function (room, idx) {
      var card = cardById[room.id];
      var roomScope = (room.name && room.name.trim()) || (ux("missingRoomPrefix") + " " + (idx + 1));

      function roomFieldLabel(key, fallback) {
        var control = card ? card.querySelector('[data-f="' + key + '"]') : null;
        return labelTextFromControl(control, fallback || key);
      }

      if (!room.name || !room.name.trim()) {
        pushMissing(critical, roomScope, roomFieldLabel("name", t("roomName")));
      }
      if (!isFilledNumber(room.area, false)) {
        pushMissing(critical, roomScope, roomFieldLabel("area", t("roomArea")));
      }
      if (!isFilledNumber(room.height, false)) {
        pushMissing(critical, roomScope, roomFieldLabel("height", t("roomHeight")));
      }

      if (state.mode === "engineer") {
        ENGINEER_REQUIRED_FIELDS.forEach(function (field) {
          if (!isFilledNumber(room[field], false)) {
            pushMissing(critical, roomScope, roomFieldLabel(field, field));
          }
        });

        if (String(room.infiltrationProfile || "manual") === "manual" && !isFilledNumber(room.infiltrationN, false)) {
          pushMissing(critical, roomScope, roomFieldLabel("infiltrationN", t("infiltrationN")));
        }
      }

      if (room.emitter === "ufh" || room.emitter === "mixed") {
        if (!isFilledNumber(room.ufhArea, false)) {
          pushMissing(warning, roomScope, roomFieldLabel("ufhArea", t("roomUfhArea")));
        }
        if (!isFilledNumber(room.collectorDistance, true)) {
          pushMissing(warning, roomScope, roomFieldLabel("collectorDistance", t("roomCollectorDistance")));
        }
        if (!isFilledNumber(room.maxLoopLengthM, false)) {
          pushMissing(warning, roomScope, roomFieldLabel("maxLoopLengthM", t("roomLoopMax")));
        }
        if (!isFilledNumber(room.perimeterM, false)) {
          pushMissing(warning, roomScope, roomFieldLabel("perimeterM", t("roomPerimeter")));
        }
        if (String(room.zoneMode || "none") === "outer") {
          if (!isFilledNumber(room.outerWallLength, false)) {
            pushMissing(warning, roomScope, roomFieldLabel("outerWallLength", t("roomOuterWallLength")));
          }
          if (!isFilledNumber(room.outerZoneWidth, false)) {
            pushMissing(warning, roomScope, roomFieldLabel("outerZoneWidth", t("roomZoneWidth")));
          }
        }
      }
    });

    function unique(list) {
      var seen = {};
      return list.filter(function (item) {
        if (seen[item]) return false;
        seen[item] = true;
        return true;
      });
    }

    critical = unique(critical);
    warning = unique(warning);

    return {
      critical: critical,
      warning: warning,
      items: unique(critical.concat(warning)),
      criticalCount: critical.length,
      warningCount: warning.length,
    };
  }

  function buildStatusChecks(result, missing) {
    var checks = [];
    var safeMissing = missing || { criticalCount: 0, warningCount: 0 };

    var dataLevel = safeMissing.criticalCount > 0 ? "review" : safeMissing.warningCount > 0 ? "range" : "ok";
    checks.push({
      title: ux("statusData"),
      level: dataLevel,
      note:
        dataLevel === "ok"
          ? ux("statusDataOk")
          : dataLevel === "range"
            ? ux("statusDataRange")
            : ux("statusDataReview"),
    });

    var precisionLevel;
    var precisionNote;
    if (state.mode === "quick") {
      precisionLevel = "range";
      precisionNote = ux("statusPrecisionQuick");
    } else if (safeMissing.criticalCount > 0 || safeMissing.warningCount > 0) {
      precisionLevel = safeMissing.criticalCount > 0 ? "review" : "range";
      precisionNote = ux("statusPrecisionEngineerWarn");
    } else {
      precisionLevel = "ok";
      precisionNote = ux("statusPrecisionEngineerOk");
    }
    checks.push({
      title: ux("statusPrecision"),
      level: precisionLevel,
      note: precisionNote,
    });

    var hydroLevel = "ok";
    var hydroNote = ux("statusHydraulicsNone");
    if (result.system.totalLoops > 0) {
      if (Number(result.system.loopsOverLimit) > 0) {
        hydroLevel = "review";
        hydroNote = ux("statusHydraulicsReview");
      } else if (Number(result.system.loopsNearLimit) > 0) {
        hydroLevel = "range";
        hydroNote = ux("statusHydraulicsRange");
      } else {
        hydroLevel = "ok";
        hydroNote = ux("statusHydraulicsOk");
      }
    }
    checks.push({
      title: ux("statusHydraulics"),
      level: hydroLevel,
      note: hydroNote,
    });

    return checks;
  }

  function renderStatusAndMissing(result) {
    var missing = state.lastMissingData || { items: [], critical: [], warning: [] };
    var checks = buildStatusChecks(result, missing);
    var statusHtml =
      '<div class="status-panel"><h4>' +
      ux("statusHeading") +
      '</h4><div class="status-strip">' +
      checks
        .map(function (check) {
          return (
            '<div class="status-item status-' +
            check.level +
            '">' +
            '<p class="status-item-title">' +
            escapeHtml(check.title) +
            "</p>" +
            '<p class="status-item-state">' +
            escapeHtml(statusLabel(check.level)) +
            "</p>" +
            '<p class="status-item-note">' +
            escapeHtml(check.note) +
            "</p>" +
            "</div>"
          );
        })
        .join("") +
      "</div></div>";

    if (!missing.items.length) return statusHtml;

    var criticalMap = {};
    missing.critical.forEach(function (item) {
      criticalMap[item] = true;
    });

    var missingHtml =
      '<div class="missing-data-box">' +
      "<h4>" +
      ux("missingTitle") +
      "</h4>" +
      "<p>" +
      ux("missingLead") +
      "</p>" +
      '<ul class="missing-list">' +
      missing.items
        .map(function (item) {
          var cls = criticalMap[item] ? "missing-critical" : "missing-warning";
          return '<li class="' + cls + '">' + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>" +
      (state.mode === "quick" ? '<p class="note">' + ux("missingQuickNote") + "</p>" : "") +
      "</div>";

    return statusHtml + missingHtml;
  }

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
          '<label>' + t("roomPerimeter") + '<input data-f="perimeterM" type="number" min="0" step="0.1" value="' + room.perimeterM + '" /></label>' +
          '<label>' + t("roomEmitter") + '<select data-f="emitter">' +
          '<option value="ufh"' + (room.emitter === "ufh" ? " selected" : "") + ">" + t("emitterUfh") + "</option>" +
          '<option value="radiator"' + (room.emitter === "radiator" ? " selected" : "") + ">" + t("emitterRadiator") + "</option>" +
          '<option value="mixed"' + (room.emitter === "mixed" ? " selected" : "") + ">" + t("emitterMixed") + "</option>" +
          "</select></label>" +
          '<label>' + t("roomUfhShare") + '<input data-f="ufhShare" type="number" min="10" max="90" step="1" value="' + room.ufhShare + '" /></label>' +
          '<label>' + t("roomUfhArea") + '<input data-f="ufhArea" type="number" min="0" step="0.1" value="' + room.ufhArea + '" /></label>' +
          '<label>' + t("roomOccupiedArea") + '<input data-f="occupiedArea" type="number" min="0" step="0.1" value="' + room.occupiedArea + '" /></label>' +
          '<label>' + t("roomStep") + '<select data-f="stepMm">' +
          '<option value="200"' + (Number(room.stepMm) === 200 ? " selected" : "") + ">200</option>" +
          '<option value="150"' + (Number(room.stepMm) === 150 ? " selected" : "") + ">150</option>" +
          '<option value="120"' + (Number(room.stepMm) === 120 ? " selected" : "") + ">120</option>" +
          '<option value="100"' + (Number(room.stepMm) === 100 ? " selected" : "") + ">100</option>" +
          "</select></label>" +
          '<label>' + t("roomZoneMode") + '<select data-f="zoneMode">' +
          '<option value="none"' + (String(room.zoneMode || "none") === "none" ? " selected" : "") + ">" + t("zoneNone") + "</option>" +
          '<option value="outer"' + (String(room.zoneMode || "none") === "outer" ? " selected" : "") + ">" + t("zoneOuter") + "</option>" +
          "</select></label>" +
          '<label>' + t("roomOuterWallLength") + '<input data-f="outerWallLength" type="number" min="0" step="0.1" value="' + room.outerWallLength + '" /></label>' +
          '<label>' + t("roomZoneWidth") + '<input data-f="outerZoneWidth" type="number" min="0" step="0.1" value="' + room.outerZoneWidth + '" /></label>' +
          '<label>' + t("roomOuterStep") + '<select data-f="outerStepMm">' +
          '<option value="200"' + (Number(room.outerStepMm) === 200 ? " selected" : "") + ">200</option>" +
          '<option value="150"' + (Number(room.outerStepMm) === 150 ? " selected" : "") + ">150</option>" +
          '<option value="120"' + (Number(room.outerStepMm) === 120 ? " selected" : "") + ">120</option>" +
          '<option value="100"' + (Number(room.outerStepMm) === 100 ? " selected" : "") + ">100</option>" +
          "</select></label>" +
          '<label>' + t("roomCollectorDistance") + '<input data-f="collectorDistance" type="number" min="0" step="0.1" value="' + room.collectorDistance + '" /></label>' +
          '<label>' + t("roomLoopMax") + '<input data-f="maxLoopLengthM" type="number" min="60" max="140" step="1" value="' + room.maxLoopLengthM + '" /></label>' +
          '<label>' + t("roomDoorWidth") + '<input data-f="doorWidthM" type="number" min="0" max="4" step="0.1" value="' + room.doorWidthM + '" /></label>' +
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
          '<label>' + t("infiltrationProfile") + '<select data-f="infiltrationProfile">' +
          '<option value="low"' + (String(room.infiltrationProfile || "medium") === "low" ? " selected" : "") + ">" + t("infiltrationLow") + "</option>" +
          '<option value="medium"' + (String(room.infiltrationProfile || "medium") === "medium" ? " selected" : "") + ">" + t("infiltrationMedium") + "</option>" +
          '<option value="high"' + (String(room.infiltrationProfile || "medium") === "high" ? " selected" : "") + ">" + t("infiltrationHigh") + "</option>" +
          '<option value="manual"' + (String(room.infiltrationProfile || "medium") === "manual" ? " selected" : "") + ">" + t("infiltrationManual") + "</option>" +
          "</select></label>" +
          '<label>' + t("infiltrationN") + '<input data-f="infiltrationN" type="number" min="0" step="0.01" value="' + room.infiltrationN + '" /></label>' +
          "</div></details></article>"
        );
      })
      .join("");

    var canRemove = state.rooms.length > 1;
    Array.prototype.forEach.call(wrap.querySelectorAll("[data-room-remove]"), function (btn) {
      btn.disabled = !canRemove;
    });
    applyRoomFieldHelp();
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
        var ufhStatus = "-";
        if (r.ufh.enabled) {
          if (r.ufh.needsWarning || r.ufh.needsEmitterSupport) {
            ufhStatus = ux("statusReview");
          } else if (r.ufh.closeToLimit) {
            ufhStatus = ux("statusRange");
          } else {
            ufhStatus = ux("statusOk");
          }
        }
        return (
          '<tr data-room-id="' + escapeHtml(r.room.id) + '" data-room-index="' + escapeHtml(r.roomIndex) + '">' +
          "<td>" + escapeHtml(r.room.name) + "</td>" +
          "<td>" + r.load.totalW + "</td>" +
          "<td>" + r.load.wpm2 + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.totalLengthM : "-") + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.loops : "-") + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.loopLengthM : "-") + "</td>" +
          "<td>" + (r.ufh.enabled ? r.ufh.flowPerLoopLMin : "-") + "</td>" +
          "<td>" + ufhStatus + "</td>" +
          "<td>" + (r.radiator.enabled ? r.radiator.selected.model + " x" + r.radiator.selected.qty : "-") + "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="result-card">' +
      "<h3>" + t("summaryRooms") + "</h3>" +
      '<div class="table-wrap"><table class="result-table">' +
      "<thead><tr><th>" + t("colRoom") + "</th><th>" + t("colQ") + "</th><th>" + t("colWm2") + "</th><th>" + t("colUfhMeters") + "</th><th>" + t("colLoops") + "</th><th>" + t("colLoopLen") + "</th><th>" + t("colFlowPerLoop") + "</th><th>" + t("colUfhStatus") + "</th><th>" + t("colRadiators") + "</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div></div>"
    );
  }

  function renderSystemResult(result) {
    return (
      '<div class="result-card">' +
      "<h3>" + t("summarySystem") + "</h3>" +
      renderStatusAndMissing(result) +
      '<div class="sys-grid">' +
      "<p><strong>" + t("totalPower") + "</strong> " + result.system.totalKw + " kW</p>" +
      "<p><strong>" + t("sourceSuggestion") + "</strong> " + result.system.sourceKw + " kW</p>" +
      "<p><strong>" + t("radiatorFlow") + "</strong> " + result.system.radiatorFlowLMin + " l/min</p>" +
      "<p><strong>" + t("ufhFlow") + "</strong> " + result.system.ufhFlowLMin + " l/min</p>" +
      "<p><strong>" + t("ufhLoops") + "</strong> " + result.system.totalLoops + "</p>" +
      "<p><strong>" + t("mixingUnit") + "</strong> " + escapeHtml(displayMixingType(result.system.mixingType)) + "</p>" +
      "<p><strong>" + t("boiler") + "</strong> " + result.system.dhwL + " L</p>" +
      "<p><strong>" + t("boilerRange") + "</strong> " + result.system.dhwMinL + "–" + result.system.dhwMaxL + " L</p>" +
      "<p><strong>" + t("expansion") + "</strong> " + result.system.expansionL + " L</p>" +
      "<p><strong>" + t("pipeNeed") + "</strong> " + result.system.pipeNeededM + " m</p>" +
      "<p><strong>" + t("pipeRolls") + "</strong> " + result.system.pipeRolls200 + " x " + result.system.pipeRollLengthM + " m</p>" +
      "<p><strong>" + t("pipeLeftover") + "</strong> " + result.system.pipeLeftoverM + " m</p>" +
      "</div></div>"
    );
  }

  function renderBom(result) {
    var rows = result.bom.rows
      .map(function (r) {
        return (
          '<tr data-bom-id="' + escapeHtml(r.id) + '" data-row-index="' + escapeHtml(r.rowIndex) + '">' +
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
    state.lastMissingData = buildMissingDataSummary(project, rooms);
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
    applyProjectFieldHelp();
    renderRooms();
    bindModeToggle();
    bindRoomActions();
    bindMainActions();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
