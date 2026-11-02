import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, HeartPulse, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { getErrorMessage } from "../../../lib/getErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardPath } from "../utils/getDashboardPath";

export const LoginPage = () => {
  const mutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        navigate(getDashboardPath(data.role), {
          replace: true,
        });
      },
    });
  };

  const isLoading = mutation.isPending;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <HeartPulse className="size-5" aria-hidden="true" />
          </span>
          CarePoint Health
        </div>

        <div className="max-w-md space-y-3">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Patients, appointments and records in one place.
          </h2>
          <p className="text-primary-foreground/80">
            Sign in to manage your schedule and keep care running smoothly.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/70">
          Authorized staff only.
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[40px] border-primary-foreground/10"
        />
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-muted/40 p-6">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary lg:hidden">
              <HeartPulse className="size-6" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to CarePoint</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {mutation.isError && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    {getErrorMessage(mutation.error)}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@hospital.com"
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={`pr-10 ${
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
            <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
              <p>
                <Link
                  to="/register/patient"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up as a patient
                </Link>
                {/* </p>
              <p> */}
                {" | "}
                <Link
                  to="/register/doctor"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Register as a doctor
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
