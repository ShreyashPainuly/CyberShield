import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Search, Lock, ShieldCheck, ShieldAlert, AlertOctagon,
  ExternalLink, Globe, Clock, Server, CheckCircle, XCircle,
  AlertTriangle, ChevronDown, ChevronUp, Loader2, Zap,
  FileSearch, Fingerprint, Bug, Skull, BadgeCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { scanAPI, historyAPI } from '../services/api';
import toast from 'react-hot-toast';

/* ═══ Scanning Animation Steps ═══ */
const scanSteps = [
  { text: 'Resolving domain...', icon: Globe },
  { text: 'Checking DNS records...', icon: Server },
  { text: 'Verifying SSL certificate...', icon: Lock },
  { text: 'Scanning for phishing patterns...', icon: Fingerprint },
  { text: 'Checking blacklist databases...', icon: FileSearch },
  { text: 'Analyzing threat intelligence...', icon: Shield },
  { text: 'Generating security report...', icon: Zap },
];

/* ═══ Sample Threat Scenarios ═══ */
const sampleScenarios = [
  {
    label: 'Test Safe Website',
    url: 'https://google.com',
    icon: ShieldCheck,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    desc: 'Trusted, verified domain'
  },
  {
    label: 'Test Phishing URL',
    url: 'http://paypal-secure-login.xyz/account/verify',
    icon: Fingerprint,
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    desc: 'Simulated phishing attempt'
  },
  {
    label: 'Test Suspicious Link',
    url: 'http://192.168.1.1/admin/login?redirect=http://evil.com',
    icon: AlertTriangle,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    desc: 'Internal IP / suspicious path'
  },
  {
    label: 'Test Malware Domain',
    url: 'http://malware-test.example.com/payload.exe.zip',
    icon: Bug,
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    desc: 'Known malicious pattern'
  },
];

