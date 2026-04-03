"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { ArrowRight, CloudRain, Zap, CheckCircle, ChevronRight, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ── Live Widget (Hero right panel) ── */
const LiveWidget = () => {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick(v => v + 1), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="w-full max-w-[320px] bg-gs-navy-light border border-white/10 rounded-md overflow-hidden" data-testid="hero-live-widget">
    {/* Header */}
    <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
        <span className="label-tag text-white/40">GIG VOLATILITY INDEX</span>
            <div className="flex items-center gap-1.5">
                <div className="live-dot" />
                    <span className="text-[10px] text-white/40 font-medium">LIVE</span>
        </div>
      </div>

    {/* Main number */}
    <div className="px-5 py-5">
        <div className="text-[52px] font-sans font-semibold text-white leading-none tracking-tight">
63.4
        </div>
    <div className="flex items-center gap-2 mt-2">
        <span className="badge-warning">ELEVATED</span>
            <span className="text-xs text-white/40">↑ +2.1 from yesterday</span>
        </div>
      </div>

    {/* Divider */}
    <div className="border-t border-white/10" />

{/* Trigger status */}
<div className="px-5 py-4">
    <div className="label-tag text-white/35 mb-3">PARAMETRIC TRIGGERS</div>
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="live-dot-red" />
                        <span className="text-sm text-white/80">Rain · 47.2mm</span>
            </div>
    <span className="text-[10px] bg-red-900/40 text-red-300 px-2 py-0.5 rounded font-medium uppercase tracking-wide">Triggered</span>
          </div>
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="live-dot-yellow" />
                <span className="text-sm text-white/60">AQI · 156</span>
            </div>
    <span className="text-[10px] bg-yellow-900/40 text-yellow-300 px-2 py-0.5 rounded font-medium uppercase tracking-wide">Warning</span>
          </div>
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="live-dot" />
                <span className="text-sm text-white/50">Heat · 31°C</span>
            </div>
    <span className="text-[10px] bg-green-900/40 text-green-300 px-2 py-0.5 rounded font-medium uppercase tracking-wide">Normal</span>
          </div>
        </div>
      </div>

    {/* Divider */}
    <div className="border-t border-white/10" />

{/* Last payout */}
<div className="px-5 py-4">
    <div className="label-tag text-white/35 mb-2.5">LAST AUTO-PAYOUT</div>
        <div className="flex items-center justify-between">
            <div>
            <div className="text-sm text-white/90 font-medium">Ramesh K.</div>
                <div className="text-xs text-white/40 mt-0.5">Rain trigger · Bengaluru North</div>
          </div>
    <div className="text-right">
        <div className="text-base font-semibold text-white">₹2,400</div>
                                <div className="text-[10px] text-white/35 mt-0.5">3m 12s ago · Pune (Kothrud)</div>
          </div>
        </div>
      </div>

    {/* Footer line */}
    <div className="px-5 py-2.5 bg-white/[0.03] border-t border-white/10">
        <span className="text-[10px] text-white/25">Pan-India · Live Operations · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>
    </div>
  );
};

/* ── Stat block ── */
const Stat = ({ value, label }) => (
  <div>
    <div className="font-sans text-2xl font-semibold text-gs-navy tracking-tight">{value}</div>
    <div className="text-xs text-gs-muted mt-0.5">{label}</div>
  </div>
);

