import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../../src/events-map';

export const socket: Socket<SocketEvents, SocketEvents> = io();
