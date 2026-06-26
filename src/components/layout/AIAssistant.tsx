import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  X,
  FileText
} from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { 
    chatMessages, 
    sendChatMessage, 
    clearChat, 
    documents, 
    selectedDocumentId, 
    ollamaStatus,
    ollamaModel
  } = useApp();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeDoc = documents.find(d => d.id === selectedDocumentId);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    
    const queryText = input;
    setInput('');
    setSending(true);
    await sendChatMessage(queryText);
    setSending(false);
  };

  const handleQuickQuestion = async (question: string) => {
    if (sending) return;
    setSending(true);
    await sendChatMessage(question);
    setSending(false);
  };

  if (!isOpen) return null;

  const quickQuestions = activeDoc ? [
    `What is the governing law in ${activeDoc.name}?`,
    `Summarize the key liabilities/caps in this contract.`,
    `Are there any missing clauses in ${activeDoc.name}?`,
    `Explain the termination conditions.`,
  ] : [
    "Upload a document to begin analysis.",
    "What capabilities does LexAI have?"
  ];

  return (
    <div className="w-80 md:w-96 h-screen sticky top-0 flex flex-col bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 transition-colors duration-300 z-30 shadow-2xl">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
              Legal Assistant
              <Sparkles size={12} className="text-amber-500 animate-pulse" />
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`h-1.5 w-1.5 rounded-full ${
                ollamaStatus === 'connected' ? 'bg-emerald-500' : 
                ollamaStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
              }`} />
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium truncate max-w-[140px]">
                {ollamaStatus === 'connected' ? `Ollama: ${ollamaModel}` : 'AI: Local Emulator'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={clearChat}
            disabled={chatMessages.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
            title="Clear Chat History"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Active Document Attachment Info banner */}
      <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText size={14} className="text-blue-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">
            {activeDoc ? activeDoc.name : 'No Document Attached'}
          </span>
        </div>
        {activeDoc && (
          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono">
            {activeDoc.pages} pages
          </span>
        )}
      </div>

      {/* Chat Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-slate-50/30 dark:bg-zinc-900/10">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4 space-y-4">
            <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 animate-bounce">
              <Bot size={28} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-zinc-200">
                Ask about the active contract
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-[240px]">
                I can review liability caps, explain governing laws, verify obligations, and scan for missing clauses.
              </p>
            </div>

            {/* Quick Questions suggestions */}
            <div className="w-full pt-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 text-left">
                Suggested Prompts
              </p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  disabled={!activeDoc || sending}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-blue-300 dark:hover:border-blue-800 text-xs text-slate-600 dark:text-zinc-300 transition-all font-sans leading-relaxed disabled:opacity-60 disabled:pointer-events-none"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-md shadow-blue-500/20">
                    <Bot size={14} />
                  </div>
                )}
                
                <div 
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-premium ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-zinc-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {sending && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                  <Bot size={14} className="animate-spin" />
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-slate-400 flex items-center gap-1.5 shadow-premium">
                  <span>Reading document clauses</span>
                  <span className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Warning if Ollama not running locally */}
      {ollamaStatus !== 'connected' && chatMessages.length > 0 && (
        <div className="mx-4 mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex gap-2">
          <AlertCircle size={14} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-normal">
            Local Ollama server is offline. Assistant is currently operating in high-fidelity mock legal simulation mode. Run Ollama locally to stream live models.
          </p>
        </div>
      )}

      {/* Input container */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending || !activeDoc}
            placeholder={activeDoc ? "Ask a contract query..." : "Please attach a document..."}
            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-3 pl-3.5 pr-12 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending || !activeDoc}
            className="absolute right-1.5 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:hover:bg-blue-600"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};
