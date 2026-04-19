import { useState } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, MessageSquare,
  Mail, Shield, HelpCircle, Search, BookOpen, Zap, Loader2,
  User, CheckCircle, AlertCircle, Send
} from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const faqs = [
  {
    q: 'How does CyberShield scan URLs?',
    a: 'CyberShield uses a multi-factor threat analysis engine that checks URLs against blacklists, analyzes SSL certificates, inspects domain age, detects phishing patterns, and evaluates 12+ risk indicators in real-time.'
  },
  {
    q: 'Is my scan data private?',
    a: 'Yes. All scan results are tied to your account and are not shared with third parties. Your data is encrypted in transit and at rest. You can delete your scan history at any time from the dashboard.'
  },
  {
    q: 'What do the risk levels mean?',
    a: 'Safe (green): No significant threats detected. Suspicious (yellow): Some risk indicators present — proceed with caution. Dangerous (red): High-risk URL — strongly advised not to visit.'
  },
  {
    q: 'Can I scan URLs without creating an account?',
    a: 'You need a free account to scan URLs. This allows us to save your scan history, provide personalized dashboard statistics, and maintain scan quality.'
  },
  {
    q: 'How often is the threat database updated?',
    a: 'Our threat intelligence feeds are updated continuously. Blacklists, phishing databases, and domain reputation scores are refreshed multiple times per day to ensure maximum detection accuracy.'
  },
  {
    q: 'Is there a limit to how many URLs I can scan?',
    a: 'Free accounts can perform up to 50 scans per day. If you need higher limits, contact our support team about enterprise plans with unlimited scanning.'
  },
  {
    q: 'What should I do if a URL is flagged as dangerous?',
    a: 'Do not visit the flagged URL. If you believe this is a false positive, you can contact our support team with the scan ID and we will review it manually within 24 hours.'
  }
];

