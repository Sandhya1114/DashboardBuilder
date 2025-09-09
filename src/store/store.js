import { configureStore } from '@reduxjs/toolkit';
import { dashboardSlice } from './dashboardSlice';
import { editorSlice } from './editorSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
    editor: editorSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;