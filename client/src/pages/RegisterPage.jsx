import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully!');
      navigate('/scan');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const passwordChecks = [
    { label: 'At least 6 characters', met: form.password.length >= 6 },
    { label: 'Passwords match', met: form.password && form.confirmPassword && form.password === form.confirmPassword },
  ];

  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' };
  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 16px 40px'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
      >
        <div className="cs-card" style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px',
              marginBottom: '16px'
            }}>
              <img src="/logo.png" alt="CyberShield" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Create Account</h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Join CyberShield and stay protected online</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={iconStyle} />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="cs-input" placeholder="John Doe" id="register-name" />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={iconStyle} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="cs-input" placeholder="you@example.com" id="register-email" />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle} />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="cs-input" style={{ paddingRight: '40px' }}
                  placeholder="Min. 6 characters" id="register-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px', display: 'flex' }}>
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle} />
                <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="cs-input" placeholder="Repeat your password" id="register-confirm-password" />
              </div>
            </div>

            {/* Password checks */}
            {form.password && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {passwordChecks.map(({ label, met }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: met ? '#ecfdf5' : '#f3f4f6',
                      border: `1px solid ${met ? '#a7f3d0' : '#e5e7eb'}`,
                      color: met ? '#059669' : 'transparent'
                    }}>
                      <Check style={{ width: '10px', height: '10px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: met ? '#059669' : '#9ca3af' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading} className="cs-btn" id="register-button">
              {loading ? (
                <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#059669', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', color: '#9ca3af' }}>
          <Lock style={{ width: '12px', height: '12px' }} />
          <span style={{ fontSize: '0.75rem' }}>Your data is protected and never shared</span>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
