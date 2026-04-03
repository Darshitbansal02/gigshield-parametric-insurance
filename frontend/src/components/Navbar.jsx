"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Shield, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const isLandingPage = pathname === '/';

    return (
        <nav
            data-testid="navbar"
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-sm border-b border-gs-border`}
    >
    <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
{/* Logo */}
<Link href="/" className="flex items-center gap-2 no-underline" data-testid="nav-logo">
    <div className="w-7 h-7 bg-gs-navy rounded-md flex items-center justify-center flex-shrink-0">
        <Shield size={14} color="#F8F9FA" strokeWidth={2} />
          </div>
    <span className="font-sans font-semibold text-[15px] text-gs-navy tracking-tight">GigShield</span>
        </Link>

    {/* Desktop nav */}
    <div className="hidden md:flex items-center gap-7">
        <Link href="/#product" className="nav-link" data-testid="nav-product">Product</Link>
            <Link href="/#pricing" className="nav-link" data-testid="nav-pricing">Pricing</Link>
                <Link href="/blog" className="nav-link" data-testid="nav-blog">Blog</Link>
                    <Link href="/contact" className="nav-link" data-testid="nav-contact">Contact</Link>
        </div>

    {/* Auth buttons */}
    <div className="hidden md:flex items-center gap-2">
{
    user ? (
        <>
            <Link href="/dashboard" className="btn-ghost text-sm" data-testid="nav-dashboard">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary text-sm" data-testid="nav-logout">Log out</button>
            </>
          ) : (
        <>
            <Link href="/login" className="btn-ghost" data-testid="nav-login">Log in</Link>
                <Link href="/signup" className="btn-primary" data-testid="nav-signup">
                Get Protected <ChevronRight size={13} />
              </Link>
            </>
          )
}
        </div>

    {/* Mobile toggle */}
    <button
className="md:hidden p-1.5 rounded text-gs-muted hover:text-gs-navy"
onClick={() => setMobileOpen(!mobileOpen)}
data-testid="nav-mobile-toggle"
    >
    { mobileOpen?<X size={ 20 } /> : <Menu size={20} />}
        </button>
      </div>

    {/* Mobile menu */}
{
    mobileOpen && (
        <div className="md:hidden bg-white border-t border-gs-border px-6 py-5 flex flex-col gap-4" data-testid="mobile-menu">
            <Link href="/#product" className="nav-link text-base" onClick={() => setMobileOpen(false)}>Product</Link>
                <Link href="/#pricing" className="nav-link text-base" onClick={() => setMobileOpen(false)}>Pricing</Link>
                    <Link href="/blog" className="nav-link text-base" onClick={() => setMobileOpen(false)}>Blog</Link>
                        <Link href="/contact" className="nav-link text-base" onClick={() => setMobileOpen(false)}>Contact</Link>
                            <div className="h-px bg-gs-border" />
    {
        user ? (
            <>
                <Link href="/dashboard" className="btn-primary justify-center" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <button onClick={handleLogout} className="btn-secondary text-center">Log out</button>
            </>
          ) : (
            <>
                <Link href="/login" className="btn-secondary text-center" onClick={() => setMobileOpen(false)}>Log in</Link>
                    <Link href="/signup" className="btn-primary justify-center" onClick={() => setMobileOpen(false)}>Get Protected</Link>
            </>
          )
    }
        </div>
      )
}
    </nav>
  );
}
