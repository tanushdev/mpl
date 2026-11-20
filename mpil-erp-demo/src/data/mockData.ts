import { 
  UserProfile, 
  Supplier,
  Customer,
  PurchaseOrder, 
  RawMaterialUID, 
  IssueTransferNoteRM, 
  IssueTransferNoteFG,
  MaterialTransferNote,
  StoreRequisition,
  ProductionCampaign, 
  ProductionLossEntry,
  FinishedGoodItem, 
  SampleRecord, 
  SalesContract, 
  WorkflowRule,
  LiveLedgerState,
  PlantProject
} from '../types/erp';

// 4 PRIMARY RBAC PERSONAS SPECIFIED IN SECTION 1
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    empId: 'MPIL-DIR-001',
    name: 'Pranav Mathur',
    email: 'pranav.mathur@mpil.co.in',
    department: 'Executive Management / Super Admin',
    designation: 'Managing Director (Executive Read-Only)',
    role: 'SUPER_ADMIN', // Read-only access to high-level executive analytics & stock dashboards (no operational data entry)
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    approvalLimitUsd: 10000000,
  },
  {
    id: 'usr-2',
    empId: 'MPIL-PRD-401',
    name: 'Sanjay Patil',
    email: 'sanjay.p@mpil.co.in',
    department: 'Production & Operations',
    designation: 'Production Operations Head',
    role: 'PRODUCTION_USER', // Store Requisitions, Campaign Builders, Material Transfers (Plant->Store), Manual Loss Entry
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    approvalLimitUsd: 100000,
  },
  {
    id: 'usr-3',
    empId: 'MPIL-QAC-301',
    name: 'Dr. Sunita Rao',
    email: 'dr.sunita@mpil.co.in',
    department: 'Quality Control & Analytical Lab',
    designation: 'Chief Analytical Chemist & QC Head',
    role: 'QC_USER', // Inbound RM weighing/sampling, oxide content Ta & Nb upload, FG sampling, Returnable Lab Sample ledger
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    approvalLimitUsd: 50000,
  },
  {
    id: 'usr-4',
    empId: 'MPIL-STR-205',
    name: 'Ramesh Kadam',
    email: 'ramesh.k@mpil.co.in',
    department: 'Stores & Maintenance',
    designation: 'Stores General Manager',
    role: 'STORE_USER', // RM Inventory ledger, Requisition approvals/issuance, Material Transfers (Store<->Plant), FG Inventory, Dispatch deductions
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    approvalLimitUsd: 25000,
  },
  {
    id: 'usr-5',
    empId: 'MPIL-PUR-102',
    name: 'Vikram Deshmukh',
    email: 'vikram.d@mpil.co.in',
    department: 'Purchase & Procurement',
    designation: 'Procurement Specialist',
    role: 'PURCHASE_HEAD',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    approvalLimitUsd: 75000,
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    code: 'SUP-JAP-01',
    name: 'Nippon Advanced Metals & Materials Corp.',
    contactPerson: 'Kenji Takahashi',
    email: 'k.takahashi@nippon-metals.co.jp',
    phone: '+81 3 5555 0192',
    address: '7-1 Chiyoda-ku, Marunouchi 2-Chome, Tokyo 100-0005',
    country: 'Japan',
    taxId: 'JP-9010001089241',
    rating: 4.9,
    paymentTerms: '60% against shipping documents, 40% after Taloja plant assay',
    status: 'Active',
  },
  {
    id: 'sup-2',
    code: 'SUP-NAM-02',
    name: 'Cabot Columbium Minerals Ltd.',
    contactPerson: 'Johan Van Der Merwe',
    email: 'johan.v@cabot-minerals.na',
    phone: '+264 61 299 1100',
    address: 'Sector 4, Industrial Area, Windhoek',
    country: 'Namibia',
    taxId: 'NAM-EXP-441829',
    rating: 4.7,
    paymentTerms: '60% provisional upon Bill of Lading, 40% post-assay deduction',
    status: 'Active',
  },
  {
    id: 'sup-3',
    code: 'SUP-RWA-03',
    name: 'Great Lakes Mining Consortia',
    contactPerson: 'Aline Mukamana',
    email: 'aline@greatlakesmining.rw',
    phone: '+250 788 123 456',
    address: 'Kigali Free Economic Zone, Plot 14',
    country: 'Rwanda',
    taxId: 'RWA-TAX-882190',
    rating: 4.5,
    paymentTerms: '50% provisional against B/L, balance upon moisture deduction',
    status: 'Active',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    code: 'CUST-USA-01',
    name: 'Advanced Optical Crystals Inc.',
    contactPerson: 'Dr. Arthur Pendelton',
    email: 'a.pendelton@opticalcrystals.com',
    phone: '+1 (585) 442-9000',
    address: '450 Innovation Parkway, Rochester, NY 14623',
    country: 'USA',
    totalOrdersUsd: 1470000,
    creditLimitUsd: 2500000,
    status: 'Active',
  },
  {
    id: 'cust-2',
    code: 'CUST-DEU-02',
    name: 'Siemens Precision Ceramics GmbH',
    contactPerson: 'Klaus Weber',
    email: 'klaus.weber@siemens-ceramics.de',
    phone: '+49 89 636 00',
    address: 'Werner-von-Siemens-Strasse 1, Munich',
    country: 'Germany',
    totalOrdersUsd: 820000,
    creditLimitUsd: 1500000,
    status: 'Active',
  },
  {
    id: 'cust-3',
    code: 'CUST-IND-03',
    name: 'Bharat Heavy Electricals Limited (BHEL)',
    contactPerson: 'S. Rajagopalan',
    email: 's.raja@bhel.in',
    phone: '+91 431 257 4100',
    address: 'BHEL Complex, Tiruchirappalli, Tamil Nadu',
    country: 'India',
    totalOrdersUsd: 380000,
    creditLimitUsd: 750000,
    status: 'Active',
  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'MPIL/RM/262743',
    date: '2026-11-12',
    seller: {
      name: 'Nippon Advanced Metals & Materials Corp.',
      address: '7-1 Chiyoda-ku, Marunouchi 2-Chome, Tokyo 100-0005, Japan',
      country: 'Japan',
      gstinOrTaxId: 'JP-9010001089241',
    },
    material: {
      name: 'Tantalum Carbide',
      hsCode: '2849 90 90',
      origin: 'Kobe, Japan',
      quantityKg: 500,
      qualitySpecs: 'Ta (Tantalum): Min 85% | Dissolved gases: Balance | Other impurities: trace ppm | Particle size < 2 mm',
      packing: 'In leak-proof drums suitable for international ocean freight. No plastic film wrapping on drums or pallets.',
    },
    logistics: {
      deliveryDate: '2026-11-30',
      deliveryPort: 'Nhava Sheva Port, India',
      shipmentMode: 'FCL/LCL Ocean Freight (Shipped on board, Freight Pre-paid)',
      portOfShipment: 'Kobe Port, Japan',
      portOfDelivery: 'Nhava Sheva, India',
      consignee: 'Metallurgical Products (India) Private Limited, T-27 MIDC Taloja',
      notifyParty: 'Same as Buyer (IEC: 0302007636 / GSTIN: 27AACCM7042D1ZQ)',
    },
    pricing: {
      rateUsdPerKgTa: 240,
      assumedTaPercent: 85,
      moisturePercent: 1.2,
      receivedWeightKg: 500,
      netDryWeightKg: 494,
      totalCalculatedCifUsd: 100776,
      provisionalPercent: 60,
      provisionalAmountUsd: 60465.6,
      finalBalanceAmountUsd: 40310.4,
    },
    status: 'Approved',
    currentApproverRole: 'DIRECTOR',
    createdBy: 'Vikram Deshmukh',
    createdDate: '2026-11-10',
    timeline: [
      {
        step: 'PO Prepared',
        actor: 'Vikram Deshmukh (Procurement Specialist)',
        action: 'Created Draft PO matching supplier quotation',
        timestamp: '10 Nov 2026, 11:20 AM',
      },
      {
        step: 'Director Approval',
        actor: 'Pranav Mathur (Executive Director)',
        action: 'Approved high-value international procurement ($100,776 CIF)',
        timestamp: '12 Nov 2026, 04:30 PM',
        remarks: 'Approved for scheduled production run.',
      },
    ],
  },
  {
    id: 'po-2',
    poNumber: 'MPIL/RM/262744',
    date: '2026-11-15',
    seller: {
      name: 'Cabot Columbium Minerals Ltd.',
      address: 'Sector 4, Industrial Area, Windhoek, Namibia',
      country: 'Namibia',
      gstinOrTaxId: 'NAM-EXP-441829',
    },
    material: {
      name: 'Columbite Tantalite Ore Concentrate',
      hsCode: '2615 90 20',
      origin: 'Namibia',
      quantityKg: 1200,
      qualitySpecs: 'Ta2O5 Min 32%, Nb2O5 Min 28%, Moisture Max 2.5%, Particle size < 5mm',
      packing: 'Reinforced 50kg HDPE woven bags inside steel drums on pallets.',
    },
    logistics: {
      deliveryDate: '2026-12-15',
      deliveryPort: 'Nhava Sheva Port, India',
      shipmentMode: 'FCL Ocean Freight',
      portOfShipment: 'Walvis Bay, Namibia',
      portOfDelivery: 'Nhava Sheva, India',
      consignee: 'Metallurgical Products (India) Private Limited, T-27 MIDC Taloja',
      notifyParty: 'Same as Buyer (IEC: 0302007636)',
    },
    pricing: {
      rateUsdPerKgTa: 180,
      assumedTaPercent: 32,
      moisturePercent: 2.0,
      receivedWeightKg: 1200,
      netDryWeightKg: 1176,
      totalCalculatedCifUsd: 67737.6,
      provisionalPercent: 60,
      provisionalAmountUsd: 40642.56,
      finalBalanceAmountUsd: 27095.04,
    },
    status: 'Under Review',
    currentApproverRole: 'DIRECTOR',
    createdBy: 'Vikram Deshmukh',
    createdDate: '2026-11-15',
    timeline: [
      {
        step: 'PO Prepared',
        actor: 'Vikram Deshmukh (Procurement Specialist)',
        action: 'Submitted to Director for value sign-off (> $50,000 threshold)',
        timestamp: '15 Nov 2026, 11:00 AM',
      },
    ],
  },
];

