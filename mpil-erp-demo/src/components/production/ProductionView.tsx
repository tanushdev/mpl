import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  CheckCircle2, 
  XCircle,
  FileCheck2, 
  Search,
  X,
  Layers,
  FlaskConical,
  Boxes,
  AlertTriangle,
  StopCircle
} from 'lucide-react';
import { 
  ProductionCampaign, 
  IssueTransferNoteRM, 
  RawMaterialUID, 
  UserProfile 
} from '../../types/erp';

interface ProductionViewProps {
  currentUser: UserProfile;
  campaigns: ProductionCampaign[];
  transferNotes: IssueTransferNoteRM[];
  rawMaterials: RawMaterialUID[];
  onIssueMaterial: (note: IssueTransferNoteRM) => void;
  onUpdateLotLosses: (campaignNo: string, lotNo: string, updateData: any) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  currentUser,
  campaigns,
  transferNotes,
  rawMaterials,
  onIssueMaterial,
  onUpdateLotLosses
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<ProductionCampaign>(campaigns[0] || null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);

  // New Campaign Form with Multiple UIDs
  const availableUids = rawMaterials.filter(r => r.qcStatus === 'Accepted');
  const [campaignTitle, setCampaignTitle] = useState('High Purity Separation Campaign 09');
  const [selectedUidsForCampaign, setSelectedUidsForCampaign] = useState<string[]>(['UID-2026-RM-8492']);

  // Issue Transfer Note state
  const [selectedUidToIssue, setSelectedUidToIssue] = useState<string>(availableUids[0]?.uid || '');
  const [issueWeight, setIssueWeight] = useState<number>(500);

  const activeLot = selectedCampaign?.lots[0];

  const [lossForm, setLossForm] = useState({
    solidWt: activeLot?.lossSolid.netWeightKg || 8.5,
    solidTa: activeLot?.lossSolid.oxideAKg || 8.5,
    solidNb: activeLot?.lossSolid.oxideBKg || 8.5,
    liqVol: activeLot?.lossLiquid.volumeKL || 3.2,
    liqTa: activeLot?.lossLiquid.oxideAKg || 4.2,
    liqNb: activeLot?.lossLiquid.oxideBKg || 3.8,
    unidentTa: activeLot?.lossUnidentified.oxideAKg || 1.8,
    unidentNb: activeLot?.lossUnidentified.oxideBKg || 0.3,
  });

