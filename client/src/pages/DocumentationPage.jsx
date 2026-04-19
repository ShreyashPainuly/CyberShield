import { useState } from 'react';
import {
  ArrowLeft, Shield, Search, Globe, Lock, AlertTriangle,
  CheckCircle, XOctagon, Eye, Zap, BookOpen, ChevronRight,
  ExternalLink, BarChart3, Clock, Database, Cpu, Layers
} from 'lucide-react';

const sections = [
  {
    id: 'what-is',
    icon: Shield,
    title: 'What is CyberShield?',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    content: [
      {
        heading: 'Your Online Safety Companion',
        text: 'CyberShield is a modern, AI-powered URL threat analysis platform designed to protect you from malicious websites, phishing attacks, and online scams. It analyzes URLs in real-time using multiple threat intelligence sources and advanced heuristics.'
      },
      {
        heading: 'Who is it for?',
        text: 'Whether you\'re a security professional, a small business owner, or an everyday internet user, CyberShield provides enterprise-grade URL scanning in a simple, intuitive interface — completely free for personal use.'
      },
      {
        heading: 'Key Features',
        list: [
          'Real-time URL threat analysis with 12+ risk indicators',
          'SSL/TLS certificate verification and domain age checking',
          'Phishing pattern detection using machine learning models',
          'Personal dashboard with scan history and threat trends',
          'Privacy-first design — your data stays encrypted and private'
        ]
      }
    ]
  },
  {
    id: 'how-scanning',
    icon: Search,
    title: 'How URL Scanning Works',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    content: [
      {
        heading: 'Multi-Layer Analysis',
        text: 'When you submit a URL to CyberShield, it goes through a comprehensive multi-layer analysis pipeline that evaluates the URL against several threat intelligence sources simultaneously.'
      },
      {
        heading: 'Analysis Pipeline',
        steps: [
          { icon: Globe, label: 'Domain Analysis', desc: 'Checks domain age, registration details, and DNS records for suspicious patterns.' },
          { icon: Lock, label: 'SSL Verification', desc: 'Validates SSL/TLS certificates, checks for expired or self-signed certs.' },
          { icon: Database, label: 'Blacklist Check', desc: 'Cross-references the URL against known phishing and malware databases.' },
          { icon: Cpu, label: 'Pattern Detection', desc: 'Uses heuristics to detect URL obfuscation, suspicious redirects, and typosquatting.' },
          { icon: Eye, label: 'Content Analysis', desc: 'Inspects page content for common phishing indicators and suspicious forms.' },
          { icon: BarChart3, label: 'Risk Scoring', desc: 'Aggregates all findings into a composite risk score and risk level classification.' }
        ]
      }
    ]
  },
  {
    id: 'results',
    icon: BarChart3,
    title: 'Understanding Scan Results',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    content: [
      {
        heading: 'Risk Level Classifications',
        text: 'Every scanned URL receives one of three risk classifications based on the composite analysis of all threat indicators. Here\'s what each level means and how you should respond:'
      },
      {
        riskCards: [
          {
            level: 'Safe',
            icon: CheckCircle,
            color: '#059669',
            bg: '#ecfdf5',
            border: '#a7f3d0',
            score: '0 – 30',
            description: 'No significant threats were detected. The URL has valid SSL, a reputable domain, and no matches against known threat databases.',
            action: 'You can visit this URL with confidence. It passed all major security checks.'
          },
          {
            level: 'Suspicious',
            icon: AlertTriangle,
            color: '#d97706',
            bg: '#fffbeb',
            border: '#fde68a',
            score: '31 – 65',
            description: 'Some risk indicators were detected. This could be a new domain, missing SSL, or partial matches against threat patterns.',
            action: 'Proceed with caution. Verify the source before entering any personal information.'
          },
          {
            level: 'Dangerous',
            icon: XOctagon,
            color: '#dc2626',
            bg: '#fef2f2',
            border: '#fecaca',
            score: '66 – 100',
            description: 'High-risk URL detected. Multiple threat indicators are present, including blacklist matches, phishing patterns, or known malware distribution.',
            action: 'Do NOT visit this URL. It is highly likely to be malicious. Report it if you received it from someone.'
          }
        ]
      },
      {
        heading: 'Detailed Report Breakdown',
        text: 'Each scan result includes a detailed breakdown showing individual scores for SSL validity, domain reputation, blacklist status, and content analysis. Use this information to make informed decisions about the URLs you encounter online.'
      }
    ]
  }
];

