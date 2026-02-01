import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoommateState, FilterState } from '../types';
import { MOCK_ROOMMATES } from '../data/mockData';

const initialState: RoommateState = {
  list: MOCK_ROOMMATES,
  saved: [],
  filters: {
    location: '',
    minBudget: 0,
    maxBudget: 9000,
    gender: 'All',
    lifestyle: [],
  },
  loading: false,
};

const roommateSlice = createSlice({
  name: 'roommate',
  initialState,
  reducers: {
    toggleSaveRoommate: (state, action: PayloadAction<string>) => {
      if (state.saved.includes(action.payload)) {
        state.saved = state.saved.filter(id => id !== action.payload);
      } else {
        state.saved.push(action.payload);
      }
    },
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
});

export const { toggleSaveRoommate, setFilters, resetFilters } = roommateSlice.actions;
export default roommateSlice.reducer;
