export type RoleType = 
  | 'SUPER_ADMIN'
  | 'PRODUCTION_USER'
  | 'QC_USER'
  | 'STORE_USER'
  | 'PURCHASE_HEAD'
  | 'STORES_MANAGER'
  | 'QC_HEAD'
  | 'PRODUCTION_HEAD'
  | 'DIRECTOR'
  | 'ACCOUNTS_HEAD';

export interface UserProfile {
  id: string;
  empId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  role: RoleType;
  avatar: string;
  approvalLimitUsd: number;
}

export type DocumentStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Not Approved'
  | 'STOP'
  | 'Rejected'
  | 'Returned for Correction'
  | 'Completed'
  | 'Sent to Supplier';

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  taxId: string;
  rating: number;
  paymentTerms: string;
  status: 'Active' | 'Under Audit' | 'Inactive';
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  totalOrdersUsd: number;
  creditLimitUsd: number;
  status: 'Active' | 'Prospect' | 'Inactive';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. MPIL/RM/262743
  date: string;
  seller: {
    name: string;
    address: string;
    country: string;
    gstinOrTaxId: string;
  };
  material: {
    name: string;
    hsCode: string;
    origin: string;
    quantityKg: number;
    qualitySpecs: string;
    packing: string;
  };
  logistics: {
    deliveryDate: string;
    deliveryPort: string;
    shipmentMode: string;
    portOfShipment: string;
    portOfDelivery: string;
    consignee: string;
    notifyParty: string;
  };
  pricing: {
    rateUsdPerKgTa: number;
    assumedTaPercent: number;
    moisturePercent: number;
    receivedWeightKg: number;
    netDryWeightKg: number;
    totalCalculatedCifUsd: number;
    provisionalPercent: number;
    provisionalAmountUsd: number;
    finalBalanceAmountUsd: number;
  };
  status: DocumentStatus;
  currentApproverRole: RoleType;
  createdBy: string;
  createdDate: string;
  timeline: {
    step: string;
    actor: string;
    action: string;
    timestamp: string;
    remarks?: string;
  }[];
}

// 1. RAW MATERIAL INVENTORY (RM_Lots)
export interface RawMaterialUID {
  uid: string; // Lab_UID (e.g. UID-2026-RM-8492)
  invoiceNo: string; // Invoice_No
  poNumber: string; // PO_Ref_No
  receiptDate: string;
  materialName: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number; // Net Physical Weight (Kg)
  moisturePercent: number;
  netDryWeightKg: number; // Net_Dry_Weight = Weight_Received - Moisture_Content
  metalOxideAPercent: number; // Oxide_A_Ta_Pct (% Ta2O5)
  containedOxideAKg: number; // Oxide_A_Ta_Kg (Ta contained)
  metalOxideBPercent: number; // Oxide_B_Nb_Pct (% Nb2O5)
  containedOxideBKg: number; // Oxide_B_Nb_Kg (Nb contained)
  qcStatus: 'Accepted' | 'Quarantined' | 'Pending Inspection' | 'Rejected - Return' | 'Rejected - Dispose';
  inventoryStatus: 'In Stock' | 'Allocated to Campaign' | 'Partially Issued' | 'Consumed';
  assignedCampaignNo?: string;
  warehouseLocation: string;
}

// STORE REQUISITION NOTE (Section 2 - Req #4)
export interface StoreRequisition {
  requisitionNo: string; // e.g. SRN-2026-042
  campaignNo: string;
  batchNo: string;
  targetProduct: string; // Product 1, Product 2, Product 3
  rmLotUids: string[]; // Linked RM_Lot_UIDs
  totalWeightKg: number;
  totalTaKg: number;
  totalNbKg: number;
  status: 'Requested' | 'Approved' | 'Not Approved' | 'STOP';
  requestedBy: string;
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  remarks?: string;
}

// 2. PRODUCTION CAMPAIGNS (Campaigns & Batches)
export interface ProductionCampaign {
  campaignNo: string; // e.g. CAMP-2026-08
  title: string;
  targetProduct: string; // Product 1, Product 2, Product 3
  status: 'Planning' | 'Request for Issue' | 'Approved' | 'Not Approved' | 'STOP' | 'In Production' | 'Completed';
  startDate: string;
  multipleUids: string[]; // Linked RM_Lot_UIDs[]
  totalInputWeightKg: number;
  totalInputOxideAKg: number; // Total_Issued_Ta_Kg
  totalInputOxideBKg: number; // Total_Issued_Nb_Kg
  lots: ProductionLot[];
}

