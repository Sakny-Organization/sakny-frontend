import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchProperties as apiFetchProperties,
  fetchProperty as apiFetchProperty,
  fetchMyProperties as apiFetchMyProperties,
  createProperty as apiCreateProperty,
  updateProperty as apiUpdateProperty,
  deleteProperty as apiDeleteProperty,
  fetchAmenities as apiFetchAmenities,
  togglePropertyStatus as apiTogglePropertyStatus,
} from '../services/propertyApi';

export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async ({ filters = {}, page = 0 } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiFetchProperties(filters, page, 12, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load properties');
    }
  }
);

export const fetchProperty = createAsyncThunk(
  'properties/fetchProperty',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiFetchProperty(id, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load property');
    }
  }
);

export const fetchMyProperties = createAsyncThunk(
  'properties/fetchMyProperties',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiFetchMyProperties(token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load your listings');
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async ({ propertyData, images }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiCreateProperty(propertyData, images, token);
      return res?.data;
    } catch (err) {
      const error = new Error(err.message || 'Failed to create listing');
      if (err.fieldErrors) error.fieldErrors = err.fieldErrors;
      return rejectWithValue({ message: error.message, fieldErrors: err.fieldErrors || null });
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, propertyData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiUpdateProperty(id, propertyData, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue({ message: err.message || 'Failed to update listing' });
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiDeleteProperty(id, token);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete listing');
    }
  }
);

export const fetchAmenities = createAsyncThunk(
  'properties/fetchAmenities',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetchAmenities();
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load amenities');
    }
  }
);

export const toggleStatus = createAsyncThunk(
  'properties/toggleStatus',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiTogglePropertyStatus(id, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update status');
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    list: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    filters: {
      governorateId: '',
      cityId: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      furnished: '',
    },
    activeProperty: null,
    myListings: [],
    amenities: [],
    loading: false,
    detailLoading: false,
    myListingsLoading: false,
    creating: false,
    error: null,
    createError: null,
    createFieldErrors: null,
  },
  reducers: {
    setPropertyFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetPropertyFilters: (state) => {
      state.filters = {
        governorateId: '',
        cityId: '',
        propertyType: '',
        minPrice: '',
        maxPrice: '',
        furnished: '',
      };
    },
    clearCreateError: (state) => {
      state.createError = null;
      state.createFieldErrors = null;
    },
    clearActiveProperty: (state) => {
      state.activeProperty = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        const page = action.payload;
        if (page) {
          state.list = page.content || [];
          state.currentPage = page.number ?? 0;
          state.totalPages = page.totalPages ?? 0;
          state.totalElements = page.totalElements ?? 0;
        }
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Detail
      .addCase(fetchProperty.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.activeProperty = action.payload;
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // My listings
      .addCase(fetchMyProperties.pending, (state) => {
        state.myListingsLoading = true;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myListingsLoading = false;
        state.myListings = action.payload?.content || action.payload || [];
      })
      .addCase(fetchMyProperties.rejected, (state, action) => {
        state.myListingsLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProperty.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.createFieldErrors = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.myListings.unshift(action.payload);
        }
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload?.message || action.payload;
        state.createFieldErrors = action.payload?.fieldErrors || null;
      })

      // Update
      .addCase(updateProperty.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.myListings.findIndex((p) => p.id === updated.id);
          if (idx !== -1) state.myListings[idx] = updated;
          if (state.activeProperty?.id === updated.id) state.activeProperty = updated;
        }
      })

      // Delete
      .addCase(deleteProperty.fulfilled, (state, action) => {
        const id = action.payload;
        state.myListings = state.myListings.filter((p) => p.id !== id);
        state.list = state.list.filter((p) => p.id !== id);
      })

      // Toggle status
      .addCase(toggleStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.myListings.findIndex((p) => p.id === updated.id);
          if (idx !== -1) state.myListings[idx] = updated;
          if (state.activeProperty?.id === updated.id) state.activeProperty = updated;
        }
      })

      // Amenities
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.amenities = action.payload || [];
      });
  },
});

export const {
  setPropertyFilters,
  resetPropertyFilters,
  clearCreateError,
  clearActiveProperty,
} = propertySlice.actions;

export default propertySlice.reducer;
