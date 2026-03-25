# Creative Team Briefs — Content Deliverables

These are three self-contained prompts/briefs. Each can be handed to a designer,
used with an AI agent, or worked through manually. They produce the content
artifacts the engineering pipeline needs to continue building the game.

The game is a 2D isometric browser MMORPG. Desktop-first. Phaser 3 client,
Colyseus server, PostgreSQL database. Hosted on Google Cloud (fully managed PaaS).

**GCP Project:** gen-lang-client-0387848408
**Game Name:** Threshold
**GitHub:** https://github.com/camchojnacki-spec/mmorpgcc

---

## BRIEF 1: Character Foundation YAML Files

**Who:** Game Designer / Creative Director
**Output:** YAML files dropped into `content/` directory
**Blocking:** Sprint 3 (combat system needs real ability definitions)

---

### Context

The engine uses a data-driven architecture. All game content is authored as YAML
files in the `content/` directory, then compiled to JSON at build time. The
engineering team cannot build combat, progression, or class identity without
these files. Placeholder values exist but need to be replaced with real,
balanced, thematically consistent definitions.

The game world is set in a biopunk/science-fiction setting. Humans have been
genetically altered ("Threaded") by a governing body called the Directorate.
Players are individuals whose Thread is unstable, granting them extraordinary
but unpredictable abilities called Expressions. The city is a stratified
megastructure. Society is controlled, surveilled, and divided into civic
status tiers.

### The 8 Core Attributes

These are the biological parameters of a Threaded individual. They are already
named and wired into the engine:

| Key | Name | What It Represents |
|-----|------|--------------------|
| `soma` | Soma | Raw physical force — melee damage, carry weight, inventory capacity |
| `reflex` | Reflex | Neural response speed — crit chance, dodge, attack speed, movement |
| `vigor` | Vigor | Biological durability — HP, stamina, regen, armor, death penalty reduction |
| `cortex` | Cortex | Mental throughput — Expression (spell) damage, Strand resource pool |
| `resolve` | Resolve | Cognitive stability — healing effectiveness, CC resistance, Strand regen |
| `acuity` | Acuity | Sensory fidelity — ranged accuracy, gathering yield, perception, dodge |
| `presence` | Presence | Biosocial influence — vendor prices, faction reputation gains, party buffs |
| `phlux` | Phlux | Phenotypic deviation tolerance — crit multiplier, loot quality, wild procs, death penalty variance |

The engine formulas (already implemented) that consume these:

```
maxHp        = 100 + vigor×15 + soma×5 + level×10
maxStamina   = 80 + vigor×8 + soma×4 + level×6
maxStrand    = 50 + cortex×12 + resolve×3 + level×5
critChance   = 5 + reflex×0.5 + phlux×0.3  (cap 40%)
critMulti    = 150 + phlux×3  (cap 250%)
dodgeChance  = reflex×0.6 + acuity×0.2  (cap 30%)
meleeDmg     = soma×2.0
exprDmg      = cortex×2.5
inventorySlots = 20 + floor(soma/3)
```

Character creation rules (already implemented):
- Base per attribute: 5
- Class bonus total: 8 points distributed by class
- Free points to allocate: 10
- Minimum per attribute: 3
- Maximum per attribute at creation: 18

### Skill Affinity System (5 tiers)

Every skill has an XP cost multiplier based on how close it is to a class's
identity:

| Tier | Multiplier | Meaning |
|------|-----------|---------|
| Native | 0.5× | Core class identity — cheapest to level |
| Aligned | 0.75× | Adjacent to class fantasy |
| Neutral | 1.0× | Default — no advantage or disadvantage |
| Misaligned | 1.5× | Far from class identity — expensive |
| Opposed | 2.0× | Antithetical — very expensive but possible |

Gear items called "Sequences" (Kowloon cluster fragments) can reduce a skill's
affinity tier, making non-native skills cheaper. This is the core of build
diversity — any class CAN learn anything, it just costs more unless you invest
in the right Sequences.

### Ability Unlock Thresholds

Skills are leveled with XP. At certain thresholds, new abilities unlock:
- Level 5: First ability
- Level 15: Second ability
- Level 30: Third ability + optional title reward (e.g., "Bonecutter")

