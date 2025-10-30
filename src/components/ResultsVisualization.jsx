import { Download, CheckCircle, XCircle } from 'lucide-react';

export default function ResultsVisualization({ results, onExport }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Validated Hypotheses</h2>
          <p className="text-neutral-400">Ranked insights with confidence scores and validation reasoning.</p>
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-xl px-3 py-2"
        >
          <Download className="w-4 h-4" /> Export JSON
        </button>
      </div>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {results.sort((a, b) => b.confidence - a.confidence).map((r, i) => (
            <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm text-neutral-400">#{i + 1}</div>
                  <h3 className="text-lg font-medium leading-snug">{r.title}</h3>
                </div>
                <Confidence value={r.confidence} />
              </div>

              <div className="flex flex-wrap gap-2">
                {r.domains.map((d) => (
                  <span key={d} className="px-2 py-1 rounded-full text-xs bg-neutral-800 capitalize">{d.replace('-', ' ')}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ValidationCard title="Physical Laws" ok={r.validation.physical === true} note={r.validation.physical === true ? 'Pass' : r.validation.physical} />
                <ValidationCard title="Technical Feasibility" ok={typeof r.validation.technical === 'string' ? true : !!r.validation.technical} note={r.validation.technical} />
                <ValidationCard title="Historical Analysis" ok={typeof r.validation.historical === 'string' ? true : !!r.validation.historical} note={r.validation.historical} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Sources</h4>
                <ul className="space-y-1">
                  {r.sources.map((s, idx) => (
                    <li key={idx} className="text-sm text-neutral-300">• {s.title} <span className="text-neutral-500">({s.domain})</span></li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Confidence({ value }) {
  const pct = Math.round(value * 100);
  return (
    <div className="shrink-0">
      <div className="text-sm text-neutral-400 text-right">Confidence</div>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-sm font-medium">{pct}%</div>
      </div>
    </div>
  );
}

function ValidationCard({ title, ok, note }) {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
      <div className="flex items-center gap-2">
        {ok ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
        <div className="text-sm font-medium">{title}</div>
      </div>
      {note && (
        <div className="text-xs text-neutral-400 mt-1">{String(note)}</div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
      <div className="text-lg font-medium">No hypotheses yet</div>
      <p className="text-neutral-400">Run a correlation query to see cross-domain validated solutions.</p>
    </div>
  );
}
