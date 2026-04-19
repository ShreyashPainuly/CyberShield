import {
  ArrowLeft, Shield, Lock, Eye, Key, Link2, AlertTriangle,
  Mail, Wifi, Download, Smartphone, ChevronRight, ExternalLink,
  CheckCircle, XCircle, BookOpen
} from 'lucide-react';

const tips = [
  {
    icon: Link2,
    title: 'Avoid Phishing Links',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    description: 'Phishing links disguise malicious websites as trusted ones to steal your credentials. Always verify URLs before clicking.',
    doList: [
      'Hover over links to preview the actual URL before clicking',
      'Check for misspellings in domain names (e.g., g00gle.com)',
      'Use CyberShield to scan any suspicious links',
      'Verify emails from banks or services by contacting them directly'
    ],
    dontList: [
      'Click links in unsolicited emails or messages',
      'Trust shortened URLs from unknown sources',
      'Enter credentials on unfamiliar websites',
      'Ignore browser security warnings'
    ]
  },
  {
    icon: Lock,
    title: 'Always Check for HTTPS',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    description: 'HTTPS encrypts data between your browser and the website, preventing eavesdropping. Never enter sensitive data on non-HTTPS sites.',
    doList: [
      'Look for the padlock icon in the browser address bar',
      'Verify the URL starts with https:// (not just http://)',
      'Check that the SSL certificate is valid and not expired',
      'Use CyberShield\'s SSL check feature for detailed certificate analysis'
    ],
    dontList: [
      'Enter passwords or credit card details on HTTP sites',
      'Ignore "Not Secure" warnings from your browser',
      'Assume HTTPS alone means a site is trustworthy',
      'Skip verifying the certificate when prompted'
    ]
  },
  {
    icon: Key,
    title: 'Use Strong Passwords',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    description: 'Weak passwords are the #1 cause of account breaches. Use unique, complex passwords for every account you create.',
    doList: [
      'Use at least 12 characters mixing uppercase, lowercase, numbers, and symbols',
      'Use a reputable password manager (e.g., Bitwarden, 1Password)',
      'Enable two-factor authentication (2FA) wherever available',
      'Create unique passwords for every account'
    ],
    dontList: [
      'Reuse passwords across multiple sites',
      'Use easily guessable passwords (123456, password, birthday)',
      'Share passwords via email or chat messages',
      'Write passwords on sticky notes or plain text files'
    ]
  },
  {
    icon: Eye,
    title: 'Protect Your Personal Data',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'Your personal information is a prime target for cybercriminals. Be mindful of what you share online and with whom.',
    doList: [
      'Limit personal information shared on social media profiles',
      'Review privacy settings on all your online accounts',
      'Be cautious with online quizzes that ask personal questions',
      'Regularly check if your data has appeared in breaches'
    ],
    dontList: [
      'Share your SSN, credit card, or ID numbers via email',
      'Post personal identifiers publicly online',
      'Give out personal info to unsolicited callers or emailers',
      'Use real answers for security questions others could guess'
    ]
  },
  {
    icon: Wifi,
    title: 'Stay Safe on Public Wi-Fi',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'Public Wi-Fi networks are prime hunting grounds for hackers. Use extra caution when connecting to free wireless networks.',
    doList: [
      'Use a VPN when connecting to public Wi-Fi networks',
      'Verify the official network name with the establishment',
      'Turn off automatic Wi-Fi connection on your devices',
      'Use mobile data for sensitive activities like banking'
    ],
    dontList: [
      'Access banking or financial sites on public Wi-Fi without VPN',
      'Connect to open Wi-Fi networks without verification',
      'Enable file sharing while on public networks',
      'Leave Wi-Fi and Bluetooth on when not in use'
    ]
  },
  {
    icon: Download,
    title: 'Be Careful with Downloads',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    description: 'Malicious downloads remain one of the most common attack vectors. Only download files from verified, trusted sources.',
    doList: [
      'Only download software from official websites and app stores',
      'Scan downloaded files with antivirus before opening',
      'Verify file extensions match the expected type (.exe vs .pdf)',
      'Keep your operating system and software up to date'
    ],
    dontList: [
      'Download attachments from unknown email senders',
      'Install software from pop-up advertisements',
      'Disable your antivirus to install "certain" software',
      'Open executable files (.exe, .bat) from untrusted sources'
    ]
  }
];

