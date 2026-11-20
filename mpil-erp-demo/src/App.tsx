import React, { useState } from 'react';
import { ZohoSidebar } from './components/layout/ZohoSidebar';
import { ZohoTopBar } from './components/layout/ZohoTopBar';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ProcessFlowMapView } from './components/entities/ProcessFlowMapView';
import { SuppliersView } from './components/entities/SuppliersView';
import { CustomersView } from './components/entities/CustomersView';
import { PurchaseView } from './components/purchase/PurchaseView';
import { StoresView } from './components/stores/StoresView';
import { StoreRequisitionsView } from './components/entities/StoreRequisitionsView';
import { TransferNotesView } from './components/entities/TransferNotesView';
import { ProductionView } from './components/production/ProductionView';
import { LossTrackerView } from './components/entities/LossTrackerView';
import { FinishedGoodsView } from './components/finishedGoods/FinishedGoodsView';
import { SalesView } from './components/sales/SalesView';
import { AdminView } from './components/admin/AdminView';
import { LoginView } from './components/auth/LoginView';

// Document Digitization & Print Engine Modal
import { DocumentPrintModal } from './components/documents/DocumentPrintModal';

// Data & Types
import { 
  MOCK_USERS, 
  INITIAL_SUPPLIERS,
  INITIAL_CUSTOMERS,
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_RM_UIDS, 
  INITIAL_STORE_REQUISITIONS,
  INITIAL_TRANSFER_NOTES,
  INITIAL_TRANSFER_NOTES_RM,
  INITIAL_CAMPAIGNS, 
  INITIAL_FINISHED_GOODS, 
  INITIAL_SAMPLES, 
  INITIAL_SALES_CONTRACTS,
  INITIAL_LIVE_LEDGER
} from './data/mockData';

import { 
  UserProfile, 
  Supplier,
  Customer,
  PurchaseOrder, 
  RawMaterialUID, 
  StoreRequisition,
  MaterialTransferNote,
  IssueTransferNoteRM, 
  ProductionCampaign, 
  FinishedGoodItem, 
  SampleRecord, 
  SalesContract,
  LiveLedgerState,
  PrintableDocType
} from './types/erp';

