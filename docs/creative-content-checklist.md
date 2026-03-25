# Creative Content Checklist & Timeline

## How This Works

You build content. I build code. Content goes into `content/` as YAML files.
When you drop a YAML file in the right folder, the pipeline converts it to JSON
and the game loads it automatically. No code changes needed for content updates.

The items below are ordered by **when the engine needs them**, not importance.
Items marked 🔒 block development. Items marked 🎨 are creative polish that
can come later. Items marked 🤖 can be AI-assisted/generated.

---

## PHASE 1: Foundation (Weeks 1-2)
### You need these before Sprint 3 can begin combat

### C1: Core Attributes ── `content/attributes/attributes.yaml`
🔒 **BLOCKS: Combat, character creation, all stat calculations**

- [ ] 8 attribute names (currently: soma, reflex, vigor, cortex, resolve, acuity, presence, phlux)
- [ ] Display names and descriptions for each
- [ ] Confirm or adjust the effects mapping (what each attribute does)
- [ ] Confirm allocation rules (base 5, +8 class, +10 free, min 3, max 18)

**Status:** Engine uses placeholder names. Rename whenever ready — it's a find-and-replace.

### C2: Classes (3 for v0.1) ── `content/classes/{class_name}.yaml`
🔒 **BLOCKS: Character creation, skill affinity system**

For each class:
- [ ] Name and display name
- [ ] Primer Sequence label (e.g., "Somatic", "Cortical", "Sympathetic")
- [ ] Description (2-3 sentences)
- [ ] Role tendency (tank/damage/healer/hybrid)
- [ ] Starting attribute bonus distribution (+8 points across 8 attrs)
- [ ] Starting equipment (weapon + armor names — just names, not stats yet)
- [ ] Native skills (2-4 skill IDs)
- [ ] Aligned skills (2-3 skill IDs)
- [ ] Opposed skills (1-2 skill IDs)
- [ ] Passive tree entry region description

### C3: Races (2 for v0.1) ── `content/races/{race_name}.yaml`
🔒 **BLOCKS: Character creation**

For each race:
- [ ] Name and description
- [ ] Attribute modifiers (e.g., +2 vigor, -1 cortex)
- [ ] 1-2 racial passives (name + description + effect)
- [ ] Available body types
- [ ] Appearance notes (skin tone ranges, unique options)

### C4: Backgrounds (3-5 for v0.1) ── `content/backgrounds/{bg_name}.yaml`
- [ ] Name and description
- [ ] Mechanical bonus (attribute bonus or XP bonus to a skill)
- [ ] Starting knowledge flavor text
- [ ] Quest chain name (just the name — quests come later)

### C5: Skills (6-8 for v0.1) ── `content/skills/{skill_name}.yaml`
🔒 **BLOCKS: Combat abilities, skill leveling**

For each skill:
- [ ] Name and description
- [ ] Category (combat, expression, crafting, utility, advanced)
- [ ] Tier (1, 2, or 3) and prerequisites
- [ ] Class affinity mapping (which classes get native/aligned/etc.)
- [ ] 3 ability unlocks at thresholds (level 5, 15, 30)
  - Each ability needs: name, type, cost, cooldown, damage/heal, description

---

## PHASE 2: Combat & Content (Weeks 3-4)
### Needed for playable dungeon encounters

### C6: Abilities (18-24 from Phase 1 skills) ── `content/abilities/{ability_name}.yaml`
🔒 **BLOCKS: Combat encounters**

