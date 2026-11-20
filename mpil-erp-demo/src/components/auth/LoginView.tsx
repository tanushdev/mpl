import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Factory,
  Sparkles,
  Layers,
  Flame,
  Boxes,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../../types/erp';
import { MOCK_USERS } from '../../data/mockData';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [email, setEmail] = useState<string>(MOCK_USERS[0].email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  // Handle selecting a persona card
  const handleSelectPersona = (u: UserProfile) => {
    setSelectedUser(u);
    setEmail(u.email);
    setPassword('••••••••••••');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedUser);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/60 to-blue-50/40 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Brand Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <img 
            src="/mpil-logo.png" 
            alt="Metallurgical Products (India) Pvt. Ltd." 
            className="h-9 object-contain"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <span className="text-xs font-bold text-slate-900 tracking-tight block">
              Metallurgical Products (India) Pvt. Ltd.
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              Taloja Industrial Works • MIDC Raigad, Maharashtra
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Plant Systems Online
          </span>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero & Facility Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold">
                <Factory className="w-3.5 h-3.5" />
                <span>Chemical Metallurgy & Refining</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Material Flow & Production ERP
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Integrated platform for multi-metal concentrate inwarding, solvent extraction campaigns, 3D loss tracking, and finished oxide dispatch.
              </p>
            </div>

            {/* Live Operational Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center space-x-1.5 text-blue-600 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Elements</span>
                </div>
                <div className="text-sm font-bold text-slate-900">Ta & Nb Refined</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ta₂O₅ & Nb₂O₅ Oxides</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center space-x-1.5 text-emerald-600 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Security</span>
                </div>
                <div className="text-sm font-bold text-slate-900">RBAC Enforced</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Dual-Signature Control</div>
              </div>
            </div>

            {/* ISO / Quality Standards footer pill */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Plant Facility: Plot No. 12, MIDC Taloja, Navi Mumbai 410208</span>
            </div>
          </div>

          {/* Right Column: Apple-styled Login Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 transition-all">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your role or enter credentials to access your department portal.
                </p>
              </div>

              {/* 1-Click Role Persona Quick Switcher */}
              <div className="mb-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Quick Demo Access (Select Persona)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_USERS.map((u) => {
                    const isSelected = selectedUser.id === u.id;
                    return (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => handleSelectPersona(u)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50/80'
                        }`}
                      >
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {u.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-blue-700 font-semibold truncate block">
                            {u.role === 'SUPER_ADMIN' ? 'Super Admin' :
                             u.role === 'PRODUCTION_USER' ? 'Production User' :
                             u.role === 'QC_USER' ? 'QC Lab User' :
                             u.role === 'STORE_USER' ? 'Store & Stores' : u.role}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-all text-slate-900 font-medium"
                      placeholder="name@mpil.co.in"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-hidden bg-slate-50/50 hover:bg-white transition-all text-slate-900 font-medium"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-xs text-slate-600">Remember this workstation</span>
                  </label>

                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedUser.empId}
                  </span>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center space-x-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Authenticating Plant Access...
                    </span>
                  ) : (
                    <>
                      <span>Enter as {selectedUser.name.split(' ')[0]} ({selectedUser.role.replace('_', ' ')})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Department Notice */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">Department: {selectedUser.department}</span>
                <span className="font-semibold text-blue-600">v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-3 border-t border-slate-200/60 bg-white/50 text-center text-xs text-slate-500">
        <span>© 2026 Metallurgical Products (India) Private Limited. All rights reserved. • MIDC Taloja Works</span>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Password Assistance</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              For plant security, password resets must be authorized by the MPIL Plant IT & Systems Administrator at Taloja Works.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1 mb-4">
              <div><strong>Internal Extension:</strong> Ext. 402 / 405</div>
              <div><strong>IT Desk:</strong> sysadmin@mpil.co.in</div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
