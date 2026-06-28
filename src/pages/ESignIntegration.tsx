import React, { useState, useRef } from 'react';
import {
  PenTool,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Download,
  Upload,
  Shield,
  Sparkles,
  Mail,
  Phone,
  Plus,
  X,
  FileText,
  Award,
  RefreshCw,
  ChevronRight,
  Eye
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SignerStatus = 'signed' | 'pending' | 'declined' | 'not-sent';

interface Signer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: SignerStatus;
  signedAt?: string;
  method: 'aadhaar' | 'docusign' | 'otp';
}

interface SignDocument {
  id: string;
  name: string;
  uploadedOn: string;
  expiresOn: string;
  signers: Signer[];
  auditReady: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DOCUMENTS: SignDocument[] = [
  {
    id: 'd1',
    name: 'Software Services Agreement — Acme Corp.pdf',
    uploadedOn: '20 Jun 2025',
    expiresOn: '27 Jun 2025',
    auditReady: true,
    signers: [
      { id: 's1', name: 'Rajan Mehta', email: 'rajan@acmecorp.in', phone: '+91 98200 00001', role: 'Client (Authorised Signatory)', status: 'signed', signedAt: '21 Jun 2025, 3:12 PM', method: 'aadhaar' },
      { id: 's2', name: 'Priya Sharma', email: 'priya@lexai.in', role: 'Our Company (Director)', status: 'signed', signedAt: '22 Jun 2025, 10:45 AM', method: 'docusign' },
      { id: 's3', name: 'Amit Nair', email: 'amit@acmecorp.in', role: 'Client (Witness)', status: 'pending', method: 'aadhaar' },
    ],
  },
  {
    id: 'd2',
    name: 'NDA — BrightPath Ventures.pdf',
    uploadedOn: '18 Jun 2025',
    expiresOn: '25 Jun 2025',
    auditReady: false,
    signers: [
      { id: 's4', name: 'Divya Reddy', email: 'divya@brightpath.in', role: 'Counterparty', status: 'signed', signedAt: '19 Jun 2025, 9:00 AM', method: 'otp' },
      { id: 's5', name: 'Saurabh Joshi', email: 'saurabh@lexai.in', role: 'Our Company', status: 'declined', method: 'aadhaar' },
    ],
  },
  {
    id: 'd3',
    name: 'Consultant Agreement — Freelance Dev.pdf',
    uploadedOn: '24 Jun 2025',
    expiresOn: '01 Jul 2025',
    auditReady: false,
    signers: [
      { id: 's6', name: 'Neha Gupta', email: 'neha.g@gmail.com', role: 'Consultant', status: 'not-sent', method: 'otp' },
      { id: 's7', name: 'Priya Sharma', email: 'priya@lexai.in', role: 'Our Company', status: 'not-sent', method: 'docusign' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<SignerStatus, { label: string; color: string; icon: React.ElementType }> = {
  signed: { label: 'Signed', color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30', icon: Clock },
  declined: { label: 'Declined', color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30', icon: XCircle },
  'not-sent': { label: 'Not Sent', color: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700', icon: Clock },
};

const methodLabel: Record<string, string> = {
  aadhaar: 'Aadhaar eSign',
  docusign: 'DocuSign',
  otp: 'OTP Verify',
};

function docStatus(doc: SignDocument) {
  const all = doc.signers;
  if (all.every((s) => s.status === 'signed')) return 'completed';
  if (all.some((s) => s.status === 'declined')) return 'declined';
  if (all.some((s) => s.status === 'pending' || s.status === 'signed')) return 'in-progress';
  return 'draft';
}

const docStatusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30' },
  'in-progress': { label: 'In Progress', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30' },
  declined: { label: 'Declined', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30' },
  draft: { label: 'Draft', color: 'text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700' },
};

// ─── Bulk Send Modal ──────────────────────────────────────────────────────────

function BulkSendModal({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState(['']);

  const addRow = () => setEmails([...emails, '']);
  const removeRow = (i: number) => setEmails(emails.filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100">Bulk Send for Signature</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Send the same document to multiple signers at once.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {emails.map((email, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`signer${i + 1}@email.com`}
                value={email}
                onChange={(e) => {
                  const updated = [...emails];
                  updated[i] = e.target.value;
                  setEmails(updated);
                }}
              />
              {emails.length > 1 && (
                <button onClick={() => removeRow(i)} className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addRow} className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            <Plus size={12} /> Add another recipient
          </button>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-500/10">
            <Send size={13} /> Send to {emails.filter(Boolean).length || '—'} Signers
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Row ─────────────────────────────────────────────────────────────

function DocRow({ doc, onViewSign }: { doc: SignDocument; onViewSign: (doc: SignDocument) => void }) {
  const [expanded, setExpanded] = useState(false);
  const status = docStatus(doc);
  const cfg = docStatusConfig[status];
  const signed = doc.signers.filter((s) => s.status === 'signed').length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      {/* Document header */}
      <div
        role="button"
        tabIndex={0}
        className="w-full text-left p-5 hover:bg-slate-50/60 dark:hover:bg-zinc-950/30 transition-colors flex items-start gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex-shrink-0">
          <FileText size={18} />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100 truncate">{doc.name}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.color}`}>
              {cfg.label}
            </span>
            {doc.auditReady && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30">
                <Award size={10} /> Audit Ready
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 dark:text-zinc-500">
            <span>Uploaded: {doc.uploadedOn}</span>
            <span>Expires: {doc.expiresOn}</span>
            <span className="font-semibold text-slate-600 dark:text-zinc-300">{signed}/{doc.signers.length} signed</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full mt-1.5">
            <div
              className="h-1 bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(signed / doc.signers.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition-colors"
            title="Download audit certificate"
          >
            <Download size={14} />
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onViewSign(doc);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
            title="View Signature Details"
          >
            <Eye size={14} />
          </button>
          <ChevronRight size={16} className={`text-slate-400 dark:text-zinc-500 mt-2 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Signers */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-zinc-800 p-5">
          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Signers</p>
          <div className="space-y-2.5">
            {doc.signers.map((signer) => {
              const sc = statusConfig[signer.status];
              const Icon = sc.icon;
              return (
                <div key={signer.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800">
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-xs text-slate-700 dark:text-zinc-200">{signer.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sc.color}`}>
                        <Icon size={10} /> {sc.label}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        {methodLabel[signer.method]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 dark:text-zinc-500">
                      <span className="flex items-center gap-1"><Mail size={10} />{signer.email}</span>
                      {signer.phone && <span className="flex items-center gap-1"><Phone size={10} />{signer.phone}</span>}
                      <span className="text-slate-500 dark:text-zinc-400 italic">{signer.role}</span>
                      {signer.signedAt && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {signer.signedAt}</span>}
                    </div>
                  </div>
                  {(signer.status === 'pending' || signer.status === 'not-sent') && (
                    <button className="flex-shrink-0 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors" title="Resend">
                      <RefreshCw size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {doc.auditReady && (
            <div className="mt-4 flex items-center gap-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/20">
              <Award size={16} className="text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">Audit Certificate Available</p>
                <p className="text-[11px] text-violet-500 dark:text-violet-400">Tamper-proof certificate valid under IT Act 2000</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold transition-colors">
                <Download size={11} /> Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── View Sign Modal ─────────────────────────────────────────────────────────

interface ViewSignModalProps {
  doc: SignDocument;
  onClose: () => void;
}

function ViewSignModal({ doc, onClose }: ViewSignModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" />
              eSign Verification & Audit Trail
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 max-w-md truncate">
              Document: {doc.name}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Certificate Header Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3">
            <CheckCircle className="text-emerald-500 w-8 h-8 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Cryptographically Signed & Secured
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                Authorized under Section 5 of the Information Technology Act, 2000. Tamper-evident hash logged securely.
              </p>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
              Signature Audits ({doc.signers.length} Recipient(s))
            </h4>

            <div className="space-y-3.5">
              {doc.signers.map((signer, index) => (
                <div key={signer.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">
                        {signer.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 italic block">
                        {signer.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        signer.status === 'signed' ? 'bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200' :
                        signer.status === 'pending' ? 'bg-amber-50/40 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200' :
                        'bg-rose-50/40 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200'
                      }`}>
                        {signer.status}
                      </span>
                      <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded font-medium">
                        {methodLabel[signer.method]}
                      </span>
                    </div>
                  </div>

                  {signer.status === 'signed' ? (
                    <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                      <div>
                        <span className="text-slate-400 dark:text-zinc-500 block">Sign Timestamp</span>
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">{signer.signedAt || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-zinc-500 block">IP Address & Device</span>
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">192.168.{20 + index}.{104 + index} (Verified Chrome)</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 dark:text-zinc-500 block">Cryptographic Consent Hash</span>
                        <span className="font-mono text-slate-600 dark:text-zinc-400 block truncate">
                          sha256:8f4c2c77d446eeab0cf716d8495a89ee{index}27dff6b9a8bc43f1425da7dff6
                        </span>
                      </div>

                      {/* Visual Signature stamp */}
                      <div className="sm:col-span-2 mt-2 p-3 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Visual Stamp Certify</span>
                          <p className="font-serif italic text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide mt-0.5">
                            {signer.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] text-slate-400 dark:text-zinc-500 block">Digital Authenticator ID</span>
                          <span className="font-mono font-bold text-slate-600 dark:text-zinc-400 text-[8px] uppercase">
                            UIDAI-OTP-{signer.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic pt-1">
                      Awaiting recipient verification authentication. A notification link has been forwarded to {signer.email}.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const ESignIntegration: React.FC = () => {
  const [showBulkSend, setShowBulkSend] = useState(false);
  const [documents, setDocuments] = useState<SignDocument[]>(DOCUMENTS);
  const [viewingDocSign, setViewingDocSign] = useState<SignDocument | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'declined'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: SignDocument = {
      id: `d-${Date.now()}`,
      name: file.name,
      uploadedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      auditReady: false,
      signers: [
        { id: `s-${Date.now()}-1`, name: 'You (Sender)', email: 'user@example.com', role: 'Sender', status: 'signed', signedAt: new Date().toLocaleString('en-IN'), method: 'otp' },
        { id: `s-${Date.now()}-2`, name: 'Counterparty', email: 'partner@example.com', role: 'Signatory', status: 'pending', method: 'aadhaar' }
      ]
    };

    setDocuments([newDoc, ...documents]);
    alert(`Successfully uploaded "${file.name}" for signature request!`);
  };

  const allSigners = documents.flatMap((d) => d.signers);
  const stats = {
    total: documents.length,
    completed: documents.filter((d) => docStatus(d) === 'completed').length,
    pending: allSigners.filter((s) => s.status === 'pending').length,
    declined: allSigners.filter((s) => s.status === 'declined').length,
  };

  const filteredDocs = documents.filter((doc) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return docStatus(doc) === 'completed';
    if (filter === 'pending') return doc.signers.some(s => s.status === 'pending');
    if (filter === 'declined') return docStatus(doc) === 'declined';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-zinc-950 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-900/50 border border-violet-700/50 text-[10px] font-bold text-violet-300 uppercase tracking-widest">
              <PenTool size={12} />
              Module 1.11 — eSign Integration
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">eSign Integration</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Aadhaar eSign & DocuSign support. Track every signer's status, send bulk requests, and download audit certificates valid under the IT Act 2000.
            </p>
          </div>
          <div className="flex gap-2 self-start md:self-center flex-wrap">
            <button
              onClick={() => setShowBulkSend(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs tracking-wider transition-colors cursor-pointer"
            >
              <Users size={14} /> Bulk Send
            </button>
            <button 
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg shadow-violet-500/10 cursor-pointer"
            >
              <Upload size={14} /> Upload for Signing
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: stats.total, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', filterKey: 'all' as const },
          { label: 'Fully Signed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', filterKey: 'completed' as const },
          { label: 'Awaiting Signature', value: stats.pending, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', filterKey: 'pending' as const },
          { label: 'Declined', value: stats.declined, icon: XCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20', filterKey: 'declined' as const },
        ].map((s, i) => {
          const Icon = s.icon;
          const isActive = filter === s.filterKey;
          return (
            <div 
              key={i} 
              onClick={() => setFilter(isActive ? 'all' : s.filterKey)}
              className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:border-violet-500/50 ${
                isActive 
                  ? 'border-violet-500 ring-2 ring-violet-500/10 shadow-md bg-violet-50/5 dark:bg-violet-950/5' 
                  : 'border-slate-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}><Icon size={15} /></div>
              </div>
              <div className="mt-4"><span className="text-2xl font-black text-slate-800 dark:text-zinc-100">{s.value}</span></div>
            </div>
          );
        })}
      </div>

      {/* Compliance banner */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
        <Shield size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div className="flex-1 space-y-0.5">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">IT Act 2000 Compliant · DPDP Act Aligned</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">All signatures are legally valid under Indian law. Aadhaar eSign uses UIDAI's OTP-based authentication.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Aadhaar eSign', 'DocuSign', 'OTP Verify'].map((m) => (
            <span key={m} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">{m}</span>
          ))}
        </div>
      </div>

      {/* Documents list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <Sparkles size={15} className="text-violet-500" /> Signature Requests
          </h3>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">{filteredDocs.length} documents</span>
        </div>
        {filteredDocs.map((doc) => <DocRow key={doc.id} doc={doc} onViewSign={setViewingDocSign} />)}
      </div>

      {showBulkSend && <BulkSendModal onClose={() => setShowBulkSend(false)} />}
      {viewingDocSign && <ViewSignModal doc={viewingDocSign} onClose={() => setViewingDocSign(null)} />}
    </div>
  );
};