// RAW MATERIAL INVENTORY (RM_Lots: Lab_UID, Invoice_No, PO_Ref_No, Net_Dry_Weight_Kg, Ta & Nb)
export const INITIAL_RM_UIDS: RawMaterialUID[] = [
  {
    uid: 'UID-2026-RM-8492',
    invoiceNo: 'EXP-NAM-2026-991',
    poNumber: 'MPIL/RM/262740',
    receiptDate: '2026-11-04',
    materialName: 'Tantalum Columbite Concentrate',
    grossWeightKg: 2045.0,
    tareWeightKg: 45.0,
    netWeightKg: 2000.0, // Weight_Received
    moisturePercent: 1.8,
    netDryWeightKg: 1964.0, // Net_Dry_Weight = Weight_Received - Moisture_Content
    metalOxideAPercent: 36.5,
    containedOxideAKg: 716.86, // Oxide_A_Ta_Kg
    metalOxideBPercent: 24.2,
    containedOxideBKg: 475.29, // Oxide_B_Nb_Kg
    qcStatus: 'Accepted',
    inventoryStatus: 'Allocated to Campaign',
    assignedCampaignNo: 'CAMP-2026-08',
    warehouseLocation: 'Bay RM-A3 (Raw Material Stores)',
  },
  {
    uid: 'UID-2026-RM-8493',
    invoiceNo: 'JP-NAM-5421',
    poNumber: 'MPIL/RM/262741',
    receiptDate: '2026-11-08',
    materialName: 'Tantalum Carbide Grade TC-90',
    grossWeightKg: 512.0,
    tareWeightKg: 12.0,
    netWeightKg: 500.0,
    moisturePercent: 0.8,
    netDryWeightKg: 496.0,
    metalOxideAPercent: 84.8,
    containedOxideAKg: 420.61, // Oxide_A_Ta_Kg
    metalOxideBPercent: 2.1,
    containedOxideBKg: 10.42, // Oxide_B_Nb_Kg
    qcStatus: 'Accepted',
    inventoryStatus: 'Allocated to Campaign',
    assignedCampaignNo: 'CAMP-2026-08',
    warehouseLocation: 'Bay RM-B1 (Precious Metals Vault)',
  },
  {
    uid: 'UID-2026-RM-8494',
    invoiceNo: 'IMP-COL-892',
    poNumber: 'MPIL/RM/262742',
    receiptDate: '2026-11-14',
    materialName: 'Raw Tantalite Slag Residue',
    grossWeightKg: 1050.0,
    tareWeightKg: 50.0,
    netWeightKg: 1000.0,
    moisturePercent: 5.6,
    netDryWeightKg: 944.0,
    metalOxideAPercent: 12.0,
    containedOxideAKg: 113.28,
    metalOxideBPercent: 9.5,
    containedOxideBKg: 89.68,
    qcStatus: 'Rejected - Return', // Rejected -> Return to Supplier
    inventoryStatus: 'In Stock',
    warehouseLocation: 'Quarantine Holding Zone C',
  },
  {
    uid: 'UID-2026-RM-8495',
    invoiceNo: 'IMP-DISP-310',
    poNumber: 'MPIL/RM/262739',
    receiptDate: '2026-11-01',
    materialName: 'Contaminated Columbite Sludge',
    grossWeightKg: 320.0,
    tareWeightKg: 20.0,
    netWeightKg: 300.0,
    moisturePercent: 12.0,
    netDryWeightKg: 264.0,
    metalOxideAPercent: 5.0,
    containedOxideAKg: 13.2,
    metalOxideBPercent: 3.5,
    containedOxideBKg: 9.24,
    qcStatus: 'Rejected - Dispose', // Rejected -> Dispose
    inventoryStatus: 'Consumed',
    warehouseLocation: 'Hazardous Waste Disposal Yard',
  },
  {
    uid: 'UID-2026-RM-8496',
    invoiceNo: 'INV-RW-8812',
    poNumber: 'MPIL/RM/262744',
    receiptDate: '2026-11-16',
    materialName: 'Columbite Ore Concentrate (Kigali)',
    grossWeightKg: 1225.0,
    tareWeightKg: 25.0,
    netWeightKg: 1200.0,
    moisturePercent: 2.1,
    netDryWeightKg: 1174.8,
    metalOxideAPercent: 34.0,
    containedOxideAKg: 399.43,
    metalOxideBPercent: 29.5,
    containedOxideBKg: 346.57,
    qcStatus: 'Pending Inspection',
    inventoryStatus: 'In Stock',
    warehouseLocation: 'Weighbridge Bay 2 (Sampling Inspection)',
  },
];

