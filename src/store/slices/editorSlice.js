// store/slices/editorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    isOpen: false,
    editingKlipId: null,
    formData: {
      title: '',
      dataType: 'text',
      visualization: 'text',
      chartType: 'bar',
      data: '',
    },
  },
  reducers: {
    openEditor: (state, action) => {
      state.isOpen = true;
      state.editingKlipId = action.payload?.id || null;
      
      if (action.payload) {
        // Editing existing klip
        state.formData = {
          title: action.payload.title,
          dataType: action.payload.dataType,
          visualization: action.payload.visualization,
          chartType: action.payload.chartType,
          data: typeof action.payload.data === 'object' 
            ? JSON.stringify(action.payload.data, null, 2)
            : action.payload.data,
        };
      } else {
        // Creating new klip
        state.formData = {
          title: '',
          dataType: 'text',
          visualization: 'text',
          chartType: 'bar',
          data: '',
        };
      }
    },
    
    closeEditor: (state) => {
      state.isOpen = false;
      state.editingKlipId = null;
      state.formData = {
        title: '',
        dataType: 'text',
        visualization: 'text',
        chartType: 'bar',
        data: '',
      };
    },
    
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
});

export const { openEditor, closeEditor, updateFormData } = editorSlice.actions;
export default editorSlice.reducer;