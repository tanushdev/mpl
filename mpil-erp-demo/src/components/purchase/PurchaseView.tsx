import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle, 
  Send, 
  Printer, 
  X,
  ShoppingCart,
  Search,
  DollarSign
} from 'lucide-react';
import { PurchaseOrder, UserProfile } from '../../types/erp';

interface PurchaseViewProps {
  currentUser: UserProfile;
  purchaseOrders: PurchaseOrder[];
  onApprovePO: (poId: string) => void;
  onSendPOToSupplier: (poId: string) => void;
  onCreatePO: (newPO: PurchaseOrder) => void;
}

export const PurchaseView: React.FC<PurchaseViewProps> = ({
  currentUser,
  purchaseOrders,
  onApprovePO,
  onSendPOToSupplier,
  onCreatePO
}) => {
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    poNumber: `MPIL/RM/${Math.floor(260000 + Math.random() * 9000)}`,
    sellerName: 'Global Tantalum Refineries Ltd.',
    sellerCountry: 'Rwanda',
    sellerAddress: 'Kigali Free Trade Zone, Plot 44',
    materialName: 'Tantalum Ore',
    hsCode: '2615 90 20',
    quantityKg: 800,
    rateUsdPerKgTa: 210,
    assumedTaPercent: 42,
    moisturePercent: 1.5,
    deliveryDate: '2026-12-20',
  });

  const netDryWeight = formData.quantityKg * (1 - formData.moisturePercent / 100);
  const totalCifUsd = formData.rateUsdPerKgTa * (formData.assumedTaPercent / 100) * netDryWeight;
  const provisional60 = totalCifUsd * 0.60;
  const final40 = totalCifUsd * 0.40;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: formData.poNumber,
      date: new Date().toISOString().split('T')[0],
      seller: {
        name: formData.sellerName,
        address: formData.sellerAddress,
        country: formData.sellerCountry,
        gstinOrTaxId: 'RWA-EXP-9921',
      },
      material: {
        name: formData.materialName,
        hsCode: formData.hsCode,
        origin: formData.sellerCountry,
        quantityKg: formData.quantityKg,
        qualitySpecs: `Tantalum content: Min ${formData.assumedTaPercent}%`,
        packing: 'In leak-proof steel drums suitable for ocean freight.',
      },
      logistics: {
        deliveryDate: formData.deliveryDate,
        deliveryPort: 'Nhava Sheva Port, India',
        shipmentMode: 'Ocean Freight',
        portOfShipment: 'Mombasa Port',
        portOfDelivery: 'Nhava Sheva',
        consignee: 'MPIL, Taloja',
        notifyParty: 'Same as Buyer',
      },
      pricing: {
        rateUsdPerKgTa: formData.rateUsdPerKgTa,
        assumedTaPercent: formData.assumedTaPercent,
        moisturePercent: formData.moisturePercent,
        receivedWeightKg: formData.quantityKg,
        netDryWeightKg: parseFloat(netDryWeight.toFixed(2)),
        totalCalculatedCifUsd: parseFloat(totalCifUsd.toFixed(2)),
        provisionalPercent: 60,
        provisionalAmountUsd: parseFloat(provisional60.toFixed(2)),
        finalBalanceAmountUsd: parseFloat(final40.toFixed(2)),
      },
      status: 'Under Review',
      currentApproverRole: totalCifUsd > 50000 ? 'DIRECTOR' : 'PURCHASE_HEAD',
      createdBy: currentUser.name,
      createdDate: new Date().toISOString().split('T')[0],
      timeline: [
        {
          step: 'Order Created',
          actor: currentUser.name,
          action: 'Created order draft',
          timestamp: 'Just now',
        },
      ],
    };

    onCreatePO(newPO);
    setSelectedPO(newPO);
    setShowCreateModal(false);
  };

  const filteredPOs = purchaseOrders.filter(po =>
    po.poNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
    po.seller.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    po.material.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Purchase Orders</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredPOs.length} Orders
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Orders placed with raw material suppliers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter orders..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4 text-right">Quantity (kg)</th>
                <th className="py-3 px-4 text-right">Total ($ USD)</th>
                <th className="py-3 px-4">Delivery By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPOs.map((po) => (
                <tr 
                  key={po.id}
                  onClick={() => setSelectedPO(po)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{po.poNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{po.seller.name}</td>
                  <td className="py-3 px-4 text-slate-700">{po.material.name}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    {po.material.quantityKg.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ${po.pricing.totalCalculatedCifUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{po.logistics.deliveryDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : po.status === 'Sent to Supplier'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPO(po);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded-lg"
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Order Detail Drawer */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedPO.poNumber}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedPO.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPO(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Overview Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Supplier:</span>
                  <span className="font-bold text-slate-900">{selectedPO.seller.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Material:</span>
                  <span className="font-bold text-slate-900">{selectedPO.material.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Quantity Ordered:</span>
                  <span className="font-bold text-slate-900">{selectedPO.material.quantityKg} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Target Delivery Date:</span>
                  <span className="font-bold text-slate-900">{selectedPO.logistics.deliveryDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Port of Delivery:</span>
                  <span className="font-semibold text-slate-800">{selectedPO.logistics.portOfDelivery}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Price (CIF):</span>
                  <strong className="text-blue-700 font-bold text-sm">
                    ${selectedPO.pricing.totalCalculatedCifUsd.toLocaleString()} USD
                  </strong>
                </div>
              </div>

              {/* Simple Payment Terms */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs space-y-1.5">
                <span className="font-bold text-blue-900 block">Payment Breakdown:</span>
                <p className="text-slate-700">
                  • <strong>60% Initial Payment:</strong> ${selectedPO.pricing.provisionalAmountUsd.toLocaleString()} USD paid on shipping documents.
                </p>
                <p className="text-slate-700">
                  • <strong>40% Final Balance:</strong> ${selectedPO.pricing.finalBalanceAmountUsd.toLocaleString()} USD paid after plant moisture and assay testing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {selectedPO.status === 'Under Review' && (
                  <button
                    onClick={() => {
                      onApprovePO(selectedPO.id);
                      setSelectedPO(null);
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                  >
                    ✓ Approve This Order
                  </button>
                )}

                {selectedPO.status === 'Approved' && (
                  <button
                    onClick={() => {
                      onSendPOToSupplier(selectedPO.id);
                      setSelectedPO(null);
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Send to Supplier
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Print
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedPO(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Purchase Order */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">New Purchase Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Order #</label>
                  <input
                    type="text"
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Material Name</label>
                  <input
                    type="text"
                    value={formData.materialName}
                    onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={formData.quantityKg}
                    onChange={(e) => setFormData({ ...formData, quantityKg: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Price ($/kg Ta)</label>
                  <input
                    type="number"
                    value={formData.rateUsdPerKgTa}
                    onChange={(e) => setFormData({ ...formData, rateUsdPerKgTa: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Purity (Ta %)</label>
                  <input
                    type="number"
                    value={formData.assumedTaPercent}
                    onChange={(e) => setFormData({ ...formData, assumedTaPercent: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Est. Moisture %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.moisturePercent}
                    onChange={(e) => setFormData({ ...formData, moisturePercent: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Total Calculation Box */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-blue-900">Calculated Order Total:</span>
                <strong className="text-blue-800 font-bold text-sm">
                  ${totalCifUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </strong>
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
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
