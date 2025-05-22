
"use client";

import { useEffect, useState } from "react";
import { Users, CalendarDays, CalendarX2, Percent, Medal, Activity, Clock } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { 
  AppointmentsPerMonthChart, 
  CancellationsPerMonthChart, 
  TopTreatmentsChart, 
  RevenueByTreatmentChart, 
  GenderDistributionChart, 
  AgeDistributionChart, 
  AppointmentsVsCancellationsChart, 
  TableDisplay 
} from "@/components/dashboard/chart-components";
import type { MonthlyData, TopDataItem, RevenueData, ProfessionalRanking, GenderDistributionData, AgeDistributionData, PeakHoursData, FilterOptions } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth
import {
  getTotalActivePatients,
  getAppointmentsPerMonth,
  getCancellationsPerMonth,
  getMonthlyCancellationRate,
  getTopTreatments,
  getRevenueByTreatment,
  getProfessionalRanking,
  getGenderAndAgeDistribution,
  getMostDemandedSpecialties,
  getPeakAppointmentHours,
} from "@/services/api";

// Mock Filter Options (can be fetched if an endpoint becomes available)
const filterOptionsData: FilterOptions = {
  professionals: [
    { value: "all", label: "Todos los Profesionales" },
    { value: "dr_garcia", label: "Dr. García" }, 
    { value: "dra_lopez", label: "Dra. López" },
  ],
  treatments: [
    { value: "all", label: "Todos los Tratamientos" },
    { value: "masaje", label: "Masaje Terapéutico" }, 
    { value: "electro", label: "Electroterapia" },
  ],
  specialties: [
    { value: "all", label: "Todas las Especialidades" },
    { value: "trauma", label: "Traumatología" }, 
    { value: "deportiva", label: "Deportiva" },
  ],
  confirmationChannels: [
    { value: "all", label: "Todos los Canales" },
    { value: "phone", label: "Teléfono" }, 
    { value: "online", label: "Online" },
  ],
};

const chartColors = [
  "hsl(var(--chart-1))", 
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))", 
  "hsl(var(--chart-4))", 
  "hsl(var(--chart-5))"
];

