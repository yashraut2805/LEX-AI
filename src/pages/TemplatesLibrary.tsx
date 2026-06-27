import React, { useState } from 'react';
import {
  LayoutTemplate,
  Search,
  Star,
  StarOff,
  Download,
  Eye,
  Plus,
  Tag,
  Users,
  Sparkles,
  X,
  FileText,
  ChevronRight,
  BookOpen,
  Briefcase,
  Building2,
  Gavel
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Template {
  id: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  fields: string[];
  downloads: number;
  starred: boolean;
  source: 'official' | 'community' | 'ai-generated';
  jurisdiction: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  { id: 't1', title: 'Non-Disclosure Agreement (Mutual)', category: 'Confidentiality', industry: 'General', description: 'Standard mutual NDA for business discussions. Covers both parties with balanced obligations under Indian law.', fields: ['Party A Name', 'Party B Name', 'Purpose', 'Duration', 'Governing State'], downloads: 1420, starred: true, source: 'official', jurisdiction: 'India' },
  { id: 't2', title: 'Software Services Agreement', category: 'Technology', industry: 'IT / SaaS', description: 'End-to-end contract for SaaS or custom software delivery. Includes SLAs, IP ownership, and limitation of liability.', fields: ['Client Name', 'Vendor Name', 'Scope', 'Payment Terms', 'SLA Uptime %'], downloads: 980, starred: false, source: 'official', jurisdiction: 'India' },
  { id: 't3', title: 'Employment Contract (Full-Time)', category: 'HR & Employment', industry: 'General', description: 'Comprehensive offer letter and employment deed for full-time hires. Compliant with the Labour Codes 2020.', fields: ['Employee Name', 'Designation', 'CTC', 'Joining Date', 'Notice Period'], downloads: 2100, starred: true, source: 'official', jurisdiction: 'India' },
  { id: 't4', title: 'Commercial Lease Agreement', category: 'Real Estate', industry: 'Real Estate', description: 'Template for leasing office or retail space. Covers rent escalation, security deposit, and maintenance responsibilities.', fields: ['Lessor Name', 'Lessee Name', 'Property Address', 'Rent Amount', 'Lease Term'], downloads: 670, starred: false, source: 'community', jurisdiction: 'India' },
  { id: 't5', title: 'Freelance / Consultant Agreement', category: 'Consulting', industry: 'General', description: 'Independent contractor agreement with IP assignment, non-solicitation, and payment milestone clauses.', fields: ['Client Name', 'Consultant Name', 'Deliverables', 'Fee', 'Timeline'], downloads: 1340, starred: false, source: 'official', jurisdiction: 'India' },
  { id: 't6', title: 'Joint Venture Agreement', category: 'Corporate', industry: 'Corporate & M&A', description: 'Framework for two entities forming a JV. Covers profit sharing, governance, exit rights, and IP contributions.', fields: ['Party A', 'Party B', 'JV Purpose', 'Capital Contribution', 'Profit Split'], downloads: 420, starred: false, source: 'official', jurisdiction: 'India' },
  { id: 't7', title: 'Data Processing Agreement (DPDP Act)', category: 'Privacy & Compliance', industry: 'Technology', description: 'DPA template aligned with India\'s Digital Personal Data Protection Act 2023. Covers data principal rights and processor obligations.', fields: ['Data Fiduciary', 'Data Processor', 'Data Categories', 'Retention Period', 'Sub-processor'], downloads: 890, starred: true, source: 'ai-generated', jurisdiction: 'India' },
  { id: 't8', title: 'Vendor Master Agreement', category: 'Procurement', industry: 'General', description: 'Master procurement contract covering purchase orders, warranties, and dispute resolution for repeat vendor engagements.', fields: ['Buyer Name', 'Vendor Name', 'Goods/Services', 'Payment Terms', 'Warranty Period'], downloads: 560, starred: false, source: 'community', jurisdiction: 'India' },
];

const CATEGORIES = ['All', 'Confidentiality', 'Technology', 'HR & Employment', 'Real Estate', 'Consulting', 'Corporate', 'Privacy & Compliance', 'Procurement'];

const sourceConfig = {
  official: { label: 'Official', color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' },
  community: { label: 'Community', color: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30' },
  'ai-generated': { label: 'AI Generated', color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' },
};

const industryIcon: Record<string, React.ElementType> = {
  General: Briefcase,
  'IT / SaaS': Sparkles,
  'Real Estate': Building2,
  'Corporate & M&A': Gavel,
  Technology: Sparkles,
};

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({ template, onClose, onUse }: { template: Template; onClose: () => void; onUse: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{template.category}</p>
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100">{template.title}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{template.description}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Smart form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={11} className="text-violet-500" /> Fill Smart Fields
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {template.fields.map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">{field}</label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field.toLowerCase()}...`}
                  value={values[field] ?? ''}
                  onChange={(e) => setValues({ ...values, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button onClick={onUse} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-500/10">
            <Download size={13} />
            Generate Document
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({ template, onPreview, onToggleStar }: {
  template: Template;
  onPreview: (t: Template) => void;
  onToggleStar: (id: string) => void;
}) {
  const src = sourceConfig[template.source];
  const IndustryIcon = industryIcon[template.industry] ?? Briefcase;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md dark:hover:shadow-zinc-900/60 hover:border-blue-400 dark:hover:border-blue-800 transition-all duration-200 group">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex-shrink-0">
          <IndustryIcon size={18} />
        </div>
        <button onClick={() => onToggleStar(template.id)} className="flex-shrink-0 text-slate-300 dark:text-zinc-600 hover:text-amber-400 transition-colors">
          {template.starred ? <Star size={16} className="text-amber-400 fill-amber-400" /> : <StarOff size={16} />}
        </button>
      </div>

      {/* Info */}
      <div className="space-y-1.5 flex-1">
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${src.color}`}>
            {src.label}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-700">
            <Tag size={9} /> {template.category}
          </span>
        </div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{template.title}</h4>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{template.description}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
        <span className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
          <Users size={11} /> {template.downloads.toLocaleString()} uses
        </span>
        <button
          onClick={() => onPreview(template)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[11px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          <Eye size={12} /> Use Template <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const TemplatesLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [templates, setTemplates] = useState(TEMPLATES);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const filtered = templates.filter((t) => {
    const matchCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleToggleStar = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const handleGenerate = () => {
    setPreviewTemplate(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">

      {/* Header banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-zinc-950 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              <LayoutTemplate size={12} />
              Module 1.10 — Smart Templates
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Templates Library</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              50+ pre-built Indian legal templates. Fill smart fields, preview, and generate a ready-to-sign document in seconds.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider transition-colors shadow-lg shadow-blue-500/10 self-start md:self-center">
            <Plus size={15} />
            CONTRIBUTE TEMPLATE
          </button>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <FileText size={16} /> Document generated and ready for download!
        </div>
      )}

      {/* Search + filters */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search templates by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
            <BookOpen size={13} />
            <span><strong className="text-slate-700 dark:text-zinc-200">{filtered.length}</strong> templates found</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <TemplateCard key={t.id} template={t} onPreview={setPreviewTemplate} onToggleStar={handleToggleStar} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 dark:text-zinc-500 space-y-2">
            <LayoutTemplate size={28} className="mx-auto opacity-30" />
            <p className="text-sm font-semibold">No templates match your search.</p>
            <p className="text-xs">Try a different keyword or category.</p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleGenerate}
        />
      )}
    </div>
  );
};
