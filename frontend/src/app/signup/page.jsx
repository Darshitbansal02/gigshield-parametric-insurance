"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, ArrowRight, ChevronDown, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function formatError(detail) {
    if (!detail) return 'Something went wrong.';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
    return String(detail);
}

const GIG_TYPES = [
    { value: 'delivery', label: 'Food / Package Delivery' },
    { value: 'ride', label: 'Ride-sharing Driver' },
    { value: 'courier', label: 'Courier / Last-mile Logistics' },
    { value: 'other', label: 'Other Gig Work' },
];

const PLATFORMS = [
    { value: 'zepto', label: 'Zepto' },
    { value: 'blinkit', label: 'Blinkit' },
    { value: 'zomato', label: 'Zomato' },
    { value: 'swiggy', label: 'Swiggy' },
    { value: 'porter', label: 'Porter' },
    { value: 'other', label: 'Other' },
];

export default function SignupPage() {
    const { register, verifyOtp, user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        gig_type: 'delivery',
        platform: 'zepto',
        city: '',
        pincode: ''
    });
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [riskData, setRiskData] = useState(null);

    useEffect(() => {
        if (user) router.push('/dashboard', { replace: true });
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (step === 1) {
            if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
            if (!form.pincode || form.pincode.length < 6) { setError('Please enter a valid 6-digit pincode.'); return; }
            setStep(2);
            return;
        }

        if (step === 2) {
            setLoading(true);
            try {
                const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                const res = await fetch(`${API}/api/auth/risk-preview?pincode=${form.pincode}&city=${form.city || 'Pune'}&plan=${selectedPlan}`);
                if (!res.ok) throw new Error('Could not analyze zone risk.');
                const data = await res.json();
                
                // Transition to Scan Step
                setStep(3);
                
                // Simulate "AI Processing" for demo impact
                setTimeout(() => {
                    setRiskData(data);
                    setLoading(false);
                }, 2000);
            } catch (err) {
                setLoading(false);
                setError(err.message);
            }
            return;
        }

        if (step === 3) {
            setStep(4);
            return;
        }

        if (step === 4) {
            if (otp.length < 6) { setError('Please enter a 6-digit OTP code.'); return; }
            setLoading(true);
            try {
                await verifyOtp(form.email, otp);
                await register(form.name, form.email, form.password, form.gig_type, form.platform, form.pincode, form.city, selectedPlan);
                router.push('/dashboard');
            } catch (err) {
                setError(formatError(err.response?.data?.detail) || err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex" data-testid="signup-page">
            {/* Left: Brand */}
            <div className="hidden lg:flex w-[42%] bg-gs-navy flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 border border-white rounded-full -translate-y-32 translate-x-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 border border-white rounded-full translate-y-48 -translate-x-48" />
                </div>
                <div className="relative">
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                            <Shield size={16} color="#F8F9FA" strokeWidth={2} />
                        </div>
                        <span className="font-sans font-semibold text-[15px] text-white tracking-tight">GigShield</span>
                    </Link>
                </div>

                <div className="relative">
                    <p className="label-tag text-white/35 mb-5">JOIN 47,200+ WORKERS</p>
                    <h2 className="font-serif text-4xl text-white leading-tight mb-6">
                        Your first payout <br />
                        <em>could arrive in minutes.</em>
                    </h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Basic plan', value: '₹49 / week' },
                            { label: 'Average payout', value: '₹2,100' },
                            { label: 'Time to first coverage', value: '< 2 minutes' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/10">
                                <span className="text-sm text-white/50">{item.label}</span>
                                <span className="text-sm text-white font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-white/25 relative">Cancel anytime. No lock-in. No paperwork.</p>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gs-cream overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <div className="lg:hidden mb-8">
                        <Link href="/" className="flex items-center gap-2 no-underline">
                            <div className="w-7 h-7 bg-gs-navy rounded-md flex items-center justify-center">
                                <Shield size={14} color="#F8F9FA" strokeWidth={2} />
                            </div>
                            <span className="font-sans font-semibold text-[15px] text-gs-navy tracking-tight">GigShield</span>
                        </Link>
                    </div>

                    <p className="label-tag mb-3">START COVERAGE</p>
                    <h1 className="font-serif text-3xl text-gs-navy mb-1">Create account</h1>
                    <p className="text-sm text-gs-muted mb-8">Start your parametric coverage in under 2 minutes.</p>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" data-testid="signup-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {step === 1 ? (
                            <>
                                <div>
                                    <label className="form-label">Full name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="Ramesh Krishnamurthy"
                                        required
                                        data-testid="signup-name"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="you@example.com"
                                        required
                                        data-testid="signup-email"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            className="form-input pr-10"
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            placeholder="Min. 6 characters"
                                            required
                                            data-testid="signup-password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gs-muted hover:text-gs-navy"
                                            onClick={() => setShowPw(!showPw)}
                                        >
                                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label">Platform</label>
                                        <div className="relative">
                                            <select
                                                className="form-input appearance-none pr-9 text-sm"
                                                value={form.platform}
                                                onChange={e => setForm({ ...form, platform: e.target.value })}
                                                data-testid="signup-platform"
                                            >
                                                {PLATFORMS.map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gs-muted pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label">Pincode</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.pincode}
                                            onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                            placeholder="400001"
                                            required
                                            data-testid="signup-pincode"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.city}
                                        onChange={e => setForm({ ...form, city: e.target.value })}
                                        placeholder="e.g. Mumbai"
                                        required
                                        data-testid="signup-city"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Type of gig work</label>
                                    <div className="relative">
                                        <select
                                            className="form-input appearance-none pr-9"
                                            value={form.gig_type}
                                            onChange={e => setForm({ ...form, gig_type: e.target.value })}
                                            data-testid="signup-gig-type"
                                        >
                                            {GIG_TYPES.map(gt => (
                                                <option key={gt.value} value={gt.value}>{gt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gs-muted pointer-events-none" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary justify-center mt-1 py-3"
                                    disabled={loading}
                                    data-testid="signup-submit"
                                >
                                    <span className="flex items-center gap-2">Continue to Plan Selection <ArrowRight size={14} /></span>
                                </button>
                            </>
                        ) : (step === 2 || (step === 3 && loading)) ? (
                            <div className="animate-fade-up">
                                <div className="mb-6">
                                    <h3 className="font-serif text-xl text-gs-navy mb-1">Select your coverage</h3>
                                    <p className="text-xs text-gs-muted mb-6">Choose the security level that fits your weekly earnings.</p>
                                    
                                    <div className="space-y-4">
                                        {[
                                            { 
                                                id: 'basic', 
                                                name: 'Basic', 
                                                price: '₹49', 
                                                cap: '₹500', 
                                                hours: '~10', 
                                                triggers: 2, 
                                                desc: 'Essential protection for safer zones.' 
                                            },
                                            { 
                                                id: 'standard', 
                                                name: 'Standard', 
                                                price: '₹69', 
                                                cap: '₹900', 
                                                hours: '~25', 
                                                triggers: 4, 
                                                desc: 'Full coverage for consistent earners.' 
                                            },
                                            { 
                                                id: 'premium', 
                                                name: 'Premium', 
                                                price: '₹99', 
                                                cap: '₹1,500', 
                                                hours: '~40', 
                                                triggers: 7, 
                                                desc: 'Complete security for high-risk zones.' 
                                            }
                                        ].map((plan) => (
                                            <div 
                                                key={plan.id}
                                                onClick={() => setSelectedPlan(plan.id)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    selectedPlan === plan.id 
                                                    ? 'border-gs-navy ring-1 ring-gs-navy bg-white shadow-md' 
                                                    : 'border-gs-border bg-gray-50/50 hover:bg-white hover:border-gs-navy/30'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-serif text-lg text-gs-navy">{plan.name}</h4>
                                                    <p className="font-serif text-lg text-gs-navy">{plan.price}<span className="text-[10px] text-gs-muted font-sans font-normal">/wk</span></p>
                                                </div>
                                                <p className="text-[10px] text-gs-muted mb-3 leading-relaxed">{plan.desc}</p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-gs-border/50">
                                                    <div className="text-[10px]">
                                                        <span className="text-gs-muted">Max Limit:</span> <span className="font-bold text-gs-navy">{plan.cap}</span>
                                                    </div>
                                                    <div className="text-[10px]">
                                                        <span className="text-gs-muted">Hrs Covered:</span> <span className="font-bold text-gs-navy">{plan.hours}</span>
                                                    </div>
                                                    <div className="text-[10px]">
                                                        <span className="text-gs-muted">Triggers:</span> <span className="font-bold text-gs-navy">{plan.triggers}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full justify-center py-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing Zone Risk...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">Analyze Protection & Continue <ArrowRight size={14} /></span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-xs text-gs-muted mt-4 hover:text-gs-navy transition-colors"
                                    disabled={loading}
                                >
                                    Back to Account Info
                                </button>
                            </div>
                        ) : step === 3 ? (
                            <div className="animate-fade-up">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gs-navy rounded-full flex items-center justify-center text-white">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-gs-navy">AI Risk Analysis</h3>
                                            <p className="text-[10px] text-gs-muted uppercase tracking-wider">Calculated for {riskData?.city} ({riskData?.pincode})</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white border border-gs-border rounded-lg p-5 mt-4">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-[10px] text-gs-muted uppercase font-bold tracking-wider">Predictive Risk Score</p>
                                                <p className="text-3xl font-serif text-gs-navy">{riskData?.zone_risk_score}</p>
                                            </div>
                                            <div className="text-right">
                                                 <div className="px-2 py-0.5 bg-gs-navy text-white text-[10px] rounded inline-block uppercase mb-1">Impact</div>
                                                 <p className="text-sm font-medium capitalize">{selectedPlan} Plan</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 border-t border-gs-border pt-4 mt-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gs-muted">Base Weekly Policy</span>
                                                <span className="text-gs-navy">₹{riskData?.base_premium}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gs-muted">Hyper-local Risk Adj.</span>
                                                <span className={riskData?.zone_adjustment >= 0 ? 'text-red-500' : 'text-green-600'}>
                                                    {riskData?.zone_adjustment >= 0 ? '+' : ''}₹{riskData?.zone_adjustment}
                                                </span>
                                            </div>
                                            {riskData?.seasonal_adjustment !== 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gs-muted">Seasonal Volatility</span>
                                                    <span className={riskData?.seasonal_adjustment >= 0 ? 'text-red-500' : 'text-green-600'}>
                                                        {riskData?.seasonal_adjustment >= 0 ? '+' : ''}₹{riskData?.seasonal_adjustment}
                                                    </span>
                                                </div>
                                            )}
                                            {riskData?.safety_discount > 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-green-600 font-medium">✨ Flood Safety Discount</span>
                                                    <span className="text-green-600 font-medium">-₹{riskData?.safety_discount}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-dashed border-gs-border mt-2">
                                                <span className="text-gs-navy">Final Adjusted Premium</span>
                                                <span className="text-gs-navy">₹{riskData?.final_premium}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {riskData?.risk_reasons.map((reason, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[10px] text-gs-muted font-medium bg-gray-50 p-2 rounded border border-gs-border">
                                                <Shield size={12} className="text-gs-navy" /> {reason}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full justify-center py-3"
                                >
                                    Confirm Analysis & Authenticate <ArrowRight size={14} className="ml-1" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full text-center text-xs text-gs-muted mt-4 hover:text-gs-navy transition-colors"
                                >
                                    Change chosen plan
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 border border-gs-border bg-white rounded-md mb-2">
                                    <p className="text-sm font-medium text-gs-navy mb-1">Verify your email</p>
                                    <p className="text-xs text-gs-muted">We're sending a code to <strong>{form.email}</strong>. Using mock code <strong>123456</strong> will work for this demo.</p>
                                </div>
                                
                                <div>
                                    <label className="form-label text-center">Enter 6-digit Verification Code</label>
                                    <input
                                        type="text"
                                        className="form-input text-center text-2xl tracking-[0.3em] font-mono py-4"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="------"
                                        required
                                        data-testid="signup-otp"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    className="btn-primary justify-center mt-2 py-3"
                                    disabled={loading || otp.length < 6}
                                    data-testid="signup-verify-submit"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">Activate Protection <ArrowRight size={14} /></span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep(2); setOtp(''); setError(''); }}
                                    className="w-full text-center text-xs text-gs-muted mt-4 hover:text-gs-navy transition-colors"
                                    disabled={loading}
                                >
                                    Start over from Plan Selection
                                </button>
                            </>
                        )}
                    </form>

                    <p className="mt-6 text-xs text-gs-muted text-center leading-relaxed">
                        By creating an account you agree to our{' '}
                        <span className="text-gs-navy">Terms of Service</span> and{' '}
                        <span className="text-gs-navy">Privacy Policy</span>.
                    </p>

                    <p className="mt-5 text-sm text-gs-muted text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gs-navy font-medium hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
