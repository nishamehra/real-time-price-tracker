import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface StockState {
  items: any[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async (code?: string) => {
  const response = await axios.get(`http://localhost:5000/stocks${code ? `?code=${code}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return response.data;
});

const initialState: StockState = {
  items: [],
  status: 'idle',
  error: null
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStocks.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default stockSlice.reducer;
