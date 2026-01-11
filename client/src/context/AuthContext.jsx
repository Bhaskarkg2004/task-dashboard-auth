import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('auth-token');
            if (token) {
                try {
                    // Ideally verify token with backend or decode it
                    // For now, let's fetch profile to verify
                    const res = await api.get('/user/profile');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('auth-token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/user/login', { email, password });
        localStorage.setItem('auth-token', res.data.token);
        // Set user state from response or fetch profile
        setUser({ name: res.data.name, _id: res.data.id });
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/user/register', { name, email, password });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
