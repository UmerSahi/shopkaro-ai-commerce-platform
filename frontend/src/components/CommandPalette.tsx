"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Compass, Package, UserCheck, Layers, Sparkles, X, Sliders } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectPersona: (persona: string, name: string) => void;
  onOpenCart: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenStudio,
  onSelectProduct,
  onSelectPersona,
  onOpenCart,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    // Personas
    {
      id: "p-fash",
      label: "Shop as: Festive Fashionista (Bareeze, Embroidered Lawn)",
      category: "Persona",
      action: () => onSelectPersona("USR-00002", "Festive Fashionista"),
    },
    {
      id: "p-tech",
      label: "Shop as: Tech Enthusiast (Samsung S24, Anker Audio)",
      category: "Persona",
      action: () => onSelectPersona("USR-00001", "Tech Enthusiast"),
    },
    {
      id: "p-home",
      label: "Shop as: Home & Living Homemaker (Dawlance AC, Bedsheets)",
      category: "Persona",
      action: () => onSelectPersona("USR-00003", "Home & Kitchen"),
    },
    {
      id: "p-cold",
      label: "Shop as: Cold-Start Guest Shopper (Seasonal Popularity)",
      category: "Persona",
      action: () => onSelectPersona("COLD_START_USER", "Cold-Start Shopper"),
    },

    // Actions & Studio
    {
      id: "act-studio",
      label: "Open Studio AI Insights Console (Latency, NDCG, LightGBM)",
      category: "Developer / Judge",
      action: () => onOpenStudio(),
    },
    {
      id: "act-cart",
      label: "View Shopping Bag & Delivery Threshold",
      category: "Navigation",
      action: () => onOpenCart(),
    },

    // Top SKUs
    {
      id: "sku-lawn",
      label: "Inspect SKU-10492: Gul Ahmed Festive Lawn Suit (Stockout Risk)",
      category: "SKU Inspect",
      action: () => onSelectProduct("SKU-10492"),
    },
    {
      id: "sku-s24",
      label: "Inspect SKU-00104: Samsung Galaxy S24 Ultra Titanium",
      category: "SKU Inspect",
      action: () => onSelectProduct("SKU-00104"),
    },
    {
      id: "sku-rice",
      label: "Inspect SKU-05820: Super Kernel Basmati Rice 5kg",
      category: "SKU Inspect",
      action: () => onSelectProduct("SKU-05820"),
    },
    {
      id: "sku-ac",
      label: "Inspect SKU-18230: Dawlance 1.5 Ton Energy Inverter AC",
      category: "SKU Inspect",
      action: () => onSelectProduct("SKU-18230"),
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/40 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-paper border border-sand rounded-2xl shadow-warm-lg overflow-hidden flex flex-col text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-5 py-4 border-b border-sand bg-bone/40">
          <Search className="w-5 h-5 text-terracotta shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to persona / SKU..."
            className="w-full bg-transparent border-0 px-3 py-1 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-ink-soft bg-sand/60 rounded border border-sand">
            ESC
          </kbd>
        </div>

        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink-soft">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-sand/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sand/60 flex items-center justify-center text-ink-soft group-hover:bg-terracotta group-hover:text-paper transition-colors shrink-0">
                    <span className="text-[11px] font-mono font-medium">⌘</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink group-hover:text-terracotta transition-colors">
                      {cmd.label}
                    </div>
                    <div className="text-[10px] text-ink-soft font-mono uppercase tracking-wider">
                      {cmd.category}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
