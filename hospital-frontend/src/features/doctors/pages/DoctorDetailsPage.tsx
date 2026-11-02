import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  GraduationCap,
  BriefcaseMedical,
  IndianRupee,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useDoctor } from "../hooks/useDoctor";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useBookAppointment } from "@/features/appointments/hooks/useBookAppointment";

export default function DoctorDetailsPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const id = Number(doctorId);
  const { data: doctor, isLoading, isError } = useDoctor(id);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );

  const {
    data: slots,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useAvailableSlots(id, selectedDate);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const selectedSlot = slots?.find((slot) => slot.id === selectedSlotId);

  const booking = useBookAppointment();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Stethoscope className="h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Doctor not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't retrieve this doctor's information.
        </p>
        <Button className="mt-5" onClick={() => navigate("/patient/doctors")}>
          Back to doctors
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Back navigation */}
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => navigate("/patient/doctors")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to doctors
      </Button>

      {/* Doctor profile */}
      <Card className="overflow-hidden border-border/60 bg-card/70 shadow-lg shadow-black/[0.03] backdrop-blur-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Stethoscope className="h-10 w-10 text-primary" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Doctor profile
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                {doctor.fullName}
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                {doctor.specialization}
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Qualification
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {doctor.qualification || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseMedical className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="mt-1 text-sm font-medium">
                      {doctor.experienceYears != null
                        ? `${doctor.experienceYears} years`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IndianRupee className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Consultation fee
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      ₹{doctor.consultationFee}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available slots - next step */}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Available appointments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a date to view available time slots.
          </p>
        </div>

        <div className="max-w-xs space-y-2">
          <label className="text-sm font-medium" htmlFor="slot-date">
            Appointment date
          </label>
          <Input
            id="slot-date"
            type="date"
            value={selectedDate}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlotId(null);
              booking.reset();
            }}
          />
        </div>

        {slotsLoading && (
          <p className="text-sm text-muted-foreground">
            Loading available slots...
          </p>
        )}

        {slotsError && (
          <p className="text-sm text-destructive">
            Could not fetch available slots. Please try again.
          </p>
        )}

        {!slotsLoading &&
          !slotsError &&
          slots &&
          (slots.length === 0 ? (
            <Card className="border-border/60 bg-card/70 backdrop-blur-xl">
              <CardContent className="py-10 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <p className="mt-3 font-medium">No slots available</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try selecting another date.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isAvailable = slot.status === "AVAILABLE";

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedSlotId(slot.id);
                      booking.reset();
                    }}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : isAvailable
                          ? "border-border/60 bg-card/70 hover:border-primary/50 hover:bg-accent/50"
                          : "cursor-not-allowed border-border/40 bg-muted/40 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">
                        {slot.startTime.slice(0, 5)} –{" "}
                        {slot.endTime.slice(0, 5)}
                      </span>

                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {isAvailable ? "Available" : slot.status}
                    </p>
                  </button>
                );
              })}
            </div>
          ))}

        {selectedSlot && selectedSlot.status === "AVAILABLE" && (
          <Card className="border-primary/20 bg-card/80 shadow-md backdrop-blur-xl">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  Booking summary
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Review your appointment
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                  <p className="mt-1 font-medium">{doctor.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-1 font-medium">{selectedSlot.slotDate}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="mt-1 font-medium">
                    {selectedSlot.startTime.slice(0, 5)} –{" "}
                    {selectedSlot.endTime.slice(0, 5)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Consultation fee
                  </p>
                  <p className="mt-1 font-semibold">
                    ₹{doctor.consultationFee}
                  </p>
                </div>
              </div>

              {booking.isError && (
                <p className="text-sm text-destructive">
                  Booking failed. This slot may no longer be available. Please
                  try refreshing the available slots.
                </p>
              )}

              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSlotId(null);
                    booking.reset();
                  }}
                  disabled={booking.isPending}
                >
                  Change slot
                </Button>

                <Button
                  onClick={() => {
                    booking.mutate({
                      slotId: selectedSlot.id,
                    });
                  }}
                  disabled={booking.isPending}
                >
                  {booking.isPending ? "Booking..." : "Confirm appointment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {booking.isSuccess && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-6 w-6 text-green-600" />

              <div>
                <h3 className="font-semibold text-green-700">
                  Appointment booked successfully!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your appointment has been confirmed. You can view it in My
                  Appointments.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
