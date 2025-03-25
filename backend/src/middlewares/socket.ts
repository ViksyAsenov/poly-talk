import { Server, Socket } from "socket.io";

import { RequestHandler, Request, Response } from "express";

import { sessions } from "@middlewares/sessions";

const wrapExpressMiddlewareToSocketIO = (expressMiddleware: RequestHandler) => (socket: Socket, next: () => void) =>
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  expressMiddleware(socket.request as Request, {} as Response, next);

const setupUserMiddlewareForIO = (io: Server) => {
  io.use(wrapExpressMiddlewareToSocketIO(sessions));
};

export { setupUserMiddlewareForIO, wrapExpressMiddlewareToSocketIO };
