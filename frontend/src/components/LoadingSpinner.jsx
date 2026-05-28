export default function LoadingSpinner({ message = "Analyzing...", sub = "Running deep learning inference" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      {/* Triple ring spinner */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-100" />
        <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-300 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-b-blue-500 border-l-blue-300 border-t-transparent border-r-transparent animate-spin" style={{ animationDuration: "0.75s", animationDirection: "reverse" }} />
        <div className="absolute inset-6 rounded-full border-2 border-t-sky-400 border-transparent animate-spin" style={{ animationDuration: "1.5s" }} />
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
      </div>

      <div className="text-center">
        <p className="text-slate-700 font-semibold text-base">{message}</p>
        <p className="text-slate-400 text-xs mt-1 mono">{sub}</p>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-xs space-y-2">
        {[
          "Preprocessing X-ray image",
          "Running ResNet50 inference",
          "Generating Grad-CAM heatmap",
          "Compiling diagnostic report",
        ].map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div
              className="w-3 h-3 rounded-full border-2 border-t-indigo-500 border-r-indigo-200 border-b-transparent border-l-transparent animate-spin flex-shrink-0"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            <span className="text-xs text-slate-500 mono">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}