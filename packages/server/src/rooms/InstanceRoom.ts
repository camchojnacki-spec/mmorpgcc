import colyseus from "colyseus";
const { Room } = colyseus;
type Client = colyseus.Client;

// TODO: Add InstanceState schema, BSP generation, enemy spawning

export interface InstanceOptions {
  instanceTemplate: string;
  difficulty: string;
  seed: number;
}

export class InstanceRoom extends Room {
  maxClients = 40; // Supports party up to raid size

  onCreate(options: InstanceOptions): void {
    console.log(
      `InstanceRoom created — template: ${options.instanceTemplate}, difficulty: ${options.difficulty}, seed: ${options.seed}`,
    );
  }

  onJoin(client: Client): void {
    console.log(`Player joined instance: ${client.sessionId}`);
  }

  onLeave(client: Client): void {
    console.log(`Player left instance: ${client.sessionId}`);
  }

  onDispose(): void {
    console.log("InstanceRoom disposed");
  }
}
