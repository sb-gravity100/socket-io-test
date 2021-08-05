import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type ListenEvents = {
   chat: (msg: any) => void;
};
