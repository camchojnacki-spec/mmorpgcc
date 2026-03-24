# THRESHOLD: DESIGN HANDOFF MAP

### Everything a Development Team Needs to Build This Game

---

## LOCKED DECISIONS

Before the document inventory, here is every creative and architectural decision that has been resolved. These are canonical. No further discussion needed.

| Decision | Resolution |
|----------|-----------|
| Game title | **Threshold** |
| Genre label | **Strand Fiction** |
| Planet | **Earth** (grounded, no fantasy name) |
| Setting | Post-Kowloon Earth. Authoritarian Directorate controls threading technology. Underground resistance (The Unbound) seeks to democratize it. |
| Core premise | All "magic" is biological — third-strand DNA augmentation unlocking epigenetically silenced gene clusters |
| Tone | Blade Runner noir + 1984 authoritarianism + Expanse pragmatism + Culture-series scale ambition |
| Classes (v0.1) | **Sentinel** (tank/somatic), **Catalyst** (DPS/cortical), **Conduit** (support/sympathetic) |
| Attributes (8) | Soma, Reflex, Vigor, Cortex, Resolve, Acuity, Presence, Phlux |
| Skills | 26 skills, 78 abilities across 3 threshold tiers (5/15/30) |
| Level cap (v0.1) | **30** (all three ability thresholds available) |
| Combat model | Cooldown-based real-time, 1.5s GCD, 20Hz server tick, tab-target |
| Synergy system | Universal Resonance buffer (5 categories, 4-slot rolling buffer, emergent loops) |
| Backgrounds (5) | Sublevel Resident, Lapsed Clerk, Street Medic, Salvage Runner, Disgraced Academic |
| Character creation | All players are Threaded (threading occurs during creation) |
| Races (v0.1) | Baseline and Threaded (human variants, not fantasy species) |
| Solo/Group | Solo-viable for most content, some group-required instances |
| PvP | **Deferred post-v0.1.** Guild-based when implemented (not narrative-faction-based). |
| Gear mod slots | **Sequences** (Kowloon cluster fragments embedded in equipment) |
| Crafting professions | **11 total** (6 from architecture renamed to theme + 5 from skill system) |
| Narrative factions | Directorate vs. Unbound (dual-axis Standing/Suspicion). The Null reserved as NPC/narrative faction. |
| Civic status tiers | Standard, Conditional, Authorized, Suspended |
| Tech stack | Phaser 3 + Colyseus + PostgreSQL + Redis + TypeScript monorepo |
| Instance model | Town hub + instanced dungeons (no persistent open world) |
| Asset pipeline | Flux.1 Dev + LoRA, ComfyUI, 6-layer sprite compositing |

---

## DOCUMENT INVENTORY

Every document needed for a complete development handoff, organized into four tiers: Design (the vision), Specification (the details), Content (the data), and Reference (the context).

### STATUS KEY
- **COMPLETE** — Written, reviewed, locked
- **DRAFT** — Written, needs revision or integration
- **NEEDED** — Not yet created
- **DEFERRED** — Designed later, not required for v0.1

---

### TIER 1: DESIGN DOCUMENTS
*These describe what the game is and why it works. A developer reads these to understand the vision.*

| # | Document | Status | Description | Dependencies |
|---|----------|--------|-------------|-------------|
| D1 | World Bible | **COMPLETE** | Narrative foundation, factions, zones, terminology, event hooks, in-universe fiction | None |
| D2 | Character Systems v2 | **COMPLETE** | Attributes, classes (Sentinel/Catalyst/Conduit), 26 skills with 78 abilities, affinity mappings | D1 |
| D3 | Synergy Systems | **COMPLETE** | Resonance buffer, Paired/Triad/Spectrum states, interaction chains, Phlux mechanics, build archetypes | D2 |
| D4 | Game Systems | **COMPLETE** | Backgrounds, derived stat formulas, combat loop spec, death penalties | D2, D3 |
| D5 | Design Analysis | **COMPLETE** | Feasibility audit, game theory assessment, coherence check, gap analysis | D1-D4, Architecture Spec |
| D6 | Architecture Spec v4 | **COMPLETE** | Technical framework, platform decisions, Colyseus rooms, asset pipeline, sprint plan | External |