// STORE REQUISITIONS (Section 2 - Req #4: Requisition Status State Machine)
export const INITIAL_STORE_REQUISITIONS: StoreRequisition[] = [
  {
    requisitionNo: 'SRN-2026-042',
    campaignNo: 'CAMP-2026-08',
    batchNo: 'BATCH-2026-L1',
    targetProduct: 'Product 1 (High Purity Ta2O5)',
    rmLotUids: ['UID-2026-RM-8492', 'UID-2026-RM-8493'],
    totalWeightKg: 1050.0,
    totalTaKg: 504.0,
    totalNbKg: 198.85,
    status: 'Approved',
    requestedBy: 'Sanjay Patil (Production Head)',
    requestDate: '2026-11-05',
    approvedBy: 'Ramesh Kadam (Stores GM)',
    approvalDate: '2026-11-05',
    remarks: 'Approved for campaign smelting run LOT-01.',
  },
  {
    requisitionNo: 'SRN-2026-043',
    campaignNo: 'CAMP-2026-08',
    batchNo: 'BATCH-2026-L2',
    targetProduct: 'Product 1 & Product 3',
    rmLotUids: ['UID-2026-RM-8492'],
    totalWeightKg: 500.0,
    totalTaKg: 182.5,
    totalNbKg: 121.0,
    status: 'Requested',
    requestedBy: 'Sanjay Patil (Production Head)',
    requestDate: '2026-11-18',
    remarks: 'Awaiting Stores sign-off for secondary batch.',
  },
];