export default function DashboardPage() {
  const { token, isLoading: authIsLoading } = useAuth(); // Get token from auth context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalActivePatientsData, setTotalActivePatientsData] = useState<number | null>(null);
  const [appointmentsPerMonthData, setAppointmentsPerMonthData] = useState<MonthlyData[]>([]);
  const [cancellationsPerMonthData, setCancellationsPerMonthData] = useState<MonthlyData[]>([]);
  const [monthlyCancellationRateData, setMonthlyCancellationRateData] = useState<number | null>(null);
  const [topTreatmentsData, setTopTreatmentsData] = useState<TopDataItem[]>([]);
  const [revenueByTreatmentData, setRevenueByTreatmentData] = useState<RevenueData[]>([]);
  const [professionalRankingData, setProfessionalRankingData] = useState<ProfessionalRanking[]>([]);
  const [genderDistributionData, setGenderDistributionData] = useState<GenderDistributionData[]>([]);
  const [ageDistributionData, setAgeDistributionData] = useState<AgeDistributionData[]>([]);
  const [mostDemandedSpecialtiesData, setMostDemandedSpecialtiesData] = useState<TopDataItem[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<PeakHoursData[]>([]);
  const [appointmentsVsCancellationsData, setAppointmentsVsCancellationsData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return; // Don't fetch if no token

      try {
        setLoading(true);
        setError(null);

        const [
          activePatients,
          appointmentsMonth,
          cancellationsMonth,
          cancellationRate,
          topTreatmentsRes,
          revenueByTreatmentRes,
          profRankingRes,
          genderAgeDistRes,
          demandedSpecialtiesRes,
          peakHoursRes,
        ] = await Promise.all([
          getTotalActivePatients(),
          getAppointmentsPerMonth(),
          getCancellationsPerMonth(),
          getMonthlyCancellationRate(),
          getTopTreatments(),
          getRevenueByTreatment(),
          getProfessionalRanking(),
          getGenderAndAgeDistribution(),
          getMostDemandedSpecialties(),
          getPeakAppointmentHours(),
        ]);

        setTotalActivePatientsData(activePatients);
        setAppointmentsPerMonthData(appointmentsMonth || []);
        setCancellationsPerMonthData(cancellationsMonth || []);
        setMonthlyCancellationRateData(cancellationRate);
        
        setTopTreatmentsData(
          (topTreatmentsRes || []).map((item, index) => ({ 
            ...item, 
            id: item.id || String(index), 
            fill: chartColors[index % chartColors.length] 
          }))
        );
        setRevenueByTreatmentData(revenueByTreatmentRes || []);
        setProfessionalRankingData(profRankingRes || []);
        
        const rawGenderData = genderAgeDistRes?.genderDistribution || genderAgeDistRes?.distribucionGenero || [];
        const rawAgeData = genderAgeDistRes?.ageDistribution || genderAgeDistRes?.distribucionEdad || [];

        setGenderDistributionData(
          rawGenderData.map((item, index) => ({ 
            ...item, 
            fill: chartColors[index % chartColors.length] 
          }))
        );
        setAgeDistributionData(rawAgeData);

        setMostDemandedSpecialtiesData(
          (demandedSpecialtiesRes || []).map((item, index) => ({ 
            ...item, 
            id: item.id || String(index), 
            fill: chartColors[index % chartColors.length] 
          }))
        );
        setPeakHoursData(peakHoursRes || []);

        if ((appointmentsMonth || []).length > 0) {
            const vsData = (appointmentsMonth || []).map((ap, i) => ({
                ...ap,
                cancellations: (cancellationsMonth || [])[i]?.cancellations || 0,
            }));
            setAppointmentsVsCancellationsData(vsData);
        } else {
            setAppointmentsVsCancellationsData([]);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido al cargar los datos.");
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && !authIsLoading) { // Fetch data only if token exists and auth is not loading
      fetchDashboardData();
    } else if (!authIsLoading && !token) { // If auth finished loading and there's no token, it means user needs to login
      setLoading(false); // Stop data loading, AuthProvider will redirect
    }
  }, [token, authIsLoading]);
  
  const handleFilterChange = (filters: any) => {
    console.log("Filtros aplicados:", filters);
    // TODO: Volver a obtener datos con los filtros aplicados.
  };

  if (authIsLoading || (loading && token)) { // Show skeletons if auth is loading OR if data is loading (and token exists)
    return (
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <DashboardFilters filterOptions={filterOptionsData} onFilterChange={handleFilterChange} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[100px] w-full rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[350px] w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (error && token) { // Show error only if there was an attempt to load data (token existed)
    return (
       <div className="container mx-auto py-8">
        <Alert variant="destructive" className="shadow-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al Cargar Datos</AlertTitle>
          <AlertDescription>
            {error}
            <p className="mt-2 text-xs">Por favor, intente recargar la página o contacte a soporte si el problema persiste.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // If no token and auth has finished loading, AuthProvider should have redirected.
  // If we reach here without a token, it's an unexpected state, or the login page itself.
  // For the dashboard, we expect a token.
  if (!token && !authIsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirigiendo a la página de inicio de sesión...</p>
      </div>
    );
  }


  const currentMonthAppointments = appointmentsPerMonthData.length > 0 ? appointmentsPerMonthData[appointmentsPerMonthData.length - 1]?.appointments : 0;
  const currentMonthCancellations = cancellationsPerMonthData.length > 0 ? cancellationsPerMonthData[cancellationsPerMonthData.length - 1]?.cancellations : 0;

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilters filterOptions={filterOptionsData} onFilterChange={handleFilterChange} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Pacientes Activos" value={totalActivePatientsData ?? 'N/A'} icon={Users} iconClassName="text-primary" />
        <KpiCard title="Citas Agendadas (Mes Actual)" value={currentMonthAppointments ?? 'N/A'} icon={CalendarDays} iconClassName="text-green-500" />
        <KpiCard title="Citas Canceladas (Mes Actual)" value={currentMonthCancellations ?? 'N/A'} icon={CalendarX2} iconClassName="text-red-500" />
        <KpiCard title="Tasa Cancelación Mensual" value={`${monthlyCancellationRateData !== null ? monthlyCancellationRateData.toFixed(1) : 'N/A'}%`} icon={Percent} iconClassName="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppointmentsPerMonthChart data={appointmentsPerMonthData} />
        <CancellationsPerMonthChart data={cancellationsPerMonthData} />
        <TopTreatmentsChart data={topTreatmentsData} />
        <RevenueByTreatmentChart data={revenueByTreatmentData} />
        <GenderDistributionChart data={genderDistributionData} />
        <AgeDistributionChart data={ageDistributionData} />
        <AppointmentsVsCancellationsChart data={appointmentsVsCancellationsData} />
        
        <TableDisplay
          title="Ranking de Profesionales"
          icon={Medal}
          data={professionalRankingData}
          columns={[
            { key: "name", label: "Nombre" },
            { key: "appointments", label: "Citas" },
          ]}
        />
         <TableDisplay
          title="Especialidades Más Demandadas"
          icon={Activity}
          data={mostDemandedSpecialtiesData}
          columns={[
            { key: "name", label: "Especialidad" },
            { key: "value", label: "Solicitudes" },
          ]}
        />
        <TableDisplay
          title="Horas Pico de Citas"
          icon={Clock}
          data={peakHoursData}
          columns={[
            { key: "day", label: "Día" },
            { key: "hour", label: "Hora" },
            { key: "appointments", label: "Citas" },
          ]}
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
}