const DocumentationPage = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('what-is');

  const currentSection = sections.find(s => s.id === activeSection);

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
          id="docs-back"
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Documentation</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Learn how to use CyberShield</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '0.75rem', color: '#9ca3af', marginBottom: '24px', paddingLeft: '48px'
      }}>
        <BookOpen style={{ width: '12px', height: '12px' }} />
        <span>Docs</span>
        <ChevronRight style={{ width: '12px', height: '12px' }} />
        <span style={{ color: '#059669', fontWeight: 600 }}>{currentSection?.title}</span>
      </div>

      {/* Section navigation cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px', marginBottom: '32px'
      }}>
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px',
                background: isActive ? section.bg : '#fff',
                border: `1.5px solid ${isActive ? section.border : '#e5e7eb'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = section.border;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: isActive ? `${section.color}15` : section.bg,
                border: `1px solid ${section.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <section.icon style={{ width: '20px', height: '20px', color: section.color }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: isActive ? section.color : '#111827',
                  marginBottom: '2px'
                }}>{section.title}</h3>
                <p style={{ fontSize: '0.6875rem', color: '#9ca3af', margin: 0 }}>
                  {section.id === 'what-is' && 'Overview & features'}
                  {section.id === 'how-scanning' && 'Analysis pipeline'}
                  {section.id === 'results' && 'Risk levels explained'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      {currentSection && (
        <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
          {/* Section title */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '24px', paddingBottom: '16px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: currentSection.bg,
              border: `1px solid ${currentSection.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <currentSection.icon style={{ width: '22px', height: '22px', color: currentSection.color }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {currentSection.title}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>
                {currentSection.id === 'what-is' && 'Everything you need to know about CyberShield'}
                {currentSection.id === 'how-scanning' && 'Understand the technology behind our URL analysis'}
                {currentSection.id === 'results' && 'How to interpret your scan results'}
              </p>
            </div>
          </div>

          {/* Content blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {currentSection.content.map((block, index) => (
              <div key={index}>
                {/* Text block */}
                {block.heading && (
                  <div className="cs-card" style={{ padding: '24px' }}>
                    <h3 style={{
                      fontSize: '1rem', fontWeight: 600, color: '#111827',
                      marginBottom: '12px',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: currentSection.color
                      }} />
                      {block.heading}
                    </h3>
                    {block.text && (
                      <p style={{
                        fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.7,
                        margin: 0
                      }}>
                        {block.text}
                      </p>
                    )}
                    {block.list && (
                      <ul style={{
                        margin: '12px 0 0', paddingLeft: '0',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                        listStyle: 'none'
                      }}>
                        {block.list.map((item, i) => (
                          <li key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5
                          }}>
                            <CheckCircle style={{
                              width: '16px', height: '16px',
                              color: '#059669', flexShrink: 0, marginTop: '2px'
                            }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Steps block */}
                {block.steps && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px'
                  }}>
                    {block.steps.map((step, i) => (
                      <div key={i} className="cs-card" style={{
                        padding: '20px',
                        transition: 'all 0.2s',
                        cursor: 'default'
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = currentSection.border;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '8px',
                            background: currentSection.bg,
                            border: `1px solid ${currentSection.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <step.icon style={{ width: '18px', height: '18px', color: currentSection.color }} />
                          </div>
                          <div style={{
                            fontSize: '0.625rem', fontWeight: 700,
                            color: currentSection.color, letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                          }}>
                            Step {i + 1}
                          </div>
                        </div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                          {step.label}
                        </h4>
                        <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk cards */}
                {block.riskCards && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {block.riskCards.map((card, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#fff',
                          border: `1.5px solid ${card.border}`,
                          borderRadius: '14px',
                          padding: '24px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = `0 6px 20px ${card.color}15`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: card.bg,
                            border: `1px solid ${card.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <card.icon style={{ width: '24px', height: '24px', color: card.color }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: card.color, marginBottom: '2px' }}>
                              {card.level}
                            </h4>
                            <span style={{
                              fontSize: '0.6875rem', fontWeight: 600,
                              background: card.bg, color: card.color,
                              padding: '2px 8px', borderRadius: '999px',
                              border: `1px solid ${card.border}`
                            }}>
                              Score: {card.score}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '12px' }}>
                          {card.description}
                        </p>
                        <div style={{
                          padding: '12px 14px', borderRadius: '8px',
                          background: card.bg,
                          border: `1px solid ${card.border}`,
                          display: 'flex', alignItems: 'flex-start', gap: '8px'
                        }}>
                          <Zap style={{ width: '14px', height: '14px', color: card.color, flexShrink: 0, marginTop: '1px' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: card.color, lineHeight: 1.4 }}>
                            {card.action}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationPage;
