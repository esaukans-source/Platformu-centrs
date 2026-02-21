(function () {
  var lang = String((document.documentElement && document.documentElement.lang) || "lv")
    .toLowerCase()
    .slice(0, 2);
  if (lang !== "en" && lang !== "ru" && lang !== "de" && lang !== "pl") lang = "lv";

  var TEXT = {
    lv: {
      plumbingTitle: "Santehnikas quick kalkulators",
      plumbingLead: "Ātrs orientējošs aprēķins cauruļvadiem, veidgabaliem un izmaksām pa telpu.",
      area: "Telpas platība (m²)",
      distance: "Attālums līdz stāvvadam/kolektoram (m)",
      fixtures: "Sanitāro punktu skaits",
      complexity: "Sarežģītība",
      complexitySimple: "Vienkārši",
      complexityMedium: "Vidēji",
      complexityComplex: "Sarežģīti",
      class: "Materiālu klase",
      classBudget: "Budget",
      classStandard: "Standarta",
      classPremium: "Premium",
      calc: "Aprēķināt",
      plumbingResultTitle: "Santehnikas rezultāts",
      coldPipe: "Aukstā ūdens caurule",
      hotPipe: "Karstā ūdens caurule",
      drainPipe: "Kanalizācija",
      fittings: "Veidgabali",
      valves: "Noslēgkrāni",
      laborHours: "Darba stundas",
      estTotal: "Aptuvenā summa",
      roofTitle: "Jumta konstrukciju quick kalkulators",
      roofLead: "Ātrs aprēķins jumta seguma laukumiem, notekām un aptuvenām izmaksām.",
      roofPlanArea: "Ēkas projekcijas platība (m²)",
      roofSlope: "Jumta slīpums (°)",
      roofType: "Jumta tips",
      roofTypeGable: "Divslīpu",
      roofTypeHip: "Valmveida",
      roofTypeShed: "Vienslīpu",
      roofTypeFlat: "Plakanais",
      roofCover: "Seguma tips",
      roofCoverMetal: "Metāls",
      roofCoverTile: "Dakstiņš",
      roofCoverBitumen: "Bitumens",
      roofComplexity: "Jumta sarežģītība",
      roofResultTitle: "Jumta rezultāts",
      roofRealArea: "Reālais jumta laukums",
      roofCoverNeed: "Seguma nepieciešamais apjoms",
      roofMembrane: "Apakšseguma membrāna",
      roofBattens: "Latas",
      roofRidge: "Kore",
      roofGutter: "Notekas",
      roofDownpipes: "Stāvvadi",
      roofFasteners: "Stiprinājumi",
      drainageTitle: "Notek sistēmu quick kalkulators",
      drainageLead: "Ātrs ūdens novades aprēķins no jumta laukuma un noteku garuma.",
      drainageResultTitle: "Notek sistēmas rezultāts",
      drainageCatchmentArea: "Sateces laukums (m²)",
      drainageRainfall: "Lietus intensitāte (mm/h)",
      drainageRunoff: "Noteces koeficients",
      drainageGutterRun: "Noteku kopgarums (m)",
      drainageFlow: "Projektētais plūsmas daudzums",
      drainageGutterSize: "Ieteicamais notekas diametrs",
      drainageDownpipeSize: "Ieteicamais stāvvada diametrs",
      drainageGutterNeed: "Noteku iepirkuma garums",
      drainageDownpipeCount: "Stāvvadu skaits",
      drainageDownpipeLen: "Stāvvadu kopgarums",
      drainageFittings: "Savienojumi un līkumi",
      propertyTitle: "Īpašuma noteicēja quick kalkulators",
      propertyLead: "Ātrs īpašuma tirgus vērtības novērtējums pēc platības, lokācijas un stāvokļa.",
      propertyResultTitle: "Īpašuma novērtējums",
      propertyArea: "Īpašuma platība (m²)",
      propertyLocation: "Lokācija",
      propertyLocCapital: "Galvaspilsēta",
      propertyLocCity: "Pilsēta",
      propertyLocRegion: "Reģions",
      propertyCondition: "Stāvoklis",
      propertyCondNew: "Jauns",
      propertyCondRenovated: "Renovēts",
      propertyCondOld: "Vecs",
      propertyEnergy: "Energo klase",
      propertyEnergyAB: "A/B",
      propertyEnergyC: "C",
      propertyEnergyDE: "D/E",
      propertyMarket: "Tirgus vērtība",
      propertyRange: "Diapazons",
      propertyRent: "Iespējamā īres maksa",
      propertyReserve: "Ieteicamā rezerve atjaunošanai",
      interiorTitle: "Iekšējās apdares quick kalkulators",
      interiorLead: "Aprēķins no grīdas m²: sienu laukums, krāsa, špaktele un (pilnajā paketē) grīdas materiāli.",
      height: "Griestu augstums (m)",
      shape: "Istabas forma",
      shapeSquare: "Kvadrāts",
      shapeRect15: "Taisnstūris 1:1.5",
      shapeRect2: "Taisnstūris 1:2",
      shapeIrregular: "Neregulāra",
      openings: "Atvērumu laukums (m²)",
      pack: "Darbu pakete",
      packCosmetic: "Kosmētiskais",
      packStandard: "Standarta",
      packFull: "Pilnais",
      includeCeiling: "Iekļaut griestus",
      interiorResultTitle: "Apdares rezultāts",
      perimeter: "Perimetrs",
      wallArea: "Sienu laukums",
      paintArea: "Krāsojamā platība",
      primer: "Grunts",
      paint: "Krāsa (2 kārtas)",
      putty: "Špaktele",
      floorCover: "Grīdas segums",
      underlay: "Apakšklājs",
      skirting: "Grīdlīstes",
      note: "Piezīme: quick režīma rezultāti ir orientējoši. Precīzai tāmei izmanto pilno telpu/Engineer aprēķinu.",
      unitM: "m",
      unitM2: "m²",
      unitL: "L",
      unitKg: "kg",
      unitPcs: "gab",
      unitH: "h"
    },
    en: {
      plumbingTitle: "Plumbing quick calculator",
      plumbingLead: "Fast estimate for pipe runs, fittings and costs per room.",
      area: "Room area (m²)",
      distance: "Distance to riser/manifold (m)",
      fixtures: "Number of sanitary points",
      complexity: "Complexity",
      complexitySimple: "Simple",
      complexityMedium: "Medium",
      complexityComplex: "Complex",
      class: "Material class",
      classBudget: "Budget",
      classStandard: "Standard",
      classPremium: "Premium",
      calc: "Calculate",
      plumbingResultTitle: "Plumbing result",
      coldPipe: "Cold water pipe",
      hotPipe: "Hot water pipe",
      drainPipe: "Drainage",
      fittings: "Fittings",
      valves: "Valves",
      laborHours: "Labor hours",
      estTotal: "Estimated total",
      roofTitle: "Roof structures quick calculator",
      roofLead: "Fast estimate of roofing area, drainage components and approximate cost.",
      roofPlanArea: "Building footprint area (m²)",
      roofSlope: "Roof slope (°)",
      roofType: "Roof type",
      roofTypeGable: "Gable",
      roofTypeHip: "Hip",
      roofTypeShed: "Shed",
      roofTypeFlat: "Flat",
      roofCover: "Covering type",
      roofCoverMetal: "Metal",
      roofCoverTile: "Tile",
      roofCoverBitumen: "Bitumen",
      roofComplexity: "Roof complexity",
      roofResultTitle: "Roof result",
      roofRealArea: "Actual roof area",
      roofCoverNeed: "Required covering quantity",
      roofMembrane: "Underlay membrane",
      roofBattens: "Battens",
      roofRidge: "Ridge",
      roofGutter: "Gutters",
      roofDownpipes: "Downpipes",
      roofFasteners: "Fasteners",
      drainageTitle: "Drainage systems quick calculator",
      drainageLead: "Fast drainage estimate from roof catchment area and gutter length.",
      drainageResultTitle: "Drainage result",
      drainageCatchmentArea: "Catchment area (m²)",
      drainageRainfall: "Rainfall intensity (mm/h)",
      drainageRunoff: "Runoff coefficient",
      drainageGutterRun: "Total gutter run (m)",
      drainageFlow: "Design flow",
      drainageGutterSize: "Recommended gutter size",
      drainageDownpipeSize: "Recommended downpipe size",
      drainageGutterNeed: "Gutter purchase length",
      drainageDownpipeCount: "Downpipe count",
      drainageDownpipeLen: "Total downpipe length",
      drainageFittings: "Fittings and bends",
      propertyTitle: "Property valuation quick calculator",
      propertyLead: "Fast market value estimate from area, location and condition.",
      propertyResultTitle: "Property estimate",
      propertyArea: "Property area (m²)",
      propertyLocation: "Location",
      propertyLocCapital: "Capital",
      propertyLocCity: "City",
      propertyLocRegion: "Region",
      propertyCondition: "Condition",
      propertyCondNew: "New",
      propertyCondRenovated: "Renovated",
      propertyCondOld: "Old",
      propertyEnergy: "Energy class",
      propertyEnergyAB: "A/B",
      propertyEnergyC: "C",
      propertyEnergyDE: "D/E",
      propertyMarket: "Market value",
      propertyRange: "Range",
      propertyRent: "Estimated monthly rent",
      propertyReserve: "Recommended renovation reserve",
      interiorTitle: "Interior finishing quick calculator",
      interiorLead: "Estimate from floor m²: wall area, paint, putty, and (full package) floor materials.",
      height: "Ceiling height (m)",
      shape: "Room shape",
      shapeSquare: "Square",
      shapeRect15: "Rectangle 1:1.5",
      shapeRect2: "Rectangle 1:2",
      shapeIrregular: "Irregular",
      openings: "Openings area (m²)",
      pack: "Work package",
      packCosmetic: "Cosmetic",
      packStandard: "Standard",
      packFull: "Full",
      includeCeiling: "Include ceiling",
      interiorResultTitle: "Finishing result",
      perimeter: "Perimeter",
      wallArea: "Wall area",
      paintArea: "Paint area",
      primer: "Primer",
      paint: "Paint (2 coats)",
      putty: "Putty",
      floorCover: "Floor cover",
      underlay: "Underlay",
      skirting: "Skirting",
      note: "Note: quick mode values are indicative. For precise quotation, use full room/Engineer calculation.",
      unitM: "m",
      unitM2: "m²",
      unitL: "L",
      unitKg: "kg",
      unitPcs: "pcs",
      unitH: "h"
    },
    ru: {
      plumbingTitle: "Быстрый калькулятор сантехники",
      plumbingLead: "Быстрая оценка труб, фитингов и стоимости по помещению.",
      area: "Площадь помещения (м²)",
      distance: "Расстояние до стояка/коллектора (м)",
      fixtures: "Количество санитарных точек",
      complexity: "Сложность",
      complexitySimple: "Просто",
      complexityMedium: "Средне",
      complexityComplex: "Сложно",
      class: "Класс материалов",
      classBudget: "Budget",
      classStandard: "Стандарт",
      classPremium: "Premium",
      calc: "Рассчитать",
      plumbingResultTitle: "Результат сантехники",
      coldPipe: "Труба ХВС",
      hotPipe: "Труба ГВС",
      drainPipe: "Канализация",
      fittings: "Фитинги",
      valves: "Краны",
      laborHours: "Часы работ",
      estTotal: "Ориентировочная сумма",
      roofTitle: "Быстрый калькулятор крыши",
      roofLead: "Быстрый расчет площади кровли, водостока и ориентировочной стоимости.",
      roofPlanArea: "Площадь проекции здания (м²)",
      roofSlope: "Уклон крыши (°)",
      roofType: "Тип крыши",
      roofTypeGable: "Двускатная",
      roofTypeHip: "Вальмовая",
      roofTypeShed: "Односкатная",
      roofTypeFlat: "Плоская",
      roofCover: "Тип покрытия",
      roofCoverMetal: "Металл",
      roofCoverTile: "Черепица",
      roofCoverBitumen: "Битум",
      roofComplexity: "Сложность крыши",
      roofResultTitle: "Результат по крыше",
      roofRealArea: "Реальная площадь крыши",
      roofCoverNeed: "Требуемый объем покрытия",
      roofMembrane: "Подкровельная мембрана",
      roofBattens: "Обрешетка",
      roofRidge: "Конек",
      roofGutter: "Водосток",
      roofDownpipes: "Стояки",
      roofFasteners: "Крепеж",
      drainageTitle: "Быстрый калькулятор водостока",
      drainageLead: "Быстрый расчет водоотвода по площади кровли и длине желобов.",
      drainageResultTitle: "Результат водостока",
      drainageCatchmentArea: "Площадь водосбора (м²)",
      drainageRainfall: "Интенсивность дождя (мм/ч)",
      drainageRunoff: "Коэффициент стока",
      drainageGutterRun: "Общая длина желобов (м)",
      drainageFlow: "Расчетный расход",
      drainageGutterSize: "Рекомендуемый диаметр желоба",
      drainageDownpipeSize: "Рекомендуемый диаметр стояка",
      drainageGutterNeed: "Закупаемая длина желобов",
      drainageDownpipeCount: "Количество стояков",
      drainageDownpipeLen: "Суммарная длина стояков",
      drainageFittings: "Фитинги и колена",
      propertyTitle: "Быстрый оценщик недвижимости",
      propertyLead: "Быстрая оценка рыночной стоимости по площади, локации и состоянию.",
      propertyResultTitle: "Оценка недвижимости",
      propertyArea: "Площадь недвижимости (м²)",
      propertyLocation: "Локация",
      propertyLocCapital: "Столица",
      propertyLocCity: "Город",
      propertyLocRegion: "Регион",
      propertyCondition: "Состояние",
      propertyCondNew: "Новый",
      propertyCondRenovated: "Реновированный",
      propertyCondOld: "Старый",
      propertyEnergy: "Энерго класс",
      propertyEnergyAB: "A/B",
      propertyEnergyC: "C",
      propertyEnergyDE: "D/E",
      propertyMarket: "Рыночная стоимость",
      propertyRange: "Диапазон",
      propertyRent: "Оценка месячной аренды",
      propertyReserve: "Рекомендуемый резерв на обновление",
      interiorTitle: "Быстрый калькулятор отделки",
      interiorLead: "Расчет от площади пола: стены, краска, шпаклевка и (полный пакет) материалы пола.",
      height: "Высота потолка (м)",
      shape: "Форма комнаты",
      shapeSquare: "Квадрат",
      shapeRect15: "Прямоугольник 1:1.5",
      shapeRect2: "Прямоугольник 1:2",
      shapeIrregular: "Нерегулярная",
      openings: "Площадь проемов (м²)",
      pack: "Пакет работ",
      packCosmetic: "Косметика",
      packStandard: "Стандарт",
      packFull: "Полный",
      includeCeiling: "Включать потолок",
      interiorResultTitle: "Результат отделки",
      perimeter: "Периметр",
      wallArea: "Площадь стен",
      paintArea: "Площадь покраски",
      primer: "Грунт",
      paint: "Краска (2 слоя)",
      putty: "Шпаклевка",
      floorCover: "Покрытие пола",
      underlay: "Подложка",
      skirting: "Плинтус",
      note: "Примечание: quick режим дает ориентировочный результат. Для точной сметы используйте полный/Engineer расчет.",
      unitM: "м",
      unitM2: "м²",
      unitL: "л",
      unitKg: "кг",
      unitPcs: "шт",
      unitH: "ч"
    },
    de: {
      plumbingTitle: "Sanitaer Quick-Rechner",
      plumbingLead: "Schnelle Schaetzung fuer Rohre, Formteile und Kosten pro Raum.",
      area: "Raumflaeche (m²)",
      distance: "Abstand zu Steigleitung/Verteiler (m)",
      fixtures: "Anzahl Sanitaerpunkte",
      complexity: "Komplexitaet",
      complexitySimple: "Einfach",
      complexityMedium: "Mittel",
      complexityComplex: "Komplex",
      class: "Materialklasse",
      classBudget: "Budget",
      classStandard: "Standard",
      classPremium: "Premium",
      calc: "Berechnen",
      plumbingResultTitle: "Sanitaer-Ergebnis",
      coldPipe: "Kaltwasserrohr",
      hotPipe: "Warmwasserrohr",
      drainPipe: "Abwasser",
      fittings: "Formteile",
      valves: "Ventile",
      laborHours: "Arbeitsstunden",
      estTotal: "Geschaetzte Summe",
      roofTitle: "Dachkonstruktionen Quick-Rechner",
      roofLead: "Schnelle Schaetzung von Dachflaeche, Entwaesserung und ungefaehren Kosten.",
      roofPlanArea: "Gebaeudegrundflaeche (m²)",
      roofSlope: "Dachneigung (°)",
      roofType: "Dachtyp",
      roofTypeGable: "Satteldach",
      roofTypeHip: "Walmdach",
      roofTypeShed: "Pultdach",
      roofTypeFlat: "Flachdach",
      roofCover: "Deckungsart",
      roofCoverMetal: "Metall",
      roofCoverTile: "Dachziegel",
      roofCoverBitumen: "Bitumen",
      roofComplexity: "Dachkomplexitaet",
      roofResultTitle: "Dach-Ergebnis",
      roofRealArea: "Reale Dachflaeche",
      roofCoverNeed: "Benoetigte Deckungsmenge",
      roofMembrane: "Unterdeckbahn",
      roofBattens: "Latten",
      roofRidge: "First",
      roofGutter: "Dachrinnen",
      roofDownpipes: "Fallrohre",
      roofFasteners: "Befestiger",
      drainageTitle: "Entwaesserung Quick-Rechner",
      drainageLead: "Schnelle Entwaesserungsschaetzung aus Dachflaeche und Rinnenlaenge.",
      drainageResultTitle: "Entwaesserungs-Ergebnis",
      drainageCatchmentArea: "Abflussflaeche (m²)",
      drainageRainfall: "Regenintensitaet (mm/h)",
      drainageRunoff: "Abflussbeiwert",
      drainageGutterRun: "Gesamte Rinnenlaenge (m)",
      drainageFlow: "Auslegungsdurchfluss",
      drainageGutterSize: "Empfohlene Rinnengroesse",
      drainageDownpipeSize: "Empfohlene Fallrohrgroesse",
      drainageGutterNeed: "Rinnen-Einkaufslaenge",
      drainageDownpipeCount: "Anzahl Fallrohre",
      drainageDownpipeLen: "Gesamtlaenge Fallrohre",
      drainageFittings: "Formteile und Boegen",
      propertyTitle: "Immobilienbewertung Quick-Rechner",
      propertyLead: "Schnelle Marktwertschaetzung nach Flaeche, Lage und Zustand.",
      propertyResultTitle: "Immobilienbewertung",
      propertyArea: "Immobilienflaeche (m²)",
      propertyLocation: "Lage",
      propertyLocCapital: "Hauptstadt",
      propertyLocCity: "Stadt",
      propertyLocRegion: "Region",
      propertyCondition: "Zustand",
      propertyCondNew: "Neu",
      propertyCondRenovated: "Saniert",
      propertyCondOld: "Alt",
      propertyEnergy: "Energieklasse",
      propertyEnergyAB: "A/B",
      propertyEnergyC: "C",
      propertyEnergyDE: "D/E",
      propertyMarket: "Marktwert",
      propertyRange: "Bereich",
      propertyRent: "Geschaetzte Monatsmiete",
      propertyReserve: "Empfohlene Sanierungsreserve",
      interiorTitle: "Innenausbau Quick-Rechner",
      interiorLead: "Schaetzung aus Boden-m²: Wandflaeche, Farbe, Spachtel und (voll) Bodenmaterialien.",
      height: "Deckenhoehe (m)",
      shape: "Raumform",
      shapeSquare: "Quadrat",
      shapeRect15: "Rechteck 1:1.5",
      shapeRect2: "Rechteck 1:2",
      shapeIrregular: "Unregelmaessig",
      openings: "Oeffnungsflaeche (m²)",
      pack: "Leistungspaket",
      packCosmetic: "Kosmetisch",
      packStandard: "Standard",
      packFull: "Voll",
      includeCeiling: "Decke einbeziehen",
      interiorResultTitle: "Ausbau-Ergebnis",
      perimeter: "Umfang",
      wallArea: "Wandflaeche",
      paintArea: "Malerflaeche",
      primer: "Grundierung",
      paint: "Farbe (2 Anstriche)",
      putty: "Spachtel",
      floorCover: "Bodenbelag",
      underlay: "Unterlage",
      skirting: "Sockelleiste",
      note: "Hinweis: Quick-Modus ist nur orientierend. Fuer genaue Kalkulation den vollen/Engineer Modus nutzen.",
      unitM: "m",
      unitM2: "m²",
      unitL: "L",
      unitKg: "kg",
      unitPcs: "Stk",
      unitH: "h"
    },
    pl: {
      plumbingTitle: "Szybki kalkulator hydrauliki",
      plumbingLead: "Szybki szacunek rur, ksztaltek i kosztow na pomieszczenie.",
      area: "Powierzchnia pomieszczenia (m²)",
      distance: "Odleglosc do pionu/rozdzielacza (m)",
      fixtures: "Liczba punktow sanitarnych",
      complexity: "Zlozonosc",
      complexitySimple: "Prosto",
      complexityMedium: "Srednio",
      complexityComplex: "Zlozenie",
      class: "Klasa materialow",
      classBudget: "Budget",
      classStandard: "Standard",
      classPremium: "Premium",
      calc: "Oblicz",
      plumbingResultTitle: "Wynik hydrauliki",
      coldPipe: "Rura zimnej wody",
      hotPipe: "Rura cieplej wody",
      drainPipe: "Kanalizacja",
      fittings: "Ksztaltki",
      valves: "Zawory",
      laborHours: "Godziny robocze",
      estTotal: "Szacowana suma",
      roofTitle: "Szybki kalkulator dachu",
      roofLead: "Szybki szacunek powierzchni dachu, odwodnienia i orientacyjnych kosztow.",
      roofPlanArea: "Powierzchnia rzutu budynku (m²)",
      roofSlope: "Nachylenie dachu (°)",
      roofType: "Typ dachu",
      roofTypeGable: "Dwuspadowy",
      roofTypeHip: "Czterospadowy",
      roofTypeShed: "Jednospadowy",
      roofTypeFlat: "Plaski",
      roofCover: "Typ pokrycia",
      roofCoverMetal: "Metal",
      roofCoverTile: "Dachowka",
      roofCoverBitumen: "Bitum",
      roofComplexity: "Zlozonosc dachu",
      roofResultTitle: "Wynik dachu",
      roofRealArea: "Rzeczywista powierzchnia dachu",
      roofCoverNeed: "Wymagana ilosc pokrycia",
      roofMembrane: "Membrana podpokryciowa",
      roofBattens: "Laty",
      roofRidge: "Kalenica",
      roofGutter: "Rynny",
      roofDownpipes: "Rury spustowe",
      roofFasteners: "Laczniki",
      drainageTitle: "Szybki kalkulator odwodnienia",
      drainageLead: "Szybki szacunek odwodnienia z powierzchni dachu i dlugosci rynien.",
      drainageResultTitle: "Wynik odwodnienia",
      drainageCatchmentArea: "Powierzchnia zlewni (m²)",
      drainageRainfall: "Intensywnosc opadu (mm/h)",
      drainageRunoff: "Wspolczynnik splywu",
      drainageGutterRun: "Laczna dlugosc rynien (m)",
      drainageFlow: "Przeplyw obliczeniowy",
      drainageGutterSize: "Zalecana srednica rynny",
      drainageDownpipeSize: "Zalecana srednica rury spustowej",
      drainageGutterNeed: "Dlugosc rynien do zakupu",
      drainageDownpipeCount: "Liczba rur spustowych",
      drainageDownpipeLen: "Laczna dlugosc rur spustowych",
      drainageFittings: "Ksztaltki i kolana",
      propertyTitle: "Szybki kalkulator wyceny nieruchomosci",
      propertyLead: "Szybka wycena rynkowa wg powierzchni, lokalizacji i stanu.",
      propertyResultTitle: "Wycena nieruchomosci",
      propertyArea: "Powierzchnia nieruchomosci (m²)",
      propertyLocation: "Lokalizacja",
      propertyLocCapital: "Stolica",
      propertyLocCity: "Miasto",
      propertyLocRegion: "Region",
      propertyCondition: "Stan",
      propertyCondNew: "Nowy",
      propertyCondRenovated: "Po remoncie",
      propertyCondOld: "Stary",
      propertyEnergy: "Klasa energetyczna",
      propertyEnergyAB: "A/B",
      propertyEnergyC: "C",
      propertyEnergyDE: "D/E",
      propertyMarket: "Wartosc rynkowa",
      propertyRange: "Zakres",
      propertyRent: "Szacowany czynsz miesieczny",
      propertyReserve: "Zalecana rezerwa na odnowienie",
      interiorTitle: "Szybki kalkulator wykonczenia",
      interiorLead: "Szacunek z m² podlogi: sciany, farba, gladz i (pelny pakiet) materialy podlogowe.",
      height: "Wysokosc sufitu (m)",
      shape: "Ksztalt pomieszczenia",
      shapeSquare: "Kwadrat",
      shapeRect15: "Prostokat 1:1.5",
      shapeRect2: "Prostokat 1:2",
      shapeIrregular: "Nieregularny",
      openings: "Powierzchnia otworow (m²)",
      pack: "Pakiet prac",
      packCosmetic: "Kosmetyczny",
      packStandard: "Standard",
      packFull: "Pelny",
      includeCeiling: "Uwzglednij sufit",
      interiorResultTitle: "Wynik wykonczenia",
      perimeter: "Obwod",
      wallArea: "Powierzchnia scian",
      paintArea: "Powierzchnia malowania",
      primer: "Grunt",
      paint: "Farba (2 warstwy)",
      putty: "Gladz",
      floorCover: "Pokrycie podlogi",
      underlay: "Podklad",
      skirting: "Listwy przypodlogowe",
      note: "Uwaga: quick mode daje wynik orientacyjny. Dla dokladnej wyceny uzyj pelnego/Engineer trybu.",
      unitM: "m",
      unitM2: "m²",
      unitL: "L",
      unitKg: "kg",
      unitPcs: "szt",
      unitH: "h"
    }
  };

  function t(key) {
    var dict = TEXT[lang] || TEXT.lv;
    return dict[key] || TEXT.lv[key] || key;
  }

  function num(v, fallback) {
    var x = Number(v);
    return Number.isFinite(x) ? x : fallback;
  }

  function round(v, p) {
    var m = Math.pow(10, p || 2);
    return Math.round(v * m) / m;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function money(v) {
    var locale = lang === "en" ? "en-IE" : lang === "ru" ? "ru-RU" : lang === "de" ? "de-DE" : lang === "pl" ? "pl-PL" : "lv-LV";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(v || 0);
  }

  function injectPlumbing() {
    var module = document.querySelector('[data-calc-category="plumbing"]');
    if (!module) return;

    module.innerHTML =
      '<section class="block">' +
      '<h2>' + t("plumbingTitle") + '</h2>' +
      '<p class="note">' + t("plumbingLead") + '</p>' +
      '<form class="lead-form calc-grid" data-plumbing-form onsubmit="return false;">' +
      '<label>' + t("area") + '<input type="number" data-p="area" min="1" step="0.1" value="25" /></label>' +
      '<label>' + t("distance") + '<input type="number" data-p="distance" min="0" step="0.1" value="6" /></label>' +
      '<label>' + t("fixtures") + '<input type="number" data-p="fixtures" min="1" step="1" value="5" /></label>' +
      '<label>' + t("complexity") + '<select data-p="complexity"><option value="simple">' + t("complexitySimple") + '</option><option value="medium" selected>' + t("complexityMedium") + '</option><option value="complex">' + t("complexityComplex") + '</option></select></label>' +
      '<label>' + t("class") + '<select data-p="class"><option value="budget">' + t("classBudget") + '</option><option value="standard" selected>' + t("classStandard") + '</option><option value="premium">' + t("classPremium") + '</option></select></label>' +
      '<div class="cta-row"><button type="button" class="btn" data-plumbing-calc>' + t("calc") + '</button></div>' +
      '</form>' +
      '<div class="results-stack" data-plumbing-result></div>' +
      '</section>';

    var form = module.querySelector("[data-plumbing-form]");
    var resultWrap = module.querySelector("[data-plumbing-result]");
    var btn = module.querySelector("[data-plumbing-calc]");
    if (!form || !resultWrap || !btn) return;

    function calcPlumbing() {
      var area = Math.max(1, num(form.querySelector('[data-p="area"]').value, 25));
      var distance = Math.max(0, num(form.querySelector('[data-p="distance"]').value, 6));
      var fixtures = Math.max(1, Math.round(num(form.querySelector('[data-p="fixtures"]').value, 5)));
      var complexity = form.querySelector('[data-p="complexity"]').value;
      var materialClass = form.querySelector('[data-p="class"]').value;

      var complexityFactor = complexity === "complex" ? 1.5 : complexity === "medium" ? 1.25 : 1;
      var classFactor = materialClass === "premium" ? 1.25 : materialClass === "budget" ? 0.9 : 1;

      var basePipe = area * 1.8 + distance * 2 + fixtures * 3;
      var coldPipe = round(basePipe * 0.55, 1);
      var hotPipe = round(basePipe * 0.45, 1);
      var drainPipe = round(area * 0.9 + fixtures * 2 + distance * 0.6, 1);
      var fittings = Math.ceil(((coldPipe + hotPipe + drainPipe) / 4) * complexityFactor);
      var valves = fixtures + 1;
      var laborHours = round((basePipe / 6 + fixtures * 0.8) * complexityFactor, 1);

      var materials = (coldPipe + hotPipe) * 3.2 + drainPipe * 2.1 + fittings * 2.4 + valves * 8;
      var labor = laborHours * 28;
      var total = round((materials + labor) * classFactor, 2);

      resultWrap.innerHTML =
        '<article class="result-card">' +
        '<h3>' + t("plumbingResultTitle") + '</h3>' +
        '<div class="sys-grid">' +
        '<p><strong>' + t("coldPipe") + ':</strong> ' + coldPipe + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("hotPipe") + ':</strong> ' + hotPipe + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("drainPipe") + ':</strong> ' + drainPipe + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("fittings") + ':</strong> ' + fittings + ' ' + t("unitPcs") + '</p>' +
        '<p><strong>' + t("valves") + ':</strong> ' + valves + ' ' + t("unitPcs") + '</p>' +
        '<p><strong>' + t("laborHours") + ':</strong> ' + laborHours + ' ' + t("unitH") + '</p>' +
        '<p class="grand"><strong>' + t("estTotal") + ':</strong> ' + money(total) + '</p>' +
        '</div>' +
        '<p class="note">' + t("note") + '</p>' +
        '</article>';
    }

    btn.addEventListener("click", calcPlumbing);
    calcPlumbing();
  }

  function injectInterior() {
    var module = document.querySelector('[data-calc-category="interior"]');
    if (!module) return;

    module.innerHTML =
      '<section class="block">' +
      '<h2>' + t("interiorTitle") + '</h2>' +
      '<p class="note">' + t("interiorLead") + '</p>' +
      '<form class="lead-form calc-grid" data-interior-form onsubmit="return false;">' +
      '<label>' + t("area") + '<input type="number" data-i="area" min="1" step="0.1" value="20" /></label>' +
      '<label>' + t("height") + '<input type="number" data-i="height" min="2" step="0.01" value="2.6" /></label>' +
      '<label>' + t("shape") + '<select data-i="shape"><option value="square">' + t("shapeSquare") + '</option><option value="rect15" selected>' + t("shapeRect15") + '</option><option value="rect2">' + t("shapeRect2") + '</option><option value="irregular">' + t("shapeIrregular") + '</option></select></label>' +
      '<label>' + t("openings") + '<input type="number" data-i="openings" min="0" step="0.1" value="2.5" /></label>' +
      '<label>' + t("pack") + '<select data-i="pack"><option value="cosmetic">' + t("packCosmetic") + '</option><option value="standard" selected>' + t("packStandard") + '</option><option value="full">' + t("packFull") + '</option></select></label>' +
      '<label><input type="checkbox" data-i="ceiling" checked /> ' + t("includeCeiling") + '</label>' +
      '<div class="cta-row"><button type="button" class="btn" data-interior-calc>' + t("calc") + '</button></div>' +
      '</form>' +
      '<div class="results-stack" data-interior-result></div>' +
      '</section>';

    var form = module.querySelector("[data-interior-form]");
    var resultWrap = module.querySelector("[data-interior-result]");
    var btn = module.querySelector("[data-interior-calc]");
    if (!form || !resultWrap || !btn) return;

    function calcInterior() {
      var area = Math.max(1, num(form.querySelector('[data-i="area"]').value, 20));
      var height = Math.max(2, num(form.querySelector('[data-i="height"]').value, 2.6));
      var openings = Math.max(0, num(form.querySelector('[data-i="openings"]').value, 2.5));
      var shape = form.querySelector('[data-i="shape"]').value;
      var pack = form.querySelector('[data-i="pack"]').value;
      var includeCeiling = !!form.querySelector('[data-i="ceiling"]').checked;

      var coeff = shape === "rect2" ? 4.24 : shape === "irregular" ? 4.66 : shape === "square" ? 4 : 4.08;
      var perimeter = coeff * Math.sqrt(area);
      var wallArea = Math.max(0, perimeter * height - openings);
      var ceilingArea = includeCeiling ? area : 0;
      var paintArea = wallArea + ceilingArea;

      var primerL = round(paintArea * 0.11, 1);
      var paintL = round((paintArea / 9) * 2 * 1.1, 1);
      var puttyKg = pack === "cosmetic" ? 0 : round(wallArea * 0.8 + ceilingArea * 0.6, 1);
      var floorCover = pack === "full" ? round(area * 1.08, 1) : 0;
      var underlay = pack === "full" ? round(area * 1.03, 1) : 0;
      var skirting = pack === "full" ? round(Math.max(0, perimeter - 0.9), 1) : 0;

      var primerCost = primerL * 4;
      var paintCost = paintL * 7;
      var puttyCost = puttyKg * 1.2;
      var floorCost = floorCover * 13 + underlay * 2.5 + skirting * 3.5;

      var laborHours = pack === "cosmetic"
        ? paintArea / 12
        : pack === "standard"
          ? paintArea / 10 + puttyKg / 15
          : paintArea / 10 + puttyKg / 15 + floorCover / 8 + skirting / 12;

      laborHours = round(laborHours, 1);
      var laborCost = laborHours * 26;
      var total = round(primerCost + paintCost + puttyCost + floorCost + laborCost, 2);

      resultWrap.innerHTML =
        '<article class="result-card">' +
        '<h3>' + t("interiorResultTitle") + '</h3>' +
        '<div class="sys-grid">' +
        '<p><strong>' + t("perimeter") + ':</strong> ' + round(perimeter, 1) + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("wallArea") + ':</strong> ' + round(wallArea, 1) + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("paintArea") + ':</strong> ' + round(paintArea, 1) + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("primer") + ':</strong> ' + primerL + ' ' + t("unitL") + '</p>' +
        '<p><strong>' + t("paint") + ':</strong> ' + paintL + ' ' + t("unitL") + '</p>' +
        '<p><strong>' + t("putty") + ':</strong> ' + puttyKg + ' ' + t("unitKg") + '</p>' +
        '<p><strong>' + t("floorCover") + ':</strong> ' + floorCover + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("underlay") + ':</strong> ' + underlay + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("skirting") + ':</strong> ' + skirting + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("laborHours") + ':</strong> ' + laborHours + ' ' + t("unitH") + '</p>' +
        '<p class="grand"><strong>' + t("estTotal") + ':</strong> ' + money(total) + '</p>' +
        '</div>' +
        '<p class="note">' + t("note") + '</p>' +
        '</article>';
    }

    btn.addEventListener("click", calcInterior);
    calcInterior();
  }

  function injectRoof() {
    var module = document.querySelector('[data-calc-category="roof"]');
    if (!module) return;

    module.innerHTML =
      '<section class="block">' +
      '<h2>' + t("roofTitle") + '</h2>' +
      '<p class="note">' + t("roofLead") + '</p>' +
      '<form class="lead-form calc-grid" data-roof-form onsubmit="return false;">' +
      '<label>' + t("roofPlanArea") + '<input type="number" data-r="planArea" min="10" step="0.1" value="120" /></label>' +
      '<label>' + t("roofSlope") + '<input type="number" data-r="slope" min="0" max="60" step="1" value="28" /></label>' +
      '<label>' + t("roofType") + '<select data-r="type"><option value="gable" selected>' + t("roofTypeGable") + '</option><option value="hip">' + t("roofTypeHip") + '</option><option value="shed">' + t("roofTypeShed") + '</option><option value="flat">' + t("roofTypeFlat") + '</option></select></label>' +
      '<label>' + t("roofCover") + '<select data-r="cover"><option value="metal" selected>' + t("roofCoverMetal") + '</option><option value="tile">' + t("roofCoverTile") + '</option><option value="bitumen">' + t("roofCoverBitumen") + '</option></select></label>' +
      '<label>' + t("roofComplexity") + '<select data-r="complexity"><option value="simple">' + t("complexitySimple") + '</option><option value="medium" selected>' + t("complexityMedium") + '</option><option value="complex">' + t("complexityComplex") + '</option></select></label>' +
      '<div class="cta-row"><button type="button" class="btn" data-roof-calc>' + t("calc") + '</button></div>' +
      '</form>' +
      '<div class="results-stack" data-roof-result></div>' +
      '</section>';

    var form = module.querySelector("[data-roof-form]");
    var resultWrap = module.querySelector("[data-roof-result]");
    var btn = module.querySelector("[data-roof-calc]");
    if (!form || !resultWrap || !btn) return;

    function calcRoof() {
      var planArea = Math.max(10, num(form.querySelector('[data-r="planArea"]').value, 120));
      var slopeDeg = clamp(num(form.querySelector('[data-r="slope"]').value, 28), 0, 60);
      var roofType = form.querySelector('[data-r="type"]').value;
      var coverType = form.querySelector('[data-r="cover"]').value;
      var complexity = form.querySelector('[data-r="complexity"]').value;

      var complexityFactor = complexity === "complex" ? 1.24 : complexity === "medium" ? 1.12 : 1;
      var slopeFactor = roofType === "flat" ? 1 : 1 / Math.cos((slopeDeg * Math.PI) / 180);
      var typeAreaFactor = roofType === "hip" ? 1.06 : roofType === "shed" ? 1.02 : 1;
      var realArea = planArea * slopeFactor * typeAreaFactor;

      var coverWaste = coverType === "tile" ? 1.1 : coverType === "bitumen" ? 1.08 : 1.07;
      var coverNeed = realArea * coverWaste * complexityFactor;
      var membrane = realArea * 1.08;

      var battensPerM2 = roofType === "flat" ? 0 : coverType === "tile" ? 4.4 : coverType === "bitumen" ? 2.6 : 3.1;
      var battens = realArea * battensPerM2;

      var ridgeFactor = roofType === "gable" ? 0.22 : roofType === "hip" ? 0.16 : roofType === "shed" ? 0.12 : 0;
      var ridge = Math.sqrt(planArea) * ridgeFactor * complexityFactor;

      var perimeter = 4 * Math.sqrt(planArea);
      var gutterFactor = roofType === "hip" || roofType === "flat" ? 1 : roofType === "shed" ? 0.52 : 0.55;
      var gutter = perimeter * gutterFactor;
      var downpipes = Math.max(2, Math.ceil(gutter / 12));

      var fastenerRate = coverType === "tile" ? 11 : coverType === "bitumen" ? 8 : 9;
      if (roofType === "flat") fastenerRate = 6;
      var fasteners = Math.ceil(realArea * fastenerRate * complexityFactor);

      var laborRate = coverType === "tile" ? 0.28 : coverType === "bitumen" ? 0.24 : 0.2;
      if (roofType === "flat") laborRate = 0.22;
      var laborHours = realArea * laborRate * complexityFactor;

      var coverUnit = coverType === "tile" ? 23 : coverType === "bitumen" ? 17 : 14;
      var membraneUnit = 2.8;
      var battensUnit = 1.25;
      var ridgeUnit = 9.5;
      var gutterUnit = 12;
      var downpipeUnit = 24;
      var fastenerUnit = 0.07;

      var materialCost =
        coverNeed * coverUnit +
        membrane * membraneUnit +
        battens * battensUnit +
        ridge * ridgeUnit +
        gutter * gutterUnit +
        downpipes * downpipeUnit +
        fasteners * fastenerUnit;
      var laborCost = laborHours * 29;
      var total = round(materialCost + laborCost, 2);

      resultWrap.innerHTML =
        '<article class="result-card">' +
        '<h3>' + t("roofResultTitle") + '</h3>' +
        '<div class="sys-grid">' +
        '<p><strong>' + t("roofRealArea") + ':</strong> ' + round(realArea, 1) + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("roofCoverNeed") + ':</strong> ' + round(coverNeed, 1) + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("roofMembrane") + ':</strong> ' + round(membrane, 1) + ' ' + t("unitM2") + '</p>' +
        '<p><strong>' + t("roofBattens") + ':</strong> ' + round(battens, 1) + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("roofRidge") + ':</strong> ' + round(ridge, 1) + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("roofGutter") + ':</strong> ' + round(gutter, 1) + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("roofDownpipes") + ':</strong> ' + downpipes + ' ' + t("unitPcs") + '</p>' +
        '<p><strong>' + t("roofFasteners") + ':</strong> ' + fasteners + ' ' + t("unitPcs") + '</p>' +
        '<p><strong>' + t("laborHours") + ':</strong> ' + round(laborHours, 1) + ' ' + t("unitH") + '</p>' +
        '<p class="grand"><strong>' + t("estTotal") + ':</strong> ' + money(total) + '</p>' +
        '</div>' +
        '<p class="note">' + t("note") + '</p>' +
        '</article>';
    }

    btn.addEventListener("click", calcRoof);
    calcRoof();
  }

  function injectDrainage() {
    var module = document.querySelector('[data-calc-category="drainage"]');
    if (!module) return;

    module.innerHTML =
      '<section class="block">' +
      '<h2>' + t("drainageTitle") + '</h2>' +
      '<p class="note">' + t("drainageLead") + '</p>' +
      '<form class="lead-form calc-grid" data-drainage-form onsubmit="return false;">' +
      '<label>' + t("drainageCatchmentArea") + '<input type="number" data-d="area" min="10" step="0.1" value="140" /></label>' +
      '<label>' + t("drainageGutterRun") + '<input type="number" data-d="gutterRun" min="4" step="0.1" value="36" /></label>' +
      '<label>' + t("drainageRainfall") + '<input type="number" data-d="rainfall" min="20" step="1" value="80" /></label>' +
      '<label>' + t("drainageRunoff") + '<select data-d="runoff"><option value="0.8">0.8</option><option value="0.9" selected>0.9</option><option value="1.0">1.0</option></select></label>' +
      '<label>' + t("complexity") + '<select data-d="complexity"><option value="simple">' + t("complexitySimple") + '</option><option value="medium" selected>' + t("complexityMedium") + '</option><option value="complex">' + t("complexityComplex") + '</option></select></label>' +
      '<label>' + t("class") + '<select data-d="class"><option value="budget">' + t("classBudget") + '</option><option value="standard" selected>' + t("classStandard") + '</option><option value="premium">' + t("classPremium") + '</option></select></label>' +
      '<div class="cta-row"><button type="button" class="btn" data-drainage-calc>' + t("calc") + '</button></div>' +
      '</form>' +
      '<div class="results-stack" data-drainage-result></div>' +
      '</section>';

    var form = module.querySelector("[data-drainage-form]");
    var resultWrap = module.querySelector("[data-drainage-result]");
    var btn = module.querySelector("[data-drainage-calc]");
    if (!form || !resultWrap || !btn) return;

    function calcDrainage() {
      var area = Math.max(10, num(form.querySelector('[data-d="area"]').value, 140));
      var gutterRun = Math.max(4, num(form.querySelector('[data-d="gutterRun"]').value, 36));
      var rainfall = Math.max(20, num(form.querySelector('[data-d="rainfall"]').value, 80));
      var runoff = clamp(num(form.querySelector('[data-d="runoff"]').value, 0.9), 0.7, 1);
      var complexity = form.querySelector('[data-d="complexity"]').value;
      var materialClass = form.querySelector('[data-d="class"]').value;

      var complexityFactor = complexity === "complex" ? 1.2 : complexity === "medium" ? 1.1 : 1;
      var classFactor = materialClass === "premium" ? 1.25 : materialClass === "budget" ? 0.9 : 1;
      var flowLps = (area * runoff * rainfall) / 3600;

      var gutterSize = flowLps <= 1.5 ? 125 : flowLps <= 2.8 ? 150 : 190;
      var downpipeSize = flowLps <= 1.2 ? 87 : flowLps <= 2.4 ? 100 : 120;

      var downpipeCount = Math.max(2, Math.ceil((gutterRun / 12) * complexityFactor));
      var gutterNeed = gutterRun * 1.08;
      var downpipeLen = downpipeCount * 3.2;
      var fittings = Math.ceil((gutterRun / 3 + downpipeCount * 2) * complexityFactor);
      var laborHours = (gutterRun / 7 + downpipeCount * 0.8) * complexityFactor;

      var gutterUnit = gutterSize === 125 ? 11 : gutterSize === 150 ? 14 : 19;
      var downpipeUnit = downpipeSize === 87 ? 8 : downpipeSize === 100 ? 10 : 13;
      var materialCost = gutterNeed * gutterUnit + downpipeLen * downpipeUnit + fittings * 5.5;
      var laborCost = laborHours * 27;
      var total = round((materialCost + laborCost) * classFactor, 2);

      resultWrap.innerHTML =
        '<article class="result-card">' +
        '<h3>' + t("drainageResultTitle") + '</h3>' +
        '<div class="sys-grid">' +
        '<p><strong>' + t("drainageFlow") + ':</strong> ' + round(flowLps, 2) + ' l/s</p>' +
        '<p><strong>' + t("drainageGutterSize") + ':</strong> ' + gutterSize + ' mm</p>' +
        '<p><strong>' + t("drainageDownpipeSize") + ':</strong> ' + downpipeSize + ' mm</p>' +
        '<p><strong>' + t("drainageGutterNeed") + ':</strong> ' + round(gutterNeed, 1) + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("drainageDownpipeCount") + ':</strong> ' + downpipeCount + ' ' + t("unitPcs") + '</p>' +
        '<p><strong>' + t("drainageDownpipeLen") + ':</strong> ' + round(downpipeLen, 1) + ' ' + t("unitM") + '</p>' +
        '<p><strong>' + t("drainageFittings") + ':</strong> ' + fittings + ' ' + t("unitPcs") + '</p>' +
        '<p><strong>' + t("laborHours") + ':</strong> ' + round(laborHours, 1) + ' ' + t("unitH") + '</p>' +
        '<p class="grand"><strong>' + t("estTotal") + ':</strong> ' + money(total) + '</p>' +
        '</div>' +
        '<p class="note">' + t("note") + '</p>' +
        '</article>';
    }

    btn.addEventListener("click", calcDrainage);
    calcDrainage();
  }

  function injectProperty() {
    var module = document.querySelector('[data-calc-category="property"]');
    if (!module) return;

    module.innerHTML =
      '<section class="block">' +
      '<h2>' + t("propertyTitle") + '</h2>' +
      '<p class="note">' + t("propertyLead") + '</p>' +
      '<form class="lead-form calc-grid" data-property-form onsubmit="return false;">' +
      '<label>' + t("propertyArea") + '<input type="number" data-v="area" min="10" step="0.1" value="72" /></label>' +
      '<label>' + t("propertyLocation") + '<select data-v="location"><option value="capital">' + t("propertyLocCapital") + '</option><option value="city" selected>' + t("propertyLocCity") + '</option><option value="region">' + t("propertyLocRegion") + '</option></select></label>' +
      '<label>' + t("propertyCondition") + '<select data-v="condition"><option value="new">' + t("propertyCondNew") + '</option><option value="renovated" selected>' + t("propertyCondRenovated") + '</option><option value="old">' + t("propertyCondOld") + '</option></select></label>' +
      '<label>' + t("propertyEnergy") + '<select data-v="energy"><option value="ab">' + t("propertyEnergyAB") + '</option><option value="c" selected>' + t("propertyEnergyC") + '</option><option value="de">' + t("propertyEnergyDE") + '</option></select></label>' +
      '<div class="cta-row"><button type="button" class="btn" data-property-calc>' + t("calc") + '</button></div>' +
      '</form>' +
      '<div class="results-stack" data-property-result></div>' +
      '</section>';

    var form = module.querySelector("[data-property-form]");
    var resultWrap = module.querySelector("[data-property-result]");
    var btn = module.querySelector("[data-property-calc]");
    if (!form || !resultWrap || !btn) return;

    function calcProperty() {
      var area = Math.max(10, num(form.querySelector('[data-v="area"]').value, 72));
      var location = form.querySelector('[data-v="location"]').value;
      var condition = form.querySelector('[data-v="condition"]').value;
      var energy = form.querySelector('[data-v="energy"]').value;

      var basePerM2 = location === "capital" ? 1950 : location === "city" ? 1450 : 980;
      var conditionFactor = condition === "new" ? 1.12 : condition === "renovated" ? 1 : 0.82;
      var energyFactor = energy === "ab" ? 1.08 : energy === "c" ? 1 : 0.9;
      var yieldRate = location === "capital" ? 0.045 : location === "city" ? 0.052 : 0.06;
      var reserveFactor = condition === "old" ? 0.12 : condition === "renovated" ? 0.06 : 0.03;

      var marketValue = area * basePerM2 * conditionFactor * energyFactor;
      var rangeMin = marketValue * 0.93;
      var rangeMax = marketValue * 1.07;
      var monthlyRent = (marketValue * yieldRate) / 12;
      var reserve = marketValue * reserveFactor;

      resultWrap.innerHTML =
        '<article class="result-card">' +
        '<h3>' + t("propertyResultTitle") + '</h3>' +
        '<div class="sys-grid">' +
        '<p><strong>' + t("propertyMarket") + ':</strong> ' + money(round(marketValue, 0)) + '</p>' +
        '<p><strong>' + t("propertyRange") + ':</strong> ' + money(round(rangeMin, 0)) + " - " + money(round(rangeMax, 0)) + '</p>' +
        '<p><strong>' + t("propertyRent") + ':</strong> ' + money(round(monthlyRent, 0)) + '</p>' +
        '<p><strong>' + t("propertyReserve") + ':</strong> ' + money(round(reserve, 0)) + '</p>' +
        '</div>' +
        '<p class="note">' + t("note") + '</p>' +
        '</article>';
    }

    btn.addEventListener("click", calcProperty);
    calcProperty();
  }

  function init() {
    if (!document.getElementById("heat-calculator-root")) return;
    injectPlumbing();
    injectInterior();
    injectRoof();
    injectDrainage();
    injectProperty();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
