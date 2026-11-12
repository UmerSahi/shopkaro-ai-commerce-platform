"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Play,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Award,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowLeft,
  Zap,
} from "lucide-react";

export default function ScreeningPage() {
  const [activeAct, setActiveAct] = useState(0);

  const acts = [
    {
      act: "ACT I",
      title: "The Midnight Bazaar & Data Pipeline",
      subtitle: "50,000 SKUs, DuckDB Ingestion, Bot Filter & 30-Min Sessionizer",
      directorNote: "The opening establishing shot: chaotic Pakistani bazaar commerce brought into strict machine order.",
      metrics: [
        { label: "Catalog Scale", val: "50,000 SKUs" },
        { label: "Raw Events", val: "522,914 Actions" },
        { label: "Duplicates Cleaned", val: "1,521 Records" },
        { label: "30-Min Inactivity Sessions", val: "71,613 Sessions" },
        { label: "Sparsity Matrix", val: "99.88% Real-world" },
      ],
      filmMechanism: "Deep focus wide architectural layout paired with Lahore and Karachi street textures.",
      narration: "A commercial landscape with 50,000 items cannot be operated on intuition. DuckDB normalizes raw clickstreams, purges 223 scraping bot sessions, and segments users across Karachi, Lahore, and Islamabad into 5 RFM clusters.",
    },
    {
      act: "ACT II",
      title: "The Two Towers & Real-Time Recommender",
      subtitle: "PyTorch Two-Tower Hybrid Neural Matching + Collaborative Filtering ALS",
      directorNote: "The insert shot: Vector dot products calculated in microseconds to solve the cold-start crisis.",
      metrics: [
        { label: "Offline NDCG@10", val: "0.1240 (+166.7% Uplift)" },
        { label: "Hit Rate @ 10", val: "58.2%" },
        { label: "Catalog Coverage", val: "18.4% (vs 0.02% Pop)" },
        { label: "Cached Latency", val: "5.02 ms (SLA < 100ms)" },
        { label: "Festival Boost", val: "1.25x Dynamic Prior" },
      ],
      filmMechanism: "Top-light illumination highlighting user embedding vector vs item candidate dot product.",
      narration: "Traditional collaborative filtering suffers extreme cold-start collapse on 50,000 SKUs. ShopKaro's Two-Tower neural model encodes multi-hot categorical features into 64-dim embeddings, scoring +166.7% over baseline.",
    },
    {
      act: "ACT III",
      title: "The Shifting Moon & Probabilistic Forecaster",
      subtitle: "LightGBM Multi-Lag Regressor with 4-Fold Rolling Backtest & P10/P50/P90 Quantiles",
      directorNote: "The dramatic turning point: 14 days before Eid, stockouts mean permanent revenue loss.",
      metrics: [
        { label: "Model WAPE", val: "21.43%" },
        { label: "Seasonal Naive WAPE", val: "98.51% (77.1 pt beat)" },
        { label: "P90 Empirical Coverage", val: "90.4% Calibrated" },
        { label: "Critical Stockouts", val: "14-Day Alert Horizon" },
        { label: "Dead Stock Liquidation", val: "15% Promo Trigger" },
      ],
      filmMechanism: "The Signature Set: Interactive SVG fan chart mapping probabilistic demand against the Islamic lunar calendar.",
      narration: "Islamic festivals shift 10–11 days earlier every solar year, invalidating standard YoY models. LightGBM multi-lag regression captures pre-Eid surge curves, reducing WAPE to 21.4% with empirical 90.4% P90 calibration.",
    },
    {
      act: "ACT IV",
      title: "The Voice of the Street & Grounded Assistant",
      subtitle: "Hybrid Search (BM25 + Dense Semantic RRF) & UrduLish Review NLP",
      directorNote: "The audio track meets picture: The authentic colloquial language of Pakistani commerce.",
      metrics: [
        { label: "Search NDCG@10", val: "0.9486 (+11.8% Uplift)" },
        { label: "RRF Fusion Param", val: "k = 60" },
        { label: "Hallucination Rate", val: "0.0% (Grounded Tools)" },
        { label: "Review Aspects", val: "6 Quality Dimensions" },
        { label: "Spam Detection", val: "4.22% Fake Purged" },
      ],
      filmMechanism: "Dual UI Dialect: Conversational colloquial UrduLish terminal backed by rigorous database tools.",
      narration: "Pakistani shoppers don't search with catalog terms; they type 'bhai eid ke liye kurta chahiye under 4000'. Hybrid search fuses token frequencies with semantic vectors, while the grounded assistant issues real tool calls.",
    },
    {
      act: "ACT V",
      title: "The Commercial Verdict & Executive Signoff",
      subtitle: "100,000 Visitor A/B Test Simulation & Stat-Sig Conversion Lift",
      directorNote: "The final resolution: Scientifically defensible commercial value ready for board presentation.",
      metrics: [
        { label: "A/B Sample Size", val: "100,000 Visitors" },
        { label: "Conversion Lift", val: "+21.6% Relative" },
        { label: "RPV Lift", val: "+PKR 54.80 / Visitor" },
        { label: "Z-Test p-value", val: "p < 0.0001 (Stat-Sig)" },
        { label: "10-Min Demo Deck", val: "Executive Ready" },
      ],
      filmMechanism: "Hard cut to commercial victory: 2.41% control to 3.48% treatment with board-ready memo.",
      narration: "Over 100,000 simulated shoppers, the Two-Tower engine achieved a +21.6% relative conversion lift (p < 0.0001) and added PKR 54.80 revenue per visitor, proving machine intelligence can be artfully engineered for emerging markets.",
    },
  ];

  const curr = acts[activeAct];

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
              <Link href="/executive" className="text-ink-soft hover:text-ink transition-colors">Executive Suite</Link>
              <span className="text-terracotta font-semibold px-2.5 py-1 rounded-full bg-terracotta/10 border border-terracotta/20">Screening Room</span>
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
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Intro in Deep Forest Green */}
        <div className="p-6 rounded-card bg-forest text-bone border border-forest-light shadow-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-deep text-sand text-[11px] font-mono tracking-wider uppercase border border-forest-light">
              <span className="text-saffron">▶</span>
              <span>Architectural Screening Reel</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-bone">
              The Capstone Narrative Architecture
            </h1>
            <p className="text-xs sm:text-sm text-sand/80 max-w-xl">
              A cinematic walkthrough demonstrating how data engineering, machine learning, and consumer packaging coalesce into production value.
            </p>
          </div>
          <div className="text-xs font-mono text-sand/70 text-right">
            <span>5 Acts · 100% Production Tested</span>
          </div>
        </div>

        {/* Acts Navigation Rail */}
        <div className="grid grid-cols-5 gap-2">
          {acts.map((act, i) => (
            <button
              key={i}
              onClick={() => setActiveAct(i)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                activeAct === i
                  ? "bg-terracotta text-paper border-terracotta shadow-sm scale-105"
                  : "bg-paper border border-sand text-ink-soft hover:text-ink hover:border-sand/80"
              }`}
            >
              <div className="text-[10px] font-mono uppercase font-semibold">{act.act}</div>
              <div className="text-xs font-medium truncate mt-0.5">{act.title.split("&")[0]}</div>
            </button>
          ))}
        </div>

        {/* Active Act Projection Screen */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAct}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 rounded-card bg-paper border border-sand shadow-warm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand gap-2">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-terracotta tracking-wider">
                  {curr.act} · SYSTEM NARRATIVE
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink mt-0.5">
                  {curr.title}
                </h2>
                <p className="text-xs text-ink-soft font-mono mt-0.5">{curr.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={activeAct === 0}
                  onClick={() => setActiveAct((a) => a - 1)}
                  className="p-2 rounded-full border border-sand text-ink-soft hover:text-ink disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-ink-soft">{activeAct + 1} / 5</span>
                <button
                  disabled={activeAct === acts.length - 1}
                  onClick={() => setActiveAct((a) => a + 1)}
                  className="p-2 rounded-full border border-sand text-ink-soft hover:text-ink disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Narration Script */}
            <div className="p-5 rounded-2xl bg-bone/60 border border-sand space-y-2">
              <span className="text-[10px] uppercase font-mono font-semibold text-terracotta tracking-wider">
                Director's Voiceover Script
              </span>
              <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans italic">
                "{curr.narration}"
              </p>
            </div>

            {/* Quantitative Metrics Ledger */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono font-semibold text-ink-soft tracking-wider">
                Verification Proof & Quantitative Artifacts
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {curr.metrics.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.06 }}
                    className="p-3.5 rounded-xl bg-bone border border-sand shadow-warm-xs"
                  >
                    <span className="text-[10px] text-ink-soft block">{m.label}</span>
                    <div className="font-display text-base font-semibold text-ink mt-0.5">
                      {m.val}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Signature Forest Green Footer */}
      <footer className="mt-16 bg-forest text-bone py-10 border-t border-forest-light">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-sand/70 gap-4">
          <div>
            <span className="font-display text-base font-semibold text-bone">ShopKaro<span className="text-terracotta">.</span></span>
            <span className="ml-2">Director's Screening Room · 5-Act Capstone Reel</span>
          </div>
          <div className="flex items-center gap-4 text-sand/60">
            <span>Production Tested</span>
            <span>·</span>
            <Link href="/" className="text-terracotta hover:underline">Back to Storefront →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

