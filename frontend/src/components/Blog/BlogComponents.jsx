"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react';

export const CATEGORY_COLORS = {
    'Education': '#2563EB',
    'Technology': '#7C3AED',
    'Stories': '#CA8A04',
    'Press': '#16A34A',
};

export const CategoryBadge = ({ category }) => (
    <span
        className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
        style={{
            color: CATEGORY_COLORS[category] || '#525252',
            background: (CATEGORY_COLORS[category] || '#525252') + '14',
            border: `1px solid ${(CATEGORY_COLORS[category] || '#525252')}28`
        }}
    >
        {category}
    </span>
);

export const PostCard = ({ post, large }) => (
    <Link
        href={`/blog/${post.slug}`}
        className="no-underline group block"
        data-testid={`post-card-${post.slug}`}
    >
        <div className={`border border-gs-border rounded-md overflow-hidden bg-white hover:border-gs-slate transition-colors ${large ? '' : ''}`}>
            {post.image && (
                <div className={`overflow-hidden ${large ? 'h-52' : 'h-36'}`}>
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                </div>
            )}
            <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                    <CategoryBadge category={post.category} />
                    <span className="text-xs text-gs-muted flex items-center gap-1">
                        <Clock size={10} /> {post.read_time}
                    </span>
                </div>
                <h3 className={`font-serif text-gs-navy group-hover:text-gs-slate transition-colors leading-tight mb-2 ${large ? 'text-2xl' : 'text-lg'}`}>
                    {post.title}
                </h3>
                <p className="text-sm text-gs-muted leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gs-navy/10 flex items-center justify-center">
                            <User size={10} className="text-gs-navy" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gs-navy">{post.author}</div>
                            <div className="text-[10px] text-gs-muted">{post.published_at}</div>
                        </div>
                    </div>
                    <span className="text-xs text-gs-navy font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight size={11} />
                    </span>
                </div>
            </div>
        </div>
    </Link>
);

export const PostDetail = ({ post, onBack }) => (
    <div className="max-w-3xl mx-auto px-6 lg:px-0 py-12" data-testid="blog-post-detail">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gs-muted hover:text-gs-navy transition-colors mb-8">
            <ArrowLeft size={14} /> Back to blog
        </button>

        <div className="flex items-center gap-3 mb-5">
            <CategoryBadge category={post.category} />
            <span className="text-xs text-gs-muted flex items-center gap-1"><Clock size={10} /> {post.read_time}</span>
            <span className="text-xs text-gs-muted">{post.published_at}</span>
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl text-gs-navy leading-none mb-5">{post.title}</h1>

        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gs-border">
            <div className="w-8 h-8 rounded-full bg-gs-navy flex items-center justify-center">
                <User size={13} color="white" />
            </div>
            <div>
                <div className="text-sm font-semibold text-gs-navy">{post.author}</div>
                <div className="text-xs text-gs-muted">{post.author_role}</div>
            </div>
        </div>

        {post.image && (
            <div className="aspect-video rounded-md overflow-hidden mb-10">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
        )}

        <div className="prose prose-sm max-w-none">
            {post.content?.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('"')) {
                    return (
                        <blockquote key={i} className="font-serif text-2xl text-gs-navy border-l-2 border-gs-navy pl-6 my-8 leading-tight italic">
                            {paragraph}
                        </blockquote>
                    );
                }
                if (paragraph.match(/^\d+\./)) {
                    return (
                        <p key={i} className="text-base text-gs-muted leading-relaxed mb-4 pl-4 border-l border-gs-border">
                            {paragraph}
                        </p>
                    );
                }
                return (
                    <p key={i} className="text-base text-gs-muted leading-relaxed mb-5">
                        {paragraph}
                    </p>
                );
            })}
        </div>

        <div className="mt-12 pt-8 border-t border-gs-border">
            <Link href="/signup" className="btn-primary inline-flex">
                Get parametric coverage <ArrowRight size={13} />
            </Link>
        </div>
    </div>
);
