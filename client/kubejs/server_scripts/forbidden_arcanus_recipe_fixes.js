// AoA KubeJS: Forbidden Arcanus recipe clarity fixes.
// Restores the missing reverse path for the speck/dust pair used by the Renaissance quest chain.

ServerEvents.recipes(event => {
  // F&A Black Hole hazard neutralize (2026-06-26): remove the accidental item-deleter feedstock.
  event.remove({ output: 'forbidden_arcanus:corrupti_dust' })

  event.shapeless(Item.of('forbidden_arcanus:arcane_crystal_dust_speck', 9), [
    'forbidden_arcanus:arcane_crystal_dust'
  ]).id('aoa:forbidden_arcanus/arcane_crystal_dust_to_specks')
})
