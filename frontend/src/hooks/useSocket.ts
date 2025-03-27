import { useEffect, useRef } from "react";

import { socket } from "../api/socket";

interface SocketConfig<T> {
  event?: string;
  handler?: (data: T) => void;
  emit?: string;
  dependencies?: any[];
  enabled?: boolean;
}

const useSocket = <T>({
  event,
  handler,
  emit,
  dependencies = [],
  enabled = true,
}: SocketConfig<T>) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (emit) {
      socket.emit(emit);
    }

    if (!event) return;
    if (!handlerRef.current) return;

    const stableHandler = (data: T) => {
      handlerRef.current?.(data);
    };

    socket.on(event, stableHandler);

    return () => {
      socket.off(event, stableHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, enabled, ...dependencies]);

  return {
    emit: <E>(emitEvent: string, data: E) => socket.emit(emitEvent, data),
    disconnect: () => socket.disconnect(),
    connect: () => socket.connect(),
    isConnected: () => socket.connected,
  };
};

export { useSocket };
