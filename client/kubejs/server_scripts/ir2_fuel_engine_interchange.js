// ============================================================================
//  IR2 Fuel ENGINE/REFINERY Interchange  (LEVEL 2 — runtime compat)
// ============================================================================
//
//  Goal (user 2026-06-05): "the oil mods should be used interchangeably with
//  one owner." Build ONE petroleum spine — any mod's crude feeds any mod's
//  refinery; any mod's diesel/fuel burns in any mod's engine. Owner of the
//  crude = TFMG since 2026-07-16 (it was Immersive Petroleum when this file was
//  written; IP is retired from the spine, see aoa_oil_single_source.js).
//
//  This is the LEVEL 2 work that ir2_fuel_tag_unification.js explicitly left
//  out of scope. It writes to the LIVE, machine-read tags.
//
//  ── CRITICAL FINDING (verified 2026-06-05) ──────────────────────────────
//  Every petroleum machine in the pack reads the SINGULAR common tags
//  (`c:diesel`, `c:crude_oil`, ...). There are ZERO references anywhere to the
//  PLURAL `c:fluids/diesel` form that ir2_fuel_tag_unification.js used to
//  populate, so those Level-1 fluid lines were DEAD (read by nothing) and were
//  deleted from that file on 2026-07-26. The live fix is to add the missing
//  members to the SINGULAR tags, which is what this file does. (ir2's
//  `c:buckets/*` item tags and its `c:oil`/`c:biofuel` adds ARE live and remain.)
//
//  Native singular-tag membership today (verified from jar tag files):
//    c:crude_oil  = chemicalscience, createdieselgenerators, modern_industrialization, pneumaticcraft
//                   -> MISSING immersivepetroleum (it lives only in neoforge:crude_oil)
//    c:diesel     = chemicalscience, createdieselgenerators, modern_industrialization, oritech, pneumaticcraft
//                   -> MISSING immersivepetroleum
//  So today the OWNER's crude is rejected by every other refinery, and IP's own
//  distillation (reads neoforge:crude_oil) rejects everyone else. This file
//  closes both directions. No fluid/fuel-tag is AStages-locked (gating stays on
//  the machines), so widening these tags cannot bypass progression.
//
//  Consumers that light up automatically once the tags are populated (verified
//  additive, tag-fed): IE diesel_generator (generator_fuel reads c:diesel @322),
//  PneumaticCraft fuel_quality (reads c:diesel/gasoline/kerosene/lpg/biodiesel),
//  CDG diesel engines (fuel_type reads #c:diesel/#c:gasoline/#c:biodiesel),
//  PneumaticCraft refinery + CDG distillation + ChemSci fractionating_column
//  (read c:crude_oil), Oritech refinery (reads #c:oil — handled by ir2).
//
//  CONSTRAINT (2026-07-26, oil gaps iii + iv): two mods ship a fuel under a spelling
//  nobody else uses (ChemicalScience c:naphta, Modern Industrialization c:plant_oil).
//  Both are bridged at the END of the fluid handler below by MEMBER addition in both
//  directions — never by nesting one tag inside the other, which is the cycle shape that
//  can make TagLoader drop both keys.
// ============================================================================

