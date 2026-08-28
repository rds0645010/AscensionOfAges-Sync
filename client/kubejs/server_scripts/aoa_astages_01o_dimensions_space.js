// AoA KubeJS: aoa_astages_01o_dimensions_space.js
// Machine Staging Contract pass (2026-05-28) -- dimensions/bosses final sweep.
//
// The dimension/boss mods are content/gear/decor (gated by files 01/03/08 + ores 06);
// this sweep found only TWO functional-machine leaks worth gating:
//   stellaris space-infrastructure machines -> Otherworldly. BYPASS: craftable from
//     common c:ingots/steel in IR/Gilded, but stellaris dims/rocket/ores are all
//     already Otherworldly, so the whole space-machine + cable/pipe/tank/bank network
//     belongs at Otherworldly (kept coherent as one space-tier family).
//   astral_dimension supreme_altar + astranite_cauldron -> Gilded (gap-fill; the rest
//     of astral_dimension is already gilded-locked; ceiling = gilded, no softlock).
// All other swept mods (aether/undergarden/deeperdarker/nether mods/eternal_starlight/
// cataclysm/BOMD/fdbosses/macabre/unusualend/reliquified_artifacts/alchemists_garden/
// blastcraft) = INFO, no functional machine apparatus to gate. enderscape not installed.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages dim] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages dim] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    ["otherworldly", "stellaris:coal_generator", "block_item"],
    ["otherworldly", "stellaris:diesel_generator", "block_item"],
    ["otherworldly", "stellaris:radioactive_generator", "block_item"],
    ["otherworldly", "stellaris:solar_panel", "block_item"],
    ["otherworldly", "stellaris:fuel_refinery", "block_item"],
    ["otherworldly", "stellaris:oxygen_distributor", "block_item"],
    ["otherworldly", "stellaris:water_separator", "block_item"],
    ["otherworldly", "stellaris:vacuumator", "block_item"],
    ["otherworldly", "stellaris:pumpjack", "block_item"],
    ["otherworldly", "stellaris:water_pump", "block_item"],
    ["otherworldly", "stellaris:upgrade_station", "block_item"],
    ["otherworldly", "stellaris:rocket_station", "block_item"],
    ["otherworldly", "stellaris:rocket_launch_pad", "block_item"],
    ["otherworldly", "stellaris:antenna", "block_item"],
    ["otherworldly", "stellaris:cable", "block_item"],
    ["otherworldly", "stellaris:cable_t2", "block_item"],
    ["otherworldly", "stellaris:cable_t3", "block_item"],
    ["otherworldly", "stellaris:pipe_t1", "block_item"],
    ["otherworldly", "stellaris:pipe_t2", "block_item"],
    ["otherworldly", "stellaris:pipe_t3", "block_item"],
    ["otherworldly", "stellaris:t1_tank", "block_item"],
    ["otherworldly", "stellaris:t2_tank", "block_item"],
    ["otherworldly", "stellaris:t3_tank", "block_item"],
    ["otherworldly", "stellaris:t4_tank", "block_item"],
    ["otherworldly", "stellaris:t1_bank", "block_item"],
    ["otherworldly", "stellaris:t2_bank", "block_item"],
    ["otherworldly", "stellaris:t3_bank", "block_item"],
    ["otherworldly", "stellaris:t4_bank", "block_item"],
    ["gilded_age", "astral_dimension:supreme_altar", "block_item"],
    ["gilded_age", "astral_dimension:astranite_cauldron", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
