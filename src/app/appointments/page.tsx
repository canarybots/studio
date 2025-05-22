
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList />
            Gestión de Citas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta sección permitirá la gestión completa (CRUD) de las citas.</p>
          <p className="mt-4 text-muted-foreground">Contenido y funcionalidad para esta página se implementarán en el futuro.</p>
        </CardContent>
      </Card>
    </div>
  );
}
