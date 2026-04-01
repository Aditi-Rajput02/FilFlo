# FilFlo — Sample Data Files

This folder contains **8 sample JSON data files** that simulate the real-world data FilFlo would consume from various systems. All data is fictional but realistic, modeled after actual D2C brand operations on Blinkit, Zepto, and Instamart.

---

## 📁 Files Overview

| File | Records | Source System | Description |
|------|---------|---------------|-------------|
| `skus.json` | 22 SKUs | ERP / Brand Master | Product catalog with pricing, weights, reorder points |
| `stores.json` | 22 Stores | Platform APIs | Dark store locations across Blinkit, Zepto, Instamart |
| `inventory_snapshots.json` | 25 Records | Platform APIs | Real-time stock levels per SKU per store |
| `sales_orders.json` | 25 Orders | Order Management System | Completed orders from all 3 platforms |
| `warehouses.json` | 7 Warehouses | Warehouse Management System (WMS) | Brand's own warehouses across cities |
| `suppliers.json` | 10 Suppliers | Supplier / ERP System | Supplier catalog with lead times and API details |
| `demand_forecasts.json` | 22 Forecasts | FilFlo AI Engine | AI-predicted demand per SKU per store |
| `replenishment_suggestions.json` | 15 Suggestions | FilFlo AI Engine | Auto-generated reorder alerts with urgency levels |
| `purchase_orders.json` | 15 POs | FilFlo PO Generator | Auto-created purchase orders sent to suppliers |

---

## 🔗 How Data Flows in FilFlo

```
Blinkit API ──────────────────────────────────────────────────────────────────┐
Zepto API ─────────────────────────────────────────────────────────────────── ├──► inventory_snapshots.json
Instamart API ─────────────────────────────────────────────────────────────── ┘

Order Management System (OMS) ────────────────────────────────────────────────► sales_orders.json

ERP / Brand Master ────────────────────────────────────────────────────────── ├──► skus.json
                                                                               └──► warehouses.json

Supplier Portal / ERP ────────────────────────────────────────────────────────► suppliers.json

Platform Store Catalog ───────────────────────────────────────────────────────► stores.json

FilFlo AI Engine (uses all above) ───────────────────────────────────────────► demand_forecasts.json
                                                                               ► replenishment_suggestions.json
                                                                               ► purchase_orders.json
```

---

## 📄 File Details

### 1. `skus.json` — Product Catalog
**Source:** ERP System / Brand Master Data

| Field | Type | Description |
|-------|------|-------------|
| `sku_id` | string | Unique SKU identifier (e.g., SKU-A001) |
| `name` | string | Product name |
| `brand` | string | Brand name |
| `category` | string | Product category |
| `unit` | string | Unit of measurement (bottle, pouch, bar) |
| `mrp` | number | Maximum Retail Price (₹) |
| `cost_price` | number | Brand's cost price from supplier (₹) |
| `weight_grams` | number | Product weight in grams |
| `reorder_point` | number | Stock level that triggers a reorder alert |
| `safety_stock` | number | Minimum buffer stock to maintain |
| `target_stock` | number | Ideal stock level to maintain |

**Real-world source:** Exported from Unicommerce / Increff ERP or brand's own Google Sheet.

---

### 2. `stores.json` — Dark Store Locations
**Source:** Blinkit / Zepto / Instamart Partner Portal APIs

| Field | Type | Description |
|-------|------|-------------|
| `store_id` | string | Unique store ID (e.g., BLK-BLR-001) |
| `platform` | string | Blinkit / Zepto / Instamart |
| `store_name` | string | Human-readable store name |
| `city` | string | City |
| `zone` | string | Zone within city |
| `pincode` | string | Pincode |
| `lat` / `lng` | number | GPS coordinates |
| `warehouse_id` | string | Which warehouse serves this store |
| `active` | boolean | Whether store is currently active |

**Real-world source:** Blinkit Partner API, Zepto Seller Dashboard, Swiggy Instamart API.

---

### 3. `inventory_snapshots.json` — Real-Time Stock Levels
**Source:** Platform APIs (pulled every 15 minutes)

| Field | Type | Description |
|-------|------|-------------|
| `snapshot_id` | string | Unique snapshot ID |
| `sku_id` | string | Which SKU |
| `store_id` | string | Which store |
| `platform` | string | Platform name |
| `current_stock` | number | Units currently in stock |
| `threshold` | number | Reorder threshold for this store |
| `avg_daily_sales` | number | Average units sold per day (last 7 days) |
| `days_remaining` | number | Estimated days until stockout |
| `status` | string | OK / LOW / CRITICAL |
| `last_synced` | ISO datetime | When this data was last pulled |

**Status logic:**
- `OK` → days_remaining > 5
- `LOW` → days_remaining between 2–5
- `CRITICAL` → days_remaining < 2

---

### 4. `sales_orders.json` — Order Data
**Source:** Blinkit OMS, Zepto OMS, Instamart OMS

| Field | Type | Description |
|-------|------|-------------|
| `order_id` | string | Unique order ID |
| `platform` | string | Platform name |
| `store_id` | string | Store where order was fulfilled |
| `sku_id` | string | Product ordered |
| `qty_sold` | number | Quantity sold |
| `sale_price` | number | Price at which sold (₹) |
| `order_date` | date | Date of order |
| `order_time` | time | Time of order |
| `status` | string | DELIVERED / CANCELLED / PENDING |

**Real-world source:** Blinkit Seller API, Zepto Seller Portal, Swiggy Instamart Seller API.

---

### 5. `warehouses.json` — Warehouse Master
**Source:** Warehouse Management System (WMS) / ERP

