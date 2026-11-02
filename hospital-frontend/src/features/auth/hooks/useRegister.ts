import {useMutation} from "@tanstack/react-query";

import {
    registerPatient,
    registerDoctor
} from "../api/authApi";

export const useRegisterPatient = () => {
    return useMutation({
        mutationFn : registerPatient
    });
}

export const useRegisterDoctor = () => {
    return useMutation({
        mutationFn: registerDoctor
    });
};
