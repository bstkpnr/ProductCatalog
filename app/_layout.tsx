import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppNavigator from './navigator/AppNavigator';
import { ErrorBoundary } from './errorBoundary';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { id: number };
};

export default function Layout() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
