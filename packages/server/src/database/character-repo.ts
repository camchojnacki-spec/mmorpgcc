/**
 * Character repository — CRUD operations for character persistence.
 * All attribute names match the D2 specification.
 */

import { pool } from './connection.js';
import type { AttributeMap, ClassId, RaceId, BackgroundId, CivicStatus } from '@mmorpg/shared';

export interface CreateCharacterInput {
  accountId: string;
  name: string;
  classId: ClassId;
  raceId: RaceId;
  backgroundId: BackgroundId;
  attributes: AttributeMap;
  appearance: {
    bodyType: string;
    skinTone: number;
    hairStyle: string;
    hairColor: number;
    facialFeatures: number;
    markings?: string;
  };
}

export interface CharacterRow {
  id: string;
  account_id: string;
  name: string;
  class_id: ClassId;
  race_id: RaceId;
  background_id: BackgroundId;
  level: number;
  current_xp: number;
  soma: number;
  reflex: number;
  vigor: number;
  cortex: number;
  resolve: number;
  acuity: number;
  presence: number;
  phlux: number;
  free_attribute_points: number;
  civic_status: CivicStatus;
  directorate_standing: number;
  unbound_standing: number;
  directorate_suspicion: number;
  current_zone: string;
  position_x: number;
  position_y: number;
  direction: string;
}

export async function createCharacter(input: CreateCharacterInput): Promise<string> {
  const { accountId, name, classId, raceId, backgroundId, attributes, appearance } = input;

  const result = await pool.query(
    `INSERT INTO characters (
      account_id, name, class_id, race_id, background_id,
      body_type, skin_tone, hair_style, hair_color, facial_features, markings,
      soma, reflex, vigor, cortex, resolve, acuity, presence, phlux
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
    RETURNING id`,
    [
      accountId, name, classId, raceId, backgroundId,
      appearance.bodyType, appearance.skinTone, appearance.hairStyle,
      appearance.hairColor, appearance.facialFeatures, appearance.markings ?? null,
      attributes.soma, attributes.reflex, attributes.vigor, attributes.cortex,
      attributes.resolve, attributes.acuity, attributes.presence, attributes.phlux,
    ],
  );

  return result.rows[0].id;
}

export async function getCharacter(characterId: string): Promise<CharacterRow | null> {
  const result = await pool.query('SELECT * FROM characters WHERE id = $1', [characterId]);
  return result.rows[0] ?? null;
}

export async function getCharactersByAccount(accountId: string): Promise<CharacterRow[]> {
  const result = await pool.query(
    'SELECT * FROM characters WHERE account_id = $1 ORDER BY created_at',
    [accountId],
  );
  return result.rows;
}

export async function updateCharacterPosition(
  characterId: string,
  x: number,
  y: number,
  direction: string,
  zone: string,
): Promise<void> {
  await pool.query(
    `UPDATE characters SET position_x = $1, position_y = $2, direction = $3, current_zone = $4
     WHERE id = $5`,
    [x, y, direction, zone, characterId],
  );
}

export async function updateCharacterLevel(
  characterId: string,
  level: number,
  currentXp: number,
): Promise<void> {
  await pool.query(
    'UPDATE characters SET level = $1, current_xp = $2 WHERE id = $3',
    [level, currentXp, characterId],
  );
}

export async function updateCharacterAttributes(
  characterId: string,
  attributes: AttributeMap,
  freePoints: number,
): Promise<void> {
  await pool.query(
    `UPDATE characters SET
      soma=$1, reflex=$2, vigor=$3, cortex=$4,
      resolve=$5, acuity=$6, presence=$7, phlux=$8,
      free_attribute_points=$9
     WHERE id = $10`,
    [
      attributes.soma, attributes.reflex, attributes.vigor, attributes.cortex,
      attributes.resolve, attributes.acuity, attributes.presence, attributes.phlux,
      freePoints, characterId,
    ],
  );
}

export async function updateCivicStatus(
  characterId: string,
  status: CivicStatus,
  suspicion: number,
): Promise<void> {
  await pool.query(
    'UPDATE characters SET civic_status = $1, directorate_suspicion = $2 WHERE id = $3',
    [status, suspicion, characterId],
  );
}

export async function deleteCharacter(characterId: string): Promise<void> {
  await pool.query('DELETE FROM characters WHERE id = $1', [characterId]);
}

export async function isNameTaken(name: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT 1 FROM characters WHERE LOWER(name) = LOWER($1)',
    [name],
  );
  return result.rowCount !== null && result.rowCount > 0;
}
