import React, { useState } from 'react';
import {
  Timer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Sparkles,
  Bell,
  BellOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  TrendingUp,
  Shield,
  Flame,
  XCircle
} from 'lucide-react';
// ─── Types ────────────────────────────────────────────────────────────────────

type Urgency = 'expired' | 'critical' | 'warning' | 'safe';

interface LimitationPeriod {
  id: string;
  clauseTitle: string;
  document: string;
  actReference: string;
  actSection: string;
  period: string;
  startDate: string;
  expiryDate: string;
  daysLeft: number;
  urgency: Urgency;
  alertEnabled: boolean;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PERIODS: LimitationPeriod[] = [
  {
    id: 'l1',
    clauseTitle: 'Breach of Contract Claim',
    document: 'Software Services Agreement — Acme Corp.pdf',
    actReference: 'Limitation Act, 1963',
    actSection: 'Article 55',
    period: '3 Years',
    startDate: '15 Jun 2022',
    expiryDate: '15 Jun 2025',
    daysLeft: -12,
    urgency: 'expired',
    alertEnabled: true,
    description: 'Limitation period for filing a suit for breach of contract under the Limitation Act. The clock starts from the date the breach occurred or was discovered.',
  },
  {
    id: 'l2',
    clauseTitle: 'Recovery of Money (Invoice Dispute)',
    document: 'Vendor Master Agreement — Infra Supplies Ltd.pdf',
    actReference: 'Limitation Act, 1963',
    actSection: 'Article 26',
    period: '3 Years',
    startDate: '01 Jul 2022',
    expiryDate: '01 Jul 2025',
    daysLeft: 4,
    urgency: 'critical',
    alertEnabled: true,
    description: 'Period for recovery of money advanced under a written contract. Begins on the date the money became due and payable.',
  },
  {
    id: 'l3',
    clauseTitle: 'IP Infringement Claim',
    document: 'SaaS Licensing Agreement — TechBridge.pdf',
    actReference: 'Copyright Act, 1957',
    actSection: 'Section 62(2)',
    period: '3 Years',
    startDate: '10 Mar 2024',
    expiryDate: '10 Mar 2027',
    daysLeft: 23,
    urgency: 'warning',
    alertEnabled: false,
    description: 'Period for filing a civil suit for infringement of copyright or related rights under the Copyright Act.',
  },
  {
    id: 'l4',
    clauseTitle: 'Arbitration Reference',
    document: 'Joint Venture Agreement — BrightPath.pdf',
    actReference: 'Limitation Act, 1963',
    actSection: 'Article 137',
    period: '3 Years',
    startDate: '05 Jan 2024',
    expiryDate: '05 Jan 2027',
    daysLeft: 64,
    urgency: 'warning',
    alertEnabled: true,
    description: 'Limitation for reference to arbitration where the arbitration clause is invoked after a dispute arises under the contract.',
  },
  {
    id: 'l5',
    clauseTitle: 'Security Deposit Refund Claim',
    document: 'Commercial Lease — Whitefield Office.pdf',
    actReference: 'Limitation Act, 1963',
    actSection: 'Article 26',
    period: '3 Years',
    startDate: '20 Apr 2023',
    expiryDate: '20 Apr 2026',
    daysLeft: 297,
    urgency: 'safe',
    alertEnabled: false,
    description: 'Period for claiming refund of security deposit after lease termination. Begins from the date of expiry of the lease term.',
  },
  {
    id: 'l6',
    clauseTitle: 'Indemnity Claim (Third-Party Suit)',
    document: 'Outsourcing Agreement — Alpha Corp.pdf',
    actReference: 'Limitation Act, 1963',
    actSection: 'Article 55',
    period: '3 Years',
    startDate: '30 Aug 2023',
    expiryDate: '30 Aug 2026',
    daysLeft: 430,
    urgency: 'safe',
    alertEnabled: true,
    description: 'Period for filing indemnity claim against counterparty following resolution of a third-party suit covered under the contract.',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const urgencyConfig: Record<Urgency, { label: string; color: string; bg: string; dot: string; icon: React.ElementType }> = {
  expired: {
    label: 'Expired',
    color: 'text-slate-500 dark:text-zinc-500',
    bg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700',
    dot: 'bg-slate-400',
    icon: XCircle,
  },
  critical: {
    label: 'Critical',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30',
    dot: 'bg-rose-500',
    icon: Flame,
  },
  warning: {
    label: 'Warning',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30',
    dot: 'bg-amber-500',
    icon: AlertTriangle,
  },
  safe: {
    label: 'Safe',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
  },
};

// ─── Period Card ──────────────────────────────────────────────────────────────

function PeriodCard({ period, onToggleAlert }: { period: LimitationPeriod; onToggleAlert: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = urgencyConfig[period.urgency];
  const Icon = cfg.icon;

  const daysDisplay =
    period.daysLeft < 0
      ? `Expired ${Math.abs(period.daysLeft)} days ago`
      : period.daysLeft === 0
      ? 'Expires today'
      : `${period.daysLeft} days left`;

  const progressPct = Math.max(0, Math.min(100, ((period.daysLeft) / (365 * 3)) * 100));

  return (
    <div className={`bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
      period.urgency === 'critical' ? 'border-rose-200 dark:border-rose-900/40' :
      period.urgency === 'expired' ? 'border-slate-200 dark:border-zinc-800 opacity-70' :
      'border-slate-200 dark:border-zinc-800'
    }`}>
      {/* Header */}
      <button
        className="w-full text-left p-5 hover:bg-slate-50/60 dark:hover:bg-zinc-950/30 transition-colors flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
          <Icon size={17} />
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">{period.clauseTitle}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${period.urgency === 'critical' ? 'animate-pulse' : ''}`} />
              {cfg.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{period.document}</p>
          <div className="flex flex-wrap gap-3 text-[11px]">
            <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1"><Calendar size={11} /> Expires {period.expiryDate}</span>
            <span className={`font-bold ${cfg.color}`}>{daysDisplay}</span>
            <span className="text-slate-400 dark:text-zinc-500">{period.actReference} · {period.actSection}</span>
          </div>
          {/* Time bar */}
          <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                period.urgency === 'critical' ? 'bg-rose-500' :
                period.urgency === 'warning' ? 'bg-amber-500' :
                period.urgency === 'expired' ? 'bg-slate-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${period.urgency === 'expired' ? 100 : progressPct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleAlert(period.id); }}
            className={`p-2 rounded-xl transition-colors ${period.alertEnabled ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500'}`}
            title={period.alertEnabled ? 'Disable alert' : 'Enable alert'}
          >
            {period.alertEnabled ? <Bell size={14} /> : <BellOff size={14} />}
          </button>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-zinc-800 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Limitation Period', value: period.period },
              { label: 'Start Date', value: period.startDate },
              { label: 'Expiry Date', value: period.expiryDate },
              { label: 'Act Reference', value: `${period.actReference} — ${period.actSection}` },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={10} className="text-violet-500" /> AI Explanation
            </p>
            <div className="p-3.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/20">
              <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">{period.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[11px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <ExternalLink size={12} /> View Act Section
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[11px] font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
              <Calendar size={12} /> Add to Calendar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[11px] font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
              <FileText size={12} /> View Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const LimitationTracker: React.FC = () => {
  const [filter, setFilter] = useState<'all' | Urgency>('all');
  const [periods, setPeriods] = useState(PERIODS);

  const handleToggleAlert = (id: string) => {
    setPeriods((prev) => prev.map((p) => p.id === id ? { ...p, alertEnabled: !p.alertEnabled } : p));
  };

  const counts = {
    expired: periods.filter((p) => p.urgency === 'expired').length,
    critical: periods.filter((p) => p.urgency === 'critical').length,
    warning: periods.filter((p) => p.urgency === 'warning').length,
    safe: periods.filter((p) => p.urgency === 'safe').length,
  };

  const filtered = filter === 'all' ? periods : periods.filter((p) => p.urgency === filter);

  // Sort: expired → critical → warning → safe
  const urgencyOrder: Urgency[] = ['expired', 'critical', 'warning', 'safe'];
  const sorted = [...filtered].sort((a, b) => urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-zinc-950 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/50 border border-amber-700/50 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              <Timer size={12} />
              Module 1.12 — Limitation Periods
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Limitation Periods Tracker</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Auto-detected limitation periods from your contracts. Track expiry dates, view Limitation Act references, and never miss a deadline.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg shadow-amber-500/10 self-start md:self-center">
            <Sparkles size={14} /> Re-scan Documents
          </button>
        </div>
      </div>

      {/* Critical alert banner */}
      {counts.critical > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
          <Flame size={18} className="text-rose-600 dark:text-rose-400 animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
              {counts.critical} critical limitation period{counts.critical > 1 ? 's' : ''} expiring within 7 days
            </p>
            <p className="text-[11px] text-rose-500 dark:text-rose-400">Immediate action required. Review and file before the deadline.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Expired', value: counts.expired, icon: Clock, color: 'text-slate-500 dark:text-zinc-400', bg: 'bg-slate-100 dark:bg-zinc-800' },
          { label: 'Critical (≤7 days)', value: counts.critical, icon: Flame, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' },
          { label: 'Warning (≤90 days)', value: counts.warning, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { label: 'Safe', value: counts.safe, icon: Shield, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}><Icon size={15} /></div>
              </div>
              <div className="mt-4"><span className="text-2xl font-black text-slate-800 dark:text-zinc-100">{s.value}</span></div>
            </div>
          );
        })}
      </div>

      {/* Filter + list */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <TrendingUp size={15} className="text-amber-500" /> Detected Limitation Periods
          </h3>
          <div className="flex gap-2 flex-wrap items-center">
            <Filter size={13} className="text-slate-400 dark:text-zinc-500" />
            {(['all', 'critical', 'warning', 'expired', 'safe'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                  filter === f
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {f === 'all' ? `All (${periods.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f as Urgency] ?? 0})`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {sorted.map((p) => (
            <PeriodCard key={p.id} period={p} onToggleAlert={handleToggleAlert} />
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-zinc-500 space-y-2">
              <Timer size={28} className="mx-auto opacity-30" />
              <p className="text-sm font-semibold">No periods in this category.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
