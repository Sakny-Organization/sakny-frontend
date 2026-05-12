import { createSlice } from "@reduxjs/toolkit";

export const SAVED_STORAGE_KEY = "sakny-saved-profiles";

const getInitialSavedIds = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(SAVED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const savedSlice = createSlice({
  name: "saved",
  initialState: {
    ids: getInitialSavedIds(),
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
});

export const { toggleSavedProfile, setSavedProfiles } = savedSlice.actions;
export default savedSlice.reducer;
