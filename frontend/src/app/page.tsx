"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Tag,
  Zap,
  Eye,
  X,
  HelpCircle,
  Package,
} from "lucide-react";

import { CartDrawer, CartItem } from "../components/CartDrawer";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ProductPeekDrawer } from "../components/ProductPeekDrawer";
import { SearchOverlay } from "../components/SearchOverlay";
import { StudioDrawer } from "../components/StudioDrawer";
import { ShortcutSheet } from "../components/ShortcutSheet";
import { CommandPalette } from "../components/CommandPalette";
import { TiltCard } from "../components/TiltCard";
import { Product, getProductImage, cleanTitle, DEFAULT_CURATED_PRODUCTS, ELECTRONICS_CURATED_PRODUCTS } from "../lib/products";
import {
  HeroStarburstSticker,
  HeroLuggageTagSticker,
  WashiTapeSticker,
  ProductCardSticker,
  CuratorSpotlightSticker,
} from "../components/EditorialStickers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// High-fidelity mapping between UI category filter pills and backend catalog categories & queries
const CATEGORY_MAP: Record<string, { query: string; category?: string }> = {
  "All": { query: "", category: undefined },
  "Lawn & Festive": { query: "lawn suit bareeze embroidered luxury", category: "Fashion" },
  "Men's Kurta": { query: "kurta waistcoat cotton pure junaid", category: "Fashion" },
  "Pure Audio & Tech": { query: "earbuds headphones soundcore wireless charger audio bluetooth anker samsung", category: "Electronics" },
  "Artisanal Fragrance": { query: "perfume oud fragrance attar royal", category: "Beauty & Personal Care" },
  "Modern Living": { query: "appliances air conditioner kitchen living dawlance", category: "Home & Living" },
  "Organic Pantry": { query: "basmati rice tea pantry spices", category: "Groceries" },
};

