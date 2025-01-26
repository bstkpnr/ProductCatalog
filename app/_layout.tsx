import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ProductDetail from './screens/ProductDetail';
import ProductList from './screens/ProductList';
import { store,persistor } from './store';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationIndependentTree>
          <Stack.Navigator>
            <Stack.Screen
              name="ProductList"
              component={ProductList}
              options={{
                title: 'Ürünler',
                
              }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={{
                title: 'Ürün Detayı',
              }}
            />
          </Stack.Navigator>
        </NavigationIndependentTree>
      </PersistGate>
    </Provider>
  );
} 