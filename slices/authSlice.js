import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authenticate, register } from "../services/authApi";
import { getMyProfile } from "../services/profileApi";

const AUTH_STORAGE_KEY = "sakny_auth_session";

const loadStoredSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
};

const clearSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

const storedSession = loadStoredSession();

const initialState = {
  user: storedSession?.user || null,
  token: storedSession?.token || null,
  isAuthenticated: Boolean(storedSession?.token),
  loading: false,
  error: null,
  profileCompleted: storedSession?.profileCompleted || false,
  showWelcomeMessage: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authenticate({ email, password });
      const user = {
        email,
        name: email.split("@")[0] || "Sakny User",
      };

      const session = {
        token: response.token,
        user,
        profileCompleted: false,
      };

      persistSession(session);
      return session;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, phone, avatar }, { rejectWithValue }) => {
    try {
      const response = await register({ name, email, password, phone });
      const user = {
        name,
        email,
        avatar,
      };

      const session = {
        token: response.token,
        user,
        profileCompleted: false,
      };

      persistSession(session);
      return session;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.profileCompleted = false;
      state.showWelcomeMessage = false;
      clearSession();
    },
    completeProfile: (state) => {
      state.profileCompleted = true;
      if (state.user) {
        state.user.profileCompletion = 100;
      }
      if (state.token && state.user) {
        persistSession({
          token: state.token,
          user: state.user,
          profileCompleted: true,
        });
      }
    },
    updateProfileData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      if (state.token && state.user) {
        persistSession({
          token: state.token,
          user: state.user,
          profileCompleted: state.profileCompleted,
        });
      }
    },
    clearWelcomeMessage: (state) => {
      state.showWelcomeMessage = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.profileCompleted = action.payload.profileCompleted;
        state.isAuthenticated = true;
        state.showWelcomeMessage = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.profileCompleted = action.payload.profileCompleted;
        state.isAuthenticated = true;
        state.showWelcomeMessage = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
        state.isAuthenticated = false;
      })
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload,
            profileCompletion: 100, // If profile is fetched, it's complete
          };
          state.profileCompleted = true;
        }
      })
      .addCase(fetchMyProfile.rejected, (state) => {
        state.loading = false;
        // Don't fail the whole auth if profile fetch fails
      });
  },
});

export const fetchMyProfile = createAsyncThunk(
  "auth/fetchMyProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await getMyProfile(token);
      return response.data; // ApiResponse<ProfileResponse> has data field
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

// We'll keep the profile data in auth state for now as the user's "session" profile
// In a larger app, we might have a separate profileSlice.
// But for now, it's simpler to keep it here since we don't have many profile-related actions/reducers
// And it avoids having to pass the token around to different slices/actions

export const {
  logout,
  completeProfile,
  updateProfileData,
  clearWelcomeMessage,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
