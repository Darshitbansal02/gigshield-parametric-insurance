"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

const col = (title, links) => ({ title, links });

const columns = [
    col('Product', [
        { label: 'How it works', href: '/#product' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'API Docs', href: '#' },
    ]),
    col('Company', [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/blog' },
        { label: 'Careers', href: '#' },
    ]),
    col('Support', [
        { label: 'Contact', href: '/contact' },
        { label: 'Help Center', href: '#' },
        { label: 'Status', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ]),
];

export default function Footer() {
    return (
        <footer className="bg-gs-navy text-gs-cream border-t border-gs-border-dark" data-testid="footer">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
    {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center">
                <Shield size={14} color="#F8F9FA" strokeWidth={2} />
              </div>
              <span className="font-sans font-semibold text-[15px] text-white tracking-tight">GigShield</span>
            </div>
        <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">
              Parametric income protection for India's gig workers. Automated. Instant. Honest.
            </p>
        <div className="mt-5 flex items-center gap-2">
            <span className="live-dot" />
                <span className="text-xs text-white/40 font-medium">All systems operational</span>
            </div>
          </div>

        {/* Columns */ }
    {
        columns.map(col => (
            <div key={col.title}>
              <div className="label-tag text-white/35 mb-4">{col.title}</div>
              <ul className="flex flex-col gap-2.5">
                {
                col.links.map(link => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="text-sm text-white/55 hover:text-white/90 transition-colors no-underline"
                    >
                        {link.label}
                    </Link>
                  </li>
                ))
    }
              </ul>
            </div>
          ))
}
        </div>

    <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="text-xs text-white/35">
            © 2025 GigShield Technologies Pvt.Ltd. · IRDAI Broker License No.IRDA / DB 000 /00
          </p>
    <p className="text-xs text-white/30">
            Parametric insurance is not traditional indemnity insurance. Payouts are triggered by measurable events, not verified losses.
          </p>
        </div>
      </div>
    </footer>
  );
}
