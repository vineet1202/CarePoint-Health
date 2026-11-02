import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  UserRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentStatusBadge } from "../components/AppointmentStatusBadge";
import { getPatientConsultation } from "../api/consultationApi";
import { getDoctorPatientHistory } from "../api/appointmentApi";
import type { AppointmentResponse } from "../types/appointment.types";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (value: string) =>
  new Date(`2000-01-01T${value}`).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

function AppointmentHistoryItem({ visit }: { visit: AppointmentResponse }) {
  const [expanded, setExpanded] = useState(false);

  const consultationQuery = useQuery({
    queryKey: ["appointment-consultation", visit.id],
    queryFn: () => getPatientConsultation(visit.id),
    enabled: expanded && visit.status === "COMPLETED",
  });

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">Appointment #{visit.id}</h2>
              <AppointmentStatusBadge status={visit.status} />
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDate(visit.slotDate)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {formatTime(visit.startTime)} – {formatTime(visit.endTime)}
              </span>
            </div>
          </div>

          {visit.status === "COMPLETED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded((previous) => !previous)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {expanded ? "Hide consultation" : "View consultation"}
              {expanded ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {expanded && visit.status === "COMPLETED" && (
          <div className="mt-5 border-t pt-4">
            {consultationQuery.isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading consultation...
              </p>
            )}

            {consultationQuery.isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Unable to load consultation. Please try again.
                <Button
                  variant="link"
                  size="sm"
                  className="ml-1 h-auto p-0 text-destructive"
                  onClick={() => consultationQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            )}

            {consultationQuery.data && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Diagnosis</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {consultationQuery.data.diagnosis}
                  </p>
                </div>

                {consultationQuery.data.doctorNotes && (
                  <div>
                    <h3 className="text-sm font-semibold">Doctor's notes</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {consultationQuery.data.doctorNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DoctorPatientHistoryPage() {
  const { patientId } = useParams<{ patientId: string }>();

  const isValidPatientId = Boolean(patientId && /^\d+$/.test(patientId));

  const numericPatientId = isValidPatientId ? Number(patientId) : undefined;

  const query = useQuery({
    queryKey: ["doctor-patient-history", numericPatientId],
    queryFn: () => getDoctorPatientHistory(numericPatientId!),
    enabled: Boolean(numericPatientId),
  });

  const visits = useMemo(() => {
    return [...(query.data ?? [])].sort((a, b) =>
      `${b.slotDate}T${b.startTime}`.localeCompare(
        `${a.slotDate}T${a.startTime}`,
      ),
    );
  }, [query.data]);

  const patientName = visits[0]?.patientName ?? "Patient";

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div>
        <Link to="/doctor/appointments">
          <Button variant="ghost" className="-ml-3 mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to appointments
          </Button>
        </Link>

        <p className="text-sm font-medium text-primary">Patient record</p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {patientName}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your appointment history with this patient.
        </p>
      </div>

      {!isValidPatientId && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Invalid patient ID.
        </div>
      )}

      {isValidPatientId && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-semibold">#{patientId}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total appointments
                  </p>
                  <p className="font-semibold">{visits.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {query.isLoading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading patient history…
            </p>
          )}

          {query.isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              Unable to load appointment history. Please try again.
              <Button
                variant="link"
                size="sm"
                className="ml-1 h-auto p-0 text-destructive"
                onClick={() => query.refetch()}
              >
                Retry
              </Button>
            </div>
          )}

          {!query.isLoading && !query.isError && visits.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <CalendarDays className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-semibold">No appointments found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  There are no appointments with this patient.
                </p>
              </CardContent>
            </Card>
          )}

          {!query.isLoading && !query.isError && visits.length > 0 && (
            <div className="space-y-3">
              {visits.map((visit) => (
                <AppointmentHistoryItem key={visit.id} visit={visit} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
