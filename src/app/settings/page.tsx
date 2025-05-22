
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 />
            Configuración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta sección permitirá ajustar la configuración de la aplicación.</p>
          <p className="mt-2">Aquí se podrían incluir opciones de perfil, notificaciones, y otros ajustes generales.</p>
          <p className="mt-4 text-muted-foreground">Contenido y funcionalidad para esta página se implementarán en el futuro.</p>
        </CardContent>
      </Card>
    </div>
  );
}
