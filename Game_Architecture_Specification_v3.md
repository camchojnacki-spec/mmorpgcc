# GAME ARCHITECTURE SPECIFICATION
## Complete Technical & Creative Framework
### A Reusable, AI-Driven Pipeline for 2D Isometric Browser Games

**Version 3.0 — March 2026**

**Author:** Cameron Chojnacki — Creative Director & Technical Architect

> **Note on examples:** Throughout this document, placeholder names like "warrior," "fire_imp," or "iron_sword" are used solely to illustrate data structures and schemas. They are **not** creative decisions. All game-specific names, themes, lore, factions, and flavor are supplied separately by the creative director through content YAML files. Nothing in this document constrains or implies any particular setting.

---

## TABLE OF CONTENTS

1. [Executive Summary](#section-1-executive-summary)
2. [AI Asset Generation Pipeline](#section-2-ai-asset-generation-pipeline)
3. [Sprite Layer System](#section-3-sprite-layer-system)
4. [Animation System](#section-4-animation-system)
5. [High-Level System Architecture](#section-5-high-level-system-architecture)
6. [Authentication & Accounts](#section-6-authentication--accounts)
7. [Character System](#section-7-character-system)
8. [Skill System](#section-8-skill-system)
9. [Combat System](#section-9-combat-system)
10. [Death & Penalty System](#section-10-death--penalty-system)
11. [Inventory System](#section-11-inventory-system)
12. [Instance & Dungeon System](#section-12-instance--dungeon-system)
13. [Nemesis System](#section-13-nemesis-system)
14. [Quest System](#section-14-quest-system)
15. [Dialogue & AI Narrative System](#section-15-dialogue--ai-narrative-system)
16. [NPC & Entity System](#section-16-npc--entity-system)
17. [Economy & Trading](#section-17-economy--trading)
18. [Chat System](#section-18-chat-system)
19. [Town & Shared Spaces](#section-19-town--shared-spaces)
20. [Admin Portal](#section-20-admin-portal)
21. [Disconnect & Recovery](#section-21-disconnect--recovery)
22. [Asset Versioning & Caching](#section-22-asset-versioning--caching)
23. [Testing & Observability](#section-23-testing--observability)
24. [Deployment Architecture](#section-24-deployment-architecture)
25. [Content File Structure](#section-25-content-file-structure)
26. [Monorepo Project Structure](#section-26-monorepo-project-structure)
27. [v0.1 Scope Definition](#section-27-v01-scope-definition)
28. [Sprint Plan](#section-28-sprint-plan)
29. [Human-in-the-Loop Decision Map](#section-29-human-in-the-loop-decision-map)
30. [Open Questions for Creative Director](#section-30-open-questions-for-creative-director)
31. [Artifact Generation Checklist](#section-31-artifact-generation-checklist)
- [Appendix A: Asset Manifest Schema](#appendix-a-asset-manifest-schema)
- [Appendix B: ComfyUI Workflow Reference](#appendix-b-comfyui-workflow-reference)
- [Appendix C: Research References & Benchmarks](#appendix-c-research-references--benchmarks)

---

## SECTION 1: EXECUTIVE SUMMARY

This document defines the complete architecture for building AI-generated 2D isometric browser games. It consolidates the asset generation pipeline, game system design, server architecture, content framework, and development plan into a single reference.

### Core Principles

- **Human-led, AI-driven:** Creative decisions (art direction, QA, game design, narrative) remain with the creative director. Mechanical execution (asset generation, batch processing, deployment) is automated.
- **Game-agnostic foundation:** The pipeline, engine integration, and system schemas are reusable. A new game requires training new LoRAs and writing new content YAML — not rebuilding infrastructure.
- **Desktop-first browser delivery:** The game runs in modern desktop browsers (Chrome, Firefox, Edge) with no install. Mobile is explicitly out of scope. Minimum resolution: 1280×720.
- **Content-as-data:** Adding new content (items, quests, NPCs, enemies, dialogue) means adding YAML files. No code changes required. The creative director can build content in parallel with engineering work.

### Platform Decisions

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Engine | Phaser 3 (TypeScript) | Native isometric support, 150KB optimized bundle, official Colyseus integration, largest hiring pool for web game developers |
| Server | Colyseus (TypeScript/Node.js) | Room-based authoritative state, WebSocket transport, built-in reconnection tokens |
| API | Express or Fastify (TypeScript) | Shared types with client and server |
| Database | PostgreSQL | Relational integrity for inventory, trading, economy. Redis for sessions and ephemeral state |
| Hosting | Google Cloud (GKE) | Containerized, horizontally scalable |
| Asset Generation | Flux.1 Dev + LoRA fine-tuning via FluxGym | ComfyUI for inference and post-processing |

TypeScript across the entire stack eliminates cross-language type synchronization issues. All types are shared in a common package: client validates against the same schema as the server.

### Why Phaser 3 Over Alternatives

| Engine | Rejection Reason |
|--------|-----------------|
| Godot 4 | 5MB WASM bundle, GDScript breaks TypeScript stack uniformity, no official Colyseus support, iOS web export broken |
| PixiJS | Pure renderer — no game engine features, no isometric support, no Colyseus integration |
| Excalibur.js | Pre-1.0, smallest hiring pool, no isometric support |

Phaser 3 wins on: isometric native support (since 3.50), official Colyseus tutorials, 150KB bundle, TypeScript, largest community. Phaser 4 in beta ensures continued development.

**Future desktop native distribution:** Tauri wrapper (~3MB installer) can package the browser game as a standalone desktop app with zero engine changes.

---

## SECTION 2: AI ASSET GENERATION PIPELINE

### 2.1 Three-Tier Architecture

| Tier | What It Contains | Changes When |
|------|-----------------|--------------|
| Tier 1: Pipeline | ComfyUI workflows, orchestration scripts, post-processing tools, Phaser rendering engine | Rarely — only when switching base AI models or rendering engines |
| Tier 2: Style Layer | LoRA checkpoints, art direction prompts, trigger words, style block configuration | Per game project — each game has its own trained visual style |
| Tier 3: Content | Asset manifest entries, variant descriptions, class presets, equipment definitions | Continuously — every new piece of equipment, character, or environment |

### 2.2 LoRA Training Strategy

Each game project trains multiple specialized LoRAs on Flux.1 Dev. Separate LoRAs per asset category produce tighter style consistency than a single general-purpose LoRA.

| LoRA | Purpose | Dataset Size | Training Priority |
|------|---------|-------------|-------------------|
| Characters | Base bodies, heads, facial features, hair styles | 30–50 images | Priority 1 (complete first) |
| Equipment & Armor | Chest armor, robes, belts, helmets, boots, capes | 30–40 images | Priority 2 |
| Weapons & Items | Swords, staves, shields, orbs, daggers, bows, potions | 25–35 images | Priority 3 |
| Environments | Dungeon tiles, walls, doors, props, parallax backgrounds | 30–40 images | Priority 4 |
| VFX & Spells | Fire, ice, lightning, healing, buff/debuff effects | 25–30 images | Priority 5 |
| UI & Icons | Skill icons, inventory frames, UI elements | 20–30 images | Evaluate — may not need LoRA |

**Training infrastructure:** FluxGym on Windows with RTX 4080 (16GB VRAM), Python 3.10, CUDA 12.4. Training parameters: network_dim=16, adafactor optimizer, 8e-4 learning rate, bf16 mixed precision, 30 repeats/image. ~30 minutes per epoch.

**Bootstrap strategy:** Training Equipment/Weapons LoRAs requires reference images in the game's style, but those LoRAs don't exist yet. Solution: use the already-trained Characters LoRA to generate full characters wearing target equipment, then isolate pieces via SAM segmentation (ComfyUI Impact Pack) or manual cropping. These isolated pieces become the training dataset.

**Cross-LoRA Style Consistency:** Risk of subtle style drift between separately trained LoRAs (line weight, color saturation, shadow hardness). Mitigation: strict style anchors in every prompt. QA checkpoint: generate test composites across LoRA outputs and review for visual cohesion before batch generation. This is a human review point.

### 2.3 Human-in-the-Loop Touchpoints (Asset Pipeline)

- LoRA epoch selection (which training checkpoint captures the desired style)
- Art direction decisions (dark/gritty vs bright/stylized, proportions, color palette)
- Generated asset QA (reviewing outputs, accepting or requesting regeneration)
- Class preset composition review (does this character look right with this equipment?)
- Animation keyframe approval (do the casting poses feel right?)
- Cross-LoRA style consistency checks (do weapons match characters match environments?)

### 2.4 ComfyUI Generation Pipeline

Two reusable workflow templates (exported as API-format JSON for programmatic submission):

| Workflow | Use Case | Node Chain |
|----------|----------|------------|
| Isolated Part | Weapons, headwear, VFX, back items | Load Flux → Load LoRA → DualCLIPLoader → CLIP Encode → KSampler → VAE Decode → Inspyrenet Rembg → Save Image |
| Body-Relative | Equipment on body → segment → extract | Same generation chain → SAM Segment target region → Inspyrenet Rembg → Save Image |

### 2.5 Standard Generation Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Base Model | Flux.1 Dev (flux1-dev.safetensors) | Full precision diffusion model |
| CLIP | DualCLIPLoader: clip_l + t5xxl_fp16, type=flux | Both text encoders required for Flux |
| VAE | ae.safetensors | Flux autoencoder |
| Canvas Size | 1024 × 1024 (upgradeable to 2048×2048 for desktop) | Standard for all assets |
| Sampler | euler / simple scheduler | Consistent across all generations |
| Steps | 20 | Sufficient for LoRA-guided generation |
| CFG | 1.0 | Flux does not use traditional classifier-free guidance |
| LoRA Strength | 0.85 (model and clip) | Adjustable per LoRA based on testing |
| Background Removal | Inspyrenet Rembg | Free, handles cel-shaded edges cleanly |

### 2.6 Prompt Architecture

Prompts generated programmatically from the asset manifest:

```
{trigger_word}, {variant_description}, {direction_instruction}, {global_art_direction}, {background}, {negative_anchors}
```

The creative director writes only the `variant_description` field. Everything else is templated from the manifest. This ensures every generated asset shares consistent style tokens.

### 2.7 Automation Pipeline

Python orchestration script reads manifest → builds prompts → submits to ComfyUI REST API (localhost:8188) → polls for completion → downloads outputs → runs post-processing → saves to standardized directory structure. An AI coding agent can execute the entire chain.

---

## SECTION 3: SPRITE LAYER SYSTEM

### 3.1 Simplified 6-Layer Architecture

Every character is rendered as an ordered stack of transparent PNG layers composited at runtime by the browser engine. Based on validation testing, the system uses 6 layers rather than the more granular 13-layer system initially considered.

| Layer | Name | Nullable | Gen Method | Description |
|-------|------|----------|------------|-------------|
| 0 | base_body | No | Isolated | Full clothed character in class outfit. Hands in open grip pose. Defines class silhouette. |
| 1 | back_item | Yes | Isolated | Capes, cloaks, backpacks, quivers, wings. Renders behind body in most directions. |
| 2 | headwear | Yes | Isolated | Helmets, hoods, circlets, hats. May hide hair via interaction flag. |
| 3 | hand_main | Yes | Isolated | Primary weapon or tool. Includes handle overlap to cover grip hand. |
| 4 | hand_off | Yes | Isolated | Shield, tome, focus item, off-hand weapon. |
| 5 | vfx | Yes | Isolated | Spell effects, auras, elemental particles. May be animated sprite sequences. |

**Why base_body is fully clothed:** The LoRA produces consistent chibi-proportioned results when generating clothed characters, but falls back to semi-realistic proportions for unclothed bodies. Visual variety comes from swapping weapons, headwear, back items, and VFX layers on top of different class base bodies. The tradeoff is that torso/belt/legs/feet are not individually swappable — they change at the class level.

### 3.2 Directional Sprite System

Isometric 2.5D rendering requires 8 facing directions. To minimize generation work, 5 unique directions are generated and 3 are produced by horizontal mirroring.

| Direction | Code | Facing | Source |
|-----------|------|--------|--------|
| South | S | Toward camera (front view) | Generated |
| South-East | SE | Front-right diagonal | Generated |
| East | E | Right profile | Generated |
| North-East | NE | Back-right diagonal | Generated |
| North | N | Away from camera (back view) | Generated |
| South-West | SW | Front-left diagonal | Mirror of SE |
| West | W | Left profile | Mirror of E |
| North-West | NW | Back-left diagonal | Mirror of NE |

Every layer asset = 5 PNG files. A fully-equipped class across all layers and directions = ~25–30 generations.

**LoRA Training Direction Bias:** The character LoRA is trained primarily on three-quarter view images (~SE direction). Expect strongest generation quality at S and SE, weakest at N (back view). Back-view assets may require additional prompt engineering, cherry-picking across seeds, or supplemental training images.

### 3.3 Direction-Dependent Render Order

The layer render order is NOT fixed. It changes per direction because items in front of the character when facing south appear behind when facing north. The engine reads a render order lookup table:

| Direction | back_item | base_body | headwear | hand_off | hand_main | vfx |
|-----------|-----------|-----------|----------|----------|-----------|-----|
| S (front) | Behind (–1) | Base (0) | Above (1) | Above (3) | Above (4) | Top (5) |
| SE | Behind (–1) | Base (0) | Above (1) | Behind (–1) | Above (2) | Top (3) |
| E | Behind (–1) | Base (0) | Above (1) | Behind (–1) | Above (2) | Top (3) |
| NE | Above (1) | Base (0) | Above (2) | Behind (–1) | Behind (–1) | Top (3) |
| N (back) | Above (1) | Base (0) | Above (2) | Behind (–1) | Behind (–2) | Top (3) |

Negative values = rendered behind base body. Engine sorts all layers by render order before drawing. Mirrored directions (SW, W, NW) use the same render order as their source (SE, E, NE).

### 3.4 Anchor Point System

Each base body defines pixel-ratio anchor coordinates for attachment points, calibrated once per body type per direction during initial asset QA.

| Anchor | Purpose | Typical Position (S direction) |
|--------|---------|-------------------------------|
| hand_main | Primary weapon attachment | ~75% X, ~55% Y |
| hand_off | Off-hand item attachment | ~25% X, ~55% Y |
| head_top | Headwear placement | ~50% X, ~15% Y |
| back_center | Cape/backpack attachment | ~50% X, ~35% Y |

Anchors shift per direction. The manifest stores a complete anchor map: `body_type × direction × anchor_name → (x, y)`.

### 3.5 Hand and Weapon System

The base body is generated with hands in an open grip pose — fingers slightly curled as if holding a weapon handle, but holding nothing. Weapon assets include a small overlap region covering the grip area. The weapon handle/pommel paints over the empty grip.

**Weapon design constraints:**
- Weapons must include handle/grip region that overlaps and covers the hand anchor area
- Weapon scale must be consistent relative to the body across all 5 directions
- Weapons are generated at the same 1024×1024 canvas size as bodies for spatial consistency
- Two-handed weapons (staves, bows) span both hand anchors and may require custom anchor overrides

### 3.6 Sticker Border Handling

Each generated asset has a white sticker-like highlight border (2–3px). When layers overlap, borders stack visually. Accept as stylistic paper-doll aesthetic for initial release. Revisit if player feedback indicates it looks unpolished.

---

## SECTION 4: ANIMATION SYSTEM

The animation system prioritizes engine-driven tweens on static sprites over pre-rendered frame sequences. ~70–80% of all animation is achieved through programmatic transforms. The remaining ~20–30% requires generated keyframes for effects involving actual pixel content changes.

### 4.1 Tween-Only Animations (No Generated Frames)

| State | Technique | Description |
|-------|-----------|-------------|
| Idle | Y-axis sine wave, 2–3px amplitude, 2s cycle | Subtle breathing bob on entire layer stack |
| Walk | Y-axis bob 3–4px, faster cycle + X/Y translation | Bouncy movement along path. No leg animation — bob sells motion at chibi scale |
| Hit / Damage | 8px offset opposite to hit direction + white flash overlay | Knockback snap with 100ms recovery |
| Death | 15° rotation toward ground + opacity fade to 0 | Tilt and dissolve over 500ms |
| Buff / Debuff | VFX layer opacity pulse or tint overlay | Glow effect on character |
| Equip Swap | 100ms fade out old layer, 100ms fade in new | Smooth equipment transition |
| Melee Attack | Weapon layer rotates 60–90° arc around hand anchor, 200–300ms | Sword swing. Body leans slightly into swing direction |
| Block / Parry | Off-hand layer translates up + rotates to cover, 150ms | Shield raise |

### 4.2 Animations Requiring Generated Keyframes

| State | Frames Needed | Why Tweens Are Insufficient |
|-------|--------------|----------------------------|
| Spell Cast | 2–3 body keyframes per direction | Arm position changes fundamentally: arms at sides → raised → extended |
| Bow Draw | 2 body keyframes per direction | Arm silhouette changes: bow held forward → drawn back |
| Channel | 1 alternate body keyframe per direction | Sustained alternate pose with arms in channeling position |

Frame budget: 3 poses × 5 directions × N body types. **Deferred to post-v0.1** — tween-only at launch.

### 4.3 VFX Sprite Sequences

| Effect | Frames | Approach |
|--------|--------|----------|
| Projectile | 4–6 looped | Generate 2–3 keyframes, RIFE interpolate |
| Area burst | 6–8 one-shot | Generate 3 keyframes, interpolate |
| Lightning/erratic | 3–4 one-shot | Generate each frame individually — too erratic for interpolation |
| Pulse/glow | 4–6 looped | May be achievable with pure tween (opacity + scale) |
| Impact spark | 3–4 one-shot | Small, fast effect. Reusable across skills |

Total VFX budget: ~30–50 generated frames across all effect types.

### 4.4 Limitations

- No fluid hand-drawn animation (frame-by-frame artist work)
- No 3D rotation of equipment — items face a fixed direction per sprite direction
- No physics-based cloth or hair simulation — capes are static per direction with optional tween sway
- No detailed facial animation — one sprite per expression, no lip sync
- No complex multi-joint creature animation — dedicated sprite sheets required for tentacles, multi-joint wings

The style is intentionally stylized 2D with programmatic motion.

---

## SECTION 5: HIGH-LEVEL SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  Phaser 3 (WebGL) + HTML/CSS UI Overlay + WebSocket Client   │
└──────────────┬──────────────────────────┬────────────────────┘
               │ WebSocket (game state)   │ HTTPS (REST API)
               ▼                          ▼
┌──────────────────────┐    ┌──────────────────────────────────┐
│   Colyseus Server    │    │         REST API Server           │
│  (Game Rooms, State  │    │  (Auth, Characters, Inventory,    │
│   Sync, Combat,      │    │   Trading, Quests, Matchmaking,   │
│   Instance Mgmt)     │    │   Admin Portal Backend)           │
└──────────┬───────────┘    └──────────────┬───────────────────┘
           │                               │
           ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     Data Layer                                │
│  PostgreSQL (players, characters, inventory, quests, guilds)  │
│  Redis (sessions, matchmaking queue, real-time caches)        │
│  Cloud Storage (asset CDN — sprites, atlases, audio)          │
└──────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│                   Admin Portal                                │
│  Web-based dashboard for content management,                  │
│  atmosphere engine, moderation, analytics                     │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack Detail

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Game Client | Phaser 3 (TypeScript) | Isometric native (3.50+), 150KB bundle, largest web game dev pool |
| UI Overlay | HTML/CSS + Preact | Lightweight, type-safe bindings. Standard web layout for menus/inventory. |
| Game Server | Colyseus + Node.js | Room-based state sync, WebSocket native, delta compression |
| REST API | Express or Fastify | Shared types with client/server. Character CRUD, auth, admin. |
| Database | PostgreSQL | Relational integrity, ACID guarantees for trading/economy |
| Cache/Queue | Redis | Fast sessions, matchmaking queue, ephemeral game state, LLM chatter cache |
| Asset Hosting | Google Cloud Storage + CDN | Global distribution, hash-based versioning |
| Hosting | Google Cloud GKE | Horizontally scalable containers |
| Admin Portal | React or Preact | Type-safe, shared component patterns with game UI |

**Why PostgreSQL over MongoDB:** Characters own items, items have mod slots, guilds have members, quests have prerequisites. Relational integrity (foreign keys, transactions) prevents data corruption during trades, loot distribution, and concurrent inventory modifications. PostgreSQL also handles JSON columns well for flexible schema areas (quest state, nemesis memory).

**Why HTML/CSS UI overlay instead of pure Phaser UI:** Inventory, skill trees, chat, and menus benefit from standard web layout (flexbox, scrolling, text input, accessibility). Phaser handles world rendering; a DOM layer on top handles all panels and menus.

---

## SECTION 6: AUTHENTICATION & ACCOUNTS

### Authentication Flow

```
Player opens game in browser
  → Login screen (email + password)
  → REST API validates credentials, returns JWT (15min) + refresh token (7 days)
  → Client stores JWT in memory, refresh token in secure HttpOnly cookie
  → Client connects to Colyseus with JWT in handshake
  → Colyseus validates JWT on room join, associates connection with player ID
  → On JWT expiry: client uses refresh token silently for new JWT
```

### Account Data Model

```
Account:
  id: UUID
  email: string (unique, validated)
  password_hash: string (bcrypt)
  oauth_provider: string? (future — Discord, Google)
  oauth_id: string? (future)
  created_at: timestamp
  last_login: timestamp
  is_banned: boolean (default false)
  is_admin: boolean (default false)
```

### Design Decisions

- **JWT with short expiry (15 min) + refresh token (7 days).** Refresh tokens stored in Redis for revocation.
- **OAuth deferred to post-v0.1.** Priority: Discord (target audience), Google as secondary.
- **Admin flag on account** gates access to admin portal. No role hierarchy at v0.1, just admin/not-admin.
- **No username system separate from character names.** Account identified by email; characters have in-game names. One account can have multiple characters.

---

## SECTION 7: CHARACTER SYSTEM

### Data Model

```
Character:
  id: UUID
  account_id: UUID (FK → Account)
  name: string (unique, 3-20 chars, content-filtered)
  race: string (enum, defined in content YAML)
  class: string (enum, defined in content YAML)
  background: string (enum, defined in content YAML)
  level: integer (starts at 1)
  current_xp: bigint
  xp_to_next_level: bigint
  reputation_level: integer (post-cap progression)
  reputation_xp: bigint

  # Appearance (maps to base_body variants in asset manifest)
  body_type: string
  skin_tone: string
  hair_style: string
  hair_color: string

  # Core Attributes — 8 attributes, names defined in content YAML
  # Engine references them by index or key; display names are content-driven
  attributes: JSON  # { "attr_1": value, "attr_2": value, ... "attr_8": value }
  unspent_attribute_points: integer

  # Derived Stats (calculated from attributes + gear at runtime)
  max_hp: integer
  max_resource: integer  # resource name is game-specific (mana, energy, etc.)
  armor_rating: integer
  inventory_capacity: integer  # derived from attributes + backpack

  # Equipment Slots — slot list defined in content YAML
  equipment: JSON  # { "head": item_id, "body": item_id, "back": item_id,
                   #   "main_hand": item_id, "off_hand": item_id,
                   #   "boots": item_id, "belt": item_id,
                   #   "ring_1": item_id, "ring_2": item_id,
                   #   "backpack": item_id }

  # State
  current_zone: string  # "town" or instance ID
  position_x: float
  position_y: float
  direction: string (S, SE, E, NE, N, SW, W, NW)
  is_online: boolean

  # Currencies — types defined in content YAML
  currencies: JSON  # { "primary": amount, "instance_tokens": amount, ... }

  created_at: timestamp
  played_time: interval
```

### Core Attributes

The game uses **8 core attributes.** Their names, descriptions, and mechanical effects are defined entirely in content YAML — the engine references them by key (attr_1 through attr_8 or by content-defined keys). This allows different game projects to theme attributes differently (e.g., a sci-fi game might use "Neural Bandwidth" where a fantasy game uses "Intelligence").

Each attribute affects derived stats through formulas defined in content:
```yaml
# content/formulas/derived_stats.yaml
max_hp:
  base: 100
  scaling:
    - attribute: attr_5  # e.g., Constitution/Endurance
      per_point: 10
max_resource:
  base: 50
  scaling:
    - attribute: attr_4  # e.g., Intelligence/Willpower
      per_point: 5
inventory_capacity:
  base: 20
  scaling:
    - attribute: attr_1  # e.g., Strength
      per_point: 0.4     # floor(attr_1 * 0.4) bonus slots
  backpack_bonus: true    # add equipped backpack bonus
```

### Character Creation Flow

1. Name selection (validated for uniqueness + content filter)
2. Race selection (from content-defined list — affects starting attributes, appearance options)
3. Class selection (from content-defined list — affects starting attributes, native skills)
4. Background selection (from content-defined list — minor stat bonuses, flavor text, potential quest unlocks)
5. Appearance customization (body type, skin tone, hair style/color — options defined per race in content)
6. Preview screen shows composited character in Phaser renderer (6-layer stack)
7. Confirm → character saved to database, spawns in town

### Appearance → Asset Pipeline Mapping

- `race` + `body_type` → determines which `base_body` variant set to load from manifest
- `class` → determines default equipment layers (the "class outfit" baked into base_body)
- `hair_style` + `hair_color` → composited as part of base_body or as a sub-layer
- Equipment changes swap the composited layers (headwear, hand_main, etc.)

**Asset cost consideration:** Each unique race × body_type × class combination requires a full set of base_body sprites (5 directions × animation keyframes). Starting with 1 race × 2 body types × 4 classes × 5 directions = 40 base body generations for v0.1.

---

## SECTION 8: SKILL SYSTEM

### Core Concept

- Every skill has an XP cost curve that increases per level
- Each class defines a set of "native" skills with reduced XP costs (e.g., 0.5x multiplier)
- Non-native skills cost full price (1.0x multiplier) or more
- Gear mods can grant "semi-native" status (e.g., 0.75x multiplier)
- At certain skill level thresholds, new abilities unlock automatically
- Any class can eventually learn any skill — class identity is about starting cost advantage, not hard locks

### Data Models

```
SkillDefinition (content YAML):
  id: string
  name: string
  description: string
  category: string (defined per game — e.g., combat, magic, crafting, defense)
  max_level: integer
  base_xp_cost: integer
  progression_exponent: float (1.5–2.0)
  thresholds:
    - level: 5
      unlocks: "ability_id"
    - level: 15
      unlocks: "ability_id"
      title: "title_string"  # cosmetic title reward
    - level: 30
      unlocks: "ability_id"

ClassSkillAffinity (content YAML):
  class_id: string
  skill_affinities:
    - skill_id: string
      multiplier: 0.5   # native — half XP cost
    - skill_id: string
      multiplier: 1.0   # neutral
    - skill_id: string
      multiplier: 1.5   # anti-affinity — costs more

CharacterSkill (database):
  character_id: UUID
  skill_id: string
  current_level: integer
  current_xp: bigint
  effective_multiplier: float  # recalculated when gear changes

AbilityDefinition (content YAML):
  id: string
  name: string
  description: string
  skill_required: string
  skill_level_required: integer
  cooldown_ms: integer
  resource_cost: integer
  damage_formula: string  # e.g., "base_damage * (1 + skill_level * 0.05)"
  range: float  # in tile units
  target_type: string (single, aoe_circle, aoe_cone, self, party)
  aoe_radius: float?
  cast_time_ms: integer
  animation: string  # maps to animation state
  vfx: string?  # maps to VFX asset in manifest
  sound: string?  # placeholder for future audio
```

### XP Cost Formula

```
xp_for_level(n) = base_cost * (n ^ exponent) * multiplier

Where:
  base_cost = defined per skill in content YAML
  exponent = 1.5 to 2.0 (controls how steep the curve gets)
  multiplier = class_affinity * gear_modifier
```

| Skill Level | Native (0.5x) | Semi-Native (0.75x) | Non-Native (1.0x) |
|------------|---------------|--------------------|--------------------|
| 1 | 100 | 150 | 200 |
| 2 | 165 | 248 | 330 |
| 5 | 741 | 1,111 | 1,481 |
| 10 | 3,155 | 4,732 | 6,310 |
| 30 | 22,388 | 33,582 | 44,776 |

These are tuning variables — the creative director adjusts constants until progression feels right.

### Gear Mod Slots

```
ModSlot (on equipment):
  slot_type: string  # themed per game (implants, runes, gems, augments — TBD)
  mod_item_id: UUID?  # currently inserted mod item

ModItem (content YAML):
  id: string
  name: string
  description: string
  grants:
    - skill_id: string
      multiplier_reduction: float  # e.g., 0.25 reduces effective cost multiplier
  rarity: string
  required_level: integer
```

Equipping a mod that grants 0.25 reduction on a non-native skill (1.0x) reduces it to 0.75x (semi-native). Mods stack if multiple slots support the same skill (up to a floor of 0.5x — you can never beat true native cost).

---

## SECTION 9: COMBAT SYSTEM

### Architecture

```
Client (Input)          Server (Authority)           Client (Render)
─────────────           ──────────────────           ───────────────
Player presses          Receives action request      Receives state update
ability key  ──────►    Validates:                   Plays animation
                         - Is ability off cooldown?   Shows damage numbers
                         - Does player have resource? Updates HP bars
                         - Is target in range?
                         - Is player alive?
                         - Line-of-sight check?
                        Calculates damage
                        Applies to target state
                        Broadcasts state delta  ──►
```

### Server Tick Rate

- **20 ticks per second (50ms interval)** for game state updates
- Standard for tab-target combat (WoW-class games use ~20Hz server-side)
- Client renders at 60fps with interpolation between server states
- Input sent immediately (not batched to ticks) for responsiveness
- Combat state replicated via Colyseus delta compression

### Tab-Target System

- Tab key cycles nearby enemies sorted by distance (nearest first)
- Click on enemy to target directly
- Target persists until: new target selected, target dies, target leaves range
- Out-of-combat tab cycle resets after 30 seconds idle
- Target info displayed in UI (name, HP bar, level, elite/boss indicator)
- Server validates target exists and is targetable before processing abilities

### Damage Formula (Skeleton)

```
raw_damage = ability.base_damage + attribute_scaling(attacker) + equipment_bonus
modified = raw_damage * (1 + crit_bonus if crit_check) * (1 + target_resistance)
final = max(1, floor(modified * (0.9 + random(0, 0.2))))  # 0.9–1.1 variance
```

Exact formulas are tuning — the architecture supports pluggable damage calculation defined in content.

### Anti-Cheat Measures

- **Server-authoritative everything:** Client sends intentions, server validates and executes
- **Server-side cooldown enforcement:** Client UI is cosmetic only
- **Position validation:** Reject if character moved impossibly fast (>threshold per tick)
- **Rate limiting:** Max 10 ability activations per second per character
- **Resource cost validation:** Server checks mana/stamina/resource before processing
- **No damage calculation in client code:** Client receives "target lost X HP," never computes damage

---

## SECTION 10: DEATH & PENALTY SYSTEM

### Death Flow

1. Character HP drops to 0
2. Death animation plays (15° rotation + opacity fade, 500ms)
3. Server records XP earned this run + death count this hour (rolling window)
4. XP penalty calculated (see scaling below)
5. Armor durability loss applied (10% per equipped piece)
6. Player presented with respawn options

### Penalty Scaling

| Deaths Per Hour | Run XP Loss |
|----------------|-------------|
| 0–2 | 25% of XP earned this run |
| 2–5 | 50% of XP earned this run |
| 5+ | 75% of XP earned this run (cap) |

**What is NOT lost on death:**
- Existing XP / levels (no deleveling)
- Items in inventory
- Currency
- Quest progress

**What IS penalized:**
- Percentage of XP gained during the current instance run
- Equipment durability (must repair at vendor in town, costs currency)

### Respawn Options

- **Instance entrance:** Return to start of current dungeon (free, lose penalty XP)
- **Town:** Return to town safe zone (free, exit instance entirely)
- **Party resurrect:** If an alive party member has a resurrection ability (reduced penalty)

### Data

```
DeathTracker (in-memory, per session):
  character_id: UUID
  deaths_this_hour: timestamp[]  # rolling 1hr window
  xp_earned_this_run: bigint

ItemDurability (database):
  item_id: UUID
  max_durability: integer
  current_durability: integer
  repair_cost_per_point: integer
```

v0.1: No permadeath. Possible hardcore mode in future.

---

## SECTION 11: INVENTORY SYSTEM

### Capacity Model

Attribute-driven capacity. Base 20 slots + attribute bonuses + backpack item bonus.

```
total_capacity = base_capacity + attribute_bonus + backpack_bonus

Example: base(20) + attr_bonus(4) + backpack(10) = 34 total slots
```

Exact formula defined in content YAML (see Section 7 derived stats). Recalculated whenever attributes or backpack change.

### Item Data Model

```
ItemDefinition (content YAML):
  id: string
  name: string
  description: string
  category: string (weapon, armor, consumable, quest, material, mod, misc)
  layer_type: string?  # hand_main, hand_off, headwear, back_item — maps to sprite layer
  asset_variant: string?  # maps to variant in asset manifest
  stackable: boolean
  max_stack: integer
  base_stats:
    damage: integer?
    armor: integer?
    attribute_bonuses: { attr_key: value }[]
  mod_slot_count: integer
  mod_slot_types: string[]  # what mod types fit these slots
  rarity_weights: { common: 0.6, uncommon: 0.25, rare: 0.1, epic: 0.04, legendary: 0.01 }
  binding: string (none, bind_on_equip, bind_on_pickup)
  sell_value: integer
  repair_cost_per_point: integer
  durability_max: integer

ItemInstance (database):
  id: UUID
  definition_id: string (FK → ItemDefinition)
  character_id: UUID (owner)
  rarity: string (common, uncommon, rare, epic, legendary)
  rarity_source: string? (crafted, raided, quest, dropped)
  level_requirement: integer
  durability_current: integer
  durability_max: integer
  mod_slots: ModSlot[]  # array of slots with installed mods
  random_affixes: Affix[]  # for items with random stat rolls
  is_bound: boolean
  created_at: timestamp
  source: string  # origin tracking for analytics/moderation

InventorySlot (database):
  character_id: UUID
  slot_index: integer (0 to max_capacity - 1)
  item_id: UUID? (null = empty)
  quantity: integer (for stackables, default 1)
```

### Item → Sprite Layer Mapping

When a player equips an item with a `layer_type`:
1. Look up the item's `asset_variant`
2. Find that variant in the asset manifest under the appropriate layer
3. Load the directional sprites for the current facing
4. Composite per the existing pipeline (Section 3)

On unequip, remove layer from render stack.

### Binding Rules

- **none:** Item can be freely traded, sold, or dropped at any time
- **bind_on_equip:** Item can be traded until first equipped. Once equipped, becomes bound to that character permanently.
- **bind_on_pickup:** Item is immediately bound to the character who loots it. Can never be traded. Can be sold to NPC vendors or destroyed.

The server enforces binding rules during trading — bound items are rejected from trade windows.

---

## SECTION 12: INSTANCE & DUNGEON SYSTEM

### Architecture

```
Player/Party in town
  → Selects instance from Instance Board (UI)
  → Selects difficulty tier (+1, +2, +3...)
  → Matchmaking (if solo/incomplete party) or direct launch
  → Server creates Colyseus InstanceRoom
  → Procedural generation runs (BSP layout + enemy placement + loot tables)
  → Players load into instance
  → On completion/wipe/exit: room destroyed, results saved to DB
```

### Colyseus Room Types

```
TownRoom:
  - Persistent (always running)
  - Handles: player positions, chat, vendor interactions, stall visibility
  - Max capacity: 100 players (scalable via sharding)
  - Low tick rate (10Hz) — social, not combat
  - Safe zone — no combat, no death

InstanceRoom:
  - Ephemeral (created on demand, destroyed on completion)
  - Handles: combat, enemy AI, loot, objectives, boss encounters
  - Capacity: 5 (party) or up to 40 (raid) — set at creation
  - High tick rate (20Hz) — combat precision
  - Contains: generated layout, enemy states, loot tables
  - State snapshotted to Redis every 60s (crash recovery)

MatchmakingQueue:
  - Redis-backed, not a Colyseus room
  - Groups by: instance + difficulty + role preference
  - Timeout: 60 seconds, then launch with available players (min 1)
  - When party fills → creates InstanceRoom, sends join tokens
```

### Procedural Instance Generation

```
Input:
  - Instance template (content YAML)
  - Difficulty level (scaling modifier)
  - Party size
  - Random seed (stored for debugging/replay)

Steps:
  1. BSP (Binary Space Partition) creates room/corridor layout
  2. Room types assigned (combat, treasure, puzzle, boss, safe room)
  3. Enemy encounters placed per room type and difficulty
  4. Loot tables scaled by difficulty
  5. Boss selected (story-specific or procedural nemesis)
  6. Tilemap generated referencing environment asset manifest
  7. Layout serialized and sent to all clients

Output:
  - Tilemap data (JSON — tile positions, types, walkability, collision)
  - Enemy spawn list (positions, definitions, nemesis data)
  - Loot table references
  - Objective list
```

### Difficulty Scaling

```
DifficultyModifier (content YAML):
  level: integer (+1, +2, +3...)
  enemy_hp_multiplier: float
  enemy_damage_multiplier: float
  enemy_count_modifier: float
  affixes:  # special modifiers that change gameplay
    - id: string
      description: string
      enemy_modifier: string
      loot_bonus: float
      xp_multiplier: float
  speed_bonus_thresholds:  # faster completion = better loot
    - under_minutes: integer
      bonus: string
```

Example affixes (for illustration — actual affixes defined in content):

| Affix | Enemy Modifier | Loot Bonus | XP Multiplier |
|-------|---------------|------------|---------------|
| Bolstering | +20% HP | +5% | +10% |
| Volcanic | Floor AoE hazards | +15% | +20% |
| Frenzied | +30% attack speed | +10% | +15% |
| Celestial | Enemies heal each other | +20% | +25% |

### Instance Template (Content YAML Structure)

```yaml
id: string
name: string
description: string  # creative director fills
min_level: integer
environment_tileset: string  # references asset manifest
music: string  # placeholder

room_count_range: [min, max]
corridor_style: string

enemy_pool:
  - id: string
    weight: float
    min_difficulty: integer

boss_pool:
  - id: string
    type: story  # fixed boss
  - type: nemesis  # procedurally generated

loot_table: string  # references loot_tables/ YAML
quest_hooks:
  - quest_id: string
    trigger: string  # e.g., "boss_defeated", "room_cleared"
```

---

## SECTION 13: NEMESIS SYSTEM

### Overview

Enemies remember players. Nemesis entities evolve based on encounter history, creating persistent antagonists that adapt and grow. Some are story-defined (handcrafted), others are procedurally generated.

### Data Model

```
NemesisEntity:
  id: UUID
  definition_base: string  # base enemy type
  generated_name: string  # procedurally generated
  title: string?  # earned through encounters
  tier: string (elite, champion, boss)
  level: integer

  # Stats (modified from base)
  stat_overrides:
    hp_multiplier: float
    damage_multiplier: float
    boosted_skill: string?  # one ability is stronger
    boosted_skill_multiplier: float

  # Appearance (same 6-layer compositing as players)
  body_variant: string
  equipment_loadout:
    hand_main: string?
    hand_off: string?
    headwear: string?
    back_item: string?

  # Memory
  encounters: NemesisEncounter[]
  personality_traits: string[]  # affects behavior (aggressive, calculating, cowardly)
  weakness: string?  # takes extra damage from this element/type
  resistance: string?  # reduced damage from this element/type

  # Lifecycle
  created_by: string (story | procedural)
  instance_pool: string[]  # which instances this nemesis can appear in
  is_defeated: boolean
  defeat_count: integer
  last_encountered_by: UUID[]  # character IDs
  promoted_count: integer

NemesisEncounter:
  timestamp: timestamp
  instance_id: string
  difficulty: integer
  party_members: UUID[]
  outcome: string (nemesis_won | player_won | fled)
  player_deaths: integer
```

### Behavior Modifications Based on History

| Condition | Response |
|-----------|----------|
| Nemesis previously defeated this player | Taunt dialogue, confidence boost (+10% damage) |
| Nemesis was previously defeated by this player | Defensive posture, different skill emphasis, may flee at <30% HP |
| Nemesis recognizes full party from last encounter | Calls reinforcements or attempts escape |
| Nemesis defeated 3+ times | Promotes to next tier (elite → champion → boss), gains new abilities, earns new title |

### Generation Triggers

- **Promotion:** A procedural enemy kills a player → that enemy becomes a nemesis
- **Template:** An instance template requests a procedural boss → generated on demand
- **Manual:** Admin portal creates a story nemesis (handcrafted)

---

## SECTION 14: QUEST SYSTEM

### Architecture

Quests are entirely data-driven. New quest = new YAML file, no code changes.

### Quest Types

| Type | Description |
|------|------------|
| Story | Linear chain, advances main narrative. Handcrafted. |
| Side | Optional, standalone or short chain |
| Daily | Resets every 24h, repeatable |
| Weekly | Resets every 7 days, higher rewards |
| Guild | Shared progress across guild members (post-v0.1) |
| Achievement | One-time, triggered by milestones (kill X, reach level Y) |

### Data Models

```
QuestDefinition (content YAML):
  id: string
  name: string
  description: string
  type: string (story, side, daily, weekly, guild, achievement)
  level_requirement: integer
  class_requirement: string?  # null = any class
  prerequisite_quests: string[]  # quest IDs that must be completed first
  repeatable: boolean
  reset_period: string?  # "daily", "weekly", null

  objectives:
    - id: string
      type: string (kill, collect, interact, reach_location, complete_instance, skill_level)
      target: string  # enemy ID, item ID, NPC ID, instance ID, skill ID
      count: integer
      description: string

  rewards:
    xp: integer
    currency: { type: string, amount: integer }[]
    items: { item_id: string, quantity: integer }[]
    skill_xp: { skill_id: string, amount: integer }[]?
    reputation: { faction: string, amount: integer }[]?
    unlocks: string[]  # quest IDs, instance IDs, feature flags

  dialogue:
    offer: string  # dialogue file reference (NPC dialogue when offering quest)
    in_progress: string  # while quest active
    complete: string  # on turn-in

CharacterQuest (database):
  character_id: UUID
  quest_id: string
  status: string (available, active, completed, failed, abandoned)
  objective_progress: JSON  # { "obj_1": 3, "obj_2": 0 }
  accepted_at: timestamp?
  completed_at: timestamp?
  last_reset: timestamp?  # for dailies/weeklies
```

---

## SECTION 15: DIALOGUE & AI NARRATIVE SYSTEM

### Dialogue System

Dialogue authored in YAML as branching trees. NPCs reference dialogue files by ID.

```yaml
# content/dialogue/example_vendor.yaml
id: string
speaker: string  # NPC name
portrait: string  # asset reference

nodes:
  - id: start
    text: ""  # creative director writes the actual line
    responses:
      - text: ""  # player response option
        next: node_id  # next dialogue node
        action: string?  # system action (open_shop, open_repair, open_quest)
        condition: string?  # expression (e.g., "player.has_damaged_equipment")
      - text: ""
        next: null  # ends conversation

  - id: node_2
    text: ""
    responses:
      - text: ""
        next: node_id
```

### Dynamic Text Interpolation

Dialogue text supports template variables:
- `{player.name}` — character name
- `{player.class}` — class name
- `{player.level}` — current level
- `{calculated_value}` — runtime-computed value (e.g., repair cost)
- `{nemesis.name}` — current nemesis reference
- `{daily_atmosphere}` — injected from atmosphere engine

### Atmosphere Engine

The creative director seeds daily flavor content from the admin portal:

```
Admin Portal → Creative director writes a "daily broadcast"
  (a few sentences or keywords that set the world's current tone/mood)

System Behavior:
  - Broadcast stored in database with timestamp
  - NPCs with "ambient_chatter" flag pull from current broadcast theme
  - Town visual/audio flags can change based on broadcast metadata
  - Background chatter pool rotates based on current theme
  - Broadcast expires after 24h or when replaced
```

### AI-Driven Living World

Two tiers of narrative content:

| Tier | Authoring | Examples |
|------|-----------|---------|
| Hand-authored | Creative director writes | Key storylines, quest dialogue, major NPC conversations |
| AI-generated | Server-side LLM (Claude API or similar) | Ambient NPC chatter, daily flavor text, reactive commentary on world events |

**World event triggers** for AI chatter:
- Boss killed → NPCs discuss it
- Economy shifts → merchants comment
- Player achievements → guards mention rumors
- Creative director injects themes/memes/tone from admin console

**Implementation:**
- Server-side LLM generates chatter pools on schedule or event trigger
- Chatter stored in Redis with TTL (time-to-live)
- NPCs pull from current pool
- Generated text filtered before entering pool

**Guard Rails:**
- Length limit: max 100 characters per chatter line
- Content filter: reject any text violating policy
- Tone consistency: regenerate if tone mismatches creative director's configuration
- Manual review option: creative director can preview and approve before broadcast
- Budget cap: limit LLM API calls per day to control costs
- Fallback: if LLM unavailable, serve from static chatter pool defined in content YAML

---

## SECTION 16: NPC & ENTITY SYSTEM

### Unified Entity Model

Players, NPCs, and enemies share the same base structure for rendering (6-layer sprite compositing) but have different behavior and data models.

```
Entity (runtime, in Colyseus room state):
  id: string
  type: string (player, npc, enemy, boss, nemesis)
  name: string
  position: { x: float, y: float }
  direction: string (S, SE, E, NE, N, SW, W, NW)
  animation_state: string (idle, walk, attack, cast, hit, death)
  animation_progress: float (0.0-1.0)

  # Sprite layers (same system as players)
  base_body: string  # variant ID
  back_item: string?
  headwear: string?
  hand_main: string?
  hand_off: string?
  vfx: string?

  # Combat stats
  current_hp: integer
  max_hp: integer
  level: integer
  target_id: string?
  is_alive: boolean

  # NPC-specific
  npc_type: string?  # vendor, quest_giver, guard, ambient
  dialogue_id: string?
  shop_inventory: string?
  vendor_stall: VendorStall?  # for player-run stalls

  # Enemy-specific
  ai_behavior: string?  # patrol, guard, aggressive, passive
  aggro_range: float?
  leash_range: float?  # max distance from spawn before resetting
  loot_table: string?
  nemesis_id: UUID?
```

### NPC Definitions (Content YAML)

```yaml
id: string
name: string
type: string  # vendor, quest_giver, ambient, guard
location: { zone: string, x: float, y: float }
direction: string
body_variant: string
equipment:
  headwear: string?
  hand_main: string?
  back_item: string?
dialogue: string  # dialogue file ID
shop: string?  # shop definition ID
ambient_chatter: boolean  # participates in atmosphere engine
```

### Enemy Definitions (Content YAML)

```yaml
id: string
name: string
body_variant: string
level_range: [min, max]
base_stats:
  hp: integer
  damage: integer
  armor: integer
ai_behavior: string  # aggressive, patrol, guard, passive
aggro_range: float
leash_range: float
abilities:
  - id: string
    cooldown_ms: integer
    damage: integer?
    type: string?  # attack, buff, heal
equipment_pool:  # random visual variety per spawn
  hand_main: [string, string, ...]
  headwear: [null, string, ...]
loot_table: string
can_become_nemesis: boolean
```

---

## SECTION 17: ECONOMY & TRADING

### Currency Types

| Currency | Earned From | Spent On |
|----------|------------|----------|
| Primary | Enemy drops, quest rewards, selling items, vendor stalls | Repairs, NPC shops, trading, crafting |
| Instance tokens | Instance completion (scaled by difficulty) | Instance-specific gear, materials |
| PvP currency (future) | PvP instance rewards | PvP gear, cosmetics |

Currency names and additional types are defined in content YAML. The system supports any number of currencies.

### Player Vendor Stalls

```
VendorStall:
  owner_id: UUID (character)
  position: { x, y }  # location in town
  is_active: boolean  # only while player is online and in vendor mode
  stall_name: string  # player-defined
  items_for_sale:
    - item_id: UUID
      price: integer (primary currency)
      quantity: integer

Lifecycle:
  - Player opens stall UI in town → sets items and prices
  - Player enters "vendor mode" (AFK, stall visible to other players)
  - Other players browse and purchase
  - When player logs off or leaves vendor mode → stall disappears
  - Transaction log saved to database
```

### Direct Trading

- Both players in town, Player A initiates trade with Player B
- Trade window: each side adds items + currency
- Both confirm → atomic database transaction (PostgreSQL transaction ensures consistency)
- **Bound items cannot be traded** — server rejects them from trade window
- All trades logged for moderation/abuse detection

```
TradeLog:
  id: UUID
  timestamp: timestamp
  player_a: UUID
  player_b: UUID
  items_a_to_b: Item[]
  items_b_to_a: Item[]
  currency_a_to_b: JSON
  currency_b_to_a: JSON
```

### Economic Feedback Controls

Server tracks total currency in circulation per type. Automated adjustments within creative-director-defined bounds:

- Drop rate scaling (reduce if inflation detected)
- Repair cost adjustment
- NPC price adjustment
- Velocity tracking (how fast currency moves)

### Gold Sinks

- Repairs (durability restoration)
- Consumables (potions, buffs)
- Vendor stall fees (per-day listing fee)
- Currency-gated instance access (entry fee for high-tier content)
- Cosmetic purchases (skins, emotes)

**Design target:** Currency supply grows at roughly the same rate as player count. No runaway inflation.

### Admin Portal Economy Dashboard

- Currency supply monitoring (total in circulation per type)
- Velocity tracking (transactions per hour)
- Top holders list
- Trade volume
- Inflation alerts (configurable thresholds)

---

## SECTION 18: CHAT SYSTEM

### Channels

| Channel | Scope | Notes |
|---------|-------|-------|
| Say | Nearby players (~30m radius) | Local proximity chat |
| Party | Current party members | Private |
| Guild | Guild members | Private |
| Zone | Everyone in current zone/instance | Public within zone |
| Global | Server-wide | Throttled (max 1 msg/5s) |
| Whisper | Direct message to one player | Private 1:1 |
| System | Server announcements | Read-only for players |

Channel colors configurable by each player in UI settings.

### Message Routing

- **Say, Party, Zone:** Routed through Colyseus room state for instant delivery
- **Global, Whisper:** Redis pub/sub for cross-room delivery
- **History:** Last 100 messages per channel per zone stored in database

### Moderation

- Profanity filter (regex-based, configurable word list in admin portal)
- Rate limiting: 10 messages/minute per player per channel
- Admin moderation: mute, kick, ban commands
- Chat log viewer in admin portal

### Emotes

Emotes trigger character animations and/or chat messages:
```
/emote_name → character plays animation + "[PlayerName] performs emote."
```
Emote definitions in content YAML — new emotes added without code changes.

---

## SECTION 19: TOWN & SHARED SPACES

### Town Architecture

The town is a shared, non-instanced space. It is **designed** (not procedurally generated) — the creative director designs the layout and NPC placement. The town is the social hub between instance runs.

### Isometric Camera with Zoom

- Default view: standard isometric perspective centered on player
- Zoom out: camera pulls back, revealing more of the town and other players
- Zoom in: tighter focus on immediate area
- Smooth zoom transition (not discrete steps)
- At maximum zoom-out: minimap-like overview of the entire town

### Town Activities

| Activity | System |
|----------|--------|
| Repair equipment | NPC vendor (durability system) |
| Buy/sell items | NPC shops (content-defined inventories) |
| Trade with players | Direct trading system |
| Set up vendor stall | Player vendor stall system |
| Accept/turn in quests | Quest NPCs |
| Select instances | Instance Board UI |
| Manage skills | Skill management UI |
| Adjust equipment/mods | Inventory/equipment UI |
| Chat and socialize | Chat system |
| Guild management | Guild UI (post-v0.1) |
| Crafting | Crafting stations (post-v0.1) |

### Town as TownRoom

- Persistent Colyseus room (always running)
- 10Hz tick rate (no combat in town)
- Max 100 players per town instance
- If > 100, spawn additional TownRoom instances (sharding)
- Players see all other players in their TownRoom instance

---

## SECTION 20: ADMIN PORTAL

### Architecture

- **Standalone React web application** (TypeScript)
- **Authenticated** — only accounts with `is_admin = true`
- **Same REST API backend** as game client, plus admin-only endpoints
- **Separate deployment** but same monorepo

### Feature Set

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Online player count, active instances, server health, error logs, key metrics |
| **Content Manager** | Form-based CRUD for items, NPCs, enemies, quests, instances. Matches YAML schema. Save → hot reload. |
| **Atmosphere Engine** | Write daily broadcast, set AI tone themes (dark, humorous, ominous, celebratory), inject memes/references, preview NPC chatter, approve/reject before broadcast, schedule future broadcasts |
| **AI Narrative Controls** | Configure LLM chatter generation, set tone, preview generated dialogue, historical view of past broadcasts |
| **Player Management** | Search players, view character details, inventory, quest progress, ban/mute |
| **Moderation** | Chat log viewer, report queue, mute/kick/ban controls |
| **Economy Monitor** | Currency supply, velocity, top holders, trade volume, inflation alerts |
| **Nemesis Browser** | Search/filter nemesis entities, view encounter history, manually create story nemeses |
| **Instance Monitor** | Active instances, player counts per instance, average completion times |
| **Asset Preview** | Browse generated sprites, view manifest, preview layer composites |

### Content Editing Workflow

```
Creative director in admin portal:
  → Opens content section (e.g., "Items")
  → Clicks "New" or selects existing entry
  → Form with fields matching content YAML schema
  → Fills in / edits fields, selects asset variant references
  → Clicks "Save"
  → System writes YAML file + triggers hot reload
  → Content immediately available in-game
```

---

## SECTION 21: DISCONNECT & RECOVERY

### Connection Grace Period

Colyseus `allowReconnection(30)` provides 30-second grace for dropped connections.

### InstanceRoom Handling

- Player slot held for 30 seconds
- Character becomes AI-controlled (defensive stance — block, no attack) during disconnection
- On reconnect within 30s: state restored, loot preserved, party slot maintained
- After 30s timeout: character removed from instance, loot dropped to ground for party

### TownRoom Handling

Seamless reconnection, position restored from last state. No penalty.

### Server Crash Recovery

- InstanceRoom state snapshotted to Redis every 60 seconds
- On pod restart, rooms can be reconstructed from snapshot
- Accept that up to 60 seconds of progress may be lost
- **Critical state saved to PostgreSQL in real-time:** inventory changes, quest progress, XP gains are written to the database as they happen (not just on instance completion). Redis snapshots cover combat position/enemy state.

---

## SECTION 22: ASSET VERSIONING & CACHING

### Versioning Strategy

Asset manifest includes version hash per asset. CDN URLs include hash:
```
/assets/v{hash}/weapons/sword_variant_SE.png
```

### Client Behavior

1. Client checks manifest version on connect
2. If manifest changed, invalidates cached assets for changed entries only
3. Unchanged assets served from browser cache

### New Asset Deployment

```
Upload new/changed assets to CDN
  → Update manifest with new version hashes
  → Clients lazy-load new assets on next scene load
```

**Benefits:** Zero downtime asset updates, browser cache utilization, partial updates only.

---

## SECTION 23: TESTING & OBSERVABILITY

### Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| Unit tests | Jest | Shared types, game logic, damage formulas, skill calculations, XP curves |
| Integration tests | Jest + Supertest | Colyseus room lifecycle, REST API endpoints, database operations |
| Load testing | Artillery or k6 | Concurrent WebSocket connections. Target: 100 concurrent per pod. |
| Client testing | Phaser scene smoke tests | Sprite compositor unit tests, animation state machine |

### Observability

| Component | Tool | Purpose |
|-----------|------|---------|
| Structured logging | Winston or Pino | JSON output to Google Cloud Logging |
| Metrics | Prometheus-compatible | Player count, room count, tick duration, API latency |
| Alerting | PagerDuty or similar | Server crashes, high error rates, economy anomalies |
| Client errors | Sentry or similar | Browser-side error reporting |

---

## SECTION 24: DEPLOYMENT ARCHITECTURE

### Google Cloud Infrastructure

```
Google Cloud Project
├── GKE Cluster (Google Kubernetes Engine)
│   ├── Game Server Pod(s) — Colyseus + REST API
│   │   └── Horizontal Pod Autoscaler (scale by CPU/connections)
│   ├── Admin Portal Pod
│   └── Redis Pod (or Cloud Memorystore)
├── Cloud SQL (PostgreSQL)
│   └── Primary instance + read replica for analytics
├── Cloud Storage Bucket
│   └── /assets/ — sprite atlases, audio (CDN-enabled via Cloud CDN)
├── Cloud Load Balancer
│   ├── HTTPS → REST API + Admin Portal
│   └── WSS → Colyseus (sticky sessions for WebSocket persistence)
└── Cloud Build (CI/CD pipeline)
    └── Push to main → build → test → deploy to GKE
```

### Cost Estimation

| Stage | Infrastructure | Estimated Cost |
|-------|---------------|---------------|
| v0.1 (friends & testing) | Single pod, single DB | ~$50–100/month |
| Growth (up to 100 concurrent) | 2–3 pods, managed Redis | ~$150–300/month |
| Mature (hundreds+) | 10+ pods, read replicas | ~$500–1000/month |

### Scaling Strategy

- **Horizontal:** Add game server pods as load increases
- **Database:** Read replicas for query scaling, writes to primary
- **Redis:** Sharding via Memorystore cluster mode (optional)
- **Assets:** CDN caching handles traffic spikes with no infrastructure changes

### Local Development

**No cloud dependency for development.** Docker Compose setup:
- PostgreSQL container
- Redis container
- Client dev server (Vite, hot reload)
- Game server (tsx, watch mode)
- Admin portal dev server

---

## SECTION 25: CONTENT FILE STRUCTURE

All game content lives in YAML files organized by type. A build step converts YAML → JSON for the game engine. Hot reload watches for file changes during development.

```
content/
├── classes/           # Class definitions, native skills, starting stats
├── races/             # Race stats, appearance options, descriptions
├── backgrounds/       # Background lore, minor stat bonuses
├── attributes/        # Attribute definitions, names, descriptions, derived stat formulas
├── skills/            # Skill definitions, progression curves, threshold unlocks
├── abilities/         # Ability definitions, damage formulas, cooldowns
├── items/
│   ├── weapons/       # Weapon item definitions
│   ├── armor/         # Armor item definitions
│   ├── backpacks/     # Backpack item definitions
│   ├── mods/          # Mod item definitions (skill affinity grants)
│   └── consumables/   # Potions, buffs, etc.
├── enemies/           # Enemy definitions, stats, AI behavior, equipment pools
├── npcs/              # NPC definitions, locations, shops, dialogue references
├── instances/         # Dungeon/instance templates (layout, enemies, bosses, loot)
├── quests/
│   ├── main/          # Main story quest chains
│   ├── side/          # Side quests
│   ├── daily/         # Daily repeatable quests
│   └── weekly/        # Weekly repeatable quests
├── dialogue/          # Branching dialogue trees
├── loot_tables/       # Treasure tables (item pools, drop rates, scaling)
├── emotes/            # Emote definitions (animations, chat messages)
├── difficulty/        # Difficulty affixes and scaling parameters
├── atmosphere/        # Static chatter pools, broadcast templates
├── shops/             # NPC shop inventories
├── formulas/          # Derived stat formulas, XP curves, capacity formulas
└── currencies/        # Currency type definitions
```

### Why YAML Over JSON for Authoring

- Comments allowed (JSON has no comments)
- No trailing comma issues
- Multi-line strings are natural (dialogue text)
- More readable for non-developers
- AI agents generate valid YAML easily
- Build step validates schema and converts to JSON — catches errors before runtime

---

## SECTION 26: MONOREPO PROJECT STRUCTURE

```
project-root/
├── packages/
│   ├── client/              # Phaser 3 game client (TypeScript)
│   │   ├── src/
│   │   │   ├── scenes/      # Phaser scenes (boot, town, instance, ui)
│   │   │   ├── systems/     # sprite compositor, animation, input, camera
│   │   │   ├── ui/          # HTML/CSS overlay components
│   │   │   ├── network/     # Colyseus client, REST client
│   │   │   └── utils/
│   │   ├── public/
│   │   │   └── assets/      # built sprite atlases (gitignored, built locally)
│   │   └── package.json
│   │
│   ├── server/              # Colyseus game server + REST API (TypeScript)
│   │   ├── src/
│   │   │   ├── rooms/       # TownRoom, InstanceRoom
│   │   │   ├── systems/     # combat, skills, loot, nemesis, quest tracker
│   │   │   ├── api/         # REST endpoints (auth, characters, inventory, admin)
│   │   │   ├── database/    # PostgreSQL models, migrations
│   │   │   ├── generation/  # procedural generation (BSP)
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── admin/               # Admin portal web app (React/Preact + TypeScript)
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── shared/              # Shared TypeScript types & constants
│   │   ├── src/
│   │   │   ├── types/       # Entity, Item, Skill, Quest, etc.
│   │   │   ├── constants/   # game balance constants
│   │   │   └── schemas/     # Colyseus schema definitions
│   │   └── package.json
│   │
│   └── content-pipeline/    # YAML → JSON build tool + asset manifest tooling
│       ├── src/
│       └── package.json
│
├── content/                 # All YAML content files (see Section 25)
├── assets/                  # Raw generated PNGs from ComfyUI pipeline (gitignored)
├── docker/                  # Dockerfiles for server, admin
├── docker-compose.yml       # Local dev environment
├── .github/                 # CI/CD workflows (GitHub Actions)
├── package.json             # Workspace root (npm workspaces)
├── tsconfig.base.json       # Root TypeScript config
└── README.md
```

---

## SECTION 27: v0.1 SCOPE DEFINITION

### Included

- [ ] Account system (email + password, no OAuth)
- [ ] Character creation (1 race, 3–4 classes, basic appearance options)
- [ ] Town zone (static layout, basic NPCs — vendor, quest giver, instance board)
- [ ] 1 instance template (procedurally generated, 3–5 enemy types, 1 boss)
- [ ] 5-player party system (manual invite, no matchmaking)
- [ ] Tab-target combat with 3–5 abilities per class
- [ ] Skill system (3–5 skills per class with level thresholds)
- [ ] Basic inventory (equip/unequip, loot pickup, sell to NPC)
- [ ] 8 core attributes + derived stats
- [ ] Death penalty system (XP loss + durability)
- [ ] Gear with rarity tiers (no mod slots yet)
- [ ] Basic loot tables
- [ ] Party chat + zone chat
- [ ] Sprite compositing pipeline (all 6 layers, 8 directions)
- [ ] Tween animations (idle, walk, attack, hit, death)
- [ ] Admin portal (basic: content viewer, player list, atmosphere broadcast)
- [ ] Local dev environment with hot reload (Docker Compose)
- [ ] Disconnect recovery (30s grace period)
- [ ] Asset versioning with CDN hash

### Desktop-Only Optimizations (v0.1)

- Minimum 1280×720 resolution
- Rich keyboard+mouse input (modifier keys, 12+ hotbar slots, drag-and-drop, right-click menus, tooltips)
- Larger asset loading budget (2–4GB tab memory)
- Higher tick rate option (30Hz if needed)

### Deferred (Post-v0.1)

- OAuth login (Discord, Google)
- Matchmaking system
- Raids (10+ player instances)
- PvP (arenas, flagging)
- Crafting system
- Trading / vendor stalls
- Full nemesis system (basic version OK in v0.1)
- Guilds
- Daily/weekly quests (story + side quests in v0.1)
- Mod slot system on gear
- Multiple currencies (primary currency only in v0.1)
- Housing / personal spaces
- Mobile client
- Audio (music, SFX — placeholders only in v0.1)
- Spell cast keyframe animations (tween-only at v0.1)
- Multiple instance templates
- AI-driven NPC chatter (LLM integration)

---

## SECTION 28: SPRINT PLAN

### Sprint 0: Foundation (1 week)

- Initialize monorepo with npm workspaces
- TypeScript config + tooling (ESLint, Prettier)
- Local PostgreSQL + Redis setup (Docker Compose)
- Shared types package (core interfaces, enums)
- Content pipeline scaffold (YAML loader, JSON converter, file watcher)
- Phaser 3 client scaffold with boot scene + `phaser3-plugin-isometric`
- Colyseus server scaffold with empty room
- Admin portal shell (React, routing, auth gate)
- Initial content YAML templates (1 class, 1 enemy, 1 NPC, attribute definitions)

### Sprint 1: Rendering & Input (2 weeks)

- Asset manifest loader in Phaser
- Sprite compositor (6-layer stack, direction-dependent render order lookup)
- Anchor point system for equipment layer positioning
- Placeholder sprites (basic rectangles or first LoRA outputs)
- Character on screen with 8 directions + idle animation
- Isometric camera (pan, follow player, zoom)
- Keyboard input (WASD / arrow keys for movement)
- Mouse input (click for movement, click for target selection)

### Sprint 2: Database & Auth (2 weeks)

- Database schema + migrations (accounts, characters, inventory)
- REST API (Express or Fastify, JWT auth)
- Login + registration flow (client UI + API)
- Character creation API + client flow
- Colyseus TownRoom: players join, see each other, move around
- Client ↔ server position sync with interpolation
- Basic town scene with placeholder tilemap

### Sprint 3: Combat & Instances (2 weeks)

- Colyseus InstanceRoom architecture
- BSP procedural generator (rooms + corridors)
- Enemy entity spawning + basic AI (aggro, attack, leash, pathfinding)
- Tab-target system (client + server validation)
- Ability system: define abilities in YAML, activate in combat
- Server-authoritative damage calculation
- Death + respawn flow (XP penalty, durability loss)
- Instance completion detection
- Party system (invite, join, shared instance)

### Sprint 4: Progression & Inventory (2 weeks)

- Skill system: XP allocation, level-up, threshold ability unlocks
- Attribute system: 8 attributes, derived stats, recalculation on change
- Inventory system: capacity calculation, loot pickup, equip/unequip, sell to NPC
- Loot table system: enemies drop items based on tables + difficulty scaling
- Equipment ↔ sprite layer integration (equip item → see it on character)
- NPC shop (buy/sell interface)
- Gear durability + repair flow
- Basic quest system: accept, track objectives, complete, collect rewards

### Sprint 5: Content & Polish (2 weeks)

- Dialogue system with branching trees + variable interpolation
- Admin portal: content browser, atmosphere engine, player viewer
- Chat system (Say, Party, Zone channels)
- Instance difficulty selector (basic scaling + affixes)
- Death penalty tuning
- XP curve tuning
- Economy tuning (drop rates, prices, sinks)
- Placeholder audio hooks (no actual audio files)
- Performance pass: sprite atlasing, lazy loading, draw call optimization
- Disconnect recovery (30s grace, AI-controlled character during DC)
- Asset versioning (hash-based CDN URLs)
- GKE deployment + scaling tests
- Playtesting with creative director and friends

---

## SECTION 29: HUMAN-IN-THE-LOOP DECISION MAP

| Decision Point | Owner | Phase | Automation Level |
|---------------|-------|-------|-----------------|
| Art direction & visual identity | Creative Director | Phase 1 | None |
| LoRA epoch selection | Creative Director | Phase 2 | Human review of generated samples |
| Generated asset QA | Creative Director | Phase 3 | Batch review UI |
| Class preset composition | Creative Director | Phase 3 | Preview rendering |
| Cross-LoRA style consistency | Creative Director | Phase 2–3 | Automated composite + human review |
| Animation keyframe approval | Creative Director | Phase 3 | Preview playback |
| Game design (classes, skills, attributes) | Creative Director | Phase 1 | None |
| XP / economy tuning | Creative Director | Sprint 5 | Live adjustment with metrics |
| Atmosphere broadcasts | Creative Director | Post-launch | Admin portal |
| AI narrative tone configuration | Creative Director | Post-launch | Admin console |
| Content YAML authoring | Creative Director + AI | Phase 3+ | AI generation + human review |
| Playtesting & feel validation | Creative Director | Sprint 5 | Player feedback compilation |

---

## SECTION 30: OPEN QUESTIONS FOR CREATIVE DIRECTOR

These items require creative decisions before they can be implemented. **None block Sprint 0 or Sprint 1.** The technical framework is built to accept whatever content is provided.

1. **Names for the 8 core attributes** — the engine uses generic keys; display names come from content YAML
2. **Race list for v0.1** — at least 1 race with name, stat modifiers, and appearance options
3. **Class list for v0.1** — 3–4 classes with native skill lists and starting equipment
4. **Skill list per class** — what skills exist, what abilities they unlock at what thresholds
5. **Town layout** — rough sketch or description (NPC positions, instance board location, general flow)
6. **First instance theme** — environment, enemy types, boss encounter
7. **Appearance options per race** — body types, skin tones, hair styles available at character creation
8. **Item naming conventions** — how gear is named and described
9. **Mod slot thematic name** — implants, runes, gems, augments, or something else
10. **Equipment slot list** — head, body, back, main hand, off hand, boots, belt, rings, necklace — confirm or adjust
11. **Visual tone** — this sets the LoRA training direction and all art decisions
12. **Social feature priority** — matchmaking-focused or friend-group-focused

---

## SECTION 31: ARTIFACT GENERATION CHECKLIST

The complete Artifact Generation Checklist exists as a companion document (`Artifact_Generation_Checklist.md`). It is a QA tracking template used after generating training assets for each LoRA.

### Purpose

The AI Asset Generation Agent fills the checklist after generating all training assets. The creative director uses it to verify completeness, QA each asset, and hand the package to the development team.

### Checklist Sections

1. **Characters LoRA** — Base bodies, heads, body markings, full character references (for equipment bootstrapping)
2. **Equipment LoRA** — Torso/chest, legs, feet, waist/belt, shoulders, back items, headwear
3. **Weapons LoRA** — Main-hand weapons (by type × tier), off-hand items
4. **Environments LoRA** — Floor tiles, wall segments, props/objects, parallax backgrounds
5. **VFX LoRA** — Elemental effects (projectile/aura/impact/AoE), buff/debuff indicators
6. **UI Elements** — Skill icons, UI frames/panels (noting LoRA vs base Flux vs hand-crafted)
7. **Flagged Items** — Assets requiring creative director input, multiple attempts, or assumptions
8. **Manifest Integration** — Mapping approved assets to manifest layer + variant key

### Important Note on Granularity

The checklist tracks equipment at **finer granularity** (torso, legs, feet, waist, shoulders) than the runtime 6-layer compositing system. This is correct and intentional: the LoRA training data needs variety across body parts even though they are baked into `base_body` at runtime. The development team should understand that legs/feet/waist/shoulders are **training data categories**, not runtime sprite layers.

### Post-Checklist Workflow

1. Creative director QAs every image (Pass / Fail / Regen)
2. Failed images regenerated with adjusted prompts or seeds
3. Approved images + captions go into LoRA training datasets
4. Train each pending LoRA
5. Test trained LoRAs by generating production assets via ComfyUI isolated part workflow
6. Update asset manifest with final variant entries
7. Hand architecture document + trained LoRAs + manifest + content guide to development team

---

## APPENDIX A: ASSET MANIFEST SCHEMA

The asset manifest is a JSON file that serves three roles:

- **Generation source of truth:** The orchestration script reads it to know what to generate and how
- **Engine runtime config:** Phaser reads it to know how to composite and render characters
- **Content management:** Adding new content = adding entries to the manifest. No code changes.

### Schema Structure

```json
{
  "project": { "name": "string", "version": "string", "author": "string" },
  "style": {
    "lora_refs": {},
    "art_direction": "string",
    "trigger_word": "string"
  },
  "layer_definitions": [
    {
      "layer_index": 0,
      "name": "base_body",
      "nullable": false,
      "render_order": { "S": 0, "SE": 0, "E": 0, "NE": 0, "N": 0 },
      "anchor_positions": {
        "body_type_a": {
          "S": { "x": 0.5, "y": 0.5 },
          "SE": { "x": 0.55, "y": 0.5 }
        }
      }
    }
  ],
  "variant_entries": [
    {
      "layer": "hand_main",
      "variant_id": "example_sword",
      "description": "string — creative director writes this",
      "tags": ["weapon", "melee"],
      "directions_required": ["S", "SE", "E", "NE", "N"],
      "asset_paths": {
        "S": "sprites/hand_main/example_sword_S.png"
      }
    }
  ],
  "class_presets": [
    {
      "class_id": "string",
      "layers": {
        "base_body": "variant_id",
        "hand_main": "variant_id",
        "headwear": null
      }
    }
  ],
  "pipeline_config": {
    "canvas_size": 1024,
    "sampler": "euler",
    "steps": 20,
    "cfg": 1.0,
    "lora_strength": 0.85,
    "background_removal": "inspyrenet"
  }
}
```

A complete reference manifest should be created as a companion file once content decisions are made.

---

## APPENDIX B: COMFYUI WORKFLOW REFERENCE

### Isolated Part Workflow

For weapons, headwear, VFX, back items:

1. Load Flux Model (checkpoint)
2. Load LoRA (appropriate category)
3. DualCLIPLoader (Flux CLIP encoder)
4. CLIP Encode (prompt text)
5. KSampler (euler, 20 steps, cfg=1.0, LoRA strength=0.85)
6. VAE Decode
7. Inspyrenet Rembg (remove background)
8. Save PNG

### Body-Relative Workflow

For equipment that must align to body (chest, arms):

1–6: Same as Isolated Part
7. SAM Segment (segment target region from reference body)
8. Inspyrenet Rembg
9. Save PNG

JSON exports of both workflows exist as companion files.

---

## APPENDIX C: RESEARCH REFERENCES & BENCHMARKS

### Key Technical Findings

- Phaser 3.60+ handles 15,000+ texture binds at 60fps on mobile (desktop significantly more)
- `phaser3-plugin-isometric` (updated Dec 2024) provides axonometric projection + physics
- Colyseus official Phaser tutorial covers prediction + reconciliation
- No existing open-source game combines isometric + multiplayer + Phaser 3 — novel combination
- Browser-based isometric MMOs are a largely empty niche since Flash era
- Colyseus supports 5,000+ concurrent on single dedicated server (benchmarked)

### Performance Benchmarks

| Metric | Value |
|--------|-------|
| Phaser 3 optimized bundle | ~150KB (gzipped) |
| Colyseus room state delta | Typically <100 bytes/tick |
| LoRA training (RTX 4080) | ~30 minutes per epoch (30 repeats/image) |
| ComfyUI generation | ~5–10 seconds per image (20 steps, Flux Dev) |
| Characters on screen target | 50+ (each with 6 composited layers) |
| Draw calls per frame | ~300 (Phaser batches same-texture sprites) |
| Texture memory budget | ~200MB loaded (lazy-loaded per area) |
| Target framerate | 60fps desktop |

### Community & Ecosystem

- Phaser 3 has the largest hiring pool for web game developers
- TypeScript adoption: standard across modern web game studios
- Flux.1 Dev is production-ready with LoRA support
- ComfyUI ecosystem is mature with hundreds of community nodes

---

*End of Game Architecture Specification v3.0*
