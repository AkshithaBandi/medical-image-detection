import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Navbar        from "./components/Navbar";
import UploadCard    from "./components/UploadCard";
import ResultCard    from "./components/ResultCard";
import HeatmapViewer from "./components/HeatmapViewer";
import HistoryPanel  from "./components/HistoryPanel";

export default function App() {
  const { user } = useAuth();

  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Redirect if not authenticated (ProtectedRoute handles this, but belt + suspenders)
  if (!user) return <Navigate to="/login" replace />;

  const handlePreview = (url) => {
    setPreviewUrl(url);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      formData.append(
        "user_email",
        localStorage.getItem("email")
      );

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
        headers: {
          // Pass JWT token for authenticated requests
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setResult(null);
        return;
      }

      setError(null);
      setResult(data);
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to backend. Ensure FastAPI is running on http://127.0.0.1:8000");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
  };

  const handleSelectHistory = (item) => {
    setResult(item);
    setError(null);
  };

  const showHeatmap = result && !error && (previewUrl || result.heatmap_image);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pointer-events-none" />
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

      {/* Authenticated Navbar */}
      <Navbar />

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-2 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 rounded-full px-4 py-1.5 text-xs text-indigo-600 mono mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          CHEST X-RAY PNEUMONIA DETECTION · EXPLAINABLE AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 leading-tight">
          <span className="text-slate-800">AI-Powered</span>{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Medical Diagnosis
          </span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
          Upload a chest X-ray for instant AI analysis — confidence scores, severity grading,
          Grad-CAM visualization, and downloadable PDF reports.
        </p>
      </div>

      {/* Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Model Accuracy", value: "97.8%",  icon: "🎯" },
            { label: "Grad-CAM XAI",  value: "Active", icon: "🔬" },
            { label: "Inference Time", value: "<2s",   icon: "⚡" },
            { label: "PDF Reports",   value: "Auto",   icon: "📄" },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-black text-slate-700">{stat.value}</div>
              <div className="text-xs text-slate-400 mono mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — upload + history */}
          <div className="flex flex-col gap-5">
            <UploadCard
              onAnalyze={handleAnalyze}
              onPreview={handlePreview}
              onReset={handleReset}
              loading={loading}
              previewUrl={previewUrl}
            />
            <HistoryPanel onSelectHistory={handleSelectHistory} />
          </div>

          {/* Right — result + heatmap */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <ResultCard
              result={result}
              error={error}
              loading={loading}
              previewUrl={previewUrl}
            />
            {showHeatmap && (
              <HeatmapViewer
                originalUrl={previewUrl}
                heatmapUrl={result.heatmap_image}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400 mono">
            ⚠ For research & educational use only — not a substitute for clinical diagnosis
          </p>
          <p className="text-xs text-slate-400 mono">FastAPI · TensorFlow · React · Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}