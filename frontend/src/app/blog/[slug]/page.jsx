"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { PostDetail } from '@/components/Blog/BlogComponents';

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export default function BlogPostDetail() {
    const { slug } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        
        axios.get(`${API}/blog/posts/${slug}`)
            .then(res => setPost(res.data))
            .catch(() => router.push('/blog'))
            .finally(() => setLoading(false));
    }, [slug, router]);

    if (loading) return (
        <div className="min-h-screen bg-gs-cream flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gs-navy border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gs-cream">
            <Navbar />
            <div className="pt-20 pb-12">
                {post && <PostDetail post={post} onBack={() => router.push('/blog')} />}
            </div>
            <Footer />
        </div>
    );
}
