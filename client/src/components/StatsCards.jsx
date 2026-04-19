import { motion } from 'framer-motion';
import { Shield, Activity, AlertTriangle, Percent } from 'lucide-react';

const statConfig = [
  {
    key: 'totalScans',
    label: 'Total Scans',
    icon: Shield,
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.04))',
    border: 'rgba(99, 102, 241, 0.12)',
    color: '#818cf8',
    iconBg: 'rgba(99, 102, 241, 0.1)',
    iconBorder: 'rgba(99, 102, 241, 0.15)'
  },
  {
    key: 'safe',
    label: 'Safe URLs',
    icon: Activity,
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.04))',
    border: 'rgba(16, 185, 129, 0.12)',
    color: '#34d399',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    iconBorder: 'rgba(16, 185, 129, 0.15)'
  },
  {
    key: 'threats',
    label: 'Threats Found',
    icon: AlertTriangle,
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.04))',
    border: 'rgba(239, 68, 68, 0.12)',
    color: '#f87171',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconBorder: 'rgba(239, 68, 68, 0.15)'
  },
  {
    key: 'threatRate',
    label: 'Threat Rate',
    icon: Percent,
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(249, 115, 22, 0.04))',
    border: 'rgba(245, 158, 11, 0.12)',
    color: '#fbbf24',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconBorder: 'rgba(245, 158, 11, 0.15)'
  }
];

const StatsCards = ({ stats }) => {
  const values = {
    totalScans: stats?.totalScans || 0,
    safe: stats?.breakdown?.safe || 0,
    threats: (stats?.breakdown?.suspicious || 0) + (stats?.breakdown?.dangerous || 0),
    threatRate: `${stats?.threatRate || 0}%`
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map(({ key, label, icon: Icon, gradient, border, color, iconBg, iconBorder }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: gradient,
            border: `1px solid ${border}`,
            borderRadius: '18px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default'
          }}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          {/* Subtle corner glow */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${iconBg}, transparent)`,
            opacity: 0.5,
            pointerEvents: 'none'
          }} />

          <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              {label}
            </span>
            <div className="flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: iconBg,
                border: `1px solid ${iconBorder}`
              }}>
              <Icon style={{ width: '16px', height: '16px', color }} />
            </div>
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color,
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}>
            {values[key]}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
