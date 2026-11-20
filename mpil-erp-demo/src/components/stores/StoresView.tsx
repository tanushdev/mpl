import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw,
  Trash2,
  X,
  Barcode,
  Scale,
  FlaskConical,
  Building,
  Check
} from 'lucide-react';
import { RawMaterialUID, UserProfile } from '../../types/erp';

interface StoresViewProps {
  currentUser: UserProfile;
  rawMaterials: RawMaterialUID[];
  onAddRawMaterial: (item: RawMaterialUID) => void;
  onNavigateToProduction: () => void;
}

export const StoresView: React.FC<StoresViewProps> = ({
  currentUser,
  rawMaterials,
  onAddRawMaterial,
  onNavigateToProduction
}) => {
  const [selectedItem, setSelectedItem] = useState<RawMaterialUID | null>(null);
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Accepted' | 'Pending Inspection' | 'Rejected - Return' | 'Rejected - Dispose'>('ALL');

  // Form state (Section 2 - Req #1 & #2)
  const [inwardForm, setInwardForm] = useState({
    labUid: `UID-2026-RM-${Math.floor(8500 + Math.random() * 999)}`,
    invoiceNo: 'EXP-NAM-2026-995',
    poNumber: 'MPIL/RM/262743',
    supplierName: 'Nippon Advanced Metals & Materials Corp.',
    materialName: 'Tantalum Columbite Concentrate',
    grossWeightKg: 2045,
    tareWeightKg: 45,
    moistureDeductionKg: 36.8, // Net_Dry_Weight = Weight_Received - Moisture_Content
    oxideAPercent: 36.5, // % Ta2O5
    oxideBPercent: 24.2, // % Nb2O5
    warehouseLocation: 'Bay RM-A3 (Raw Material Stores)',
    qcGateDecision: 'Accepted' as 'Accepted' | 'Pending Inspection' | 'Rejected - Return' | 'Rejected - Dispose',
  });

  const weightReceived = Math.max(0, inwardForm.grossWeightKg - inwardForm.tareWeightKg);
  const netDryWeightKg = Math.max(0, weightReceived - inwardForm.moistureDeductionKg);
  const containedOxideAKg = parseFloat((netDryWeightKg * (inwardForm.oxideAPercent / 100)).toFixed(2));
  const containedOxideBKg = parseFloat((netDryWeightKg * (inwardForm.oxideBPercent / 100)).toFixed(2));

  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAccepted = inwardForm.qcGateDecision === 'Accepted';
    const isPending = inwardForm.qcGateDecision === 'Pending Inspection';

    const newUidItem: RawMaterialUID = {
      uid: inwardForm.labUid, // Lab_UID
      invoiceNo: inwardForm.invoiceNo, // Invoice_No
      poNumber: inwardForm.poNumber, // PO_Ref_No
      receiptDate: new Date().toISOString().split('T')[0],
      materialName: inwardForm.materialName,
      grossWeightKg: inwardForm.grossWeightKg,
      tareWeightKg: inwardForm.tareWeightKg,
      netWeightKg: weightReceived, // Weight_Received
      moisturePercent: parseFloat(((inwardForm.moistureDeductionKg / weightReceived) * 100).toFixed(2)),
      netDryWeightKg: parseFloat(netDryWeightKg.toFixed(2)), // Net_Dry_Weight = Weight_Received - Moisture_Content
      metalOxideAPercent: inwardForm.oxideAPercent, // Oxide_A_Ta_Pct
      containedOxideAKg: containedOxideAKg, // Oxide_A_Ta_Kg
      metalOxideBPercent: inwardForm.oxideBPercent, // Oxide_B_Nb_Pct
      containedOxideBKg: containedOxideBKg, // Oxide_B_Nb_Kg
      qcStatus: inwardForm.qcGateDecision,
      inventoryStatus: isAccepted ? 'In Stock' : isPending ? 'In Stock' : 'Consumed',
      warehouseLocation: isAccepted 
        ? inwardForm.warehouseLocation 
        : inwardForm.qcGateDecision === 'Rejected - Return' 
        ? 'Quarantine Holding Zone C (Vendor Return)' 
        : inwardForm.qcGateDecision === 'Rejected - Dispose'
        ? 'Hazardous Waste Disposal Yard'
        : 'Sampling Inspection Bay 2',
    };

    onAddRawMaterial(newUidItem);
    setShowInwardModal(false);
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const filtered = rawMaterials.filter(rm => {
    const matchesQuery = 
      rm.uid.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rm.invoiceNo.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rm.materialName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rm.poNumber.toLowerCase().includes(searchFilter.toLowerCase());

    if (statusFilter === 'ALL') return matchesQuery;
    return matchesQuery && rm.qcStatus === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Raw Material Inventory (RM_Lots Ledger)</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filtered.length} Lots Tracked
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Three parallel metrics: Net Dry Weight (Kg), Ta Contained (Kg / %), Nb Contained (Kg / %).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by UID, Inv#, or PO..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
            />
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => setShowInwardModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Inbound Receipt & Assay</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
        {(['ALL', 'Accepted', 'Pending Inspection', 'Rejected - Return', 'Rejected - Dispose'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st === 'ALL' ? 'All Lots' : st}
          </button>
        ))}
      </div>

      {/* RM Lots Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Lab UID</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">PO Ref No</th>
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4 text-right">Net Dry Wt (Kg)</th>
                <th className="py-3 px-4 text-right">Oxide A (Ta Kg / %)</th>
                <th className="py-3 px-4 text-right">Oxide B (Nb Kg / %)</th>
                <th className="py-3 px-4">QC Gate Status</th>
                <th className="py-3 px-4">Inventory Status</th>
                <th className="py-3 px-4">Warehouse Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr 
                  key={item.uid}
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 flex items-center space-x-1.5">
                    <Barcode className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span>{item.uid}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{item.invoiceNo}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{item.poNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.materialName}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {item.netDryWeightKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-blue-700 font-bold">
                    {item.containedOxideAKg.toFixed(1)} kg <span className="text-[10px] text-slate-400 font-normal">({item.metalOxideAPercent}%)</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-700 font-bold">
                    {item.containedOxideBKg.toFixed(1)} kg <span className="text-[10px] text-slate-400 font-normal">({item.metalOxideBPercent}%)</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.qcStatus === 'Accepted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.qcStatus === 'Pending Inspection'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : item.qcStatus === 'Rejected - Return'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.qcStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      item.inventoryStatus === 'In Stock'
                        ? 'bg-slate-100 text-slate-800'
                        : item.inventoryStatus === 'Allocated to Campaign'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                      {item.inventoryStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{item.warehouseLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Barcode className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{selectedItem.uid}</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Number:</span>
                  <strong className="font-mono text-slate-900">{selectedItem.invoiceNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PO Reference:</span>
                  <strong className="font-mono text-slate-900">{selectedItem.poNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Material:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.materialName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Date:</span>
                  <span className="text-slate-700">{selectedItem.receiptDate}</span>
                </div>
              </div>

              {/* Physical Weighment Card */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-900 text-xs block uppercase tracking-wide">Physical Weighbridge Readings</span>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gross Weight:</span>
                    <strong className="text-slate-800">{selectedItem.grossWeightKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tare Weight:</span>
                    <strong className="text-slate-800">{selectedItem.tareWeightKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Net Material Wt:</span>
                    <strong className="text-slate-800">{selectedItem.netWeightKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Moisture Deduction:</span>
                    <strong className="text-amber-700">{selectedItem.moisturePercent}%</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-semibold text-slate-700">Net Dry Weight (Kg):</span>
                  <strong className="text-base text-blue-800 font-mono">{selectedItem.netDryWeightKg} kg</strong>
                </div>
              </div>

              {/* Chemical Assay Contained */}
              <div className="p-4 border-2 border-slate-900 rounded-xl bg-slate-50 space-y-2 font-mono">
                <span className="font-bold text-slate-900 text-xs block uppercase tracking-wide font-sans">Lab Analytical Oxide Content</span>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">MetalOxide 'A' (Ta₂O₅):</span>
                  <strong className="text-blue-700">{selectedItem.containedOxideAKg} kg ({selectedItem.metalOxideAPercent}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">MetalOxide 'B' (Nb₂O₅):</span>
                  <strong className="text-indigo-700">{selectedItem.containedOxideBKg} kg ({selectedItem.metalOxideBPercent}%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Inbound Receipt & Assay Form (Section 2 - Req #1) */}
      {showInwardModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Inbound Receipt & Lab Assay Entry</h3>
                <p className="text-xs text-slate-500">Record physical weighment, moisture deduction, and oxide content</p>
              </div>
              <button onClick={() => setShowInwardModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleInwardSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lab UID (Manual Tag)</label>
                  <input
                    type="text"
                    value={inwardForm.labUid}
                    onChange={(e) => setInwardForm({ ...inwardForm, labUid: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Supplier Invoice Number</label>
                  <input
                    type="text"
                    value={inwardForm.invoiceNo}
                    onChange={(e) => setInwardForm({ ...inwardForm, invoiceNo: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PO Reference Number</label>
                  <input
                    type="text"
                    value={inwardForm.poNumber}
                    onChange={(e) => setInwardForm({ ...inwardForm, poNumber: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={inwardForm.supplierName}
                    onChange={(e) => setInwardForm({ ...inwardForm, supplierName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              {/* Physical Weighbridge & Moisture Logic */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 uppercase block tracking-wider text-[11px]">
                  Physical Weighment & Moisture (Net_Dry_Weight = Received - Moisture)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Gross Wt (kg)</label>
                    <input
                      type="number"
                      value={inwardForm.grossWeightKg}
                      onChange={(e) => setInwardForm({ ...inwardForm, grossWeightKg: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Tare Wt (kg)</label>
                    <input
                      type="number"
                      value={inwardForm.tareWeightKg}
                      onChange={(e) => setInwardForm({ ...inwardForm, tareWeightKg: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Moisture Loss (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inwardForm.moistureDeductionKg}
                      onChange={(e) => setInwardForm({ ...inwardForm, moistureDeductionKg: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-mono font-bold text-blue-900">
                  <span>Calculated Net Dry Weight:</span>
                  <span>{netDryWeightKg.toFixed(2)} kg</span>
                </div>
              </div>

              {/* Chemical Oxide Content Upload */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                <span className="font-bold text-blue-950 uppercase block tracking-wider text-[11px]">
                  Analytical Lab Assay (% Ta and % Nb)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-blue-900 block mb-1">% Oxide A (Ta₂O₅)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inwardForm.oxideAPercent}
                      onChange={(e) => setInwardForm({ ...inwardForm, oxideAPercent: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-blue-300 font-mono"
                      required
                    />
                    <span className="text-[10px] text-blue-700 font-mono mt-1 block">
                      Contained Ta: <strong>{containedOxideAKg} kg</strong>
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-indigo-900 block mb-1">% Oxide B (Nb₂O₅)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inwardForm.oxideBPercent}
                      onChange={(e) => setInwardForm({ ...inwardForm, oxideBPercent: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-indigo-300 font-mono"
                      required
                    />
                    <span className="text-[10px] text-indigo-700 font-mono mt-1 block">
                      Contained Nb: <strong>{containedOxideBKg} kg</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* QC Gate Status (Section 2 - Req #1) */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  QC Gate Status: Pending Inspection → Accepted OR Rejected (Return / Dispose)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'Accepted', label: 'Accepted (Add to Store)', color: 'emerald' },
                    { id: 'Pending Inspection', label: 'Pending Inspection', color: 'blue' },
                    { id: 'Rejected - Return', label: 'Rejected: Return to Vendor', color: 'amber' },
                    { id: 'Rejected - Dispose', label: 'Rejected: Disposed', color: 'rose' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setInwardForm({ ...inwardForm, qcGateDecision: btn.id as any })}
                      className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-all ${
                        inwardForm.qcGateDecision === btn.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInwardModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Commit Inward Lot to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
