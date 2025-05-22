
import type {
  ApiResponse,
  MonthlyApptData,
  MonthlyCancellationData,
  TopDataItem,
  RevenueData,
  ProfessionalRanking,
  RawGenderAgeDistribution, // Use this for fetching
  RawPeakHour, // Use this for fetching
  FilterOptions,
  UserCredentials,
  UserLoginResponseData,
  Paciente,
  Profesional,
  Cita,
  Tratamiento,
  Especialidad,
  RawMonthlyTotal,
  RawMonthlyRate,
  RawTopTreatment,
  RawRevenueByTreatment,
  RawProfessionalRanking,
  RawSpecialtyDemand,
} from "@/types";

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

if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    authToken = storedToken;
  }
}

async function fetchData<TResponseData>(
  endpoint: string,
  options: RequestInit = {},
  isPublic: boolean = false
): Promise<TResponseData> {
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
      clearAuthToken();
      if (typeof window !== 'undefined') {
         window.location.href = '/login';
      }
    }
    const errorBody = await response.text().catch(() => "Could not read error body");
    console.error(`Error fetching ${endpoint}: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Error ${response.status} fetching ${endpoint}: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204) { // No Content for successful DELETE typically
    return undefined as unknown as TResponseData;
  }
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const apiResponse = await response.json() as ApiResponse<TResponseData>;
    if (apiResponse.status === 'success') {
      return apiResponse.data;
    } else {
      // Handle API-level errors if status is "fail" or "error" even with 2xx HTTP status
      console.error(`API error for ${endpoint}:`, apiResponse);
      throw new Error(apiResponse.message || `API request failed for ${endpoint}`);
    }
  }
  return undefined as unknown as TResponseData; 
}

// Authentication
export const loginUser = async (credentials: UserCredentials): Promise<UserLoginResponseData> => {
  // The API response is { status: "success", data: { token: "...", user: {...} } }
  // fetchData will already extract the content of "data"
  return fetchData<UserLoginResponseData>("/api/auth/login", {
    method: 'POST',
    body: JSON.stringify(credentials),
  }, true);
};

// Statistics
export const getTotalActivePatients = async (): Promise<number> => {
  const response = await fetchData<{ total: number }>("/api/estadisticas/pacientes-activos");
  return response.total;
};

export const getAppointmentsPerMonth = async (): Promise<MonthlyApptData[]> => {
  const response = await fetchData<{ citasPorMes: RawMonthlyTotal[] }>("/api/estadisticas/citas-por-mes");
  return response.citasPorMes.map(item => ({ month: item.mes, appointments: item.total }));
};

export const getCancellationsPerMonth = async (): Promise<MonthlyCancellationData[]> => {
  const response = await fetchData<{ cancelacionesPorMes: RawMonthlyTotal[] }>("/api/estadisticas/cancelaciones-por-mes");
  return response.cancelacionesPorMes.map(item => ({ month: item.mes, cancellations: item.total }));
};

export const getMonthlyCancellationRate = async (): Promise<RawMonthlyRate[]> => {
  // Returns array: [{ mes: "2025-05", tasa: 0.12 }, ...]
  // The page component will need to decide how to use this (e.g., latest month's rate)
  const response = await fetchData<{ tasaCancelacion: RawMonthlyRate[] }>("/api/estadisticas/tasa-cancelacion");
  return response.tasaCancelacion; 
};

export const getTopTreatments = async (): Promise<Omit<TopDataItem, 'fill' | 'id'>[]> => {
  const response = await fetchData<{ tratamientosMasSolicitados: RawTopTreatment[] }>("/api/estadisticas/tratamientos-mas-solicitados");
  return response.tratamientosMasSolicitados.map(item => ({ name: item.nombre, value: item.total }));
};

export const getRevenueByTreatment = async (): Promise<RevenueData[]> => {
  const response = await fetchData<{ ingresosPorTratamiento: RawRevenueByTreatment[] }>("/api/estadisticas/ingresos-por-tratamiento");
  return response.ingresosPorTratamiento.map(item => ({ name: item.nombre, revenue: item.ingresos }));
};

export const getProfessionalRanking = async (): Promise<Omit<ProfessionalRanking, 'id'>[]> => {
  const response = await fetchData<{ rankingProfesionales: RawProfessionalRanking[] }>("/api/estadisticas/ranking-profesionales");
  return response.rankingProfesionales.map(item => ({ name: item.profesional, appointments: item.total }));
};

export const getGenderAndAgeDistribution = async (): Promise<RawGenderAgeDistribution[]> => {
  const response = await fetchData<{ distribucion: RawGenderAgeDistribution[] }>("/api/estadisticas/distribucion-genero-edad");
  return response.distribucion;
};

export const getMostDemandedSpecialties = async (): Promise<Omit<TopDataItem, 'fill' | 'id'>[]> => {
  const response = await fetchData<{ especialidadesDemandadas: RawSpecialtyDemand[] }>("/api/estadisticas/especialidades-demandadas");
  return response.especialidadesDemandadas.map(item => ({ name: item.nombre, value: item.total }));
};

export const getPeakAppointmentHours = async (): Promise<RawPeakHour[]> => {
  // Returns [{ hora: "10:00", total: 8 }, ...]
  // Page component will map this to PeakHoursData (name: hora, value: total)
  const response = await fetchData<{ horasPico: RawPeakHour[] }>("/api/estadisticas/horas-pico");
  return response.horasPico;
};


// CRUD operations
// Pacientes
export const getPatients = async (): Promise<Paciente[]> => {
  const response = await fetchData<{ pacientes: Paciente[] }>('/api/pacientes');
  return response.pacientes;
}
export const getPatientById = async (id: string): Promise<Paciente> => {
  const response = await fetchData<{ paciente: Paciente }>(`/api/pacientes/${id}`);
  return response.paciente;
}
export const createPatient = async (patientData: Partial<Paciente>): Promise<Paciente> => {
  const response = await fetchData<{ paciente: Paciente }>('/api/pacientes', { method: 'POST', body: JSON.stringify(patientData) });
  return response.paciente;
}
export const updatePatient = async (id: string, patientData: Partial<Paciente>): Promise<Paciente> => {
  const response = await fetchData<{ paciente: Paciente }>(`/api/pacientes/${id}`, { method: 'PATCH', body: JSON.stringify(patientData) });
  return response.paciente;
}
export const deletePatient = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/pacientes/${id}`, { method: 'DELETE' }); // Response: { status, message }
}

