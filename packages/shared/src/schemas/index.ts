/**
 * Colyseus state schemas — networked state synchronized between server and clients.
 * These define what data flows over the wire in real time.
 *
 * Note: Colyseus schemas use decorators or defineTypes() for serialization.
 * We use defineTypes() to avoid decorator configuration requirements.
 */

import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';

// ── Player state (networked) ────────────────────────────────────────────────

export class PlayerSchema extends Schema {
  @type('string') sessionId: string = '';
  @type('string') characterId: string = '';
  @type('string') name: string = '';
  @type('string') classId: string = '';
  @type('number') level: number = 1;

  // Position
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('string') direction: string = 'S';
  @type('string') animationState: string = 'idle';

  // Resources
  @type('number') currentHp: number = 100;
  @type('number') maxHp: number = 100;
  @type('number') currentStamina: number = 100;
  @type('number') maxStamina: number = 100;
  @type('number') currentStrand: number = 100;
  @type('number') maxStrand: number = 100;

  // Sprite layers
  @type('string') spriteBody: string = '';
  @type('string') spriteArmor: string = '';
  @type('string') spriteHead: string = '';
  @type('string') spriteMainHand: string = '';
  @type('string') spriteOffHand: string = '';
  @type('string') spriteBack: string = '';

  // Target
  @type('string') targetId: string = '';
  @type('boolean') isAlive: boolean = true;
}

// ── Enemy state (networked) ─────────────────────────────────────────────────

export class EnemySchema extends Schema {
  @type('string') id: string = '';
  @type('string') templateId: string = '';
  @type('string') name: string = '';
  @type('string') entityType: string = 'enemy'; // enemy, elite, champion, boss, nemesis
  @type('number') level: number = 1;

  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('string') direction: string = 'S';
  @type('string') animationState: string = 'idle';

  @type('number') currentHp: number = 100;
  @type('number') maxHp: number = 100;
  @type('boolean') isAlive: boolean = true;

  @type('string') targetId: string = '';
}

// ── NPC state (networked) ───────────────────────────────────────────────────

export class NPCSchema extends Schema {
  @type('string') id: string = '';
  @type('string') name: string = '';
  @type('string') role: string = ''; // vendor, quest_giver, faction_contact, etc.
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('string') direction: string = 'S';
  @type('string') spriteKey: string = '';
}

// ── Resonance buffer (networked per-player) ─────────────────────────────────

export class ResonanceBufferSchema extends Schema {
  @type(['string']) buffer: ArraySchema<string> = new ArraySchema<string>();
  @type(['string']) activeStates: ArraySchema<string> = new ArraySchema<string>();
  @type('number') fullSpectrumCooldownMs: number = 0;
}

// ── Room state: Town ────────────────────────────────────────────────────────

export class TownState extends Schema {
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type({ map: NPCSchema }) npcs = new MapSchema<NPCSchema>();
}

// ── Room state: Instance (dungeon) ──────────────────────────────────────────

export class InstanceState extends Schema {
  @type('string') templateId: string = '';
  @type('string') difficulty: string = 'normal';
  @type('number') seed: number = 0;
  @type('boolean') isActive: boolean = true;
  @type('number') elapsedMs: number = 0;

  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type({ map: EnemySchema }) enemies = new MapSchema<EnemySchema>();
}
