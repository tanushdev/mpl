# MPIL ERP — Metallurgical Products (India) Pvt. Ltd.

Enterprise Material Flow, Multi-Metal Campaign Production, 3D Loss Tracking, and Finished Goods Inventory Platform for **Metallurgical Products (India) Private Limited (MPIL)**, MIDC Taloja Works, Raigad, Maharashtra.

🔗 **Live Production URL:** [https://mpil-erp-demo.vercel.app](https://mpil-erp-demo.vercel.app)

---

## 🏭 Industrial Context & System Architecture

MPIL refines multi-metal concentrate ores (primarily **Tantalum Columbite Concentrate**) into high-purity **Tantalum Pentoxide ($Ta_2O_5$)** and **Niobium Pentoxide ($Nb_2O_5$)** via hydrometallurgical digestion and solvent extraction (SX).

### Core Tracking Metrics (3-Variable Physics Conservation)
Every inventory movement tracks three parallel variables:
1. **Net Physical Dry Weight (Kg):** Accounting for tare and moisture deduction:
   $$\text{Net Dry Weight} = \text{Weight Received} - \text{Moisture Content}$$
2. **Contained Metal Oxide A ($Ta_2O_5$ in Kg / %)**
3. **Contained Metal Oxide B ($Nb_2O_5$ in Kg / %)**

---

## 🚀 Key Modules & Capabilities

- **Role-Based Access Control (RBAC):**
  - **Super Admin / Management:** Executive analytics & real-time stock dashboards.
  - **Production User:** Campaign batch creation, Store Requisitions (SRN), and Material Transfer Notes.
  - **Quality Control (QC) User:** Inbound RM weighing/sampling, oxide assay recording ($Ta$ & $Nb$), and returnable lab sample tracking.
  - **Store & Maintenance User:** Raw material ledger, stock transfers, finished goods dispatch, and commercial invoicing.
- **Login Portal:**
  - Dedicated authentication page with 1-click persona quick-switcher for seamless role testing.
  - Official MPIL branding, password visibility toggle, and workstation session lock.
- **Multi-UID Production Campaigns:**
  - Aggregates multiple raw material lots into unified production campaigns with weighted assay averaging.
- **3D Production Loss Tracker:**
  - Reconciles **Solid Losses** (filter cakes, digestion residues), **Liquid Losses** (raffinate, effluent streams), and **Trace / Unidentified Losses** (0.1%–0.2% variance).
- **Document Digitization & Print Engine:**
  - Interactive digital forms with auto-generated reference numbers and exportable print layouts for:
    - Purchase Orders (`PO`)
    - Store Requisition Notes (`SRN`)
    - Material Transfer Notes (`Plant → Store` & `Store → Plant`)
    - Sales Contracts / Commercial Dispatch
- **Admin Panel:**
  - Staff directory with instant role re-assignment.
  - Multi-unit plant projects dashboard with progress tracking and project creation.
  - Role permissions matrix and financial approval thresholds ($50k+).

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **Build Tool:** Vite 8
- **Deployment:** Vercel

---

## 💻 Local Development

```bash
# Navigate to application directory
cd mpil-erp-demo

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

© 2026 Metallurgical Products (India) Private Limited. All rights reserved. • MIDC Taloja Works
