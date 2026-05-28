import { useState } from "react";

export default function HeatmapViewer({ originalUrl, heatmapUrl }) {
  const [heatmapError, setHeatmapError] = useState(false);
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);

  // Don't render if nothing to show
  if (!originalUrl && !heatmapUrl) return null;

  return (
    <div className="glass rounded-3xl overflow-hidden fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">Grad-CAM Visualization</p>
          <p className="text-xs text-slate-400 mono">Explainable AI — attention heatmap overlay</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          XAI ACTIVE
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">

          {/* Original image */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-xs font-semibold text-slate-600 mono uppercase tracking-wider">Original X-Ray</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center" style={{ minHeight: 220 }}>
              {originalUrl ? (
                <img
                  src={originalUrl}
                  alt="Original X-Ray"
                  className="w-full h-full object-contain"
                  style={{ maxHeight: 260 }}
                />
              ) : (
                <p className="text-xs text-slate-300 mono">No image</p>
              )}
              <div className="absolute top-2 left-2">
                <span className="text-xs bg-blue-500 text-white rounded-md px-2 py-0.5 mono font-medium shadow-sm">ORIGINAL</span>
              </div>
            </div>
          </div>

          {/* Heatmap image */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <p className="text-xs font-semibold text-slate-600 mono uppercase tracking-wider">Grad-CAM Heatmap</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center" style={{ minHeight: 220 }}>

              {/* Loading state while heatmap loads */}
              {heatmapUrl && !heatmapLoaded && !heatmapError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50">
                  <div className="w-8 h-8 rounded-full border-2 border-t-orange-400 border-r-orange-200 border-b-transparent border-l-transparent animate-spin" />
                  <p className="text-xs text-slate-400 mono">Loading heatmap...</p>
                </div>
              )}

              {/* Heatmap image — always render so onLoad/onError fire */}
              {heatmapUrl && !heatmapError && (
                <img
                  src={heatmapUrl}
                  alt="Grad-CAM Heatmap"
                  className={`w-full h-full object-contain transition-opacity duration-300 ${heatmapLoaded ? "opacity-100" : "opacity-0"}`}
                  style={{ maxHeight: 260 }}
                  onLoad={() => setHeatmapLoaded(true)}
                  onError={() => setHeatmapError(true)}
                />
              )}

              {/* Error fallback */}
              {(!heatmapUrl || heatmapError) && (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-400 mono">
                    {heatmapError ? "Heatmap unavailable" : "Generating..."}
                  </p>
                </div>
              )}

              <div className="absolute top-2 left-2">
                <span className="text-xs bg-orange-500 text-white rounded-md px-2 py-0.5 mono font-medium shadow-sm">GRAD-CAM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color legend */}
        <div className="mt-4 flex items-center justify-center gap-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-wrap">
          {[
            { color: "bg-blue-500",   label: "Low Activation"  },
            { color: "bg-green-400",  label: "Moderate"        },
            { color: "bg-yellow-400", label: "High"            },
            { color: "bg-red-500",    label: "Critical Region" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-xs text-slate-500 mono">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
          Warmer colors indicate regions the model focused on when making its prediction.
        </p>
      </div>
    </div>
  );
}