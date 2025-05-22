"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";
import type { MonthlyData, TopDataItem, RevenueData, ProfessionalRanking, GenderDistributionData, AgeDistributionData, PeakHoursData } from "@/types";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const ChartCard = ({ title, icon: Icon, children, className }: ChartCardProps) => (
  <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="h-[300px] md:h-[350px]">
      {children}
    </CardContent>
  </Card>
);

// Appointments per Month Chart
export const AppointmentsPerMonthChart = ({ data }: { data: MonthlyData[] }) => {
  const { t } = useLanguage();
  const chartConfig = {
    appointments: { label: t("appointmentsPerMonth"), color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title={t("appointmentsPerMonth")}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="appointments" stroke="var(--color-appointments)" activeDot={{ r: 8 }} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
};

// Cancellations per Month Chart
export const CancellationsPerMonthChart = ({ data }: { data: MonthlyData[] }) => {
  const { t } = useLanguage();
  const chartConfig = {
    cancellations: { label: t("cancellationsPerMonth"), color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title={t("cancellationsPerMonth")}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="cancellations" fill="var(--color-cancellations)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};

// Top Treatments Chart (Horizontal Bar)
export const TopTreatmentsChart = ({ data }: { data: TopDataItem[] }) => {
  const { t } = useLanguage();
   const chartConfig = {
    value: { label: t("topTreatments"), color: "hsl(var(--chart-1))" },
    ...data.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill || "hsl(var(--chart-1))" };
      return acc;
    }, {} as ChartConfig)
  } satisfies ChartConfig;
  
  return (
    <ChartCard title={t("topTreatments")}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.fill || "hsl(var(--chart-1))"} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};


// Revenue by Treatment Chart
export const RevenueByTreatmentChart = ({ data }: { data: RevenueData[] }) => {
  const { t } = useLanguage();
  const chartConfig = {
    revenue: { label: t("revenueByTreatment"), color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title={t("revenueByTreatment")}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};


// Gender Distribution Chart
export const GenderDistributionChart = ({ data }: { data: GenderDistributionData[] }) => {
  const { t } = useLanguage();
  const chartConfig = data.reduce((acc, entry) => {
    acc[entry.name] = { label: entry.name, color: entry.fill };
    return acc;
  }, {} as ChartConfig);
  
  return (
    <ChartCard title={t("genderDistribution")}>
      <ChartContainer config={chartConfig} className="h-full w-full aspect-square">
        <PieChart>
          <Tooltip content={<ChartTooltipContent nameKey="name" />} />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
};

// Age Distribution Chart
export const AgeDistributionChart = ({ data }: { data: AgeDistributionData[] }) => {
  const { t } = useLanguage();
   const chartConfig = {
    count: { label: t("ageDistribution"), color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title={t("ageDistribution")}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age_group" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};


// Appointments vs Cancellations Chart
export const AppointmentsVsCancellationsChart = ({ data }: { data: MonthlyData[] }) => {
  const { t } = useLanguage();
  const chartConfig = {
    appointments: { label: t("appointmentsPerMonth"), color: "hsl(var(--chart-1))" },
    cancellations: { label: t("cancellationsPerMonth"), color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title={t("appointmentsVsCancellations")}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="appointments" stroke="var(--color-appointments)" />
          <Line type="monotone" dataKey="cancellations" stroke="var(--color-cancellations)" />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
};


// Generic Table Component for Rankings, Specialties, Peak Hours
interface TableDisplayProps<T extends object> {
  title: string;
  data: T[];
  columns: { key: keyof T; label: string }[];
  icon?: React.ElementType;
  className?: string;
}

export function TableDisplay<T extends object>({ title, data, columns, icon: Icon, className }: TableDisplayProps<T>) {
   const { t } = useLanguage();
   if (!data || data.length === 0) {
    return (
      <ChartCard title={title} icon={Icon} className={className}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {t("noData")}
        </div>
      </ChartCard>
    );
  }
  return (
    <ChartCard title={title} icon={Icon} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={String(col.key)}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {columns.map((col) => (
                    <TableCell key={`cell-${rowIndex}-${String(col.key)}`}>
                      {String(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ResponsiveContainer>
    </ChartCard>
  );
}
