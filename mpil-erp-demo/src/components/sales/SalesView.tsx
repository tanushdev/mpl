import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Printer, 
  X,
  Boxes,
  DollarSign
} from 'lucide-react';
import { SalesContract, FinishedGoodItem, UserProfile } from '../../types/erp';

interface SalesViewProps {
  currentUser: UserProfile;
  salesContracts: SalesContract[];
  finishedGoods: FinishedGoodItem[];
  onAllocateBatches: (contractNo: string, batches: string[]) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  currentUser,
  salesContracts,
  finishedGoods,
  onAllocateBatches
}) => {
  const [selectedContract, setSelectedContract] = useState<SalesContract | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const handleOpenAllocate = (contract: SalesContract) => {
    setSelectedContract(contract);
    setSelectedBatches(contract.allocatedBatches || []);
    setShowAllocateModal(true);
  };

  const handleToggleBatch = (batchNo: string) => {
    if (selectedBatches.includes(batchNo)) {
      setSelectedBatches(selectedBatches.filter(b => b !== batchNo));
    } else {
      setSelectedBatches([...selectedBatches, batchNo]);
    }
  };

  const handleSaveAllocation = () => {
    if (selectedContract) {
      onAllocateBatches(selectedContract.contractNo, selectedBatches);
      setSelectedContract({
        ...selectedContract,
        allocatedBatches: selectedBatches,
      });
      setShowAllocateModal(false);
    }
  };

  const filtered = salesContracts.filter(sc =>
    sc.contractNo.toLowerCase().includes(searchFilter.toLowerCase()) ||
    sc.buyer.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    sc.material.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Sales Contracts</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filtered.length} Active Contracts
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Customer sales orders, delivery schedules, and batch reservations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter contracts..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Contract #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4 text-right">Quantity (kg)</th>
                <th className="py-3 px-4 text-right">Total Contract ($ USD)</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Reserved Batches</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sc) => (
                <tr 
                  key={sc.contractNo}
                  onClick={() => setSelectedContract(sc)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{sc.contractNo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{sc.buyer.name}</td>
                  <td className="py-3 px-4 text-slate-700">{sc.material}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    {sc.quantityKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    ${sc.totalValueUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{sc.buyer.country}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-blue-700">
                    {sc.allocatedBatches.join(', ') || 'None reserved'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAllocate(sc);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        Reserve Stock
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContract(sc);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Contract Detail Drawer */}
      {selectedContract && !showAllocateModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedContract.contractNo}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedContract.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedContract.material}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Buyer: <strong>{selectedContract.buyer.name}</strong> • {selectedContract.buyer.country}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Contract Quantity:</span>
                  <span className="font-bold text-slate-900">{selectedContract.quantityKg.toLocaleString()} kg (8 Drums of 250 kg)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Unit Price:</span>
                  <span className="font-bold text-slate-900">${selectedContract.priceUsdPerKg} USD / kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Contract Value:</span>
                  <strong className="text-emerald-700 font-bold text-sm">
                    ${selectedContract.totalValueUsd.toLocaleString()} USD
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Payment Terms:</span>
                  <span className="font-semibold text-slate-800">100% TT within 30 days of arrival</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Authorized Signatory:</span>
                  <span className="font-bold text-slate-900">{selectedContract.authorizedSignatory}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Assigned Batches:</span>
                  <span className="font-mono font-bold text-blue-900">
                    {selectedContract.allocatedBatches.join(', ') || 'No batches assigned yet'}
                  </span>
                </div>
                <button
                  onClick={() => setShowAllocateModal(true)}
                  className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-blue-700 font-semibold hover:bg-blue-50"
                >
                  Change Batches
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reserve Batches */}
      {showAllocateModal && selectedContract && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reserve Finished Stock</h3>
                <p className="text-xs text-slate-500">For Contract {selectedContract.contractNo} ({selectedContract.quantityKg} kg)</p>
              </div>
              <button onClick={() => setShowAllocateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2">
              {finishedGoods.map((fg) => {
                const isChecked = selectedBatches.includes(fg.batchNo);
                return (
                  <div
                    key={fg.batchNo}
                    onClick={() => handleToggleBatch(fg.batchNo)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isChecked 
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-blue-600"
                      />
                      <div>
                        <div className="font-mono font-bold text-slate-900">{fg.batchNo}</div>
                        <div className="text-[11px] text-slate-500">{fg.productClassification} ({fg.grade})</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800">{fg.availableStockKg} kg</span>
                      <span className="text-[10px] text-emerald-600 block">Tested & Ready</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setShowAllocateModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllocation}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
              >
                Save Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
