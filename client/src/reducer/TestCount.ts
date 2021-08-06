import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const testSlice = createSlice({
   name: 'tests',
   initialState: {
      clicks: 0,
      counts: 0,
   },
   reducers: {
      Inc: (state, action: PayloadAction<number | undefined>) => {
         state.counts += action.payload || 1;
      },
      Dec: (state, action: PayloadAction<number | undefined>) => {
         state.counts -= action.payload || 1;
      },
      Click: state => {
         state.clicks += 1;
      },
   },
});

export const Click = testSlice.actions.Click;
export const Inc = testSlice.actions.Inc;
export const Dec = testSlice.actions.Dec;

export const testReducer = testSlice.reducer;
