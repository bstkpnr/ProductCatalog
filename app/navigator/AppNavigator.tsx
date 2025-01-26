import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductList from '../screens/ProductList';
import ProductDetail from '../screens/ProductDetail';
import { RootStackParamList } from '../_layout';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProductList">
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
  );
};

export default AppNavigator;
