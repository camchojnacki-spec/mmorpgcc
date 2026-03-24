# Artifact Generation Checklist

**Purpose:** The AI Asset Generation Agent fills this checklist out completely after generating all training assets. The creative director uses it to verify completeness, QA each asset, and hand the package to the development team.

**Instructions for the AI Agent:** Copy this template. Fill every row. Do not leave blank cells. If an asset was not generated, explain why in the Notes column. Flag uncertainties.

---

## Summary

| Metric | Target | Actual |
|--------|--------|--------|
| Characters LoRA images | 30-50 | ___ |
| Equipment LoRA images | 30-40 | ___ |
| Weapons LoRA images | 25-35 | ___ |
| Environments LoRA images | 30-40 | ___ |
| VFX LoRA images | 25-30 | ___ |
| UI elements | 20-30 | ___ |
| **Total training images** | **160-225** | ___ |
| Caption files (.txt) | = total images | ___ |
| Missing / flagged assets | 0 | ___ |

---

## 1. Characters LoRA

### 1A. Base Bodies

| # | Asset ID | Variant Name | Body Type | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-----------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 4 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 1 per race × body_type combination (at least 4 for a single race with small/medium/large + gendered variants)

### 1B. Heads

| # | Asset ID | Variant Name | Gender | Hair | Expression | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|--------|------|------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** Enough variety for character creation — at least 6-8 head variants (3-4 per gender, diverse hair styles)

### 1C. Body Details / Markings

| # | Asset ID | Variant Name | Type | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 2-4 options (tattoos, war paint, scars, arcane marks) plus a "none" option

### 1D. Full Character References (for equipment/weapon bootstrapping)

| # | Asset ID | Class | Full Description | Filename | Caption File | Seed | Used to Bootstrap | QA Status | Notes |
|---|----------|-------|-----------------|----------|-------------|------|-------------------|-----------|-------|
| 1 | | | | | | | ☐ Equipment ☐ Weapons | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | ☐ Equipment ☐ Weapons | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Purpose:** These full-character images are generated with the existing character LoRA and then segmented to extract isolated equipment/weapon pieces for training the pending LoRAs.

---

## 2. Equipment LoRA

### 2A. Torso / Chest Armor

| # | Asset ID | Variant Name | Armor Class | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Cloth ☐ Light ☐ Medium ☐ Heavy | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Cloth ☐ Light ☐ Medium ☐ Heavy | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | ☐ Cloth ☐ Light ☐ Medium ☐ Heavy | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 4 | | | ☐ Cloth ☐ Light ☐ Medium ☐ Heavy | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** At least 1 per armor class per playable class (e.g., 4 classes × 1 starter + 1 mid-tier = 8)

### 2B. Legs

| # | Asset ID | Variant Name | Armor Class | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 3-4 variants (cloth pants, leather pants, chain leggings, plate greaves)

### 2C. Feet

| # | Asset ID | Variant Name | Armor Class | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 3 variants (cloth sandals, leather boots, plate greaves)

### 2D. Waist / Belt

| # | Asset ID | Variant Name | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 2-3 variants (utility belt, cloth sash, mechanical belt)

### 2E. Shoulders

| # | Asset ID | Variant Name | Armor Class | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 2-3 variants plus "none" option (many classes don't use shoulders)

### 2F. Back Items (Capes / Cloaks / Packs)

| # | Asset ID | Variant Name | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 2-3 variants plus "none" (cloak, quiver, backpack)

### 2G. Headwear

| # | Asset ID | Variant Name | Hides Hair? | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-------------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Yes ☐ No | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Yes ☐ No | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | ☐ Yes ☐ No | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 3-4 variants plus "none" (full helm, hood, circlet, hat)

---

## 3. Weapons LoRA

### 3A. Main-Hand Weapons

| # | Asset ID | Variant Name | Weapon Type | Tier | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-------------|------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | ☐ Common ☐ Rare ☐ Legendary | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | ☐ Common ☐ Rare ☐ Legendary | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | | ☐ Common ☐ Rare ☐ Legendary | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 4 | | | | ☐ Common ☐ Rare ☐ Legendary | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 1 per weapon type × at least 2 tiers (e.g., 4 weapon types × 2 tiers = 8 images minimum)

### 3B. Off-Hand Items

| # | Asset ID | Variant Name | Item Type | Class Tags | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|-------------|-----------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Shield ☐ Tome ☐ Orb ☐ Other | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Shield ☐ Tome ☐ Orb ☐ Other | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required:** 2-3 off-hand variants plus "none" option

---

## 4. Environments LoRA

### 4A. Floor Tiles

