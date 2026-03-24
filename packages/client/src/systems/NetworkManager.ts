/**
 * Network manager — Colyseus client connection.
 * Handles joining rooms, sending messages, receiving state updates.
 */

import { Client, Room } from 'colyseus.js';

export interface NetworkConfig {
  serverUrl: string;
}

const DEFAULT_CONFIG: NetworkConfig = {
  serverUrl: `ws://${window.location.hostname}:2567`,
};

export class NetworkManager {
  private client: Client;
  private townRoom: Room | null = null;
  private instanceRoom: Room | null = null;

  constructor(config?: Partial<NetworkConfig>) {
    const { serverUrl } = { ...DEFAULT_CONFIG, ...config };
    this.client = new Client(serverUrl);
  }

  /** Join the town hub room. */
  async joinTown(): Promise<Room> {
    try {
      this.townRoom = await this.client.joinOrCreate('town');
      console.log('Joined town room:', this.townRoom.sessionId);
      return this.townRoom;
    } catch (err) {
      console.error('Failed to join town:', err);
      throw err;
    }
  }

  /** Join a dungeon instance. */
  async joinInstance(
    template: string,
    difficulty: string,
    seed?: number,
  ): Promise<Room> {
    try {
      this.instanceRoom = await this.client.joinOrCreate('instance', {
        instanceTemplate: template,
        difficulty,
        seed: seed ?? Math.floor(Math.random() * 999999),
      });
      console.log('Joined instance:', this.instanceRoom.sessionId);
      return this.instanceRoom;
    } catch (err) {
      console.error('Failed to join instance:', err);
      throw err;
    }
  }

  /** Leave the current instance and return to town. */
  async leaveInstance(): Promise<void> {
    if (this.instanceRoom) {
      await this.instanceRoom.leave();
      this.instanceRoom = null;
    }
  }

  /** Send a movement update to the server. */
  sendMovement(x: number, y: number, direction: string): void {
    const room = this.instanceRoom ?? this.townRoom;
    room?.send('move', { x, y, direction });
  }

  /** Send a combat action to the server. */
  sendCombatAction(abilityId: string, targetId: string): void {
    const room = this.instanceRoom ?? this.townRoom;
    room?.send('combat', { type: 'USE_ABILITY', abilityId, targetId });
  }

  /** Send a chat message. */
  sendChat(channel: string, content: string, targetId?: string): void {
    const room = this.instanceRoom ?? this.townRoom;
    room?.send('chat', { channel, content, targetId });
  }

  /** Get the current active room. */
  getActiveRoom(): Room | null {
    return this.instanceRoom ?? this.townRoom;
  }

  getTownRoom(): Room | null {
    return this.townRoom;
  }

  getInstanceRoom(): Room | null {
    return this.instanceRoom;
  }
}
