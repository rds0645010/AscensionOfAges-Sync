// AoA KubeJS: aoa_recipes_capstone_convergence.js
// "Convergence capstones": a chapter's signature required machine is re-authored so
// its recipe pulls one DISTINCTIVE part from each major mod in that chapter -- the
// chapter's mods literally converge into one object, so every mod feels load-bearing.
// (Generalizes the 2-mod weaves + ir_native_capstone_recipes.js to the whole chapter.)
//
// Only applied where the red-team confirmed it fits WITHOUT grind/softlock:
//   * output has exactly ONE native crafting_shaped route (clean remove),
//   * 4-6 DISTINCTIVE parts (no bare staples), every part age <= the chapter's age,
//   * no cycle (no part's craft chain needs the output),
//   * the output is a real required quest item that stays craftable.
// Chapters that are single-mod-dominant, boss/dimension capstones, or whose parts
// are atomic+/machine-only were intentionally SKIPPED (see docs).
//
// Verified 2026-06-05 vs jar lang (existence), .aoa_recipe_audit/locks.json +
// craft_age.json (ages), and native-recipe dumps (single route).
//
// CONSTRAINT (clause-11 re-cut, 2026-07-26): no convergence here may leave its output
// sole-routed through an Immersive Petroleum item -- IP is retired from the oil spine, so the
// two petrochemical slots below run on TFMG feedstock and are guarded so remove + re-add
// no-op together on any instance without the TFMG jar.

ServerEvents.recipes(event => {

  // --- C1  ir_power_motion_and_grid -> Power-Grid Convergence  [IR] ----------
  // powergrid:circuit_design_table is the power chapter's design gateway. Re-author
  // it as the convergence of every IR power mod: Create C&A tesla coil, Create
  // Electro Energetics alternator rotor, Electrodynamics combustion chamber, Oritech generator,
  // IE LV capacitor -- around the native Create electron tube + schematic identity.
  // (All parts age <= 3.)
  event.remove({ output: 'powergrid:circuit_design_table' })
  event.shaped('powergrid:circuit_design_table', [
    'TES',
    'AOB',
    'GPP'
  ], {
    T: 'createaddition:tesla_coil',
    E: 'create:electron_tube',
    S: 'create:empty_schematic',
    A: 'electroenergetics:alternator_rotor',
    O: 'oritech:basic_generator_block',
    B: 'electrodynamics:combustionchamber',
    G: 'immersiveengineering:capacitor_lv',
    P: '#minecraft:planks'
  }).id('aoa:capstone_convergence/power_grid')

  // --- C2  ir_create_industrial_addons -> Diesel-Refinery Convergence  [IR] --
  // CONSTRAINT: this output must stay craftable with the Immersive Petroleum jar ABSENT.
  // createdieselgenerators:distillation_controller is the Create-oil chapter's
  // refinery brain (native yields 4 -- preserved). Convergence of the Create-family
  // addons: New Age magnet, Ore Excavation vein finder, Crafts & Additions large
  // connector, PneumaticCraft refinery, TFMG bitumen -- around the native Create
  // precision mechanism + andesite identity.
  // Feedstock re-cut 2026-07-26 from immersivepetroleum:bitumen to tfmg:bitumen
  // (VERIFIED-JAR tfmg-1.2.0 data/tfmg/recipe/compacting/bitumen.json: create:compacting,
  // heat_requirement "heated", 1000 mB tfmg:heavy_oil). Effective age
  // industrial_revolution, matching this output's own industrial_revolution lock.
  // OPEN (pre-dates this re-cut, NOT closed here): create_new_age:layered_magnet is
  // gilded_age-locked (aoa_astages_01g_create_family.js:103) while this output is
  // industrial_revolution-locked, so the weave still holds an age inversion. The output
  // carries zero quest task asks pack-wide, so nothing is gated on it; R-A2 op 4 proposes
  // retiring the whole block with the CDG retirement. Owner ruling owed.
  // Guarded on Item.exists so the remove and the re-add no-op together without the TFMG jar.
  if (typeof Item !== 'undefined' && Item.exists('tfmg:bitumen')) {
    event.remove({ output: 'createdieselgenerators:distillation_controller' })
    event.shaped(Item.of('createdieselgenerators:distillation_controller', 4), [
      'MVL',
      'RPB',
      'AIA'
    ], {
      M: 'create_new_age:layered_magnet',
      V: 'createoreexcavation:vein_finder',
      L: 'createaddition:large_connector',
      R: 'pneumaticcraft:refinery',
      P: 'create:precision_mechanism',
      B: 'tfmg:bitumen',
      A: 'create:andesite_alloy',
      I: '#c:plates/iron'
    }).id('aoa:capstone_convergence/diesel_refinery')
  }

  // --- C4  g5_empire_of_iron -> Heavy-Industry Convergence  [GILDED] ---------
  // CONSTRAINT: centrifuge is a required Gilded ask, so it must stay craftable with the
  // Immersive Petroleum jar ABSENT.
  // modern_industrialization:centrifuge is the Empire of Iron chapter's signature
  // machine. Convergence of Gilded heavy industry: Actually Additions advanced coil,
  // BlastCraft blast compressor, Industrialization Overdrive pyrolyse oven, Immersive
  // Engineering heavy engineering, TFMG asphalt mixture -- around the native MI machine
  // hull + motor identity. (All parts age <= 4; no atomic+ ingredient.)
  // Feedstock re-cut 2026-07-26 from immersivepetroleum:asphalt to tfmg:asphalt_mixture
  // (VERIFIED-JAR tfmg-1.2.0 data/tfmg/recipe/mixing/asphalt_mixture.json: create:mixing
  // sand + tfmg:bitumen + gravel -> 16; slag variant -> 32). Effective age
  // industrial_revolution, legal in this gilded_age chapter. Guarded on Item.exists so the
  // remove and the re-add no-op together without the TFMG jar.
  if (typeof Item !== 'undefined' && Item.exists('tfmg:asphalt_mixture')) {
    event.remove({ output: 'modern_industrialization:centrifuge' })
    event.shaped('modern_industrialization:centrifuge', [
      'ABP',
      'EHS',
      'LHL'
    ], {
      A: 'actuallyadditions:advanced_coil',
      B: 'blastcraft:blastcompressor',
      P: 'industrialization_overdrive:pyrolyse_oven',
      E: 'immersiveengineering:heavy_engineering',
      H: 'modern_industrialization:basic_machine_hull',
      S: 'tfmg:asphalt_mixture',
      L: 'modern_industrialization:large_motor'
    }).id('aoa:capstone_convergence/heavy_industry')
  }

})