### Expression Categories (Resonance System)

Every ability belongs to one of 5 Expression categories. The last 4 abilities
used fill a "Resonance Buffer" that triggers combo bonuses:

| Category | Role |
|----------|------|
| Strike | Direct damage |
| Sustain | Healing, regen, restore |
| Shield | Prevent, mitigate, absorb |
| Disrupt | CC, debuff, remove |
| Augment | Buff self or allies |

Resonance combos:
- **Dual** (2 same): Strike Tempo, Sustain Flow, Shield Wall, Disrupt Chain, Augment Stack
- **Paired** (2 specific different): Counterflow, Fortification, Pressure, etc.
- **Triad** (3 specific): Vanguard, Warden, Predator, Lifeline, Siege, Flux
- **Full Spectrum** (all 5 in sequence): Massive burst — 30s cooldown

### Combat Resources

- **Stamina**: Physical actions. Regens based on Vigor.
- **Strand**: Expression (spell) actions. Regens based on Cortex.
- **GCD**: 1.5 seconds. Some abilities are off-GCD (reactives, toggles).

### Ability Types

| Type | Behavior |
|------|----------|
| Instant | Fires immediately, triggers GCD |
| Cast | Has a cast time bar, interruptible |
| Channel | Sustained effect over duration, interruptible |
| Reactive | Triggers automatically on condition (e.g., "when hit, 30% chance to...") |
| Toggle | On/off persistent effect, reserves resources while active |
| Passive | Always active once unlocked |

### What I Need You To Produce

**File 1: `content/attributes/attributes.yaml`**

Already exists with placeholder descriptions. Update with rich, thematic
descriptions and confirm the `affects` list for each attribute. Format:

```yaml
attributes:
  - id: soma
    name: Soma
    description: "One-paragraph thematic description of what Soma represents in-world"
    affects:
      - melee_damage
      - carry_weight
      - inventory_capacity
      - auto_attack_damage
    effects:
      - stat: melee_damage_bonus
        perPoint: 2.0
        description: "+2.0 melee damage per point"
      # ... more effects
```

**File 2: `content/races/{race_name}.yaml`** (2 races for v0.1)

The two races are already named: Baseline and Threaded. Produce a file for each.

```yaml
id: baseline
name: Baseline
description: |
  2-3 sentences. Who they are in the world of Threshold. Unaltered humans
  who exist outside the Thread program. How they're viewed by society.
  What drives them.
attribute_modifiers:
  presence: 2
  resolve: 1
  phlux: -1
passives:
  - id: unaltered_resilience
    name: "Thematic Name"
    description: "What it does mechanically (e.g., +10% CC resistance)"
  - id: second_passive
    name: "Thematic Name"
    description: "Minor flavor passive"
body_types: ["lean", "medium", "heavy"]
appearance_notes: |
  Notes for the art team about what this race looks like.
  Skin tone ranges, unique markings, distinguishing features.
```

**File 3: `content/classes/{class_name}.yaml`** (3 classes for v0.1)

The three classes and their Primer Sequences are already named:
- **Sentinel** — Somatic Primer (physical, tank/melee DPS)
- **Catalyst** — Cortical Primer (mental, Expression DPS/debuffer)
- **Conduit** — Sympathetic Primer (empathic, healer/support/buffer)

```yaml
id: sentinel
name: Sentinel
primer_sequence: somatic
description: |
  2-3 sentences. Who they are, what their Thread specialization feels like,
  what role they tend to fill in a group, and what makes them unique.
role_tendency: tank_melee_dps
starting_attribute_bonuses:
  soma: 3
  reflex: 1
  vigor: 2
  resolve: 1
  acuity: 1
starting_equipment:
  - starter_blade  # item definition ID
  - recruit_vest
  - recruit_boots
passive_tree_entry: |
  Starts near physical damage and armor nodes. Early paths branch toward
  either pure damage (Strike focus) or mitigation (Shield focus).
```

**File 4: `content/skills/{skill_name}.yaml`** (at least 8 skills for v0.1)

This is the big one. The design doc specifies 26 skills total, but v0.1 needs
at minimum 8 (enough for 3 classes to each have 2 Native and 2 Aligned).

