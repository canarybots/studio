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
  // El backend responde: { status, token, data: { usuario } }
  const url = new URL(`${urlServer}/api/auth/login`);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const json = await response.json();
  if (json.status === 'success' && json.token && json.data?.usuario) {
    return { token: json.token, user: json.data.usuario };
  } else {
    throw new Error(json.message || 'Login failed');
  }
};

// Statistics
export const getTotalActivePatients = async (): Promise<number> => {
  const response = await fetchData<{ total: number }>("/api/estadisticas/pacientes-activos");
  // El valor está en response.data.total

  return (response as any)?.total_pacientes_activos ?? (response as any)?.data?.total_pacientes_activos ?? 0;
};

export const getAppointmentsPerMonth = async (): Promise<MonthlyApptData[]> => {
  const response = await fetchData<any>("/api/estadisticas/citas-por-mes");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
    console.log("respnse", response);
  return data.map((item: any) => ({ month: item.mes, appointments: Number(item.total_citas ?? item.citas_totales ?? item.appointments) || 0 }));
};

export const getCancellationsPerMonth = async (): Promise<MonthlyCancellationData[]> => {
  const response = await fetchData<any>("/api/estadisticas/cancelaciones-por-mes");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
  return data.map((item: any) => ({ month: item.mes, cancellations: Number(item.total_cancelaciones ?? item.citas_totales ?? item.cancellations) || 0 }));
};

export const getMonthlyCancellationRate = async (): Promise<RawMonthlyRate[]> => {
  const response = await fetchData<any>("/api/estadisticas/tasa-cancelacion");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
  return data.map((item: any) => ({ mes: item.mes, tasa: Number(item.tasa_cancelacion) || 0 }));
};

export const getTopTreatments = async (): Promise<Omit<TopDataItem, 'fill' | 'id'>[]> => {
  const response = await fetchData<any>("/api/estadisticas/tratamientos-mas-solicitados");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
  return data.map((item: any) => ({ name: item.tratamiento, value: Number(item.total_citas ?? item.value) || 0 }));
};

export const getRevenueByTreatment = async (): Promise<RevenueData[]> => {
  const response = await fetchData<any>("/api/estadisticas/ingresos-por-tratamiento");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
  return data.map((item: any) => ({ name: item.nombre, revenue: Number(item.precio_eur ?? item.revenue) || 0 }));
};

export const getGenderAndAgeDistribution = async (): Promise<RawGenderAgeDistribution[]> => {
  const response = await fetchData<any>("/api/estadisticas/distribucion-genero-edad");
  return Array.isArray(response) ? response : (response as any)?.data ?? [];
};

export const getMostDemandedSpecialties = async (): Promise<Omit<TopDataItem, 'fill' | 'id'>[]> => {
  const response = await fetchData<any>("/api/estadisticas/especialidades-demandadas");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
  return data.map((item: any) => ({ name: item.especialidad, value: Number(item.total_citas ?? item.value) || 0 }));
};

export const getPeakAppointmentHours = async (): Promise<RawPeakHour[]> => {
  const response = await fetchData<any>("/api/estadisticas/horas-pico");
  return Array.isArray(response) ? response : (response as any)?.data ?? [];
};


// CRUD operations
// Pacientes
export const getPatients = async (): Promise<Paciente[]> => {
  const response = await fetchData<{ pacientes: Paciente[] }>(
    '/api/pacientes'
  );
  return response.pacientes;
};
export const getPatientById = async (id: string): Promise<Paciente> => {
  const response = await fetchData<{ paciente: Paciente }>(
    `/api/pacientes/${id}`
  );
  return response.paciente;
};
export const createPatient = async (patientData: Partial<Paciente>): Promise<Paciente> => {
  const response = await fetchData<{ paciente: Paciente }>(
    '/api/pacientes',
    { method: 'POST', body: JSON.stringify(patientData) }
  );
  return response.paciente;
};
export const updatePatient = async (id: string, patientData: Partial<Paciente>): Promise<Paciente> => {
  const response = await fetchData<{ paciente: Paciente }>(
    `/api/pacientes/${id}`,
    { method: 'PATCH', body: JSON.stringify(patientData) }
  );
  return response.paciente;
};
export const deletePatient = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/pacientes/${id}`, { method: 'DELETE' });
};

// Profesionales
export const getProfessionals = async (): Promise<Profesional[]> => {
  const response = await fetchData<{ profesionales: Profesional[] }>(
    '/api/profesionales'
  );
  return response.profesionales;
};
export const getProfessionalById = async (id: string): Promise<Profesional> => {
  const response = await fetchData<{ profesional: Profesional }>(
    `/api/profesionales/${id}`
  );
  return response.profesional;
};
export const createProfessional = async (professionalData: Partial<Profesional>): Promise<Profesional> => {
  const response = await fetchData<{ profesional: Profesional }>(
    '/api/profesionales',
    { method: 'POST', body: JSON.stringify(professionalData) }
  );
  return response.profesional;
};
export const updateProfessional = async (id: string, professionalData: Partial<Profesional>): Promise<Profesional> => {
  const response = await fetchData<{ profesional: Profesional }>(
    `/api/profesionales/${id}`,
    { method: 'PATCH', body: JSON.stringify(professionalData) }
  );
  return response.profesional;
};
export const deleteProfessional = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/profesionales/${id}`, { method: 'DELETE' });
};

