import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";
import {
  getPostAuthPath,
  hydrateUserRole,
  persistUserRole,
  readStoredUserRole,
} from "../utils/userRole";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.login(email, password);
      // Store token
      if (response.token) {
        api.setToken(response.token);
      }
      return hydrateUserRole(response, readStoredUserRole());
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, phone, password, role }, { rejectWithValue }) => {
    try {
      const response = await api.register({ name, email, phone, password });
      // Store token
      if (response.token) {
        api.setToken(response.token);
      }
      return hydrateUserRole(response, persistUserRole(role));
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  },
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  profileCompleted: false,
  showWelcomeMessage: false,
  error: null,
};

const resolveProfileCompletion = (user) => {
  const isCompleted =
    Boolean(user?.profileCompleted) || Number(user?.profileCompletion) >= 100;
  const route = getPostAuthPath({
    user,
    profileCompleted: isCompleted,
  });
  return route !== "/profile-setup";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = hydrateUserRole(action.payload, readStoredUserRole());
      state.isAuthenticated = true;
      state.profileCompleted = resolveProfileCompletion(state.user);
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profileCompleted = false;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profileCompleted = false;
      state.showWelcomeMessage = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    // Complete profile setup
    completeProfile: (state) => {
      state.profileCompleted = true;
      if (state.user) {
        state.user.profileCompleted = true;
        state.user.profileCompletion = 100;
      }
    },
    // Update profile data
    updateProfileData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.profileCompleted = resolveProfileCompletion(state.user);
      }
    },
    // Clear welcome message
    clearWelcomeMessage: (state) => {
      state.showWelcomeMessage = false;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Restore session from localStorage
    restoreSession: (state, action) => {
      state.user = hydrateUserRole(action.payload.user, readStoredUserRole());
      state.isAuthenticated = true;
      state.profileCompleted = action.payload.profileCompleted;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.profileCompleted = resolveProfileCompletion(action.payload);
        state.showWelcomeMessage = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.profileCompleted = resolveProfileCompletion(action.payload);
        state.showWelcomeMessage = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginSuccess,
  loginFailure,
  logout,
  completeProfile,
  updateProfileData,
  clearWelcomeMessage,
  clearError,
  restoreSession,
} = authSlice.actions;
export default authSlice.reducer;
