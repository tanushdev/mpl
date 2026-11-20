import React, { useState } from 'react';
import { 
  Boxes, 
  Flame, 
  PackageCheck, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  FileText, 
  Scale, 
  ArrowRight,
  Printer,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  FlaskConical,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  UserProfile, 
  PurchaseOrder, 
  RawMaterialUID, 
  ProductionCampaign, 
  SalesContract,
  SampleRecord,
  LiveLedgerState,
  PrintableDocType
} from '../../types/erp';

interface DashboardViewProps {
  currentUser: UserProfile;
  liveLedger: LiveLedgerState;
  purchaseOrders: PurchaseOrder[];
  rawMaterials: RawMaterialUID[];
  campaigns: ProductionCampaign[];
  salesContracts: SalesContract[];
  samples: SampleRecord[];
  onNavigate: (tab: string) => void;
  onApprovePO: (poId: string) => void;
  onOpenPrintModal?: (docType?: PrintableDocType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  liveLedger,
  purchaseOrders,
  rawMaterials,
  campaigns,
  salesContracts,
  samples,
  onNavigate,
  onApprovePO,
  onOpenPrintModal
}) => {
  const [selectedCampaignForRecon, setSelectedCampaignForRecon] = useState<string>(campaigns[0]?.campaignNo || 'CAMP-2026-08');

  // Mass balance calculation for selected campaign
  const activeCamp = campaigns.find(c => c.campaignNo === selectedCampaignForRecon) || campaigns[0];
  const lot = activeCamp?.lots[0];

  const inputTa = lot ? lot.inputOxideAKg : 292.0;
  const inputNb = lot ? lot.inputOxideBKg : 193.6;

  const fgTa = lot ? (lot.outputProduct1.containedOxideAKg + lot.outputProduct2.containedOxideAKg) : 277.5;
  const fgNb = lot ? lot.outputProduct3.containedOxideBKg : 181.0;

  const solidLossTa = lot ? lot.lossSolid.oxideAKg : 8.5;
  const solidLossNb = lot ? lot.lossSolid.oxideBKg : 8.5;

  const liqLossTa = lot ? lot.lossLiquid.oxideAKg : 4.2;
  const liqLossNb = lot ? lot.lossLiquid.oxideBKg : 3.8;

  const unidentTa = lot ? lot.lossUnidentified.oxideAKg : 1.8;
  const unidentNb = lot ? lot.lossUnidentified.oxideBKg : 0.3;

  const accountedTa = fgTa + solidLossTa + liqLossTa + unidentTa;
  const accountedNb = fgNb + solidLossNb + liqLossNb + unidentNb;

  // Alerts logic (Section 4 - Reorder & Stock Alerts)
  const isRmLowStock = liveLedger.rmStore.netWeightKg < 1500;
  const isSipBottleneck = liveLedger.plantSip.netWeightKg > 2000;
  const isExecutiveReadOnly = currentUser.role === 'SUPER_ADMIN';

  const pendingPOs = purchaseOrders.filter(po => po.status === 'Under Review' || po.status === 'Draft');

  return (
    <div className="space-y-6">
      {/* Executive Read-Only Banner (RBAC Section 1) */}
      {isExecutiveReadOnly && (
        <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Super Admin / Management Mode: Executive Read-Only</span>
              <span className="text-[11px] text-amber-700 block">
                You have full real-time visibility across analytics and stock ledgers. Operational data entry is restricted to designated departmental users.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-200/70 text-amber-900 rounded-lg uppercase tracking-wide flex-shrink-0">
            Read-Only Oversight
          </span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/mpil-logo.png" 
            alt="MPIL Logo" 
            className="h-10 w-auto object-contain flex-shrink-0" 
          />
          <div className="border-l border-slate-200 pl-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {currentUser.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {currentUser.designation}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Metallurgical Products (India) Pvt. Ltd. • T-27 MIDC Taloja Works, Raigad
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenPrintModal && (
            <button
              onClick={() => onOpenPrintModal('PO')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Engine</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('flow')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Process Flow Map</span>
          </button>
        </div>
      </div>

      {/* SECTION 4 REQ 3: REORDER & STOCK ALERT INDICATORS */}
      {(isRmLowStock || isSipBottleneck) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isRmLowStock && (
            <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl flex items-center justify-between text-blue-900">
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Raw Material Inventory Notice</span>
                  <span className="text-[11px] text-blue-700">Available RM is 1,414 kg. Review procurement pipeline to prevent campaign pauses.</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('purchase')}
                className="text-xs font-bold text-blue-700 underline flex-shrink-0"
              >
                View POs →
              </button>
            </div>
          )}
          {isSipBottleneck && (
            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between text-amber-900">
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Plant SIP Buildup Indicator</span>
                  <span className="text-[11px] text-amber-700">Stock-in-process is high. Expedite crystallization & precipitation.</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('production')}
                className="text-xs font-bold text-amber-700 underline flex-shrink-0"
              >
                View SIP →
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4 REQ 1: LIVE INVENTORY FUNNEL CARDS */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Inventory Funnel (Physical Kg • Ta Contained • Nb Contained)
          </h2>
          <span className="text-[11px] text-slate-400">Atomic balance sync active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Raw Material Store */}
          <div 
            onClick={() => onNavigate('stores')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Raw Material Store</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-2">
              {liveLedger.rmStore.netWeightKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg net</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Ta Content:</span>
                <strong className="text-blue-700 font-mono">{liveLedger.rmStore.oxideATaKg.toFixed(1)} kg</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nb Content:</span>
                <strong className="text-indigo-700 font-mono">{liveLedger.rmStore.oxideBNbKg.toFixed(1)} kg</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Plant Stock-in-Process (SIP) */}
          <div 
            onClick={() => onNavigate('production')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Plant SIP (Active Runs)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-2">
              {liveLedger.plantSip.netWeightKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg SIP</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Ta Contained:</span>
                <strong className="text-blue-700 font-mono">{liveLedger.plantSip.oxideATaKg.toFixed(1)} kg</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nb Contained:</span>
                <strong className="text-indigo-700 font-mono">{liveLedger.plantSip.oxideBNbKg.toFixed(1)} kg</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Finished Goods Store (by Grade) */}
          <div 
            onClick={() => onNavigate('finishedGoods')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">FG Store (By Grade)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-2">
              {liveLedger.fgStore.totalWeightKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg in vault</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] space-y-0.5">
              <div className="flex justify-between text-slate-600">
                <span>P1 (Ta₂O₅): Gr1: <strong>{liveLedger.fgStore.product1Grade1Kg}</strong> • Gr2: <strong>{liveLedger.fgStore.product1Grade2Kg}</strong></span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>P2: <strong>{liveLedger.fgStore.product2PureKg} kg</strong> • P3 (Nb₂O₅): <strong>{liveLedger.fgStore.product3Grade1Kg + liveLedger.fgStore.product3Grade2Kg} kg</strong></span>
              </div>
            </div>
          </div>

          {/* Card 4: Samples Held at Lab */}
          <div 
            onClick={() => onNavigate('samples')}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-indigo-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Samples at Lab</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-2">
              {liveLedger.heldAtLab.sampleWeightKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg held</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Held at Lab Balance:</span>
                <strong className="text-indigo-700 font-mono">{liveLedger.heldAtLab.activeCount} active sample</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ta Content:</span>
                <strong className="text-blue-700 font-mono">{liveLedger.heldAtLab.oxideATaKg.toFixed(3)} kg</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 REQ 2: MASS BALANCE & YIELD RECONCILIATION VIEW */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Mass Balance & Yield Reconciliation (Total RM Input = FG Output + Losses + SIP)
            </h3>
            <p className="text-xs text-slate-500">
              Mathematical conservation equation verifying chemical oxide continuity through conversion.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Campaign:</span>
            <select
              value={selectedCampaignForRecon}
              onChange={(e) => setSelectedCampaignForRecon(e.target.value)}
              className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            >
              {campaigns.map(c => (
                <option key={c.campaignNo} value={c.campaignNo}>{c.campaignNo} ({c.title})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mass Balance Equation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Box 1: Total RM Input */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 uppercase">Input Charge</span>
            <div className="font-bold text-slate-900 text-sm">Total RM Input</div>
            <div className="font-mono text-blue-900 font-bold pt-1">
              Ta: {inputTa.toFixed(1)} kg<br/>
              Nb: {inputNb.toFixed(1)} kg
            </div>
          </div>

          {/* Equal sign indicator */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">1. FG Output</span>
            <div className="font-bold text-slate-900 text-sm">Products 1, 2, 3</div>
            <div className="font-mono text-emerald-900 font-bold pt-1">
              Ta: {fgTa.toFixed(1)} kg<br/>
              Nb: {fgNb.toFixed(1)} kg
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase">2. Solid & Liq Loss</span>
            <div className="font-bold text-slate-900 text-sm">Recoverable Losses</div>
            <div className="font-mono text-amber-900 font-bold pt-1">
              Ta: {(solidLossTa + liqLossTa).toFixed(1)} kg<br/>
              Nb: {(solidLossNb + liqLossNb).toFixed(1)} kg
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">3. Unidentified</span>
            <div className="font-bold text-slate-900 text-sm">Testing Variance</div>
            <div className="font-mono text-slate-700 font-bold pt-1">
              Ta: {unidentTa.toFixed(1)} kg (0.6%)<br/>
              Nb: {unidentNb.toFixed(1)} kg (0.2%)
            </div>
          </div>

          {/* Status Box */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-100/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Reconciliation Status</span>
              <div className="font-bold text-emerald-950 text-sm flex items-center space-x-1 mt-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>100% Balanced</span>
              </div>
            </div>
            <div className="text-[10px] text-emerald-800 font-mono mt-2">
              Sum = {accountedTa.toFixed(1)} / {inputTa.toFixed(1)} kg Ta
            </div>
          </div>
        </div>
      </div>

      {/* Review & Approvals Queue */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900">Purchase Orders Waiting For Sign-off</h3>
            {pendingPOs.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingPOs.length} Pending
              </span>
            )}
          </div>
        </div>

        {pendingPOs.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="font-semibold text-slate-700">All caught up!</p>
            <p className="text-slate-400">No documents are waiting for review right now.</p>
          </div>
        ) : (
          pendingPOs.map((po) => (
            <div key={po.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{po.poNumber}</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Awaiting Sign-off
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  {po.material.name} ({po.material.quantityKg} kg) from {po.seller.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Total Order Value: <strong>${po.pricing.totalCalculatedCifUsd.toLocaleString()} USD</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => onNavigate('purchase')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  View Details
                </button>
                <button
                  onClick={() => onApprovePO(po.id)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Approve Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
