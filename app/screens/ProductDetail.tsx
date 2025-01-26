import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { ImageCarousel } from "../components/ImageCarousel";
import { ProductDetailSkeleton } from "../components/ProductDetailSkeleton";
import { ErrorState } from "../components/ErrorState";
import { getProductById } from "../api/productApi";
import {
  addToFavorites,
  removeFromFavorites,
} from "../store/slices/favoritesSlice";
import { RootState } from "../store";
import { IProduct } from "../types/product";
import { RootStackParamList } from "../_layout";

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetail"
>;

export default function ProductDetail() {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { id } = route.params;

  const dispatch = useDispatch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === id);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError("Ürün yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

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

  if (error) {
    return <ErrorState message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return (
      <ErrorState
        message="Ürün bulunamadı. Lütfen daha sonra tekrar deneyin."
        onRetry={loadProduct}
      />
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.imageSection}>
        <ImageCarousel images={product.images} />
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
          accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
              ${ (product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
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

        {product.details && (
          <View style={styles.details}>
            {Object.entries(product.details).map(([key, value]) => (
              <View style={styles.detailItem} key={key}>
                <Text style={styles.detailLabel}>{key}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  details: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    width: 140,
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
});
