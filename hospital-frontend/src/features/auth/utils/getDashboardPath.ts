import type { Role } from "../types/auth.types";

export const getDashboardPath = (role: Role): string => {
    switch (role) {
        case "PATIENT":
            return "/patient/dashboard";

        case "DOCTOR":
            return "/doctor/dashboard";

        case "ADMIN":
            return "/admin/dashboard";

        default:
            return "/login";
    }
};