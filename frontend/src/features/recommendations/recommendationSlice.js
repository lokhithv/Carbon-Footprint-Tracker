import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recommendationService from './recommendationService';

const initialState = {
  recommendations: [],
  insights: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getRecommendations = createAsyncThunk(
  'recommendations/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recommendationService.getRecommendations(token);
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

export const generateRecommendations = createAsyncThunk(
  'recommendations/generate',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recommendationService.generateRecommendations(token);
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

export const updateRecommendation = createAsyncThunk(
  'recommendations/update',
  async ({ id, recommendationData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recommendationService.updateRecommendation(
        id,
        recommendationData,
        token
      );
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

export const deleteRecommendation = createAsyncThunk(
  'recommendations/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recommendationService.deleteRecommendation(id, token);
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

export const getCarbonInsights = createAsyncThunk(
  'recommendations/insights',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recommendationService.getCarbonInsights(token);
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

export const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendations = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(generateRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendations = [...state.recommendations, ...action.payload];
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRecommendation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecommendation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendations = state.recommendations.map((recommendation) =>
          recommendation._id === action.payload._id
            ? action.payload
            : recommendation
        );
      })
      .addCase(updateRecommendation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteRecommendation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecommendation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendations = state.recommendations.filter(
          (recommendation) => recommendation._id !== action.payload.id
        );
      })
      .addCase(deleteRecommendation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCarbonInsights.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getCarbonInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = '';
        state.insights = action.payload;
      })
      .addCase(getCarbonInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.insights = null;
      });
  },
});

export const { reset } = recommendationSlice.actions;
export default recommendationSlice.reducer;