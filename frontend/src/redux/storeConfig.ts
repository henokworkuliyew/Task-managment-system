import { configureStore } from '@reduxjs/toolkit';

// Create a function to configure the store with reducers
export function configureAppStore(reducers: any) {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}