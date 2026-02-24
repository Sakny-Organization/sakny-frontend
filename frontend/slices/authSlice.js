import { createSlice } from "@reduxjs/toolkit";
import { MOCK_USER } from "../data/mockData";
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  profileCompleted: false,
  showWelcomeMessage: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.profileCompleted = true;
      state.showWelcomeMessage = true;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profileCompleted = false;
      state.showWelcomeMessage = false;
    },
    // Mock async login
    mockLogin: (state) => {
      state.user = MOCK_USER;
      state.isAuthenticated = true;
      state.profileCompleted = true;
      state.showWelcomeMessage = true;
    },
    // Mock signup - creates authenticated user but profile not completed
    mockSignup: (state, action) => {
      state.user = {
        id: "new-user-" + Date.now(),
        name: action.payload.name,
        email: action.payload.email,
        avatar:
          action.payload.avatar ||
          `https://i.pravatar.cc/150?u=${action.payload.email}`,
        profileCompletion: 0,
      };
      state.isAuthenticated = true;
      state.profileCompleted = false;
      state.showWelcomeMessage = true;
    },
    // Complete profile setup
    completeProfile: (state) => {
      state.profileCompleted = true;
      if (state.user) {
        state.user.profileCompletion = 100;
      }
    },
    // Update profile data
    updateProfileData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // Clear welcome message
    clearWelcomeMessage: (state) => {
      state.showWelcomeMessage = false;
    },
  },
});
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  mockLogin,
  mockSignup,
  completeProfile,
  updateProfileData,
  clearWelcomeMessage,
} = authSlice.actions;
export default authSlice.reducer;