// Citas
export const getAppointments = async (): Promise<Cita[]> => {
  const response = await fetchData<{ citas: Cita[] }>(
    '/api/citas'
  );
  return response.citas;
};
export const getAppointmentById = async (id: string): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(
    `/api/citas/${id}`
  );
  return response.cita;
};
export const createAppointment = async (appointmentData: Partial<Cita>): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(
    '/api/citas',
    { method: 'POST', body: JSON.stringify(appointmentData) }
  );
  return response.cita;
};
export const updateAppointment = async (id: string, appointmentData: Partial<Cita>): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(
    `/api/citas/${id}`,
    { method: 'PATCH', body: JSON.stringify(appointmentData) }
  );
  return response.cita;
};
export const cancelAppointment = async (id: string): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(
    `/api/citas/${id}/cancelar`,
    { method: 'PATCH' }
  );
  return response.cita;
};
export const completeAppointment = async (id: string): Promise<Cita> => {
  const response = await fetchData<{ cita: Cita }>(
    `/api/citas/${id}/completar`,
    { method: 'PATCH' }
  );
  return response.cita;
};

// Tratamientos
export const getTreatments = async (): Promise<Tratamiento[]> => {
  const response = await fetchData<{ tratamientos: Tratamiento[] }>(
    '/api/tratamientos'
  );
  return response.tratamientos;
};
export const getTreatmentById = async (id: string): Promise<Tratamiento> => {
  const response = await fetchData<{ tratamiento: Tratamiento }>(
    `/api/tratamientos/${id}`
  );
  return response.tratamiento;
};
export const createTreatment = async (treatmentData: Partial<Tratamiento>): Promise<Tratamiento> => {
  const response = await fetchData<{ tratamiento: Tratamiento }>(
    '/api/tratamientos',
    { method: 'POST', body: JSON.stringify(treatmentData) }
  );
  return response.tratamiento;
};
export const updateTreatment = async (id: string, treatmentData: Partial<Tratamiento>): Promise<Tratamiento> => {
  const response = await fetchData<{ tratamiento: Tratamiento }>(
    `/api/tratamientos/${id}`,
    { method: 'PATCH', body: JSON.stringify(treatmentData) }
  );
  return response.tratamiento;
};
export const deleteTreatment = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/tratamientos/${id}`, { method: 'DELETE' });
};

// Especialidades
export const getSpecialties = async (): Promise<Especialidad[]> => {
  const response = await fetchData<{ especialidades: Especialidad[] }>(
    '/api/especialidades'
  );
  return response.especialidades;
};
export const getSpecialtyById = async (id: string): Promise<Especialidad> => {
  const response = await fetchData<{ especialidad: Especialidad }>(
    `/api/especialidades/${id}`
  );
  return response.especialidad;
};
export const createSpecialty = async (specialtyData: Partial<Especialidad>): Promise<Especialidad> => {
  const response = await fetchData<{ especialidad: Especialidad }>(
    '/api/especialidades',
    { method: 'POST', body: JSON.stringify(specialtyData) }
  );
  return response.especialidad;
};
export const updateSpecialty = async (id: string, specialtyData: Partial<Especialidad>): Promise<Especialidad> => {
  const response = await fetchData<{ especialidad: Especialidad }>(
    `/api/especialidades/${id}`,
    { method: 'PATCH', body: JSON.stringify(specialtyData) }
  );
  return response.especialidad;
};
export const deleteSpecialty = async (id: string): Promise<void> => {
  await fetchData<any>(`/api/especialidades/${id}`, { method: 'DELETE' });
};

// Professional Ranking
export const getProfessionalRanking = async (): Promise<Omit<ProfessionalRanking, 'id'>[]> => {
  const response = await fetchData<any>("/api/estadisticas/ranking-profesionales");
  const data = Array.isArray(response) ? response : (response as any)?.data ?? [];
  return data.map((item: any) => ({
    name: item.profesional,
    appointments: Number(item.citas_totales ?? item.total ?? item.appointments) || 0,
  }));
};