// UNIFIED MATERIAL TRANSFER NOTES (Section 2 - Req #4: Store_to_Plant & Plant_to_Store)
export const INITIAL_TRANSFER_NOTES: MaterialTransferNote[] = [
  {
    transferNo: 'IMTN-RM-7721',
    transferType: 'Store_to_Plant',
    uidOrBatchNo: 'UID-2026-RM-8492',
    campaignNo: 'CAMP-2026-08',
    lotNo: 'LOT-01',
    productType: 'Raw Columbite Concentrate',
    weightKg: 800.0,
    oxideAKg: 292.0, // Ta contained
    oxideBKg: 193.6, // Nb contained
    issuedByName: 'Ramesh Kadam (Stores GM)',
    issuedBySignature: 'E-SIGN: RK-MPIL-20261106-0941',
    receivedByName: 'Sanjay Patil (Production Head)',
    receivedBySignature: 'E-SIGN: SP-MPIL-20261106-1015',
    date: '2026-11-06',
    status: 'Completed',
  },
  {
    transferNo: 'IMTN-RM-7722',
    transferType: 'Store_to_Plant',
    uidOrBatchNo: 'UID-2026-RM-8493',
    campaignNo: 'CAMP-2026-08',
    lotNo: 'LOT-01',
    productType: 'Tantalum Carbide TC-90',
    weightKg: 250.0,
    oxideAKg: 212.0,
    oxideBKg: 5.25,
    issuedByName: 'Ramesh Kadam (Stores GM)',
    issuedBySignature: 'E-SIGN: RK-MPIL-20261109-1402',
    receivedByName: 'Sanjay Patil (Production Head)',
    receivedBySignature: 'E-SIGN: SP-MPIL-20261109-1445',
    date: '2026-11-09',
    status: 'Completed',
  },
  {
    transferNo: 'IMTN-FG-9021',
    transferType: 'Plant_to_Store',
    uidOrBatchNo: 'B-P1-2611-01',
    campaignNo: 'CAMP-2026-08',
    lotNo: 'LOT-01',
    productType: 'Product 1 (Grade 1)',
    weightKg: 265.0,
    oxideAKg: 265.0,
    oxideBKg: 0.0,
    issuedByName: 'Sanjay Patil (Production Head)',
    issuedBySignature: 'E-SIGN: SP-MPIL-20261112-1630',
    receivedByName: 'Ramesh Kadam (Stores GM)',
    receivedBySignature: 'E-SIGN: RK-MPIL-20261112-1710',
    date: '2026-11-12',
    status: 'Completed',
  },
];

