import { useState } from "react";
import { useAvailableSlots } from "../../doctors/hooks/useAvailableSlots";
import { useRescheduleAppointment } from "../hooks/useRescheduleAppointment";
import type { AppointmentResponse } from "../types/appointment.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  appointment: AppointmentResponse;
}

export function RescheduleAppointmentDialog({ appointment }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(appointment.slotDate);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const {
    data: slots,
    isLoading,
    isError,
  } = useAvailableSlots(appointment.doctorId, date);

  const rescheduleMutation = useRescheduleAppointment(appointment.id);

  const handleReschedule = () => {
    if (selectedSlotId === null) return;

    rescheduleMutation.mutate(
      { newSlotId: selectedSlotId },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedSlotId(null);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setSelectedSlotId(null);
      }}
    >
      <DialogTrigger>
        <Button variant="outline" size="sm">
          Reschedule
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and available slot with Dr.{" "}
            {appointment.doctorName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>

            <Input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlotId(null);
              }}
              min={new Date().toLocaleDateString("en-CA")}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Available Slots</p>

            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading available slots...
              </p>
            )}

            {isError && (
              <p className="text-sm text-destructive">
                Failed to load available slots.
              </p>
            )}

            {!isLoading && !isError && slots?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No available slots for this date.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              {slots?.map((slot) => (
                <Button
                  key={slot.id}
                  type="button"
                  variant={selectedSlotId === slot.id ? "default" : "outline"}
                  onClick={() => setSelectedSlotId(slot.id)}
                >
                  {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                </Button>
              ))}
            </div>
          </div>

          {rescheduleMutation.isError && (
            <p className="text-sm text-destructive">
              Failed to reschedule. Please try again.
            </p>
          )}

          <Button
            className="w-full"
            disabled={selectedSlotId === null || rescheduleMutation.isPending}
            onClick={handleReschedule}
          >
            {rescheduleMutation.isPending
              ? "Rescheduling..."
              : "Confirm Reschedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
