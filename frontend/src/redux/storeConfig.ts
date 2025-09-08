import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

// Create a function to configure the store with reducers
export function configureAppStore(reducers: Record<string, unknown>) {
  const rootReducer = combineReducers(reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  return store;
}