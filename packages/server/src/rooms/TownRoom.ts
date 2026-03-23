import colyseus from "colyseus";
const { Room } = colyseus;
type Client = colyseus.Client;

// TODO: Add TownState schema with player positions

export class TownRoom extends Room {
  maxClients = 100;

  onCreate(_options: Record<string, unknown>): void {
    console.log("TownRoom created");
  }

  onJoin(client: Client): void {
    console.log(`Player joined town: ${client.sessionId}`);
  }

  onLeave(client: Client): void {
    console.log(`Player left town: ${client.sessionId}`);
  }

  onDispose(): void {
    console.log("TownRoom disposed");
  }
}
