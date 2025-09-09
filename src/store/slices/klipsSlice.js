// store/slices/klipsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API operations
export const fetchKlips = createAsyncThunk('klips/fetchKlips', async () => {
  const response = await fetch('/api/klips');
  return response.json();
});

export const createKlip = createAsyncThunk('klips/createKlip', async (klipData) => {
  const response = await fetch('/api/klips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(klipData),
  });
  return response.json();
});

export const updateKlip = createAsyncThunk('klips/updateKlip', async ({ id, data }) => {
  const response = await fetch(`/api/klips/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
});

export const deleteKlip = createAsyncThunk('klips/deleteKlip', async (id) => {
  await fetch(`/api/klips/${id}`, { method: 'DELETE' });
  return id;
});

const klipsSlice = createSlice({
  name: 'klips',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch klips
      .addCase(fetchKlips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKlips.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.klips || [];
      })
      .addCase(fetchKlips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create klip
      .addCase(createKlip.fulfilled, (state, action) => {
        state.items.push(action.payload.klip);
      })
      
      // Update klip
      .addCase(updateKlip.fulfilled, (state, action) => {
        const index = state.items.findIndex(klip => klip.id === action.payload.klip.id);
        if (index !== -1) {
          state.items[index] = action.payload.klip;
        }
      })
      
      // Delete klip
      .addCase(deleteKlip.fulfilled, (state, action) => {
        state.items = state.items.filter(klip => klip.id !== action.payload);
      });
  },
});

export default klipsSlice.reducer;