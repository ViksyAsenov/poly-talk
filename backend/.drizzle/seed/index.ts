import { seedLanguages } from "./languages";

const seed = async () => {
  await seedLanguages(false);

  process.exit(0);
};

void seed();
