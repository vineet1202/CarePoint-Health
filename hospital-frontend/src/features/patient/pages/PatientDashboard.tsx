import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  Stethoscope,
  ClipboardList,
  ArrowRight,
  HeartPulse,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import type { AppointmentResponse } from "@/features/appointments/types/appointment.types";
import { buttonVariants } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/pageLoader";

const getAppointmentDateTime = (appointment: AppointmentResponse) => {
  return new Date(`${appointment.slotDate}T${appointment.startTime}`);
};

const formatAppointmentDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const PatientDashboardPage = () => {
  const { data: appointments, isLoading, isError } = useMyAppointments();

  const now = new Date();

  const allAppointments = appointments ?? [];

  const upcomingAppointments = allAppointments
    .filter(
      (appointment) =>
        appointment.status === "BOOKED" &&
        getAppointmentDateTime(appointment) > now,
    )
    .sort(
      (a, b) =>
        getAppointmentDateTime(a).getTime() -
        getAppointmentDateTime(b).getTime(),
    );

  const nextAppointment = upcomingAppointments[0];

  const completedCount = allAppointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight font-heading">
            Welcome back!
          </h1>

          <p className="mt-2 text-muted-foreground">
            Here's an overview of your healthcare activity.
          </p>
        </div>

        <Link to="/patient/doctors" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Book appointment
        </Link>
      </section>

      {/* Main content */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Next appointment */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Next appointment</CardTitle>
              <CardDescription>
                Stay updated with your upcoming visit.
              </CardDescription>
            </div>

            <Badge variant="secondary">Appointment overview</Badge>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <PageLoader />
            ) : isError ? (
              <div className="py-12 text-center text-destructive">
                Failed to load appointments.
              </div>
            ) : nextAppointment ? (
              <div className="rounded-xl border bg-muted/30 p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      Dr. {nextAppointment.doctorName}
                    </h3>
                    <Badge variant="secondary">{nextAppointment.status}</Badge>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {formatAppointmentDate(nextAppointment.slotDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {nextAppointment.startTime.slice(0, 5)} -{" "}
                      {nextAppointment.endTime.slice(0, 5)}
                    </p>
                  </div>
                </div>

                <Link
                  to="/patient/appointments"
                  className={buttonVariants({ variant: "outline" })}
                >
                  View appointments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mt-4 font-semibold">No upcoming appointments</h3>

                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  You don't have any scheduled visits yet.
                </p>

                <Link
                  to="/patient/doctors"
                  className={buttonVariants({ className: "mt-5" })}
                >
                  Find a doctor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Manage your healthcare easily.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link
              to="/patient/doctors"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
                <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Find a doctor</p>
                <p className="text-xs text-muted-foreground">
                  Explore specialists
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/patient/appointments"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-950">
                <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">My appointments</p>
                <p className="text-xs text-muted-foreground">
                  View your bookings
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/patient/profile"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-950">
                <HeartPulse className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">My profile</p>
                <p className="text-xs text-muted-foreground">
                  Manage personal details
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </section>
      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-3xl font-bold">
                {isLoading ? "—" : upcomingAppointments.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Your scheduled visits
              </p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-950">
              <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-3xl font-bold">
                {isLoading ? "—" : completedCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Your visit history
              </p>
            </div>

            <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-950">
              <CalendarCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next appointment</p>
              <p className="text-xl font-bold">
                {isLoading
                  ? "—"
                  : nextAppointment
                    ? formatAppointmentDate(nextAppointment.slotDate)
                    : "None"}
              </p>
            </div>

            <div className="rounded-xl bg-violet-100 p-3 dark:bg-violet-950">
              <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default PatientDashboardPage;
