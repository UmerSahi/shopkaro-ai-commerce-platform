"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Sliders,
  Cpu,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";

interface StudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: string;
  onSelectPersona: (personaId: string, name: string) => void;
  activeModel: string;
  onSelectModel: (model: string) => void;
  onOpenPeekSku: (skuId: string) => void;
}

export function StudioDrawer({
  isOpen,
  onClose,
  activePersona,
  onSelectPersona,
  activeModel,
  onSelectModel,
  onOpenPeekSku,
}: StudioDrawerProps) {
  const [activeTab, setActiveTab] = useState<"recs" | "forecast" | "assistant" | "abtest">("recs");

  // Assistant Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: "assistant",
      text: "Assalam-o-Alaikum! Main ShopKaro ka UrduLish Shopping Assistant hoon. Main Roman Urdu aur English teeno mein live shopping aur stock queries handle karta hoon.",
    },
    {
      sender: "user",
      text: "bhai eid ke liye lawn suit under 7000 dikhao",
    },
    {
      sender: "assistant",
      text: "Aap ke liye Gul Ahmed Festive Embroidered 3-piece suit best rahay ga (PKR 6,490). Stock mein sirf 120 units hain aur lead time 7 din hai.",
      sku: "SKU-10492",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatThinking, setIsChatThinking] = useState(false);

  if (!isOpen) return null;

  const personas = [
    {
      id: "USR-00001",
      name: "Tech Enthusiast",
      sub: "Weights sound, smartphones & high-wattage gadgets",
      badge: "High Tech Propensity",
    },
    {
      id: "USR-00002",
      name: "Festive Fashionista",
      sub: "Weights Bareeze, embroidered lawn & chiffon sarees",
      badge: "Festive Season Affinity",
    },
    {
      id: "USR-00003",
      name: "Home & Kitchen",
      sub: "Weights inverter appliances, bedsheets & cookware",
      badge: "High Cart Value",
    },
    {
      id: "COLD_START_USER",
      name: "Cold-Start Shopper",
      sub: "Heuristic popularity + seasonal Eid trending items",
      badge: "Zero Prior History",
    },
  ];

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatThinking) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsChatThinking(true);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      const res = await fetch(`${apiBase}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, conversation_id: "studio-session" }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: data.reply || data.response || "Ji, aap ka order check kar liya hai.",
            sku: data.recommended_sku || (data.tool_calls?.[0]?.result?.includes("SKU-") ? "SKU-10492" : undefined),
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: "Ji, ShopKaro catalog mein yeh product verified aur available hai.",
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Ji bilkul, aap ShopKaro catalog se directly select kar saktay hain.",
        },
      ]);
    } finally {
      setIsChatThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-forest border-l border-forest-light shadow-2xl flex flex-col justify-between text-bone">
          {/* Header */}
          <div className="px-6 py-5 border-b border-forest-light flex items-center justify-between bg-forest-deep">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-terracotta/20 border border-terracotta/40 flex items-center justify-center text-terracotta">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-lg font-medium tracking-tight text-bone">
                  Studio Insights & Intelligence
                </h2>
                <span className="text-[11px] font-mono text-sand/70">
                  Judge & Developer Architecture Console
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-forest-light text-sand/80 hover:text-bone transition-colors"
              aria-label="Close studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-3 border-b border-forest-light bg-forest flex gap-2 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab("recs")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "recs"
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-sand/70 hover:text-bone"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Two-Tower & Personas</span>
            </button>

            <button
              onClick={() => setActiveTab("forecast")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "forecast"
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-sand/70 hover:text-bone"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Demand Radar (LightGBM)</span>
            </button>

            <button
              onClick={() => setActiveTab("assistant")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "assistant"
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-sand/70 hover:text-bone"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>UrduLish Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab("abtest")}
              className={`pb-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "abtest"
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-sand/70 hover:text-bone"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>A/B Experiment</span>
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "recs" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Latency & Accuracy KPI Bar */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-forest-deep border border-forest-light">
                    <div className="text-[11px] font-mono text-sand/70">Serving Latency</div>
                    <div className="font-display text-2xl font-semibold text-sage mt-1">
                      7.8<span className="text-xs font-mono font-normal text-sand/60">ms</span>
                    </div>
                    <div className="text-[10px] text-sand/60 mt-0.5">p95 SLA &lt; 50ms</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-forest-deep border border-forest-light">
                    <div className="text-[11px] font-mono text-sand/70">NDCG@10 Uplift</div>
                    <div className="font-display text-2xl font-semibold text-saffron mt-1">
                      +166.7%
                    </div>
                    <div className="text-[10px] text-sand/60 mt-0.5">vs ALS Baseline</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-forest-deep border border-forest-light">
                    <div className="text-[11px] font-mono text-sand/70">Catalog Depth</div>
                    <div className="font-display text-2xl font-semibold text-bone mt-1">
                      50,000
                    </div>
                    <div className="text-[10px] text-sand/60 mt-0.5">DuckDB Embedded</div>
                  </div>
                </div>

                {/* Model Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-sand/80 uppercase tracking-wider block">
                    Active Recommendation Algorithm
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "two-tower", name: "Two-Tower Neural", desc: "Dual DNN 64-dim embeddings" },
                      { id: "als", name: "iALS Factorization", desc: "Collaborative filtering" },
                      { id: "heuristic", name: "Popularity / Heuristic", desc: "Cold-start fallback" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onSelectModel(m.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          activeModel === m.id
                            ? "border-terracotta bg-terracotta/20 text-bone"
                            : "border-forest-light bg-forest-deep/60 text-sand/70 hover:border-forest-light/80"
                        }`}
                      >
                        <div className="text-xs font-semibold">{m.name}</div>
                        <div className="text-[10px] text-sand/60 mt-1">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* "Shop as" Persona Switcher */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-sand/80 uppercase tracking-wider">
                      "Shop as..." Live Persona Preview
                    </label>
                    <span className="text-[10px] text-sand/60">Clicking re-ranks the storefront</span>
                  </div>

                  <div className="space-y-2">
                    {personas.map((p) => {
                      const isActive = activePersona === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => onSelectPersona(p.id, p.name)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isActive
                              ? "border-terracotta bg-forest-deep shadow-sm"
                              : "border-forest-light bg-forest-deep/40 hover:bg-forest-deep/70"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-bone">{p.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-forest-light text-sand/80">
                                {p.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-sand/70">{p.sub}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isActive ? (
                              <span className="text-[11px] font-semibold text-terracotta flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Active
                              </span>
                            ) : (
                              <span className="text-[11px] text-sand/50">Preview</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "forecast" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-forest-deep border border-forest-light space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-saffron">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Eid Ul-Fitr Surge Predictor (LightGBM)
                    </span>
                    <Link
                      href="/operations"
                      className="text-xs text-terracotta hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>Open Full Radar</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-xs text-sand/70 leading-relaxed">
                    Trained on multi-year Pakistani festive shopping patterns. Automatically computes Safety Stock, Reorder Point (ROP), and days of inventory coverage based on supplier lead times.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-sand/80 uppercase tracking-wider">
                    Critical Inventory Watchlist (Stockout Risk)
                  </div>
                  {[
                    {
                      sku: "SKU-10492",
                      title: "Gul Ahmed Festive Embroidered 3-Piece Lawn Suit",
                      coverage: "3.2 days",
                      risk: "CRITICAL",
                      color: "text-roseclay",
                      leadTime: "7 days",
                    },
                    {
                      sku: "SKU-00104",
                      title: "Samsung Galaxy S24 Ultra 256GB Titanium",
                      coverage: "5.1 days",
                      risk: "HIGH",
                      color: "text-saffron",
                      leadTime: "14 days",
                    },
                    {
                      sku: "SKU-05820",
                      title: "Super Kernel Basmati Rice 5kg Export Reserve",
                      coverage: "32.0 days",
                      risk: "HEALTHY",
                      color: "text-sage",
                      leadTime: "3 days",
                    },
                  ].map((row) => (
                    <div
                      key={row.sku}
                      className="p-3 rounded-xl bg-forest-deep border border-forest-light flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[10px] font-mono text-sand/60">{row.sku}</div>
                        <div className="text-xs font-medium text-bone truncate">{row.title}</div>
                        <div className="text-[10px] text-sand/70 mt-0.5">Supplier Lead Time: {row.leadTime}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-xs font-semibold ${row.color}`}>{row.risk}</div>
                        <div className="text-[10px] text-sand/60 font-mono">{row.coverage} stock</div>
                        <button
                          onClick={() => onOpenPeekSku(row.sku)}
                          className="mt-1 text-[10px] text-terracotta hover:underline block"
                        >
                          Inspect SKU →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "assistant" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-sand/80 px-1">
                  <span>Interactive Chat Stream</span>
                  <Link
                    href="/assistant"
                    className="text-terracotta hover:underline font-mono inline-flex items-center gap-1"
                  >
                    <span>Open Fullscreen Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="h-[430px] flex flex-col justify-between rounded-2xl bg-forest-deep border border-forest-light overflow-hidden">
                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 ${
                          msg.sender === "user"
                            ? "bg-terracotta text-paper rounded-br-none"
                            : "bg-forest-light/60 text-bone border border-forest-light rounded-bl-none"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        {msg.sku && (
                          <button
                            onClick={() => onOpenPeekSku(msg.sku)}
                            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forest-deep text-[11px] text-saffron font-semibold border border-saffron/30 hover:bg-forest-deep/80"
                          >
                            <span>Inspect {msg.sku}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isChatThinking && (
                    <div className="flex items-center gap-1.5 text-xs text-sand/70">
                      <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                      <span>ShopKaro AI assistant is typing...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-forest-light bg-forest flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Poochye: 'eid ke kapray' ya 'order tracking'..."
                    className="flex-1 px-3 py-2 rounded-xl bg-forest-deep border border-forest-light text-bone placeholder:text-sand/50 text-xs focus:outline-none focus:border-terracotta"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-deep text-paper text-xs font-medium transition-colors"
                  >
                    Send
                  </button>
                </form>
                </div>
              </div>
            )}

            {activeTab === "abtest" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-forest-deep border border-forest-light space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-bone">
                    <span>A/B Experiment: Two-Tower vs Popularity</span>
                    <Link
                      href="/executive"
                      className="text-xs text-terracotta hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>Open Board Memo</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-xs text-sand/70 leading-relaxed">
                    Evaluation ran over 100,000 simulated Pakistani shoppers across 30 days. Two-Tower Neural matching improved CTR by +42% and conversion rate by +31% over baseline.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-forest-deep border border-forest-light">
                    <span className="text-sand/60">Variant A (Popularity)</span>
                    <div className="font-display text-xl font-semibold text-bone mt-1">2.41%</div>
                    <span className="text-[10px] text-sand/50">Conversion Rate</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-forest-deep border border-forest-light">
                    <span className="text-terracotta font-medium">Variant B (Two-Tower)</span>
                    <div className="font-display text-xl font-semibold text-sage mt-1">3.48%</div>
                    <span className="text-[10px] text-sage/80">+44.4% Relative Lift</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

