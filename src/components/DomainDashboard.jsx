import { useMemo, useRef, useState } from 'react';
import { Upload, Plus, Trash2, FileText, Loader2, CheckCircle, XCircle, Database } from 'lucide-react';

function classNames(...c) { return c.filter(Boolean).join(' '); }

export default function DomainDashboard({ domains, filesByDomain, onAddDomain, onRemoveDomain, onFilesUpdate }) {
  const [newDomain, setNewDomain] = useState('');

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Data Management Dashboard</h2>
          <p className="text-neutral-400">Add domains, upload research papers, and track processing.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
            <Database className="w-5 h-5 text-neutral-400" />
            <span className="text-sm text-neutral-300">{Object.values(filesByDomain).reduce((a, b) => a + (b?.length || 0), 0)} files</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { onAddDomain(newDomain); setNewDomain(''); } }}
          placeholder="Add new domain (e.g., Chemistry)"
          className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-lg px-3 py-2 outline-none"
        />
        <button
          onClick={() => { onAddDomain(newDomain); setNewDomain(''); }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition text-white rounded-lg px-3 py-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {domains.map((d) => (
          <DomainCard
            key={d.id}
            domain={d}
            files={filesByDomain[d.id] || []}
            onRemove={() => onRemoveDomain(d.id)}
            onFilesChange={(files) => onFilesUpdate(d.id, files)}
          />
        ))}
      </div>
    </section>
  );
}

function DomainCard({ domain, files, onRemove, onFilesChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const total = files.length;
  const processed = useMemo(() => files.filter((f) => f.status === 'processed').length, [files]);

  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList).map((f) => ({
      id: `${domain.id}-${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      status: 'queued',
      meta: { title: '', authors: '', year: '', tags: '' },
      file: f,
    }));
    const combined = [...files, ...incoming];
    onFilesChange(combined);
    // Simulate processing
    incoming.forEach((item, idx) => {
      setTimeout(() => {
        onFilesChange((prev => {
          const list = typeof prev === 'function' ? prev(files) : combined; // for safety
          return (list || []).map((x) => x.id === item.id ? { ...x, status: 'extracting' } : x);
        }));
      }, 300 + idx * 150);
      setTimeout(() => {
        onFilesChange((prev => {
          const list = (typeof prev === 'function') ? prev(files) : null; // fallback
          const base = list || combined.map((x) => x.id === item.id ? { ...x, status: 'extracting' } : x);
          return base.map((x) => x.id === item.id ? { ...x, status: 'embedding' } : x);
        }));
      }, 1200 + idx * 200);
      setTimeout(() => {
        onFilesChange((prev => {
          const base = (files || combined).map((x) => x.id === item.id ? { ...x, status: 'processed' } : x);
          return base;
        }));
      }, 2200 + idx * 250);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const setMeta = (id, key, value) => {
    const updated = files.map((f) => f.id === id ? { ...f, meta: { ...f.meta, [key]: value } } : f);
    onFilesChange(updated);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{domain.name}</h3>
        <button onClick={onRemove} className="text-red-400 hover:text-red-300 inline-flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Remove
        </button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={classNames(
          'rounded-xl border border-dashed p-6 flex flex-col items-center justify-center text-center transition',
          dragOver ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-700 bg-neutral-950/40'
        )}
      >
        <Upload className={classNames('w-8 h-8 mb-2', dragOver ? 'text-emerald-400' : 'text-neutral-400')} />
        <p className="text-sm text-neutral-300">Drag & drop PDF, DOCX, TXT here</p>
        <p className="text-xs text-neutral-500">or</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-1.5"
        >Browse Files</button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>Processing: {processed}/{total}</span>
        <span>Batch size: {total}</span>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {files.map((f) => (
            <div key={f.id} className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div className="truncate">
                    <div className="truncate text-sm">{f.name}</div>
                    <div className="text-xs text-neutral-500">{(f.size/1024).toFixed(1)} KB</div>
                  </div>
                </div>
                <StatusPill status={f.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <input
                  value={f.meta.title}
                  onChange={(e) => setMeta(f.id, 'title', e.target.value)}
                  placeholder="Title"
                  className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-sm outline-none"
                />
                <input
                  value={f.meta.authors}
                  onChange={(e) => setMeta(f.id, 'authors', e.target.value)}
                  placeholder="Authors"
                  className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-sm outline-none"
                />
                <input
                  value={f.meta.year}
                  onChange={(e) => setMeta(f.id, 'year', e.target.value)}
                  placeholder="Year"
                  className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-sm outline-none"
                />
                <input
                  value={f.meta.tags}
                  onChange={(e) => setMeta(f.id, 'tags', e.target.value)}
                  placeholder="Domain tags"
                  className="bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-sm outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    queued: { label: 'Queued', classes: 'bg-neutral-800 text-neutral-300', icon: FileText },
    extracting: { label: 'Extracting', classes: 'bg-blue-900/40 text-blue-300', icon: Loader2 },
    embedding: { label: 'Embedding', classes: 'bg-amber-900/40 text-amber-300', icon: Loader2 },
    processed: { label: 'Processed', classes: 'bg-emerald-900/40 text-emerald-300', icon: CheckCircle },
    failed: { label: 'Failed', classes: 'bg-red-900/40 text-red-300', icon: XCircle },
  };
  const conf = map[status] || map.queued;
  const Icon = conf.icon;
  const spinning = status === 'extracting' || status === 'embedding';
  return (
    <span className={classNames('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border border-neutral-700', conf.classes)}>
      <Icon className={classNames('w-3.5 h-3.5', spinning && 'animate-spin')} />
      {conf.label}
    </span>
  );
}
