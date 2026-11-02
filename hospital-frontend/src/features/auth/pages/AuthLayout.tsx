import type { ReactNode } from "react";
import { HeartPulse } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  headline?: string;
  subline?: string;
};

export const AuthLayout = ({
  title,
  description,
  children,
  footer,
  headline = "Patients, appointments and records in one place.",
  subline = "Create your account to manage your schedule and keep care running smoothly.",
}: AuthLayoutProps) => (
  <div className="grid min-h-svh lg:grid-cols-[5fr_7fr]">
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
          <HeartPulse className="size-5" aria-hidden="true" />
        </span>
        CarePoint Health
      </div>

      <div className="max-w-md space-y-3">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight">
          {headline}
        </h2>
        <p className="text-primary-foreground/80">{subline}</p>
      </div>

      <p className="text-sm text-primary-foreground/70">
        Your information is kept private and secure.
      </p>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[40px] border-primary-foreground/10"
      />
    </aside>

    <main className="flex items-start justify-center bg-muted/40 p-4 sm:p-6 lg:items-center">
      <Card className="my-4 w-full max-w-xl border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary lg:hidden">
            <HeartPulse className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {children}
          {footer && (
            <div className="text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  </div>
);
