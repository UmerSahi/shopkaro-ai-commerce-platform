"use client";

import React, { useState } from "react";
import { AlertTriangle, TrendingUp, Calendar, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

interface SignatureRadarProps {
  onInspectSku: (skuId: string) => void;
}

export function SignatureRadar({ onInspectSku }: SignatureRadarProps) {
  const [activeFestival, setActiveFestival] = useState<string>("eid_fitr");
  const [hoveredDay, setHoveredDay] = useState<number | null>(18);

  // 30-Day Pre-Eid Demand Profile with P10, P50, P90 Fan
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1; // Day 1 to 30 (leading up to Chaand Raat)
    // Non-linear exponential ramp-up as Eid approaches
    const baseline = 180 + Math.pow(dayNum, 2.1) * 2.8;
    const p50 = Math.round(baseline);
    const p10 = Math.round(baseline * 0.76);
    const p90 = Math.round(baseline * 1.34);
    return { day: dayNum, p10, p50, p90 };
  });

  const criticalSkus = [
    { id: "SKU-10492", title: "Gul Ahmed Festive Embroidered 3-Piece Lawn Suit", stock: 120, dailyBurn: 38, daysLeft: 3.2, leadTime: 7, status: "critical" },
    { id: "SKU-04821", title: "J. Junaid Jamshed Men's Kurta Collection Royal Blue", stock: 185, dailyBurn: 24, daysLeft: 7.7, leadTime: 6, status: "critical" },
    { id: "SKU-07119", title: "Shan Biryani Masala Special Bombay Pack 50g", stock: 420, dailyBurn: 40, daysLeft: 10.5, leadTime: 4, status: "warning" },
    { id: "SKU-00104", title: "Samsung Galaxy S24 Ultra 256GB Titanium Gray", stock: 85, dailyBurn: 5, daysLeft: 17.0, leadTime: 5, status: "optimal" },
    { id: "SKU-18230", title: "Dawlance 1.5 Ton Energy Saver Inverter AC", stock: 110, dailyBurn: 4, daysLeft: 27.5, leadTime: 10, status: "optimal" },
  ];

  // SVG dimensions
  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...days.map((d) => d.p90)) * 1.05;

  const getX = (idx: number) => padding.left + (idx / (days.length - 1)) * graphWidth;
  const getY = (val: number) => height - padding.bottom - (val / maxVal) * graphHeight;

  // Build SVG Paths
  const p90Points = days.map((d, i) => `${getX(i)},${getY(d.p90)}`).join(" L ");
  const p10ReversePoints = [...days].reverse().map((d, i) => `${getX(days.length - 1 - i)},${getY(d.p10)}`).join(" L ");
  const areaPath = `M ${p90Points} L ${p10ReversePoints} Z`;
  const p50Line = days.map((d, i) => `${getX(i)},${getY(d.p50)}`).join(" L ");

  const activePoint = hoveredDay !== null ? days[hoveredDay - 1] : days[17];
  const activeX = hoveredDay !== null ? getX(hoveredDay - 1) : getX(17);

  return (
    <div className="bg-[#0d121a] border border-white/10 rounded-lg p-5 space-y-5">
      {/* Signature Set Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              SIGNATURE INSTRUMENT · ACT III
            </span>
          </div>
          <h2 className="text-base font-semibold text-slate-100 font-mono tracking-tight mt-1">
            Islamic Lunar Surge Radar & 14-Day Stockout Horizon
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronizes 50k SKUs against the 10-11 day annual Islamic calendar migration and courier cutoffs.
          </p>
        </div>

        {/* Festival Selector Buttons */}
        <div className="flex items-center space-x-1.5 bg-black/40 p-1 border border-white/5 rounded">
          {[
            { id: "eid_fitr", label: "Eid-ul-Fitr (Lawn & Fashion)" },
            { id: "eid_adha", label: "Eid-ul-Adha (Spices & Freezers)" },
            { id: "11_11", label: "11.11 Mega Sale (Tech & Home)" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFestival(f.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                activeFestival === f.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Layout: 2/3 SVG Curve, 1/3 Urgent Stockout Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Interactive Fan Chart */}
        <div className="lg:col-span-7 bg-[#070a0f] border border-white/5 rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-cyan-500/30 border border-cyan-400/60 rounded-xs inline-block" />
                <span className="text-slate-300">P10–P90 Uncertainty Envelope</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
                <span className="text-cyan-300 font-semibold">P50 Expected Demand</span>
              </span>
            </div>
            <div className="text-amber-400 font-medium">
              Cursor: Day {activePoint?.day} → P50: {activePoint?.p50} units/day
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto cursor-crosshair select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, (mouseX - padding.left) / graphWidth));
                const dayIndex = Math.min(days.length, Math.max(1, Math.round(ratio * (days.length - 1)) + 1));
                setHoveredDay(dayIndex);
              }}
              onMouseLeave={() => setHoveredDay(18)}
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = padding.top + pct * graphHeight;
                const val = Math.round(maxVal * (1 - pct));
                return (
                  <g key={i}>
                    <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* 14-Day Stockout Threshold Line */}
              <line
                x1={getX(13)}
                y1={padding.top}
                x2={getX(13)}
                y2={height - padding.bottom}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x={getX(13) + 4} y={padding.top + 14} fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                14-DAY COURIER FREEZE CUTOFF
              </text>

              {/* P10-P90 Shaded Band */}
              <path d={areaPath} fill="rgba(0, 240, 255, 0.08)" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />

              {/* P50 Median Line */}
              <path d={`M ${p50Line}`} fill="none" stroke="#00f0ff" strokeWidth="2.5" />

              {/* Active Day Vertical Cursor */}
              {activeX && (
                <g>
                  <line x1={activeX} y1={padding.top} x2={activeX} y2={height - padding.bottom} stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx={activeX} cy={getY(activePoint.p50)} r="4" fill="#070a0f" stroke="#00f0ff" strokeWidth="2.5" />
                  <circle cx={activeX} cy={getY(activePoint.p90)} r="3" fill="#38bdf8" />
                  <circle cx={activeX} cy={getY(activePoint.p10)} r="3" fill="#38bdf8" />
                </g>
              )}

              {/* X Axis Day Labels */}
              {[1, 5, 10, 14, 20, 25, 30].map((d) => (
                <text
                  key={d}
                  x={getX(d - 1)}
                  y={height - 12}
                  textAnchor="middle"
                  fill={d === 14 ? "#f43f5e" : "#64748b"}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight={d === 14 ? "bold" : "normal"}
                >
                  {d === 30 ? "Chaand Raat" : `D-${31 - d}`}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
            <span>LightGBM Model WAPE: 21.43% (beats Seasonal Naive 98.51%)</span>
            <span>Empirical P90 Calibration: 90.4% Coverage</span>
          </div>
        </div>

        {/* Right Column: High-Urgency Stockout Cliff Queue (The Lit Region) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Stockout Horizon Queue (&lt; 14 Days)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              2 CRITICAL BREACHES
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
            {criticalSkus.map((sku) => {
              const isCritical = sku.daysLeft <= 14;
              return (
                <div
                  key={sku.id}
                  onClick={() => onInspectSku(sku.id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer ${
                    isCritical
                      ? "bg-rose-950/25 border-rose-500/40 hover:border-rose-400"
                      : "bg-[#070a0f] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 font-medium">{sku.id}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        sku.daysLeft <= 7
                          ? "bg-rose-500 text-white"
                          : sku.daysLeft <= 14
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {sku.daysLeft <= 7 ? "CRITICAL: " : "BUFFER: "} {sku.daysLeft.toFixed(1)}d LEFT
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 truncate mt-1 font-medium">{sku.title}</p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <span>Stock: <strong className="text-white">{sku.stock}</strong></span>
                    <span>Burn: <strong className="text-amber-300">{sku.dailyBurn}/d</strong></span>
                    <span>Lead: <strong className="text-slate-300">{sku.leadTime}d</strong></span>
                    <span className="text-cyan-400 flex items-center hover:underline">
                      Inspect <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-black/40 border border-white/5 rounded text-xs text-slate-400 font-mono flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Automated ROP PO generation enabled</span>
            </span>
            <kbd className="text-[10px] text-cyan-300">[x] reorder</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