Each skill needs 3 abilities at thresholds 5, 15, and 30.

Suggested v0.1 skill list (you can rename these — the IDs are what matter):

**Combat Skills:**
1. Heavy Weapons (Sentinel native)
2. Unarmed Combat (Sentinel native)
3. Kinetic Expression (Catalyst native)
4. Entropy Expression (Catalyst native)
5. Mending Expression (Conduit native)
6. Warding Expression (Conduit native)

**Utility Skills:**
7. Field Medicine (Conduit aligned)
8. Tactical Awareness (Sentinel aligned)

Format for each skill file:

```yaml
id: heavy_weapons
name: Heavy Weapons
description: |
  1-2 sentences about what this skill represents in-world.
category: combat  # combat, expression, crafting, utility, advanced
tier: 1  # 1=available at creation, 2=requires prerequisites, 3=advanced
prerequisites: []  # [{skillId: "xxx", level: 10}] for tier 2/3
max_level: 30
base_xp_cost: 100  # XP to go from level 0 to level 1
progression_exponent: 1.15  # each level costs base × level^exponent

affinity_by_class:
  sentinel: native      # 0.5× XP cost
  catalyst: misaligned  # 1.5× XP cost
  conduit: opposed      # 2.0× XP cost

thresholds:
  - level: 5
    unlocks_ability: heavy_cleave
    title: null
  - level: 15
    unlocks_ability: brutal_charge
    title: null
  - level: 30
    unlocks_ability: earthquake_strike
    title: "Bonecutter"

abilities:
  - id: heavy_cleave
    name: Heavy Cleave
    description: |
      1 sentence describing the ability in combat terms.
    ability_type: instant  # instant, cast, channel, reactive, toggle, passive
    expression_category: strike  # strike, sustain, shield, disrupt, augment
    secondary_category: null  # optional second category
    target_type: aoe_cone  # single, aoe_circle, aoe_cone, self, party
    cost:
      stamina: 25
      strand: 0
    cooldown: 6  # seconds
    cast_time: null
    channel_duration: null
    is_off_gcd: false
    base_damage: 45
    base_healing: null
    damage_scaling:
      - attribute: soma
        coefficient: 1.8
    duration: null
    range: 3  # tiles
    aoe_radius: null
    reactive_trigger: null
    animation: attack
    vfx: null
    sound: null

  - id: brutal_charge
    # ... level 15 ability

  - id: earthquake_strike
    # ... level 30 ability
```

**IMPORTANT DESIGN CONSTRAINTS FOR ABILITIES:**

1. Every ability MUST have an `expression_category`. This is what feeds the
   Resonance Buffer. Think about it when designing — a Sentinel isn't all
   Strike. Give them a Shield ability or an Augment to enable Resonance combos.

2. Cost should use Stamina for physical skills, Strand for Expression skills,
   or both for hybrid abilities. Costs should be meaningful but not punishing
   at the level the ability unlocks.

3. Cooldowns should create a rotation. If a class has 6 abilities by level 30
   (2 skills × 3 abilities each), their cooldowns should stagger so there's
   always something to press. Avoid having all abilities on the same cooldown.

4. `base_damage` and `damage_scaling` work together:
   `total = base_damage + (attribute_value × coefficient)`
   For a level 10 character with 12 Soma: `45 + (12 × 1.8) = 66.6 damage`

5. Sustain abilities should use `base_healing` instead of `base_damage`.

6. Shield abilities should use `duration` to indicate how long the shield lasts.

7. Leave `animation`, `vfx`, and `sound` as placeholder strings for now. The
   art team will fill these in later.

**File 5: `content/backgrounds/{background_name}.yaml`** (5 backgrounds)

Already named:
1. Sublevel Resident — grew up in the lower infrastructure levels
2. Lapsed Clerk — former Directorate bureaucrat who lost status
3. Street Medic — underground healer operating outside the system
4. Salvage Runner — scavenger from the city's ruined outer sectors
5. Disgraced Academic — researcher expelled from the Directorate's labs

```yaml
id: sublevel_resident
name: Sublevel Resident
description: |
  1-2 sentences of flavor about this background.
mechanical_bonus:
  attribute_bonus:
    vigor: 1
  xp_bonuses:
    unarmed_combat: 10  # 10% bonus XP for this skill
starting_knowledge: |
  What this character knows about the world that others might not.
  This feeds into dialogue options and quest availability.
quest_chain_id: sublevel_origin  # ID of the unique quest chain this unlocks
```

