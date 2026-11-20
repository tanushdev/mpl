import React, { useState } from 'react';
import { 
  GitFork, 
  Scale, 
  Boxes, 
  Flame, 
  PackageCheck, 
  FlaskConical, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { 
  RawMaterialUID, 
  ProductionCampaign, 
  FinishedGoodItem,
  SampleRecord,
  SalesContract 
} from '../../types/erp';

interface ProcessFlowMapViewProps {
  rawMaterials: RawMaterialUID[];
  campaigns: ProductionCampaign[];
  onNavigate: (module: string) => void;
}

export const ProcessFlowMapView: React.FC<ProcessFlowMapViewProps> = ({
  rawMaterials,
  campaigns,
  onNavigate
}) => {
  const activeCampaign = campaigns[0];
  const activeLot = activeCampaign?.lots[0];

  const [activeStep, setActiveStep] = useState<'0' | '1' | '2' | '3'>('0');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <GitFork className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Material Flow & Process Tracker
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Exact Match: Process Flow.xlsx
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking raw materials, multiple UIDs in campaigns, classified Products 1/2/3, and Solid/Liquid/Unidentified losses.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveStep('0')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStep === '0' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            0. Material Flow
          </button>
          <button
            onClick={() => setActiveStep('1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStep === '1' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Receipt & Assay
          </button>
          <button
            onClick={() => setActiveStep('2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStep === '2' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Campaign (Multi-UID)
          </button>
          <button
            onClick={() => setActiveStep('3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStep === '3' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Finished Goods & Losses
          </button>
        </div>
      </div>

      {/* SECTION 0: COMPLETE MATERIAL FLOW (Excel exact mapping) */}
      {activeStep === '0' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1: Raw Material Inventory */}
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <span className="text-xs font-bold text-blue-900 uppercase">Raw Material Inventory</span>
                <Boxes className="w-4 h-4 text-blue-600" />
              </div>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li className="flex justify-between">
                  <span className="text-slate-500">a. Inv# + UID:</span>
                  <strong className="font-mono text-blue-700">UID-8492 (EXP-991)</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">b. Net Weight:</span>
                  <strong className="font-mono text-slate-900">2,000 kg</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">c. Oxide 'A' (Ta₂O₅):</span>
                  <strong className="font-mono text-blue-700">716.8 kg (36.5%)</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">d. Oxide 'B' (Nb₂O₅):</span>
                  <strong className="font-mono text-indigo-700">475.3 kg (24.2%)</strong>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('stores')}
                  className="w-full py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
                >
                  View RM Inventory UIDs →
                </button>
              </div>
            </div>

            {/* Box 2: Production Inflow */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                <span className="text-xs font-bold text-amber-900 uppercase">Production Inputs</span>
                <Flame className="w-4 h-4 text-amber-600" />
              </div>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li className="flex justify-between">
                  <span className="text-slate-500">Campaign:</span>
                  <strong className="font-mono text-slate-900">{activeCampaign?.campaignNo}</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Allocated UIDs:</span>
                  <strong className="font-mono text-amber-800">{activeCampaign?.multipleUids.length} UIDs Combined</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">a. MetalOxide 'A':</span>
                  <strong className="font-mono text-blue-700">{activeLot?.inputOxideAKg} kg</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">b. MetalOxide 'B':</span>
                  <strong className="font-mono text-indigo-700">{activeLot?.inputOxideBKg} kg</strong>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('production')}
                  className="w-full py-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg"
                >
                  View Active Campaign →
                </button>
              </div>
            </div>

            {/* Box 3: Finished Goods Inventory */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span className="text-xs font-bold text-emerald-900 uppercase">Finished Goods Inventory</span>
                <PackageCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li className="flex justify-between">
                  <span className="text-slate-500">Product 1 (Ta₂O₅):</span>
                  <strong className="font-mono text-emerald-700">{activeLot?.outputProduct1.netWeightKg} kg</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Product 2 (Tech Ta):</span>
                  <strong className="font-mono text-emerald-700">{activeLot?.outputProduct2.netWeightKg} kg</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Product 3 (Nb₂O₅):</span>
                  <strong className="font-mono text-indigo-700">{activeLot?.outputProduct3.netWeightKg} kg</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Sales Allocated:</span>
                  <strong className="font-mono text-slate-900">2,000 kg (TO11)</strong>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('finishedGoods')}
                  className="w-full py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                >
                  View Finished Goods →
                </button>
              </div>
            </div>
          </div>

          {/* Detailed 3-Way Loss Accounting Cards (Excel Exact Fields) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Production Losses (Liquid, Solid & Unidentified Breakdown)
                </h3>
                <p className="text-xs text-slate-500">
                  Exact columns from Process Flow: ProductionLoss - L, ProductionLoss - S, ProductionLoss - Unidentified
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Total Accounted: 100% Mass Reconciled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Liquid Loss */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 uppercase text-[11px]">ProductionLoss - L (Liquid)</span>
                  <FlaskConical className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">a. Batch#:</span>
                    <strong className="font-mono text-slate-900">{activeLot?.lossLiquid.batchNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">b. Volume (KL):</span>
                    <strong className="font-mono text-blue-800 text-sm">{activeLot?.lossLiquid.volumeKL} KL</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">c. MetalOxide 'A' (kg):</span>
                    <strong className="font-mono text-blue-700">{activeLot?.lossLiquid.oxideAKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">d. MetalOxide 'B' (kg):</span>
                    <strong className="font-mono text-indigo-700">{activeLot?.lossLiquid.oxideBKg} kg</strong>
                  </div>
                </div>
              </div>

              {/* Solid Loss */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase text-[11px]">ProductionLoss - S (Solid)</span>
                  <Boxes className="w-4 h-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">a. Batch#:</span>
                    <strong className="font-mono text-slate-900">{activeLot?.lossSolid.batchNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">b. Net Weight (kg):</span>
                    <strong className="font-mono text-amber-800 text-sm">{activeLot?.lossSolid.netWeightKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">c. MetalOxide 'A' (kg):</span>
                    <strong className="font-mono text-blue-700">{activeLot?.lossSolid.oxideAKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">d. MetalOxide 'B' (kg):</span>
                    <strong className="font-mono text-indigo-700">{activeLot?.lossSolid.oxideBKg} kg</strong>
                  </div>
                </div>
              </div>

              {/* Unidentified Loss */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 uppercase text-[11px]">ProductionLoss - Unidentified</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-[11px] text-rose-700">Calculated variance unaccounted for:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">a. MetalOxide 'A' (kg):</span>
                    <strong className="font-mono text-rose-700 text-sm">{activeLot?.lossUnidentified.oxideAKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">b. MetalOxide 'B' (kg):</span>
                    <strong className="font-mono text-rose-700 text-sm">{activeLot?.lossUnidentified.oxideBKg} kg</strong>
                  </div>
                  <div className="pt-1 text-[10px] text-slate-500">
                    Within standard plant tolerance (0.6%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: RECEIPT OF RAW MATERIAL (Inward Flow) */}
      {activeStep === '1' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">1. Receipt of Raw Material at Facility</h3>
              <p className="text-xs text-slate-500">Issue PO → Receipt at Facility (Subject to Acceptance) → Sampling & Testing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Accepted Path */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>If Accepted → Add to Raw Material Inventory</span>
              </div>
              <p className="text-xs text-slate-600">
                Generates a unique UID barcode tag with Invoice #, Net Weight, Oxide A, and Oxide B.
              </p>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1 font-mono">
                <div>a. UID + Inv#: <strong>UID-2026-RM-8492 (EXP-NAM-991)</strong></div>
                <div>b. Material Net Weight: <strong>2,000 kg</strong></div>
                <div>c. MetalOxide 'A' (Ta₂O₅): <strong>716.8 kg</strong></div>
                <div>d. MetalOxide 'B' (Nb₂O₅): <strong>475.3 kg</strong></div>
              </div>
              <button
                onClick={() => onNavigate('stores')}
                className="w-full py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Go to RM Stores Ledger →
              </button>
            </div>

            {/* Rejected Path */}
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>If Rejected → Two Resolution Paths</span>
              </div>
              <p className="text-xs text-slate-600">
                Rejected consignments strictly never enter usable inventory. They are resolved via:
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-rose-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <div>
                      <strong className="text-slate-800 block">1. Return to Supplier</strong>
                      <span className="text-[10px] text-slate-500">UID-8494 marked for return shipment</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Return</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-rose-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <div>
                      <strong className="text-slate-800 block">2. Dispose Material</strong>
                      <span className="text-[10px] text-slate-500">UID-8495 sent to disposal yard</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">Dispose</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ISSUE TO PRODUCTION (Campaign with Multiple UIDs) */}
      {activeStep === '2' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Issue of Raw Material to Production (Campaigns & Multiple UIDs)
              </h3>
              <p className="text-xs text-slate-500">
                Prepare Production Campaign → Multiple Lots & UIDs → Request for Issue → Approval Gate
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Campaign: {activeCampaign?.campaignNo}
                </span>
                <span className="text-xs font-bold text-slate-900 ml-2">{activeCampaign?.title}</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Status: {activeCampaign?.status}
              </span>
            </div>

            {/* Multiple UIDs assigned to this campaign */}
            <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">
                Multiple Raw Material UIDs Stored in this Campaign ({activeCampaign?.multipleUids.length} UIDs):
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCampaign?.multipleUids.map((uid) => (
                  <span key={uid} className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {uid}
                  </span>
                ))}
              </div>
            </div>

            {/* Approval Gate */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 font-bold block">✓ Approved</span>
                <span className="text-[10px] text-slate-500">Issue Transfer Note (RM) generated</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                <span className="text-slate-600 font-bold block">Not Approved</span>
                <span className="text-[10px] text-slate-500">Returned for modification</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-rose-700 font-bold block">STOP</span>
                <span className="text-[10px] text-slate-500">Immediate halt authority</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: FINISHED GOODS & SAMPLES */}
      {activeStep === '3' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Finished Goods, Classifications & Sample Types
              </h3>
              <p className="text-xs text-slate-500">
                Classified Products (Product 1, 2, 3), Sales Lots, Returnable vs. Non-Returnable Samples
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-blue-900 uppercase">Product 1 (Optical Ta₂O₅)</span>
              <div className="space-y-1 font-mono">
                <div>a. Batch#: <strong>{activeLot?.outputProduct1.batchNo}</strong></div>
                <div>b. Net Weight: <strong>{activeLot?.outputProduct1.netWeightKg} kg</strong></div>
                <div>c. MetalOxide 'A': <strong>{activeLot?.outputProduct1.containedOxideAKg} kg</strong></div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-emerald-900 uppercase">Product 2 (Technical Ta)</span>
              <div className="space-y-1 font-mono">
                <div>a. Batch#: <strong>{activeLot?.outputProduct2.batchNo}</strong></div>
                <div>b. Net Weight: <strong>{activeLot?.outputProduct2.netWeightKg} kg</strong></div>
                <div>c. MetalOxide 'A': <strong>{activeLot?.outputProduct2.containedOxideAKg} kg</strong></div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-indigo-900 uppercase">Product 3 (Pure Nb₂O₅)</span>
              <div className="space-y-1 font-mono">
                <div>a. Batch#: <strong>{activeLot?.outputProduct3.batchNo}</strong></div>
                <div>b. Net Weight: <strong>{activeLot?.outputProduct3.netWeightKg} kg</strong></div>
                <div>c. MetalOxide 'B': <strong>{activeLot?.outputProduct3.containedOxideBKg} kg</strong></div>
              </div>
            </div>
          </div>

          {/* Sample Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-1.5">
              <span className="font-bold text-blue-900 block">Sample: Returnable</span>
              <p className="text-[11px] text-slate-600">SampleID: SMP-RET-041 • 2.5 kg • Due back after inter-lab calibration</p>
              <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Never deducted from permanent stock
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 block">Sample: Non-Returnable</span>
              <p className="text-[11px] text-slate-600">SampleID: SMP-NRET-118 • 1.0 kg • Customer qualification for Sales Contract</p>
              <span className="inline-block text-[10px] font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                Permanently deducted with audit log
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
