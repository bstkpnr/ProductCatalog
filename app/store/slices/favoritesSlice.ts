import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '../../types/product';

interface FavoritesState {
  items: IProduct[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<IProduct>) => {
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
   
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 