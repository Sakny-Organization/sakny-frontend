export const USER_ROLE_STORAGE_KEY = "sakny:user-role";

export const USER_ROLES = {
  ROOMMATE: "roommate",
  LANDLORD: "landlord",
};

export const normalizeUserRole = (value) => {
  if (!value) {
    return USER_ROLES.ROOMMATE;
  }

  const normalized = String(value).toLowerCase();
  if (
    normalized === USER_ROLES.LANDLORD ||
    normalized === "offering-place" ||
    normalized === "offering a place"
  ) {
    return USER_ROLES.LANDLORD;
  }

  return USER_ROLES.ROOMMATE;
};

export const persistUserRole = (role) => {
  if (typeof window === "undefined") {
    return USER_ROLES.ROOMMATE;
  }

  const normalizedRole = normalizeUserRole(role);
  window.localStorage.setItem(USER_ROLE_STORAGE_KEY, normalizedRole);
  return normalizedRole;
};

export const readStoredUserRole = () => {
  if (typeof window === "undefined") {
    return USER_ROLES.ROOMMATE;
  }

  return normalizeUserRole(window.localStorage.getItem(USER_ROLE_STORAGE_KEY));
};

export const hydrateUserRole = (user, fallbackRole) => {
  if (!user) {
    return user;
  }

  const role = normalizeUserRole(
    user.housingRole ||
      user.accountRole ||
      user.role ||
      fallbackRole ||
      readStoredUserRole(),
  );

  return {
    ...user,
    housingRole: role,
  };
};

export const isLandlordUser = (user) =>
  normalizeUserRole(user?.housingRole || user?.accountRole || user?.role) ===
  USER_ROLES.LANDLORD;

export const getPostAuthPath = ({ user, profileCompleted }) => {
  if (isLandlordUser(user)) {
    return "/landlord/dashboard";
  }

  return profileCompleted ? "/dashboard" : "/profile-setup";
};
