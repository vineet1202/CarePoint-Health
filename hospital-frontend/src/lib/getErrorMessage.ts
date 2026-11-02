import axios from "axios";

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return "Unable to connect to server. Please try again.";
        }

        const data = error.response.data;

        if (data?.errors) {
            return Object.values(data.errors)[0] ?? data.message ?? "Validation failed.";
        }

        return data?.message ?? "Something went wrong.";
    }

    return "An unexpected error occurred.";
}