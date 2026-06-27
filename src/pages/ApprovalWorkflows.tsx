import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  User,
  FileText,
  ArrowRight,
  MoreVertical,
  Filter,
  Plus,
  RefreshCw,
  Stamp,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  Circle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Types ──────────────────────────────────────────────────────────────────
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Review' | 'Escalated';
type Priority = 'Urgent' | 'High' | 'Normal' | 'Low';

interface Approver {
  name: string;
  role: string;
  status: 'Waiting' | 'Approved' | 'Rejected' | 'Current';
  time?: string;
  comment?: string;
}

interface ApprovalItem {
  id: string;
  title: string;
  documentType: string;
  clientName: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  status: ApprovalStatus;
  priority: Priority;
  stage: number;
  totalStages: number;
  approvers: Approver[];
  summary: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

// ── Static Data ────────────────────────────────────────────────────────────
const APPROVALS: ApprovalItem[] = [
  {
    id: 'ap1',
    title: 'Metro Line 3 PPP Concession Agreement',
    documentType: 'Contract',
    clientName: 'MMRDA Legal Cell',
    submittedBy: 'Yash Raut',
    submittedDate: 'Jun 24, 2026',
    dueDate: 'Jul 3, 2026',
    status: 'In Review',
    priority: 'Urgent',
    stage: 2,
    totalStages: 4,
    riskLevel: 'High',
    summary: 'A ₹18,000 Cr PPP concession agreement for Mumbai Metro extension. Requires legal sign-off before tendering closes.',
    approvers: [
      { name: 'Parth Vibhute', role: 'Junior Associate', status: 'Approved', time: 'Jun 25', comment: 'Clause 7 and 12 verified. Looks good.' },
      { name: 'Mrudul Patil', role: 'Senior Associate', status: 'Current', time: undefined, comment: undefined },
      { name: 'External Counsel', role: 'Infrastructure Expert', status: 'Waiting' },
      { name: 'Managing Partner', role: 'Final Signatory', status: 'Waiting' },
    ],
  },
  {
    id: 'ap2',
    title: 'Land Acquisition Agreement – Pune SEZ',
    documentType: 'Contract',
    clientName: 'Mehta Infra Pvt. Ltd.',
    submittedBy: 'Yash Raut',
    submittedDate: 'Jun 22, 2026',
    dueDate: 'Jul 10, 2026',
    status: 'Pending',
    priority: 'High',
    stage: 1,
    totalStages: 3,
    riskLevel: 'Medium',
    summary: 'Land acquisition agreement for a 120-acre SEZ in Pune. Key risk: missing indemnity clause for government delay.',
    approvers: [
      { name: 'Parth Vibhute', role: 'Junior Associate', status: 'Current' },
      { name: 'Mrudul Patil', role: 'Senior Associate', status: 'Waiting' },
      { name: 'Managing Partner', role: 'Final Signatory', status: 'Waiting' },
    ],
  },
  {
    id: 'ap3',
    title: 'Contractor Liability Dispute – Settlement Deed',
    documentType: 'Settlement',
    clientName: 'Mehta Infra Pvt. Ltd.',
    submittedBy: 'Mrudul Patil',
    submittedDate: 'Jun 20, 2026',
    dueDate: 'Jun 30, 2026',
    status: 'Escalated',
    priority: 'Urgent',
    stage: 3,
    totalStages: 3,
    riskLevel: 'High',
    summary: 'Settlement deed for contractor dispute. Escalated due to disagreement on liability quantum between parties.',
    approvers: [
      { name: 'Parth Vibhute', role: 'Junior Associate', status: 'Approved', time: 'Jun 20', comment: 'Standard terms met.' },
      { name: 'Mrudul Patil', role: 'Senior Associate', status: 'Approved', time: 'Jun 21', comment: 'Risk flagged — needs partner sign-off urgently.' },
      { name: 'Managing Partner', role: 'Final Signatory', status: 'Current' },
    ],
  },
  {
    id: 'ap4',
    title: 'Property Partition Deed',
    documentType: 'Deed',
    clientName: 'Priya Nair',
    submittedBy: 'Parth Vibhute',
    submittedDate: 'Jun 18, 2026',
    dueDate: 'Jun 28, 2026',
    status: 'Approved',
    priority: 'Normal',
    stage: 3,
    totalStages: 3,
    riskLevel: 'Low',
    summary: 'Completed partition deed for residential property. All clauses verified with standard terms.',
    approvers: [
      { name: 'Parth Vibhute', role: 'Junior Associate', status: 'Approved', time: 'Jun 19', comment: 'No issues found.' },
      { name: 'Mrudul Patil', role: 'Senior Associate', status: 'Approved', time: 'Jun 20', comment: 'Signed off.' },
      { name: 'Managing Partner', role: 'Final Signatory', status: 'Approved', time: 'Jun 22', comment: 'Approved.' },
    ],
  },
  {
    id: 'ap5',
    title: 'Tender NIT Compliance Review',
    documentType: 'Compliance',
    clientName: 'MMRDA Legal Cell',
    submittedBy: 'Mrudul Patil',
    submittedDate: 'Jun 25, 2026',
    dueDate: 'Jul 8, 2026',
    status: 'Pending',
    priority: 'High',
    stage: 1,
    totalStages: 2,
    riskLevel: 'Medium',
    summary: 'NIT compliance check for metro tender. Two sections flagged for regulatory alignment under MoRTH guidelines.',
    approvers: [
      { name: 'Parth Vibhute', role: 'Junior Associate', status: 'Current' },
      { name: 'Managing Partner', role: 'Final Signatory', status: 'Waiting' },
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────
const StatusIcon: React.FC<{ status: ApprovalStatus }> = ({ status }) => {
  switch (status) {
    case 'Approved': return <CheckCircle size={14} className="text-emerald-400" />;
    case 'Rejected': return <XCircle size={14} className="text-red-400" />;
    case 'In Review': return <RefreshCw size={14} className="text-blue-400" />;
    case 'Escalated': return <AlertCircle size={14} className="text-red-400" />;
    default: return <Clock size={14} className="text-amber-400" />;
  }
};

const StatusBadge: React.FC<{ status: ApprovalStatus | string }> = ({ status }) => {
  const map: Record<string, string> = {
    Pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Approved: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
    'In Review': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    Escalated: 'bg-red-500/15 text-red-400 border border-red-500/30',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || ''}`}>
      {status}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const map: Record<Priority, string> = {
    Urgent: 'bg-red-500/15 text-red-400 border border-red-500/30',
    High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    Normal: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[priority]}`}>
      {priority}
    </span>
  );
};

const RiskBadge: React.FC<{ level: 'High' | 'Medium' | 'Low' }> = ({ level }) => {
  const map = {
    High: 'text-red-400',
    Medium: 'text-amber-400',
    Low: 'text-emerald-400',
  };
  return <span className={`text-xs font-medium ${map[level]}`}>● {level} Risk</span>;
};

// Approval Pipeline (stage tracker)
const ApprovalPipeline: React.FC<{ approvers: Approver[]; isDark: boolean; textPrimary: string; textMuted: string }> = ({
  approvers, isDark, textPrimary, textMuted
}) => (
  <div className="flex items-start gap-0 relative mt-4">
    {approvers.map((a, i) => {
      const isLast = i === approvers.length - 1;
      const dotColor =
        a.status === 'Approved' ? 'bg-emerald-500 border-emerald-500'
          : a.status === 'Rejected' ? 'bg-red-500 border-red-500'
          : a.status === 'Current' ? 'bg-indigo-500 border-indigo-400 ring-2 ring-indigo-500/30'
          : isDark ? 'bg-transparent border-slate-600' : 'bg-transparent border-gray-300';

      return (
        <div key={i} className="flex-1 flex flex-col items-center relative">
          {/* Connector line */}
          {!isLast && (
            <div className={`absolute top-3 left-1/2 w-full h-px ${
              a.status === 'Approved' ? 'bg-emerald-500/50' : isDark ? 'bg-white/10' : 'bg-gray-200'
            }`} />
          )}
          {/* Dot */}
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${dotColor} mb-2`}>
            {a.status === 'Approved' && <CheckCircle size={11} className="text-white" />}
            {a.status === 'Rejected' && <XCircle size={11} className="text-white" />}
            {a.status === 'Current' && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
          {/* Label */}
          <p className={`text-xs font-medium text-center px-1 leading-tight ${
            a.status === 'Current' ? 'text-indigo-400' : textPrimary
          }`}>{a.name}</p>
          <p className={`text-xs text-center ${textMuted} mt-0.5`}>{a.role}</p>
          {a.time && <p className={`text-xs ${textMuted} mt-0.5`}>{a.time}</p>}
        </div>
      );
    })}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const ApprovalWorkflows: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [selected, setSelected] = useState<ApprovalItem | null>(APPROVALS[0]);
  const [filterStatus, setFilterStatus] = useState<'All' | ApprovalStatus>('All');
  const [commentText, setCommentText] = useState('');
  const [actionDone, setActionDone] = useState<Record<string, boolean>>({});

  const filtered = APPROVALS.filter(
    (a) => filterStatus === 'All' || a.status === filterStatus
  );

  const stats = {
    total: APPROVALS.length,
    pending: APPROVALS.filter((a) => a.status === 'Pending').length,
    inReview: APPROVALS.filter((a) => a.status === 'In Review').length,
    approved: APPROVALS.filter((a) => a.status === 'Approved').length,
    escalated: APPROVALS.filter((a) => a.status === 'Escalated').length,
  };

  const bg = isDark ? 'bg-[#0f1117]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#161b2e]' : 'bg-white';
  const border = isDark ? 'border-white/8' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-[#1e2436] border-white/10 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400';
  const hoverRow = isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';
  const selectedRow = isDark ? 'bg-indigo-500/10 border-l-2 border-indigo-400' : 'bg-indigo-50 border-l-2 border-indigo-500';

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setActionDone((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className={`flex h-full ${bg} overflow-hidden`}>
      {/* ── Left Panel: Queue ──────────────────────────────────────── */}
      <div className={`w-80 flex-shrink-0 border-r ${border} flex flex-col`}>
        {/* Stats bar */}
        <div className={`px-4 pt-5 pb-3 border-b ${border}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-semibold ${textPrimary}`}>Approval Queue</h2>
            <button className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors">
              <Plus size={12} />
              New
            </button>
          </div>
          {/* Mini stats */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Pending', val: stats.pending, color: 'text-amber-400' },
              { label: 'Review', val: stats.inReview, color: 'text-blue-400' },
              { label: 'Done', val: stats.approved, color: 'text-emerald-400' },
              { label: 'Escalated', val: stats.escalated, color: 'text-red-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className={`rounded-lg p-2 text-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                <p className={`text-base font-bold ${color}`}>{val}</p>
                <p className={`text-xs ${textMuted} leading-tight`}>{label}</p>
              </div>
            ))}
          </div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(['All', 'Pending', 'In Review', 'Escalated', 'Approved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-2 py-0.5 rounded-full transition-colors font-medium ${
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

        {/* Approval List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={`px-4 py-3 cursor-pointer transition-all border-l-2 ${
                selected?.id === item.id
                  ? 'border-indigo-400 ' + (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50')
                  : `border-transparent ${hoverRow}`
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className={`text-sm font-medium leading-tight ${textPrimary} line-clamp-2`}>{item.title}</p>
                <StatusIcon status={item.status} />
              </div>
              <p className={`text-xs ${textMuted} mb-1.5`}>{item.clientName}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={item.priority} />
                <StatusBadge status={item.status} />
              </div>
              {/* Progress bar */}
              <div className={`mt-2.5 h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full transition-all ${
                    item.status === 'Approved' ? 'bg-emerald-500'
                      : item.status === 'Rejected' ? 'bg-red-500'
                      : item.status === 'Escalated' ? 'bg-red-400'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(item.stage / item.totalStages) * 100}%` }}
                />
              </div>
              <p className={`text-xs ${textMuted} mt-1`}>
                Stage {item.stage} of {item.totalStages} · Due {item.dueDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Detail ────────────────────────────────────── */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`px-6 pt-5 pb-4 border-b ${border}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority} />
                  <RiskBadge level={selected.riskLevel} />
                  <span className={`text-xs ${textMuted}`}>{selected.documentType}</span>
                </div>
                <h1 className={`text-xl font-semibold ${textPrimary} mt-1`}>{selected.title}</h1>
                <div className={`flex items-center gap-4 mt-1.5 text-sm ${textMuted}`}>
                  <span className="flex items-center gap-1.5"><User size={13} /> {selected.clientName}</span>
                  <span className="flex items-center gap-1.5"><FileText size={13} /> Submitted by {selected.submittedBy}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> Due {selected.dueDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg border ${border} ${textMuted} transition-colors ${hoverRow}`}>
                  <Eye size={15} />
                </button>
                <button className={`p-2 rounded-lg border ${border} ${textMuted} transition-colors ${hoverRow}`}>
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Summary */}
            <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
              <h3 className={`text-sm font-semibold mb-2 ${textPrimary}`}>Document Summary</h3>
              <p className={`text-sm leading-relaxed ${textMuted}`}>{selected.summary}</p>
            </div>

            {/* Approval Pipeline */}
            <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-sm font-semibold ${textPrimary}`}>Approval Pipeline</h3>
                <span className={`text-xs ${textMuted}`}>Stage {selected.stage} of {selected.totalStages}</span>
              </div>
              {/* Overall progress */}
              <div className={`h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} mb-4`}>
                <div
                  className={`h-full rounded-full ${
                    selected.status === 'Approved' ? 'bg-emerald-500'
                      : selected.status === 'Escalated' ? 'bg-red-400'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(selected.stage / selected.totalStages) * 100}%` }}
                />
              </div>
              <ApprovalPipeline
                approvers={selected.approvers}
                isDark={isDark}
                textPrimary={textPrimary}
                textMuted={textMuted}
              />
            </div>

            {/* Approver Details */}
            <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
              <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Approver Notes</h3>
              <div className="space-y-3">
                {selected.approvers.filter(a => a.comment).map((a, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg ${isDark ? 'bg-white/4' : 'bg-gray-50'}`}>
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {a.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${textPrimary}`}>{a.name}</span>
                        <span className={`text-xs ${textMuted}`}>{a.role}</span>
                        {a.time && <span className={`text-xs ${textMuted}`}>· {a.time}</span>}
                      </div>
                      <p className={`text-sm ${textMuted} mt-0.5`}>{a.comment}</p>
                    </div>
                  </div>
                ))}
                {selected.approvers.filter(a => a.comment).length === 0 && (
                  <p className={`text-sm ${textMuted}`}>No comments yet.</p>
                )}
              </div>
            </div>

            {/* Action Panel */}
            {(selected.status === 'Pending' || selected.status === 'In Review' || selected.status === 'Escalated') && !actionDone[selected.id] ? (
              <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
                <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Your Decision</h3>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment or review note before approving or rejecting..."
                  className={`w-full text-sm rounded-lg border ${inputBg} p-3 outline-none resize-none focus:ring-1 focus:ring-indigo-500/50 mb-3`}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction(selected.id, 'approve')}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'reject')}
                    className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                  <button className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border ${border} ${textMuted} ${hoverRow} transition-colors`}>
                    <AlertCircle size={14} />
                    Escalate
                  </button>
                  <button className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border ${border} ${textMuted} ${hoverRow} transition-colors ml-auto`}>
                    <MessageSquare size={14} />
                    Request Revision
                  </button>
                </div>
              </div>
            ) : selected.status === 'Approved' ? (
              <div className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center gap-3`}>
                <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-semibold text-emerald-400`}>Fully Approved</p>
                  <p className={`text-xs ${textMuted} mt-0.5`}>All approvers have signed off on this document.</p>
                </div>
              </div>
            ) : actionDone[selected.id] ? (
              <div className={`rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex items-center gap-3`}>
                <Stamp size={20} className="text-indigo-400 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-semibold text-indigo-400`}>Decision Recorded</p>
                  <p className={`text-xs ${textMuted} mt-0.5`}>Your action has been submitted and the next approver has been notified.</p>
                </div>
              </div>
            ) : null}

            {/* Timeline */}
            <div className={`rounded-xl border ${border} ${cardBg} p-5`}>
              <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Activity Timeline</h3>
              <div className="relative pl-5 space-y-4">
                <div className={`absolute left-1.5 top-2 bottom-2 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                {[
                  { event: 'Document submitted for approval', by: selected.submittedBy, time: selected.submittedDate, icon: FileText },
                  ...selected.approvers
                    .filter(a => a.status === 'Approved' || a.status === 'Rejected')
                    .map(a => ({
                      event: `${a.status} by ${a.name}`,
                      by: a.role,
                      time: a.time || '',
                      icon: a.status === 'Approved' ? CheckCircle : XCircle,
                    })),
                  ...(selected.status === 'Escalated' ? [{ event: 'Escalated to Managing Partner', by: 'System', time: 'Jun 22, 2026', icon: AlertCircle }] : []),
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-0.5 z-10 flex-shrink-0 ${isDark ? 'bg-slate-700 border border-slate-500' : 'bg-white border border-gray-300'}`} />
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>{ev.event}</p>
                      <p className={`text-xs ${textMuted}`}>{ev.by} · {ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center ${textMuted}`}>
          <div className="text-center">
            <Stamp size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a workflow to review</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflows;