/* ═══ Risk Meter Component ═══ */
const RiskMeter = ({ score, level }) => {
  const colors = { safe: '#059669', suspicious: '#d97706', dangerous: '#dc2626' };
  const color = colors[level] || '#9ca3af';
  const degrees = (score / 100) * 180;

  return (
    <div style={{ position: 'relative', width: '140px', height: '80px', margin: '0 auto' }}>
      {/* Background arc */}
      <svg width="140" height="80" viewBox="0 0 140 80" style={{ overflow: 'visible' }}>
        <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${(degrees / 180) * 188.5} 188.5`}
          style={{ transition: 'stroke-dasharray 1s ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color, letterSpacing: '-0.03em' }}>{score}</div>
        <div style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 500 }}>/ 100</div>
      </div>
    </div>
  );
};

/* ═══ MAIN SCAN PAGE ═══ */
const ScanPage = () => {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [recentScans, setRecentScans] = useState([]);

  // Load recent scans
  useEffect(() => {
    if (user) {
      historyAPI.getHistory({ page: 1, limit: 5 })
        .then(res => setRecentScans(res.data.scans || []))
        .catch(() => { });
    }
  }, [user, scanResult]);

  // Animate scan steps
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= scanSteps.length - 1) return prev;
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleScan = async (targetUrl) => {
    const scanUrl = targetUrl || url.trim();
    if (!scanUrl) {
      toast.error('Please enter a URL to scan');
      inputRef.current?.focus();
      return;
    }
    if (!user) {
      toast.error('Please login to scan URLs');
      return;
    }

    setScanning(true);
    setCurrentStep(0);
    setScanResult(null);
    setShowDetails(false);
    setUrl(scanUrl);

    try {
      const { data } = await scanAPI.scanUrl(scanUrl);
      // Wait for animation to finish
      await new Promise(r => setTimeout(r, Math.max(0, (scanSteps.length * 600) - 2000)));
      setScanResult(data.scan);

      if (data.scan.riskLevel === 'dangerous') {
        toast.error('⚠️ Dangerous URL detected!', { duration: 5000 });
      } else if (data.scan.riskLevel === 'suspicious') {
        toast('🟡 Suspicious URL — proceed with caution', { icon: '⚠️', duration: 4000 });
      } else {
        toast.success('✅ URL appears safe!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error scanning URL');
    }
    setScanning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleScan();
  };

  const riskConfig = {
    safe: {
      color: '#059669', bg: '#ecfdf5', border: '#a7f3d0',
      icon: ShieldCheck, label: 'Safe', tagBg: '#dcfce7'
    },
    suspicious: {
      color: '#d97706', bg: '#fffbeb', border: '#fde68a',
      icon: ShieldAlert, label: 'Suspicious', tagBg: '#fef3c7'
    },
    dangerous: {
      color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
      icon: AlertOctagon, label: 'Dangerous', tagBg: '#fee2e2'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #f9fafb 30%, #f9fafb 100%)',
      paddingTop: '72px',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* ═══════════════════════════════════
          HERO SCAN SECTION
          ═══════════════════════════════════ */}
      <section style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px 0', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '999px',
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            fontSize: '0.6875rem', fontWeight: 600, color: '#059669',
            marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            <Shield style={{ width: '13px', height: '13px' }} />
            URL Threat Scanner
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.03em', lineHeight: 1.1,
            marginBottom: '10px'
          }}>
            Analyze Any URL for <span style={{ color: '#059669' }}>Threats</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '28px' }}>
            Paste a URL below to get a comprehensive security analysis in seconds.
          </p>
        </motion.div>

        {/* ── Scan Input ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{ maxWidth: '640px', margin: '0 auto' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#ffffff',
            border: isFocused ? '2px solid #059669' : '2px solid #e5e7eb',
            borderRadius: '16px', padding: '5px',
            boxShadow: isFocused
              ? '0 0 0 4px rgba(5,150,105,0.08), 0 8px 24px rgba(0,0,0,0.06)'
              : '0 4px 16px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: '10px', paddingLeft: '16px' }}>
              <Search style={{ width: '20px', height: '20px', color: isFocused ? '#059669' : '#9ca3af', flexShrink: 0, transition: 'color 0.15s' }} />
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter URL to scan"
                disabled={scanning}
                autoComplete="off"
                id="scan-url-input"
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  outline: 'none', fontSize: '0.9375rem', color: '#111827',
                  padding: '12px 0', fontFamily: 'inherit'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={scanning || !url.trim()}
              id="scan-now-button"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: scanning ? '#047857' : '#059669',
                color: '#fff', border: 'none', borderRadius: '12px',
                padding: '12px 24px', fontSize: '0.875rem', fontWeight: 700,
                cursor: scanning || !url.trim() ? 'not-allowed' : 'pointer',
                opacity: !url.trim() && !scanning ? 0.35 : 1,
                fontFamily: 'inherit', flexShrink: 0,
                transition: 'all 0.15s'
              }}
            >
              {scanning ? (
                <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Scanning...</>
              ) : (
                <><Shield style={{ width: '16px', height: '16px' }} /> Scan Now</>
              )}
            </button>
          </div>

          {/* Scanning progress bar */}
          {scanning && (
            <div style={{ height: '3px', borderRadius: '2px', overflow: 'hidden', marginTop: '8px', background: '#e5e7eb' }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: scanSteps.length * 0.6, ease: 'linear' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '2px' }}
              />
            </div>
          )}
        </motion.form>
      </section>

      {/* ═══════════════════════════════════
          SCANNING ANIMATION
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {scanning && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 24px 0', overflow: 'hidden' }}
          >
            <div style={{
              background: '#fff', borderRadius: '16px',
              border: '1px solid #e5e7eb', padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#059669', animation: 'pulse-dot 1.5s ease-in-out infinite'
                }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>Scanning in progress</span>
                <span style={{ fontSize: '0.6875rem', color: '#9ca3af', marginLeft: 'auto' }}>{url}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scanSteps.map((step, i) => {
                  const active = i === currentStep;
                  const done = i < currentStep;
                  const StepIcon = step.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 10px', borderRadius: '8px',
                        background: active ? '#ecfdf5' : 'transparent',
                        border: active ? '1px solid #a7f3d0' : '1px solid transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      {done ? (
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0 }} />
                      ) : active ? (
                        <Loader2 style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <StepIcon style={{ width: '16px', height: '16px', color: '#d1d5db', flexShrink: 0 }} />
                      )}
                      <span style={{
                        fontSize: '0.8125rem', fontWeight: active ? 600 : 400,
                        color: done ? '#059669' : active ? '#111827' : '#9ca3af'
                      }}>{step.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          SCAN RESULT
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {scanResult && !scanning && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: '780px', margin: '0 auto', padding: '28px 24px 0' }}
          >
            {(() => {
              const rc = riskConfig[scanResult.riskLevel] || riskConfig.safe;
              const RiskIcon = rc.icon;
              const score = scanResult.riskScore ?? (scanResult.riskLevel === 'safe' ? 15 : scanResult.riskLevel === 'suspicious' ? 55 : 85);

              return (
                <div style={{
                  background: '#fff', borderRadius: '20px',
                  border: `1px solid ${rc.border}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  overflow: 'hidden'
                }}>
                  {/* Result Header */}
                  <div style={{
                    background: rc.bg, padding: '28px 28px 24px',
                    borderBottom: `1px solid ${rc.border}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
                      {/* Left: Status */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: '#fff', border: `1px solid ${rc.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <RiskIcon style={{ width: '22px', height: '22px', color: rc.color }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: rc.color, letterSpacing: '-0.02em' }}>
                              {rc.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Threat Assessment</div>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '8px 12px', background: '#fff', borderRadius: '10px',
                          border: '1px solid #e5e7eb', fontSize: '0.8125rem', color: '#374151',
                          fontFamily: 'monospace', wordBreak: 'break-all'
                        }}>
                          <ExternalLink style={{ width: '14px', height: '14px', color: '#9ca3af', flexShrink: 0 }} />
                          {scanResult.url}
                        </div>
                      </div>
                      {/* Right: Risk Meter */}
                      <div style={{ textAlign: 'center', minWidth: '160px' }}>
                        <RiskMeter score={score} level={scanResult.riskLevel} />
                        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Score</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                      {(scanResult.threats || []).length > 0 ? (
                        scanResult.threats.map((threat, i) => (
                          <span key={i} style={{
                            fontSize: '0.6875rem', fontWeight: 600,
                            padding: '4px 10px', borderRadius: '6px',
                            background: '#fef2f2', color: '#dc2626',
                            border: '1px solid #fecaca'
                          }}>
                            {typeof threat === 'string' ? threat : threat.factor || 'Unknown'}
                          </span>
                        ))
                      ) : (
                        <span style={{
                          fontSize: '0.6875rem', fontWeight: 600,
                          padding: '4px 10px', borderRadius: '6px',
                          background: '#dcfce7', color: '#059669',
                          border: '1px solid #a7f3d0'
                        }}>
                          No threats detected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1px', background: '#f3f4f6'
                  }}>
                    {(() => {
                      const d = scanResult.details || {};
                      const hasSSL = d.hasSSL ?? d.ssl?.valid ?? false;
                      const isBlacklisted = (scanResult.threats || []).some(t => (typeof t === 'string' ? t : t.factor || '').toLowerCase().includes('blacklist'));
                      const isPhishing = (scanResult.threats || []).some(t => (typeof t === 'string' ? t : t.factor || '').toLowerCase().includes('phishing'));
                      return [
                        { label: 'SSL Status', value: hasSSL ? 'Valid' : 'No HTTPS', icon: Lock, safe: hasSSL },
                        { label: 'Blacklisted', value: isBlacklisted ? 'Yes' : 'No', icon: AlertOctagon, safe: !isBlacklisted },
                        { label: 'IP Based', value: d.ipBased ? 'Yes' : 'No', icon: Globe, safe: !d.ipBased },
                        { label: 'Phishing', value: isPhishing ? 'Detected' : 'Clean', icon: Fingerprint, safe: !isPhishing },
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: '#fff', padding: '16px',
                          display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: item.safe ? '#ecfdf5' : '#fef2f2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <item.icon style={{ width: '15px', height: '15px', color: item.safe ? '#059669' : '#dc2626' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 500 }}>{item.label}</div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: item.safe ? '#059669' : '#dc2626' }}>{item.value}</div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Expandable Threat Details */}
                  <div style={{ borderTop: '1px solid #f3f4f6' }}>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '14px', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280',
                        fontFamily: 'inherit', transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                    >
                      {showDetails ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
                      {showDetails ? 'Hide' : 'View'} Full Security Report
                    </button>

                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '0 24px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {[
                                { label: 'Protocol', value: scanResult.details?.protocol || 'N/A', icon: Lock },
                                { label: 'Hostname', value: scanResult.details?.hostname || 'N/A', icon: Globe },
                                { label: 'Path', value: scanResult.details?.path || '/', icon: FileSearch },
                                { label: 'IP Based', value: scanResult.details?.ipBased ? 'Yes' : 'No', icon: Server },
                                { label: 'Redirects', value: scanResult.details?.redirectCount ? `${scanResult.details.redirectCount} redirect(s)` : 'None', icon: ExternalLink },
                                { label: 'Risk Score', value: `${scanResult.riskScore} / 100`, icon: Zap },
                              ].map((item, i) => (
                                <div key={i} style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '10px 14px', borderRadius: '10px',
                                  background: '#f9fafb', border: '1px solid #f3f4f6'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <item.icon style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                                    <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{item.label}</span>
                                  </div>
                                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })()}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          SMART SUGGESTIONS + RECENT SCANS
          ═══════════════════════════════════ */}
      {!scanning && !scanResult && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px 0' }}
        >
          {/* Sample Threat Scenarios */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '0.9375rem', fontWeight: 700, color: '#111827',
              marginBottom: '4px'
            }}>Try Sample Threat Scenarios</h3>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '16px' }}>
              Click any scenario to auto-fill and scan.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '10px' }}>
              {sampleScenarios.map((scenario, i) => (
                <button
                  key={i}
                  onClick={() => handleScan(scenario.url)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '14px', borderRadius: '12px',
                    background: '#fff', border: `1px solid ${scenario.border}`,
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = scenario.bg; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: scenario.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <scenario.icon style={{ width: '16px', height: '16px', color: scenario.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{scenario.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af', lineHeight: 1.4 }}>{scenario.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '0.9375rem', fontWeight: 700, color: '#111827',
                marginBottom: '4px'
              }}>Recent Scans</h3>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '12px' }}>
                Click to re-scan any previous URL.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recentScans.map((scan, i) => {
                  const rc = riskConfig[scan.riskLevel] || riskConfig.safe;
                  return (
                    <button
                      key={scan._id || i}
                      onClick={() => handleScan(scan.url)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '10px',
                        background: '#fff', border: '1px solid #e5e7eb',
                        cursor: 'pointer', fontFamily: 'inherit',
                        textAlign: 'left', width: '100%',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                    >
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '7px',
                        background: rc.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0
                      }}>
                        <rc.icon style={{ width: '14px', height: '14px', color: rc.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {scan.url}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.625rem', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '999px',
                        background: rc.bg, color: rc.color,
                        textTransform: 'uppercase', flexShrink: 0
                      }}>{scan.riskLevel}</span>
                      <span style={{ fontSize: '0.6875rem', color: '#9ca3af', flexShrink: 0 }}>
                        {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.section>
      )}

      {/* Scan another button when result is shown */}
      {scanResult && !scanning && (
        <div style={{ textAlign: 'center', padding: '24px 0 0' }}>
          <button
            onClick={() => { setScanResult(null); setUrl(''); inputRef.current?.focus(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '10px',
              background: '#f9fafb', border: '1px solid #e5e7eb',
              fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.color = '#059669'; e.currentTarget.style.borderColor = '#a7f3d0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            <Search style={{ width: '15px', height: '15px' }} />
            Scan Another URL
          </button>
        </div>
      )}

      {/* Bottom spacing */}
      <div style={{ height: '64px' }} />

      {/* Custom CSS */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default ScanPage;
