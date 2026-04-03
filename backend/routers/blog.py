"""
Blog Router — Static blog posts for GigShield.

Endpoints:
  GET /api/blog/posts          - List all posts
  GET /api/blog/posts/{slug}   - Get single post by slug
"""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/blog", tags=["blog"])


# ── Static blog data ──
BLOG_POSTS = [
    {
        "slug": "ramesh-story-rain-risk-payouts",
        "title": "How Ramesh Got Paid ₹700 in 3 Minutes — Without Filing a Claim",
        "excerpt": "When heavy rains hit Pune, Ramesh's income usually drops to zero. GigShield's parametric triggers changed that overnight.",
        "category": "Field Stories",
        "author": "GigShield Team",
        "author_role": "Product",
        "date": "Mar 18, 2026",
        "read_time": "5 min read",
        "featured": True,
        "image": "https://images.pexels.com/photos/7363096/pexels-photo-7363096.jpeg?auto=compress&cs=tinysrgb&w=800",
        "content": """
## The Day It Rained in Kothrud

Ramesh Kumar has delivered groceries for Zepto in Pune for three years. He knows every flooded underpass, every road that turns to river.

Before GigShield, a heavy rain day meant ₹800–1,000 less that week. No orders, no income. The app goes quiet the moment the sky opens up.

### December 18th, 2025

It rained 47.2mm in Ramesh's zone (Kothrud, Pune). GigShield's weather monitoring detected the threshold breach at 2:14 PM.

**Here's what happened next:**

1. **2:14 PM** — Rain sensor crossed 30mm/hr threshold
2. **2:15 PM** — Parametric trigger engine confirmed the event via 2 independent sources
3. **2:16 PM** — Cluster validation: 34 out of 47 workers in Zone 411038 also affected ✅
4. **2:17 PM** — Fraud check passed. Genuineness Score: 89/100
5. **2:17 PM** — Payout calculated: 8 hours × ₹87.5/hr = ₹700
6. **2:18 PM** — UPI transfer initiated to Ramesh's account
7. **2:21 PM** — ₹700 credited. Total time: 3 minutes 12 seconds.

Ramesh's phone buzzed with a WhatsApp notification:

> *"₹700 credited — 8 hours of rain disruption covered. Stay safe, Ramesh."*

### "I didn't file a claim. It just happened."

"In my account in 3 minutes. I've dealt with insurance before — there's always a form, always a wait. This was just... done."

Ramesh's Standard plan costs ₹69/week. That week, he got ₹700 back. Net benefit: ₹631.

**This is what parametric insurance looks like.**

---

*Ramesh is one of 47,200+ gig workers protected by GigShield across India. His story represents the future of income protection for the gig economy.*
""",
    },
    {
        "slug": "what-is-parametric-insurance",
        "title": "What Is Parametric Insurance? A Simple Guide for Gig Workers",
        "excerpt": "Traditional insurance requires proof. Parametric insurance requires only a threshold. Here's why that matters for 15 million gig workers.",
        "category": "Education",
        "author": "Dr. Meera Sharma",
        "author_role": "Head of Risk, GigShield",
        "date": "Mar 12, 2026",
        "read_time": "7 min read",
        "featured": False,
        "image": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "content": """
## The Problem with Traditional Insurance

Traditional insurance works like this: something bad happens → you file a claim → an adjuster investigates → weeks later, you might get paid.

For a gig worker earning ₹700/day, waiting weeks is not an option.

### Enter Parametric Insurance

Parametric insurance flips the script. Instead of reacting to claims, it **reacts to data**.

**How it works:**
- A measurable event occurs (rain > 30mm, AQI > 400)
- The event is verified automatically via trusted data sources
- Payout is calculated and sent immediately
- No claim forms. No adjusters. No disputes.

### Why Weekly Makes Sense

Gig workers earn weekly. They pay weekly expenses. A monthly insurance model requires capital they don't have.

GigShield's ₹49–₹99/week model costs less than two cups of chai per day.

### The Three Pillars

1. **Parametric Triggers**: Automatic event detection
2. **Cluster Validation**: Fraud prevention via zone-level verification
3. **Instant Payouts**: UPI transfers in under 4 minutes

*This isn't just insurance. It's an income safety net.*
""",
    },
    {
        "slug": "monsoon-2026-gig-economy-forecast",
        "title": "Monsoon 2026: What Gig Workers Need to Know",
        "excerpt": "IMD predicts above-normal rainfall this monsoon. Here's how GigShield is preparing to protect over 50,000 workers.",
        "category": "Industry",
        "author": "Vikram Patel",
        "author_role": "Data Science Lead",
        "date": "Mar 5, 2026",
        "read_time": "6 min read",
        "featured": False,
        "image": "https://images.pexels.com/photos/1530423/pexels-photo-1530423.jpeg?auto=compress&cs=tinysrgb&w=800",
        "content": """
## IMD's 2026 Monsoon Forecast

The India Meteorological Department has released its early forecast for Monsoon 2026, predicting **above-normal rainfall** across Western and Central India.

For gig workers, this means one thing: **more disrupted working days**.

### Key Predictions

| Region | Expected Rainfall | Impact |
|--------|------------------|--------|
| Mumbai | 120% of normal | High disruption, 30+ rain days |
| Pune | 115% of normal | Moderate-high, flash flood risk in Kothrud/Sinhagad |
| Delhi | 105% of normal | Moderate, Yamuna flooding possible |
| Bengaluru | 110% of normal | Moderate, waterlogging in Koramangala |

### How GigShield Is Preparing

1. **Zone Risk Scores Updated**: Our ML models now incorporate the IMD forecast data
2. **Premium Adjustments**: Workers in high-risk monsoon zones will see slight premium increases (₹5-15/week) offset by higher coverage caps
3. **Trigger Sensitivity**: Lowering rain thresholds during active monsoon weeks for faster payouts
4. **Server Scaling**: 3x capacity for trigger monitoring during peak monsoon months

### What Workers Should Do

- **Upgrade to Standard or Premium**: If you operate in a flood-prone zone, the extra coverage pays for itself in one rain event
- **Keep your pincode updated**: Accurate zone assignment = accurate payout timing
- **Nothing else**: That's the beauty of parametric insurance. We handle the rest.

*Stay dry. Stay covered. Stay earning.*
""",
    },
    {
        "slug": "aqi-crisis-delhi-gig-workers",
        "title": "Delhi's AQI Crisis: The Hidden Toll on Delivery Workers",
        "excerpt": "When AQI crosses 500, orders drop 60%. But the workers who need income most are the ones breathing the worst air.",
        "category": "Industry",
        "author": "Priya Nair",
        "author_role": "Research Analyst",
        "date": "Feb 28, 2026",
        "read_time": "8 min read",
        "featured": False,
        "image": "https://images.pexels.com/photos/929385/pexels-photo-929385.jpeg?auto=compress&cs=tinysrgb&w=800",
        "content": """
## The Numbers Don't Lie

Delhi's air quality crisis hits gig workers harder than any other demographic.

During the November 2025 AQI crisis:
- AQI exceeded 500 on **18 consecutive days**
- Food delivery orders dropped **45%** across Delhi NCR
- Average daily earnings fell from ₹850 to ₹380
- An estimated **2.3 lakh delivery workers** lost ₹3,000+ in those 18 days

### Why Traditional Insurance Ignores This

No insurance company considers "bad air quality" a covered event. There's no damage. No accident. No injury (until years later).

But the income loss is immediate and devastating.

### GigShield's AQI Trigger

When AQI crosses 400 (Severe) for 6+ consecutive hours:
- All workers in the affected zone automatically receive payouts
- No claim filing needed
- Payout based on estimated lost hours × hourly rate

### Case Study: Rajesh from Anand Vihar

Rajesh delivers for Zomato in East Delhi. His zone (pincode 110092) had an average AQI of 487 during the November crisis.

With GigShield Standard plan (₹69/week):
- **Week 1**: AQI triggered on 4 days → ₹900 payout (cap reached)
- **Week 2**: AQI triggered on 5 days → ₹900 payout (cap reached)
- **Week 3**: AQI subsided → No trigger
- **Total protected**: ₹1,800 for ₹138 in premiums = **13x return**

*Air pollution is invisible. Income loss is not.*
""",
    },
    {
        "slug": "zone-risk-scoring-explained",
        "title": "How GigShield's Zone Risk Score Works — A Technical Deep Dive",
        "excerpt": "Every pincode gets a risk score. Here's the math behind how we price premiums at hyper-local precision.",
        "category": "Technology",
        "author": "Arjun Mehta",
        "author_role": "ML Engineering Lead",
        "date": "Feb 20, 2026",
        "read_time": "10 min read",
        "featured": False,
        "image": "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800",
        "content": """
## The Problem with City-Level Pricing

Traditional insurance prices at the city level. Everyone in Mumbai pays the same.

But a delivery worker in Bandra (waterlogging every monsoon) faces very different risks than one in Powai (relatively dry).

### Introducing Zone Risk Score (ZRS)

GigShield's ZRS is a **pincode-level risk score (1-100)** that determines:
- Which tier is recommended
- How much the premium adjusts within the tier
- How aggressively triggers are monitored

### The Model

```
ZRS = f(historical_weather, aqi_trends, disruption_history, delivery_density)
```

**Input Features:**
1. **Historical Rainfall** (last 24 months, per pincode): Frequency and intensity
2. **AQI Trends**: Seasonal pollution patterns
3. **Past Disruption Events**: Floods, bandhs, strikes in the zone
4. **Delivery Density**: More active workers = more income at aggregate risk

**Model Architecture:**
- Gradient Boosted Trees (XGBoost)
- Trained on 24 months of weather station data + CPCB AQI data
- Re-trained weekly with new incoming data

### Example Scores (Pune)

| Pincode | Area | ZRS | Risk Level |
|---------|------|-----|------------|
| 411038 | Kothrud | 72 | High (flood-prone) |
| 411057 | Hinjewadi | 38 | Low |
| 411001 | Station Area | 55 | Moderate |
| 411041 | Sinhagad Road | 65 | Moderate-High |

### Impact on Premiums

A worker in Kothrud (ZRS: 72) on the Standard plan:
- Base: ₹69/week
- Zone adjustment: +₹4.83 (risk premium)
- Seasonal (monsoon): +₹8.28
- **Final: ₹82/week**

A worker in Hinjewadi (ZRS: 38) on the same plan:
- Base: ₹69/week
- Zone adjustment: -₹2.48 (risk discount)
- Seasonal: +₹8.28
- **Final: ₹75/week**

*Fairer pricing builds trust. Trust builds adoption.*
""",
    },
    {
        "slug": "fraud-prevention-cluster-validation",
        "title": "Catching GPS Spoofers: Inside GigShield's Fraud Detection Engine",
        "excerpt": "500 fake workers tried to game a competing platform. Here's why that can't happen on GigShield.",
        "category": "Technology",
        "author": "Security Team",
        "author_role": "GigShield InfoSec",
        "date": "Feb 15, 2026",
        "read_time": "8 min read",
        "featured": False,
        "image": "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800",
        "content": """
## The Billion-Rupee Question

Parametric insurance is automatic. That's its strength — and its vulnerability.

When payouts happen without human review, bad actors see an opportunity. GPS spoofing apps cost ₹0. A coordinated ring of 500 fake workers could drain lakhs in minutes.

### How GigShield Stops This

We treat fraud as an **adversarial systems problem**, not a location validation checkmark.

#### Layer 1: Cluster Validation

When a rain trigger fires in Zone X:
- System checks: How many workers in Zone X are also idle?
- If 30%+ are affected → legitimate event
- If only 1 out of 50 claims → 🚩 suspicious

#### Layer 2: Temporal Pattern Analysis

Legitimate claims are **spread across hours** as workers naturally stop their shifts.

A fraud ring's claims arrive in a **tight 10-minute cluster** — because someone posted "trigger your claim NOW" in a Telegram group.

We detect this statistical impossibility automatically.

#### Layer 3: Device Fingerprinting

Spoofers often use the same app (Fake GPS, Mock Locations). These apps leave fingerprints:
- Identical GPS drift patterns
- Same device configuration signatures
- Missing sensor data (accelerometer, barometer)

#### Layer 4: Genuineness Score

Every claim gets a composite score:
- Cell tower match: 25%
- Network latency: 20%
- Device sensors: 20%
- Historical pattern: 20%
- Multi-source location: 15%

Score ≥ 70: ✅ Auto-pay. Score 40-69: 🟡 Hold (2hr max). Score < 40: 🔴 Review.

### The Result

**Honest workers never notice.** Their payouts arrive in 3 minutes.

**Spoofers never profit.** The system catches the pattern, not just the individual.

*Security should be invisible to the honest. Impenetrable to the dishonest.*
""",
    },
]


@router.get("/posts")
async def list_posts():
    """Return all blog posts (without full content)."""
    return [
        {k: v for k, v in post.items() if k != "content"}
        for post in BLOG_POSTS
    ]


@router.get("/posts/{slug}")
async def get_post(slug: str):
    """Return a single blog post by slug."""
    for post in BLOG_POSTS:
        if post["slug"] == slug:
            return post
    raise HTTPException(status_code=404, detail="Post not found")
