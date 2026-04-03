"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Send, ArrowRight, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gs-cream" data-testid="contact-page">
            <Navbar />

            <div className="pt-20">
                {/* Header */}
                <div className="border-b border-gs-border bg-white px-6 lg:px-10 py-12">
                    <div className="max-w-7xl mx-auto">
                        <p className="label-tag mb-3">GET IN TOUCH</p>
                        <h1 className="font-serif text-5xl text-gs-navy leading-none">
                            How can we <br /> <em>help you?</em>
                        </h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-4 space-y-10">
                            <div>
                                <h3 className="text-sm font-semibold text-gs-navy uppercase tracking-wider mb-5">Contact Details</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-md bg-gs-navy/5 flex items-center justify-center flex-shrink-0 text-gs-navy">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gs-muted mb-1">Email us at</p>
                                            <p className="text-sm font-medium text-gs-navy">support@gigshield.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-md bg-gs-navy/5 flex items-center justify-center flex-shrink-0 text-gs-navy">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gs-muted mb-1">Call us at</p>
                                            <p className="text-sm font-medium text-gs-navy">+91 80 4567 8901</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-md bg-gs-navy/5 flex items-center justify-center flex-shrink-0 text-gs-navy">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gs-muted mb-1">Visit our office</p>
                                            <p className="text-sm font-medium text-gs-navy">
                                                GigShield National HQ,<br />
                                                402, Highline Towers, Phase 1,<br />
                                                Hinjewadi, Pune, MH 411057
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gs-navy rounded-md text-white">
                                <p className="label-tag text-white/40 mb-3">FLEET OPERATORS</p>
                                <h4 className="text-lg font-serif mb-3">Partner with GigShield</h4>
                                <p className="text-sm text-white/60 mb-6 leading-relaxed">
                                    Interested in protecting your entire fleet? We offer custom triggers and white-label solutions for scale.
                                </p>
                                <Link href="/signup" className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                    Talk to Sales <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-8">
                            <div className="bg-white border border-gs-border rounded-md p-8 lg:p-10">
                                {submitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-gs-status-green-bg text-gs-status-green rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Send size={32} />
                                        </div>
                                        <h2 className="font-serif text-3xl text-gs-navy mb-3">Message Sent!</h2>
                                        <p className="text-gs-muted text-sm mb-8">
                                            Thank you for reaching out. A member of our team will get back to you within 24 hours.
                                        </p>
                                        <button 
                                            onClick={() => setSubmitted(false)}
                                            className="btn-secondary"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="form-label">Your Name</label>
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    placeholder="Ramesh Krishnamurthy"
                                                    required
                                                    value={form.name}
                                                    onChange={e => setForm({...form, name: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    className="form-input" 
                                                    placeholder="ramesh@example.com"
                                                    required
                                                    value={form.email}
                                                    onChange={e => setForm({...form, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Subject</label>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                placeholder="Question about coverage"
                                                required
                                                value={form.subject}
                                                onChange={e => setForm({...form, subject: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Message</label>
                                            <textarea 
                                                className="form-input min-h-[150px] py-3" 
                                                placeholder="Tell us more about how we can help..."
                                                required
                                                value={form.message}
                                                onChange={e => setForm({...form, message: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn-primary w-full justify-center py-3 text-base"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                            {!loading && <Send size={16} className="ml-2" />}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
