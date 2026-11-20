import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  FileText, 
  CheckCircle2, 
  RefreshCw,
  Building,
  ShieldCheck,
  Calendar,
  Layers,
  FileCheck2,
  Briefcase
} from 'lucide-react';
import { 
  PurchaseOrder, 
  StoreRequisition, 
  MaterialTransferNote, 
  SalesContract,
  PrintableDocType 
} from '../../types/erp';

interface DocumentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDocType?: PrintableDocType;
  purchaseOrders: PurchaseOrder[];
  storeRequisitions: StoreRequisition[];
  transferNotes: MaterialTransferNote[];
  salesContracts: SalesContract[];
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  isOpen,
  onClose,
  defaultDocType = 'PO',
  purchaseOrders,
  storeRequisitions,
  transferNotes,
  salesContracts,
}) => {
  const [activeType, setActiveType] = useState<PrintableDocType>(defaultDocType);
  const [selectedPoId, setSelectedPoId] = useState<string>(purchaseOrders[0]?.id || '');
  const [selectedSrnNo, setSelectedSrnNo] = useState<string>(storeRequisitions[0]?.requisitionNo || '');
  const [selectedTransferNo, setSelectedTransferNo] = useState<string>(transferNotes[0]?.transferNo || '');
  const [selectedContractNo, setSelectedContractNo] = useState<string>(salesContracts[0]?.contractNo || '');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentPo = purchaseOrders.find(p => p.id === selectedPoId) || purchaseOrders[0];
  const currentSrn = storeRequisitions.find(s => s.requisitionNo === selectedSrnNo) || storeRequisitions[0];
  const currentTransfer = transferNotes.find(t => t.transferNo === selectedTransferNo) || transferNotes[0];
  const currentSales = salesContracts.find(s => s.contractNo === selectedContractNo) || salesContracts[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Hidden during print) */}
        <div className="print:hidden p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Document Type:</span>
            <div className="flex space-x-1 p-1 bg-white rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveType('PO')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeType === 'PO' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Purchase Order
              </button>
              <button
                onClick={() => setActiveType('REQUISITION')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeType === 'REQUISITION' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Store Requisition
              </button>
              <button
                onClick={() => setActiveType('TRANSFER_RM')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeType === 'TRANSFER_RM' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Transfer Note (RM/FG)
              </button>
              <button
                onClick={() => setActiveType('SALES_DISPATCH')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeType === 'SALES_DISPATCH' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sales / Dispatch Note
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white font-sans text-slate-900 print:p-0 print:m-0">
          {/* Official MPIL Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <img 
                  src="/mpil-logo.png" 
                  alt="MPIL Logo" 
                  className="h-14 w-auto object-contain mt-0.5 flex-shrink-0" 
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase font-serif">
                    Metallurgical Products (India) Private Limited
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Regd. Office & Works: T-27 MIDC-Taloja Industrial Area, Dist. Raigad – 410208, Maharashtra, India
                  </p>
                  <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-500 font-mono mt-1">
                    <span>CIN: U27100MH1972PTC015842</span>
                    <span>GSTIN: 27AACCM7042D1ZQ</span>
                    <span>IEC: 0302007636</span>
                    <span>ISO 9001:2015 Certified</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-800 uppercase">
                  {activeType === 'PO' && 'Purchase Order'}
                  {activeType === 'REQUISITION' && 'Store Requisition Note'}
                  {activeType === 'TRANSFER_RM' && 'Material Transfer Note'}
                  {activeType === 'SALES_DISPATCH' && 'Sales Contract & Dispatch'}
                </span>
                <span className="block text-[11px] text-slate-500 font-mono mt-1">
                  Plant Doc Rev 2026.1
                </span>
              </div>
            </div>
          </div>

          {/* TEMPLATE 1: PURCHASE ORDER */}
          {activeType === 'PO' && currentPo && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">PO Number & Date</span>
                  <span className="font-mono font-bold text-sm text-blue-700 block">{currentPo.poNumber}</span>
                  <span className="text-slate-600 block mt-0.5">Date: {currentPo.date}</span>
                  <span className="text-slate-600 block">Status: <strong className="text-emerald-700">{currentPo.status}</strong></span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Supplier / Beneficiary</span>
                  <strong className="text-slate-900 block">{currentPo.seller.name}</strong>
                  <span className="text-slate-600 block">{currentPo.seller.address}</span>
                  <span className="text-slate-600 font-mono block">Tax ID / GST: {currentPo.seller.gstinOrTaxId}</span>
                </div>
              </div>

              {/* Material Specs Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Contracted Material & Chemistry Specifications</h3>
                <table className="w-full text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 border-r border-slate-200">Description of Goods</th>
                      <th className="p-2 border-r border-slate-200">HS Code</th>
                      <th className="p-2 border-r border-slate-200 text-right">Contracted Qty (Kg)</th>
                      <th className="p-2 border-r border-slate-200 text-right">Min Ta Content</th>
                      <th className="p-2 text-right">CIF Rate ($/kg Ta)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-2 border-r border-slate-200 font-semibold">{currentPo.material.name}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">{currentPo.material.hsCode}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold">{currentPo.material.quantityKg.toLocaleString()} kg</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-blue-700">{currentPo.pricing.assumedTaPercent}%</td>
                      <td className="p-2 text-right font-mono font-bold">${currentPo.pricing.rateUsdPerKgTa}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Chemical & Packing Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-800 block mb-1">Quality & Impurity Limits:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{currentPo.material.qualitySpecs}</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-800 block mb-1">Packing & Delivery Port:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{currentPo.material.packing}</p>
                  <p className="text-slate-800 font-semibold text-[11px] mt-1">Delivery Port: {currentPo.logistics.portOfDelivery}</p>
                </div>
              </div>

              {/* Financial & Payment Terms (60% / 40% Split) */}
              <div className="p-4 border-2 border-slate-900 rounded-xl bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Total Calculated CIF Value:</span>
                  <span className="font-mono text-base text-blue-800">${currentPo.pricing.totalCalculatedCifUsd.toLocaleString()} USD</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Provisional Payment (60% against shipping docs):</span>
                    <strong className="font-mono text-slate-900">${currentPo.pricing.provisionalAmountUsd.toLocaleString()} USD</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Final Balance (40% post-moisture & assay at Taloja plant):</span>
                    <strong className="font-mono text-slate-900">${currentPo.pricing.finalBalanceAmountUsd.toLocaleString()} USD</strong>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-200">
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-center justify-center font-serif italic text-slate-700">
                    Vikram Deshmukh
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase">Prepared By (Procurement)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Timestamp: 10-Nov-2026 11:20</span>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-center justify-center font-serif italic text-blue-700 font-bold">
                    Pranav Mathur
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase">Managing Director Approval</span>
                  <span className="text-[10px] text-slate-400 font-mono">Digital Signature Verified</span>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-center justify-center text-slate-400 text-[10px]">
                    [Supplier Acceptance Stamp]
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase">Acknowledged by Supplier</span>
                  <span className="text-[10px] text-slate-400 font-mono">Kobe / Tokyo Desk</span>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: STORE REQUISITION NOTE */}
          {activeType === 'REQUISITION' && currentSrn && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Requisition Number</span>
                  <span className="font-mono font-bold text-sm text-indigo-700 block">{currentSrn.requisitionNo}</span>
                  <span className="text-slate-600 block mt-0.5">Campaign Reference: <strong>{currentSrn.campaignNo}</strong></span>
                  <span className="text-slate-600 block">Batch / Lot: <strong>{currentSrn.batchNo}</strong></span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Requisition State Machine</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                    currentSrn.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    currentSrn.status === 'STOP' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {currentSrn.status}
                  </span>
                  <span className="text-slate-600 block mt-1">Requested by: <strong>{currentSrn.requestedBy}</strong></span>
                  <span className="text-slate-600 block">Approved by: <strong>{currentSrn.approvedBy || 'Pending'}</strong></span>
                </div>
              </div>

              {/* Linked UIDs Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Allocated Raw Material Lots (One-to-Many UID Mapping)</h3>
                <table className="w-full text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 border-r border-slate-200">Material UID Barcode</th>
                      <th className="p-2 border-r border-slate-200">Assigned Production Target</th>
                      <th className="p-2 border-r border-slate-200 text-right">Physical Weight (Kg)</th>
                      <th className="p-2 border-r border-slate-200 text-right">Contained Ta₂O₅ (Kg)</th>
                      <th className="p-2 text-right">Contained Nb₂O₅ (Kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSrn.rmLotUids.map((uid, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-2 border-r border-slate-200 font-mono font-bold text-blue-600">{uid}</td>
                        <td className="p-2 border-r border-slate-200">{currentSrn.targetProduct}</td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono">{(currentSrn.totalWeightKg / currentSrn.rmLotUids.length).toFixed(1)} kg</td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-blue-700">{(currentSrn.totalTaKg / currentSrn.rmLotUids.length).toFixed(1)} kg</td>
                        <td className="p-2 text-right font-mono font-bold text-indigo-700">{(currentSrn.totalNbKg / currentSrn.rmLotUids.length).toFixed(1)} kg</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 border-r border-slate-200" colSpan={2}>Total Campaign Requisition Issue:</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">{currentSrn.totalWeightKg} kg</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono text-blue-700">{currentSrn.totalTaKg} kg</td>
                      <td className="p-2 text-right font-mono text-indigo-700">{currentSrn.totalNbKg} kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200">
                <div className="p-3 border border-slate-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Production Requisitioner Signature</span>
                  <div className="h-10 border-b border-dashed border-slate-400 my-2 flex items-center justify-center font-serif italic text-slate-800">
                    {currentSrn.requestedBy}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Date: {currentSrn.requestDate}</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Stores Issuance Authorization</span>
                  <div className="h-10 border-b border-dashed border-slate-400 my-2 flex items-center justify-center font-serif italic text-emerald-700 font-bold">
                    {currentSrn.approvedBy || 'Pending Signature'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Digital Token: SRN-AUTH-2026</span>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: MATERIAL TRANSFER NOTE (RM & FG) */}
          {activeType === 'TRANSFER_RM' && currentTransfer && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Transfer Note Ref</span>
                  <span className="font-mono font-bold text-sm text-indigo-700 block">{currentTransfer.transferNo}</span>
                  <span className="text-slate-600 block mt-0.5">Transfer Direction: <strong className="text-slate-900">{currentTransfer.transferType === 'Store_to_Plant' ? 'Store → Production Plant (RM)' : 'Production Plant → Store (FG)'}</strong></span>
                  <span className="text-slate-600 block">Date of Movement: {currentTransfer.date}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Lot & Batch Identification</span>
                  <span className="font-mono text-slate-800 font-bold block">{currentTransfer.uidOrBatchNo}</span>
                  <span className="text-slate-600 block">Campaign: {currentTransfer.campaignNo || 'N/A'}</span>
                  <span className="text-slate-600 block">Status: <strong className="text-emerald-700">{currentTransfer.status}</strong></span>
                </div>
              </div>

              {/* Three Parallel Metrics Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Three Parallel Metrics Movement Verification</h3>
                <table className="w-full text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 border-r border-slate-200">Item Description</th>
                      <th className="p-2 border-r border-slate-200 text-right">Net Physical Weight (Kg)</th>
                      <th className="p-2 border-r border-slate-200 text-right">Contained Tantalum Oxide (Ta)</th>
                      <th className="p-2 text-right">Contained Niobium Oxide (Nb)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 font-mono">
                      <td className="p-2 border-r border-slate-200 font-sans font-semibold text-slate-900">{currentTransfer.productType || 'Raw Material Charge'}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold">{currentTransfer.weightKg.toLocaleString()} kg</td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-700">{currentTransfer.oxideAKg} kg</td>
                      <td className="p-2 text-right font-bold text-indigo-700">{currentTransfer.oxideBKg} kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Dual Digital Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Issued By (Dispatching Dept)</span>
                  <strong className="text-slate-900 text-sm block mt-1">{currentTransfer.issuedByName}</strong>
                  <div className="mt-3 p-2 bg-white rounded border border-slate-200 font-mono text-[10px] text-blue-700">
                    {currentTransfer.issuedBySignature}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Digital e-sign timestamp verified</span>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Received & Accepted By (Receiving Dept)</span>
                  <strong className="text-slate-900 text-sm block mt-1">{currentTransfer.receivedByName}</strong>
                  <div className="mt-3 p-2 bg-white rounded border border-slate-200 font-mono text-[10px] text-emerald-700">
                    {currentTransfer.receivedBySignature}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Digital custody handover verified</span>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 4: SALES CONTRACT & DISPATCH NOTE */}
          {activeType === 'SALES_DISPATCH' && currentSales && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Contract Ref Number</span>
                  <span className="font-mono font-bold text-base text-blue-700 block">{currentSales.contractNo}</span>
                  <span className="text-slate-600 block mt-0.5">Date: {currentSales.date}</span>
                  <span className="text-slate-600 block">Total Quantity: <strong>{currentSales.quantityKg.toLocaleString()} kg ({currentSales.drumCount || 8} Drums)</strong></span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Buyer & Consignee</span>
                  <strong className="text-slate-900 block">{currentSales.buyer.name}</strong>
                  <span className="text-slate-600 block">{currentSales.buyer.address}</span>
                  <span className="text-slate-600 block font-semibold">{currentSales.buyer.country}</span>
                </div>
              </div>

              {/* Product Specifications & Allocated Batches */}
              <div className="p-4 border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Contracted Finished Product Specs</h3>
                <p className="text-slate-800 font-semibold text-xs">{currentSales.material}</p>
                <p className="text-slate-600 text-[11px] mt-1">{currentSales.qualitySpecs}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Reserved / Allocated Batch Numbers:</span>
                  <div className="flex space-x-2 font-mono">
                    {currentSales.allocatedBatches.map(b => (
                      <span key={b} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & Commercial Terms */}
              <div className="p-4 border-2 border-slate-900 rounded-xl bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Commercial Payment Terms</span>
                  <p className="text-slate-900 font-semibold text-xs">{currentSales.paymentTerms}</p>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Price: ${currentSales.priceUsdPerKg}/kg CIF New York Port</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Contract Value</span>
                  <span className="font-mono text-xl font-black text-blue-900">${currentSales.totalValueUsd.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Authorized Signatory */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Dispatch / Warehouse Custody</span>
                  <p className="text-[11px] text-slate-600 mt-1">Deducted from FG inventory ledger upon exit customs clearance.</p>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-center justify-center font-serif italic text-blue-800 font-bold text-sm">
                    {currentSales.authorizedSignatory}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block uppercase">For Metallurgical Products (India) Pvt. Ltd.</span>
                  <span className="text-[10px] text-slate-400 font-mono">Authorized Corporate Signatory</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
