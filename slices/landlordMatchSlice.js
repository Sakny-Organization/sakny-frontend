import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTenantMatches, getTenantCompatibility, getLandlordRecommendations } from '../services/landlordMatchApi';

const mapMatchToCard = (match) => ({
  id: match.userId,
  propertyId: match.propertyId,
  propertyTitle: match.propertyTitle,
  matchPercentage: Math.round(match.score),
  matchBreakdown: match.breakdown,
  strengths: match.strengths,
  conflicts: match.conflicts,
  explanation: match.explanation,
  discussionTopics: match.discussionTopics,
  name: match.profile?.name || 'Tenant',
  age: match.profile?.age,
  gender: match.profile?.gender,
  budget: match.profile?.budgetMin != null
    ? `${match.profile.budgetMin.toLocaleString()}–${match.profile.budgetMax.toLocaleString()} EGP`
    : 'N/A',
  budgetMin: match.profile?.budgetMin,
  budgetMax: match.profile?.budgetMax,
  location: getLocation(match.profile),
  occupation: match.profile?.occupation,
  bio: match.profile?.bio,
  image: match.profile?.profilePhotoUrl || `https://ui-avatars.com/api/?background=e5e7eb&color=374151&size=200&name=${encodeURIComponent(match.profile?.name || 'U')}`,
  tags: buildTags(match.profile),
  verified: Boolean(match.profile?.isVerified),
  isOnline: false,
  _raw: match.profile,
});

const getLocation = (profile) => {
  if (!profile) return 'Egypt';
  if (profile.preferredAreas?.length) {
    const first = profile.preferredAreas[0];
    const city = first.city?.nameEn || first.cityName;
    const gov = first.governorate?.nameEn || first.governorateName;
    if (city) return gov ? `${city}, ${gov}` : city;
  }
  if (profile.currentCity?.nameEn) {
    return profile.currentGovernorate?.nameEn
      ? `${profile.currentCity.nameEn}, ${profile.currentGovernorate.nameEn}`
      : profile.currentCity.nameEn;
  }
  return 'Egypt';
};

const SMOKING_LABELS = { NON_SMOKER: 'Non-smoker', SOMETIMES: 'Occasional smoker', SMOKE_OFTEN: 'Smoker' };
const PETS_LABELS = { NO_PETS: 'No pets', HAVE_PETS: 'Has pets' };
const SLEEP_LABELS = { EARLY_BIRD: 'Early bird', NIGHT_OWL: 'Night owl', FLEXIBLE: 'Flexible schedule' };

const buildTags = (profile) => {
  if (!profile) return [];
  const tags = [];
  if (profile.personalityTraits?.length) tags.push(...profile.personalityTraits.slice(0, 3));
  if (profile.smoking && SMOKING_LABELS[profile.smoking]) tags.push(SMOKING_LABELS[profile.smoking]);
  if (profile.pets && PETS_LABELS[profile.pets]) tags.push(PETS_LABELS[profile.pets]);
  if (profile.sleepSchedule && SLEEP_LABELS[profile.sleepSchedule]) tags.push(SLEEP_LABELS[profile.sleepSchedule]);
  return tags.slice(0, 6);
};

export const fetchTenantMatches = createAsyncThunk(
  'landlordMatch/fetchTenantMatches',
  async (propertyId) => {
    const res = await getTenantMatches(propertyId);
    const data = res?.data ?? res ?? [];
    const items = Array.isArray(data) ? data : (data?.content ?? []);
    return items.map(mapMatchToCard);
  }
);

export const fetchTenantCompatibility = createAsyncThunk(
  'landlordMatch/fetchTenantCompatibility',
  async ({ propertyId, userId }) => {
    const res = await getTenantCompatibility(propertyId, userId);
    const data = res?.data ?? res;
    return mapMatchToCard(data);
  }
);

export const fetchLandlordRecommendations = createAsyncThunk(
  'landlordMatch/fetchRecommendations',
  async (limit = 10) => {
    const res = await getLandlordRecommendations(limit);
    const data = res?.data ?? res ?? [];
    const items = Array.isArray(data) ? data : (data?.content ?? []);
    return items.map(mapMatchToCard);
  }
);

const initialState = {
  tenantMatches: [],
  selectedTenant: null,
  recommendations: [],
  activePropertyId: null,
  status: 'idle',
  selectedStatus: 'idle',
  recommendationsStatus: 'idle',
  error: null,
};

const landlordMatchSlice = createSlice({
  name: 'landlordMatch',
  initialState,
  reducers: {
    setActiveProperty: (state, action) => {
      state.activePropertyId = action.payload;
    },
    clearSelectedTenant: (state) => {
      state.selectedTenant = null;
      state.selectedStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantMatches.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTenantMatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tenantMatches = action.payload;
      })
      .addCase(fetchTenantMatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTenantCompatibility.pending, (state) => {
        state.selectedStatus = 'loading';
      })
      .addCase(fetchTenantCompatibility.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded';
        state.selectedTenant = action.payload;
      })
      .addCase(fetchTenantCompatibility.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchLandlordRecommendations.pending, (state) => {
        state.recommendationsStatus = 'loading';
      })
      .addCase(fetchLandlordRecommendations.fulfilled, (state, action) => {
        state.recommendationsStatus = 'succeeded';
        state.recommendations = action.payload;
      })
      .addCase(fetchLandlordRecommendations.rejected, (state, action) => {
        state.recommendationsStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setActiveProperty, clearSelectedTenant } = landlordMatchSlice.actions;
export default landlordMatchSlice.reducer;
