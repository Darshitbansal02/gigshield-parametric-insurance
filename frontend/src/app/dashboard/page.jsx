"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import WorkerDashboard from '@/components/Dashboard/WorkerDashboard';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait a small moment to ensure `user` state has populated properly if loaded from cookie
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) return (
        <div className="min-h-screen bg-gs-cream flex items-center justify-center">
            <div className="flex items-center gap-3 text-gs-muted">
                <div className="w-4 h-4 border-2 border-gs-navy border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading dashboard...</span>
            </div>
        </div>
    );

    if (!user) {
        // Fallback catch, handled by ProtectedRoute mostly
        return null;
    }

    if (user.is_admin) {
        return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    return <WorkerDashboard user={user} onLogout={handleLogout} />;
}
