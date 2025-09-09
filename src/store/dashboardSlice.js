import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  klips: [],
  isEditorOpen: false,
  editingKlip: null,
  loading: false,
  error: null,
  selectedKlipId: null
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setKlips: (state, action) => {
      state.klips = action.payload;
      state.error = null;
    },
    addKlip: (state, action) => {
      state.klips.push(action.payload);
    },
    updateKlip: (state, action) => {
      const index = state.klips.findIndex(klip => klip.id === action.payload.id);
      if (index !== -1) {
        state.klips[index] = action.payload;
      }
    },
    removeKlip: (state, action) => {
      state.klips = state.klips.filter(klip => klip.id !== action.payload);
      if (state.selectedKlipId === action.payload) {
        state.selectedKlipId = null;
      }
    },
    openEditor: (state, action) => {
      state.isEditorOpen = true;
      state.editingKlip = action.payload || null;
    },
    closeEditor: (state) => {
      state.isEditorOpen = false;
      state.editingKlip = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedKlip: (state, action) => {
      state.selectedKlipId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setKlips,
  addKlip,
  updateKlip,
  removeKlip,
  openEditor,
  closeEditor,
  setLoading,
  setError,
  setSelectedKlip,
  clearError
} = dashboardSlice.actions;

export default dashboardSlice.reducer;