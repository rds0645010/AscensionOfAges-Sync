// Neo Vitae cross-mod recipe weaves (2026-06-26)
// Schemas extracted from native NV recipes (recon-verified). Two weaves REPLACE a single
// native route (NV1, NV2); three are intentional ADDITIVE optional alternates (NV3, NV4, Clibano).
ServerEvents.recipes(event => {

  // ── NV1 — Spirit-Fed Sentient Forge (Malum -> NV) ───────────────────────────
  // REPLACE the single native sentient_axe transform: now also requires a Malum Arcane Spirit.
  // (hellfire_forge_transform schema: transformInput, catalysts[], drain, minDrain, output{count,id})
  event.remove({ output: 'neovitae:sentient_axe' })
  event.custom({
    type: 'neovitae:hellfire_forge_transform',
    transformInput: { item: 'minecraft:iron_axe' },
    catalysts: [ { item: 'neovitae:spiritus_gem_petty' }, { item: 'malum:arcane_spirit' } ],
    drain: 0.0,
    minDrain: 0.0,
    output: { count: 1, id: 'neovitae:sentient_axe' }
  }).id('aoa:neovitae/sentient_axe_spiritbound')

  // ── NV2 — Calcined Salt Catalyst (Theurgy -> NV) ────────────────────────────
  // REPLACE the single native raw_spiritus_catalyst forge recipe: swap the filler potato for a
  // Theurgy alchemical salt. Native inputs were [c:crops/nether_wart, neovitae:tau_oil,
  // c:dusts/sulfur, minecraft:potato]; drain 20 / minDrain 400.
  // (hellfire_forge schema: inputs[], drain, minDrain, output{count,id})
  event.remove({ output: 'neovitae:raw_spiritus_catalyst' })
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { tag: 'c:crops/nether_wart' },
      { item: 'neovitae:tau_oil' },
      { tag: 'c:dusts/sulfur' },
      { tag: 'theurgy:alchemical_salts' }
    ],
    drain: 20.0,
    minDrain: 400.0,
    output: { count: 1, id: 'neovitae:raw_spiritus_catalyst' }
  }).id('aoa:neovitae/raw_spiritus_catalyst_salted')

  // ── NV3 — Otherworld Bloom Flask (Occultism -> NV) ──────────────────────────
  // ADDITIVE (alchemy_flask's only native route is an ara_vitae_recipe on a DIFFERENT machine,
  // so this alchemy-table route is genuinely new, not a duplicate -> no remove needed).
  // (alchemytable schema: "input" is a singular key with an array value, output{count,id}, syphon, ticks, upgradeLevel)
  event.custom({
    type: 'neovitae:alchemytable',
    input: [
      { item: 'neovitae:simple_catalyst' },
      { item: 'occultism:otherworld_essence' }
    ],
    output: { count: 1, id: 'neovitae:alchemy_flask' },
    syphon: 500,
    ticks: 200,
    upgradeLevel: 1
  }).id('aoa:neovitae/otherworld_bloom_flask')

  // ── NV4 — Stellar Tempering (F&A -> NV) ─────────────────────────────────────
  // Route F&A's apex Eternal Stella through NV's own forge-upgrade system.
  // (hellfire_forge_upgrade schema: catalysts[], drain, minDrain. NO output/transformInput —
  //  the upgrade applies to the item held in the forge; effect identity is the recipe.)
  // VERIFY in Task 6.4: NV's only native upgrade is `blood_mending`; the upgrade EFFECT may be
  //  keyed by recipe id in NV's Java, so a custom-id upgrade could no-op. It is HARMLESS/optional
  //  if so (no bypass, no progression impact). If it does nothing in-game, convert to a
  //  `neovitae:hellfire_forge` recipe consuming eternal_stella into an NV item instead.
  event.custom({
    type: 'neovitae:hellfire_forge_upgrade',
    catalysts: [
      { item: 'forbidden_arcanus:eternal_stella' },
      { item: 'neovitae:tabula_robur' },
      { item: 'neovitae:hellforged_dust' }
    ],
    drain: 200.0,
    minDrain: 400.0
  }).id('aoa:neovitae/stellar_tempering')

  // ── Clibano -> Athanor companion (F&A -> NV) ────────────────────────────────
  // ADDITIVE optional alternate source for weak_blood_shard: F&A Clibano arcane_crystal_dust
  // transmuted in NV's Athanor. INTENTIONALLY NOT removing the native routes (strong_tau +
  // master_blood_orb): weak_blood_shard is a CORE NV item and removing its native routes would
  // wrongly make NV's spine depend on optional F&A content. Recon-verified age-aligned (both
  // Renaissance: weak_blood_shard locked @ the_renaissance; arcane_crystal_dust is a Ren ore
  // product) -> this is an optional bonus source, NOT a gate bypass.
  // (athanor schema: inputs[], guaranteed_outputs[], chance_outputs[], tool{tag}; fluid optional)
  event.custom({
    type: 'neovitae:athanor',
    inputs: [ { item: 'forbidden_arcanus:arcane_crystal_dust' } ],
    guaranteed_outputs: [ { count: 1, id: 'neovitae:weak_blood_shard' } ],
    chance_outputs: [],
    tool: { tag: 'neovitae:athanor_tool/cutting_fluids' }
  }).id('aoa:neovitae/clibano_arcane_to_bloodshard')

})
