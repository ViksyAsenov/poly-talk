import { seedLanguages } from "./languages";

const seed = async () => {
  await seedLanguages();
};

void seed();
