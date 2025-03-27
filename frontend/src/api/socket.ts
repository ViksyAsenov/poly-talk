import { io } from "socket.io-client";

const socket = io("ws://localhost:3005/", {
  withCredentials: true,
  transports: ["websocket"],
  secure: true,
  autoConnect: true,
});

export { socket };
