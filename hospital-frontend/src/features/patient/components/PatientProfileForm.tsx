import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { PatientProfile } from "../types/patient.types";
import { useUpdatePatientProfile } from "../hooks/useUpdatePatientProfile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  profile: PatientProfile;
}

interface FormValues {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  emergencyContact: string;
}

export function PatientProfileForm({ profile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<FormValues>({
    fullName: profile.fullName ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
    bloodGroup: profile.bloodGroup ?? "",
    emergencyContact: profile.emergencyContact ?? "",
  });

  const updateMutation = useUpdatePatientProfile();

  useEffect(() => {
    setForm({
      fullName: profile.fullName ?? "",
      dateOfBirth: profile.dateOfBirth ?? "",
      gender: profile.gender ?? "",
      bloodGroup: profile.bloodGroup ?? "",
      emergencyContact: profile.emergencyContact ?? "",
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
      fullName: profile.fullName ?? "",
      dateOfBirth: profile.dateOfBirth ?? "",
      gender: profile.gender ?? "",
      bloodGroup: profile.bloodGroup ?? "",
      emergencyContact: profile.emergencyContact ?? "",
    });

    setIsEditing(false);
    setSuccessMessage("");
    updateMutation.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");

    if (form.fullName.trim().length < 2) {
      return;
    }

    updateMutation.mutate(
      {
        fullName: form.fullName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        bloodGroup: form.bloodGroup || undefined,
        emergencyContact: form.emergencyContact.trim(),
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
          <h3 className="font-semibold">Personal information</h3>
          <p className="text-sm text-muted-foreground">
            Your personal and medical details.
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
        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={form.fullName}
            disabled={!isEditing}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        {/* Date of birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            disabled={!isEditing}
            max={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </div>

        {/* Gender
         <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={form.gender}
            disabled={!isEditing}
            onValueChange={(value) => handleChange("bloodGroup", value ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div> 

        {/* Blood group */}
        {/* <div className="space-y-2">
          <Label>Blood group</Label>
          <Select
            value={form.bloodGroup}
            disabled={!isEditing}
            onValueChange={(value) => handleChange("gender", value ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={form.gender}
            disabled={!isEditing}
            onValueChange={(value) => handleChange("gender", value ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {["Male", "Female", "Other"].map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Blood group */}
        <div className="space-y-2">
          <Label>Blood group</Label>
          <Select
            value={form.bloodGroup}
            disabled={!isEditing}
            onValueChange={(value) => handleChange("bloodGroup", value ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Emergency contact */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="emergencyContact">Emergency contact</Label>
          <Input
            id="emergencyContact"
            type="tel"
            value={form.emergencyContact}
            disabled={!isEditing}
            onChange={(e) => handleChange("emergencyContact", e.target.value)}
            maxLength={15}
            placeholder="Enter emergency contact number"
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
