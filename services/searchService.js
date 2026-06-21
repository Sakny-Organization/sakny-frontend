import matchService from './matchService';

export const defaultSearchFilters = {};

export const searchMatches = async () => {
  const items = await matchService.getAllMatches();
  return {
    items: Array.isArray(items) ? items : [],
    meta: {
      total: Array.isArray(items) ? items.length : 0,
    },
  };
};

export default { defaultSearchFilters, searchMatches };
