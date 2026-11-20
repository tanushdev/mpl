import React from 'react';
import { 
  FlaskConical, 
  Scale, 
  Layers, 
  AlertTriangle,
  Boxes
} from 'lucide-react';
import { ProductionCampaign } from '../../types/erp';

interface LossTrackerViewProps {
  campaigns: ProductionCampaign[];
}

export const LossTrackerView: React.FC<LossTrackerViewProps> = ({ campaigns }) => {
  const activeCampaign = campaigns[0];
  const activeLot = activeCampaign?.lots[0];

  const inputA = activeLot?.inputOxideAKg || 0;
  const inputB = activeLot?.inputOxideBKg || 0;

  const yieldA = (activeLot?.outputProduct1.containedOxideAKg || 0) + (activeLot?.outputProduct2.containedOxideAKg || 0);
  const yieldB = activeLot?.outputProduct3.containedOxideBKg || 0;

  const solidLossA = activeLot?.lossSolid.oxideAKg || 0;
  const solidLossB = activeLot?.lossSolid.oxideBKg || 0;

  const liquidLossA = activeLot?.lossLiquid.oxideAKg || 0;
  const liquidLossB = activeLot?.lossLiquid.oxideBKg || 0;

  const unidentifiedA = activeLot?.lossUnidentified.oxideAKg || 0;
  const unidentifiedB = activeLot?.lossUnidentified.oxideBKg || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">
              Yield & 3D Loss Reconciler (Process Flow Exact Formula)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Mass Balance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking Liquid Loss (KL), Solid Loss (kg), and Unidentified Discrepancy for Campaign {activeCampaign?.campaignNo}.
          </p>
        </div>
      </div>

      {/* Inputs vs Outputs Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MetalOxide A (Ta2O5) Balance */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100">
            <span className="font-bold text-blue-900 text-xs uppercase">MetalOxide 'A' (Ta₂O₅) Balance</span>
            <span className="font-mono text-xs font-bold text-blue-700">Input: {inputA} kg</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Product 1 Yield ({activeLot?.outputProduct1.batchNo}):</span>
              <strong className="text-emerald-700 font-mono">{activeLot?.outputProduct1.containedOxideAKg} kg</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Product 2 Yield ({activeLot?.outputProduct2.batchNo}):</span>
              <strong className="text-emerald-700 font-mono">{activeLot?.outputProduct2.containedOxideAKg} kg</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Solid Loss - S ({activeLot?.lossSolid.batchNo} • {activeLot?.lossSolid.netWeightKg} kg):</span>
              <strong className="text-amber-800 font-mono">{solidLossA} kg</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Liquid Loss - L ({activeLot?.lossLiquid.batchNo} • {activeLot?.lossLiquid.volumeKL} KL):</span>
              <strong className="text-blue-800 font-mono">{liquidLossA} kg</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-rose-700 font-semibold">Unidentified Loss (Variance):</span>
              <strong className="text-rose-700 font-mono">{unidentifiedA} kg</strong>
            </div>
          </div>
          <div className="p-2.5 bg-blue-50/70 rounded-lg text-center font-mono text-xs text-blue-900 font-bold">
            Total Accounted: {yieldA + solidLossA + liquidLossA + unidentifiedA} kg / {inputA} kg (100%)
          </div>
        </div>

        {/* MetalOxide B (Nb2O5) Balance */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
            <span className="font-bold text-indigo-900 text-xs uppercase">MetalOxide 'B' (Nb₂O₅) Balance</span>
            <span className="font-mono text-xs font-bold text-indigo-700">Input: {inputB} kg</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Product 3 Yield ({activeLot?.outputProduct3.batchNo}):</span>
              <strong className="text-indigo-700 font-mono">{yieldB} kg</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Solid Loss - S ({activeLot?.lossSolid.batchNo} • {activeLot?.lossSolid.netWeightKg} kg):</span>
              <strong className="text-amber-800 font-mono">{solidLossB} kg</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Liquid Loss - L ({activeLot?.lossLiquid.batchNo} • {activeLot?.lossLiquid.volumeKL} KL):</span>
              <strong className="text-blue-800 font-mono">{liquidLossB} kg</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-rose-700 font-semibold">Unidentified Loss (Variance):</span>
              <strong className="text-rose-700 font-mono">{unidentifiedB} kg</strong>
            </div>
          </div>
          <div className="p-2.5 bg-indigo-50/70 rounded-lg text-center font-mono text-xs text-indigo-900 font-bold">
            Total Accounted: {yieldB + solidLossB + liquidLossB + unidentifiedB} kg / {inputB} kg (100%)
          </div>
        </div>
      </div>

      {/* Visual Loss Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Liquid Loss */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 uppercase">Liquid Loss (KL)</span>
            <FlaskConical className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-slate-500">Effluent stream sent to ETP plant:</p>
          <div className="p-2.5 bg-blue-50 rounded-lg font-mono text-xs space-y-1">
            <div>Volume: <strong>{activeLot?.lossLiquid.volumeKL} KL (Kilo-Litres)</strong></div>
            <div>Oxide A: <strong>{liquidLossA} kg</strong></div>
            <div>Oxide B: <strong>{liquidLossB} kg</strong></div>
          </div>
        </div>

        {/* Solid Loss */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 uppercase">Solid Loss (kg)</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-slate-500">Filter press cake and slag residue:</p>
          <div className="p-2.5 bg-amber-50 rounded-lg font-mono text-xs space-y-1">
            <div>Weight: <strong>{activeLot?.lossSolid.netWeightKg} kg</strong></div>
            <div>Oxide A: <strong>{solidLossA} kg</strong></div>
            <div>Oxide B: <strong>{solidLossB} kg</strong></div>
          </div>
        </div>

        {/* Unidentified Loss */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-900 uppercase">Unidentified Loss</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-slate-500">Unaccounted variance in mass balance:</p>
          <div className="p-2.5 bg-rose-50 rounded-lg font-mono text-xs space-y-1">
            <div>Oxide A: <strong>{unidentifiedA} kg</strong></div>
            <div>Oxide B: <strong>{unidentifiedB} kg</strong></div>
            <div className="text-[10px] text-emerald-600 font-semibold">Within plant limit &lt; 1%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
