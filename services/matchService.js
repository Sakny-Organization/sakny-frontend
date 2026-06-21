import { apiRequest, buildAuthHeaders } from './apiClient';

const token = () => {
  try {
    const session = JSON.parse(localStorage.getItem('sakny_auth_session'));
    return session?.token || null;
  } catch {
    return null;
  }
};

export const getAllMatches = async () => {
  const res = await apiRequest(`/v1/profile/roommates/scored`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });

  const page = res?.data ?? res;
  const content = Array.isArray(page) ? page : (page?.content ?? []);

  return content.map(item => {
    if (item.profile) {
      return {
        ...item.profile,
        matchScore: item.score,
        matchBreakdown: item.breakdown,
        strengths: item.strengths,
        conflicts: item.conflicts,
        explanation: item.explanation,
        discussionTopics: item.discussionTopics,
      };
    }
    return item;
  });
};

export const getRecommendedMatches = async (limit = 4) => {
  const all = await getAllMatches();
  return all.slice(0, limit);
};

export const getMatchById = async (id) => {
  const res = await apiRequest(`/v1/profile/${id}`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });
  const profile = res?.data ?? res ?? null;

  try {
    const scoreRes = await apiRequest(`/v1/profile/${id}/compatibility`, {
      method: 'GET',
      headers: buildAuthHeaders(token()),
    });
    const scoreData = scoreRes?.data ?? scoreRes;
    if (scoreData && profile) {
      profile.matchScore = scoreData.score;
      profile.matchBreakdown = scoreData.breakdown;
      profile.strengths = scoreData.strengths;
      profile.conflicts = scoreData.conflicts;
      profile.explanation = scoreData.explanation;
      profile.discussionTopics = scoreData.discussionTopics;
    }
  } catch {
    // Compatibility endpoint might fail, that's ok
  }

  return profile;
};

export default { getAllMatches, getRecommendedMatches, getMatchById };
