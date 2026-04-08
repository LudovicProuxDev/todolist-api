import { useState, useCallback, useEffect } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Checking if the user is connected
    const checkAuth = useCallback(async () => {
        try {
            // Endpoint API with current user
            // This call will automatically send the httpOnly cookie 
            const response = await api.get('/me'); 
            setUser(response.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (username, password) => {
        try {
            await api.post('/auth',
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
            // After login, we get user infos
            await checkAuth(); 
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message
            };
        }
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.error("Error for Logout", err);
        } finally {
            setUser(null);
        }
    }, []);

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
