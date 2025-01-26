import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
      <ImageCarousel images={product.images} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{product.title}</Text>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite ? "#F44336" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>
          ${product.price.toFixed(2)}
          {product.discountPercentage > 0 && (
            <Text style={styles.discount}>
              {" "}
              ({product.discountPercentage}% indirim)
            </Text>
          )}
        </Text>

        <Text
          style={[
            styles.stock,
            { color: product.stock > 0 ? "#4CAF50" : "#F44336" },
          ]}
        >
          {product.stock > 0 ? `Stok: ${product.stock}` : "Stokta Yok"}
        </Text>

        <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    marginRight: 16,
  },
  favoriteButton: {
    padding: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2196F3",
    marginBottom: 8,
  },
  discount: {
    fontSize: 16,
    color: "#4CAF50",
  },
  stock: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
  },
  details: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});
