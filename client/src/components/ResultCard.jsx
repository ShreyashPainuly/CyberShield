import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const riskConfig = {
  safe: {
    icon: ShieldCheck, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0',
    label: 'Safe', emoji: '🟢',
    message: 'This URL appears to be safe. No significant threats detected.'
  },
  suspicious: {
    icon: ShieldAlert, color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    label: 'Suspicious', emoji: '🟡',
    message: 'This URL has some suspicious characteristics. Proceed with caution.'
  },
  dangerous: {
    icon: ShieldX, color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
    label: 'Dangerous', emoji: '🔴',
    message: 'WARNING: This URL is potentially dangerous! Do not visit this link.'
  }
};

const ResultCard = ({ scan, compact = false }) => {
  const [expanded, setExpanded] = useState(!compact);
  const config = riskConfig[scan.riskLevel] || riskConfig.safe;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%', overflow: 'hidden',
        background: '#fff',
        border: `1px solid ${config.border}`,
        borderRadius: '14px'
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: config.bg, border: `1px solid ${config.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon style={{ width: '20px', height: '20px', color: config.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: config.color }}>
                {config.emoji} {config.label}
              </span>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 600,
                padding: '2px 8px', borderRadius: '6px',
                background: config.bg, color: config.color,
                border: `1px solid ${config.border}`
              }}>
                Score: {scan.riskScore}/100
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <ExternalLink style={{ width: '12px', height: '12px', color: '#9ca3af', flexShrink: 0 }} />
              <span style={{
                fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{scan.url}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '8px', lineHeight: 1.5 }}>
              {config.message}
            </p>
          </div>
        </div>

        {/* Risk meter */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: '6px',
            fontSize: '0.625rem', color: '#9ca3af', fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
          <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: '#f3f4f6', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scan.riskScore}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              style={{
                height: '100%', borderRadius: '999px',
                background: scan.riskScore <= 30
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : scan.riskScore <= 60
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Threats */}
      {scan.threats && scan.threats.length > 0 && (
        <div style={{ borderTop: `1px solid ${config.border}` }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 20px', background: 'none', border: 'none',
              cursor: 'pointer', color: config.color, fontFamily: 'inherit'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
              <AlertTriangle style={{ width: '14px', height: '14px' }} />
              {scan.threats.length} threat{scan.threats.length !== 1 ? 's' : ''} detected
            </span>
            {expanded ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
          </button>

          {expanded && (
            <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scan.threats.map((threat, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px', borderRadius: '10px',
                  background: '#f9fafb', border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    background: config.bg, color: config.color,
                    border: `1px solid ${config.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0
                  }}>+{threat.points}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{threat.factor}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px', lineHeight: 1.4 }}>{threat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details */}
      {expanded && scan.details && (
        <div style={{ padding: '0 20px 16px', borderTop: `1px solid ${config.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingTop: '14px' }}>
            {[
              { label: 'Protocol', value: scan.details.protocol || 'N/A' },
              { label: 'Host', value: scan.details.hostname || 'N/A' },
              { label: 'SSL/TLS', value: scan.details.hasSSL ? '✅ Yes' : '❌ No' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: '10px', borderRadius: '8px',
                background: '#f9fafb', border: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#111827', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResultCard;
