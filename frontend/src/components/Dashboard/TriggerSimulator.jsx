import React, { useState } from 'react';
import axios from 'axios';
import { Zap, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:8000/api';

export default function TriggerSimulator() {
    const [form, setForm] = useState({
        trigger_type: 'rain',
        value: 45,
        city: 'Pune',
        pincode: '411038'
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

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
            <div className="bg-white border border-gs-border rounded-lg p-6 md:p-8">
                <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gs-border">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-gs-navy">Simulate Parametric Event</h2>
                        <p className="text-sm text-gs-muted mt-1">
                            Manually inject a weather event to test the automated claim pipeline. 
                            This will trigger fraud checks and generate simulated payouts for affected workers in the zone.
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
                                    <option value="rain">Heavy Rain</option>
                                    <option value="heat">Extreme Heat</option>
                                    <option value="aqi">Severe AQI</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Simulated Value</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    value={form.value}
                                    onChange={e => setForm({...form, value: Number(e.target.value)})}
                                />
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
                            className="btn-primary w-full justify-center py-3 text-base"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Injecting Event...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">Trigger Event <ArrowRight size={16} /></span>
                            )}
                        </button>
                    </form>

                    {/* Result Panel */}
                    <div className="flex-1 bg-gray-50 border border-gs-border rounded-md p-5 flex flex-col">
                        <h3 className="text-sm font-medium text-gs-navy mb-4">Simulation Results</h3>
                        
                        {!result && !loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gs-muted p-6 text-center">
                                <Zap size={32} className="opacity-20 mb-3" />
                                <p className="text-sm">Run a simulation to see the automated system process claims.</p>
                            </div>
                        ) : null}

                        {loading && (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                                <div className="w-8 h-8 border-4 border-gs-navy border-t-transparent rounded-full animate-spin text-gs-navy" />
                                <p className="text-sm text-gs-muted animate-pulse">Running fraud engine and processing payouts...</p>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="space-y-4 animate-fade-up">
                                <div className="p-3 bg-green-50 text-green-800 text-sm rounded border border-green-200 mb-4 flex gap-2">
                                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">System Event Detected & Processed</p>
                                        <p className="mt-1 opacity-90">{result.message}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 bg-white border border-gs-border rounded">
                                        <p className="text-xs text-gs-muted mb-1">Affected Workers</p>
                                        <p className="text-lg font-bold text-gs-navy">{result.affected_workers}</p>
                                    </div>
                                    <div className="p-3 bg-white border border-gs-border rounded">
                                        <p className="text-xs text-gs-muted mb-1">Payouts Cleared</p>
                                        <p className="text-lg font-bold text-green-600">{result.payouts_processed}</p>
                                    </div>
                                </div>

                                {result.payouts && result.payouts.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-gs-muted mb-2 mb-2 uppercase tracking-wide">Processed Ledgers</p>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                            {result.payouts.map((p, i) => (
                                                <div key={i} className="flex justify-between items-center p-2 bg-white border border-gs-border rounded text-sm">
                                                    <span className="font-medium">{p.worker}</span>
                                                    <span className="text-green-600 font-semibold gap-2 flex items-center">
                                                        ₹{p.amount}
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
    );
}
