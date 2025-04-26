import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { Game } from "./game/Game.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const game = new Game(io);

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  game.handleConnection(socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
