import { useState } from 'react';

export default function DorkRow({ dork }) {
  const [copied, setCopied] = useState(false);

  // Support both old string format and new { query, desc } format
  const query = typeof dork === 'string' ? dork : dork.query;
  const desc  = typeof dork === 'string' ? null  : dork.desc;

  function handleCopy() {
    navigator.clipboard.writeText(query).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleOpen() {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  }

  return (
    <div className="flex flex-col gap-1 py-2.5 px-3 rounded-lg bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      {desc && (
        <span className="text-xs text-gray-400 leading-none">{desc}</span>
      )}
      <div className="flex items-center gap-2">
        <span className="flex-1 font-mono text-sm text-gray-700 break-all select-all">
          {query}
        </span>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy dork"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleOpen}
            title="Open in Google"
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
          >
            Search ↗
          </button>
        </div>
      </div>
    </div>
  );
}