**File 6: `content/currencies/currencies.yaml`**

Define the currency types. Already partially exists. Expand with:

```yaml
currencies:
  - id: flux_credits
    name: "Thematic Currency Name"
    description: "Primary currency. Dropped by enemies, earned from quests."
  - id: directorate_tokens
    name: "Thematic Name"
    description: "Earned from Directorate-aligned activities. Spent at Directorate vendors."
  - id: unbound_scrip
    name: "Thematic Name"
    description: "Earned from Unbound-aligned activities. Black market currency."
  - id: instance_marks
    name: "Thematic Name"
    description: "Earned from completing dungeon instances. Spent on high-end gear."
  - id: pvp_currency
    name: "Thematic Name"
    description: "Future PvP currency. Placeholder for now."
```

**File 7: `content/items/weapons/starter_{class}.yaml`** (3 starter weapons)

One per class. These are what the character starts with.

```yaml
id: starter_blade
name: "Thematic Weapon Name"
description: "1 sentence"
category: weapon
equip_slot: main_hand
sprite_layer: handMain
asset_variant: starter_blade_sentinel  # for art team
stackable: false
max_stack: 1
base_stats:
  damage: 12
  weapon_speed: 1.5  # attacks per second
binding: none
sell_value: 5
repair_cost_per_point: 1
durability_max: 100
rarity_weights:
  - rarity: common
    weight: 100
sequence_slot_count: 0
sequence_slot_types: []
level_requirement: 1
```

### Delivery Format

Drop completed YAML files into the `content/` directory following the existing
folder structure:

```
content/
  attributes/attributes.yaml
  races/baseline.yaml
  races/threaded.yaml
  classes/sentinel.yaml
  classes/catalyst.yaml
  classes/conduit.yaml
  skills/heavy_weapons.yaml
  skills/unarmed_combat.yaml
  skills/kinetic_expression.yaml
  skills/entropy_expression.yaml
  skills/mending_expression.yaml
  skills/warding_expression.yaml
  skills/field_medicine.yaml
  skills/tactical_awareness.yaml
  backgrounds/sublevel_resident.yaml
  backgrounds/lapsed_clerk.yaml
  backgrounds/street_medic.yaml
  backgrounds/salvage_runner.yaml
  backgrounds/disgraced_academic.yaml
  currencies/currencies.yaml
  items/weapons/starter_blade.yaml
  items/weapons/starter_focus.yaml
  items/weapons/starter_staff.yaml
```

Run `npm run build:content` after adding files to validate they parse correctly
and generate the compiled JSON index.

---

## BRIEF 2: Character Sprite LoRA Training Pipeline

**Who:** Art Director / Asset Artist (using ComfyUI + LoRA training)
**Output:** Trained LoRA models + initial spritesheet exports
**Blocking:** Sprint 4 (placeholder colored rectangles work until then)

---

### Context

The game uses a **6-layer composited sprite system**. Every character (player,
NPC, enemy, boss) is built from overlapping transparent sprite layers that are
stacked at runtime. This means you do NOT draw a character wearing armor — you
draw the base body and the armor as separate images that are composited by the
engine.

The rendering engine uses **isometric perspective** (top-down at roughly 45°).
All sprites are drawn from this angle.

Characters face **8 directions**, but only **5 are drawn**:
- S, SE, E, NE, N are drawn as unique sprites
- SW, W, NW are generated by **horizontally mirroring** SE, E, NE

This cuts art production nearly in half.

### The 6 Sprite Layers (back to front)

| Layer | Z-Order | What It Contains | When Visible |
|-------|---------|-----------------|--------------|
| 0. Back Item | Furthest back | Cloaks, capes, backpacks, wings | When equipped |
| 1. Base Body | Behind equipment | Skin, body shape, underwear/base clothing | Always |
| 2. Armor | Over body | Chest piece, leg armor, visible clothing | When equipped |
| 3. Headwear | Over armor | Helmets, hoods, crowns, masks | When equipped |
| 4. Main Hand | Front layer | Weapons, tools, held items (right hand) | When equipped |
| 5. Off Hand | Front layer | Shields, secondary weapons, orbs (left hand) | When equipped |
| 6. VFX | Topmost | Resonance glow, status effects, auras | Contextual |

