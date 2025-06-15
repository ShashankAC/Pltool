import { configureStore } from '@reduxjs/toolkit';
import { PiSlice } from './PiSlice';

export const store = configureStore({ reducer: PiSlice.reducer });

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch