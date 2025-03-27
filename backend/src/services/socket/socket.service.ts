import { Server, Socket } from "socket.io";

import logger from "@logger";
import { isParticipant } from "@services/chat";
import { Room } from "@services/socket/types";

let _io: Server | undefined = undefined;

const userSocketMap = new Map<string, Set<string>>();

const setIO = (io: Server) => {
  _io = io;
};

const getIO = () => {
  return _io;
};

const setupServerListeners = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.trace("Client connected");

    io.emit("chat:onlineCount", userSocketMap.size);

    const user = (socket.request as unknown as Express.Request).session.user as { id: string } | undefined;

    if (user) {
      const socketIds = userSocketMap.get(user.id);

      if (!socketIds) {
        userSocketMap.set(user.id, new Set());
      }

      userSocketMap.get(user.id)?.add(socket.id);
    }

    socket.on("room", async ({ id, type }: Room) => {
      logger.trace(`Room event ${type} for chat ${id}`);
      if (user && (await isParticipant(user.id, id))) {
        if (type === "JOIN") {
          logger.info(`User ${user.id} joined chat ${id}`);
          await socket.join(`chat:${id}`);
        }

        if (type === "LEAVE") {
          await socket.leave(`chat:${id}`);
        }
      }
    });

    socket.on("disconnect", () => {
      logger.trace("Client disconnected");

      if (user) {
        const userSockets = userSocketMap.get(user.id) ?? new Set();

        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          userSocketMap.delete(user.id);
        } else {
          userSocketMap.set(user.id, userSockets);
        }
      }

      io.emit("chat:onlineCount", userSocketMap.size - 1);
    });

    socket.on("error", (error: Error) => {
      logger.error("Socket error", error);
    });
  });
};

const emitToUser = (userId: string, eventName: string, data: unknown) => {
  const io = getIO();

  const socketIds = userSocketMap.get(userId);

  if (!socketIds) {
    return;
  }

  for (const socketId of socketIds) {
    io?.to(socketId).emit(eventName, data);
  }
};

const emitToChat = (id: string, eventName: string, data: unknown) => {
  const io = getIO();

  io?.to(`chat:${id}`).emit(eventName, data);
};

export { setIO, getIO, setupServerListeners, emitToUser, emitToChat };
