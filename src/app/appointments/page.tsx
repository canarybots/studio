import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import CalendarView from "@/components/appointments/CalendarView";

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto py-8 min-h-[calc(100vh-64px)] flex items-stretch">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="w-full flex justify-center items-center border-b bg-muted/50">
          <CardTitle className="w-full flex items-center justify-center gap-2 text-center">
            <ClipboardList />
            Gestión de Citas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  );
}
