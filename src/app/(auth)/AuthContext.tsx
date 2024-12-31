"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
    isLoggedIn: boolean;
    username: string | null;
    user_id: string | null;
    token: string | null
    setAuth: (auth: { isLoggedIn: boolean; username: string | null, user_id: string | null, token: string | null }) => void;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    username: null,
    user_id: null,
    setAuth: () => { },
    token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<Omit<AuthContextProps, 'setAuth'>>({
        isLoggedIn: false,
        username: null,
        user_id: null,
        token: null
    });

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const username = localStorage.getItem("username") || null;
        const user_id = localStorage.getItem("user_id") || null;
        const token = Cookies.get("token") || null;

        setAuthState({ isLoggedIn, username, user_id, token });
    }, []);

    const setAuth = (auth: Omit<AuthContextProps, 'setAuth'>) => {
        setAuthState(auth);

        localStorage.setItem("isLoggedIn", auth.isLoggedIn.toString());
        localStorage.setItem("username", auth.username || "");
        localStorage.setItem("user_id", auth.user_id || "");
        Cookies.set("token", auth.token || "");
    };


    return (
        <AuthContext.Provider value={{ ...authState, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
