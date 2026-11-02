import { usePatientProfile } from "../hooks/usePatientProfile";
import { PatientProfileForm } from "../components/PatientProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientProfilePage() {
  const { data: profile, isLoading, isError, refetch } = usePatientProfile();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-80 w-full rounded-xl" />
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
          Manage your personal and medical information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>

            <div>
              <CardTitle>{profile.fullName}</CardTitle>
              <CardDescription>Patient profile</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <PatientProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