const SecurityTipsPage = ({ onBack }) => {
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
          id="security-tips-back"
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Security Best Practices</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Tips to stay safe online</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '0.75rem', color: '#9ca3af', marginBottom: '28px', paddingLeft: '48px'
      }}>
        <Shield style={{ width: '12px', height: '12px' }} />
        <span>Security</span>
        <ChevronRight style={{ width: '12px', height: '12px' }} />
        <span style={{ color: '#6366f1', fontWeight: 600 }}>Best Practices</span>
      </div>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #312e81, #4338ca)',
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
          background: 'rgba(199, 210, 254, 0.08)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '30%',
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: 'rgba(199, 210, 254, 0.05)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(199, 210, 254, 0.15)',
            color: '#c7d2fe', fontSize: '0.6875rem', fontWeight: 600,
            marginBottom: '16px', letterSpacing: '0.03em'
          }}>
            <Shield style={{ width: '12px', height: '12px' }} />
            SECURITY BEST PRACTICES
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Essential Tips to Stay Safe Online
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#c7d2fe', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
            Cybersecurity starts with good habits. Follow these expert-recommended practices to significantly reduce your risk of falling victim to online threats.
          </p>
        </div>
      </div>

      {/* Quick stats banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px', marginBottom: '28px'
      }}>
        {[
          { value: '3.4B', label: 'Phishing emails sent daily', color: '#dc2626' },
          { value: '81%', label: 'Breaches use weak passwords', color: '#d97706' },
          { value: '60%', label: 'Attacks target small businesses', color: '#6366f1' },
          { value: '$4.45M', label: 'Avg. data breach cost (2023)', color: '#059669' }
        ].map((stat, i) => (
          <div key={i} className="cs-card" style={{
            padding: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.02em' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '2px', lineHeight: 1.3 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Security tip cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tips.map((tip, index) => (
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
              e.currentTarget.style.borderColor = tip.border;
              e.currentTarget.style.boxShadow = `0 4px 20px ${tip.color}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Card header */}
            <div style={{ padding: '24px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: tip.bg,
                  border: `1.5px solid ${tip.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <tip.icon style={{ width: '22px', height: '22px', color: tip.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                    {tip.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Do / Don't columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '16px 24px 24px'
            }} className="security-do-dont-grid">
              {/* Do column */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginBottom: '12px'
                }}>
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Do
                  </span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tip.doList.map((item, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '0.75rem', color: '#065f46', lineHeight: 1.4
                    }}>
                      <CheckCircle style={{ width: '12px', height: '12px', color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don't column */}
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginBottom: '12px'
                }}>
                  <XCircle style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Don't
                  </span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tip.dontList.map((item, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '0.75rem', color: '#7f1d1d', lineHeight: 1.4
                    }}>
                      <XCircle style={{ width: '12px', height: '12px', color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{
        textAlign: 'center', padding: '40px 0 10px'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 16px', borderRadius: '999px',
          background: '#eef2ff', border: '1px solid #c7d2fe',
          color: '#6366f1', fontSize: '0.75rem', fontWeight: 600
        }}>
          <Shield style={{ width: '14px', height: '14px' }} />
          Stay vigilant. Stay secure. Use CyberShield.
        </div>
      </div>

      {/* Responsive CSS for Do/Don't grid */}
      <style>{`
        @media (max-width: 640px) {
          .security-do-dont-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default SecurityTipsPage;