---

### TIER 2: SPECIFICATION DOCUMENTS
*These describe exactly how each system works at implementation level. A developer reads these to know what to build.*

| # | Document | Status | Description | Blocks |
|---|----------|--------|-------------|--------|
| S1 | v0.1 Content Scope Lock | **NEEDED** | Which skills/abilities are available per class at levels 1-30, XP curve values, starting gear stats, attribute point pools, level-by-level progression timeline | All YAML content |
| S2 | Combat Specification | **DRAFT** | GCD, ability queuing, damage formulas, threat/aggro, CC diminishing returns, auto-attack — partially covered in D4, needs dedicated spec | Sprint 3 |
| S3 | Enemy Design Framework | **NEEDED** | Enemy archetypes, difficulty tiers (normal/elite/champion/boss), ability categories enemies use, scaling formulas, how enemies interact with Resonance system | Sprint 3, Instance design |
| S4 | Instance Design: The Pale | **NEEDED** | First instance template — environment theme, enemy roster, encounter pacing, boss encounter design, loot tables, environmental storytelling, narrative integration | S3 |
| S5 | Town Hub Specification | **NEEDED** | NPC roster and functions, spatial layout, vendor areas, instance board, faction contacts, social spaces, how the town reflects world events | Sprint 2 |
| S6 | Crafting System Specification | **NEEDED** | 11 professions with thematic names, resource system (5 quality attributes), assembly/experimentation/finishing phases, schematic unlock progression, Sequences (mod slot) integration | Sprint 4+ |
| S7 | Equipment & Sequences System | **NEEDED** | Equipment slot structure, rarity tiers, stat generation, Sequence slot rules, how Sequences reduce affinity multipliers, crafted vs. dropped gear relationship | S6 |
| S8 | Faction Standing & Suspicion | **NEEDED** | Action-to-standing conversion tables, threshold tiers and unlock gates, decay mechanics, Double Agent states, civic status interaction, NPC disposition system | Quest design |
| S9 | Quest System & Story Structure | **NEEDED** | Main story arc structure, side quest templates, background quest chains (5), daily/weekly repeatable structure, how quests integrate with faction standing, narrative event hooks | S8 |
| S10 | Nemesis System (Threshold-specific) | **NEEDED** | How the architecture's Nemesis system maps to Threshold enemies, faction-aligned Nemeses, evolution paths, memory system, how Nemeses interact with faction standing | S3, S8 |
| S11 | Cross-System Interaction Rules | **NEEDED** | Faction → instance access, civic status → economy, Nemesis → faction, crafting → faction, Resonance → environment, the connective tissue that creates emergent storytelling | S6, S7, S8 |
| S12 | Death & Respawn Specification | **DRAFT** | Civic status scaling, Phlux variance, respawn locations, expression degradation risk, group revival mechanics — partially in D4, needs dedicated spec | S2 |
| S13 | Passive Tree Architecture | **DEFERRED** | Node layout, starting positions per class, keystone design with conflict tags, crafting-focused regions, tree size (200-400 nodes) — design now, implement post-v0.1 | D2 |
| S14 | Alternate Advancement Design | **DEFERRED** | AA categories, XP slider, class-specific AAs — design now, implement post-cap | S13 |
| S15 | Lore Fragment System | **DEFERRED** | Collectible story pieces within instances, meta-progression for Explorers, Recurrence Signal revelation path | S4, S9 |
| S16 | Event System Architecture | **DEFERRED** | How admin-driven events modify instance parameters, create temporary quests, and resolve — the mechanism for Helix Census, Primer Shortage, Basin Bloom | S9, S11 |

