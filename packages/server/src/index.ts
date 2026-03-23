import { createServer } from "http";
import express from "express";
import colyseus from "colyseus";
const { Server } = colyseus;
import wsTransport from "@colyseus/ws-transport";
const { WebSocketTransport } = wsTransport;
import monitorPkg from "@colyseus/monitor";
const { monitor } = monitorPkg;

import { TownRoom } from "./rooms/TownRoom.js";
import { InstanceRoom } from "./rooms/InstanceRoom.js";

const app = express();
const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

// Register room handlers
gameServer.define("town", TownRoom);
gameServer.define("instance", InstanceRoom);

// Colyseus monitor panel (dev only)
app.use("/colyseus", monitor());

const port = Number(process.env.PORT) || 2567;

httpServer.listen(port, () => {
  console.log(`Game server listening on port ${port}`);
});
