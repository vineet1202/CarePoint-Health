import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AppointmentResponse } from "../types/appointment.types";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RescheduleAppointmentDialog } from "./RescheduleAppointmentDialog";
import { FileText } from "lucide-react";
import { getPatientConsultation } from "../api/consultationApi";
import { Link } from "react-router-dom";

interface Props {
  appointment: AppointmentResponse;
}

export function AppointmentCard({ appointment }: Props) {
  const { mutate: cancel, isPending } = useCancelAppointment();

  const [consultationOpen, setConsultationOpen] = useState(false);

  const isUpcoming =
    appointment.status === "BOOKED" &&
    new Date(`${appointment.slotDate}T${appointment.startTime}`) > new Date();

  const consultationQuery = useQuery({
    queryKey: ["patient-consultation", appointment.id],
    queryFn: () => getPatientConsultation(appointment.id),
    enabled: consultationOpen && appointment.status === "COMPLETED",
  });

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <Link
              to={`/patient/doctors/${appointment.doctorId}`}
              className="text-lg font-semibold hover:text-primary hover:underline transition-colors"
            >
              {appointment.doctorName}
            </Link>
            <p className="text-sm text-muted-foreground">
              Appointment #{appointment.id}
            </p>
          </div>

          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{appointment.slotDate}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Time</p>
            <p className="font-medium">
              {appointment.startTime} - {appointment.endTime}
            </p>
          </div>
        </div>

        {isUpcoming && (
          <div className="flex flex-wrap gap-2">
            <RescheduleAppointmentDialog appointment={appointment} />

            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" size="sm">
                  Cancel Appointment
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel appointment?</AlertDialogTitle>

                  <AlertDialogDescription>
                    Are you sure you want to cancel your appointment with{" "}
                    {appointment.doctorName} on {appointment.slotDate}? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Appointment</AlertDialogCancel>

                  <AlertDialogAction
                    disabled={isPending}
                    onClick={() => cancel(appointment.id)}
                  >
                    {isPending ? "Cancelling..." : "Confirm Cancellation"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {appointment.status === "COMPLETED" && (
          <>
            <div className="border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConsultationOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                View consultation
              </Button>
            </div>

            <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Consultation details</DialogTitle>
                  <DialogDescription>
                    Consultation with {appointment.doctorName}
                    {" · "}
                    {appointment.slotDate}
                  </DialogDescription>
                </DialogHeader>

                {consultationQuery.isLoading && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Loading consultation...
                  </p>
                )}

                {consultationQuery.isError && (
                  <div className="space-y-3 py-4 text-center">
                    <p className="text-sm text-destructive">
                      Unable to load consultation details.
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => consultationQuery.refetch()}
                    >
                      Try again
                    </Button>
                  </div>
                )}

                {consultationQuery.data && (
                  <div className="space-y-5">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">Diagnosis</h3>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {consultationQuery.data.diagnosis}
                      </p>
                    </div>

                    {consultationQuery.data.doctorNotes && (
                      <div>
                        <h3 className="mb-2 font-semibold">Doctor's notes</h3>

                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                          {consultationQuery.data.doctorNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