export const INITIAL_TRANSFER_NOTES_RM: IssueTransferNoteRM[] = [
  {
    transferNo: 'IMTN-RM-7721',
    campaignNo: 'CAMP-2026-08',
    lotNo: 'LOT-01',
    rawMaterialUid: 'UID-2026-RM-8492',
    materialWeightKg: 800.0,
    containedOxideAKg: 292.0,
    containedOxideBKg: 193.6,
    issuedBy: 'Ramesh Kadam (Stores GM)',
    receivedBy: 'Sanjay Patil (Production Head)',
    date: '2026-11-06',
    status: 'Issued',
  },
  {
    transferNo: 'IMTN-RM-7722',
    campaignNo: 'CAMP-2026-08',
    lotNo: 'LOT-01',
    rawMaterialUid: 'UID-2026-RM-8493',
    materialWeightKg: 250.0,
    containedOxideAKg: 212.0,
    containedOxideBKg: 5.25,
    issuedBy: 'Ramesh Kadam (Stores GM)',
    receivedBy: 'Sanjay Patil (Production Head)',
    date: '2026-11-09',
    status: 'Issued',
  },
];

// MANUAL PRODUCTION LOSS ENTRIES (Section 2 - Req #5)
export const INITIAL_LOSS_ENTRIES: ProductionLossEntry[] = [
  {
    id: 'loss-01',
    batchNo: 'BATCH-2026-L1',
    campaignNo: 'CAMP-2026-08',
    date: '2026-11-12',
    solidLossWeightKg: 8.5,
    solidLossTaKg: 8.5,
    solidLossNbKg: 8.5,
    liquidLossWeightKg: 12.0,
    liquidLossVolumeKL: 3.2,
    liquidLossTaKg: 4.2,
    liquidLossNbKg: 3.8,
    unidentifiedLossWeightKg: 2.1, // 0.1% - 0.2% variance (Ta: 1.8 kg, Nb: 0.3 kg)
    loggedBy: 'Sanjay Patil (Production Head)',
  },
];