| # | Asset ID | Zone | Tile Type | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|------|-----------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Ground ☐ Path ☐ Special | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Ground ☐ Path ☐ Special | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

### 4B. Wall Segments

| # | Asset ID | Zone | Wall Type | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|------|-----------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

### 4C. Props and Objects

| # | Asset ID | Zone | Prop Type | Interactive? | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|------|-----------|-------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | | ☐ Yes ☐ No | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | ☐ Yes ☐ No | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

### 4D. Parallax Backgrounds

| # | Asset ID | Zone | Layer Depth | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Far ☐ Mid ☐ Near | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Far ☐ Mid ☐ Near | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required for environments total:** 30-40 across all sub-categories

---

## 5. VFX LoRA

### 5A. Elemental Effects

| # | Asset ID | Element | Effect Type | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|---------|------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Projectile ☐ Aura ☐ Impact ☐ AoE | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Projectile ☐ Aura ☐ Impact ☐ AoE | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 3 | | | ☐ Projectile ☐ Aura ☐ Impact ☐ AoE | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

### 5B. Buff / Debuff Indicators

| # | Asset ID | Effect Name | Positive/Negative | Description | Filename | Caption File | Seed | QA Status | Notes |
|---|----------|------------|-------------------|-------------|----------|-------------|------|-----------|-------|
| 1 | | | ☐ Buff ☐ Debuff | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | ☐ Buff ☐ Debuff | | | | | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required for VFX total:** 25-30 across all sub-categories

---

## 6. UI Elements

### 6A. Skill Icons

| # | Asset ID | Skill Name | Class | Element/Type | Description | Filename | Caption File | Method | QA Status | Notes |
|---|----------|-----------|-------|-------------|-------------|----------|-------------|--------|-----------|-------|
| 1 | | | | | | | | ☐ LoRA ☐ Base Flux ☐ Hand-crafted | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | | | | | | | ☐ LoRA ☐ Base Flux ☐ Hand-crafted | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

### 6B. UI Frames and Panels

| # | Asset ID | Element Type | Description | Filename | Caption File | Method | QA Status | Notes |
|---|----------|-------------|-------------|----------|-------------|--------|-----------|-------|
| 1 | | ☐ Inventory ☐ Tooltip ☐ Health Bar ☐ Minimap ☐ Other | | | | ☐ LoRA ☐ Base Flux ☐ Hand-crafted | ☐ Pass ☐ Fail ☐ Regen | |
| 2 | | ☐ Inventory ☐ Tooltip ☐ Health Bar ☐ Minimap ☐ Other | | | | ☐ LoRA ☐ Base Flux ☐ Hand-crafted | ☐ Pass ☐ Fail ☐ Regen | |
| _Add rows as needed_ |

**Minimum required for UI total:** 20-30 across all sub-categories. Note which were generated via LoRA vs base Flux vs hand-crafted — this informs whether a UI LoRA is worth training.

---

## 7. Flagged Items

List every asset where the AI agent made an assumption, needs creative director input, or anticipates generation difficulty.

| # | Asset ID | Category | Flag Type | Description of Issue | Recommended Action |
|---|----------|----------|-----------|---------------------|-------------------|
| 1 | | | ☐ Assumption ☐ Needs Input ☐ Difficult ☐ Multiple Attempts | | |
| 2 | | | ☐ Assumption ☐ Needs Input ☐ Difficult ☐ Multiple Attempts | | |
| _Add rows as needed_ |

---

## 8. Manifest Integration Reference

After QA passes, these assets map to the asset manifest JSON. For each approved asset:

| Asset ID | Manifest Layer | Manifest Variant Key | Prompt Used | Tags |
|----------|---------------|---------------------|-------------|------|
| | | | | |
| _Add rows as needed_ |

This table bridges the training data to the runtime manifest, ensuring every approved asset has a corresponding entry in the game's asset system.

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Creative Director | | | ☐ Approved ☐ Revisions Needed |
| AI Asset Agent | | | ☐ Complete ☐ Partial — see flagged items |
| QA Review | | | ☐ All Pass ☐ Regens Needed (count: ___) |

---

**Post-Checklist Workflow:**
1. Creative director QAs every image (Pass / Fail / Regen)
2. Failed images get regenerated with adjusted prompts or seeds
3. Approved images + captions go into LoRA training datasets
4. Train each pending LoRA (equipment, weapons, environments, VFX, UI if needed)
5. Test trained LoRAs by generating production assets via ComfyUI isolated part workflow
6. Update asset manifest JSON with final variant entries
7. Hand architecture document + trained LoRAs + manifest + content guide to development team
