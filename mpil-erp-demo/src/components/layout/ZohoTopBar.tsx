import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  ChevronDown, 
  ShoppingCart, 
  Boxes, 
  Flame, 
  Briefcase, 
  Layers, 
  Building2,
  Users,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../../types/erp';

interface ZohoTopBarProps {
  currentModule: string;
  currentUser: UserProfile;
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onQuickCreate: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLogout?: () => void;
}

export const ZohoTopBar: React.FC<ZohoTopBarProps> = ({
  currentModule,
  currentUser,
  pendingApprovalsCount,
  onOpenApprovals,
  onQuickCreate,
  searchQuery,
  onSearchChange,
  onLogout
}) => {
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const getModuleTitle = (mod: string) => {
    switch (mod) {
      case 'dashboard': return 'Dashboard';
      case 'flow': return 'Process Flow';
      case 'suppliers': return 'Suppliers';
      case 'purchase': return 'Purchase Orders';
      case 'stores': return 'Raw Materials';
      case 'transferNotes': return 'Material Transfers';
      case 'production': return 'Production Batches';
      case 'losses': return 'Yields & Losses';
      case 'finishedGoods': return 'Finished Goods';
      case 'samples': return 'Lab Samples';
      case 'customers': return 'Customers';
      case 'sales': return 'Sales Orders';
      case 'employees': return 'Team Members';
      case 'workflows': return 'Approval Rules';
      case 'roles': return 'Permissions';
      default: return 'Overview';
    }
  };

  const quickCreateOptions = [
    { type: 'po', label: 'New Purchase Order', icon: ShoppingCart },
    { type: 'inward', label: 'Receive Raw Material', icon: Boxes },
    { type: 'transfer', label: 'Transfer to Production', icon: Boxes },
    { type: 'campaign', label: 'Start New Batch', icon: Flame },
    { type: 'sample', label: 'Dispatch Sample', icon: Layers },
    { type: 'contract', label: 'New Sales Order', icon: Briefcase },
    { type: 'supplier', label: 'Add Supplier', icon: Building2 },
    { type: 'customer', label: 'Add Customer', icon: Users },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">
          {getModuleTitle(currentModule)}
        </h1>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-hidden text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2.5">
        {/* "+ New" Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickCreate(!showQuickCreate)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-blue-200" />
          </button>

          {showQuickCreate && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-50">
              {quickCreateOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      onQuickCreate(opt.type);
                      setShowQuickCreate(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Approvals Bell */}
        <button
          onClick={onOpenApprovals}
          className={`relative p-1.5 rounded-lg border transition-colors ${
            pendingApprovalsCount > 0
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
          title="Approvals"
        >
          <Bell className="w-4 h-4" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        {/* Active Role Pill */}
        <div className="hidden lg:flex items-center pl-2 border-l border-slate-200">
          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            {currentUser.name}
          </span>
        </div>

        {/* Log Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign Out / Lock Session"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
