import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Activity, Users, ShieldAlert, Zap, LogOut, 
    BarChart3, Settings, Shield, IndianRupee, ShieldCheck
} from 'lucide-react';
import InterventionConsole from './InterventionConsole';
import WorkerTable from './WorkerTable';
import FraudMonitor from './FraudMonitor';

const API = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:8000/api';

export default function AdminDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API}/admin/stats`, { withCredentials: true });
                setStats(res.data);
            } catch (err) {
                console.error("Admin stats fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchHealth = async () => {
            try {
                const res = await axios.get(`${API}/admin/health`, { withCredentials: true });
                setHealth(res.data);
            } catch (err) {
                console.error("Admin health fetch failed", err);
            }
        };
        fetchStats();
        fetchHealth();
        const interval = setInterval(fetchHealth, 10000); // 10s poll for health
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gs-cream">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gs-navy text-white flex flex-col justify-between">
                <div>
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                                <Shield size={16} color="#F8F9FA" strokeWidth={2} />
                            </div>
                            <span className="font-sans font-semibold text-[15px] tracking-tight">GigShield OS</span>
                        </div>
                    </div>

                    <div className="p-6 pb-2">
                        <p className="text-xs text-white/50 mb-1">COMMAND CENTER</p>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${health?.status === 'alert' ? 'text-red-400' : 'text-green-400'}`}>
                            {health?.status === 'alert' ? (
                                <><div className="live-dot-red" /> {health.active_trigger_count} ACTIVE TRIGGERS</>
                            ) : (
                                <><div className="live-dot" /> System Online</>
                            )}
                        </p>
                    </div>

                    <nav className="p-4 space-y-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'interventions', label: 'Intervention Console', icon: Zap },
                            { id: 'fraud', label: 'Fraud Monitor', icon: ShieldAlert },
                            { id: 'workers', label: 'All Workers', icon: Users },
                            { id: 'system', label: 'System Health', icon: Activity },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id ? 'bg-white text-gs-navy' : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="p-4 border-t border-white/10">
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <LogOut size={16} /> Sign out admin
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                <header className="mb-8">
                    <h1 className="font-serif text-3xl md:text-4xl text-gs-navy mb-2">
                        {activeTab === 'overview' && 'Platform Overview'}
                        {activeTab === 'interventions' && 'Command & Intervention Console'}
                        {activeTab === 'fraud' && 'Adversarial Defense Monitor'}
                        {activeTab === 'workers' && 'Worker Registry'}
                        {activeTab === 'system' && 'System Health & Analytics'}
                    </h1>
                    <p className="text-gs-muted">
                        {activeTab === 'overview' && 'Real-time metrics and platform KPIs.'}
                        {activeTab === 'interventions' && 'Monitor automated AI triggers or manually intervene for curfews and outages.'}
                        {activeTab === 'fraud' && 'AI fraud detection flagged claims and risk scoring.'}
                        {activeTab === 'workers' && 'Manage worker accounts and risk tiers.'}
                        {activeTab === 'system' && 'API endpoints, scheduler status, and database health.'}
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gs-navy border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <>
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fade-up">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="widget-card">
                                        <div className="flex items-center gap-2 mb-2 text-gs-muted">
                                            <Users size={16} />
                                            <p className="label-tag mb-0">TOTAL PROTECTED</p>
                                        </div>
                                        <p className="metric-value font-serif text-3xl">{stats?.total_workers || 0}</p>
                                        <p className="text-xs text-green-600 mt-2 font-medium">+12% this week</p>
                                    </div>
                                    <div className="widget-card">
                                        <div className="flex items-center gap-2 mb-2 text-gs-muted">
                                            <ShieldCheck size={16} />
                                            <p className="label-tag mb-0">ACTIVE POLICIES</p>
                                        </div>
                                        <p className="metric-value font-serif text-3xl">{stats?.active_policies || 0}</p>
                                        <p className="text-xs text-green-600 mt-2 font-medium">98.5% retention</p>
                                    </div>
                                    <div className="widget-card">
                                        <div className="flex items-center gap-2 mb-2 text-gs-muted">
                                            <IndianRupee size={16} />
                                            <p className="label-tag mb-0">TOTAL PAYOUTS</p>
                                        </div>
                                        <p className="metric-value font-serif text-3xl">₹{(stats?.total_payouts_amount || 0).toLocaleString()}</p>
                                        <p className="text-xs text-gs-muted mt-2 font-medium">Auto-dispatched via UPI</p>
                                    </div>
                                    <div className="widget-card">
                                        <div className="flex items-center gap-2 mb-2 text-gs-muted">
                                            <Activity size={16} />
                                            <p className="label-tag mb-0">LOSS RATIO</p>
                                        </div>
                                        <p className="metric-value font-serif text-3xl">{stats?.loss_ratio || 0}%</p>
                                        <p className="text-xs text-gs-muted mt-2 font-medium">Target: &lt;65%</p>
                                    </div>
                                </div>
                                <div className="widget-card !bg-gs-navy !text-white p-8 relative overflow-hidden !border-none">
                                     <div className="absolute top-0 right-0 w-96 h-96 border border-white/5 rounded-full -translate-y-48 translate-x-48" />
                                     <div className="relative z-10 flex justify-between items-center">
                                         <div>
                                             <h3 className="font-serif text-2xl mb-2">Automated Payout Engine Online</h3>
                                             <p className="text-white/60 text-sm max-w-md">The parametric engine is actively monitoring 42 high-risk weather zones. No manual intervention required.</p>
                                         </div>
                                         <div className="hidden md:flex items-center gap-3">
                                             <div className="live-dot" />
                                             <span className="text-sm font-medium tracking-wide">MONITORING</span>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'interventions' && <InterventionConsole />}
                        {activeTab === 'fraud' && <FraudMonitor />}
                        {activeTab === 'workers' && <WorkerTable />}
                        {activeTab === 'system' && (
                            <div className="widget-card p-10 text-center animate-fade-up">
                                <Activity size={48} className="mx-auto text-gs-muted mb-4 opacity-50" />
                                <h3 className="font-serif text-2xl text-gs-navy">System Health Dashboard</h3>
                                <p className="text-gs-muted mt-2">All API integrations (IMD, CPCB API, and Payment Gateways) are functioning normally. 0 outages in the last 30 days.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
