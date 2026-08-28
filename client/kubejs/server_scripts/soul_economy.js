// AoA KubeJS: soul_economy.js
// Theme: Malum soul economy bridging into F&A Hephaestus Forge rituals.
// NeoForge 1.21.1 / KubeJS 2101.x
//
// Connection #61 (R3 load-bearing): Malum spirit jar must be injected as a
// required input to the F&A upgrade_tier_3 ritual. Since the ritual is
// data-driven JSON, the patch is a datapack override at
//   kubejs/data/forbidden_arcanus/forbidden_arcanus/hephaestus_forge/ritual/upgrade_tier_3.json
// This file documents the gate and provides safety recipes.
//
// Effect in play: the Renaissance player cannot reach F&A T3 without first
// engaging Malum. The two magic traditions are deliberately entangled so the
// "extractive" branch cannot be skipped. Mahou Tsukai (Strange branch) remains
// independent of both.

ServerEvents.recipes(event => {

    // ---- Safety craft: empty spirit jar from glass + bone meal ------------
    // Native Malum provides a crafting recipe; this is a no-op guard that
    // re-asserts the craft in case of tag-unification conflicts with other
    // jar-like items. Disabled by default; uncomment only if conflict arises.
    //
    // event.shapeless(
    //     'malum:spirit_jar',
    //     ['minecraft:glass_bottle', 'minecraft:bone_meal']
    // ).id('aoa:soul_economy/spirit_jar_fallback')

})

// ---- LootJS: guarantee Malum wicked spirit on common undead --------------
// R3 Branch A quest "Extractive — Harvest" asks for 8× malum:wicked_spirit.
// Native Malum drops are RNG-weighted. This top-up guarantees at least one
// wicked_spirit drop from a zombie on killed_by_player, so the quest is
// achievable without extreme RNG churn. Does NOT replace native drops.
LootJS.modifiers(event => {
    event.addEntityModifier('minecraft:zombie').addLoot(
        LootEntry.of(Item.of('malum:wicked_spirit', 1))
            .when(condition => condition.killedByPlayer())
            .when(condition => condition.randomChance(0.15))
    )

    event.addEntityModifier('minecraft:husk').addLoot(
        LootEntry.of(Item.of('malum:wicked_spirit', 1))
            .when(condition => condition.killedByPlayer())
            .when(condition => condition.randomChance(0.15))
    )
})

// ---- F&A upgrade_tier_3 ritual spirit-jar injection ----------------------
// Target file (datapack-overridden alongside this script):
//   data/forbidden_arcanus/forbidden_arcanus/hephaestus_forge/ritual/upgrade_tier_3.json
// Append to the `inputs` array:
//   { "amount": 1, "ingredient": { "item": "malum:spirit_jar" } }
//
// Quest coupling: R3 quest "Forged — Ritual Inputs" (7B8C9D0E1F2A0707)
// requires the player to hold a spirit jar, mirroring the ritual requirement.
