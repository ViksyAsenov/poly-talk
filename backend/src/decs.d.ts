import { InferSelectModel } from "drizzle-orm";
import { Users } from "@services/user/models";

declare global {
  namespace Express {
    interface Request {
      user: InferSelectModel<typeof Users>;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user: InferSelectModel<typeof Users>;
  }
}
