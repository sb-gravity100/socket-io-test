import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
   [key: string]: any;
   id: string;
   username: string;
}

interface updateStatePayload {
   key: keyof SocketState;
   value: SocketState[keyof SocketState];
}

const initialState = {} as SocketState;

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
   },
});

export const updateState = SocketSlice.actions.updateState;
export const setID = SocketSlice.actions.setID;
export default SocketSlice.reducer;
