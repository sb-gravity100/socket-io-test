import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type PrefixKeys<
   K extends string = '',
   T extends { [key: string]: any } = {}
> = {
   [Property in keyof T as `${K}:${string & Property}`]: T[Property];
};
type SetEvents = {
   username(name: string): void;
};
type PrefixedSetEvents = PrefixKeys<'SET', SetEvents>;
export interface SocketEvents extends PrefixedSetEvents {
   message(...args: any[]): void;
   ping(n: number): void;
}
