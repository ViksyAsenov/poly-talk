import { z } from "zod";

import { createZodMessage } from "@utils/createZodMessage";
import { UserErrors } from "@services/user/constants";

const tagBodyValidation = z.object({
  tag: z.string({ message: createZodMessage(UserErrors.INVALID_TAG) }),
});

export type TTagBody = z.infer<typeof tagBodyValidation>;

export { tagBodyValidation };
