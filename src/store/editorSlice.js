import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  chartType: 'table',
  data: [],
  dataInput: '',
  columns: [],
  chartConfig: {
    xAxis: '',
    yAxis: '',
    colorScheme: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#00c49f']
  },
  isDataValid: false,
  validationError: ''
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
      // Reset axis config when chart type changes
      if (action.payload === 'table') {
        state.chartConfig.xAxis = '';
        state.chartConfig.yAxis = '';
      }
    },
    setDataInput: (state, action) => {
      state.dataInput = action.payload;
      state.validationError = '';
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    setChartConfig: (state, action) => {
      state.chartConfig = { ...state.chartConfig, ...action.payload };
    },
    setIsDataValid: (state, action) => {
      state.isDataValid = action.payload;
    },
    setValidationError: (state, action) => {
      state.validationError = action.payload;
    },
    resetEditor: (state) => {
      state.title = '';
      state.chartType = 'table';
      state.data = [];
      state.dataInput = '';
      state.columns = [];
      state.chartConfig = {
        xAxis: '',
        yAxis: '',
        colorScheme: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#00c49f']
      };
      state.isDataValid = false;
      state.validationError = '';
    },
    loadKlipData: (state, action) => {
      const klip = action.payload;
      state.title = klip.title;
      state.chartType = klip.chartType;
      state.data = klip.data;
      state.columns = klip.columns;
      state.chartConfig = klip.chartConfig || state.chartConfig;
      state.dataInput = JSON.stringify(klip.data, null, 2);
      state.isDataValid = true;
      state.validationError = '';
    },
    parseAndValidateData: (state, action) => {
      const input = action.payload;
      try {
        if (!input.trim()) {
          state.data = [];
          state.columns = [];
          state.isDataValid = false;
          state.validationError = 'Data input is required';
          return;
        }

        const parsedData = JSON.parse(input);
        
        if (!Array.isArray(parsedData)) {
          state.isDataValid = false;
          state.validationError = 'Data must be an array of objects';
          return;
        }

        if (parsedData.length === 0) {
          state.data = [];
          state.columns = [];
          state.isDataValid = false;
          state.validationError = 'Data array cannot be empty';
          return;
        }

        const columns = Object.keys(parsedData[0]);
        state.data = parsedData;
        state.columns = columns;
        state.isDataValid = true;
        state.validationError = '';

        // Auto-set axis for charts if not set
        if (state.chartType !== 'table' && columns.length >= 2) {
          if (!state.chartConfig.xAxis) {
            state.chartConfig.xAxis = columns[0];
          }
          if (!state.chartConfig.yAxis) {
            state.chartConfig.yAxis = columns[1];
          }
        }
      } catch (error) {
        state.isDataValid = false;
        state.validationError = 'Invalid JSON format';
        state.data = [];
        state.columns = [];
      }
    }
  }
});

export const {
  setTitle,
  setChartType,
  setDataInput,
  setData,
  setColumns,
  setChartConfig,
  setIsDataValid,
  setValidationError,
  resetEditor,
  loadKlipData,
  parseAndValidateData
} = editorSlice.actions;

export default editorSlice.reducer;