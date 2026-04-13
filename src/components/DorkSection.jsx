import { useState } from 'react';
import DorkRow from './DorkRow';

const colorMap = {
  blue:   { header: 'bg-blue-50 border-blue-200',     dot: 'bg-blue-500',   label: 'text-blue-700',   badge: 'bg-blue-100 text-blue-600' },
  green:  { header: 'bg-green-50 border-green-200',   dot: 'bg-green-500',  label: 'text-green-700',  badge: 'bg-green-100 text-green-600' },
  orange: { header: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500', label: 'text-orange-700', badge: 'bg-orange-100 text-orange-600' },
  indigo: { header: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500', label: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-600' },
  purple: { header: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500', label: 'text-purple-700', badge: 'bg-purple-100 text-purple-600' },
  pink:   { header: 'bg-pink-50 border-pink-200',     dot: 'bg-pink-500',   label: 'text-pink-700',   badge: 'bg-pink-100 text-pink-600' },
  red:    { header: 'bg-red-50 border-red-200',       dot: 'bg-red-500',    label: 'text-red-700',    badge: 'bg-red-100 text-red-600' },
  teal:   { header: 'bg-teal-50 border-teal-200',     dot: 'bg-teal-500',   label: 'text-teal-700',   badge: 'bg-teal-100 text-teal-600' },
  amber:  { header: 'bg-amber-50 border-amber-200',   dot: 'bg-amber-500',  label: 'text-amber-700',  badge: 'bg-amber-100 text-amber-600' },
  cyan:   { header: 'bg-cyan-50 border-cyan-200',     dot: 'bg-cyan-500',   label: 'text-cyan-700',   badge: 'bg-cyan-100 text-cyan-600' },
  yellow: { header: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500', label: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-600' },
  violet: { header: 'bg-violet-50 border-violet-200', dot: 'bg-violet-500', label: 'text-violet-700', badge: 'bg-violet-100 text-violet-600' },
  rose:   { header: 'bg-rose-50 border-rose-200',     dot: 'bg-rose-500',   label: 'text-rose-700',   badge: 'bg-rose-100 text-rose-600' },
};

export default function DorkSection({ section, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copiedAll, setCopiedAll] = useState(false);
  const c = colorMap[section.color] || colorMap.blue;

  function handleCopyAll() {
    const text = section.dorks
      .map((d) => (typeof d === 'string' ? d : d.query))
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header — clickable to collapse */}
      <div
        className={`flex items-center gap-2.5 px-4 py-3 border-b cursor-pointer select-none ${c.header}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
        <h2 className={`text-sm font-semibold flex-1 ${c.label}`}>{section.label}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
          {section.dorks.length} dorks
        </span>

        {/* Copy All button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleCopyAll(); }}
          className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all border ${
            copiedAll
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-white/70 text-gray-500 border-gray-200 hover:bg-white hover:text-gray-700'
          }`}
        >
          {copiedAll ? 'Copied!' : 'Copy All'}
        </button>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Body */}
      {open && (
        <div className="p-3 bg-gray-50 flex flex-col gap-2">
          {section.dorks.map((dork, i) => (
            <DorkRow key={i} dork={dork} />
          ))}
        </div>
      )}
    </div>
  );
}