Already defined via C5 thresholds, but need full stats:
- [ ] Damage/healing base values
- [ ] Attribute scaling coefficients
- [ ] Cast times, cooldown durations
- [ ] Expression category (strike/sustain/shield/disrupt/augment)
- [ ] Ability type (instant/cast/channel/reactive/toggle/passive)
- [ ] Animation name (we'll map these to sprites later)

### C7: Starter Items ── `content/items/`
🔒 **BLOCKS: Equipment, inventory testing**

- [ ] 3 starter weapons (one per class)
- [ ] 3 starter armor sets (one per class)
- [ ] 2-3 consumables (health potion, stamina potion, strand potion)
- [ ] 1 backpack definition

For each item: name, description, category, stats, rarity, level req

### C8: Enemies (5-8 types for first dungeon) ── `content/enemies/{enemy_name}.yaml`
🔒 **BLOCKS: Dungeon encounters**

- [ ] 4-5 basic enemy types (name, description, level range, stats)
- [ ] 1-2 elite variants
- [ ] 1 boss with specific mechanics
- [ ] Each enemy: HP, damage, abilities (1-2 per enemy), loot table reference

### C9: Loot Tables ── `content/loot_tables/{table_name}.yaml`
- [ ] Basic enemy drop table (materials, consumables, small currency)
- [ ] Elite enemy drop table (uncommon+ gear, more currency)
- [ ] Boss drop table (rare+ gear, unique items)

### C10: Currencies ── `content/currencies/currencies.yaml`
- [ ] Primary currency name and description
- [ ] PvP currency (if any at v0.1)
- [ ] Dungeon token currency
- [ ] Starting amounts for new characters

---

## PHASE 3: World & Story (Weeks 5-8)
### Needed for the town hub and first questlines

### C11: Town NPCs (5-8) ── `content/npcs/{npc_name}.yaml`
🤖 **AI-assistable: chatter lines, ambient dialogue**

- [ ] Weapon vendor (name, greeting, inventory category)
- [ ] Armor vendor
- [ ] Consumables vendor
- [ ] Quest giver (main story)
- [ ] Faction contact (Directorate)
- [ ] Faction contact (Unbound)
- [ ] Trainer NPC (skill respec / info)
- [ ] Background chatter NPCs (2-3)

For each: name, role, position in town, sprite key, dialogue tree ID

### C12: Dialogue Trees ── `content/dialogue/{dialogue_id}.yaml`
🤖 **AI-assistable: NPC chatter, vendor greetings**

- [ ] Vendor greeting/farewell for each vendor
- [ ] Quest offer/progress/complete dialogue for first quest chain
- [ ] Faction contact introductions
- [ ] 5-10 ambient chatter lines for background NPCs

### C13: Quests (5-10 for v0.1) ── `content/quests/{quest_id}.yaml`
- [ ] Tutorial quest chain (3-4 quests introducing mechanics)
- [ ] First story quest (introduces factions)
- [ ] 2-3 side quests (kill X, collect Y, reach location)
- [ ] 1 daily repeatable quest

For each: name, description, objectives, rewards (XP, currency, items), dialogue

### C14: Dungeon Template ── `content/dungeons/{dungeon_id}.yaml`
- [ ] First dungeon name and description
- [ ] Difficulty tiers available (normal, hard, mythic)
- [ ] Room count range (min/max rooms for procedural gen)
- [ ] Enemy composition per room type
- [ ] Boss encounter definition
- [ ] Completion rewards by difficulty

### C15: Difficulty Scaling ── `content/difficulty/scaling.yaml`
- [ ] Base scaling per difficulty tier (HP multiplier, damage multiplier, XP multiplier)
- [ ] Mythic+ affix definitions (3-5 affixes for v0.1)

---

## PHASE 4: Art Assets (Parallel Track — Start ASAP)
### These can be produced independently of YAML content

### A1: Character Base Bodies 🔒
**BLOCKS: Seeing anything on screen beyond colored rectangles**

- [ ] 1 body type per race (minimum)
- [ ] 5 directions (S, SE, E, NE, N) — engine mirrors for SW, W, NW
- [ ] 3 animation states minimum: idle, walk, attack
- [ ] Resolution: match your LoRA output size, engine will scale
- [ ] Format: PNG spritesheets or individual frames

### A2: Equipment Sprites
- [ ] 3 starter weapons (visible on character)
- [ ] 3 starter armor sets (visible on character)
- [ ] Must match base body proportions and direction set

### A3: Enemy Sprites
- [ ] 4-5 basic enemy types (idle, walk, attack, death)
- [ ] 1 boss (idle, walk, attack, death + special attack)
- [ ] Same 5-direction requirement

### A4: Town Tileset
🎨 **Polish — can use placeholder tiles initially**

- [ ] Ground tiles (stone, dirt, grass)
- [ ] Building facades
- [ ] Props (barrels, crates, market stalls, lanterns)
- [ ] NPC markers

### A5: UI Elements
🎨 **Polish — engine has functional text-based UI initially**

- [ ] Health/stamina/strand bars
- [ ] Hotbar frame
- [ ] Inventory grid
- [ ] Character creation panel backgrounds
- [ ] Minimap frame

### A6: Audio Placeholders
🎨 **Not needed until Phase 4+ — leave empty, engine has silence placeholders**

- [ ] Ambient town music
- [ ] Combat music
- [ ] UI click sounds
- [ ] Ability sound effects

---

## Production Prompt

Use this prompt (already provided earlier) to generate C1-C5 as YAML:
→ See the CHARACTER FOUNDATION DEFINITIONS prompt in chat history

For enemies (C8), use this supplemental prompt:

```
PROMPT: ENEMY DEFINITIONS

Using the same world/setting as the character definitions, I need enemies
for the first dungeon. Produce YAML files for:

- 4-5 basic enemy types (level 1-5 range)
- 1-2 elite variants (level 3-5, tougher versions of basics)
- 1 dungeon boss (level 5, multiple phases or mechanics)

For each enemy:
  id: snake_case
  name: display name
  description: 1-2 sentences
  entityType: enemy | elite | champion | boss
  levelRange: [min, max]
  baseHp: number
  baseDamage: number
  abilities:
    - id, name, cooldown, damage, description
  lootTableId: reference to a loot table
  spriteKey: for art pipeline
  nemesisEligible: boolean (can this enemy become a nemesis?)

For the boss, also include:
  phases: array of phase definitions with HP thresholds and behavior changes

Output as: content/enemies/{enemy_id}.yaml
```

---

## Priority Order (What to Work on First)

1. **C1-C5** (attributes, classes, races, backgrounds, skills) — Use the prompt
2. **A1** (character base body sprites) — Start LoRA training NOW
3. **C7** (starter items) — Simple, needed early
4. **C8** (enemies) — Use the enemy prompt above
5. **C10** (currencies) — Quick, 15 minutes
6. **A3** (enemy sprites) — After enemy definitions exist
7. **C11-C12** (NPCs + dialogue) — Town comes online
8. **C13** (quests) — Requires story decisions
9. **C14** (dungeon template) — Requires enemy + loot decisions
10. Everything else

---

## File Drop Locations

```
content/
├── attributes/        ← C1
├── classes/            ← C2
├── races/              ← C3
├── backgrounds/        ← C4
├── skills/             ← C5
├── abilities/          ← C6
├── items/
│   ├── weapons/        ← C7
│   ├── armor/          ← C7
│   └── consumables/    ← C7
├── enemies/            ← C8
├── loot_tables/        ← C9
├── currencies/         ← C10
├── npcs/               ← C11
├── dialogue/           ← C12
├── quests/             ← C13
├── dungeons/           ← C14
└── difficulty/         ← C15
```

Drop YAML in the right folder → run `npm run build:content` → JSON appears in `dist/content/` → game loads it.
