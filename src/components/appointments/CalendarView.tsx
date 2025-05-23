'use client';

import { useEffect, useState } from 'react';
import { getAppointments } from '@/services/api';
import { Cita } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, isSameWeek, isSameMonth, isSameYear } from 'date-fns';

function groupAppointments(appointments: Cita[], view: 'day' | 'week' | 'month' | 'year', selectedDate: Date) {
  switch (view) {
    case 'day':
      return appointments.filter(a => isSameDay(new Date(a.fecha), selectedDate));
    case 'week':
      return appointments.filter(a => isSameWeek(new Date(a.fecha), selectedDate, { weekStartsOn: 1 }));
    case 'month':
      return appointments.filter(a => isSameMonth(new Date(a.fecha), selectedDate));
    case 'year':
      return appointments.filter(a => isSameYear(new Date(a.fecha), selectedDate));
    default:
      return appointments;
  }
}

const CalendarView: React.FC = () => {
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'year'>('day');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Error al cargar citas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const grouped = groupAppointments(appointments, view, selectedDate);

  return (
    <div>
      <Tabs value={view} onValueChange={v => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="day">Día</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
          <TabsTrigger value="year">Año</TabsTrigger>
        </TabsList>
        <TabsContent value="day">
          <h3 className="font-semibold mb-2">Citas del día: {format(selectedDate, 'PPP')}</h3>
          <ul>
            {grouped.map(cita => (
              <li key={cita.id}>{format(new Date(cita.fecha), 'p')} - {cita.paciente?.nombre || ''} ({cita.estado})</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="week">
          <h3 className="font-semibold mb-2">Citas de la semana de {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'PPP')}</h3>
          <ul>
            {grouped.map(cita => (
              <li key={cita.id}>{format(new Date(cita.fecha), 'PPP p')} - {cita.paciente?.nombre || ''} ({cita.estado})</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="month">
          <h3 className="font-semibold mb-2">Citas del mes: {format(selectedDate, 'LLLL yyyy')}</h3>
          <ul>
            {grouped.map(cita => (
              <li key={cita.id}>{format(new Date(cita.fecha), 'PPP p')} - {cita.paciente?.nombre || ''} ({cita.estado})</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="year">
          <h3 className="font-semibold mb-2">Citas del año: {format(selectedDate, 'yyyy')}</h3>
          <ul>
            {grouped.map(cita => (
              <li key={cita.id}>{format(new Date(cita.fecha), 'PPP p')} - {cita.paciente?.nombre || ''} ({cita.estado})</li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarView;
