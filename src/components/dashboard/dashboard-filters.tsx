"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";
import type { FilterOptions } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardFiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: any) => void; // Define more specific filter type
}

export function DashboardFilters({ filterOptions, onFilterChange }: DashboardFiltersProps) {
  const { t, language } = useLanguage();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [professional, setProfessional] = useState<string>("all");
  const [treatment, setTreatment] = useState<string>("all");
  const [specialty, setSpecialty] = useState<string>("all");
  const [confirmationChannel, setConfirmationChannel] = useState<string>("all");

  const locale = language === 'es' ? es : undefined;

  const handleApplyFilters = () => {
    onFilterChange({
      dateRange,
      professional,
      treatment,
      specialty,
      confirmationChannel,
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FilterIcon className="h-5 w-5" />
          {t("dashboardTitle")} {t("filterByDate").toLowerCase()} &amp; {t("all").toLowerCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-end">
          <div>
            <Label htmlFor="date-range" className="mb-1 block">{t("filterByDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale })
                    )
                  ) : (
                    <span>{t("selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={locale}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="professional" className="mb-1 block">{t("filterByProfessional")}</Label>
            <Select value={professional} onValueChange={setProfessional}>
              <SelectTrigger id="professional">
                <SelectValue placeholder={t("filterByProfessional")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {filterOptions.professionals.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="treatment" className="mb-1 block">{t("filterByTreatment")}</Label>
            <Select value={treatment} onValueChange={setTreatment}>
              <SelectTrigger id="treatment">
                <SelectValue placeholder={t("filterByTreatment")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {filterOptions.treatments.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="specialty" className="mb-1 block">{t("filterBySpecialty")}</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger id="specialty">
                <SelectValue placeholder={t("filterBySpecialty")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {filterOptions.specialties.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="confirmation-channel" className="mb-1 block">{t("filterByConfirmationChannel")}</Label>
            <Select value={confirmationChannel} onValueChange={setConfirmationChannel}>
              <SelectTrigger id="confirmation-channel">
                <SelectValue placeholder={t("filterByConfirmationChannel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {filterOptions.confirmationChannels.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Apply Button - uncomment if explicit apply is needed
          <Button onClick={handleApplyFilters} className="w-full xl:w-auto self-end">
            {t("applyFilters")}
          </Button>
          */}
        </div>
      </CardContent>
    </Card>
  );
}
