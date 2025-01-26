import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProductList from '../screens/ProductList'
import ProductDetail from '../screens/ProductDetail'
import { NavigationIndependentTree } from '@react-navigation/native'

const Stack = createStackNavigator()
const AppNavigator = () => {

  return (
    <NavigationIndependentTree>
        <Stack.Navigator initialRouteName="ProductList">
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
        </Stack.Navigator>
    </NavigationIndependentTree>
    
  )
}

export default AppNavigator

const styles = StyleSheet.create({})