/**
 * Town hub room — shared social space.
 * Handles player movement, chat, and NPC interactions.
 * Server-authoritative: validates positions before broadcasting.
 */

import colyseus from 'colyseus';
const { Room } = colyseus;
type Client = colyseus.Client;

interface PlayerState {
  sessionId: string;
  x: number;
  y: number;
  direction: string;
  name: string;
}

interface MoveMessage {
  x: number;
  y: number;
  direction: string;
}

interface ChatMessage {
  channel: string;
  content: string;
  targetId?: string;
}

const MAX_MOVE_DELTA = 5; // Max distance per message (anti-cheat)

export class TownRoom extends Room {
  maxClients = 100;
  private players: Map<string, PlayerState> = new Map();

  onCreate(_options: Record<string, unknown>): void {
    console.log('TownRoom created');

    // ── Movement handler ──────────────────────────────────────────────
    this.onMessage('move', (client: Client, data: MoveMessage) => {
      const player = this.players.get(client.sessionId);
      if (!player) return;

      // Basic anti-cheat: reject teleport-sized moves
      const dx = data.x - player.x;
      const dy = data.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > MAX_MOVE_DELTA) {
        // Snap player back to last valid position
        client.send('positionCorrection', { x: player.x, y: player.y });
        return;
      }

      // Update server state
      player.x = data.x;
      player.y = data.y;
      player.direction = data.direction;

      // Broadcast to all other clients
      this.broadcast(
        'playerMove',
        {
          id: client.sessionId,
          x: player.x,
          y: player.y,
          direction: player.direction,
        },
        { except: client },
      );
    });

    // ── Chat handler ──────────────────────────────────────────────────
    this.onMessage('chat', (client: Client, data: ChatMessage) => {
      const player = this.players.get(client.sessionId);
      if (!player) return;

      // Sanitize content (basic XSS prevention)
      const content = data.content.slice(0, 500).replace(/[<>]/g, '');

      if (data.channel === 'whisper' && data.targetId) {
        // Direct message to specific player
        const target = this.clients.find((c) => c.sessionId === data.targetId);
        target?.send('chat', {
          channel: 'whisper',
          senderId: client.sessionId,
          senderName: player.name,
          content,
        });
      } else {
        // Broadcast to room
        this.broadcast('chat', {
          channel: data.channel || 'say',
          senderId: client.sessionId,
          senderName: player.name,
          content,
        });
      }
    });
  }

  onJoin(client: Client): void {
    // Create player state with spawn position
    const player: PlayerState = {
      sessionId: client.sessionId,
      x: 10 + Math.random() * 2,
      y: 10 + Math.random() * 2,
      direction: 'S',
      name: `Player_${client.sessionId.slice(0, 4)}`,
    };
    this.players.set(client.sessionId, player);

    // Send existing players to the new client
    for (const [id, existing] of this.players) {
      if (id !== client.sessionId) {
        client.send('playerJoin', {
          id: existing.sessionId,
          x: existing.x,
          y: existing.y,
          direction: existing.direction,
        });
      }
    }

    // Broadcast new player to everyone else
    this.broadcast(
      'playerJoin',
      {
        id: player.sessionId,
        x: player.x,
        y: player.y,
        direction: player.direction,
      },
      { except: client },
    );

    console.log(`Player joined town: ${client.sessionId} (${this.players.size} total)`);
  }

  onLeave(client: Client): void {
    this.players.delete(client.sessionId);
    this.broadcast('playerLeave', { id: client.sessionId });
    console.log(`Player left town: ${client.sessionId} (${this.players.size} total)`);
  }

  onDispose(): void {
    console.log('TownRoom disposed');
  }
}
