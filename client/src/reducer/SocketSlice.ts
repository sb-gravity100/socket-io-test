import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatArgswithRoom, IUserStore } from '../../../src/events-map';

interface SocketState extends IUserStore {
   messages: ChatArgswithRoom[];
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
      addMsg: (state, action: PayloadAction<ChatArgswithRoom>) => {
         if (!state.messages) {
            state.messages = [];
         }
         state.messages.push(action.payload);
      },
   },
});

export const { updateState, changeRoom, setID, addMsg } = SocketSlice.actions;
export default SocketSlice.reducer;
