import { useState } from 'react';
import DorkSection from './DorkSection';
import { generateEnrichmentDorks } from '../utils/dorkGenerator';

export default function EnrichmentPanel({ domain }) {
  const [companyName, setCompanyName] = useState('');
  const [personName, setPersonName] = useState('');
  const [sections, setSections] = useState([]);
  const [generated, setGenerated] = useState(false);

  function handleGenerate() {
    if (!companyName.trim() && !personName.trim()) return;
    const result = generateEnrichmentDorks(domain, companyName, personName);
    setSections(result);
    setGenerated(true);
  }

  return (
    <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-800">Enrich Further</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Paste what you found to generate deeper targeted dorks.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
          <input
            type="text"
            placeholder="e.g. Acme Corporation"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Person Name</label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={!companyName.trim() && !personName.trim()}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Generate
          </button>
        </div>
      </div>

      {generated && sections.length > 0 && (
        <div className="flex flex-col gap-4 mt-5">
          {sections.map((section) => (
            <DorkSection key={section.id} section={section} />
          ))}
        </div>
      )}

      {generated && sections.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          No enrichment dorks generated. Fill in at least one field.
        </p>
      )}
    </div>
  );
}
