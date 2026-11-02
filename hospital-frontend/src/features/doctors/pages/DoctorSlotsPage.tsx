import { useState } from "react";

import {
  CalendarDays,
  Clock,
  CheckCircle2,
  LockKeyhole,
  Plus,
  Layers,
  Trash2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useMySlots,
  useCreateSlot,
  useGenerateSlots,
  useDeleteSlot,
} from "../hooks/useDoctorSlots";

// const getTodayDate = () => {
//   const today = new Date();

//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };
const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatDateForInput(tomorrow);
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
    year: "numeric",
  });
};

export default function DoctorSlotsPage() {
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate);
  // const calendarDate = selectedDate
  //   ? new Date(`${selectedDate}T00:00:00`)
  //   : undefined;

  const isValidSlotDate = (date: string) => {
    return date >= getTomorrowDate();
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");

  const [dayStartTime, setDayStartTime] = useState("09:00");
  const [dayEndTime, setDayEndTime] = useState("17:00");
  const [duration, setDuration] = useState("30");

  const [createError, setCreateError] = useState("");
  const [generateError, setGenerateError] = useState("");

  const { data: slots, isLoading, isError } = useMySlots(selectedDate);

  const createMutation = useCreateSlot();
  const generateMutation = useGenerateSlots();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const deleteMutation = useDeleteSlot();

  const handleDeleteSlot = () => {
    if (slotToDelete === null) return;

    setDeleteError("");

    deleteMutation.mutate(slotToDelete, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSlotToDelete(null);
      },
      onError: (error) => {
        setDeleteError(
          error instanceof Error ? error.message : "Unable to delete slot.",
        );
      },
    });
  };

  const allSlots = [...(slots ?? [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const availableSlots = allSlots.filter((slot) => slot.status === "AVAILABLE");

  const bookedSlots = allSlots.filter((slot) => slot.status === "BOOKED");

  const resetCreateForm = () => {
    setStartTime("09:00");
    setEndTime("09:30");
    setCreateError("");
  };

  const resetGenerateForm = () => {
    setDayStartTime("09:00");
    setDayEndTime("17:00");
    setDuration("30");
    setGenerateError("");
  };

  const handleCreateSlot = () => {
    if (!isValidSlotDate(selectedDate)) {
      setCreateError("Slots can only be created from tomorrow onwards.");
      return;
    }
    setCreateError("");

    if (!startTime || !endTime || endTime <= startTime) {
      setCreateError("End time must be after start time.");
      return;
    }

    createMutation.mutate(
      {
        slotDate: selectedDate,
        startTime,
        endTime,
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          resetCreateForm();
        },
        onError: (error) => {
          setCreateError(
            error instanceof Error ? error.message : "Unable to create slot.",
          );
        },
      },
    );
  };

  const handleGenerateSlots = () => {
    if (!isValidSlotDate(selectedDate)) {
      setGenerateError("Slots can only be created from tomorrow onwards.");
      return;
    }
    setGenerateError("");

    if (!dayStartTime || !dayEndTime || dayEndTime <= dayStartTime) {
      setGenerateError("End time must be after start time.");
      return;
    }

    generateMutation.mutate(
      {
        slotDate: selectedDate,
        dayStartTime,
        dayEndTime,
        slotDurationMinutes: Number(duration),
      },
      {
        onSuccess: () => {
          setGenerateOpen(false);
          resetGenerateForm();
        },
        onError: (error) => {
          setGenerateError(
            error instanceof Error
              ? error.message
              : "Unable to generate slots.",
          );
        },
      },
    );
  };

  const stats = [
    {
      title: "Total Slots",
      value: allSlots.length,
      description: "Slots created for this date",
      icon: CalendarDays,
    },
    {
      title: "Available",
      value: availableSlots.length,
      description: "Open for appointments",
      icon: CheckCircle2,
    },
    {
      title: "Booked",
      value: bookedSlots.length,
      description: "Reserved by patients",
      icon: LockKeyhole,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Manage Slots
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create and manage your appointment availability.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Create individual slot */}
          <Dialog
            open={createOpen}
            onOpenChange={(open) => {
              setCreateOpen(open);
              if (!open) resetCreateForm();
            }}
          >
            <DialogTrigger>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Slot
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Appointment Slot</DialogTitle>
                <DialogDescription>
                  Add one appointment slot to your schedule.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {createError && (
                  <p className="text-sm text-destructive">{createError}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleCreateSlot}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Slot"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Generate multiple slots */}
          <Dialog
            open={generateOpen}
            onOpenChange={(open) => {
              setGenerateOpen(open);
              if (!open) resetGenerateForm();
            }}
          >
            <DialogTrigger>
              <Button>
                <Layers className="mr-2 h-4 w-4" />
                Generate Slots
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Appointment Slots</DialogTitle>
                <DialogDescription>
                  Automatically divide your working hours into appointment
                  slots.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Working Hours Start
                    </label>
                    <Input
                      type="time"
                      value={dayStartTime}
                      onChange={(e) => setDayStartTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Working Hours End
                    </label>
                    <Input
                      type="time"
                      value={dayEndTime}
                      onChange={(e) => setDayEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Slot Duration</label>

                  <Select
                    value={duration}
                    onValueChange={(value) => {
                      if (value !== null) {
                        setDuration(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {generateError && (
                  <p className="text-sm text-destructive">{generateError}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleGenerateSlots}
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending
                    ? "Generating..."
                    : "Generate Slots"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Date selector */}
      {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>{formatDate(selectedDate)}</span>
        <Input
          type="date"
          min={getTodayDate()}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="ml-auto w-[160px]"
        />
      </div> */}
      {/* Date selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected date</p>

          <p className="text-sm text-muted-foreground">
            {formatDate(selectedDate)}
          </p>

          <Input
            type="date"
            min={getTomorrowDate()}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading your slots...</p>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Unable to load your slots. Please try again.
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

          {/* Slots list */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Your Slots
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                All appointment slots for the selected date.
              </p>
            </div>

            {allSlots.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <div className="rounded-xl bg-primary/10 p-4">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>

                  <h3 className="mt-4 font-semibold">No slots available</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    You haven't created any slots for this date.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {allSlots.map((slot) => (
                  <Card
                    key={slot.id}
                    className="border-border/60 transition-colors hover:border-primary/30"
                  >
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                          <p className="font-semibold">
                            {formatTime(slot.startTime)} –{" "}
                            {formatTime(slot.endTime)}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Slot #{slot.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            slot.status === "AVAILABLE"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-blue-500/10 text-blue-600"
                          }`}
                        >
                          {slot.status}
                        </span>

                        {slot.status === "AVAILABLE" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                              setSlotToDelete(slot.id);
                              setDeleteError("");
                              setDeleteOpen(true);
                            }}
                            aria-label={`Delete slot ${slot.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Dialog
                  open={deleteOpen}
                  onOpenChange={(open) => {
                    if (!deleteMutation.isPending) {
                      setDeleteOpen(open);

                      if (!open) {
                        setSlotToDelete(null);
                        setDeleteError("");
                      }
                    }
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Appointment Slot?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this slot? This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    {deleteError && (
                      <p className="text-sm text-destructive">{deleteError}</p>
                    )}

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleteMutation.isPending}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={handleDeleteSlot}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending
                          ? "Deleting..."
                          : "Delete Slot"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
