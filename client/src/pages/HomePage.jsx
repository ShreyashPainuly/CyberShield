import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, ArrowRight, Activity, Zap, Lock, Eye,
  BarChart3, AlertTriangle, ShieldCheck, ShieldAlert, Search,
  ExternalLink, CheckCircle, XCircle, Bell, FileSearch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Visual Card 1: URL Scanner Dashboard ─── */
const ScannerVisualCard = () => (
  <div style={{
    background: '#fff', borderRadius: '20px', padding: '28px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #e5e7eb', maxWidth: '460px', width: '100%'
  }}>
    {/* Mini header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
      <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 500 }}>CyberShield Scanner</span>
    </div>

    {/* URL input mock */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: '#f9fafb', borderRadius: '12px', padding: '12px 14px',
      border: '1px solid #e5e7eb', marginBottom: '16px'
    }}>
      <Search style={{ width: '16px', height: '16px', color: '#059669' }} />
      <span style={{ fontSize: '0.8125rem', color: '#374151', fontFamily: 'monospace' }}>https://example-phishing.xyz</span>
      <div style={{
        marginLeft: 'auto', background: '#059669', borderRadius: '8px',
        padding: '6px 14px', fontSize: '0.6875rem', fontWeight: 700, color: '#fff'
      }}>Scan</div>
    </div>

    {/* Results rows */}
    {[
      { label: 'SSL Certificate', status: 'Valid', safe: true },
      { label: 'Domain Reputation', status: 'Suspicious', safe: false },
      { label: 'Phishing Detection', status: '2 Threats', safe: false },
    ].map((item, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {item.safe
            ? <CheckCircle style={{ width: '16px', height: '16px', color: '#059669' }} />
            : <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
          }
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151' }}>{item.label}</span>
        </div>
        <span style={{
          fontSize: '0.6875rem', fontWeight: 600,
          padding: '3px 10px', borderRadius: '999px',
          background: item.safe ? '#ecfdf5' : '#fef2f2',
          color: item.safe ? '#059669' : '#dc2626'
        }}>{item.status}</span>
      </div>
    ))}

    {/* Risk score */}
    <div style={{
      marginTop: '16px', background: '#fef2f2', borderRadius: '12px',
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px'
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: '#fff', border: '3px solid #ef4444',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.875rem', fontWeight: 800, color: '#dc2626'
      }}>78</div>
      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626' }}>High Risk Detected</div>
        <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '1px' }}>This URL is flagged as potentially dangerous</div>
      </div>
    </div>
  </div>
);

