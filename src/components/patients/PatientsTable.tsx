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
import { Paciente } from '@/types';
import { getPatients } from '@/services/api';

const PatientsTable: React.FC = () => {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError('Failed to fetch patients.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading patients...</div>;
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
          <TableHead>Apellido</TableHead>
          <TableHead>Fecha de Nacimiento</TableHead>
          <TableHead>Género</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>{patient.id}</TableCell>
            <TableCell>{patient.nombre}</TableCell>
            <TableCell>{patient.apellido}</TableCell>
            <TableCell>{new Date(patient.fechaNacimiento).toLocaleDateString()}</TableCell>
            <TableCell>{patient.genero}</TableCell>
            <TableCell>{patient.direccion}</TableCell>
            <TableCell>{patient.telefono}</TableCell>
            <TableCell>{patient.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientsTable;