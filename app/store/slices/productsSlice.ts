
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '../../types/product';

interface ProductsState {
  items: IProduct[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  skip: number;
  limit: number;
  total: number;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  skip: 0,
  limit: 10,
  total: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<IProduct[]>) {
      state.items = action.payload;
    },
    appendProducts(state, action: PayloadAction<IProduct[]>) {
      state.items = [...state.items, ...action.payload];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setPagination(state, action: PayloadAction<{ total: number; skip: number; limit: number }>) {
      state.total = action.payload.total;
      state.skip = action.payload.skip;
      state.limit = action.payload.limit;
    },
    resetProducts(state) {
      state.items = [];
      state.skip = 0;
      state.total = 0;
    },
  },
});

export const {
  setProducts,
  appendProducts,
  setLoading,
  setError,
  setSearchQuery,
  setPagination,
  resetProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
