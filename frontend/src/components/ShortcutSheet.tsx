"use client";

import React from "react";
import { X, Keyboard } from "lucide-react";

interface ShortcutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutSheet({ isOpen, onClose }: ShortcutSheetProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: "Storefront Power Navigation",
      shortcuts: [
        { key: "/", desc: "Open quick search & Roman Urdu overlay" },
        { key: "c", desc: "Open or close Shopping Bag drawer" },
        { key: "k", desc: "Toggle Studio / AI Insights Console (for judges)" },
        { key: "?", desc: "Toggle this Keyboard Shortcuts Guide" },
        { key: "Esc", desc: "Close any open dialog or drawer" },
      ],
    },
    {
      title: "Product Browsing (j/k)",
      shortcuts: [
        { key: "j", desc: "Focus next product in grid" },
        { key: "k", desc: "Focus previous product in grid" },
        { key: "x", desc: "Quick-add focused item to shopping bag" },
        { key: "Enter", desc: "Inspect focused product in quick-view" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-paper border border-sand rounded-2xl shadow-warm-lg overflow-hidden text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand bg-bone/40">
          <div className="flex items-center space-x-2.5">
            <Keyboard className="w-4 h-4 text-terracotta" />
            <h2 className="font-display text-base font-medium text-ink">
              Keyboard Shortcuts Sheet
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-full hover:bg-sand/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="text-xs font-semibold text-terracotta uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="divide-y divide-sand/50 bg-bone/40 border border-sand rounded-xl overflow-hidden">
                {group.shortcuts.map((sc, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
                    <span className="text-ink-soft">{sc.desc}</span>
                    <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold text-ink bg-paper border border-sand rounded shadow-sm">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
