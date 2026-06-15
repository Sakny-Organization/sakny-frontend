import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import matchService from "../services/matchService";
import searchService, { defaultSearchFilters } from "../services/searchService";

export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (filters) => {
    return searchService.searchMatches(filters);
  },
);

export const fetchRecommendations = createAsyncThunk(
  "matches/fetchRecommendations",
  async (limit = 4) => {
    return matchService.getRecommendedMatches(limit);
  },
);

export const fetchMatchById = createAsyncThunk(
  "matches/fetchMatchById",
  async (id) => {
    return matchService.getMatchById(id);
  },
);

const initialState = {
  items: [],
  recommendations: [],
  selectedMatch: null,
  filters: defaultSearchFilters,
  sortBy: "match",
  status: "idle",
  recommendationsStatus: "idle",
  selectedStatus: "idle",
  empty: false,
  error: null,
  meta: {
    total: 0,
    payload: {},
    hasActiveFilters: false,
  },
};

const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        budgetRange: {
          ...state.filters.budgetRange,
          ...(action.payload.budgetRange || {}),
        },
      };
    },
    resetFilters: (state) => {
      state.filters = defaultSearchFilters;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearSelectedMatch: (state) => {
      state.selectedMatch = null;
      state.selectedStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.meta = action.payload.meta;
        state.empty = action.payload.items.length === 0;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load matches";
      })
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsStatus = "loading";
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendationsStatus = "succeeded";
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.recommendationsStatus = "failed";
        state.error = action.error.message || "Failed to load recommendations";
      })
      .addCase(fetchMatchById.pending, (state) => {
        state.selectedStatus = "loading";
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selectedMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.error = action.error.message || "Failed to load profile";
      });
  },
});

export const { updateFilters, resetFilters, setSortBy, clearSelectedMatch } =
  matchSlice.actions;
export default matchSlice.reducer;
