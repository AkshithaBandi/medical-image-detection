import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const { register, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [localErr,  setLocalErr]  = useState("");
  const [success,   setSuccess]   = useState(false);

  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user, navigate]);
  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    if (!username.trim())         return "Username is required.";
    if (username.trim().length < 3) return "Username must be at least 3 characters.";
    if (!email.trim())            return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (!password)                return "Password is required.";
    if (password.length < 6)     return "Password must be at least 6 characters.";
    if (password !== confirm)     return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    const err = validate();
    if (err) return setLocalErr(err);

    const result = await register(username.trim(), email.trim(), password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { registered: true } }), 2000);
    }
  };

  const displayError = localErr || error;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100" />
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="fixed bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md fade-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shadow-xl shadow-indigo-200 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800">PneumoScan AI</h1>
          <p className="text-slate-400 text-sm mono mt-1">Medical Image Analysis System</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-800">Create account</h2>
            <p className="text-slate-400 text-sm mt-1">Join to access AI-powered diagnostics</p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="px-8 py-10 flex flex-col items-center gap-4 text-center fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-slate-700 font-bold">Account created!</p>
                <p className="text-slate-400 text-xs mt-1">Redirecting to login...</p>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

              {/* Error banner */}
              {displayError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 fade-in">
                  <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-xs text-red-600 leading-relaxed">{displayError}</p>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 mono uppercase tracking-wider">Username</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setLocalErr(""); }}
                    placeholder="akshitha"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 mono uppercase tracking-wider">Email</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setLocalErr(""); }}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 mono uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setLocalErr(""); }}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 mono uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setLocalErr(""); }}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/70 text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 transition-all
                      ${confirm && confirm !== password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"}`}
                    disabled={loading}
                  />
                </div>
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-400 mono">Passwords don't match</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm mono tracking-wide transition-all duration-300 mt-2
                  ${loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    CREATING ACCOUNT...
                  </span>
                ) : "CREATE ACCOUNT"}
              </button>

              {/* Login link */}
              <p className="text-center text-xs text-slate-400 pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mono mt-6">
          ⚠ For research & educational use only
        </p>
      </div>
    </div>
  );
}