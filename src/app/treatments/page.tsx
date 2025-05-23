import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import TreatmentsTable from "@/components/treatments/TreatmentsTable";

export default function TreatmentsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-6xl flex-1 flex flex-col">
          <CardHeader className="w-full flex justify-center items-center border-b bg-muted/50">
            <CardTitle className="w-full flex items-center justify-center gap-2 text-center">
              <Stethoscope />
              Gestión de Tratamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TreatmentsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