---

### TIER 3: CONTENT FILES
*These are the actual data the engine consumes. YAML files in the content directory structure.*

| # | File(s) | Status | Description | Depends On |
|---|---------|--------|-------------|-----------|
| C1 | `content/attributes/attributes.yaml` | **NEEDED** | 8 attributes with display names, descriptions, base values, scaling rules | S1 |
| C2 | `content/classes/sentinel.yaml`, `catalyst.yaml`, `conduit.yaml` | **NEEDED** | Starting attributes, affinity maps, starting equipment, passive tree start position, class description | S1 |
| C3 | `content/skills/*.yaml` (26 files) | **NEEDED** | Per-skill: category, tier, prerequisites, description, 3 ability unlocks with thresholds, affinity per class | S1 |
| C4 | `content/backgrounds/*.yaml` (5 files) | **NEEDED** | Per-background: description, mechanical bonus, starting knowledge, quest chain reference | S1 |
| C5 | `content/combat/derived_stats.yaml` | **NEEDED** | All formulas from D4 in machine-readable format | S1, S2 |
| C6 | `content/combat/resonance.yaml` | **NEEDED** | Resonance state definitions — Dual, Paired, Triad, Spectrum triggers and effects | S2 |
| C7 | `content/combat/interactions.yaml` | **NEEDED** | Interaction chain definitions — trigger conditions, windows, effects | S2 |
| C8 | `content/combat/phlux_effects.yaml` | **NEEDED** | Phlux threshold effects — Echoes, Phantom Pairs, Mutations, Cascade Events | S2 |
| C9 | `content/enemies/*.yaml` | **NEEDED** | Enemy templates — stats, abilities, loot tables, Nemesis promotion rules | S3 |
| C10 | `content/instances/the_pale.yaml` | **NEEDED** | Instance template — room types, encounter tables, boss definition, environmental parameters | S4 |
| C11 | `content/town/npcs.yaml` | **NEEDED** | NPC definitions — names, positions, functions, dialogue references, faction alignment | S5 |
| C12 | `content/crafting/professions.yaml` | **NEEDED** | 11 professions — names, descriptions, skill requirements, schematic lists | S6 |
| C13 | `content/crafting/schematics/*.yaml` | **NEEDED** | Crafting recipes — inputs, quality weights, experimentation parameters | S6 |
| C14 | `content/equipment/sequences.yaml` | **NEEDED** | Sequence definitions — types, affinity reduction values, slot compatibility | S7 |
| C15 | `content/factions/standings.yaml` | **NEEDED** | Action-to-standing tables, threshold definitions, decay rates | S8 |
| C16 | `content/quests/*.yaml` | **NEEDED** | Quest definitions — objectives, rewards, faction impacts, narrative text | S9 |
| C17 | `content/loot/tables/*.yaml` | **NEEDED** | Loot table definitions — per-enemy, per-boss, per-difficulty tier | S3, S7 |

---

### TIER 4: REFERENCE DOCUMENTS
*These provide context, consistency, and creative direction. Not consumed by the engine but essential for the team.*

| # | Document | Status | Description |
|---|----------|--------|-------------|
| R1 | Terminology Dictionary | **NEEDED** | Consolidated glossary of all Threshold-specific terms (Threading, Expressions, Phlux, Sequences, Hoogsteen, etc.) with in-universe and mechanical definitions |
| R2 | Art Direction Brief | **NEEDED** | Visual tone, color palettes per zone, UI aesthetic, character silhouette guidelines, sprite style targets — drives LoRA training |
| R3 | Environmental Storytelling Guidelines | **NEEDED** | How instances tell stories without NPCs — object placement, readable terminals, visual cues, contextual details |
| R4 | Naming Conventions | **NEEDED** | Rules for naming items, enemies, NPCs, locations, abilities — maintains thematic consistency as content scales |
| R5 | Balance Targets | **NEEDED** | TTK (time-to-kill) targets per encounter type, DPS/HPS/TPS benchmarks per class, Resonance bonus caps, solo vs. group scaling ratios |
| R6 | Audio Direction Brief | **DEFERRED** | Sound design aesthetic, music tone, ambient audio guidelines — audio is post-v0.1 per architecture spec |

