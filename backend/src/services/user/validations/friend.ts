import { z } from "zod";

import { createZodMessage } from "@utils/createZodMessage";
import { UserErrors } from "@services/user/constants";

const tagParamsValidation = z.object({
  tag: z.string({ message: createZodMessage(UserErrors.INVALID_TAG) }),
});

export type TTagParams = z.infer<typeof tagParamsValidation>;

export { tagParamsValidation };
