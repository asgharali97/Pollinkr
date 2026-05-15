import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("poll:join", (pollId: string) => {
      socket.join(`poll:${pollId}`);
    });

    socket.on("poll:leave", (pollId: string) => {
      socket.leave(`poll:${pollId}`);
    });
  });

  return io;
}

export function emitPollUpdate(pollId: string, payload: unknown) {
  io?.to(`poll:${pollId}`).emit("poll:update", payload);
}
