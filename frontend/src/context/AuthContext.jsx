import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Checking token if exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Checking expiration token
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded);
                } else {
                    logout();
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

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
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};