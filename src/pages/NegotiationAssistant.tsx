import React, { useState } from 'react';
import {
  Handshake,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  RotateCcw,
  Send,
  Clock,
  FileText,
  Sparkles,
  Scale,
  Shield,
  TrendingDown,
  Copy,
  Check
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Negotiability = 'negotiable' | 'non-negotiable' | 'conditional';
type Severity = 'high' | 'medium' | 'low';

interface HistoryEntry {
  id: string;
  round: number;
  party: 'us' | 'them';
  text: string;
  timestamp: string;
}

interface Clause {
  id: string;
  title: string;
  original: string;
  negotiability: Negotiability;
  severity: Severity;
  reason: string;
  counterProposal?: string;
  history: HistoryEntry[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CLAUSES: Clause[] = [
  {
    id: 'c1',
    title: 'Limitation of Liability',
    original:
      'In no event shall either party be liable for indirect, incidental, special, or consequential damages, even if advised of the possibility of such damages.',
    negotiability: 'negotiable',
    severity: 'high',
    reason:
      'This clause significantly caps our exposure. Counterparty may push for mutual caps. Recommend proposing a tiered liability structure tied to contract value.',
    counterProposal:
      'Liability for direct damages shall be capped at the total fees paid in the twelve (12) months preceding the claim. Consequential damages remain excluded except in cases of gross negligence or wilful misconduct.',
    history: [
      {
        id: 'h1',
        round: 1,
        party: 'them',
        text: 'Liability cap set at total contract value.',
        timestamp: '10 Jun 2025, 2:30 PM',
      },
      {
        id: 'h2',
        round: 2,
        party: 'us',
        text: 'Proposed 12-month fee cap with carve-out for gross negligence.',
        timestamp: '12 Jun 2025, 11:00 AM',
      },
    ],
  },
  {
    id: 'c2',
    title: 'Governing Law & Jurisdiction',
    original:
      'This Agreement shall be governed by the laws of the State of Delaware, USA, and disputes shall be settled exclusively in courts located in Wilmington, Delaware.',
    negotiability: 'conditional',
    severity: 'medium',
    reason:
      'Jurisdiction clause favors counterparty\'s home turf. Can be renegotiated to include arbitration in a neutral venue such as Singapore or India.',
    counterProposal:
      'This Agreement shall be governed by the laws of India. Any dispute shall be referred to binding arbitration under the ICC Rules in Singapore, conducted in English.',
    history: [
      {
        id: 'h3',
        round: 1,
        party: 'them',
        text: 'Delaware courts, Delaware law.',
        timestamp: '10 Jun 2025, 2:30 PM',
      },
    ],
  },
  {
    id: 'c3',
    title: 'Intellectual Property Ownership',
    original:
      'All work product, inventions, and deliverables created under this Agreement shall be the sole and exclusive property of the Client.',
    negotiability: 'non-negotiable',
    severity: 'high',
    reason:
      'Our legal team has marked this as non-negotiable from our side. Any deviation risks losing control of proprietary methodologies embedded in deliverables.',
    history: [],
  },
  {
    id: 'c4',
    title: 'Payment Terms',
    original:
      'Invoices shall be payable within 90 days of receipt. Late payments shall accrue interest at 0.5% per month.',
    negotiability: 'negotiable',
    severity: 'low',
    reason:
      '90-day payment terms are unfavorable for cash flow. Industry standard is 30–45 days. Interest rate is also below market.',
    counterProposal:
      'Invoices shall be payable within 30 days of receipt. Late payments shall accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is lower.',
    history: [],
  },
  {
    id: 'c5',
    title: 'Confidentiality Obligations',
    original:
      'Each party agrees to hold the other\'s Confidential Information in strict confidence for a period of 2 years following termination of this Agreement.',
    negotiability: 'negotiable',
    severity: 'medium',
    reason:
      '2-year confidentiality period may be insufficient for trade secrets. Standard practice in tech and legal sectors is 5 years or perpetuity for specific categories.',
    counterProposal:
      'Confidentiality obligations shall survive for 5 years post-termination, and in perpetuity with respect to trade secrets as defined under the Indian Trade Secrets Act.',
    history: [],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const negotiabilityConfig: Record<Negotiability, { label: string; color: string; icon: React.ElementType }> = {
  negotiable: {
    label: 'Negotiable',
    color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    icon: CheckCircle,
  },
  'non-negotiable': {
    label: 'Non-Negotiable',
    color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    icon: XCircle,
  },
  conditional: {
    label: 'Conditional',
    color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    icon: AlertTriangle,
  },
};

const severityConfig: Record<Severity, { label: string; dot: string }> = {
  high: { label: 'High', dot: 'bg-rose-500' },
  medium: { label: 'Medium', dot: 'bg-amber-500' },
  low: { label: 'Low', dot: 'bg-emerald-500' },
};

function ClauseCard({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [counterText, setCounterText] = useState(clause.counterProposal ?? '');
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(clause.history);

  const neg = negotiabilityConfig[clause.negotiability];
  const sev = severityConfig[clause.severity];
  const NegIcon = neg.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(counterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    const entry: HistoryEntry = {
      id: `h${Date.now()}`,
      round: history.length + 1,
      party: 'us',
      text: note.trim(),
      timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setHistory([...history, entry]);
    setNote('');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200">
      {/* Header row */}
      <button
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-slate-50/60 dark:hover:bg-zinc-950/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">{clause.title}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${neg.color}`}>
              <NegIcon size={10} />
              {neg.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
              <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
              {sev.label} Severity
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{clause.original}</p>
        </div>
        <div className="mt-1 flex-shrink-0 text-slate-400 dark:text-zinc-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-zinc-800 p-5 space-y-5">
          {/* Original text */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Original Clause</p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800">
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{clause.original}</p>
            </div>
          </div>

          {/* AI reasoning */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={10} className="text-violet-500" /> AI Analysis
            </p>
            <div className="p-3.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/20">
              <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">{clause.reason}</p>
            </div>
          </div>

          {/* Counter proposal — only for negotiable / conditional */}
          {clause.negotiability !== 'non-negotiable' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Counter-Proposal</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                className="w-full p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 text-xs text-slate-700 dark:text-zinc-200 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                rows={4}
                value={counterText}
                onChange={(e) => setCounterText(e.target.value)}
                placeholder="Edit or write a counter-proposal..."
              />
            </div>
          )}

          {/* Negotiation history */}
          <div className="space-y-2">
            <button
              className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              onClick={() => setShowHistory(!showHistory)}
            >
              <Clock size={11} />
              Negotiation History ({history.length})
              {showHistory ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>

            {showHistory && (
              <div className="space-y-2 pl-3 border-l-2 border-slate-100 dark:border-zinc-800">
                {history.length === 0 && (
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">No history yet.</p>
                )}
                {history.map((entry) => (
                  <div key={entry.id} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${entry.party === 'us' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
                        Round {entry.round} · {entry.party === 'us' ? 'Our Position' : 'Their Position'}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500">{entry.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">{entry.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add note to history */}
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a negotiation note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const NegotiationAssistant: React.FC = () => {
  const [filter, setFilter] = useState<'all' | Negotiability>('all');
  const [reanalysing, setReanalysing] = useState(false);

  const filtered =
    filter === 'all' ? MOCK_CLAUSES : MOCK_CLAUSES.filter((c) => c.negotiability === filter);

  const counts = {
    negotiable: MOCK_CLAUSES.filter((c) => c.negotiability === 'negotiable').length,
    'non-negotiable': MOCK_CLAUSES.filter((c) => c.negotiability === 'non-negotiable').length,
    conditional: MOCK_CLAUSES.filter((c) => c.negotiability === 'conditional').length,
  };

  const handleReanalyse = async () => {
    setReanalysing(true);
    // Simulate re-analysis
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setReanalysing(false);
    alert('Negotiation intelligence re-analysis complete! All counter-proposals refreshed.');
  };

  const handleExportReport = () => {
    const reportText = `NEGOTIATION INTELLIGENCE REPORT
Generated on: ${new Date().toLocaleString()}
--------------------------------------------
${MOCK_CLAUSES.map(c => `
Clause: ${c.title}
Severity: ${c.severity.toUpperCase()}
Negotiability: ${c.negotiability.toUpperCase()}

Original text:
"${c.original}"

Recommendation / Reason:
${c.reason}

Suggested Counter-Proposal:
${c.counterProposal || 'N/A'}
--------------------------------------------`).join('\n')}`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Negotiation_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-zinc-950 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
              <Handshake size={12} />
              Module 1.6 — Negotiation Intelligence
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Negotiation Assistant
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Review every clause flagged by AI — see what's negotiable, generate counter-proposals, and track the full negotiation history in one place.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <button 
              onClick={handleReanalyse}
              disabled={reanalysing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw size={14} className={reanalysing ? 'animate-spin' : ''} />
              {reanalysing ? 'Re-analysing...' : 'Re-analyse'}
            </button>
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              <FileText size={14} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clauses', value: MOCK_CLAUSES.length, icon: Scale, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Negotiable', value: counts.negotiable, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { label: 'Non-Negotiable', value: counts['non-negotiable'], icon: Shield, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' },
          { label: 'Conditional', value: counts.conditional, icon: TrendingDown, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={15} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs + clause list */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-500" />
            Clause Negotiability Review
          </h3>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'negotiable', 'non-negotiable', 'conditional'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {f === 'all' ? `All (${MOCK_CLAUSES.length})` : f === 'non-negotiable' ? `Non-Neg. (${counts['non-negotiable']})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((clause) => (
            <ClauseCard key={clause.id} clause={clause} />
          ))}
        </div>
      </div>

    </div>
  );
};
