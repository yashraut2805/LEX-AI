import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarClock, 
  Search, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const ObligationTracker: React.FC = () => {
  const { documents, selectedDocumentId, setDocuments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Fulfilled'>('All');
  
  const doc = documents.find(d => d.id === selectedDocumentId);

  const handleStatusChange = (index: number, newStatus: 'Active' | 'Pending' | 'Fulfilled') => {
    if (!doc) return;
    setDocuments((prevDocs) =>
      prevDocs.map((d) => {
        if (d.id === doc.id) {
          const updatedObligations = d.obligations.map((o, i) =>
            i === index ? { ...o, status: newStatus } : o
          );
          return { ...d, obligations: updatedObligations };
        }
        return d;
      })
    );
  };

  if (!doc) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400">
          <CalendarClock size={32} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">No Document Selected</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            Please upload or select an active document in the header to review its extracted obligations.
          </p>
        </div>
      </div>
    );
  }

  // Filter logic
  const filteredObligations = doc.obligations.filter(ob => {
    const matchesSearch = ob.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ob.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ob.deadline.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ob.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <CalendarClock size={22} className="text-blue-500" />
            Extracted Obligations Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Analyzing: <span className="font-semibold text-slate-700 dark:text-zinc-300">{doc.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Active Duties: {doc.obligations.filter(o => o.status === 'Active').length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search actions */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-premium">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs flex items-center">
          <Search size={14} className="absolute left-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search obligations or responsible parties..."
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3.5 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {(['All', 'Active', 'Pending', 'Fulfilled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Obligations Grid View */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6 w-16 text-center">Done</th>
                <th className="py-4 px-6 w-1/4">Responsible Party</th>
                <th className="py-4 px-6 w-1/2">Task Description</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
              {filteredObligations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-zinc-500 font-sans">
                    No obligations discovered for this search layout.
                  </td>
                </tr>
              ) : (
                filteredObligations.map((ob, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/30 dark:hover:bg-zinc-950/20 transition-colors ${ob.status === 'Fulfilled' ? 'opacity-50 line-through' : ''}`}>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={ob.status === 'Fulfilled'}
                        onChange={(e) => handleStatusChange(idx, e.target.checked ? 'Fulfilled' : 'Active')}
                        className="h-4 w-4 rounded border-slate-300 dark:border-zinc-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700 dark:text-zinc-200">
                        {ob.party}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-zinc-300 font-sans leading-relaxed">
                      {ob.task}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 dark:text-zinc-400">
                      {ob.deadline}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={ob.status}
                        onChange={(e) => handleStatusChange(idx, e.target.value as 'Active' | 'Pending' | 'Fulfilled')}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase border cursor-pointer focus:outline-none transition-all ${
                          ob.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30' :
                          ob.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30' :
                          'bg-slate-100 dark:bg-zinc-850 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Fulfilled">Fulfilled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
