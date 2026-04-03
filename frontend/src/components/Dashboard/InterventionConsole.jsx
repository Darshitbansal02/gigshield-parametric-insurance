import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, AlertTriangle, ArrowRight, CheckCircle, Activity, ShieldCheck, Globe, Clock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:8000/api';

export default function InterventionConsole() {
    const [mode, setMode] = useState('intervention'); // 'intervention' or 'simulation'
    const [form, setForm] = useState({
        trigger_type: 'curfew',
        value: 1,
        city: 'Pune',
        pincode: '411038'
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [monitorStatus, setMonitorStatus] = useState({
        lastCheck: new Date().toLocaleTimeString(),
        zones: 12,
        status: 'Scanning'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMonitorStatus(prev => ({
                ...prev,
                lastCheck: new Date().toLocaleTimeString(),
                status: Math.random() > 0.8 ? 'Breach Detected' : 'Scanning'
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await axios.post(`${API}/triggers/simulate`, form, { withCredentials: true });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-up">
            {/* AI Monitor Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="widget-card flex flex-col justify-between py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gs-muted uppercase tracking-wider">AI Monitor Status</span>
                        <div className={`w-2 h-2 rounded-full ${monitorStatus.status === 'Scanning' ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-bounce'}`} />
                    </div>
                    <p className="text-lg font-serif text-gs-navy">{monitorStatus.status}</p>
                    <p className="text-[10px] text-gs-muted mt-1 flex items-center gap-1">
                        <Clock size={10} /> Last check: {monitorStatus.lastCheck}
                    </p>
                </div>
                <div className="widget-card flex flex-col justify-between py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gs-muted uppercase tracking-wider">Active Zones</span>
                        <Globe size={14} className="text-gs-muted" />
                    </div>
                    <p className="text-lg font-serif text-gs-navy">{monitorStatus.zones} Zones Covered</p>
                    <p className="text-[10px] text-gs-muted mt-1">Real-time weather & AQI ingestion active</p>
                </div>
                <div className="widget-card flex flex-col justify-between py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gs-muted uppercase tracking-wider">Detection Logic</span>
                        <Activity size={14} className="text-gs-muted" />
                    </div>
                    <p className="text-lg font-serif text-gs-navy">ML Trigger V4.2</p>
                    <p className="text-[10px] text-gs-muted mt-1">Zero-touch automation enabled</p>
                </div>
            </div>

            <div className="bg-white border border-gs-border rounded-lg overflow-hidden">
                <div className="flex border-b border-gs-border">
                    <button 
                        onClick={() => setMode('intervention')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${mode === 'intervention' ? 'bg-gs-navy text-white' : 'text-gs-muted hover:bg-gray-50'}`}
                    >
                        Manual Intervention (Curfews/Outages)
                    </button>
                    <button 
                        onClick={() => setMode('simulation')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${mode === 'simulation' ? 'bg-gs-navy text-white' : 'text-gs-muted hover:bg-gray-50'}`}
                    >
                        Simulation Mode (Testing/QA)
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gs-border">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${mode === 'intervention' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {mode === 'intervention' ? <ShieldCheck size={24} /> : <Zap size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-serif text-gs-navy">
                                {mode === 'intervention' ? 'Manual System Intervention' : 'Parametric Simulation Console'}
                            </h2>
                            <p className="text-sm text-gs-muted mt-1 max-w-2xl">
                                {mode === 'intervention' 
                                    ? 'Declare non-weather events that affect gig worker earnings. These events require explicit admin authorization before payouts are triggered.' 
                                    : 'Test the automated response of the AI engine by simulating sensor breaches. Use this to verify claim pipelines and fraud detection accuracy.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Event Type</label>
                                    <select 
                                        className="form-input"
                                        value={form.trigger_type}
                                        onChange={e => setForm({...form, trigger_type: e.target.value})}
                                    >
                                        {mode === 'intervention' ? (
                                            <>
                                                <option value="curfew">Local Curfew / Sec 144</option>
                                                <option value="bandh">Political Bandh / Strike</option>
                                                <option value="platform_outage">Platform API Outage</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="rain">Heavy Rainfall (&gt;30mm/h)</option>
                                                <option value="heat">Extreme Heat (&gt;45°C)</option>
                                                <option value="aqi">Severe AQI (&gt;400)</option>
                                                <option value="flood">Flash Flood Warning</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">{mode === 'intervention' ? 'Estimated Duration' : 'Simulated Reading'}</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            className="form-input" 
                                            value={form.value}
                                            onChange={e => setForm({...form, value: Number(e.target.value)})}
                                        />
                                        <span className="text-xs text-gs-muted font-medium whitespace-nowrap">
                                            {mode === 'intervention' ? 'Hours' : (form.trigger_type === 'rain' ? 'mm/h' : form.trigger_type === 'heat' ? '°C' : 'AQI')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Target City</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        value={form.city}
                                        onChange={e => setForm({...form, city: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Target Pincode</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        value={form.pincode}
                                        onChange={e => setForm({...form, pincode: e.target.value})}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100 flex items-center gap-2">
                                    <AlertTriangle size={16} /> {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`w-full justify-center py-3 text-base font-medium rounded-md text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 ${mode === 'intervention' ? 'bg-red-600 hover:bg-red-700' : 'bg-gs-navy hover:bg-opacity-90'}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {mode === 'intervention' ? 'Authorize Intervention' : 'Inject Simulated Event'} 
                                        <ArrowRight size={16} />
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Result Panel */}
                        <div className="flex-1 bg-gray-50 border border-gs-border rounded-md p-5 flex flex-col">
                            <h3 className="text-sm font-medium text-gs-navy mb-4">Execution Status</h3>
                            
                            {!result && !loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gs-muted p-6 text-center">
                                    <ShieldCheck size={32} className="opacity-20 mb-3" />
                                    <p className="text-sm">Submit the form to process claims for the selected zone.</p>
                                </div>
                            ) : null}

                            {loading && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                                    <div className="w-8 h-8 border-4 border-gs-navy border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-gs-muted animate-pulse">Running fraud engine and processing payouts...</p>
                                </div>
                            )}

                            {result && !loading && (
                                <div className="space-y-4 animate-fade-up">
                                    <div className="p-3 bg-green-50 text-green-800 text-sm rounded border border-green-200 mb-4 flex gap-2">
                                        <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Success: Claims Authorized</p>
                                            <p className="mt-1 opacity-90">{result.message}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-white border border-gs-border rounded">
                                            <p className="text-xs text-gs-muted mb-1">Impacted Workers</p>
                                            <p className="text-lg font-bold text-gs-navy">{result.affected_workers}</p>
                                        </div>
                                        <div className="p-3 bg-white border border-gs-border rounded">
                                            <p className="text-xs text-gs-muted mb-1">Auto-Payouts</p>
                                            <p className="text-lg font-bold text-green-600">{result.payouts_processed}</p>
                                        </div>
                                    </div>

                                    {result.payouts && result.payouts.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gs-muted mb-2 uppercase tracking-wide">Financial Ledger</p>
                                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                                {result.payouts.map((p, i) => (
                                                    <div key={i} className="flex justify-between items-center p-2 bg-white border border-gs-border rounded text-xs">
                                                        <span className="font-medium">{p.worker}</span>
                                                        <span className="text-green-600 font-semibold flex items-center gap-1">
                                                            ₹{p.amount} <CheckCircle size={10} />
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
