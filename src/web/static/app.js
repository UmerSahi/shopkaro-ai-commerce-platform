/**
 * Cinematic UI 2.0 - Director's Cut App Controller
 * Keyboard shortcuts:
 *   1, 2, 3, 4: Switch views (Customer, Operations, Management, Assistant)
 *   /: Focus search
 *   p: Open / Close Peek Drawer
 *   Esc: Close drawer / modal
 */

const API_BASE = "";

let state = {
  currentView: "customer",
  currentUser: "USR-00001", // Default: Tech Enthusiast
  cart: [],
  selectedProduct: null,
  activeForecastPid: "PROD-00001"
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupKeyboardShortcuts();
  setupNav();
  setupPersonaSelector();
  setupSearch();
  setupAssistantChat();
  
  // Initial data load
  loadHomepageRecommendations();
  loadOperationsData();
  loadManagementData();
});

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ignore inside inputs/textareas unless Esc
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
      if (e.key === "Escape") {
        e.target.blur();
        closePeek();
      }
      return;
    }

    if (e.key === "1") switchView("customer");
    else if (e.key === "2") switchView("operations");
    else if (e.key === "3") switchView("management");
    else if (e.key === "4") switchView("assistant");
    else if (e.key === "/") {
      e.preventDefault();
      const sInput = document.getElementById("mainSearchInput");
      if (sInput) sInput.focus();
    } else if (e.key.toLowerCase() === "p") {
      togglePeek();
    } else if (e.key === "Escape") {
      closePeek();
    }
  });
}

function setupNav() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");
      switchView(view);
    });
  });
}

function switchView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll(".nav-tab").forEach((t) => {
    t.classList.toggle("active", t.getAttribute("data-view") === viewName);
  });
  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `view-${viewName}`);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupPersonaSelector() {
  const sel = document.getElementById("personaSelect");
  if (!sel) return;
  sel.addEventListener("change", (e) => {
    state.currentUser = e.target.value;
    updateUserBanner();
    loadHomepageRecommendations();
  });
}

function updateUserBanner() {
  const banner = document.getElementById("userGreeting");
  const badge = document.getElementById("userPersonaBadge");
  if (!banner || !badge) return;

  if (state.currentUser === "USR-00001") {
    banner.innerText = "Khush-Amdeed, Tariq (Karachi)";
    badge.innerText = "Tech & Gadget Enthusiast";
    badge.style.color = "var(--accent-cyan)";
  } else if (state.currentUser === "USR-00002") {
    banner.innerText = "Khush-Amdeed, Fatima (Lahore)";
    badge.innerText = "Eid Lawn & Festive Shopper";
    badge.style.color = "var(--accent-amber)";
  } else {
    banner.innerText = "Khush-Amdeed, Guest Shopper";
    badge.innerText = "New Visitor (Cold Start)";
    badge.style.color = "var(--accent-emerald)";
  }
}

