import {useMutation} from "@tanstack/react-query";
import {login} from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export function useLogin(){

    const { setSession } = useAuth();

    return useMutation({
        mutationFn : login,

        onSuccess : (data) => {
            setSession(data);
        },
    });
}