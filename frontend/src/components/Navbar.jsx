import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal,    setShowModal]    = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <header className="relative z-20 border-b border-white/60 bg-white/60 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-black text-slate-800 leading-none">PneumoScan AI</p>
              <p className="text-xs text-slate-400 mono mt-0.5">Medical Image Analysis System</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 mono bg-white/80 border border-slate-200 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MODEL ONLINE
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(p => !p)}
                className="flex items-center gap-2.5 bg-white/80 border border-slate-200 rounded-full pl-2 pr-4 py-2 hover:bg-white hover:border-indigo-200 transition-all duration-200 shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-black">
                  {initials}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-700 leading-none">{user?.username}</p>
                  <p className="text-xs text-slate-400 mono mt-0.5 truncate max-w-[120px]">{user?.email}</p>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-indigo-50/60">
                    <p className="text-xs font-bold text-slate-700">{user?.username}</p>
                    <p className="text-xs text-slate-400 mono truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs text-slate-500 mono">Authenticated</span>
                    </div>
                    {/* Sign out — opens modal instead of direct logout */}
                    <button
                      onClick={() => { setShowDropdown(false); setShowModal(true); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all text-xs font-semibold"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close dropdown on outside click */}
        {showDropdown && (
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
        )}
      </header>

      {/* Logout confirmation modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-sm glass rounded-3xl overflow-hidden shadow-2xl"
            style={{ animation: "slideUp 0.25s ease" }}
          >
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" />

            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Sign Out</h3>
                <p className="text-slate-400 text-sm mt-1.5">
                  Are you sure you want to sign out?
                </p>
                <p className="text-xs text-slate-400 mono mt-1">
                  Signed in as <span className="text-indigo-500 font-medium">{user?.username}</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold hover:from-red-400 hover:to-rose-500 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </>
  );
}