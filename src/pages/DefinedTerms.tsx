import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Search, 
  ArrowUpDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const DefinedTerms: React.FC = () => {
  const { documents, selectedDocumentId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const doc = documents.find(d => d.id === selectedDocumentId);

  if (!doc) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400">
          <BookOpen size={32} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">No Document Selected</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            Please upload or select an active document in the header to view its extracted dictionary definitions.
          </p>
        </div>
      </div>
    );
  }

  // Filter definitions based on search keyword
  const filteredDefinitions = doc.definitions.filter(def => 
    def.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    def.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen size={22} className="text-blue-500" />
            Defined Terms Dictionary
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Analyzing: <span className="font-semibold text-slate-700 dark:text-zinc-300">{doc.name}</span>
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
          Extracted: {doc.definitions.length} Glossary Terms
        </div>
      </div>

      {/* Search and Table Filters bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-premium">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs flex items-center">
          <Search size={14} className="absolute left-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search defined terms..."
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3.5 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-950 text-xs flex items-center gap-1.5 transition-colors">
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
      </div>

      {/* Glossary Dictionary Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6 w-1/4">Term</th>
                <th className="py-4 px-6 w-3/5">Definition Summary</th>
                <th className="py-4 px-6 text-right">Page Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
              {filteredDefinitions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 dark:text-zinc-500 font-sans">
                    No matching defined terms discovered.
                  </td>
                </tr>
              ) : (
                filteredDefinitions.map((def, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-zinc-950/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-zinc-200">
                      <span className="px-2 py-1 rounded bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/20">
                        {def.term}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-zinc-300 font-sans leading-relaxed">
                      {def.definition}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-400 dark:text-zinc-500 font-mono font-semibold">
                      Page {def.page}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info/pagination pagination */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 bg-slate-50/20 dark:bg-zinc-900/20">
          <span>Showing {filteredDefinitions.length} of {doc.definitions.length} definitions</span>
          <div className="flex gap-2">
            <button disabled className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 opacity-40">
              <ChevronLeft size={14} />
            </button>
            <button disabled className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
