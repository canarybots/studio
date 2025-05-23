'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tratamiento } from '@/types';
import { getTreatments } from '@/services/api';

const TreatmentsTable: React.FC = () => {
  const [treatments, setTreatments] = useState<Tratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const data = await getTreatments();
        setTreatments(data);
      } catch (err) {
        setError('Error al cargar tratamientos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  }, []);

  if (loading) {
    return <div>Cargando tratamientos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {treatments.map((trat) => (
          <TableRow key={trat.id}>
            <TableCell>{trat.id}</TableCell>
            <TableCell>{trat.nombre}</TableCell>
            <TableCell>{trat.descripcion || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TreatmentsTable;
