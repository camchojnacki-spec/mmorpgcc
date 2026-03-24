import { createServer } from 'http';
import express from 'express';
import colyseus from 'colyseus';
const { Server } = colyseus;
import wsTransport from '@colyseus/ws-transport';
const { WebSocketTransport } = wsTransport;
import monitorPkg from '@colyseus/monitor';
const { monitor } = monitorPkg;

import { TownRoom } from './rooms/TownRoom.js';
import { InstanceRoom } from './rooms/InstanceRoom.js';
import { initializeDatabase } from './database/index.js';

const app = express();
app.use(express.json());
const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

// Register room handlers
gameServer.define('town', TownRoom);
gameServer.define('instance', InstanceRoom);

// Colyseus monitor panel (dev only)
app.use('/colyseus', monitor());

// ── REST API routes (for character creation, login, etc.) ───────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// ── Start ───────────────────────────────────────────────────────────────────

const port = Number(process.env.PORT) || 2567;

async function start(): Promise<void> {
  // Initialize database (non-blocking — server works without DB for dev)
  await initializeDatabase();

  httpServer.listen(port, () => {
    console.log(`Game server listening on port ${port}`);
  });
}

start().catch(console.error);
