import { configureStore } from '@reduxjs/toolkit';
import {
   TypedUseSelectorHook,
   useSelector as useReduxSelector,
   useDispatch as useReduxDispatch,
} from 'react-redux';

const store = configureStore({
   reducer: {},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<RootState>();
