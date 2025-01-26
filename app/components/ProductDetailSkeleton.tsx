import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';

const { width: screenWidth } = Dimensions.get('window');

export const ProductDetailSkeleton: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.carousel, { opacity }]} />
      
      <View style={styles.content}>
        <Animated.View style={[styles.titleLine, { opacity }]} />
        <Animated.View style={[styles.titleLine, { width: '80%', opacity }]} />
        <Animated.View style={[styles.price, { opacity }]} />
        <Animated.View style={[styles.stock, { opacity }]} />
        <View style={styles.descriptionContainer}>
          <Animated.View style={[styles.description, { opacity }]} />
          <Animated.View style={[styles.description, { width: '95%', opacity }]} />
          <Animated.View style={[styles.description, { width: '90%', opacity }]} />
          <Animated.View style={[styles.description, { width: '70%', opacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  carousel: {
    width: screenWidth,
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  content: {
    padding: 16,
  },
  titleLine: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  price: {
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 12,
    width: '40%',
  },
  stock: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 24,
    width: '30%',
  },
  descriptionContainer: {
    marginTop: 24,
  },
  description: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
    width: '100%',
  },
}); 