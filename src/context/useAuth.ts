import {AuthContext} from "./AuthContext.ts";
import {useContext} from "react";

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}