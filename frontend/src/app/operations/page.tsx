"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Package,
} from "lucide-react";
import { ProductPeekDrawer } from "../../components/ProductPeekDrawer";

export default function OperationsPage() {
  const [activeFestival, setActiveFestival] = useState<string>("eid_fitr");
  const [hoveredDay, setHoveredDay] = useState<number | null>(18);
  const [peekSkuId, setPeekSkuId] = useState<string | null>(null);

  // 30-Day Pre-Eid Demand Profile with P10, P50, P90 Fan
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const baseline = 180 + Math.pow(dayNum, 2.1) * 2.8;
    const p50 = Math.round(baseline);
    const p10 = Math.round(baseline * 0.76);
    const p90 = Math.round(baseline * 1.34);
    return { day: dayNum, p10, p50, p90 };
  });

  const criticalSkus = [
    {
      id: "SKU-10492",
      title: "Gul Ahmed Festive Embroidered 3-Piece Lawn Suit",
      stock: 120,
      dailyBurn: 38,
      daysLeft: 3.2,
      leadTime: 7,
      status: "critical",
      category: "Fashion",
    },
    {
      id: "SKU-04820",
      title: "Junaid Jamshed Pure Cotton Embroidered Kurta",
      stock: 185,
      dailyBurn: 24,
      daysLeft: 7.7,
      leadTime: 6,
      status: "critical",
      category: "Fashion",
    },
    {
      id: "SKU-07119",
      title: "Shan Biryani Masala Special Bombay Pack 50g",
      stock: 420,
      dailyBurn: 40,
      daysLeft: 10.5,
      leadTime: 4,
      status: "warning",
      category: "Groceries",
    },
    {
      id: "SKU-00104",
      title: "Samsung Galaxy S24 Ultra 256GB Titanium Gray",
      stock: 85,
      dailyBurn: 5,
      daysLeft: 17.0,
      leadTime: 14,
      status: "optimal",
      category: "Electronics",
    },
    {
      id: "SKU-18230",
      title: "Dawlance 1.5 Ton Energy Saver Inverter AC",
      stock: 110,
      dailyBurn: 4,
      daysLeft: 27.5,
      leadTime: 10,
      status: "optimal",
      category: "Home & Living",
    },
  ];

  // SVG Chart Calculation
  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...days.map((d) => d.p90)) * 1.05;

  const getX = (idx: number) => padding.left + (idx / (days.length - 1)) * graphWidth;
  const getY = (val: number) => height - padding.bottom - (val / maxVal) * graphHeight;

  const p90Points = days.map((d, i) => `${getX(i)},${getY(d.p90)}`).join(" L ");
  const p10ReversePoints = [...days].reverse().map((d, i) => `${getX(days.length - 1 - i)},${getY(d.p10)}`).join(" L ");
  const areaPath = `M ${p90Points} L ${p10ReversePoints} Z`;
  const p50Line = days.map((d, i) => `${getX(i)},${getY(d.p50)}`).join(" L ");

  const activePoint = hoveredDay !== null ? days[hoveredDay - 1] : days[17];
  const activeX = hoveredDay !== null ? getX(hoveredDay - 1) : getX(17);

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
              <span className="text-terracotta font-semibold px-2.5 py-1 rounded-full bg-terracotta/10 border border-terracotta/20">Demand Radar</span>
              <Link href="/executive" className="text-ink-soft hover:text-ink transition-colors">Executive Suite</Link>
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
        {/* Intro in Deep Forest Green */}
        <div className="p-6 rounded-card bg-forest text-bone border border-forest-light shadow-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-deep text-sand text-[11px] font-mono tracking-wider uppercase border border-forest-light">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
              <span>Surge Intelligence Ledger</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-bone">
              Islamic Lunar Surge Radar & Inventory Ledger
            </h1>
            <p className="text-xs sm:text-sm text-sand/80 max-w-xl">
              Synchronizes 50,000 SKUs against the 10–11 day annual Islamic calendar migration. Computes dynamic safety stock, reorder points (ROP), and 14-day stockout alarms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "eid_fitr", label: "Eid-ul-Fitr (Lawn & Fashion)" },
              { id: "eid_adha", label: "Eid-ul-Adha (Pantry & Deep Freezers)" },
              { id: "11_11", label: "11.11 Mega Sale (Tech & Home)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFestival(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFestival === f.id
                    ? "bg-terracotta text-paper shadow-sm"
                    : "bg-forest-deep border border-forest-light text-sand/80 hover:text-bone"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Signature Interactive SVG Fan Chart */}
        <div className="p-6 rounded-card bg-paper border border-sand shadow-warm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sand gap-2">
            <div>
              <h2 className="font-display text-lg font-medium text-ink">
                30-Day Probabilistic Pre-Eid Demand Profile (P10 · P50 · P90 Fan)
              </h2>
              <span className="text-xs text-ink-soft font-mono">
                Hover along the curve to inspect daily orders & courier cutoffs
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-terracotta font-semibold">
                <span className="w-3 h-0.5 bg-terracotta inline-block" />
                P50 Median Forecast
              </span>
              <span className="flex items-center gap-1.5 text-saffron-deep">
                <span className="w-3 h-2 bg-saffron/30 inline-block rounded-sm" />
                P10–P90 Uncertainty Fan
              </span>
            </div>
          </div>

          {/* SVG Visual */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto max-h-[300px] select-none cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * width;
                const ratio = Math.max(0, Math.min(1, (x - padding.left) / graphWidth));
                const dayIndex = Math.min(30, Math.max(1, Math.round(ratio * 29) + 1));
                setHoveredDay(dayIndex);
              }}
            >
              {/* Subtle Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = getY(maxVal * ratio);
                return (
                  <g key={i}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="rgba(28,26,23,0.06)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      fill="#8C8479"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="JetBrains Mono"
                    >
                      {Math.round(maxVal * ratio)}
                    </text>
                  </g>
                );
              })}

              {/* Uncertainty Area Fan */}
              <path d={areaPath} fill="rgba(226, 163, 54, 0.15)" stroke="none" />

              {/* Median Line */}
              <path
                d={`M ${p50Line}`}
                fill="none"
                stroke="#C4532D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Active Hover Crosshair Line */}
              {hoveredDay !== null && (
                <g>
                  <line
                    x1={activeX}
                    y1={padding.top}
                    x2={activeX}
                    y2={height - padding.bottom}
                    stroke="#1C1A17"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={activeX}
                    cy={getY(activePoint.p50)}
                    r="5"
                    fill="#C4532D"
                    stroke="#FBF8F3"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* X-axis Day Labels */}
              {[1, 5, 10, 15, 20, 25, 30].map((d) => (
                <text
                  key={d}
                  x={getX(d - 1)}
                  y={height - 12}
                  fill="#5C564D"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono"
                >
                  Day {d}
                </text>
              ))}
            </svg>
          </div>

          {/* Active Hover Point Stats Pill */}
          {activePoint && (
            <div className="p-4 rounded-xl bg-bone/70 border border-sand flex flex-wrap items-center justify-between text-xs font-mono gap-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  Ramadan Day {activePoint.day}
                </span>
                <span className="text-ink-soft">
                  ({30 - activePoint.day} days to Chaand Raat)
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-ink-soft text-[10px] block">P10 Conservative</span>
                  <strong className="text-ink font-semibold">{activePoint.p10} units/day</strong>
                </div>
                <div>
                  <span className="text-terracotta text-[10px] block">P50 Expected</span>
                  <strong className="text-terracotta font-semibold">{activePoint.p50} units/day</strong>
                </div>
                <div>
                  <span className="text-saffron-deep text-[10px] block">P90 Surge Peak</span>
                  <strong className="text-saffron-deep font-semibold">{activePoint.p90} units/day</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Critical Inventory Watchlist Ledger */}
        <div className="p-6 rounded-card bg-paper border border-sand shadow-warm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand">
            <div>
              <h2 className="font-display text-lg font-medium text-ink">
                Critical Inventory Stockout Watchlist
              </h2>
              <p className="text-xs text-ink-soft">
                SKUs where days of coverage fall below supplier restocking lead time.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-roseclay/30 text-terracotta-deep font-semibold">
              2 Critical · 1 Warning
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand text-ink-soft font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">SKU ID</th>
                  <th>Product Title</th>
                  <th>Current Stock</th>
                  <th>Daily Burn</th>
                  <th>Coverage</th>
                  <th>Restock Lead Time</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {criticalSkus.map((sku) => (
                  <tr key={sku.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3 font-mono text-terracotta font-semibold">{sku.id}</td>
                    <td className="font-medium text-ink max-w-xs truncate pr-4">{sku.title}</td>
                    <td className="font-mono">{sku.stock}</td>
                    <td className="font-mono">{sku.dailyBurn}/d</td>
                    <td className="font-mono font-semibold">
                      <span className={sku.daysLeft < 5 ? "text-terracotta-deep" : sku.daysLeft < 12 ? "text-saffron-deep" : "text-sage-deep"}>
                        {sku.daysLeft} days
                      </span>
                    </td>
                    <td className="font-mono text-ink-soft">{sku.leadTime} days</td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          sku.status === "critical"
                            ? "bg-roseclay/40 text-terracotta-deep border border-terracotta/30"
                            : sku.status === "warning"
                            ? "bg-saffron-light text-saffron-deep border border-saffron/30"
                            : "bg-sage-light text-sage-deep border border-sage/30"
                        }`}
                      >
                        {sku.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setPeekSkuId(sku.id)}
                        className="px-2.5 py-1 rounded-lg bg-bone border border-sand hover:bg-terracotta hover:text-paper transition-colors font-medium text-[11px]"
                      >
                        Inspect SKU
                      </button>
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
            <span className="ml-2">Operations Command · LightGBM Lunar Forecaster</span>
          </div>
          <div className="flex items-center gap-4 text-sand/60">
            <span>50,000 SKUs Monitored</span>
            <span>·</span>
            <Link href="/" className="text-terracotta hover:underline">Back to Storefront →</Link>
          </div>
        </div>
      </footer>

      <ProductPeekDrawer
        productId={peekSkuId}
        onClose={() => setPeekSkuId(null)}
        onAddToCart={() => {}}
      />
    </div>
  );
}

