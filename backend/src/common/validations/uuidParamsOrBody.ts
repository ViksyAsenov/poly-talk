import { z } from "zod";

import { createZodMessage } from "@utils/createZodMessage";
import { GenericErrors } from "@common/constants/error";

const uuidParamsOrBodyValidation = z.object({
  id: z
    .string({ message: createZodMessage(GenericErrors.INVALID_ID) })
    .uuid({ message: createZodMessage(GenericErrors.INVALID_ID) }),
});

export type TUuidParamsOrBody = z.infer<typeof uuidParamsOrBodyValidation>;

export { uuidParamsOrBodyValidation };