export interface ProductionLot {
  lotNo: string; // e.g. LOT-01
  batchNo: string; // e.g. BATCH-2026-L1
  uidsAllocated: string[];
  inputOxideAKg: number;
  inputOxideBKg: number;
  // Classified Products Output
  outputProduct1: {
    productName: 'Product 1';
    batchNo: string;
    netWeightKg: number;
    containedOxideAKg: number; // MetalOxide 'A' Contained (Kg)
  };
  outputProduct2: {
    productName: 'Product 2';
    batchNo: string;
    netWeightKg: number;
    containedOxideAKg: number; // MetalOxide 'A' Contained (Kg)
  };
  outputProduct3: {
    productName: 'Product 3';
    batchNo: string;
    netWeightKg: number;
    containedOxideBKg: number; // MetalOxide 'B' Contained (Kg)
  };
  // Detailed 3-Way Production Losses
  lossLiquid: {
    batchNo: string;
    volumeKL: number; // Volume (KL) - Kilo Litres
    oxideAKg: number; // Liquid_Loss_Ta_Kg
    oxideBKg: number; // Liquid_Loss_Nb_Kg
  };
  lossSolid: {
    batchNo: string;
    netWeightKg: number; // Solid_Loss_Weight_Kg
    oxideAKg: number; // Solid_Loss_Ta_Kg
    oxideBKg: number; // Solid_Loss_Nb_Kg
  };
  lossUnidentified: {
    oxideAKg: number; // Unidentified_Loss_Weight_Kg (Ta variance)
    oxideBKg: number; // Unidentified_Loss_Weight_Kg (Nb variance)
  };
}

// MANUAL PRODUCTION LOSS ENTRY (Section 2 - Req #5)
export interface ProductionLossEntry {
  id: string;
  batchNo: string;
  campaignNo: string;
  date: string;
  solidLossWeightKg: number;
  solidLossTaKg: number;
  solidLossNbKg: number;
  liquidLossWeightKg: number;
  liquidLossVolumeKL: number;
  liquidLossTaKg: number;
  liquidLossNbKg: number;
  unidentifiedLossWeightKg: number; // 0.1% - 0.2% variance
  loggedBy: string;
}

// UNIFIED MATERIAL TRANSFER NOTE (Section 2 - Req #4: Store_to_Plant & Plant_to_Store)
export interface MaterialTransferNote {
  transferNo: string; // IMTN-RM-7721 or IMTN-FG-9021
  transferType: 'Store_to_Plant' | 'Plant_to_Store';
  uidOrBatchNo: string;
  campaignNo?: string;
  lotNo?: string;
  productType?: string;
  weightKg: number;
  oxideAKg: number; // Oxide_A_Kg (Ta)
  oxideBKg: number; // Oxide_B_Kg (Nb)
  issuedByName: string;
  issuedBySignature: string; // digital e-sign timestamp
  receivedByName: string;
  receivedBySignature: string; // digital e-sign timestamp
  date: string;
  status: 'Issued' | 'Pending Sign-off' | 'Completed';
}

// ISSUE MATERIAL TRANSFER NOTE - RM
export interface IssueTransferNoteRM {
  transferNo: string; // IMTN-RM-7721
  campaignNo: string;
  lotNo: string;
  rawMaterialUid: string;
  materialWeightKg: number;
  containedOxideAKg: number;
  containedOxideBKg: number;
  issuedBy: string;
  receivedBy: string;
  date: string;
  status: 'Issued' | 'Pending Sign-off';
}

// ISSUE MATERIAL TRANSFER NOTE - FG
export interface IssueTransferNoteFG {
  transferNo: string; // IMTN-FG-9021
  batchNo: string;
  productType: 'Product 1' | 'Product 2' | 'Product 3';
  materialWeightKg: number;
  containedOxideAKg?: number;
  containedOxideBKg?: number;
  deliveredBy: string;
  receivedBy: string;
  date: string;
  status: 'Delivered to Stores' | 'Pending Delivery';
}

