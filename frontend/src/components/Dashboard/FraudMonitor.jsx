import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:8000/api';

export default function FraudMonitor() {
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                const res = await axios.get(`${API}/admin/fraud-flags`, { withCredentials: true });
                setFlags(res.data);
            } catch (err) {
                console.error("Failed to fetch fraud flags", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlags();
    }, []);

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="bg-white border border-gs-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-serif text-gs-navy flex items-center gap-2">
                            <ShieldAlert className="text-red-500" /> Adversarial Defense Monitor
                        </h2>
                        <p className="text-sm text-gs-muted mt-1 max-w-2xl">
                            Real-time monitoring of flagged claims. The defense engine prevents GPS spoofing and coordinated fraud rings by analyzing density, frequency, and genuineness signals before generating payouts.
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-100 text-red-700 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2">
                        <div className="live-dot-red w-2 h-2" />
                        {flags.length} Flagged Claims
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Cluster Signal', desc: 'Sibling density check', icon: Users },
                        { label: 'Frequency Check', desc: 'Rate limiting', icon: Clock },
                        { label: 'Genuineness Score', desc: 'Trust metrics', icon: ShieldCheck },
                        { label: 'Duplicate Device', desc: 'Hardware fingerpt', icon: Smartphone }
                    ].map((feature, i) => (
                        <div key={i} className="p-3 border border-gs-border rounded bg-gray-50 flex items-start gap-3">
                            <feature.icon size={16} className="text-gs-muted mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-gs-navy">{feature.label}</p>
                                <p className="text-[10px] text-gs-muted">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-gs-navy border-t-transparent rounded-full animate-spin" /></div>
                ) : flags.length === 0 ? (
                    <div className="text-center p-12 bg-green-50 rounded-lg border border-green-100">
                        <ShieldCheck size={48} className="mx-auto text-green-500 mb-3" />
                        <h3 className="font-medium text-green-800">No Fraud Detected</h3>
                        <p className="text-sm text-green-700/80 mt-1">All recent claims passed the integrity checks.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-red-50/50 text-gs-navy">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-tl">Worker (Zone)</th>
                                    <th className="px-4 py-3 font-medium">Trigger Event</th>
                                    <th className="px-4 py-3 font-medium">Risk Score</th>
                                    <th className="px-4 py-3 font-medium">Flag Details</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right rounded-tr">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flags.map(flag => (
                                    <tr key={flag.id} className="border-b border-gs-border hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <p className="font-medium">{flag.worker_name}</p>
                                            <p className="text-xs text-gs-muted">Pincode: {flag.zone}</p>
                                        </td>
                                        <td className="px-4 py-4 capitalize">{flag.trigger_type}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${flag.fraud_score > 70 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                                        style={{ width: `${Math.min(100, flag.fraud_score)}%` }} 
                                                    />
                                                </div>
                                                <span className={`text-xs font-bold ${flag.fraud_score > 70 ? 'text-red-600' : 'text-yellow-600'}`}>
                                                    {flag.fraud_score}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs font-mono text-gs-muted whitespace-pre-wrap">
                                            {Object.entries(flag.details).map(([k,v]) => `${k}: ${v}`).join('\n')}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="badge-triggered">{flag.fraud_status}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button className="text-xs font-medium text-blue-600 hover:underline">Review manual</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Icons not imported above
function Users(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function Clock(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function Smartphone(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>;
}
