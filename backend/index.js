import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { handleSocket } from "./game.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Логируем апгрейд-запросы WebSocket
server.on("upgrade", (req, socket, head) => {
  console.log("↑ Upgrade request to:", req.url);
});

const wss = new WebSocketServer({ server });
wss.on("connection", ws => {
  console.log("✔ WebSocket: new connection");
  handleSocket(ws);
});

app.get("/", (req, res) => {
  res.send("Backend is up");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});