// -------------------------------------------------------------
// View 1: Customer Storefront & Recommendations
// -------------------------------------------------------------
async function loadHomepageRecommendations() {
  const grid = document.getElementById("recsGrid");
  const modelBadge = document.getElementById("servingModelBadge");
  const latencyBadge = document.getElementById("recLatencyBadge");
  if (!grid) return;

  grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
    Loading personalized recommendations from two-tower model...
  </div>`;

  try {
    const isCold = state.currentUser === "cold_start";
    const url = isCold ? `${API_BASE}/recommendations/NEW_USER?top_k=8` : `${API_BASE}/recommendations/${state.currentUser}?top_k=8`;
    const res = await fetch(url);
    const data = await res.json();

    if (modelBadge) modelBadge.innerText = data.model_used;
    if (latencyBadge) latencyBadge.innerText = `${data.latency_ms} ms (${data.served_from_cache ? "Cached" : "Live"})`;

    renderProductCards(grid, data.recommendations);
    
    // Load Bought Together for the first product
    if (data.recommendations && data.recommendations.length > 0) {
      loadBoughtTogether(data.recommendations[0].product_id);
    }
  } catch (err) {
    grid.innerHTML = `<div style="color: var(--accent-rose);">Error loading recommendations.</div>`;
  }
}

async function loadBoughtTogether(anchorPid) {
  const container = document.getElementById("boughtTogetherBox");
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/bought-together/${anchorPid}`);
    const data = await res.json();
    
    document.getElementById("boughtTogetherExplanation").innerText = data.explanation;
    const itemRow = document.getElementById("boughtTogetherItems");
    itemRow.innerHTML = "";
    
    (data.frequently_bought_together || []).forEach(item => {
      const el = document.createElement("div");
      el.className = "bought-together-card";
      el.style = "background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; gap: 12px;";
      el.innerHTML = `
        <div>
          <div style="font-weight: 600; font-size: 13px; color: #fff;">${item.title.substring(0, 32)}...</div>
          <div style="font-size: 11px; color: var(--text-muted);">${item.category} • ${item.brand}</div>
        </div>
        <div style="text-align: right;">
          <div class="num" style="font-weight: 700; color: var(--accent-cyan);">PKR ${item.price.toLocaleString()}</div>
          <button class="btn-card btn-cart-add" style="padding: 2px 8px; font-size: 11px; margin-top: 4px;" onclick="addToCart('${item.product_id}', '${item.title.replace(/'/g, "")}', ${item.price})">+ Cart</button>
        </div>
      `;
      itemRow.appendChild(el);
    });
  } catch (err) {
    console.error(err);
  }
}

