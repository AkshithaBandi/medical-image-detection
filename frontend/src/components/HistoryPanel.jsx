import { useState, useEffect } from "react";

const RISK_COLOR = {
  low: "text-emerald-600 bg-emerald-50 border-emerald-200",
  moderate: "text-orange-600 bg-orange-50 border-orange-200",
  high: "text-red-600 bg-red-50 border-red-200",
  critical: "text-red-700 bg-red-100 border-red-300",
};

const PRED_COLOR = {
  pneumonia: "text-red-600",
  normal: "text-emerald-600",
};

function formatDate(str) {

  if (!str) return "—";

  try {

    // Treat SQLite timestamp as UTC
    const date = new Date(str + "Z");

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  } catch {

    return str;

  }
}

export default function HistoryPanel({ onSelectHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/history/${localStorage.getItem("email")}`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      await fetchHistory();
    };

    loadHistory();
  }, []);

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="text-sm font-bold text-slate-700">
            Prediction History
          </p>

          <p className="text-xs text-slate-400">
            {history.length} records
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            fetchHistory();
          }}
          className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-500"
        >
          Refresh
        </button>
      </div>

      {expanded && (
        <div className="p-4">
          {loading && (
            <div className="text-center py-6 text-slate-400">
              Loading history...
            </div>
          )}

          {error && (
            <div className="text-center py-6 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              No history found
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {history.map((item, index) => {
                const predKey =
                  item.prediction?.toLowerCase() || "normal";

                const riskKey =
                  item.risk_level?.toLowerCase() || "low";

                return (
                  <div
                    key={item.id || index}
                    onClick={() => onSelectHistory?.(item)}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-bold ${
                            PRED_COLOR[predKey]
                          }`}
                        >
                          {item.prediction}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.confidence?.toFixed(1)}% confidence
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-lg border ${
                          RISK_COLOR[riskKey]
                        }`}
                      >
                        {item.risk_level}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}