ServerEvents.tags('fluid', event => {
  // ---- CRUDE OIL: one barrel, every refinery -------------------------------
  // TFMG (Create: The Factory Must Grow) is the crude OWNER as of 2026-07-16 and ships its
  // own SINGULAR c: fluid-tag memberships in-jar (c:crude_oil / c:diesel / c:naphtha /
  // c:gasoline / c:kerosene / c:lpg / c:heavy_oil all contain the tfmg: fluid + its flowing
  // form, verified 2026-07-17), so the singular c:-tag spine picks TFMG fluids up
  // automatically -- no add needed for those. The ONE membership TFMG does NOT ship is
  // Oritech's non-prefixed c:oil alias; add TFMG crude there so the Oritech refinery
  // (reads #c:oil) accepts it. Guarded on the TFMG jar in the same idiom as
  // ir2_fuel_tag_unification.js so the line is a clean no-op without it.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('tfmg')) {
    event.add('c:oil', 'tfmg:crude_oil')
  }
  // Bring Oritech still_oil into the c: spine (TFMG-fed via aoa_oil_single_source).
  // RETIRED-CONSUMER (2026-07-16 TFMG program): IP is retired from the oil spine. Its crude
  // membership stays harmless while the jar is installed (grandfathered rigs) but is no
  // longer load-bearing.
  event.add('c:crude_oil', 'immersivepetroleum:crudeoil')   // RETIRED-CONSUMER (IP)
  event.add('c:crude_oil', 'oritech:still_oil')
  // Reverse direction: widen IP's own input tag so the IP Distillation Tower & Hydrotreater
  // (which read neoforge:crude_oil) accept every mod's crude.
  // RETIRED-CONSUMER (2026-07-16 TFMG program): this whole neoforge:crude_oil block exists
  // only to feed IP's retired machines; kept (harmless) while the IP jar is installed.
  event.add('neoforge:crude_oil', 'createdieselgenerators:crude_oil')   // RETIRED-CONSUMER (IP)
  event.add('neoforge:crude_oil', 'pneumaticcraft:oil')                 // RETIRED-CONSUMER (IP)
  event.add('neoforge:crude_oil', 'modern_industrialization:crude_oil') // RETIRED-CONSUMER (IP)
  event.add('neoforge:crude_oil', 'chemicalscience:crudeoil')           // RETIRED-CONSUMER (IP)
  event.add('neoforge:crude_oil', 'oritech:still_oil')                  // RETIRED-CONSUMER (IP)

  // ---- DIESEL: one fuel, every engine --------------------------------------
  // Add IP diesel (+ its sulfurous distillation intermediate) to c:diesel so
  // the IE generator / PNC fuel_quality / CDG engines all burn IP diesel.
  // RETIRED-CONSUMER (2026-07-16 TFMG program): IP diesel memberships stay harmless while
  // the jar is installed. tfmg:diesel is already in c:diesel via TFMG's own jar tag, so no
  // TFMG add is needed here.
  event.add('c:diesel', 'immersivepetroleum:diesel')          // RETIRED-CONSUMER (IP)
  event.add('c:diesel', 'immersivepetroleum:diesel_sulfur')   // RETIRED-CONSUMER (IP)
  // Reverse: widen IP's neoforge:diesel so the IP Gas Generator burns shared diesel.
  // RETIRED-CONSUMER (2026-07-16): this neoforge:diesel block only serves the retired IP
  // Gas Generator; kept (harmless) while the IP jar is installed. Per plan 13 §4 no TFMG
  // fluid is widened into neoforge:* (the IP consumer that needed it is retired).
  event.add('neoforge:diesel', 'createdieselgenerators:diesel')     // RETIRED-CONSUMER (IP)
  event.add('neoforge:diesel', 'pneumaticcraft:diesel')            // RETIRED-CONSUMER (IP)
  event.add('neoforge:diesel', 'modern_industrialization:diesel')  // RETIRED-CONSUMER (IP)
  event.add('neoforge:diesel', 'chemicalscience:diesel')           // RETIRED-CONSUMER (IP)
  event.add('neoforge:diesel', 'oritech:still_diesel')             // RETIRED-CONSUMER (IP)

  // ---- GASOLINE / KEROSENE / LPG / NAPHTHA / LUBRICANT ----------------------
  // Add the OWNER's fractions into the common tags so CDG/PNC consumers accept
  // them. (Kept fuel-type-faithful: we do NOT force gasoline into diesel-only
  // engines — only unify each fuel's cross-mod variants.)
  // TFMG ships its own c:gasoline / c:kerosene / c:lpg / c:naphtha memberships in-jar, so
  // no TFMG add is needed here. IP fraction adds stay as harmless RETIRED-CONSUMER lines.
  event.add('c:gasoline', 'immersivepetroleum:gasoline')      // RETIRED-CONSUMER (IP)
  event.add('c:kerosene', 'immersivepetroleum:kerosene')      // RETIRED-CONSUMER (IP)
  event.add('neoforge:kerosene', 'pneumaticcraft:kerosene')   // RETIRED-CONSUMER (IP gas-gen kerosene consumer)
  event.add('c:lpg', 'immersivepetroleum:petroleum_gas')      // RETIRED-CONSUMER (IP): petroleum_gas == LPG-equivalent
  event.add('c:lpg', 'chemicalscience:lpg')
  event.add('c:naphtha', 'immersivepetroleum:naphtha')        // RETIRED-CONSUMER (IP)
  event.add('c:lubricant', 'immersivepetroleum:lubricant')    // RETIRED-CONSUMER (IP)
  event.add('neoforge:lubricant', 'pneumaticcraft:lubricant')          // RETIRED-CONSUMER (IP auto_lubricator consumer)
  event.add('neoforge:lubricant', 'modern_industrialization:lubricant') // RETIRED-CONSUMER (IP auto_lubricator consumer)
  event.add('neoforge:lubricant', 'chemicalscience:lubricant')          // RETIRED-CONSUMER (IP auto_lubricator consumer)

  // ---- NAPHTHA SPELLING BRIDGE: c:naphta <-> c:naphtha  (oil gap iv) -------
  // CONSTRAINT: the required Gilded catalytic reformer must run on a naphtha the pack can
  // actually produce at its age.
  // ChemicalScience ships its naphtha under a MISSPELLED key: chemicalscience-3.1.2
  // data/c/tags/fluid/naphta.json = ["chemicalscience:naphta"] (one "h"), and its two
  // catalytic_reformer recipes -- recipe/fluiditem2fluid/catalytic_reformer/
  // naphta_reformer_ptal.json and naphta_reformer_rhal.json -- read {"tag": "c:naphta"}.
  // The pack's own naphtha lives in the correctly spelled c:naphtha (tfmg:naphtha +
  // tfmg:flowing_naphtha, modern_industrialization:naphtha, oritech:still_naphtha,
  // immersivepetroleum:naphtha -- all read from each jar's own tag file). So the Gilded
  // reformer the questbook tells the player to build sat inert on TFMG feedstock.
  // Bridge by MEMBER addition in both directions, never by nesting one tag inside the other:
  // a mutual "#" reference is the cycle shape that can make TagLoader drop both tags (the
  // c:lubricant / c:lubrication_oil case). Widening is bypass-safe -- no fuel fluid carries
  // an AStages lock anywhere in aoa_astages_*.js, gating lives on the machines. The other
  // two c:naphta consumers, ChemSci's flamethrower fuel and the Electrodynamics combustion
  // generator, are both industrial-tier and simply start accepting the shared fraction.
  // Every add is guarded on its own jar so each line is a clean no-op without it.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('chemicalscience')) {
    if (Platform.isLoaded('tfmg')) {
      event.add('c:naphta', 'tfmg:naphtha')
      event.add('c:naphta', 'tfmg:flowing_naphtha')
    }
    if (Platform.isLoaded('modern_industrialization')) {
      event.add('c:naphta', 'modern_industrialization:naphtha')
    }
    if (Platform.isLoaded('oritech')) {
      event.add('c:naphta', 'oritech:still_naphtha')
    }
    if (Platform.isLoaded('immersivepetroleum')) {
      event.add('c:naphta', 'immersivepetroleum:naphtha')   // RETIRED-CONSUMER (IP)
    }
    // Reverse: ChemSci's own naphtha finally reaches the correctly spelled tag, so it can
    // feed the AoA W1 reformer weave and W5 thermo-plant weave in aoa_oil_spine_weaves.js
    // (both read c:naphtha) plus TFMG's tag-driven engine cylinder fuel selection.
    event.add('c:naphtha', 'chemicalscience:naphta')
  }

  // ---- PLANT OIL SPELLING BRIDGE: c:plant_oil <-> c:plantoil  (oil gap iii) -
  // CONSTRAINT: MI plant oil and everyone else's plant oil must feed each other's machines.
  // Modern Industrialization ships data/c/tags/fluid/plant_oil.json (underscore) holding
  // only modern_industrialization:plant_oil, while IE, PneumaticCraft, Create Diesel
  // Generators, Create Crafts & Additions and Electro Energetics all populate the
  // no-underscore c:plantoil. Consumers of c:plantoil that light up for MI plant oil:
  // IE refinery/biodiesel + bottling/ersatz_leather + drill-lube upgrade, PNC
  // fluid_mixer/biodiesel and two thermo_plant recipes, CDG mixing/biodiesel and its
  // fuel_type/plantoil engine fuel, createaddition's eight biomass mixing recipes, and
  // Electro Energetics transformer oil. c:plant_oil currently has no consumer at all
  // (MI recipes are id-pinned), so the reverse direction is forward-compat only.
  // Same rule as above: member additions, no nested tag references, no AStages fluid lock
  // exists on any of these, each add guarded on its own jar.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('modern_industrialization')) {
    if (Platform.isLoaded('immersiveengineering')) {
      event.add('c:plant_oil', 'immersiveengineering:plantoil')
    }
    if (Platform.isLoaded('pneumaticcraft')) {
      event.add('c:plant_oil', 'pneumaticcraft:vegetable_oil')
    }
    if (Platform.isLoaded('createdieselgenerators')) {
      event.add('c:plant_oil', 'createdieselgenerators:plant_oil')
      event.add('c:plant_oil', 'createdieselgenerators:flowing_plant_oil')
    }
    if (Platform.isLoaded('electroenergetics')) {
      event.add('c:plant_oil', 'electroenergetics:plant_oil')
      event.add('c:plant_oil', 'electroenergetics:flowing_plant_oil')
    }
    if (Platform.isLoaded('createaddition')) {
      event.add('c:plant_oil', 'createaddition:seed_oil')
      event.add('c:plant_oil', 'createaddition:flowing_seed_oil')
    }
    // Reverse: MI plant oil joins the tag every other mod's machines actually read.
    event.add('c:plantoil', 'modern_industrialization:plant_oil')
  }
})
