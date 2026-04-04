<div align="center">

# 🛡️ GigShield — AI-Powered Parametric Income Insurance for India's Gig Workers

### _Guidewire DEVTrails 2026 — Phase 2: Building & Automation_

**Team:** Zeroes and Ones | **University:** GLA University | **Phase 2 Submission:** April 4, 2026

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Phase](https://img.shields.io/badge/Phase-2%20Automation-blue)]()
[![Status](https://img.shields.io/badge/Status-Deployment%20Ready-success)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20App-green)]()

---

## 🚀 Live Demo & Deployment

**Web Application (Next.js + FastAPI):** [https://gigshield-parametric-insurance--darshitbansal02.replit.app/](https://gigshield-parametric-insurance--darshitbansal02.replit.app/)

> [!IMPORTANT]
> **Demo Credentials (for Judge Review):**
> - **Admin:** `admin@gigshield.com` | Password: `admin123`
> - **Worker:** `ramesh@gigshield.com` | Password: `ramesh123`


</div>

---

## Table of Contents

1. [🚨 Problem Statement](#1--problem-statement)
2. [👤 Persona](#2--persona)
3. [Core Idea](#3-core-idea)
4. [⚙️ Solution Overview](#4--solution-overview)
5. [🧩 System Architecture](#5--system-architecture)
6. [💡 Unique Innovation](#6--unique-innovation)
7. [📊 Parametric Triggers](#7--parametric-triggers)
8. [💰 Weekly Pricing Model](#8--weekly-pricing-model)
9. [🤖 AI / ML Usage](#9--ai--ml-usage)
10. [🛡️ Adversarial Defense & Anti-Spoofing Strategy](#10--adversarial-defense--anti-spoofing-strategy)
11. [MVP Scope](#11-mvp-scope)
12. [⚙️ Tech Stack](#12--tech-stack)
13. [🔄 Application Workflow](#13--application-workflow)
14. [📅 Development Plan](#14--development-plan)
15. [🧠 Business Logic](#15--business-logic)
16. [Video Demos](#16-video-demos)
17. [⚙️ Setup & Installation](#17-setup--installation)

---

## 1. 🚨 Problem Statement

### The Invisible Crisis Hitting Millions Every Week

India has **15+ million active delivery partners** powering the ₹7 lakh crore on-demand economy. They are the backbone of platforms like Zomato, Swiggy, Zepto, and Blinkit.

But here's the harsh reality:

| Stat | Data |
|------|------|
| Avg. daily earnings | ₹600–₹900/day |
| Monthly income | ₹15,000–₹22,000 |
| **Income lost to disruptions** | **20–30% monthly** (₹3,000–₹6,600) |
| Workers with income protection | **< 1%** |
| Days impacted by rain/AQI/curfews per year | **40–60 days** |

**Real-world examples from 2025:**

- **Mumbai monsoons** — Food delivery orders dropped **45%** for 3 weeks; workers earned near-zero on heavy rain days.
- **Delhi AQI crisis (Nov–Jan)** — AQI crossed 500+ for 18 days; many delivery workers couldn't operate outdoors.

> **Bottom line:** Gig workers lose ₹3,000–₹6,600 every month to events completely outside their control — and there is ZERO safety net for them today.

**No insurance company covers "lost income due to rain." We're changing that.**

---

## 2. 👤 Persona

### Meet Ramesh — Quick-Commerce Delivery Partner (Zepto/Blinkit)

We chose **Grocery / Quick-Commerce (Q-Commerce)** as our delivery segment because:

- Q-Commerce operates on **10-minute delivery SLAs** — the most disruption-sensitive segment
- Workers are **hyper-local** (2–4 km radius), making them more exposed to micro-weather events
- Orders dry up instantly the moment conditions worsen — unlike food delivery which has some buffer

| Attribute | Detail |
|-----------|--------|
| **Name** | Ramesh Kumar |
| **Age** | 26 |
| **City** | Pune, Maharashtra |
| **Platform** | Zepto |
| **Work Pattern** | 6 days/week, 10–12 hours/day, two shifts (morning + evening peak) |
| **Weekly Income** | ₹4,200–₹5,400 (avg. ₹700–₹900/day) |
| **Monthly Income** | ~₹18,000–₹22,000 |
| **Vehicle** | Bicycle / two-wheeler |
| **Delivery Radius** | 2–4 km from dark store |
| **Savings** | Minimal (< ₹5,000 buffer) |

### Ramesh's Pain Points

1. **Heavy rain days = ₹0 income.** When it rains heavily, Zepto reduces/halts dispatches. Ramesh sits idle.
2. **AQI spikes = health risk + no orders.** During pollution alerts, fewer customers order and Ramesh can't work safely outdoors.
3. **Sudden local shutdowns.** Bandh announcements, waterlogging in his zone — he loses full-day earnings with no compensation.
4. **No financial cushion.** Missing even 2–3 days/week can push him below his monthly rent obligation.
5. **Existing insurance is irrelevant.** Health/accident policies don't cover "I couldn't work because it rained."

> _"Main kaam karna chahta hoon, lekin baarish hoti hai toh app pe order hi nahi aata. Uska paisa kaun dega?"_
> — Ramesh, reflecting a sentiment shared by millions of delivery partners.

---

## 3. Core Idea

> **GigShield automatically detects disruptions (weather, pollution, curfews) and pays gig workers instantly for lost income — no claims, no paperwork, on a simple ₹49–₹99/week subscription.**

---

## 4. ⚙️ Solution Overview

Here's how GigShield works, end to end:

### Step 1: Quick Onboarding (< 2 minutes)
- Worker signs up via **WhatsApp bot or Web app**
- Enters: Name, phone, platform (Zepto/Blinkit), city, zone/pincode
- Verifies via OTP
- System auto-fetches zone risk profile

### Step 2: AI Risk Calculation
- Our AI engine analyzes the worker's **zone** using:
  - Historical weather data (last 2 years)
  - AQI trends for the area
  - Past disruption events (bandhs, floods)
  - Delivery density of the zone
- Generates a **GigShield Risk Score (1–100)** for the worker's operating zone

### Step 3: Weekly Premium Assignment
- Based on the Risk Score, worker gets a **personalized weekly premium**
- 3 simple tiers: **Basic (₹49) / Standard (₹69) / Premium (₹99)**
- Worker pays weekly — aligned with their payout cycle
- Coverage activates instantly upon payment

### Step 4: Real-Time Monitoring
- GigShield continuously monitors:
  - **Weather APIs** (OpenWeatherMap) — rainfall, temperature, storms
  - **AQI APIs** (AQICN / government CPCB data) — pollution levels
  - **News/Alert feeds** — bandh notices, curfews, zone closures
- Monitoring is **pincode-level** for hyper-local accuracy

### Step 5: Automatic Trigger Detection
- When a parametric threshold is breached (e.g., rainfall > 30mm/hr in worker's zone):
  - Logs event + cross-validates with multiple sources
  - **No claim filing needed** — the system detects it automatically

### Step 6: Instant Auto-Payout
- Payout amount = **lost hours × hourly rate** (calculated from weekly average)
- Money sent via **UPI** directly to worker's account
- Worker gets WhatsApp notification: _"₹350 credited — 5 hours of rain disruption covered"_
- Full transparency: breakdown of calculation shown in app

---

## 5. 🧩 System Architecture

### At a Glance

```
[Worker] → [AI Risk Engine] → [Monitoring] → [Trigger] → [Fraud Check] → [Payout]
```

### (A) Detailed System Flow Diagram

```mermaid
flowchart TD
    subgraph ENTRY["👤 Worker Entry"]
        A["Worker\n(Web App / WhatsApp)"]
    end

    subgraph ONBOARD["📋 Onboarding"]
        B["Onboarding Service\n(OTP + Zone Assignment)"]
    end

    subgraph RISK["🧠 AI Engine"]
        C["Risk Engine\n(Zone Risk Score 1-100)"]
    end

    subgraph POLICY["📄 Policy"]
        D["Policy Manager\n(Weekly Premium + Activation)"]
    end

    subgraph MONITOR["📡 Monitoring Layer (Always-On)"]
        E1["☁️ Weather API"]
        E2["🏭 AQI API"]
        E3["📰 News/Alert Feed"]
        E4["📱 Platform Status"]
    end

    subgraph TRIGGER["⚡ Trigger Engine"]
        F["Trigger Detection\n(Parametric Rules)"]
    end

    subgraph FRAUD["🕵️ Fraud Layer"]
        G["Fraud Detection\n(AI Anomaly + Cluster Validation)"]
    end

    subgraph PAYOUT["💰 Payout"]
        H["Payout Engine\n(UPI / Wallet)"]
    end

    subgraph NOTIFY["🔔 Notification"]
        I["Worker Gets\nInstant Payout + Alert"]
    end

    subgraph DASHBOARD["📊 Analytics Dashboard"]
        J1["Worker View:\nCoverage, Payouts, History"]
        J2["Admin View:\nLoss Ratios, Risk Maps, Fraud Alerts"]
    end

    A --> B --> C --> D
    D --> F
    E1 & E2 & E3 & E4 --> F
    F --> G
    G -->|"✅ Pass"| H --> I
    G -->|"🚩 Flagged"| J2
    H --> J1
    H --> J2

    style ENTRY fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style ONBOARD fill:#5BA85B,stroke:#3D7A3D,color:#fff
    style RISK fill:#E67E22,stroke:#B35F18,color:#fff
    style POLICY fill:#8E44AD,stroke:#6C3483,color:#fff
    style MONITOR fill:#2C3E50,stroke:#1A252F,color:#fff
    style TRIGGER fill:#E74C3C,stroke:#B33A2E,color:#fff
    style FRAUD fill:#C0392B,stroke:#922B21,color:#fff
    style PAYOUT fill:#27AE60,stroke:#1E8449,color:#fff
    style NOTIFY fill:#2ECC71,stroke:#239B56,color:#fff
    style DASHBOARD fill:#34495E,stroke:#1C2833,color:#fff
```

### (B) Component Explanation

| Component | Purpose |
|-----------|---------|
| **Onboarding Service** | Handles worker registration, OTP verification, and zone assignment. |
| **Risk Engine (AI/ML)** | Analyzes historical weather, AQI, and disruption data for the worker's pincode. Outputs a Risk Score (1–100) that determines premium tier. |
| **Policy Manager** | Creates and manages weekly insurance policies. Handles premium collection, coverage activation, and renewal. |
| **Monitoring Layer** | Continuously polls Weather, AQI, News APIs every 15 minutes. Maps events to specific pincodes and zones. |
| **Trigger Detection Engine** | Compares real-time data against predefined parametric thresholds. When a threshold is breached, it initiates the claim automatically. |
| **Fraud Detection (AI)** | Validates claims using location cross-referencing, anomaly detection, and duplicate prevention. Catches spoofed or fake claims. |
| **Payout Engine** | Calculates exact payout based on lost hours and hourly rate. Processes payment via UPI/wallet (sandbox mode for MVP). |
| **Analytics Dashboard** | Dual-view dashboard — workers see their coverage & payouts; admins see loss ratios, risk heatmaps, and predictive analytics. |

---

## 6. 💡 Unique Innovation

### Innovation #1: **GigShield Zone Risk Score (ZRS)**

Most insurance platforms price policies based on broad city-level data. **GigShield goes hyper-local.**

**How it works:**
- Every pincode in a city gets a **Zone Risk Score (1–100)** based on:
  - 📅 Historical rainfall patterns (last 24 months)
  - 🏭 Average AQI readings by season
  - 🚧 Frequency of past disruptions (floods, bandhs)
  - 📦 Delivery density (more deliveries = more income at risk)
- Workers in **high-risk zones pay slightly more** but get **higher coverage**
- Workers in **low-risk zones pay less** — rewarding safer operating areas

**Why it's powerful:**
- A worker in Pune's Kothrud area (flood-prone) gets a different premium than someone in Pune's Hinjewadi (relatively safer)
- This **fairness-first approach** builds trust and reduces adverse selection
- The score updates weekly as new data flows in — truly dynamic pricing

### Innovation #2: **Cluster Validation for Fraud Prevention**

Instead of trusting one data point, GigShield uses **Cluster Validation**:

- When a disruption is detected (e.g., heavy rain in zone X):
  - System checks: **Are multiple workers in the SAME zone also affected?**
  - Cross-references weather data with **actual delivery platform order volume drops** (simulated)
  - If only ONE worker claims disruption but 50 others in the same zone are working normally → 🚩 **Fraud flag**

**Why it matters:**
- Prevents GPS spoofing (claiming you're in a rain zone when you're not)
- Prevents fake weather claims
- Builds a self-reinforcing trust network — honest workers benefit from lower premiums over time
- **This reduces false claims by an estimated 80–90% compared to single-signal systems.**

---

## 7. 📊 Parametric Triggers

These are the automatic disruption events that trigger payouts — **no manual claims needed**.

| # | Disruption Event | Trigger Condition | Data Source | Payout Action |
|---|-----------------|-------------------|-------------|---------------|
| 1 | 🌧️ **Heavy Rainfall** | Rainfall > 30mm/hr in worker's pincode for 2+ consecutive hours | OpenWeatherMap API | Auto-payout for estimated lost hours (₹70–₹120/hr) |
| 2 | 🏭 **Severe Air Pollution** | AQI > 400 (Severe+) sustained for 6+ hours in worker's zone | AQICN / CPCB API | Auto-payout for half-day or full-day lost income |
| 3 | 🚫 **Curfew / Bandh / Strike** | Official curfew/bandh declared affecting worker's operating zone | News API + Manual admin trigger | Full-day payout for all affected workers in zone |
| 4 | 🌡️ **Extreme Heat** | Temperature > 45°C for 4+ consecutive hours | OpenWeatherMap API | Auto-payout for peak-hour lost income |
| 5 | 🌊 **Flood / Waterlogging** | Flood alert issued OR rainfall > 100mm in 24hrs in zone | Weather API + Govt. disaster alerts | Full-day payout + next-day if flooding persists |
| 6 | 📉 **Order Demand Crash** | Orders drop > 60% vs normal baseline in worker's zone | Platform mock API | Partial payout for reduced earning hours |
| 7 | 🔌 **Platform Outage** | No orders dispatched for 30+ minutes + API downtime confirmed | Platform status API | Full payout for downtime duration |

> GigShield goes beyond environmental triggers by including platform-level disruptions like demand crashes and app outages — capturing real income loss scenarios that no other insurance product covers.

### Trigger Validation Rules
- Minimum **2 independent data sources** must confirm the event
- Event must persist for the **minimum duration** specified
- **Cluster check**: At least 30% of active workers in the zone must be affected
- System logs all trigger events with timestamps for audit trail

---

## 8. 💰 Weekly Pricing Model

### Core Formula

```
Weekly Premium = Base Rate + Zone Risk Adjustment + Seasonal Factor
```

Where:
- **Base Rate** = Fixed minimum cost to cover operational overheads
- **Zone Risk Adjustment** = Based on the worker's Zone Risk Score (ZRS)
- **Seasonal Factor** = Higher during monsoon/winter pollution months, lower in clear months

### Pricing Tiers

| Tier | Weekly Premium | Coverage per Week | Best For |
|------|---------------|-------------------|----------|
| 🥉 **Basic** | ₹49/week | Up to ₹500 (covers ~6 lost hours) | Workers in low-risk zones |
| 🥈 **Standard** | ₹69/week | Up to ₹900 (covers ~12 lost hours) | Most workers — balanced coverage |
| 🥇 **Premium** | ₹99/week | Up to ₹1,500 (covers ~20 lost hours) | Workers in high-risk zones (flood-prone, high AQI areas) |

### Example Scenario

**Ramesh (Zepto rider in Pune, Zone Risk Score: 72/100):**

- Ramesh's zone is moderately high-risk (Kothrud, flood-prone during monsoons)
- Current month: July (peak monsoon) → Seasonal Factor = HIGH
- **Recommended tier: Standard (₹69/week)**
- If heavy rain disrupts 8 hours this week:
  - Payout = 8 hours × ₹87.5/hr (his average) = **₹700 auto-credited**
  - Net benefit = ₹700 – ₹69 = **₹631 protected income**

### Why Weekly Works

- Gig workers are paid **weekly** by platforms like Zepto/Blinkit
- ₹49–₹99/week is **< 2% of their weekly income** — very affordable
- No long-term commitment — skip a week anytime, re-activate next week
- Matches the cash-flow psychology of gig workers: _"I earn weekly, I pay weekly"_

---

## 9. 🤖 AI / ML Usage

> **"GigShield uses AI to predict risk, price premiums, and detect fraud — all in a simple, explainable way."**

We integrate AI/ML in three focused, realistic areas:

### 1. 🎯 Risk Prediction (Zone Risk Score)

**What it does:** Predicts how likely a worker's zone will face disruptions in the coming week.

**How:**
- Trained on 2 years of historical weather + AQI + event data per pincode
- Uses **Random Forest / Gradient Boosting** model
- Input features: historical rainfall, AQI trends, seasonal patterns, past disruption frequency
- Output: Risk Score (1–100) per pincode, updated weekly

**Impact:** Workers get fair, personalized premiums based on actual zone risk — not one-size-fits-all pricing.

### 2. 💰 Dynamic Premium Pricing

**What it does:** Adjusts the weekly premium in real-time based on predicted risk for the upcoming week.

**How:**
- Takes the Zone Risk Score + seasonal factor + current weather forecasts
- Uses a **regression model** to calculate optimal premium within the tier range
- Example: During a predicted heavy monsoon week, premiums in flood-prone zones may nudge up by ₹10–₹15; during clear weeks, they might drop by ₹5–₹10

**Impact:** Pricing reflects real risk — keeps the financial model sustainable while remaining fair to workers.

### 3. 🕵️ Fraud Detection

**What it does:** Identifies suspicious or fraudulent claim patterns automatically.

**How:**
- **Anomaly Detection**: Flags workers whose claim rate is statistically abnormal compared to zone peers
- **Location Validation**: Cross-checks worker's registered zone with actual disruption location data
- **Cluster Analysis**: If a disruption is detected in zone X, but only 1 out of 40 workers reports it — flag as suspicious
- **Duplicate Prevention**: Ensures no worker gets paid twice for the same event window
- Uses **Isolation Forest** algorithm for outlier detection

**Impact:** Keeps the platform financially viable by preventing abuse — estimated to catch 90%+ of fraud attempts.

---

## 10. 🛡️ Adversarial Defense & Anti-Spoofing Strategy

> **⚠️ MARKET CRASH RESPONSE — Critical Compliance Section**
>
> _"A syndicate of 500 delivery workers exploited GPS spoofing to trigger mass false payouts on a competing platform. GigShield is engineered to resist this exact attack vector from Day 1."_

### The Threat Model

💡 GigShield treats fraud as an adversarial systems problem, not a simple location validation problem.

Organized fraud rings coordinate via private messaging groups. Workers stay home while spoofing their GPS to appear inside a red-alert weather zone — triggering automatic parametric payouts they never earned. Simple GPS verification is **insufficient**. GigShield uses a **multi-layered defense architecture** that makes spoofing economically pointless.

---

### Pillar 1: Differentiating Genuine vs. Spoofed Workers

**The core question:** _How do we tell a genuinely stranded worker from a bad actor faking their location?_

GigShield doesn't rely on any single signal. We use a **Genuineness Score (0–100)** computed from multiple independent, hard-to-fake data points:

| Signal | What It Checks | Why It's Hard to Fake |
|--------|----------------|----------------------|
| 📡 **Cell Tower Triangulation** | Worker's phone connects to cell towers near their claimed location | Spoofing GPS doesn't change which cell towers the phone pings — requires physical presence |
| 📶 **Network Latency Fingerprint** | Measures round-trip latency to nearby servers / CDN nodes | A worker "in Kothrud" but with latency patterns matching "Hinjewadi" is flagged instantly |
| 📱 **Device Sensor Consistency** | Accelerometer, gyroscope, barometer data from phone | A phone "in a rainstorm" should show barometric pressure drops + movement patterns consistent with being outdoors, not lying still on a table at home |
| 🕐 **Historical Activity Pattern** | Worker's normal working hours, routes, active zones from past weeks | A worker who has never worked in Zone X suddenly claiming disruption there = anomaly |
| 🛰️ **Multi-Source Location Validation** | Cross-references GPS with IP geolocation + Wi-Fi SSID proximity | If GPS says "outdoor in rain zone" but Wi-Fi shows connected to a home router = 🚩 |

**Decision Logic:**
```
Genuineness Score = Weighted Average of:
  Cell Tower Match (25%) +
  Network Latency Match (20%) +
  Sensor Consistency (20%) +
  Historical Pattern Match (20%) +
  Multi-Source Location Match (15%)

IF Score ≥ 70 → AUTO-APPROVE payout
IF Score 40–69 → HOLD for review (see Pillar 3)
IF Score < 40 → Payout held for verification + flagged for investigation
```

---

### Pillar 2: Detecting Coordinated Fraud Rings

**The core question:** _What data catches a 500-person fraud syndicate operating via Telegram?_

Individual spoofers are hard to catch. **Coordinated rings leave statistical fingerprints.** GigShield uses **Social Graph Anomaly Detection** to catch them:

| Detection Method | How It Works |
|-----------------|-------------|
| ⏱️ **Temporal Clustering** | If 50+ workers from scattered zones all submit claims within the same 10-minute window — statistically impossible unless coordinated. Normal claims are spread across hours. |
| 🗺️ **Ghost Zone Detection** | If claims spike in Zone X but **no other real-world signal** confirms disruption (weather API shows clear skies, nearby zones report normal activity) — the entire zone's claims are flagged. |
| 🔗 **Device Fingerprint Graphing** | Workers in a fraud ring often share the same spoofing app. We detect shared app signatures, similar device config patterns, or identical GPS drift patterns across multiple accounts. |
| 📊 **Claim-to-Peer Ratio** | In a genuine disruption, ~30–60% of workers in a zone claim. If 95%+ claim simultaneously in a zone with no confirmed event — it's a coordinated attack. |
| 🧬 **Behavioral Velocity** | A worker's claim pattern suddenly changing (from 1 claim/month to 4 claims/week) triggers individual risk escalation. When multiple workers in a network show the same velocity shift — ring detected. |

**Ring Isolation Protocol:**
1. System detects anomalous pattern (e.g., temporal cluster of 50+ claims)
2. Maps all involved workers into a **suspect graph**
3. Cross-references with Genuineness Scores — legitimate workers in the same zone are separated out
4. Suspect cluster is **frozen** — payouts held for admin review
5. Confirmed fraud actors are permanently flagged; their future premiums are non-refundable deposits

> 💡 **Key Insight:** We don't need to catch every individual spoofer. We catch the **pattern** — and one pattern catches the entire ring.

---

### Pillar 3: Fair UX for Honest Workers (The Grace Protocol)

**The core question:** _How do we flag bad actors without punishing a genuine worker whose phone glitched in bad weather?_

A false positive (blocking a genuine worker's payout) destroys trust. GigShield uses a **3-Tier Escalation System** that is transparent, fast, and fair:

| Tier | Genuineness Score | Action | Worker Experience |
|------|------------------|--------|-------------------|
| ✅ **Green (Auto-Approve)** | ≥ 70 | Instant payout, no friction | _"₹350 credited for rain disruption"_ — same as always |
| 🟡 **Yellow (Soft Hold)** | 40–69 | Payout held for **max 2 hours** while system runs additional checks | Worker gets: _"Your payout is being verified — you'll receive it within 2 hours. No action needed from you."_ |
| 🔴 **Red (Review)** | < 40 | Payout frozen, sent to admin review queue | Worker gets: _"We need to verify your claim. You can submit a quick 30-second selfie video from your location to speed up approval."_ |

**Why this is fair:**

- **Green tier** covers 80%+ of genuine claims — zero friction for honest workers
- **Yellow tier** gives the system time to cross-check without accusing the worker. Most yellow claims auto-resolve to green within 30 minutes.
- **Red tier** offers a simple escape hatch: a **30-second selfie video** showing the worker at their claimed location + weather conditions. This is trivial for a genuine worker but impossible for a spoofer at home.
- **No automatic bans.** Only repeated Red flags (3+ in a month) trigger account review. A single bad signal never locks anyone out.
- **Transparency first:** Workers can always see WHY their claim was held — _"Your location couldn't be verified via network signal"_ — not a black box.

### Anti-Spoofing Architecture Summary

```mermaid
flowchart TD
    A["🔔 Claim Triggered by Parametric Event"] --> B["🛡️ Genuineness Score Engine"]

    B --> C{"Score Result"}

    C -->|"Score ≥ 70"| D["✅ AUTO-PAY\nInstant payout, zero friction"]
    C -->|"Score 40-69"| E["🟡 SOFT HOLD\nMax 2hr verification"]
    C -->|"Score < 40"| F["🔴 REVIEW\n30-sec selfie video option"]

    B --> G{"Ring Pattern\nDetected?"}
    G -->|"Yes"| H["🚨 FREEZE ALL\nEntire cluster held for admin review"]
    G -->|"No"| C

    D --> I["💰 Payout Processed"]
    E -->|"Auto-resolves"| I
    F -->|"Verified"| I
    F -->|"Denied"| J["🚫 Claim Rejected"]
    H --> K["👨‍💼 Admin Review"]
    K -->|"Legit"| I
    K -->|"Fraud"| J

    subgraph SIGNALS["📡 Genuineness Signals"]
        S1["Cell Tower Triangulation"]
        S2["Network Latency Fingerprint"]
        S3["Device Sensors (Barometer, Gyro)"]
        S4["Historical Activity Pattern"]
        S5["Multi-Source Location (GPS + Wi-Fi + IP)"]
    end

    SIGNALS --> B

    subgraph RING["🔗 Ring Detection Signals"]
        R1["Temporal Clustering"]
        R2["Ghost Zone Detection"]
        R3["Device Fingerprint Graph"]
        R4["Behavioral Velocity"]
    end

    RING --> G

    style A fill:#E74C3C,stroke:#B33A2E,color:#fff
    style B fill:#2C3E50,stroke:#1A252F,color:#fff
    style D fill:#27AE60,stroke:#1E8449,color:#fff
    style E fill:#F39C12,stroke:#D68910,color:#fff
    style F fill:#E74C3C,stroke:#B33A2E,color:#fff
    style H fill:#8E44AD,stroke:#6C3483,color:#fff
    style I fill:#2ECC71,stroke:#239B56,color:#fff
    style J fill:#95A5A6,stroke:#717D7E,color:#fff
    style K fill:#3498DB,stroke:#2874A6,color:#fff
    style SIGNALS fill:#1ABC9C,stroke:#148F77,color:#fff
    style RING fill:#E67E22,stroke:#B35F18,color:#fff
```

> 🔒 **"GigShield assumes every claim could be spoofed — and proves it genuine through multi-signal verification. The honest worker never notices. The spoofer never profits."**

---

## 11. MVP Scope (Phase 2 Build Plan)

> This section defines what we will build in Phase 2 (Weeks 3–4). Scope is deliberately tight to ensure quality execution.

### MVP Boundaries

| Dimension | Scope |
|-----------|-------|
| **City** | Pune (1 city only) |
| **Persona** | Q-Commerce delivery partners (Zepto/Blinkit riders) |
| **Primary Disruption** | Heavy Rainfall (most measurable + most impactful for Q-Commerce) |
| **Secondary Disruption** | AQI (Severe pollution alert) |
| **Pricing** | 3-tier weekly model (₹49 / ₹69 / ₹99) |
| **Payout** | Simulated UPI payout via Razorpay test mode |

### What We Will Build

| Feature | Details |
|---------|---------|
| ✅ **Worker Registration** | Simple web form — name, phone, platform, pincode, OTP verification |
| ✅ **Zone Risk Scoring** | AI model that scores Pune pincodes (1–100) using historical weather data |
| ✅ **Weekly Policy Purchase** | Worker selects tier → pays weekly premium → policy activates |
| ✅ **Real-time Weather Monitoring** | Polls OpenWeatherMap API every 15 min for rainfall in active zones |
| ✅ **AQI Monitoring** | Polls AQICN API for pollution levels in active zones |
| ✅ **Parametric Trigger Engine** | Auto-detects when rainfall > 30mm/hr for 2+ hours → triggers claim |
| ✅ **Auto Payout Calculation** | Calculates lost hours × hourly rate → processes payout |
| ✅ **Fraud Detection (Basic)** | Cluster validation + anomaly flagging (lightweight version of full anti-spoofing system) |
| ✅ **Worker Dashboard** | Active policy, payout history, coverage status |
| ✅ **Admin Dashboard** | Active policies, trigger events, payouts, basic analytics |

### What We Will NOT Build in MVP

| Excluded | Reason |
|----------|--------|
| ❌ Multiple cities | Focus on Pune first, expand later |
| ❌ WhatsApp bot | Web-first; WhatsApp integration in Phase 3 |
| ❌ Advanced ML models | Start with rule-based + basic ML; refine in Phase 3 |
| ❌ Real payment processing | Use Razorpay sandbox/test mode |
| ❌ Mobile native app | Responsive web app is sufficient for MVP |

### APIs We Will Integrate

| API | Purpose | Mode |
|-----|---------|------|
| **OpenWeatherMap** | Real-time rainfall + temperature data | Free tier |
| **AQICN** | Air quality index by location | Free tier |
| **Razorpay** | Payment collection + payout simulation | Test/Sandbox mode |

---

## 12. ⚙️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js (React) + Tailwind CSS | Ultra-fast SSR/SSG, premium aesthetics, responsive UI |
| **Backend** | Python (FastAPI) | High-performance async framework for real-time monitoring |
| **Database** | **PostgreSQL (Supabase)** | Relational data integrity, production-ready, cloud-hosted |
| **AI/ML** | Python (scikit-learn, pandas) | Native integration within FastAPI for risk scoring |
| **Monitoring** | APScheduler + HTTPX | Always-on background tasks polling Weather & AQI APIs |
| **Payment** | Simulation Engine (UPI) | Sandbox simulation of instant parametric payouts |
| **Hosting** | **Replit / Vercel** | Edge deployment for global availability |

| **Version Control** | GitHub | Required by competition |

### Architecture Pattern

```mermaid
flowchart LR
    A["🖥️ Frontend\n(Next.js + Tailwind)"] <-->|"REST API"| B["⚡ Backend\n(Python / FastAPI)"]
    B <-->|"AsyncPG"| C[("🗄️ PostgreSQL\n(Supabase)")]
    B <-->|"Native Python"| D["🧠 AI/ML Models\n(scikit-learn)"]
    B <-->|"HTTPX"| E["🌐 External APIs\n(Weather, AQI)"]

    style A fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style B fill:#27AE60,stroke:#1E8449,color:#fff
    style C fill:#8E44AD,stroke:#6C3483,color:#fff
    style D fill:#E67E22,stroke:#B35F18,color:#fff
    style E fill:#E74C3C,stroke:#B33A2E,color:#fff
```

---

## 13. 🔄 Application Workflow

### End-to-End Execution Flow

```
STEP 1: ONBOARDING
│
├── Worker opens GigShield web app
├── Enters: Name, Phone, City (Pune), Pincode, Platform (Zepto)
├── Receives OTP → Verifies identity
├── System fetches Zone Risk Score for worker's pincode
└── Worker sees recommended insurance tier

STEP 2: POLICY PURCHASE
│
├── Worker selects tier: Basic (₹49) / Standard (₹69) / Premium (₹99)
├── Pays via UPI/Razorpay
├── Weekly policy activates immediately
├── Worker dashboard shows: "Active Coverage — Valid till [date]"
└── Auto-renewal available (optional)

STEP 3: CONTINUOUS MONITORING (Background)
│
├── System polls OpenWeatherMap every 15 min for worker's pincode
├── System polls AQICN every 30 min for AQI data
├── Data stored in time-series format
├── Monitoring dashboard shows real-time zone status
└── If thresholds approach, system moves to alert state

STEP 4: TRIGGER DETECTION
│
├── Rainfall > 30mm/hr for 2+ consecutive hours? → TRIGGER
├── AQI > 400 sustained for 6+ hours? → TRIGGER
├── Curfew declared in zone? → MANUAL TRIGGER by admin
├── System logs: Event type, timestamp, duration, affected zone
└── Claim auto-initiated — NO worker action needed

STEP 5: FRAUD VALIDATION
│
├── Cluster check: Are other workers in zone also affected? ✅
├── Data cross-reference: Do 2+ sources confirm the event? ✅
├── Anomaly check: Is this worker's claim history normal? ✅
├── Duplicate check: Has this event-window already been paid? ✅
└── If all pass → Claim APPROVED automatically

STEP 6: PAYOUT
│
├── Payout = Lost Hours × Worker's Average Hourly Rate
├── Amount calculated and logged
├── UPI transfer initiated (Razorpay test mode)
├── Worker gets notification: "₹XXX credited for [event] disruption"
├── Full breakdown visible on worker dashboard
└── Admin dashboard updated with payout metrics
```

---

## 14. 📅 Development Plan (6 Weeks)

### Phase 1: Ideation & Foundation (Weeks 1–2) ✅ _Current Phase_

| Task | Status |
|------|--------|
| Market research & persona definition | ✅ Done |
| Define parametric triggers & thresholds | ✅ Done |
| Design system architecture | ✅ Done |
| Weekly pricing model design | ✅ Done |
| AI/ML integration planning | ✅ Done |
| Tech stack selection | ✅ Done |
| README & idea document | ✅ Done |
| 2-minute strategy video | ✅ Done |

### Phase 2: Automation & Protection (Weeks 3–4) ✅ _Build Phase Complete_

| Week | Focus | Key Deliverables |
|------|-------|-------------------|
| **Week 3** | Core Build | ✅ Worker registration flow, PostgreSQL (Supabase) schema, Zone Risk Score model, Policy purchase flow |
| **Week 4** | Automation | ✅ Weather/AQI API integration, Parametric Trigger engine, Auto-payout engine, Worker + Admin dashboards |


### Phase 3: Scale & Optimize (Weeks 5–6)

| Week | Focus | Key Deliverables |
|------|-------|-------------------|
| **Week 5** | Advanced Features | Advanced fraud detection (GPS validation, cluster analysis), Instant payout simulation (Razorpay sandbox UPI), Predictive analytics (next week's risk forecast), Enhanced admin dashboard with loss ratios |
| **Week 6** | Polish & Submit | End-to-end testing, 5-minute demo video, Final pitch deck (PDF), Code cleanup & documentation, Performance optimization |

---

## 15. 🧠 Business Logic

### How the Company Stays Profitable

**The math behind sustainability:**

| Metric | Value |
|--------|-------|
| Average premium collected per worker/week | ₹69 |
| Average payout per worker/week | ₹35–₹45 (not every week has disruptions) |
| **Gross margin per worker/week** | **₹24–₹34 (~40–50%)** |
| Target workers (Year 1, Pune only) | 5,000 |
| **Weekly revenue** | **₹3,45,000** |
| **Weekly payouts (worst case)** | **₹2,25,000** |

### Why the Pricing Model Works

1. **Law of Large Numbers**: Across 5,000 workers, only 20–30% claim in a given week. Premiums from the 70% who don't claim cover those who do.

2. **Hyper-Local Risk Pricing**: Workers in safer zones pay less; riskier zones pay more — premiums match expected claims, eliminating adverse selection.

3. **Weekly Cycle + Fraud Prevention**: Premiums adjust weekly (no long-term exposure), and Cluster Validation targets 90%+ fraud detection — directly protecting the bottom line.

### Loss Ratio Target

- **Target**: 55–65% (industry standard for parametric insurance is 60–70%)
- **Break-even**: Achieved at ~2,000 active workers in Pune
- **Profitable**: At 5,000+ workers with consistent premium collection

> **Key Insight:** We're not competing with traditional insurance. We're creating a new category — _micro-insurance for income protection_ — where the ticket size is small (₹49–₹99/week) but the volume is massive (millions of potential users).

---

## 16. Video Demos

🎬 **Phase 1: Ideation & Strategy**
https://youtu.be/kmW-PTAe5EE

🎬 **Phase 2: Building & Automation**
https://youtu.be/kSG2As1U-Os

---

## ⚙️ 17. Setup & Installation

Follow these steps to run **GigShield** locally:

### (A) Backend Setup (FastAPI)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Darshitbansal02/gigshield-parametric-insurance.git
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` folder and add:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   SECRET_KEY=your_secret_key
   DEBUG=False
   ```

5. **Initialize Database & Run Server:**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be live at `http://localhost:8000`.

### (B) Frontend Setup (Next.js)

1. **Navigate to the frontend folder:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be live at `http://localhost:3000`.

---

## Future Scope

> Future: Integrate real-time rider activity signals for more accurate income loss detection.

---

## 🏁 Summary

| Aspect | Our Approach |
|--------|-------------|
| **Persona** | Q-Commerce delivery partner (Zepto/Blinkit) in Pune |
| **Coverage** | Income loss ONLY — no health/accident/vehicle |
| **Pricing** | Weekly: ₹49 / ₹69 / ₹99 per week |
| **Triggers** | Rain, AQI, Curfew, Extreme Heat, Floods, Demand Crash, Platform Outage |
| **AI Usage** | Zone Risk Scoring, Dynamic Pricing, Fraud Detection |
| **Innovation** | Zone Risk Score (hyper-local) + Cluster Validation (fraud) |
| **Unique Edge** | Multi-signal disruption detection + platform-aware triggers |
| **MVP City** | Pune |
| **Platform** | Responsive Web App |
| **Payout** | Automatic via UPI (Razorpay sandbox) |

---

<div align="center">

### Built with ❤️ for India's Gig Workers

**GigShield** — _AI-Powered Parametric Income Insurance_

**Guidewire DEVTrails 2026 — Phase 2 Build Submission**

[⭐ Star this repo if you believe gig workers deserve better!](#)

</div>
