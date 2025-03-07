import { db } from "@config/db";
import { eq } from "drizzle-orm";
import { Languages } from "./models";
import { AppError } from "@common/error/appError";
import { LanguageErrors } from "@services/language/constants";

const getLanguageById = async (id: string, throwError: boolean) => {
  const language = (await db.select().from(Languages).where(eq(Languages.id, id)))[0];

  if (!language) {
    if (!throwError) {
      return null;
    }

    throw new AppError(LanguageErrors.NOT_FOUND);
  }

  return language;
};

export { getLanguageById };
