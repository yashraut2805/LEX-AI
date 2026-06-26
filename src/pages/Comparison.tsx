import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Columns, 
  ArrowLeftRight, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  FileText,
  PlusCircle,
  MinusCircle,
  FileEdit,
  ArrowRight
} from 'lucide-react';

export const Comparison: React.FC = () => {
  const { documents, comparisonContracts, setComparisonContract } = useApp();
  const [activeCompareMode, setActiveCompareMode] = useState<'side-by-side' | 'differences'>('side-by-side');

  const { contractA, contractB } = comparisonContracts;

  // Mocked comparison clause diff details
  const clauseDiffs = [
    {
      clause: 'Limitation of Liability',
      change: 'Modified',
      description: 'Liability cap changed from $500,000 (Contract A) to 12 months fees paid (Contract B). Excludes indirect damages unilaterally in Contract B.',
      severity: 'High',
      icon: FileEdit,
      color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
    },
    {
      clause: 'Intellectual Property Ownership',
      change: 'Added',
      description: 'Clause added in Contract B detailing customer owns raw source data while provider claims enhancement rights.',
      severity: 'Low',
      icon: PlusCircle,
      color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
    },
    {
      clause: 'Non-Compete Covenants',
      change: 'Removed',
      description: 'The 12-month post-employment covenant present in Contract A is completely absent in Contract B.',
      severity: 'High',
      icon: MinusCircle,
      color: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Compare Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <Columns size={22} className="text-blue-500" />
            Side-by-Side Multi-Contract Compare
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Compare two ingested agreements side-by-side to highlight additions, modifications, and deletions.
          </p>
        </div>

        {/* View Switcher tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl">
          <button
            onClick={() => setActiveCompareMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCompareMode === 'side-by-side'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveCompareMode('differences')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCompareMode === 'differences'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
            }`}
          >
            Delta Summary
          </button>
        </div>
      </div>

      {/* Dropdown selectors for contract A & B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
        
        {/* Selector A */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
            Contract A (Baseline)
          </label>
          <div className="relative">
            <select
              value={contractA?.id || ''}
              onChange={(e) => setComparisonContract('A', e.target.value || null)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Document A...</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selector B */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
            Contract B (Revised/Target)
          </label>
          <div className="relative">
            <select
              value={contractB?.id || ''}
              onChange={(e) => setComparisonContract('B', e.target.value || null)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Document B...</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Render Side by Side View */}
      {activeCompareMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-18rem)] overflow-hidden">
          
          {/* Panel Contract A */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate">
                A: {contractA ? contractA.name : 'No file selected'}
              </span>
              <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 px-2 py-0.5 rounded font-mono font-semibold">
                Baseline
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 font-mono text-xs leading-relaxed text-slate-500 dark:text-zinc-400 scrollbar-thin">
              {contractA ? (
                <div className="space-y-3">
                  <p className="p-1.5 rounded">1. This Master SaaS Agreement is signed on June 15, 2026 by CloudTech Solutions...</p>
                  <p className="p-1.5 rounded">2. Intellectual property remains provider property...</p>
                  <p className="p-1.5 rounded bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border-l-2 border-rose-500">3. Non-Compete: Executive covenants they will not engage in competing operations for a period of 12 months anywhere in the United States...</p>
                  <p className="p-1.5 rounded bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-l-2 border-amber-500">4. Limitation of Liability: Total damages capped strictly at $500,000 for standard breaches.</p>
                  <p className="p-1.5 rounded">5. Governing Law: Governed by the state laws of Delaware...</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400 py-10 font-sans">
                  Select a baseline contract above.
                </div>
              )}
            </div>
          </div>

          {/* Panel Contract B */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate">
                B: {contractB ? contractB.name : 'No file selected'}
              </span>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold">
                Revised Target
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 font-mono text-xs leading-relaxed text-slate-500 dark:text-zinc-400 scrollbar-thin">
              {contractB ? (
                <div className="space-y-3">
                  <p className="p-1.5 rounded">1. This Master SaaS Agreement is signed on June 20, 2026 by Apex Holdings...</p>
                  <p className="p-1.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-l-2 border-emerald-500">2. Intellectual property: Customer retains complete ownership over customer raw data feed, granting Provider non-exclusive feedback tuning rights...</p>
                  <p className="p-1.5 text-slate-300 dark:text-zinc-600 line-through p-1.5 rounded">3. [Clause Removed: Non-Compete Restricted Covenant]</p>
                  <p className="p-1.5 rounded bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-l-2 border-amber-500">4. Limitation of Liability: Total liability capped strictly at 12 months fee metrics. Unilaterally waives indirect claims.</p>
                  <p className="p-1.5 rounded">5. Governing Law: Governed by the state laws of New York...</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400 py-10 font-sans">
                  Select a revised target contract above.
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Delta Summary view */
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Detected Contract Deltas
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {clauseDiffs.map((diff, idx) => {
              const Icon = diff.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-start gap-4 shadow-sm"
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${diff.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                        {diff.clause}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        diff.severity === 'High' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                      }`}>
                        Crit: {diff.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 font-sans leading-relaxed">
                      {diff.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
