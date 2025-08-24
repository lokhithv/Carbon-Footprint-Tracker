import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import footprintService from './footprintService';

const initialState = {
  footprints: [],
  footprint: {},
  summary: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getFootprints = createAsyncThunk(
  'footprints/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await footprintService.getFootprints(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addFootprint = createAsyncThunk(
  'footprints/add',
  async (footprintData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await footprintService.addFootprint(footprintData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateFootprint = createAsyncThunk(
  'footprints/update',
  async ({ id, footprintData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await footprintService.updateFootprint(id, footprintData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFootprint = createAsyncThunk(
  'footprints/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await footprintService.deleteFootprint(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFootprintSummary = createAsyncThunk(
  'footprints/getSummary',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await footprintService.getFootprintSummary(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const footprintSlice = createSlice({
  name: 'footprint',
  initialState,
  reducers: {
    reset: (state) => initialState,
    clearFootprint: (state) => {
      state.footprint = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFootprints.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFootprints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.footprints = action.payload;
      })
      .addCase(getFootprints.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addFootprint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFootprint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.footprints.push(action.payload);
      })
      .addCase(addFootprint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateFootprint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFootprint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.footprints = state.footprints.map((footprint) =>
          footprint._id === action.payload._id ? action.payload : footprint
        );
      })
      .addCase(updateFootprint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteFootprint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFootprint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.footprints = state.footprints.filter(
          (footprint) => footprint._id !== action.payload.id
        );
      })
      .addCase(deleteFootprint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFootprintSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFootprintSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.summary = action.payload;
      })
      .addCase(getFootprintSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      ;
  },
});

export const { reset, clearFootprint } = footprintSlice.actions;
export default footprintSlice.reducer;