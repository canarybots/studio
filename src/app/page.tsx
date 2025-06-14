"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  CalendarX2,
  Percent,
  Medal,
  Activity,
  Clock,
} from "lucide-react";
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
  TableDisplay,
} from "@/components/dashboard/chart-components";
import type {
  MonthlyApptData,
  MonthlyCancellationData,
  MonthlyData,
  TopDataItem,
  RevenueData,
  ProfessionalRanking,
  GenderDistributionData,
  AgeDistributionData,
  PeakHoursData,
  FilterOptions,
  RawGenderAgeDistribution,
  RawPeakHour,
  RawMonthlyRate,
} from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
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
  "hsl(var(--chart-5))",
];

export default function DashboardPage() {
  const { token, isLoading: authIsLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalActivePatientsData, setTotalActivePatientsData] = useState<
    number | null
  >(null);
  const [appointmentsPerMonthData, setAppointmentsPerMonthData] = useState<
    MonthlyApptData[]
  >([]);
  const [cancellationsPerMonthData, setCancellationsPerMonthData] = useState<
    MonthlyCancellationData[]
  >([]);
  const [monthlyCancellationRateData, setMonthlyCancellationRateData] =
    useState<number | null>(null);
  const [topTreatmentsData, setTopTreatmentsData] = useState<TopDataItem[]>([]);
  const [revenueByTreatmentData, setRevenueByTreatmentData] = useState<
    RevenueData[]
  >([]);
  const [professionalRankingData, setProfessionalRankingData] = useState<
    ProfessionalRanking[]
  >([]);
  const [genderDistributionData, setGenderDistributionData] = useState<
    GenderDistributionData[]
  >([]);
  const [ageDistributionData, setAgeDistributionData] = useState<
    AgeDistributionData[]
  >([]);
  const [mostDemandedSpecialtiesData, setMostDemandedSpecialtiesData] =
    useState<TopDataItem[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<PeakHoursData[]>([]);
  const [appointmentsVsCancellationsData, setAppointmentsVsCancellationsData] =
    useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const [
          activePatients,
          rawAppointmentsMonth,
          rawCancellationsMonth,
          rawCancellationRate,
          rawTopTreatments,
          rawRevenueByTreatment,
          rawProfRanking,
          rawGenderAgeDist,
          rawDemandedSpecialties,
          rawPeakHours,
        ] = await Promise.all([
          getTotalActivePatients(),
          getAppointmentsPerMonth(),
          getCancellationsPerMonth(),
          getMonthlyCancellationRate(), // Returns RawMonthlyRate[]
          getTopTreatments(),
          getRevenueByTreatment(),
          getProfessionalRanking(),
          getGenderAndAgeDistribution(), // Returns RawGenderAgeDistribution[]
          getMostDemandedSpecialties(),
          getPeakAppointmentHours(), // Returns RawPeakHour[]
        ]);

        setTotalActivePatientsData(activePatients);
        setAppointmentsPerMonthData(rawAppointmentsMonth || []);
        setCancellationsPerMonthData(rawCancellationsMonth || []);

        if (rawCancellationRate && rawCancellationRate.length > 0) {
          // Assuming we want the rate for the most recent month available
          const latestRate = rawCancellationRate.sort(
            (a, b) => new Date(b.mes).getTime() - new Date(a.mes).getTime()
          )[0];
          setMonthlyCancellationRateData(latestRate.tasa * 100); // Convert to percentage
        } else {
          setMonthlyCancellationRateData(null);
        }

        // --- TOP TREATMENTS ---
        setTopTreatmentsData(
          (rawTopTreatments || []).map((item: any, index: number) => {
            // Type guard: item puede ser RawTopTreatment o TopDataItem
            const nombre = (item as any).nombre ?? item.name;
            const value = Number((item as any).total ?? item.value) || 0;
            return {
              id: nombre || String(index),
              name: nombre || `Tratamiento ${index + 1}`,
              value,
              fill: chartColors[index % chartColors.length],
            };
          })
        );
        // --- REVENUE BY TREATMENT ---
        setRevenueByTreatmentData(
          (rawRevenueByTreatment || []).map((item: any, index: number) => {
            const nombre = (item as any).nombre ?? item.name;
            const revenue = Number((item as any).ingresos ?? item.revenue) || 0;
            return {
              name: nombre || `Tratamiento ${index + 1}`,
              revenue,
            };
          })
        );
        // --- PROFESSIONAL RANKING ---
        setProfessionalRankingData(
          (rawProfRanking || []).map((item: any, index: number) => {
            const profesional = (item as any).profesional ?? item.name;
            const appointments =
              Number(
                (item as any).citas_totales ?? item.appointments ?? item.total
              ) || 0;
            return {
              id: profesional || String(index),
              name: profesional || `Profesional ${index + 1}`,
              appointments,
            };
          })
        );
        // --- MOST DEMANDED SPECIALTIES ---
        setMostDemandedSpecialtiesData(
          (rawDemandedSpecialties || []).map((item: any, index: number) => {
            const nombre = (item as any).nombre ?? item.name;
            const value = Number((item as any).total ?? item.value) || 0;
            return {
              id: nombre || String(index),
              name: nombre || `Especialidad ${index + 1}`,
              value,
              fill: chartColors[index % chartColors.length],
            };
          })
        );
        // --- PEAK HOURS ---
        setPeakHoursData(
          (rawPeakHours || []).map((item: any, index: number) => {
            const hour = (item as any).hora_inicio ?? item.hour ?? "";
            const appointments =
              Number((item as any).total ?? item.appointments) || 0;
            const day = (item as any).dia_semana ?? item.day ?? "N/A";
            return {
              hour,
              appointments,
              day,
            };
          })
        );

        setGenderDistributionData(
          (rawGenderAgeDist || []).map((item: any, index: number) => {
            const name = (item as any).genero ?? item.name;
            const value = Number((item as any).total ?? item.value) || 0;
            return {
              name: name || `Género ${index + 1}`,
              value,
              fill: chartColors[index % chartColors.length],
            };
          })
        );

        setAgeDistributionData(
          (rawGenderAgeDist || []).map((item: any, index: number) => {
            const name = (item as any).edad_mediana ?? item.name;
            const value = Number((item as any).total ?? item.value) || 0;
            return {
              age_group: name || `Edad ${index + 1}`,
              count: value,
              fill: chartColors[index % chartColors.length],
            };
          })
        );

        if ((rawAppointmentsMonth || []).length > 0) {
          const vsData = (rawAppointmentsMonth || []).map((ap) => {
            const correspondingCancellation = (
              rawCancellationsMonth || []
            ).find((c) => c.month === ap.month);
            return {
              month: ap.month,
              appointments: ap.appointments,
              cancellations: correspondingCancellation?.cancellations || 0,
            };
          });
          setAppointmentsVsCancellationsData(vsData);
        } else {
          setAppointmentsVsCancellationsData([]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error desconocido al cargar los datos."
        );
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && !authIsLoading) {
      fetchDashboardData();
    } else if (!authIsLoading && !token) {
      setLoading(false);
    }
  }, [token, authIsLoading]);

  const handleFilterChange = (filters: any) => {
    console.log("Filtros aplicados:", filters);
    // TODO: Volver a obtener datos con los filtros aplicados.
  };

  if (authIsLoading || (loading && token)) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <DashboardFilters
          filterOptions={filterOptionsData}
          onFilterChange={handleFilterChange}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error && token) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="shadow-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al Cargar Datos</AlertTitle>
          <AlertDescription>
            {error}
            <p className="mt-2 text-xs">
              Por favor, intente recargar la página o contacte a soporte si el
              problema persiste.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!token && !authIsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirigiendo a la página de inicio de sesión...</p>
      </div>
    );
  }

  const currentMonthAppointments =
    appointmentsPerMonthData.length > 0
      ? appointmentsPerMonthData[appointmentsPerMonthData.length - 1]
          ?.appointments
      : 0;
  const currentMonthCancellations =
    cancellationsPerMonthData.length > 0
      ? cancellationsPerMonthData[cancellationsPerMonthData.length - 1]
          ?.cancellations
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilters
        filterOptions={filterOptionsData}
        onFilterChange={handleFilterChange}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Pacientes Activos"
          value={totalActivePatientsData ?? "N/A"}
          icon={Users}
          iconClassName="text-primary"
        />
        <KpiCard
          title="Citas Agendadas (Mes Actual)"
          value={currentMonthAppointments ?? "N/A"}
          icon={CalendarDays}
          iconClassName="text-green-500"
        />
        <KpiCard
          title="Citas Canceladas (Mes Actual)"
          value={currentMonthCancellations ?? "N/A"}
          icon={CalendarX2}
          iconClassName="text-red-500"
        />
        <KpiCard
          title="Tasa Cancelación Mensual"
          value={`${
            monthlyCancellationRateData !== null
              ? monthlyCancellationRateData.toFixed(1)
              : "N/A"
          }%`}
          icon={Percent}
          iconClassName="text-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppointmentsPerMonthChart data={appointmentsPerMonthData} />
        <CancellationsPerMonthChart data={cancellationsPerMonthData} />
        <TopTreatmentsChart data={topTreatmentsData} />
        <RevenueByTreatmentChart data={revenueByTreatmentData} />
        <GenderDistributionChart data={genderDistributionData} />
        <AgeDistributionChart data={ageDistributionData} />
        <AppointmentsVsCancellationsChart
          data={appointmentsVsCancellationsData}
        />

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
          data={peakHoursData} // This data will have 'day' as "N/A" or undefined
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
