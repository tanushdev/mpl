import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Star, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Supplier, UserProfile } from '../../types/erp';

interface SuppliersViewProps {
  currentUser: UserProfile;
  suppliers: Supplier[];
  onAddSupplier: (sup: Supplier) => void;
  searchFilter: string;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  currentUser,
  suppliers,
  onAddSupplier,
  searchFilter
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: 'Advanced Rare Earth Minerals S.A.',
    contactPerson: 'David Miller',
    email: 'd.miller@rareearth.ch',
    phone: '+41 22 730 5900',
    address: 'Rue du Rhone 42, Geneva, Switzerland',
    country: 'Switzerland',
    taxId: 'CHE-109.824.110',
    paymentTerms: '60% against B/L, balance against plant assay',
  });

  const query = (localSearch || searchFilter).toLowerCase();
  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(query) ||
    s.code.toLowerCase().includes(query) ||
    s.country.toLowerCase().includes(query) ||
    s.contactPerson.toLowerCase().includes(query)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      code: `SUP-${form.country.slice(0, 3).toUpperCase()}-0${suppliers.length + 1}`,
      name: form.name,
      contactPerson: form.contactPerson,
      email: form.email,
      phone: form.phone,
      address: form.address,
      country: form.country,
      taxId: form.taxId,
      rating: 4.8,
      paymentTerms: form.paymentTerms,
      status: 'Active',
    };
    onAddSupplier(newSup);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Suppliers & Raw Material Vendors</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filtered.length} Vendors
              </span>
            </div>
            <p className="text-xs text-slate-500">
              International & domestic suppliers of Tantalum/Columbite ore and metal concentrates.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter suppliers..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Supplier</span>
          </button>
        </div>
      </div>

      {/* Clean Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Vendor Code</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Origin Country</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Tax ID / Reg</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sup) => (
                <tr 
                  key={sup.id}
                  onClick={() => setSelectedSupplier(sup)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{sup.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{sup.name}</td>
                  <td className="py-3 px-4 text-slate-600">{sup.country}</td>
                  <td className="py-3 px-4 text-slate-700">{sup.contactPerson}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{sup.taxId}</td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-[200px] truncate">{sup.paymentTerms}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{sup.rating}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sup.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSupplier(sup);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded-lg"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer (Zoho Style) */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedSupplier.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedSupplier.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedSupplier.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedSupplier.country} • Qualified Tantalum Vendor</p>
              </div>

              {/* Vendor Information Grid */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Registered Address:</span>
                    <span className="font-medium text-slate-900">{selectedSupplier.address}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Official Email:</span>
                    <span className="font-medium text-slate-900">{selectedSupplier.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Direct Phone:</span>
                    <span className="font-medium text-slate-900">{selectedSupplier.phone}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Compliance */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Commercial Terms & Tax Registration
                </h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax ID / Registration:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedSupplier.taxId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Standard Payment Terms:</span>
                    <span className="font-semibold text-slate-800">{selectedSupplier.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Supply Chain Policy:</span>
                    <span className="text-emerald-700 font-semibold">Compliant (OECD Due Diligence)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Supplier */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Supplier / Vendor</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tax ID / Reg No</label>
                  <input
                    type="text"
                    value={form.taxId}
                    onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={form.paymentTerms}
                  onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
