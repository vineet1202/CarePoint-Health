import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRegisterPatient } from "../hooks/useRegister";
import { patientRegisterSchema } from "../schemas/registerSchema";
import type { PatientRegisterRequest } from "../types/auth.types";
import { getErrorMessage } from "../../../lib/getErrorMessage";

import { AuthLayout } from "./AuthLayout";
import {
  FormField,
  PasswordInput,
  Select,
  errorClass,
  fieldProps,
} from "./FormField";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const today = new Date().toISOString().split("T")[0];

export const PatientRegisterPage = () => {
  const navigate = useNavigate();
  const mutation = useRegisterPatient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientRegisterRequest>({
    resolver: zodResolver(patientRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      emergencyContact: "",
    },
  });

  const onSubmit = (values: PatientRegisterRequest) => {
    mutation.mutate(
      {
        ...values,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        bloodGroup: values.bloodGroup || null,
        emergencyContact: values.emergencyContact || null,
      },
      {
        onSuccess: () => navigate("/login"),
      },
    );
  };

  const isLoading = mutation.isPending;

  return (
    <AuthLayout
      title="Create your patient account"
      description="Book appointments and keep your health records in one place"
      headline="Your health, organised and always within reach."
      subline="Register once to book appointments and access your records."
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
          Are you a doctor?{" "}
          <Link
            to="/register/doctor"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Register as a doctor
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
          <FormField
            id="fullName"
            label="Full name"
            error={errors.fullName?.message}
          >
            <Input
              autoComplete="name"
              placeholder="Jane Doe"
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
                placeholder="you@example.com"
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

        {/* Personal */}
        <fieldset className="space-y-4" disabled={isLoading}>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              id="dateOfBirth"
              label="Date of birth"
              optional
              error={errors.dateOfBirth?.message}
            >
              <Input
                type="date"
                max={today}
                autoComplete="bday"
                className={errorClass(!!errors.dateOfBirth)}
                {...fieldProps("dateOfBirth", !!errors.dateOfBirth)}
                {...register("dateOfBirth")}
              />
            </FormField>

            <FormField
              id="gender"
              label="Gender"
              optional
              error={errors.gender?.message}
            >
              <Select
                {...fieldProps("gender", !!errors.gender)}
                {...register("gender")}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Select>
            </FormField>

            <FormField
              id="bloodGroup"
              label="Blood group"
              optional
              error={errors.bloodGroup?.message}
            >
              <Select
                {...fieldProps("bloodGroup", !!errors.bloodGroup)}
                {...register("bloodGroup")}
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField
            id="emergencyContact"
            label="Emergency contact"
            optional
            error={errors.emergencyContact?.message}
            hint="Someone we can reach if you need urgent help."
          >
            <Input
              type="tel"
              autoComplete="tel"
              placeholder="Phone number"
              className={errorClass(!!errors.emergencyContact)}
              {...fieldProps(
                "emergencyContact",
                !!errors.emergencyContact,
                true,
              )}
              {...register("emergencyContact")}
            />
          </FormField>
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
        <p className="mt-1 text-xs leading-tight text-muted-foreground text-center">
          You can fill optional fields by updating your profile later.
        </p>
      </form>
    </AuthLayout>
  );
};
