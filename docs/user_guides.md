# Operational User Guides
## Marketing, Supply Chain Operations & Executive Management

---

## 1. Marketing Team User Guide

### 1.1 Customer Personas & Targeting Playbooks
The platform continuously clusters ShopKaro's 25,000+ active customers into 5 RFM segments:
1. **Loyal High-Spenders & Tech Enthusiasts (Cluster 0)**:
   - *Characteristics*: High basket size (>PKR 35,000), low price elasticity.
   - *Marketing Playbook*: Priority express shipping, early access to flagship smartphone launches, exclusive zero-fee Cash on Delivery.
2. **Seasonal & Festival Shoppers (Cluster 1)**:
   - *Characteristics*: Extreme demand spikes during Eid ul Fitr, Ramadan, and 11.11.
   - *Marketing Playbook*: Early-bird WhatsApp lawn catalog pre-booking, customized 3-piece unstitched bundle promos.
3. **Bargain Hunters & Deal Explorers (Cluster 2)**:
   - *Characteristics*: High browse frequency, price-sensitive, high cart drop-off.
   - *Marketing Playbook*: Automated price-drop web push notifications, "Spend PKR 2,500 for Free TCS Delivery" banners.
4. **Everyday Household Replenishers (Cluster 3)**:
   - *Characteristics*: High frequency, predictable replenishment intervals (tea, rice, spices).
   - *Marketing Playbook*: Automated restock reminders sent on the 1st of each calendar month with 10% repeat discounts.
5. **Dormant / At-Risk Visitors (Cluster 4)**:
   - *Characteristics*: Inactive for $>90$ days.
   - *Marketing Playbook*: "Hum aapko miss kar rahe hain" win-back SMS with flat PKR 500 off voucher expiring in 72 hours.

---

## 2. Supply Chain & Operations Team User Guide

### 2.1 Reading Demand Forecast Curves
* **P50 (Median Forecast)**: Represents the most probable daily demand trajectory. Use P50 for regular operational planning and standard warehouse staffing.
* **P90 (Conservative High-Demand Ceiling)**: Incorporates peak variability. **Always use P90 when issuing Purchase Orders before Eid and 11.11** to eliminate stock-outs.
* **P10 (Low-Demand Floor)**: Indicates minimum baseline sales.

### 2.2 Inventory Alerts Workflow
1. **Critical Stock-Out Alert (`URGENCY: CRITICAL`)**:
   - Meaning: Current warehouse stock will be exhausted before the supplier's lead time allows replenishment.
   - Action: Click **"PO +Qty"** directly in the Operations View to immediately dispatch an emergency replenishment order.
2. **Overstock Liquidation Alert**:
   - Meaning: Inventory exceeds 60 days of forward demand run-rate.
   - Action: Route items to the Marketing team for inclusion in the "11.11 Clearance Flash Sale" or apply a 20% bundle discount.

---

## 3. Executive Management & A/B Experimentation Guide

### 3.1 Evaluating Experiment Results
* **Primary Decision Thresholds**:
  - Statistical significance requirement: $p < 0.05$ (two-tailed z-test for Conversion Rate, Welch's t-test for Revenue Per Visitor).
  - Practical significance (MDE): Minimum $+5.0\%$ relative lift.
  - Guardrail SLA: Serving latency must not exceed 100 ms ($P95 < 100\text{ ms}$).
* **Decision Framework**:
  - If both primary metrics achieve statistical significance without breaching latency or return rate guardrails, the platform issues an automated **"SHIP TO 100% PRODUCTION TRAFFIC"** determination.
