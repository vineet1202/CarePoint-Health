import { z } from "zod";

export const patientRegisterSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),

    password: z.string().min(8, "Password must contain at least 8 characters"),

    fullName: z.string().min(2, "Name must contain at least 2 characters"),

    dateOfBirth: z.string().nullable().optional(),

    gender: z.string().nullable().optional(),

    bloodGroup: z.string().nullable().optional(),

    emergencyContact: z.string().nullable().optional()
});

export const doctorRegisterSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),

    password: z.string().min(8, "Password must contain at least 8 characters"),

    fullName: z.string().min(2, "Name must contain at least 2 characters"),

    specialization: z.string().min(1, "Specialization is required"),

    qualification: z.string().nullable().optional(),

    experienceYears: z.number()
        .int("Experience must be a whole number")
        .min(0, "Experience cannot be negative")
        .nullable()
        .optional(),

    consultationFee: z.number()
        .positive("Consultation fee must be greater than zero")
});