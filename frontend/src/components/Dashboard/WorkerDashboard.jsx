import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, CloudRain, CheckCircle, Clock, AlertTriangle, CloudFog, ThermometerSun, Wallet, LogOut, Info, Check, Lock, Activity } from 'lucide-react';
import ClaimPipeline from './ClaimPipeline';

const API = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:8000/api';

export default function WorkerDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('coverage');
    const [status, setStatus] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [activePolicy, setActivePolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkerData = async () => {
        try {
            // Fetch status
            const statusRes = await axios.get(`${API}/triggers/status`, { withCredentials: true });
            setStatus(statusRes.data);

            // Fetch personal payouts
            const payoutsRes = await axios.get(`${API}/payouts/history`, { withCredentials: true });
            setPayouts(payoutsRes.data);

            // Fetch active policy
            const policyRes = await axios.get(`${API}/policies/active`, { withCredentials: true });
            if (policyRes.data.active) {
                setActivePolicy(policyRes.data);
            }
        } catch (err) {
            console.error("Worker fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkerData();
        const interval = setInterval(fetchWorkerData, 60000); // 1 min poll
        return () => clearInterval(interval);
    }, [user.name]);

    // PIPELINE SMART SYNC: AUTO-REFETCH AFTER ANIMATION
    useEffect(() => {
        if (status?.overall_status === 'triggered') {
            // Immediate sync for statistics
            fetchWorkerData();

            // Deferred sync for final pipeline state
            const timer = setTimeout(() => {
                fetchWorkerData();
            }, 6000); 
            return () => clearTimeout(timer);
        }
    }, [status?.overall_status]);

    const activePayouts = payouts.filter(p => p.status === 'paid' || p.status === 'processing');

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gs-cream">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gs-border flex flex-col justify-between">
                <div>
                    <div className="p-6 border-b border-gs-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gs-navy rounded-md flex items-center justify-center">
                                <Shield size={16} color="#F8F9FA" strokeWidth={2} />
                            </div>
                            <span className="font-sans font-semibold text-[15px] text-gs-navy tracking-tight">GigShield</span>
                        </div>
                    </div>

                    <div className="p-6 pb-2">
                        <p className="text-xs text-gs-muted mb-1">PROTECTED WORKER</p>
                        <p className="font-medium text-gs-navy">{user.name}</p>
                        <p className="text-sm text-gs-muted">{user.city} • {user.pincode}</p>
                    </div>

                    <nav className="p-4 space-y-1">
                        {[
                            { id: 'coverage', label: 'My Coverage', icon: Shield },
                            { id: 'triggers', label: 'Live Triggers', icon: CloudRain },
                            { id: 'claims', label: 'My Claims & Payouts', icon: Wallet },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id ? 'bg-gs-navy text-white' : 'text-gs-muted hover:bg-gray-100 hover:text-gs-navy'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="p-4 border-t border-gs-border">
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-gs-navy mb-2">
                            {activeTab === 'coverage' && 'Your Coverage'}
                            {activeTab === 'triggers' && 'Zone Monitoring'}
                            {activeTab === 'claims' && 'Claims & Payouts'}
                        </h1>
                        <p className="text-gs-muted">
                            {activeTab === 'coverage' && `Active plan: ${(user.plan || 'standard').toUpperCase()}`}
                            {activeTab === 'triggers' && `Live parametric sensor data for ${user.pincode}`}
                            {activeTab === 'claims' && 'Automated payouts sent directly to your UPI'}
                        </p>
                    </div>
                    {status && status.overall_status === 'triggered' && (
                        <div className="hidden md:flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                            <div className="live-dot-red" />
                            Trigger Active
                        </div>
                    )}
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gs-navy border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <>
                        {/* COVERAGE TAB */}
                        {activeTab === 'coverage' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="widget-card col-span-1 md:col-span-2 !bg-[#0B1B33] !text-white overflow-hidden relative !border-none">
                                    <div className="absolute top-0 right-0 w-64 h-64 border border-white/10 rounded-full -translate-y-32 translate-x-32" />
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-xs text-white/60 mb-1 lg:uppercase tracking-widest font-medium">Active Policy</p>
                                                    <h3 className="text-2xl font-serif tracking-tight">{(user.plan || 'standard').charAt(0).toUpperCase() + (user.plan || 'standard').slice(1)} Plan</h3>
                                                </div>
                                                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30 flex items-center gap-1.5">
                                                    <CheckCircle size={12} /> Active
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
                                                <div>
                                                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1.5">Weekly Premium</p>
                                                    <p className="text-2xl font-serif font-medium">₹{user.weekly_premium || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1.5">Coverage Cap</p>
                                                    <p className="text-2xl font-serif font-medium">
                                                        ₹{user.plan === 'basic' ? '500' : user.plan === 'standard' ? '900' : '1,500'}
                                                    </p>
                                                </div>
                                                <div className="hidden lg:block">
                                                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1.5">Weekly Limit</p>
                                                    <p className="text-2xl font-serif font-medium italic opacity-80">
                                                        {user.plan === 'basic' ? '~6 hrs' : user.plan === 'standard' ? '~12 hrs' : '~20 hrs'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                                                <div className="bg-white h-full" style={{ width: `${((activePolicy?.days_remaining || 6) / 7) * 100}%` }} />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-white/50 font-medium">
                                                <span className="flex items-center gap-1"><Shield size={10} /> Zero-touch claims active</span>
                                                <span className="flex items-center gap-1"><Clock size={10} /> Renewal in {activePolicy?.days_remaining || 6} days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="widget-card bg-white border border-gs-border flex flex-col h-full shadow-sm">
                                    <p className="label-tag mb-4">Coverage Matrix</p>
                                    <div className="space-y-2.5 flex-1">
                                        {[
                                            { name: 'Heavy Rainfall (>30mm/h)', min: 'basic' },
                                            { name: 'Severe AQI (>400)', min: 'basic' },
                                            { name: 'Extreme Heat (>45°C)', min: 'standard' },
                                            { name: 'Flood Alert (Red)', min: 'standard' },
                                            { name: 'Local Curfew / Bandh', min: 'premium' },
                                            { name: 'Platform Outage / Crash', min: 'premium' },
                                            { name: 'Market Demand Crash', min: 'premium' },
                                        ].map((trigger, i) => {
                                            const isLocked = (user.plan === 'basic' && trigger.min !== 'basic') || 
                                                           (user.plan === 'standard' && trigger.min === 'premium');
                                            return (
                                                <div key={i} className={`flex items-center justify-between text-[11px] py-1 border-b border-gs-border/30 last:border-0 ${isLocked ? 'grayscale opacity-40' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isLocked ? 'bg-gray-100' : 'bg-green-50 text-green-600'}`}>
                                                            {isLocked ? <Lock size={8} /> : <Check size={10} />}
                                                        </div>
                                                        <span className={isLocked ? 'text-gs-muted' : 'text-gs-navy font-medium'}>{trigger.name}</span>
                                                    </div>
                                                    {isLocked && <span className="text-[8px] uppercase font-black text-gs-muted bg-gray-50 px-1 rounded">Upgrade</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="widget-card bg-gs-cream border border-gs-border/30 shadow-sm col-span-1 md:col-span-2 lg:col-span-1">
                                    <p className="label-tag mb-4">Income Protection Details</p>
                                    <div className="bg-white/50 p-4 rounded-lg border border-gs-border/50 mb-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gs-navy rounded-lg flex items-center justify-center text-white">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-serif text-gs-navy">
                                                    {user.plan === 'basic' ? '6 Hours' : user.plan === 'standard' ? '12 Hours' : '20 Hours'}
                                                </p>
                                                <p className="text-[10px] text-gs-muted uppercase font-bold">Weekly Avg Support</p>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-gs-muted leading-relaxed">
                                            GigShield auto-detects loss of income during the triggers listed. Your current <strong>{user.plan}</strong> plan secures up to <strong>{user.plan === 'basic' ? '₹500' : user.plan === 'standard' ? '₹900' : '₹1,500'}</strong> per week, protecting approximately <strong>{user.plan === 'basic' ? '6' : user.plan === 'standard' ? '12' : '20'}</strong> working hours.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 bg-gs-navy/5 p-3 rounded-md">
                                        <Info size={14} className="text-gs-navy mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-gs-navy/70 leading-normal">
                                            Thresholds are monitored at the pincode level (<strong>{user.pincode}</strong>) using verifiable government and weather station data. 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TRIGGERS TAB */}
                        {activeTab === 'triggers' && (
                            <div className="space-y-6">
                                <div className="bg-white border border-gs-border rounded-md p-4 flex items-start gap-4">
                                    <div className="mt-0.5"><Info size={18} className="text-gs-muted" /></div>
                                    <div>
                                        <p className="text-sm text-gs-navy font-medium">How triggers work</p>
                                        <p className="text-sm text-gs-muted mt-1">If sensors in your zone detect weather above your plan's thresholds, a claim is automatically generated. No forms needed.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {status?.conditions?.map(cond => (
                                        <div key={cond.trigger_type} className={`widget-card border-l-4 transition-all duration-500 shadow-sm hover:shadow-md ${
                                            cond.status === 'triggered' ? 'border-l-red-500 bg-red-50/40 ring-1 ring-red-200' : 
                                            cond.status === 'warning' ? 'border-l-orange-400 bg-orange-50/30' : 
                                            'border-l-green-500 bg-white'
                                        }`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-gs-navy capitalize flex items-center gap-2">
                                                    {cond.trigger_type === 'rain' && <CloudRain size={16} />}
                                                    {cond.trigger_type === 'heat' && <ThermometerSun size={16} />}
                                                    {cond.trigger_type === 'aqi' && <CloudFog size={16} />}
                                                    {cond.trigger_type}
                                                </h3>
                                                {cond.status === 'triggered' ? (
                                                    <span className="badge-triggered shrink-0">Triggered</span>
                                                ) : cond.status === 'warning' ? (
                                                    <span className="badge-warning shrink-0">Warning</span>
                                                ) : (
                                                    <span className="badge-normal shrink-0">Normal</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div>
                                                    <p className="text-xs text-gs-muted mb-0.5">Current Reading</p>
                                                    <p className="text-2xl font-semibold text-gs-navy">{cond.current_value}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gs-muted mb-0.5">Threshold</p>
                                                    <p className="text-sm font-medium text-gs-navy">{cond.threshold}{cond.type === 'heat' ? '°C' : cond.type === 'rain' ? 'mm/h' : ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CLAIMS & PAYOUTS TAB */}
                        {activeTab === 'claims' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="widget-card bg-white border border-gs-border">
                                        <p className="label-tag mb-1 text-gs-muted">TOTAL CLAIMS</p>
                                        <p className="text-3xl font-serif text-gs-navy">{payouts.length}</p>
                                    </div>
                                    <div className="widget-card bg-white border border-gs-border">
                                        <p className="label-tag mb-1 text-gs-muted">TOTAL PAID</p>
                                        <p className="text-3xl font-serif text-green-600">₹{payouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
                                    </div>
                                    <div className="widget-card bg-white border border-gs-border shadow-sm">
                                        <p className="label-tag mb-1 text-gs-muted">LATEST PAYOUT</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-3xl font-serif text-gs-navy">
                                                {payouts && payouts.length > 0 ? `₹${Number(payouts[0].amount).toLocaleString()}` : '--'}
                                            </p>
                                            {payouts && payouts.length > 0 && (
                                                <span className="badge-paid text-[10px] uppercase font-bold">Paid</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Active Claim Verification Pipeline - Modernized */}
                                {status?.overall_status === 'triggered' && (
                                    <div className="space-y-4 mb-2">
                                        <h3 className="text-sm font-medium text-gs-navy">Active Claim Verification Pipeline</h3>
                                        <ClaimPipeline 
                                            events={status.conditions?.filter(c => c.status === 'triggered').map(c => c.trigger_type) || []} 
                                            isProcessed={payouts.some(p => 
                                                p.status === 'paid' && 
                                                status.conditions?.some(c => c.status === 'triggered' && c.trigger_type === p.trigger_type)
                                            )}
                                            fraudScore={12}
                                        />
                                    </div>
                                )}

                                <div className="widget-card p-0 overflow-hidden mt-8">
                                    <div className="p-4 border-b border-gs-border bg-gray-50 flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gs-navy">Payout History</h3>
                                    </div>
                                    {payouts.length === 0 ? (
                                        <div className="p-10 text-center text-gs-muted">
                                            <p>No claims processed yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="text-xs text-gs-muted bg-gray-50 border-b border-gs-border">
                                                    <tr>
                                                        <th className="px-5 py-3 font-medium">Date</th>
                                                        <th className="px-5 py-3 font-medium">Trigger</th>
                                                        <th className="px-5 py-3 font-medium">Amount</th>
                                                        <th className="px-5 py-3 font-medium">Status</th>
                                                        <th className="px-5 py-3 font-medium text-right">Time to Payout</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payouts.map((payout, i) => (
                                                        <tr key={i} className="border-b border-gs-border last:border-0 hover:bg-gray-50">
                                                            <td className="px-5 py-4 whitespace-nowrap">{payout.date}</td>
                                                            <td className="px-5 py-4 capitalize font-medium">{payout.trigger_type}</td>
                                                            <td className="px-5 py-4 font-semibold">₹{payout.amount}</td>
                                                            <td className="px-5 py-4">
                                                                <span className="badge-paid">Paid via {payout.payment_method}</span>
                                                            </td>
                                                            <td className="px-5 py-4 text-right text-gs-muted font-mono">{payout.time_to_payout}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
