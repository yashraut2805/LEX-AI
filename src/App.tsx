import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AIAssistant } from './components/layout/AIAssistant';



// Pages
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { DocumentAnalysis } from './pages/DocumentAnalysis';
import { ClauseVerification } from './pages/ClauseVerification';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { DefinedTerms } from './pages/DefinedTerms';
import { ObligationTracker } from './pages/ObligationTracker';
import { MemoGenerator } from './pages/MemoGenerator';
import { Comparison } from './pages/Comparison';
import { LexCaseResearch } from './pages/LexCaseResearch';
import { Settings } from './pages/Settings';
import { NegotiationAssistant } from './pages/NegotiationAssistant';
import { TemplatesLibrary } from './pages/TemplatesLibrary';
import { ESignIntegration } from './pages/ESignIntegration';
import { LimitationTracker } from './pages/LimitationTracker';
import ClientPortal from './pages/ClientPortal';
import ApprovalWorkflows from './pages/ApprovalWorkflows';

const AppContent: React.FC = () => {
  const { currentView } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(true);

  // Render active page
  const renderView = () => {
    switch (currentView) {
      case 'client-portal':
  return <ClientPortal />;
case 'approval-workflows':
  return <ApprovalWorkflows />;
      case 'negotiation-assistant':
  return <NegotiationAssistant />;
case 'templates-library':
  return <TemplatesLibrary />;
case 'esign-integration':
  return <ESignIntegration />;
case 'limitation-tracker':
  return <LimitationTracker />;
      case 'dashboard':
        return <Dashboard />;
      case 'contract-analysis':
      case 'missing-checklist':
        return <DocumentAnalysis />;
      case 'upload':
        return <Upload />;
      case 'clause-verification':
        return <ClauseVerification />;
      case 'risk-analysis':
        return <RiskAnalysis />;
      case 'defined-terms':
        return <DefinedTerms />;
      case 'obligation-tracker':
        return <ObligationTracker />;
      case 'memo-generator':
        return <MemoGenerator />;
      case 'comparison':
        return <Comparison />;
      case 'lexcase-research':
        return <LexCaseResearch />;  
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-300 font-sans">
      {/* Sidebar navigation */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        toggleAIAssistant={() => setAiAssistantOpen(!aiAssistantOpen)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
          isAIAssistantOpen={aiAssistantOpen}
          setIsAIAssistantOpen={setAiAssistantOpen}
        />
        
        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin bg-slate-50/50 dark:bg-zinc-950/40">
          {renderView()}
        </main>
      </div>

      {/* Persistent AI Assistant Sidebar */}
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onClose={() => setAiAssistantOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
