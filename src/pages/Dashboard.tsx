import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  FileWarning, 
  Sparkles, 
  Upload, 
  FileCode, 
  BrainCircuit, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { stats, documents, setSelectedDocumentId, setCurrentView } = useApp();

  const statItems = [
    { name: 'Contracts Analysed', value: stats.contractsAnalysed, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', view: 'contract-analysis' },
    { name: 'Risks Found', value: stats.risksFound, icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20', view: 'risk-analysis' },
    { name: 'Clauses Verified', value: `${stats.clausesVerified}%`, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', view: 'clause-verification' },
    { name: 'Missing Clauses', value: stats.missingClausesCount, icon: FileWarning, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', view: 'missing-checklist' },
    { name: 'AI Reports Generated', value: stats.reportsGenerated, icon: BrainCircuit, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/20', view: 'memo-generator' }
  ];

  const quickActions = [
    { title: 'Upload & Scan', desc: 'Ingest contract, verify standard clauses & metadata.', icon: Upload, view: 'upload', color: 'border-blue-200 dark:border-blue-900/40 hover:border-blue-500' },
    { title: 'Run Risk Audit', desc: 'Scan for high-severity legal exposure risks.', icon: AlertTriangle, view: 'risk-analysis', color: 'border-rose-200 dark:border-rose-900/40 hover:border-rose-500' },
    { title: 'Generate Legal Memo', desc: 'Draft AI-powered internal executive summaries.', icon: FileText, view: 'memo-generator', color: 'border-violet-200 dark:border-violet-900/40 hover:border-violet-500' },
    { title: 'Compare Contracts', desc: 'Upload two agreements to spot additions/removals.', icon: FileCode, view: 'comparison', color: 'border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-500' }
  ];

  const handleSelectDoc = (id: string, view: string) => {
    setSelectedDocumentId(id);
    setCurrentView(view);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-zinc-950 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" />
              Ollama & Qwen Local Inference
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
              Welcome to LexAI Legal Intelligence
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed">
              Analyze contracts, identify hidden risks, dictionary-match defined terms, and audit missing clauses. Protect your organization with local, secure, privacy-first legal AI.
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('upload')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg shadow-blue-500/10 cursor-pointer self-start md:self-center"
          >
            <Upload size={16} />
            SCAN NEW AGREEMENT
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <button 
              key={idx} 
              onClick={() => setCurrentView(stat.view)}
              className="w-full text-left bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-premium dark:hover:shadow-dark-premium hover:border-blue-500 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 tracking-tight">
                  {stat.value}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col - Quick Actions & Charts */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Quick Actions Grid */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              Quick Intelligence Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentView(action.view)}
                    className={`text-left p-4 rounded-2xl border bg-slate-50/50 dark:bg-zinc-950/40 flex items-start gap-4 transition-all duration-300 cursor-pointer ${action.color}`}
                  >
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-blue-500 shadow-sm flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200">
                        {action.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
                        {action.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Contracts Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Recent Documents & Status
              </h3>
              <button 
                onClick={() => setCurrentView('upload')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Document Name</th>
                    <th className="pb-3 px-4">Size</th>
                    <th className="pb-3 px-4">Pages</th>
                    <th className="pb-3 px-4">Uploaded</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Audit Panels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 group">
                      <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-zinc-300 truncate max-w-[200px] flex items-center gap-2">
                        <FileText size={14} className="text-blue-500" />
                        {doc.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">{doc.size}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 font-semibold">{doc.pages}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">{doc.uploadDate}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          doc.status === 'Analyzed' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' :
                          doc.status === 'Processing' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 animate-pulse' :
                          'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${
                            doc.status === 'Analyzed' ? 'bg-emerald-500' :
                            doc.status === 'Processing' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSelectDoc(doc.id, 'contract-analysis')}
                            className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold text-[10px] hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleSelectDoc(doc.id, 'risk-analysis')}
                            className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-[10px] hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                          >
                            Risks
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col - Risk Metrics & Quick Help */}
        <div className="space-y-6">
          
          {/* Risk Breakdown Heat Ring */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                Audit Risk Ratios
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
                Analysis ratio of high vs low severity legal exposure.
              </p>
            </div>
            
            <div className="my-6 flex flex-col items-center justify-center relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="54" className="stroke-slate-100 dark:stroke-zinc-800" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="54" className="stroke-rose-500" strokeWidth="8" fill="transparent" strokeDasharray="339.29" strokeDashoffset={339.29 - (339.29 * 0.35)} strokeLinecap="round" />
                <circle cx="64" cy="64" r="54" className="stroke-amber-500" strokeWidth="8" fill="transparent" strokeDasharray="339.29" strokeDashoffset={339.29 - (339.29 * 0.15)} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-800 dark:text-zinc-100">35%</span>
                <span className="text-[9px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">High Risk</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-zinc-400">High Risk Clauses</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-zinc-200">5 Issues</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-zinc-400">Medium Risk Clauses</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-zinc-200">3 Issues</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-slate-600 dark:text-zinc-400">Low Risk Clauses</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-zinc-200">6 Issues</span>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white space-y-4 shadow-lg shadow-blue-600/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/10">
                <BrainCircuit size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs tracking-wider uppercase">Local AI Model Running</h4>
                <p className="text-[10px] text-blue-100">Fine-Tuned for Law & Contracts</p>
              </div>
            </div>
            <p className="text-xs text-blue-100 font-sans leading-relaxed">
              LexAI is configured to process all agreements securely on your machine. Ensure Ollama is running and your fine-tuned model (e.g., Qwen-Legal) is loaded. Toggle settings to sync.
            </p>
            <button 
              onClick={() => setCurrentView('settings')}
              className="w-full py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-colors font-bold text-xs tracking-wider cursor-pointer"
            >
              MANAGE OLLAMA CONFIG
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
