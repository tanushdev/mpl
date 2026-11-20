import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  OctagonAlert, 
  Printer, 
  Filter,
  Check,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StoreRequisition, RawMaterialUID, UserProfile } from '../../types/erp';

interface StoreRequisitionsViewProps {
  currentUser: UserProfile;
  requisitions: StoreRequisition[];
  rawMaterials: RawMaterialUID[];
  onUpdateStatus: (requisitionNo: string, newStatus: 'Approved' | 'Not Approved' | 'STOP') => void;
  onCreateRequisition: (req: StoreRequisition) => void;
  onPrintRequisition: (reqNo: string) => void;
}

export const StoreRequisitionsView: React.FC<StoreRequisitionsViewProps> = ({
  currentUser,
  requisitions,
  rawMaterials,
  onUpdateStatus,
  onCreateRequisition,
  onPrintRequisition,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Requisition Form State
  const availableUids = rawMaterials.filter(r => r.qcStatus === 'Accepted');
  const [selectedUids, setSelectedUids] = useState<string[]>(['UID-2026-RM-8492']);
  const [campaignNo, setCampaignNo] = useState('CAMP-2026-08');
  const [batchNo, setBatchNo] = useState('BATCH-2026-L3');
  const [targetProduct, setTargetProduct] = useState('Product 1 (High Purity Ta2O5)');
  const [remarks, setRemarks] = useState('Production smelting requisition for campaign run.');

  // Calculate totals from selected UIDs
  const selectedObjs = rawMaterials.filter(r => selectedUids.includes(r.uid));
  const calcTotalWt = selectedObjs.reduce((sum, r) => sum + r.netDryWeightKg, 0);
  const calcTotalTa = selectedObjs.reduce((sum, r) => sum + r.containedOxideAKg, 0);
  const calcTotalNb = selectedObjs.reduce((sum, r) => sum + r.containedOxideBKg, 0);

  const handleToggleUid = (uid: string) => {
    if (selectedUids.includes(uid)) {
      if (selectedUids.length > 1) {
        setSelectedUids(selectedUids.filter(u => u !== uid));
      }
    } else {
      setSelectedUids([...selectedUids, uid]);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: StoreRequisition = {
      requisitionNo: `SRN-2026-${Math.floor(100 + Math.random() * 899)}`,
      campaignNo,
      batchNo,
      targetProduct,
      rmLotUids: selectedUids,
      totalWeightKg: parseFloat(calcTotalWt.toFixed(1)),
      totalTaKg: parseFloat(calcTotalTa.toFixed(1)),
      totalNbKg: parseFloat(calcTotalNb.toFixed(1)),
      status: 'Requested',
      requestedBy: `${currentUser.name} (${currentUser.designation})`,
      requestDate: new Date().toISOString().split('T')[0],
      remarks,
    };

    onCreateRequisition(newReq);
    setShowCreateModal(false);
  };

  const isStoreManager = currentUser.role === 'STORE_USER' || currentUser.role === 'STORES_MANAGER';
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const filtered = requisitions.filter(r => {
    const matchesSearch = 
      r.requisitionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.campaignNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Store Requisition Notes</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filtered.length} Requisitions
              </span>
            </div>
            <p className="text-xs text-slate-500">
              State Machine: Requested → Approved | Not Approved | STOP (Multi-UID campaign issuance)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search SRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
            />
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Requisition</span>
            </button>
          )}
        </div>
      </div>

      {/* Requisitions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Status Filter:</span>
            <div className="flex space-x-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
              {['ALL', 'Requested', 'Approved', 'Not Approved', 'STOP'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors ${
                    statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">SRN Ref #</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Target Product</th>
                <th className="py-3 px-4">Linked UIDs</th>
                <th className="py-3 px-4 text-right">Total Wt (Kg)</th>
                <th className="py-3 px-4 text-right">Ta Content</th>
                <th className="py-3 px-4 text-right">Nb Content</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">State Machine Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.requisitionNo} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{req.requisitionNo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{req.campaignNo}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{req.batchNo}</td>
                  <td className="py-3 px-4 text-slate-800">{req.targetProduct}</td>
                  <td className="py-3 px-4 font-mono">
                    <div className="flex flex-wrap gap-1">
                      {req.rmLotUids.map(u => (
                        <span key={u} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {u}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{req.totalWeightKg.toLocaleString()} kg</td>
                  <td className="py-3 px-4 text-right font-mono text-blue-700 font-bold">{req.totalTaKg.toFixed(1)} kg</td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-700 font-bold">{req.totalNbKg.toFixed(1)} kg</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      req.status === 'STOP' ? 'bg-red-50 text-red-800 border border-red-200' :
                      req.status === 'Not Approved' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />}
                      {req.status === 'STOP' && <OctagonAlert className="w-3 h-3 text-red-600 mr-1" />}
                      <span>{req.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onPrintRequisition(req.requisitionNo)}
                        title="Print Formal Requisition Note"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {isStoreManager && req.status === 'Requested' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(req.requisitionNo, 'Approved')}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateStatus(req.requisitionNo, 'STOP')}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-xs"
                          >
                            STOP
                          </button>
                        </>
                      )}

                      {req.status !== 'Requested' && (
                        <span className="text-[10px] text-slate-400 italic">Signed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Store Requisition Note */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Store Requisition Note</h3>
                <p className="text-xs text-slate-500">Request allocation of Multiple Raw Material UIDs into Production Campaign</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Campaign No.</label>
                  <input
                    type="text"
                    value={campaignNo}
                    onChange={(e) => setCampaignNo(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Batch / Lot Identifier</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Product Output</label>
                <select
                  value={targetProduct}
                  onChange={(e) => setTargetProduct(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Product 1 (High Purity Ta2O5)">Product 1 (High Purity Tantalum Pentoxide Ta2O5)</option>
                  <option value="Product 2 (Technical Tantalum)">Product 2 (Technical Tantalum Compound)</option>
                  <option value="Product 3 (Pure Nb2O5)">Product 3 (Pure Niobium Pentoxide Nb2O5)</option>
                </select>
              </div>

              {/* Multi-UID Checkbox Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Select Multiple Raw Material UIDs from Stores:
                  </label>
                  <span className="text-[11px] text-blue-600 font-semibold">{selectedUids.length} Selected</span>
                </div>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1.5 bg-slate-50/50">
                  {availableUids.map((rm) => {
                    const isChecked = selectedUids.includes(rm.uid);
                    return (
                      <div
                        key={rm.uid}
                        onClick={() => handleToggleUid(rm.uid)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isChecked 
                            ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-blue-600"
                          />
                          <div>
                            <span className="font-mono font-bold block">{rm.uid}</span>
                            <span className="text-[10px] text-slate-500 block">{rm.materialName} ({rm.warehouseLocation})</span>
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          <strong>{rm.netDryWeightKg} kg</strong>
                          <span className="block text-[10px] text-blue-700">Ta: {rm.containedOxideAKg} kg | Nb: {rm.containedOxideBKg} kg</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Totals Card */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Requisition Weight:</span>
                  <strong className="text-slate-900 text-sm">{calcTotalWt.toFixed(1)} kg</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Ta Contained:</span>
                  <strong className="text-blue-700 text-sm">{calcTotalTa.toFixed(1)} kg</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Nb Contained:</span>
                  <strong className="text-indigo-700 text-sm">{calcTotalNb.toFixed(1)} kg</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Operational Remarks / Instructions</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
