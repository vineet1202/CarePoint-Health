import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  FilePlus2,
  History,
  Search,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AppointmentStatusBadge } from "../components/AppointmentStatusBadge";
import type { AppointmentResponse } from "../types/appointment.types";
import {
  addAppointmentConsultation,
  getDoctorAppointments,
  localDateString,
} from "../api/consultationApi";
import { PageLoader } from "@/components/ui/pageLoader";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const formatTime = (value: string) =>
  new Date(`2000-01-01T${value}`).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

type AppointmentTab = "upcoming" | "past" | "cancelled";

export default function DoctorAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AppointmentTab>("upcoming");

  const [activeConsultation, setActiveConsultation] =
    useState<AppointmentResponse | null>(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["doctor-workspace-appointments"],
    queryFn: getDoctorAppointments,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!activeConsultation) {
        throw new Error("Choose an appointment first.");
      }

      return addAppointmentConsultation(activeConsultation.id, {
        diagnosis: diagnosis.trim(),
        doctorNotes: notes.trim(),
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["doctor-workspace-appointments"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["appointments", "doctor"],
      });

      setSavedMessage("Consultation saved. Appointment marked complete.");
      setActiveConsultation(null);
      setDiagnosis("");
      setNotes("");

      // The appointment should now appear in the Past tab.
      setActiveTab("past");
    },
  });

  const { upcomingAppointments, pastAppointments, cancelledAppointments } =
    useMemo(() => {
      const now = new Date();

      const currentDateTime = `${localDateString(now)}T${now
        .toTimeString()
        .slice(0, 8)}`;

      const searchTerm = search.trim().toLowerCase();

      const filtered = (appointmentsQuery.data ?? []).filter((item) =>
        item.patientName.toLowerCase().includes(searchTerm),
      );

      const upcoming = filtered
        .filter((item) => {
          const appointmentDateTime = `${item.slotDate}T${item.startTime}`;

          return (
            item.status === "BOOKED" && appointmentDateTime >= currentDateTime
          );
        })
        .sort((a, b) =>
          `${a.slotDate}T${a.startTime}`.localeCompare(
            `${b.slotDate}T${b.startTime}`,
          ),
        );

      const past = filtered
        .filter((item) => item.status === "COMPLETED")
        .sort((a, b) =>
          `${b.slotDate}T${b.startTime}`.localeCompare(
            `${a.slotDate}T${a.startTime}`,
          ),
        );

      const cancelled = filtered
        .filter((item) => item.status === "CANCELLED")
        .sort((a, b) =>
          `${b.slotDate}T${b.startTime}`.localeCompare(
            `${a.slotDate}T${a.startTime}`,
          ),
        );

      return {
        upcomingAppointments: upcoming,
        pastAppointments: past,
        cancelledAppointments: cancelled,
      };
    }, [appointmentsQuery.data, search]);

  const appointmentsByTab: Record<AppointmentTab, AppointmentResponse[]> = {
    upcoming: upcomingAppointments,
    past: pastAppointments,
    cancelled: cancelledAppointments,
  };

  const renderAppointments = (appointments: AppointmentResponse[]) => {
    if (appointments.length === 0) {
      return (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CalendarDays className="h-8 w-8 text-primary" />

            <h2 className="mt-4 font-semibold">No {activeTab} appointments</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try searching with a different patient name."
                : activeTab === "upcoming"
                  ? "New bookings will appear here."
                  : activeTab === "past"
                    ? "Completed appointments will appear here."
                    : "Cancelled appointments will appear here."}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="border-border/60 transition-colors hover:border-primary/30"
          >
            <CardContent className="flex flex-col justify-between gap-5 p-5 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{appointment.patientName}</h2>

                    <AppointmentStatusBadge status={appointment.status} />
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Appointment #{appointment.id}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(appointment.slotDate)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {formatTime(appointment.startTime)} –{" "}
                      {formatTime(appointment.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to={`/doctor/patients/${appointment.patientId}/history`}>
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    Patient history
                  </Button>
                </Link>

                {appointment.status === "BOOKED" &&
                  activeTab === "upcoming" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveConsultation(appointment);
                        setDiagnosis("");
                        setNotes("");
                        setSavedMessage("");
                      }}
                    >
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Add consultation
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Doctor workspace</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Appointments
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your schedule and revisit patient records.
          </p>
        </div>

        <Link to="/doctor/slots">
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            Manage slots
          </Button>
        </Link>
      </div>

      {/* Summary and search */}
      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total appointments</p>

            <p className="mt-1 text-2xl font-semibold">
              {appointmentsQuery.data?.length ?? 0} appointments
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {upcomingAppointments.length} upcoming · {pastAppointments.length}{" "}
              completed · {cancelledAppointments.length} cancelled
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Search patients"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {savedMessage && (
        <div
          role="status"
          className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary"
        >
          {savedMessage}
        </div>
      )}

      {/* Loading and error states */}
      {appointmentsQuery.isLoading && <PageLoader />}

      {appointmentsQuery.isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Unable to load appointments. Please refresh and try again.
          <Button
            variant="link"
            size="sm"
            className="ml-1 h-auto p-0 text-destructive"
            onClick={() => appointmentsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Appointment tabs */}
      {!appointmentsQuery.isLoading && !appointmentsQuery.isError && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AppointmentTab)}
          className="space-y-5"
        >
          <TabsList className="grid h-auto w-full grid-cols-3 sm:w-fit">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>

            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>

            <TabsTrigger value="cancelled">
              Cancelled ({cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {renderAppointments(appointmentsByTab.upcoming)}
          </TabsContent>

          <TabsContent value="past">
            {renderAppointments(appointmentsByTab.past)}
          </TabsContent>

          <TabsContent value="cancelled">
            {renderAppointments(appointmentsByTab.cancelled)}
          </TabsContent>
        </Tabs>
      )}

      {/* Consultation modal */}
      {activeConsultation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !mutation.isPending) {
              setActiveConsultation(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
            className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-xl"
          >
            <div className="mb-5">
              <p className="text-sm text-muted-foreground">
                {activeConsultation.patientName} ·{" "}
                {formatDate(activeConsultation.slotDate)}
              </p>

              <h2
                id="consultation-title"
                className="mt-1 text-xl font-semibold"
              >
                Add consultation
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Saving the consultation completes this appointment.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                mutation.mutate();
              }}
            >
              <label className="block space-y-2 text-sm font-medium">
                Diagnosis <span className="text-destructive">*</span>
                <Input
                  required
                  value={diagnosis}
                  onChange={(event) => setDiagnosis(event.target.value)}
                  placeholder="Enter diagnosis"
                  maxLength={500}
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                Doctor notes{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Treatment, follow-up, and other notes"
                  rows={5}
                  maxLength={4000}
                />
              </label>

              {mutation.isError && (
                <p className="text-sm text-destructive">
                  Unable to save consultation. Check the appointment and try
                  again.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={mutation.isPending}
                  onClick={() => setActiveConsultation(null)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!diagnosis.trim() || mutation.isPending}
                >
                  {mutation.isPending ? "Saving…" : "Save consultation"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
