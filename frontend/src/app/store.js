import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import footprintReducer from '../features/footprint/footprintSlice';
import recommendationReducer from '../features/recommendations/recommendationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    footprints: footprintReducer,
    recommendations: recommendationReducer,
  },
});