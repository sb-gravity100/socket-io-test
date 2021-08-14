import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { stringify } from 'querystring';
import { ChatArgswithRoom, IUserStore } from '../../../src/events-map';

interface SocketState extends IUserStore {
   messages: ChatArgswithRoom[];
}

interface updateStatePayload {
   key: keyof SocketState;
   value: any;
}

interface MessageQuery {
   before?: string;
   after?: string;
   username?: string;
   id?: string;
   room?: string;
   limit?: number;
}

const initialState = {
   room: {
      current: '',
   },
} as SocketState;

const MessagesApi = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: '/api',
   }),
   endpoints: build => ({
      getMessages: build.query<ChatArgswithRoom, MessageQuery>({
         query: q => `/messages/${stringify({ ...q })}`,
      }),
   }),
});

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
