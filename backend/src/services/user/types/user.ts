import { User } from "@services/user/models";

type IMinUser = Pick<
  User,
  "id" | "avatar" | "displayName" | "email" | "tag" | "firstName" | "lastName" | "languageId"
> & {
  languageName?: string;
};

export type { IMinUser };
