import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Printer, 
  X,
  FileSpreadsheet,
  ArrowRightLeft,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MaterialTransferNote, RawMaterialUID, FinishedGoodItem, UserProfile } from '../../types/erp';

interface TransferNotesViewProps {
  currentUser: UserProfile;
  transferNotes: MaterialTransferNote[];
  rawMaterials: RawMaterialUID[];
  finishedGoods: FinishedGoodItem[];
  onIssueMaterialTransfer: (note: MaterialTransferNote) => void;
  onPrintTransferNote?: (transferNo: string) => void;
  searchFilter?: string;
}

export const TransferNotesView: React.FC<TransferNotesViewProps> = ({
  currentUser,
  transferNotes,
  rawMaterials,
  finishedGoods,
  onIssueMaterialTransfer,
  onPrintTransferNote,
  searchFilter = '',
}) => {
  const [selectedNote, setSelectedNote] = useState<MaterialTransferNote | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Store_to_Plant' | 'Plant_to_Store'>('ALL');

  // Modal Form State
  const [transferType, setTransferType] = useState<'Store_to_Plant' | 'Plant_to_Store'>('Store_to_Plant');
  const availableRms = rawMaterials.filter(r => r.qcStatus === 'Accepted');
  const [selectedRmUid, setSelectedRmUid] = useState<string>(availableRms[0]?.uid || '');
  const [selectedFgBatch, setSelectedFgBatch] = useState<string>(finishedGoods[0]?.batchNo || '');
  const [issueWeight, setIssueWeight] = useState<number>(500);

  const currentRm = availableRms.find(u => u.uid === selectedRmUid);
  const currentFg = finishedGoods.find(f => f.batchNo === selectedFgBatch);

  const calculatedOxideA = transferType === 'Store_to_Plant' 
    ? (currentRm ? (issueWeight * (currentRm.metalOxideAPercent / 100)) : 0)
    : (currentFg ? (issueWeight * ((currentFg.metalOxideAPercent || 99.5) / 100)) : 0);

  const calculatedOxideB = transferType === 'Store_to_Plant'
    ? (currentRm ? (issueWeight * (currentRm.metalOxideBPercent / 100)) : 0)
    : (currentFg ? (issueWeight * ((currentFg.metalOxideBPercent || 0) / 100)) : 0);

  const query = (localSearch || searchFilter).toLowerCase();
  const filtered = transferNotes.filter(n => {
    const matchesSearch = 
      n.transferNo.toLowerCase().includes(query) ||
      (n.campaignNo && n.campaignNo.toLowerCase().includes(query)) ||
      n.uidOrBatchNo.toLowerCase().includes(query);
    const matchesType = typeFilter === 'ALL' || n.transferType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isRm = transferType === 'Store_to_Plant';
    const now = new Date();
    const timestampStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 12);

    const newTransferNote: MaterialTransferNote = {
      transferNo: `IMTN-${isRm ? 'RM' : 'FG'}-${Math.floor(7740 + Math.random() * 999)}`,
      transferType,
      uidOrBatchNo: isRm ? selectedRmUid : selectedFgBatch,
      campaignNo: 'CAMP-2026-08',
      lotNo: 'LOT-01',
      productType: isRm ? (currentRm?.materialName || 'Raw Material Charge') : (currentFg?.productName || 'Finished Stock'),
      weightKg: issueWeight,
      oxideAKg: parseFloat(calculatedOxideA.toFixed(2)),
      oxideBKg: parseFloat(calculatedOxideB.toFixed(2)),
      issuedByName: `${currentUser.name} (${currentUser.designation})`,
      issuedBySignature: `E-SIGN: ${currentUser.empId}-${timestampStr}`,
      receivedByName: isRm ? 'Sanjay Patil (Production Head)' : 'Ramesh Kadam (Stores GM)',
      receivedBySignature: `E-SIGN: ACK-${timestampStr}`,
      date: now.toISOString().split('T')[0],
      status: 'Completed',
    };

    onIssueMaterialTransfer(newTransferNote);
    setShowIssueModal(false);
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Issue Material Transfer Notes (RM & FG)</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filtered.length} Notes Recorded
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Custody Transfer Notes for Store → Plant (Raw Material) and Plant → Store (Finished Goods).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
            />
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Transfer Note</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Direction:</span>
            <div className="flex space-x-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
              {(['ALL', 'Store_to_Plant', 'Plant_to_Store'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setTypeFilter(dir)}
                  className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors ${
                    typeFilter === dir ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {dir === 'ALL' ? 'All Movements' : dir === 'Store_to_Plant' ? 'Store → Plant (RM)' : 'Plant → Store (FG)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Transfer Note No.</th>
                <th className="py-3 px-4">Movement Type</th>
                <th className="py-3 px-4">UID / Batch Ref</th>
                <th className="py-3 px-4">Material Description</th>
                <th className="py-3 px-4 text-right">Physical Wt (Kg)</th>
                <th className="py-3 px-4 text-right">Ta Oxide (Kg)</th>
                <th className="py-3 px-4 text-right">Nb Oxide (Kg)</th>
                <th className="py-3 px-4">Issued By (E-Sign)</th>
                <th className="py-3 px-4">Received By (E-Sign)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((note) => (
                <tr 
                  key={note.transferNo}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{note.transferNo}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      note.transferType === 'Store_to_Plant' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {note.transferType === 'Store_to_Plant' ? 'Store → Plant (RM)' : 'Plant → Store (FG)'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{note.uidOrBatchNo}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{note.productType || 'Smelting Charge'}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{note.weightKg.toLocaleString()} kg</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">{note.oxideAKg.toFixed(1)} kg</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">{note.oxideBKg.toFixed(1)} kg</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{note.issuedByName}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{note.issuedBySignature}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{note.receivedByName}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{note.receivedBySignature}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {onPrintTransferNote && (
                      <button
                        onClick={() => onPrintTransferNote(note.transferNo)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                        title="Print Formal Transfer Note"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue Material Transfer Note */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Issue Material Transfer Note</h3>
                <p className="text-xs text-slate-500">Atomic custody transfer between Stores and Production Plant</p>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Transfer Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferType('Store_to_Plant')}
                    className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${
                      transferType === 'Store_to_Plant'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Store → Plant (Raw Material)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('Plant_to_Store')}
                    className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all ${
                      transferType === 'Plant_to_Store'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Plant → Store (Finished Goods)
                  </button>
                </div>
              </div>

              {transferType === 'Store_to_Plant' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Select Source Raw Material UID</label>
                  <select
                    value={selectedRmUid}
                    onChange={(e) => setSelectedRmUid(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  >
                    {availableRms.map(rm => (
                      <option key={rm.uid} value={rm.uid}>
                        {rm.uid} • {rm.materialName} ({rm.netDryWeightKg} kg available)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Select Output Finished Goods Batch</label>
                  <select
                    value={selectedFgBatch}
                    onChange={(e) => setSelectedFgBatch(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  >
                    {finishedGoods.map(fg => (
                      <option key={fg.batchNo} value={fg.batchNo}>
                        {fg.batchNo} • {fg.productClassification} ({fg.grade})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Net Physical Weight to Transfer (Kg)</label>
                <input
                  type="number"
                  step="1"
                  value={issueWeight}
                  onChange={(e) => setIssueWeight(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              {/* Calculated Contained Oxides */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Contained Ta₂O₅:</span>
                  <strong className="text-blue-700 text-sm">{calculatedOxideA.toFixed(2)} kg</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Contained Nb₂O₅:</span>
                  <strong className="text-indigo-700 text-sm">{calculatedOxideB.toFixed(2)} kg</strong>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center space-x-2 text-blue-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  Digital E-signature stamp will be automatically sealed under <strong>{currentUser.name}</strong> upon submission.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Issue & Seal Transfer Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
