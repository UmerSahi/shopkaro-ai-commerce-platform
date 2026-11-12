"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles, ArrowRight, Tag, Layers, TrendingUp } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onExecuteSearch: (query: string) => void;
}

export function SearchOverlay({
  isOpen,
  onClose,
  onSelectProduct,
  onExecuteSearch,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const curatedSuggestions = [
    { text: "eid ke liye lawn suit", tag: "Roman Urdu · Festive" },
    { text: "fast charger 65W type-c", tag: "Tech · Anker" },
    { text: "super kernel basmati rice", tag: "Pantry · Guard" },
    { text: "men kurta pure cotton", tag: "Men's · Junaid Jamshed" },
    { text: "oud perfume attar", tag: "Fragrance · Royal Oud" },
  ];

  const popularBrands = ["Khaadi", "Bareeze", "Gul Ahmed", "Sapphire", "Anker", "J.", "Samsung"];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setLiveResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setLiveResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim(), n: 6 }),
        });
        if (res.ok) {
          const data = await res.json();
          setLiveResults(data.results || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onExecuteSearch(query.trim());
      onClose();
    }
  };

  const isRomanUrdu = /eid|suit|kurta|chappal|khussa|chawal|chai|garmi|kapray|jora/i.test(query);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-ink/40 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-paper border border-sand rounded-2xl shadow-warm-lg overflow-hidden flex flex-col text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center px-5 py-4 border-b border-sand bg-bone/40">
          <Search className="w-5 h-5 text-terracotta shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or Roman Urdu (e.g. 'eid ke liye lawn suit')..."
            className="w-full bg-transparent border-0 px-3 py-1 text-sm font-sans text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-0"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-sand/40"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-ink-soft bg-sand/60 rounded border border-sand">
              ESC
            </kbd>
          )}
        </form>

        {/* Roman Urdu Intent Banner */}
        {isRomanUrdu && (
          <div className="px-5 py-2.5 bg-bone/70 border-b border-sand flex items-center gap-2.5 text-xs text-ink-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
            <span>
              Pakistani dialect recognized: searching with semantic intent for{" "}
              <strong className="text-ink font-semibold">"{query}"</strong>
            </span>
          </div>
        )}

        {/* Live Results or Suggestions */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-ink-soft">
              <div className="w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Searching through 50,000 Pakistani SKUs...</span>
            </div>
          ) : liveResults.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-ink-soft">
                <span>Matching Products</span>
                <span className="font-mono text-[11px]">{liveResults.length} found</span>
              </div>
              <div className="divide-y divide-sand/50">
                {liveResults.map((item) => (
                  <div
                    key={item.product_id}
                    onClick={() => {
                      onSelectProduct(item.product_id);
                      onClose();
                    }}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-sand/30 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80"}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-lg bg-sand/30 border border-sand/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-semibold text-terracotta tracking-wider">
                        {item.brand} · {item.category}
                      </div>
                      <h4 className="text-xs font-medium text-ink truncate group-hover:text-terracotta transition-colors">
                        {item.title}
                      </h4>
                      <div className="font-sans text-xs font-bold text-ink pt-0.5 tabular-nums">
                        Rs. {item.price?.toLocaleString()}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-terracotta opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : query.trim() ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-medium text-ink">No exact matches for "{query}"</p>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                Try searching in Roman Urdu like "lawn suit", "kurtas", or popular brands like "Bareeze", "Anker".
              </p>
            </div>
          ) : (
            <>
              {/* Popular Searches */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5 text-terracotta" />
                  <span>Curated Suggestions & Roman Urdu</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {curatedSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(s.text);
                        onExecuteSearch(s.text);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bone/70 border border-sand text-xs text-ink hover:bg-sand/50 hover:border-sand transition-colors text-left"
                    >
                      <span>{s.text}</span>
                      <span className="text-[10px] text-ink-soft/80 font-mono">({s.tag})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2 pt-2 border-t border-sand/60">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-saffron-deep" />
                  <span>Featured Ateliers & Brands</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularBrands.map((brand, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(brand);
                        onExecuteSearch(brand);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-full bg-paper border border-sand text-xs text-ink-soft hover:text-ink hover:border-terracotta transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

