import type { AppointmentResponse } from "../types/appointment.types";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CalendarDays, Clock } from "lucide-react";

interface Props {
  appointment: AppointmentResponse;
  onViewPatient: (patientId: number) => void;
  onAddConsultation: (appointmentId: number) => void;
}

export function DoctorAppointmentCard({
  appointment,
  onViewPatient,
  onAddConsultation,
}: Props) {
  const canAddConsultation = appointment.status === "COMPLETED";

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
            <p className="text-sm text-muted-foreground">
              Appointment #{appointment.id}
            </p>
          </div>

          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Date
            </p>
            <p className="mt-1 font-medium">{appointment.slotDate}</p>
          </div>

          <div>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              Time
            </p>
            <p className="mt-1 font-medium">
              {appointment.startTime} - {appointment.endTime}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewPatient(appointment.patientId)}
          >
            <User className="mr-2 h-4 w-4" />
            View Patient
          </Button>

          {canAddConsultation && (
            <Button size="sm" onClick={() => onAddConsultation(appointment.id)}>
              Add Consultation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
