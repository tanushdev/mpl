import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  X,
  CreditCard
} from 'lucide-react';
import { Customer, UserProfile } from '../../types/erp';

interface CustomersViewProps {
  currentUser: UserProfile;
  customers: Customer[];
  onAddCustomer: (cust: Customer) => void;
  searchFilter: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  currentUser,
  customers,
  onAddCustomer,
  searchFilter
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const [form, setForm] = useState({
    name: 'Kyocera Advanced Ceramics Co.',
    contactPerson: 'Hiroshi Sato',
    email: 'h.sato@kyocera.co.jp',
    phone: '+81 75 604 3500',
    address: '6 Takeda Tobadono-cho, Fushimi-ku, Kyoto 612-8501',
    country: 'Japan',
    creditLimitUsd: 1800000,
  });

  const query = (localSearch || searchFilter).toLowerCase();
  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.code.toLowerCase().includes(query) ||
    c.country.toLowerCase().includes(query) ||
    c.contactPerson.toLowerCase().includes(query)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      code: `CUST-${form.country.slice(0, 3).toUpperCase()}-0${customers.length + 1}`,
      name: form.name,
      contactPerson: form.contactPerson,
      email: form.email,
      phone: form.phone,
      address: form.address,
      country: form.country,
      totalOrdersUsd: 0,
      creditLimitUsd: form.creditLimitUsd,
      status: 'Active',
    };
    onAddCustomer(newCust);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Customer Master & Accounts</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filtered.length} Customers
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Global and domestic buyers for high-purity Tantalum Pentoxide and Niobium oxides.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter customers..."
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
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* Clean Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Customer Code</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Destination Country</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4 text-right">Lifetime Contracts (USD)</th>
                <th className="py-3 px-4 text-right">Credit Facility (USD)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cust) => (
                <tr 
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{cust.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{cust.name}</td>
                  <td className="py-3 px-4 text-slate-600">{cust.country}</td>
                  <td className="py-3 px-4 text-slate-700">{cust.contactPerson}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ${cust.totalOrdersUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    ${cust.creditLimitUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(cust);
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

      {/* Slide-over Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedCustomer.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedCustomer.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedCustomer.country} • Key Account</p>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Total Active Contracts</span>
                  <strong className="text-base font-bold text-slate-900 font-mono">
                    ${selectedCustomer.totalOrdersUsd.toLocaleString()} USD
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Credit Facility Approved</span>
                  <strong className="text-base font-bold text-emerald-700 font-mono">
                    ${selectedCustomer.creditLimitUsd.toLocaleString()} USD
                  </strong>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Billing / Shipping Address:</span>
                    <span className="font-medium text-slate-900">{selectedCustomer.address}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Procurement Email:</span>
                    <span className="font-medium text-slate-900">{selectedCustomer.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phone:</span>
                    <span className="font-medium text-slate-900">{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Customer Master</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Customer / Company Name</label>
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Credit Limit ($ USD)</label>
                  <input
                    type="number"
                    value={form.creditLimitUsd}
                    onChange={(e) => setForm({ ...form, creditLimitUsd: Number(e.target.value) })}
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Registered Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
