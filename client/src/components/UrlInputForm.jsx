import { useState } from 'react';
import { Search, Shield, Loader2 } from 'lucide-react';

const UrlInputForm = ({ onScan, loading }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#ffffff',
        border: isFocused ? '2px solid #059669' : '2px solid #e5e7eb',
        borderRadius: '14px',
        padding: '4px',
        boxShadow: isFocused
          ? '0 0 0 3px rgba(5,150,105,0.1), 0 4px 12px rgba(0,0,0,0.06)'
          : '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: '10px', paddingLeft: '14px' }}>
          <Search style={{ width: '18px', height: '18px', color: isFocused ? '#059669' : '#9ca3af', flexShrink: 0 }} />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter a URL to scan..."
            disabled={loading}
            id="url-input"
            autoComplete="off"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              color: '#111827',
              padding: '10px 0'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          id="scan-button"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#059669', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.875rem', fontWeight: 600,
            cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !url.trim() ? 0.4 : 1,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {loading ? (
            <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Scanning</>
          ) : (
            <><Shield style={{ width: '16px', height: '16px' }} /> Scan URL</>
          )}
        </button>
      </div>

      {/* Loading line */}
      {loading && (
        <div style={{ height: '2px', borderRadius: '1px', overflow: 'hidden', marginTop: '4px' }}>
          <div style={{
            height: '100%', width: '100%',
            background: 'linear-gradient(90deg, transparent, #10b981, #059669, transparent)',
            animation: 'scan-line 1.5s ease-in-out infinite'
          }} />
        </div>
      )}

      {/* Quick examples */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: '12px', gap: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af' }}>Try:</span>
        {[
          'https://google.com',
          'http://192.168.1.1/login',
          'https://paypal-secure-login.xyz',
          'bit.ly/abc123'
        ].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setUrl(example)}
            style={{
              fontSize: '0.75rem',
              padding: '3px 10px',
              borderRadius: '6px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
};

export default UrlInputForm;
