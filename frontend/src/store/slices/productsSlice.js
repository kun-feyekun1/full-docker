// src/features/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: 1, title: "Laptop", description: "High performance laptop", price: 1500 },
  { id: 2, title: "Phone", description: "Latest smartphone", price: 800 },
  { id: 3, title: "Headphones", description: "Noise-cancelling", price: 200 },
  { id: 4, title: "Smartwatch", description: "Tracks fitness", price: 300 },
];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.push({ id: Date.now(), ...action.payload });
    }
  }
});

export const { addProduct } = productsSlice.actions;
export default productsSlice.reducer;
