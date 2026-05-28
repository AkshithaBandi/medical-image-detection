import LoadingSpinner from "./LoadingSpinner";

const SEVERITY_CONFIG = {
  mild:     { color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-200", dot: "bg-yellow-400" },
  moderate: { color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-200", dot: "bg-orange-400" },
  severe:   { color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",    dot: "bg-red-500"    },
  normal:   { color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-200",dot: "bg-emerald-400"},
};

const RISK_CONFIG = {
  low:      { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "LOW RISK"      },
  moderate: { color: "text-orange-600",  bg: "bg-orange-50 border-orange-200",   label: "MODERATE RISK" },
  high:     { color: "text-red-600",     bg: "bg-red-50 border-red-200",         label: "HIGH RISK"     },
  critical: { color: "text-red-700",     bg: "bg-red-100 border-red-300",        label: "CRITICAL"      },
};

export default function ResultCard({ result, error, loading, previewUrl }) {
  const isPneumonia = result?.prediction?.toLowerCase() === "pneumonia";
  const isNormal    = result?.prediction?.toLowerCase() === "normal";
  const confidence  = result?.confidence ?? 0;
  const severityKey = result?.severity?.toLowerCase() ?? (isNormal ? "normal" : "mild");
  const riskKey     = result?.risk_level?.toLowerCase() ?? "low";
  const sevTheme    = SEVERITY_CONFIG[severityKey] ?? SEVERITY_CONFIG.mild;
  const riskTheme   = RISK_CONFIG[riskKey] ?? RISK_CONFIG.low;

  const diagTheme = isPneumonia
    ? { bar: "from-red-400 to-rose-500",     text: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     icon: "⚠" }
    : isNormal
    ? { bar: "from-emerald-400 to-teal-500", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: "✓" }
    : null;

  return (
    <div className="glass rounded-3xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Diagnostic Report</p>
            <p className="text-xs text-slate-400 mono">AI-powered analysis</p>
          </div>
        </div>
        {result && !error && (
          <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mono font-medium">
            ✓ COMPLETE
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">

        {/* IDLE */}
        {!loading && !result && !error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-indigo-100 pulse-ring" />
              <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <svg className="w-9 h-9 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-slate-600 font-semibold">Awaiting Analysis</p>
              <p className="text-slate-400 text-xs mt-1">Upload a chest X-ray to begin</p>
            </div>
            <div className="w-full space-y-2">
              {[
                { n: "01", label: "Upload chest X-ray image",   done: !!previewUrl },
                { n: "02", label: "Click Analyze X-Ray",        done: false },
                { n: "03", label: "View AI diagnostic results", done: false },
              ].map(({ n, label, done }) => (
                <div key={n} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all ${done ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-100"}`}>
                  <span className={`text-xs font-bold mono ${done ? "text-indigo-500" : "text-slate-300"}`}>{n}</span>
                  <span className={`text-xs ${done ? "text-slate-600" : "text-slate-400"}`}>{label}</span>
                  {done && <span className="ml-auto text-indigo-500 text-xs">✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && <LoadingSpinner />}

        {/* ERROR — handles both backend validation errors and network errors */}
        {error && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="text-center px-4">
              <p className="text-red-500 font-bold text-sm">
                {error.toLowerCase().includes("invalid image")
                  ? "Invalid Image Uploaded"
                  : "Error"}
              </p>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed max-w-sm">{error}</p>
            </div>

            {/* Show chest X-ray hint only for invalid image errors */}
            {error.toLowerCase().includes("invalid") && (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs text-amber-700 font-semibold mono mb-2">UPLOAD REQUIREMENTS</p>
                <ul className="space-y-1">
                  {[
                    "Must be a chest X-ray (CXR) image",
                    "Accepted formats: JPG, PNG, WebP",
                    "Frontal PA or AP view recommended",
                    "Avoid CT scans, MRIs, or other modalities",
                  ].map(tip => (
                    <li key={tip} className="text-xs text-amber-700 flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">›</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show troubleshooting only for connection errors */}
            {(error.toLowerCase().includes("connect") || error.toLowerCase().includes("fetch")) && (
              <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 space-y-1.5">
                <p className="text-xs text-red-400 mono font-medium mb-2">TROUBLESHOOTING</p>
                {["Ensure FastAPI is running: uvicorn main:app --reload", "Backend must be at http://127.0.0.1:8000", "Check CORS middleware in main.py"].map(t => (
                  <p key={t} className="text-xs text-slate-500 mono">› {t}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESULT */}
        {result && !loading && !error && diagTheme && (
          <div className="flex-1 flex flex-col gap-4 fade-in">

            {/* Main diagnosis */}
            <div className={`rounded-2xl p-4 border ${diagTheme.bg} ${diagTheme.border}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl ${diagTheme.bg} border ${diagTheme.border} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {diagTheme.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mono mb-0.5">PRIMARY DIAGNOSIS</p>
                  <p className={`text-2xl font-black ${diagTheme.text} leading-tight`}>{result.prediction}</p>
                </div>
              </div>
              {/* Confidence bar */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-slate-400 mono">CONFIDENCE SCORE</span>
                  <span className={`text-sm font-black mono ${diagTheme.text}`}>{confidence.toFixed(2)}%</span>
                </div>
                <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden border border-white/80">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${diagTheme.bar} bar-fill`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Severity + Risk */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 border ${sevTheme.bg} ${sevTheme.border}`}>
                <p className="text-xs text-slate-400 mono mb-1">SEVERITY</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sevTheme.dot}`} />
                  <p className={`text-base font-black ${sevTheme.color}`}>{result.severity ?? "—"}</p>
                </div>
              </div>
              <div className={`rounded-2xl p-4 border ${riskTheme.bg}`}>
                <p className="text-xs text-slate-400 mono mb-1">RISK LEVEL</p>
                <p className={`text-base font-black ${riskTheme.color}`}>{result.risk_level ?? "—"}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "MODEL",      value: "ResNet50",                         color: "text-slate-700" },
                { label: "STATUS",     value: "Complete",                         color: "text-emerald-600" },
                { label: "CONFIDENCE", value: `${confidence.toFixed(2)}%`,        color: "text-slate-700" },
                { label: "PREDICTION", value: result.prediction,                  color: diagTheme.text },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mono mb-0.5">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* AI Report */}
            {result.report && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs font-bold text-indigo-600 mono">AI MEDICAL REPORT</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{result.report}</p>
              </div>
            )}

            {/* Recommendation */}
            {result.recommendation && (
              <div className={`rounded-2xl p-4 border ${isPneumonia ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`text-xs font-bold mono ${isPneumonia ? "text-amber-600" : "text-emerald-600"}`}>RECOMMENDATION</p>
                </div>
                <p className={`text-xs leading-relaxed ${isPneumonia ? "text-amber-700" : "text-emerald-700"}`}>{result.recommendation}</p>
              </div>
            )}

            {/* PDF Download */}
            {result.pdf_report && (
              <a 
                href={result.pdf_report}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-sm mono tracking-wide hover:from-indigo-400 hover:to-blue-500 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOWNLOAD PDF REPORT
              </a>
            )}

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              ⚠ For research use only. Not a substitute for clinical diagnosis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}