---

## BUILD ORDER

The documents above have dependencies. Here is the order in which they should be created, organized by what unblocks the most downstream work.

### PHASE 1: Foundation Lock (Unblocks all content creation)
```
S1: v0.1 Content Scope Lock
 ├── C1: attributes.yaml
 ├── C2: class yamls (3)
 ├── C3: skill yamls (26)
 ├── C4: background yamls (5)
 └── C5: derived_stats.yaml
```
**What this produces:** The complete character creation and progression data. A developer can implement character creation, the skill system, and attribute/stat calculations with these files alone.

### PHASE 2: Combat Implementation (Unblocks Sprint 3)
```
S2: Combat Specification (expand from D4 draft)
 ├── C6: resonance.yaml
 ├── C7: interactions.yaml
 ├── C8: phlux_effects.yaml
 └── S12: Death & Respawn Specification
```
**What this produces:** The complete combat system data. Combined with Phase 1, a developer can implement the full combat loop including Resonance, interactions, resource management, and death/respawn.

### PHASE 3: World Population (Unblocks Sprint 2-3)
```
S5: Town Hub Specification
 ├── C11: npcs.yaml
 │
S3: Enemy Design Framework
 ├── C9: enemy yamls
 │
S4: Instance Design: The Pale
 ├── C10: the_pale.yaml
 └── C17: loot tables
```
**What this produces:** The first playable world. Town to walk around in, enemies to fight, an instance to run, loot to earn.

### PHASE 4: Economy & Progression (Unblocks Sprint 4-5)
```
S6: Crafting System Specification
 ├── C12: professions.yaml
 ├── C13: schematic yamls
 │
S7: Equipment & Sequences System
 ├── C14: sequences.yaml
 │
S8: Faction Standing & Suspicion
 ├── C15: standings.yaml
 │
S9: Quest System & Story Structure
 ├── C16: quest yamls
 │
S10: Nemesis System
S11: Cross-System Interaction Rules
```
**What this produces:** The living game. Crafting economy, faction dynamics, quest content, Nemesis encounters, and the cross-system interactions that make the world feel alive.

### PHASE 5: Reference & Polish
```
R1: Terminology Dictionary
R2: Art Direction Brief
R3: Environmental Storytelling Guidelines
R4: Naming Conventions
R5: Balance Targets
```
**What this produces:** The consistency layer. Ensures that as content scales, everything maintains thematic and mechanical coherence.

### PHASE 6: Deferred Design (Design now, implement later)
```
S13: Passive Tree Architecture
S14: Alternate Advancement Design
S15: Lore Fragment System
S16: Event System Architecture
R6: Audio Direction Brief
```
**What this produces:** The roadmap. These systems are designed during v0.1 development but implemented in subsequent releases. Designing them now ensures that v0.1 decisions don't create incompatibilities with future systems.

---

## THE COMPLETE HANDOFF PACKAGE

When all documents are complete, the handoff to a development team consists of:

