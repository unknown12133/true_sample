import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';

interface AuthContextType {
    user: any | null;
    token: string | null;
    login: (mobile: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check if token exists and validate/fetch user if needed
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            // Hardcoded check as per user request
            if (username === 'admin' && password === 'Markwave@1') {
                const mockToken = "mock-admin-token-" + Date.now();
                const mockUser = { username: 'admin', role: 'admin' };

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setToken(mockToken);
                setUser(mockUser);
                toast.success('Login successful');
                return;
            }

            // Fallback to API if we ever want to support other users, 
            // but for now, if it's not admin, it's invalid.
            throw new Error('Invalid username or password');

            /* 
            // Original API call logic - commented out for now
            const data = await api.auth.login({ mobile: username, password });
            const receivedToken = data.token || data.access_token;
            const receivedUser = data.user || { username };

            if (receivedToken) {
                localStorage.setItem('token', receivedToken);
                localStorage.setItem('user', JSON.stringify(receivedUser));
                setToken(receivedToken);
                setUser(receivedUser);
                toast.success('Login successful');
            } else {
                throw new Error('No token received');
            }
            */
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.message || 'Login failed';
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
