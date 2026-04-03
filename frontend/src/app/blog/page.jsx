"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { PostCard, CategoryBadge } from '@/components/Blog/BlogComponents';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export default function BlogListing() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        axios.get(`${API}/blog/posts`)
            .then(res => setPosts(res.data))
            .catch(() => {
                // Fallback blog data when backend is unavailable
                setPosts([
                    { slug: 'ramesh-story-rain-risk-payouts', title: 'How Ramesh Got Paid ₹700 in 3 Minutes — Without Filing a Claim', excerpt: 'When heavy rains hit Pune, Ramesh\'s income usually drops to zero. GigShield\'s parametric triggers changed that overnight.', category: 'Field Stories', author: 'GigShield Team', author_role: 'Product', date: 'Mar 18, 2026', read_time: '5 min read', featured: true, image: 'https://images.pexels.com/photos/7363096/pexels-photo-7363096.jpeg?auto=compress&cs=tinysrgb&w=800' },
                    { slug: 'what-is-parametric-insurance', title: 'What Is Parametric Insurance? A Simple Guide for Gig Workers', excerpt: 'Traditional insurance requires proof. Parametric insurance requires only a threshold.', category: 'Education', author: 'Dr. Meera Sharma', author_role: 'Head of Risk', date: 'Mar 12, 2026', read_time: '7 min read', featured: false, image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800' },
                    { slug: 'monsoon-2026-gig-economy-forecast', title: 'Monsoon 2026: What Gig Workers Need to Know', excerpt: 'IMD predicts above-normal rainfall this monsoon. Here\'s how GigShield is preparing.', category: 'Industry', author: 'Vikram Patel', author_role: 'Data Science Lead', date: 'Mar 5, 2026', read_time: '6 min read', featured: false, image: 'https://images.pexels.com/photos/1530423/pexels-photo-1530423.jpeg?auto=compress&cs=tinysrgb&w=800' },
                    { slug: 'aqi-crisis-delhi-gig-workers', title: 'Delhi\'s AQI Crisis: The Hidden Toll on Delivery Workers', excerpt: 'When AQI crosses 500, orders drop 60%. But the workers who need income most are breathing the worst air.', category: 'Industry', author: 'Priya Nair', author_role: 'Research Analyst', date: 'Feb 28, 2026', read_time: '8 min read', featured: false, image: 'https://images.pexels.com/photos/929385/pexels-photo-929385.jpeg?auto=compress&cs=tinysrgb&w=800' },
                    { slug: 'zone-risk-scoring-explained', title: 'How GigShield\'s Zone Risk Score Works — A Technical Deep Dive', excerpt: 'Every pincode gets a risk score. Here\'s the math behind hyper-local precision.', category: 'Technology', author: 'Arjun Mehta', author_role: 'ML Engineering Lead', date: 'Feb 20, 2026', read_time: '10 min read', featured: false, image: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800' },
                    { slug: 'fraud-prevention-cluster-validation', title: 'Catching GPS Spoofers: Inside GigShield\'s Fraud Detection Engine', excerpt: '500 fake workers tried to game a competing platform. Here\'s why that can\'t happen on GigShield.', category: 'Technology', author: 'Security Team', author_role: 'GigShield InfoSec', date: 'Feb 15, 2026', read_time: '8 min read', featured: false, image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800' },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...new Set(posts.map(p => p.category))];
    const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);
    const featured = posts.find(p => p.featured);

    if (loading) return (
        <div className="min-h-screen bg-gs-cream flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gs-navy border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gs-cream" data-testid="blog-page">
            <Navbar />

            <div className="pt-20">
                {/* Header */}
                <div className="border-b border-gs-border bg-white px-6 lg:px-10 py-12">
                    <div className="max-w-7xl mx-auto">
                        <p className="label-tag mb-3">GIGSHIELD BLOG</p>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                            <h1 className="font-serif text-5xl text-gs-navy leading-none">
                                Thinking about <br /> <em>gig work & risk.</em>
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        data-testid={`category-filter-${cat.toLowerCase()}`}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${activeCategory === cat
                                            ? 'bg-gs-navy text-white border-gs-navy'
                                            : 'bg-white text-gs-muted border-gs-border hover:border-gs-slate hover:text-gs-navy'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
                    {/* Featured post */}
                    {featured && activeCategory === 'All' && (
                        <div className="mb-12">
                            <div className="label-tag mb-4">FEATURED</div>
                            <Link href={`/blog/${featured.slug}`} className="no-underline group block" data-testid="featured-post">
                                <div className="grid grid-cols-1 md:grid-cols-2 border border-gs-border rounded-md overflow-hidden bg-white hover:border-gs-slate transition-colors">
                                    <div className="overflow-hidden">
                                        <img
                                            src={featured.image}
                                            alt={featured.title}
                                            className="w-full h-full object-cover min-h-[280px] group-hover:scale-[1.02] transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <CategoryBadge category={featured.category} />
                                                <span className="text-xs text-gs-muted flex items-center gap-1"><Clock size={10} /> {featured.read_time}</span>
                                            </div>
                                            <h2 className="font-serif text-3xl text-gs-navy leading-tight mb-3 group-hover:text-gs-slate transition-colors">
                                                {featured.title}
                                            </h2>
                                            <p className="text-sm text-gs-muted leading-relaxed">{featured.excerpt}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gs-border">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-gs-navy flex items-center justify-center">
                                                    <User size={12} color="white" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-gs-navy">{featured.author}</div>
                                                    <div className="text-[10px] text-gs-muted">{featured.author_role}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gs-navy font-medium flex items-center gap-1.5 group-hover:gap-3 transition-all">
                                                Read article <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Post grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.filter(p => !p.featured || activeCategory !== 'All').map(post => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gs-muted text-sm">
                            No posts in this category yet.
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