  const handleSaveLosses = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCampaign && selectedCampaign.lots[0]) {
      selectedCampaign.lots[0].lossSolid.netWeightKg = lossForm.solidWt;
      selectedCampaign.lots[0].lossSolid.oxideAKg = lossForm.solidTa;
      selectedCampaign.lots[0].lossSolid.oxideBKg = lossForm.solidNb;
      selectedCampaign.lots[0].lossLiquid.volumeKL = lossForm.liqVol;
      selectedCampaign.lots[0].lossLiquid.oxideAKg = lossForm.liqTa;
      selectedCampaign.lots[0].lossLiquid.oxideBKg = lossForm.liqNb;
      selectedCampaign.lots[0].lossUnidentified.oxideAKg = lossForm.unidentTa;
      selectedCampaign.lots[0].lossUnidentified.oxideBKg = lossForm.unidentNb;
      setSelectedCampaign({ ...selectedCampaign });
      onUpdateLotLosses(selectedCampaign.campaignNo, selectedCampaign.lots[0].lotNo, lossForm);
      setShowLossModal(false);
    }
  };

  const handleToggleUidSelection = (uid: string) => {
    if (selectedUidsForCampaign.includes(uid)) {
      setSelectedUidsForCampaign(selectedUidsForCampaign.filter(u => u !== uid));
    } else {
      setSelectedUidsForCampaign([...selectedUidsForCampaign, uid]);
    }
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampNo = `CAMP-2026-0${campaigns.length + 8}`;
    const chosenUids = rawMaterials.filter(r => selectedUidsForCampaign.includes(r.uid));
    const totalInputWt = chosenUids.reduce((a, b) => a + b.netWeightKg, 0);
    const totalA = chosenUids.reduce((a, b) => a + b.containedOxideAKg, 0);
    const totalB = chosenUids.reduce((a, b) => a + b.containedOxideBKg, 0);

    const newCamp: ProductionCampaign = {
      campaignNo: newCampNo,
      title: campaignTitle,
      targetProduct: 'Product 1, Product 2, Product 3',
      status: 'Request for Issue',
      startDate: new Date().toISOString().split('T')[0],
      multipleUids: selectedUidsForCampaign,
      totalInputWeightKg: totalInputWt,
      totalInputOxideAKg: totalA,
      totalInputOxideBKg: totalB,
      lots: [
        {
          lotNo: 'LOT-01',
          batchNo: `BATCH-2026-${newCampNo}-L1`,
          uidsAllocated: selectedUidsForCampaign,
          inputOxideAKg: totalA,
          inputOxideBKg: totalB,
          outputProduct1: {
            productName: 'Product 1',
            batchNo: `B-P1-${newCampNo}`,
            netWeightKg: parseFloat((totalA * 0.91).toFixed(1)),
            containedOxideAKg: parseFloat((totalA * 0.91).toFixed(1)),
          },
          outputProduct2: {
            productName: 'Product 2',
            batchNo: `B-P2-${newCampNo}`,
            netWeightKg: parseFloat((totalA * 0.04).toFixed(1)),
            containedOxideAKg: parseFloat((totalA * 0.04).toFixed(1)),
          },
          outputProduct3: {
            productName: 'Product 3',
            batchNo: `B-P3-${newCampNo}`,
            netWeightKg: parseFloat((totalB * 0.93).toFixed(1)),
            containedOxideBKg: parseFloat((totalB * 0.93).toFixed(1)),
          },
          lossLiquid: {
            batchNo: `B-LIQ-${newCampNo}`,
            volumeKL: 3.2,
            oxideAKg: parseFloat((totalA * 0.015).toFixed(1)),
            oxideBKg: parseFloat((totalB * 0.02).toFixed(1)),
          },
          lossSolid: {
            batchNo: `B-SOL-${newCampNo}`,
            netWeightKg: 8.5,
            oxideAKg: parseFloat((totalA * 0.025).toFixed(1)),
            oxideBKg: parseFloat((totalB * 0.04).toFixed(1)),
          },
          lossUnidentified: {
            oxideAKg: parseFloat((totalA * 0.01).toFixed(1)),
            oxideBKg: parseFloat((totalB * 0.01).toFixed(1)),
          },
        },
      ],
    };

    campaigns.push(newCamp);
    setSelectedCampaign(newCamp);
    setShowNewCampaignModal(false);
  };

  const handleUpdateStatus = (newStatus: 'Approved' | 'Not Approved' | 'STOP') => {
    if (selectedCampaign) {
      selectedCampaign.status = newStatus;
      setSelectedCampaign({ ...selectedCampaign });
    }
  };

  const currentUidObj = availableUids.find(u => u.uid === selectedUidToIssue);
  const calculatedOxideA = currentUidObj ? (issueWeight * (currentUidObj.metalOxideAPercent / 100)) : 0;
  const calculatedOxideB = currentUidObj ? (issueWeight * (currentUidObj.metalOxideBPercent / 100)) : 0;

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUidObj) return;

    const newTransferNote: IssueTransferNoteRM = {
      transferNo: `IMTN-RM-${Math.floor(7740 + Math.random() * 999)}`,
      campaignNo: selectedCampaign?.campaignNo || 'CAMP-2026-08',
      lotNo: 'LOT-01',
      rawMaterialUid: currentUidObj.uid,
      materialWeightKg: issueWeight,
      containedOxideAKg: parseFloat(calculatedOxideA.toFixed(2)),
      containedOxideBKg: parseFloat(calculatedOxideB.toFixed(2)),
      issuedBy: `${currentUser.name} (Stores)`,
      receivedBy: 'Sanjay Patil (Production Head)',
      date: new Date().toISOString().split('T')[0],
      status: 'Issued',
    };

    onIssueMaterial(newTransferNote);
    setShowIssueModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              {selectedCampaign?.campaignNo}
            </span>
            <h2 className="text-base font-bold text-slate-900">{selectedCampaign?.title}</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedCampaign?.status === 'Approved' || selectedCampaign?.status === 'In Production'
                ? 'bg-emerald-50 text-emerald-700'
                : selectedCampaign?.status === 'STOP'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {selectedCampaign?.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Campaign contains <strong>{selectedCampaign?.multipleUids.length} Raw Material UIDs</strong> allocated for separation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewCampaignModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign (Multi-UID)</span>
          </button>
          <button
            onClick={() => setShowIssueModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Material Note</span>
          </button>
        </div>
      </div>

      {/* Campaign Details & Multi-UID Storage */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Allocated Raw Material UIDs in Campaign {selectedCampaign?.campaignNo}
            </h3>
            <p className="text-xs text-slate-500">
              Multiple UIDs combined into this single production campaign:
            </p>
          </div>

          {/* Workflow Approval Action Buttons (Excel exact: Approved, Not Approved, STOP) */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Approval Gate:</span>
            <button
              onClick={() => handleUpdateStatus('Approved')}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => handleUpdateStatus('Not Approved')}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300"
            >
              Not Approved
            </button>
            <button
              onClick={() => handleUpdateStatus('STOP')}
              className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md border border-rose-200"
            >
              STOP
            </button>
          </div>
        </div>

        {/* Display Multiple UIDs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {selectedCampaign?.multipleUids.map((uid) => {
            const rm = rawMaterials.find(r => r.uid === uid);
            return (
              <div key={uid} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">{uid}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                    {rm?.qcStatus || 'Accepted'}
                  </span>
                </div>
                <div className="text-slate-800 font-semibold">{rm?.materialName || 'Tantalum Ore'}</div>
                <div className="text-slate-500 text-[11px] flex justify-between">
                  <span>Weight: <strong>{rm?.netWeightKg || 500} kg</strong></span>
                  <span>Ta₂O₅: <strong>{rm?.containedOxideAKg.toFixed(1) || 200} kg</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CLASSIFIED PRODUCTS OUTPUT (Product 1, Product 2, Product 3 with distinct batches) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Classified Product Outputs (Product 1, Product 2, Product 3)
            </h3>
            <p className="text-xs text-slate-500">
              Each classified product has its own unique batch number and contained oxide assay:
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Input: {activeLot?.inputOxideAKg} kg (Ta) + {activeLot?.inputOxideBKg} kg (Nb)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product 1 */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 uppercase">Product 1 (Optical Ta₂O₅)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Class A</span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">a. Batch#:</span>
                <strong className="text-slate-900">{activeLot?.outputProduct1.batchNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">b. Net Weight:</span>
                <strong className="text-blue-700 text-sm">{activeLot?.outputProduct1.netWeightKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">c. Oxide 'A' (Ta₂O₅):</span>
                <strong className="text-blue-700">{activeLot?.outputProduct1.containedOxideAKg} kg</strong>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 uppercase">Product 2 (Technical Ta)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Class B</span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">a. Batch#:</span>
                <strong className="text-slate-900">{activeLot?.outputProduct2.batchNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">b. Net Weight:</span>
                <strong className="text-emerald-700 text-sm">{activeLot?.outputProduct2.netWeightKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">c. Oxide 'A' (Ta₂O₅):</span>
                <strong className="text-emerald-700">{activeLot?.outputProduct2.containedOxideAKg} kg</strong>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 uppercase">Product 3 (Pure Nb₂O₅)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">Class C</span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">a. Batch#:</span>
                <strong className="text-slate-900">{activeLot?.outputProduct3.batchNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">b. Net Weight:</span>
                <strong className="text-indigo-700 text-sm">{activeLot?.outputProduct3.netWeightKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">c. Oxide 'B' (Nb₂O₅):</span>
                <strong className="text-indigo-700">{activeLot?.outputProduct3.containedOxideBKg} kg</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE-DIMENSIONAL PRODUCTION LOSSES (Liquid, Solid, Unidentified) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Three-Dimensional Production Losses (Liquid, Solid & Unidentified)
            </h3>
            <p className="text-xs text-slate-500">
              Exact formula tracking liquid volume in KL, solid cake weight in kg, and unidentified variance:
            </p>
          </div>
          <button
            onClick={() => setShowLossModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
            <span>Log Production Loss</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Liquid Loss */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-blue-900 uppercase block">1. Liquid Effluent Loss (L)</span>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch#:</span>
                <strong>{activeLot?.lossLiquid.batchNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Volume (KL):</span>
                <strong className="text-blue-800 text-sm">{activeLot?.lossLiquid.volumeKL} KL</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oxide 'A' contained:</span>
                <strong className="text-blue-700">{activeLot?.lossLiquid.oxideAKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oxide 'B' contained:</span>
                <strong className="text-indigo-700">{activeLot?.lossLiquid.oxideBKg} kg</strong>
              </div>
            </div>
          </div>

          {/* Solid Loss */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-amber-900 uppercase block">2. Solid Residue Loss (S)</span>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch#:</span>
                <strong>{activeLot?.lossSolid.batchNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Weight (kg):</span>
                <strong className="text-amber-800 text-sm">{activeLot?.lossSolid.netWeightKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oxide 'A' contained:</span>
                <strong className="text-blue-700">{activeLot?.lossSolid.oxideAKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oxide 'B' contained:</span>
                <strong className="text-indigo-700">{activeLot?.lossSolid.oxideBKg} kg</strong>
              </div>
            </div>
          </div>

          {/* Unidentified Loss */}
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-2">
            <span className="font-bold text-rose-900 uppercase block">3. Unidentified Loss</span>
            <p className="text-[11px] text-rose-600">Calculated variance unaccounted for:</p>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">Oxide 'A' Loss:</span>
                <strong className="text-rose-700 text-sm">{activeLot?.lossUnidentified.oxideAKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Oxide 'B' Loss:</span>
                <strong className="text-rose-700 text-sm">{activeLot?.lossUnidentified.oxideBKg} kg</strong>
              </div>
              <div className="pt-1 text-[10px] text-slate-500">
                Automatically reconciled in mass balance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Campaign with Multiple UIDs */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Production Campaign</h3>
                <p className="text-xs text-slate-500">Assign multiple raw material UIDs into this campaign</p>
              </div>
              <button onClick={() => setShowNewCampaignModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Select Multiple UIDs to Add to Campaign:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
                  {availableUids.map((rm) => {
                    const isChecked = selectedUidsForCampaign.includes(rm.uid);
                    return (
                      <div
                        key={rm.uid}
                        onClick={() => handleToggleUidSelection(rm.uid)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isChecked 
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500' 
                            : 'border-slate-200 hover:bg-slate-50'
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
                            <span className="font-mono font-bold text-slate-900">{rm.uid}</span>
                            <span className="text-[11px] text-slate-500 block">{rm.materialName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-800">{rm.netWeightKg} kg</span>
                          <span className="text-[10px] text-blue-700 block">{rm.metalOxideAPercent}% Ta₂O₅</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs flex justify-between">
                <span>Total Selected UIDs:</span>
                <strong className="text-blue-900 font-bold">{selectedUidsForCampaign.length} UIDs Selected</strong>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedUidsForCampaign.length === 0}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg shadow-xs"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Material Note */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Issue Material Transfer Note (RM)</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Campaign</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedCampaign?.campaignNo} - ${selectedCampaign?.title}`}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select UID from Campaign</label>
                <select
                  value={selectedUidToIssue}
                  onChange={(e) => setSelectedUidToIssue(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  required
                >
                  {availableUids.map((rm) => (
                    <option key={rm.uid} value={rm.uid}>
                      {rm.uid} • {rm.materialName} ({rm.netWeightKg} kg available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Issue Quantity (kg)</label>
                <input
                  type="number"
                  value={issueWeight}
                  onChange={(e) => setIssueWeight(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs flex justify-between">
                <span>Contained Tantalum Inflow:</span>
                <strong className="text-blue-800 font-bold">{calculatedOxideA.toFixed(1)} kg</strong>
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
                  Sign & Issue Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manual Production Loss Entry (Section 2 - Req #5) */}
      {showLossModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Manual Production Loss Entry</h3>
                <p className="text-xs text-slate-500">Record Solid, Liquid (KL), and Unidentified losses for {activeLot?.batchNo}</p>
              </div>
              <button onClick={() => setShowLossModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveLosses} className="space-y-4 text-xs">
              {/* Solid Loss */}
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 block uppercase tracking-wider text-[11px]">
                  1. Solid Residue Loss (S)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block mb-0.5">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.solidWt}
                      onChange={(e) => setLossForm({ ...lossForm, solidWt: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-amber-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-800 block mb-0.5">Ta Content (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.solidTa}
                      onChange={(e) => setLossForm({ ...lossForm, solidTa: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-blue-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-indigo-800 block mb-0.5">Nb Content (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.solidNb}
                      onChange={(e) => setLossForm({ ...lossForm, solidNb: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-indigo-300 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Liquid Loss */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <span className="font-bold text-blue-950 block uppercase tracking-wider text-[11px]">
                  2. Liquid Effluent Loss (L)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block mb-0.5">Volume (KL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.liqVol}
                      onChange={(e) => setLossForm({ ...lossForm, liqVol: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-blue-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-800 block mb-0.5">Ta Content (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.liqTa}
                      onChange={(e) => setLossForm({ ...lossForm, liqTa: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-blue-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-indigo-800 block mb-0.5">Nb Content (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.liqNb}
                      onChange={(e) => setLossForm({ ...lossForm, liqNb: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-indigo-300 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Unidentified / Trace Loss */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  3. Unidentified / Trace Loss (0.1% - 0.2% testing variance)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block mb-0.5">Unidentified Ta (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.unidentTa}
                      onChange={(e) => setLossForm({ ...lossForm, unidentTa: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block mb-0.5">Unidentified Nb (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lossForm.unidentNb}
                      onChange={(e) => setLossForm({ ...lossForm, unidentNb: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLossModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs"
                >
                  Commit Loss to Mass Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
