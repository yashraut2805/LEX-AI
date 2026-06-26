import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const RiskAnalysis: React.FC = () => {
  const { documents, selectedDocumentId } = useApp();
  const doc = documents.find(d => d.id === selectedDocumentId);

  if (!doc) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">No Document Selected</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            Please upload or select an active document in the header to review its risk compliance profile.
          </p>
        </div>
      </div>
    );
  }

  // Count risk levels
  const highCount = doc.risks.filter(r => r.level === 'High').length;
  const mediumCount = doc.risks.filter(r => r.level === 'Medium').length;
  const lowCount = doc.risks.filter(r => r.level === 'Low').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Risk Title & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <ShieldAlert size={22} className="text-rose-500" />
            Risk & Exposure Assessment
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Auditing: <span className="font-semibold text-slate-700 dark:text-zinc-300">{doc.name}</span>
          </p>
        </div>

        {/* Risk count indicators */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-100 dark:border-rose-900/30">
            {highCount} High
          </span>
          <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-100 dark:border-amber-900/30">
            {mediumCount} Medium
          </span>
          <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-900/30">
            {lowCount} Low
          </span>
        </div>
      </div>

      {/* Main cards lists */}
      <div className="grid grid-cols-1 gap-4">
        {doc.risks.map((risk, idx) => {
          return (
            <div 
              key={idx}
              className={`p-6 rounded-3xl bg-white dark:bg-zinc-900 border hover:shadow-premium dark:hover:shadow-dark-premium transition-all duration-300 flex flex-col justify-between space-y-4 ${
                risk.level === 'High' ? 'border-rose-100 dark:border-rose-950/30' :
                risk.level === 'Medium' ? 'border-amber-100 dark:border-amber-950/30' :
                'border-blue-100 dark:border-blue-950/30'
              }`}
            >
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      risk.level === 'High' ? 'bg-rose-500 animate-pulse' :
                      risk.level === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">
                      {risk.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 block">
                    CITED REFERENCE: {risk.reference}
                  </span>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  risk.level === 'High' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30' :
                  risk.level === 'Medium' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30' :
                  'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30'
                }`}>
                  {risk.level} RISK
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Legal Rationale
                </span>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {risk.description}
                </p>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 flex items-start gap-3">
                <div className="p-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mt-0.5">
                  <Sparkles size={14} />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Remediation Recommendation
                  </span>
                  <p className="text-xs text-slate-700 dark:text-zinc-200 leading-relaxed font-sans font-medium">
                    {risk.recommendation}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
