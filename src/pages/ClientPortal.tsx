import React, { useState, useRef } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  Star,
  MoreVertical,
  Upload,
  Eye,
  Building2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Types ──────────────────────────────────────────────────────────────────
interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: 'Individual' | 'Corporate' | 'Government';
  status: 'Active' | 'Inactive' | 'Pending';
  matters: number;
  lastActivity: string;
  priority: 'High' | 'Normal' | 'Low';
  totalDocuments: number;
  initials: string;
  color: string;
}

interface Matter {
  id: string;
  clientId: string;
  title: string;
  type: string;
  status: 'Open' | 'In Review' | 'Closed';
  dueDate: string;
  assignedTo: string;
  documentsCount: number;
}

// ── Static Data ────────────────────────────────────────────────────────────
const CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Rajesh Mehta',
    company: 'Mehta Infra Pvt. Ltd.',
    email: 'r.mehta@mehtainfra.in',
    phone: '+91 98201 44321',
    type: 'Corporate',
    status: 'Active',
    matters: 4,
    lastActivity: '2 hours ago',
    priority: 'High',
    totalDocuments: 18,
    initials: 'RM',
    color: '#6366f1',
  },
  {
    id: 'c2',
    name: 'Priya Nair',
    company: 'Nair & Associates',
    email: 'priya@nairassoc.com',
    phone: '+91 98765 11230',
    type: 'Individual',
    status: 'Active',
    matters: 2,
    lastActivity: '1 day ago',
    priority: 'Normal',
    totalDocuments: 7,
    initials: 'PN',
    color: '#8b5cf6',
  },
  {
    id: 'c3',
    name: 'MMRDA Legal Cell',
    company: 'Maharashtra Metro Rail Dev. Authority',
    email: 'legal@mmrda.gov.in',
    phone: '+91 22-2610 5505',
    type: 'Government',
    status: 'Active',
    matters: 7,
    lastActivity: '3 days ago',
    priority: 'High',
    totalDocuments: 42,
    initials: 'MM',
    color: '#0ea5e9',
  },
  {
    id: 'c4',
    name: 'Sahil Khanna',
    company: 'Khanna Retail Ltd.',
    email: 's.khanna@khannaretail.com',
    phone: '+91 99304 88123',
    type: 'Corporate',
    status: 'Pending',
    matters: 1,
    lastActivity: '5 days ago',
    priority: 'Normal',
    totalDocuments: 3,
    initials: 'SK',
    color: '#f59e0b',
  },
  {
    id: 'c5',
    name: 'Ananya Iyer',
    company: 'Self-Employed',
    email: 'ananya.iyer@gmail.com',
    phone: '+91 89560 22134',
    type: 'Individual',
    status: 'Inactive',
    matters: 0,
    lastActivity: '2 months ago',
    priority: 'Low',
    totalDocuments: 2,
    initials: 'AI',
    color: '#10b981',
  },
];

const MATTERS: Matter[] = [
  { id: 'm1', clientId: 'c1', title: 'Land Acquisition Agreement – Pune SEZ', type: 'Contract', status: 'Open', dueDate: 'Jul 10, 2026', assignedTo: 'Yash R.', documentsCount: 6 },
  { id: 'm2', clientId: 'c1', title: 'Contractor Liability Dispute', type: 'Litigation', status: 'In Review', dueDate: 'Jul 25, 2026', assignedTo: 'Mrudul P.', documentsCount: 4 },
  { id: 'm3', clientId: 'c3', title: 'Metro Line 3 PPP Concession Agreement', type: 'Contract', status: 'Open', dueDate: 'Aug 5, 2026', assignedTo: 'Yash R.', documentsCount: 12 },
  { id: 'm4', clientId: 'c2', title: 'Property Partition Deed', type: 'Property', status: 'In Review', dueDate: 'Jul 15, 2026', assignedTo: 'Parth V.', documentsCount: 3 },
  { id: 'm5', clientId: 'c3', title: 'Tender NIT Compliance Review', type: 'Compliance', status: 'Open', dueDate: 'Jul 8, 2026', assignedTo: 'Mrudul P.', documentsCount: 8 },
];

