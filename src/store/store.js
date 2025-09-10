import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchKlips = createAsyncThunk(
  'klips/fetchKlips',
  async () => {
    const response = await fetch('/api/klips');
    return response.json();
  }
);

export const createKlip = createAsyncThunk(
  'klips/createKlip',
  async (klipData) => {
    const response = await fetch('/api/klips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(klipData)
    });
    return response.json();
  }
);

export const updateKlip = createAsyncThunk(
  'klips/updateKlip',
  async ({ id, data }) => {
    const response = await fetch(`/api/klips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
);

export const deleteKlip = createAsyncThunk(
  'klips/deleteKlip',
  async (id) => {
    await fetch(`/api/klips/${id}`, { method: 'DELETE' });
    return id;
  }
);

export const validateData = createAsyncThunk(
  'editor/validateData',
  async (data) => {
    const response = await fetch('/api/data/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
);

export const transformData = createAsyncThunk(
  'editor/transformData',
  async ({ data, transformType }) => {
    const response = await fetch('/api/data/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, transformType })
    });
    return response.json();
  }
);

// Klips slice
const klipsSlice = createSlice({
  name: 'klips',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedKlip: null
  },
  reducers: {
    selectKlip: (state, action) => {
      state.selectedKlip = action.payload;
    },
    clearSelectedKlip: (state) => {
      state.selectedKlip = null;
    },
    updateKlipPosition: (state, action) => {
      const { id, position } = action.payload;
      const klip = state.items.find(k => k.id === id);
      if (klip) {
        klip.position = position;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch klips
      .addCase(fetchKlips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKlips.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.klips || action.payload;
      })
      .addCase(fetchKlips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create klip
      .addCase(createKlip.fulfilled, (state, action) => {
        state.items.push(action.payload.klip || action.payload);
      })
      // Update klip
      .addCase(updateKlip.fulfilled, (state, action) => {
        const index = state.items.findIndex(k => k.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload.klip || action.payload;
        }
      })
      // Delete klip
      .addCase(deleteKlip.fulfilled, (state, action) => {
        state.items = state.items.filter(k => k.id !== action.payload);
        if (state.selectedKlip?.id === action.payload) {
          state.selectedKlip = null;
        }
      });
  }
});

// Editor slice
const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    isOpen: false,
    mode: 'create', // 'create' or 'edit'
    formData: {
      title: '',
      type: 'chart',
      chartType: 'bar',
      data: null,
      config: {
        showTitle: true,
        showLegend: true,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        animation: true
      }
    },
    validation: {
      isValid: true,
      errors: [],
      suggestions: []
    },
    loading: false
  },
  reducers: {
    openEditor: (state, action) => {
      state.isOpen = true;
      state.mode = action.payload?.mode || 'create';
      if (action.payload?.klip) {
        state.formData = { ...action.payload.klip };
      } else {
        state.formData = {
          title: '',
          type: 'chart',
          chartType: 'bar',
          data: null,
          config: {
            showTitle: true,
            showLegend: true,
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            animation: true
          }
        };
      }
    },
    closeEditor: (state) => {
      state.isOpen = false;
      state.mode = 'create';
      state.formData = {
        title: '',
        type: 'chart',
        chartType: 'bar',
        data: null,
        config: {
          showTitle: true,
          showLegend: true,
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          animation: true
        }
      };
      state.validation = { isValid: true, errors: [], suggestions: [] };
    },
    updateFormData: (state, action) => {
      const { field, value } = action.payload;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        state.formData[parent][child] = value;
      } else {
        state.formData[field] = value;
      }
    },
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    clearValidation: (state) => {
      state.validation = { isValid: true, errors: [], suggestions: [] };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateData.fulfilled, (state, action) => {
        state.validation = action.payload;
      })
      .addCase(transformData.fulfilled, (state, action) => {
        state.formData.data = action.payload.data;
      });
  }
});

// UI slice for theme and layout
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    sidebarCollapsed: false,
    gridSize: 'medium',
    notifications: []
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setGridSize: (state, action) => {
      state.gridSize = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

// Export actions
export const { selectKlip, clearSelectedKlip, updateKlipPosition } = klipsSlice.actions;
export const { 
  openEditor, 
  closeEditor, 
  updateFormData, 
  setFormData, 
  clearValidation 
} = editorSlice.actions;
export const { 
  setTheme, 
  toggleSidebar, 
  setGridSize, 
  addNotification, 
  removeNotification, 
  clearNotifications 
} = uiSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    klips: klipsSlice.reducer,
    editor: editorSlice.reducer,
    ui: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;