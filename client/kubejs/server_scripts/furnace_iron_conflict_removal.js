// ============================================================================
//  Iron-ingot furnace conflict removal
// ============================================================================
//
//  Intent:
//    - Regular furnace should do nothing with minecraft:iron_ingot.
//    - Blast furnace should produce overgeared:heated_iron_ingot from
//      minecraft:iron_ingot.
//    - Electrodynamics steel should not be a direct iron-ingot blast shortcut;
//      steel material convergence belongs to normal unification/progression.
//
//  Keep:
//    overgeared:heated_iron_ingot_from_blasting_iron_ingot
//
//  Remove:
//    stellaris:misc/heavy_metal_ingot_from_smelting
//    stellaris:misc/heavy_metal_ingot_from_blasting
//    electrodynamics:blasting/steel_ingot_from_iron_ingot
//
//  Why:
//    These recipes compete for the same furnace/blast-furnace input and make
//    Polymorph load-bearing. Some furnace menus expose recipe selection and
//    some do not, so players can receive Stellaris heavy metal or unified steel
//    instead of Overgeared heated iron.
// ============================================================================

ServerEvents.recipes(event => {
  event.remove({ id: 'stellaris:misc/heavy_metal_ingot_from_smelting' })
  event.remove({ id: 'stellaris:misc/heavy_metal_ingot_from_blasting' })
  event.remove({ id: 'electrodynamics:blasting/steel_ingot_from_iron_ingot' })
})
