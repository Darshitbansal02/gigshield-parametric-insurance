"""
Database Seed Script -- Populates the database with demo data.

Run: python seed.py

Creates:
  - Admin user (admin@gigshield.com / admin123)
  - 5 demo workers with different plans and zones
  - Sample policies, trigger events, and payouts
"""

import asyncio
import random
from datetime import datetime, timezone, timedelta

from core.database import engine, async_session, Base
from core.security import hash_password
from models.schemas import User, Policy, TriggerEvent, Claim, Payout
from services.risk_engine import compute_zone_risk_score
from services.payout_engine import simulate_upi_payout


DEMO_WORKERS = [
    {
        "name": "Ramesh Kumar",
        "email": "ramesh@gigshield.com",
        "password": "ramesh123",
        "gig_type": "delivery",
        "platform": "zepto",
        "city": "Pune",
        "pincode": "411038",
        "plan": "standard",
        "hourly_rate": 87.5,
    },
    {
        "name": "Priya Malhotra",
        "email": "priya@gigshield.com",
        "password": "priya123",
        "gig_type": "delivery",
        "platform": "zomato",
        "city": "Mumbai",
        "pincode": "400001",
        "plan": "premium",
        "hourly_rate": 95.0,
    },
    {
        "name": "Arjun Singh",
        "email": "arjun@gigshield.com",
        "password": "arjun123",
        "gig_type": "delivery",
        "platform": "blinkit",
        "city": "Delhi",
        "pincode": "110001",
        "plan": "basic",
        "hourly_rate": 80.0,
    },
    {
        "name": "Kavita Deshmukh",
        "email": "kavita@gigshield.com",
        "password": "kavita123",
        "gig_type": "delivery",
        "platform": "swiggy",
        "city": "Pune",
        "pincode": "411041",
        "plan": "standard",
        "hourly_rate": 85.0,
    },
    {
        "name": "Suresh Tiwari",
        "email": "suresh@gigshield.com",
        "password": "suresh123",
        "gig_type": "courier",
        "platform": "porter",
        "city": "Bengaluru",
        "pincode": "560001",
        "plan": "basic",
        "hourly_rate": 75.0,
    },
]


async def seed():
    print("[SEED] Starting database seed...")

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Tables created")

    async with async_session() as db:
        # -- Create admin user --
        admin = User(
            name="Admin",
            email="admin@gigshield.com",
            hashed_password=hash_password("admin123"),
            gig_type="admin",
            platform="gigshield",
            city="Pune",
            pincode="411038",
            plan="premium",
            zone_risk_score=50.0,
            weekly_premium=0.0,
            is_admin=True,
        )
        db.add(admin)
        print("[USER] Admin user created: admin@gigshield.com / admin123")

        # -- Create demo workers --
        workers = []
        for w in DEMO_WORKERS:
            risk_score = compute_zone_risk_score(w["pincode"], w["city"])
            premiums = {"basic": 49, "standard": 69, "premium": 99}

            user = User(
                name=w["name"],
                email=w["email"],
                hashed_password=hash_password(w["password"]),
                gig_type=w["gig_type"],
                platform=w["platform"],
                city=w["city"],
                pincode=w["pincode"],
                plan=w["plan"],
                zone_risk_score=risk_score,
                weekly_premium=premiums.get(w["plan"], 49),
                hourly_rate=w["hourly_rate"],
            )
            db.add(user)
            workers.append(user)
            print(f"[USER] Worker created: {w['name']} ({w['email']} / {w['password']}) -- {w['city']}, {w['plan']} plan")

        await db.flush()

        # -- Create active policies for each worker --
        now = datetime.now(timezone.utc)
        for worker in workers:
            caps = {"basic": 500, "standard": 900, "premium": 1500}
            triggers_count = {"basic": 2, "standard": 4, "premium": 7}

            policy = Policy(
                user_id=worker.id,
                tier=worker.plan,
                premium_amount=worker.weekly_premium,
                coverage_cap=caps.get(worker.plan, 500),
                triggers_covered=triggers_count.get(worker.plan, 2),
                status="active",
                start_date=now - timedelta(days=random.randint(0, 3)),
                end_date=now + timedelta(days=random.randint(4, 7)),
            )
            db.add(policy)

        print("[OK] Active policies created for all workers")

        # -- Create sample trigger events --
        trigger_types = [
            ("rain", "47.2mm", "30mm/hr", "triggered", 99.1),
            ("aqi", "AQI 156", "AQI > 400", "warning", 39.0),
            ("heat", "31C", "45C", "normal", 68.9),
            ("rain", "62.1mm", "30mm/hr", "triggered", 99.5),
            ("aqi", "AQI 423", "AQI > 400", "triggered", 95.8),
        ]

        trigger_events = []
        for i, (ttype, value, threshold, status, conf) in enumerate(trigger_types):
            te = TriggerEvent(
                trigger_type=ttype,
                zone_pincode=DEMO_WORKERS[i % len(DEMO_WORKERS)]["pincode"],
                city=DEMO_WORKERS[i % len(DEMO_WORKERS)]["city"],
                current_value=value,
                threshold=threshold,
                status=status,
                confidence=conf,
                data_source="OpenWeatherMap" if ttype in ("rain", "heat") else "AQICN",
                created_at=now - timedelta(hours=random.randint(1, 72)),
            )
            db.add(te)
            trigger_events.append(te)

        await db.flush()
        print("[OK] Sample trigger events created")

        # -- Create sample payouts --
        payout_data = [
            (0, "rain", 700, "3m 12s"),
            (1, "aqi", 500, "4m 05s"),
            (2, "rain", 480, "2m 58s"),
            (3, "heat", 450, "3m 44s"),
            (0, "rain", 700, "2m 30s"),
            (1, "rain", 900, "3m 18s"),
            (4, "rain", 375, "4m 22s"),
        ]

        for worker_idx, trigger_type, amount, time_str in payout_data:
            worker = workers[worker_idx]
            upi = simulate_upi_payout(worker.name, amount)

            payout = Payout(
                user_id=worker.id,
                worker_name=worker.name,
                trigger_type=trigger_type,
                amount=amount,
                time_to_payout=time_str,
                payment_method="UPI",
                payment_ref=upi["payment_ref"],
                status="paid",
                date=(now - timedelta(days=random.randint(0, 7))).strftime("%b %d, %Y"),
                created_at=now - timedelta(days=random.randint(0, 7)),
            )
            db.add(payout)

        print("[OK] Sample payouts created")

        await db.commit()
        print("")
        print("[DONE] Database seeded successfully!")
        print("")
        print("[CREDENTIALS] Demo Logins:")
        print("  Admin:   admin@gigshield.com / admin123")
        for w in DEMO_WORKERS:
            print(f"  Worker:  {w['email']} / {w['password']} ({w['city']}, {w['plan']})")


if __name__ == "__main__":
    asyncio.run(seed())
