declare type PrefixKeys<K extends string = '', T extends {
    [key: string]: any;
} = {}> = {
    [Property in keyof T as `${K}:${string & Property}`]: T[Property];
};
declare type SetEvents = {
    username(name: string): void;
    room(id: string, cb?: () => any): void;
};
declare type PrefixedSetEvents = PrefixKeys<'SET', SetEvents>;
export interface SocketEvents extends PrefixedSetEvents {
    message(...args: any[]): void;
    ping(n: number): void;
}
export {};
