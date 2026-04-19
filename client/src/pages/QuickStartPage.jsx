import {
  ArrowLeft, UserPlus, Link2, MousePointerClick, BarChart3,
  CheckCircle, ArrowRight, Shield, Zap, BookOpen, ChevronRight
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up for a free CyberShield account. It takes less than 30 seconds — just provide your name, email, and a strong password.',
    details: [
      'Click "Get Started" on the homepage or navigate to the registration page',
      'Enter your full name, email address, and a secure password (min. 6 characters)',
      'Click "Create Account" to complete registration',
      'You\'ll be automatically logged in and redirected to the scanner'
    ],
    tip: 'Use a strong, unique password. We recommend at least 8 characters with a mix of letters, numbers, and symbols.',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0'
  },
  {
    number: '02',
    icon: Link2,
    title: 'Enter a URL to Scan',
    description: 'Navigate to the Scan page and paste any URL you want to check. CyberShield accepts any valid web address — including shortened URLs and deep links.',
    details: [
      'Go to the "Scan" page from the navigation menu',
      'Paste or type the URL you want to analyze in the input field',
      'Make sure the URL starts with http:// or https://',
      'CyberShield will auto-format the URL if needed'
    ],
    tip: 'You can scan any URL — website links, shortened URLs (bit.ly), email links, or even suspicious links from messages.',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe'
  },
  {
    number: '03',
    icon: MousePointerClick,
    title: 'Click "Scan Now"',
    description: 'Hit the scan button and let CyberShield do the heavy lifting. Our engine analyzes the URL across 12+ security checks in seconds.',
    details: [
      'Click the "Scan Now" button to start the analysis',
      'CyberShield runs multi-layer checks: SSL, domain, blacklists, phishing, and more',
      'Analysis typically completes in 2–5 seconds',
      'A real-time progress indicator shows the scan status'
    ],
    tip: 'Each scan checks against 12+ risk indicators simultaneously for the most comprehensive analysis possible.',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a'
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'View Your Results',
    description: 'Get an instant, detailed report. See the risk level (Safe, Suspicious, or Dangerous), risk score, and a full breakdown of all security checks.',
    details: [
      'See the overall risk level and risk score immediately',
      'Review individual check results: SSL, domain age, blacklist, phishing detection',
      'Get actionable recommendations based on the analysis',
      'All scans are saved to your Dashboard for future reference'
    ],
    tip: 'Check your Dashboard regularly to see scan trends and identify patterns in the URLs you encounter.',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca'
  }
];

const QuickStartPage = ({ onBack }) => {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#f9fafb', border: '1px solid #e5e7eb',
            cursor: 'pointer', color: '#6b7280', transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#a7f3d0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          id="quickstart-back"
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Quick Start Guide</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Get started in 2 minutes</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '0.75rem', color: '#9ca3af', marginBottom: '28px', paddingLeft: '48px'
      }}>
        <Zap style={{ width: '12px', height: '12px' }} />
        <span>Quick Start</span>
        <ChevronRight style={{ width: '12px', height: '12px' }} />
        <span style={{ color: '#d97706', fontWeight: 600 }}>4 Steps to Safety</span>
      </div>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46, #064e3b)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '120px', height: '120px',
          borderRadius: '50%',
          background: 'rgba(167, 243, 208, 0.08)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '40%',
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: 'rgba(167, 243, 208, 0.05)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(167, 243, 208, 0.15)',
            color: '#a7f3d0', fontSize: '0.6875rem', fontWeight: 600,
            marginBottom: '16px', letterSpacing: '0.03em'
          }}>
            <Zap style={{ width: '12px', height: '12px' }} />
            QUICK START GUIDE
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Start Protecting Yourself in 4 Simple Steps
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#a7f3d0', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
            CyberShield makes URL threat analysis simple. Follow these four steps to start scanning URLs and protecting yourself from online threats right away.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = step.border;
              e.currentTarget.style.boxShadow = `0 4px 20px ${step.color}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Step header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '24px 24px 0'
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: step.bg,
                border: `1.5px solid ${step.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, position: 'relative'
              }}>
                <step.icon style={{ width: '24px', height: '24px', color: step.color }} />
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  fontSize: '0.5625rem', fontWeight: 800,
                  background: step.color, color: '#fff',
                  padding: '1px 6px', borderRadius: '999px',
                  lineHeight: '16px', letterSpacing: '0.02em'
                }}>
                  {step.number}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            </div>

            {/* Step details */}
            <div style={{ padding: '20px 24px 24px' }}>
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '16px 18px',
                marginBottom: '14px'
              }}>
                <ul style={{
                  margin: 0, padding: 0, listStyle: 'none',
                  display: 'flex', flexDirection: 'column', gap: '10px'
                }}>
                  {step.details.map((detail, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5
                    }}>
                      <CheckCircle style={{
                        width: '14px', height: '14px',
                        color: step.color, flexShrink: 0, marginTop: '2px'
                      }} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tip */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 14px', borderRadius: '8px',
                background: step.bg,
                border: `1px solid ${step.border}`
              }}>
                <Shield style={{ width: '14px', height: '14px', color: step.color, flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '0.75rem', color: step.color, fontWeight: 500, lineHeight: 1.5 }}>
                  <strong>Pro Tip:</strong> {step.tip}
                </span>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center',
                position: 'relative', marginTop: '-12px', marginBottom: '-12px',
                zIndex: 1
              }}>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{
        textAlign: 'center', padding: '40px 0 10px'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 14px', borderRadius: '999px',
          background: '#ecfdf5', border: '1px solid #a7f3d0',
          color: '#059669', fontSize: '0.75rem', fontWeight: 600
        }}>
          <CheckCircle style={{ width: '14px', height: '14px' }} />
          That's it! You're ready to start scanning URLs.
        </div>
      </div>
    </div>
  );
};

export default QuickStartPage;
