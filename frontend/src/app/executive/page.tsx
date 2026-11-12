"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  PieChart,
  BarChart3,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

export default function ExecutivePage() {
  const rfmSegments = [
    {
      name: "Lahore Festive Loyalists",
      size: "24.2%",
      spend: "PKR 18,450",
      topCat: "Bareeze Lawn & Chiffon",
      lift: "+32.4%",
      health: "High LTV",
    },
    {
      name: "Karachi Tech Enthusiasts",
      size: "19.8%",
      spend: "PKR 34,900",
      topCat: "Samsung & Anker Audio",
      lift: "+41.2%",
      health: "High Basket",
    },
    {
      name: "Islamabad Homemakers",
      size: "22.5%",
      spend: "PKR 22,100",
      topCat: "Dawlance Inverters & Kitchen",
      lift: "+28.7%",
      health: "Stable Repeat",
    },
    {
      name: "Seasonal Eid Deal Hunters",
      size: "21.0%",
      spend: "PKR 8,200",
      topCat: "Kurtas & Basmati Rice",
      lift: "+19.5%",
      health: "Discount Sensitive",
    },
    {
      name: "Cold-Start Guest Shoppers",
      size: "12.5%",
      spend: "PKR 5,400",
      topCat: "Trending Heuristics",
      lift: "+52.0%",
      health: "High Conversion Gain",
    },
  ];

  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col font-sans">
      {/* 1. Slim Announcement Bar in Forest Green */}
      <div className="bg-forest text-bone text-xs py-2 px-4 transition-all border-b border-forest-light relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center font-medium tracking-wide">
            <span>Free delivery across Pakistan over Rs. 3,000</span>
            <span className="mx-2 opacity-60">·</span>
            <span>Cash on Delivery (COD)</span>
            <span className="mx-2 opacity-60">·</span>
            <span className="text-saffron">Eid Edit '26 Now Live</span>
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-sand py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink group whitespace-nowrap flex items-baseline">
              <span>ShopKaro</span><span className="text-terracotta transition-transform group-hover:scale-125">.</span>
            </Link>
            <nav className="hidden md:flex items-center gap-3.5 text-xs font-medium">
              <Link href="/assistant" className="text-ink-soft hover:text-ink transition-colors">AI Assistant</Link>
              <Link href="/operations" className="text-ink-soft hover:text-ink transition-colors">Demand Radar</Link>
              <span className="text-terracotta font-semibold px-2.5 py-1 rounded-full bg-terracotta/10 border border-terracotta/20">Executive Suite</span>
              <Link href="/screening" className="text-ink-soft hover:text-ink transition-colors">Screening Room</Link>
            </nav>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Live Boutique</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Board Memo Header in Deep Forest Green */}
        <div className="p-8 rounded-card bg-forest text-bone border border-forest-light shadow-warm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-forest-light">
            <span className="text-[11px] font-mono text-saffron font-semibold uppercase tracking-widest">
              CONFIDENTIAL · BOARD OF DIRECTORS MEMO
            </span>
            <span className="text-xs font-mono text-sand/70">Week 11 Capstone Signoff</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-bone">
              Executive Evaluation & A/B Experimentation Memo
            </h1>
            <p className="text-sm text-sand/80 leading-relaxed max-w-3xl">
              Results from a 30-day simulated randomized controlled trial across 100,000 Pakistani online shoppers, measuring the business impact of the Two-Tower Neural Recommender vs the legacy heuristic baseline.
            </p>
          </div>

          {/* Top 4 KPI Tiles with Framer Motion Lift */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[
              { label: "Simulated Sample", val: "100,000", sub: "50k Control / 50k Variant", color: "text-bone" },
              { label: "Conversion Lift", val: "+44.4%", sub: "2.41% → 3.48% (p < 0.0001)", color: "text-terracotta" },
              { label: "Revenue Per Visitor", val: "+PKR 54.80", sub: "Across all traffic", color: "text-saffron" },
              { label: "Annual GMV Proj.", val: "+PKR 48.2M", sub: "Net Incremental Revenue", color: "text-sage" },
            ].map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-4 rounded-2xl bg-forest-deep border border-forest-light shadow-sm"
              >
                <span className="text-xs text-sand/70">{kpi.label}</span>
                <div className={`font-display text-2xl font-semibold ${kpi.color} mt-1`}>{kpi.val}</div>
                <span className="text-[11px] text-sand/80 font-medium">{kpi.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistical Significance & Variant Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variant A (Control) */}
          <div className="p-6 rounded-card bg-paper border border-sand space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand">
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  Variant A: Popularity Baseline
                </h3>
                <span className="text-xs text-ink-soft">Control Group (50,000 users)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sand/60 text-ink-soft font-semibold">
                Control
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Click-Through Rate (CTR)</span>
                <span className="font-mono font-semibold">4.82%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Add to Cart Rate</span>
                <span className="font-mono font-semibold">3.15%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Checkout Conversion</span>
                <span className="font-mono font-semibold">2.41%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Average Order Value (AOV)</span>
                <span className="font-mono font-semibold">PKR 5,120</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-soft">Catalog Coverage</span>
                <span className="font-mono text-terracotta font-semibold">0.02% (Severe head bias)</span>
              </div>
            </div>
          </div>

          {/* Variant B (Treatment) */}
          <div className="p-6 rounded-card bg-paper border border-terracotta/40 shadow-warm space-y-4 relative overflow-hidden">
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-sage/15 border border-sage/30 text-sage-deep text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              Stat-Sig Champion (+44.4%)
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-sand">
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  Variant B: Two-Tower Neural Engine
                </h3>
                <span className="text-xs text-ink-soft">Treatment Group (50,000 users)</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Click-Through Rate (CTR)</span>
                <span className="font-mono font-semibold text-sage-deep">7.18% (+49.0% lift)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Add to Cart Rate</span>
                <span className="font-mono font-semibold text-sage-deep">4.62% (+46.7% lift)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Checkout Conversion</span>
                <span className="font-mono font-semibold text-terracotta">3.48% (+44.4% lift)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-ink-soft">Average Order Value (AOV)</span>
                <span className="font-mono font-semibold text-ink">PKR 5,490 (+7.2%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink-soft">Catalog Coverage</span>
                <span className="font-mono text-sage-deep font-semibold">18.4% (920x Long-Tail Unlock)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer RFM Segmentation Analysis */}
        <div className="p-6 rounded-card bg-paper border border-sand shadow-warm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand">
            <div>
              <h2 className="font-display text-lg font-medium text-ink">
                RFM Customer Cohorts & Recommendation Sensitivity
              </h2>
              <p className="text-xs text-ink-soft">
                Cluster analysis over 522,914 interactions across Pakistan's primary economic zones.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand text-ink-soft font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Segment Cohort</th>
                  <th>Audience Share</th>
                  <th>Avg Basket</th>
                  <th>Dominant Category</th>
                  <th>Model CTR Lift</th>
                  <th>Customer Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {rfmSegments.map((seg, i) => (
                  <tr key={i} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3 font-semibold text-ink">{seg.name}</td>
                    <td className="font-mono text-ink-soft">{seg.size}</td>
                    <td className="font-mono font-semibold text-ink">{seg.spend}</td>
                    <td className="text-terracotta">{seg.topCat}</td>
                    <td className="font-mono font-semibold text-sage-deep">{seg.lift}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-bone border border-sand text-ink-soft">
                        {seg.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Signature Forest Green Footer */}
      <footer className="mt-16 bg-forest text-bone py-10 border-t border-forest-light">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-sand/70 gap-4">
          <div>
            <span className="font-display text-base font-semibold text-bone">ShopKaro<span className="text-terracotta">.</span></span>
            <span className="ml-2">Executive Suite · A/B Experimentation Memo</span>
          </div>
          <div className="flex items-center gap-4 text-sand/60">
            <span>100,000 Visitors Simulated</span>
            <span>·</span>
            <Link href="/" className="text-terracotta hover:underline">Back to Storefront →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