// PRODUCTION CAMPAIGN WITH MULTIPLE UIDs (Section 2 - Req #3)
export const INITIAL_CAMPAIGNS: ProductionCampaign[] = [
  {
    campaignNo: 'CAMP-2026-08',
    title: 'High Purity Tantalum Pentoxide & Niobium Separation Run',
    targetProduct: 'Product 1, Product 2, Product 3',
    status: 'In Production',
    startDate: '2026-11-05',
    multipleUids: ['UID-2026-RM-8492', 'UID-2026-RM-8493'], // Linked RM_Lot_UIDs[]
    totalInputWeightKg: 1050.0,
    totalInputOxideAKg: 504.0, // Total_Issued_Ta_Kg
    totalInputOxideBKg: 198.85, // Total_Issued_Nb_Kg
    lots: [
      {
        lotNo: 'LOT-01',
        batchNo: 'BATCH-2026-L1',
        uidsAllocated: ['UID-2026-RM-8492', 'UID-2026-RM-8493'],
        inputOxideAKg: 292.0, // Total Input Ta (Kg)
        inputOxideBKg: 193.6, // Total Input Nb (Kg)
        // Product Yields (Excel exact)
        outputProduct1: {
          productName: 'Product 1',
          batchNo: 'B-P1-2611-01',
          netWeightKg: 265.0,
          containedOxideAKg: 265.0,
        },
        outputProduct2: {
          productName: 'Product 2',
          batchNo: 'B-P2-2610-09',
          netWeightKg: 12.5,
          containedOxideAKg: 12.5,
        },
        outputProduct3: {
          productName: 'Product 3',
          batchNo: 'B-P3-2611-04',
          netWeightKg: 181.0,
          containedOxideBKg: 181.0,
        },
        // 3D Losses (Excel exact)
        lossLiquid: {
          batchNo: 'B-LIQ-2611-L1',
          volumeKL: 3.2, // Liquid volume in KL
          oxideAKg: 4.2, // Liquid_Loss_Ta_Kg
          oxideBKg: 3.8, // Liquid_Loss_Nb_Kg
        },
        lossSolid: {
          batchNo: 'B-SOL-2611-S1',
          netWeightKg: 8.5, // Solid_Loss_Weight_Kg
          oxideAKg: 8.5, // Solid_Loss_Ta_Kg
          oxideBKg: 8.5, // Solid_Loss_Nb_Kg
        },
        lossUnidentified: {
          oxideAKg: 1.8, // Unidentified_Loss_Ta_Kg: 292 - (265 + 12.5 + 4.2 + 8.5) = 1.8 kg
          oxideBKg: 0.3, // Unidentified_Loss_Nb_Kg: 193.6 - (181 + 3.8 + 8.5) = 0.3 kg
        },
      },
    ],
  },
];

// FINISHED GOODS INVENTORY (Section 2 - Req #6: Taxonomy)
// Product 1 (Ta2O5): Grade 1 (lower purity) & Grade 2 (higher purity)
// Product 2: Single pure material (Pure)
// Product 3 (Nb2O5): Grade 1 & Grade 2
export const INITIAL_FINISHED_GOODS: FinishedGoodItem[] = [
  {
    id: 'fg-1',
    batchNo: 'B-P1-2611-01',
    productClassification: 'Product 1',
    productName: 'High Purity Tantalum Pentoxide (Ta2O5)',
    grade: 'Grade 1',
    netWeightKg: 1000.0,
    metalOxideAPercent: 99.95,
    containedOxideAKg: 999.5, // Oxide_A_Ta_Kg
    qcReleaseStatus: 'Accepted',
    warehouseBay: 'FG Vault Bay 1',
    availableStockKg: 1000.0,
  },
  {
    id: 'fg-2',
    batchNo: 'B-P1-2611-02',
    productClassification: 'Product 1',
    productName: 'High Purity Tantalum Pentoxide (Ta2O5)',
    grade: 'Grade 2',
    netWeightKg: 1000.0,
    metalOxideAPercent: 99.5,
    containedOxideAKg: 995.0, // Oxide_A_Ta_Kg
    qcReleaseStatus: 'Accepted',
    warehouseBay: 'FG Vault Bay 2',
    availableStockKg: 1000.0,
  },
  {
    id: 'fg-3',
    batchNo: 'B-P2-2610-09',
    productClassification: 'Product 2',
    productName: 'Technical Tantalum Compound',
    grade: 'Pure',
    netWeightKg: 450.0,
    metalOxideAPercent: 98.2,
    containedOxideAKg: 441.9, // Oxide_A_Ta_Kg
    qcReleaseStatus: 'Accepted',
    warehouseBay: 'FG Bay 3',
    availableStockKg: 450.0,
  },
  {
    id: 'fg-4',
    batchNo: 'B-P3-2611-04',
    productClassification: 'Product 3',
    productName: 'Pure Niobium Pentoxide (Nb2O5)',
    grade: 'Grade 1',
    netWeightKg: 400.0,
    metalOxideBPercent: 99.9,
    containedOxideBKg: 399.6, // Oxide_B_Nb_Kg
    qcReleaseStatus: 'Accepted',
    warehouseBay: 'FG Bay 4',
    availableStockKg: 400.0,
  },
  {
    id: 'fg-5',
    batchNo: 'B-P3-2611-05',
    productClassification: 'Product 3',
    productName: 'Pure Niobium Pentoxide (Nb2O5)',
    grade: 'Grade 2',
    netWeightKg: 250.0,
    metalOxideBPercent: 99.0,
    containedOxideBKg: 247.5, // Oxide_B_Nb_Kg
    qcReleaseStatus: 'Accepted',
    warehouseBay: 'FG Bay 4',
    availableStockKg: 250.0,
  },
];

