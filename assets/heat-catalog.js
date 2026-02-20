(function () {
  window.HeatCatalog = {
    radiators: [
      { model: "T22-600x600", basePowerW: 1050, unitPrice: 110, laborPrice: 26 },
      { model: "T22-600x800", basePowerW: 1400, unitPrice: 132, laborPrice: 30 },
      { model: "T22-600x1000", basePowerW: 1760, unitPrice: 155, laborPrice: 34 },
      { model: "T22-600x1200", basePowerW: 2120, unitPrice: 182, laborPrice: 37 },
      { model: "T22-600x1400", basePowerW: 2470, unitPrice: 208, laborPrice: 40 },
      { model: "T22-600x1600", basePowerW: 2820, unitPrice: 236, laborPrice: 43 },
      { model: "T33-600x1200", basePowerW: 2920, unitPrice: 295, laborPrice: 45 },
      { model: "T33-600x1600", basePowerW: 3890, unitPrice: 348, laborPrice: 48 },
    ],
    components: {
      ufhPipe16: { name: "UFH caurule 16x2", unit: "m", materialPrice: 1.45, laborPrice: 0.35 },
      ufhPipeRoll200: { name: "UFH caurules rullis 200m", unit: "gab", materialPrice: 290, laborPrice: 0 },
      ufhCollector8: { name: "Kolektors 8 atzariem", unit: "gab", materialPrice: 240, laborPrice: 65 },
      ufhMixCompact: { name: "Maisīšanas mezgls (kompakts, līdz ~40m²)", unit: "gab", materialPrice: 285, laborPrice: 85 },
      ufhMixStandard: { name: "Maisīšanas mezgls (standarta)", unit: "gab", materialPrice: 460, laborPrice: 125 },
      thermostat: { name: "Telpas termostats", unit: "gab", materialPrice: 46, laborPrice: 18 },
      actuator: { name: "Servopiedziņa kolektoram", unit: "gab", materialPrice: 24, laborPrice: 7 },
      ufhClipPack200: { name: "UFH skavu paka (200 gab)", unit: "paka", materialPrice: 24, laborPrice: 4 },
      balancingValveSet: { name: "Noslēgarmatūra un balansēšanas komplekts", unit: "kompl", materialPrice: 120, laborPrice: 65 },
      airVentDrainSet: { name: "Atgaisotājs + drenāžas mezgls", unit: "kompl", materialPrice: 44, laborPrice: 20 },
      edgeTape: { name: "Malu lenta", unit: "m", materialPrice: 0.58, laborPrice: 0.18 },
      vaporBarrier: { name: "Hidro/PE plēve UFH", unit: "m²", materialPrice: 0.95, laborPrice: 0.25 },
      fixingKit: { name: "Stiprinājumi un montāžas materiāli", unit: "kompl", materialPrice: 95, laborPrice: 40 },
      insulationLayer: { name: "Siltumizolācijas slānis UFH", unit: "m²", materialPrice: 8.9, laborPrice: 2.4 },
      radiatorValveSet: { name: "Radiatora termovārsta komplekts", unit: "gab", materialPrice: 31, laborPrice: 10 },
      manifoldCabinet: { name: "Kolektora skapis", unit: "gab", materialPrice: 145, laborPrice: 38 },
      sourceConnectionSet: { name: "Avota pieslēguma mezgls", unit: "kompl", materialPrice: 180, laborPrice: 85 },
    },
    heatSources: {
      gas_boiler: { label: "Gāzes katls" },
      pellet_boiler: { label: "Granulu katls" },
      heat_pump: { label: "Siltumsūknis" },
      district: { label: "Centrālā siltumapgāde" },
    },
  };
})();
