"use client";

import React from "react";
import { X, Sparkles, ShoppingBag, Star, CheckCircle2, ShieldCheck, Truck, ArrowRight } from "lucide-react";

interface ProductPeekDrawerProps {
  productId: string | null;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export function ProductPeekDrawer({ productId, onClose, onAddToCart }: ProductPeekDrawerProps) {
  if (!productId) return null;

  // Enriched Domain SKU Data with Verified Images
  const skuDetails: Record<string, any> = {
    "PROD-00239": {
      id: "PROD-00239",
      title: "Lenovo Laptops for Coding - AMOLED Collection Edition",
      category: "Electronics",
      subcategory: "Laptops for Coding",
      brand: "Lenovo",
      price: 38690,
      stock: 59,
      daysCoverage: 14.5,
      safetyStock: 20,
      rop: 40,
      leadTime: 5,
      rating: 4.8,
      reviewsCount: 164,
      image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.941,
      decomp: { cosineSim: 0.895, alsFactor: 0.820, festivalBoost: 1.10, marginBoost: 1.15, inStockCheck: true },
      aspects: { quality: 4.9, value: 4.8, delivery: 4.7, service: 4.8, authenticity: 5.0, packaging: 4.9 },
      spamRate: 0.9,
      summaryUrdu: "Coding aur daily productivity ke liye boht behtareen laptop. AMOLED display aur fast processing speed. 1-year brand warranty.",
      fbt: {
        id: "SKU-00108",
        title: "Fast Type-C Braided Charging Cable & Adapter",
        price: 1850,
        image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
        explanation: "Laptop buyers sath heavy-duty fast charging adapter aur protective sleeve add karte hain.",
      },
    },
    "SKU-00239": {
      id: "SKU-00239",
      title: "Lenovo Laptops for Coding - AMOLED Collection Edition",
      category: "Electronics",
      subcategory: "Laptops for Coding",
      brand: "Lenovo",
      price: 38690,
      stock: 59,
      daysCoverage: 14.5,
      safetyStock: 20,
      rop: 40,
      leadTime: 5,
      rating: 4.8,
      reviewsCount: 164,
      image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.941,
      decomp: { cosineSim: 0.895, alsFactor: 0.820, festivalBoost: 1.10, marginBoost: 1.15, inStockCheck: true },
      aspects: { quality: 4.9, value: 4.8, delivery: 4.7, service: 4.8, authenticity: 5.0, packaging: 4.9 },
      spamRate: 0.9,
      summaryUrdu: "Coding aur daily productivity ke liye boht behtareen laptop. AMOLED display aur fast processing speed. 1-year brand warranty.",
      fbt: {
        id: "SKU-00108",
        title: "Fast Type-C Braided Charging Cable & Adapter",
        price: 1850,
        image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
        explanation: "Laptop buyers sath heavy-duty fast charging adapter aur protective sleeve add karte hain.",
      },
    },
    "PROD-00370": {
      id: "PROD-00370",
      title: "Infinix Wireless Earbuds Active Noise Cancelling",
      category: "Electronics",
      subcategory: "Wireless Earbuds",
      brand: "Infinix",
      price: 5990,
      stock: 151,
      daysCoverage: 18.2,
      safetyStock: 35,
      rop: 70,
      leadTime: 3,
      rating: 4.8,
      reviewsCount: 310,
      image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.935,
      decomp: { cosineSim: 0.892, alsFactor: 0.840, festivalBoost: 1.15, marginBoost: 1.18, inStockCheck: true },
      aspects: { quality: 4.8, value: 4.9, delivery: 4.7, service: 4.8, authenticity: 5.0, packaging: 4.8 },
      spamRate: 1.1,
      summaryUrdu: "Under 10,000 budget mein zabardast bass aur crystal clear call mic. 30 ghante battery backup aur IPX4 sweatproof.",
      fbt: {
        id: "SKU-00108",
        title: "Fast Type-C Braided Charging Cable",
        price: 990,
        image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
        explanation: "Earbuds ke sath khareedar fast charging braided cable zaroor add karte hain.",
      },
    },
    "SKU-00370": {
      id: "SKU-00370",
      title: "Infinix Wireless Earbuds Active Noise Cancelling",
      category: "Electronics",
      subcategory: "Wireless Earbuds",
      brand: "Infinix",
      price: 5990,
      stock: 151,
      daysCoverage: 18.2,
      safetyStock: 35,
      rop: 70,
      leadTime: 3,
      rating: 4.8,
      reviewsCount: 310,
      image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.935,
      decomp: { cosineSim: 0.892, alsFactor: 0.840, festivalBoost: 1.15, marginBoost: 1.18, inStockCheck: true },
      aspects: { quality: 4.8, value: 4.9, delivery: 4.7, service: 4.8, authenticity: 5.0, packaging: 4.8 },
      spamRate: 1.1,
      summaryUrdu: "Under 10,000 budget mein zabardast bass aur crystal clear call mic. 30 ghante battery backup aur IPX4 sweatproof.",
      fbt: {
        id: "SKU-00108",
        title: "Fast Type-C Braided Charging Cable",
        price: 990,
        image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
        explanation: "Earbuds ke sath khareedar fast charging braided cable zaroor add karte hain.",
      },
    },
    "SKU-10492": {
      id: "SKU-10492",
      title: "Gul Ahmed Festive Embroidered 3-Piece Lawn Suit",
      category: "Fashion",
      subcategory: "Lawn Suits",
      brand: "Gul Ahmed",
      price: 6490,
      stock: 120,
      daysCoverage: 3.2,
      safetyStock: 85,
      rop: 210,
      leadTime: 7,
      rating: 4.8,
      reviewsCount: 342,
      image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.942,
      decomp: {
        cosineSim: 0.884,
        alsFactor: 0.791,
        festivalBoost: 1.25,
        marginBoost: 1.15,
        inStockCheck: true,
      },
      aspects: {
        quality: 4.9,
        value: 4.6,
        delivery: 4.4,
        service: 4.7,
        authenticity: 5.0,
        packaging: 4.8,
      },
      spamRate: 1.8,
      summaryUrdu: "Boht zabardast fabric aur fine embroidery. Rang aur prints bilkul picture jaisay hain. Eid ke liye perfect jora hai.",
      fbt: {
        id: "SKU-10495",
        title: "Matching Chiffon Embroidered Dupatta & Silk Trousers",
        price: 2490,
        image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80",
        explanation: "Kyun ke aap ne yeh suit dekha, 73% Pakistani buyers matching chiffon dupatta aur silk buttons saath khareedte hain.",
      },
    },
    "SKU-00104": {
      id: "SKU-00104",
      title: "Samsung Galaxy S24 Ultra 256GB Titanium Gray (Official PTA Approved)",
      category: "Electronics",
      subcategory: "Smartphones",
      brand: "Samsung",
      price: 399999,
      stock: 22,
      daysCoverage: 5.1,
      safetyStock: 15,
      rop: 35,
      leadTime: 14,
      rating: 4.9,
      reviewsCount: 189,
      image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.912,
      decomp: { cosineSim: 0.852, alsFactor: 0.820, festivalBoost: 1.10, marginBoost: 1.20, inStockCheck: true },
      aspects: { quality: 5.0, value: 4.2, delivery: 4.9, service: 4.8, authenticity: 5.0, packaging: 4.9 },
      spamRate: 0.8,
      summaryUrdu: "Kamaal display aur DSLR jaisa 200MP camera. S-Pen boht smooth chalta hai. PTA official stamp certified hai.",
      fbt: {
        id: "SKU-00108",
        title: "Official 45W Super Fast Charging Adapter Type-C",
        price: 8500,
        image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
        explanation: "88% Galaxy S24 buyers sath 45W original adapter order karte hain kyun ke box mein charger nahi ata.",
      },
    },
    "SKU-04820": {
      id: "SKU-04820",
      title: "Junaid Jamshed Pure Cotton Embroidered Kurta White",
      category: "Fashion",
      subcategory: "Kurtas",
      brand: "Junaid Jamshed",
      price: 4990,
      stock: 85,
      daysCoverage: 4.5,
      safetyStock: 50,
      rop: 120,
      leadTime: 5,
      rating: 4.7,
      reviewsCount: 215,
      image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.928,
      decomp: { cosineSim: 0.865, alsFactor: 0.812, festivalBoost: 1.30, marginBoost: 1.12, inStockCheck: true },
      aspects: { quality: 4.8, value: 4.7, delivery: 4.6, service: 4.5, authenticity: 5.0, packaging: 4.7 },
      spamRate: 2.1,
      summaryUrdu: "Nihayat soft cotton aur neat stitching. Jummah aur Eid namaz ke liye pur-waqar libaas.",
      fbt: {
        id: "SKU-04825",
        title: "Traditional Leather Peshawari Chappal Black",
        price: 3200,
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
        explanation: "90% khareedar kurta ke saath matching handmade Peshawari chappal add kartay hain.",
      },
    },
    "SKU-04825": {
      id: "SKU-04825",
      title: "Traditional Leather Peshawari Chappal Black",
      category: "Fashion",
      subcategory: "Footwear",
      brand: "Handmade Frontier",
      price: 3200,
      stock: 64,
      daysCoverage: 8.5,
      safetyStock: 25,
      rop: 50,
      leadTime: 4,
      rating: 4.8,
      reviewsCount: 178,
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.915,
      decomp: { cosineSim: 0.840, alsFactor: 0.810, festivalBoost: 1.25, marginBoost: 1.15, inStockCheck: true },
      aspects: { quality: 4.9, value: 4.8, delivery: 4.7, service: 4.6, authenticity: 5.0, packaging: 4.7 },
      spamRate: 1.2,
      summaryUrdu: "Asal chamra aur comfortable double tyre sole. Eid namaz aur shalwar kameez ke sath perfect match.",
      fbt: {
        id: "SKU-04820",
        title: "Junaid Jamshed Pure Cotton Embroidered Kurta White",
        price: 4990,
        image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
        explanation: "Peshawari chappal ke sath 85% khareedar Junaid Jamshed white kurta add karte hain.",
      },
    },
    "SKU-05820": {
      id: "SKU-05820",
      title: "Super Kernel Basmati Rice 5kg Export Quality",
      category: "Groceries",
      subcategory: "Basmati Rice",
      brand: "Guard",
      price: 2190,
      stock: 650,
      daysCoverage: 32.0,
      safetyStock: 150,
      rop: 300,
      leadTime: 3,
      rating: 4.9,
      reviewsCount: 520,
      image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.885,
      decomp: { cosineSim: 0.835, alsFactor: 0.780, festivalBoost: 1.15, marginBoost: 1.05, inStockCheck: true },
      aspects: { quality: 5.0, value: 4.8, delivery: 4.9, service: 4.8, authenticity: 5.0, packaging: 4.9 },
      spamRate: 0.5,
      summaryUrdu: "Lamba chawal aur bemisaal khushboo. Biryani aur pulao khila khila banta hai.",
      fbt: {
        id: "SKU-07119",
        title: "Shan Special Bombay Biryani Masala 50g x 6",
        price: 720,
        image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
        explanation: "Basmati chawal ke saath 82% orders mein Shan Biryani masala saath add hota hai.",
      },
    },
    "SKU-18230": {
      id: "SKU-18230",
      title: "Dawlance 1.5 Ton Energy Saver Inverter AC",
      category: "Home & Living",
      subcategory: "Air Conditioners",
      brand: "Dawlance",
      price: 145000,
      stock: 110,
      daysCoverage: 27.5,
      safetyStock: 30,
      rop: 60,
      leadTime: 10,
      rating: 4.8,
      reviewsCount: 144,
      image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80",
      twoTowerScore: 0.874,
      decomp: { cosineSim: 0.810, alsFactor: 0.760, festivalBoost: 1.05, marginBoost: 1.18, inStockCheck: true },
      aspects: { quality: 4.9, value: 4.6, delivery: 4.7, service: 4.6, authenticity: 5.0, packaging: 4.8 },
      spamRate: 1.5,
      summaryUrdu: "Garmiyon mein zabardast cooling aur 60% bijli bachat. Official company warranty.",
      fbt: {
        id: "SKU-18235",
        title: "Digital Voltage Stabilizer 5000VA Heavy Duty",
        price: 12500,
        image_url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=400&q=80",
        explanation: "Load shedding aur voltage fluctuation se bachao ke liye stabilizer zaroori hai.",
      },
    },
  };

  const item = skuDetails[productId] || {
    id: productId,
    title: `Product ${productId}`,
    category: "General",
    brand: "ShopKaro Verified",
    price: 3490,
    stock: 45,
    daysCoverage: 12.0,
    leadTime: 5,
    rating: 4.8,
    reviewsCount: 120,
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    twoTowerScore: 0.89,
    summaryUrdu: "Aala quality aur verified authenticity. Customers ki janib se highly recommended.",
    fbt: null,
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-paper border-l border-sand shadow-warm-lg flex flex-col justify-between animate-in slide-in-from-right duration-200 text-ink">
      {/* Peek Header */}
      <div className="px-6 py-4 border-b border-sand bg-bone/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sand text-ink-soft font-semibold">
            {item.id}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
            SKU Deep Dive Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-sand/50 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Peek Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Product Photo Hero Frame */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-sand bg-bone shadow-warm group">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-paper/90 backdrop-blur-sm text-terracotta border border-sand">
              {item.brand}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 font-sans text-sm font-bold px-3 py-1 rounded-full bg-paper/95 backdrop-blur-sm text-ink border border-sand shadow-sm tabular-nums">
            Rs. {item.price.toLocaleString()}
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h2 className="font-display text-xl font-medium text-ink leading-snug">
            {item.title}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div className="flex items-center text-saffron">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="font-semibold text-ink">{item.rating}</span>
            <span className="text-ink-soft">({item.reviewsCount} reviews)</span>
            <span className="text-sand">·</span>
            <span className="text-sage-deep font-medium">Verified Supplier</span>
          </div>
        </div>

        {/* Inventory Coverage & ROP */}
        <div className="p-4 rounded-2xl bg-bone/60 border border-sand space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink-soft text-[11px]">
              Demand & Inventory Health
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                item.daysCoverage < 7
                  ? "bg-roseclay/30 text-terracotta-deep"
                  : "bg-sage-light text-sage-deep"
              }`}
            >
              {item.daysCoverage < 7 ? "Stockout Alert" : "Stable Inventory"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-paper border border-sand/70">
              <div className="font-display text-base font-semibold text-ink">{item.stock}</div>
              <div className="text-[10px] text-ink-soft">Current Stock</div>
            </div>
            <div className="p-2 rounded-xl bg-paper border border-sand/70">
              <div className="font-display text-base font-semibold text-terracotta">
                {item.daysCoverage}d
              </div>
              <div className="text-[10px] text-ink-soft">Coverage</div>
            </div>
            <div className="p-2 rounded-xl bg-paper border border-sand/70">
              <div className="font-display text-base font-semibold text-ink">
                {item.leadTime}d
              </div>
              <div className="text-[10px] text-ink-soft">Lead Time</div>
            </div>
          </div>
        </div>

        {/* Urdu Review Sentiment Summary */}
        <div className="p-4 rounded-2xl bg-bone/70 border border-sand space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron-deep" />
            <span>Verified Pakistani Shopper Consensus (Urdu Summary)</span>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed font-sans italic">
            "{item.summaryUrdu}"
          </p>
        </div>

        {/* Frequently Bought Together (FBT) Bundle */}
        {item.fbt && (
          <div className="p-4 rounded-2xl bg-bone/60 border border-sand space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft text-[11px]">
              Frequently Paired Together
            </div>
            <div className="flex gap-3 items-center">
              <img
                src={item.fbt.image_url}
                alt={item.fbt.title}
                className="w-14 h-16 object-cover rounded-xl bg-paper border border-sand/70 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-ink truncate">{item.fbt.title}</div>
                <div className="font-sans text-xs font-bold text-ink mt-0.5 tabular-nums">
                  Rs. {item.fbt.price.toLocaleString()}
                </div>
                <p className="text-[11px] text-ink-soft mt-1 leading-tight">
                  {item.fbt.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Peek Footer Action */}
      <div className="p-6 border-t border-sand bg-bone/40 flex items-center gap-3">
        <button
          onClick={() => {
            onAddToCart({
              product_id: item.id,
              title: item.title,
              price: item.price,
              image_url: item.image_url,
              brand: item.brand,
            });
            onClose();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-pill bg-terracotta hover:bg-terracotta-deep text-paper text-sm font-semibold transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Bag · Rs. {item.price.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}
