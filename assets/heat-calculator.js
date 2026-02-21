(function () {
  function num(v, fallback) {
    var x = Number(v);
    return Number.isFinite(x) ? x : fallback;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function ceil(v) {
    return Math.ceil(v);
  }

  function round(v, p) {
    var m = Math.pow(10, p || 2);
    return Math.round(v * m) / m;
  }

  function stepMetersPerM2(stepMm, constants) {
    var key = String(Math.round(num(stepMm, 150)));
    if (constants.stepToMetersPerM2[key]) return constants.stepToMetersPerM2[key];
    var step = clamp(num(stepMm, 150), 60, 400);
    return 1000 / step;
  }

  function resolveInfiltrationN(room, constants) {
    var nManual = num(room.infiltrationN, NaN);
    if (Number.isFinite(nManual) && nManual > 0) return nManual;

    var profile = String(room.infiltrationProfile || "medium");
    var presets = constants.infiltrationProfiles || {};
    if (Number.isFinite(presets[profile])) return presets[profile];
    return 0.5;
  }

  function resolvePerimeter(room) {
    var manual = num(room.perimeterM, NaN);
    if (Number.isFinite(manual) && manual > 0) return manual;

    var l = num(room.lengthM, NaN);
    var w = num(room.widthM, NaN);
    if (Number.isFinite(l) && l > 0 && Number.isFinite(w) && w > 0) {
      return 2 * (l + w);
    }

    var area = num(room.area, 0);
    if (area > 0) return 4 * Math.sqrt(area);
    return 0;
  }

  function quickRoomLoadW(room, project, constants) {
    var area = num(room.area, 0);
    var state = constants.quickWm2[room.condition] || constants.quickWm2.renovated;
    var wpm2 = state.def;
    var coverFactor = constants.floorCoverFactor[room.floorCover] || 1;
    var adjusted = wpm2 * coverFactor;
    return {
      mode: "quick",
      wpm2: round(adjusted, 1),
      totalW: round(area * adjusted, 1),
      detail: {
        rangeMin: state.min,
        rangeMax: state.max,
      },
    };
  }

  function engineerRoomLoadW(room, project, constants) {
    var dt = Math.max(0, num(project.thetaInt, 21) - num(project.thetaExt, -12));
    var area = num(room.area, 0);
    var h = num(room.height, 2.7);
    var vol = area * h;

    var qt = 0;
    var envelopeRows = Array.isArray(room.envelopeRows) ? room.envelopeRows : [];
    if (envelopeRows.length) {
      qt = envelopeRows.reduce(function (sum, row) {
        return sum + num(row.area, 0) * num(row.uValue, 0) * dt;
      }, 0);
    } else {
      qt =
        num(room.wallArea, 0) * num(room.wallU, 0) * dt +
        num(room.windowArea, 0) * num(room.windowU, 0) * dt +
        num(room.floorArea, 0) * num(room.floorU, 0) * dt +
        num(room.ceilingArea, 0) * num(room.ceilingU, 0) * dt;
    }

    var qv = 0.34 * resolveInfiltrationN(room, constants) * vol * dt;
    var total = Math.max(0, qt + qv);

    return {
      mode: "engineer",
      wpm2: area > 0 ? round(total / area, 1) : 0,
      totalW: round(total, 1),
      detail: {
        qt: round(qt, 1),
        qv: round(qv, 1),
      },
    };
  }

  function blankUfh() {
    return {
      enabled: false,
      area: 0,
      occupiedArea: 0,
      effectiveArea: 0,
      innerArea: 0,
      outerArea: 0,
      loops: 0,
      totalLengthM: 0,
      totalLengthWithWasteM: 0,
      loopLengthM: 0,
      baseLengthM: 0,
      heatW: 0,
      flowTotalLMin: 0,
      flowPerLoopLMin: 0,
      stepMm: 0,
      outerStepMm: 0,
      pipeDiameter: "16x2",
      zoneMode: "none",
      zoneWidthM: 0,
      outerWallLengthM: 0,
      perimeterM: 0,
      doorWidthM: 0,
      edgeTapeM: 0,
      clipsQty: 0,
      maxLoopLengthM: 0,
      closeToLimit: false,
      needsWarning: false,
      needsEmitterSupport: false,
    };
  }

  function calculateUfh(room, project, roomLoad, constants) {
    var emitter = room.emitter;
    var needsUfh = emitter === "ufh" || emitter === "mixed";
    if (!needsUfh) return blankUfh();

    var out = blankUfh();
    var ufhShare = emitter === "mixed" ? clamp(num(room.ufhShare, constants.mixedUfhShareDefault), 10, 90) / 100 : 1;
    var roomArea = Math.max(0, num(room.area, 0));
    var ufhArea = clamp(num(room.ufhArea, roomArea), 0, roomArea);
    var occupied = clamp(num(room.occupiedArea, 0), 0, ufhArea);
    var effectiveArea = Math.max(0, ufhArea - occupied);

    var zoneMode = String(room.zoneMode || "none");
    var innerStepMm = num(room.stepMm, 150);
    var outerStepMm = num(room.outerStepMm, 150);
    var zoneWidth = clamp(num(room.outerZoneWidth, constants.ufhOuterZoneWidthM), 0, 2);
    var outerWallLength = Math.max(0, num(room.outerWallLength, 0));

    var outerArea = 0;
    var innerArea = effectiveArea;
    if (zoneMode === "outer") {
      outerArea = Math.min(effectiveArea, outerWallLength * zoneWidth);
      innerArea = Math.max(0, effectiveArea - outerArea);
    }

    var baseLen =
      innerArea * stepMetersPerM2(innerStepMm, constants) +
      outerArea * stepMetersPerM2(outerStepMm, constants);

    var dist = Math.max(0, num(room.collectorDistance, 0));
    var loopMax = clamp(num(room.maxLoopLengthM, constants.ufhMaxLoopLengthM), 60, 140);
    var totalWithLeads = effectiveArea > 0 ? baseLen + 2 * dist : 0;
    var loops = effectiveArea > 0 ? Math.max(1, ceil(totalWithLeads / loopMax)) : 0;
    var loopLength = loops > 0 ? baseLen / loops + 2 * dist : 0;
    var totalLength = loopLength * loops;
    var wasteFactor = 1 + num(project.wastePercent, 5) / 100;
    var totalLengthWithWaste = totalLength * wasteFactor;

    var ufhHeatW = loops > 0 ? roomLoad.totalW * ufhShare : 0;
    var deltaT = Math.max(1, num(project.ufhDeltaT, 7));
    var flowTotal = ufhHeatW / (deltaT * 60);
    var flowPerLoop = loops > 0 ? flowTotal / loops : 0;

    var perimeter = resolvePerimeter(room);
    var doorWidth = clamp(num(room.doorWidthM, constants.doorWidthDefaultM), 0, 4);
    var edgeTape = Math.max(0, perimeter - doorWidth);
    var clipStep = Math.max(0.1, num(constants.ufhClipSpacingM, 0.5));
    var clipsQty = loops > 0 ? ceil(totalLength / clipStep) : 0;

    var loadForUfhSurface = emitter === "mixed" ? roomLoad.totalW * ufhShare : roomLoad.totalW;
    var loadWm2OnUfh = effectiveArea > 0 ? loadForUfhSurface / effectiveArea : 0;

    out.enabled = loops > 0;
    out.area = round(ufhArea, 2);
    out.occupiedArea = round(occupied, 2);
    out.effectiveArea = round(effectiveArea, 2);
    out.innerArea = round(innerArea, 2);
    out.outerArea = round(outerArea, 2);
    out.loops = loops;
    out.totalLengthM = round(totalLength, 1);
    out.totalLengthWithWasteM = round(totalLengthWithWaste, 1);
    out.loopLengthM = round(loopLength, 1);
    out.baseLengthM = round(baseLen, 1);
    out.heatW = round(ufhHeatW, 1);
    out.flowTotalLMin = round(flowTotal, 2);
    out.flowPerLoopLMin = round(flowPerLoop, 2);
    out.stepMm = round(innerStepMm, 0);
    out.outerStepMm = round(outerStepMm, 0);
    out.pipeDiameter = room.pipeDiameter || "16x2";
    out.zoneMode = zoneMode;
    out.zoneWidthM = round(zoneWidth, 2);
    out.outerWallLengthM = round(outerWallLength, 2);
    out.perimeterM = round(perimeter, 2);
    out.doorWidthM = round(doorWidth, 2);
    out.edgeTapeM = round(edgeTape, 1);
    out.clipsQty = clipsQty;
    out.maxLoopLengthM = loopMax;
    out.closeToLimit = loops > 0 && loopLength > loopMax * 0.9;
    out.needsWarning = loops > 0 && loopLength > loopMax;
    out.needsEmitterSupport = emitter === "ufh" && loadWm2OnUfh > num(constants.ufhHighLoadThresholdWm2, 95);

    return out;
  }

  function selectRadiator(requiredW, project, catalog, constants) {
    if (requiredW <= 0) {
      return {
        qty: 0,
        model: "-",
        unitPowerW: 0,
        totalPowerW: 0,
        unitPrice: 0,
        laborPrice: 0,
      };
    }
    var factor = constants.radiatorProfileFactor[project.radiatorProfile] || 1;
    var list = catalog.radiators.slice().sort(function (a, b) {
      return a.basePowerW - b.basePowerW;
    });

    var i;
    for (i = 0; i < list.length; i++) {
      var p = list[i].basePowerW * factor;
      if (p >= requiredW) {
        return {
          qty: 1,
          model: list[i].model,
          unitPowerW: round(p, 0),
          totalPowerW: round(p, 0),
          unitPrice: list[i].unitPrice,
          laborPrice: list[i].laborPrice,
        };
      }
    }

    var last = list[list.length - 1];
    var lastPower = last.basePowerW * factor;
    var qty = Math.max(1, ceil(requiredW / lastPower));
    return {
      qty: qty,
      model: last.model,
      unitPowerW: round(lastPower, 0),
      totalPowerW: round(lastPower * qty, 0),
      unitPrice: last.unitPrice,
      laborPrice: last.laborPrice,
    };
  }

  function calculateRadiator(room, project, roomLoad, catalog, constants, ufh) {
    var emitter = room.emitter;
    var needsRad = emitter === "radiator" || emitter === "mixed";
    if (!needsRad) {
      return {
        enabled: false,
        requiredW: 0,
        selected: selectRadiator(0, project, catalog, constants),
      };
    }
    var share = 1;
    if (emitter === "mixed") {
      var ufhShare = clamp(num(room.ufhShare, constants.mixedUfhShareDefault), 10, 90) / 100;
      share = ufh && ufh.enabled ? 1 - ufhShare : 1;
    }
    var requiredW = roomLoad.totalW * share;
    var selected = selectRadiator(requiredW, project, catalog, constants);
    return {
      enabled: true,
      requiredW: round(requiredW, 1),
      selected: selected,
      coveragePct: requiredW > 0 ? round((selected.totalPowerW / requiredW) * 100, 1) : 0,
    };
  }

  function roomResult(room, project, mode, catalog, constants) {
    var load = mode === "engineer" ? engineerRoomLoadW(room, project, constants) : quickRoomLoadW(room, project, constants);
    var ufh = calculateUfh(room, project, load, constants);
    var radiator = calculateRadiator(room, project, load, catalog, constants, ufh);
    return {
      room: room,
      load: load,
      ufh: ufh,
      radiator: radiator,
    };
  }

  function ensureRoomIdentity(room, index, seenIds) {
    var safeRoom = {};
    var src = room || {};
    Object.keys(src).forEach(function (key) {
      safeRoom[key] = src[key];
    });
    var rawId = src && src.id != null ? String(src.id).trim() : "";
    var baseId = rawId || "room_" + (index + 1);
    var finalId = baseId;
    if (seenIds && seenIds[finalId]) {
      var suffix = seenIds[finalId] + 1;
      while (seenIds[baseId + "_" + suffix]) {
        suffix += 1;
      }
      finalId = baseId + "_" + suffix;
      seenIds[baseId] = suffix;
    }
    if (seenIds) seenIds[finalId] = 1;
    safeRoom.id = finalId;
    return safeRoom;
  }

  function systemResult(project, rooms, constants) {
    var totalW = 0;
    var totalUfhW = 0;
    var totalRadW = 0;
    var totalUfhLength = 0;
    var totalUfhLengthWithWaste = 0;
    var totalLoops = 0;
    var totalUfhArea = 0;
    var totalEdgeTape = 0;
    var totalClips = 0;
    var radiatorCount = 0;
    var loopsNearLimit = 0;
    var loopsOverLimit = 0;

    rooms.forEach(function (r) {
      totalW += r.load.totalW;
      if (r.ufh.enabled) {
        totalUfhW += r.ufh.heatW;
        totalUfhLength += r.ufh.totalLengthM;
        totalUfhLengthWithWaste += r.ufh.totalLengthWithWasteM;
        totalLoops += r.ufh.loops;
        totalUfhArea += r.ufh.area;
        totalEdgeTape += r.ufh.edgeTapeM;
        totalClips += r.ufh.clipsQty;
        if (r.ufh.closeToLimit) loopsNearLimit += 1;
        if (r.ufh.needsWarning) loopsOverLimit += 1;
      }
      if (r.radiator.enabled) {
        totalRadW += r.radiator.requiredW;
        radiatorCount += r.radiator.selected.qty;
      }
    });

    var totalKw = totalW / 1000;
    var sourceKw = totalKw * (1 + num(project.reservePercent, 15) / 100);
    var radDelta = Math.max(1, num(project.radiatorDeltaT, 15));
    var ufhDelta = Math.max(1, num(project.ufhDeltaT, 7));
    var radiatorFlowLMin = totalRadW / (radDelta * 60);
    var ufhFlowLMin = totalUfhW / (ufhDelta * 60);

    var waterVolumeL =
      totalUfhLength * constants.ufhPipeVolumePerMeterL +
      radiatorCount * constants.radiatorWaterVolumeL +
      constants.baseSystemWaterVolumeL;

    var expansionL = Math.max(8, ceil(waterVolumeL * 0.12));
    var occupants = clamp(num(project.occupants, 3), 1, 20);
    var dhwL = occupants * constants.dhwLitersPerPerson.def;
    var dhwMinL = occupants * constants.dhwLitersPerPerson.min;
    var dhwMaxL = occupants * constants.dhwLitersPerPerson.max;

    var mixingType = "-";
    if (totalUfhArea > 0) {
      if (totalUfhArea <= 40 && totalLoops <= 2) {
        mixingType = "Kompakts mezgls (līdz ~40m², 2 kontūras)";
      } else {
        mixingType = "Standarta mezgls (kolektors + sūknis + maisīšana)";
      }
    }

    var pipeRollLengthM = Math.max(1, num(constants.ufhPipeRollLengthM, 200));
    var pipeNeededM = Math.max(0, totalUfhLengthWithWaste);
    var pipeRolls200 = pipeNeededM > 0 ? ceil(pipeNeededM / pipeRollLengthM) : 0;
    var pipePurchasedM = pipeRolls200 * pipeRollLengthM;
    var pipeLeftoverM = Math.max(0, pipePurchasedM - pipeNeededM);

    return {
      totalW: round(totalW, 1),
      totalKw: round(totalKw, 2),
      sourceKw: round(sourceKw, 2),
      radiatorFlowLMin: round(radiatorFlowLMin, 2),
      ufhFlowLMin: round(ufhFlowLMin, 2),
      totalUfhLengthM: round(totalUfhLength, 1),
      totalUfhLengthWithWasteM: round(totalUfhLengthWithWaste, 1),
      totalLoops: totalLoops,
      totalUfhArea: round(totalUfhArea, 2),
      totalEdgeTapeM: round(totalEdgeTape, 1),
      totalClipsQty: totalClips,
      loopsNearLimit: loopsNearLimit,
      loopsOverLimit: loopsOverLimit,
      radiatorCount: radiatorCount,
      waterVolumeL: round(waterVolumeL, 1),
      expansionL: expansionL,
      dhwL: round(dhwL, 0),
      dhwMinL: round(dhwMinL, 0),
      dhwMaxL: round(dhwMaxL, 0),
      mixingType: mixingType,
      pipeNeededM: round(pipeNeededM, 1),
      pipeRollLengthM: pipeRollLengthM,
      pipeRolls200: pipeRolls200,
      pipePurchasedM: round(pipePurchasedM, 1),
      pipeLeftoverM: round(pipeLeftoverM, 1),
    };
  }

  function lineItem(id, name, unit, qty, materialPrice, laborPrice) {
    var q = round(Math.max(0, qty), 3);
    return {
      id: id,
      name: name,
      unit: unit,
      qty: q,
      materialUnit: materialPrice,
      laborUnit: laborPrice,
      materialTotal: round(q * materialPrice, 2),
      laborTotal: round(q * laborPrice, 2),
    };
  }

  function normalizeBomRows(rows) {
    var seen = {};
    return rows.map(function (row, idx) {
      var safe = row || {};
      var fallbackId = "row_" + (idx + 1);
      var rawId = safe.id != null ? String(safe.id).trim() : "";
      var baseId = rawId || fallbackId;

      if (seen[baseId]) {
        seen[baseId] += 1;
        baseId = baseId + "_" + seen[baseId];
      } else {
        seen[baseId] = 1;
      }

      var qty = Math.max(0, num(safe.qty, 0));
      var materialUnit = num(safe.materialUnit, 0);
      var laborUnit = num(safe.laborUnit, 0);

      return {
        id: baseId,
        rowIndex: idx,
        name: safe.name || baseId,
        unit: safe.unit || "gab",
        qty: round(qty, 3),
        materialUnit: materialUnit,
        laborUnit: laborUnit,
        materialTotal: round(qty * materialUnit, 2),
        laborTotal: round(qty * laborUnit, 2),
      };
    });
  }

  function buildBom(project, roomResults, system, catalog, constants) {
    var c = catalog.components;
    var rows = [];

    if (system.totalUfhLengthM > 0) {
      var ufhPipeMaterialUnit = c.ufhPipeRoll200 ? 0 : c.ufhPipe16.materialPrice;
      rows.push(lineItem("ufh_pipe", c.ufhPipe16.name, c.ufhPipe16.unit, system.pipeNeededM, ufhPipeMaterialUnit, c.ufhPipe16.laborPrice));
      if (c.ufhPipeRoll200) {
        rows.push(lineItem("ufh_pipe_roll_200", c.ufhPipeRoll200.name, c.ufhPipeRoll200.unit, system.pipeRolls200, c.ufhPipeRoll200.materialPrice, c.ufhPipeRoll200.laborPrice));
      }
      rows.push(lineItem("collector_set", c.ufhCollector8.name, c.ufhCollector8.unit, ceil(system.totalLoops / 8), c.ufhCollector8.materialPrice, c.ufhCollector8.laborPrice));
      rows.push(lineItem("cabinet", c.manifoldCabinet.name, c.manifoldCabinet.unit, ceil(system.totalLoops / 8), c.manifoldCabinet.materialPrice, c.manifoldCabinet.laborPrice));

      if (system.totalUfhArea <= 40 && system.totalLoops <= 2) {
        rows.push(lineItem("mixing_compact", c.ufhMixCompact.name, c.ufhMixCompact.unit, 1, c.ufhMixCompact.materialPrice, c.ufhMixCompact.laborPrice));
      } else {
        rows.push(lineItem("mixing_std", c.ufhMixStandard.name, c.ufhMixStandard.unit, 1, c.ufhMixStandard.materialPrice, c.ufhMixStandard.laborPrice));
      }

      rows.push(lineItem("actuators", c.actuator.name, c.actuator.unit, system.totalLoops, c.actuator.materialPrice, c.actuator.laborPrice));
      rows.push(lineItem("edge_tape", c.edgeTape.name, c.edgeTape.unit, system.totalEdgeTapeM * 1.05, c.edgeTape.materialPrice, c.edgeTape.laborPrice));
      if (c.ufhClipPack200) {
        rows.push(
          lineItem(
            "clips_pack",
            c.ufhClipPack200.name,
            c.ufhClipPack200.unit,
            ceil(system.totalClipsQty / Math.max(1, num(constants.ufhClipPackQty, 200))),
            c.ufhClipPack200.materialPrice,
            c.ufhClipPack200.laborPrice
          )
        );
      }
      rows.push(lineItem("insulation", c.insulationLayer.name, c.insulationLayer.unit, system.totalUfhArea * 1.03, c.insulationLayer.materialPrice, c.insulationLayer.laborPrice));
      if (c.vaporBarrier) {
        rows.push(lineItem("vapor_barrier", c.vaporBarrier.name, c.vaporBarrier.unit, system.totalUfhArea * 1.03, c.vaporBarrier.materialPrice, c.vaporBarrier.laborPrice));
      }
    }

    var radiatorUnits = 0;
    roomResults.forEach(function (r) {
      if (r.radiator.enabled && r.radiator.selected.qty > 0) {
        radiatorUnits += r.radiator.selected.qty;
        rows.push(lineItem(
          "radiator_" + r.room.id,
          "Radiators " + r.radiator.selected.model + " (" + r.room.name + ")",
          "gab",
          r.radiator.selected.qty,
          r.radiator.selected.unitPrice,
          r.radiator.selected.laborPrice
        ));
      }
    });

    if (radiatorUnits > 0) {
      rows.push(lineItem("rad_valves", c.radiatorValveSet.name, c.radiatorValveSet.unit, radiatorUnits, c.radiatorValveSet.materialPrice, c.radiatorValveSet.laborPrice));
    }

    var heatedRooms = roomResults.filter(function (r) {
      return r.ufh.enabled || r.radiator.enabled;
    }).length;

    rows.push(lineItem("thermostats", c.thermostat.name, c.thermostat.unit, heatedRooms, c.thermostat.materialPrice, c.thermostat.laborPrice));
    rows.push(lineItem("balancing", c.balancingValveSet.name, c.balancingValveSet.unit, 1, c.balancingValveSet.materialPrice, c.balancingValveSet.laborPrice));
    rows.push(lineItem("air_vent", c.airVentDrainSet.name, c.airVentDrainSet.unit, 1, c.airVentDrainSet.materialPrice, c.airVentDrainSet.laborPrice));
    rows.push(lineItem("fixing", c.fixingKit.name, c.fixingKit.unit, 1, c.fixingKit.materialPrice, c.fixingKit.laborPrice));
    rows.push(lineItem("source_conn", c.sourceConnectionSet.name, c.sourceConnectionSet.unit, 1, c.sourceConnectionSet.materialPrice, c.sourceConnectionSet.laborPrice));

    rows = normalizeBomRows(rows);

    var materialFactor = Math.max(0.2, num(project.materialFactor, 1));
    var laborFactor = Math.max(0.2, num(project.laborFactor, 1));

    var material = rows.reduce(function (s, row) {
      return s + row.materialTotal;
    }, 0) * materialFactor;
    var labor = rows.reduce(function (s, row) {
      return s + row.laborTotal;
    }, 0) * laborFactor;

    var overhead = (material + labor) * (num(project.overheadPercent, 8) / 100);
    var reserve = (material + labor + overhead) * (num(project.reservePercent, 15) / 100);
    var grand = material + labor + overhead + reserve;

    return {
      rows: rows,
      totals: {
        material: round(material, 2),
        labor: round(labor, 2),
        overhead: round(overhead, 2),
        reserve: round(reserve, 2),
        grand: round(grand, 2),
      },
    };
  }

  function calculate(payload) {
    var mode = payload.mode === "engineer" ? "engineer" : "quick";
    var project = payload.project;
    var rooms = payload.rooms || [];
    var constants = window.HeatConstants;
    var catalog = window.HeatCatalog;

    var seenRoomIds = {};
    var roomResults = rooms.map(function (room, index) {
      var safeRoom = ensureRoomIdentity(room, index, seenRoomIds);
      var result = roomResult(safeRoom, project, mode, catalog, constants);
      result.roomIndex = index;
      return result;
    });

    var system = systemResult(project, roomResults, constants);
    var bom = buildBom(project, roomResults, system, catalog, constants);

    return {
      mode: mode,
      generatedAt: new Date().toISOString(),
      project: project,
      rooms: roomResults,
      system: system,
      bom: bom,
    };
  }

  window.HeatCalculator = {
    calculate: calculate,
    round: round,
    num: num,
  };
})();
