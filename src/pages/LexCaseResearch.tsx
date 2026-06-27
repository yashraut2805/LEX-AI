import React from 'react';
import { Library } from 'lucide-react';

const bareActsFeature = {
  id: 8,
  feature: 'Bare Acts Browser',
  module: 'Module 3.3',
  details: 'Built-in browser for IPC, CrPC, CPC, etc., annotation, bookmarks, offline access',
};

export const LexCaseResearch: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <Library size={22} className="text-blue-500" />
          Bare Acts Browser
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Reference library for IPC, CrPC, CPC, and other statutes.
        </p>
      </div>

      {/* Feature Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-start gap-4 shadow-sm max-w-2xl">
        <div className="p-2.5 rounded-xl flex-shrink-0 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
          <Library size={18} />
        </div>
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
              {bareActsFeature.feature}
            </h4>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
              {bareActsFeature.module}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 font-sans leading-relaxed">
            {bareActsFeature.details}
          </p>
        </div>
      </div>

    </div>
  );
};