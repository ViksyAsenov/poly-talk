import { useEffect } from "react";
import { socket } from "../api/socket";

const useChatSocket = (id: string) => {
  useEffect(() => {
    socket.emit("join", {
      id,
      type: "JOIN",
    });

    return () => {
      socket.emit("leave", {
        id,
        type: "LEAVE",
      });
    };
  }, [id]);
};

export { useChatSocket };
