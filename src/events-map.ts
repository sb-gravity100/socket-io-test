import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface IUserStore {
   id: string;
   username?: string;
   room: {
      current: string;
      previous?: string;
   };
   messages?: ChatArgswithRoom[];
}
type PrefixKeys<
   K extends string = '',
   T extends { [key: string]: any } = {}
> = {
   [Property in keyof T as `${K}:${string & Property}`]: T[Property];
};
interface SetEvents {
   username(name: string, cb?: () => any): void;
   room(id: string, cb?: () => any): void;
}

interface GetEvents {
   user(user: IUserStore): void;
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
type PrefixedSetEvents = PrefixKeys<'SET', SetEvents>;
type PrefixedGetEvents = PrefixKeys<'GET', GetEvents>;
interface DefaultEvents {
   message(...args: any[]): void;
   chat(...args: ChatArgs[]): void;
   ping(n: number): void;
}

export type SocketEvents = DefaultEvents &
   PrefixedSetEvents &
   PrefixedGetEvents;
