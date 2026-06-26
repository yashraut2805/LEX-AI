import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Copy, 
  Download, 
  Check, 
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';

export const MemoGenerator: React.FC = () => {
  const { documents, selectedDocumentId } = useApp();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const doc = documents.find(d => d.id === selectedDocumentId);

  if (!doc) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400">
          <FileText size={32} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">No Document Selected</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            Please upload or select an active document in the header to draft its legal memorandum.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    
    // Simulate generation/downloading flow
    setTimeout(() => {
      // Create element and simulate downloading text
      const element = document.createElement("a");
      const file = new Blob([doc.memo], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${doc.name.replace(/\.[^/.]+$/, "")}_Legal_Memo.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <FileText size={22} className="text-blue-500" />
            AI Legal Memorandum Draft
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Synthesized summary memo for internal review.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-950 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Memo
              </>
            )}
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Drafting DOCX...
              </>
            ) : (
              <>
                <Download size={14} />
                Download DOCX
              </>
            )}
          </button>
        </div>
      </div>

      {/* Legal Memo Stationery view container */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-premium md:p-12 relative overflow-hidden">
        
        {/* Decorative corner seal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/2 rounded-full -mr-12 -mt-12 flex items-center justify-center border border-dashed border-blue-500/10">
          <Sparkles className="text-blue-500/20 w-8 h-8" />
        </div>

        {/* Executive Letterhead */}
        <div className="border-b-2 border-slate-900 dark:border-zinc-700 pb-6 mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-lg tracking-wider mb-4 uppercase">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Internal Legal Memorandum
          </div>
          
          {/* Memo Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
            <div className="flex gap-2">
              <span className="font-bold text-slate-400 dark:text-zinc-500 uppercase w-20 flex-shrink-0">TO:</span>
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">Corporate Review Counsel</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-slate-400 dark:text-zinc-500 uppercase w-20 flex-shrink-0">DATE:</span>
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">{doc.uploadDate}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-slate-400 dark:text-zinc-500 uppercase w-20 flex-shrink-0">FROM:</span>
              <span className="text-slate-800 dark:text-zinc-200 font-semibold flex items-center gap-1">
                LexAI Ollama Engine
                <Sparkles size={12} className="text-amber-500" />
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-slate-400 dark:text-zinc-500 uppercase w-20 flex-shrink-0">RE:</span>
              <span className="text-slate-800 dark:text-zinc-200 font-semibold truncate">{doc.name} Review</span>
            </div>
          </div>
        </div>

        {/* Memo Body Content */}
        <div className="font-serif text-sm leading-relaxed text-slate-700 dark:text-zinc-300 max-w-none whitespace-pre-wrap space-y-6">
          {doc.memo}
        </div>

        {/* Footer legal disclaimer */}
        <div className="border-t border-slate-100 dark:border-zinc-800 mt-12 pt-4 text-[10px] text-slate-400 dark:text-zinc-500 font-sans leading-relaxed text-center">
          DISCLAIMER: This legal memorandum is prepared using local AI LLM models (Ollama fine-tuned Qwen parameters). It represents a preliminary audit and does not constitute formal legal counsel. Please verify all clauses with qualified attorneys.
        </div>

      </div>

    </div>
  );
};