const HelpPage = ({ onBack, onNavigate }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errors.email = 'Invalid email address';
    if (!contactForm.subject.trim()) errors.subject = 'Subject is required';
    if (!contactForm.message.trim()) errors.message = 'Message is required';
    else if (contactForm.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSending(true);

    try {
      await contactAPI.sendMessage({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        subject: contactForm.subject.trim(),
        message: contactForm.message.trim()
      });

      setEmailSent(true);
      toast.success('Message sent successfully! We\'ll respond within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setFormErrors({});

      // Reset success state after 5s
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send message. Please try again or email us directly.';
      toast.error(errorMsg);
    }

    setSending(false);
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: '#f9fafb',
    border: `1px solid ${formErrors[field] ? '#fecaca' : '#d1d5db'}`,
    color: '#111827',
    borderRadius: '10px',
    padding: '10px 12px 10px 40px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s'
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#f9fafb', border: '1px solid #e5e7eb',
            cursor: 'pointer', color: '#6b7280'
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Help & Support</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Find answers or reach out to our team.</p>
        </div>
      </div>

      {/* Quick links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px', marginBottom: '32px'
      }}>
        {[
          { icon: BookOpen, label: 'Documentation', desc: 'Learn how to use CyberShield', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', view: 'docs' },
          { icon: Zap, label: 'Quick Start', desc: 'Get started in 2 minutes', color: '#d97706', bg: '#fffbeb', border: '#fde68a', view: 'quickstart' },
          { icon: Shield, label: 'Security Best Practices', desc: 'Tips to stay safe online', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', view: 'security-tips' }
        ].map((item, i) => (
          <div
            key={i}
            className="cs-card"
            style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.15s' }}
            onClick={() => onNavigate && onNavigate(item.view)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.border; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: item.bg, border: `1px solid ${item.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <item.icon style={{ width: '20px', height: '20px', color: item.color }} />
            </div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{item.label}</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="help-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* FAQ section */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <HelpCircle style={{ width: '20px', height: '20px', color: '#059669' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af'
            }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cs-input"
              placeholder="Search FAQs..."
              style={{ paddingLeft: '36px' }}
              id="help-search"
            />
          </div>

          {/* FAQ items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="cs-card"
                style={{ overflow: 'hidden' }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '12px',
                    padding: '14px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  {expandedFaq === i
                    ? <ChevronUp style={{ width: '16px', height: '16px', color: '#9ca3af', flexShrink: 0 }} />
                    : <ChevronDown style={{ width: '16px', height: '16px', color: '#9ca3af', flexShrink: 0 }} />
                  }
                </button>
                {expandedFaq === i && (
                  <div style={{
                    padding: '0 16px 14px',
                    fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6,
                    borderTop: '1px solid #f3f4f6', paddingTop: '12px',
                    margin: '0 16px', marginBottom: '14px',
                    paddingLeft: '0', paddingRight: '0'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '0.875rem' }}>
                No matching FAQs found. Try a different search term.
              </div>
            )}
          </div>
        </div>

        {/* Contact form */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageSquare style={{ width: '20px', height: '20px', color: '#059669' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Contact Support
            </h2>
          </div>

          <div className="cs-card" style={{ padding: '24px' }}>
            {emailSent ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '32px 16px', textAlign: 'center',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#ecfdf5', border: '2px solid #a7f3d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <CheckCircle style={{ width: '28px', height: '28px', color: '#059669' }} />
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, maxWidth: '300px' }}>
                  Thank you for reaching out. Our support team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                {/* Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
                    color: '#374151', marginBottom: '6px'
                  }}>
                    Your Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)', width: '16px', height: '16px',
                      color: formErrors.name ? '#dc2626' : '#9ca3af'
                    }} />
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => { setContactForm({ ...contactForm, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }); }}
                      style={inputStyle('name')}
                      placeholder="John Doe"
                      id="help-name"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = formErrors.name ? '#fecaca' : '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {formErrors.name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.6875rem', color: '#dc2626' }}>
                      <AlertCircle style={{ width: '12px', height: '12px' }} /> {formErrors.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
                    color: '#374151', marginBottom: '6px'
                  }}>
                    Your Email <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)', width: '16px', height: '16px',
                      color: formErrors.email ? '#dc2626' : '#9ca3af'
                    }} />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => { setContactForm({ ...contactForm, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }); }}
                      style={inputStyle('email')}
                      placeholder="you@example.com"
                      id="help-email"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = formErrors.email ? '#fecaca' : '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {formErrors.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.6875rem', color: '#dc2626' }}>
                      <AlertCircle style={{ width: '12px', height: '12px' }} /> {formErrors.email}
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
                    color: '#374151', marginBottom: '6px'
                  }}>
                    Subject <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MessageSquare style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)', width: '16px', height: '16px',
                      color: formErrors.subject ? '#dc2626' : '#9ca3af'
                    }} />
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => { setContactForm({ ...contactForm, subject: e.target.value }); setFormErrors({ ...formErrors, subject: '' }); }}
                      style={inputStyle('subject')}
                      placeholder="What do you need help with?"
                      id="help-subject"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = formErrors.subject ? '#fecaca' : '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {formErrors.subject && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.6875rem', color: '#dc2626' }}>
                      <AlertCircle style={{ width: '12px', height: '12px' }} /> {formErrors.subject}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
                    color: '#374151', marginBottom: '6px'
                  }}>
                    Message <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => { setContactForm({ ...contactForm, message: e.target.value }); setFormErrors({ ...formErrors, message: '' }); }}
                    placeholder="Describe your issue in detail..."
                    rows={5}
                    id="help-message"
                    style={{
                      width: '100%', background: '#f9fafb',
                      border: `1px solid ${formErrors.message ? '#fecaca' : '#d1d5db'}`, color: '#111827',
                      borderRadius: '10px', padding: '12px',
                      fontSize: '0.875rem', fontFamily: 'inherit',
                      lineHeight: 1.6, outline: 'none', resize: 'vertical',
                      transition: 'border-color 0.15s, box-shadow 0.15s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#059669';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = formErrors.message ? '#fecaca' : '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {formErrors.message ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.6875rem', color: '#dc2626' }}>
                      <AlertCircle style={{ width: '12px', height: '12px' }} /> {formErrors.message}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '4px', textAlign: 'right' }}>
                      {contactForm.message.length} characters
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="cs-btn"
                  style={{ width: 'auto', padding: '10px 24px' }}
                  id="help-send"
                >
                  {sending ? (
                    <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Sending...</>
                  ) : (
                    <><Send style={{ width: '16px', height: '16px' }} /> Send Message</>
                  )}
                </button>
              </form>
            )}

            <div style={{
              marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Mail style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Or email us directly at{' '}
                <a
                  href="mailto:supportcybershield@gmail.com"
                  style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}
                >
                  supportcybershield@gmail.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive override for help grid */}
      <style>{`
        @media (max-width: 768px) {
          .help-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default HelpPage;
