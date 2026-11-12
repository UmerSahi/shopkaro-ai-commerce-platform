"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Star, ShoppingBag, Truck, ShieldCheck, Check } from "lucide-react";

export default function DesignSystemPage() {
  const [btnActive, setBtnActive] = useState(false);

  const colors = [
    { name: "--bone", hex: "#F5EFE6", use: "Page background, light canvas", bg: "bg-bone", text: "text-ink" },
    { name: "--paper", hex: "#FBF8F3", use: "Cards, floating surfaces", bg: "bg-paper", text: "text-ink", border: true },
    { name: "--sand", hex: "#E7DDCF", use: "Dividers, subtle fills, borders", bg: "bg-sand", text: "text-ink" },
    { name: "--ink", hex: "#1C1A17", use: "Primary text, headers, dark buttons", bg: "bg-ink", text: "text-bone" },
    { name: "--ink-soft", hex: "#5C564D", use: "Secondary text, captions", bg: "bg-ink-soft", text: "text-bone" },
    { name: "--terracotta", hex: "#C4532D", use: "Primary accent, primary CTAs", bg: "bg-terracotta", text: "text-paper" },
    { name: "--terracotta-deep", hex: "#9E3F20", use: "CTA hover, pressed states", bg: "bg-terracotta-deep", text: "text-paper" },
    { name: "--saffron", hex: "#E2A336", use: "Highlights, ratings, sale tags", bg: "bg-saffron", text: "text-ink" },
    { name: "--sage", hex: "#8FA58B", use: "Success, in-stock, calm accents", bg: "bg-sage", text: "text-paper" },
    { name: "--forest", hex: "#22382E", use: "Feature bands, footer, studio background", bg: "bg-forest", text: "text-bone" },
    { name: "--rose-clay", hex: "#D9A79A", use: "Soft tag backgrounds, ambient washes", bg: "bg-roseclay", text: "text-ink" },
  ];

  return (
    <div className="min-h-screen bg-bone text-ink p-6 sm:p-12 space-y-16 max-w-6xl mx-auto font-sans">
      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-6 border-b border-sand">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terracotta hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
        <div className="font-mono text-xs text-ink-soft">
          ShopKaro Design System Specimen · v2.0 Warm Editorial Bazaar
        </div>
      </div>

      {/* Header Intro */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-sand text-xs font-semibold text-terracotta uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Design Tokens & Primitives</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-ink">
          The Warm Editorial Bazaar
        </h1>
        <p className="text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
          Inspired by high-end Lahore and Karachi concept ateliers crossed with an editorial lookbook. Three core principles: <em>warm · tactile · unhurried</em>.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">1. Color System</h2>
          <p className="text-xs text-ink-soft mt-1">
            Ink-based, warm desaturated tones. Pure #000 black and neon synthetics are strictly forbidden.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors.map((c) => (
            <div
              key={c.name}
              className="p-4 rounded-2xl bg-paper border border-sand shadow-warm-sm flex flex-col justify-between space-y-3"
            >
              <div
                className={`h-16 w-full rounded-xl ${c.bg} ${c.border ? "border border-sand" : ""} shadow-inner flex items-end p-2.5`}
              >
                <span className={`text-[10px] font-mono font-semibold ${c.text}`}>{c.hex}</span>
              </div>
              <div>
                <div className="font-display text-sm font-semibold text-ink">{c.name}</div>
                <div className="text-[11px] text-ink-soft mt-0.5 leading-snug">{c.use}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Specimen */}
      <section className="space-y-6 pt-8 border-t border-sand">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">2. Typography Hierarchy</h2>
          <p className="text-xs text-ink-soft mt-1">
            Fraunces display serif, Manrope for high-legibility UI body, and Noto Nastaliq Urdu for authentic local expression.
          </p>
        </div>

        <div className="space-y-6 p-6 rounded-card bg-paper border border-sand shadow-warm-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-terracotta">Hero Headline (Fraunces Display Serif + Italic)</span>
            <div className="font-display text-4xl sm:text-5xl font-medium text-ink">
              Eid, <span className="italic font-normal font-serif text-terracotta">effortlessly</span> dressed.
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-sand/60">
            <span className="text-[10px] font-mono uppercase text-terracotta">Section H2 (Fraunces)</span>
            <div className="font-display text-2xl sm:text-3xl font-medium text-ink">
              Tradition reimagined for the contemporary Pakistani home.
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-sand/60">
            <span className="text-[10px] font-mono uppercase text-terracotta">UI Body Text (Manrope, 16px, 1.55 Line Height)</span>
            <p className="text-sm text-ink-soft leading-relaxed max-w-2xl">
              From the handlooms of Faisalabad to the modern fashion ateliers of Lahore and Karachi, each piece in ShopKaro is curated for lasting fabric integrity, verified provenance, and timeless refinement.
            </p>
          </div>

          <div className="space-y-1 pt-4 border-t border-sand/60">
            <span className="text-[10px] font-mono uppercase text-terracotta">Urdu Script Snippet (Noto Nastaliq Urdu)</span>
            <div className="font-urdu text-lg text-ink font-normal leading-loose">
              ہماری عید کلیکشن میں خالص لان، ہاتھ کی کڑھائی اور اعلیٰ معیار کے جوڑے شامل ہیں۔
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-sand/60">
            <span className="text-[10px] font-mono uppercase text-terracotta">Micro Numerals & SKU (JetBrains Mono, Max 5% of Surface)</span>
            <div className="font-mono text-xs text-ink-soft">
              SKU: PK-10492 · NDCG@10: 0.812 · LATENCY: 7.8ms
            </div>
          </div>
        </div>
      </section>

      {/* 3. Component Primitives */}
      <section className="space-y-6 pt-8 border-t border-sand">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink">3. Interactive Primitives</h2>
          <p className="text-xs text-ink-soft mt-1">
            Buttons, Badges, Wishlist toggles, and Steppers designed for tactile feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons Specimen */}
          <div className="p-6 rounded-card bg-paper border border-sand space-y-4">
            <h3 className="font-display text-base font-semibold text-ink">Buttons</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-6 py-3 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper text-xs font-medium transition-all shadow-sm active:scale-95">
                Primary Terracotta Pill
              </button>
              <button className="px-6 py-3 rounded-pill border border-ink text-ink hover:bg-ink hover:text-paper text-xs font-medium transition-all active:scale-95">
                Secondary Ink Outline
              </button>
              <button className="px-4 py-2 rounded-pill bg-bone border border-sand text-ink text-xs font-medium hover:bg-sand/40 transition-colors">
                Tertiary Surface Pill
              </button>
            </div>
          </div>

          {/* Badges & Chips */}
          <div className="p-6 rounded-card bg-paper border border-sand space-y-4">
            <h3 className="font-display text-base font-semibold text-ink">Badges & Signals</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sage-light text-sage-deep text-xs font-semibold flex items-center gap-1 border border-sage/30">
                <Sparkles className="w-3.5 h-3.5 text-sage" />
                <span>97% Match for you</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-saffron text-ink text-xs font-semibold">
                Save 25%
              </span>
              <span className="px-3 py-1 rounded-full bg-paper border border-sand text-ink text-xs font-semibold">
                In Stock · 120 Left
              </span>
              <span className="px-3 py-1 rounded-full bg-forest text-bone text-xs font-mono">
                COD Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Return */}
      <div className="pt-12 border-t border-sand text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-ink text-paper text-xs font-medium hover:bg-ink-soft transition-all shadow-sm"
        >
          <span>Return to Live Storefront</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}

