import React from "react";
import { motion } from "framer-motion";

/**
 * 1. HERO STARBURST SEAL STICKER (Top Orbit)
 * 12-point smooth scalloped rosette sticker in warm terracotta with white die-cut sticker border,
 * inner dashed stitch ring, and editorial typography.
 */
export function HeroStarburstSticker({
  yTransform,
}: {
  yTransform?: any;
}) {
  return (
    <motion.div
      style={yTransform ? { y: yTransform } : undefined}
      animate={{ rotate: [4, 7, 4], y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      className="absolute -top-7 -right-7 z-20 select-none cursor-pointer group filter drop-shadow-[0_8px_16px_rgba(60,35,15,0.18)] hover:scale-105 transition-transform"
    >
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Die-cut white sticker backing (outer offset) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-paper/95 fill-current filter drop-shadow-sm scale-[1.06]"
        >
          <path d="M 92.0,50.0 Q 99.3,63.2 86.4,71.0 Q 86.1,86.1 71.0,86.4 Q 63.2,99.3 50.0,92.0 Q 36.8,99.3 29.0,86.4 Q 13.9,86.1 13.6,71.0 Q 0.7,63.2 8.0,50.0 Q 0.7,36.8 13.6,29.0 Q 13.9,13.9 29.0,13.6 Q 36.8,0.7 50.0,8.0 Q 63.2,0.7 71.0,13.6 Q 86.1,13.9 86.4,29.0 Q 99.3,36.8 92.0,50.0 Z" />
        </svg>

        {/* Terracotta Foil Seal Body */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-terracotta fill-current"
        >
          <path d="M 92.0,50.0 Q 99.3,63.2 86.4,71.0 Q 86.1,86.1 71.0,86.4 Q 63.2,99.3 50.0,92.0 Q 36.8,99.3 29.0,86.4 Q 13.9,86.1 13.6,71.0 Q 0.7,63.2 8.0,50.0 Q 0.7,36.8 13.6,29.0 Q 13.9,13.9 29.0,13.6 Q 36.8,0.7 50.0,8.0 Q 63.2,0.7 71.0,13.6 Q 86.1,13.9 86.4,29.0 Q 99.3,36.8 92.0,50.0 Z" />
        </svg>

        {/* Inner Dashed Ring */}
        <div className="absolute inset-3.5 rounded-full border border-dashed border-paper/40 pointer-events-none" />

        {/* Faux Corner Peel Highlight */}
        <div className="absolute top-2 right-2 w-4 h-4 bg-white/20 rounded-bl-full pointer-events-none blur-[1px]" />

        {/* Sticker Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 space-y-0.5">
          <span className="text-[8px] font-mono uppercase tracking-widest text-saffron font-bold">
            ✦ BESPOKE EDIT ✦
          </span>
          <span className="font-serif italic font-medium text-paper text-[13px] leading-tight">
            Festive Match
          </span>
          <span className="text-[7.5px] font-mono tracking-wider text-paper/90 uppercase pt-0.5">
            Lahore Atelier
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 2. HERO LUGGAGE TICKET TAG STICKER (Bottom Orbit)
 * Vintage courier baggage tag sticker with chamfered ticket corners,
 * punched eyelet with twine hole, barcode lines, and courier dispatch stamps.
 */
export function HeroLuggageTagSticker({
  yTransform,
}: {
  yTransform?: any;
}) {
  return (
    <motion.div
      style={yTransform ? { y: yTransform } : undefined}
      animate={{ rotate: [-4, -1, -4], y: [0, 6, 0] }}
      transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.8 }}
      className="absolute -bottom-6 -left-6 z-20 select-none cursor-pointer group filter drop-shadow-[0_8px_16px_rgba(40,25,15,0.18)] hover:scale-105 transition-transform"
    >
      {/* Die-cut White Sticker Border Container */}
      <div className="p-1 rounded-[14px] bg-paper/95 shadow-sm">
        {/* The Ticket Tag Body with Chamfered Corners */}
        <div
          className="relative px-4 py-3 bg-forest text-bone flex items-center gap-3.5 border border-forest-light"
          style={{
            clipPath:
              "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
          }}
        >
          {/* Punched Eyelet Ring on Left */}
          <div className="flex flex-col items-center justify-center shrink-0 pr-1">
            <div className="w-3.5 h-3.5 rounded-full bg-forest-deep border-2 border-saffron/60 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-paper" />
            </div>
            <span className="text-[7px] font-mono text-sand/60 tracking-tighter mt-1">
              № 786
            </span>
          </div>

          {/* Vertical Perforation Stitch Line */}
          <div className="h-9 border-r border-dashed border-sand/30 shrink-0" />

          {/* Ticket Body Information */}
          <div className="flex flex-col text-left space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[8px] uppercase tracking-widest font-mono text-saffron font-bold">
                EXPRESS CARGO
              </span>
              <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-sage/30 text-sand border border-sage/40">
                PRIORITY
              </span>
            </div>
            <div className="font-serif italic text-bone text-xs font-medium tracking-tight">
              Lahore ⇄ Karachi Same-Day
            </div>
            <div className="text-[8px] font-mono text-sand/70 tracking-wider">
              Atelier Dispatch · 100% Verified
            </div>
          </div>

          {/* Faux Mini Barcode */}
          <div className="hidden sm:flex flex-col items-end shrink-0 pl-1">
            <div className="flex items-center gap-[2px] h-5 opacity-70">
              <div className="w-[1.5px] h-full bg-sand" />
              <div className="w-[3px] h-full bg-sand" />
              <div className="w-[1px] h-full bg-sand" />
              <div className="w-[2px] h-full bg-sand" />
              <div className="w-[4px] h-full bg-sand" />
              <div className="w-[1px] h-full bg-sand" />
              <div className="w-[2.5px] h-full bg-sand" />
            </div>
            <span className="text-[6.5px] font-mono text-sand/60">PK-COD</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 3. WASHI TAPE STICKER (For Hero Season Eyebrow)
 * Textured adhesive washi paper tape with torn zigzag ends and slight slant.
 */
export function WashiTapeSticker({
  text = "✦ EID EDIT '26 · ARTISANAL RESERVE ✦",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 bg-[#FAF3E0] text-ink font-mono text-[11px] font-semibold tracking-widest uppercase shadow-[0_2px_8px_rgba(60,35,15,0.10)] border-y border-[#E2D5BA] -rotate-1 select-none ${className}`}
      style={{
        clipPath:
          "polygon(0% 0%, 98% 1%, 100% 50%, 97% 100%, 2% 98%, 0% 50%)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
      <span>{text}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
    </div>
  );
}

/**
 * 4. MULTI-SHAPE PRODUCT CARD STICKERS
 * Assigns a distinct, tactile sticker with its own geometric/organic shape
 * based on product category or index:
 * - Scalloped Rosette Seal (Fashion / Festive)
 * - Chamfered Ticket Pass (Electronics / Audio)
 * - Botanical Double-Ring Oval (Home / Living)
 * - Perforated Postage Stamp (Groceries / Reserve)
 */
export function ProductCardSticker({
  category = "",
  title = "",
  index = 0,
}: {
  category?: string;
  title?: string;
  index?: number;
}) {
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();

  // 1. Electronics & Audio -> Chamfered Ticket Pass Sticker with cut corners
  if (
    cat.includes("electronics") ||
    t.includes("anker") ||
    t.includes("audio") ||
    t.includes("samsung") ||
    t.includes("phone") ||
    t.includes("earbud") ||
    t.includes("headphone") ||
    t.includes("speaker") ||
    t.includes("charger") ||
    t.includes("laptop") ||
    t.includes("watch")
  ) {
    const labels = ["★ 65W Rapid", "★ Hi-Fi Studio", "★ PTA Pass", "★ Noise Guard"];
    const label = labels[index % labels.length];
    return (
      <div
        className="absolute top-2.5 left-2.5 z-10 select-none filter drop-shadow-[0_2px_5px_rgba(30,50,40,0.16)] rotate-2 hover:rotate-0 transition-transform cursor-pointer"
        title="Official Authenticated Electronics"
      >
        <div
          className="px-3 py-1 bg-forest text-sand text-[10px] font-mono tracking-wider uppercase border border-forest-light flex items-center gap-1.5 shadow-sm"
          style={{
            clipPath:
              "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
          }}
        >
          <span className="text-saffron">★</span>
          <span>{label}</span>
        </div>
      </div>
    );
  }

  // 2. Groceries / Pantry -> Perforated Postage Stamp Sticker
  if (cat.includes("grocer") || t.includes("rice") || t.includes("chai") || t.includes("spice") || t.includes("tea")) {
    const labels = ["✉ Aged Reserve", "✉ Super Kernel", "✉ Organic Seal", "✉ Heritage Crop"];
    const label = labels[index % labels.length];
    return (
      <div
        className="absolute top-2.5 left-2.5 z-10 select-none filter drop-shadow-[0_2px_5px_rgba(60,35,15,0.14)] rotate-3 hover:rotate-0 transition-transform cursor-pointer"
        title="Pakistani Certified Reserve"
      >
        <div className="px-2.5 py-1 bg-[#FAF3E0] text-ink text-[10px] font-mono tracking-wider uppercase border-2 border-dashed border-terracotta/70 rounded-sm flex items-center gap-1.5 shadow-sm">
          <span className="text-terracotta text-xs font-serif">✦</span>
          <span className="font-semibold">{label}</span>
        </div>
      </div>
    );
  }

  // 3. Home & Appliances -> Asymmetric Organic Wavy Oval Sticker
  if (cat.includes("home") || cat.includes("appliance") || t.includes("ac") || t.includes("dawlance") || t.includes("bedsheet") || t.includes("cookware")) {
    const labels = ["◆ Artisanal Living", "◆ Inverter Gold", "◆ Heritage Weave", "◆ Studio Craft"];
    const label = labels[index % labels.length];
    return (
      <div
        className="absolute top-2.5 left-2.5 z-10 select-none filter drop-shadow-[0_2px_5px_rgba(60,35,15,0.14)] -rotate-2 hover:rotate-0 transition-transform cursor-pointer"
        title="Hand-Inspected Home Item"
      >
        <div className="px-3 py-1 bg-paper/95 text-ink text-[10px] font-medium tracking-wide rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm border-2 border-sage shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          <span className="font-serif italic">{label}</span>
        </div>
      </div>
    );
  }

  // 4. Fragrance & Attar -> Hexagonal Perfumed Wax Seal
  if (cat.includes("beauty") || cat.includes("care") || t.includes("perfume") || t.includes("oud") || t.includes("attar") || t.includes("fragrance")) {
    const labels = ["✿ Royal Oud", "✿ Distilled 1890", "✿ Jasmine Attar", "✿ Pure Amber"];
    const label = labels[index % labels.length];
    return (
      <div
        className="absolute top-2.5 left-2.5 z-10 select-none filter drop-shadow-[0_2px_5px_rgba(60,35,15,0.14)] rotate-1 hover:rotate-0 transition-transform cursor-pointer"
        title="Artisanal Fragrance Reserve"
      >
        <div
          className="px-3 py-1 bg-[#4A1525] text-bone text-[10px] font-serif italic tracking-wider flex items-center gap-1.5 shadow-sm"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        >
          <span className="text-saffron">✿</span>
          <span>{label}</span>
        </div>
      </div>
    );
  }

  // 5. Fashion / Festive -> 10-Point Scalloped Rosette Flower Sticker
  const labels = ["✦ Eid Edit", "✦ Pure Silk", "✦ Handloom", "✦ Atelier"];
  const label = labels[index % labels.length];
  return (
    <div
      className="absolute top-2.5 left-2.5 z-10 select-none filter drop-shadow-[0_2px_5px_rgba(60,35,15,0.15)] -rotate-3 hover:rotate-0 transition-transform cursor-pointer"
      title="Verified Lahore Atelier Piece"
    >
      <div className="px-3 py-1 bg-terracotta text-paper rounded-full border border-paper/90 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
        <span className="text-[10px] font-serif italic tracking-wide font-medium">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * 5. CURATOR'S SPOTLIGHT STICKER (For 2-Column Featured Card)
 * Large 16-point scalloped starburst award seal with gold/saffron badge styling.
 */
export function CuratorSpotlightSticker() {
  return (
    <div className="absolute top-3 left-3 z-10 select-none filter drop-shadow-[0_4px_8px_rgba(60,35,15,0.2)] rotate-3 hover:rotate-0 transition-transform cursor-pointer">
      <div className="p-0.5 rounded-full bg-paper">
        <div className="px-3.5 py-1.5 rounded-full bg-saffron text-ink border border-saffron-deep/40 shadow-inner flex items-center gap-2">
          <span className="text-terracotta text-xs font-serif">✦</span>
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest">
            CURATOR'S SPOTLIGHT
          </span>
          <span className="text-terracotta text-xs font-serif">✦</span>
        </div>
      </div>
    </div>
  );
}
