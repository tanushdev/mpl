import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Workflow, 
  ShieldCheck, 
  DollarSign, 
  Sliders,
  FolderKanban,
  Building,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Search,
  Check,
  X,
  Lock
} from 'lucide-react';
import { UserProfile, WorkflowRule, RoleType, PlantProject } from '../../types/erp';
import { MOCK_USERS, INITIAL_WORKFLOW_RULES, INITIAL_PROJECTS } from '../../data/mockData';

interface AdminViewProps {
  currentUser: UserProfile;
  activeSubTab?: 'employees' | 'projects' | 'workflows' | 'roles';
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  currentUser, 
  activeSubTab = 'employees' 
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'projects' | 'workflows' | 'roles'>(activeSubTab);
  
  // Employees state
  const [employees, setEmployees] = useState<UserProfile[]>(MOCK_USERS);
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [editingEmpRole, setEditingEmpRole] = useState<UserProfile | null>(null);
  const [empSearch, setEmpSearch] = useState('');

  // Projects state
  const [projects, setProjects] = useState<PlantProject[]>(INITIAL_PROJECTS);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');

  // Workflow rules state
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>(INITIAL_WORKFLOW_RULES);

  // New Employee Form State
  const [newEmp, setNewEmp] = useState({
    empId: `MPIL-EMP-${Math.floor(500 + Math.random() * 400)}`,
    name: 'Anita Desai',
    email: 'anita.d@mpil.co.in',
    department: 'Quality Control',
    designation: 'Senior Analytical Chemist',
    role: 'QC_USER' as RoleType,
    approvalLimitUsd: 50000,
  });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    projectCode: `PRJ-2026-0${projects.length + 1}`,
    title: 'High-Temperature Vacuum Sintering Unit',
    department: 'Production & Smelting',
    leadManager: 'Sanjay Patil',
    budgetKg: 1500,
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: '2027-01-31',
    status: 'Active' as const,
    targetProduct: 'Product 1 (High Purity Ta2O5)',
    description: 'High-vacuum sintering cycle to reduce ppm dissolved gases in optical grade tantalum.',
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const created: UserProfile = {
      id: `usr-${Date.now()}`,
      empId: newEmp.empId,
      name: newEmp.name,
      email: newEmp.email,
      department: newEmp.department,
      designation: newEmp.designation,
      role: newEmp.role,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      approvalLimitUsd: newEmp.approvalLimitUsd,
    };
    setEmployees([...employees, created]);
    setShowAddEmpModal(false);
  };

  const handleUpdateRole = (empId: string, newRole: RoleType) => {
    setEmployees(employees.map(u => u.id === empId ? { ...u, role: newRole } : u));
    setEditingEmpRole(null);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const createdProject: PlantProject = {
      id: `prj-${Date.now()}`,
      ...newProject,
    };
    setProjects([createdProject, ...projects]);
    setShowAddProjectModal(false);
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.empId.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.department.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.role.toLowerCase().includes(empSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.projectCode.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.department.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.leadManager.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const roleOptions: { key: RoleType; label: string; desc: string }[] = [
    { key: 'SUPER_ADMIN', label: 'Super Admin / Management', desc: 'Executive oversight, read-only analytics, policy control' },
    { key: 'PRODUCTION_USER', label: 'Production User', desc: 'Campaigns, smelting batches, plant transfers, loss logs' },
    { key: 'QC_USER', label: 'Quality Control User', desc: 'Inbound sampling, laboratory assay, sample registry' },
    { key: 'STORE_USER', label: 'Store & Maintenance User', desc: 'Raw material stock, store requisitions, material issues' },
    { key: 'PURCHASE_HEAD', label: 'Procurement Specialist', desc: 'Purchase orders, vendor negotiations' },
    { key: 'DIRECTOR', label: 'Executive Director', desc: 'Financial value approvals, contract sign-offs' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Admin Panel & Organization</h2>
            <p className="text-xs text-slate-500">
              Manage employees, assign roles, track plant projects, and configure approval rules.
            </p>
          </div>
        </div>

        {/* Tab switchers with simple words */}
        <div className="p-1 rounded-xl bg-slate-100 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'employees' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Employees ({employees.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Roles & Access
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workflows' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approval Rules
          </button>
        </div>
      </div>

      {/* TAB 1: EMPLOYEES & STAFF MANAGEMENT */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, department..."
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-white border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredEmployees.length} registered staff
                </span>
              </div>

              <button
                onClick={() => setShowAddEmpModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4 text-right">Approval Limit</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{emp.name}</span>
                            <span className="text-[11px] text-slate-400 block">{emp.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{emp.empId}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{emp.department}</td>
                      <td className="py-3 px-4 text-slate-600">{emp.designation}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        ${emp.approvalLimitUsd.toLocaleString()} USD
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-0.5" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingEmpRole(emp)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200"
                        >
                          Assign Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS & PRODUCTION UNITS (MULTIPLE LISTED OUT AS REQUESTED) */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-white border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredProjects.length} plant projects
                </span>
              </div>

              <button
                onClick={() => setShowAddProjectModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </button>
            </div>

            {/* Projects Grid / List */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {p.projectCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{p.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{p.department} • Lead: <strong>{p.leadManager}</strong></p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      p.status === 'Planning' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {p.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Product:</span>
                      <span className="font-semibold text-slate-800">{p.targetProduct}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Batch Allocation:</span>
                      <span className="font-bold text-blue-700">{p.budgetKg.toLocaleString()} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLES & ACCESS MATRIX */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configured System Roles</h3>
              <p className="text-xs text-slate-500">Assign responsibilities and fine-grained permissions per role.</p>
            </div>
            <span className="text-xs font-bold text-blue-700">{roleOptions.length} Roles Defined</span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleOptions.map((r) => (
              <div key={r.key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{r.label}</span>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {r.key}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{r.desc}</p>
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600">View Data</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600">Create & Edit</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600">Print Documents</span>
                  {r.key !== 'PRODUCTION_USER' && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">Approve Limit</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APPROVAL RULES */}
      {activeTab === 'workflows' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Document Approval Sequences</h3>
              <p className="text-xs text-slate-500">Automated sign-off routing based on transaction values and roles.</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">Auto-threshold routing</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Sequence Step</th>
                  <th className="py-3 px-4">Stage Name</th>
                  <th className="py-3 px-4">Authorized Approver</th>
                  <th className="py-3 px-4">Trigger Condition</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workflowRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{rule.documentType}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">Step {rule.stepNo}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{rule.stepName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">{rule.roleRequired}</td>
                    <td className="py-3 px-4">
                      {rule.minThresholdUsd ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Above ${rule.minThresholdUsd.toLocaleString()} USD
                        </span>
                      ) : (
                        <span className="text-slate-400">All amounts (Mandatory)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMPLOYEE */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Employee</h3>
                <p className="text-xs text-slate-500">Register team member and assign organizational role</p>
              </div>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={newEmp.empId}
                    onChange={(e) => setNewEmp({ ...newEmp, empId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Production & Smelting">Production & Smelting</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Stores & Maintenance">Stores & Maintenance</option>
                    <option value="Purchase & Procurement">Purchase & Procurement</option>
                    <option value="Management">Management</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assign System Role</label>
                <select
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value as RoleType })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="PRODUCTION_USER">Production User (Campaigns, Transfers, Loss)</option>
                  <option value="QC_USER">Quality Control User (Assays, Samples)</option>
                  <option value="STORE_USER">Store & Maintenance User (RM, Requisitions)</option>
                  <option value="SUPER_ADMIN">Super Admin / Management (Read-Only)</option>
                  <option value="PURCHASE_HEAD">Procurement Specialist</option>
                  <option value="DIRECTOR">Executive Director</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Approval Monetary Limit ($ USD)</label>
                <input
                  type="number"
                  value={newEmp.approvalLimitUsd}
                  onChange={(e) => setNewEmp({ ...newEmp, approvalLimitUsd: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN ROLE TO EXISTING EMPLOYEE */}
      {editingEmpRole && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assign Role</h3>
                <p className="text-xs text-slate-500">Change role for {editingEmpRole.name}</p>
              </div>
              <button onClick={() => setEditingEmpRole(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2 py-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleUpdateRole(editingEmpRole.id, opt.key)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    editingEmpRole.role === opt.key 
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 block">{opt.desc}</span>
                  </div>
                  {editingEmpRole.role === opt.key && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setEditingEmpRole(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROJECT */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Plant Project / Unit</h3>
                <p className="text-xs text-slate-500">Define continuous smelting run or research project</p>
              </div>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Code</label>
                  <input
                    type="text"
                    value={newProject.projectCode}
                    onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lead Manager</label>
                  <input
                    type="text"
                    value={newProject.leadManager}
                    onChange={(e) => setNewProject({ ...newProject, leadManager: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newProject.department}
                    onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Production & Smelting">Production & Smelting</option>
                    <option value="Research & Development">Research & Development</option>
                    <option value="Hydrometallurgical Recovery">Hydrometallurgical Recovery</option>
                    <option value="Smelting Unit 2">Smelting Unit 2</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Allocation (kg)</label>
                  <input
                    type="number"
                    value={newProject.budgetKg}
                    onChange={(e) => setNewProject({ ...newProject, budgetKg: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Product</label>
                <input
                  type="text"
                  value={newProject.targetProduct}
                  onChange={(e) => setNewProject({ ...newProject, targetProduct: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Description / Scope</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 h-16"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
