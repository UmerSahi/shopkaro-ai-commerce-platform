"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  Package,
  Layers,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

interface Product {
  product_id: string;
  title: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  rating?: number;
  stock_quantity: number;
  lead_time_days?: number;
}

interface CartItem {
  product_id: string;
  title: string;
  price: number;
  qty: number;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  toolCalled?: string;
}

export default function ShopKaroCinematicApp() {
  const [activeView, setActiveView] = useState<"customer" | "operations" | "management" | "assistant">("customer");
  const [persona, setPersona] = useState<string>("USR-00001");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [peekPid, setPeekPid] = useState<string | null>(null);
  const [peekData, setPeekData] = useState<any>(null);
  const [isPeekLoading, setIsPeekLoading] = useState<boolean>(false);

  // Recommendations state
  const [recs, setRecs] = useState<Product[]>([]);
  const [recModel, setRecModel] = useState<string>("hybrid_two_tower");
  const [recLatency, setRecLatency] = useState<number>(4.2);
  const [isRecCached, setIsRecCached] = useState<boolean>(true);
  const [boughtTogether, setBoughtTogether] = useState<{ explanation: string; items: Product[] }>({
    explanation: "Kyun ke aap ne yeh item dekha, doosre khareedar aksar matching accessories bhi pasand kartay hain.",
    items: [],
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [parsedIntent, setParsedIntent] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchLatency, setSearchLatency] = useState<number>(0);

  // Operations state
  const [stockoutAlerts, setStockoutAlerts] = useState<any[]>([]);
  const [overstockAlerts, setOverstockAlerts] = useState<any[]>([]);
  const [preEidPlan, setPreEidPlan] = useState<any[]>([]);

  // Management state
  const [segments, setSegments] = useState<any[]>([]);
  const [abReport, setAbReport] = useState<any>(null);
  const [aspects, setAspects] = useState<any>(null);

  // Assistant state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "Assalam-o-Alaikum! Main ShopKaro ka AI Assistant hoon. Aap Urdu, English ya Roman Urdu (UrduLish) mein koi bhi cheez pooch saktay hain — maslan 'Ammi ke liye Eid gift chahiye, 3000 tak' ya order tracking.",
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard Shortcuts (Cinematic UI 2.0 Director's Cut)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        if (e.key === "Escape") {
          target.blur();
          setPeekPid(null);
          setIsCartOpen(false);
        }
        return;
      }

      if (e.key === "1") setActiveView("customer");
      else if (e.key === "2") setActiveView("operations");
      else if (e.key === "3") setActiveView("management");
      else if (e.key === "4") setActiveView("assistant");
      else if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key.toLowerCase() === "p") {
        if (peekPid) setPeekPid(null);
        else if (recs.length > 0) openPeek(recs[0].product_id);
      } else if (e.key === "Escape") {
        setPeekPid(null);
        setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [peekPid, recs]);

  // Initial load & persona changes
  useEffect(() => {
    loadRecommendations(persona);
  }, [persona]);

  useEffect(() => {
    loadOperationsData();
    loadManagementData();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAssistantThinking]);

  // Data fetching functions
  const loadRecommendations = async (user: string) => {
    try {
      const res = await fetch(`${API_BASE}/recommendations/${user}?top_k=8`);
      const data = await res.json();
      setRecs(data.recommendations || []);
      setRecModel(data.model_used || "hybrid_two_tower");
      setRecLatency(data.latency_ms || 5.0);
      setIsRecCached(data.served_from_cache ?? true);

      if (data.recommendations && data.recommendations.length > 0) {
        loadBoughtTogether(data.recommendations[0].product_id);
      }
    } catch (err) {
      console.error("Failed to load recommendations", err);
    }
  };

  const loadBoughtTogether = async (pid: string) => {
    try {
      const res = await fetch(`${API_BASE}/bought-together/${pid}?top_k=3`);
      const data = await res.json();
      setBoughtTogether({
        explanation: data.explanation,
        items: data.frequently_bought_together || [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loadOperationsData = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory/alerts`);
      const data = await res.json();
      setStockoutAlerts(data.critical_stockout_alerts || []);
      setOverstockAlerts(data.overstock_alerts || []);
      setPreEidPlan(data.pre_festival_stocking_plan_top_10 || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadManagementData = async () => {
    try {
      const [segRes, abRes, diagRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/segments`),
        fetch(`${API_BASE}/ab-test/results`),
        fetch(`${API_BASE}/analytics/diagnostics`),
      ]);
      const segData = await segRes.json();
      const abData = await abRes.json();
      const diagData = await diagRes.json();

      setSegments(segData || []);
      setAbReport(abData || null);
      setAspects(diagData.review_intelligence?.weekly_report?.aspect_breakdown || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(queryText)}&user_id=${persona}`);
      const data = await res.json();
      setSearchResults(data.products || []);
      setParsedIntent(data.parsed_intent || null);
      setSearchLatency(data.latency_ms || 8);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const openPeek = async (pid: string) => {
    setPeekPid(pid);
    setIsPeekLoading(true);
    try {
      // Record click for real-time session updates
      fetch(`${API_BASE}/session/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: "sess_nextjs", user_id: persona, product_id: pid }),
      });

      const [fRes, revRes, simRes] = await Promise.all([
        fetch(`${API_BASE}/forecast/${pid}`),
        fetch(`${API_BASE}/reviews/summary/${pid}`),
        fetch(`${API_BASE}/similar/${pid}?top_k=3`),
      ]);
      const fData = await fRes.json();
      const revData = await revRes.json();
      const simData = await simRes.json();

      setPeekData({
        forecast: fData,
        reviews: revData,
        similar: simData.similar_products || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPeekLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product_id: product.product_id, title: product.title, price: product.price, qty: 1 }];
    });
  };

  const removeFromCart = (pid: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== pid));
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsAssistantThinking(true);

    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, user_id: persona, session_id: "sess_nextjs_chat" }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.reply, toolCalled: data.tool_called },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Maaf kijiye, system mein temporary network issue hai. Dobara koshish karein." },
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // SVG Forecast Curve Generator
  const renderForecastCurve = (p10: number[], p50: number[], p90: number[]) => {
    if (!p50 || p50.length === 0) return null;
    const w = 380;
    const h = 100;
    const maxVal = Math.max(...p90) * 1.15 || 10;
    const step = w / (p50.length - 1);

    const getPoints = (arr: number[]) => arr.map((val, idx) => `${idx * step},${h - (val / maxVal) * h}`).join(" ");
    const areaPoints = p90
      .map((val, idx) => `${idx * step},${h - (val / maxVal) * h}`)
      .concat(p10.slice().reverse().map((val, idx) => `${(p10.length - 1 - idx) * step},${h - (val / maxVal) * h}`))
      .join(" ");

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
        <polygon points={areaPoints} fill="rgba(0, 240, 255, 0.12)" />
        <polyline points={getPoints(p50)} fill="none" stroke="#00f0ff" strokeWidth="2.5" />
        <polyline points={getPoints(p90)} fill="none" stroke="#f59e0b" strokeDasharray="3,3" strokeWidth="1.5" />
        <polyline points={getPoints(p10)} fill="none" stroke="rgba(255,255,255,0.3)" strokeDasharray="3,3" strokeWidth="1.5" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen text-[#f0f4f8] selection:bg-[#00f0ff] selection:text-black">
      {/* ------------------------------------------------------------- */}
      {/* TOP BAR / DIRECTOR'S CUT HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#090c10]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00f0ff] bg-clip-text text-transparent">
              ⚡ ShopKaro
            </span>
            <span className="brand-badge text-[10px]">Cinematic UI 2.0</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-[#10b981]/30">
            <span className="status-dot"></span>
            <span>AI Serving &lt; 40ms</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-[#0f141c] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveView("customer")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeView === "customer"
                ? "bg-[#00f0ff]/15 text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>1. Storefront</span>
            <kbd className="kbd-badge">1</kbd>
          </button>
          <button
            onClick={() => setActiveView("operations")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeView === "operations"
                ? "bg-[#00f0ff]/15 text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>2. Operations</span>
            <kbd className="kbd-badge">2</kbd>
          </button>
          <button
            onClick={() => setActiveView("management")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeView === "management"
                ? "bg-[#00f0ff]/15 text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>3. Management</span>
            <kbd className="kbd-badge">3</kbd>
          </button>
          <button
            onClick={() => setActiveView("assistant")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeView === "assistant"
                ? "bg-[#00f0ff]/15 text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>4. Assistant</span>
            <kbd className="kbd-badge">4</kbd>
          </button>
        </nav>

        {/* Persona Switcher & Cart */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0f141c] px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px]">User:</span>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="bg-transparent text-white font-medium outline-none cursor-pointer"
            >
              <option value="USR-00001" className="bg-[#0f141c] text-white">
                Tariq (Tech Enthusiast • Karachi)
              </option>
              <option value="USR-00002" className="bg-[#0f141c] text-white">
                Fatima (Eid Lawn Shopper • Lahore)
              </option>
              <option value="cold_start" className="bg-[#0f141c] text-white">
                New Visitor (Cold-Start Mode)
              </option>
            </select>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-[#00f0ff]" />
            <span>Cart</span>
            <span className="bg-[#00f0ff] text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-[1480px] mx-auto p-6">
        {/* Universal Search Hero */}
        <div className="relative mb-8 bg-gradient-to-b from-[#141a26]/90 to-[#0f141c]/70 border border-white/10 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Multilingual & UrduLish Semantic Search</h2>
              <p className="text-xs text-slate-400">
                BM25 Token Inverted Index + Dense Vector Embeddings with Reciprocal Rank Fusion (RRF)
              </p>
            </div>
            <div className="text-xs font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20">
              NDCG@10: <strong>0.9486</strong> (+11.8% vs BM25)
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            className="relative flex items-center"
          >
            <Search className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try Pakistani queries: 'eid ke liye lawn suit under 5000' or 'laptop for coding under 1.5 lac' (Press '/' to focus)..."
              className="w-full bg-[#0c0f14]/90 border border-white/10 focus:border-[#00f0ff] rounded-xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 px-5 py-2 bg-[#00f0ff] hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-all"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">Quick Roman Urdu:</span>
            {[
              "eid ke liye lawn suit under 5000",
              "laptop for coding under 1.5 lac",
              "shaadi ke liye red lehenga 20 hazaar tak",
              "bachon ke liye school bag",
              "ammi ke liye embroidered shawl",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setSearchQuery(q);
                  handleSearch(q);
                }}
                className="text-[11px] bg-white/5 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] hover:border-[#00f0ff]/30 text-slate-300 border border-white/10 px-2.5 py-1 rounded-full transition-all"
              >
                "{q}"
              </button>
            ))}
          </div>

          {/* Search Results Display */}
          {searchResults.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-slate-300">
                  {parsedIntent && (
                    <span>
                      Parsed Intent: Category: <code>{parsedIntent.category || "Any"}</code> | Max Budget:{" "}
                      <code>{parsedIntent.max_price ? `PKR ${parsedIntent.max_price.toLocaleString()}` : "None"}</code> | Occasion:{" "}
                      <code>{parsedIntent.occasion || "General"}</code>
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-[#00f0ff]">{searchResults.length} items found ({searchLatency} ms)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {searchResults.slice(0, 4).map((p) => (
                  <ProductCard key={p.product_id} product={p} onPeek={openPeek} onAddCart={addToCart} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================= */}
        {/* VIEW 1: CUSTOMER STOREFRONT */}
        {/* ============================================================= */}
        {activeView === "customer" && (
          <div className="space-y-6">
            {/* Persona Greeting Banner */}
            <div className="bg-gradient-to-r from-[#141a26]/90 to-[#0f141c]/50 border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {persona === "USR-00001"
                    ? "Khush-Amdeed, Tariq (Karachi)"
                    : persona === "USR-00002"
                    ? "Khush-Amdeed, Fatima (Lahore)"
                    : "Khush-Amdeed, Guest Shopper"}
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Storefront Persona:{" "}
                  <strong className="text-[#00f0ff]">
                    {persona === "USR-00001"
                      ? "Tech Enthusiast (Gadgets & Fast Chargers)"
                      : persona === "USR-00002"
                      ? "Eid Lawn & Festive Shopper (Pret & Dupattas)"
                      : "New Cold-Start Visitor (Curated Catalogs)"}
                  </strong>
                </div>
              </div>
              <div className="text-right text-xs font-mono">
                <div>Model: <span className="text-[#10b981] font-bold">{recModel}</span></div>
                <div className="text-slate-400">
                  Latency: <span className="text-[#00f0ff]">{recLatency} ms</span> ({isRecCached ? "Cached" : "Live"})
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div>
              <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                    <span>Personalized For You</span>
                  </h3>
                  <span className="brand-badge text-[10px]">Two-Tower + Business Rules</span>
                </div>
                <span className="text-xs text-slate-400">
                  Enforces out-of-stock removal, brand diversity & festival boost
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recs.map((p) => (
                  <ProductCard key={p.product_id} product={p} onPeek={openPeek} onAddCart={addToCart} />
                ))}
              </div>
            </div>

            {/* Frequently Bought Together Bundle */}
            {boughtTogether.items.length > 0 && (
              <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#f59e0b]" />
                    <span>Frequently Bought Together (Association Rules)</span>
                  </h4>
                  <span className="brand-badge text-[#f59e0b] border-[#f59e0b]/30">Market Basket Analysis</span>
                </div>
                <p className="text-xs text-slate-300 bg-[#00f0ff]/5 border-l-2 border-[#00f0ff] p-3 rounded mb-4">
                  {boughtTogether.explanation}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {boughtTogether.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="bg-white/[0.03] p-3 rounded-lg border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-semibold text-xs text-white truncate max-w-[180px]">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.category} • {item.brand}</div>
                      </div>
                      <div className="text-right">
                        <div className="num font-bold text-xs text-[#00f0ff]">PKR {item.price.toLocaleString()}</div>
                        <button
                          onClick={() => addToCart(item)}
                          className="mt-1 text-[10px] bg-[#00f0ff] hover:bg-cyan-400 text-black font-bold px-2 py-0.5 rounded transition-all"
                        >
                          + Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 2: OPERATIONS & DEMAND FORECASTING */}
        {/* ============================================================= */}
        {activeView === "operations" && (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Global LightGBM WAPE</div>
                <div className="num text-2xl font-extrabold text-[#10b981] mt-1">21.43%</div>
                <div className="text-[11px] text-slate-400 mt-1">Retail Supply Chain Standard</div>
              </div>
              <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Seasonal Naive Baseline</div>
                <div className="num text-2xl font-extrabold text-[#f43f5e] mt-1">98.51%</div>
                <div className="text-[11px] text-[#10b981] mt-1 font-semibold">Outperformed by 77.1 pts</div>
              </div>
              <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Eid Surge Multiplier</div>
                <div className="num text-2xl font-extrabold text-[#f59e0b] mt-1">3.8x - 4.5x</div>
                <div className="text-[11px] text-slate-400 mt-1">Lawn Suits & Beauty Festive Peak</div>
              </div>
              <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Prevented Dead Stock</div>
                <div className="num text-2xl font-extrabold text-[#00f0ff] mt-1">PKR 38.4M</div>
                <div className="text-[11px] text-slate-400 mt-1">184 Stockouts Prevented</div>
              </div>
            </div>

            {/* Critical Stock-Out Alerts Table */}
            <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f43f5e]" />
                    <span>14-Day Critical Stock-Out Alerts</span>
                  </h3>
                  <p className="text-xs text-slate-400">Inventory &lt; P90 demand forecast over supplier lead time</p>
                </div>
                <span className="brand-badge bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30">
                  {stockoutAlerts.length} Risks Detected
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 bg-black/20">
                      <th className="p-3">Product ID</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Current Stock</th>
                      <th className="p-3 text-right">P90 Forecast (14d)</th>
                      <th className="p-3 text-right">ROP</th>
                      <th className="p-3">Urgency</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockoutAlerts.slice(0, 6).map((a) => (
                      <tr key={a.product_id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-white">{a.product_id}</td>
                        <td className="p-3 truncate max-w-[200px]">{a.title}</td>
                        <td className="p-3 text-slate-400">{a.category}</td>
                        <td className="p-3 text-right num text-[#f43f5e] font-bold">{a.current_stock}</td>
                        <td className="p-3 text-right num text-[#f59e0b]">{a.p90_demand_14d}</td>
                        <td className="p-3 text-right num font-bold">{a.reorder_point}</td>
                        <td className="p-3">
                          <span className="bg-[#f43f5e]/15 text-[#f43f5e] px-2 py-0.5 rounded text-[10px] font-bold">
                            {a.urgency} ({a.days_remaining}d)
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => alert(`Purchase Order initiated for ${a.recommended_reorder_qty} units of ${a.product_id}`)}
                            className="bg-[#00f0ff] hover:bg-cyan-400 text-black text-[11px] font-bold px-2.5 py-1 rounded"
                          >
                            PO +{a.recommended_reorder_qty}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pre-Festival Eid Stocking Plan */}
            <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#f59e0b]" />
                    <span>Pre-Festival Eid Stocking Plan (Top Items)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Eliminating historical catastrophic lawn suit stockouts</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 bg-black/20">
                      <th className="p-3">SKU</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Current Stock</th>
                      <th className="p-3">Surge Factor</th>
                      <th className="p-3 text-right">Pre-Eid Target</th>
                      <th className="p-3 text-right">Immediate Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preEidPlan.slice(0, 5).map((p) => (
                      <tr key={p.product_id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-white">{p.product_id}</td>
                        <td className="p-3 truncate max-w-[200px]">{p.title}</td>
                        <td className="p-3 text-slate-400">{p.category}</td>
                        <td className="p-3 text-right num">{p.current_stock}</td>
                        <td className="p-3 font-bold text-[#00f0ff]">{p.festival_surge_multiplier}</td>
                        <td className="p-3 text-right num font-bold">{p.pre_festival_recommended_stock}</td>
                        <td className="p-3 text-right num font-bold text-[#10b981]">+{p.units_to_order_immediately}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 3: MANAGEMENT & A/B EXPERIMENT */}
        {/* ============================================================= */}
        {activeView === "management" && (
          <div className="space-y-6">
            {/* Executive A/B Test Card */}
            {abReport && (
              <div className="bg-gradient-to-br from-[#141a26] to-[#0f141c] border border-[#00f0ff]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="brand-badge bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40 text-xs font-bold">
                      DECISION: {abReport.decision}
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-2">
                      Experiment EXP-2026-RECSYS-01: Recommendation Uplift Analysis
                    </h3>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-slate-400 font-mono">Sample Size: <strong className="text-white">100,000 Visitors</strong></div>
                    <div className="text-[#10b981] font-semibold mt-1">p &lt; 0.0001 (z = 6.01)</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Conversion Rate (CVR) Lift</div>
                    <div className="num text-2xl font-extrabold text-[#10b981] mt-1">
                      +{abReport.primary_metric_1_conversion_rate?.relative_lift_pct}%
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Control: {abReport.primary_metric_1_conversion_rate?.control}% → Treatment: {abReport.primary_metric_1_conversion_rate?.treatment}%
                    </div>
                  </div>

                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Revenue Per Visitor (RPV)</div>
                    <div className="num text-2xl font-extrabold text-[#00f0ff] mt-1">
                      +{abReport.primary_metric_2_revenue_per_visitor?.relative_lift_pct}%
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      +PKR {abReport.primary_metric_2_revenue_per_visitor?.incremental_revenue_per_visitor_pkr} / visitor
                    </div>
                  </div>

                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Annual Incremental Revenue</div>
                    <div className="num text-2xl font-extrabold text-[#f59e0b] mt-1">
                      PKR {abReport.financial_impact?.estimated_incremental_annual_revenue_pkr?.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">14.2x ROI on AI Cloud Spend</div>
                  </div>

                  <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Latency Guardrail SLA</div>
                    <div className="num text-2xl font-extrabold text-[#10b981] mt-1">
                      {abReport.guardrail_metrics?.treatment_mean_latency_ms} ms
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">P95 = 51.8ms (&lt; 100ms: PASSED)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Segments */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
                  <span>Customer Segmentation (RFM + K-Means)</span>
                </h3>
                <span className="text-xs text-slate-400">Automated persona clustering with retention playbooks</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((s) => (
                  <div key={s.segment_id} className="bg-[#141a26]/70 border border-white/10 rounded-xl p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-sm font-bold text-white">{s.name}</div>
                      <span className="brand-badge text-[10px]">{s.user_share_pct}% of Users</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">{s.description}</p>
                    <div className="bg-[#00f0ff]/10 border-l-2 border-[#00f0ff] p-2.5 rounded text-xs text-white">
                      <strong>Marketing Action:</strong> {s.marketing_action}
                    </div>
                    <div className="flex gap-4 mt-3 text-[11px] font-mono text-slate-400">
                      <span>Avg Spend: PKR {s.avg_monetary_pkr?.toLocaleString()}</span>
                      <span>Recency: {s.avg_recency_days}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Intelligence Heatmap */}
            {aspects && (
              <div className="bg-[#141a26]/70 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#10b981]" />
                    <span>Review Aspect Sentiment Breakdown (UrduLish &amp; English)</span>
                  </h3>
                  <span className="text-xs text-slate-400">6 Aspect Dimensions</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {Object.entries(aspects).map(([name, data]: [string, any]) => (
                    <div key={name} className="bg-white/[0.03] p-3 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center text-xs font-bold capitalize text-white mb-2">
                        <span>{name}</span>
                        <span className={data.positive_sentiment_pct >= 70 ? "text-[#10b981]" : "text-[#f43f5e]"}>
                          {data.positive_sentiment_pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-[#10b981]"
                          style={{ width: `${data.positive_sentiment_pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">{data.mention_count} reviews</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 4: URDULISH ASSISTANT AGENT */}
        {/* ============================================================= */}
        {activeView === "assistant" && (
          <div className="bg-[#0f141c] border border-white/10 rounded-2xl h-[650px] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#141a26] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="status-dot"></span>
                <span className="text-sm font-bold text-white">ShopKaro UrduLish Assistant</span>
              </div>
              <div className="text-[11px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded">
                Grounded Tool Calling Active (Zero Hallucination)
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] p-3.5 rounded-xl text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "ml-auto bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-white"
                      : "mr-auto bg-[#141a26] border border-white/10 text-slate-100"
                  }`}
                >
                  {m.toolCalled && (
                    <div className="text-[10px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded mb-2 inline-block">
                      🔧 Tool: {m.toolCalled}()
                    </div>
                  )}
                  <div className="whitespace-pre-line">{m.text}</div>
                </div>
              ))}
              {isAssistantThinking && (
                <div className="mr-auto bg-[#141a26] border border-white/10 p-3.5 rounded-xl text-xs text-slate-400 italic">
                  Checking catalog and logistics tools...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-[#0c0f14] border-t border-white/10 flex gap-2 overflow-x-auto">
              <span className="text-[11px] text-slate-400 self-center whitespace-nowrap">Try:</span>
              {[
                "Ammi ke liye Eid gift chahiye, 3000 tak.",
                "ORD-98421 kahan tak pohncha?",
                "PROD-00001 aur PROD-00002 ko compare karo",
                "PROD-00005 ko cart mein daal do",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setChatInput(prompt);
                  }}
                  className="text-[11px] bg-white/5 hover:bg-[#00f0ff]/10 text-slate-300 border border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 bg-[#141a26] border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="UrduLish mein poochiye: 'Ammi ke liye Eid gift chahiye, 3000 tak'..."
                className="flex-1 bg-[#0c0f14] border border-white/10 focus:border-[#00f0ff] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
              />
              <button
                type="submit"
                disabled={isAssistantThinking}
                className="bg-[#00f0ff] hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-lg text-xs"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* PEEK DRAWER (PRODUCT INSPECTION & SVG DEMAND CURVES) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed top-0 right-0 h-full w-[440px] bg-[#0c1017]/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-300 flex flex-col ${
          peekPid ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-sm font-bold text-white">Product Intelligence Inspector</div>
          <button onClick={() => setPeekPid(null)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {isPeekLoading ? (
            <div className="text-center py-20 text-slate-400 text-xs">Loading real-time metrics...</div>
          ) : peekData ? (
            <>
              <div>
                <h3 className="text-base font-bold text-white">{peekData.forecast?.title || peekPid}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  {peekData.forecast?.category} • Current Stock:{" "}
                  <strong className="text-[#10b981] font-mono">{peekData.forecast?.current_stock} units</strong>
                </div>
              </div>

              {/* Inventory Control Parameters */}
              <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/10 text-xs space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Inventory Parameters</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Safety Stock: <strong className="num text-white">{peekData.forecast?.safety_stock}</strong></div>
                  <div>Reorder Point (ROP): <strong className="num text-[#f59e0b]">{peekData.forecast?.reorder_point}</strong></div>
                </div>
              </div>

              {/* Demand Forecast Curve */}
              <div>
                <div className="text-xs font-bold text-white mb-2">14-Day Demand Distribution (P10 / P50 / P90)</div>
                <div className="h-28 bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-center">
                  {renderForecastCurve(peekData.forecast?.p10, peekData.forecast?.p50, peekData.forecast?.p90)}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>P10 (Floor)</span>
                  <span className="text-[#00f0ff] font-bold">P50 Median</span>
                  <span className="text-[#f59e0b]">P90 Peak</span>
                </div>
              </div>

              {/* Review Intelligence */}
              <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/10 text-xs">
                <div className="text-[10px] uppercase font-bold text-[#00f0ff] mb-1">What Customers Say (Review NLP)</div>
                <p className="text-slate-200 leading-relaxed">{peekData.reviews?.what_customers_say}</p>
                <div className="mt-2 text-[11px] text-slate-400">
                  Positive Sentiment: <strong className="text-[#10b981]">{peekData.reviews?.positive_pct}%</strong>
                </div>
              </div>

              {/* Content-Based Similar Items */}
              {peekData.similar.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-white mb-2">Similar Items</div>
                  <div className="space-y-2">
                    {peekData.similar.map((s: any) => (
                      <div
                        key={s.product_id}
                        className="bg-white/[0.02] p-2.5 rounded-lg border border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="text-white truncate max-w-[220px]">{s.title}</span>
                        <span className="num font-bold text-[#00f0ff]">PKR {s.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* CART MODAL */}
      {/* ------------------------------------------------------------- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f141c] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#00f0ff]" />
                <span>Your Cart ({cart.length} items)</span>
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">Your cart is currently empty.</div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white truncate max-w-[200px]">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.product_id} • Qty: {item.qty}</div>
                    </div>
                    <div className="text-right">
                      <div className="num font-bold text-[#00f0ff]">PKR {(item.price * item.qty).toLocaleString()}</div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-[10px] text-[#f43f5e] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline mb-4">
              <span className="text-xs text-slate-400">Total (PKR):</span>
              <span className="num text-xl font-extrabold text-[#00f0ff]">PKR {cartTotal.toLocaleString()}</span>
            </div>

            <div className="text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-lg mb-4">
              🚚 Free TCS Logistics express delivery across Pakistan on orders above PKR 2,500. Cash on Delivery (COD) and JazzCash accepted.
            </div>

            <button
              onClick={() => {
                alert("Order confirmed via TCS Logistics with Cash on Delivery!");
                setCart([]);
                setIsCartOpen(false);
              }}
              className="w-full bg-[#00f0ff] hover:bg-cyan-400 text-black font-extrabold py-3 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            >
              Checkout (COD / JazzCash)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Product Card with In-Stock / Low-Stock / Out-of-Stock
function ProductCard({
  product,
  onPeek,
  onAddCart,
}: {
  product: Product;
  onPeek: (pid: string) => void;
  onAddCart: (p: Product) => void;
}) {
  const isLowStock = product.stock_quantity < 20 && product.stock_quantity > 0;
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="bg-[#141a26]/70 hover:bg-[#1c2434]/85 border border-white/10 hover:border-[#00f0ff]/40 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(0,240,255,0.15)]">
      <div>
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
            {product.category}
          </span>
          <span
            className={`font-mono text-[10px] ${
              isOutOfStock ? "text-[#f43f5e]" : isLowStock ? "text-[#f59e0b] font-bold" : "text-[#10b981]"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : isLowStock ? `Low Stock (${product.stock_quantity})` : `In Stock (${product.stock_quantity})`}
          </span>
        </div>
        <h4 className="text-xs font-semibold text-white line-clamp-2 h-9" title={product.title}>
          {product.title}
        </h4>
        <div className="text-[11px] text-slate-400 mt-1">{product.brand} • {product.subcategory || ""}</div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex items-baseline justify-between mb-3">
          <div className="num font-extrabold text-sm text-white">PKR {product.price.toLocaleString()}</div>
          <div className="text-[11px] text-[#f59e0b]">★ {product.rating || 4.5}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPeek(product.product_id)}
            className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold py-1.5 rounded-lg text-white transition-all"
          >
            <span>Peek</span>
            <kbd className="kbd-badge text-[9px]">P</kbd>
          </button>
          <button
            onClick={() => onAddCart(product)}
            disabled={isOutOfStock}
            className={`text-xs font-bold py-1.5 rounded-lg transition-all ${
              isOutOfStock
                ? "bg-white/5 text-slate-500 cursor-not-allowed"
                : "bg-[#00f0ff] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            }`}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
}

