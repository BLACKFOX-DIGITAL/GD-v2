import { useState, useRef } from 'react';
import DorkSection from './components/DorkSection';
import EnrichmentPanel from './components/EnrichmentPanel';
import { generateDorks } from './utils/dorkGenerator';
import './index.css';

const CATEGORY_LABELS = {
  company:            'Company Identity',
  emails:             'Emails',
  phones:             'Phone Numbers',
  'linkedin-company': 'LinkedIn — Company',
  'linkedin-people':  'LinkedIn — Employees',
  social:             'Social Media',
  business:           'Business Info',
};

export default function App() {
  const [domain, setDomain] = useState('');
  const [sections, setSections] = useState([]);
  const [generatedFor, setGeneratedFor] = useState('');
  const [error, setError] = useState('');
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const resultsRef = useRef(null);

  const totalDorks = sections
    .filter((s) => !hiddenIds.has(s.id))
    .reduce((sum, s) => sum + s.dorks.length, 0);

  function parseDomain(raw) {
    const trimmed = raw.trim();
    try {
      // If it looks like a URL, parse it
      const withProto = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const url = new URL(withProto);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return trimmed.replace(/^www\./, '');
    }
  }

  function handleGenerate() {
    const parsed = parseDomain(domain);
    if (!parsed) {
      setError('Please enter a domain.');
      return;
    }
    setError('');
    setHiddenIds(new Set());
    const result = generateDorks(parsed);
    setSections(result);
    setGeneratedFor(parsed);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function handleReset() {
    setDomain('');
    setSections([]);
    setGeneratedFor('');
    setError('');
    setHiddenIds(new Set());
    setFilterOpen(false);
  }

  function toggleCategory(id) {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const visibleSections = sections.filter((s) => !hiddenIds.has(s.id));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">Dork Generator</h1>
              <p className="text-xs text-gray-400 mt-0.5">Google OSINT for Sales</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sections.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {totalDorks} dorks visible
              </span>
            )}
            {generatedFor && (
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← New Search
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Enter Company Domain</h2>
          <p className="text-xs text-gray-400 mb-4">
            Enter a domain or paste a full URL — e.g. <span className="font-mono">acme.com</span> or <span className="font-mono">https://www.acme.com</span>
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="acme.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 font-mono"
            />
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm whitespace-nowrap"
            >
              Generate Dorks
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {/* Results */}
        {sections.length > 0 && (
          <div ref={resultsRef}>
            {/* Results bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Results for</span>
                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {generatedFor}
                </span>
              </div>

              {/* Category filter toggle */}
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filter Categories
                {hiddenIds.size > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {hiddenIds.size}
                  </span>
                )}
              </button>
            </div>

            {/* Category filter panel */}
            {filterOpen && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-3 font-medium">Toggle categories to show/hide:</p>
                <div className="flex flex-wrap gap-2">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleCategory(s.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        hiddenIds.has(s.id)
                          ? 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {hiddenIds.size > 0 && (
                  <button
                    onClick={() => setHiddenIds(new Set())}
                    className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Show all
                  </button>
                )}
              </div>
            )}

            {/* Dork sections */}
            <div className="flex flex-col gap-4">
              {visibleSections.map((section) => (
                <DorkSection key={section.id} section={section} />
              ))}
            </div>

            {/* Enrichment */}
            <EnrichmentPanel domain={generatedFor} />

            <div className="h-16" />
          </div>
        )}

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Enter a domain above to generate dork queries.</p>
          </div>
        )}
      </main>
    </div>
  );
}
