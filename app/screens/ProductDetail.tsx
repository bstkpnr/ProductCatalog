import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { ImageCarousel } from "../components/ImageCarousel";
import { ProductDetailSkeleton } from "../components/ProductDetailSkeleton";
import { ErrorState } from "../components/ErrorState";

import { getProductById } from "../api/productApi";
import { addToFavorites, removeFromFavorites } from "../store/slices/favoritesSlice";
import { RootState } from "../store";
import { IProduct } from "../types/product";
import { RootStackParamList } from "../_layout";

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

export default function ProductDetail() {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { id } = route.params;

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === id);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProductById(id);
      setProduct(data);
      setImages([data.thumbnail]);
    } catch (err) {
      setError("Ürün yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) {
      setImages([product.images[0], ...product.images.slice(1)]);
    }
  }, [product]);

  const handleToggleFavorite = () => {
    if (!product) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }


  if (!product && !loading && !error) {
    return (
      <View style={styles.centeredView}>
        <Text>Ürün bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ErrorState
        visible={errorModalVisible}
        message={error || ""}
        onRetry={() => {
          setErrorModalVisible(false);
          loadProduct();
        }}
        onRequestClose={() => setErrorModalVisible(false)}
      />

      {product && (
        <ScrollView style={styles.container} bounces={false}>
          <View style={styles.imageSection}>
            <ImageCarousel images={images} />
            {product.discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  -{product.discountPercentage}%
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteIcon}
              activeOpacity={0.7}
              accessibilityLabel={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
              accessibilityRole="button"
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{product.title}</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.discountPercentage > 0 && (
                <Text style={styles.originalPrice}>
                  $
                  {(
                    product.price / (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.stock,
                { color: product.stock > 0 ? "#28a745" : "#dc3545" },
              ]}
            >
              {product.stock > 0 ? `Stok: ${product.stock}` : "Stokta Yok"}
            </Text>

            <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSection: {
    position: "relative",
    backgroundColor: "#f0f0f0",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#28a745",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  favoriteIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginRight: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: "500",
    color: "#888888",
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  stock: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555555",
    marginBottom: 24,
  },
});
