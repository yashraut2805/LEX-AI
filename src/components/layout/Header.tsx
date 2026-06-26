import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sun, 
  Moon, 
  Bot, 
  UploadCloud, 
  FileText,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isAIAssistantOpen, 
  setIsAIAssistantOpen 
}) => {
  const { 
    currentView, 
    setCurrentView,
    theme, 
    setTheme, 
    documents, 
    selectedDocumentId, 
    setSelectedDocumentId 
  } = useApp();

  const activeDoc = documents.find(d => d.id === selectedDocumentId);

  // Format page titles nicely
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Legal Operations Dashboard';
      case 'contract-analysis': return 'Active Contract Review';
      case 'upload': return 'Ingest Legal Documents';
      case 'clause-verification': return 'Clause Verification Auditor';
      case 'risk-analysis': return 'Risk & Exposure Assessment';
      case 'missing-checklist': return 'Missing Clause Audit Checklist';
      case 'memo-generator': return 'AI Legal Memorandum Generator';
      case 'defined-terms': return 'Extracted Defined Terms';
      case 'obligation-tracker': return 'Extracted Obligations & Tasks';
      case 'comparison': return 'Side-by-Side Multi-Contract Compare';
      case 'settings': return 'System Settings & Ollama Config';
      default: return 'LexAI Intelligence';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-300">
      
      {/* Title / Info Section */}
      <div>
        <h1 className="text-[16px] font-bold text-slate-800 dark:text-zinc-100 font-sans tracking-wide">
          {getPageTitle()}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        
        {/* Active Document Selector Dropdown */}
        {documents.length > 0 && (
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
              <FileText size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 max-w-[180px] truncate">
                {activeDoc ? activeDoc.name : 'Select Document'}
              </span>
              <ChevronDown size={12} className="text-slate-400" />
            </div>
            
            {/* Dropdown Items list */}
            <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 hidden group-hover:block hover:block z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-900 mb-1">
                Select Active Document
              </div>
              <div className="max-h-60 overflow-y-auto">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocumentId(doc.id)}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors ${
                      doc.id === selectedDocumentId 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/40 dark:bg-blue-950/20' 
                        : 'text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="truncate pr-2">{doc.name}</span>
                    <span className="text-[9px] text-slate-400 flex-shrink-0">{doc.pages} p.</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 dark:border-zinc-900 mt-1.5 pt-1 px-1">
                <button
                  onClick={() => setCurrentView('upload')}
                  className="w-full text-left px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <UploadCloud size={14} />
                  Upload New Document
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Floating Side AI assistant toggle */}
        <button
          onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isAIAssistantOpen 
              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
              : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Toggle Legal AI Assistant Sidebar"
        >
          <Bot size={16} />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

      </div>
    </header>
  );
};
