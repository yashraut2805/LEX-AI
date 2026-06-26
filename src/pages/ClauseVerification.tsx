import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const ClauseVerification: React.FC = () => {
  const { documents, selectedDocumentId } = useApp();
  const doc = documents.find(d => d.id === selectedDocumentId);

  if (!doc) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400">
          <FileCheck2 size={32} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">No Document Selected</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            Please upload or select an active document in the header to review its verified clauses.
          </p>
        </div>
      </div>
    );
  }

  // Predefined lists of standard clauses to verify if they are Present / Missing
  const standardClausesToVerify = [
    { type: 'Confidentiality', critical: true },
    { type: 'Termination', critical: true },
    { type: 'Arbitration', critical: false },
    { type: 'Indemnity', critical: true },
    { type: 'Force Majeure', critical: false },
    { type: 'Payment Terms', critical: true },
    { type: 'Governing Law', critical: true },
  ];

  // Map present clauses from active doc
  const verifiedClauses = standardClausesToVerify.map((standard) => {
    const matched = doc.clauses.find(c => c.type.toLowerCase().includes(standard.type.toLowerCase()) || standard.type.toLowerCase().includes(c.type.toLowerCase()));
    const missingMatched = doc.missingClauses.find(m => m.type.toLowerCase().includes(standard.type.toLowerCase()) || standard.type.toLowerCase().includes(m.type.toLowerCase()));
    
    if (matched) {
      return {
        type: standard.type,
        status: matched.status, // 'Present' | 'Modified'
        presence: 'Present',
        confidence: matched.confidence,
        explanation: matched.explanation,
        critical: standard.critical
      };
    } else if (missingMatched) {
      return {
        type: standard.type,
        status: 'Missing',
        presence: 'Missing',
        confidence: 90,
        explanation: missingMatched.description,
        critical: standard.critical
      };
    } else {
      // Fallback
      return {
        type: standard.type,
        status: 'Missing',
        presence: 'Missing',
        confidence: 85,
        explanation: `The auditor could not detect any ${standard.type} clause reference in this document. Add this provision to limit exposure.`,
        critical: standard.critical
      };
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck size={22} className="text-blue-500" />
            Clause Verification Auditor
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Analyzing active document: <span className="font-semibold text-slate-700 dark:text-zinc-300">{doc.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-600 dark:text-zinc-400">
              {verifiedClauses.filter(c => c.presence === 'Present').length} / {verifiedClauses.length} Present
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Verified Clauses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verifiedClauses.map((clause, idx) => {
          return (
            <div 
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:shadow-premium dark:hover:shadow-dark-premium transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">
                      {clause.type}
                    </h3>
                    {clause.critical && (
                      <span className="text-[8px] font-black uppercase bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-900/30">
                        Critical
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    Verification confidence: {clause.confidence}%
                  </span>
                </div>

                {/* Status Badges */}
                <div className="flex-shrink-0">
                  {clause.status === 'Present' && (
                    <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      <CheckCircle2 size={12} />
                      Present
                    </div>
                  )}
                  {clause.status === 'Modified' && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      <AlertTriangle size={12} />
                      Modified
                    </div>
                  )}
                  {clause.status === 'Missing' && (
                    <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      <XCircle size={12} />
                      Missing
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/80">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Audit Findings
                </span>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {clause.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
