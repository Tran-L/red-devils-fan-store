import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("redStoreUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("redStoreToken") || null;
    });

    const [loading, setLoading] = useState(Boolean(localStorage.getItem("redStoreToken")));

    const isAuthenticated = Boolean(user && token);
    const isAdmin = user?.role === "admin";

    const saveSession = (newToken, newUser) => {
        localStorage.setItem("redStoreToken", newToken);
        localStorage.setItem("redStoreUser", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const clearSession = () => {
        localStorage.removeItem("redStoreToken");
        localStorage.removeItem("redStoreUser");
        setToken(null);
        setUser(null);
    };

    const register = async ({ fullName, email, password }) => {
        const response = await api.post("/auth/register", {
            fullName,
            email,
            password
        });

        saveSession(response.data.token, response.data.user);
        return response.data;
    };

    const login = async ({ email, password }) => {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        saveSession(response.data.token, response.data.user);
        return response.data;
    };

    const logout = () => {
        clearSession();
    };

    useEffect(() => {
        const checkCurrentUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");

                const currentUser = {
                    id: response.data.user.id,
                    fullName: response.data.user.fullName,
                    email: response.data.user.email,
                    role: response.data.user.role
                };

                localStorage.setItem("redStoreUser", JSON.stringify(currentUser));
                setUser(currentUser);
            } catch (error) {
                clearSession();
            } finally {
                setLoading(false);
            }
        };

        checkCurrentUser();
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated,
                isAdmin,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};