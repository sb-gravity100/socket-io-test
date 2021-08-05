import { combineReducers, createStore } from '@reduxjs/toolkit';
import { testReducer } from './reducer/TestCount';

const reducers = combineReducers({
   testReducer,
});

const store = createStore(
   reducers,
   (window as any)?.__REDUX_DEVTOOLS_EXTENSION__()
);
export type RootState = ReturnType<typeof store.getState>;

export default store;
