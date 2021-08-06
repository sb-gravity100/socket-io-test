import { configureStore } from '@reduxjs/toolkit';
import * as ReactRedux from 'react-redux';
import { testReducer } from './reducer/TestCount';
import socketReducer from './reducer/SocketSlice';

export const store = configureStore({
   reducer: {
      tests: testReducer,
      socket: socketReducer,
   },
});
export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
export const useDispatch = () => ReactRedux.useDispatch<RootDispatch>();
export const useSelector: ReactRedux.TypedUseSelectorHook<RootState> =
   ReactRedux.useSelector;
