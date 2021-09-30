import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

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
interface EmitEvents {
   chat(chat: ChatArgs | ChatArgswithRoom): void;
}

type ListenEvents = {
   message(payload: string, createdAt: Date, cb?: () => void): void;
   'user-id'(id: string): void;
};

export type SocketEvents = EmitEvents & ListenEvents;
