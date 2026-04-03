import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Activity } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:8000/api';

export default function WorkerTable() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await axios.get(`${API}/admin/workers`, { withCredentials: true });
                setWorkers(res.data);
            } catch (err) {
                console.error("Failed to fetch workers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkers();
    }, []);

    const filtered = workers.filter(w => 
        w.name.toLowerCase().includes(search.toLowerCase()) || 
        w.city.toLowerCase().includes(search.toLowerCase()) ||
        w.pincode.includes(search)
    );

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="bg-white border border-gs-border rounded-lg p-0 overflow-hidden">
                <div className="p-5 border-b border-gs-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-serif text-gs-navy">Worker Registry</h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gs-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search name, city, pincode..." 
                            className="form-input pl-9 text-sm py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-gs-navy border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gs-muted">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Worker Profile</th>
                                    <th className="px-5 py-3 font-medium">Location</th>
                                    <th className="px-5 py-3 font-medium">Plan Tier</th>
                                    <th className="px-5 py-3 font-medium">Zone Risk Score</th>
                                    <th className="px-5 py-3 font-medium text-right">Premium / Wk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gs-muted">No workers found matching "{search}"</td>
                                    </tr>
                                ) : filtered.map(w => (
                                    <tr key={w.id} className="border-b border-gs-border last:border-0 hover:bg-gray-50">
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-gs-navy">{w.name}</p>
                                            <p className="text-xs text-gs-muted">{w.email}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5 text-gs-muted">
                                                <MapPin size={14} />
                                                <span>{w.city} ({w.pincode})</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium uppercase tracking-wider
                                                ${w.plan === 'premium' ? 'bg-purple-100 text-purple-700' : w.plan === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                                            `}>
                                                {w.plan}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Activity size={14} className={w.risk_score > 60 ? 'text-red-500' : 'text-blue-500'} />
                                                <span className={w.risk_score > 60 ? 'text-red-600 font-semibold' : ''}>{w.risk_score}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right font-semibold">
                                            ₹{w.weekly_premium}
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
