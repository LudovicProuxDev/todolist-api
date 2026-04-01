import { useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    // Initialize the state for the localStorage
    const [user, setUser] = useState(() => {
        // Checking token if exists
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Checking expiration token
                if (decoded.exp * 1000 > Date.now()) {
                    return decoded;
                }
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
        return null;
    });

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth',
                {
                    username: username,
                    password: password
                },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    }
                }
            );
            const { token } = response.data;
            localStorage.setItem('token', token);
            
            setUser(jwtDecode(token));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message
            };
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
