export interface IUserStore {
   id: string;
   username?: string;
   room: {
      current: string;
      previous?: string;
   };
}

export interface ChatArgs {
   id: string;
   username: string;
   payload: string;
   createdAt: Date;
}

export interface ChatArgswithRoom extends ChatArgs {
   room?: string;
}
type EmitEvents = {
   chat(chat: ChatArgs | ChatArgswithRoom): void;
};

type ListenEvents = {
   message(payload: string, createdAt: Date, cb?: () => void): void;
   'delete-user'(): void;
};

export type SocketEvents = EmitEvents & ListenEvents;
