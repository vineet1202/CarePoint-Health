import { useState } from "react";
import { useMyAppointments } from "../hooks/useMyAppointments";
import { AppointmentCard } from "../components/PatientAppointmentCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AppointmentFilter = "UPCOMING" | "PAST" | "CANCELLED";

export function MyAppointments() {
  const { data: appointments, isLoading, isError } = useMyAppointments();

  const [filter, setFilter] = useState<AppointmentFilter>("UPCOMING");

  if (isLoading) return <p>Loading appointments...</p>;

  if (isError) return <p>Failed to load appointments.</p>;

  const now = new Date();

  const filteredAppointments = (appointments ?? []).filter((appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.slotDate}T${appointment.startTime}`,
    );

    switch (filter) {
      case "UPCOMING":
        return appointment.status === "BOOKED" && appointmentDateTime > now;

      case "PAST":
        return appointment.status === "COMPLETED";

      case "CANCELLED":
        return appointment.status === "CANCELLED";

      default:
        return false;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <p className="text-muted-foreground">
          View and manage your appointments.
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as AppointmentFilter)}
      >
        <TabsList>
          <TabsTrigger value="UPCOMING">Upcoming</TabsTrigger>
          <TabsTrigger value="PAST">Past</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredAppointments.length === 0 ? (
        <p className="text-muted-foreground">
          No {filter.toLowerCase()} appointments found.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
