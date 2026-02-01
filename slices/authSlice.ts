import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';
import { MOCK_USER } from '../data/mockData';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  profileCompleted: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.profileCompleted = true;
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
    },
    // Mock async login
    mockLogin: (state) => {
      // In a real app, this would be a thunk
      state.user = MOCK_USER;
      state.isAuthenticated = true;
      state.profileCompleted = true;
    },
    // Mock signup - creates authenticated user but profile not completed
    mockSignup: (state, action: PayloadAction<{ name: string; email: string; phone?: string; avatar?: string }>) => {
      state.user = {
        id: 'new-user-' + Date.now(),
        name: action.payload.name,
        email: action.payload.email,
        avatar: action.payload.avatar || `https://i.pravatar.cc/150?u=${action.payload.email}`,
        profileCompletion: 0,
      };
      state.isAuthenticated = true;
      state.profileCompleted = false;
    },
    // Complete profile setup
    completeProfile: (state) => {
      state.profileCompleted = true;
      if (state.user) {
        state.user.profileCompletion = 100;
      }
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, mockLogin, mockSignup, completeProfile } = authSlice.actions;
export default authSlice.reducer;
