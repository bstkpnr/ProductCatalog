import { IProduct } from "./product";

export const isProduct = (value: unknown): value is IProduct => {
  if (!value || typeof value !== "object") return false;

  const product = value as IProduct;
  return (
    typeof product.id === "number" &&
    typeof product.title === "string" &&
    typeof product.description === "string" &&
    typeof product.category === "string" &&
    typeof product.price === "number" &&
    typeof product.discountPercentage === "number" &&
    typeof product.stock === "number" &&
    typeof product.brand === "string" &&
    Array.isArray(product.images) &&
    product.images.every((img) => typeof img === "string") &&
    typeof product.thumbnail === "string"
  );
};
