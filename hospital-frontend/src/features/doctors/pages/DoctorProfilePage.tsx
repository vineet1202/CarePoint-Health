import { AlertCircle, Stethoscope } from "lucide-react";

import { useDoctorProfile } from "../hooks/useDoctorProfile";
import { DoctorProfileForm } from "@/features/doctors/components/DoctorProfileForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useDoctorProfile();

  // if (isLoading) {
  //   return (
  //     <div className="mx-auto max-w-3xl space-y-6">
  //       <Skeleton className="h-10 w-56" />
  //       <Skeleton className="h-80 w-full rounded-xl" />
  //     </div>
  //   );
  // }
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />

          <h2 className="font-semibold">Unable to load your profile</h2>

          <p className="text-sm text-muted-foreground">Please try again.</p>

          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          My Profile
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your professional information and consultation details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>

            <div>
              <CardTitle>Dr. {profile.fullName}</CardTitle>
              <CardDescription>{profile.specialization}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <DoctorProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