// ── Sub-components ─────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Inactive: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    Pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Open: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    'In Review': 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
    Closed: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || ''}`}>
      {status}
    </span>
  );
};

const PriorityDot: React.FC<{ priority: string }> = ({ priority }) => {
  const color = priority === 'High' ? 'bg-red-400' : priority === 'Normal' ? 'bg-blue-400' : 'bg-slate-500';
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1.5`} />;
};

// ─── Modal Dialog Components ────────────────────────────────────────────────

interface AddClientModalProps {
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'initials' | 'color' | 'matters' | 'totalDocuments' | 'lastActivity' | 'status'>) => void;
}

function AddClientModal({ onClose, onSubmit }: AddClientModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'Individual' | 'Corporate' | 'Government'>('Corporate');
  const [priority, setPriority] = useState<'High' | 'Normal' | 'Low'>('Normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name.');
      return;
    }
    onSubmit({ name, company: company || 'Self-Employed', email, phone, type, priority });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100">Add New Client</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">Register a new client profile in the portal database.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Company / Organisation</label>
            <input
              type="text"
              placeholder="e.g. Mehta Infra Pvt. Ltd."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Email</label>
              <input
                type="email"
                required
                placeholder="client@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Phone</label>
              <input
                type="text"
                required
                placeholder="+91 98201 XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Client Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-2.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Corporate">Corporate</option>
                <option value="Individual">Individual</option>
                <option value="Government">Government</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-2.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddMatterModalProps {
  onClose: () => void;
  onSubmit: (title: string, type: string, assignedTo: string, dueDate: string) => void;
}

