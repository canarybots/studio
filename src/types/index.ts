
export interface MonthlyData {
  month: string;
  appointments?: number;
  cancellations?: number;
  [key: string]: any; 
}

export interface TopDataItem {
  id: string;
  name: string;
  value: number;
  fill?: string; 
}

export interface RevenueData {
  name: string; // treatment name
  revenue: number;
}

export interface ProfessionalRanking {
  id: string;
  name: string;
  appointments: number;
}

export interface GenderDistributionData {
  name: string; // gender
  value: number;
  fill: string;
}

export interface AgeDistributionData {
  age_group: string;
  count: number;
}

export interface PeakHoursData {
  day: string; // e.g., "Monday"
  hour: string; // e.g., "09:00"
  appointments: number;
}

export interface FilterOptions {
  professionals: { value: string; label: string }[];
  treatments: { value: string; label: string }[];
  specialties: { value: string; label: string }[];
  confirmationChannels: { value: string; label: string }[];
}

// Auth Types
export interface UserCredentials {
  email: string;
  password?: string; // Password might be optional if using social logins in future
  // Add other credential types if needed (e.g., provider, idToken for social logins)
}

export interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user properties as needed
}

export interface UserLoginResponse {
  token: string;
  user?: User; // Optional: API might return user details along with token
}
