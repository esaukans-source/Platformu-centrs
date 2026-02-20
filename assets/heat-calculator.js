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

  function engineerRoomLoadW(room, project) {
    var dt = num(project.thetaInt, 21) - num(project.thetaExt, -12);
    var area = num(room.area, 0);
    var h = num(room.height, 2.7);
    var vol = area * h;

    var qt =
      num(room.wallArea, 0) * num(room.wallU, 0) * dt +
      num(room.windowArea, 0) * num(room.windowU, 0) * dt +
      num(room.floorArea, 0) * num(room.floorU, 0) * dt +
      num(room.ceilingArea, 0) * num(room.ceilingU, 0) * dt;

    var qv = 0.34 * num(room.infiltrationN, 0.45) * vol * dt;
    var total = qt + qv;

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

  function calculateUfh(room, project, roomLoad, constants) {
    var emitter = room.emitter;
    var needsUfh = emitter === "ufh" || emitter === "mixed";
    if (!needsUfh) {
      return {
        enabled: false,
        area: 0,
        loops: 0,
        totalLengthM: 0,
        loopLengthM: 0,
        heatW: 0,
        flowTotalLMin: 0,
        flowPerLoopLMin: 0,
      };
    }

    var ufhShare = emitter === "mixed" ? clamp(num(room.ufhShare, constants.mixedUfhShareDefault), 10, 90) / 100 : 1;
    var ufhArea = clamp(num(room.ufhArea, num(room.area, 0)), 0, num(room.area, 0));
    var step = String(Math.round(num(room.stepMm, 150)));
    var mPerM2 = constants.stepToMetersPerM2[step] || constants.stepToMetersPerM2[150];
    var baseLen = ufhArea * mPerM2;
    var dist = num(room.collectorDistance, 0);
    var totalWithLeads = baseLen + 2 * dist;
    var loops = Math.max(1, ceil(totalWithLeads / constants.ufhMaxLoopLengthM));
    var loopLength = baseLen / loops + 2 * dist;
    var totalLength = loopLength * loops;

    var ufhHeatW = roomLoad.totalW * ufhShare;
    var deltaT = Math.max(1, num(project.ufhDeltaT, 7));
    var flowTotal = ufhHeatW / (deltaT * 60);
    var flowPerLoop = flowTotal / loops;

    return {
      enabled: true,
      area: round(ufhArea, 2),
      loops: loops,
      totalLengthM: round(totalLength, 1),
      loopLengthM: round(loopLength, 1),
      heatW: round(ufhHeatW, 1),
      flowTotalLMin: round(flowTotal, 2),
      flowPerLoopLMin: round(flowPerLoop, 2),
      stepMm: Number(step),
      pipeDiameter: room.pipeDiameter || "16x2",
      needsWarning: loopLength > constants.ufhMaxLoopLengthM,
    };
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

  function calculateRadiator(room, project, roomLoad, catalog, constants) {
    var emitter = room.emitter;
    var needsRad = emitter === "radiator" || emitter === "mixed";
    if (!needsRad) {
      return {
        enabled: false,
        requiredW: 0,
        selected: selectRadiator(0, project, catalog, constants),
      };
    }
    var share = emitter === "mixed" ? 1 - clamp(num(room.ufhShare, constants.mixedUfhShareDefault), 10, 90) / 100 : 1;
    var requiredW = roomLoad.totalW * share;
    return {
      enabled: true,
      requiredW: round(requiredW, 1),
      selected: selectRadiator(requiredW, project, catalog, constants),
    };
  }

  function roomResult(room, project, mode, catalog, constants) {
    var load = mode === "engineer" ? engineerRoomLoadW(room, project) : quickRoomLoadW(room, project, constants);
    var ufh = calculateUfh(room, project, load, constants);
    var radiator = calculateRadiator(room, project, load, catalog, constants);
    return {
      room: room,
      load: load,
      ufh: ufh,
      radiator: radiator,
    };
  }

  function systemResult(project, rooms, constants) {
    var totalW = 0;
    var totalUfhW = 0;
    var totalRadW = 0;
    var totalUfhLength = 0;
    var totalLoops = 0;
    var totalUfhArea = 0;
    var radiatorCount = 0;

    rooms.forEach(function (r) {
      totalW += r.load.totalW;
      if (r.ufh.enabled) {
        totalUfhW += r.ufh.heatW;
        totalUfhLength += r.ufh.totalLengthM;
        totalLoops += r.ufh.loops;
        totalUfhArea += r.ufh.area;
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
    var radiatorFlowLMin = (totalRadW / (radDelta * 60));
    var ufhFlowLMin = (totalUfhW / (ufhDelta * 60));

    var waterVolumeL =
      totalUfhLength * constants.ufhPipeVolumePerMeterL +
      radiatorCount * constants.radiatorWaterVolumeL +
      constants.baseSystemWaterVolumeL;

    var expansionL = Math.max(8, ceil(waterVolumeL * 0.12));
    var dhwL = clamp(num(project.occupants, 3), 1, 20) * constants.dhwLitersPerPerson.def;

    var mixingType = "-";
    if (totalUfhArea > 0) {
      if (totalUfhArea <= 40 && totalLoops <= 2) {
        mixingType = "Kompakts mezgls (līdz ~40m², 2 kontūras)";
      } else {
        mixingType = "Standarta mezgls (kolektors + sūknis + maisīšana)";
      }
    }

    return {
      totalW: round(totalW, 1),
      totalKw: round(totalKw, 2),
      sourceKw: round(sourceKw, 2),
      radiatorFlowLMin: round(radiatorFlowLMin, 2),
      ufhFlowLMin: round(ufhFlowLMin, 2),
      totalUfhLengthM: round(totalUfhLength, 1),
      totalLoops: totalLoops,
      totalUfhArea: round(totalUfhArea, 2),
      radiatorCount: radiatorCount,
      waterVolumeL: round(waterVolumeL, 1),
      expansionL: expansionL,
      dhwL: round(dhwL, 0),
      mixingType: mixingType,
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

  function buildBom(project, roomResults, system, catalog, constants) {
    var c = catalog.components;
    var wasteFactor = 1 + num(project.wastePercent, 5) / 100;
    var rows = [];

    if (system.totalUfhLengthM > 0) {
      rows.push(lineItem("ufh_pipe", c.ufhPipe16.name, c.ufhPipe16.unit, system.totalUfhLengthM * wasteFactor, c.ufhPipe16.materialPrice, c.ufhPipe16.laborPrice));
      rows.push(lineItem("collector_set", c.ufhCollector8.name, c.ufhCollector8.unit, ceil(system.totalLoops / 8), c.ufhCollector8.materialPrice, c.ufhCollector8.laborPrice));
      rows.push(lineItem("cabinet", c.manifoldCabinet.name, c.manifoldCabinet.unit, ceil(system.totalLoops / 8), c.manifoldCabinet.materialPrice, c.manifoldCabinet.laborPrice));

      if (system.totalUfhArea <= 40 && system.totalLoops <= 2) {
        rows.push(lineItem("mixing_compact", c.ufhMixCompact.name, c.ufhMixCompact.unit, 1, c.ufhMixCompact.materialPrice, c.ufhMixCompact.laborPrice));
      } else {
        rows.push(lineItem("mixing_std", c.ufhMixStandard.name, c.ufhMixStandard.unit, 1, c.ufhMixStandard.materialPrice, c.ufhMixStandard.laborPrice));
      }

      rows.push(lineItem("actuators", c.actuator.name, c.actuator.unit, system.totalLoops, c.actuator.materialPrice, c.actuator.laborPrice));
      rows.push(lineItem("edge_tape", c.edgeTape.name, c.edgeTape.unit, system.totalUfhArea * 0.6, c.edgeTape.materialPrice, c.edgeTape.laborPrice));
      rows.push(lineItem("insulation", c.insulationLayer.name, c.insulationLayer.unit, system.totalUfhArea * 1.03, c.insulationLayer.materialPrice, c.insulationLayer.laborPrice));
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

    var roomResults = rooms.map(function (room) {
      return roomResult(room, project, mode, catalog, constants);
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