// Profesionales
export const getProfessionals = async (): Promise<Profesional[]> => {
  const response = await fetchData<{ profesionales: Profesional[] }>('/api/profesionales');
  return response.profesionales;
}
export const getProfessionalById = async (id: string): Promise<Profesional> => {
  const response = await fetchData<{ profesional: Profesional }>(`/api/profesionales/${id}`);
  return response.profesional;
}
export const createProfessional = async (professionalData: Partial<Profesional>): Promise<Profesional> => {
  const response = await fetchData<{ profesional: Profesional }>('/api/profesionales', { method: 'POST', body: JSON.stringify(professionalData) });
  return response.profesional;
}
export const updateProfessional = async (id: string, professionalData: Partial<Profesional>): Promise<Profesional> => {
  const response = await fetchData<{ profesional: Profesional }>(`/api/profesionales/${id}`, { method: 'PATCH', body: JSON.stringify(professionalData) });
  return response.profesional;
}
export const deleteProfessional = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/profesionales/${id}`, { method: 'DELETE' });
}

// Citas
export const getAppointments = async (): Promise<Cita[]> => {
  const response = await fetchData<{ citas: Cita[] }>('/api/citas');
  return response.citas;
}
export const getAppointmentById = async (id: string): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(`/api/citas/${id}`);
  return response.cita;
}
export const createAppointment = async (appointmentData: Partial<Cita>): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>('/api/citas', { method: 'POST', body: JSON.stringify(appointmentData) });
  return response.cita;
}
export const updateAppointment = async (id: string, appointmentData: Partial<Cita>): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(`/api/citas/${id}`, { method: 'PATCH', body: JSON.stringify(appointmentData) });
  return response.cita;
}
export const cancelAppointment = async (id: string): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(`/api/citas/${id}/cancelar`, { method: 'PATCH' });
  return response.cita;
}
export const completeAppointment = async (id: string): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(`/api/citas/${id}/completar`, { method: 'PATCH' });
  return response.cita;
}

// Tratamientos
export const getTreatments = async (): Promise<Tratamiento[]> => {
  const response = await fetchData<{ tratamientos: Tratamiento[] }>('/api/tratamientos');
  return response.tratamientos;
}
export const getTreatmentById = async (id: string): Promise<Tratamiento> => {
  const response = await fetchData<{ tratamiento: Tratamiento }>(`/api/tratamientos/${id}`);
  return response.tratamiento;
}
export const createTreatment = async (treatmentData: Partial<Tratamiento>): Promise<Tratamiento> => {
  const response = await fetchData<{ tratamiento: Tratamiento }>('/api/tratamientos', { method: 'POST', body: JSON.stringify(treatmentData) });
  return response.tratamiento;
}
export const updateTreatment = async (id: string, treatmentData: Partial<Tratamiento>): Promise<Tratamiento> => {
  const response = await fetchData<{ tratamiento: Tratamiento }>(`/api/tratamientos/${id}`, { method: 'PATCH', body: JSON.stringify(treatmentData) });
  return response.tratamiento;
}
export const deleteTreatment = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/tratamientos/${id}`, { method: 'DELETE' });
}

// Especialidades
export const getSpecialties = async (): Promise<Especialidad[]> => {
  const response = await fetchData<{ especialidades: Especialidad[] }>('/api/especialidades');
  return response.especialidades;
}
export const getSpecialtyById = async (id: string): Promise<Especialidad> => {
  const response = await fetchData<{ especialidad: Especialidad }>(`/api/especialidades/${id}`);
  return response.especialidad;
}
export const createSpecialty = async (specialtyData: Partial<Especialidad>): Promise<Especialidad> => {
  const response = await fetchData<{ especialidad: Especialidad }>('/api/especialidades', { method: 'POST', body: JSON.stringify(specialtyData) });
  return response.especialidad;
}
export const updateSpecialty = async (id: string, specialtyData: Partial<Especialidad>): Promise<Especialidad> => {
  const response = await fetchData<{ especialidad: Especialidad }>(`/api/especialidades/${id}`, { method: 'PATCH', body: JSON.stringify(specialtyData) });
  return response.especialidad;
}
export const deleteSpecialty = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/especialidades/${id}`, { method: 'DELETE' });
}
