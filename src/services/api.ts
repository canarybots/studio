
import type { MonthlyData, TopDataItem, RevenueData, ProfessionalRanking, GenderDistributionData, AgeDistributionData, PeakHoursData, FilterOptions, UserCredentials, UserLoginResponse } from "@/types";

const urlServer = "https://node-api-clinica-sg-production.up.railway.app";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

// Initialize token from localStorage if available
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    authToken = storedToken;
  }
}


async function fetchData<T>(
  endpoint: string,
  options: RequestInit = {},
  isPublic: boolean = false
): Promise<T> {
  const url = new URL(`${urlServer}${endpoint}`);
  
  const headers = new Headers(options.headers || {});
  if (!isPublic && authToken) {
    headers.append('Authorization', `Bearer ${authToken}`);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    if (response.status === 401 && !isPublic) {
      // Unauthorized, token might be invalid or expired
      clearAuthToken();
      // Potentially redirect to login or notify user
      if (typeof window !== 'undefined') {
         window.location.href = '/login'; // Simple redirect
      }
    }
    const errorBody = await response.text().catch(() => "Could not read error body");
    console.error(`Error fetching ${endpoint}: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Error ${response.status} fetching ${endpoint}: ${response.statusText}`);
  }
  // Handle cases where response might be empty (e.g. 204 No Content for DELETE)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  }
  return undefined as unknown as T; // Or handle as Promise<void> or similar
}

// Authentication
export const loginUser = async (credentials: UserCredentials): Promise<UserLoginResponse> => {
  return fetchData<UserLoginResponse>("/api/auth/login", { // Assuming this is your login endpoint
    method: 'POST',
    body: JSON.stringify(credentials),
  }, true); // true because login endpoint is public
};


// Statistics (protected by default)
export const getTotalActivePatients = async (): Promise<number> => {
  const data = await fetchData<{ total: number } | number>("/api/estadisticas/pacientes-activos");
  return typeof data === 'number' ? data : data.total;
};

export const getAppointmentsPerMonth = async (): Promise<MonthlyData[]> => {
  return fetchData<MonthlyData[]>("/api/estadisticas/citas-por-mes");
};

export const getCancellationsPerMonth = async (): Promise<MonthlyData[]> => {
  return fetchData<MonthlyData[]>("/api/estadisticas/cancelaciones-por-mes");
};

export const getMonthlyCancellationRate = async (): Promise<number> => {
  const data = await fetchData<{ tasa: number } | { rate: number } | number>("/api/estadisticas/tasa-cancelacion");
  if (typeof data === 'number') return data;
  if (typeof (data as { tasa: number }).tasa === 'number') return (data as { tasa: number }).tasa;
  if (typeof (data as { rate: number }).rate === 'number') return (data as { rate: number }).rate;
  return 0; // Fallback
};

export const getTopTreatments = async (): Promise<Omit<TopDataItem, 'fill'>[]> => {
  return fetchData<Omit<TopDataItem, 'fill'>[]>("/api/estadisticas/tratamientos-mas-solicitados");
};

export const getRevenueByTreatment = async (): Promise<RevenueData[]> => {
  return fetchData<RevenueData[]>("/api/estadisticas/ingresos-por-tratamiento");
};

export const getProfessionalRanking = async (): Promise<ProfessionalRanking[]> => {
  return fetchData<ProfessionalRanking[]>("/api/estadisticas/ranking-profesionales");
};

export interface GenderAgeDistributionResponse {
  distribucionGenero?: Omit<GenderDistributionData, 'fill'>[]; // API might use Spanish key
  distribucionEdad?: AgeDistributionData[]; // API might use Spanish key
  genderDistribution?: Omit<GenderDistributionData, 'fill'>[]; // Fallback English key
  ageDistribution?: AgeDistributionData[]; // Fallback English key
}
export const getGenderAndAgeDistribution = async (): Promise<GenderAgeDistributionResponse> => {
  return fetchData<GenderAgeDistributionResponse>("/api/estadisticas/distribucion-genero-edad");
};

export const getMostDemandedSpecialties = async (): Promise<Omit<TopDataItem, 'fill'>[]> => {
  return fetchData<Omit<TopDataItem, 'fill'>[]>("/api/estadisticas/especialidades-demandadas");
};

export const getPeakAppointmentHours = async (): Promise<PeakHoursData[]> => {
  return fetchData<PeakHoursData[]>("/api/estadisticas/horas-pico");
};

// CRUD operations will also use fetchData and will be protected by default

// Pacientes
export const getPatients = async () => fetchData<any[]>('/api/pacientes');
export const getPatientById = async (id: string) => fetchData<any>(`/api/pacientes/${id}`);
export const createPatient = async (patientData: any) => fetchData<any>('/api/pacientes', { method: 'POST', body: JSON.stringify(patientData) });
export const updatePatient = async (id: string, patientData: any) => fetchData<any>(`/api/pacientes/${id}`, { method: 'PATCH', body: JSON.stringify(patientData) });
export const deletePatient = async (id: string) => fetchData<void>(`/api/pacientes/${id}`, { method: 'DELETE' });


// Profesionales
export const getProfessionals = async () => fetchData<any[]>('/api/profesionales');
export const getProfessionalById = async (id: string) => fetchData<any>(`/api/profesionales/${id}`);
export const createProfessional = async (professionalData: any) => fetchData<any>('/api/profesionales', { method: 'POST', body: JSON.stringify(professionalData) });
export const updateProfessional = async (id: string, professionalData: any) => fetchData<any>(`/api/profesionales/${id}`, { method: 'PATCH', body: JSON.stringify(professionalData) });
export const deleteProfessional = async (id: string) => fetchData<void>(`/api/profesionales/${id}`, { method: 'DELETE' });

// Citas
export const getAppointments = async () => fetchData<any[]>('/api/citas');
export const getAppointmentById = async (id: string) => fetchData<any>(`/api/citas/${id}`);
export const createAppointment = async (appointmentData: any) => fetchData<any>('/api/citas', { method: 'POST', body: JSON.stringify(appointmentData) });
export const updateAppointment = async (id: string, appointmentData: any) => fetchData<any>(`/api/citas/${id}`, { method: 'PATCH', body: JSON.stringify(appointmentData) });
export const cancelAppointment = async (id: string) => fetchData<any>(`/api/citas/${id}/cancelar`, { method: 'PATCH' });
export const completeAppointment = async (id: string) => fetchData<any>(`/api/citas/${id}/completar`, { method: 'PATCH' });

// Tratamientos
export const getTreatments = async () => fetchData<any[]>('/api/tratamientos');
export const getTreatmentById = async (id: string) => fetchData<any>(`/api/tratamientos/${id}`);
export const createTreatment = async (treatmentData: any) => fetchData<any>('/api/tratamientos', { method: 'POST', body: JSON.stringify(treatmentData) });
export const updateTreatment = async (id: string, treatmentData: any) => fetchData<any>(`/api/tratamientos/${id}`, { method: 'PATCH', body: JSON.stringify(treatmentData) });
export const deleteTreatment = async (id: string) => fetchData<void>(`/api/tratamientos/${id}`, { method: 'DELETE' });

// Especialidades
export const getSpecialties = async () => fetchData<any[]>('/api/especialidades');
export const getSpecialtyById = async (id: string) => fetchData<any>(`/api/especialidades/${id}`);
export const createSpecialty = async (specialtyData: any) => fetchData<any>('/api/especialidades', { method: 'POST', body: JSON.stringify(specialtyData) });
export const updateSpecialty = async (id: string, specialtyData: any) => fetchData<any>(`/api/especialidades/${id}`, { method: 'PATCH', body: JSON.stringify(specialtyData) });
export const deleteSpecialty = async (id: string) => fetchData<void>(`/api/especialidades/${id}`, { method: 'DELETE' });
