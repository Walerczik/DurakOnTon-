// backend/index.js
import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { handleSocket } from "./game.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Логируем WebSocket upgrade
server.on("upgrade", (req) => {
  console.log("↑ Upgrade WS:", req.url);
});

const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("✔ WS connected");
  handleSocket(ws);
});

app.get("/", (_, res) => res.send("Backend is up"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));