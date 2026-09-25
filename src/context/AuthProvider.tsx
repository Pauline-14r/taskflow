import {type ReactNode, useEffect, useState} from "react";
import {login as apiLogin, refresh, type LoginRequest, type User, getMe} from "../api/auth.ts";
import {AuthContext} from "./AuthContext.ts";

export function AuthProvider ({children} : {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = accessToken !== null;

    async function login (values : LoginRequest) {
        const data = await apiLogin(values);
        setUser(data.user);
        setAccessToken(data.accessToken);
    }

    async function logout () {
        setUser(null);
        setAccessToken(null);
    }

    useEffect(() => {
        async function restoreSession () {
            try {
                const data = await refresh();
                setAccessToken(data.accessToken);
                const currentUser = await getMe(data.accessToken);
                setUser(currentUser);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession()
    }, [])

    return (
        <AuthContext.Provider
            value={{user, accessToken, isLoading, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

