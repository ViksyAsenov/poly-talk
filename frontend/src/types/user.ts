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

interface FriendRequestSent {
  id: string;
  receiver: IMinUser;
  createdAt: Date;
}

interface FriendRequestReceived {
  id: string;
  sender: IMinUser;
  createdAt: Date;
}

interface IFriendRequests {
  sent: FriendRequestSent[];
  received: FriendRequestReceived[];
}

interface Language {
  id: string;
  name: string;
  code: string;
}

export type {
  IMinUser,
  FriendRequestSent,
  FriendRequestReceived,
  IFriendRequests,
  Language,
};
