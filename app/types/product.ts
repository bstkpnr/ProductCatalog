



export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  brand: string;

  images: string[];
  thumbnail: string;
}

export interface IProductListResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
} 