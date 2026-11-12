"use client";

import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  Sparkles,
} from "lucide-react";

export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  qty: number;
  image_url?: string;
  brand?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "easypaisa" | "card">("cod");

  const [checkoutForm, setCheckoutForm] = useState({
    name: "Ayesha Malik",
    phone: "0300-1234567",
    city: "Lahore",
    address: "House 42, Street 7, Phase 5 DHA",
  });

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3000;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 250;
  const grandTotal = subtotal + shippingFee;
  const progressToFree = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-paper border-l border-sand shadow-warm-lg flex flex-col justify-between text-ink">
          {/* Header */}
          <div className="px-6 py-5 border-b border-sand/80 flex items-center justify-between bg-bone/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                Your Shopping Bag
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sand text-ink-soft font-semibold">
                {items.reduce((acc, i) => acc + i.qty, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-sand/60 text-ink-soft hover:text-ink transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-bone/60 border-b border-sand/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {isFreeShipping ? (
                <span className="font-semibold text-sage-deep flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sage-deep" />
                  Free Nationwide Delivery Unlocked!
                </span>
              ) : (
                <span className="text-ink-soft">
                  Add <strong className="text-terracotta">Rs. {amountNeeded.toLocaleString()}</strong> more for Free Delivery
                </span>
              )}
              <span className="font-mono text-[11px] text-ink-soft">{progressToFree}%</span>
            </div>
            <div className="h-2 w-full bg-sand/60 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? "bg-sage-deep" : "bg-terracotta"
                }`}
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {orderPlaced ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-sage-light text-sage-deep flex items-center justify-center border border-sage/40 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display text-2xl font-medium text-ink">
                  Shukriya! Order Confirmed.
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed max-w-xs">
                  Your order has been dispatched from our Lahore logistics hub. You will receive an SMS confirmation with rider live tracking shortly.
                </p>
                <div className="p-3 bg-bone rounded-xl border border-sand text-xs font-mono text-ink-soft w-full">
                  Tracking ID: <strong>PK-{Math.floor(100000 + Math.random() * 900000)}</strong>
                </div>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    setIsCheckingOut(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-pill bg-terracotta text-paper text-xs font-medium hover:bg-terracotta-deep transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form */
              <form onSubmit={handlePlaceOrder} className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-sand">
                  <h3 className="font-display text-lg font-medium text-ink">Delivery & Payment</h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-terracotta hover:underline"
                  >
                    Back to bag
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-ink-soft mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-bone/40 border border-sand text-ink focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-soft mb-1 font-medium">WhatsApp / Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-bone/40 border border-sand text-ink focus:outline-none focus:border-terracotta font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-soft mb-1 font-medium">City</label>
                    <select
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-bone/40 border border-sand text-ink focus:outline-none focus:border-terracotta"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Sialkot">Sialkot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-ink-soft mb-1 font-medium">Delivery Address</label>
                    <textarea
                      required
                      rows={2}
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-bone/40 border border-sand text-ink focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-ink-soft mb-2 font-medium">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "cod"
                            ? "border-terracotta bg-terracotta/5 font-semibold text-terracotta"
                            : "border-sand bg-bone/30 text-ink-soft hover:border-sand/80"
                        }`}
                      >
                        <Banknote className="w-5 h-5 text-terracotta" />
                        <span className="text-[11px]">Cash on Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("jazzcash")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "jazzcash"
                            ? "border-terracotta bg-terracotta/5 font-semibold text-terracotta"
                            : "border-sand bg-bone/30 text-ink-soft hover:border-sand/80"
                        }`}
                      >
                        <Smartphone className="w-5 h-5 text-saffron-deep" />
                        <span className="text-[11px]">JazzCash</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("easypaisa")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "easypaisa"
                            ? "border-terracotta bg-terracotta/5 font-semibold text-terracotta"
                            : "border-sand bg-bone/30 text-ink-soft hover:border-sand/80"
                        }`}
                      >
                        <Smartphone className="w-5 h-5 text-sage-deep" />
                        <span className="text-[11px]">Easypaisa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "card"
                            ? "border-terracotta bg-terracotta/5 font-semibold text-terracotta"
                            : "border-sand bg-bone/30 text-ink-soft hover:border-sand/80"
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-ink" />
                        <span className="text-[11px]">Debit / Card</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper text-sm font-semibold transition-colors shadow-sm"
                >
                  Confirm & Place Order · Rs. {grandTotal.toLocaleString()}
                </button>
              </form>
            ) : items.length === 0 ? (
              /* Empty Bag State */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-sand/40 flex items-center justify-center text-ink-soft">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-medium text-ink">Your bag is empty</h3>
                <p className="text-xs text-ink-soft max-w-xs">
                  Discover curated Eid apparel, pure audio, and Pakistani artisanal treasures.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 rounded-pill bg-ink text-paper text-xs font-medium hover:bg-ink-soft transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              /* Items List */
              items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-3 p-3 rounded-2xl bg-bone/40 border border-sand/70 group"
                >
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80"}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-xl bg-paper border border-sand/60 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      {item.brand && (
                        <span className="text-[10px] uppercase font-semibold text-terracotta tracking-wider">
                          {item.brand}
                        </span>
                      )}
                      <h4 className="text-xs font-medium text-ink line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-semibold text-ink-soft font-sans">Rs.</span>
                        <span className="font-sans text-sm font-bold text-ink tabular-nums">
                          {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5 border border-sand rounded-pill bg-paper px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQty(item.product_id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-xs text-ink-soft hover:text-ink"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold px-1 text-ink">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.product_id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs text-ink-soft hover:text-ink"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product_id)}
                        className="p-1 rounded text-ink-soft hover:text-terracotta transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {!orderPlaced && items.length > 0 && !isCheckingOut && (
            <div className="p-6 border-t border-sand bg-bone/30 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-sans font-semibold text-ink">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Nationwide Shipping</span>
                  <span>{isFreeShipping ? <span className="text-sage-deep font-semibold">FREE</span> : <span className="font-sans font-semibold text-ink">Rs. {shippingFee}</span>}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-sand/70">
                  <span className="font-medium text-ink">Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-ink-soft font-sans">Rs.</span>
                    <span className="font-sans text-xl font-bold text-ink tabular-nums">
                      {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper font-medium text-sm transition-all duration-200 shadow-sm hover:shadow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-ink-soft">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sage-deep" />
                  COD & Wallets
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-terracotta" />
                  2-3 Day Nationwide Dispatch
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

