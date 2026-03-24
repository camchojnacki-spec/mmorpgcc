/**
 * Isometric coordinate utilities.
 * Converts between world (cartesian) and screen (isometric) coordinates.
 * Tile dimensions from shared constants.
 */

import { TILE_WIDTH, TILE_HEIGHT } from '@mmorpg/shared';

/** Convert world (x, y) to isometric screen position. */
export function worldToScreen(wx: number, wy: number): { sx: number; sy: number } {
  return {
    sx: (wx - wy) * (TILE_WIDTH / 2),
    sy: (wx + wy) * (TILE_HEIGHT / 2),
  };
}

/** Convert isometric screen position back to world (x, y). */
export function screenToWorld(sx: number, sy: number): { wx: number; wy: number } {
  return {
    wx: (sx / (TILE_WIDTH / 2) + sy / (TILE_HEIGHT / 2)) / 2,
    wy: (sy / (TILE_HEIGHT / 2) - sx / (TILE_WIDTH / 2)) / 2,
  };
}

/** Get the 8-direction label from a movement vector. */
export function vectorToDirection(
  dx: number,
  dy: number,
): string {
  if (dx === 0 && dy === 0) return 'S'; // default idle facing

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Map angle to 8 directions (isometric-adjusted)
  if (angle >= -22.5 && angle < 22.5) return 'E';
  if (angle >= 22.5 && angle < 67.5) return 'SE';
  if (angle >= 67.5 && angle < 112.5) return 'S';
  if (angle >= 112.5 && angle < 157.5) return 'SW';
  if (angle >= 157.5 || angle < -157.5) return 'W';
  if (angle >= -157.5 && angle < -112.5) return 'NW';
  if (angle >= -112.5 && angle < -67.5) return 'N';
  if (angle >= -67.5 && angle < -22.5) return 'NE';

  return 'S';
}

/** Calculate distance between two world positions. */
export function worldDistance(
  x1: number, y1: number,
  x2: number, y2: number,
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