/* ─── Visual Card 2: Threat Monitoring Dashboard ─── */
const MonitoringVisualCard = () => (
  <div style={{
    background: '#fff', borderRadius: '20px', padding: '28px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #e5e7eb', maxWidth: '460px', width: '100%'
  }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity style={{ width: '18px', height: '18px', color: '#059669' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Live Threat Monitor</span>
      </div>
      <span style={{
        fontSize: '0.625rem', fontWeight: 600, padding: '3px 10px',
        borderRadius: '999px', background: '#ecfdf5', color: '#059669'
      }}>● Live</span>
    </div>

    {/* Alert items */}
    {[
      { icon: ShieldAlert, title: 'Phishing attempt blocked', time: '2 min ago', type: 'danger', domain: 'paypal-secure.xyz' },
      { icon: AlertTriangle, title: 'Suspicious redirect detected', time: '8 min ago', type: 'warning', domain: 'bit.ly/x9kf2' },
      { icon: ShieldCheck, title: 'Safe scan completed', time: '12 min ago', type: 'success', domain: 'google.com' },
      { icon: ShieldCheck, title: 'SSL verified successfully', time: '15 min ago', type: 'success', domain: 'github.com' },
    ].map((item, i) => {
      const colors = {
        danger: { bg: '#fef2f2', color: '#dc2626', iconBg: '#fef2f2' },
        warning: { bg: '#fffbeb', color: '#d97706', iconBg: '#fffbeb' },
        success: { bg: '#ecfdf5', color: '#059669', iconBg: '#ecfdf5' },
      };
      const c = colors[item.type];
      return (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px', marginBottom: '6px',
          background: i === 0 ? c.bg : 'transparent',
          border: i === 0 ? `1px solid ${c.color}20` : '1px solid transparent',
          transition: 'background 0.15s'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <item.icon style={{ width: '16px', height: '16px', color: c.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{item.title}</div>
            <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '1px' }}>{item.domain}</div>
          </div>
          <span style={{ fontSize: '0.625rem', color: '#9ca3af', flexShrink: 0 }}>{item.time}</span>
        </div>
      );
    })}

    {/* Stats row at bottom */}
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
      marginTop: '12px', paddingTop: '14px', borderTop: '1px solid #f3f4f6'
    }}>
      {[
        { label: 'Blocked', value: '142', color: '#dc2626' },
        { label: 'Warnings', value: '38', color: '#d97706' },
        { label: 'Safe', value: '1,847', color: '#059669' },
      ].map((s, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 500, marginTop: '1px' }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Visual Card 3: Protection Dashboard ─── */
const ProtectionVisualCard = () => (
  <div style={{
    background: '#fff', borderRadius: '20px', padding: '28px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #e5e7eb', maxWidth: '460px', width: '100%'
  }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: '#ecfdf5', border: '1px solid #a7f3d0',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Shield style={{ width: '18px', height: '18px', color: '#059669' }} />
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Security Overview</div>
        <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>All systems operational</div>
      </div>
      <div style={{
        marginLeft: 'auto',
        width: '48px', height: '48px', borderRadius: '50%',
        background: `conic-gradient(#059669 0deg ${0.92 * 360}deg, #e5e7eb ${0.92 * 360}deg 360deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6875rem', fontWeight: 800, color: '#059669'
        }}>92%</div>
      </div>
    </div>

    {/* Protection layers */}
    {[
      { label: 'Phishing Protection', status: 'Active', progress: 98 },
      { label: 'Malware Scanner', status: 'Active', progress: 95 },
      { label: 'SSL Verification', status: 'Active', progress: 100 },
      { label: 'Blacklist Monitor', status: 'Active', progress: 88 },
    ].map((item, i) => (
      <div key={i} style={{
        padding: '11px 0',
        borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle style={{ width: '14px', height: '14px', color: '#059669' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151' }}>{item.label}</span>
          </div>
          <span style={{
            fontSize: '0.625rem', fontWeight: 600, color: '#059669',
            background: '#ecfdf5', padding: '2px 8px', borderRadius: '999px'
          }}>{item.status}</span>
        </div>
        <div style={{
          height: '4px', borderRadius: '999px', background: '#f3f4f6', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', borderRadius: '999px',
            background: 'linear-gradient(90deg, #10b981, #059669)',
            width: `${item.progress}%`, transition: 'width 0.8s ease'
          }} />
        </div>
      </div>
    ))}

    {/* Bottom badge */}
    <div style={{
      marginTop: '14px', background: '#ecfdf5', borderRadius: '10px',
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px'
    }}>
      <ShieldCheck style={{ width: '18px', height: '18px', color: '#059669' }} />
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#059669' }}>All protection layers are fully active</span>
    </div>
  </div>
);

/* ─── How It Works Steps ─── */
const howItWorks = [
  { step: '01', title: 'Enter a URL', desc: 'Paste any URL you want to verify into the scanner.' },
  { step: '02', title: 'Analyze Threats', desc: 'Our engine checks against 12+ indicators including blacklists, SSL, and phishing patterns.' },
  { step: '03', title: 'Get Results', desc: 'Receive a detailed threat report with risk score and actionable recommendations.' },
];

/* ─────────────────────────────────────────────── */
/* ─── MAIN COMPONENT ─── */
/* ─────────────────────────────────────────────── */
const HomePage = () => {
  const { user } = useAuth();

  const sectionAnim = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', overflowX: 'hidden' }}>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        paddingTop: '96px',
        paddingBottom: '64px',
        background: 'linear-gradient(180deg, #f9fafb 0%, #ecfdf5 40%, #f9fafb 100%)'
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '25%', right: '5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 14px', borderRadius: '999px',
                background: '#ecfdf5', border: '1px solid #a7f3d0',
                fontSize: '0.75rem', fontWeight: 600, color: '#059669',
                marginBottom: '20px'
              }}>
                <Shield style={{ width: '14px', height: '14px' }} />
                <span>Advanced URL Threat Protection</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 800, color: '#111827',
                letterSpacing: '-0.03em', lineHeight: 1.08,
                marginBottom: '16px'
              }}>
                Protect Yourself<br />
                with <span style={{ color: '#059669' }}>CyberShield</span>
              </h1>
              <p style={{
                fontSize: '1.0625rem', color: '#6b7280',
                maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7
              }}>
                Advanced URL threat detection powered by multi-factor intelligence.
                Keep your organization safe from phishing, malware, and unsafe domains.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link to={user ? '/scan' : '/register'}>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#059669', color: '#fff', border: 'none',
                    borderRadius: '12px', padding: '14px 28px',
                    fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(5,150,105,0.25)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <Shield style={{ width: '18px', height: '18px' }} />
                    Start Scanning
                  </button>
                </Link>
                {!user && (
                  <Link to="/login">
                    <button style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'transparent', color: '#374151', border: '1px solid #d1d5db',
                      borderRadius: '12px', padding: '14px 24px',
                      fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
                    >
                      Sign In <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTION 1 — White BG
          Text Left + Scanner Visual Right
          ═══════════════════════════════════════════ */}
      <section style={{ background: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '80px 24px',
          display: 'flex', alignItems: 'center', gap: '64px'
        }} className="feature-section-row">
          {/* Text */}
          <motion.div {...sectionAnim} style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '999px',
              background: '#ecfdf5', border: '1px solid #a7f3d0',
              fontSize: '0.6875rem', fontWeight: 600, color: '#059669',
              marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              <FileSearch style={{ width: '13px', height: '13px' }} />
              URL Scanner
            </div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800, color: '#111827',
              letterSpacing: '-0.03em', lineHeight: 1.12,
              marginBottom: '16px'
            }}>
              Scan and Secure Every<br />
              URL <span style={{ color: '#059669' }}>Instantly.</span>
            </h2>
            <p style={{
              fontSize: '1rem', color: '#6b7280',
              lineHeight: 1.7, marginBottom: '28px', maxWidth: '420px'
            }}>
              Detect malicious links, phishing attempts, and unsafe domains in real-time.
              Our multi-layered engine analyzes SSL certificates, domain reputation, and
              blacklist databases with a single click.
            </p>
            <Link to={user ? '/scan' : '/register'}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#059669', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s, transform 0.15s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Search style={{ width: '16px', height: '16px' }} />
                Start Free Scan
              </button>
            </Link>
          </motion.div>
          {/* Visual */}
          <motion.div {...sectionAnim} transition={{ ...sectionAnim.transition, delay: 0.15 }} style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} className="feature-section-visual">
            <ScannerVisualCard />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTION 2 — Green BG
          Visual Left + Text Right (reversed)
          ═══════════════════════════════════════════ */}
      <section style={{ background: '#ecfdf5' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '80px 24px',
          display: 'flex', alignItems: 'center', gap: '64px'
        }} className="feature-section-row feature-section-reverse">
          {/* Visual (left on desktop) */}
          <motion.div {...sectionAnim} style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }} className="feature-section-visual">
            <MonitoringVisualCard />
          </motion.div>
          {/* Text (right on desktop) */}
          <motion.div {...sectionAnim} transition={{ ...sectionAnim.transition, delay: 0.15 }} style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '999px',
              background: '#fff', border: '1px solid #a7f3d0',
              fontSize: '0.6875rem', fontWeight: 600, color: '#059669',
              marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              <Activity style={{ width: '13px', height: '13px' }} />
              Threat Monitor
            </div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800, color: '#111827',
              letterSpacing: '-0.03em', lineHeight: 1.12,
              marginBottom: '16px'
            }}>
              Real-Time Threat Detection<br />
              & <span style={{ color: '#059669' }}>Monitoring.</span>
            </h2>
            <p style={{
              fontSize: '1rem', color: '#6b7280',
              lineHeight: 1.7, marginBottom: '28px', maxWidth: '420px'
            }}>
              Continuously monitor threats and get instant alerts before damage occurs.
              Our live dashboard tracks every scan, flags suspicious activity, and
              blocks dangerous URLs automatically.
            </p>
            <Link to={user ? '/dashboard' : '/register'}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#059669', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s, transform 0.15s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Bell style={{ width: '16px', height: '16px' }} />
                Enable Protection
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTION 3 — White BG
          Text Left + Protection Visual Right
          ═══════════════════════════════════════════ */}
      <section style={{ background: '#ffffff' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '80px 24px',
          display: 'flex', alignItems: 'center', gap: '64px'
        }} className="feature-section-row">
          {/* Text */}
          <motion.div {...sectionAnim} style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '999px',
              background: '#ecfdf5', border: '1px solid #a7f3d0',
              fontSize: '0.6875rem', fontWeight: 600, color: '#059669',
              marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              <Shield style={{ width: '13px', height: '13px' }} />
              Full Protection
            </div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800, color: '#111827',
              letterSpacing: '-0.03em', lineHeight: 1.12,
              marginBottom: '16px'
            }}>
              Advanced Phishing &<br />
              <span style={{ color: '#059669' }}>Malware Protection.</span>
            </h2>
            <p style={{
              fontSize: '1rem', color: '#6b7280',
              lineHeight: 1.7, marginBottom: '28px', maxWidth: '420px'
            }}>
              Block harmful attacks and safeguard users with intelligent security layers.
              Four integrated protection modules work together to deliver 92%+ threat
              coverage across all URL types.
            </p>
            <Link to={user ? '/dashboard' : '/register'}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#059669', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s, transform 0.15s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <ShieldCheck style={{ width: '16px', height: '16px' }} />
                Get Protected
              </button>
            </Link>
          </motion.div>
          {/* Visual */}
          <motion.div {...sectionAnim} transition={{ ...sectionAnim.transition, delay: 0.15 }} style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} className="feature-section-visual">
            <ProtectionVisualCard />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section style={{
        padding: '72px 24px',
        background: '#f9fafb',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '999px',
              background: '#ecfdf5', border: '1px solid #a7f3d0',
              fontSize: '0.75rem', fontWeight: 600, color: '#059669',
              marginBottom: '16px'
            }}>
              <BarChart3 style={{ width: '14px', height: '14px' }} />
              <span>How It Works</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 700, color: '#111827',
              marginBottom: '10px', letterSpacing: '-0.02em'
            }}>
              Scan in Three Simple Steps
            </h2>
            <p style={{
              fontSize: '1rem', color: '#6b7280',
              maxWidth: '480px', margin: '0 auto', lineHeight: 1.6
            }}>
              Getting started with CyberShield is quick and straightforward.
            </p>
          </div>
          <div className="how-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'
          }}>
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                style={{
                  textAlign: 'center', padding: '32px 24px',
                  borderRadius: '16px', background: '#fff',
                  border: '1px solid #e5e7eb', position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '2rem', fontWeight: 800, color: '#d1fae5',
                  letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1
                }}>{item.step}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECURITY TRUST BADGES
          ═══════════════════════════════════════════ */}
      <section style={{ padding: '56px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div className="trust-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'
        }}>
          {[
            { icon: Lock, title: 'End-to-End Encryption', desc: 'All scan data is encrypted in transit and at rest.' },
            { icon: Eye, title: 'Privacy First', desc: 'We never share your data with third parties.' },
            { icon: Shield, title: 'SOC 2 Compliant', desc: 'Enterprise-level security and compliance standards.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              padding: '20px', borderRadius: '12px',
              background: '#fff', border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#ecfdf5', border: '1px solid #a7f3d0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <item.icon style={{ width: '18px', height: '18px', color: '#059669' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      {!user && (
        <section style={{ padding: '0 24px 72px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
            borderRadius: '20px', padding: '56px 40px',
            textAlign: 'center', color: 'white',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', opacity: 0.06 }}>
              <Shield style={{ width: '250px', height: '250px' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', opacity: 0.04 }}>
              <Shield style={{ width: '200px', height: '200px' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '52px', height: '52px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Shield style={{ width: '24px', height: '24px', color: '#6ee7b7' }} />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.02em'
              }}>
                Ready to stay protected?
              </h3>
              <p style={{
                color: 'rgba(167,243,208,0.7)', fontSize: '1rem',
                maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.6
              }}>
                Create a free account and start scanning URLs with our advanced threat intelligence platform.
              </p>
              <Link to="/register">
                <button style={{
                  background: 'white', color: '#064e3b',
                  fontWeight: 700, padding: '12px 28px',
                  borderRadius: '10px', border: 'none',
                  cursor: 'pointer', fontSize: '0.9375rem',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'inherit', transition: 'transform 0.15s, box-shadow 0.15s'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #e5e7eb', background: '#fff', padding: '32px 24px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="CyberShield" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>CyberShield</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
              <span key={link} style={{ fontSize: '0.8125rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >{link}</span>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            © {new Date().getFullYear()} CyberShield. Built for safer browsing.
          </p>
        </div>
      </footer>

      {/* ═══ Responsive CSS ═══ */}
      <style>{`
        @media (max-width: 768px) {
          .feature-section-row {
            flex-direction: column !important;
            gap: 32px !important;
            padding: 48px 20px !important;
          }
          .feature-section-reverse {
            flex-direction: column-reverse !important;
          }
          .feature-section-visual {
            justify-content: center !important;
          }
          .how-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
