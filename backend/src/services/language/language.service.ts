import { eq } from "drizzle-orm";
import axios from "axios";
import { db } from "@config/db";
import config from "@config/env";
import { Languages } from "@services/language/models";
import { AppError } from "@common/error/appError";
import { LanguageErrors } from "@services/language/constants";
import { LibretranslateResponse } from "@services/language/types";
import logger from "@config/logger";

const getAllLanguages = async () => {
  return db.select().from(Languages);
};

const getLanguageById = async (id: string, throwError: boolean) => {
  try {
    const language = (await db.select().from(Languages).where(eq(Languages.id, id)))[0];

    if (!language) {
      if (!throwError) {
        return null;
      }

      throw new AppError(LanguageErrors.NOT_FOUND);
    }

    return language;
  } catch (error) {
    if (throwError) {
      throw new AppError(LanguageErrors.NOT_FOUND);
    }

    return null;
  }
};

const translateMessage = async (message: string, targetLanguageId: string, sourceLanguageId?: string) => {
  const sourceLanguage = await getLanguageById(sourceLanguageId ?? "", false);
  const targetLanguage = await getLanguageById(targetLanguageId, true);

  const { data, status } = await axios.post<LibretranslateResponse>(`${config.app.libretranslate_url}/translate`, {
    q: message,
    source: sourceLanguage?.code ?? "auto",
    target: targetLanguage?.code,
    alternatives: 1,
  });

  logger.info({ data }, "translated text");

  if (status !== 200 || !data.translatedText) {
    throw new AppError(LanguageErrors.TRANSLATION_FAILED);
  }

  return data.translatedText;
};

export { getAllLanguages, getLanguageById, translateMessage };
