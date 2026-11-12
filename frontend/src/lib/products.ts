export interface Product {
  product_id: string;
  title: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  rating?: number;
  stock_quantity: number;
  lead_time_days?: number;
  two_tower_score?: number;
  image_url?: string;
}

// Fallback high-resolution editorial photography
export function getProductImage(prod: Partial<Product>): string {
  if (prod.image_url && prod.image_url.startsWith("http")) return prod.image_url;
  const cat = (prod.category || "").toLowerCase();
  const sub = (prod.subcategory || "").toLowerCase();
  const title = (prod.title || "").toLowerCase();

  // 1. Electronics & Audio (Strict Top Priority)
  if (
    cat.includes("electronics") ||
    title.includes("samsung") ||
    title.includes("anker") ||
    title.includes("speaker") ||
    title.includes("charger") ||
    title.includes("laptop") ||
    title.includes("earbud") ||
    title.includes("headphone") ||
    title.includes("audionic") ||
    title.includes("soundcore") ||
    title.includes("audio") ||
    title.includes("phone")
  ) {
    if (title.includes("speaker") || sub.includes("speaker")) {
      return "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"; // Bluetooth Speaker
    }
    if (title.includes("charger") || sub.includes("charger") || title.includes("65w") || title.includes("power bank")) {
      return "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"; // Fast Charger
    }
    if (title.includes("laptop") || sub.includes("laptop") || title.includes("coding") || title.includes("thinkpad")) {
      return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"; // Sleek Laptop
    }
    if (title.includes("earbud") || title.includes("audio") || title.includes("headphone") || title.includes("airbud") || title.includes("soundcore")) {
      return "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"; // Wireless Earbuds
    }
    if (title.includes("watch")) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"; // Smartwatch
    }
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"; // Smartphone
  }

  // 2. Fashion & Apparel
  if (cat.includes("fashion") || title.includes("lawn") || sub.includes("lawn") || title.includes("kurta") || sub.includes("kurta")) {
    if (title.includes("kurta") || sub.includes("kurta")) {
      return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"; // Kurta & Waistcoat
    }
    if (title.includes("chappal") || sub.includes("chappal") || title.includes("khussa")) {
      return "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"; // Peshawari Chappal
    }
    if (title.includes("jeans") || title.includes("denim")) {
      return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"; // Denim
    }
    return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"; // Luxury Lawn Suit
  }

  // 3. Home & Living / Appliances
  if (cat.includes("home") || cat.includes("appliance") || title.includes("ac") || title.includes("dawlance")) {
    if (title.includes("bedsheet")) {
      return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80";
  }

  // 4. Groceries & Pantry
  if (cat.includes("grocer") || title.includes("rice") || title.includes("biryani") || title.includes("chai")) {
    if (title.includes("rice")) {
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80";
  }

  // 5. Fragrance & Beauty
  if (cat.includes("beauty") || title.includes("perfume") || title.includes("oud") || title.includes("attar")) {
    return "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80";
}

// Human-written title cleaner (strips robotic template suffixes)
export function cleanTitle(raw: string): string {
  if (!raw) return "Curated Essential";
  let t = raw;
  t = t.replace(/\s*-\s*([a-zA-Z0-9]+)\s+Collection\s+Edition/gi, (match, p1) => {
    const lower = p1.toLowerCase();
    if (lower === "pure") return " (Pure Cotton)";
    if (lower === "authentic") return " (Luxury Weave)";
    if (lower === "summer") return " (Summer Edit)";
    if (lower === "handmade") return " (Handcrafted)";
    if (lower === "festive") return " (Festive Edition)";
    return ` (${p1} Edit)`;
  });
  t = t.replace(/\s+Collection\s+Edition/gi, "");
  t = t.replace(/\s+-\s+noise\s+Collection/gi, " (Noise Cancelling)");
  t = t.replace(/\s+-\s+3-piece\s+Collection/gi, " (3-Piece Luxury)");
  t = t.replace(/\s+-\s+hot\s+Collection/gi, " (Rapid Boil)");
  return t;
}

export const DEFAULT_CURATED_PRODUCTS: Product[] = [
  {
    product_id: "SKU-10492",
    title: "Gul Ahmed Festive Luxury 3-Piece Lawn Suit",
    category: "Fashion",
    subcategory: "Lawn Suits",
    brand: "Gul Ahmed",
    price: 8990,
    rating: 4.9,
    stock_quantity: 45,
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-04820",
    title: "Junaid Jamshed Pure Cotton Kurta & Waistcoat",
    category: "Fashion",
    subcategory: "Kurtas",
    brand: "Junaid Jamshed",
    price: 6450,
    rating: 4.8,
    stock_quantity: 38,
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-00340",
    title: "Anker Soundcore Liberty 4 NC Wireless Earbuds",
    category: "Electronics",
    subcategory: "Audio",
    brand: "Anker",
    price: 18990,
    rating: 4.8,
    stock_quantity: 82,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-00104",
    title: "Samsung Galaxy S24 Ultra 256GB Titanium Gray (Official PTA Approved)",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Samsung",
    price: 399999,
    rating: 4.9,
    stock_quantity: 22,
    image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-18230",
    title: "Dawlance Pro Inverter Air Conditioner 1.5 Ton Energy Saver",
    category: "Home & Appliances",
    subcategory: "Air Conditioners",
    brand: "Dawlance",
    price: 145000,
    rating: 4.7,
    stock_quantity: 14,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-05820",
    title: "Guard Super Kernel Basmati Rice 5kg Export Aged",
    category: "Groceries",
    subcategory: "Basmati Rice",
    brand: "Guard",
    price: 2190,
    rating: 4.9,
    stock_quantity: 250,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-10495",
    title: "Sapphire Chiffon Dupatta & Hand-Embroidered Raw Silk",
    category: "Fashion",
    subcategory: "Lawn Suits",
    brand: "Sapphire",
    price: 4250,
    rating: 4.8,
    stock_quantity: 35,
    image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "SKU-04825",
    title: "Traditional Handmade Leather Peshawari Chappal Black",
    category: "Fashion",
    subcategory: "Footwear",
    brand: "Charcoal",
    price: 3490,
    rating: 4.9,
    stock_quantity: 60,
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  },
];

export const ELECTRONICS_CURATED_PRODUCTS: Product[] = [
  {
    product_id: "TECH-ANKER-01",
    title: "Anker Soundcore Liberty 4 NC Wireless Earbuds (Noise Cancelling)",
    category: "Electronics",
    subcategory: "Wireless Earbuds",
    brand: "Anker",
    price: 18990,
    rating: 4.9,
    stock_quantity: 64,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-ANKER-02",
    title: "Anker 737 GaN 65W Rapid Type-C Fast Charger",
    category: "Electronics",
    subcategory: "Fast Chargers",
    brand: "Anker",
    price: 12490,
    rating: 4.9,
    stock_quantity: 80,
    image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-SAMS-01",
    title: "Samsung Galaxy Buds 2 Pro Studio Hi-Fi Sound",
    category: "Electronics",
    subcategory: "Wireless Earbuds",
    brand: "Samsung",
    price: 26990,
    rating: 4.8,
    stock_quantity: 42,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-LENOVO-01",
    title: "Lenovo ThinkPad X1 Carbon Ultrabook (Intel i7, 16GB)",
    category: "Electronics",
    subcategory: "Laptops for Coding",
    brand: "Lenovo",
    price: 154990,
    rating: 4.9,
    stock_quantity: 18,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-AUDIONIC-01",
    title: "Audionic BlueTune 30W Wireless Bluetooth Speaker",
    category: "Electronics",
    subcategory: "Bluetooth Speakers",
    brand: "Audionic",
    price: 9490,
    rating: 4.7,
    stock_quantity: 55,
    image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-FASTER-01",
    title: "Faster SoundWave Heavy Bass Wireless Studio Headphones",
    category: "Electronics",
    subcategory: "Audio",
    brand: "Faster",
    price: 7990,
    rating: 4.8,
    stock_quantity: 90,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-SAMS-02",
    title: "Samsung Galaxy Watch 6 Classic 44mm (Official PTA Approved)",
    category: "Electronics",
    subcategory: "Smart Watches",
    brand: "Samsung",
    price: 58990,
    rating: 4.8,
    stock_quantity: 26,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: "TECH-RONIN-01",
    title: "Ronin R-970 Heavy Bass Outdoor Bluetooth Speaker",
    category: "Electronics",
    subcategory: "Bluetooth Speakers",
    brand: "Ronin",
    price: 8490,
    rating: 4.6,
    stock_quantity: 70,
    image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
  },
];
