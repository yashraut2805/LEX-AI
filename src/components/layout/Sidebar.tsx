import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileSearch, 
  UploadCloud, 
  FileCheck2, 
  ShieldAlert, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  CalendarClock, 
  Columns, 
  Bot, 
  Settings,
  BookOpenCheck,
  Scale,
  ChevronLeft,
  ChevronRight,
  Handshake,
  LayoutTemplate,
  PenTool,
  Timer,
  Users,
  GitMerge
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleAIAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, toggleAIAssistant }) => {
  const { currentView, setCurrentView } = useApp();

  const menuSections = [
    {
      label: 'Core',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'contract-analysis', name: 'Contract Analysis', icon: FileSearch },
        { id: 'upload', name: 'Upload Documents', icon: UploadCloud },
        { id: 'clause-verification', name: 'Clause Verification', icon: FileCheck2 },
        { id: 'risk-analysis', name: 'Risk Analysis', icon: ShieldAlert },
        { id: 'missing-checklist', name: 'Missing Clause Checklist', icon: CheckSquare },
        { id: 'memo-generator', name: 'Memo Generator', icon: FileText },
        { id: 'defined-terms', name: 'Defined Terms Dictionary', icon: BookOpen },
        { id: 'obligation-tracker', name: 'Obligation Tracker', icon: CalendarClock },
        { id: 'comparison', name: 'Multi Contract Comparison', icon: Columns },
      ],
    },
    {
      label: 'Contracts+',
      items: [
        { id: 'negotiation-assistant', name: 'Negotiation Assistant', icon: Handshake },
        { id: 'templates-library', name: 'Templates Library', icon: LayoutTemplate },
        { id: 'esign-integration', name: 'eSign Integration', icon: PenTool },
        { id: 'limitation-tracker', name: 'Limitation Tracker', icon: Timer },
      ],
    },
    {
      label: 'LexCase',
      items: [
        { id: 'client-portal', name: 'Client Portal', icon: Users },
        { id: 'approval-workflows', name: 'Approval Workflows', icon: GitMerge },
        { id: 'lexcase-research', name: 'Bare Acts Browser', icon: BookOpenCheck },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'ai-assistant', name: 'AI Legal Assistant', icon: Bot, action: toggleAIAssistant },
        { id: 'settings', name: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <div 
      className={`h-screen sticky top-0 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Platform Logo Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Scale size={20} className="transform rotate-12" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-sans">
              Lex<span className="text-blue-500">AI</span>
            </span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin">
        {menuSections.map((section) => (
          <div key={section.label}>
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {section.label}
              </p>
            )}
            {collapsed && (
              <div className="border-t border-slate-800 my-2" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setCurrentView(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/10' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`} 
                    />
                    
                    {!collapsed && (
                      <span className="text-[14px] tracking-wide transition-opacity duration-300 truncate">
                        {item.name}
                      </span>
                    )}

                    {/* Tooltip for collapsed sidebar */}
                    {collapsed && (
                      <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-950 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-800 shadow-xl">
                        {item.name}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Version footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Local Fine-Tuned Qwen
          </div>
          <p className="text-[10px] text-slate-600 mt-1">LexAI v1.1.0-alpha</p>
        </div>
      )}
    </div>
  );
};
