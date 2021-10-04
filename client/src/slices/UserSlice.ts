import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'src/socket';
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
   socket: Socket;
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
      },
      logOut(state) {
         state.isLoggedIn = false;
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
   },
});

export const setKey = (key: keyof UserState, value: any) =>
   UserSlice.actions.setKey({
      key,
      value,
   });
export const { logOut, logIn } = UserSlice.actions;
export default UserSlice.reducer;
