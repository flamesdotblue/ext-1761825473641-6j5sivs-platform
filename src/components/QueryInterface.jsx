import { useState } from 'react';
import { Search, Settings } from 'lucide-react';

export default function QueryInterface({ availableDomains, onRunQuery }) {
  const [query, setQuery] = useState('Novel energy storage solutions');
  const [selectedDomains, setSelectedDomains] = useState(availableDomains);
  const [iterationDepth, setIterationDepth] = useState(50);
  const [outputFormat, setOutputFormat] = useState('ranked');
  const [loading, setLoading] = useState(false);

  const toggleDomain = (id) => {
    setSelectedDomains((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    await onRunQuery({ query, selectedDomains, iterationDepth, outputFormat });
    setLoading(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Correlation Query</h2>
          <p className="text-neutral-400">Run multi-domain semantic search and iterative hypothesis generation.</p>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Iteration depth controls exploration breadth</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a research question"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-w-[160px] inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl px-4 py-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Running
              </>
            ) : (
              <>Run Correlation</>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
            <h4 className="font-medium mb-2">Domains</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableDomains.map((id) => (
                <label key={id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-emerald-600"
                    checked={selectedDomains.includes(id)}
                    onChange={() => toggleDomain(id)}
                  />
                  <span className="capitalize">{id.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
            <h4 className="font-medium mb-2">Iteration Depth</h4>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={100}
                value={iterationDepth}
                onChange={(e) => setIterationDepth(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-sm text-neutral-300 w-10 text-right">{iterationDepth}</span>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
            <h4 className="font-medium mb-2">Output Format</h4>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-2 text-sm"
            >
              <option value="ranked">Ranked List</option>
              <option value="detailed">Detailed with Rationale</option>
              <option value="compact">Compact Summary</option>
            </select>
          </div>
        </div>
      </form>
    </section>
  );
}
