import axiosInstance from './baseApi';
import { IProduct, IProductListResponse } from '../types/product';

export const getProducts = async (
  skip: number = 0,
  limit: number = 100,
): Promise<IProductListResponse> => {
  const response = await axiosInstance.get<IProductListResponse>('/products', {
    params: {
      skip,
      limit,
    },
  });
  return response.data;
};

export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await axiosInstance.get<IProduct>(`/products/${id}`);
  return response.data;
};