Layer 6 (VFX) is generated programmatically — you don't need to train a LoRA for it.

### Animation States

Each layer needs sprites for these animation states:

| State | Frames | When Used |
|-------|--------|-----------|
| Idle | 1-4 | Standing still |
| Walk | 4-8 | Moving between tiles |
| Attack | 3-6 | Melee/ranged attack swing |
| Cast | 3-4 | Using an Expression ability |
| Channel | 2-4 | Sustained ability (looping) |
| Hit | 2-3 | Taking damage |
| Death | 4-6 | Dying (final frame = corpse) |
| Block | 1-2 | Active mitigation |

### Sprite Specifications

- **Canvas size**: 64×64 pixels per frame (can be up to 128×128 if detail requires, engine will scale)
- **Background**: Transparent (PNG with alpha channel)
- **Perspective**: Isometric (roughly 30° from top-down, consistent across all layers)
- **Color depth**: 32-bit RGBA
- **Anti-aliasing**: Minimal — the engine uses `pixelArt: true` for crisp scaling
- **Style**: Defined by art director. Consistency is more important than any specific style. All layers MUST match in perspective, scale, lighting direction, and line weight.

### Spritesheet Format

The engine expects spritesheets organized as:

```
Filename: {asset_key}_{direction}_{animation}.png

Examples:
  base_body_lean_S_idle.png       → 4 frames horizontal strip
  base_body_lean_SE_walk.png      → 8 frames horizontal strip
  armor_recruit_vest_E_attack.png → 6 frames horizontal strip
```

All frames for a given direction+animation are in a **single horizontal strip**.
Frame width is uniform within a strip.

### LoRA Training Strategy

You need separate LoRA models for:

**LoRA 1: Base Bodies**
- Train on: human figures in isometric perspective, multiple body types
- Body types needed: lean, medium, heavy (for each race)
- Races: Baseline (normal human), Threaded (subtle bio-luminescent veins/markings)
- Skin tone range: full spectrum, controlled by color palette at generation time
- Output: Base body sprites with NO equipment — just the character in minimal clothing
- Training data should include all 5 directions (S, SE, E, NE, N) and all animation states
- Ensure consistent proportions across directions — the same character should be
  recognizable from every angle

**LoRA 2: Armor/Clothing Sets**
- Train on: isolated armor pieces drawn from isometric perspective
- Must be transparent-background — ONLY the armor, no body underneath
- Must align precisely with base body proportions (this is critical — if the
  armor is 2 pixels off from the body, the compositing looks wrong)
- v0.1 needs: recruit_vest (starter), 2-3 additional tiers
- Consider rarity visual progression: Common (simple), Rare (detailed), Epic (glowing accents)

**LoRA 3: Weapons**
- Train on: isolated weapons from isometric perspective
- Transparent background
- Held at a consistent position relative to the character's hand
- v0.1 needs: starter_blade (Sentinel), starter_focus (Catalyst), starter_staff (Conduit)
- Melee weapons need attack animation frames showing the swing arc
- Casting weapons need a cast animation showing the weapon raised/channeling

**LoRA 4: Headwear**
- Train on: isolated helmets/hoods from isometric perspective
- Must align with base body head position across all directions
- v0.1 needs: 2-3 headwear items

**LoRA 5: Enemies** (can be a single LoRA or per-enemy-type)
- Enemies use the SAME compositing system for humanoid types
- Non-humanoid enemies (creatures, constructs) can be single-layer sprites
- Nemesis enemies are composited like players (they carry weapons, wear armor)
- v0.1 needs: 3-5 basic enemy types for the starter dungeon

### Quality Validation Checklist

Before delivering sprites, verify:

