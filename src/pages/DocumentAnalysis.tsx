import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Layers, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ShieldAlert,
  Search,
  BookOpen,
  Info,
  CalendarDays,
  GitBranch
} from 'lucide-react';
import { CitationNetworkPanel } from '../components/CitationNetworkPanel';

export const DocumentAnalysis: React.FC = () => {
  const { documents, selectedDocumentId } = useApp();
  const [activeTab, setActiveTab] = useState<'summary' | 'clauses' | 'risks' | 'missing' | 'obligations' | 'definitions'>('summary');
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [activeCitationCase, setActiveCitationCase] = useState<string | null>(null);

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
            Please upload or select an active document in the header to review its analysis details.
          </p>
        </div>
      </div>
    );
  }

  const handleHighlight = (text: string) => {
    setHighlightedText(text);
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Info },
    { id: 'clauses', label: 'Clauses', icon: Layers },
    { id: 'risks', label: 'Risks', icon: AlertTriangle },
    { id: 'missing', label: 'Missing', icon: HelpCircle },
    { id: 'obligations', label: 'Obligations', icon: CalendarDays },
    { id: 'definitions', label: 'Definitions', icon: BookOpen }
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col xl:flex-row gap-6 overflow-hidden">
      
      {/* Left Panel - Document Viewer */}
      <div className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col overflow-hidden">
        
        {/* Document Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText size={16} className="text-blue-500 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
              {doc.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded font-mono">
              OCR Status: VERIFIED
            </span>
          </div>
        </div>

        {/* Document Text Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-600 dark:text-zinc-300 select-text scrollbar-thin">
          <div className="space-y-4 max-w-none">
            {doc.rawText.split('\n').map((paragraph, idx) => {
              const isHighlighted = highlightedText && paragraph.toLowerCase().includes(highlightedText.toLowerCase());
              return (
                <p 
                  key={idx} 
                  className={`p-2 rounded transition-all duration-300 ${
                    isHighlighted 
                      ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-slate-900 dark:text-yellow-100 ring-2 ring-yellow-400 border-l-4 border-yellow-500 shadow-md font-semibold' 
                      : 'border-l-4 border-transparent hover:border-slate-200 dark:hover:border-zinc-800'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 dark:text-zinc-600 select-none mr-4 font-mono inline-block w-4">
                    {idx + 1}
                  </span>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - AI Analysis Tabs */}
      <div className="w-full xl:w-[480px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col overflow-hidden shadow-premium">
        
        {/* Navigation Tabs bar */}
        <div className="flex border-b border-slate-100 dark:border-zinc-800 overflow-x-auto scrollbar-none bg-slate-50/50 dark:bg-zinc-900/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setHighlightedText(null); // Clear highlights when changing tabs
                }}
                className={`flex-1 min-w-[80px] py-3.5 flex flex-col items-center gap-1.5 border-b-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900' 
                    : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents Viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
                <h4 className="font-bold text-xs text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                  <Info size={14} />
                  Executive Abstract
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {doc.summary.overview}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Contract Metadata
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950/20">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">Signing Date</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">{doc.summary.date}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950/20">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">Governing Jurisdiction</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">{doc.summary.jurisdiction}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold mb-1.5">Contracting Parties</span>
                  <div className="space-y-1.5">
                    {doc.summary.parties.map((party, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {party}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clauses Tab */}
          {activeTab === 'clauses' && (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-normal">
                Click a card to highlight the matching clause text in the contract viewer.
              </p>
              {doc.clauses.map((clause, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleHighlight(clause.text.substring(0, 35))}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-800 hover:shadow-premium bg-white dark:bg-zinc-900 cursor-pointer transition-all duration-200 group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {clause.type}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      clause.status === 'Present' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
                      clause.status === 'Modified' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' :
                      'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      {clause.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-sans line-clamp-2">
                    {clause.text}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 border-t border-slate-100 dark:border-zinc-800 pt-2">
                    <span>Audit Explanation</span>
                    <span className="font-semibold text-slate-600 dark:text-zinc-400">Confidence: {clause.confidence}%</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCitationCase(clause.type);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <GitBranch size={12} />
                    View Citation Network
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Risks Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-3">
              {doc.risks.map((risk, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm space-y-2.5 ${
                    risk.level === 'High' ? 'border-rose-100 dark:border-rose-950/30' :
                    risk.level === 'Medium' ? 'border-amber-100 dark:border-amber-950/30' :
                    'border-blue-100 dark:border-blue-950/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                      {risk.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      risk.level === 'High' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400' :
                      risk.level === 'Medium' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                      'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {risk.description}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950/40 text-[10px] text-slate-600 dark:text-zinc-300">
                    <span className="font-bold block mb-0.5">Recommendation:</span>
                    {risk.recommendation}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 text-right">
                    Ref: {risk.reference}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Missing Tab */}
          {activeTab === 'missing' && (
            <div className="space-y-3">
              {doc.missingClauses.map((clause, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                      {clause.type}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      clause.criticality === 'High' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400' :
                      clause.criticality === 'Medium' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                      'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                    }`}>
                      Crit: {clause.criticality}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {clause.description}
                  </p>
                  <div className="p-3 rounded-lg bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 text-[10px] text-blue-900 dark:text-blue-300 font-mono">
                    <span className="font-bold font-sans block mb-1">Standard Propose Text:</span>
                    "{clause.typicalText}"
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Obligations Tab */}
          {activeTab === 'obligations' && (
            <div className="space-y-3">
              {doc.obligations.map((ob, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                      {ob.party}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      ob.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
                      ob.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' :
                      'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                    }`}>
                      {ob.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-zinc-200 font-sans font-medium">
                    {ob.task}
                  </p>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                    <span className="font-bold">Deadline:</span> {ob.deadline}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Definitions Tab */}
          {activeTab === 'definitions' && (
            <div className="space-y-3">
              {doc.definitions.map((def, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleHighlight(def.term)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-800 bg-white dark:bg-zinc-900 hover:shadow-premium cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                      {def.term}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500">
                      Page {def.page}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
                    {def.definition}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {activeCitationCase && (
        <CitationNetworkPanel
          caseName={activeCitationCase}
          onClose={() => setActiveCitationCase(null)}
        />
      )}

    </div>
  );
};
