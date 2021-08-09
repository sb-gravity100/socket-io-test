import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
   id: string;
   username: string;
   room: {
      current: string;
      previous: string;
   };
}

interface updateStatePayload {
   key: keyof SocketState;
   value: any;
}

const initialState = {
   room: {
      current: '',
   },
} as SocketState;

const SocketSlice = createSlice({
   name: 'socket',
   initialState,
   reducers: {
      updateState: (state, action: PayloadAction<updateStatePayload>) => {
         state[action.payload.key] = action.payload.value;
      },
      setID: (state, action: PayloadAction<string>) => {
         state.id = action.payload;
      },
      changeRoom: (state, action: PayloadAction<string>) => {
         state.room.previous = state.room.current;
         state.room.current = action.payload;
      },
   },
});

export const { updateState, changeRoom, setID } = SocketSlice.actions;
export default SocketSlice.reducer;