| Field | Type | Description |
|-------|------|-------------|
| `warehouse_id` | string | Unique warehouse ID |
| `name` | string | Warehouse name |
| `city` | string | City |
| `address` | string | Full address |
| `capacity_units` | number | Max storage capacity in units |
| `manager` | string | Warehouse manager name |
| `contact` | string | Manager phone number |
| `serves_platforms` | array | Which platforms this warehouse serves |

---

### 6. `suppliers.json` — Supplier Catalog
**Source:** ERP / Supplier Management System

| Field | Type | Description |
|-------|------|-------------|
| `supplier_id` | string | Unique supplier ID |
| `name` | string | Supplier company name |
| `contact_person` | string | Primary contact |
| `email` | string | Supplier email |
| `phone` | string | Supplier phone |
| `city` | string | Supplier city |
| `skus_supplied` | array | List of SKUs this supplier provides |
| `lead_time_days` | number | Days from order to delivery |
| `min_order_qty` | number | Minimum order quantity |
| `payment_terms` | string | Net 15 / Net 30 / Advance |
| `api_integration` | boolean | Whether supplier has API integration |
| `api_endpoint` | string | Supplier's order API URL (if available) |

**Note:** Suppliers with `api_integration: true` can receive orders automatically via FilFlo's Autonomous Reorder Agent. Others receive orders via email.

---

### 7. `demand_forecasts.json` — AI Demand Predictions
**Source:** FilFlo AI Engine (generated internally)

| Field | Type | Description |
|-------|------|-------------|
| `forecast_id` | string | Unique forecast ID |
| `sku_id` | string | Which SKU |
| `store_id` | string | Which store |
| `forecast_date` | date | Date being forecasted |
| `predicted_qty` | number | Predicted units to be sold |
| `actual_qty_last_7_days` | array | Last 7 days of actual sales |
| `avg_daily` | number | 7-day average daily sales |
| `confidence` | number | Model confidence (0–1) |
| `spike_detected` | boolean | Whether a demand spike is predicted |

**Algorithm:** 7-day rolling average + spike detection using standard deviation threshold.

---

### 8. `replenishment_suggestions.json` — Reorder Alerts
**Source:** FilFlo AI Engine (generated internally)

| Field | Type | Description |
|-------|------|-------------|
| `suggestion_id` | string | Unique suggestion ID |
| `sku_id` / `sku_name` | string | Product details |
| `store_id` / `store_name` | string | Store details |
| `current_stock` | number | Current stock at time of suggestion |
| `days_remaining` | number | Days until stockout |
| `suggested_qty` | number | Recommended order quantity |
| `urgency` | string | CRITICAL / LOW / NORMAL |
| `reason` | string | Human-readable explanation |
| `supplier_id` | string | Best supplier for this SKU |
| `estimated_cost` | number | Estimated PO cost (₹) |
| `status` | string | PENDING / AUTO_ORDERED / SCHEDULED |

---

### 9. `purchase_orders.json` — Purchase Orders
**Source:** FilFlo PO Generator (generated internally)

| Field | Type | Description |
|-------|------|-------------|
| `po_id` | string | Unique PO ID |
| `suggestion_id` | string | Which replenishment suggestion triggered this |
| `sku_id` / `sku_name` | string | Product details |
| `store_id` / `store_name` | string | Destination store |
| `warehouse_id` | string | Fulfilling warehouse |
| `supplier_id` / `supplier_name` | string | Supplier details |
| `qty_ordered` | number | Units ordered |
| `unit_cost` | number | Cost per unit (₹) |
| `total_cost` | number | Total PO value (₹) |
| `status` | string | DRAFT / PENDING_APPROVAL / SENT_TO_SUPPLIER / CONFIRMED / SCHEDULED |
| `auto_generated` | boolean | Whether AI placed this order autonomously |
| `created_at` | ISO datetime | When PO was created |
| `expected_delivery` | ISO datetime | Expected delivery date/time |
| `notes` | string | Additional notes |

---

## 🔑 Do Real APIs Exist?

| Platform | Real API Available? | How to Get Access |
|----------|--------------------|--------------------|
| **Blinkit** | ✅ Yes (Partner API) | Apply at blinkit.com/partner → get API key after onboarding |
| **Zepto** | ✅ Yes (Seller API) | Apply at seller.zepto.com → API credentials after approval |
| **Instamart** | ✅ Yes (Swiggy Partner API) | Apply at partner.swiggy.com → API key after onboarding |
| **ERP (Unicommerce)** | ✅ Yes | unicommerce.com → API docs available after subscription |
| **ERP (Increff)** | ✅ Yes | increff.com → API access via enterprise plan |

> **For development/demo purposes**, these JSON files serve as mock data that replaces real API calls. In production, FilFlo would replace these files with live API integrations.

---

## 🗂️ ID Reference Guide

| Prefix | Entity | Example |
|--------|--------|---------|
| `SKU-A` | Product SKU | SKU-A001 |
| `BLK-` | Blinkit Store | BLK-BLR-001 |
| `ZPT-` | Zepto Store | ZPT-MUM-002 |
| `INS-` | Instamart Store | INS-DEL-001 |
| `WH-` | Warehouse | WH-BLR-01 |
| `SUP-` | Supplier | SUP-003 |
| `ORD-BLK-` | Blinkit Order | ORD-BLK-10001 |
| `ORD-ZPT-` | Zepto Order | ORD-ZPT-20001 |
| `ORD-INS-` | Instamart Order | ORD-INS-30001 |
| `FCT-` | Demand Forecast | FCT-001 |
| `RPL-` | Replenishment Suggestion | RPL-001 |
| `PO-2026-` | Purchase Order | PO-2026-001 |

---

*Generated by FilFlo AI — March 31, 2026*
