import { createAction, createReducer } from '@reduxjs/toolkit';

export const Inc = createAction<number>('Inc');
export const Dec = createAction<number>('Dec');
export const Click = createAction<number>('Click');

export const testReducer = createReducer(
   {
      counts: 0,
      clicks: 0,
   },
   builder =>
      builder
         .addCase(Inc, (state, action) => {
            state.counts += action.payload;
         })
         .addCase(Dec, (state, action) => {
            state.counts -= action.payload;
         })
         .addCase(Click, (state, action) => {
            state.clicks += 1;
         })
         .addDefaultCase(() => {})
);
