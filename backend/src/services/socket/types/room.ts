type Event = "JOIN" | "LEAVE";

interface Room {
  id: string;
  type: Event;
}

export type { Event };
export { Room };
