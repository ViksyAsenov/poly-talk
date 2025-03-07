import { db } from "@config/db";
import { Languages, NewLanguage } from "@services/language/models";
import { eq } from "drizzle-orm";

const generateLanguageMap = () => {
  const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  const languageMap: Record<string, string> = {};

  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      const code = String.fromCharCode(97 + i) + String.fromCharCode(97 + j);
      const name = languageNames.of(code);

      if (name && name !== code) {
        languageMap[name] = code;
      }
    }
  }

  return languageMap;
};

const seedLanguages = async () => {
  const languageMap = generateLanguageMap();

  for (const [name, code] of Object.entries(languageMap)) {
    const existingLanguage = (await db.select().from(Languages).where(eq(Languages.code, code)))[0];

    if (existingLanguage) {
      await db.update(Languages).set({ name }).where(eq(Languages.code, code));

      continue;
    }

    const newLanguage: NewLanguage = {
      name,
      code,
      nativeSpeakers: 0,
    };

    await db.insert(Languages).values(newLanguage);
  }
};

export { seedLanguages };
