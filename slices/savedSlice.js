import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest, buildAuthHeaders } from '../services/apiClient';

const getToken = () => {
  try {
    const session = JSON.parse(localStorage.getItem('sakny_auth_session'));
    return session?.token || null;
  } catch {
    return null;
  }
};

export const fetchSavedProfiles = createAsyncThunk(
  'saved/fetchSavedProfiles',
  async (_, { getState }) => {
    const token = getState().auth.token || getToken();
    const res = await apiRequest('/v1/profile/saved', {
      method: 'GET',
      headers: buildAuthHeaders(token),
    });
    return res?.data || [];
  }
);

export const saveProfileApi = createAsyncThunk(
  'saved/saveProfile',
  async (userId, { getState }) => {
    const token = getState().auth.token || getToken();
    await apiRequest(`/v1/profile/${userId}/save`, {
      method: 'POST',
      headers: buildAuthHeaders(token),
    });
    return userId;
  }
);

export const unsaveProfileApi = createAsyncThunk(
  'saved/unsaveProfile',
  async (userId, { getState }) => {
    const token = getState().auth.token || getToken();
    await apiRequest(`/v1/profile/${userId}/save`, {
      method: 'DELETE',
      headers: buildAuthHeaders(token),
    });
    return userId;
  }
);

const savedSlice = createSlice({
  name: "saved",
  initialState: {
    ids: [],
    profiles: [],
    loading: false,
  },
  reducers: {
    toggleSavedProfile: (state, action) => {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter((id) => id !== action.payload);
      } else {
        state.ids.push(action.payload);
      }
    },
    setSavedProfiles: (state, action) => {
      state.ids = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
        state.ids = action.payload.map(p => String(p.userId || p.id));
      })
      .addCase(fetchSavedProfiles.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveProfileApi.fulfilled, (state, action) => {
        const id = String(action.payload);
        if (!state.ids.includes(id)) {
          state.ids.push(id);
        }
      })
      .addCase(unsaveProfileApi.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.ids = state.ids.filter(i => i !== id);
        state.profiles = state.profiles.filter(p => String(p.userId || p.id) !== id);
      });
  },
});

export const { toggleSavedProfile, setSavedProfiles } = savedSlice.actions;
export default savedSlice.reducer;
