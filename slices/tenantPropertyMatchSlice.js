import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMatchedProperties, getPropertyCompatibility } from '../services/tenantPropertyMatchApi';

const mapPropertyMatch = (match) => ({
  id: match.propertyId || match.id,
  matchPercentage: Math.round(match.score),
  matchBreakdown: match.breakdown,
  strengths: match.strengths,
  conflicts: match.conflicts,
  explanation: match.explanation,
  discussionTopics: match.discussionTopics,
  title: match.property?.title || 'Property',
  description: match.property?.description,
  price: match.property?.price,
  paymentPeriod: match.property?.paymentPeriod || 'monthly',
  propertyType: match.property?.propertyType?.toLowerCase() || 'apartment',
  city: match.property?.city || match.property?.governorate || '',
  address: match.property?.address || '',
  rooms: match.property?.roomsCount || 0,
  bathrooms: match.property?.bathroomsCount || 0,
  floor: match.property?.floorNumber,
  furnished: match.property?.isFullyFurnished || false,
  images: (match.property?.images || []).map((img) => img.imageUrl || img),
  amenities: (match.property?.amenities || []).map((a) => a.nameEn || a),
  availableFrom: match.property?.availableFrom,
  petsAllowed: match.property?.petsAllowed,
  smokingAllowed: match.property?.smokingAllowed,
  utilitiesIncluded: match.property?.utilitiesIncluded,
  internetIncluded: match.property?.internetIncluded,
  owner: {
    id: match.property?.ownerId,
    name: match.property?.ownerName || 'Owner',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(match.property?.ownerName || 'Owner')}&background=111827&color=ffffff`,
  },
});

export const fetchMatchedProperties = createAsyncThunk(
  'tenantPropertyMatch/fetchMatched',
  async () => {
    const res = await getMatchedProperties();
    const data = res?.data ?? res ?? [];
    const items = Array.isArray(data) ? data : (data?.content ?? []);
    return items.map(mapPropertyMatch);
  }
);

export const fetchPropertyCompatibility = createAsyncThunk(
  'tenantPropertyMatch/fetchCompatibility',
  async (propertyId) => {
    const res = await getPropertyCompatibility(propertyId);
    const data = res?.data ?? res;
    return mapPropertyMatch(data);
  }
);

const initialState = {
  properties: [],
  selectedProperty: null,
  status: 'idle',
  selectedStatus: 'idle',
  error: null,
};

const tenantPropertyMatchSlice = createSlice({
  name: 'tenantPropertyMatch',
  initialState,
  reducers: {
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
      state.selectedStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchedProperties.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMatchedProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload;
      })
      .addCase(fetchMatchedProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPropertyCompatibility.pending, (state) => {
        state.selectedStatus = 'loading';
      })
      .addCase(fetchPropertyCompatibility.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded';
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyCompatibility.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedProperty } = tenantPropertyMatchSlice.actions;
export default tenantPropertyMatchSlice.reducer;