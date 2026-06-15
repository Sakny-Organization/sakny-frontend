import matchService from "./matchService";

export const defaultSearchFilters = {
  gender: "All",
  budgetRange: { min: 500, max: 9000 },
  city: "",
  lifestyle: [],
  smoking: "Any",
  pets: "Any",
  cleanliness: "Any",
};

const normalize = (value) => value?.toString().trim().toLowerCase() || "";

export const buildSearchPayload = (filters) => {
  const payload = {
    gender: filters.gender !== "All" ? filters.gender : undefined,
    minBudget: filters.budgetRange.min,
    maxBudget: filters.budgetRange.max,
    city: filters.city || undefined,
    lifestyle: filters.lifestyle.length > 0 ? filters.lifestyle : undefined,
    smoking: filters.smoking !== "Any" ? filters.smoking : undefined,
    pets: filters.pets !== "Any" ? filters.pets : undefined,
    cleanliness:
      filters.cleanliness !== "Any" ? filters.cleanliness : undefined,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
};

const matchesCleanliness = (cleanlinessFilter, cleanlinessValue) => {
  if (cleanlinessFilter === "Any") return true;
  if (cleanlinessFilter === "High") return cleanlinessValue >= 4;
  if (cleanlinessFilter === "Medium") return cleanlinessValue === 3;
  if (cleanlinessFilter === "Low") return cleanlinessValue <= 2;
  return true;
};

export const searchMatches = async (filters) => {
  const allMatches = await matchService.getAllMatches();
  const payload = buildSearchPayload(filters);
  const cityQuery = normalize(filters.city);

  const items = allMatches.filter((item) => {
    const matchesGender =
      filters.gender === "All" || item.gender === filters.gender;
    const matchesBudget =
      item.budget >= filters.budgetRange.min &&
      item.budget <= filters.budgetRange.max;
    const matchesCity =
      !cityQuery ||
      normalize(item.city).includes(cityQuery) ||
      normalize(item.locationLabel).includes(cityQuery) ||
      normalize(item.location).includes(cityQuery);
    const matchesLifestyle =
      filters.lifestyle.length === 0 ||
      filters.lifestyle.every((trait) =>
        [...(item.tags || []), ...(item.lifestyle || [])].some(
          (candidate) => normalize(candidate) === normalize(trait),
        ),
      );
    const matchesSmoking =
      filters.smoking === "Any" ||
      normalize(item.smoking) === normalize(filters.smoking);
    const matchesPets =
      filters.pets === "Any" ||
      normalize(item.pets).includes(normalize(filters.pets));
    const matchesClean = matchesCleanliness(
      filters.cleanliness,
      item.cleanliness,
    );

    return (
      matchesGender &&
      matchesBudget &&
      matchesCity &&
      matchesLifestyle &&
      matchesSmoking &&
      matchesPets &&
      matchesClean
    );
  });

  return {
    items,
    meta: {
      total: items.length,
      payload,
      hasActiveFilters: Object.keys(payload).length > 0,
    },
  };
};

export const getSearchFilterOptions = () => ({
  lifestyle: [
    "Non-smoker",
    "Quiet",
    "Pet friendly",
    "Clean",
    "Night owl",
    "Early bird",
  ],
  smoking: ["Any", "Non-smoker", "Sometimes", "Smoke often"],
  pets: ["Any", "Pet friendly", "No pets", "Okay with pets"],
  cleanliness: ["Any", "High", "Medium", "Low"],
});

export default {
  defaultSearchFilters,
  buildSearchPayload,
  searchMatches,
  getSearchFilterOptions,
};