// SAMPLES (Section 2 - Req #7: Returnable vs Non-Returnable)
export const INITIAL_SAMPLES: SampleRecord[] = [
  {
    sampleId: 'SMP-2026-RET-041',
    batchNo: 'B-P1-2611-01',
    type: 'Returnable',
    netWeightKg: 2.5,
    containedOxideAKg: 2.498, // Held_at_Lab balance
    containedOxideBKg: 0.001,
    recipient: 'National Testing Lab (CSIR-NML)',
    purpose: 'Trace GDMS Inter-lab calibration test',
    dateSent: '2026-11-07',
    expectedReturnDate: '2026-11-25',
    status: 'Sent / In Transit',
  },
  {
    sampleId: 'SMP-2026-NRET-118',
    batchNo: 'B-P1-2611-01',
    type: 'Non-Returnable',
    netWeightKg: 1.0,
    containedOxideAKg: 0.9995,
    containedOxideBKg: 0.0,
    recipient: 'Advanced Optical Crystals Inc. (USA)',
    purpose: 'Pre-shipment qualification for Contract TO11TEL261827',
    dateSent: '2026-11-02',
    status: 'Permanently Consumed',
  },
];

// SALES (Section 2 - Req #7: Commercial Sales Contract TO11TEL261827)
export const INITIAL_SALES_CONTRACTS: SalesContract[] = [
  {
    contractNo: 'TO11TEL261827',
    date: '2026-10-12',
    seller: {
      name: 'Metallurgical Products (India) Private Limited',
      address: 'T-27 MIDC-Taloja Industrial Area, Dist. Raigad – 410208, Maharashtra, India',
    },
    buyer: {
      name: 'Advanced Optical Crystals Inc.',
      address: '450 Innovation Parkway, Rochester, NY 14623, USA',
      country: 'USA',
    },
    material: 'Product 1 (High Purity Tantalum Pentoxide Ta2O5)',
    quantityKg: 2000,
    drumCount: 8, // 200L metal drums @ 250 Kg net = 8 drums
    qualitySpecs: 'Ta2O5 min 99.95%, Nb2O5 < 50ppm, Fe < 5ppm, F < 10ppm',
    packing: '200 Ltr Metal Drums, each drum containing 250 Kg net weight (Total: 8 Drums)',
    shipments: [
      {
        description: 'First shipment: December 2026 – 1,000 Kg (4 Drums)',
        weightKg: 1000,
        shipmentMonth: 'December 2026',
      },
      {
        description: 'Second shipment: December 2026 – 1,000 Kg (4 Drums)',
        weightKg: 1000,
        shipmentMonth: 'December 2026',
      },
    ],
    priceUsdPerKg: 735,
    totalValueUsd: 1470000,
    paymentTerms: '100% by TT within 30 days from date of arrival at New York Port, USA',
    status: 'Approved',
    allocatedBatches: ['B-P1-2611-01', 'B-P1-2611-02'],
    authorizedSignatory: 'Pranav Mathur (Executive Director)',
  },
];

// LIVE INVENTORY LEDGER RULES (Section 3)
export const INITIAL_LIVE_LEDGER: LiveLedgerState = {
  rmStore: {
    netWeightKg: 1414.0, // Active accepted stock in stores
    oxideATaKg: 602.8,
    oxideBNbKg: 384.8,
  },
  plantSip: {
    netWeightKg: 1050.0, // Currently inside Smelting / Separation (CAMP-2026-08)
    oxideATaKg: 504.0,
    oxideBNbKg: 198.85,
  },
  cumulativeLosses: {
    solidWeightKg: 8.5,
    solidTaKg: 8.5,
    solidNbKg: 8.5,
    liquidWeightKg: 12.0,
    liquidVolumeKL: 3.2,
    liquidTaKg: 4.2,
    liquidNbKg: 3.8,
    unidentifiedWeightKg: 2.1,
  },
  fgStore: {
    totalWeightKg: 3100.0,
    oxideATaKg: 2436.4,
    oxideBNbKg: 647.1,
    product1Grade1Kg: 1000.0,
    product1Grade2Kg: 1000.0,
    product2PureKg: 450.0,
    product3Grade1Kg: 400.0,
    product3Grade2Kg: 250.0,
  },
  heldAtLab: {
    sampleWeightKg: 2.5,
    oxideATaKg: 2.498,
    oxideBNbKg: 0.001,
    activeCount: 1,
  },
};