import { CheckCircle2, Bell, X, ShieldCheck } from 'lucide-react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Default: Pranav Mathur (Executive Director / Super Admin)
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core collections
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialUID[]>(INITIAL_RM_UIDS);
  const [storeRequisitions, setStoreRequisitions] = useState<StoreRequisition[]>(INITIAL_STORE_REQUISITIONS);
  const [transferNotes, setTransferNotes] = useState<MaterialTransferNote[]>(INITIAL_TRANSFER_NOTES);
  const [legacyTransferNotesRM, setLegacyTransferNotesRM] = useState<IssueTransferNoteRM[]>(INITIAL_TRANSFER_NOTES_RM);
  const [campaigns, setCampaigns] = useState<ProductionCampaign[]>(INITIAL_CAMPAIGNS);
  const [finishedGoods, setFinishedGoods] = useState<FinishedGoodItem[]>(INITIAL_FINISHED_GOODS);
  const [samples, setSamples] = useState<SampleRecord[]>(INITIAL_SAMPLES);
  const [salesContracts, setSalesContracts] = useState<SalesContract[]>(INITIAL_SALES_CONTRACTS);

  // SECTION 3: AUTOMATED LIVE INVENTORY LEDGER BUCKETS
  const [liveLedger, setLiveLedger] = useState<LiveLedgerState>(INITIAL_LIVE_LEDGER);

  // Document Print Engine Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [activePrintDocType, setActivePrintDocType] = useState<PrintableDocType>('PO');

  // UI helpers
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showApprovalsSheet, setShowApprovalsSheet] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openPrintEngine = (docType: PrintableDocType = 'PO') => {
    setActivePrintDocType(docType);
    setIsPrintModalOpen(true);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    showToast(`Authenticated as ${user.name} (${user.role.replace('_', ' ')})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Workstation session locked');
  };

  // HANDLERS ENFORCING SECTION 3 ATOMIC BALANCE UPDATES

  // 1. RM Accepted (GRN + QC Assay) -> + Add RM Store Stock
  const handleAddRawMaterial = (item: RawMaterialUID) => {
    setRawMaterials([item, ...rawMaterials]);
    if (item.qcStatus === 'Accepted') {
      setLiveLedger(prev => ({
        ...prev,
        rmStore: {
          netWeightKg: parseFloat((prev.rmStore.netWeightKg + item.netDryWeightKg).toFixed(1)),
          oxideATaKg: parseFloat((prev.rmStore.oxideATaKg + item.containedOxideAKg).toFixed(1)),
          oxideBNbKg: parseFloat((prev.rmStore.oxideBNbKg + item.containedOxideBKg).toFixed(1)),
        }
      }));
    }
    showToast(`Recorded UID: ${item.uid} (${item.qcStatus}) - Ledger updated`);
  };

  // 2. Transfer Note Approved (Store -> Plant) -> - Deduct RM Store, + Add Plant SIP
  //    OR (Plant -> Store) -> - Deduct Plant SIP, + Add FG Store Stock
  const handleIssueMaterialTransfer = (note: MaterialTransferNote) => {
    setTransferNotes([note, ...transferNotes]);

    if (note.transferType === 'Store_to_Plant') {
      setRawMaterials(prev => prev.map(rm => {
        if (rm.uid === note.uidOrBatchNo) {
          return { ...rm, inventoryStatus: 'Partially Issued' };
        }
        return rm;
      }));

      // Atomic Ledger Balance update: - RM Store, + Plant SIP
      setLiveLedger(prev => ({
        ...prev,
        rmStore: {
          netWeightKg: Math.max(0, parseFloat((prev.rmStore.netWeightKg - note.weightKg).toFixed(1))),
          oxideATaKg: Math.max(0, parseFloat((prev.rmStore.oxideATaKg - note.oxideAKg).toFixed(1))),
          oxideBNbKg: Math.max(0, parseFloat((prev.rmStore.oxideBNbKg - note.oxideBKg).toFixed(1))),
        },
        plantSip: {
          netWeightKg: parseFloat((prev.plantSip.netWeightKg + note.weightKg).toFixed(1)),
          oxideATaKg: parseFloat((prev.plantSip.oxideATaKg + note.oxideAKg).toFixed(1)),
          oxideBNbKg: parseFloat((prev.plantSip.oxideBNbKg + note.oxideBKg).toFixed(1)),
        }
      }));
      showToast(`Issued Store → Plant Transfer: ${note.transferNo} (${note.weightKg} Kg)`);
    } else {
      // Plant -> Store (FG Return Note Approved)
      setLiveLedger(prev => ({
        ...prev,
        plantSip: {
          netWeightKg: Math.max(0, parseFloat((prev.plantSip.netWeightKg - note.weightKg).toFixed(1))),
          oxideATaKg: Math.max(0, parseFloat((prev.plantSip.oxideATaKg - note.oxideAKg).toFixed(1))),
          oxideBNbKg: Math.max(0, parseFloat((prev.plantSip.oxideBNbKg - note.oxideBKg).toFixed(1))),
        },
        fgStore: {
          ...prev.fgStore,
          totalWeightKg: parseFloat((prev.fgStore.totalWeightKg + note.weightKg).toFixed(1)),
          oxideATaKg: parseFloat((prev.fgStore.oxideATaKg + note.oxideAKg).toFixed(1)),
          oxideBNbKg: parseFloat((prev.fgStore.oxideBNbKg + note.oxideBKg).toFixed(1)),
        }
      }));
      showToast(`Delivered Plant → Store (FG): ${note.transferNo} (${note.weightKg} Kg)`);
    }
  };

  // Legacy compatibility for ProductionView
  const handleIssueMaterialRM = (note: IssueTransferNoteRM) => {
    setLegacyTransferNotesRM([note, ...legacyTransferNotesRM]);
    handleIssueMaterialTransfer({
      transferNo: note.transferNo,
      transferType: 'Store_to_Plant',
      uidOrBatchNo: note.rawMaterialUid,
      campaignNo: note.campaignNo,
      lotNo: note.lotNo,
      productType: 'Raw Material Charge',
      weightKg: note.materialWeightKg,
      oxideAKg: note.containedOxideAKg,
      oxideBKg: note.containedOxideBKg,
      issuedByName: note.issuedBy,
      issuedBySignature: `E-SIGN: RM-AUTH`,
      receivedByName: note.receivedBy,
      receivedBySignature: `E-SIGN: PRD-ACK`,
      date: note.date,
      status: 'Completed',
    });
  };

  // 3. Production Loss Logged (Solid/Liquid/Trace) -> - Deduct Plant SIP, + Add Cumulative Losses
  const handleUpdateLotLosses = (campaignNo: string, lotNo: string, lossData: any) => {
    const totalLossWeight = (lossData.solidWt || 0) + (lossData.liqVol ? lossData.liqVol * 3.5 : 0) + (lossData.unidentTa || 0);
    const totalLossTa = (lossData.solidTa || 0) + (lossData.liqTa || 0) + (lossData.unidentTa || 0);
    const totalLossNb = (lossData.solidNb || 0) + (lossData.liqNb || 0) + (lossData.unidentNb || 0);

    setLiveLedger(prev => ({
      ...prev,
      plantSip: {
        netWeightKg: Math.max(0, parseFloat((prev.plantSip.netWeightKg - totalLossWeight).toFixed(1))),
        oxideATaKg: Math.max(0, parseFloat((prev.plantSip.oxideATaKg - totalLossTa).toFixed(1))),
        oxideBNbKg: Math.max(0, parseFloat((prev.plantSip.oxideBNbKg - totalLossNb).toFixed(1))),
      },
      cumulativeLosses: {
        solidWeightKg: parseFloat((prev.cumulativeLosses.solidWeightKg + (lossData.solidWt || 0)).toFixed(1)),
        solidTaKg: parseFloat((prev.cumulativeLosses.solidTaKg + (lossData.solidTa || 0)).toFixed(1)),
        solidNbKg: parseFloat((prev.cumulativeLosses.solidNbKg + (lossData.solidNb || 0)).toFixed(1)),
        liquidWeightKg: parseFloat((prev.cumulativeLosses.liquidWeightKg + 12).toFixed(1)),
        liquidVolumeKL: parseFloat((prev.cumulativeLosses.liquidVolumeKL + (lossData.liqVol || 0)).toFixed(1)),
        liquidTaKg: parseFloat((prev.cumulativeLosses.liquidTaKg + (lossData.liqTa || 0)).toFixed(1)),
        liquidNbKg: parseFloat((prev.cumulativeLosses.liquidNbKg + (lossData.liqNb || 0)).toFixed(1)),
        unidentifiedWeightKg: parseFloat((prev.cumulativeLosses.unidentifiedWeightKg + (lossData.unidentTa || 0)).toFixed(1)),
      }
    }));
    showToast(`Production losses reconciled into mass balance ledger.`);
  };

  // 4. Commercial Sale / Non-Returnable Sample -> - Deduct FG Store
  // 5. Returnable Lab Sample Issued / Returned -> - Deduct / + Add FG Store, + Add / - Deduct Lab Sample Balance
  const handleAddSample = (sample: SampleRecord) => {
    setSamples([sample, ...samples]);

    if (sample.type === 'Non-Returnable') {
      // Free / promotional sample -> permanently deducts from FG Stock
      setLiveLedger(prev => ({
        ...prev,
        fgStore: {
          ...prev.fgStore,
          totalWeightKg: Math.max(0, parseFloat((prev.fgStore.totalWeightKg - sample.netWeightKg).toFixed(1))),
          oxideATaKg: Math.max(0, parseFloat((prev.fgStore.oxideATaKg - sample.containedOxideAKg).toFixed(1))),
          oxideBNbKg: Math.max(0, parseFloat((prev.fgStore.oxideBNbKg - sample.containedOxideBKg).toFixed(1))),
        }
      }));
      showToast(`Non-returnable sample ${sample.sampleId} dispatched (deducted from FG store)`);
    } else {
      // Returnable Lab Sample -> moves stock into Held_at_Lab balance
      setLiveLedger(prev => ({
        ...prev,
        fgStore: {
          ...prev.fgStore,
          totalWeightKg: Math.max(0, parseFloat((prev.fgStore.totalWeightKg - sample.netWeightKg).toFixed(1))),
        },
        heldAtLab: {
          sampleWeightKg: parseFloat((prev.heldAtLab.sampleWeightKg + sample.netWeightKg).toFixed(1)),
          oxideATaKg: parseFloat((prev.heldAtLab.oxideATaKg + sample.containedOxideAKg).toFixed(3)),
          oxideBNbKg: parseFloat((prev.heldAtLab.oxideBNbKg + sample.containedOxideBKg).toFixed(3)),
          activeCount: prev.heldAtLab.activeCount + 1,
        }
      }));
      showToast(`Returnable sample ${sample.sampleId} issued (moved to Held_at_Lab balance)`);
    }
  };

  const handleRecordSampleReturn = (sampleId: string) => {
    const sObj = samples.find(s => s.sampleId === sampleId);
    setSamples(prev => prev.map(s => {
      if (s.sampleId === sampleId) {
        return {
          ...s,
          status: 'Returned',
          actualReturnDate: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    }));

    if (sObj) {
      // Safely restores back from Held_at_Lab into FG Store
      setLiveLedger(prev => ({
        ...prev,
        fgStore: {
          ...prev.fgStore,
          totalWeightKg: parseFloat((prev.fgStore.totalWeightKg + sObj.netWeightKg).toFixed(1)),
        },
        heldAtLab: {
          sampleWeightKg: Math.max(0, parseFloat((prev.heldAtLab.sampleWeightKg - sObj.netWeightKg).toFixed(1))),
          oxideATaKg: Math.max(0, parseFloat((prev.heldAtLab.oxideATaKg - sObj.containedOxideAKg).toFixed(3))),
          oxideBNbKg: Math.max(0, parseFloat((prev.heldAtLab.oxideBNbKg - sObj.containedOxideBKg).toFixed(3))),
          activeCount: Math.max(0, prev.heldAtLab.activeCount - 1),
        }
      }));
    }
    showToast(`Sample ${sampleId} safely returned from lab back into FG inventory.`);
  };

  // PO Handlers
  const handleApprovePO = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          status: 'Approved',
          timeline: [
            ...po.timeline,
            {
              step: 'Director Approval',
              actor: `${currentUser.name} (${currentUser.designation})`,
              action: `Formally approved transaction value of $${po.pricing.totalCalculatedCifUsd.toLocaleString()} USD`,
              timestamp: 'Just now',
            }
          ]
        };
      }
      return po;
    }));
    showToast(`Purchase Order approved by ${currentUser.name}`);
    setShowApprovalsSheet(false);
  };

  const handleSendPOToSupplier = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return {
          ...po,
          status: 'Sent to Supplier',
          timeline: [
            ...po.timeline,
            {
              step: 'Sent to Supplier',
              actor: `${currentUser.name} (${currentUser.designation})`,
              action: 'Dispatched signed Purchase Order to supplier via official channel',
              timestamp: 'Just now',
            }
          ]
        };
      }
      return po;
    }));
    showToast('Purchase Order marked as sent to supplier');
  };

  const handleCreatePO = (newPO: PurchaseOrder) => {
    setPurchaseOrders([newPO, ...purchaseOrders]);
    showToast(`Created ${newPO.poNumber} for $${newPO.pricing.totalCalculatedCifUsd.toLocaleString()} USD`);
  };

  // Store Requisitions State Machine Handlers
  const handleUpdateRequisitionStatus = (reqNo: string, newStatus: 'Approved' | 'Not Approved' | 'STOP') => {
    setStoreRequisitions(prev => prev.map(r => {
      if (r.requisitionNo === reqNo) {
        return {
          ...r,
          status: newStatus,
          approvedBy: `${currentUser.name} (${currentUser.designation})`,
          approvalDate: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    }));
    showToast(`Requisition ${reqNo} updated to ${newStatus}`);
  };

  const handleCreateRequisition = (newReq: StoreRequisition) => {
    setStoreRequisitions([newReq, ...storeRequisitions]);
    showToast(`Created Store Requisition ${newReq.requisitionNo}`);
  };

  // Quick create routing
  const handleQuickCreate = (type: string) => {
    switch (type) {
      case 'po':
        setCurrentModule('purchase');
        break;
      case 'inward':
        setCurrentModule('stores');
        break;
      case 'requisition':
        setCurrentModule('requisitions');
        break;
      case 'transfer':
        setCurrentModule('transferNotes');
        break;
      case 'campaign':
        setCurrentModule('production');
        break;
      case 'sample':
        setCurrentModule('samples');
        break;
      case 'contract':
        setCurrentModule('sales');
        break;
      case 'supplier':
        setCurrentModule('suppliers');
        break;
      case 'customer':
        setCurrentModule('customers');
        break;
      default:
        break;
    }
  };

  const pendingApprovalsList = purchaseOrders.filter(po => po.status === 'Under Review');

  if (!isAuthenticated) {
    return (
      <>
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <LoginView onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Zoho CRM Left Sidebar */}
      <ZohoSidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingApprovalsCount={pendingApprovalsList.length}
        onOpenPrintModal={() => openPrintEngine('PO')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <ZohoTopBar
          currentModule={currentModule}
          currentUser={currentUser}
          pendingApprovalsCount={pendingApprovalsList.length}
          onOpenApprovals={() => setShowApprovalsSheet(true)}
          onQuickCreate={handleQuickCreate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogout={handleLogout}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto pb-12">
            {currentModule === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                liveLedger={liveLedger}
                purchaseOrders={purchaseOrders}
                rawMaterials={rawMaterials}
                campaigns={campaigns}
                salesContracts={salesContracts}
                samples={samples}
                onNavigate={setCurrentModule}
                onApprovePO={handleApprovePO}
                onOpenPrintModal={openPrintEngine}
              />
            )}

            {currentModule === 'flow' && (
              <ProcessFlowMapView
                rawMaterials={rawMaterials}
                campaigns={campaigns}
                onNavigate={setCurrentModule}
              />
            )}

            {currentModule === 'purchase' && (
              <PurchaseView
                currentUser={currentUser}
                purchaseOrders={purchaseOrders}
                onApprovePO={handleApprovePO}
                onSendPOToSupplier={handleSendPOToSupplier}
                onCreatePO={handleCreatePO}
              />
            )}

            {currentModule === 'suppliers' && (
              <SuppliersView
                currentUser={currentUser}
                suppliers={suppliers}
                onAddSupplier={(sup) => {
                  setSuppliers([sup, ...suppliers]);
                  showToast(`Supplier ${sup.name} added`);
                }}
                searchFilter={searchQuery}
              />
            )}

            {currentModule === 'stores' && (
              <StoresView
                currentUser={currentUser}
                rawMaterials={rawMaterials}
                onAddRawMaterial={handleAddRawMaterial}
                onNavigateToProduction={() => setCurrentModule('production')}
              />
            )}

            {currentModule === 'requisitions' && (
              <StoreRequisitionsView
                currentUser={currentUser}
                requisitions={storeRequisitions}
                rawMaterials={rawMaterials}
                onUpdateStatus={handleUpdateRequisitionStatus}
                onCreateRequisition={handleCreateRequisition}
                onPrintRequisition={(reqNo) => openPrintEngine('REQUISITION')}
              />
            )}

            {currentModule === 'transferNotes' && (
              <TransferNotesView
                currentUser={currentUser}
                transferNotes={transferNotes}
                rawMaterials={rawMaterials}
                finishedGoods={finishedGoods}
                onIssueMaterialTransfer={handleIssueMaterialTransfer}
                onPrintTransferNote={(trNo) => openPrintEngine('TRANSFER_RM')}
                searchFilter={searchQuery}
              />
            )}

            {currentModule === 'production' && (
              <ProductionView
                currentUser={currentUser}
                campaigns={campaigns}
                transferNotes={legacyTransferNotesRM}
                rawMaterials={rawMaterials}
                onIssueMaterial={handleIssueMaterialRM}
                onUpdateLotLosses={handleUpdateLotLosses}
              />
            )}

            {currentModule === 'losses' && (
              <LossTrackerView
                campaigns={campaigns}
              />
            )}

            {currentModule === 'finishedGoods' && (
              <FinishedGoodsView
                currentUser={currentUser}
                finishedGoods={finishedGoods}
                samples={samples}
                onAddSample={handleAddSample}
                onRecordSampleReturn={handleRecordSampleReturn}
              />
            )}

            {currentModule === 'samples' && (
              <FinishedGoodsView
                currentUser={currentUser}
                finishedGoods={finishedGoods}
                samples={samples}
                onAddSample={handleAddSample}
                onRecordSampleReturn={handleRecordSampleReturn}
              />
            )}

            {currentModule === 'sales' && (
              <SalesView
                currentUser={currentUser}
                salesContracts={salesContracts}
                finishedGoods={finishedGoods}
                onAllocateBatches={handleQuickCreate}
              />
            )}

            {currentModule === 'customers' && (
              <CustomersView
                currentUser={currentUser}
                customers={customers}
                onAddCustomer={(cust) => {
                  setCustomers([cust, ...customers]);
                  showToast(`Customer ${cust.name} added`);
                }}
                searchFilter={searchQuery}
              />
            )}

            {(currentModule === 'admin' || currentModule === 'employees' || currentModule === 'projects' || currentModule === 'workflows' || currentModule === 'roles') && (
              <AdminView
                currentUser={currentUser}
                activeSubTab={
                  currentModule === 'projects' ? 'projects' :
                  currentModule === 'workflows' ? 'workflows' :
                  currentModule === 'roles' ? 'roles' :
                  'employees'
                }
              />
            )}
          </div>
        </main>
      </div>

      {/* DOCUMENT DIGITIZATION & PRINT ENGINE MODAL */}
      <DocumentPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        defaultDocType={activePrintDocType}
        purchaseOrders={purchaseOrders}
        storeRequisitions={storeRequisitions}
        transferNotes={transferNotes}
        salesContracts={salesContracts}
      />

      {/* Approvals Slide-Over Sheet */}
      {showApprovalsSheet && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pending Director Approvals</h3>
              <button 
                onClick={() => setShowApprovalsSheet(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            {pendingApprovalsList.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No pending items.</p>
            ) : (
              pendingApprovalsList.map(po => (
                <div key={po.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="font-mono text-slate-800">{po.poNumber}</span>
                    <span className="text-blue-700">${po.pricing.totalCalculatedCifUsd.toLocaleString()} USD</span>
                  </div>
                  <p className="text-slate-600">{po.material.name} from {po.seller.name}</p>
                  <button
                    onClick={() => handleApprovePO(po.id)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Approve Order
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
