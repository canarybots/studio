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
import { Profesional } from '@/types';
import { getProfessionals } from '@/services/api';

const ProfessionalsTable: React.FC = () => {
  const [professionals, setProfessionals] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (err) {
        setError('Error al cargar profesionales.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  if (loading) {
    return <div>Cargando profesionales...</div>;
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
          <TableHead>Apellidos</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Especialidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {professionals.map((prof) => (
          <TableRow key={prof.id}>
            <TableCell>{prof.id}</TableCell>
            <TableCell>{prof.nombre}</TableCell>
            <TableCell>{prof.apellidos}</TableCell>
            <TableCell>{prof.email || '-'}</TableCell>
            <TableCell>{prof.telefono || '-'}</TableCell>
            <TableCell>{prof.especialidad?.nombre || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProfessionalsTable;
