"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API}/auth/me`, { withCredentials: true });
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
            setUser(data);
            return data;
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            await axios.post(`${API}/auth/verify-otp`, { email, otp }, { withCredentials: true });
            return true;
        } catch (err) {
            throw err;
        }
    };

    const register = async (name, email, password, gigType, platform, pincode, city, plan) => {
        try {
            const { data } = await axios.post(`${API}/auth/register`, {
                name,
                email,
                password,
                gig_type: gigType,
                platform,
                pincode,
                city,
                plan
            }, { withCredentials: true });
            setUser(data);
            return data;
        } catch (err) {
            console.error("Registration failed:", err);
            throw err;
        }
    };

    const logout = async () => {
        await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen bg-gs-cream flex items-center justify-center">
            <div className="flex items-center gap-3 text-gs-muted">
                <div className="w-4 h-4 border-2 border-gs-navy border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
            </div>
        </div>
    );

    return children;
};

export default AuthContext;
