import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { DoctorProfile } from "../types/doctor.types";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  profile: DoctorProfile;
}

interface FormValues {
  qualification: string;
  experienceYears: string;
  consultationFee: string;
}

export function DoctorProfileForm({ profile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<FormValues>({
    qualification: profile.qualification ?? "",
    experienceYears: String(profile.experienceYears ?? ""),
    consultationFee: String(profile.consultationFee ?? ""),
  });

  const updateMutation = useUpdateDoctorProfile();

  useEffect(() => {
    setForm({
      qualification: profile.qualification ?? "",
      experienceYears: String(profile.experienceYears ?? ""),
      consultationFee: String(profile.consultationFee ?? ""),
    });
  }, [profile]);

  const handleChange = (field: keyof FormValues, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setForm({
      qualification: profile.qualification ?? "",
      experienceYears: String(profile.experienceYears ?? ""),
      consultationFee: String(profile.consultationFee ?? ""),
    });

    setIsEditing(false);
    setSuccessMessage("");
    updateMutation.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");

    const experienceYears = Number(form.experienceYears);
    const consultationFee = Number(form.consultationFee);

    if (
      !form.qualification.trim() ||
      form.experienceYears.trim() === "" ||
      form.consultationFee.trim() === "" ||
      !Number.isInteger(experienceYears) ||
      experienceYears < 0 ||
      !Number.isFinite(consultationFee) ||
      consultationFee < 0
    ) {
      return;
    }

    updateMutation.mutate(
      {
        qualification: form.qualification.trim(),
        experienceYears,
        consultationFee,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSuccessMessage("Your profile has been updated successfully.");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Professional information</h3>
          <p className="text-sm text-muted-foreground">
            Manage your professional details.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSuccessMessage("");
              setIsEditing(true);
            }}
          >
            Edit profile
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full name - read only */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" value={profile.fullName} disabled />
        </div>

        {/* Specialization - read only */}
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" value={profile.specialization} disabled />
        </div>

        {/* Qualification */}
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            value={form.qualification}
            disabled={!isEditing}
            onChange={(e) => handleChange("qualification", e.target.value)}
            required
            maxLength={150}
            placeholder="e.g. MBBS, MD"
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Experience (years)</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            step="1"
            value={form.experienceYears}
            disabled={!isEditing}
            onChange={(e) => handleChange("experienceYears", e.target.value)}
            required
          />
        </div>

        {/* Consultation fee */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="consultationFee">Consultation fee (₹)</Label>
          <Input
            id="consultationFee"
            type="number"
            min="0"
            step="0.01"
            value={form.consultationFee}
            disabled={!isEditing}
            onChange={(e) => handleChange("consultationFee", e.target.value)}
            required
          />
        </div>
      </div>

      {updateMutation.isError && (
        <p className="text-sm text-destructive">
          Failed to update your profile. Please try again.
        </p>
      )}

      {successMessage && (
        <p className="text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}

      {isEditing && (
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
