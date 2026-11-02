import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Users,
  CalendarPlus,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useDoctorAppointments } from "@/features/appointments/hooks/useDoctorAppointments";
import type { AppointmentResponse } from "@/features/appointments/types/appointment.types";

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getAppointmentDateTime = (appointment: AppointmentResponse) => {
  return new Date(`${appointment.slotDate}T${appointment.startTime}`);
};

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default function DoctorDashboardPage() {
  const navigate = useNavigate();

  const { data: appointments, isLoading, isError } = useDoctorAppointments();

  const allAppointments = appointments ?? [];
  const now = new Date();
  const today = getTodayDate();

  const todayAppointments = allAppointments
    .filter(
      (appointment) =>
        appointment.slotDate === today && appointment.status !== "CANCELLED",
    )
    .sort(
      (a, b) =>
        getAppointmentDateTime(a).getTime() -
        getAppointmentDateTime(b).getTime(),
    );

  const upcomingAppointments = allAppointments.filter(
    (appointment) =>
      appointment.status === "BOOKED" &&
      getAppointmentDateTime(appointment) > now,
  );

  const completedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  );

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      description: "Scheduled for today",
      icon: CalendarCheck,
    },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      description: "Future booked appointments",
      icon: Clock,
    },
    {
      title: "Completed",
      value: completedAppointments.length,
      description: "Total completed appointments",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Practice Overview
          </h1>

          <p className="mt-2 text-muted-foreground">
            Here's your appointment overview and daily schedule.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("/doctor/slots")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Manage Slots
          </Button>

          <Button onClick={() => navigate("/doctor/appointments")}>
            View Appointments
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Unable to load your appointments. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card key={stat.title} className="border-border/60">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-3xl font-semibold tracking-tight">
                        {stat.value}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>

                    <div className="rounded-xl bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Today's schedule */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Today's Schedule
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(today)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/doctor/appointments")}
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {todayAppointments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <div className="rounded-xl bg-primary/10 p-4">
                    <Stethoscope className="h-7 w-7 text-primary" />
                  </div>

                  <h3 className="mt-4 font-semibold">No appointments today</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    You don't have any scheduled appointments for today.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="border-border/60 transition-colors hover:border-primary/30"
                  >
                    <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {appointment.patientName}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatTime(appointment.startTime)} –{" "}
                            {formatTime(appointment.endTime)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          appointment.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
