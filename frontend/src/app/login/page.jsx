"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function formatError(detail) {
    if (!detail) return 'Something went wrong.';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
    return String(detail);
}

export default function LoginPage() {
    const { login, user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) router.push('/dashboard', { replace: true });
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            router.push('/dashboard');
        } catch (err) {
            setError(formatError(err.response?.data?.detail) || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" data-testid="login-page">
    {/* Left: Brand panel */}
    <div className="hidden lg:flex w-[45%] bg-gs-navy flex-col justify-between p-12 relative overflow-hidden">
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
            <p className="label-tag text-white/35 mb-5">PARAMETRIC PROTECTION</p>
                <h2 className="font-serif text-4xl text-white leading-tight mb-6">
            Income protection <br />
        <em>built to activate itself.</em>
          </h2>
        <div className="flex flex-col gap-3">
    {
        ['Average payout in 3.4 minutes', 'No claim forms. No adjusters.', '47,200+ workers protected'].map(item => (
            <div key={item} className="flex items-center gap-3">
        <CheckCircle size={14} className="text-white/50 flex-shrink-0" />
        <span className="text-sm text-white/60">{item}</span>
              </div>
            ))
    }
          </div>
        <div className="mt-10 p-4 border border-white/10 rounded-md bg-white/5">
            <div className="label-tag text-white/35 mb-2">LAST AUTO-PAYOUT</div>
                <div className="text-white font-semibold text-lg">₹2,400 dispatched</div>
                    <div className="text-white/45 text-xs mt-1">Ramesh K. · Rain trigger · 3m 12s</div>
          </div>
        </div>
        <div className="relative">
            <p className="text-xs text-white/25">
            Protected by 256-bit encryption · IRDAI Licensed
          </p>
        </div>
      </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16 bg-gs-cream">
            <div className="w-full max-w-[380px]">
                <div className="lg:hidden mb-8">
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-7 h-7 bg-gs-navy rounded-md flex items-center justify-center">
                            <Shield size={14} color="#F8F9FA" strokeWidth={2} />
              </div>
        <span className="font-sans font-semibold text-[15px] text-gs-navy tracking-tight">GigShield</span>
            </Link>
          </div>

        <p className="label-tag mb-3">WELCOME BACK</p>
            <h1 className="font-serif text-3xl text-gs-navy mb-1">Sign in</h1>
                <p className="text-sm text-gs-muted mb-8">to access your dashboard and coverage status.</p>

    {
        error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" data-testid="login-error">
        { error }
            </div>
          )
    }

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
        <label className="form-label">Email address</label>
            <input
    type="email"
    className="form-input"
    value={ form.email }
    onChange={ e => setForm({ ...form, email: e.target.value })
}
placeholder="you@example.com"
required
data-testid="login-email"
    />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0">Password</label>
                <button type="button" className="text-xs text-gs-muted hover:text-gs-navy transition-colors">Forgot password?</button>
              </div>
    <div className="relative">
        <input
type={ showPw? 'text': 'password' }
className="form-input pr-10"
value={ form.password }
onChange={ e => setForm({ ...form, password: e.target.value })}
placeholder="Enter your password"
required
data-testid="login-password"
    />
    <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gs-muted hover:text-gs-navy"
        onClick={() => setShowPw(!showPw)}
                >
    { showPw?<EyeOff size={ 15 } /> : <Eye size={15} />}
                </button>
              </div>
            </div>

    <button
        type="submit"
        className="btn-primary justify-center mt-1 py-2.5"
        disabled={ loading }
        data-testid="login-submit"
    >
{
    loading?(
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Signing in...
                </span>
              ) : (
    <span className="flex items-center gap-2">Sign in <ArrowRight size={14} /></span>
              )}
            </button>
          </form>

    <p className="mt-7 text-sm text-gs-muted text-center">
            Don't have an account?{' '}
    <Link href="/signup" className="text-gs-navy font-medium hover:underline">Get protected</Link>
          </p>

    <div className="mt-6 pt-6 border-t border-gs-border">
        <p className="text-xs text-gs-muted text-center">
Demo: <strong>admin@gigshield.com</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
