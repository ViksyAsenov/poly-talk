import { z } from "zod";

import { createZodMessage } from "@utils/createZodMessage";
import { UserErrors } from "@services/user/constants";

const updateUserBodyValidation = z.object({
  displayName: z
    .string({ message: createZodMessage(UserErrors.INVALID_DISPLAY_NAME) })
    .min(1, { message: createZodMessage(UserErrors.INVALID_DISPLAY_NAME) })
    .optional(),
  firstName: z
    .string({ message: createZodMessage(UserErrors.INVALID_NAME) })
    .min(1, { message: createZodMessage(UserErrors.INVALID_NAME) })
    .optional(),
  lastName: z
    .string({ message: createZodMessage(UserErrors.INVALID_NAME) })
    .min(1, { message: createZodMessage(UserErrors.INVALID_NAME) })
    .optional(),
  languageId: z
    .string({ message: createZodMessage(UserErrors.INVALID_LANGUAGE) })
    .uuid({ message: createZodMessage(UserErrors.INVALID_LANGUAGE) })
    .optional(),
});

export type TUpdateUserBody = z.infer<typeof updateUserBodyValidation>;

export { updateUserBodyValidation };
