'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { initializeAuth } from '../redux/slices/authSlice';

function AuthInitializer() {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);
  
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
