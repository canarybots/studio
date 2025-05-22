
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PatientsPage() {
  // const { t } = useLanguage(); // This would cause error as useLanguage is a client hook.
  // Page should be client component or pass t as prop if needed here for static content.
  // For now, hardcoding title for simplicity as this is a placeholder.
  
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users />
            Gestión de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta sección permitirá la gestión completa (CRUD) de los pacientes.</p>
          <p className="mt-4 text-muted-foreground">Contenido y funcionalidad para esta página se implementarán en el futuro.</p>
        </CardContent>
      </Card>
    </div>
  );
}
