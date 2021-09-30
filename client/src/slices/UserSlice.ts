import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import socket from 'src/socket';
import { ChatArgswithRoom } from 'src/types';

type UserState = {
   socketID: string;
   userID: string;
   username: string;
   messages: ChatArgswithRoom[];
   room: {
      current?: string;
      previous?: string;
   };
   isLoggedIn: boolean;
};

const initialState = {
   isLoggedIn: false,
   room: {
      previous: undefined,
      current: undefined,
   },
} as UserState;

const UserSlice = createSlice({
   name: 'User',
   initialState,
   reducers: {
      logIn(state) {
         state.isLoggedIn = true;
         if (!socket.connected) {
            socket.connect();
         }
      },
      logOut(state) {
         state.isLoggedIn = false;
         if (socket.connected) {
            socket.disconnect();
         }
      },
      joinRoom(state, action: PayloadAction<string>) {
         state.room.previous = state.room.current;
         state.room.current = action.payload;
         socket.emit('join-room', state.room.current);
      },
      setKey<T extends keyof UserState>(
         state: any,
         action: PayloadAction<{
            key: T;
            value: ((state: UserState[T]) => any) | any;
         }>
      ) {
         if (typeof action.payload.value === 'function') {
            state[action.payload.key as any] = action.payload.value(
               state[action.payload.key as any]
            );
         } else {
            state[action.payload.key as any] = action.payload.value;
         }
      },
      sendMessage(state, action: PayloadAction<string>) {},
   },
});

export const { logOut, logIn, joinRoom, setKey } = UserSlice.actions;
export default UserSlice.reducer;