/* ── Pricing card ── */
const PricingCard = ({ name, price, period, desc, features, cta, highlighted }) => (
  <div
    className={`flex flex-col border rounded-md p-6 ${highlighted ? 'bg-gs-navy text-white border-gs-navy' : 'bg-white border-gs-border'}`}
    data-testid={`pricing-card-${name.toLowerCase()}`}
  >
    <div className="label-tag mb-3" style={{ color: highlighted ? 'rgba(248,249,250,0.4)' : '#525252' }}>{name}</div>
    <div className="flex items-end gap-1.5 mb-1">
    <span className={`font-sans text-3xl font-semibold tracking-tight ${highlighted ? 'text-white' : 'text-gs-navy'}`}> { price }</span>
        { period && <span className={`text-sm mb-1 ${highlighted ? 'text-white/50' : 'text-gs-muted'}`}>{period}</span>}
    </div>
    <p className={`text-sm mb-6 leading-relaxed ${highlighted ? 'text-white/60' : 'text-gs-muted'}`}>{desc}</p>
    <div className="flex flex-col gap-2.5 flex-1 mb-7">
{
    features.map(f => (
        <div key={f} className="flex items-start gap-2.5">
    <CheckCircle size={13} className={`mt-0.5 flex-shrink-0 ${highlighted ? 'text-white/50' : 'text-gs-navy'}`} />
        <span className={`text-sm ${highlighted ? 'text-white/75' : 'text-gs-muted'}`}> { f }</span>
        </div>
      ))}
    </div>
    <Link
        href="/signup"
className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${highlighted
    ? 'bg-white text-gs-navy hover:bg-gs-cream'
    : 'bg-gs-navy text-white hover:bg-gs-slate'
    }`}
    >
    { cta } <ArrowRight size={13} />
    </Link>
  </div>
);

export default function Home() {
    return (
        <div className="min-h-screen" data-testid="landing-page">
            <Navbar />

            {/* ── HERO ── */}
            <section className="min-h-screen grid grid-cols-1 lg:grid-cols-12" data-testid="hero-section">
    {/* Left */}
    <div className="lg:col-span-7 flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-20 pt-32 pb-16 lg:pt-32">
        <div className="max-w-xl">
            <p className="label-tag mb-5 text-gs-muted font-semibold tracking-widest" data-testid="hero-label">PARAMETRIC INSURANCE · GIG WORKERS · INDIA</p>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-gs-navy leading-none mb-6" data-testid="hero-headline">
              Income doesn't stop<br />
        <em> when the weather does.</em>
            </h1>
        <p className="text-base text-gs-muted leading-relaxed mb-9 max-w-[420px]">
              Built for India's 15 million+ gig workers on Zepto, Blinkit, and Zomato.
              When rain, AQI, or curfews trigger in your zone, your payout arrives automatically — in under 4 minutes.
            </p>
        <div className="flex flex-wrap items-center gap-3 mb-12">
            <Link href="/signup" className="btn-primary" data-testid="hero-cta-primary">
                Get protected <ChevronRight size={14} />
              </Link>
        <Link href="/contact" className="btn-secondary" data-testid="hero-cta-secondary">
                Request a demo
              </Link>
            </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 pt-8 border-t border-gs-border">
            <Stat value="47,200+" label="workers protected" />
                <div className="w-px bg-gs-border" />
                    <Stat value="₹1.2Cr+" label="paid out to date" />
                        <div className="w-px bg-gs-border" />
                            <Stat value="3.4 min" label="avg payout time" />
            </div>
          </div>
        </div>

        {/* Right: dark panel */}
        <div className="lg:col-span-5 bg-gs-navy flex items-center justify-center px-8 py-16 lg:py-0 min-h-[400px] lg:min-h-0">
            <LiveWidget />
        </div>
      </section>

        {/* ── TRUST BAND ── */}
        <section className="bg-white border-y border-gs-border px-6 lg:px-10 py-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-6">
                <span className="label-tag whitespace-nowrap flex-shrink-0">TRUSTED BY</span>
                    <div className="h-px bg-gs-border flex-shrink-0 hidden sm:block w-5" />
                        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
    {
        ['Zepto Partners', 'Blinkit Delivery', 'Zomato Fleet', 'Swiggy Valets', 'Dunzo Operators'].map(name => (
            <span key={name} className="text-sm font-medium text-[#B0B8C4] tracking-wide">{name}</span>
        ))
    }
          </div>
        <div className="flex-1" />
            <div className="flex items-center gap-2 bg-gs-status-green-bg text-gs-status-green px-3 py-1.5 rounded-md border border-green-100 flex-shrink-0">
                <div className="live-dot" style={{ background: '#16A34A', width: 6, height: 6 }} />
                    <span className="text-xs font-medium">All systems live</span>
          </div>
        </div>
      </section>

        {/* ── PRODUCT SYSTEM ── */}
        <section id="product" className="py-24 px-6 lg:px-10 bg-gs-cream" data-testid="product-section">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    <div className="lg:col-span-5">
                        <p className="label-tag mb-4">THE SYSTEM</p>
                            <h2 className="font-serif text-4xl lg:text-5xl text-gs-navy leading-none">
    Trigger.Evaluate.<br /> <em>Release.</em>
              </h2>
            </div>
        <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-base text-gs-muted leading-relaxed">
                Traditional insurance requires proof. Parametric insurance requires only a threshold.
                Our model runs continuously — no human in the loop, no delay, no dispute.
              </p>
            </div>
          </div>

        {/* Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
    {
        [
            {
                step: '01',
                icon: <CloudRain size={18} />,
                title: 'Monitor',
                tag: 'WEATHER EVENT DETECTED',
                dataLine: '47.2mm rainfall · Live Station Data',
                sub: 'Real-time data from 500+ certified weather stations, IMD feeds, and satellite sources across India. Updated every 15 minutes.',
                detail: '500+ data sources · 15 min refresh',
                accent: '#2563EB'
            },
            {
                step: '02',
                icon: <AlertTriangle size={18} />,
                title: 'Evaluate',
                tag: 'THRESHOLD CROSSED',
                dataLine: 'Threshold: 25mm/day · Confidence: 99.1%',
                sub: 'Our parametric model compares real-time readings against your coverage thresholds. No claims adjuster. No subjective assessment.',
                detail: 'Model v3.2 · 99.1% confidence',
                accent: '#CA8A04'
            },
            {
                step: '03',
                icon: <Zap size={18} />,
                title: 'Release',
                tag: 'PAYOUT DISPATCHED',
                dataLine: '₹700 → Ramesh K. · 3m 12s',
                sub: 'Payout instructions sent to UPI/IMPS rails the moment the trigger is confirmed. Weekly coverage ensures you stay liquid every Sunday.',
                detail: 'UPI / IMPS · avg 3.4 min',
                accent: '#16A34A'
            }
        ].map((step, i) => (
              <div
                key={step.step}
                className={`border-t border-r border-b border-gs-border p-8 bg-white relative ${i === 0 ? 'border-l' : ''}`}
                data-testid={`product-step-${i + 1}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center border border-gs-border" style={{ color: step.accent }}>
                      {step.icon}
                    </div>
                    <span className="font-sans text-xs font-medium text-gs-muted">{step.step}</span>
                  </div>
            <span className="text-[9px] font-medium tracking-wider text-gs-muted/60 uppercase border border-gs-border px-2 py-0.5 rounded">{step.tag}</span>
                </div>
            <h3 className="font-serif text-2xl text-gs-navy mb-2">{step.title}</h3>
        <div className="font-mono text-xs px-3 py-2 rounded bg-gs-cream border border-gs-border mb-4 text-gs-slate">
                   { step.dataLine }
                </div>
            <p className="text-sm text-gs-muted leading-relaxed mb-4">{step.sub}</p>
        <div className="text-xs text-gs-muted/60 font-medium border-t border-gs-border pt-3">{step.detail}</div>
              </div>
            ))
    }
          </div>
        </div>
      </section>

            {/* ── DASHBOARD PREVIEW ── */}
            <section className="py-24 px-6 lg:px-10 bg-white border-y border-gs-border" data-testid="dashboard-preview-section">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
                        <div className="lg:col-span-4">
                            <p className="label-tag mb-4">THE PLATFORM</p>
                                <h2 className="font-serif text-4xl lg:text-5xl text-gs-navy leading-none mb-4">
                    Built for operators <br /> who need <br /> <em>full visibility.</em>
                  </h2>
            <p className="text-sm text-gs-muted leading-relaxed">
        Real-time risk metrics, trigger status, and payout history — all in a single dense view.
                  </p>
            <Link href="/signup" className="btn-primary mt-7 inline-flex" data-testid="dashboard-preview-cta">
                    Open dashboard <ArrowRight size={13} />
                  </Link>
                </div>
            <div className="lg:col-span-8">
        {/* Mini dashboard mockup */}
        <div className="border border-gs-border rounded-md overflow-hidden bg-gs-cream">
        {/* Topbar */}
        <div className="bg-white border-b border-gs-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]"/><div className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]"/><div className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]"/></div>
                    <span className="text-xs text-gs-muted font-medium ml-1">GigShield Dashboard · National Operations</span>
                      </div>
            <div className="flex items-center gap-1.5">
                <div className="live-dot" />
                    <span className="text-[10px] text-gs-muted font-medium">Live</span>
                      </div>
                    </div>

            {/* Metric cards */}
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {
            [
                { label: 'VOLATILITY INDEX', value: '63.4', sub: '↑ +2.1 (Delhi)', color: '#CA8A04' },
                { label: 'WEEKLY RISK SCORE', value: '71/100', sub: '↓ -3 (Pune)', color: '#0B1B33' },
                { label: 'ACTIVE TRIGGERS', value: '1', sub: 'Rain · Zone 411038', color: '#DC2626' },
                { label: 'PAYOUTS THIS WEEK', value: '₹2.4k', sub: 'Nationwide', color: '#16A34A' },
            ].map(m => (
                <div key={m.label} className="bg-white border border-gs-border rounded p-3.5">
            <div className="label-tag mb-2">{m.label}</div>
            <div className="font-sans text-xl font-semibold tracking-tight" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-gs-muted mt-0.5">{m.sub}</div>
                        </div>
                      ))
        }
                    </div>

            {/* Mini table */}
            <div className="px-5 pb-5">
                <div className="bg-white border border-gs-border rounded overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gs-border bg-gs-cream">
                        <span className="label-tag">RECENT AUTO-PAYOUTS</span>
                        </div>
        {
            [
                { id: 'PAY-0847', worker: 'Ramesh K.', amount: '₹2,400', trigger: 'Rain > 25mm', time: '3m 12s' },
                { id: 'PAY-0831', worker: 'Priya M.', amount: '₹1,800', trigger: 'AQI > 200', time: '4m 05s' },
                { id: 'PAY-0820', worker: 'Arjun S.', amount: '₹2,400', trigger: 'Rain > 25mm', time: '2m 58s' },
                        ].map(row => (
                    <div key={row.id} className="flex items-center px-4 py-2.5 border-b border-gs-border last:border-0 gap-4">
                <span className="text-[11px] text-gs-muted font-mono w-24 flex-shrink-0">{row.id}</span>
                <span className="text-xs font-medium text-gs-navy flex-1">{row.worker}</span>
                <span className="text-xs text-gs-muted hidden md:block flex-1">{row.trigger}</span>
                <span className="text-xs font-semibold text-gs-navy">{row.amount}</span>
                <span className="badge-paid text-[10px]">{row.time}</span>
                          </div>
                        ))
        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

            {/* ── PRICING ── */}
            <section id="pricing" className="py-24 px-6 lg:px-10 bg-gs-cream" data-testid="pricing-section">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12">
                        <p className="label-tag mb-3">COVERAGE PLANS</p>
                            <h2 className="font-serif text-4xl lg:text-5xl text-gs-navy leading-none">Simple, honest pricing.</h2>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <PricingCard
        name="BASIC"
        price="₹49"
        period="/week"
        desc="For part-time gig workers. Essential parametric protection against rain and AQI events."
        features={
            [
                '2 parametric triggers (Rain + AQI)',
                'Up to ₹500 per event',
                'UPI/IMPS instant payout',
                'Hyper-local zone coverage (1 zone)',
                'Zero-touch automated claims',
                  ]}
        cta="Get Basic Shield"
            />
            <PricingCard
                name="STANDARD"
        price="₹69"
        period="/week"
        desc="For full-time riders on Zepto, Zomato. Higher payout caps and additional triggers."
        features={
            [
                '4 parametric triggers (Rain, AQI, Heat, Outages)',
                'Up to ₹900 per event',
                'Multi-zone coverage (3 zones)',
                'Priority payout queue',
                'Monthly risk report',
                'Phone + chat support',
                  ]}
        cta="Get Standard Protection"
        highlighted
            />
            <PricingCard
                name="PREMIUM"
        price="₹99"
        period="/week"
        desc="Maximum security for high-earning operators. All triggers including curfews and strikes."
        features={
            [
                'Unlimited parametric triggers',
                'Up to ₹1,500 per event',
                'All-city coverage (Pan-India)',
                'API integration for fleets',
                'Dedicated account manager',
                'Custom trigger thresholds',
                  ]}
        cta="Get Premium Shield"
            />
              </div>

            <p className="mt-8 text-center text-sm text-gs-muted">
                All plans include IRDAI-licensed coverage. No lock-in. Cancel anytime.
              </p>
            </div>
          </section>

            {/* ── RAMESH STORY ── */}
            <section className="py-24 px-6 lg:px-10 bg-gs-navy" data-testid="story-section">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Photo */}
        <div className="lg:col-span-4 relative">
            <div className="aspect-[3/4] rounded-md overflow-hidden max-w-[320px] lg:max-w-none">
                <img
        src="https://images.pexels.com/photos/7363096/pexels-photo-7363096.jpeg?auto=compress&cs=tinysrgb&w=600"
        alt="Ramesh, delivery partner"
        className="w-full h-full object-cover"
            />
                </div>
            <div className="absolute -bottom-3 -right-3 lg:right-0 border border-white/15 bg-gs-navy p-4 rounded-md">
                <div className="label-tag text-white/35 mb-1.5">VERIFIED PAYOUT</div>
                    <div className="text-white text-lg font-semibold">₹2,400</div>
                        <div className="text-white/40 text-xs mt-0.5">3 min 12 sec</div>
                </div>
              </div>

            {/* Text */}
            <div className="lg:col-span-7 lg:col-start-6">
                <p className="label-tag text-white/35 mb-6">FIELD STORY · BENGALURU</p>
                    <blockquote className="font-serif text-3xl lg:text-4xl text-white leading-tight mb-7">
        "I didn't file a claim.<br /><em>It just happened."</em>
                </blockquote>
            <p className="text-base text-white/60 leading-relaxed mb-6 max-w-[500px]">
                  Ramesh Krishnamurthy has delivered food in Bengaluru for five years. He knows every flooded underpass,
            every road that turns to river. Before GigShield, a heavy rain day meant ₹800–1,000 less that week.
                  On December 18th, it rained 47.2mm. Ramesh was home. His phone buzzed.
                </p>
            <p className="text-base text-white/60 leading-relaxed mb-9 max-w-[500px]">
        "In my account in 3 minutes. I've dealt with insurance before — there's always a form,
                  always a wait. This was just done."
                </p>
            <div className="flex flex-wrap gap-8">
                <div>
                <div className="text-white text-lg font-semibold font-sans">Ramesh K.</div>
                    <div className="text-white/35 text-xs">Swiggy Delivery Partner, 5 years · Professional Plan</div>
                  </div>
                </div>
            <div className="mt-8">
                <Link href="/blog/ramesh-story-rain-risk-payouts" className="text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors">
                    Read the full story <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

            {/* ── CTA ── */}
            <section className="py-24 px-6 lg:px-10 bg-gs-cream border-b border-gs-border" data-testid="cta-section">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="label-tag mb-5">START TODAY</p>
                        <h2 className="font-serif text-4xl lg:text-5xl text-gs-navy leading-none mb-5">
                Coverage that activates <br />
            <em>before you even notice.</em>
              </h2>
            <p className="text-base text-gs-muted mb-10 max-w-md mx-auto leading-relaxed">
                Join 47,200+ gig workers across Mumbai, Delhi, Bengaluru, Pune, and Hyderabad who get paid automatically when the weather turns.
              </p>
            <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/signup" className="btn-primary px-7 py-3 text-base" data-testid="cta-signup">
                  Get protected now <ChevronRight size={15} />
                </Link>
            <Link href="/contact" className="btn-secondary px-7 py-3 text-base" data-testid="cta-demo">
                  Request a demo
                </Link>
              </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {
            ['No claim forms', 'No lock-in period', 'IRDAI licensed', '3.4 min avg payout'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
            <CheckCircle size={12} className="text-gs-navy" />
            <span className="text-xs text-gs-muted">{item}</span>
                  </div>
                ))
        }
              </div>
            </div>
          </section>

            <Footer />
        </div>
      );
}