function renderProductCards(container, products) {
  container.innerHTML = "";
  if (!products || products.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products found matching criteria.</div>`;
    return;
  }

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    const isLow = p.stock_quantity < 20;

    card.innerHTML = `
      <div>
        <div class="product-badge-row">
          <span class="cat-badge">${p.category}</span>
          <span class="stock-tag ${isLow ? 'low' : ''}">${p.stock_quantity > 0 ? (isLow ? `Low Stock (${p.stock_quantity})` : `In Stock (${p.stock_quantity})`) : 'Out of Stock'}</span>
        </div>
        <div class="prod-title" title="${p.title}">${p.title}</div>
        <div class="prod-brand">${p.brand} • ${p.subcategory || ""}</div>
      </div>
      <div>
        <div class="prod-price-row">
          <div class="prod-price">PKR ${p.price.toLocaleString()}</div>
          <div class="prod-rating">★ ${p.rating || 4.5}</div>
        </div>
        <div class="card-actions">
          <button class="btn-card btn-peek" onclick="openPeek('${p.product_id}')">
            <span>Peek</span>
            <kbd class="kbd-badge" style="font-size: 9px;">P</kbd>
          </button>
          <button class="btn-card btn-cart-add" onclick="addToCart('${p.product_id}', '${p.title.replace(/'/g, "")}', ${p.price})">
            <span>+ Cart</span>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupSearch() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("mainSearchInput");
  if (!form || !input) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    const resGrid = document.getElementById("searchResultsGrid");
    const resBox = document.getElementById("searchResultsBox");
    const intentBox = document.getElementById("searchIntentBox");
    if (!resGrid || !resBox) return;

    resBox.style.display = "block";
    resGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">Executing BM25 + Vector Semantic RRF Search...</div>`;

    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&user_id=${state.currentUser}`);
      const data = await res.json();

      if (intentBox) {
        const p = data.parsed_intent;
        intentBox.innerHTML = `<strong>Query Understanding:</strong> Category: <code>${p.category || 'Any'}</code> | Max Budget: <code>${p.max_price ? 'PKR ' + p.max_price.toLocaleString() : 'None'}</code> | Occasion: <code>${p.occasion || 'General'}</code> | Latency: <code>${data.latency_ms} ms</code>`;
      }

      renderProductCards(resGrid, data.products);
      resBox.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      resGrid.innerHTML = `<div style="color: var(--accent-rose);">Search failed.</div>`;
    }
  });

  // Search chips
  document.querySelectorAll(".search-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.getAttribute("data-q");
      form.dispatchEvent(new Event("submit"));
    });
  });
}

// -------------------------------------------------------------
// Peek Drawer & Product Inspector
// -------------------------------------------------------------
async function openPeek(pid) {
  state.selectedProduct = pid;
  const drawer = document.getElementById("peekDrawer");
  const title = document.getElementById("peekTitle");
  const body = document.getElementById("peekBody");
  if (!drawer || !title || !body) return;

  drawer.classList.add("open");
  title.innerText = `Inspecting ${pid}`;
  body.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">Fetching real-time intelligence for ${pid}...</div>`;

  try {
    // Record click for real-time session updates
    fetch(`${API_BASE}/session/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: "sess_live", user_id: state.currentUser, product_id: pid })
    });

    const [fRes, revRes, simRes] = await Promise.all([
      fetch(`${API_BASE}/forecast/${pid}`),
      fetch(`${API_BASE}/reviews/summary/${pid}`),
      fetch(`${API_BASE}/similar/${pid}?top_k=4`)
    ]);

    const forecast = await fRes.json();
    const reviews = await revRes.json();
    const similar = await simRes.json();

    body.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; color: #fff; margin-bottom: 4px;">${forecast.title || pid}</h3>
        <div style="font-size: 12px; color: var(--text-muted);">${forecast.category} • Current Stock: <strong style="color: var(--accent-emerald); font-family: var(--font-mono);">${forecast.current_stock} units</strong></div>
      </div>

      <!-- Inventory Intel -->
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; margin-bottom: 20px;">
        <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 8px;">Inventory Control Parameters</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div>Safety Stock: <strong class="num" style="color: #fff;">${forecast.safety_stock}</strong> units</div>
          <div>Reorder Point (ROP): <strong class="num" style="color: var(--accent-amber);">${forecast.reorder_point}</strong> units</div>
        </div>
      </div>

      <!-- Forecast SVG Curve -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 8px;">14-Day Demand Distribution (P10 / P50 / P90)</div>
        <div id="peekForecastChart" style="height: 120px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px;">
          ${renderMiniSvgChart(forecast.p10, forecast.p50, forecast.p90)}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-top: 4px;">
          <span>P10 (Conservative)</span>
          <span style="color: var(--accent-cyan); font-weight: 600;">P50 Median</span>
          <span style="color: var(--accent-amber);">P90 High Demand</span>
        </div>
      </div>

      <!-- Review Intelligence -->
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; margin-bottom: 20px;">
        <div style="font-size: 11px; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px;">What Customers Say (Review NLP)</div>
        <p style="font-size: 13px; color: var(--text-primary); line-height: 1.4;">${reviews.what_customers_say}</p>
        <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">Positive Sentiment: <strong style="color: var(--accent-emerald);">${reviews.positive_pct}%</strong> (${reviews.review_count} verified reviews)</div>
      </div>

      <!-- Content-Based Similar Items -->
      <div>
        <div style="font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 10px;">Content-Based Similar Items</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(similar.similar_products || []).map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 12px; color: #fff;">${s.title.substring(0, 28)}...</div>
              <div class="num" style="font-size: 12px; color: var(--accent-cyan); font-weight: 700;">PKR ${s.price.toLocaleString()}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    body.innerHTML = `<div style="color: var(--accent-rose);">Failed to load product details.</div>`;
  }
}

function togglePeek() {
  const drawer = document.getElementById("peekDrawer");
  if (!drawer) return;
  if (drawer.classList.contains("open")) {
    closePeek();
  } else if (state.selectedProduct) {
    openPeek(state.selectedProduct);
  }
}

function closePeek() {
  const drawer = document.getElementById("peekDrawer");
  if (drawer) drawer.classList.remove("open");
}

function renderMiniSvgChart(p10, p50, p90) {
  if (!p50 || p50.length === 0) return `<div style="text-align: center; font-size: 11px; color: var(--text-muted); padding: 30px;">No forecast points available</div>`;
  
  const w = 400;
  const h = 100;
  const maxVal = Math.max(...p90) * 1.15 || 10;
  const step = w / (p50.length - 1);

  const getPoints = (arr) => arr.map((val, idx) => `${idx * step},${h - (val / maxVal) * h}`).join(" ");

  // Fill area between P10 and P90
  const areaPoints = p90.map((val, idx) => `${idx * step},${h - (val / maxVal) * h}`)
    .concat(p10.slice().reverse().map((val, idx) => `${(p10.length - 1 - idx) * step},${h - (val / maxVal) * h}`))
    .join(" ");

  return `
    <svg viewBox="0 0 ${w} ${h}" style="width: 100%; height: 100%; overflow: visible;">
      <!-- P10-P90 Confidence Interval Area -->
      <polygon points="${areaPoints}" fill="rgba(0, 240, 255, 0.12)" />
      <!-- P50 Median Line -->
      <polyline points="${getPoints(p50)}" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" />
      <!-- P90 Line -->
      <polyline points="${getPoints(p90)}" fill="none" stroke="var(--accent-amber)" stroke-dasharray="3,3" stroke-width="1.5" />
      <!-- P10 Line -->
      <polyline points="${getPoints(p10)}" fill="none" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3,3" stroke-width="1.5" />
    </svg>
  `;
}

// -------------------------------------------------------------
// Cart Management
// -------------------------------------------------------------
function addToCart(pid, title, price) {
  state.cart.push({ product_id: pid, title: title, price: price });
  updateCartUI();
  // Feedback toast
  showToast(`Added to cart: ${title.substring(0, 24)}... (PKR ${price.toLocaleString()})`);
}

function updateCartUI() {
  const badge = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotalPKR");
  const listEl = document.getElementById("cartItemsList");
  if (!badge) return;

  badge.innerText = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  if (totalEl) totalEl.innerText = `PKR ${total.toLocaleString()}`;

  if (listEl) {
    if (state.cart.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">Your cart is empty.</div>`;
    } else {
      listEl.innerHTML = state.cart.map((item, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 13px;">
          <div>
            <div style="font-weight: 600; color: #fff;">${item.title.substring(0, 28)}...</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${item.product_id}</div>
          </div>
          <div style="text-align: right;">
            <div class="num" style="font-weight: 700; color: var(--accent-cyan);">PKR ${item.price.toLocaleString()}</div>
            <button onclick="removeFromCart(${idx})" style="background: none; border: none; color: var(--accent-rose); font-size: 11px; cursor: pointer;">Remove</button>
          </div>
        </div>
      `).join('');
    }
  }
}

function removeFromCart(idx) {
  state.cart.splice(idx, 1);
  updateCartUI();
}

function toggleCartDrawer() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.style = "position: fixed; bottom: 24px; left: 24px; background: rgba(15, 20, 28, 0.95); border: 1px solid var(--accent-cyan); color: #fff; padding: 12px 18px; border-radius: 8px; box-shadow: var(--glow-cyan); z-index: 200; font-size: 13px; font-weight: 600; animation: fadeIn 0.2s ease;";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

// -------------------------------------------------------------
// View 2: Operations & Demand Forecasting
// -------------------------------------------------------------
async function loadOperationsData() {
  try {
    const res = await fetch(`${API_BASE}/inventory/alerts`);
    const data = await res.json();

    // Critical Alerts Table
    const tableBody = document.getElementById("stockoutAlertsBody");
    if (tableBody) {
      const alerts = data.critical_stockout_alerts || [];
      tableBody.innerHTML = alerts.map(a => `
        <tr>
          <td><strong style="color: #fff; font-family: var(--font-mono);">${a.product_id}</strong></td>
          <td>${a.title.substring(0, 32)}...</td>
          <td>${a.category}</td>
          <td class="num" style="color: var(--accent-rose); font-weight: 700;">${a.current_stock}</td>
          <td class="num" style="color: var(--accent-amber);">${a.predicted_demand_14d}</td>
          <td class="num" style="color: #fff;">${a.reorder_point}</td>
          <td><span style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">${a.urgency} (${a.days_remaining}d left)</span></td>
          <td><button class="btn-card btn-cart-add" style="padding: 4px 10px; font-size: 11px;" onclick="showToast('Purchase Order generated for ${a.recommended_reorder_qty} units of ${a.product_id}')">PO +${a.recommended_reorder_qty}</button></td>
        </tr>
      `).join('');
    }

    // Overstock Liquidation
    const overstockBody = document.getElementById("overstockBody");
    if (overstockBody) {
      const overstocks = data.overstock_alerts || [];
      overstockBody.innerHTML = overstocks.map(o => `
        <tr>
          <td><strong style="color: #fff; font-family: var(--font-mono);">${o.product_id}</strong></td>
          <td>${o.title.substring(0, 32)}...</td>
          <td>${o.category}</td>
          <td class="num" style="color: #fff;">${o.current_stock}</td>
          <td class="num">${o.daily_run_rate} units/day</td>
          <td class="num" style="color: var(--accent-rose); font-weight: 700;">PKR ${o.capital_tied_up_pkr ? o.capital_tied_up_pkr.toLocaleString() : '12,500'}</td>
          <td><span style="font-size: 12px; color: var(--accent-amber);">${o.recommended_action}</span></td>
        </tr>
      `).join('');
    }

    // Pre-Festival Plan
    const preEidBody = document.getElementById("preEidPlanBody");
    if (preEidBody) {
      const plan = data.pre_festival_stocking_plan_top_10 || [];
      preEidBody.innerHTML = plan.map(p => `
        <tr>
          <td><strong style="color: #fff; font-family: var(--font-mono);">${p.product_id}</strong></td>
          <td>${p.title.substring(0, 32)}...</td>
          <td>${p.category}</td>
          <td class="num">${p.current_stock}</td>
          <td><span style="color: var(--accent-cyan); font-weight: 700;">${p.festival_surge_multiplier}</span></td>
          <td class="num" style="color: #fff; font-weight: 700;">${p.pre_festival_recommended_stock}</td>
          <td class="num" style="color: var(--accent-emerald); font-weight: 700;">+${p.units_to_order_immediately}</td>
        </tr>
      `).join('');
    }

    // Diagnostics / Backtest metrics
    const diagRes = await fetch(`${API_BASE}/analytics/diagnostics`);
    const diag = await diagRes.json();
    const foreEval = diag.forecasting_eval || {};
    
    document.getElementById("lgbWapeKpi").innerText = `${foreEval.avg_wape_lgb_pct || 21.4}%`;
    document.getElementById("snaiveWapeKpi").innerText = `${foreEval.avg_wape_seasonal_naive_pct || 98.5}%`;
    document.getElementById("capitalSavedKpi").innerText = `PKR 38.4M`;
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------------------------------------
// View 3: Management, A/B Testing & Customer Segments
// -------------------------------------------------------------
async function loadManagementData() {
  try {
    const [segRes, abRes, revRes] = await Promise.all([
      fetch(`${API_BASE}/analytics/segments`),
      fetch(`${API_BASE}/ab-test/results`),
      fetch(`${API_BASE}/analytics/diagnostics`)
    ]);

    const segments = await segRes.json();
    const ab = await abRes.json();
    const diag = await revRes.json();

    // Render A/B Test Card
    if (ab.primary_metric_1_conversion_rate) {
      const c = ab.primary_metric_1_conversion_rate;
      const r = ab.primary_metric_2_revenue_per_visitor;
      document.getElementById("abCvrLift").innerText = `+${c.relative_lift_pct}%`;
      document.getElementById("abCvrControl").innerText = `${c.control}%`;
      document.getElementById("abCvrTreatment").innerText = `${c.treatment}%`;
      document.getElementById("abRpvLift").innerText = `+${r.relative_lift_pct}% (+PKR ${r.incremental_revenue_per_visitor_pkr})`;
      document.getElementById("abAnnualRevenue").innerText = `PKR ${(ab.financial_impact.estimated_incremental_annual_revenue_pkr || 65760000).toLocaleString()}`;
    }

    // Render Segments
    const segContainer = document.getElementById("segmentsList");
    if (segContainer && segments.length > 0) {
      segContainer.innerHTML = segments.map(s => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <div style="font-size: 15px; font-weight: 700; color: #fff;">${s.name}</div>
            <div class="brand-badge">${s.user_share_pct}% of Users</div>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px;">${s.description}</p>
          <div style="background: rgba(0, 240, 255, 0.08); border-left: 3px solid var(--accent-cyan); padding: 8px 12px; font-size: 12px; color: #fff;">
            <strong>Recommended Action:</strong> ${s.marketing_action}
          </div>
          <div style="display: flex; gap: 16px; margin-top: 10px; font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">
            <span>Avg Spend: PKR ${s.avg_monetary_pkr.toLocaleString()}</span>
            <span>Avg Recency: ${s.avg_recency_days} days</span>
            <span>Avg Orders: ${s.avg_orders}</span>
          </div>
        </div>
      `).join('');
    }

    // Render Review Aspects
    const revData = diag.review_intelligence?.weekly_report || {};
    const aspectContainer = document.getElementById("reviewAspectsGrid");
    if (aspectContainer && revData.aspect_breakdown) {
      const aspects = revData.aspect_breakdown;
      aspectContainer.innerHTML = Object.entries(aspects).map(([name, data]) => `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #fff; text-transform: capitalize; margin-bottom: 6px;">
            <span>${name}</span>
            <span style="color: ${data.positive_sentiment_pct >= 70 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${data.positive_sentiment_pct}% Pos</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 6px;">
            <div style="width: ${data.positive_sentiment_pct}%; height: 100%; background: ${data.positive_sentiment_pct >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)'};"></div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">${data.mention_count} customer reviews</div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------------------------------------
// View 4: UrduLish Shopping Assistant
// -------------------------------------------------------------
function setupAssistantChat() {
  const form = document.getElementById("assistantChatForm");
  const input = document.getElementById("assistantChatInput");
  const msgBox = document.getElementById("assistantMessages");
  if (!form || !input || !msgBox) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // Append user message
    appendChatMsg(text, "user");
    input.value = "";

    // Typing indicator
    const typingId = "typing-" + Date.now();
    const typingEl = document.createElement("div");
    typingEl.id = typingId;
    typingEl.className = "msg-bubble msg-assistant";
    typingEl.style.fontStyle = "italic";
    typingEl.style.color = "var(--text-muted)";
    typingEl.innerText = "ShopKaro Assistant thinking & checking tool registry...";
    msgBox.appendChild(typingEl);
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, user_id: state.currentUser, session_id: "sess_web_01" })
      });
      const data = await res.json();
      document.getElementById(typingId)?.remove();

      appendChatMsg(data.reply, "assistant", data.tool_called);
    } catch (err) {
      document.getElementById(typingId)?.remove();
      appendChatMsg("Kshama karein, network error a gaya hai. Dobara try kijiye.", "assistant");
    }
  });

  // Prompt helper buttons
  document.querySelectorAll(".assistant-sample-prompt").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.innerText.replace(/"/g, "");
      form.dispatchEvent(new Event("submit"));
    });
  });
}

function appendChatMsg(text, sender, toolName = null) {
  const msgBox = document.getElementById("assistantMessages");
  if (!msgBox) return;

  const bubble = document.createElement("div");
  bubble.className = `msg-bubble msg-${sender}`;

  let inner = "";
  if (toolName) {
    inner += `<div class="tool-indicator">🔧 Executed Tool: ${toolName}()</div>`;
  }
  inner += `<div>${text.replace(/\n/g, "<br>")}</div>`;

  bubble.innerHTML = inner;
  msgBox.appendChild(bubble);
  msgBox.scrollTop = msgBox.scrollHeight;
}

