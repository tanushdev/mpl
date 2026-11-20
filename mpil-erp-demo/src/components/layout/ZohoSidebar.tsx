import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Boxes, 
  Flame, 
  PackageCheck, 
  FlaskConical, 
  Briefcase, 
  ShieldCheck, 
  GitFork, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2,
  Workflow,
  Layers,
  FileCheck2,
  ClipboardList,
  Printer,
  Wrench,
  FlaskRound,
  UserCheck,
  FileText,
  DollarSign,
  Leaf,
  Truck,
  HardHat,
  Calculator,
  Cog,
  FileSpreadsheet,
  CalendarDays,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../../types/erp';
import { MOCK_USERS } from '../../data/mockData';

interface ZohoSidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingApprovalsCount: number;
  onOpenPrintModal?: () => void;
  onLogout?: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon?: any;
  badge?: number | string;
  badgeColor?: string;
  action?: () => void;
  isDetailPreview?: boolean;
  specDetails?: {
    category: string;
    description: string;
    plannedFeatures: string[];
  };
}

interface ParentMenuItem {
  id: string;
  label: string;
  icon: any;
  directModuleId?: string;
  action?: () => void;
  subItems?: SubMenuItem[];
  badge?: number | string;
  badgeColor?: string;
}

export const ZohoSidebar: React.FC<ZohoSidebarProps> = ({
  currentModule,
  onSelectModule,
  currentUser,
  onSelectUser,
  collapsed,
  onToggleCollapse,
  pendingApprovalsCount,
  onOpenPrintModal,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Selected department specification item to preview in modal
  const [selectedSpecItem, setSelectedSpecItem] = useState<{
    name: string;
    category: string;
    description: string;
    plannedFeatures: string[];
  } | null>(null);

  // ACCORDION STATE: ALL MENUS CLOSED BY DEFAULT
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Flyout state when sidebar is collapsed
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CLEAN, NON-DUPLICATED MENU ARCHITECTURE
  const menuStructure: ParentMenuItem[] = [
    // 1. Dashboard (Direct page - no duplicate sub-item)
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      directModuleId: 'dashboard',
    },
    // 2. Process Flow Map (Direct page - no duplicate sub-item)
    {
      id: 'flow',
      label: 'Process Flow',
      icon: GitFork,
      directModuleId: 'flow',
    },
    // 3. Purchasing (Sub-menu with distinct child pages)
    {
      id: 'purchasing_group',
      label: 'Purchasing',
      icon: ShoppingCart,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
      subItems: [
        { 
          id: 'purchase', 
          label: 'Purchase Orders', 
          icon: ShoppingCart,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { id: 'suppliers', label: 'Suppliers Directory', icon: Building2 },
      ],
    },
    // 4. Inventory & Stores (Sub-menu with distinct child pages)
    {
      id: 'stores_group',
      label: 'Stores & Stock',
      icon: Boxes,
      subItems: [
        { id: 'stores', label: 'Raw Materials', icon: Boxes },
        { id: 'requisitions', label: 'Material Requests', icon: ClipboardList },
        { id: 'transferNotes', label: 'Stock Transfers', icon: FileCheck2 },
        { id: 'finishedGoods', label: 'Finished Goods', icon: PackageCheck },
      ],
    },
    // 5. Production (Sub-menu with distinct child pages)
    {
      id: 'production_group',
      label: 'Production',
      icon: Flame,
      subItems: [
        { id: 'production', label: 'Batches & Jobs', icon: Flame },
        { id: 'losses', label: 'Yields & Losses', icon: FlaskConical },
      ],
    },
    // 6. Quality & Lab (Direct page - distinct from stores)
    {
      id: 'samples',
      label: 'Quality & Lab',
      icon: Layers,
      directModuleId: 'samples',
    },
    // 7. Sales (Sub-menu with distinct child pages)
    {
      id: 'sales_group',
      label: 'Sales',
      icon: Briefcase,
      subItems: [
        { id: 'sales', label: 'Sales Orders', icon: Briefcase },
        { id: 'customers', label: 'Customers Directory', icon: Users },
      ],
    },
    // 8. Print Engine (Direct action - no duplicate sub-item)
    {
      id: 'print_engine',
      label: 'Print Engine',
      icon: Printer,
      action: onOpenPrintModal,
    },
    // 9. Admin Panel (Sub-menu for team, roles, and plant projects)
    {
      id: 'admin_group',
      label: 'Admin Panel',
      icon: ShieldCheck,
      subItems: [
        { id: 'employees', label: 'Employees & Staff', icon: Users },
        { id: 'projects', label: 'Projects & Units', icon: Briefcase },
        { id: 'roles', label: 'Roles & Access', icon: ShieldCheck },
        { id: 'workflows', label: 'Approval Rules', icon: Workflow },
      ],
    },
    // 10. Plant Maintenance
    {
      id: 'maint_group',
      label: 'Plant Maintenance',
      icon: Wrench,
      subItems: [
        { 
          id: 'maint_prev', 
          label: 'Schedules & Checkups', 
          icon: Cog,
          isDetailPreview: true,
          specDetails: {
            category: 'Mechanical & Electrical Maintenance',
            description: 'Automated equipment uptime tracking, calibration intervals, and scheduled maintenance work orders for MIDC Taloja plant.',
            plannedFeatures: ['Furnace & smelter heating coil cycles', 'Hydraulic press overhaul timers', 'Autoclave pressure vessel certification', 'Vibration & thermal sensor logs']
          }
        },
        { 
          id: 'maint_breakdown', 
          label: 'Repairs & Work Orders', 
          icon: Wrench,
          isDetailPreview: true,
          specDetails: {
            category: 'Plant Operations Maintenance',
            description: 'Immediate ticket creation for plant machinery stoppages, root cause failure analysis (RCFA), and turnaround tracking.',
            plannedFeatures: ['Emergency downtime alerts', 'Maintenance technician dispatch', 'MTBF and MTTR metrics', 'Post-repair sign-off']
          }
        },
        { 
          id: 'maint_spares', 
          label: 'Spare Parts & Tools', 
          icon: Boxes,
          isDetailPreview: true,
          specDetails: {
            category: 'Plant Maintenance Inventory',
            description: 'Inventory management for critical replacement parts, graphite crucibles, refractory bricks, and hydraulic oils.',
            plannedFeatures: ['Minimum safety stock thresholds', 'Auto-purchase requisition triggers', 'Bin location mapping', 'Vendor service contracts']
          }
        },
      ],
    },
    // 11. Research & Development
    {
      id: 'rnd_group',
      label: 'Research & Development',
      icon: FlaskRound,
      subItems: [
        { 
          id: 'rnd_solvent', 
          label: 'Pilot Experiments', 
          icon: FlaskRound,
          isDetailPreview: true,
          specDetails: {
            category: 'Chemical Metallurgy Research',
            description: 'Experimental extraction logs investigating organic solvent partitioning coefficients for Tantalum and Niobium.',
            plannedFeatures: ['MIBK vs Octanol separation efficiency', 'Continuous mixer-settler stage profiling', 'Impurity stripping isotherms', 'Acid concentration benchmarks']
          }
        },
        { 
          id: 'rnd_doping', 
          label: 'New Product Formulas', 
          icon: FlaskConical,
          isDetailPreview: true,
          specDetails: {
            category: 'High-Purity Product R&D',
            description: 'Pilot testing for electronic-grade Ta2O5 with ppm-level dopants to achieve specific capacitance ratings.',
            plannedFeatures: ['Silicon & phosphorus micro-doping', 'Sintering shrinkage analysis', 'Trace GDMS validation', 'Dielectric constant benchmarking']
          }
        },
        { 
          id: 'rnd_slag', 
          label: 'Recycling & Recovery', 
          icon: Layers,
          isDetailPreview: true,
          specDetails: {
            category: 'Circular Economy & Secondary Metallurgy',
            description: 'Hydrometallurgical recovery methods for recovering trace Tantalum from secondary smelting slag and filter cake.',
            plannedFeatures: ['HF/H2SO4 leaching curves', 'Solid residue digestion yields', 'Filtrate recovery rate', 'Secondary cake precipitation']
          }
        },
      ],
    },
    // 12. Accounts & Costs
    {
      id: 'accounts_group',
      label: 'Accounts & Costs',
      icon: Calculator,
      subItems: [
        { 
          id: 'fin_costing', 
          label: 'Cost Per Kg', 
          icon: DollarSign,
          isDetailPreview: true,
          specDetails: {
            category: 'Plant Cost Accounting',
            description: 'Real-time calculation of cost-of-goods-sold per kg of Product 1, Product 2, and Product 3 including energy and reagent overheads.',
            plannedFeatures: ['Acid & electricity consumption allocation', 'Activity-based campaign costing', 'Labor apportionment per batch', 'Margin analysis vs LME/Argus spot rates']
          }
        },
        { 
          id: 'fin_duty', 
          label: 'Customs & Port Fees', 
          icon: FileSpreadsheet,
          isDetailPreview: true,
          specDetails: {
            category: 'Import Financials',
            description: 'Customs tariff classification, BCD, IGST, port handling, and demurrage cost capture for raw ore shipments.',
            plannedFeatures: ['Bill of Entry reconciliation', 'Customs duty payment vouchers', 'CHA handling fees ledger', 'Landed cost per dry kg calculation']
          }
        },
        { 
          id: 'fin_recon', 
          label: 'Supplier Invoices', 
          icon: Calculator,
          isDetailPreview: true,
          specDetails: {
            category: 'Commercial Accounts',
            description: 'Settlement ledger for the 60% provisional payment vs 40% final balance post plant moisture and assay deduction.',
            plannedFeatures: ['Credit/debit note generation', 'Exchange rate variance capture', 'Foreign supplier ledger sync', 'Bank LC settlement logs']
          }
        },
      ],
    },
    // 13. Safety & Environment
    {
      id: 'safety_group',
      label: 'Safety & Environment',
      icon: Leaf,
      subItems: [
        { 
          id: 'ehs_mpcb', 
          label: 'Pollution Control', 
          icon: Leaf,
          isDetailPreview: true,
          specDetails: {
            category: 'Environmental Compliance',
            description: 'Regulatory records submitted to Maharashtra Pollution Control Board for treated effluent and fluoride neutrality.',
            plannedFeatures: ['ETP pH, TDS, COD, BOD continuous readings', 'Fluoride precipitation verification', 'Treated water recycling %', 'Statutory consent renewal tracker']
          }
        },
        { 
          id: 'ehs_hazwaste', 
          label: 'Waste Tracking', 
          icon: ShieldAlert,
          isDetailPreview: true,
          specDetails: {
            category: 'Waste Management',
            description: 'State Form 10 manifests for dispatch of solid waste cakes to authorized hazardous treatment facilities (CHWTSDF Taloja).',
            plannedFeatures: ['Manifest Form 10 tracking', 'Transporter authorization verification', 'Weighbridge exit slip linking', 'Annual returns Form 4 automation']
          }
        },
        { 
          id: 'ehs_safety', 
          label: 'Safety Inspections', 
          icon: HardHat,
          isDetailPreview: true,
          specDetails: {
            category: 'Plant Safety',
            description: 'Safety inspection logs for acid handling zones, breathing apparatus inspection, and zero-accident day counters.',
            plannedFeatures: ['Near-miss logging', 'Acid spill drill records', 'Fume scrubber efficiency checks', 'Operator medical health checkups']
          }
        },
      ],
    },
    // 14. Staff & HR
    {
      id: 'hr_group',
      label: 'Staff & HR',
      icon: UserCheck,
      subItems: [
        { 
          id: 'hr_shifts', 
          label: 'Work Shifts', 
          icon: CalendarDays,
          isDetailPreview: true,
          specDetails: {
            category: 'Plant Workforce Management',
            description: 'Continuous 24/7 manufacturing shift planning for furnace operators, chemical technicians, and stores crew.',
            plannedFeatures: ['Shift rotation engine (General, Morning, Night)', 'Overtime pre-authorization', 'Handover logbook links', 'Reliever assignment alerts']
          }
        },
        { 
          id: 'hr_gate', 
          label: 'Gate & Attendance', 
          icon: UserCheck,
          isDetailPreview: true,
          specDetails: {
            category: 'Plant Security & Gate Office',
            description: 'Integration with plant biometric turnstiles, visitor contractor logging, and returnable material gate passes.',
            plannedFeatures: ['Real-time on-site headcount display', 'Contractor labor muster roll', 'Material gate pass generation', 'Truck driver entry/exit logs']
          }
        },
      ],
    },
    // 15. Shipping & Logistics
    {
      id: 'logistics_group',
      label: 'Shipping & Logistics',
      icon: Truck,
      subItems: [
        { 
          id: 'log_cfs', 
          label: 'Container Packing', 
          icon: Truck,
          isDetailPreview: true,
          specDetails: {
            category: 'Export Logistics',
            description: 'Real-time tracking of 200L metal drum stuffing into 20ft ocean containers at JNPT / Nhava Sheva CFS.',
            plannedFeatures: ['Container stuffing tally sheets', 'Customs seal verification numbers', 'Dangerous goods (DG) IMO declarations', 'Port gate-in cut-off timers']
          }
        },
        { 
          id: 'log_shipping_bill', 
          label: 'Shipping Documents', 
          icon: FileSpreadsheet,
          isDetailPreview: true,
          specDetails: {
            category: 'Export Compliance Documents',
            description: 'Digital storage and tracking of ICEGATE Shipping Bills, On-board Bills of Lading, and Export Value Declarations.',
            plannedFeatures: ['ICEGATE status polling', 'FEMA e-BRC tracking', 'Certificate of Origin generation', 'Consular invoice stamping']
          }
        },
      ],
    },
  ];

  // Toggle Sub-menu explicitly on user click
  const toggleSubMenu = (parentId: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleMouseEnterParent = (parentId: string) => {
    if (collapsed) {
      if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
      setActiveFlyout(parentId);
    }
  };

  const handleMouseLeaveParent = () => {
    if (collapsed) {
      flyoutTimerRef.current = setTimeout(() => {
        setActiveFlyout(null);
      }, 200);
    }
  };

  return (
    <>
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-30 select-none ${
          collapsed ? 'w-18' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img 
              src="/mpil-logo.png" 
              alt="MPIL - Metallurgical Products (India) Pvt. Ltd." 
              className={`object-contain transition-all duration-300 ${collapsed ? 'h-7 w-8' : 'h-8 max-w-[125px]'}`} 
            />
            {!collapsed && (
              <div className="min-w-0 border-l border-slate-200 pl-2">
                <span className="text-xs font-bold tracking-tight text-slate-900 block truncate">
                  Plant Suite
                </span>
                <span className="text-[10px] text-slate-400 font-medium block truncate">
                  MIDC Taloja Works
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Section Notice (Compact) */}
        {!collapsed && (
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Plant Navigation</span>
            <span className="font-semibold text-slate-400">Click to open</span>
          </div>
        )}

        {/* Navigation Accordion with Sub-Menus (ALL CLOSED BY DEFAULT, NO DUPLICATE ITEMS) */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
          {menuStructure.map((parent) => {
            const ParentIcon = parent.icon;
            const hasSubMenu = !!(parent.subItems && parent.subItems.length > 0);
            const isExpanded = !!openMenus[parent.id];
            const isChildActive = parent.subItems?.some(s => s.id === currentModule && !s.isDetailPreview);
            const isDirectActive = parent.directModuleId === currentModule || parent.id === currentModule;
            const isActive = isChildActive || isDirectActive;

            return (
              <div 
                key={parent.id} 
                className="relative"
                onMouseEnter={() => handleMouseEnterParent(parent.id)}
                onMouseLeave={handleMouseLeaveParent}
              >
                {/* Parent Menu Item */}
                <button
                  onClick={() => {
                    if (collapsed) {
                      if (hasSubMenu) {
                        onToggleCollapse();
                      } else if (parent.action) {
                        parent.action();
                      } else if (parent.directModuleId) {
                        onSelectModule(parent.directModuleId);
                      }
                    } else if (hasSubMenu) {
                      toggleSubMenu(parent.id);
                    } else if (parent.action) {
                      parent.action();
                    } else if (parent.directModuleId) {
                      onSelectModule(parent.directModuleId);
                    }
                  }}
                  title={collapsed ? parent.label : undefined}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-900 font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <ParentIcon 
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-500'
                    }`} 
                  />

                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{parent.label}</span>

                      {/* Parent Badge */}
                      {parent.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${parent.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                          {parent.badge}
                        </span>
                      )}

                      {/* Expand/Collapse Chevron Indicator ONLY for menus with actual sub-items */}
                      {hasSubMenu && (
                        <ChevronDown 
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-blue-600' : ''
                          }`} 
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Sub-Menu Items (Smooth Accordion Dropdown) */}
                {!collapsed && hasSubMenu && (
                  <div 
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      isExpanded ? 'max-h-96 opacity-100 mt-0.5' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-4 pl-2.5 border-l-2 border-slate-100 space-y-0.5 py-1">
                      {parent.subItems?.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentModule === sub.id && !sub.isDetailPreview;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (sub.isDetailPreview && sub.specDetails) {
                                setSelectedSpecItem({
                                  name: sub.label,
                                  category: sub.specDetails.category,
                                  description: sub.specDetails.description,
                                  plannedFeatures: sub.specDetails.plannedFeatures
                                });
                              } else if (sub.action) {
                                sub.action();
                              } else {
                                onSelectModule(sub.id);
                              }
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              isSubActive
                                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {SubIcon && (
                              <SubIcon 
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                  isSubActive ? 'text-white' : 'text-slate-400'
                                }`} 
                              />
                            )}
                            <span className="truncate flex-1 text-left">{sub.label}</span>

                            {sub.badge && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                isSubActive ? 'bg-white text-blue-700' : (sub.badgeColor || 'bg-amber-100 text-amber-800')
                              }`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Flyout Sub-Menu when Sidebar is Collapsed */}
                {collapsed && activeFlyout === parent.id && hasSubMenu && (
                  <div 
                    className="absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 px-1 z-50 animate-in fade-in zoom-in-95"
                    onMouseEnter={() => {
                      if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
                      setActiveFlyout(parent.id);
                    }}
                    onMouseLeave={handleMouseLeaveParent}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{parent.label}</span>
                    </div>
                    <div className="space-y-0.5">
                      {parent.subItems?.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentModule === sub.id && !sub.isDetailPreview;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActiveFlyout(null);
                              if (sub.isDetailPreview && sub.specDetails) {
                                setSelectedSpecItem({
                                  name: sub.label,
                                  category: sub.specDetails.category,
                                  description: sub.specDetails.description,
                                  plannedFeatures: sub.specDetails.plannedFeatures
                                });
                              } else if (sub.action) {
                                sub.action();
                              } else {
                                onSelectModule(sub.id);
                              }
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              isSubActive
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {SubIcon && (
                              <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                            )}
                            <span className="truncate flex-1 text-left">{sub.label}</span>
                            {sub.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom User Role Switcher */}
        <div className="p-2.5 border-t border-slate-100 relative bg-slate-50/50">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`w-full flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-200 ${
              collapsed ? 'justify-center p-1' : ''
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <span className="text-xs font-semibold text-slate-900 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-blue-600 font-bold block truncate">
                  {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin / Management' :
                   currentUser.role === 'PRODUCTION_USER' ? 'Production User' :
                   currentUser.role === 'QC_USER' ? 'Quality Control (QC) User' :
                   currentUser.role === 'STORE_USER' ? 'Store & Maintenance User' :
                   currentUser.role}
                </span>
              </div>
            )}
            {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
          </button>

          {/* User Role Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute bottom-16 left-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1.5">
                <span className="text-xs font-bold text-slate-900 block">Switch Active User</span>
                <span className="text-[10px] text-slate-500 block">Test role-specific access permissions</span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {MOCK_USERS.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-start space-x-2.5 p-2 rounded-lg text-left transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate text-slate-900">{u.name}</p>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-blue-700 font-semibold truncate">
                          {u.role === 'SUPER_ADMIN' ? 'Super Admin / Management' :
                           u.role === 'PRODUCTION_USER' ? 'Production User' :
                           u.role === 'QC_USER' ? 'Quality Control (QC) User' :
                           u.role === 'STORE_USER' ? 'Store & Maintenance User' :
                           u.designation}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{u.department}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {onLogout && (
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out to Login Page</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* DEPARTMENT SPECIFICATION INFORMATIONAL MODAL */}
      {selectedSpecItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedSpecItem.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-500">{selectedSpecItem.category}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                MPIL Works
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {selectedSpecItem.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Standard Plant Procedures:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedSpecItem.plannedFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedSpecItem(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
