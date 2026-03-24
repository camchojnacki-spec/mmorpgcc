-- Threshold MMORPG Database Schema
-- PostgreSQL 16+
-- Source: D2 Character Systems, D4 Game Systems

-- ── Accounts ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS accounts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(32) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login    TIMESTAMPTZ,
  is_banned     BOOLEAN DEFAULT FALSE
);

-- ── Characters ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name            VARCHAR(20) UNIQUE NOT NULL,
  class_id        VARCHAR(16) NOT NULL,  -- sentinel, catalyst, conduit
  race_id         VARCHAR(16) NOT NULL,  -- baseline, threaded
  background_id   VARCHAR(32) NOT NULL,

  -- Appearance
  body_type       VARCHAR(16),
  skin_tone       SMALLINT DEFAULT 0,
  hair_style      VARCHAR(32),
  hair_color      SMALLINT DEFAULT 0,
  facial_features SMALLINT DEFAULT 0,
  markings        VARCHAR(32),

  -- Progression
  level           SMALLINT DEFAULT 1,
  current_xp      INTEGER DEFAULT 0,

  -- Attributes (8 core)
  soma            SMALLINT NOT NULL,
  reflex          SMALLINT NOT NULL,
  vigor           SMALLINT NOT NULL,
  cortex          SMALLINT NOT NULL,
  resolve         SMALLINT NOT NULL,
  acuity          SMALLINT NOT NULL,
  presence        SMALLINT NOT NULL,
  phlux           SMALLINT NOT NULL,
  free_attribute_points SMALLINT DEFAULT 0,

  -- Faction standing
  civic_status          VARCHAR(16) DEFAULT 'conditional',
  directorate_standing  INTEGER DEFAULT 0,
  unbound_standing      INTEGER DEFAULT 0,
  directorate_suspicion REAL DEFAULT 0.0,

  -- Location
  current_zone    VARCHAR(64) DEFAULT 'town_hub',
  position_x      REAL DEFAULT 10.0,
  position_y      REAL DEFAULT 10.0,
  direction       VARCHAR(4) DEFAULT 'S',

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_login      TIMESTAMPTZ,

  CONSTRAINT valid_class CHECK (class_id IN ('sentinel', 'catalyst', 'conduit')),
  CONSTRAINT valid_race CHECK (race_id IN ('baseline', 'threaded')),
  CONSTRAINT valid_civic CHECK (civic_status IN ('standard', 'conditional', 'authorized', 'suspended'))
);

CREATE INDEX idx_characters_account ON characters(account_id);
CREATE INDEX idx_characters_name ON characters(name);

-- ── Character Skills ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS character_skills (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_id        VARCHAR(32) NOT NULL,
  current_level   SMALLINT DEFAULT 0,
  current_xp      INTEGER DEFAULT 0,
  effective_mult  REAL DEFAULT 1.0, -- after gear/Sequence adjustments

  UNIQUE (character_id, skill_id)
);

CREATE INDEX idx_char_skills ON character_skills(character_id);

-- ── Unlocked Abilities ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS character_abilities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  ability_id      VARCHAR(64) NOT NULL,
  skill_id        VARCHAR(32) NOT NULL,
  unlocked_at     TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (character_id, ability_id)
);

CREATE INDEX idx_char_abilities ON character_abilities(character_id);

-- ── Inventory ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS item_instances (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  definition_id   VARCHAR(64) NOT NULL,
  rarity          VARCHAR(16) DEFAULT 'common',
  rarity_source   VARCHAR(16),           -- dropped, crafted
  level_req       SMALLINT DEFAULT 1,
  durability_cur  SMALLINT DEFAULT 100,
  durability_max  SMALLINT DEFAULT 100,
  is_bound        BOOLEAN DEFAULT FALSE,
  is_equipped     BOOLEAN DEFAULT FALSE,
  equip_slot      VARCHAR(16),            -- null if in bag
  bag_position    SMALLINT,               -- position in inventory grid
  sequence_slots  JSONB DEFAULT '[]',     -- [{slotType, sequenceId}]
  random_affixes  JSONB DEFAULT '[]',     -- [{stat, value}]
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  source          VARCHAR(64)
);

CREATE INDEX idx_items_owner ON item_instances(owner_id);
CREATE INDEX idx_items_equipped ON item_instances(owner_id, is_equipped) WHERE is_equipped = TRUE;

-- ── Currencies ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS character_currencies (
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  currency_id     VARCHAR(32) NOT NULL,
  amount          INTEGER DEFAULT 0,

  PRIMARY KEY (character_id, currency_id)
);

-- ── Quest Progress ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS character_quests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  quest_id        VARCHAR(64) NOT NULL,
  status          VARCHAR(16) DEFAULT 'active', -- available, active, completed, failed
  objective_progress JSONB DEFAULT '[]',
  accepted_at     TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  last_reset      TIMESTAMPTZ,

  UNIQUE (character_id, quest_id)
);

CREATE INDEX idx_char_quests ON character_quests(character_id);

-- ── Discovered Interactions ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS discovered_interactions (
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  chain_id        VARCHAR(64) NOT NULL,
  discovered_at   TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (character_id, chain_id)
);

-- ── Nemesis Memory ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS nemesis_entities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     VARCHAR(64) NOT NULL,
  name            VARCHAR(64) NOT NULL,
  evolution_tier  SMALLINT DEFAULT 0,
  stat_modifiers  JSONB DEFAULT '{}',
  enhanced_skill  VARCHAR(64),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nemesis_memory (
  nemesis_id      UUID NOT NULL REFERENCES nemesis_entities(id) ON DELETE CASCADE,
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  encounters      INTEGER DEFAULT 0,
  defeats         INTEGER DEFAULT 0,   -- nemesis defeated by player
  victories       INTEGER DEFAULT 0,   -- nemesis killed player
  last_encounter  TIMESTAMPTZ,

  PRIMARY KEY (nemesis_id, character_id)
);

-- ── Player Vendor Stalls ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vendor_stalls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  stall_name      VARCHAR(64),
  position_x      REAL DEFAULT 0,
  position_y      REAL DEFAULT 0,
  is_active       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_stall_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stall_id        UUID NOT NULL REFERENCES vendor_stalls(id) ON DELETE CASCADE,
  item_instance_id UUID NOT NULL REFERENCES item_instances(id),
  price_currency  VARCHAR(32) NOT NULL,
  price_amount    INTEGER NOT NULL,
  quantity        INTEGER DEFAULT 1
);

-- ── Guild System ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guilds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(32) UNIQUE NOT NULL,
  leader_id       UUID NOT NULL REFERENCES characters(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guild_members (
  guild_id        UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  rank            VARCHAR(16) DEFAULT 'member',
  joined_at       TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (guild_id, character_id)
);