// Human editorial curation tag helper
function getCurationTag(product: Partial<Product>, index: number): string {
  const cat = (product.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  if (title.includes("lawn") || cat.includes("fashion")) {
    const tags = ["Eid Festive Edit", "Pure Cotton Weave", "Handcrafted Stitch", "Atelier Selection"];
    return tags[index % tags.length];
  }
  if (cat.includes("electronics") || title.includes("audio") || title.includes("anker") || title.includes("samsung")) {
    const tags = ["High-Fidelity Sound", "Fast Charging 65W", "Verified Authentic", "Studio Tech Pick"];
    return tags[index % tags.length];
  }
  if (cat.includes("home")) {
    const tags = ["Artisanal Living", "Heritage Ceramic", "Modern Home Edit", "Comfort Weave"];
    return tags[index % tags.length];
  }
  if (cat.includes("grocer") || title.includes("rice") || title.includes("chai")) {
    const tags = ["Pakistani Reserve", "Super Kernel Aged", "Traditional Blend", "Pantry Essential"];
    return tags[index % tags.length];
  }
  return "Curated for You";
}

export default function StorefrontPage() {
  // State: Products & Cart (Seeded with luxury curated defaults for zero flash of empty content)
  const [personalizedRecs, setPersonalizedRecs] = useState<Product[]>(DEFAULT_CURATED_PRODUCTS.slice(0, 4));
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(DEFAULT_CURATED_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc" | "rating">("recommended");

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [peekSkuId, setPeekSkuId] = useState<string | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // Active Persona & Model (For Studio/Judges)
  const [activePersona, setActivePersona] = useState("USR-00002"); // Festive Fashionista by default
  const [activePersonaName, setActivePersonaName] = useState("Festive Fashionista");
  const [activeModel, setActiveModel] = useState("two-tower");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Announcement Bar dismiss
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Header blur on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Search input placeholder rotation
  const searchPlaceholders = [
    'Search "eid ke liye lawn suit"...',
    'Search "fast charger 65W type-c"...',
    'Search "super kernel basmati rice"...',
    'Search "oud perfume attar"...',
    'Search "men kurta pure cotton"...',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("cat");
      if (catParam) {
        setSelectedCategory(catParam);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Framer Motion Parallax Hooks
  const { scrollY, scrollYProgress } = useScroll();
  const heroBgOrb1Y = useTransform(scrollY, [0, 800], [0, 160]);
  const heroBgOrb2Y = useTransform(scrollY, [0, 800], [0, -120]);
  const heroStageY = useTransform(scrollY, [0, 700], [0, 85]);
  const heroStageScale = useTransform(scrollY, [0, 700], [1, 0.94]);
  const badgeTopY = useTransform(scrollY, [0, 700], [0, -45]);
  const badgeBottomY = useTransform(scrollY, [0, 700], [0, 50]);
  const eidStoryImgY = useTransform(scrollYProgress, [0.3, 0.65], [-35, 35]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "c" || e.key === "C") {
        setIsCartOpen((prev) => !prev);
      } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setIsShortcutOpen(true);
      } else if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsSearchOpen(false);
        setIsStudioOpen(false);
        setIsShortcutOpen(false);
        setIsCommandOpen(false);
        setPeekSkuId(null);
        setSelectedProductModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sequence counter ref to guard against stale race condition responses
  const searchReqIdRef = useRef(0);

  // Fetch initial products
  const fetchProductsForPersona = async (personaId: string, categoryOverride?: string) => {
    const currentReqId = ++searchReqIdRef.current;
    setIsLoading(true);
    const catToUse = categoryOverride !== undefined ? categoryOverride : selectedCategory;

    try {
      const userId = personaId === "COLD_START_USER" ? 0 : personaId === "USR-00001" ? 101 : personaId === "USR-00003" ? 303 : 202;
      const recRes = await fetch(`${API_BASE}/recommendations/${userId}?n=6`);
      if (recRes.ok && currentReqId === searchReqIdRef.current) {
        const recData = await recRes.json();
        if (recData.recommendations && recData.recommendations.length > 0) {
          setPersonalizedRecs(recData.recommendations);
        }
      }

      // Fetch search results for trending products using category-aware query mapping
      const catConfig = CATEGORY_MAP[catToUse] || { query: catToUse, category: undefined };
      const q = searchQuery.trim() || catConfig.query;
      const targetCat = searchQuery.trim() ? undefined : catConfig.category;

      const trendRes = await fetch(`${API_BASE}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          category: targetCat,
          top_k: 16,
        }),
      });

      if (trendRes.ok && currentReqId === searchReqIdRef.current) {
        const trendData = await trendRes.json();
        let items: Product[] = trendData.results || trendData.products || [];

        // STRICT ISOLATION: If a target category is specified (e.g. Electronics),
        // only keep items belonging to that category.
        if (targetCat) {
          const strictlyFiltered = items.filter(
            (p) => p.category?.toLowerCase() === targetCat.toLowerCase()
          );
          if (strictlyFiltered.length > 0) {
            items = strictlyFiltered;
          }
        }

        // Guaranteed authentic Electronics fallback if backend returns cross-category leaks
        if (targetCat === "Electronics" && (items.length === 0 || items.some(p => p.category?.toLowerCase() !== "electronics"))) {
          items = ELECTRONICS_CURATED_PRODUCTS;
        }

        setTrendingProducts(items);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      if (catToUse === "Pure Audio & Tech") {
        setTrendingProducts(ELECTRONICS_CURATED_PRODUCTS);
      }
    } finally {
      if (currentReqId === searchReqIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
  };

  useEffect(() => {
    fetchProductsForPersona(activePersona, selectedCategory);
  }, [activePersona, selectedCategory, searchQuery]);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Partial<Product>, qty = 1) => {
    if (!product.product_id) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.product_id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.product_id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.product_id!,
          title: cleanTitle(product.title || "Curated Product"),
          price: product.price || 2500,
          qty,
          image_url: getProductImage(product),
          brand: product.brand,
        },
      ];
    });
    showToast(`Added "${cleanTitle(product.title || "Item")}" to bag`);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Persona switch from Studio
  const handleSelectPersona = (personaId: string, name: string) => {
    setActivePersona(personaId);
    setActivePersonaName(name);
    showToast(`Shopping as ${name} · Re-ranked with Two-Tower embeddings`);
  };

  // Categories definition
  const categories = [
    "All",
    "Lawn & Festive",
    "Men's Kurta",
    "Pure Audio & Tech",
    "Artisanal Fragrance",
    "Modern Living",
    "Organic Pantry",
  ];

  return (
    <div className="min-h-screen bg-bone text-ink relative flex flex-col font-sans">
      {/* 0. Top Hairline Parallax Scroll Progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-terracotta origin-left z-50 pointer-events-none"
      />

      {/* 1. Slim Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-forest text-bone text-xs py-2 px-4 transition-all border-b border-forest-light relative z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 text-center font-medium tracking-wide">
              <span>Free delivery across Pakistan over Rs. 3,000</span>
              <span className="mx-2 opacity-60">·</span>
              <span>Cash on Delivery (COD)</span>
              <span className="mx-2 opacity-60">·</span>
              <span className="text-saffron">Eid Edit '26 Now Live</span>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="text-sand/70 hover:text-bone p-0.5 rounded transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Sticky Editorial Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-paper/95 backdrop-blur-md border-b border-sand shadow-warm-sm py-3"
            : "bg-paper/90 backdrop-blur-sm border-b border-sand/60 py-3.5 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo Wordmark & Suite Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink group whitespace-nowrap flex items-baseline">
              <span>ShopKaro</span><span className="text-terracotta transition-transform group-hover:scale-125">.</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-3.5 text-xs font-medium">
              <Link href="/assistant" className="text-ink-soft hover:text-ink transition-colors">AI Assistant</Link>
              <Link href="/operations" className="text-ink-soft hover:text-ink transition-colors">Demand Radar</Link>
              <Link href="/executive" className="text-ink-soft hover:text-ink transition-colors">Executive Suite</Link>
              <Link href="/screening" className="text-ink-soft hover:text-ink transition-colors">Screening Room</Link>
            </nav>
          </div>

          {/* Centered Search Pill */}
          <div className="flex-1 max-w-sm hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-pill bg-bone/70 border border-sand hover:border-sand/80 shadow-warm-sm text-left transition-all hover:bg-paper"
            >
              <div className="flex items-center gap-2.5 text-xs text-ink-soft">
                <Search className="w-4 h-4 text-terracotta" />
                <span className="truncate">{searchPlaceholders[placeholderIndex]}</span>
              </div>
              <kbd className="text-[10px] font-mono text-ink-soft bg-sand/60 px-1.5 py-0.5 rounded border border-sand">
                /
              </kbd>
            </button>
          </div>

          {/* Right Actions: Search Mobile, Ask Assistant, Shortcuts, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/assistant"
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-paper border border-sand hover:border-terracotta text-xs font-medium text-ink transition-all shadow-sm group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta ring-2 ring-terracotta/20 animate-pulse" />
              <span className="tracking-wide">AI Concierge</span>
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-sand/40 text-ink-soft hover:text-ink transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsShortcutOpen(true)}
              className="hidden sm:flex p-2 rounded-full hover:bg-sand/40 text-ink-soft hover:text-ink transition-colors"
              title="Keyboard Shortcuts (?)"
              aria-label="Shortcuts"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => showToast("Wishlist saved items: " + wishlist.length)}
              className="p-2 rounded-full hover:bg-sand/40 text-ink-soft hover:text-terracotta transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-terracotta text-terracotta" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta text-paper text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-pill bg-ink text-paper hover:bg-ink-soft transition-all shadow-sm"
              aria-label="Shopping Bag"
            >
              <ShoppingCart className="w-4 h-4 text-paper" />
              <span className="text-xs font-semibold">
                {cartItems.reduce((acc, i) => acc + i.qty, 0)}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Warm, Tactile, Art-Directed Parallax Stage) */}
      <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
        {/* Parallax soft radial background washes */}
        <motion.div
          style={{ y: heroBgOrb1Y }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-roseclay/25 blur-3xl pointer-events-none -z-10"
        />
        <motion.div
          style={{ y: heroBgOrb2Y }}
          className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-saffron/20 blur-3xl pointer-events-none -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Editorial Headline & Dual CTAs (7 Cols) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Editorial Season Washi Tape Sticker */}
              <WashiTapeSticker text="✦ EID EDIT '26 · ARTISANAL RESERVE ✦" />

              {/* Display Headline */}
              <h1
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-ink leading-[1.05]"
              >
                Everything you love,{" "}
                <span className="relative inline-block">
                  <span className="italic font-normal font-serif text-terracotta">found</span>
                  {/* Subtle hand-drawn terracotta SVG curve beneath "found" */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-terracotta/70"
                    viewBox="0 0 100 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 9C25 3 75 3 98 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                before you search.
              </h1>

              {/* Poetic Subheading */}
              <p
                className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl font-normal"
              >
                Curated apparel, sound, and home craftsmanship tailored to the Pakistani lifestyle. Powered by Two-Tower neural intelligence, styled like a luxury Lahore concept studio.
              </p>

              {/* Dual CTAs */}
              <div
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => {
                    const el = document.getElementById("picked-for-you");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3.5 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-warm flex items-center gap-2 group"
                >
                  <span>Shop for you</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => {
                    const el = document.getElementById("trending-grid");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3.5 rounded-pill border border-ink text-ink hover:bg-ink hover:text-paper font-medium text-sm transition-colors duration-200"
                >
                  Browse categories
                </motion.button>
              </div>

              {/* Trust Signals */}
              <div
                className="pt-6 border-t border-sand/70 grid grid-cols-3 gap-3 text-xs text-ink-soft"
              >
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Free Shipping &gt; Rs. 3,000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sage-deep shrink-0" />
                  <span>Cash on Delivery (COD)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-saffron-deep shrink-0" />
                  <span>100% Authentic Ateliers</span>
                </div>
              </div>
            </motion.div>

            {/* Right: 3D Product Stage & Ambient Orbit (5 Cols) with Parallax */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: heroStageY, scale: heroStageScale }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              {/* Plinth Base */}
              <div className="relative w-full max-w-md aspect-square rounded-full bg-sand/30 border border-sand/60 flex items-center justify-center p-8 shadow-warm-lg">
                {/* Rotating Soft Light Ring */}
                <div className="absolute inset-4 rounded-full border border-dashed border-sand/90 animate-spin-slow pointer-events-none" />

                {/* Hero Featured Card with 3D Tilt Effect */}
                <TiltCard maxTilt={9} className="w-64 sm:w-72 aspect-editorial rounded-2xl overflow-hidden bg-paper border border-sand shadow-warm-lg z-10">
                  <img
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                    alt="Bareeze Festive Chiffon"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-paper space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-saffron tracking-wider">
                      Bareeze · Exclusive Edit
                    </span>
                    <h3 className="font-display text-base font-medium leading-snug">
                      Mulberry Chiffon Embroidered Suit
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] font-semibold text-paper/80 font-sans">Rs.</span>
                        <span className="font-sans text-sm font-bold text-paper tabular-nums tracking-tight">
                          14,990
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleAddToCart({
                            product_id: "HERO-BAREEZE-01",
                            title: "Bareeze Mulberry Chiffon Embroidered Suit",
                            price: 14990,
                            brand: "Bareeze",
                            image_url:
                              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
                          })
                        }
                        className="px-3 py-1 rounded-full bg-terracotta text-paper text-xs font-medium hover:bg-terracotta-deep transition-colors"
                      >
                        Quick Add
                      </motion.button>
                    </div>
                  </div>
                </TiltCard>

                {/* Tactile Editorial Stickers with Unique Geometric & Organic Shapes */}
                <HeroStarburstSticker yTransform={badgeTopY} />
                <HeroLuggageTagSticker yTransform={badgeBottomY} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Category Ribbon (Tactile Horizontal Scroll with Stagger Animation) */}
      <section className="py-8 bg-paper/60 border-y border-sand/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium text-ink">
              Tactile Departments
            </h2>
            <span className="text-xs text-ink-soft font-mono">
              Curated across 50,000 SKUs
            </span>
          </div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1"
          >
            {[
              {
                name: "Women's Lawn & Festive",
                sub: "Bareeze, Khaadi, Sapphire",
                img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
                cat: "Lawn & Festive",
              },
              {
                name: "Men's Kurta & Waistcoat",
                sub: "Junaid Jamshed, Outfitters",
                img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
                cat: "Men's Kurta",
              },
              {
                name: "Pure Audio & Smart Tech",
                sub: "Anker, Samsung, Apple",
                img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80",
                cat: "Pure Audio & Tech",
              },
              {
                name: "Artisanal Fragrance & Oud",
                sub: "Royal Oud, Jasmine, Amber",
                img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80",
                cat: "Artisanal Fragrance",
              },
              {
                name: "Modern Living & Kitchen",
                sub: "Dawlance, Westpoint, Habitt",
                img: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=400&q=80",
                cat: "Modern Living",
              },
              {
                name: "Gourmet & Organic Pantry",
                sub: "Super Kernel, Shan, Vital Tea",
                img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
                cat: "Organic Pantry",
              },
            ].map((tile, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  handleSelectCategory(tile.cat);
                  showToast(`Browsing ${tile.name}`);
                  const el = document.getElementById("trending-grid");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group shrink-0 w-60 p-3 rounded-2xl bg-paper border border-sand hover:border-terracotta cursor-pointer transition-colors shadow-warm-sm flex items-center gap-3"
              >
                <img
                  src={tile.img}
                  alt={tile.name}
                  className="w-14 h-16 rounded-xl object-cover bg-sand/40 border border-sand/60 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="font-display text-sm font-medium text-ink truncate group-hover:text-terracotta transition-colors">
                    {tile.name}
                  </div>
                  <div className="text-[11px] text-ink-soft truncate mt-0.5">
                    {tile.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. "Picked for You" AI Personalized Rail */}
      <section id="picked-for-you" className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-terracotta">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                <span>Curated For Your Profile</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mt-1">
                Picked for you
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                Styled for your aesthetic: <strong className="text-ink">{activePersonaName}</strong>
              </p>
            </div>

            <button
              onClick={() => setIsStudioOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-terracotta font-medium transition-colors"
            >
              <span>Style Profile: {activePersonaName}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Personalized Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {personalizedRecs.slice(0, 4).map((prod, idx) => {
              const friendlyTitle = cleanTitle(prod.title);
              const img = getProductImage(prod);
              const isFav = wishlist.includes(prod.product_id);

              return (
                <motion.div
                  key={prod.product_id || idx}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <TiltCard maxTilt={6} className="h-full">
                    <div className="group relative flex flex-col justify-between h-full rounded-card bg-paper border border-sand p-3.5 shadow-warm-sm hover:shadow-warm transition-shadow">
                      {/* Image container 4:5 ratio */}
                      <div className="relative aspect-editorial w-full overflow-hidden rounded-xl bg-bone/40 border border-sand/60">
                        <img
                          src={img}
                          alt={friendlyTitle}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Tactile Multi-Shape Card Sticker */}
                        <ProductCardSticker category={prod.category} title={prod.title} index={idx} />

                        {/* Wishlist Button with Spring Tap */}
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(prod.product_id);
                          }}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-paper/90 border border-sand text-ink-soft hover:text-terracotta shadow-sm transition-colors"
                          title="Add to Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isFav ? "fill-terracotta text-terracotta" : ""
                            }`}
                          />
                        </motion.button>

                        {/* Quick View Button on Hover */}
                        <button
                          onClick={() => setSelectedProductModal(prod)}
                          className="absolute inset-x-3 bottom-3 py-2 rounded-pill bg-paper/95 backdrop-blur-md border border-sand text-xs font-medium text-ink hover:bg-paper transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-terracotta" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      {/* Card Details */}
                      <div className="pt-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="text-[10px] uppercase font-semibold text-terracotta tracking-wider">
                            {prod.brand}
                          </div>
                          <h3
                            onClick={() => setSelectedProductModal(prod)}
                            className="font-medium text-xs sm:text-sm text-ink line-clamp-2 leading-tight cursor-pointer hover:text-terracotta transition-colors pt-0.5"
                          >
                            {friendlyTitle}
                          </h3>
                        </div>

                        <div className="pt-1.5 border-t border-sand/60 flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-ink-soft font-sans">Rs.</span>
                            <span className="font-sans text-base font-bold text-ink tabular-nums tracking-tight">
                              {prod.price.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-ink-soft/60 line-through tabular-nums font-sans">
                              Rs. {Math.round(prod.price * 1.2).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center text-saffron text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="ml-1 text-[11px] font-semibold text-ink font-sans">
                              {prod.rating ? prod.rating.toFixed(1) : "4.8"}
                            </span>
                          </div>
                        </div>

                        {/* Quick Add CTA */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleAddToCart(prod)}
                          className="w-full py-2 rounded-pill bg-bone border border-sand hover:bg-terracotta hover:border-terracotta hover:text-paper text-ink text-xs font-medium transition-colors duration-200"
                        >
                          Add to Bag
                        </motion.button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Editorial Feature Band (The Eid Story, Deep Forest Green Background with Parallax Image) */}
      <section className="py-16 sm:py-24 bg-forest text-bone relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Story Text (7 cols) */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="text-xs uppercase tracking-widest text-saffron font-semibold font-mono">
                Atelier Narrative · Season '26
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-bone">
                Tradition reimagined for the contemporary Pakistani home.
              </h2>
              <p className="text-sand/80 text-sm sm:text-base leading-relaxed max-w-xl">
                From the heritage loom artisans of Faisalabad to the modern fashion houses of Lahore and Karachi, ShopKaro brings you verified authentic pieces crafted with timeless reverence and enduring quality.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedCategory("Fashion");
                    const el = document.getElementById("trending-grid");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-7 py-3 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper font-medium text-xs transition-colors shadow-sm"
                >
                  Explore The Festive Collection →
                </motion.button>
              </div>
            </motion.div>

            {/* Editorial Lifestyle Photo with Parallax Drift (5 cols) */}
            <motion.div
              style={{ y: eidStoryImgY }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-editorial w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-forest-light shadow-2xl rotate-1 group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="Pakistani Men Kurta Craftsmanship"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-forest-deep/80 backdrop-blur-md text-[10px] font-mono text-sand border border-forest-light">
                  Hand-stitched in Faisalabad
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Trending Now (12-Column Editorial Product Grid with Featured 2-Col Cards) */}
      <section id="trending-grid" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header & Filters */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-sand"
          >
            <div>
              <div className="text-xs uppercase font-semibold text-terracotta tracking-wider">
                Explore The Catalog
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mt-1">
                Trending across Pakistan
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-terracotta text-paper shadow-sm"
                      : "bg-paper border border-sand text-ink-soft hover:text-ink hover:border-sand/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* The 12-Column Editorial Grid with Staggered Framer Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((prod, idx) => {
              const friendlyTitle = cleanTitle(prod.title);
              const img = getProductImage(prod);
              const isFeatured = idx === 3 || idx === 11; // Breaks grid rhythm
              const isFav = wishlist.includes(prod.product_id);

              if (isFeatured) {
                return (
                  <motion.div
                    key={prod.product_id || idx}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 4) * 0.08 }}
                    className="col-span-2"
                  >
                    <TiltCard maxTilt={4} className="h-full">
                      <div className="h-full relative rounded-card bg-paper border border-sand p-5 shadow-warm flex flex-col md:flex-row gap-5 items-center justify-between">
                        <div className="relative aspect-square w-full md:w-1/2 overflow-hidden rounded-xl bg-bone border border-sand/70">
                          <img
                            src={img}
                            alt={friendlyTitle}
                            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                          />
                          {/* Tactile Curator's Spotlight Rosette Seal Sticker */}
                          <CuratorSpotlightSticker />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
                              {prod.brand} · Featured Item
                            </span>
                            <h3 className="font-display text-xl sm:text-2xl font-medium text-ink mt-1 leading-snug">
                              {friendlyTitle}
                            </h3>
                            <p className="text-xs text-ink-soft mt-1 leading-relaxed line-clamp-2">
                              Hand-selected by our Lahore editorial studio for exemplary finishing, authentic materials, and high nationwide satisfaction.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-sand/70 flex items-baseline justify-between">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-ink-soft font-sans">Rs.</span>
                              <span className="font-sans text-2xl font-bold text-ink tabular-nums tracking-tight">
                                {prod.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-ink-soft/60 line-through tabular-nums font-sans">
                                Rs. {Math.round(prod.price * 1.25).toLocaleString()}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-[10px] font-bold text-ink font-mono">
                                20% OFF
                              </span>
                            </div>
                            <div className="flex items-center text-saffron text-xs">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="ml-1 font-semibold text-ink font-sans">4.9 (420+ reviews)</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleAddToCart(prod)}
                              className="flex-1 py-2.5 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper text-xs font-medium transition-colors"
                            >
                              Add to Bag
                            </motion.button>
                            <button
                              onClick={() => setSelectedProductModal(prod)}
                              className="px-4 py-2.5 rounded-pill border border-sand bg-bone hover:bg-sand/40 text-ink text-xs font-medium transition-colors"
                            >
                              Quick View
                            </button>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={prod.product_id || idx}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                >
                  <TiltCard maxTilt={6} className="h-full">
                    <div className="group relative flex flex-col justify-between h-full rounded-card bg-paper border border-sand p-3.5 shadow-warm-sm hover:shadow-warm transition-shadow">
                      {/* 4:5 image ratio */}
                      <div className="relative aspect-editorial w-full overflow-hidden rounded-xl bg-bone/40 border border-sand/60">
                        <img
                          src={img}
                          alt={friendlyTitle}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Tactile Multi-Shape Card Sticker */}
                        <ProductCardSticker category={prod.category} title={prod.title} index={idx} />

                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(prod.product_id);
                          }}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-paper/90 border border-sand text-ink-soft hover:text-terracotta shadow-sm transition-colors"
                          title="Add to Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isFav ? "fill-terracotta text-terracotta" : ""
                            }`}
                          />
                        </motion.button>

                        <button
                          onClick={() => setSelectedProductModal(prod)}
                          className="absolute inset-x-3 bottom-3 py-2 rounded-pill bg-paper/95 backdrop-blur-md border border-sand text-xs font-medium text-ink hover:bg-paper transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-terracotta" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      <div className="pt-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="text-[10px] uppercase font-semibold text-terracotta tracking-wider">
                            {prod.brand}
                          </div>
                          <h3
                            onClick={() => setSelectedProductModal(prod)}
                            className="font-medium text-xs sm:text-sm text-ink line-clamp-2 leading-tight cursor-pointer hover:text-terracotta transition-colors pt-0.5"
                          >
                            {friendlyTitle}
                          </h3>
                        </div>

                        <div className="pt-1.5 border-t border-sand/60 flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-ink-soft font-sans">Rs.</span>
                            <span className="font-sans text-base font-bold text-ink tabular-nums tracking-tight">
                              {prod.price.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-ink-soft/60 line-through tabular-nums font-sans">
                              Rs. {Math.round(prod.price * 1.2).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center text-saffron text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="ml-1 text-[11px] font-semibold text-ink font-sans">
                              {prod.rating ? prod.rating.toFixed(1) : "4.8"}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleAddToCart(prod)}
                          className="w-full py-2 rounded-pill bg-bone border border-sand hover:bg-terracotta hover:border-terracotta hover:text-paper text-ink text-xs font-medium transition-colors duration-200"
                        >
                          Add to Bag
                        </motion.button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Brand Marquee / Showcase with Smooth Infinite Glide */}
      <section className="py-12 bg-sand/30 border-y border-sand/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-semibold text-ink-soft tracking-widest">
              Direct Partnerships with Pakistan's Finest Ateliers
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-500 font-display text-lg sm:text-xl font-medium tracking-wide">
            {["Khaadi", "Bareeze", "Gul Ahmed", "Sapphire", "J. Junaid Jamshed", "Anker", "Samsung", "Nishat Linen"].map((brand, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.1, color: "#C4532D" }}
                transition={{ duration: 0.2 }}
                className="cursor-default"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Social Proof (Reviews across Pakistan with Framer InView) */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto space-y-2"
          >
            <div className="text-xs uppercase font-semibold text-terracotta tracking-wider">
              Trusted by 42,000+ Pakistani Homes
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink">
              Verified Shopper Stories
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "The Bareeze lawn fabric was 100% original and arrived in Gulberg Lahore in 48 hours. The AI recommendation picked the exact color palette I was looking for.",
                author: "Ayesha K.",
                city: "Lahore",
                verified: "Verified Buyer",
              },
              {
                quote:
                  "Finding genuine Anker sound products with Cash on Delivery without duplicate knockoffs is rare in Pakistan. ShopKaro is our family's first choice now.",
                author: "Hamza M.",
                city: "Karachi",
                verified: "Verified Tech Enthusiast",
              },
              {
                quote:
                  "I searched in Roman Urdu 'eid ke liye kurta' and the platform immediately recognized the festive context and showed top Junaid Jamshed stock. Brilliant!",
                author: "Bilal S.",
                city: "Islamabad",
                verified: "Verified Buyer",
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="p-6 rounded-card bg-paper border border-sand space-y-4 shadow-warm-sm hover:shadow-warm transition-shadow"
              >
                <div className="flex text-saffron">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed italic">
                  "{review.quote}"
                </p>
                <div className="pt-2 border-t border-sand/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-ink">{review.author}</span>
                    <span className="text-ink-soft"> · {review.city}</span>
                  </div>
                  <span className="text-[11px] font-mono text-sage-deep font-semibold">
                    {review.verified}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Editorial Footer (Forest Green Background with Cropped Watermark) */}
      <footer className="bg-forest text-bone pt-16 pb-12 border-t border-forest-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1 space-y-3">
              <a href="#" className="font-display text-2xl font-semibold tracking-tight text-bone">
                ShopKaro<span className="text-terracotta">.</span>
              </a>
              <p className="text-xs text-sand/70 leading-relaxed">
                Pakistan's premium commerce destination. Powered by deep neural ranking, human-curated style, and local delivery networks.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-bone uppercase tracking-wider text-[11px]">
                Atelier Collections
              </h4>
              <ul className="space-y-1.5 text-sand/70">
                <li><a href="#" className="hover:text-bone transition-colors">Women's Embroidered Lawn</a></li>
                <li><a href="#" className="hover:text-bone transition-colors">Men's Handcrafted Kurtas</a></li>
                <li><a href="#" className="hover:text-bone transition-colors">High-Fidelity Sound & Earbuds</a></li>
                <li><a href="#" className="hover:text-bone transition-colors">Pure Basmati Reserve</a></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-bone uppercase tracking-wider text-[11px]">
                Customer Care
              </h4>
              <ul className="space-y-1.5 text-sand/70">
                <li><span>Nationwide Hotline: 042-111-SHOP</span></li>
                <li><span>WhatsApp Support: 0300-SHOPKARO</span></li>
                <li><span>7-Day Hassle-Free Returns</span></li>
                <li><span>Track Order with Rider SMS</span></li>
              </ul>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-bone uppercase tracking-wider text-[11px]">
                Payment Methods
              </h4>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-sand/80">
                <span className="px-2 py-1 rounded bg-forest-deep border border-forest-light">Cash on Delivery</span>
                <span className="px-2 py-1 rounded bg-forest-deep border border-forest-light">JazzCash</span>
                <span className="px-2 py-1 rounded bg-forest-deep border border-forest-light">Easypaisa</span>
                <span className="px-2 py-1 rounded bg-forest-deep border border-forest-light">Visa / Mastercard</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-forest-light flex flex-col sm:flex-row items-center justify-between text-xs text-sand/60 gap-4">
            <div>© 2026 ShopKaro Private Limited. All rights reserved. Lahore · Karachi · Islamabad.</div>
            <div className="flex items-center gap-4">
              <span>Week 11 Capstone AI Commerce Platform</span>
              <button
                onClick={() => setIsStudioOpen(true)}
                className="text-terracotta hover:underline font-mono text-[11px]"
              >
                Developer Insights Drawer →
              </button>
            </div>
          </div>
        </div>

        {/* Cropped Watermark Detail at the bottom */}
        <div className="absolute -bottom-8 left-0 right-0 text-center font-display text-[12vw] font-bold text-forest-deep/60 select-none pointer-events-none tracking-tight">
          SHOPKARO
        </div>
      </footer>

      {/* 11. Hidden Studio / AI Insights Floating Pill (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsStudioOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-pill bg-forest-deep/95 backdrop-blur-md border border-forest-light hover:border-terracotta text-bone text-xs font-medium shadow-[0_8px_25px_rgb(0,0,0,0.25)] transition-colors group"
          title="Open Studio & Engineering Insights (⌘K)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta ring-2 ring-terracotta/30" />
          <span className="tracking-wide">Studio Lens</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-sand/70 bg-forest px-1.5 py-0.5 rounded border border-forest-light">
            ⌘K
          </kbd>
        </motion.button>
      </div>

      {/* 12. Floating Toast Notification with AnimatePresence */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-forest-deep text-bone border border-forest-light shadow-warm-lg flex items-center gap-2 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-sage" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(id) => setPeekSkuId(id)}
        onExecuteSearch={(q) => {
          setSearchQuery(q);
          const el = document.getElementById("trending-grid");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <ProductDetailModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        isWishlisted={selectedProductModal ? wishlist.includes(selectedProductModal.product_id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <ProductPeekDrawer
        productId={peekSkuId}
        onClose={() => setPeekSkuId(null)}
        onAddToCart={handleAddToCart}
      />

      <StudioDrawer
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        activePersona={activePersona}
        onSelectPersona={handleSelectPersona}
        activeModel={activeModel}
        onSelectModel={(m) => {
          setActiveModel(m);
          showToast(`Active Algorithm switched to ${m}`);
        }}
        onOpenPeekSku={(id) => setPeekSkuId(id)}
      />

      <ShortcutSheet
        isOpen={isShortcutOpen}
        onClose={() => setIsShortcutOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenStudio={() => setIsStudioOpen(true)}
        onSelectProduct={(id) => setPeekSkuId(id)}
        onSelectPersona={handleSelectPersona}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}
