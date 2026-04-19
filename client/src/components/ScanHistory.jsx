import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink, Trash2, Clock } from 'lucide-react';

const riskIcons = {
  safe: { Icon: ShieldCheck, color: '#34d399', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.15)' },
  suspicious: { Icon: ShieldAlert, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.15)' },
  dangerous: { Icon: ShieldX, color: '#f87171', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.15)' }
};

const ScanHistory = ({ scans, onDelete, onSelect }) => {
  if (!scans || scans.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        borderRadius: '18px',
        background: 'rgba(19, 26, 46, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <ShieldCheck className="w-7 h-7" style={{ color: '#475569' }} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>No scans yet</h3>
        <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>Start scanning URLs to see your history here</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <AnimatePresence mode="popLayout">
        {scans.map((scan, i) => {
          const risk = riskIcons[scan.riskLevel] || riskIcons.safe;
          const { Icon } = risk;
          const date = new Date(scan.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return (
            <motion.div
              key={scan._id}
              layout
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15, scale: 0.97 }}
              transition={{ delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => onSelect?.(scan)}
              className="flex items-center gap-4 cursor-pointer"
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                background: 'rgba(19, 26, 46, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              whileHover={{
                backgroundColor: 'rgba(19, 26, 46, 0.7)',
                borderColor: risk.border
              }}
            >
              {/* Risk icon */}
              <div className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '11px',
                  background: risk.bg,
                  border: `1px solid ${risk.border}`
                }}>
                <Icon className="w-5 h-5" style={{ color: risk.color }} />
              </div>

              {/* URL & date */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#475569' }} />
                  <span className="font-medium truncate" style={{ fontSize: '0.8125rem', color: '#e2e8f0' }}>{scan.url}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ marginTop: '5px' }}>
                  <Clock className="w-3 h-3" style={{ color: '#374151' }} />
                  <span style={{ fontSize: '0.6875rem', color: '#475569' }}>{date}</span>
                </div>
              </div>

              {/* Score badge */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className="font-bold"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    background: risk.bg,
                    color: risk.color,
                    border: `1px solid ${risk.border}`,
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                  {scan.riskScore}
                </span>
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onDelete(scan._id); }}
                    className="cursor-pointer bg-transparent border-none"
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f87171';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ScanHistory;
