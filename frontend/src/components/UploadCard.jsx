import { useState, useRef, useCallback } from "react";

export default function UploadCard({ onAnalyze, onPreview, onReset, loading, previewUrl }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a valid image (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) { alert("Max file size is 15MB."); return; }
    setSelectedFile(file);
    onPreview(URL.createObjectURL(file));
  }, [onPreview]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onReset();
  };

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Upload X-Ray</p>
            <p className="text-xs text-slate-400 mono">JPG · PNG · WebP · max 15MB</p>
          </div>
        </div>
        {selectedFile && !loading && (
          <button onClick={handleClear} className="text-xs text-slate-400 hover:text-red-500 transition-colors border border-slate-200 hover:border-red-200 rounded-lg px-3 py-1.5 mono">
            CLEAR
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !previewUrl && !loading && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden select-none
            ${isDragging    ? "border-indigo-400 bg-indigo-50 scale-[1.01]" :
              previewUrl    ? "border-slate-200 cursor-default" :
              loading       ? "border-slate-200 cursor-default" :
                              "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 cursor-pointer"}`}
          style={{ minHeight: 280 }}
        >
          {previewUrl ? (
            <div className="relative w-full" style={{ minHeight: 280 }}>
              <img
                src={previewUrl}
                alt="X-Ray preview"
                className="w-full object-contain rounded-xl"
                style={{ maxHeight: 320, minHeight: 280 }}
              />
              {/* Corner brackets */}
              {["top-3 left-3 border-t-2 border-l-2","top-3 right-3 border-t-2 border-r-2","bottom-3 left-3 border-b-2 border-l-2","bottom-3 right-3 border-b-2 border-r-2"].map((c,i) => (
                <div key={i} className={`absolute w-5 h-5 ${c} border-indigo-400/70 rounded-sm`} />
              ))}
              {/* Loading overlay */}
              {loading && (
                <>
                  <div className="absolute inset-0 bg-white/75 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
                    <div className="relative w-14 h-14">
                      <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-300 border-b-transparent border-l-transparent animate-spin" />
                      <div className="absolute inset-2 rounded-full border-2 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection:"reverse", animationDuration:"0.7s" }} />
                    </div>
                    <p className="text-sm font-semibold text-indigo-600 mono animate-pulse">ANALYZING...</p>
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div className="scan-line" />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
              {isDragging ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center animate-bounce">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <p className="text-indigo-600 font-semibold mono text-sm">DROP TO UPLOAD</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 font-semibold text-sm">Drop chest X-ray here</p>
                    <p className="text-slate-400 text-xs mt-1">or click to browse</p>
                  </div>
                  <div className="flex gap-2">
                    {["JPG","PNG","WebP"].map(f => (
                      <span key={f} className="text-xs text-slate-400 border border-slate-200 bg-white rounded-md px-2 py-0.5 mono">{f}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={e => processFile(e.target.files[0])} className="hidden" />

        {/* File info */}
        {selectedFile && (
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-700 font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400 mono">{(selectedFile.size/1024).toFixed(1)} KB</p>
            </div>
            <span className="text-xs text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-md px-2 py-0.5 mono font-medium">READY</span>
          </div>
        )}
        

        {/* Warning Note */}
<div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
  <div className="flex items-start gap-3">

    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
      <span className="text-amber-600 text-sm font-bold">⚠</span>
    </div>

    <div>
      <p className="text-xs font-bold text-amber-700 mono mb-1">
        IMPORTANT NOTICE
      </p>

      <p className="text-xs text-amber-700 leading-relaxed">
        This AI model is trained specifically on chest X-ray images.
        Uploading unrelated images may produce unreliable predictions.
      </p>
    </div>

  </div>
</div>


        {/* CTA Button */}
        <button
          onClick={selectedFile ? () => onAnalyze(selectedFile) : () => fileInputRef.current?.click()}
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide mono transition-all duration-300
            ${loading
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : selectedFile
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
              : "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200 hover:text-slate-500"}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              RUNNING INFERENCE...
            </span>
          ) : selectedFile ? "ANALYZE X-RAY" : "SELECT IMAGE"}
        </button>
      </div>
    </div>
  );
}