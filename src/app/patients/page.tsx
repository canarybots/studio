
"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useState } from "react";
import PatientsTable from "@/components/patients/PatientsTable";

import { Paciente } from "@/types"; // Assuming Paciente interface is in types/index.ts
import { PatientForm } from "@/components/patients/PatientForm";

export default function PatientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);

  const handleAddPatientClick = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Paciente) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users />
              Gestión de Pacientes
            </div>
            <Button onClick={handleAddPatientClick}>Agregar Paciente</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showForm ? <PatientForm patient={editingPatient} onClose={handleFormClose} /> : <PatientsTable onEdit={handleEditPatient} />}
        </CardContent>
      </Card>
    </div>
  );
}
