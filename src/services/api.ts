
import type { MonthlyData, TopDataItem, RevenueData, ProfessionalRanking, GenderDistributionData, AgeDistributionData, PeakHoursData, FilterOptions } from "@/types";

const urlServer = "https://node-api-clinica-sg-production.up.railway.app";

async function fetchData<T>(endpoint: string, queryParams?: Record<string, string | number | boolean>): Promise<T> {
  const url = new URL(`${urlServer}${endpoint}`);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Could not read error body");
    console.error(`Error fetching ${endpoint}: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Error ${response.status} fetching ${endpoint}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

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

// Example structure for services that might need CRUD operations (not used by dashboard stats directly)
// Pacientes
export const getPatients = async () => fetchData<any[]>('/api/pacientes');
export const getPatientById = async (id: string) => fetchData<any>(`/api/pacientes/${id}`);
export const createPatient = async (patientData: any) => fetchData<any>('/api/pacientes', { method: 'POST', body: JSON.stringify(patientData), headers: { 'Content-Type': 'application/json' } });
// Add similar functions for PATCH, DELETE for Pacientes and other entities.

// Note: The fetchData function currently only supports GET. For POST, PATCH, DELETE, it would need to be extended
// to accept method, body, headers etc. The example createPatient shows a conceptual extension.
// For the statistics endpoints (all GET), the current fetchData is sufficient.