- [ ] All 5 directions are consistent (same character, same proportions)
- [ ] Transparency is clean (no white fringe, no background bleed)
- [ ] Layers align when stacked (body + armor + weapon = correct composite)
- [ ] Animation frames are evenly spaced and smooth
- [ ] Isometric angle is consistent across ALL layers and ALL characters
- [ ] Lighting direction is consistent (pick one and stick with it — suggest top-left)
- [ ] Scale is consistent (a weapon shouldn't be bigger than the character)
- [ ] Mirror test: flip SE horizontally and verify it looks correct as SW

### Delivery Structure

```
assets/
  sprites/
    characters/
      base_body/
        lean/
          S/idle.png, walk.png, attack.png, cast.png, hit.png, death.png
          SE/idle.png, walk.png, ...
          E/...
          NE/...
          N/...
        medium/
          ...
        heavy/
          ...
    equipment/
      armor/
        recruit_vest/
          S/idle.png, walk.png, attack.png, ...
          SE/...
      weapons/
        starter_blade/
          S/idle.png, attack.png, ...
          SE/...
      headwear/
        ...
    enemies/
      {enemy_type}/
        S/idle.png, walk.png, attack.png, hit.png, death.png
        SE/...
```

### Priority Order

1. **Base bodies** (lean + medium, Baseline race, all 5 dirs, idle + walk) — needed first for movement testing
2. **Starter weapons** (3 weapons, all dirs, idle + attack) — needed for combat testing
3. **Starter armor** (recruit_vest, all dirs, idle + walk + attack) — visual completeness
4. **Enemies** (2-3 types, all dirs, idle + walk + attack + hit + death) — needed for dungeon
5. **Everything else** (headwear, back items, additional tiers)

---

## BRIEF 3: Systems Balancing Spreadsheet (S1 Content Scope Lock)

**Who:** Game Designer / Systems Designer
**Output:** A balancing spreadsheet or YAML config that defines all numeric progression
**Blocking:** Sprint 3 (combat engine uses these numbers for all calculations)

---

### Context

The combat engine, progression system, and economy are all built but run on
placeholder numbers. Before the game can be meaningfully tested, someone needs
to define the actual values for XP curves, ability damage/cooldowns, loot rates,
enemy stats, and difficulty scaling.

This is the systems design work — the feel of the game lives in these numbers.
Too-fast leveling and the game has no depth. Too-slow and it's a grind. Abilities
that hit too hard make combat trivial. Abilities with cooldowns too long make
combat boring.

The engine is already wired for all of these values — they just need to be set.

### PART 1: XP Progression Curve

Define how much XP is required to reach each level (1-30).

The engine uses this formula for skill XP:
`xp_for_next_level = base_xp_cost × current_level ^ progression_exponent`

But CHARACTER leveling (separate from skill leveling) needs its own curve.

Provide a table:

```yaml
# content/formulas/xp_curve.yaml
level_cap: 30
xp_curve:
  1: 0        # Starting level, no XP needed
  2: 400
  3: 900
  4: 1600
  5: 2500
  # ... through 30
  30: 850000  # Or whatever the cap number is

# How much XP do common activities give?
xp_sources:
  kill_normal_enemy_same_level: 50
  kill_elite_same_level: 150
  kill_champion_same_level: 400
  kill_boss_same_level: 1000
  complete_quest_story: 500
  complete_quest_side: 200
  complete_quest_daily: 100
  complete_instance_normal: 800
  complete_instance_heroic: 1500
  complete_instance_mythic_per_plus: 200  # bonus per mythic+ level
```

Design considerations:
- Levels 1-10 should feel fast (tutorial/onboarding pace)
- Levels 10-20 is the core gameplay loop
- Levels 20-30 is the endgame grind that slows significantly
- A dedicated player should hit level 30 in roughly 40-60 hours of play
- XP from enemies should scale: killing enemies 5+ levels below you gives reduced XP

### PART 2: Skill XP Costs

Each skill uses `base_xp_cost` and `progression_exponent`. Define these:

```yaml
# content/formulas/skill_progression.yaml
skill_progression:
  # Combat skills (core gameplay — should level at a good pace)
  combat:
    base_xp_cost: 100
    progression_exponent: 1.15
    max_level: 30

  # Expression skills (slightly slower — powerful abilities)
  expression:
    base_xp_cost: 120
    progression_exponent: 1.18
    max_level: 30

  # Crafting skills (slower — permanent economic value)
  crafting:
    base_xp_cost: 150
    progression_exponent: 1.20
    max_level: 30

  # Utility skills (fastest — quality of life)
  utility:
    base_xp_cost: 80
    progression_exponent: 1.12
    max_level: 30

  # Advanced skills (slowest — prestige/endgame)
  advanced:
    base_xp_cost: 200
    progression_exponent: 1.25
    max_level: 30

# XP sources for skills
skill_xp_sources:
  use_ability_in_combat: 5       # per ability use
  kill_with_skill_ability: 15    # per kill using this skill's ability
  crafting_success: 25           # per successful craft
  skill_quest_reward: 100        # quest that specifically rewards this skill
```

Remember: these costs are BEFORE the affinity multiplier is applied.
A Native skill (0.5×) effectively costs half. An Opposed skill (2.0×) costs double.

Design target: A player focusing on their 2 Native skills should have them at
level 15 (second ability unlocked) by character level 15. Level 30 skills
should be an endgame achievement that takes serious investment.

### PART 3: Ability Damage and Cooldown Balancing

For every ability defined in Brief 1, provide final tuned numbers. The key
relationships to balance:

**DPS Budget Per Class:**

All three classes should have roughly equivalent DPS potential at the same
gear/level, but delivered differently:

- Sentinel: High per-hit damage, slower attacks, some burst windows
- Catalyst: Moderate per-hit, faster rotation, DoT/AoE damage, Expression resource dependent
- Conduit: Lower personal DPS, strong party utility, healing throughput

**Ability Cooldown Guidelines:**

```
Bread-and-butter ability: 4-8 second cooldown
Medium impact ability:    12-20 second cooldown
Major cooldown:           30-60 second cooldown
Ultimate/panic button:    2-5 minute cooldown
```

**Ability Cost Guidelines:**

At level 10, a character should be able to use their rotation for about 45-60
seconds before running out of resources (assuming no regen-focused abilities).

```
Low cost ability:    10-20 Stamina or Strand
Medium cost:         25-40 Stamina or Strand
High cost:           50-80 Stamina or Strand
Emergency/ultimate:  100+ (basically dumps the resource bar)
```

**Auto-Attack:**
The engine calculates: `weapon_damage × 0.4 + soma × 0.5`
Auto-attack happens automatically between abilities. It should be roughly
20-30% of a Sentinel's total DPS, 10-15% for Catalyst, 5-10% for Conduit.

### PART 4: Enemy Stat Scaling

Define how enemy stats scale with level and type:

```yaml
# content/formulas/enemy_scaling.yaml
enemy_base_stats:
  normal:
    hp_per_level: 80
    damage_per_level: 8
    armor_per_level: 3
    xp_value_per_level: 50
  elite:
    hp_multiplier: 3.0      # 3× normal HP
    damage_multiplier: 1.5
    armor_multiplier: 2.0
    xp_multiplier: 3.0
  champion:
    hp_multiplier: 8.0
    damage_multiplier: 2.0
    armor_multiplier: 3.0
    xp_multiplier: 8.0
  boss:
    hp_multiplier: 25.0
    damage_multiplier: 2.5
    armor_multiplier: 4.0
    xp_multiplier: 20.0
  nemesis:
    # Starts as elite, evolves up to champion stats
    base_hp_multiplier: 3.0
    evolution_hp_bonus_per_tier: 1.5  # tier 0=3×, tier 1=4.5×, tier 2=6×, etc.
    max_evolution_tier: 5
```

Design targets for a 5-player party:
- Normal enemies: die in 5-10 seconds of focused DPS
- Elites: die in 20-30 seconds, require some coordination
- Champions: 1-2 minutes, require tank and healer
- Bosses: 3-5 minutes, full party coordination required
- Boss should be able to kill an unhealed tank in about 15-20 seconds

### PART 5: Difficulty Scaling (Mythic+ System)

```yaml
# content/difficulty/scaling.yaml
difficulty_tiers:
  normal:
    enemy_hp_mult: 1.0
    enemy_damage_mult: 1.0
    loot_quality_bonus: 0
    xp_bonus: 0
  heroic:
    enemy_hp_mult: 1.5
    enemy_damage_mult: 1.3
    loot_quality_bonus: 10
    xp_bonus: 25

mythic_plus:
  base_hp_mult: 2.0
  base_damage_mult: 1.5
  per_level_hp_mult: 0.10    # +10% per mythic+ level
  per_level_damage_mult: 0.05
  per_level_loot_bonus: 5
  per_level_xp_bonus: 15
  max_level: 20

  # Affixes applied at various mythic+ thresholds
  affix_schedule:
    2: [fortified]      # Enemies have more HP
    4: [fortified, raging]  # + enrage at 30% HP
    7: [fortified, raging, explosive]  # + spawn explosive orbs
    10: [fortified, raging, explosive, tyrannical]  # Bosses buffed
```

### PART 6: Loot Drop Rates

```yaml
# content/formulas/loot_rates.yaml
drop_rates:
  normal_enemy:
    nothing: 60
    common: 30
    uncommon: 8
    rare: 1.5
    epic: 0.4
    legendary: 0.1
  elite_enemy:
    nothing: 20
    common: 40
    uncommon: 25
    rare: 10
    epic: 4
    legendary: 1
  boss:
    common: 10
    uncommon: 30
    rare: 35
    epic: 20
    legendary: 5

  # Phlux attribute adds to quality roll
  phlux_loot_quality_bonus_per_point: 0.5  # percent

  # Mythic+ level adds to quality roll
  mythic_plus_quality_bonus_per_level: 2.0

  # Instance completion bonus (guaranteed drop)
  instance_completion:
    normal: uncommon    # guaranteed minimum rarity
    heroic: rare
    mythic_1_5: rare
    mythic_6_10: epic
    mythic_11_plus: epic  # with legendary chance
```

### PART 7: Economy Baseline

```yaml
# content/formulas/economy.yaml
economy:
  # Vendor sell price = item_sell_value × (0.3 + presence×0.01)
  # Vendor buy price = item_sell_value × (1.0 - presence×0.01)
  repair_cost_formula: "durability_lost × repair_cost_per_point × item_rarity_mult"
  rarity_repair_multipliers:
    common: 1.0
    uncommon: 1.5
    rare: 2.5
    epic: 5.0
    legendary: 10.0

  # Currency drops from enemies (base, scales with level)
  flux_credits_per_normal_kill: 5
  flux_credits_per_elite_kill: 20
  flux_credits_per_boss_kill: 100
  flux_credits_quest_story: 200
  flux_credits_quest_daily: 50

  # Instance currency
  instance_marks_per_normal_clear: 10
  instance_marks_per_heroic_clear: 25
  instance_marks_per_mythic_clear: 50
  instance_marks_mythic_plus_bonus: 5  # per mythic+ level
```

### Delivery Format

All of the above as YAML files in the `content/formulas/` directory. The
content pipeline will compile them to JSON. The server reads these at startup
and uses them for all authoritative calculations.

```
content/
  formulas/
    xp_curve.yaml
    skill_progression.yaml
    enemy_scaling.yaml
    loot_rates.yaml
    economy.yaml
    derived_stats.yaml  (already exists — review and confirm numbers)
  difficulty/
    scaling.yaml  (already exists — expand with mythic+ affixes)
```

### Testing Your Numbers

Once you deliver the balancing sheet, the engineering team will build a
simulation tool that runs 1000 combat encounters with your numbers and reports:

- Average time-to-kill per enemy type per class
- Average time-to-die per class when tanking
- Healer throughput vs. incoming damage ratio
- Resource sustain (how long before OOM at each level)
- Leveling pace (estimated hours per level bracket)

If the simulation shows problems, we'll iterate on the numbers together.

---

## Summary: What's Needed and When

| Brief | Deliverable | Blocks Sprint | Priority |
|-------|-------------|---------------|----------|
| 1 | Character YAML files (classes, races, skills, abilities) | Sprint 3 | **HIGHEST** |
| 3 | Balancing spreadsheet (XP, damage, cooldowns, loot, economy) | Sprint 3 | **HIGH** |
| 2 | LoRA-trained sprite assets | Sprint 4 | MEDIUM |

Briefs 1 and 3 are parallel tracks — they can be worked on simultaneously by
different people. Brief 2 (art) is less urgent because the engine uses
placeholder colored rectangles until real sprites arrive.
