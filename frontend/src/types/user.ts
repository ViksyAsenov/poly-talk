interface IMinUser {
  email: string;
  id: string;
  avatar: string;
  displayName: string;
  tag: string;
  firstName: string;
  lastName: string;
  languageId: string | null;
  languageName?: string;
}

interface IFriendRequests {
  sent: {
    id: string;
    receiver: IMinUser;
    createdAt: Date;
  }[];
  received: {
    id: string;
    sender: IMinUser;
    createdAt: Date;
  }[];
}

export type { IMinUser, IFriendRequests };
