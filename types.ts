export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  profileCompletion: number;
}

export interface Roommate {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  budget: number;
  location: string;
  matchPercentage: number;
  image: string;
  occupation: string;
  tags: string[];
  bio?: string;
  isSaved?: boolean;
  verified?: boolean;
  isOnline?: boolean;
}

export interface FilterState {
  location: string;
  minBudget: number;
  maxBudget: number;
  gender: string;
  lifestyle: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  profileCompleted: boolean;
}

export interface RoommateState {
  list: Roommate[];
  saved: string[];
  filters: FilterState;
  loading: boolean;
}