export const INITIAL_WORKFLOW_RULES: WorkflowRule[] = [
  {
    id: 'wf-po-1',
    documentType: 'Purchase Order',
    stepNo: 1,
    stepName: 'PO Creation',
    roleRequired: 'PURCHASE_HEAD',
    canReject: false,
    canReturnForCorrection: false,
  },
  {
    id: 'wf-po-2',
    documentType: 'Purchase Order',
    stepNo: 2,
    stepName: 'Director Approval (Above $50k)',
    roleRequired: 'DIRECTOR',
    minThresholdUsd: 50000,
    canReject: true,
    canReturnForCorrection: true,
  },
  {
    id: 'wf-rm-1',
    documentType: 'Material Acceptance',
    stepNo: 1,
    stepName: 'Gate Inward & Weighment',
    roleRequired: 'STORE_USER',
    canReject: false,
    canReturnForCorrection: false,
  },
  {
    id: 'wf-rm-2',
    documentType: 'Material Acceptance',
    stepNo: 2,
    stepName: 'QC Assay Acceptance / Rejection',
    roleRequired: 'QC_USER',
    canReject: true,
    canReturnForCorrection: true,
  },
  {
    id: 'wf-prod-1',
    documentType: 'Campaign Issue Request',
    stepNo: 1,
    stepName: 'Request for Issue of Multiple UIDs',
    roleRequired: 'PRODUCTION_USER',
    canReject: false,
    canReturnForCorrection: false,
  },
  {
    id: 'wf-prod-2',
    documentType: 'Campaign Issue Request',
    stepNo: 2,
    stepName: 'Stores Sign-off & Issue Transfer Note',
    roleRequired: 'STORE_USER',
    canReject: true,
    canReturnForCorrection: true,
  },
];

export const INITIAL_PROJECTS: PlantProject[] = [
  {
    id: 'prj-1',
    projectCode: 'PRJ-2026-TA-01',
    title: 'High-Purity Optical Tantalum Smelting',
    department: 'Production & Smelting',
    leadManager: 'Sanjay Patil',
    budgetKg: 2000,
    startDate: '2026-11-01',
    targetEndDate: '2026-12-15',
    status: 'Active',
    targetProduct: 'Product 1 (High Purity Ta2O5)',
    description: 'Continuous chemical separation and high-temperature vacuum sintering for international contract TO11TEL261827.',
  },
  {
    id: 'prj-2',
    projectCode: 'PRJ-2026-RND-02',
    title: 'Solvent Extraction Organic Stripping Pilot',
    department: 'Research & Development',
    leadManager: 'Dr. Sunita Rao',
    budgetKg: 500,
    startDate: '2026-10-15',
    targetEndDate: '2026-12-30',
    status: 'Active',
    targetProduct: 'Product 3 (Pure Nb2O5)',
    description: 'Pilot tests optimizing MIBK counter-current extraction to minimize fluoride carryover in niobium crystallization.',
  },
  {
    id: 'prj-3',
    projectCode: 'PRJ-2026-REC-03',
    title: 'Secondary Slag Acid Leaching & Metal Recovery',
    department: 'Hydrometallurgical Recovery',
    leadManager: 'Vikram Deshmukh',
    budgetKg: 1200,
    startDate: '2026-11-20',
    targetEndDate: '2027-01-31',
    status: 'Planning',
    targetProduct: 'Technical Tantalum Slag',
    description: 'Recovery of residual tantalum and niobium from solid filter cakes and fluoride precipitation cakes.',
  },
  {
    id: 'prj-4',
    projectCode: 'PRJ-2026-NB-04',
    title: 'Superconducting Grade Niobium Pentoxide',
    department: 'Smelting Unit 2',
    leadManager: 'Sanjay Patil',
    budgetKg: 800,
    startDate: '2026-11-05',
    targetEndDate: '2026-12-20',
    status: 'Under Review',
    targetProduct: 'Product 3 (Grade 1)',
    description: 'Refining of Columbite concentrate to exceed 99.9% Nb2O5 purity with trace iron under 5 ppm.',
  },
];
