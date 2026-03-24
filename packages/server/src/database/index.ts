export { pool, initializeDatabase } from './connection.js';
export {
  createCharacter,
  getCharacter,
  getCharactersByAccount,
  updateCharacterPosition,
  updateCharacterLevel,
  updateCharacterAttributes,
  updateCivicStatus,
  deleteCharacter,
  isNameTaken,
} from './character-repo.js';
export type { CreateCharacterInput, CharacterRow } from './character-repo.js';
