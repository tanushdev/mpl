import React, { useState } from 'react';
import { 
  PackageCheck, 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  Plus, 
  RotateCcw, 
  X,
  FileText
} from 'lucide-react';
import { FinishedGoodItem, SampleRecord, UserProfile } from '../../types/erp';

interface FinishedGoodsViewProps {
  currentUser: UserProfile;
  finishedGoods: FinishedGoodItem[];
  samples: SampleRecord[];
  onAddSample: (sample: SampleRecord) => void;
  onRecordSampleReturn: (sampleId: string) => void;
}

export const FinishedGoodsView: React.FC<FinishedGoodsViewProps> = ({
  currentUser,
  finishedGoods,
  samples,
  onAddSample,
  onRecordSampleReturn
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'samples'>('inventory');
  const [showSampleModal, setShowSampleModal] = useState(false);

  const [sampleForm, setSampleForm] = useState({
    batchNo: finishedGoods[0]?.batchNo || 'B-P1-2611-01',
    type: 'Non-Returnable' as 'Returnable' | 'Non-Returnable',
    netWeightKg: 1.0,
    oxideAKg: 0.9995,
    oxideBKg: 0.0,
    recipient: 'Advanced Optical Crystals Inc. (USA)',
    purpose: 'Pre-shipment customer testing sample',
    expectedReturnDate: '2026-12-10',
  });

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    const newSample: SampleRecord = {
      sampleId: `SMP-2026-${sampleForm.type === 'Returnable' ? 'RET' : 'NRET'}-${Math.floor(100 + Math.random() * 899)}`,
      batchNo: sampleForm.batchNo,
      type: sampleForm.type,
      netWeightKg: sampleForm.netWeightKg,
      containedOxideAKg: sampleForm.oxideAKg,
      containedOxideBKg: sampleForm.oxideBKg,
      recipient: sampleForm.recipient,
      purpose: sampleForm.purpose,
      dateSent: new Date().toISOString().split('T')[0],
      expectedReturnDate: sampleForm.type === 'Returnable' ? sampleForm.expectedReturnDate : undefined,
      status: sampleForm.type === 'Returnable' ? 'Sent / In Transit' : 'Permanently Consumed',
    };

    onAddSample(newSample);
    setShowSampleModal(false);
  };

  const totalStockKg = finishedGoods.reduce((sum, item) => sum + item.availableStockKg, 0);

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Finished Goods & Samples</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                {totalStockKg.toLocaleString()} kg Total Stock
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Warehoused finished products (Product 1, 2, 3) and lab testing / client samples.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-slate-100 flex space-x-1">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'inventory' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classified Inventory
            </button>
            <button
              onClick={() => setActiveTab('samples')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'samples' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sample IDs ({samples.length})
            </button>
          </div>

          <button
            onClick={() => setShowSampleModal(true)}
            className="flex items-center space-x-1 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Sample ID</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Warehouse Stock */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* 3 Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Product 1</span>
                <span className="text-[10px] text-slate-400 font-mono">High Purity Ta2O5</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Optical & Capacitor Grade</h4>
              <p className="text-xs text-slate-500 mt-0.5">Grade 1 (99.95%) & Grade 2 (99.5%)</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-baseline text-xs">
                <span className="text-slate-500">Available:</span>
                <span className="text-slate-900 font-mono font-bold text-sm">2,000 kg</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Product 2</span>
                <span className="text-[10px] text-slate-400 font-mono">Technical Ta2O5</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Hard Metal & Carbide Grade</h4>
              <p className="text-xs text-slate-500 mt-0.5">Single standard 98.2% Ta2O5</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-baseline text-xs">
                <span className="text-slate-500">Available:</span>
                <span className="text-slate-900 font-mono font-bold text-sm">450 kg</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">Product 3</span>
                <span className="text-[10px] text-slate-400 font-mono">Pure Nb2O5</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Niobium Oxide (Superconducting)</h4>
              <p className="text-xs text-slate-500 mt-0.5">High purity 99.9% Nb2O5</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-baseline text-xs">
                <span className="text-slate-500">Available:</span>
                <span className="text-slate-900 font-mono font-bold text-sm">650 kg</span>
              </div>
            </div>
          </div>

          {/* Batches Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Classified Finished Inventory</h3>
              <span className="text-[11px] text-slate-500">{finishedGoods.length} production batches</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Batch #</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4 text-right">Net Weight (kg)</th>
                    <th className="py-3 px-4 text-right">Contained Oxide A</th>
                    <th className="py-3 px-4 text-right">Contained Oxide B</th>
                    <th className="py-3 px-4">QC Release</th>
                    <th className="py-3 px-4">Warehouse Bay</th>
                    <th className="py-3 px-4 text-right">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finishedGoods.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{item.batchNo}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.productClassification === 'Product 1' ? 'bg-blue-50 text-blue-700' :
                          item.productClassification === 'Product 2' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {item.productClassification}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.grade}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{item.netWeightKg.toLocaleString()} kg</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-700 font-medium">
                        {item.containedOxideAKg ? `${item.containedOxideAKg.toFixed(1)} kg` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-indigo-700 font-medium">
                        {item.containedOxideBKg ? `${item.containedOxideBKg.toFixed(1)} kg` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.qcReleaseStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.warehouseBay}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{item.availableStockKg.toLocaleString()} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lab & Customer Samples */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sample Registry (Returnable & Non-Returnable)</h3>
                <p className="text-[11px] text-slate-500">Tracked with individual Sample ID, Net Weight (kg), and contained Oxide A & B</p>
              </div>
              <span className="text-[11px] text-slate-500">{samples.length} tracked samples</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Sample ID</th>
                    <th className="py-3 px-4">Batch #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Net Weight (kg)</th>
                    <th className="py-3 px-4 text-right">Oxide A (kg)</th>
                    <th className="py-3 px-4 text-right">Oxide B (kg)</th>
                    <th className="py-3 px-4">Recipient / Lab</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Date Sent</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {samples.map((s) => (
                    <tr key={s.sampleId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">{s.sampleId}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{s.batchNo}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.type === 'Returnable' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{s.netWeightKg.toFixed(2)} kg</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-700 font-medium">{s.containedOxideAKg.toFixed(3)}</td>
                      <td className="py-3 px-4 text-right font-mono text-indigo-700 font-medium">{s.containedOxideBKg.toFixed(3)}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{s.recipient}</td>
                      <td className="py-3 px-4 text-slate-500">{s.purpose}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{s.dateSent}</td>
                      <td className="py-3 px-4 font-mono">
                        {s.expectedReturnDate ? <span className="font-semibold text-blue-700">{s.expectedReturnDate}</span> : <span className="text-slate-400">-</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Returned' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : s.status === 'Permanently Consumed' 
                            ? 'bg-slate-100 text-slate-600' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {s.type === 'Returnable' && s.status === 'Sent / In Transit' && (
                          <button
                            onClick={() => onRecordSampleReturn(s.sampleId)}
                            className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                          >
                            Mark Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Issue Sample */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Issue Sample ID</h3>
              <button onClick={() => setShowSampleModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sample Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSampleForm({ ...sampleForm, type: 'Non-Returnable' })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                      sampleForm.type === 'Non-Returnable' 
                        ? 'border-blue-600 bg-blue-50 text-blue-900' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Non-Returnable (Client Spec)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSampleForm({ ...sampleForm, type: 'Returnable' })}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                      sampleForm.type === 'Returnable' 
                        ? 'border-blue-600 bg-blue-50 text-blue-900' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Returnable (External Lab)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Finished Batch</label>
                <select
                  value={sampleForm.batchNo}
                  onChange={(e) => setSampleForm({ ...sampleForm, batchNo: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                >
                  {finishedGoods.map(fg => (
                    <option key={fg.batchNo} value={fg.batchNo}>
                      {fg.batchNo} • {fg.productClassification} ({fg.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Net Wt (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={sampleForm.netWeightKg}
                    onChange={(e) => {
                      const wt = Number(e.target.value);
                      setSampleForm({ 
                        ...sampleForm, 
                        netWeightKg: wt,
                        oxideAKg: parseFloat((wt * 0.999).toFixed(3)),
                        oxideBKg: 0.001
                      });
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Oxide A (kg)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={sampleForm.oxideAKg}
                    onChange={(e) => setSampleForm({ ...sampleForm, oxideAKg: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Oxide B (kg)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={sampleForm.oxideBKg}
                    onChange={(e) => setSampleForm({ ...sampleForm, oxideBKg: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              {sampleForm.type === 'Returnable' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Expected Return Due Date</label>
                  <input
                    type="date"
                    value={sampleForm.expectedReturnDate}
                    onChange={(e) => setSampleForm({ ...sampleForm, expectedReturnDate: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Recipient Name / Facility</label>
                <input
                  type="text"
                  value={sampleForm.recipient}
                  onChange={(e) => setSampleForm({ ...sampleForm, recipient: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Purpose / Test Requirement</label>
                <input
                  type="text"
                  value={sampleForm.purpose}
                  onChange={(e) => setSampleForm({ ...sampleForm, purpose: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSampleModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Issue Sample ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
