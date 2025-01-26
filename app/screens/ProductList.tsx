import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { SearchBar } from '../components/SearchBar';
import { ErrorState } from '../components/ErrorState';
import { getProducts } from '../api/productApi';
import {
  setProducts,
  appendProducts,
  setLoading,
  setError,
  setSearchQuery,
  setPagination,
  resetProducts,
} from '../store/slices/productsSlice';
import { RootState } from '../store';
import { RootStackParamList } from '../_layout';

type ProductListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
};

const NUM_COLUMNS = 2;
const INITIAL_LOAD_COUNT = 6;

export default function ProductList({ navigation }: ProductListScreenProps) {
  const dispatch = useDispatch();
  const {
    items,
    loading,
    error,
    searchQuery,
    skip,
    limit,
    total,
  } = useSelector((state: RootState) => state.products);

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setErrorModalVisible(true);
    } else {
      setErrorModalVisible(false);
    }
  }, [error]);

  const loadProducts = useCallback(
    async (skipCount: number = 0, replace: boolean = false) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await getProducts(skipCount, limit);

        dispatch(
          setPagination({
            total: response.total,
            skip: skipCount,
            limit,
          })
        );

        if (replace) {
          dispatch(setProducts(response.products));
        } else {
          dispatch(appendProducts(response.products));
        }
      } catch (err) {
        console.error('Ürün yükleme hatası:', err);
        dispatch(
          setError('Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, limit]
  );

  useEffect(() => {
    loadProducts(0, true);
  }, [loadProducts]);

  const handleRefresh = useCallback(() => {
    dispatch(resetProducts());
    loadProducts(0, true);
  }, [dispatch, loadProducts]);

  const handleLoadMore = useCallback(() => {
    if (loading || items.length >= total || error) return; 
    loadProducts(skip + limit);
  }, [loading, items.length, total, skip, limit, error, loadProducts]);

  const handleSearch = useCallback((text: string) => {
    dispatch(setSearchQuery(text));
  }, [dispatch]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loading || items.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={() => handleSearch('')}
      />

      {loading && items.length === 0 ? (
        <FlatList
          data={Array(INITIAL_LOAD_COUNT).fill(null)}
          renderItem={() => <ProductCardSkeleton />}
          numColumns={NUM_COLUMNS}
          keyExtractor={(_, index) => `skeleton-${index}`}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={loading && items.length > 0}
              onRefresh={handleRefresh}
              colors={['#2196F3']}
            />
          }
          ListFooterComponent={renderFooter}
       
        />
      )}
      <ErrorState
        visible={errorModalVisible}
        message={error || ''}
        onRetry={() => {
          setErrorModalVisible(false);
          dispatch(resetProducts());
          loadProducts(0, true);
        }}
        onRequestClose={() => setErrorModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 8,
  },
  itemContainer: {
    flex: 1,
    width: Dimensions.get('window').width / NUM_COLUMNS - 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
  },
});
