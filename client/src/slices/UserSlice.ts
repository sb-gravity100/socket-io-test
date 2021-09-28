import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import socket from 'src/socket';
import { ChatArgswithRoom } from 'src/types';

type UserState = {
   socketID: string;
   userID: string;
   username: string;
   messages: ChatArgswithRoom[];
   room: {
      current: string;
      previous?: string;
   };
   isLoggedIn: boolean;
};

const initialState = {
   isLoggedIn: false,
} as UserState;

const UserSlice = createSlice({
   name: 'User',
   initialState,
   reducers: {
      logIn(state) {
         state.isLoggedIn = true;
         socket.connect();
      },
      logOut(state) {
         state.isLoggedIn = false;
         socket.disconnect();
      },
      joinRoom(state, action: PayloadAction<string>) {
         state.room.previous = state.room.current;
         state.room.current = action.payload;
         socket.emit('join-room');
      },
   },
});

export const { logOut, logIn, joinRoom } = UserSlice.actions;
export default UserSlice.reducer;
