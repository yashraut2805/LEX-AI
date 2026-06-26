import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Upload: React.FC = () => {
  const { uploadDocument, documents, setSelectedDocumentId, setCurrentView } = useApp();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !['pdf', 'docx', 'txt'].includes(extension || '')) {
      alert('Invalid file format. Please upload PDF, DOCX, or TXT documents only.');
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    setUploading(true);
    setProgress(10);
    setStatusMessage('Reading PDF streams...');

    // Simulate stepping through different parsing stages
    const intervals = [
      { p: 30, m: 'Extracting paragraphs & layout mapping...' },
      { p: 55, m: 'Scanning clauses with fine-tuned Qwen model...' },
      { p: 80, m: 'Conducting risk and compliance audits...' },
      { p: 95, m: 'Generating legal memorandum...' },
      { p: 100, m: 'Analysis finalized.' }
    ];

    for (const step of intervals) {
      await new Promise(r => setTimeout(r, 700));
      setProgress(step.p);
      setStatusMessage(step.m);
    }

    // Call upload context
    await uploadDocument(file);
    
    setUploading(false);
    setProgress(0);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReview = (id: string) => {
    setSelectedDocumentId(id);
    setCurrentView('contract-analysis');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Upload Header */}
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">
          Upload Documents & Ingest
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Upload PDF, DOCX, or TXT agreements. All processing and audits are performed locally on your device for absolute client confidentiality.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/10' 
            : 'border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-slate-400 dark:hover:border-zinc-700'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          onChange={handleFileInput}
          className="hidden" 
          accept=".pdf,.docx,.txt"
        />
        
        <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
          <UploadCloud size={32} className="animate-pulse" />
        </div>

        <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">
          Drag & drop your contract here, or <span className="text-blue-600 dark:text-blue-400 hover:underline">browse files</span>
        </h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
          Supports PDF, DOCX, and TXT (Max size: 50MB)
        </p>

        {/* Dynamic features badge */}
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            <Sparkles size={12} className="text-amber-500" />
            Automatic OCR
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            <Sparkles size={12} className="text-blue-500" />
            Clause Extraction
          </div>
        </div>
      </div>

      {/* Processing Animation Panel */}
      {uploading && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 animate-spin">
                <Loader2 size={20} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 truncate max-w-[240px]">
                  {fileName}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                  Size: {fileSize} • Status: {statusMessage}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
          Ingested Contract Repository ({documents.length})
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-premium dark:hover:shadow-dark-premium transition-all duration-200"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 truncate">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.pages} pages</span>
                    <span>•</span>
                    <span>Uploaded {doc.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-slate-100 dark:border-zinc-800 pt-3 md:pt-0">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Analyzed
                  </span>
                </div>
                <button
                  onClick={() => handleReview(doc.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold text-[11px] hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Enter Audit Workspace
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