function AddMatterModal({ onClose, onSubmit }: AddMatterModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Contract');
  const [assignedTo, setAssignedTo] = useState('Yash R.');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert('Please fill in the matter title and select a due date.');
      return;
    }
    onSubmit(title, type, assignedTo, dueDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100">Add New Matter</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">Initialize a new project or case matter for this client.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Matter Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Pune Metro Concession Deed Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-2.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Contract">Contract</option>
                <option value="Litigation">Litigation</option>
                <option value="Property">Property</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Assigned Attorney</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-2.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Yash R.">Yash R.</option>
                <option value="Mrudul P.">Mrudul P.</option>
                <option value="Parth V.">Parth V.</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              Create Matter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



interface ClientMessage {
  id: string;
  clientId: string;
  from: string;
  text: string;
  time: string;
  unread: boolean;
}

const INITIAL_MESSAGES: ClientMessage[] = [
  { id: 'msg1', clientId: 'c1', from: 'Rajesh Mehta', text: 'Please review the updated clause 12 draft and share your comments.', time: '2 days ago', unread: true },
  { id: 'msg2', clientId: 'c1', from: 'You', text: 'Reviewed. The indemnity clause needs strengthening under Section 9.', time: '3 days ago', unread: false },
  { id: 'msg3', clientId: 'c1', from: 'Rajesh Mehta', text: 'Understood. Can we schedule a call this week?', time: '4 days ago', unread: false },
  { id: 'msg4', clientId: 'c2', from: 'Priya Nair', text: 'Hi, did you get a chance to check the Partition Deed drafts?', time: '1 day ago', unread: true },
  { id: 'msg5', clientId: 'c2', from: 'You', text: 'Yes, looking over the schedule of properties now.', time: '1 day ago', unread: false },
];

// ── Main Component ─────────────────────────────────────────────────────────
const ClientPortal: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [matters, setMatters] = useState<Matter[]>(MATTERS);
  const [messages, setMessages] = useState<ClientMessage[]>(INITIAL_MESSAGES);
  const [newMessageText, setNewMessageText] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddMatter, setShowAddMatter] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedClient, setSelectedClient] = useState<Client | null>(CLIENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive' | 'Pending'>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'matters' | 'documents' | 'messages'>('overview');

  const handleAddClientSubmit = (newClientInfo: Omit<Client, 'id' | 'initials' | 'color' | 'matters' | 'totalDocuments' | 'lastActivity' | 'status'>) => {
    const initials = newClientInfo.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    const colors = ['#6366f1', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899'];
    const color = colors[clients.length % colors.length];

    const newClient: Client = {
      ...newClientInfo,
      id: `c-${Date.now()}`,
      initials,
      color,
      status: 'Active',
      matters: 0,
      totalDocuments: 0,
      lastActivity: 'Just now'
    };

    setClients([newClient, ...clients]);
    setSelectedClient(newClient);
    setShowAddClient(false);
    alert(`Successfully registered client profile for "${newClient.name}"!`);
  };

  const handleAddMatterSubmit = (title: string, type: string, assignedTo: string, dueDate: string) => {
    if (!selectedClient) return;

    const newMatter: Matter = {
      id: `m-${Date.now()}`,
      clientId: selectedClient.id,
      title,
      type,
      status: 'Open',
      dueDate: new Date(dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      assignedTo,
      documentsCount: 0
    };

    setMatters([newMatter, ...matters]);
    
    // Update matters count for selected client
    setClients(prevClients => 
      prevClients.map(c => 
        c.id === selectedClient.id ? { ...c, matters: c.matters + 1 } : c
      )
    );
    
    // Update the selected client state as well
    setSelectedClient(prev => prev ? { ...prev, matters: prev.matters + 1 } : null);
    setShowAddMatter(false);
    alert(`Successfully created new matter "${title}"!`);
  };

  const handleDocumentUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDocumentUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;

    setClients(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...c, totalDocuments: c.totalDocuments + 1, lastActivity: 'Just now' } : c
    ));
    setSelectedClient(prev => prev ? { ...prev, totalDocuments: prev.totalDocuments + 1, lastActivity: 'Just now' } : null);

    alert(`Successfully uploaded "${file.name}" for client ${selectedClient.name}!`);
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !selectedClient) return;

    const newMsg: ClientMessage = {
      id: `msg-${Date.now()}`,
      clientId: selectedClient.id,
      from: 'You',
      text: newMessageText,
      time: 'Just now',
      unread: false
    };

    setMessages([...messages, newMsg]);
    setNewMessageText('');
  };

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const clientMatters = matters.filter((m) => m.clientId === selectedClient?.id);
  const clientMessages = messages.filter((msg) => msg.clientId === selectedClient?.id);

  const bg = isDark ? 'bg-[#0f1117]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#161b2e]' : 'bg-white';
  const border = isDark ? 'border-white/8' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-[#1e2436] border-white/10 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';
  const hoverRow = isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';
  const selectedRow = isDark ? 'bg-indigo-500/10 border-l-2 border-indigo-400' : 'bg-indigo-50 border-l-2 border-indigo-500';

  return (
    <div className={`flex h-full ${bg} overflow-hidden`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleDocumentUploadFile}
        className="hidden"
      />

      {/* ── Left Panel: Client List ─────────────────────────────────── */}
      <div className={`w-80 flex-shrink-0 border-r ${border} flex flex-col`}>
        {/* Header */}
        <div className={`px-4 pt-5 pb-3 border-b ${border}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-semibold ${textPrimary}`}>Client Portal</h2>
            <button 
              onClick={() => setShowAddClient(true)}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={13} />
              Add Client
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-sm pl-8 pr-3 py-2 rounded-lg border ${inputBg} outline-none focus:ring-1 focus:ring-indigo-500/50`}
            />
          </div>
          {/* Filter pills */}
          <div className="flex gap-1.5 mt-2.5">
            {(['All', 'Active', 'Pending', 'Inactive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors font-medium cursor-pointer ${
                  filterStatus === s
                    ? 'bg-indigo-600 text-white'
                    : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`px-4 py-3 cursor-pointer transition-all ${
                selectedClient?.id === client.id ? selectedRow : hoverRow
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: client.color }}
                >
                  {client.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium truncate ${textPrimary}`}>{client.name}</span>
                    <StatusBadge status={client.status} />
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${textMuted}`}>{client.company}</p>
                  <div className={`flex items-center gap-3 mt-1.5 text-xs ${textMuted}`}>
                    <span className="flex items-center gap-1">
                      <Briefcase size={10} />
                      {client.matters} matters
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {client.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats footer */}
        <div className={`px-4 py-3 border-t ${border} grid grid-cols-3 gap-2`}>
          {[
            { label: 'Total', val: clients.length, icon: Users },
            { label: 'Active', val: clients.filter((c) => c.status === 'Active').length, icon: CheckCircle },
            { label: 'Pending', val: clients.filter((c) => c.status === 'Pending').length, icon: AlertCircle },
          ].map(({ label, val, icon: Icon }) => (
            <div key={label} className={`rounded-lg p-2 text-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <p className={`text-lg font-bold ${textPrimary}`}>{val}</p>
              <p className={`text-xs ${textMuted}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Client Detail ──────────────────────────────── */}
      {selectedClient ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Client Header */}
          <div className={`px-6 pt-5 pb-4 border-b ${border}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: selectedClient.color }}
                >
                  {selectedClient.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className={`text-xl font-semibold ${textPrimary}`}>{selectedClient.name}</h1>
                    <StatusBadge status={selectedClient.status} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-white/8 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                      {selectedClient.type}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 mt-1 text-sm ${textMuted}`}>
                    <span className="flex items-center gap-1.5">
                      <Building2 size={13} />
                      {selectedClient.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} />
                      {selectedClient.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} />
                      {selectedClient.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDocumentUploadClick}
                  className={`p-2 rounded-lg border ${border} ${textMuted} ${hoverRow} transition-colors cursor-pointer`}
                  title="Upload client document"
                >
                  <Upload size={15} />
                </button>
                <button className={`p-2 rounded-lg border ${border} ${textMuted} ${hoverRow} transition-colors`}>
                  <MoreVertical size={15} />
                </button>
                <button 
                  onClick={() => setShowAddMatter(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  New Matter
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Active Matters', value: clientMatters.filter(m => m.status !== 'Closed').length, icon: Briefcase, color: 'text-indigo-400' },
                { label: 'Documents', value: selectedClient.totalDocuments, icon: FileText, color: 'text-violet-400' },
                { label: 'Messages', value: clientMessages.length, icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Priority', value: selectedClient.priority, icon: Star, color: selectedClient.priority === 'High' ? 'text-red-400' : 'text-slate-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className={`rounded-xl p-3 border ${border} ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className={color} />
                    <span className={`text-xs ${textMuted}`}>{label}</span>
                  </div>
                  <p className={`text-lg font-semibold ${textPrimary}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className={`flex gap-0 mt-4 border-b -mb-4 ${border}`}>
              {(['overview', 'matters', 'documents', 'messages'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-400'
                      : `border-transparent ${textMuted} hover:text-slate-200`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-5">
                {/* Recent Activity */}
                <div className={`rounded-xl border ${border} ${cardBg} p-5 col-span-2`}>
                  <h3 className={`text-sm font-semibold mb-4 ${textPrimary}`}>Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Document uploaded', detail: `Land_Acquisition_Draft_${selectedClient.initials}.pdf`, time: 'Just now', icon: Upload, color: 'text-indigo-400 bg-indigo-500/10' },
                      { action: 'Matter status updated', detail: 'Contractor Liability Dispute → In Review', time: '1d ago', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10' },
                      { action: 'New message received', detail: 'Re: Review comments on Clause 12', time: '2d ago', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10' },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-white/3' : 'bg-gray-50'}`}>
                        <div className={`p-1.5 rounded-lg ${item.color}`}>
                          <item.icon size={13} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${textPrimary}`}>{item.action}</p>
                          <p className={`text-xs ${textMuted} mt-0.5`}>{item.detail}</p>
                        </div>
                        <span className={`text-xs ${textMuted}`}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
                  <h3 className={`text-sm font-semibold mb-4 ${textPrimary}`}>Contact Details</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Mail, label: 'Email', value: selectedClient.email },
                      { icon: Phone, label: 'Phone', value: selectedClient.phone },
                      { icon: Building2, label: 'Organisation', value: selectedClient.company },
                      { icon: Calendar, label: 'Last Active', value: selectedClient.lastActivity },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <Icon size={14} className={textMuted} />
                        <div>
                          <p className={`text-xs ${textMuted}`}>{label}</p>
                          <p className={`text-sm ${textPrimary}`}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matters Summary */}
                <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
                  <h3 className={`text-sm font-semibold mb-4 ${textPrimary}`}>Active Matters</h3>
                  <div className="space-y-2.5">
                    {clientMatters.length === 0 && (
                      <p className={`text-sm ${textMuted}`}>No matters assigned yet.</p>
                    )}
                    {clientMatters.map((m) => (
                      <div key={m.id} className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-white/3' : 'bg-gray-50'}`}>
                        <div>
                          <p className={`text-sm font-medium ${textPrimary} truncate max-w-[200px]`}>{m.title}</p>
                          <p className={`text-xs ${textMuted}`}>{m.type} · Due {m.dueDate}</p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matters' && (
              <div className="space-y-3">
                {clientMatters.length === 0 ? (
                  <div className={`text-center py-16 ${textMuted}`}>
                    <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No matters for this client yet.</p>
                    <button 
                      onClick={() => setShowAddMatter(true)}
                      className="mt-3 text-indigo-400 text-sm hover:underline cursor-pointer"
                    >
                      + Create first matter
                    </button>
                  </div>
                ) : (
                  clientMatters.map((m) => (
                    <div key={m.id} className={`rounded-xl border ${border} ${cardBg} p-4 flex items-center gap-4 ${hoverRow} cursor-pointer transition-colors`}>
                      <div className={`p-2.5 rounded-xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                        <Briefcase size={16} className="text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${textPrimary}`}>{m.title}</p>
                        <div className={`flex items-center gap-3 mt-1 text-xs ${textMuted}`}>
                          <span>{m.type}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Calendar size={10} /> {m.dueDate}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><FileText size={10} /> {m.documentsCount} docs</span>
                          <span>·</span>
                          <span>Assigned: {m.assignedTo}</span>
                        </div>
                      </div>
                      <StatusBadge status={m.status} />
                      <ChevronRight size={14} className={textMuted} />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                <div className="flex justify-end mb-2">
                  <button 
                    onClick={handleDocumentUploadClick}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload size={13} />
                    Upload Document
                  </button>
                </div>
                {selectedClient.totalDocuments === 0 ? (
                  <p className={`text-center py-16 text-sm ${textMuted}`}>No documents uploaded yet.</p>
                ) : (
                  Array.from({ length: selectedClient.totalDocuments }).map((_, i) => (
                    <div key={i} className={`rounded-xl border ${border} ${cardBg} p-4 flex items-center gap-3 ${hoverRow} cursor-pointer transition-colors`}>
                      <FileText size={16} className="text-violet-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${textPrimary}`}>Document_{i + 1}_{selectedClient.initials}.pdf</p>
                        <p className={`text-xs ${textMuted} mt-0.5`}>Uploaded recently · 1.2 MB</p>
                      </div>
                      <button className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/8' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                        <Eye size={13} className={textMuted} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                {clientMessages.length === 0 ? (
                  <p className={`text-center py-8 text-sm ${textMuted}`}>No messages yet. Send a message to start the thread.</p>
                ) : (
                  clientMessages.map((msg, i) => (
                    <div key={i} className={`rounded-xl border ${border} ${cardBg} p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white`}
                            style={{ backgroundColor: msg.from === 'You' ? '#6366f1' : selectedClient.color }}>
                            {msg.from === 'You' ? 'Y' : selectedClient.initials}
                          </div>
                          <span className={`text-sm font-medium ${textPrimary}`}>{msg.from}</span>
                          {msg.unread && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                        </div>
                        <span className={`text-xs ${textMuted}`}>{msg.time}</span>
                      </div>
                      <p className={`text-sm ${textMuted} pl-9`}>{msg.text}</p>
                    </div>
                  ))
                )}
                {/* Reply box */}
                <div className={`rounded-xl border ${border} ${cardBg} p-4`}>
                  <textarea
                    rows={3}
                    placeholder="Type a message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={`w-full text-sm rounded-lg border ${inputBg} p-3 outline-none resize-none focus:ring-1 focus:ring-indigo-500/50`}
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleSendMessage}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center ${textMuted}`}>
          <div className="text-center">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a client to view details</p>
          </div>
        </div>
      )}

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onSubmit={handleAddClientSubmit}
        />
      )}

      {showAddMatter && (
        <AddMatterModal
          onClose={() => setShowAddMatter(false)}
          onSubmit={handleAddMatterSubmit}
        />
      )}
    </div>
  );
};

export default ClientPortal;
