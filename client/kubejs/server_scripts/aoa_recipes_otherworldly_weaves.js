// AoA KubeJS: aoa_recipes_otherworldly_weaves.js
// Cross-mod recipe weaves for the OTHERWORLDLY AGE (spacefaring / fusion /
// quantum-logistics age).
//
// W1 -- Stellaris heavy metal via Overgeared heated iron (HARDLOCK FIX,
// 2026-07-02): furnace_iron_conflict_removal.js removed
// stellaris:misc/heavy_metal_ingot_from_smelting and _from_blasting because
// they competed with overgeared:heated_iron_ingot for the iron-ingot furnace
// slot (Polymorph menu ambiguity). That left stellaris:heavy_metal_ingot with
// only circular routes (block<->ingot<->nugget), hardlocking the entire
// Stellaris pre-launch chain (battery, t1_bank, pumpjack_drill, pumpjack,
// oxygen_distributor, rocket_station, rover) and therefore the whole
// Otherworldly rocketry spine.
// Fix: blast Overgeared heated iron ingot (itself the blast product of iron
// ingot -- the exact recipe the cleanup kept) into heavy metal. Different
// input item, so the original furnace conflict cannot recur, and the iron
// economy stays ~1:1 with one extra processing step, which reads as the
// "further-worked iron" the Stellaris lore intends.
// Verified 2026-07-02: stellaris:heavy_metal_ingot in stellaris jar lang;
// overgeared:heated_iron_ingot kept by furnace_iron_conflict_removal.js.

ServerEvents.recipes(event => {
  event.blasting('stellaris:heavy_metal_ingot', 'overgeared:heated_iron_ingot')
    .cookingTime(100)
    .xp(0.7)
    .id('aoa:weaves/otherworldly/heavy_metal_ingot_from_heated_iron_blasting')

  event.smelting('stellaris:heavy_metal_ingot', 'overgeared:heated_iron_ingot')
    .cookingTime(200)
    .xp(0.7)
    .id('aoa:weaves/otherworldly/heavy_metal_ingot_from_heated_iron_smelting')
})
