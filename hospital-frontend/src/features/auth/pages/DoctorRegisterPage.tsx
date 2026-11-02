import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRegisterDoctor } from "../hooks/useRegister";
import { doctorRegisterSchema } from "../schemas/registerSchema";
import type { DoctorRegisterRequest } from "../types/auth.types";
import { getErrorMessage } from "../../../lib/getErrorMessage";

import { AuthLayout } from "./AuthLayout";
import { FormField, PasswordInput, errorClass, fieldProps } from "./FormField";

export const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const mutation = useRegisterDoctor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegisterRequest>({
    resolver: zodResolver(doctorRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      specialization: "",
      qualification: "",
      experienceYears: null,
      consultationFee: 0,
    },
  });

  const onSubmit = (values: DoctorRegisterRequest) => {
    mutation.mutate(
      {
        ...values,
        qualification: values.qualification || null,
      },
      {
        onSuccess: () => navigate("/login"),
      },
    );
  };

  const isLoading = mutation.isPending;

  return (
    <AuthLayout
      title="Create your doctor account"
      description="Set up your profile so patients can book appointments with you"
      headline="Spend less time on admin, more time with patients."
      subline="Register to manage your availability and appointments."
      footer={
        <>
          Already registered?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          <span className="mx-2">|</span>
          Are you a patient?{" "}
          <Link
            to="/register/patient"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Register as a patient
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {mutation.isError && (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {getErrorMessage(mutation.error)}
            </AlertDescription>
          </Alert>
        )}

        {/* Account */}
        <fieldset className="space-y-4" disabled={isLoading}>
          {/* <legend className="mb-1 text-sm font-semibold">
            Account details
          </legend> */}

          <FormField
            id="fullName"
            label="Full name"
            error={errors.fullName?.message}
          >
            <Input
              autoComplete="name"
              placeholder="Dr. Jane Doe"
              className={errorClass(!!errors.fullName)}
              {...fieldProps("fullName", !!errors.fullName)}
              {...register("fullName")}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="email" label="Email" error={errors.email?.message}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@hospital.com"
                className={errorClass(!!errors.email)}
                {...fieldProps("email", !!errors.email)}
                {...register("email")}
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
              error={errors.password?.message}
            >
              <PasswordInput
                autoComplete="new-password"
                placeholder="Create a password"
                className={errorClass(!!errors.password)}
                {...fieldProps("password", !!errors.password)}
                {...register("password")}
              />
            </FormField>
          </div>
        </fieldset>

        {/* Professional */}
        <fieldset className="space-y-4" disabled={isLoading}>
          {/* <legend className="mb-1 text-sm font-semibold">
            Professional details
          </legend> */}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="specialization"
              label="Specialization"
              error={errors.specialization?.message}
            >
              <Input
                placeholder="e.g. Cardiology"
                className={errorClass(!!errors.specialization)}
                {...fieldProps("specialization", !!errors.specialization)}
                {...register("specialization")}
              />
            </FormField>

            <FormField
              id="qualification"
              label="Qualification"
              optional
              error={errors.qualification?.message}
            >
              <Input
                placeholder="e.g. MBBS, MD"
                className={errorClass(!!errors.qualification)}
                {...fieldProps("qualification", !!errors.qualification)}
                {...register("qualification")}
              />
            </FormField>

            <FormField
              id="experienceYears"
              label="Experience (years)"
              optional
              error={errors.experienceYears?.message}
            >
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="0"
                className={errorClass(!!errors.experienceYears)}
                {...fieldProps("experienceYears", !!errors.experienceYears)}
                {...register("experienceYears", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
              />
            </FormField>

            <FormField
              id="consultationFee"
              label="Consultation fee"
              error={errors.consultationFee?.message}
              hint="Charged per appointment."
            >
              <Input
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className={errorClass(!!errors.consultationFee)}
                {...fieldProps(
                  "consultationFee",
                  !!errors.consultationFee,
                  true,
                )}
                {...register("consultationFee", {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};
