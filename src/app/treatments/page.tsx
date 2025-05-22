
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

export default function TreatmentsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope />
            Gestión de Tratamientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta sección permitirá la gestión completa (CRUD) de los tratamientos.</p>
          <p className="mt-4 text-muted-foreground">Contenido y funcionalidad para esta página se implementarán en el futuro.</p>
        </CardContent>
      </Card>
    </div>
  );
}
