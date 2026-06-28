import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Server, 
  Database, 
  Sun, 
  Moon, 
  Link, 
  Activity, 
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Cpu,
  Type
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    fontFamily,
    setFontFamily,
    ollamaUrl, 
    setOllamaUrl, 
    ollamaModel, 
    setOllamaModel, 
    ollamaStatus,
    checkOllamaConnection,
    availableModels
  } = useApp();

  const [testLoading, setTestLoading] = useState(false);
  const [modelInput, setModelInput] = useState(ollamaModel);
  const [urlInput, setUrlInput] = useState(ollamaUrl);
  const [dbPath, setDbPath] = useState('chromadb://localhost:8000');

  const handleTestConnection = async () => {
    setTestLoading(true);
    setOllamaUrl(urlInput);
    setOllamaModel(modelInput);
    // Perform checking
    await new Promise(r => setTimeout(r, 1200));
    await checkOllamaConnection();
    setTestLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <SettingsIcon size={22} className="text-blue-500" />
          LexAI Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Configure local Ollama server parameters, database paths, and platform preferences.
        </p>
      </div>

      {/* Grid Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column - navigation tabs */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
            <button className="w-full text-left px-3.5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-2.5 transition-all">
              <Cpu size={16} />
              AI Inference Server
            </button>
            <button className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-950 text-xs flex items-center gap-2.5 transition-all">
              <Database size={16} />
              Vector Database (RAG)
            </button>
            <button className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-950 text-xs flex items-center gap-2.5 transition-all">
              <SettingsIcon size={16} />
              General Preferences
            </button>
          </div>

          {/* Connection status card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm text-center space-y-3">
            <div className="flex justify-center">
              <div className={`p-3 rounded-full ${
                ollamaStatus === 'connected' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' :
                ollamaStatus === 'checking' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 animate-pulse' :
                'bg-rose-50 dark:bg-rose-950/20 text-rose-500'
              }`}>
                {ollamaStatus === 'connected' ? <Wifi size={24} /> : <WifiOff size={24} />}
              </div>
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-zinc-200">
                {ollamaStatus === 'connected' ? 'Inference Engine Online' : 
                 ollamaStatus === 'checking' ? 'Testing Connection...' : 'Inference Engine Offline'}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                Endpoint: {ollamaUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns - parameters form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section A - Ollama parameters */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Cpu size={16} className="text-blue-500" />
              Ollama Server Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Ollama URL Address
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Model Parameter Name
                </label>
                <input
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  list="ollama-models"
                  placeholder="Select or type your model, e.g. qwen2.5-coder:7b"
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <datalist id="ollama-models">
                  {availableModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-normal mt-1">
                  💡 <strong>Google Colab Integration:</strong> Expose your Colab Ollama port <code>11434</code> (e.g. via ngrok/Cloudflare), paste the public tunnel url above, and select/type your custom fine-tuned model.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleTestConnection}
                  disabled={testLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 transition-colors cursor-pointer"
                >
                  {testLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Testing Ping...
                    </>
                  ) : (
                    <>
                      <Activity size={14} />
                      Verify and Save Config
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section B - Database / RAG path */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Database size={16} className="text-blue-500" />
              Vector Database (ChromaDB / pgvector)
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Vector DB Endpoint
                  </label>
                  <span className="text-[8px] font-black uppercase bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                    Future Ready
                  </span>
                </div>
                <input
                  type="text"
                  value={dbPath}
                  onChange={(e) => setDbPath(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-500 dark:text-zinc-500 focus:outline-none cursor-not-allowed transition-all"
                  disabled
                />
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block leading-normal">
                  LexAI is modular. ChromaDB local embedding storage settings will sync here automatically once python RAG integrations are launched.
                </span>
              </div>
            </div>
          </div>

          {/* Section C - Theme preference */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <SettingsIcon size={16} className="text-blue-500" />
              General Preferences
            </h3>
            
            <div className="flex items-center justify-between text-xs py-1.5">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-zinc-200 block">Visual Interface Theme</span>
                <span className="text-slate-400 dark:text-zinc-500">Toggle dark and light colors.</span>
              </div>
              <div className="flex bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
                  }`}
                >
                  <Sun size={14} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-zinc-900 text-blue-400 shadow-sm' 
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
                  }`}
                >
                  <Moon size={14} />
                </button>
              </div>
            </div>

            {/* Typography selection preference */}
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-zinc-200 block flex items-center gap-1.5">
                  <Type size={14} className="text-blue-500" />
                  Interface Typography Font
                </span>
                <span className="text-slate-400 dark:text-zinc-500">Select custom font styles for visual layout.</span>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Inter">Inter (Default Clean Sans)</option>
                  <option value="Outfit">Outfit (Modern Geometric)</option>
                  <option value="System Sans">System Sans (Default System)</option>
                  <option value="Times New Roman">Times New Roman (Traditional Legal)</option>
                  <option value="Georgia">Georgia (Elegant Serif)</option>
                  <option value="Playfair Display">Playfair Display (Stylized Serif)</option>
                  <option value="Lora">Lora (Elegant Editorial)</option>
                  <option value="Poppins">Poppins (Friendly Rounded)</option>
                  <option value="Roboto">Roboto (Neo-Grotesque)</option>
                  <option value="Merriweather">Merriweather (Readable Serif)</option>
                  <option value="Fira Code">Fira Code (Developer Monospace)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