// 3. FINISHED GOODS INVENTORY (FG_Stock - Section 2 - Req #6)
// Product 1: Tantalum Pentoxide (Grade 1 lower purity, Grade 2 higher purity)
// Product 2: Single pure material (Pure)
// Product 3: Niobium Pentoxide (Grade 1 & Grade 2)
export interface FinishedGoodItem {
  id: string;
  batchNo: string;
  productClassification: 'Product 1' | 'Product 2' | 'Product 3';
  productName?: string;
  grade: 'Grade 1' | 'Grade 2' | 'Pure' | 'Single Standard';
  netWeightKg: number;
  metalOxideAPercent?: number;
  containedOxideAKg?: number; // Oxide_A_Ta_Kg
  metalOxideBPercent?: number;
  containedOxideBKg?: number; // Oxide_B_Nb_Kg
  qcReleaseStatus: 'Accepted' | 'Testing Pending';
  warehouseBay: string;
  availableStockKg: number;
}

// SAMPLES (Returnable vs Non-Returnable in Excel - Section 2 - Req #7)
export interface SampleRecord {
  sampleId: string; // SampleID in Excel
  batchNo: string;
  type: 'Returnable' | 'Non-Returnable';
  netWeightKg: number; // Net Weight (Kg)
  containedOxideAKg: number; // MetalOxide 'A' Contained (Kg)
  containedOxideBKg: number; // MetalOxide 'B' Contained (Kg)
  recipient: string;
  purpose: string;
  dateSent: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  status: 'Sent / In Transit' | 'Returned' | 'Permanently Consumed' | 'Overdue';
}

// SALES & DISPATCH (Section 2 - Req #7)
export interface SalesContract {
  contractNo: string; // TO11TEL261827
  date: string;
  seller: {
    name: string;
    address: string;
  };
  buyer: {
    name: string;
    address: string;
    country: string;
  };
  material: string; // Tantalum Pentoxide
  quantityKg: number;
  drumCount?: number; // e.g. 200L drums @ 250 Kg net
  qualitySpecs: string;
  packing: string;
  shipments: {
    description: string;
    weightKg: number;
    shipmentMonth: string;
  }[];
  priceUsdPerKg: number;
  totalValueUsd: number;
  paymentTerms: string; // 100% TT within 30 days of arrival
  status: DocumentStatus;
  allocatedBatches: string[];
  authorizedSignatory: string;
}

export interface WorkflowRule {
  id: string;
  documentType: string;
  stepNo: number;
  stepName: string;
  roleRequired: RoleType;
  minThresholdUsd?: number;
  maxThresholdUsd?: number;
  canReject: boolean;
  canReturnForCorrection: boolean;
}

// 4. LIVE INVENTORY LEDGER RULES (Section 3)
export interface LiveLedgerState {
  rmStore: {
    netWeightKg: number;
    oxideATaKg: number;
    oxideBNbKg: number;
  };
  plantSip: {
    netWeightKg: number;
    oxideATaKg: number;
    oxideBNbKg: number;
  };
  cumulativeLosses: {
    solidWeightKg: number;
    solidTaKg: number;
    solidNbKg: number;
    liquidWeightKg: number;
    liquidVolumeKL: number;
    liquidTaKg: number;
    liquidNbKg: number;
    unidentifiedWeightKg: number;
  };
  fgStore: {
    totalWeightKg: number;
    oxideATaKg: number;
    oxideBNbKg: number;
    product1Grade1Kg: number;
    product1Grade2Kg: number;
    product2PureKg: number;
    product3Grade1Kg: number;
    product3Grade2Kg: number;
  };
  heldAtLab: {
    sampleWeightKg: number;
    oxideATaKg: number;
    oxideBNbKg: number;
    activeCount: number;
  };
}

export type PrintableDocType = 
  | 'PO' 
  | 'REQUISITION' 
  | 'TRANSFER_RM' 
  | 'TRANSFER_FG' 
  | 'SALES_DISPATCH';

export interface PlantProject {
  id: string;
  projectCode: string; // e.g. PRJ-2026-01
  title: string;
  department: string;
  leadManager: string;
  budgetKg: number;
  startDate: string;
  targetEndDate: string;
  status: 'Planning' | 'Active' | 'Under Review' | 'Completed';
  targetProduct: string;
  description: string;
}
