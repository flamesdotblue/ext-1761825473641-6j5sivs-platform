import { useState, useMemo } from 'react';
import HeroCover from './components/HeroCover';
import DomainDashboard from './components/DomainDashboard';
import QueryInterface from './components/QueryInterface';
import ResultsVisualization from './components/ResultsVisualization';

export default function App() {
  const [domains, setDomains] = useState([
    { id: 'physics', name: 'Physics' },
    { id: 'biology', name: 'Biology' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'materials', name: 'Materials Science' },
  ]);

  const [filesByDomain, setFilesByDomain] = useState({});
  const [results, setResults] = useState([]);

  const handleAddDomain = (name) => {
    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) return;
    if (domains.find((d) => d.id === id)) return;
    setDomains((prev) => [...prev, { id, name: name.trim() }]);
  };

  const handleRemoveDomain = (id) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    setFilesByDomain((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleFilesUpdate = (domainId, files) => {
    setFilesByDomain((prev) => ({ ...prev, [domainId]: files }));
  };

  const queryDomains = useMemo(() => domains.map((d) => d.id), [domains]);

  const handleRunQuery = async ({ query, selectedDomains, iterationDepth, outputFormat }) => {
    // Simulate correlation engine results locally
    const now = Date.now();
    const mock = [
      {
        id: `h1-${now}`,
        title: 'Biological capacitor using modified mitochondria + graphene layers',
        confidence: 0.95,
        domains: ['biology', 'materials'],
        validation: {
          physical: true,
          technical: 'Feasible mid-term (2027+)',
          historical: 'No critical blockers identified',
        },
        sources: [
          { title: 'Mitochondrial Bioenergetics 2023', domain: 'Biology' },
          { title: 'CVD Graphene Layering Methods', domain: 'Materials Science' },
        ],
      },
      {
        id: `h2-${now}`,
        title: 'Quantum-entropy battery using room-temperature superconductors',
        confidence: 0.88,
        domains: ['physics', 'engineering'],
        validation: {
          physical: true,
          technical: 'Requires materials breakthrough',
          historical: 'Similar attempts stalled at materials step',
        },
        sources: [
          { title: 'Entropy Bounds in Practical Systems', domain: 'Physics' },
          { title: 'Cryo-to-Room Temp Transition Designs', domain: 'Engineering' },
        ],
      },
      {
        id: `h3-${now}`,
        title: 'Photosynthetic energy conversion with artificial chloroplasts',
        confidence: 0.76,
        domains: ['biology', 'chemistry'],
        validation: {
          physical: true,
          technical: 'Efficiency constraints likely',
          historical: 'Mixed outcomes in pilot studies',
        },
        sources: [
          { title: 'Artificial Chloroplasts 2022', domain: 'Biology' },
          { title: 'Catalytic Light Harvesting', domain: 'Chemistry' },
        ],
      },
    ].filter((r) => r.domains.some((d) => selectedDomains.includes(d)));

    // Pretend iteration depth affects number of results
    const trimmed = mock.slice(0, Math.min(mock.length, Math.max(1, Math.ceil(iterationDepth / 25))));

    // Pretend outputFormat changes order (no-op here)
    setResults(trimmed);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crup_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative h-[60vh] w-full">
        <HeroCover />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 max-w-5xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Cognitive Research Unification Platform</h1>
            <p className="mt-4 text-neutral-300 max-w-3xl mx-auto">Generate novel insights by correlating research across domains with iterative what-if hypothesis testing and reality validation.</p>
          </div>
        </div>
      </section>

      <main className="px-6 md:px-10 lg:px-16 py-10 space-y-12">
        <DomainDashboard
          domains={domains}
          filesByDomain={filesByDomain}
          onAddDomain={handleAddDomain}
          onRemoveDomain={handleRemoveDomain}
          onFilesUpdate={handleFilesUpdate}
        />

        <QueryInterface
          availableDomains={queryDomains}
          onRunQuery={handleRunQuery}
        />

        <ResultsVisualization results={results} onExport={handleExport} />
      </main>
    </div>
  );
}
