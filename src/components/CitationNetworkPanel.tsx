import React from 'react';
import { GitBranch, X, AlertTriangle, CheckCircle2, Star } from 'lucide-react';

interface CitationNetworkPanelProps {
  caseName: string;
  onClose: () => void;
}

// Mocked citation data — replace with real backend/AI data later
const mockCitationData = {
  status: 'Good Law' as 'Good Law' | 'Overruled' | 'Distinguished',
  tier: 'Landmark' as 'Landmark' | 'Ordinary',
  citedBy: 47,
  relieson: 3,
  backwardLinks: ['State of Madras v. Champakam Dorairajan', 'Golaknath v. State of Punjab'],
  forwardLinks: ['Minerva Mills v. Union of India', 'Indra Sawhney v. Union of India', 'I.R. Coelho v. State of Tamil Nadu'],
};

export const CitationNetworkPanel: React.FC<CitationNetworkPanelProps> = ({ caseName, onClose }) => {
  const data = mockCitationData;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <GitBranch size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100">{caseName}</h3>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">Citation Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status badges */}
        <div className="p-5 flex flex-wrap gap-2 border-b border-slate-100 dark:border-zinc-800">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
            data.status === 'Good Law'
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
          }`}>
            {data.status === 'Good Law' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {data.status}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
            <Star size={14} />
            {data.tier}
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
            Cited by {data.citedBy} cases
          </span>
        </div>

        {/* Backward links */}
        <div className="p-5 space-y-2 border-b border-slate-100 dark:border-zinc-800">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Relies On (Earlier Precedents)
          </h4>
          {data.backwardLinks.map((c) => (
            <div key={c} className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-950 text-xs text-slate-600 dark:text-zinc-300">
              {c}
            </div>
          ))}
        </div>

        {/* Forward links */}
        <div className="p-5 space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Cited By (Later Cases)
          </h4>
          {data.forwardLinks.map((c) => (
            <div key={c} className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-950 text-xs text-slate-600 dark:text-zinc-300">
              {c}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};