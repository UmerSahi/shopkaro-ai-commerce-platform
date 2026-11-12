"use client";

import React, { useState } from "react";
import { Film, Play, ChevronRight, ChevronLeft, CheckCircle2, Award, Sparkles, TrendingUp, Layers, Terminal, Zap } from "lucide-react";

export function ScreeningRoom() {
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
      filmMechanism: "Deep focus wide architectural layout (Fincher) paired with Karachi street bitumen ground (#070a0f).",
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
      filmMechanism: "Saul Bass reductive summary: Single high-contrast stat-sig callout with executive decision memo.",
      narration: "A synthetic A/B experiment of 100,000 visitors proves statistical significance (p < 0.0001). The platform achieves a +21.6% conversion rate increase, delivering an estimated +PKR 54.80 in revenue per visitor.",
    },
  ];

  const current = acts[activeAct];

  return (
    <div className="bg-[#0d121a] border border-white/10 rounded-lg overflow-hidden text-slate-200">
      {/* Screening Room Header */}
      <div className="px-6 py-4 bg-[#070a0f] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-semibold tracking-wider font-mono uppercase text-white">
              Director's Screening Room · 5-Act Film Projection
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Fincher x Doyle Cinematic UI Walkthrough of the ShopKaro AI Commerce Platform
            </p>
          </div>
        </div>

        {/* Act Stepper Tabs */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 border border-white/5 rounded">
          {acts.map((a, idx) => (
            <button
              key={idx}
              onClick={() => setActiveAct(idx)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                activeAct === idx
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {a.act}
            </button>
          ))}
        </div>
      </div>

      {/* Main Act Stage */}
      <div className="p-6 space-y-6">
        {/* Act Title & Director's Note */}
        <div className="border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
            <span>{current.act}</span>
            <span>·</span>
            <span className="text-amber-400">{current.subtitle}</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            {current.title}
          </h1>
          <p className="text-xs text-slate-400 italic mt-2">
            Director's Framing: "{current.directorNote}"
          </p>
        </div>

        {/* Cinematic Grid Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {current.metrics.map((m, idx) => (
            <div key={idx} className="bg-[#070a0f] p-3 rounded border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{m.label}</div>
              <div className="text-base font-bold font-mono text-cyan-300 mt-1">{m.val}</div>
            </div>
          ))}
        </div>

        {/* Script & Voiceover Narration */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <div className="md:col-span-8 p-4 bg-black/30 border border-white/5 rounded space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              VOICEOVER / SCRIPT ANALYSIS
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {current.narration}
            </p>
          </div>

          <div className="md:col-span-4 p-4 bg-cyan-950/20 border border-cyan-500/20 rounded space-y-2">
            <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-semibold">
              FILM MECHANISM (CINEMATIC UI)
            </span>
            <p className="text-xs text-cyan-200/90 leading-relaxed font-mono">
              {current.filmMechanism}
            </p>
          </div>
        </div>

        {/* Act Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
          <button
            disabled={activeAct === 0}
            onClick={() => setActiveAct((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Previous Act</span>
          </button>

          <span className="text-slate-500">
            Reel Playhead: {activeAct + 1} / {acts.length}
          </span>

          <button
            disabled={activeAct === acts.length - 1}
            onClick={() => setActiveAct((prev) => Math.min(acts.length - 1, prev + 1))}
            className="px-4 py-2 rounded bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
          >
            <span>Next Act</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