```
threshold/
├── design/
│   ├── D1_world_bible.md                    ✅ COMPLETE
│   ├── D2_character_systems_v2.md           ✅ COMPLETE
│   ├── D3_synergy_systems.md                ✅ COMPLETE
│   ├── D4_game_systems.md                   ✅ COMPLETE
│   ├── D5_design_analysis.md                ✅ COMPLETE
│   └── D6_architecture_spec_v4.docx         ✅ COMPLETE
│
├── specifications/
│   ├── S1_content_scope_lock.md             ⬜ NEEDED
│   ├── S2_combat_specification.md           ⬜ NEEDED (expand from D4)
│   ├── S3_enemy_design_framework.md         ⬜ NEEDED
│   ├── S4_instance_the_pale.md              ⬜ NEEDED
│   ├── S5_town_hub_specification.md         ⬜ NEEDED
│   ├── S6_crafting_system.md                ⬜ NEEDED
│   ├── S7_equipment_sequences.md            ⬜ NEEDED
│   ├── S8_faction_standing.md               ⬜ NEEDED
│   ├── S9_quest_system.md                   ⬜ NEEDED
│   ├── S10_nemesis_system.md                ⬜ NEEDED
│   ├── S11_cross_system_interactions.md     ⬜ NEEDED
│   ├── S12_death_respawn.md                 ⬜ NEEDED (expand from D4)
│   ├── S13_passive_tree.md                  ⬜ DEFERRED
│   ├── S14_alternate_advancement.md         ⬜ DEFERRED
│   ├── S15_lore_fragments.md                ⬜ DEFERRED
│   └── S16_event_system.md                  ⬜ DEFERRED
│
├── content/
│   ├── attributes/
│   │   └── attributes.yaml                  ⬜ NEEDED
│   ├── classes/
│   │   ├── sentinel.yaml                    ⬜ NEEDED
│   │   ├── catalyst.yaml                    ⬜ NEEDED
│   │   └── conduit.yaml                     ⬜ NEEDED
│   ├── skills/
│   │   └── (26 yaml files)                  ⬜ NEEDED
│   ├── backgrounds/
│   │   └── (5 yaml files)                   ⬜ NEEDED
│   ├── combat/
│   │   ├── derived_stats.yaml               ⬜ NEEDED
│   │   ├── resonance.yaml                   ⬜ NEEDED
│   │   ├── interactions.yaml                ⬜ NEEDED
│   │   └── phlux_effects.yaml               ⬜ NEEDED
│   ├── enemies/
│   │   └── (enemy template yamls)           ⬜ NEEDED
│   ├── instances/
│   │   └── the_pale.yaml                    ⬜ NEEDED
│   ├── town/
│   │   └── npcs.yaml                        ⬜ NEEDED
│   ├── crafting/
│   │   ├── professions.yaml                 ⬜ NEEDED
│   │   └── schematics/                      ⬜ NEEDED
│   ├── equipment/
│   │   └── sequences.yaml                   ⬜ NEEDED
│   ├── factions/
│   │   └── standings.yaml                   ⬜ NEEDED
│   ├── quests/
│   │   └── (quest yamls)                    ⬜ NEEDED
│   └── loot/
│       └── tables/                          ⬜ NEEDED
│
└── reference/
    ├── R1_terminology_dictionary.md         ⬜ NEEDED
    ├── R2_art_direction_brief.md            ⬜ NEEDED
    ├── R3_environmental_storytelling.md      ⬜ NEEDED
    ├── R4_naming_conventions.md             ⬜ NEEDED
    ├── R5_balance_targets.md                ⬜ NEEDED
    └── R6_audio_direction.md                ⬜ DEFERRED

Status: 6 of 50 documents complete.
```

---

## WHAT TO BUILD NEXT

With PvP deferred and all creative decisions locked, the critical path is:

**Immediate next document: S1 (Content Scope Lock)**

This is the keystone. It converts everything in D2 and D4 from design prose into implementable numbers: XP curve values per skill, level-by-level attribute growth, which abilities each class realistically has at levels 5/10/15/20/25/30, starting gear stat blocks, and the progression pacing that determines how long it takes a player to reach each threshold. Every YAML file depends on this.

**After S1:** Generate all Phase 1 YAML files (C1-C5) in a single batch. These are mechanical translations of locked design decisions into data format. No creative decisions required.

**After Phase 1 YAML:** S3 (Enemy Design Framework), because you can't build instances without enemies, and you can't test combat without things to fight.

Each subsequent phase builds on the last. No phase requires decisions that haven't already been made — every creative question is answered. What remains is specification, quantification, and data generation.
