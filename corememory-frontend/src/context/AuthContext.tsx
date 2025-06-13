import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CookieService from "../services/cookieService";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../apis/userApis";

// 1. Define your context type
interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    userData: any;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

// 2. Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 3. Define the useAuth hook
export const useAuth = (): AuthContextProps => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// 4. Define the AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const savedToken = await new CookieService().getCookie("authToken");
            if (savedToken) {
                setToken(savedToken);
                setIsAuthenticated(true);
                const decoded_token: any = jwtDecode(savedToken);
                const isTokenExpired =
                    decoded_token?.exp &&
                    Date.now() >= decoded_token.exp * 1000;
                if (isTokenExpired) {
                    logout();
                } else {
                    setIsAuthenticated(true);
                    setUserData(decoded_token);
                }
            } else {
                setIsAuthenticated(false);
                setToken(null);
            }
            setLoading(false);
        };

        checkAuthentication();
    }, [location]);

    const login = (authToken: string) => {
        new CookieService().addCookie("authToken", authToken, 24); // 1 day
        setToken(authToken);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        const savedToken = await new CookieService().getCookie("authToken");

        if (savedToken) {
            try {
                await logoutUser(savedToken);
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }

        new CookieService().destroyCookie("authToken");
        setToken(null);
        setIsAuthenticated(false);
        setUserData(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                userData,
                setIsAuthenticated,
                setToken,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
