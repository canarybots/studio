"use client";

import { Users, CalendarDays, CalendarX2, Percent, List, DollarSign, Medal, PieChartIcon, BarChart3, Activity, Clock, Combine } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { AppointmentsPerMonthChart, CancellationsPerMonthChart, TopTreatmentsChart, RevenueByTreatmentChart, GenderDistributionChart, AgeDistributionChart, AppointmentsVsCancellationsChart, TableDisplay } from "@/components/dashboard/chart-components";
import type { MonthlyData, TopDataItem, RevenueData, ProfessionalRanking, GenderDistributionData, AgeDistributionData, PeakHoursData, FilterOptions } from "@/types";

// Mock Data (replace with actual API calls)
const totalActivePatientsData = 1250;
const monthlyCancellationRateData = 12.5;

const appointmentsPerMonthData: MonthlyData[] = [
  { month: "Jan", appointments: 150 }, { month: "Feb", appointments: 180 }, { month: "Mar", appointments: 220 },
  { month: "Apr", appointments: 200 }, { month: "May", appointments: 250 }, { month: "Jun", appointments: 230 },
];

const cancellationsPerMonthData: MonthlyData[] = [
  { month: "Jan", cancellations: 15 }, { month: "Feb", cancellations: 20 }, { month: "Mar", cancellations: 25 },
  { month: "Apr", cancellations: 18 }, { month: "May", cancellations: 30 }, { month: "Jun", cancellations: 22 },
];

const topTreatmentsData: TopDataItem[] = [
  { id: "1", name: "Masaje Terapéutico", value: 120, fill: "hsl(var(--chart-1))" },
  { id: "2", name: "Electroterapia", value: 95, fill: "hsl(var(--chart-2))" },
  { id: "3", name: "Ejercicios de Rehabilitación", value: 80, fill: "hsl(var(--chart-3))" },
  { id: "4", name: "Punción Seca", value: 70, fill: "hsl(var(--chart-4))" },
  { id: "5", name: "Terapia Manual", value: 60, fill: "hsl(var(--chart-5))" },
];

const revenueByTreatmentData: RevenueData[] = [
  { name: "Masaje Terapéutico", revenue: 6000 }, { name: "Electroterapia", revenue: 4750 },
  { name: "Rehabilitación", revenue: 5600 }, { name: "Punción Seca", revenue: 4200 },
  { name: "Terapia Manual", revenue: 3000 },
];

const professionalRankingData: ProfessionalRanking[] = [
  { id: "1", name: "Dr. García", appointments: 250 }, { id: "2", name: "Dra. López", appointments: 220 },
  { id: "3", name: "Dr. Martínez", appointments: 200 }, { id: "4", name: "Dra. Sánchez", appointments: 180 },
  { id: "5", name: "Dr. Pérez", appointments: 150 },
];

const genderDistributionData: GenderDistributionData[] = [
  { name: "Femenino", value: 400, fill: "hsl(var(--chart-2))" },
  { name: "Masculino", value: 300, fill: "hsl(var(--chart-1))" },
  { name: "Otro", value: 50, fill: "hsl(var(--chart-3))" },
];

const ageDistributionData: AgeDistributionData[] = [
  { age_group: "18-25", count: 150 }, { age_group: "26-35", count: 250 },
  { age_group: "36-45", count: 200 }, { age_group: "46-55", count: 180 },
  { age_group: "55+", count: 120 },
];

const mostDemandedSpecialtiesData: TopDataItem[] = [
  { id: "1", name: "Traumatología", value: 150, fill: "hsl(var(--chart-1))" },
  { id: "2", name: "Deportiva", value: 120, fill: "hsl(var(--chart-2))"  },
  { id: "3", name: "Neurológica", value: 90, fill: "hsl(var(--chart-3))"  },
  { id: "4", name: "Pediátrica", value: 70, fill: "hsl(var(--chart-4))"  },
  { id: "5", name: "Reumatológica", value: 50, fill: "hsl(var(--chart-5))"  },
];

const peakHoursData: PeakHoursData[] = [
  { day: "Lunes", hour: "10:00", appointments: 15 }, { day: "Lunes", hour: "17:00", appointments: 20 },
  { day: "Miércoles", hour: "11:00", appointments: 18 }, { day: "Viernes", hour: "16:00", appointments: 22 },
];

const appointmentsVsCancellationsData: MonthlyData[] = appointmentsPerMonthData.map((ap, i) => ({
    ...ap,
    cancellations: cancellationsPerMonthData[i]?.cancellations || 0,
}));


const filterOptionsData: FilterOptions = {
  professionals: [
    { value: "dr_garcia", label: "Dr. García" }, { value: "dra_lopez", label: "Dra. López" },
  ],
  treatments: [
    { value: "masaje", label: "Masaje Terapéutico" }, { value: "electro", label: "Electroterapia" },
  ],
  specialties: [
    { value: "trauma", label: "Traumatología" }, { value: "deportiva", label: "Deportiva" },
  ],
  confirmationChannels: [
    { value: "phone", label: "Teléfono" }, { value: "online", label: "Online" },
  ],
};


export default function DashboardPage() {
  // In a real app, onFilterChange would trigger data fetching or re-filtering
  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters);
    // Update dashboard data based on filters
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilters filterOptions={filterOptionsData} onFilterChange={handleFilterChange} />

      {/* KPI Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Pacientes Activos" value={totalActivePatientsData} icon={Users} iconClassName="text-primary" />
        <KpiCard title="Citas Agendadas (Mes Actual)" value={appointmentsPerMonthData[appointmentsPerMonthData.length - 1]?.appointments || 0} icon={CalendarDays} iconClassName="text-green-500" />
        <KpiCard title="Citas Canceladas (Mes Actual)" value={cancellationsPerMonthData[cancellationsPerMonthData.length -1]?.cancellations || 0} icon={CalendarX2} iconClassName="text-red-500" />
        <KpiCard title="Tasa Cancelación Mensual" value={`${monthlyCancellationRateData}%`} icon={Percent} iconClassName="text-yellow-500" />
      </div>

      {/* Charts Grid */}
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
