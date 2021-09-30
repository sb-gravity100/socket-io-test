import { configureStore } from '@reduxjs/toolkit';
import {
   TypedUseSelectorHook,
   useSelector as useReduxSelector,
   useDispatch as useReduxDispatch,
} from 'react-redux';
import UserSlice from './slices/UserSlice';

const store = configureStore({
   reducer: {
      user: UserSlice,
   },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<typeof store.dispatch>();
