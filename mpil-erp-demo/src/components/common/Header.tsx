import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserProfile, RoleType } from '../../types/erp';
import { MOCK_USERS } from '../../data/mockData';

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
  onOpenApprovals
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'purchase', label: 'Procurement (PO)' },
    { id: 'stores', label: 'Stores & RM Assay' },
    { id: 'production', label: 'Production & Losses' },
    { id: 'finishedGoods', label: 'Finished Goods & Lab' },
    { id: 'sales', label: 'Sales Contracts' },
    { id: 'admin', label: 'Admin & Workflows' },
  ];

  return (
    <header className="sticky top-0 z-50 apple-glass">
      {/* Top Corporate Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-black/[0.04]">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">
                METALLURGICAL PRODUCTS (INDIA) PVT. LTD.
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                MPIL ERP v2.6
              </span>
            </div>
            <p className="text-[11px] text-[#86868B]">
              MIDC Taloja, Maharashtra • GSTIN: 27AACCM7042D1ZQ • IEC: 0302007636
            </p>
          </div>
        </div>

        {/* User Role Switcher & Approvals Trigger */}
        <div className="flex items-center space-x-3">
          {/* Quick Approvals Pill */}
          <button 
            onClick={onOpenApprovals}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              pendingApprovalsCount > 0 
                ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs hover:bg-amber-100' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Pending Approvals</span>
            <span className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              pendingApprovalsCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {pendingApprovalsCount}
            </span>
          </button>

          {/* Role Switcher Pill (Apple Style) */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.07] border border-black/[0.06] transition-all"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover ring-1 ring-black/10"
              />
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-xs font-semibold text-[#1D1D1F] block">{currentUser.name}</span>
                <span className="text-[10px] text-[#6E6E73] block">{currentUser.designation}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E6E73]" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-black/[0.08] p-2 z-50">
                <div className="px-3 py-2 border-b border-black/[0.05] mb-1">
                  <p className="text-xs font-medium text-[#86868B]">Simulate Active User (Demo Switcher)</p>
                  <p className="text-[11px] text-[#1D1D1F] mt-0.5">Switch role to test live approval gates & permissions</p>
                </div>
                <div className="space-y-1">
                  {MOCK_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                          isSelected 
                            ? 'bg-blue-50 text-blue-900 border border-blue-200/60' 
                            : 'hover:bg-black/[0.03] text-[#1D1D1F]'
                        }`}
                      >
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-black/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{user.name}</p>
                          <p className="text-[10px] text-[#6E6E73] truncate">{user.designation} • {user.department}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Apple-style Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1D1D1F] text-white shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
