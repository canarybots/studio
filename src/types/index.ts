

// API Response Wrapper
export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
  message?: string;
}

// Types for data structures used by the dashboard components
export interface MonthlyApptData {
  month: string;
  appointments: number;
}

export interface MonthlyCancellationData {
  month: string;
  cancellations: number;
}

export interface MonthlyData extends MonthlyApptData, Partial<MonthlyCancellationData> {}


export interface TopDataItem {
  id: string; // Added for React keys
  name: string;
  value: number;
  fill?: string;
}

export interface RevenueData {
  name: string; // treatment name
  revenue: number;
}

export interface ProfessionalRanking {
  id: string; // Added for React keys, can be professional's name if unique
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
  day?: string; // Made optional as API might not provide it for all peak hour stats
  hour: string;
  appointments: number;
}

// Raw API data types (before transformation for dashboard)
export interface RawMonthlyTotal {
  mes: string;
  total: number;
}

export interface RawMonthlyRate {
  mes: string;
  tasa: number;
}

export interface RawTopTreatment {
  nombre: string;
  total: number;
}

export interface RawRevenueByTreatment {
  nombre: string;
  ingresos: number;
}

export interface RawProfessionalRanking {
  profesional: string;
  total: number;
}

export interface RawGenderAgeDistribution {
  genero: string;
  rango_edad: string;
  total: number;
}

export interface RawSpecialtyDemand {
  nombre: string;
  total: number;
}

export interface RawPeakHour {
  hora: string;
  total: number;
  // dia_semana might be available from API, if so, add here
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
  password?: string;
}

export interface User {
  id: string;
  email: string;
  nombre?: string; // Assuming 'nombre' from API
  // Add other user properties as needed
}

export interface UserLoginResponseData {
  token: string;
  user?: User;
}

export interface UserLoginResponse extends ApiResponse<UserLoginResponseData> {}

// Generic Entity Types (examples, expand as needed)
export interface Paciente {
  id: number | string;
  nombre: string;
  apellidos: string;
  [key: string]: any; // For other properties
}

export interface Profesional {
  id: number | string;
  nombre: string;
  apellidos: string;
  [key: string]: any;
}

export interface Cita {
  id: number | string;
  fecha: string;
  estado?: string;
  [key: string]: any;
}

export interface Tratamiento {
  id: number | string;
  nombre: string;
  [key: string]: any;
}

export interface Especialidad {
  id: number | string;
  nombre: string;
  [key: string]: any;
}
