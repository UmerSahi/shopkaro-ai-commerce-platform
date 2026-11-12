"use client";

import React, { useState } from "react";
import { X, Star, ShoppingBag, Truck, ShieldCheck, Heart, Sparkles, Check, ChevronRight } from "lucide-react";

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
  image_url?: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}: ProductDetailModalProps) {
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "craft" | "shipping">("details");
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const originalPrice = Math.round(product.price * 1.25);
  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAdd = () => {
    onAddToCart(product, selectedQty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-paper border border-sand rounded-card shadow-warm-lg flex flex-col md:flex-row overflow-hidden text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-paper/90 border border-sand hover:bg-sand/40 text-ink-soft hover:text-ink transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-bone/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-sand">
          <div className="relative aspect-editorial w-full overflow-hidden rounded-2xl bg-paper border border-sand/70 shadow-warm">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {discountPct > 0 && (
              <div className="absolute top-4 left-4 z-10 -rotate-3 select-none filter drop-shadow-md">
                <div className="px-3 py-1 bg-saffron text-ink text-xs font-mono font-bold uppercase rounded-tl-xl rounded-br-xl border border-ink/20 shadow-inner flex items-center gap-1">
                  <span>✦</span>
                  <span>Save {discountPct}%</span>
                </div>
              </div>
            )}
            <button
              onClick={() => onToggleWishlist?.(product.product_id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-paper/90 border border-sand text-ink-soft hover:text-terracotta shadow-sm transition-transform active:scale-90"
              title="Add to Wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? "fill-terracotta text-terracotta" : "text-ink-soft"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-ink-soft px-1">
            <span className="flex items-center gap-1.5 text-sage-deep font-medium">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              In stock ({product.stock_quantity} available)
            </span>
            <span>SKU: {product.product_id}</span>
          </div>
        </div>

        {/* Right: Product Narrative & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Brand */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-terracotta">
                {product.brand}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sand/60 text-ink-soft">
                {product.category} {product.subcategory ? `· ${product.subcategory}` : ""}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink leading-tight">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-saffron">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 4.8) ? "fill-current" : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-ink">
                {product.rating ? product.rating.toFixed(1) : "4.8"}
              </span>
              <span className="text-xs text-ink-soft">· (340+ verified Pakistani reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-sand/70">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-ink-soft font-sans">Rs.</span>
                <span className="font-sans text-3xl font-bold text-ink tabular-nums tracking-tight">
                  {product.price.toLocaleString()}
                </span>
              </div>
              {originalPrice > product.price && (
                <span className="text-base text-ink-soft/60 line-through font-sans tabular-nums">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="pt-2">
              <div className="flex gap-4 border-b border-sand/70 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "details"
                      ? "border-terracotta text-terracotta font-semibold"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("craft")}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "craft"
                      ? "border-terracotta text-terracotta font-semibold"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Material & Craft
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "shipping"
                      ? "border-terracotta text-terracotta font-semibold"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Delivery & COD
                </button>
              </div>

              <div className="py-3 text-xs text-ink-soft leading-relaxed min-h-[70px]">
                {activeTab === "details" && (
                  <p>
                    Artfully crafted for the modern Pakistani household. Sourced directly from verified brand ateliers in Lahore, Faisalabad, and Karachi, guaranteed 100% authentic with 7-day hassle-free replacement.
                  </p>
                )}
                {activeTab === "craft" && (
                  <p>
                    Premium materials crafted with rigorous attention to weave, stitch, and finish. Breathable, durable, and designed to thrive in local climate and everyday routines.
                  </p>
                )}
                {activeTab === "shipping" && (
                  <p>
                    Dispatched within 24 hours. Express delivery in 2–3 business days across Karachi, Lahore, Islamabad, and all major cities. Cash on Delivery (COD) and mobile wallets accepted.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-sand">
            <div className="flex items-center gap-3">
              {/* Qty Stepper */}
              <div className="flex items-center border border-sand rounded-pill bg-bone/50 px-2 py-1">
                <button
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-ink-soft hover:text-ink hover:bg-sand/50 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-ink">
                  {selectedQty}
                </span>
                <button
                  onClick={() => setSelectedQty((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-ink-soft hover:text-ink hover:bg-sand/50 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper font-medium text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99]"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-paper" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · Rs. {(product.price * selectedQty).toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Micro-Pills */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-ink-soft">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-bone/40 border border-sand/60">
                <Truck className="w-3.5 h-3.5 text-terracotta shrink-0" />
                <span>Free delivery over Rs. 3,000</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-bone/40 border border-sand/60">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-deep shrink-0" />
                <span>Cash on Delivery Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

